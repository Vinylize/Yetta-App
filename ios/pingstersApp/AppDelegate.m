/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "AppDelegate.h"

#import "RCTBundleURLProvider.h"
#import "RCTRootView.h"
#import "RCTPushNotificationManager.h"

#import "YettaFCM.h"
#import "YettaLocationService.h"

#if defined(__IPHONE_10_0) && __IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_10_0
@import UserNotifications;
#endif

@import GoogleMaps;
@import Firebase;
@import FirebaseInstanceID;
@import FirebaseMessaging;

// Implement UNUserNotificationCenterDelegate to receive display notification via APNS for devices
// running iOS 10 and above. Implement FIRMessagingDelegate to receive data message via FCM for
// devices running iOS 10 and above.
#if defined(__IPHONE_10_0) && __IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_10_0
@interface AppDelegate () <UNUserNotificationCenterDelegate, FIRMessagingDelegate> {
  YettaLocationService * _yettaLocationService;
}
@end
#endif

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  NSURL *jsCodeLocation;
  
  [GMSServices provideAPIKey:@""];

  // Create a Mutable Dictionary to hold the appProperties to pass to React Native.
  NSMutableDictionary *appProperties = [NSMutableDictionary dictionary];
  
  if (launchOptions != nil) {
    // get notification used to launch application.
    NSDictionary *notification = [launchOptions objectForKey:UIApplicationLaunchOptionsRemoteNotificationKey];
    
    if (notification) {
      [appProperties setObject:notification forKey:@"initialNotification"];
    }
  }

#ifdef DEBUG
  jsCodeLocation = [NSURL URLWithString:@"http://127.0.0.1:8081/index.ios.bundle?platform=ios&dev=true"];
#else
  jsCodeLocation = [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif

  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"pingstersApp"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];
  rootView.appProperties = appProperties;
  
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  
  [YettaFCM requestPermissions];
  [FIRApp configure];
  
  [[UNUserNotificationCenter currentNotificationCenter] setDelegate:self];
  
  [self addLocationServiceObservers];
  
#ifdef DEBUG
  // register the app for local notifications.
  if ([application respondsToSelector:@selector(registerUserNotificationSettings:)])
    [application registerUserNotificationSettings:[UIUserNotificationSettings settingsForTypes:UIUserNotificationTypeAlert | UIUserNotificationTypeBadge | UIUserNotificationTypeSound categories:nil]];
  
  // setup the local notification check.
  UILocalNotification *notification = [launchOptions objectForKey:UIApplicationLaunchOptionsLocalNotificationKey];
  
  // check if a local notification has been received.
  if (notification) {
    dispatch_async(dispatch_get_main_queue(), ^{
      [self alertForDebugging:@"got local message!" body:notification.userInfo];
    });
  }
#endif
  
  // ensure the notification badge number is hidden.
  application.applicationIconBadgeNumber = 0;
  
  return YES;
}

- (void)addLocationServiceObservers
{
  [[NSNotificationCenter defaultCenter] addObserver:self
                                           selector:@selector(startLocationService)
                                               name:@"startLocationService"
                                             object:nil];
  [[NSNotificationCenter defaultCenter] addObserver:self
                                           selector:@selector(stopLocationService)
                                               name:@"stopLocationService"
                                             object:nil];
}

- (void)startLocationService
{
  _yettaLocationService = [[YettaLocationService alloc] init];
  [_yettaLocationService startLocationService];
  NSLog(@"start location service");
}

- (void)stopLocationService
{
  [_yettaLocationService stopLocationService];
  NSLog(@"stop location service");
}

- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo
fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler {
  [YettaFCM didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
  [RCTPushNotificationManager didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
  
  #ifdef DEBUG
  [self alertForDebugging:@"didReceiveRemoteNotification" body:userInfo];
  #endif
}

- (void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification {
#ifdef DEBUG
  [self alertForDebugging:@"local notification" body:notification.userInfo];
#endif
  [RCTPushNotificationManager didReceiveLocalNotification:notification];
}

// [START ios_10_message_handling]
#if defined(__IPHONE_10_0) && __IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_10_0
- (void)userNotificationCenter:(UNUserNotificationCenter *)center
       willPresentNotification:(UNNotification *)notification
         withCompletionHandler:(void (^)(UNNotificationPresentationOptions))completionHandler {
  [YettaFCM willPresentNotification:notification withCompletionHandler:completionHandler];
  
  #ifdef DEBUG
  [self alertForDebugging:@"willPresentNotification" body:notification.request.content.userInfo];
  #endif
}

- (void)userNotificationCenter:(UNUserNotificationCenter *)center
didReceiveNotificationResponse:(UNNotificationResponse *)response
         withCompletionHandler:(void (^)())completionHandler {
  [RCTPushNotificationManager didReceiveRemoteNotification:response.notification.request.content.userInfo fetchCompletionHandler:completionHandler];
  [YettaFCM didReceiveNotificationResponse:response withCompletionHandler:completionHandler];
  
  #ifdef DEBUG
  [self alertForDebugging:@"didReceiveNotificationResponse" body:response.notification.request.content.userInfo];
  #endif
}
#endif
// [END ios_10_message_handling]


#if defined(__IPHONE_10_0) && __IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_10_0
- (void)applicationReceivedRemoteMessage:(FIRMessagingRemoteMessage *)remoteMessage {
  [YettaFCM applicationReceivedRemoteMessage:remoteMessage];
  
  #ifdef DEBUG
  [self alertForDebugging:@"applicationReceivedRemoteMessage" body:remoteMessage.appData];
  #endif
}
#endif

- (void)tokenRefreshNotification:(NSNotification *)notification {
  [YettaFCM tokenRefreshNotification:notification];
}

- (void)applicationDidBecomeActive:(UIApplication *)application {
  [YettaFCM applicationDidBecomeActive:application];
}

- (void)applicationDidEnterBackground:(UIApplication *)application {
  [YettaFCM applicationDidEnterBackground:application];
}

- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error {
  NSLog(@"Unable to register for remote notifications: %@", error);
  
  [RCTPushNotificationManager didFailToRegisterForRemoteNotificationsWithError:error];
}

// This function is added here only for debugging purposes, and can be removed if swizzling is enabled.
// If swizzling is disabled then this function must be implemented so that the APNs token can be paired to
// the InstanceID token.
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
  NSLog(@"APNs token retrieved: %@", deviceToken);
  NSString *refreshedToken = [[FIRInstanceID instanceID] token];
  NSLog(@"InstanceID token in requesting permission: %@", refreshedToken);
  // With swizzling disabled you must set the APNs token here.
  [[FIRInstanceID instanceID] setAPNSToken:deviceToken type:FIRInstanceIDAPNSTokenTypeSandbox];
  
  [RCTPushNotificationManager didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
}

- (void)application:(UIApplication *)application didRegisterUserNotificationSettings:(nonnull UIUserNotificationSettings *)notificationSettings {
  [RCTPushNotificationManager didRegisterUserNotificationSettings:notificationSettings];
}

#ifdef DEBUG
// alert messages for debugging when xcode or chrome debugger are not being helpful
- (void)alertForDebugging:(NSString *)title body:(NSDictionary *)body {
  NSError * err;
  UIAlertController *alertvc = [UIAlertController alertControllerWithTitle:title message:[[NSString alloc] initWithData:[NSJSONSerialization dataWithJSONObject:body options:0 error:&err] encoding:NSUTF8StringEncoding] preferredStyle:UIAlertControllerStyleAlert];
  UIAlertAction *actionOk = [UIAlertAction actionWithTitle:@"OK" style:UIAlertActionStyleDefault handler:^(UIAlertAction * _Nonnull action) {
    
  }];
  [alertvc addAction:actionOk];
  
  UIViewController *vc = self.window.rootViewController;
  [vc presentViewController:alertvc animated:YES completion:nil];
}
#endif
@end
