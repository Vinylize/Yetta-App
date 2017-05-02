import React, { PureComponent, PropTypes } from 'react';
import {
  Dimensions,
  // TouchableOpacity,
  ScrollView,
  Text,
  View
} from 'react-native';
import Header from './../header/header';

// const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;

// const styles = {
//   // TBD
// };

export default class AddProduct extends PureComponent {
  render() {
    return (
      <View style={{flex: 1}}>
        <Header
          back={this.props.back}
          next={this.props.next}
        />
        <ScrollView
          style={{
            width: WIDTH,
            backgroundColor: 'white',
            paddingLeft: 40,
            paddingTop: 74 + 90
          }}
        >
          <Text>상점 정보</Text>
          <View style={{
            width: WIDTH - 80,
            height: 174,
            backgroundColor: 'white',
            marginTop: 12,
            marginBottom: 38,
            shadowOffset: {height: 3, width: 1},
            shadowOpacity: 0.2,
            elevation: 5
          }} />
          <Text>물품 추가</Text>
          <View style={{
            height: 70,
            width: WIDTH - 80,
            backgroundColor: 'white',
            shadowOffset: {height: 3, width: 0},
            shadowOpacity: 0.2,
            marginTop: 12,
            marginBottom: 12,
            elevation: 3
          }} />
          <View style={{
            height: 70,
            width: WIDTH - 80,
            backgroundColor: 'white',
            shadowOffset: {height: 3, width: 0},
            shadowOpacity: 0.2,
            marginTop: 12,
            marginBottom: 12,
            elevation: 3
          }} />
          <View style={{
            height: 70,
            width: WIDTH - 80,
            backgroundColor: 'white',
            shadowOffset: {height: 3, width: 0},
            shadowOpacity: 0.2,
            marginTop: 12,
            marginBottom: 12,
            elevation: 3
          }} />
        </ScrollView>
      </View>
    );
  }
}

AddProduct.propTypes = {
  address: PropTypes.string,
  handleApproveBtn: PropTypes.func,
  next: PropTypes.func.isRequired,
  back: PropTypes.func.isRequired
};
