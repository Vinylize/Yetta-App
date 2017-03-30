//
//  YettaLocationService.h
//  pingstersApp
//
//  Created by Youngchan Je on 3/21/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#ifndef YettaLocationService_h
#define YettaLocationService_h

#import <Foundation/Foundation.h>
#import <CoreLocation/CoreLocation.h>
#import <UIKit/UIKit.h>

@import UserNotifications;

@interface YettaLocationService : NSObject <CLLocationManagerDelegate, UNUserNotificationCenterDelegate, UIApplicationDelegate> {
  CLLocationManager *locationManager;
  CLLocation *currentLocation;
}

@property (nonatomic, retain) CLLocationManager *locationManager;
@property (nonatomic, retain) CLLocation *currentLocation;

- (void)startLocationService;
- (void)stopLocationService;

@end

#endif /* YettaLocationService_h */
