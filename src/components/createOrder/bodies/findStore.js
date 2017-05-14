import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  Text,
  View,
  ListView
} from 'react-native';
import Header from './../header/header';
import * as YettaServerAPI from './../../../service/YettaServerAPI/client';
import { handleError } from './../../../utils/errorHandlers';

// [start redux functions]
import {
  setNodeList,
  setStagedNode
} from './../../../actions/createOrderActions';
import { setBusyWaitingQueryNodeList } from './../../../actions/busyWaitingActions';
// [end redux functions]


// constants
const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;

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
    const { addr, n, formattedDistance, id } = rowData;
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
          paddingRight: 30,
          elevation: 3
        }}
        onPress={() => {
          this.props.setStagedNode(id, n, addr);
          this.props.handleNextBtn();
        }}
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

  queryNodeHelper() {
    return YettaServerAPI.getLokkaClient()
      .then(client => {
        this.props.setBusyWaitingQueryNodeList(true);
        const { lat, lon } = this.props.coordinate;
        return client.query(`{
          viewer{
            nodeList (lat: ${lat}, lon: ${lon}, radius: 432532434234, c1: 0, c2: 0) {
              n,
              addr,
              formattedDistance,
              id
            }
          }
        }`)
          .catch(err => {
            this.props.setBusyWaitingQueryNodeList(false);
            handleError(err);
          });
      });
  }

  getStoreListFromServer() {
    return this.queryNodeHelper()
      .then(this.setStoreListFromServer)
      .catch(console.log);
  }

  setStoreListFromServer(res) {
    const { nodeList } = res.viewer;
    this.props.setNodeList(nodeList);
    this.props.setBusyWaitingQueryNodeList(false);
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

  renderTextWhenNoNodeListFound() {
    if (this.props.busyWaitingQueryNodeList) {
      return this.renderWaitingServerResView();
    }
    return (
      <View style={{
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        paddingTop: HEIGHT * 0.26
      }}>
        <Text style={{
          fontSize: 18,
          color: '#bfbfbf',
          fontWeight: '400'
        }}>
          근처에 등록된 곳이 없습니다. ㅠㅠ
        </Text>
      </View>
    );
  }

  renderBrandList(brandList) {
    if (this.props.busyWaitingQueryNodeList) {
      return null;
    }
    return (
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
    );
  }

  renderNodeList(ds) {
    if (this.props.busyWaitingQueryNodeList) {
      return this.renderWaitingServerResView();
    }
    return (
      <ListView
        dataSource={ds.cloneWithRows(this.props.nodeList)}
        renderRow={(rowData) => this.renderVerticalRow(rowData)}
        style={{backgroundColor: 'white'}}
        enableEmptySections
        removeClippedSubviews={false}
        contentContainerStyle={{alignItems: 'center'}}
      />
    );
  }

  renderWaitingServerResView() {
    return (
      <View style={{
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        paddingTop: HEIGHT * 0.23,
        flexDirection: 'column'
      }}>
        <ActivityIndicator
          animating={true}
          size="large"
        />
        <Text style={{
          fontSize: 18,
          color: '#bfbfbf',
          fontWeight: '400',
          marginTop: 20
        }}>
          찾는중..
        </Text>
      </View>
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
        backgroundColor: 'white',
        flexDirection: 'column'
      }}>
        <Header
          headerText="스토어 선택"
          back={this.props.back}
        />
        <View style={{
          height: 58,
          width: WIDTH,
          backgroundColor: 'white',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingLeft: 40,
          paddingRight: 40,
          marginTop: 90
        }}>
          {(this.props.nodeList.length === 0) ?
            null :
            this.renderBrandList(brandList)
          }
        </View>
        <View style={{
          flex: 1,
          backgroundColor: 'white'
        }}>
          {(this.props.nodeList.length === 0) ?
            this.renderTextWhenNoNodeListFound() :
            this.renderNodeList(ds)
          }
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
  back: PropTypes.func.isRequired,

  // reducers/createOrder
  setNodeList: PropTypes.func,
  nodeList: PropTypes.array,
  setStagedNode: PropTypes.func,

  // reducers/busyWaiting
  busyWaitingQueryNodeList: PropTypes.bool,
  setBusyWaitingQueryNodeList: PropTypes.func
};

function mapStateToProps(state) {
  return {
    nodeList: state.createOrder.nodeList,
    busyWaitingQueryNodeList: state.busyWaiting.busyWaitingQueryNodeList
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    setNodeList: (nodeList) => dispatch(setNodeList(nodeList)),
    setStagedNode: (id, name, addr) => dispatch(setStagedNode(id, name, addr)),
    setBusyWaitingQueryNodeList: (busyWaitingQueryNodeList) => dispatch(setBusyWaitingQueryNodeList(busyWaitingQueryNodeList))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FindStore);
