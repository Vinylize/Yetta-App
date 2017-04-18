import React, { PureComponent, PropTypes } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Platform,
  View
} from 'react-native';
import RNBlur from 'react-native-blur';

const BlurView = ({children, ...rest}) => Platform.select({
  ios: <RNBlur.BlurView {...rest}>{children}</RNBlur.BlurView>,
  android: <View style={[rest.style, {backgroundColor: 'rgba(16,16,16,0.9)'}]}>{children}</View>
});

const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;

const styles = {
  globalContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 10,
    justifyContent: 'center',
    alignItems: 'center'
  }
};

export default class GlobalLoading extends PureComponent {
  render() {
    if (Platform.OS === 'ios' && this.props.show === false) {
      return null;
    }
    return (
      <View style={[styles.globalContainer,
        (this.props.show) ? null : {height: 0}
      ]}>
        <BlurView
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0
          }}
          viewRef={this.props.refViewForBlurView}
          blurType="light"
          blurAmount={5}
        />
        <ActivityIndicator
          animating={true}
          style={{
            width: 56,
            height: 56
          }}
          size="large"
        />
      </View>
    );
  }
}

GlobalLoading.propTypes = {
  refViewForBlurView: PropTypes.any,
  show: PropTypes.bool.isRequired
};
