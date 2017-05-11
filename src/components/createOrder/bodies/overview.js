import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  Text,
  View,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import Header from './../header/header';
import Loading from './../../globalViews/loading';
import * as YettaServerAPI from './../../../service/YettaServerAPI/client';

// [start redux functions]
import { addNewOrder } from './../../../actions/orderStatusActions';
import { resetProductList } from './../../../actions/componentsActions/addProductActions';
import { setBusyWaitingUserCreateOrder } from './../../../actions/busyWaitingActions';
// [end redux functions]

import { handleError } from '../../../utils/errorHandlers';

// const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#feffff'
  }
};

class RegisterOrder extends Component {
  createOrderHelper() {
    const {id} = this.props.stagedNode;
    this.props.setBusyWaitingUserCreateOrder(true);
    let customItems = '[';
    this.props.productList.map(el => {
      customItems = customItems + `{
          n: "${el.name}",
          cnt: ${el.cnt}
        },`;
    });
    customItems = customItems + ']';
    console.log(customItems);
    YettaServerAPI.getLokkaClient()
      .then(client => {
        return client.mutate(`{
          userCreateOrder(input:{
            regItems: [],
            customItems: ${customItems},
            nId: "${id}",
            dest:{
              n1:"${this.props.searchedAddressTextView.firstAddressToken}",
              n2:"",
              lat:${this.props.destinationLocation.lat},
              lon:${this.props.destinationLocation.lon}
            },
            dC:0,
            rC:0,
            curr:"KRW"
          }) {
            result
          }
        }`);
      })
      .then(res => {
        console.log(res);
        this.props.setBusyWaitingUserCreateOrder(false);
        this.props.resetProductList();
        // todo: handle errors
        return res.userCreateOrder.result;
      })
      .then(this.addNewRunnerListener.bind(this))
      .catch(err => {
        console.log(err);
        this.props.setBusyWaitingUserCreateOrder(false);
        handleError(err);
      });
  }

  addNewRunnerListener(orderId) {
    const addNewOrderScheme = {
      foundRunner: false,
      id: orderId,
      data: {
        node: this.props.stagedNode
      }
    };
    this.props.addNewOrder(addNewOrderScheme);
    // const ref = firebase.database().ref().child('order').child(orderId).child('runnerId');
    // ref.on('value', (childSnapshot, prevChildKey) => {
    //   console.log(childSnapshot.val(), prevChildKey);
    //   // todo: implement this
    // });
    this.props.handleCreateOrderDone();
  }

