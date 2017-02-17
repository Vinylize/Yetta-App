import React, { Component, PropTypes } from 'react';
import {
  Text,
  View,
  Dimensions,
  LayoutAnimation,
  Keyboard,
  PanResponder,
  Platform,
  NativeModules,
  TextInput,
  TouchableOpacity,
  Animated,
  Easing
} from 'react-native';
import * as firebase from 'firebase';
import {
  portOrShipNavigatorRoute
} from '../navigator/navigatorRoutes';
import VinylMapAndroid from './VinylMapAndroid';
import VinylMapIOS from './VinylMapIOS';
import SearchBar from './searchBar';
//let vmm = NativeModules.VinylMapManager;
let vmm = NativeModules.VinylMap;

const styles = {
  container: {
    flex: 1
  }
};

const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;
const cardWidth = WIDTH * 0.92;
const expandedCardHeight = HEIGHT * 0.43;
const cardHeight = 90;
const cardInitBottom = -expandedCardHeight + cardHeight;

export default class Home extends Component {
  constructor() {
    super();
    this.state = {
      text: '',
      toggle: false,
      longitude: undefined,
      latitude: undefined,
      menuClicked: false,
      shrinkValue: new Animated.Value(1),
      markerTest: false,
      markerClicked: false,
      clickedMarkerID: undefined,
      animatedCardLeftVal: new Animated.Value(0),
      animatedCardBottomVal: new Animated.Value(cardInitBottom),
      cardIndex: 0,
      cardExpanded: false,
      busyOnCardMoveX: false,
      busyOnCardMoveY: false,
      processState: 2
    };
  }

