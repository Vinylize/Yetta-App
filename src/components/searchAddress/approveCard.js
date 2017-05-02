import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  Platform
} from 'react-native';
import { setShowApproveAddressCard } from './../../actions/componentsActions/homeActions';
import { createOrderNavigatorRoute } from './../../navigator/navigatorRoutes';

// const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;

// const styles = {
//   // TBD
// };

class ApproveCard extends Component {
  constructor() {
    super();
    this.handleApproveBtn = this.handleApproveBtn.bind(this);
  }

  handleApproveBtn() {
    this.props.navigator.push(createOrderNavigatorRoute());
    this.props.setShowApproveAddressCard(false);
  }

  render() {
    if (Platform.OS === 'ios' && !this.props.showApproveAddressCard) {
      /**
       * this is due to difference on dynamic components between ios and android
       * ref: https://github.com/Vinylize/Yetta-App/issues/69
       */
      return null;
    }
    return (
      <View style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: WIDTH,
        height: (Platform.OS === 'android' && !this.props.showApproveAddressCard) ? 0 : 110,
        backgroundColor: 'white',
        zIndex: 1,
        shadowOffset: {height: 3, width: 3},
        shadowOpacity: 0.3,
        flexDirection: 'column',
        elevation: 10
      }}>
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          marginLeft: 5,
          marginRight: 5,
          flexDirection: 'column'
        }}>
          {(this.props.busyWaitingGeocodingAPI) ?
            <ActivityIndicator
              animating={true}
              style={{width: 20, height: 20}}
              size="small"
            /> :
            <Text style={{
              marginTop: 5,
              color: 'black'
            }}>
              {this.props.address.firstAddressToken}
            </Text>
          }
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
              {(this.props.busyWaitingGeocodingAPI) ?
                '주소를 불러오는중'
                : this.props.address.addressTextView}
            </Text>
          </View>
        </View>
        <View style={{
          flex: 0.6,
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <TouchableOpacity
            style={{
              flex: 1,
              width: WIDTH,
              backgroundColor: 'white',
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: StyleSheet.hairlineWidth,
              borderLeftColor: 'white',
              borderRightColor: 'white',
              borderTopColor: 'grey',
              borderBottomColor: 'white'
            }}
            onPress={this.handleApproveBtn}
          >
            <Text style={{color: 'black'}}>
              이 주소로 주문하기
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

ApproveCard.propTypes = {
  navigator: PropTypes.any.isRequired,
  address: PropTypes.any,
  busyWaitingGeocodingAPI: PropTypes.bool.isRequired,

  // reducers/components/home
  showApproveAddressCard: PropTypes.bool.isRequired,
  setShowApproveAddressCard: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return {
    showApproveAddressCard: state.home.showApproveAddressCard
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    setShowApproveAddressCard: (showApproveAddressCard) => dispatch(setShowApproveAddressCard(showApproveAddressCard))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ApproveCard);
