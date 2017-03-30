import React, { Component, PropTypes } from 'react';
import {
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Text,
  View
} from 'react-native';

const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;

const styles = {
  // TBD
};

export default class AddProduct extends Component {
  render() {
    return (
      <View style={{height: 667, paddingTop: 90}}>
        <ScrollView
          style={{
            width: WIDTH,
            backgroundColor: 'white',
            paddingLeft: 40,
            paddingTop: 74
          }}
        >
          <Text>Find store</Text>
          <View style={{
            width: WIDTH - 80,
            height: 174,
            backgroundColor: 'white',
            marginTop: 12,
            marginBottom: 38,
            shadowOffset: {height: 3, width: 0},
            shadowOpacity: 0.2
          }}>

          </View>
          <Text>Add product</Text>
          <View style={{
            height: 70,
            width: WIDTH - 80,
            shadowOffset: {height: 3, width: 0},
            shadowOpacity: 0.2,
            marginTop: 12,
            marginBottom: 12
          }}>

          </View>
          <View style={{
            height: 70,
            width: WIDTH - 80,
            shadowOffset: {height: 3, width: 0},
            shadowOpacity: 0.2,
            marginTop: 12,
            marginBottom: 12
          }}>

          </View>
          <View style={{
            height: 70,
            width: WIDTH - 80,
            shadowOffset: {height: 3, width: 0},
            shadowOpacity: 0.2,
            marginTop: 12,
            marginBottom: 12
          }}>

          </View>
        </ScrollView>
      </View>
    );
  }
}

AddProduct.propTypes = {
  address: PropTypes.string,
  handleApproveBtn: PropTypes.func
};
