import React, { Component, PropTypes } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { URL, handleError } from '../../../utils';
import * as firebase from 'firebase';

// const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;

const Lokka = require('lokka').Lokka;
const Transport = require('lokka-transport-http').Transport;

const client = new Lokka({
  transport: new Transport(URL)
});

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#feffff'
  }
};

export default class RegisterOrder extends Component {
  constructor() {
    super();
    this.state = {
      // TBD
    };
  }

  createOrderHelper() {
    firebase.auth().currentUser.getToken()
      .then(token => {
        client._transport._httpOptions.headers = {
          authorization: token
        };
        client.mutate(`{
          userCreateOrder(input:{
            regItems:[
              {
                iId:"4334423",
                n:"바나나킥3",
                p:2300,
                cnt:1}],
            customItems:[
              {
                manu:"농심",
                n:"바나나 우유3",
                cnt:2}],
            nId: "-KiTzNSVH6ETa-RU_z5U",
            dest:{
              n1:"서울시 강동구 길동 한신휴플러스",
              n2:"910호",
              lat:12.3232,
              lon:23.3232
            },
            dC:0,
            rC:0,
            curr:"KRW"
          }) {
            result
          }
        }`)
          .then(res => {
            console.log(res);
            return res.userCreateOrder.result;
          })
          .then(this.addNewRunnerListener.bind(this))
          .catch(handleError);
      });
  }

  addNewRunnerListener(orderId) {
    console.log(orderId);
    // const ref = firebase.database().ref().child('order').child(orderId).child('runnerId');
    // ref.on('value', (childSnapshot, prevChildKey) => {
    //   console.log(childSnapshot.val(), prevChildKey);
    //   // todo: implement this
    // });
    this.props.handleCreateOrderDone();
  }

  renderHeader() {
    return (
      <View style={{
        position: 'absolute',
        top: 0,
        left: 0,
        height: 90,
        width: WIDTH,
        backgroundColor: '#feffff',
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 20,
        zIndex: 1
      }}/>
    );
  }

  // todo: use this
  runnerCatchOrderHelper(orderId) {
    firebase.auth().currentUser.getToken()
      .then(token => {
        client._transport._httpOptions.headers = {
          authorization: token
        };
        client.mutate(`{
          runnerCatchOrder(input:{
            orderId:"${orderId}"
          }) {
            result
            clientMutationId
          }
        }`)
          .then(res => {
            console.log(res);
          })
          .catch(console.log);
      });
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
        }}>Register order</Text>
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
            CU Jongro K twin tower
          </Text>
          <Text style={{
            marginTop: 3,
            marginBottom: 21,
            fontSize: 11,
            color: 'grey'
          }}>
            50 Jong-ro 1-gil, Jongno-gu, Seoul
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
            8126 Greenfelder Square Suite 067
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
      <View style={{paddingBottom: 4}}>
        {this.renderProduct('Nongsim', 'Sin 라면')}
        {this.renderProduct('삼양', '삼양라면')}
      </View>
    );
  }

  renderProduct(company, product) {
    return (
      <View>
        <Text style={{
          marginTop: 5
        }}>{company}</Text>
        <Text style={{
          marginTop: 4,
          marginBottom: 16,
          fontSize: 11,
          color: 'grey'
        }}>
          {product}
        </Text>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderHeader()}
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
            <Text>Your order</Text>
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
      </View>
    );
  }
}

RegisterOrder.propTypes = {
  handleCreateOrderDone: PropTypes.func
};
