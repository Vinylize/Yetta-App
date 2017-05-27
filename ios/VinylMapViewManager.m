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
#import "RCTConvert+YettaMap.h"

@implementation VinylMapManager {
  VinylMapView *_vinylMap;
}

RCT_EXPORT_MODULE();

- (UIView *)view
{
  VinylMapView *map = [VinylMapView new];
  _vinylMap = map;
  return map;
}

RCT_EXPORT_METHOD(moveMap:(NSString *)latitude: (NSString *)longitude)
{
  if (_vinylMap) {
    dispatch_async(dispatch_get_main_queue(), ^{
      [_vinylMap moveMap:latitude longitude:longitude];
    });
  }
}

RCT_EXPORT_METHOD(animateToLocation:(NSString *)latitude: (NSString *)longitude)
{
  if (_vinylMap) {
    dispatch_async(dispatch_get_main_queue(), ^{
      [_vinylMap animateToLocation:latitude longitude:longitude];
    });
  }
}

RCT_EXPORT_METHOD(animateToLocationWithZoom:(NSString *)latitude: (NSString *)longitude: (float)zoom)
{
  if (_vinylMap) {
    dispatch_async(dispatch_get_main_queue(), ^{
      [_vinylMap animateToLocationWithZoom:latitude longitude:longitude zoom:zoom];
    });
  }
}

RCT_EXPORT_METHOD(moveMarker:(NSString *)latitude: (NSString *)longitude)
{
  if (_vinylMap) {
    dispatch_async(dispatch_get_main_queue(), ^{
      [_vinylMap moveMarker:latitude longitude:longitude];
    });
  }
}

RCT_EXPORT_METHOD(addMarker:(NSString *)latitude: (NSString *)longitude: (NSString *)id)
{
  if (_vinylMap) {
    dispatch_async(dispatch_get_main_queue(), ^{
      [_vinylMap addMarker:latitude longitude:longitude id:id];
    });
  }
}

RCT_EXPORT_METHOD(updateMarker:(NSString *)latitude: (NSString *)longitude)
{
  if (_vinylMap) {
    dispatch_async(dispatch_get_main_queue(), ^{
      [_vinylMap updateMarker:latitude longitude:longitude];
    });
  }
}

RCT_EXPORT_METHOD(fitToCoordinates:(nonnull NSArray<VinylMapCoordinate *> *)coordinates:
                  (nonnull NSDictionary *)edgePadding:
                  (BOOL)animated)
{
  if (_vinylMap) {
    dispatch_async(dispatch_get_main_queue(), ^{
      [_vinylMap fitToCoordinates:coordinates edgePadding:edgePadding animated:animated];
    });
  }
}

RCT_EXPORT_METHOD(enableDidChangeCameraPosition)
{
  if (_vinylMap) {
    dispatch_async(dispatch_get_main_queue(), ^{
      [_vinylMap enableDidChangeCameraPosition];
    });
  }
}

RCT_EXPORT_METHOD(disableDidChangeCameraPosition)
{
  if (_vinylMap) {
    dispatch_async(dispatch_get_main_queue(), ^{
      [_vinylMap disableDidChangeCameraPosition];
    });
  }
}

RCT_EXPORT_VIEW_PROPERTY(onMapMove, RCTBubblingEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onPress, RCTBubblingEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onMarkerPress, RCTBubblingEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onChangeCameraPosition, RCTBubblingEventBlock);

@end
