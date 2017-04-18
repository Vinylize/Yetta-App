import React, { PureComponent, PropTypes } from 'react';
import {
  Dimensions,
  TouchableOpacity,
  Text,
  View,
  ListView,
  Alert
} from 'react-native';
import { URL } from './../../../utils';
import * as firebase from 'firebase';
const Lokka = require('lokka').Lokka;
const Transport = require('lokka-transport-http').Transport;

const client = new Lokka({
  transport: new Transport(URL)
});

// const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;

// const styles = {
//   // TBD
// };

export default class FindStore extends PureComponent {
  constructor() {
    super();
    this.renderBrandListRow = this.renderBrandListRow.bind(this);
    this.handleBrandNameBtn = this.handleBrandNameBtn.bind(this);
    this.getStoreListFromServer = this.getStoreListFromServer.bind(this);
    this.setStoreListFromServer = this.setStoreListFromServer.bind(this);
    this.queryNodeHelper = this.queryNodeHelper.bind(this);
    this.state = {
      dsStore: []
    };
    this.getStoreListFromServer();
  }
  renderVerticalRow(rowData) {
    const { addr, name, distance } = rowData;
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
          paddingLeft: 30,
          paddingRight: 30
        }}
        onPress={this.props.handleNextBtn}
      >
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Text>
            {name}
          </Text>
          <Text style={{
            fontSize: 10
          }}>
            {Math.floor(distance)} m
          </Text>
        </View>
        <Text style={{
          fontSize: 12,
          color: '#abb5b6',
          marginTop: 10
        }}>
          {addr}
        </Text>
      </TouchableOpacity>
    );
  }

  handleBrandNameBtn() {
    this.getStoreListFromServer();
  }

  queryNodeHelper(token) {
    client._transport._httpOptions.headers = {
      authorization: token
    };
    const { latitude, longitude } = this.props.coordinate;
    return client.query(`{
      viewer{
        node (lat: ${latitude}, lon: ${longitude}, radius: 432532434234, c1: 0, c2: 0) {
          n,
          addr,
          distance
        }
      }
    }`);
  }

  getStoreListFromServer() {
    return firebase.auth().currentUser.getToken()
      .then(this.queryNodeHelper)
      .then(this.setStoreListFromServer)
      .catch((err) => {
        Alert.alert('query getStoreList failed', err);
      });
  }

  setStoreListFromServer(res) {
    const { node } = res.viewer;
    Alert.alert('query success', String(node.length));
    this.props.setNode(node);
  }

  renderBrandListRow(name) {
    return (
      <TouchableOpacity
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 58
        }}
        onPress={() => this.handleBrandNameBtn(name)}
      >
        <Text>
          {name}
        </Text>
      </TouchableOpacity>
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
      arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
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
            dataSource={ds.cloneWithRows(this.props.node)}
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
  handleNextBtn: PropTypes.func.isRequired,
  coordinate: PropTypes.object.isRequired,
  setNode: PropTypes.func.isRequired,
  node: PropTypes.array.isRequired
};
