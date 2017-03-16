//
//  YettaFCM.m
//  pingstersApp
//
//  Created by Youngchan Je on 3/15/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

//
//  Copyright (c) 2016 Google Inc.
//
//  Licensed under the Apache License, Version 2.0 (the "License");
//  you may not use this file except in compliance with the License.
//  You may obtain a copy of the License at
//
//  http://www.apache.org/licenses/LICENSE-2.0
//
//  Unless required by applicable law or agreed to in writing, software
//  distributed under the License is distributed on an "AS IS" BASIS,
//  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  See the License for the specific language governing permissions and
//  limitations under the License.
//
//  from https://github.com/firebase/quickstart-ios/blob/master/messaging/MessagingExample/AppDelegate.m
//

#import <Foundation/Foundation.h>

#import "YettaFCM.h"

#import <React/RCTEventDispatcher.h>

#import <FirebaseMessaging/FirebaseMessaging.h>
#import <FirebaseInstanceID/FirebaseInstanceID.h>

@import UserNotifications;

@interface YettaFCM ()

@end

@implementation YettaFCM

RCT_EXPORT_MODULE();

NSString *const kGCMMessageIDKey = @"gcm.message_id";

+ (void)didReceiveRemoteNotification:(nonnull NSDictionary *)userInfo fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler
{
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

+ (void)didReceiveLocalNotification:(nonnull UILocalNotification *)notification
{
  
}

+ (void)applicationReceivedRemoteMessage:(FIRMessagingRemoteMessage *)remoteMessage
{
  // Print full message
  NSLog(@"%@", remoteMessage.appData);
}

+ (void)tokenRefreshNotification:(nullable NSNotification *)notification
{
  NSString *refreshedToken = [[FIRInstanceID instanceID] token];
  NSLog(@"InstanceID token: %@", refreshedToken);
  
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
    NSLog(@"Message ID: %@", userInfo[kGCMMessageIDKey]);
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
    NSLog(@"Message ID: %@", userInfo[kGCMMessageIDKey]);
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

@end
