import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Text,
  TextInput,
  LayoutAnimation,
  View
} from 'react-native';
import Header from './../header/header';

// [start redux functions]
import {
  addProduct,
  deleteProduct,
  resetProductList,
  changeProductName,
  changeProductNum
} from './../../../actions/componentsActions/addProductActions';
// [end redux functions]

// const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;

const styles = {
  addingProduct: {
    width: WIDTH - 80,
    height: 64,
    backgroundColor: 'white',
    marginTop: 12,
    marginBottom: 0,
    shadowOffset: {height: 3, width: 1},
    shadowOpacity: 0.2,
    elevation: 5
  }
};

class AddProduct extends Component {
  constructor() {
    super();
    this.state = {
      currentlyAddingNewProduct: false
    };
    this.renderProductList = this.renderProductList.bind(this);
    this.renderAddingNewProductView = this.renderAddingNewProductView.bind(this);
  }

  renderProductList() {
    return this.props.productList.map((el, i) => {
      return (
        <TouchableOpacity
          style={[styles.addingProduct, {
            justifyContent: 'space-between',
            flexDirection: 'row'
          }]}
          onLongPress={() => {
            LayoutAnimation.easeInEaseOut();
            this.props.deleteProduct(i);
          }}
          key={i}
        >
          <TextInput
            style={{
              height: 30,
              width: WIDTH - 80 - 140,
              marginLeft: 28,
              backgroundColor: 'transparent',
              alignSelf: 'center'
            }}
            onChangeText={text => this.props.changeProductName(text, i)}
            value={el.name}
            placeholder="물품 이름 입력"
            autoFocus
          />
          <View style={{
            alignSelf: 'center',
            height: 50,
            width: 60,
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginRight: 10
          }}>
            <View style={{
              flex: 1,
              justifyContent: 'center'
            }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onPress={() => {
                  if (el.cnt - 1 === 0) {
                    // remove
                    // todo: LayoutAnimation on this is not satisfiable
                    this.props.deleteProduct(i);
                  } else {
                    this.props.changeProductNum(el.cnt - 1, i);
                  }
                }}
              >
                <Text style={{
                  color: 'black',
                  fontSize: 18
                }}>-</Text>
              </TouchableOpacity>
            </View>
            <View style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <Text>{el.cnt}</Text>
            </View>
            <View style={{
              flex: 1,
              flexDirection: 'column'
            }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onPress={() => {
                  this.props.changeProductNum(el.cnt + 1, i);
                }}
              >
                <Text style={{
                  color: 'black',
                  fontSize: 18
                }}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      );
    });
  }

  renderAddingNewProductView() {
    return (
      <TouchableOpacity
        style={[styles.addingProduct, {
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row'
        }]}
        onPress={() => {
          const newProductSceme = {
            name: '',
            cnt: 1
          };
          LayoutAnimation.easeInEaseOut();
          this.props.addProduct(newProductSceme);
        }}
      >
        <Text style={{
          fontSize: 31,
          color: '#ccd1d3',
          marginRight: 10,
          backgroundColor: 'transparent',
          textAlignVertical: 'center',
          marginBottom: 6
        }}>
          +
        </Text>
        <Text style={{
          textAlignVertical: 'center',
          color: '#ccd1d3',
          fontWeight: '600',
          backgroundColor: 'transparent'
        }}>
          새 물품 추가하기
        </Text>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <Header
          headerText="물품 선택"
          back={this.props.back}
          next={this.props.next}
        />
        <ScrollView
          style={{
            width: WIDTH,
            backgroundColor: 'white',
            paddingLeft: 40,
            paddingTop: 44 + 90
          }}
        >
          <Text>상점 정보</Text>
          <View style={{
            width: WIDTH - 80,
            backgroundColor: 'white',
            marginTop: 12,
            marginBottom: 38,
            shadowOffset: {height: 3, width: 1},
            shadowOpacity: 0.2,
            elevation: 5,
            padding: 16
          }}>
            <Text style={{
              color: 'black',
              marginBottom: 10
            }}>
              {this.props.stagedNode.name}
            </Text>
            <Text style={{color: '#aaabac'}}>
              {this.props.stagedNode.addr}
            </Text>
          </View>
          <Text>물품 추가</Text>
          {this.renderProductList()}
          {this.renderAddingNewProductView()}
        </ScrollView>
      </View>
    );
  }
}

AddProduct.propTypes = {
  address: PropTypes.string,
  handleApproveBtn: PropTypes.func,
  next: PropTypes.func.isRequired,
  back: PropTypes.func.isRequired,

  // reducers/components/addProduct
  productList: PropTypes.array,
  addProduct: PropTypes.func,
  deleteProduct: PropTypes.func,
  resetProductList: PropTypes.func,

  // reducers/createOrder
  stagedNode: PropTypes.object,
  changeProductName: PropTypes.func,
  changeProductNum: PropTypes.func
};

function mapStateToProps(state) {
  return {
    productList: state.addProduct.productList,
    stagedNode: state.createOrder.stagedNode
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    addProduct: (newProduct) => dispatch(addProduct(newProduct)),
    deleteProduct: (index) => dispatch(deleteProduct(index)),
    resetProductList: () => dispatch(resetProductList()),
    changeProductName: (name, index) => dispatch(changeProductName(name, index)),
    changeProductNum: (cnt, index) => dispatch(changeProductNum(cnt, index))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddProduct);
