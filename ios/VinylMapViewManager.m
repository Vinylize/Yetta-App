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

RCT_EXPORT_METHOD(clearMap)
{
  if (_vinylMap) {
    dispatch_async(dispatch_get_main_queue(), ^{
      [_vinylMap clearMap];
    });
  }
}

RCT_EXPORT_METHOD(animateToLocation:(NSString *)latitude: (NSString *)longitude: (float)duration)
{
  if (_vinylMap) {
    dispatch_async(dispatch_get_main_queue(), ^{
      [_vinylMap animateToLocation:latitude longitude:longitude duration:duration];
    });
  }
}

RCT_EXPORT_METHOD(animateToLocationWithZoom:(NSString *)latitude: (NSString *)longitude: (float)zoom: (float)duration)
{
  if (_vinylMap) {
    dispatch_async(dispatch_get_main_queue(), ^{
      [_vinylMap animateToLocationWithZoom:latitude longitude:longitude zoom:zoom duration:duration];
    });
  }
}

RCT_EXPORT_METHOD(fitToCoordinates:(nonnull NSArray<VinylMapCoordinate *> *)coordinates:
                  (nonnull NSDictionary *)edgePadding:
                  (BOOL)animated:
                  (float)duration)
{
  if (_vinylMap) {
    dispatch_async(dispatch_get_main_queue(), ^{
      [_vinylMap fitToCoordinates:coordinates edgePadding:edgePadding animated:animated duration:duration];
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

RCT_EXPORT_METHOD(addMarkerNode:(NSString *)latitude: (NSString *)longitude: (NSString *)name: (NSString *)nodeId: (NSArray<NSString *> *)list)
{
  if (_vinylMap) {
    dispatch_async(dispatch_get_main_queue(), ^{
      [_vinylMap addMarkerNode:latitude longitude:longitude name:name nodeId:nodeId list:list];
    });
  }
}

RCT_EXPORT_METHOD(addMarkerDest:(NSString *)latitude: (NSString *)longitude: (NSString *)name: (NSString *)uId)
{
  if (_vinylMap) {
    dispatch_async(dispatch_get_main_queue(), ^{
      [_vinylMap addMarkerDest:latitude longitude:longitude name:name uId:uId];
    });
  }
}

RCT_EXPORT_METHOD(removeMarker:(NSString *)id)
{
  if (_vinylMap) {
    dispatch_async(dispatch_get_main_queue(), ^{
      [_vinylMap removeMarker:id];
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

RCT_EXPORT_METHOD(drawDirections:(NSString *)encodedPath)
{
  if (_vinylMap) {
    dispatch_async(dispatch_get_main_queue(), ^{
      [_vinylMap drawDirections:encodedPath];
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
