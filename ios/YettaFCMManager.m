//
//  YettaFCMManager.m
//  pingstersApp
//
//  Created by Youngchan Je on 4/25/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "YettaFCMManager.h"
#import <React/RCTBridge.h>
#import <React/RCTEventDispatcher.h>

@interface YettaFCMManager ()

@end

@implementation YettaFCMManager
{
  
}

RCT_EXPORT_MODULE();

- (NSArray<NSString *> *)supportedEvents
{
  return @[];
}

// RCTResponseSenderBlock accepts only one argument - an array of parameters to pass to the JavaScript callback.
// In this case we use Node's convention to make the first parameter an error object (usually null when there is
// no error) and the rest are the results of the function.
RCT_EXPORT_METHOD(getToken:(RCTResponseSenderBlock)callback)
{
  NSString * FCMToken = [YettaFCM getFCMToken];
  NSLog(@"sending FCM token to JS %@", FCMToken);
  NSArray *events = [[NSArray alloc] initWithObjects: FCMToken, nil];
  callback(@[[NSNull null], events]);
}

@end
