//
//  VinylMapViewManager.m
//  pingstersApp
//
//  Created by Youngchan Je on 2/5/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

#import "VinylMapViewManager.h"
#import "VinylMapView.h"

@implementation VinylMapManager

RCT_EXPORT_MODULE();

- (UIView *)view
{
  return [[VinylMapView alloc] init];
}

@end
