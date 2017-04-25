import React, { PureComponent, PropTypes } from 'react';
import {
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

const BlurView = ({children, ...rest}) => Platform.select({
  ios: <RNBlur.BlurView {...rest}>{children}</RNBlur.BlurView>,
  android: <View style={[rest.style, {backgroundColor: '#f9f9f9', opacity: 0.8}]}>{children}</View>
});

export default class WholeScreenLoading extends PureComponent {
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
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
          }}
          viewRef={this.props.refViewForBlurView}
          blurType="dark"
          blurAmount={6}
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
              width: 200,
              height: 160,
              top: 100
            }}
            speed={1}
            source={require('./../../../assets/lottie/darkPreloader.json')}
            loop
          />
          <Text style={{
            fontSize: 24,
            fontWeight: '600',
            color: 'black',
            top: -24,
            alignSelf: 'center'
          }}>
            {(this.props.msg) ? this.props.msg : null}
          </Text>
        </BlurView>
      </View>
    );
  }
}

WholeScreenLoading.propTypes = {
  show: PropTypes.bool.isRequired,
  refViewForBlurView: PropTypes.any,
  msg: PropTypes.string
};
