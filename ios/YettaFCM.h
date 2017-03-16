//
//  YettaFCM.h
//  pingstersApp
//
//  Created by Youngchan Je on 3/15/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#ifndef YettaFCM_h
#define YettaFCM_h

#import <UIKit/UIKit.h>

#import <FirebaseCore/FIRApp.h>

#import <React/RCTBridgeModule.h>

@import Firebase;
@import FirebaseInstanceID;
@import FirebaseMessaging;

@import UserNotifications;

@interface YettaFCM : NSObject <RCTBridgeModule>

typedef void (^RCTNotificationResponseCallback)();

+ (void)didReceiveRemoteNotification:(nonnull NSDictionary *)userInfo fetchCompletionHandler:(nullable void (^)(UIBackgroundFetchResult))completionHandler;
+ (void)didReceiveLocalNotification:(nonnull UILocalNotification *)notification;

// Handle notification messages after display notification is tapped by the user.
+ (void)didReceiveNotificationResponse:(nonnull UNNotificationResponse *)response withCompletionHandler:(nonnull RCTNotificationResponseCallback)completionHandler;

// Handle incoming notification messages on iOS 10 devices while app is in the foreground.
+ (void)willPresentNotification:(nonnull UNNotification *)notification withCompletionHandler:(nullable void (^)(UNNotificationPresentationOptions))completionHandler;

// Receive data message on iOS 10 devices while app is in the foreground.
+ (void)applicationReceivedRemoteMessage:(nullable FIRMessagingRemoteMessage *)remoteMessage;

// [refresh_token]
+ (void)tokenRefreshNotification:(nullable NSNotification *)notification;

// [connect_on_active]
+ (void)applicationDidBecomeActive:(nullable UIApplication *)application;

// [disconnect_from_fcm]
+ (void)applicationDidEnterBackground:(nullable UIApplication *)application;

@end

#endif /* YettaFCM_h */
