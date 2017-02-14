//
//  VinylMapView.h
//  pingstersApp
//
//  Created by Youngchan Je on 2/4/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#ifndef VinylMapView_h
#define VinylMapView_h

#import "RCTView.h"
#import "RCTRootView.h"
#import "RCTBundleURLProvider.h"
#import <GoogleMaps/GoogleMaps.h>

@interface VinylMapView : GMSMapView<GMSMapViewDelegate>

@property (nonatomic, copy) RCTBubblingEventBlock onPress;

- (void)moveMap:(NSString*)latitude longitude:(NSString*)longitude;
- (void)animateToLocation:(NSString*)latitude longitude:(NSString*)longitude;
- (void)moveMarker:(NSString*)latitude longitude:(NSString*)longitude;
- (void)addMarker:(NSString *)latitude longitude:(NSString *)longitude id:(NSString*)id;
- (void)updateMarker:(NSString*)latitude longitude:(NSString*)longitude;

@end

#endif /* VinylMapView_h */
