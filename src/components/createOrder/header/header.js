import React, { Component, PropTypes } from 'react';
import {
  Dimensions,
  TouchableOpacity,
  Text,
  View
} from 'react-native';

const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;

const styles = {
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: 90,
    width: WIDTH,
    backgroundColor: '#feffff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 20,
    zIndex: 1
  }
};

export default class Header extends Component {
  render() {
    return (
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={{left: 22}}
          onPress={this.props.back}
        >
          <Text>back</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

Header.propTypes = {
  back: PropTypes.func.isRequired
};
