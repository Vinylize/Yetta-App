//
//  RCTConvert+YettaMap.m
//  pingstersApp
//
//  Created by Youngchan Je on 5/28/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import "RCTConvert+YettaMap.h"

#import <React/RCTConvert+CoreLocation.h>
#import "VinylMapCoordinate.h"

@implementation RCTConvert (VinylMapView)

+ (VinylMapCoordinate *)VinylMapCoordinate:(id)json
{
  VinylMapCoordinate *coord = [VinylMapCoordinate new];
  coord.coordinate = [self CLLocationCoordinate2D:json];
  return coord;
}

RCT_ARRAY_CONVERTER(VinylMapCoordinate)

+ (NSArray<NSArray<VinylMapCoordinate *> *> *)AIRMapCoordinateArrayArray:(id)json
{
  return RCTConvertArrayValue(@selector(VinylMapCoordinateArray:), json);
}

@end
