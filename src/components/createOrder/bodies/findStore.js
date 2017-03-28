import React, { Component, PropTypes } from 'react';
import {
  Dimensions,
  TouchableOpacity,
  Text,
  View,
  ListView
} from 'react-native';

const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;

const styles = {
  // TBD
};

export default class FindStore extends Component {
  constructor() {
    super();
  }
  renderVerticalRow() {
    return (
      <TouchableOpacity
        style={{
          width: WIDTH * 0.83,
          height: 100,
          backgroundColor: 'white',
          shadowOffset: {height: 3, width: 3},
          shadowOpacity: 0.3,
          margin: 10,
          flexDirection: 'column',
          justifyContent: 'center',
          paddingLeft: 30
        }}
        onPress={this.props.handleNextBtn}
      >
        <Text>
          CU Jongro K twin tower
        </Text>
        <Text style={{
          fontSize: 12,
          color: '#abb5b6',
          marginTop: 10
        }}>
          50 Jong-ro 1-gil, Jongno-gu, Seoul
          Everyday, 00:00~24:00
        </Text>
      </TouchableOpacity>
    );
  }

  renderBrandListRow(name) {
    return (
      <Text style={{
        marginRight: 58
      }}>{name}</Text>
    );
  }

  render() {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    const { selectedBrand } = this.props;
    let brandList;
    let arr = [];
    if (selectedBrand === '편의점') {
      arr = ['CU', '7eleven', 'GS25', 'Ministop'];
    } else if (selectedBrand === '음식점') {
      arr = ['한식', '중식', '양식', '기타'];
    } else {
      arr = [1,2,3,4,5,6,7,8,9];
    }
    brandList = ds.cloneWithRows(arr);
    return (
      <View style={{
        flex: 1,
        marginTop: 90,
        backgroundColor: 'white',
        flexDirection: 'column'
      }}>
        <View style={{
          height: 58,
          width: WIDTH,
          backgroundColor: 'white',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingLeft: 40,
          paddingRight: 40
        }}>
          <ListView
            dataSource={brandList}
            renderRow={this.renderBrandListRow}
            style={{
              backgroundColor: 'white',
              marginLeft: 14
            }}
            enableEmptySections
            removeClippedSubviews={false}
            contentContainerStyle={{alignItems: 'center'}}
            horizontal
          />
        </View>
        <View style={{
          flex: 1,
          backgroundColor: 'white'
        }}>
          <ListView
            dataSource={brandList}
            renderRow={(rowData) => this.renderVerticalRow(rowData)}
            style={{backgroundColor: 'white'}}
            enableEmptySections
            removeClippedSubviews={false}
            contentContainerStyle={{alignItems: 'center'}}
          />
        </View>
      </View>
    );
  }
}

FindStore.propTypes = {
  brandList: PropTypes.array.isRequired,
  selectedBrand: PropTypes.string.isRequired,
  handleNextBtn: PropTypes.func.isRequired
};
