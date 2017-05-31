//
//  VinylMapView.m
//  pingstersApp
//
//  Created by Youngchan Je on 2/4/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "VinylMapView.h"
#import <React/RCTConvert.h>
#import "pingstersApp-Swift.h"
#import <QuartzCore/QuartzCore.h>
#include <math.h>

static NSString *const AT_BOTTOM = @"AT_BOTTOM";
static NSString *const AT_TOP = @"AT_TOP";
static NSString *const AT_LEFT = @"AT_LEFT";
static NSString *const AT_RIGHT = @"AT_RIGHT";
NSInteger i;

@interface VinylMapView()
@property (nonatomic, weak) NSString* destMarkerLastPosX; // either AT_LEFT or AT_RIGHT
@property (nonatomic, weak) NSString* destMarkerLastPosY; // either AT_TOP or AT_BOTTOM
@property (nonatomic, weak) NSString* nodeMarkerLastPosX;
@property (nonatomic, weak) NSString* nodeMarkerLastPosY;

@property (nonatomic, strong) GMSPolyline* polylineAnim;
@property (nonatomic, strong) GMSMutablePath* pathForAnim;
@end

@implementation VinylMapView {
  GMSMapView *_map;
  GMSMarker *_marker;
  NSMutableArray *_markers;
  UIView *_destMarkerView;
  UIView *_nodeMarkerView;
  CLLocationCoordinate2D _destMarkerCoordinate;
  CLLocationCoordinate2D _nodeMarkerCoordinate;
}

