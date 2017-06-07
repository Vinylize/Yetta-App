import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  Dimensions,
  LayoutAnimation,
  NativeModules,
  Platform,
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
  setRunnerCompleteDelivery,
  setOnDelivery
} from './../../actions/runnerStatusActions';
import { setRunnerNotification } from '../../actions/pushNotificationActions';
import { setRunnersOrderDetails } from './../../actions/orderStatusActions';

const WIDTH = Dimensions.get('window').width;
// const HEIGHT = Dimensions.get('window').height;
const buttonSize = 70;
const destInfoViewHeight = buttonSize + 20;
let vmm = NativeModules.VinylMapManager;

const styles = {
  container: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: WIDTH,
    height: destInfoViewHeight,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    elevation: 1,
    shadowOffset: {height: 1, width: 1},
    shadowOpacity: 0.2
  }
};

class DestInfoView extends Component {
  constructor() {
    super();
    this.handleCallBtn = this.handleCallBtn.bind(this);
    this.handleDeliveryDoneBtn = this.handleDeliveryDoneBtn.bind(this);
    this.handleCancelBtn = this.handleCancelBtn.bind(this);
    this.shouldShowThisComponent = this.shouldShowThisComponent.bind(this);
  }

  handleDeliveryDoneBtn() {
    this.props.setRunnerCompleteDelivery(true);

    this.props.setOnDelivery(false);
    const newArr = this.props.runnerNotification.concat();
    if (newArr.length > 0) {
      newArr.pop();
    }
    this.props.setRunnerNotification(newArr);

    this.props.setRunnersOrderDetails({});

    LayoutAnimation.easeInEaseOut();
    this.props.resetMarkerTapped();

    if (Platform.OS === 'ios') {
      vmm.clearMap();
    } else if (Platform.OS === 'android') {
      // todo: implement clearMap
    }
  }

  handleCallBtn() {
    // todo:
  }

  handleCancelBtn() {
    LayoutAnimation.easeInEaseOut();
    this.props.resetMarkerTapped();
  }

  shouldShowThisComponent() {
    return (this.props.markerTapped.type === 'dest');
  }

  render() {
    // let n;
    // let p;
    let r;
    let pUrl;
    let n1;
    const { oId, dest } = this.props.runnersOrderDetails;
    if (oId && dest) {
      // n = oId.n;
      // p = oId.p;
      r = oId.r;
      pUrl = oId.pUrl;
      n1 = dest.n1;
    }
    __DEV__ && console.log(r, pUrl, n1); // eslint-disable-line no-undef
    return (
      <View style={[styles.container, (this.shouldShowThisComponent()) ? {
        bottom: 0} : {bottom: -destInfoViewHeight}]}>
        <View style={{
          height: destInfoViewHeight,
          width: WIDTH,
          backgroundColor: 'transparent',
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingLeft: WIDTH * 0.1,
          paddingRight: WIDTH * 0.1
        }}>
          <TouchableOpacity
            style={{
              height: buttonSize,
              width: buttonSize,
              backgroundColor: 'black',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: buttonSize / 2,
              shadowOffset: {height: 1, width: 1},
              shadowOpacity: 0.2,
              elevation: 1
            }}
            onPress={this.handleDeliveryDoneBtn}
          >
            <Text style={{
              fontSize: 15,
              color: 'white',
              backgroundColor: 'transparent'
            }}>배달완료</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              height: buttonSize,
              width: buttonSize,
              backgroundColor: 'black',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: buttonSize / 2,
              shadowOffset: {height: 1, width: 1},
              shadowOpacity: 0.2,
              elevation: 1
            }}
            onPress={this.handleCallBtn}
          >
            <Text style={{
              fontSize: 20,
              color: 'white',
              backgroundColor: 'transparent'
            }}>전화</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              height: buttonSize,
              width: buttonSize,
              backgroundColor: 'black',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: buttonSize / 2,
              shadowOffset: {height: 1, width: 1},
              shadowOpacity: 0.2,
              elevation: 1
            }}
            onPress={this.handleCancelBtn}
          >
            <Text style={{
              fontSize: 20,
              color: 'white',
              backgroundColor: 'transparent'
            }}>취소</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

DestInfoView.propTypes = {
  // reducers/map
  markerTapped: PropTypes.object,
  setMarkerTapped: PropTypes.func,
  resetMarkerTapped: PropTypes.func,

  // reducers/orderStatus
  runnersOrderDetails: PropTypes.object,
  setRunnersOrderDetails: PropTypes.func,

  // reducers/runnerStatus
  setRunnerCompleteDelivery: PropTypes.func,
  setOnDelivery: PropTypes.func,

  // reducers/pushNotification
  runnerNotification: PropTypes.any,
  setRunnerNotification: PropTypes.func
};

const mapStateToProps = (state) => {
  return {
    markerTapped: state.map.markerTapped,
    runnersOrderDetails: state.orderStatus.runnersOrderDetails,
    runnerNotification: state.pushNotification.runnerNotification
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setMarkerTapped: (markerTapped) => dispatch(setMarkerTapped(markerTapped)),
    resetMarkerTapped: () => dispatch(resetMarkerTapped()),
    setRunnerCompleteDelivery: (runnerCompleteDelivery) => dispatch(setRunnerCompleteDelivery(runnerCompleteDelivery)),
    setRunnerNotification: (runnerNotification) => dispatch(setRunnerNotification(runnerNotification)),
    setOnDelivery: (onDelivery) => dispatch(setOnDelivery(onDelivery)),
    setRunnersOrderDetails: (runnersOrderDetails) => dispatch(setRunnersOrderDetails(runnersOrderDetails))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DestInfoView);