  renderOrderBtn() {
    return (
      <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: 28,
          height: 40,
          width: WIDTH * 0.8,
          borderRadius: 2.5,
          backgroundColor: '#2d3132',
          justifyContent: 'center',
          alignItems: 'center'
        }}
        onPress={this.createOrderHelper.bind(this)}
      >
        <Text style={{
          color: 'white'
        }}>주문 하기</Text>
      </TouchableOpacity>
    );
  }

  renderOrderBody() {
    return (
      <View style={{
        top: 24,
        backgroundColor: '#f8fcfc',
        height: 350,
        width: WIDTH * 0.8,
        borderColor: '#e8eeee',
        borderBottomColor: 'transparent',
        borderWidth: 1,
        paddingLeft: 24,
        paddingRight: 24,
        paddingTop: 20,
        flexDirection: 'column',
        zIndex: 10
      }}>
        <View style={{
          borderBottomWidth: 1,
          borderBottomColor: '#d9e1e3'
        }}>
          <Text style={{
            marginBottom: 6,
            fontSize: 10,
            color: '#619de3'
          }}>Store</Text>
          <Text style={{
            marginTop: 5
          }}>
            {this.props.stagedNode.name}
          </Text>
          <Text style={{
            marginTop: 3,
            marginBottom: 21,
            fontSize: 11,
            color: 'grey'
          }}>
            {this.props.stagedNode.addr}
          </Text>
        </View>
        <View style={{
          borderBottomWidth: 1,
          borderBottomColor: '#d9e1e3'
        }}>
          <Text style={{
            marginTop: 18,
            marginBottom: 6,
            fontSize: 10,
            color: '#619de3'
          }}>
            Product
          </Text>
          {this.renderProducts()}
        </View>
        <View>
          <Text style={{
            marginTop: 18,
            marginBottom: 6,
            fontSize: 10,
            color: '#619de3'
          }}>
            Destination
          </Text>
          <Text style={{
            marginTop: 5
          }}>
            {this.props.searchedAddressTextView.firstAddressToken}
          </Text>
        </View>
      </View>
    );
  }

  renderTriangles() {
    const length = WIDTH * 0.8 / 12;
    const renderTriangle = (i) => {
      return (
        <View
          key={i}
          style={{
            zIndex: 40,
            width: length / 1.414,
            height: length / 1.414,
            backgroundColor: '#f8fcfc',
            marginRight: 7.4,
            borderWidth: 1,
            borderColor: '#e8eeee',
            transform: [{rotateZ: '45deg'}]
          }}
        />
      );
    };
    let triangles = [];
    for (let i = 0; i < 12; i = i + 1) {
      triangles.push(renderTriangle(i));
    }
    return (
      <View style={{
        flexDirection: 'row',
        top: 16,
        left: 4
      }}>
        {triangles}
      </View>
    );
  }

  renderProducts() {
    return (
      <View style={{
        marginBottom: 12
      }}>
        {this.props.productList.map((el, index) => {
          return this.renderProduct(el, index);
        })}
      </View>
    );
  }

  renderProduct(product, index) {
    return (
      <View
        key={index}
      >
        <Text style={{
          marginTop: 5
        }}>{product.name} X {product.cnt}</Text>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <Header back={this.props.back}/>
        <View style={{
          flex: 1,
          width: WIDTH,
          backgroundColor: '#feffff',
          alignItems: 'center',
          paddingTop: 90,
          flexDirection: 'column'
        }}>
          <View style={{
            top: 12,
            left: WIDTH * 0.1 + 20,
            alignSelf: 'flex-start'
          }}>
            <Text style={{
              fontWeight: '500',
              color: 'black'
            }}>주문 내역</Text>
          </View>
          {this.renderOrderBody()}
          {this.renderTriangles()}
          <View style={{top: 64}}>
            <Text style={{textAlign: 'center'}}>
              위의 내용을 주문하시겠습니까?
            </Text>
          </View>
          {this.renderOrderBtn()}
        </View>
        <Loading show={this.props.busyWaitingUserCreateOrder}/>
      </View>
    );
  }
}

RegisterOrder.propTypes = {
  back: PropTypes.func.isRequired,
  handleCreateOrderDone: PropTypes.func.isRequired,

  // reducers/createOrder
  stagedNode: PropTypes.object,
  destinationLocation: PropTypes.object,

  // reducers/components/home
  searchedAddressTextView: PropTypes.object,

  // reducers/orderStatus
  addNewOrder: PropTypes.func,

  // reducers/components/addProduct
  productList: PropTypes.array,
  resetProductList: PropTypes.func,

  // reducers/busyWaiting
  busyWaitingUserCreateOrder: PropTypes.bool,
  setBusyWaitingUserCreateOrder: PropTypes.func
};

function mapStateToProps(state) {
  return {
    stagedNode: state.createOrder.stagedNode,
    destinationLocation: state.createOrder.destinationLocation,
    searchedAddressTextView: state.home.searchedAddressTextView,
    productList: state.addProduct.productList,
    busyWaitingUserCreateOrder: state.busyWaiting.busyWaitingUserCreateOrder
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    addNewOrder: (newOrder) => dispatch(addNewOrder(newOrder)),
    resetProductList: () => dispatch(resetProductList()),
    setBusyWaitingUserCreateOrder: (busyWaitingUserCreateOrder) =>
      dispatch(setBusyWaitingUserCreateOrder(busyWaitingUserCreateOrder))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RegisterOrder);
