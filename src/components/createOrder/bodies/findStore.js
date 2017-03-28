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
  // TBD
};

export default class FindStore extends Component {
  render() {
    return (
      <View style={{
        flex: 1,
        marginTop: 90,
        backgroundColor: 'yellow',
        flexDirection: 'column'
      }}>
        <View style={{
          height: 58,
          width: WIDTH,
          backgroundColor: 'yellow',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingLeft: 40,
          paddingRight: 40
        }}>
          <Text>CU</Text>
          <Text>7eleven</Text>
          <Text>GS25</Text>
          <Text>Ministop</Text>
        </View>
        <View style={{
          flex: 1,
          backgroundColor: 'white'
        }}>

        </View>
      </View>
    );
  }
}
