import React, { PureComponent, PropTypes } from 'react';
import {
  ActivityIndicator,
  Animated,
  Platform,
  Text,
  View,
  LayoutAnimation,
  UIManager
} from 'react-native';
import RNBlur from 'react-native-blur';

const styles = {
  globalContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 300,
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent'
  }
};

const BlurView = ({children, ...rest}) => Platform.select({
  ios: <RNBlur.BlurView {...rest}>{children}</RNBlur.BlurView>,
  android: <View style={[rest.style, {backgroundColor: '#f9f9f9', opacity: 0.8}]}>{children}</View>
});

export default class UserModeTransition extends PureComponent {
  constructor() {
    super();
    this.state = {
      // TBD
    };
  }

  render() {
    if (Platform.OS === 'ios' && this.props.show === false) {
      return null;
    }
    return (
      <Animated.View style={[styles.globalContainer,
        (this.props.show) ? null : {opacity: 0, height: 0}
      ]}>
        <BlurView
          style={{
            width: 200,
            height: 200,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 20
          }}
          viewRef={this.props.refViewForBlurView}
          blurType="light"
          blurAmount={20}
        >
          <Text style={{
            fontSize: 24,
            fontWeight: '600',
            color: 'black'
          }}>
            {(this.props.isRunner) ? '러너로 변신중' : '오더로 변신중'}
          </Text>
        </BlurView>
      </Animated.View>
    );
  }
}

UserModeTransition.propTypes = {
  show: PropTypes.bool.isRequired,
  isRunner: PropTypes.bool.isRequired,
  refViewForBlurView: PropTypes.any
};
