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

const WIDTH = Dimensions.get('window').width;

const BlurView = ({children, ...rest}) => Platform.select({
  ios: <RNBlur.BlurView {...rest}>{children}</RNBlur.BlurView>,
  android: <View style={[rest.style, {backgroundColor: '#f9f9f9', opacity: 0.8}]}>{children}</View>
});

import loadingJSON from './../../../assets/lottie/loading-2.json';

export default class GlobalLoading extends PureComponent {
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
          blurAmount={10}
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
              width: 150,
              height: 150,
              left: (Platform.OS === 'ios') ? WIDTH / 30 : WIDTH / 18,
              backgroundColor: 'transparent'
            }}
            speed={1}
            source={loadingJSON}
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

GlobalLoading.propTypes = {
  show: PropTypes.bool.isRequired,
  refViewForBlurView: PropTypes.any,
  msg: PropTypes.string
};
