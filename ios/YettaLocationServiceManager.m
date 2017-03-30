//
//  YettaLocationServiceManager.m
//  pingstersApp
//
//  Created by Youngchan Je on 3/21/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import "YettaLocationServiceManager.h"

#import <Foundation/Foundation.h>
#import <React/RCTBridge.h>
#import <React/RCTEventDispatcher.h>

@interface YettaLocationServiceManger ()

@end

@implementation YettaLocationServiceManger
{
  
}

RCT_EXPORT_MODULE();

- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}

- (void)startObserving
{
  [[NSNotificationCenter defaultCenter] addObserver:self
                                           selector:@selector(updateToLocationJS:)
                                               name:@"didUpdateToLocation"
                                             object:nil];
}

- (void)stopObserving
{
  [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (NSArray<NSString *> *)supportedEvents
{
  return @[@"didUpdateToLocation"];
}

- (void)updateToLocationJS:(NSNotification *)notification
{
  [self sendEventWithName:@"didUpdateToLocation" body:notification.userInfo];
}

+ (void)didUpdateToLocation:(NSString *)latitude :(NSString *)longitude
{
  [[NSNotificationCenter defaultCenter] postNotificationName:@"didUpdateToLocation"
                                                      object:self
                                                    userInfo:@{@"latitude": latitude, @"longitude": longitude}];
}

RCT_EXPORT_METHOD(startLocationService)
{
  [[NSNotificationCenter defaultCenter] postNotificationName:@"startLocationService" object:self];
}

RCT_EXPORT_METHOD(stopLocationService)
{
  [[NSNotificationCenter defaultCenter] postNotificationName:@"stopLocationService" object:self];
}

@end
