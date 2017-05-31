//
//  VinylMapView.h
//  pingstersApp
//
//  Created by Youngchan Je on 2/4/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#ifndef VinylMapView_h
#define VinylMapView_h

#import <React/RCTView.h>
#import <GoogleMaps/GoogleMaps.h>
#import "VinylMapCoordinate.h"

@interface VinylMapView : GMSMapView<GMSMapViewDelegate>

@property (nonatomic, copy) RCTBubblingEventBlock onMapMove;
@property (nonatomic, copy) RCTBubblingEventBlock onPress;
@property (nonatomic, copy) RCTBubblingEventBlock onMarkerPress;
@property (nonatomic, copy) RCTBubblingEventBlock onChangeCameraPosition;
@property (nonatomic, assign) BOOL didChangeCameraPositionEnabled;

- (void)moveMap:(NSString*)latitude longitude:(NSString*)longitude;
- (void)clearMap;
- (void)animateToLocation:(NSString*)latitude longitude:(NSString*)longitude;
- (void)animateToLocationWithZoom:(NSString*)latitude longitude:(NSString*)longitude zoom:(float)zoom;
- (void)fitToCoordinates:(nonnull NSArray<VinylMapCoordinate *> *)coordinates
             edgePadding:(nonnull NSDictionary *)edgePadding
                animated:(BOOL)animated;

- (void)moveMarker:(NSString*)latitude longitude:(NSString*)longitude;
- (void)addMarker:(NSString *)latitude longitude:(NSString *)longitude id:(NSString*)id;
- (void)removeMarker:(NSString *)id;
- (void)addMarkerNode:(NSString *)latitude longitude:(NSString *)longitude name:(NSString *)name nodeId:(NSString *)nodeId list:(NSArray<NSString *> *)list;
- (void)addMarkerDest:(NSString *)latitude longitude:(NSString *)longitude name:(NSString *)name uId:(NSString *)uId;
- (void)updateMarker:(NSString*)latitude longitude:(NSString*)longitude;
- (void)drawDirections:(nullable NSString *)encodedPath;

- (void)enableDidChangeCameraPosition;
- (void)disableDidChangeCameraPosition;

@end

#endif /* VinylMapView_h */
