//
//  VinylMapView.m
//  pingstersApp
//
//  Created by Youngchan Je on 2/4/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "VinylMapView.h"

@implementation VinylMapView {
  GMSMapView *_map;
  GMSMarker *_marker;
  NSMutableArray *_markers;
  NSMutableArray *_marker_ids;
}

- (instancetype)init
{
  self = [super init];
  _markers = [[NSMutableArray alloc] init];
  _marker_ids = [[NSMutableArray alloc] init];
  GMSCameraPosition *camera = [GMSCameraPosition cameraWithLatitude:-33.86
                                                          longitude:120.20
                                                               zoom:6];
  _map = [[GMSMapView alloc] initWithFrame:self.bounds];
  _map = [GMSMapView mapWithFrame:CGRectZero camera:camera];
  _map.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
  _map.myLocationEnabled = YES;
  _map.delegate = self;
  [self addSubview:_map];
  return self;
}

- (void)moveMap:(NSString*)latitude longitude:(NSString *)longitude {
  GMSCameraPosition *camera = [GMSCameraPosition cameraWithLatitude:latitude.doubleValue
                                                          longitude:longitude.doubleValue
                                                               zoom:6];
  _map.camera = camera;
}

- (void)animateToLocation:(NSString *)latitude longitude:(NSString *)longitude {
  [_map animateToLocation: CLLocationCoordinate2DMake(latitude.doubleValue, longitude.doubleValue)];
}

- (void)moveMarker:(NSString *)latitude longitude:(NSString *)longitude {
  if (_marker.map == nil) {
    _marker = [GMSMarker markerWithPosition:CLLocationCoordinate2DMake(latitude.doubleValue, longitude.doubleValue)];
    _marker.appearAnimation = kGMSMarkerAnimationPop;
    _marker.map = _map;
  } else {
    _marker.map = nil;
  }
}

- (void)addMarker:(NSString *)latitude longitude:(NSString *)longitude id:(NSString*)id {
  GMSMarker *new_marker = [GMSMarker markerWithPosition:CLLocationCoordinate2DMake(latitude.doubleValue, longitude.doubleValue)];
  new_marker.map = _map;
  [_markers addObject:new_marker];
  [_marker_ids addObject:id];
}

-(void)updateMarker: (NSString *)latitude longitude:(NSString *)longitude {
  if (_marker == nil) {
    _marker = [GMSMarker markerWithPosition:CLLocationCoordinate2DMake(latitude.doubleValue, longitude.doubleValue)];
    // _marker.icon = [UIImage imageNamed:CAR_FOUND_IMAGE];
    _marker.map = _map;
  } else {
    [CATransaction begin];
    [CATransaction setAnimationDuration:0.3];
    _marker.position = CLLocationCoordinate2DMake(latitude.doubleValue, longitude.doubleValue);
    [CATransaction commit];
  }
}

#pragma mark - GMSMapViewDelegate

- (void)mapView:(GMSMapView *)mapView
didTapAtCoordinate:(CLLocationCoordinate2D)coordinate {
  // NSLog(@"You tapped at %f,%f", coordinate.latitude, coordinate.longitude);
}

- (void)mapView:(GMSMapView *)mapView willMove:(BOOL)gesture {
  // TBD
}

- (BOOL)mapView:(GMSMapView *)mapView didTapMarker:(GMSMarker *)marker {
  // NSLog(@"%f %f", marker.position.latitude, marker.position.longitude);
  NSUInteger index = [_markers indexOfObject:marker];
  NSString *id = _marker_ids[index];
  // NSLog(@"%lu", (unsigned long)index);
  // NSLog(@"%@", id);
  return YES;
}

@end
