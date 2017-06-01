import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  Dimensions,
  Image,
  LayoutAnimation,
  NativeModules,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

// redux action
import {
  setMarkerTapped,
  resetMarkerTapped
} from './../../actions/mapActions';
import {
  setRunnerCompletePurchasingItems
} from './../../actions/runnerStatusActions';

// assets
import IMG_LINE from './../../../assets/minus-horizontal-straight-line.png';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
const defaultNodeInfoViewHeight = HEIGHT * 0.23;
const itemListRowHeight = 40;
let vmm = NativeModules.VinylMapManager;

const styles = {
  container: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: WIDTH,
    height: defaultNodeInfoViewHeight,
    backgroundColor: '#f9f9f9',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    elevation: 1,
    shadowOffset: {height: 1, width: 1},
    shadowOpacity: 0.2,
    paddingTop: 20
  }
};

class NodeInfoView extends Component {
  constructor() {
    super();
    this.state = {
      nodeInfoViewHeight: defaultNodeInfoViewHeight
    };
    this.handleDoneBtn = this.handleDoneBtn.bind(this);
    this.handleCancelBtn = this.handleCancelBtn.bind(this);
    this.shouldShowThisComponent = this.shouldShowThisComponent.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(this.props.runnersOrderDetails !== JSON.stringify(nextProps.runnersOrderDetails))) {
      const { items } = nextProps.runnersOrderDetails;
      let customItem = [];
      let regItem = [];
      if (items) {
        customItem = items.customItem;
        regItem = items.regItem;
      }

      this.setState(() => {
        let numberOfTotalRows = customItem.length + regItem.length;
        if (numberOfTotalRows > 8) {
          numberOfTotalRows = 8;
        }
        return {nodeInfoViewHeight: defaultNodeInfoViewHeight + numberOfTotalRows * itemListRowHeight};
      });
    }
  }

  handleDoneBtn() {
    // todo: implement this
    const { dest } = this.props.runnersOrderDetails;
    const { currentLocation } = this.props;
    if (dest && currentLocation) {
      const coordinatesArray = [
        {latitude: dest.lat, longitude: dest.lon},
        {latitude: parseFloat(currentLocation.lat), longitude: parseFloat(currentLocation.lon)}
      ];
      const edgePadding = {
        left: 50,
        right: 50,
        top: 50,
        bottom: 50
      };
      const animated = true;
      const duration = 1.5;
      vmm.fitToCoordinates(coordinatesArray, edgePadding, animated, duration);
      LayoutAnimation.easeInEaseOut();
      this.props.resetMarkerTapped();
    }

    this.props.setRunnerCompletePurchasingItems(true);
  }

  handleCancelBtn() {
    LayoutAnimation.easeInEaseOut();
    this.props.resetMarkerTapped();
  }

  shouldShowThisComponent() {
    return (this.props.markerTapped.type === 'node');
  }

  renderItemRow(name, cnt, key) {
    return (
      <View
        key={key}
        style={{
          height: itemListRowHeight,
          width: WIDTH,
          justifyContent: 'flex-start',
          alignItems: 'center',
          paddingLeft: 28,
          flexDirection: 'row',
          borderBottomColor: '#dfe2e8',
          borderBottomWidth: 1
        }}
      >
        <Image
          style={{
            width: 20
          }}
          source={IMG_LINE}
          resizeMode="contain"
        />
        <Text style={{
          marginLeft: 20,
          fontSize: 18,
          color: 'black'
        }}>{name}: {cnt} 개</Text>
      </View>
    );
  }

  render() {
    // const { eDP } = this.props.runnersOrderDetails;
    const { nId, items } = this.props.runnersOrderDetails;
    let customItem = [];
    let regItem = [];
    if (nId) {
      // addr = nId.addr;
      // n = nId.n;
      // p = nId.p;
    }
    if (items) {
      customItem = items.customItem;
      regItem = items.regItem;
    }
    __DEV__ && console.log(regItem); // eslint-disable-line no-undef
    return (
      <View style={[styles.container, {height: this.state.nodeInfoViewHeight}, (this.shouldShowThisComponent()) ? {
        bottom: 0} : {bottom: -this.state.nodeInfoViewHeight}]}>
        <View style={{
          flex: 1,
          backgroundColor: 'transparent'
        }}>
          <Text style={{
            fontSize: 20,
            color: 'black',
            fontWeight: '500',
            marginLeft: 20
          }}>아래 물품들을 구매하세요</Text>
          <ScrollView style={{
            marginTop: 20,
            marginLeft: 20,
            backgroundColor: 'transparent'
          }}>
            {customItem.map((el, i) => this.renderItemRow(el.n, el.cnt, i))}
          </ScrollView>
          <View style={{
            height: 70,
            width: WIDTH,
            backgroundColor: 'transparent',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <TouchableOpacity
              style={{
                height: 40,
                width: WIDTH * 0.4,
                backgroundColor: 'black',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 2,
                marginRight: 20
              }}
              onPress={this.handleDoneBtn}
            >
              <Text style={{
                color: 'white',
                fontSize: 20
              }}>구매완료</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                height: 40,
                width: WIDTH * 0.4,
                backgroundColor: 'black',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 2
              }}
              onPress={this.handleCancelBtn}
            >
              <Text style={{
                color: 'white',
                fontSize: 20
              }}>닫기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

NodeInfoView.propTypes = {
  // reducers/map
  markerTapped: PropTypes.object,
  setMarkerTapped: PropTypes.func,
  resetMarkerTapped: PropTypes.func,

  // reducers/orderStatus
  runnersOrderDetails: PropTypes.object,

  // reducers/components/home
  currentLocation: PropTypes.object,

  // reducers/runnerStatus
  setRunnerCompletePurchasingItems: PropTypes.func
};

const mapStateToProps = (state) => {
  return {
    markerTapped: state.map.markerTapped,
    runnersOrderDetails: state.orderStatus.runnersOrderDetails,
    currentLocation: state.home.currentLocation
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setMarkerTapped: (markerTapped) => dispatch(setMarkerTapped(markerTapped)),
    resetMarkerTapped: () => dispatch(resetMarkerTapped()),
    setRunnerCompletePurchasingItems: (runnerCompletePurchasingItems) => dispatch(setRunnerCompletePurchasingItems(runnerCompletePurchasingItems))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NodeInfoView);
