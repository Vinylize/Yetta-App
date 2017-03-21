//
//  YettaLocationService.m
//  pingstersApp
//
//  Created by Youngchan Je on 3/21/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <CoreLocation/CoreLocation.h>

#import "YettaLocationService.h"

#import "YettaLocationServiceManager.h"

@implementation YettaLocationService

@synthesize locationManager, currentLocation;

- (void)startLocationService {
  locationManager = [[CLLocationManager alloc] init];
  locationManager.delegate = self;
  
  CLAuthorizationStatus authorizationStatus= [CLLocationManager authorizationStatus];
  // todo: change the following condition to handle more detailed situations
  if (authorizationStatus != kCLAuthorizationStatusAuthorizedAlways)
    [locationManager requestAlwaysAuthorization];
  
  if ([CLLocationManager locationServicesEnabled]) {
    // todo: handle this to less consume battery
    [locationManager startUpdatingLocation];
    NSLog(@"start location update");
  } else {
    NSLog(@"Location services is not enabled");
  }
  
  [self startSignificantChangeUpdates];
}

- (void)startSignificantChangeUpdates
{
  // Create the location manager if this object does not already have one.
  if (nil == locationManager)
    locationManager = [[CLLocationManager alloc] init];
  
  locationManager.delegate = self;
  [locationManager startMonitoringSignificantLocationChanges];
}

- (void)locationManager:(CLLocationManager *)manager didUpdateToLocation:(CLLocation *)newLocation fromLocation:(CLLocation *)oldLocation {
  self.currentLocation = newLocation;
  
  NSLog(@"Latidude %f Longitude: %f", newLocation.coordinate.latitude, newLocation.coordinate.longitude);
  
  // converts CLLocationCoordinate to NSString
  NSString * latitude = [[NSString alloc] initWithFormat:@"%f", newLocation.coordinate.latitude];
  NSString * longitude = [[NSString alloc] initWithFormat:@"%f", newLocation.coordinate.longitude];
  // sending events to JS
  [YettaLocationServiceManger didUpdateToLocation:latitude :longitude];
  
  // the following was to test location update when app is terminated by showing local notification.
  // [self saveNotification:@"test notification" :@"unique id" :NO :newLocation.coordinate];
}

- (void)locationManager:(CLLocationManager *)manager didFailWithError:(NSError *)error {
  [locationManager stopUpdatingLocation];
  NSLog(@"Update failed with error: %@", error);
}

#ifdef DEBUG
-(void)saveNotification:(NSString *)description :(NSString *)notificationID :(BOOL)locationCheck :(CLLocationCoordinate2D)coordinates{
  
  // Create the notification info dictionary
  // and set the notification ID string.
  NSMutableDictionary *userInfo = [[NSMutableDictionary alloc] init];
  [userInfo setObject:notificationID forKey:@"notification_id"];
  
  [userInfo setObject:@"latitude" forKey:[[NSString alloc] initWithFormat:@"%f", coordinates.latitude]];
  [userInfo setObject:@"longitude" forKey:[[NSString alloc] initWithFormat:@"%f", coordinates.longitude]];
  
  // Setup the local notification.
  UILocalNotification *localNotification = [[UILocalNotification alloc] init];
  
  // Set the notification ID and type data.
  localNotification.userInfo = userInfo;
  
  // Set the notification description.
  localNotification.alertBody = [NSString stringWithFormat:@"%@", description];
  
  // Set the sound alert MP3 file.
  localNotification.soundName = [NSString stringWithFormat:@"Notification_sound_file.mp3"];
  
  // Set the date for the notification or set the
  // location depending on the notification type.
  
  if (locationCheck == NO) {
    
    // Fire date of your choice.
    NSDate *yourFireDate;
    
    // Set the reminder date.
    double interval = [yourFireDate timeIntervalSinceNow];
    localNotification.fireDate = [[NSDate date] dateByAddingTimeInterval:interval];
    localNotification.timeZone = [NSTimeZone systemTimeZone];
    
    // Set the notifcation repeat interval.
    localNotification.repeatInterval = 0; // No repeat.
    //localNotification.repeatInterval = NSCalendarUnitHour; // Every hour.
    //localNotification.repeatInterval = NSCalendarUnitDay; // Every day.
    //localNotification.repeatInterval = NSCalendarUnitWeekOfYear; // Once a week.
    //localNotification.repeatInterval = NSCalendarUnitMonth; // Once a month.
    //localNotification.repeatInterval = NSCalendarUnitYear; // Once a year.
  }
  
  else if (locationCheck == YES) {
    
    // Set the locaton to the selected address co-ordinates.
    // CLLocationCoordinate2D coordinates = CLLocationCoordinate2DMake(latitude, longitude);
    CLCircularRegion *region = [[CLCircularRegion alloc] initWithCenter:coordinates radius:100 identifier:[NSString stringWithFormat:@"region_%@", notificationID]];
    
    // Set the notification to be presented
    // when the user arrives at the location.
    [region setNotifyOnEntry:YES];
    [region setNotifyOnExit:NO];
    
    // Set the notification location data.
    [localNotification setRegion:region];
    [localNotification setRegionTriggersOnce:NO];
  }
  
  // Save the local notification.
  [[UIApplication sharedApplication] scheduleLocalNotification:localNotification];
}
#endif
@end
