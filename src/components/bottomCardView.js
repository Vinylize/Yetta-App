import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  ActivityIndicator,
  Animated,
  Text,
  View,
  Dimensions,
  LayoutAnimation,
  PanResponder,
  Platform,
  Easing,
  ScrollView
} from 'react-native';

// [start redux functions]
import { setCardAppeared } from './../actions/componentsActions/bottomCardActions';
// [end redux functions]

// constants
const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;
const cardWidth = WIDTH * 0.92;
export const expandedCardHeight = HEIGHT * 0.43;
const cardHeight = 90;
export const cardInitBottom = -expandedCardHeight + cardHeight;
export const cardHidedBottom = -expandedCardHeight;
const PLATFORM_SPECIFIC = {
  animatedCardLeftVal: (Platform.OS === 'ios') ? 0 : -WIDTH
};

class BottomCardView extends Component {
  constructor() {
    super();
    this.state = {
      animatedCardLeftVal: new Animated.Value(PLATFORM_SPECIFIC.animatedCardLeftVal),
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
      onPanResponderMove: this.cardHandlePanResponderMove.bind(this),
      onPanResponderRelease: this.cardHandlePanResponderRelease.bind(this)
    });
  }

  cardHandlePanResponderMove(e, gestureState) {
    const { dx, dy } = gestureState;
    const { busyOnCardMoveX, busyOnCardMoveY, cardExpanded } = this.state;
    if (!busyOnCardMoveY) {
      if (busyOnCardMoveX || (Math.abs(dx) > 5 && Math.abs(dy) < 10)) {
        this.setState({busyOnCardMoveX: true});
        // this.refViewCardContainer.setNativeProps({style: {left: dx}});
      } else if (cardInitBottom - dy <= 0 && !busyOnCardMoveX) {
        if (busyOnCardMoveX === false) {
          let cardBottomValOnTouch;
          /* eslint-disable max-depth */
          if (cardExpanded) {
            /* eslint-enable max-depth */
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
    this.props.animatedCardBottomVal.setValue(-dy);
    Animated.timing(
      this.props.animatedCardBottomVal,
      {
        toValue: cardInitBottom,
        duration: 100,
        easing: Easing.linear
      }
    ).start(() => {
      this.setState({cardExpanded: false});
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
      // this.refViewCardContainer.setNativeProps({style: {left: 0}});
      // this.state.animatedCardLeftVal.setValue(0);
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
      // this.refViewCardContainer.setNativeProps({style: {left: 0}});
      // this.state.animatedCardLeftVal.setValue(0);
    });
  }

  animateCardExpand(dy) {
    if (cardInitBottom - dy <= 0) {
      this.props.animatedCardBottomVal.setValue(cardInitBottom - dy);
      Animated.timing(
        this.props.animatedCardBottomVal,
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
      this.props.animatedCardBottomVal.setValue(0);
      this.setState({
        busyOnCardMoveY: false,
        cardExpanded: true
      });
    }
  }

  animateCardHide(dy) {
    this.props.animatedCardBottomVal.setValue(cardInitBottom - dy);
    Animated.timing(
      this.props.animatedCardBottomVal,
      {
        toValue: -expandedCardHeight,
        duration: 100,
        easing: Easing.linear
      }
    ).start(() => {
      LayoutAnimation.easeInEaseOut();
      console.log(this.props.cardAppeared);
      this.props.setCardAppeared(false);
    });
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
      );
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
            borderStyle: (index < this.state.processState) ? 'solid' : 'dotted',
            borderColor: (index < this.state.processState) ? '#2e3031' : '#eaefef',
            width: 0.1,
            height: 40
          }}/>
        </View>
      );
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
      );
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
    );
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
    );
  }

  renderCard(foundRunner, id) {
    return (
      <View
        style={{
          width: cardWidth,
          height: expandedCardHeight - 20,
          backgroundColor: 'white',
          left: 20,
          flexDirection: 'column',
          shadowOffset: {height: 1, width: 2},
          shadowOpacity: 0.23,
          elevation: 2
        }}
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
            {(foundRunner === false) ?
              <ActivityIndicator
                animating={true}
                style={{
                  width: 56,
                  height: 56
                }}
                size="large"
              />
              :
              <View style={{
                width: 56,
                height: 56,
                borderRadius: 50,
                backgroundColor: '#d8d8d8'
              }}/>
            }
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
                }}>{this.props.busyOnWaitingNewRunner ?
                  '근처의 러너를 찾는중'
                  : id}</Text>
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
              }} />
            </View>
          </View>
        </View>
        {this.renderCardDetail()}
      </View>
    );
  }

  renderCardContainer() {
    return (
      <Animated.View
        ref={component => {
          this.refViewCardContainer = component;
        }}
        style={{
          position: 'absolute',
          left: 0,
          bottom: this.props.animatedCardBottomVal,
          width: WIDTH * 3,
          height: expandedCardHeight,
          zIndex: 1,
          backgroundColor: 'transparent',
          elevation: 40
        }}
      >
        <ScrollView
          style={{flex: 1}}
          horizontal
          /* having cardPanResponder in upper/lower component will stop ScrollView working properly */
          {...this.cardPanResponder.panHandlers}
        >
          <View style={{
            width: WIDTH * 5 + cardWidth,
            height: 100,
            flexDirection: 'row'
          }}>
            {this.props.orderStatusList.map(order => {
              const { foundRunner, id } = order;
              return this.renderCard(foundRunner, id);
            })}
          </View>
        </ScrollView>
      </Animated.View>
    );
  }

  render() {
    return this.renderCardContainer();
  }
}

BottomCardView.propTypes = {
  navigator: PropTypes.any,
  animatedCardBottomVal: PropTypes.any,

  // reducers/busyWaiting
  busyOnWaitingNewRunner: PropTypes.bool,

  // reducers/components/bottomCardView
  setCardAppeared: PropTypes.func,
  cardAppeared: PropTypes.bool,

  // reducers/orderStatus
  orderStatusList: PropTypes.array
};

function mapStateToProps(state) {
  return {
    animatedCardBottomVal: state.home.animatedCardBottomVal,
    busyOnWaitingNewRunner: state.home.busyOnWaitingNewRunner,
    cardAppeared: state.bottomCardView.cardAppeared,
    orderStatusList: state.orderStatus.orderStatusList
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    setCardAppeared: (cardAppeared) => dispatch(setCardAppeared(cardAppeared))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BottomCardView);
