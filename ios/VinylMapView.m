//
//  VinylMapView.m
//  pingstersApp
//
//  Created by Youngchan Je on 2/4/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "RCTViewManager.h"
#import "VinylMapView.h"

@implementation VinylMapView {
  GMSMapView *_map;
}

- (instancetype)init
{
  self = [super init];
  GMSCameraPosition *camera = [GMSCameraPosition cameraWithLatitude:-33.86
                                                          longitude:120.20
                                                               zoom:6];
  GMSMarker *marker = [[GMSMarker alloc] init];
  marker.position = CLLocationCoordinate2DMake(-33.86, 151.20);
  marker.title = @"Sydney";
  marker.snippet = @"Australia";
  _map = [[GMSMapView alloc] initWithFrame:self.bounds];
  _map = [GMSMapView mapWithFrame:CGRectZero camera:camera];
  marker.map = _map;
  
  _map.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
  _map.myLocationEnabled = YES;
  
  [self addSubview:_map];
  return self;
}

- (void)omfg:(NSString*)latitude longitude:(NSString *)longitude {
  GMSCameraPosition *camera = [GMSCameraPosition cameraWithLatitude:latitude.doubleValue
                                                          longitude:longitude.doubleValue
                                                               zoom:6];
  _map.camera = camera;
}

@end
