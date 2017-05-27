//
//  VinylMapView.m
//  pingstersApp
//
//  Created by Youngchan Je on 2/4/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "VinylMapView.h"
#import "pingstersApp-Swift.h"
#import <React/RCTConvert.h>

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
  
  _didChangeCameraPositionEnabled = false;
  
  _map = [[GMSMapView alloc] initWithFrame:self.bounds];
  _map = [GMSMapView mapWithFrame:CGRectZero camera:camera];
  _map.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
  _map.myLocationEnabled = YES;
  _map.delegate = self;
  [self addSubview:_map];

  return self;
}

- (id)eventMapMoved:(BOOL)gesture {
  NSLog(@"sending event map willMove");
  return @{
            @"gesture": @(gesture)
           };
}

- (id)eventFromCoordinate:(CLLocationCoordinate2D)coordinate {
  return @{
           @"coordinate": @{
               @"latitude": @(coordinate.latitude),
               @"longitude": @(coordinate.longitude),
               },
           };
}

- (id)eventMarkerPress:(CLLocationCoordinate2D)coordinate markerID:(NSString*)markerID {
  return @{
           @"coordinate": @{
               @"latitude": @(coordinate.latitude),
               @"longitude": @(coordinate.longitude),
               },
           @"id": markerID,
           };
}

- (id)eventCameraPositionChange:(double) latitude longitude:(double)longitude {
  return @{
           @"latitude": @(latitude),
           @"longitude": @(longitude)
           };
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

- (void)animateToLocationWithZoom:(NSString *)latitude longitude:(NSString *)longitude zoom:(float)zoom {
  [_map animateToLocation:CLLocationCoordinate2DMake(latitude.doubleValue, longitude.doubleValue)];
  [_map animateToZoom:zoom];
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
  VinylMapMarkerView *markerView = [[VinylMapMarkerView alloc] initWithFrame:CGRectMake(0, 0, 50, 50)];
  new_marker.iconView = markerView;
  new_marker.map = _map;
  [_markers addObject:new_marker];
  [_marker_ids addObject:id];
}

- (void)updateMarker: (NSString *)latitude longitude:(NSString *)longitude {
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

- (void)fitToCoordinates:(nonnull NSArray<VinylMapCoordinate *> *)coordinates
             edgePadding:(nonnull NSDictionary *)edgePadding
                animated:(BOOL)animated
{
  CLLocationCoordinate2D myLocation = coordinates.firstObject.coordinate;
  GMSCoordinateBounds *bounds = [[GMSCoordinateBounds alloc] initWithCoordinate:myLocation coordinate:myLocation];
  
  for (VinylMapCoordinate *coordinate in coordinates)
    bounds = [bounds includingCoordinate:coordinate.coordinate];
  
  // Set Map viewport
  CGFloat top = [RCTConvert CGFloat:edgePadding[@"top"]];
  CGFloat right = [RCTConvert CGFloat:edgePadding[@"right"]];
  CGFloat bottom = [RCTConvert CGFloat:edgePadding[@"bottom"]];
  CGFloat left = [RCTConvert CGFloat:edgePadding[@"left"]];
  
  [_map animateWithCameraUpdate:[GMSCameraUpdate fitBounds:bounds withEdgeInsets:UIEdgeInsetsMake(top, left, bottom, right)]];
}

- (void)enableDidChangeCameraPosition
{
  // NSLog(@"enabled did change camera position");
  self.didChangeCameraPositionEnabled = true;
}

- (void)disableDidChangeCameraPosition
{
  // NSLog(@"disabled did change camera position");
  self.didChangeCameraPositionEnabled = false;
}

#pragma mark - GMSMapViewDelegate

- (void)mapView:(GMSMapView *)mapView willMove:(BOOL)gesture {
  NSLog(@"map moved with yes");
  if (!self.onMapMove) return;
  self.onMapMove([self eventMapMoved:gesture]);

}

- (void)mapView:(GMSMapView *)mapView idleAtCameraPosition:(GMSCameraPosition *)position {
  NSLog(@"idle");
  double latitude = position.target.latitude;
  double longitude = position.target.longitude;
  
  if (self.didChangeCameraPositionEnabled == true) {
    // send event with lat lon data to JS
    if (!self.onChangeCameraPosition) return;
    self.onChangeCameraPosition([self eventCameraPositionChange:latitude longitude:longitude]);
  }
}

- (void)mapView:(GMSMapView *)mapView didTapAtCoordinate:(CLLocationCoordinate2D)coordinate {
  if (!self.onPress) return;
  self.onPress([self eventFromCoordinate:coordinate]);
}

- (BOOL)mapView:(GMSMapView *)mapView didTapMarker:(GMSMarker *)marker {
  NSUInteger index = [_markers indexOfObject:marker];
  NSString *markerID = _marker_ids[index];
  
  if (self.onMarkerPress) {
    self.onMarkerPress([self eventMarkerPress:marker.position markerID:markerID]);
  }
  return YES;
}

- (void)mapView:(GMSMapView *)mapView didChangeCameraPosition:(GMSCameraPosition *)position {
//  double latitude = mapView.camera.target.latitude;
//  double longitude = mapView.camera.target.longitude;
//  
//  if (self.didChangeCameraPositionEnabled == true) {
//    // send event with lat lon data to JS
//    if (!self.onChangeCameraPosition) return;
//    self.onChangeCameraPosition([self eventCameraPositionChange:latitude longitude:longitude]);
//  }
}

@end