  componentWillMount() {
    this.cardPanResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: this.cardHandlePanResponderGrant.bind(this),
      onPanResponderMove: this.cardHandlePanResponderMove.bind(this),
      onPanResponderRelease: this.cardHandlePanResponderRelease.bind(this)
    });
  }

  componentDidMount() {
    console.log(NativeModules.VinylMap);
    // if (this.state.first) {
    //   firebase.auth().onAuthStateChanged((user) => {
    //     if (user) {
    //       // firebase.auth().getToken().then(console.log);
    //       this.props.navigator.push(portOrShipNavigatorRoute());
    //     } else {
    //       // TBD
    //     }
    //   });
    // }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { longitude, latitude } = position.coords;
        this.setState({
          longitude: longitude,
          latitude: latitude
        });
      },
      (error) => {
        console.log(JSON.stringify(error));
      },
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
  }

  cardHandlePanResponderGrant() {
    // TBD
  }

  cardHandlePanResponderMove(e, gestureState) {
    const { dx, dy } = gestureState;
    const { busyOnCardMoveX, busyOnCardMoveY, cardExpanded } = this.state;
    if (!busyOnCardMoveY) {
      if (busyOnCardMoveX || (Math.abs(dx) > 5 && Math.abs(dy) < 10)) {
        this.setState({busyOnCardMoveX: true});
        this.refViewCardContainer.setNativeProps({style: {left: dx}});
      } else if (cardInitBottom - dy <= 0 && !busyOnCardMoveX) {
        if (busyOnCardMoveX === false) {
          let cardBottomValOnTouch;
          if (cardExpanded) {
            cardBottomValOnTouch = (dy >= 0) ? -dy : 0;
          } else {
            cardBottomValOnTouch = cardInitBottom - dy;
          }
          this.refViewCardContainer.setNativeProps({style: {bottom: cardBottomValOnTouch}});
        }
      }
    }
  }

  cardHandlePanResponderRelease(e, gestureState) {
    const { dx, dy } = gestureState;
    const { busyOnCardMoveX, busyOnCardMoveY, cardExpanded } = this.state;
    if (!busyOnCardMoveY) {
      if (Math.abs(dx) < WIDTH / 4 && dy === 0) {
        this.animateCardPosResetX(dx);
      } else if (busyOnCardMoveX && dx > 0) {
        // move card to the left
        this.animateCardPosLeft(dx);
      } else if (busyOnCardMoveX && dx < 0) {
        // move card to the right
        this.animateCardPosRight(dx);
      } else if (dy < 0 && !cardExpanded) {
        // expand card
        this.setState({busyOnCardMoveY: true});
        this.animateCardExpand(dy);
      } else if (dy > 0 && cardExpanded) {
        // shrink card after expanded
        this.animateCardPosResetY(dy);
      } else if (dy > 0 && !cardExpanded) {
        // hide card
        this.animateCardHide(dy);
      }
      this.setState({
        busyOnCardMoveX: false
      });
    }
  }

  animateCardPosResetX(left) {
    this.state.animatedCardLeftVal.setValue(left);
    Animated.timing(
      this.state.animatedCardLeftVal,
      {
        toValue: 0,
        duration: 100,
        easing: Easing.linear
      }
    ).start();
  }

  animateCardPosResetY(dy) {
    this.state.animatedCardBottomVal.setValue(-dy);
    Animated.timing(
      this.state.animatedCardBottomVal,
      {
        toValue: cardInitBottom,
        duration: 100,
        easing: Easing.linear
      }
    ).start(() => {
      this.setState({
        cardExpanded: false
      })
    });
  }

  animateCardPosLeft(left) {
    this.state.animatedCardLeftVal.setValue(left);
    Animated.timing(
      this.state.animatedCardLeftVal,
      {
        toValue: cardWidth + 10,
        duration: 200,
        easing: Easing.linear
      }
    ).start(() => {
      this.setState({cardIndex: this.state.cardIndex - 1});
      this.refViewCardContainer.setNativeProps({style: {left: 0}});
      this.state.animatedCardLeftVal.setValue(0);
    });
  }

  animateCardPosRight(left) {
    this.state.animatedCardLeftVal.setValue(left);
    Animated.timing(
      this.state.animatedCardLeftVal,
      {
        toValue: -cardWidth - 10,
        duration: 200,
        easing: Easing.linear
      }
    ).start(() => {
      this.setState({cardIndex: this.state.cardIndex + 1});
      this.refViewCardContainer.setNativeProps({style: {left: 0}});
      this.state.animatedCardLeftVal.setValue(0);
    });
  }

  animateCardExpand(dy) {
    if (cardInitBottom - dy <= 0) {
      this.state.animatedCardBottomVal.setValue(cardInitBottom - dy);
      Animated.timing(
        this.state.animatedCardBottomVal,
        {
          toValue: 0,
          duration: 100,
          easing: Easing.linear
        }
      ).start(() => {
        this.setState({
          busyOnCardMoveY: false,
          cardExpanded: true
        });
      });
    } else {
      this.state.animatedCardBottomVal.setValue(0);
      this.setState({
        busyOnCardMoveY: false,
        cardExpanded: true
      });
    }
  }

  animateCardAppear() {
    this.state.animatedCardBottomVal.setValue(-expandedCardHeight);
    Animated.timing(
      this.state.animatedCardBottomVal,
      {
        toValue: cardInitBottom,
        duration: 100,
        easing: Easing.linear
      }
    ).start();
  }

  animateCardHide(dy) {
    this.state.animatedCardBottomVal.setValue(cardInitBottom - dy);
    Animated.timing(
      this.state.animatedCardBottomVal,
      {
        toValue: -expandedCardHeight,
        duration: 100,
        easing: Easing.linear
      }
    ).start(() => {
      this.setState({markerClicked: false});
    });
  }

  renderMap() {
    if (Platform.OS === 'ios') {
      return (
        <VinylMapIOS
          style={{flex: 1}}
          onPress={(e) => {
            // console.log(e.nativeEvent);
          }}
          onMarkerPress={(e) => {
            // console.log(e.nativeEvent);
            if (this.state.markerClicked === false) {
              // marker is clicked
              this.animateCardAppear();
            }
            this.setState({markerClicked: !this.state.markerClicked});
          }}
        />
      )
    }
    return (
      <VinylMapAndroid style={{flex: 1}}/>
    )
  }

  renderSearchBar() {
    return (
      <View style={{
        position: 'absolute',
        left: (WIDTH - WIDTH * 0.8) / 2,
        top: 100,
        width: WIDTH * 0.8,
        height: 40,
        backgroundColor: 'white',
        shadowOffset: {height: 1, width: 1},
        shadowOpacity: 0.2,
        flexDirection: 'row'
      }}>
        <View style={{flex: 1}}>

        </View>
        <View style={{flex: 10}}>
          <TextInput
            style={{height: 40, borderColor: 'gray', borderWidth: 0}}
            onChangeText={(text) => this.setState({text})}
            value={this.state.text}
          />
        </View>
      </View>
    )
  }

  renderSwitch() {
    const { toggle } = this.state;
    return (
      <View style={{
        position: 'absolute',
        left: (WIDTH - WIDTH * 0.5) / 2,
        top: 40,
        width: WIDTH * 0.5,
        height: 30,
        backgroundColor: '#75797a',
        borderRadius: 20,
        shadowOffset: {height: 1, width: 1},
        shadowOpacity: 0.2
      }}>
        <TouchableOpacity
          style={{
            flex: 1,
            justifyContent: 'center',
            flexDirection: 'row'
          }}
          onPress={() => {
            LayoutAnimation.easeInEaseOut();
            this.setState({toggle: !toggle});
          }}
          activeOpacity={1}
        >
          <View style={[{
              position: 'absolute',
              top: 2,
              width: WIDTH * 0.25,
              height: 31 - 5,
              backgroundColor: 'white',
              borderRadius: 20,
          }, (toggle) ? {right: 4} : {left: 4}]}/>
          <View style={{
            flex: 1,
            backgroundColor: 'transparent',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Text style={{color: (toggle) ? 'white' : '#75797a'}}>Port</Text>
          </View>
          <View style={{
            flex: 1,
            backgroundColor: 'transparent',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Text style={{color: (toggle) ? '#75797a' : 'white'}}>Ship</Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  renderLocationBtn() {
    return (
      <TouchableOpacity
        style={{
          position: 'absolute',
          right: 26,
          bottom: 80,
          height: 25,
          width: 25,
          borderRadius: 20,
          backgroundColor: '#2E3031',
          shadowOffset: {height: 1, width: 1},
          shadowOpacity: 0.2
        }}
        activeOpacity={0.8}
        onPress={() => {
          const { latitude, longitude } = this.state;
          console.log(latitude, longitude);
          vmm.animateToLocation(String(latitude), String(longitude));
        }}
      >

      </TouchableOpacity>
    )
  }

  renderMenu() {
    const { menuClicked } = this.state;
    return (
      <TouchableOpacity
        style={{
          position: 'absolute',
          left: 20,
          top: 46,
          backgroundColor: 'transparent',
          width: 24,
          height: 20
        }}
        onPress={() => {
          LayoutAnimation.easeInEaseOut();
          this.setState({menuClicked: !menuClicked});
          if (this.state.menuClicked) {
            this.animateBack();
          } else {
            this.animateShrink();
          }
        }}
        activeOpacity={1}
      >
        <View style={(menuClicked) ? {
          position: 'absolute',
          left: 0,
          top: 0,
          width: 15,
          height: 3,
          backgroundColor: '#2E3031',
          transform: [{rotate: '45deg'}]
          } : {
          position: 'absolute',
          left: 0,
          top: 0,
          width: 24,
          height: 3,
          backgroundColor: '#2E3031',
        }}/>
        <View style={(menuClicked) ? {
          position: 'absolute',
          left: 9,
          top: 0,
          width: 15,
          height: 3,
          backgroundColor: '#2E3031',
          transform: [{rotate: '-45deg'}]
          } : {
          position: 'absolute',
          left: 0,
          top: 7,
          width: 24,
          height: 3,
          backgroundColor: '#2E3031',
        }}/>
        <View style={(menuClicked) ? {
          position: 'absolute',
          left: 4.5,
          top: 12,
          width: 15,
          height: 3,
          backgroundColor: '#2E3031',
          transform: [{rotate: '90deg'}]
          } : {
          position: 'absolute',
          left: 0,
          top: 14,
          width: 24,
          height: 3,
          backgroundColor: '#2E3031',
        }}/>
      </TouchableOpacity>
    )
  }

  renderCard(left, header) {
    return (
      <View
        style={{
          position: 'absolute',
          width: cardWidth,
          height: expandedCardHeight - 20,
          backgroundColor: 'white',
          left: left,
          flexDirection: 'column',
          shadowOffset: {height: 1, width: 2},
          shadowOpacity: 0.23
        }}
        {...this.cardPanResponder.panHandlers}
      >
        <View style={{
          flex: 1,
          flexDirection: 'row'
        }}>
          <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'flex-end'
          }}>
            <View style={{
              width: 56,
              height: 56,
              borderRadius: 50,
              backgroundColor: '#d8d8d8'
            }}/>
          </View>
          <View style={{
            flex: 3.5,
            flexDirection: 'row'
          }}>
            <View style={{
              flex: 4,
              flexDirection: 'column'
            }}>
              <View style={{
                flex: 1,
                justifyContent: 'flex-end',
                alignItems: 'flex-start'
              }}>
                <Text style={{
                  marginBottom: 3,
                  marginLeft: 12
                }}>{header}</Text>
              </View>
              <View style={{flex: 1}}>
                <Text style={{
                  marginTop: 6,
                  marginLeft: 12,
                  fontSize: 11,
                  color: '#adb3b4'
                }}>$3,500 - 4,500 (Delivery fee only)</Text>
              </View>
            </View>
            <View style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <View style={{
                width: 40,
                height: 40,
                backgroundColor: '#656266',
                borderRadius: 40,
                shadowOffset: {height: 3, width: 1},
                shadowOpacity: 0.4,
                shadowRadius: 5,
                marginRight: 25
              }}>

              </View>
            </View>
          </View>
        </View>
        {this.renderCardDetail()}
      </View>
    )
  }

  renderCardDetail() {
    return (
      <View
        style={{
          flex: 2,
          marginLeft: 20,
          marginRight: 20,
          borderTopWidth: 1,
          borderColor: '#f4f7f7',
          flexDirection: 'row'
        }}
      >
        <View style={{flex: 3}}>
          {this.renderProcess()}
        </View>
        <View style={{
          flex: 2,
          flexDirection: 'column'
        }}>
          <View style={{
            flex: 1,
            flexDirection: 'row'
          }}>
            <View style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <View style={{
                height: 40,
                width: 40,
                borderRadius: 40,
                backgroundColor: 'white',
                borderWidth: 1,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column'
              }}>
                <Text style={{
                  fontSize: 10
                }}>
                  32
                </Text>
                <Text style={{
                  fontSize: 11
                }}>
                  MIN
                </Text>
              </View>
            </View>
            <View style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <View style={{
                height: 40,
                width: 40,
                borderRadius: 40,
                backgroundColor: 'white',
                borderWidth: 1,
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <Text style={{
                  fontSize: 10
                }}>
                  0.5
                </Text>
                <Text style={{
                  fontSize: 11
                }}>
                  km
                </Text>
              </View>
            </View>
          </View>
          <View style={{
            flex: 1,
            flexDirection: 'column'
          }}>
            <View style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'flex-end',
              marginRight: 10
            }}>
              <Text style={{
                fontSize: 12,
                color: '#3aacff',
                fontWeight: 'bold'
              }}>
                See the receipt
              </Text>
            </View>
            <View style={{
              flex: 1,
              justifyContent: 'flex-end',
              alignItems: 'flex-end',
              marginRight: 10
            }}>
              <Text style={{
                fontSize: 13,
                color: 'black',
                fontWeight: 'bold',
                marginBottom: 20
              }}>
                Cancel
              </Text>
            </View>
          </View>
        </View>
      </View>
    )
  }

  renderProcess() {
    const renderDot = (index) => {
      return (
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <View style={{
            height: 11,
            width: 11,
            borderRadius: 10,
            backgroundColor: (index <= this.state.processState) ? '#2e3031' : '#eaefef'
          }}/>
        </View>
      )
    };
    const renderProcessLine = (index, top) => {
      // todo: fix style
      return (
        <View style={{
          position: 'absolute',
          left: 0,
          top: top,
          zIndex: -1
        }}>
          <View style={{
            position: 'absolute',
            left: (index < this.state.processState) ? 20 : 19,
            top: top,
            borderWidth: (index < this.state.processState) ? 1 : 2,
            borderStyle: (index < this.state.processState) ? 'solid': 'dotted',
            borderColor: (index < this.state.processState) ? '#2e3031' : '#eaefef',
            width: 0.1,
            height: 40
          }}/>
        </View>
      )
    };
    const renderTextProcess = (index, text) => {
      return (
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'flex-start'
        }}>
          <Text style={{
            fontSize: 11.4,
            color: (index <= this.state.processState) ? '#2e3031' : '#eaefef'
          }}>{text}</Text>
        </View>
      )
    };
    return (
      <View style={{
        flex: 1,
        flexDirection: 'row',
        marginTop: 20,
        marginBottom: 20
      }}>
        <View style={{
          flex: 1,
          flexDirection: 'column'
        }}>
          {renderDot(0)}
          {renderDot(1)}
          {renderDot(2)}
          {renderDot(3)}
          {renderProcessLine(0, 8)}
          {renderProcessLine(1, 25)}
          {renderProcessLine(2, 8 + 17 * 2)}
        </View>
        <View style={{
          flex: 3.4,
          flexDirection: 'column'
        }}>
          {renderTextProcess(0, 'Order accepted')}
          {renderTextProcess(1, 'Delivery started')}
          {renderTextProcess(2, 'Item bought')}
          {renderTextProcess(3, 'Delivery completed')}
        </View>
      </View>
    )
  }

  renderCardContainer() {
    const {
      markerClicked,
      animatedCardLeftVal,
      animatedCardBottomVal,
      cardIndex
    } = this.state;

    if (!markerClicked) {
      return null;
    }

    return (
      <Animated.View
        ref={component => this.refViewCardContainer = component} // eslint-disable-line
        style={{
          position: 'absolute',
          left: animatedCardLeftVal,
          bottom: animatedCardBottomVal,
          width: WIDTH,
          height: expandedCardHeight,
          backgroundColor: 'transparent'
        }}
      >
        {this.renderCard(-cardWidth, cardIndex - 1)}
        {this.renderCard(10, cardIndex)}
        {this.renderCard(cardWidth + 20, cardIndex + 1)}
      </Animated.View>
    )
  }

  animateShrink() {
    this.state.shrinkValue.setValue(1);
    Animated.timing(
      this.state.shrinkValue,
      {
        toValue: 0.7,
        duration: 100
      }
    ).start();
  }

  animateBack() {
    this.state.shrinkValue.setValue(0.7);
    Animated.timing(
      this.state.shrinkValue,
      {
        toValue: 1,
        duration: 100
      }
    ).start();
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#2E3031'}}>
        <Animated.View style={(this.state.menuClicked) ? {
          flex: 1, left: 20, transform: [{scale: this.state.shrinkValue}]
          } : {flex: 1, transform: [{scale: this.state.shrinkValue}]}}>
          {this.renderMap()}
          {this.renderMenu()}
          {this.renderSwitch()}
          <SearchBar
            latitude={this.state.latitude}
            longitude={this.state.longitude}
          />
          {this.renderLocationBtn()}
          <TouchableOpacity
            style={{
              position: 'absolute',
              right: 20,
              bottom: 20,
              height: 40,
              width: 40,
              borderRadius: 50,
              backgroundColor: 'white',
              shadowOffset: {height: 1, width: 2},
              shadowOpacity: 0.23
            }}
            onPress={() => {
              const { markerTest, latitude, longitude } = this.state;
              if (markerTest) {
                vmm.updateMarker(String(latitude), String(longitude));
              } else {
                vmm.updateMarker(String(latitude + 1), String(longitude + 1));
                vmm.addMarker(String(latitude - 0.5), String(longitude), 'testing marker 01');
              }
              this.setState({markerTest: !markerTest});
            }}
          />
          {this.renderCardContainer()}
        </Animated.View>
      </View>
    );
  }
}

Home.propTypes = {
  navigator: PropTypes.any
};
