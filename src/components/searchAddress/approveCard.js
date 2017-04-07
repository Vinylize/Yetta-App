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

export default class ApproveCard extends Component {
  render() {
    console.log(this.props.address.addressTextView);
    return (
      <View style={{
        position: 'absolute',
        bottom: 0,
        left: WIDTH * 0.1,
        width: WIDTH * 0.8,
        height: 100,
        backgroundColor: 'white',
        zIndex: 10,
        shadowOffset: {height: 3, width: 3},
        shadowOpacity: 0.3,
        flexDirection: 'column'
      }}>
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          marginLeft: 5,
          marginRight: 5,
          flexDirection: 'column'
        }}>
          <Text style={{marginTop: 5}}>
            {this.props.address.firstAddressToken}
          </Text>
          <View style={{
            flexDirection: 'row',
            marginTop: 4
          }}>
            <Text
              style={{
                fontSize: 10,
                color: 'grey'
              }}
              numberOfLines={1}
            >
              {this.props.address.addressTextView}
            </Text>
          </View>
        </View>
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <TouchableOpacity
            style={{
              height: 30,
              width: WIDTH * 0.7,
              backgroundColor: '#75797a',
              justifyContent: 'center',
              alignItems: 'center',
              margin: 10,
              borderRadius: 5,
              marginBottom: 15
            }}
            onPress={this.props.handleApproveBtn}
          >
            <Text style={{color: 'white'}}>
              이 주소로 주문하기
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

ApproveCard.propTypes = {
  address: PropTypes.object,
  handleApproveBtn: PropTypes.func
};
