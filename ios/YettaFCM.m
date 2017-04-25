//
//  YettaFCM.m
//  pingstersApp
//
//  Created by Youngchan Je on 3/15/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

#import "YettaFCM.h"

#import <FirebaseMessaging/FirebaseMessaging.h>
#import <FirebaseInstanceID/FirebaseInstanceID.h>

@import UserNotifications;

// Copied from Apple's header in case it is missing in some cases (e.g. pre-Xcode 8 builds).
#ifndef NSFoundationVersionNumber_iOS_9_x_Max
#define NSFoundationVersionNumber_iOS_9_x_Max 1299
#endif

@interface YettaFCM ()

@end

@implementation YettaFCM

 RCT_EXPORT_MODULE();

NSString *const kGCMMessageIDKey = @"gcm.message_id";

- (NSArray<NSString *> *)supportedEvents
{
  return @[@"FCMNotificationReceived"];
}

+ (void)requestPermissions
{
  if (floor(NSFoundationVersionNumber) <= NSFoundationVersionNumber_iOS_9_x_Max) {
    UIUserNotificationType allNotificationTypes =
    (UIUserNotificationTypeSound | UIUserNotificationTypeAlert | UIUserNotificationTypeBadge);
    UIUserNotificationSettings *settings =
    [UIUserNotificationSettings settingsForTypes:allNotificationTypes categories:nil];
    [[UIApplication sharedApplication] registerUserNotificationSettings:settings];
  } else {
    // iOS 10 or later
    #if defined(__IPHONE_10_0) && __IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_10_0
    // For iOS 10 display notification (sent via APNS)
    [UNUserNotificationCenter currentNotificationCenter].delegate = self;
    UNAuthorizationOptions authOptions =
    UNAuthorizationOptionAlert
    | UNAuthorizationOptionSound
    | UNAuthorizationOptionBadge;
    [[UNUserNotificationCenter currentNotificationCenter] requestAuthorizationWithOptions:authOptions completionHandler:^(BOOL granted, NSError * _Nullable error) {
      if (granted == true) {
        NSLog(@"granted");
      } else {
        NSLog(@"not granted");
        // TODO: IMPLEMENT WHAT TO DO WHEN PERMISSION REQUEST DENIED
      }
      NSLog(@"%@", error);
    }];
    
    // For iOS 10 data message (sent via FCM)
    [FIRMessaging messaging].remoteMessageDelegate = self;
    #endif
  }
  
  [[UIApplication sharedApplication] registerForRemoteNotifications];
}

+ (void)didReceiveRemoteNotification:(nonnull NSDictionary *)userInfo fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler
{
  NSLog(@"did receive remote notification");
  // If you are receiving a notification message while your app is in the background,
  // this callback will not be fired till the user taps on the notification launching the application.
  // TODO: Handle data of notification
  
  // Print message ID.
  if (userInfo[kGCMMessageIDKey]) {
    NSLog(@"Message ID: %@", userInfo[kGCMMessageIDKey]);
  }
  
  // Print full message.
  NSLog(@"%@", userInfo);
  
  completionHandler(UIBackgroundFetchResultNewData);
}

+ (void)applicationReceivedRemoteMessage:(nullable FIRMessagingRemoteMessage *)remoteMessage
{
  // Print full message
  NSLog(@"application received remote message: %@", remoteMessage.appData);
}

+ (void)tokenRefreshNotification:(nullable NSNotification *)notification
{
  NSString *refreshedToken = [[FIRInstanceID instanceID] token];
  NSLog(@"Refreshed InstanceID token: %@", refreshedToken);
  
  // Connect to FCM since connection may have failed when attempted before having a token.
  [self connectToFcm];
  
  // TODO: send token to application server.
}

+ (void)connectToFcm
{
  // Won't connect since there is no token
  if (![[FIRInstanceID instanceID] token]) {
    NSLog(@"no token!");
    return;
  }
  
  // Disconnect previous FCM connection if it exists.
  [[FIRMessaging messaging] disconnect];
  
  [[FIRMessaging messaging] connectWithCompletion:^(NSError * _Nullable error) {
    if (error != nil) {
      NSLog(@"Unable to connect to FCM. %@", error);
    } else {
      NSLog(@"Connected to FCM.");
    }
  }];
}

+ (void)willPresentNotification:(nonnull UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions))completionHandler
{
  // Print message ID.
  NSDictionary *userInfo = notification.request.content.userInfo;
  if (userInfo[kGCMMessageIDKey]) {
    NSLog(@"will present notification: Message ID: %@", userInfo[kGCMMessageIDKey]);
  }
  
  // Print full message.
  NSLog(@"%@", userInfo);
  
  // Change this to your preferred presentation option
  completionHandler(UNNotificationPresentationOptionNone);
}

+ (void)didReceiveNotificationResponse:(nonnull UNNotificationResponse *)response withCompletionHandler:(nonnull RCTNotificationResponseCallback)completionHandler
{
  NSDictionary *userInfo = response.notification.request.content.userInfo;
  if (userInfo[kGCMMessageIDKey]) {
    NSLog(@"did receive notification response, Message ID: %@", userInfo[kGCMMessageIDKey]);
  }
  
  // Print full message.
  NSLog(@"%@", userInfo);
  
  completionHandler();
}

+ (void)applicationDidBecomeActive:(nullable UIApplication *)application
{
  [self connectToFcm];
}

+ (void)applicationDidEnterBackground:(nullable UIApplication *)application
{
  [[FIRMessaging messaging] disconnect];
  NSLog(@"Disconnected from FCM");
}

+ (NSString *)getFCMToken
{
  NSString *token = [[FIRInstanceID instanceID] token];
  return token;
}

@end