- (instancetype)init
{
  self = [super init];
  _markers = [[NSMutableArray alloc] init];
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
  i = 0;
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

- (id)eventMarkerPress:(CLLocationCoordinate2D)coordinate type:(NSString *)type nodeId:(NSString*)nodeId {
  return @{
           @"coordinate": @{
               @"latitude": @(coordinate.latitude),
               @"longitude": @(coordinate.longitude),
               },
           @"type": type,
           @"id": nodeId,
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

- (void)clearMap {
  [_map clear];
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
  
  new_marker.icon = [GMSMarker markerImageWithColor:[UIColor blackColor]];;
  new_marker.map = _map;
  [_markers addObject:new_marker];
}

- (void)removeMarker:(NSString *)id {
  NSArray *filtered = [_markers filteredArrayUsingPredicate:[NSPredicate predicateWithFormat:@"(id == %@)", id]];
  NSDictionary *item = [filtered objectAtIndex:0];
  GMSMarker * marker = item[@"marker"];
  if (marker) {
    marker.map = nil;
  }
}

- (void)addMarkerNode:(NSString *)latitude longitude:(NSString *)longitude name:(NSString *)name nodeId:(NSString *)nodeId list:(NSArray<NSString *> *)list {
  _nodeMarkerCoordinate = CLLocationCoordinate2DMake(latitude.doubleValue, longitude.doubleValue);
  GMSMarker *new_marker = [GMSMarker markerWithPosition:CLLocationCoordinate2DMake(latitude.doubleValue, longitude.doubleValue)];
  NSLog(@"adding node marker with node name: %@ at %.10f %.10f", name, latitude.doubleValue, longitude.doubleValue);
#ifdef DEBUG
  for (NSString * item in list) {
    NSLog(@"item to purchase: %@", item);
  }
#endif
  [_map addSubview:[self getNodeStyleIconView:name list:list tag:nodeId]];
  new_marker.iconView = [self getBasicIconView];
  new_marker.groundAnchor = CGPointMake(0.5, 0.5);
  new_marker.map = _map;
  
  NSDictionary *dict = @{
                         @"marker": new_marker,
                         @"type": @"node",
                         @"id": nodeId
                         };
  [_markers addObject:dict];
}

- (void)addMarkerDest:(NSString *)latitude longitude:(NSString *)longitude name:(NSString *)name uId:(NSString *)uId {
  _destMarkerCoordinate = CLLocationCoordinate2DMake(latitude.doubleValue, longitude.doubleValue);
  GMSMarker *new_marker = [GMSMarker markerWithPosition:_destMarkerCoordinate];
  NSLog(@"adding dest marker with user name: %@ at %.10f %.10f", name, latitude.doubleValue, longitude.doubleValue);
  
  [_map addSubview:[self getDestStyleIconView:name tag:uId]];
  new_marker.iconView = [self getBasicIconView];
  new_marker.groundAnchor = CGPointMake(0.5, 0.5);
  new_marker.map = _map;
  
  NSDictionary *dict = @{
                         @"marker": new_marker,
                         @"type": @"dest",
                         @"id": uId
                         };
  [_markers addObject:dict];
}

- (UIView *)getBasicIconView {
  UIView *iconView = [[UIView alloc] initWithFrame:CGRectMake(0, 0, 13, 13)];
  iconView.backgroundColor = [UIColor blackColor];
  iconView.transform = CGAffineTransformMakeRotation(45 * M_PI/180);
  return iconView;
}

- (UIView *)getNodeStyleIconView: (NSString *)name list:(NSArray<NSString *> *)list tag:(NSString *)tag {
  NSInteger nameLabelHeight = 30;
  NSInteger triangleHeight = 20;
  NSInteger itemViewHeight = 24;
  NSInteger itemListHeight = 0;
  NSInteger itemCount = 0;
  NSInteger rightArrowImageWidth = 10;
  NSInteger textLeftMargin = 8;
  NSInteger offsetForShadow = 15;
  
  if (list != nil) {
    // todo: enable the following comment if all the list should be shown
    //itemCount = [list count];
    itemCount = 1;
    itemListHeight = itemCount * itemViewHeight;
  }
  
  NSInteger totalParentViewHeight = nameLabelHeight + triangleHeight + offsetForShadow + itemListHeight;
  NSInteger totalParentViewWidth;
  
  // [start draw node name label]
  UILabel *nodeNameLabel = [[UILabel alloc] init];
  [nodeNameLabel setTextColor:[UIColor whiteColor]];
  [nodeNameLabel setBackgroundColor:[UIColor clearColor]];
  nodeNameLabel.font = [UIFont fontWithName:@"Helvetica" size:12];
  [nodeNameLabel setText:name];
  nodeNameLabel.textAlignment = NSTextAlignmentLeft;
  CGSize textSize = [nodeNameLabel intrinsicContentSize];
  
  NSInteger WIDTH = textLeftMargin + textSize.width + 16 + rightArrowImageWidth;
  totalParentViewWidth = WIDTH + offsetForShadow;
  
  [nodeNameLabel setFrame:CGRectMake(textLeftMargin, nameLabelHeight/2 - textSize.height/2, textSize.width, textSize.height)];
  
  UIView *nodeNameTextWrapper = [[UIView alloc] initWithFrame:CGRectMake(offsetForShadow/2, itemListHeight + offsetForShadow, WIDTH, nameLabelHeight)];
  nodeNameTextWrapper.backgroundColor = [UIColor blackColor];
  [nodeNameTextWrapper addSubview:nodeNameLabel];
  
  // add roundedCorner on bottom left and right
  UIBezierPath *cornersPath = [UIBezierPath bezierPathWithRoundedRect:nodeNameTextWrapper.bounds byRoundingCorners:(UIRectCornerBottomLeft|UIRectCornerBottomRight) cornerRadii:CGSizeMake(5, 5)];
  CAShapeLayer *maskLayer = [CAShapeLayer layer];
  maskLayer.path = cornersPath.CGPath;
  nodeNameTextWrapper.layer.mask = maskLayer;
  // [end draw node name label]
  
  // [start draw right-arrow image]
  NSInteger rightArrowImageHeight = textSize.height - 6;
  NSInteger rightArrowImageLeft = (textLeftMargin + textSize.width)/2 + WIDTH/2 - rightArrowImageWidth/2;
  UIImageView * rightArrowImageView = [[UIImageView alloc] initWithFrame:CGRectMake(rightArrowImageLeft, nameLabelHeight/2 - rightArrowImageHeight/2, rightArrowImageWidth, rightArrowImageHeight)];
  rightArrowImageView.image = [UIImage imageNamed:@"right-arrow.png"];
  rightArrowImageView.backgroundColor = [UIColor clearColor];
  [nodeNameTextWrapper addSubview:rightArrowImageView];
  // [end draw right-arrow image]
  
  _nodeMarkerView  = [[UIView alloc] initWithFrame:CGRectMake(0, 0, totalParentViewWidth, totalParentViewHeight)];
  _nodeMarkerView.backgroundColor = [UIColor clearColor];
  _nodeMarkerView.layer.shadowOffset = CGSizeMake(0, 3);
  _nodeMarkerView.layer.shadowColor = [UIColor blackColor].CGColor;
  _nodeMarkerView.layer.shadowRadius = 3.0;
  _nodeMarkerView.layer.shadowOpacity = .5;
  
  // [start draw item list]
  // TODO: remove the following commented code if not used
//  if (list != nil) {
//    for (NSInteger i = 0; i < itemCount; i++) {
//      UILabel * itemLabel = [[UILabel alloc] initWithFrame:CGRectMake(0, i * itemViewHeight, WIDTH, itemViewHeight)];
//      [itemLabel setTextColor:[UIColor blackColor]];
//      [itemLabel setBackgroundColor:[UIColor whiteColor]];
//      [itemLabel setFont:[UIFont fontWithName:@"Helvetica" size:14]];
//      [itemLabel setText:[list objectAtIndex:i]];
//      itemLabel.textAlignment = NSTextAlignmentLeft;
//      
//      [nodeIconView addSubview:itemLabel];
//    };
//  }
  UIView *itemView = [[UIView alloc] initWithFrame:CGRectMake(offsetForShadow/2, offsetForShadow, WIDTH, itemViewHeight)];
  itemView.backgroundColor = [UIColor whiteColor];
  
  // add roundedCorner on top left and right
  UIBezierPath *itemViewCornersPath = [UIBezierPath bezierPathWithRoundedRect:nodeNameTextWrapper.bounds byRoundingCorners:(UIRectCornerTopRight|UIRectCornerTopLeft) cornerRadii:CGSizeMake(5, 5)];
  CAShapeLayer *itemViewMaskLayer = [CAShapeLayer layer];
  itemViewMaskLayer.path = itemViewCornersPath.CGPath;
  itemView.layer.mask = itemViewMaskLayer;
  
  UILabel *itemText = [[UILabel alloc] init];
  [itemText setTextColor:[UIColor blackColor]];
  [itemText setBackgroundColor:[UIColor clearColor]];
  itemText.font = [UIFont fontWithName:@"Helvetica" size:10];
  [itemText setText:[list firstObject]];
  itemText.textAlignment = NSTextAlignmentLeft;
  CGSize itemTextSize = [nodeNameLabel intrinsicContentSize];
  
  NSInteger itemTextWidth = itemTextSize.width;
  
  // add text of '외 몇개' if number of ordered item is greater than one
  if ([list count] > 1) {
    UILabel *restItemNumText = [[UILabel alloc] init];
    restItemNumText.font = [UIFont fontWithName:@"Helvetica" size:10];
    [restItemNumText setText:[NSString stringWithFormat:@"외 %lu 개", [list count] - 1]];
    CGSize restItemNumTextSize = [restItemNumText intrinsicContentSize];
    [restItemNumText setFrame:CGRectMake(WIDTH - restItemNumTextSize.width - textLeftMargin, itemViewHeight/2 - restItemNumTextSize.height/2, restItemNumTextSize.width, restItemNumTextSize.height)];
    [itemView addSubview:restItemNumText];
    
    itemTextWidth = WIDTH - textLeftMargin * 2 - restItemNumTextSize.width;
  }
  
  [itemText setFrame:CGRectMake(textLeftMargin, itemViewHeight/2 - itemTextSize.height/2, itemTextWidth, itemTextSize.height)];
  [itemView addSubview:itemText];
  
  // [end draw item list]
  
  [_nodeMarkerView addSubview:itemView];
  [_nodeMarkerView addSubview:nodeNameTextWrapper];
  
  UIButton *nodeButton = [UIButton buttonWithType:UIButtonTypeSystem];
  [nodeButton setFrame:CGRectMake(0, 0, totalParentViewWidth, totalParentViewHeight)];
  nodeButton.backgroundColor = [UIColor clearColor];
  [nodeButton setTag:[self convertStringToAscii:tag]];
  [nodeButton addTarget:self action:@selector(markerButtonHoldDown:) forControlEvents:UIControlEventTouchDown];
  [nodeButton addTarget:self action:@selector(nodeMarkerButtonHoldRelease:) forControlEvents:UIControlEventTouchUpInside];
  [nodeButton addTarget:self action:@selector(markerButtonHoldReleaseOutside:) forControlEvents:UIControlEventTouchUpOutside];
  nodeButton.showsTouchWhenHighlighted = FALSE;
  
  itemView.userInteractionEnabled = NO;
  nodeNameTextWrapper.userInteractionEnabled = NO;
  
  [nodeButton addSubview:nodeNameTextWrapper];
  
  [_nodeMarkerView addSubview:nodeButton];
  
  return _nodeMarkerView;
}

- (UIView *)getDestStyleIconView: (NSString *)name tag:(NSString *)tag {
  NSInteger nameLabelHeight = 30;
  NSInteger triangleHeight = 20;
  NSInteger rightArrowImageWidth = 10;
  NSInteger textLeftMargin = 8;
  NSInteger offsetForShadow = 15;
  
  NSInteger totalParentViewHeight = nameLabelHeight + triangleHeight + offsetForShadow;
  NSInteger totalParentViewWidth;
  
  // MAKE SURE PARENT VIEW DOES NOT HAVE THE SAME TAG VALUE AS OF THE SUBVIEW!
  
  // [start draw dest name label]
  UILabel *destNameLabel = [[UILabel alloc] init];
  [destNameLabel setTextColor:[UIColor whiteColor]];
  [destNameLabel setBackgroundColor:[UIColor clearColor]];
  destNameLabel.font = [UIFont fontWithName:@"Helvetica" size:12];
  [destNameLabel setText:name];
  destNameLabel.textAlignment = NSTextAlignmentLeft;
  CGSize textSize = [destNameLabel intrinsicContentSize];
  
  NSInteger WIDTH = textLeftMargin + textSize.width + 16 + rightArrowImageWidth;
  totalParentViewWidth = WIDTH + offsetForShadow;
  
  [destNameLabel setFrame:CGRectMake(textLeftMargin, nameLabelHeight/2 - textSize.height/2, textSize.width, textSize.height)];
  
  UIView *destNameTextWrapper = [[UIView alloc] initWithFrame:CGRectMake(offsetForShadow/2, offsetForShadow, WIDTH, nameLabelHeight)];
  destNameTextWrapper.backgroundColor = [UIColor blackColor];
  [destNameTextWrapper addSubview:destNameLabel];
  
  // add roundedCorner on bottom left and right
  UIBezierPath *cornersPath = [UIBezierPath bezierPathWithRoundedRect:destNameTextWrapper.bounds byRoundingCorners:(UIRectCornerBottomLeft|UIRectCornerBottomRight|UIRectCornerTopLeft|UIRectCornerTopRight) cornerRadii:CGSizeMake(5, 5)];
  CAShapeLayer *maskLayer = [CAShapeLayer layer];
  maskLayer.path = cornersPath.CGPath;
  destNameTextWrapper.layer.mask = maskLayer;
  // [end draw node name label]
  
  // [start draw right-arrow image]
  NSInteger rightArrowImageHeight = textSize.height - 6;
  NSInteger rightArrowImageLeft = (textLeftMargin + textSize.width)/2 + WIDTH/2 - rightArrowImageWidth/2;
  UIImageView * rightArrowImageView = [[UIImageView alloc] initWithFrame:CGRectMake(rightArrowImageLeft, nameLabelHeight/2 - rightArrowImageHeight/2, rightArrowImageWidth, rightArrowImageHeight)];
  rightArrowImageView.image = [UIImage imageNamed:@"right-arrow.png"];
  rightArrowImageView.backgroundColor = [UIColor clearColor];
  [destNameTextWrapper addSubview:rightArrowImageView];
  // [end draw right-arrow image]
  
  _destMarkerView  = [[UIView alloc] initWithFrame:CGRectMake(0, 0, totalParentViewWidth, totalParentViewHeight)];
  _destMarkerView.backgroundColor = [UIColor clearColor];
  _destMarkerView.layer.shadowOffset = CGSizeMake(0, 3);
  _destMarkerView.layer.shadowColor = [UIColor blackColor].CGColor;
  _destMarkerView.layer.shadowRadius = 3.0;
  _destMarkerView.layer.shadowOpacity = .5;
  
  UIButton *destButton = [UIButton buttonWithType:UIButtonTypeSystem];
  [destButton setFrame:CGRectMake(0, 0, totalParentViewWidth, totalParentViewHeight)];
  destButton.backgroundColor = [UIColor clearColor];
  [destButton setTag:[self convertStringToAscii:tag]];
  [destButton addTarget:self action:@selector(markerButtonHoldDown:) forControlEvents:UIControlEventTouchDown];
  [destButton addTarget:self action:@selector(destMarkerButtonHoldRelease:) forControlEvents:UIControlEventTouchUpInside];
  [destButton addTarget:self action:@selector(markerButtonHoldReleaseOutside:) forControlEvents:UIControlEventTouchUpOutside];
  destButton.showsTouchWhenHighlighted = FALSE;
  
  destNameTextWrapper.userInteractionEnabled = NO;

  [destButton addSubview:destNameTextWrapper];
  
  [_destMarkerView addSubview:destButton];
  
  return _destMarkerView;
}

- (void)markerButtonHoldDown: (UIButton *)sender {
  NSInteger index = sender.tag;
  NSLog(@"dest button holding down with tag: %ld", (long)index);
  for (UIView *i in sender.subviews) {
    i.backgroundColor = [UIColor grayColor];
  }
}

- (void)destMarkerButtonHoldRelease:(UIButton *)sender {
  NSInteger index = sender.tag;
  NSLog(@"dest button hold released with tag: %ld", (long)index);
  for (UIView *i in sender.subviews) {
    i.backgroundColor = [UIColor blackColor];
  }
  for (NSDictionary *item in _markers) {
    NSInteger convertedTag = [self convertStringToAscii:item[@"id"]];
    if ([item[@"type"]  isEqual: @"dest"] && sender.tag == convertedTag) {
      if (self.onMarkerPress) {
        self.onMarkerPress([self eventMarkerPress:_destMarkerCoordinate type:item[@"type"] nodeId:item[@"id"]]);
      }
    }
  }
}

- (void)nodeMarkerButtonHoldRelease:(UIButton *)sender {
  NSInteger index = sender.tag;
  NSLog(@"dest button hold released with tag: %ld", (long)index);
  for (UIView *i in sender.subviews) {
    i.backgroundColor = [UIColor blackColor];
  }
  for (NSDictionary *item in _markers) {
    NSInteger convertedTag = [self convertStringToAscii:item[@"id"]];
    if ([item[@"type"]  isEqual: @"node"] && sender.tag == convertedTag) {
      if (self.onMarkerPress) {
        self.onMarkerPress([self eventMarkerPress:_destMarkerCoordinate type:item[@"type"] nodeId:item[@"id"]]);
      }
    }
  }
}

- (void)markerButtonHoldReleaseOutside:(UIButton *)sender {
  NSInteger index = sender.tag;
  NSLog(@"dest button released outside with tag: %ld", (long)index);
  for (UIView *i in sender.subviews) {
    i.backgroundColor = [UIColor blackColor];
  }
}

- (NSInteger)convertStringToAscii: (NSString *)str {
  NSInteger combinedAscii = 0;
  for (NSInteger charIdx=0; charIdx<str.length; charIdx++) {
    int asciiCode = [str characterAtIndex:charIdx];
    int digits = (int) ceil(log10(combinedAscii));
    combinedAscii += asciiCode * digits;
  }
  return combinedAscii;
}

- (void)updateMarker: (NSString *)latitude longitude:(NSString *)longitude {
  if (_marker == nil) {
    _marker = [GMSMarker markerWithPosition:CLLocationCoordinate2DMake(latitude.doubleValue, longitude.doubleValue)];
    
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
  NSLog(@"fitToCoordinates");
  for (VinylMapCoordinate *coordinate in coordinates) {
    bounds = [bounds includingCoordinate:coordinate.coordinate];
  }

  // Set Map viewport
  CGFloat top = [RCTConvert CGFloat:edgePadding[@"top"]];
  CGFloat right = [RCTConvert CGFloat:edgePadding[@"right"]];
  CGFloat bottom = [RCTConvert CGFloat:edgePadding[@"bottom"]];
  CGFloat left = [RCTConvert CGFloat:edgePadding[@"left"]];
  
  [_map animateWithCameraUpdate:[GMSCameraUpdate fitBounds:bounds withEdgeInsets:UIEdgeInsetsMake(top, left, bottom, right)]];
}

- (void)drawDirections:(nullable NSString *)encodedPath
{
  GMSPath *polyLinePath = [GMSPath pathFromEncodedPath:encodedPath];
  
  // CAShapeLayer *layer = [self layerFromGMSMutablePath:polyLinePath];
  
  GMSPolyline* polyline = [GMSPolyline polylineWithPath:polyLinePath];
  polyline.strokeColor = [UIColor redColor];
  polyline.strokeWidth = 3.f;
  polyline.map = _map;
  
  [NSTimer scheduledTimerWithTimeInterval:0.1 repeats:true block:^(NSTimer * _Nonnull timer) {
    [self animatePolyLinePath:polyLinePath];
  }];
}

- (void)animatePolyLinePath:(GMSPath *)path {
  dispatch_async(dispatch_get_main_queue(), ^{
    if (i < path.count) {
      [_pathForAnim addCoordinate:[path coordinateAtIndex:i]];
      _polylineAnim = [GMSPolyline polylineWithPath:_pathForAnim];
      _polylineAnim.strokeWidth = 3;
      _polylineAnim.strokeColor = [UIColor greenColor];
      _polylineAnim.map = _map;
      i++;
    } else {
      i = 0;
      _pathForAnim = [[GMSMutablePath alloc] init];
      _polylineAnim.map = nil;
    }
  });
}

-(CAShapeLayer *)layerFromGMSMutablePath:(GMSPath *)path{
  UIBezierPath *bezierPath = [UIBezierPath bezierPath];
  
  CLLocationCoordinate2D firstCoordinate = [path coordinateAtIndex:0];
  [bezierPath moveToPoint:[_map.projection pointForCoordinate:firstCoordinate]];
  
  for(int i=1; i<path.count; i++){
    CLLocationCoordinate2D coordinate = [path coordinateAtIndex:i];
    [bezierPath addLineToPoint:[_map.projection pointForCoordinate:coordinate]];
  }
  
  CAShapeLayer *shapeLayer = [CAShapeLayer layer];
  shapeLayer.path = [[bezierPath bezierPathByReversingPath] CGPath];
  shapeLayer.strokeColor = [[UIColor redColor] CGColor];
  shapeLayer.lineWidth = 4.0;
  shapeLayer.fillColor = [[UIColor clearColor] CGColor];
  shapeLayer.lineJoin = kCALineJoinRound;
  shapeLayer.lineCap = kCALineCapRound;
  shapeLayer.cornerRadius = 5;
  
  return shapeLayer;
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
  NSLog(@"didTapMarker");
  NSArray *filtered = [_markers filteredArrayUsingPredicate:[NSPredicate predicateWithFormat:@"(marker == %@)", marker]];
  NSDictionary *item = [filtered objectAtIndex:0];
  if (self.onMarkerPress) {
    self.onMarkerPress([self eventMarkerPress:marker.position type:item[@"type"] nodeId:item[@"id"]]);
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
  CGSize screenSize = [UIScreen mainScreen].bounds.size;
  CGPoint endPoint = CGPointMake(screenSize.width, screenSize.height);
  
  CGPoint mapCenter = [mapView.projection pointForCoordinate:[mapView.camera target]];
  
  if (_destMarkerView != nil && [_destMarkerView superview] != nil) {
    CGPoint markerCenter = [mapView.projection pointForCoordinate:_destMarkerCoordinate];
    CGSize viewSize = _destMarkerView.frame.size;
    CGFloat newCenterX = mapCenter.x;
    CGFloat newCenterY = mapCenter.y;
    
    BOOL shouldAnimate = false;
    NSString * destMarkerPosY;
    NSString * destMarkerPosX;
    
    if (0 > markerCenter.x) {
      newCenterX = 0;
    } else if (endPoint.x < markerCenter.x) {
      newCenterX = endPoint.x;
    } else if (mapCenter.x > markerCenter.x) {
      newCenterX = markerCenter.x + viewSize.width/2;
      destMarkerPosX = AT_LEFT;
    } else if (mapCenter.x < markerCenter.x) {
      newCenterX = markerCenter.x - viewSize.width/2;
      destMarkerPosX = AT_RIGHT;
    }
    
    if (0 > markerCenter.y) {
      newCenterY = 0;
    } else if (endPoint.y < markerCenter.y) {
      newCenterY = endPoint.y;
    } else if (mapCenter.y > markerCenter.y) {
      newCenterY = markerCenter.y + viewSize.height/2;
      destMarkerPosY = AT_TOP;
    } else if (mapCenter.y < markerCenter.y) {
      newCenterY = markerCenter.y - viewSize.height/2;
      destMarkerPosY = AT_BOTTOM;
    }
    
    if (destMarkerPosX != _destMarkerLastPosX || destMarkerPosY != _destMarkerLastPosY) {
      shouldAnimate = true;
    }
    _destMarkerLastPosX = destMarkerPosX;
    _destMarkerLastPosY = destMarkerPosY;
    
    if (shouldAnimate == true) {
      [UIView beginAnimations:nil context:nil];
      [UIView setAnimationDuration:0.3];
      [UIView setAnimationDelay:0];
      [UIView setAnimationCurve:UIViewAnimationCurveEaseOut];
    }
    _destMarkerView.center = CGPointMake(newCenterX, newCenterY);
    
    if (shouldAnimate == true) {
      [UIView commitAnimations];
    }
  }
  
  if (_nodeMarkerView != nil && [_nodeMarkerView superview] != nil) {
    CGPoint markerCenter = [mapView.projection pointForCoordinate:_nodeMarkerCoordinate];
    CGSize viewSize = _nodeMarkerView.frame.size;
    CGFloat newCenterX = mapCenter.x;
    CGFloat newCenterY = mapCenter.y;
    
    BOOL shouldAnimate = false;
    NSString *nodeMarkerPosY;
    NSString *nodeMarkerPosX;
    
    if (0 > markerCenter.x) {
      newCenterX = 0;
    } else if (endPoint.x < markerCenter.x) {
      newCenterX = endPoint.x;
    } else if (mapCenter.x > markerCenter.x) {
      newCenterX = markerCenter.x + viewSize.width/2;
      nodeMarkerPosX = AT_LEFT;
    } else if (mapCenter.x < markerCenter.x) {
      newCenterX = markerCenter.x - viewSize.width/2;
      nodeMarkerPosX = AT_RIGHT;
    }
    
    if (0 > markerCenter.y) {
      newCenterY = 0;
    } else if (endPoint.y < markerCenter.y) {
      newCenterY = endPoint.y;
    } else if (mapCenter.y > markerCenter.y) {
      newCenterY = markerCenter.y + viewSize.height/2;
      nodeMarkerPosY = AT_TOP;
    } else if (mapCenter.y < markerCenter.y) {
      newCenterY = markerCenter.y - viewSize.height/2;
      nodeMarkerPosY = AT_BOTTOM;
    }
    
    if (nodeMarkerPosX != _nodeMarkerLastPosX || nodeMarkerPosY != _nodeMarkerLastPosY) {
      shouldAnimate = true;
    }
    _nodeMarkerLastPosX = nodeMarkerPosX;
    _nodeMarkerLastPosY = nodeMarkerPosY;
    
    if (shouldAnimate == true) {
      [UIView beginAnimations:nil context:nil];
      [UIView setAnimationDuration:0.3];
      [UIView setAnimationDelay:0];
      [UIView setAnimationCurve:UIViewAnimationCurveEaseOut];
    }
    _nodeMarkerView.center = CGPointMake(newCenterX, newCenterY);
    if (shouldAnimate == true) {
      [UIView commitAnimations];
    }
  }
}

@end
