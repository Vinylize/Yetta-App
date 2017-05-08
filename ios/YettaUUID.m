//
//  YettaUUID.m
//  pingstersApp
//
//  Created by Youngchan Je on 5/8/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "YettaUUID.h"
#import <React/RCTBridge.h>
#import <React/RCTEventDispatcher.h>

@interface YettaUUID ()

@end

@implementation YettaUUID
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
RCT_EXPORT_METHOD(getUUID:(RCTResponseSenderBlock)callback)
{
  NSString * UUID = [[[UIDevice currentDevice] identifierForVendor] UUIDString];
  NSLog(@"sending UUID to JS %@", UUID);
  NSArray *events = [[NSArray alloc] initWithObjects: UUID, nil];
  callback(@[[NSNull null], events]);
}

@end
