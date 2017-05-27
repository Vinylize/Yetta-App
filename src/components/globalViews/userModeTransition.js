import React, { PureComponent, PropTypes } from 'react';
import {
  Dimensions,
  Platform,
  Text,
  View
} from 'react-native';
import RNBlur from 'react-native-blur';
import Animation from 'lottie-react-native';

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

// const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;

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
      <View style={[styles.globalContainer,
        (this.props.show) ? null : {opacity: 0, height: 0}
      ]}>
        <BlurView
          style={{
            width: 200,
            height: 200,
            borderRadius: 20
          }}
          viewRef={this.props.refViewForBlurView}
          blurType="light"
          blurAmount={20}
        >
          <Animation
            onLayout={() => {
              // run animation when this did mount
              this.lottieAnimation.play();
            }}
            ref={animation => {
              this.lottieAnimation = animation;
            }}
            style={{
              width: 225,
              height: 150,
              left: (Platform.OS === 'ios') ? -WIDTH / 70 : -WIDTH / 28
            }}
            speed={1}
            source={require('./../../../assets/lottie/loading-2.json')}
            loop
          />
          <Text style={{
            fontSize: 24,
            fontWeight: '600',
            color: 'black',
            top: -24,
            alignSelf: 'center'
          }}>
            {(!this.props.isRunner) ? '러너로 변신중' : '오더로 변신중'}
          </Text>
        </BlurView>
      </View>
    );
  }
}

UserModeTransition.propTypes = {
  show: PropTypes.bool.isRequired,
  isRunner: PropTypes.bool.isRequired,
  refViewForBlurView: PropTypes.any
};
