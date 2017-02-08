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


@implementation VinylMapManager {
  VinylMapView *_vinylMap;
}

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(moveMap:(NSString *)latitude: (NSString *)longitude)
{
  if (_vinylMap) {
    dispatch_async(dispatch_get_main_queue(), ^{
      [_vinylMap omfg:latitude longitude:longitude];
    });
  }
}

- (UIView *)view
{
  VinylMapView *map = [VinylMapView new];
  _vinylMap = map;
  return map;
}

@end
