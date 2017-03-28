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
    justifyContent: 'center',
    paddingTop: 20,
    zIndex: 1
  },
  headerLeftItem: {
    position: 'absolute',
    left: 22,
    top: 47
  }
};

export default class Header extends Component {
  render() {
    return (
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.headerLeftItem}
          onPress={this.props.back}
        >
          <Text>back</Text>
        </TouchableOpacity>
        <Text style={{
          fontSize: 16
        }}>
          Find store
        </Text>
        {(this.props.next) ?
        <TouchableOpacity
          style={{
            position: 'absolute',
            top: 0,
            right: 22,
            paddingTop: 47,
            zIndex: 1
          }}
          onPress={this.props.next}
        >
          <Text>next</Text>
        </TouchableOpacity>
          : null
        }
      </View>
    );
  }
}

Header.propTypes = {
  back: PropTypes.func.isRequired,
  next: PropTypes.func
};
