import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  Dimensions,
  TouchableOpacity,
  Text,
  View,
  ListView
} from 'react-native';
import { URL } from './../../../utils';
import * as firebase from 'firebase';
const Lokka = require('lokka').Lokka;
const Transport = require('lokka-transport-http').Transport;
import { setNodeList } from './../../../actions/createOrderActions';

const client = new Lokka({
  transport: new Transport(URL)
});

// const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;

// const styles = {
//   // TBD
// };

class FindStore extends PureComponent {
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
    const { addr, n, formattedDistance } = rowData;
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
            {n}
          </Text>
          <Text style={{
            fontSize: 10
          }}>
            {formattedDistance}
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
    const { lat, lon } = this.props.coordinate;
    return client.query(`{
      viewer{
        nodeList (lat: ${lat}, lon: ${lon}, radius: 432532434234, c1: 0, c2: 0) {
          n,
          addr,
          formattedDistance
        }
      }
    }`);
  }

  getStoreListFromServer() {
    return firebase.auth().currentUser.getToken()
      .then(this.queryNodeHelper)
      .then(this.setStoreListFromServer)
      .catch((err) => {
        console.log(err);
        // Alert.alert('query getStoreList failed', err);
      });
  }

  setStoreListFromServer(res) {
    const { nodeList } = res.viewer;
    // Alert.alert('query success', String(node.length));
    this.props.setNodeList(nodeList);
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
            dataSource={ds.cloneWithRows(this.props.nodeList)}
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
  setNodeList: PropTypes.func.isRequired,
  nodeList: PropTypes.array.isRequired
};

function mapStateToProps(state) {
  return {
    nodeList: state.createOrder.nodeList
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    setNodeList: (nodeList) => dispatch(setNodeList(nodeList))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FindStore);
