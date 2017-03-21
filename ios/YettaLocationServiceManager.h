//
//  YettaLocationServiceManager.h
//  pingstersApp
//
//  Created by Youngchan Je on 3/21/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#ifndef YettaLocationServiceManager_h
#define YettaLocationServiceManager_h

#import <React/RCTEventEmitter.h>

@interface YettaLocationServiceManger : RCTEventEmitter

+ (void)didUpdateToLocation:(NSString *)latitude :(NSString *)longitude;

@end

#endif /* YettaLocationServiceManager_h */
