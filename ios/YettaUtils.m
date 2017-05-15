//
//  YettaUUID.m
//  pingstersApp
//
//  Created by Youngchan Je on 5/8/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "YettaUtils.h"
#import <React/RCTBridge.h>
#import <React/RCTEventDispatcher.h>
#import "RCTRootView.h"

@interface YettaUtils ()

@end

@implementation YettaUtils

RCT_EXPORT_MODULE();

- (NSArray<NSString *> *)supportedEvents
{
  return @[];
}

RCT_EXPORT_METHOD(changeRootViewBGColor)
{
  dispatch_async(dispatch_get_main_queue(), ^{
    [[NSNotificationCenter defaultCenter] postNotificationName:@"changeRootViewBGColor" object:self];
  });
}

@end
