import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  Dimensions,
  Text,
  TouchableOpacity,
  View,
  Platform
} from 'react-native';

// [start redux functions]
import {
  setWaitingNewOrder,
  setOnDelivery
} from '../../actions/runnerStatusActions';
import { setRunnerNotification } from '../../actions/pushNotificationActions';
// [end redux functions]

const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;

const styles = {
  container: {
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 1,
    elevation: 10,
    height: HEIGHT * 0.16,
    width: WIDTH,
    backgroundColor: '#f9f9f9',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 40,
    shadowOffset: {height: 1, width: 1},
    shadowOpacity: 0.2,
    ...Platform.select({
      ios: {
        paddingTop: 20
      }
    })
  }
};

class RunnerOnDeliveryView extends Component {
  constructor() {
    super();
    this.state = {
      fill: 100,
      receivedNewOrder: false,
      lastOrderId: undefined
    };
    this.checkIfOnDelivery = this.checkIfOnDelivery.bind(this);
  }

  checkIfOnDelivery() {
    return (this.props.onDelivery === true && this.props.isRunner === true);
  }

  renderBtn() {
    return (
      <TouchableOpacity
        style={{
          width: 100,
          height: 30,
          backgroundColor: 'black',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 10
        }}
        onPress={() => {
          this.props.setOnDelivery(false);
          this.props.setWaitingNewOrder(true);
          const newArr = this.props.runnerNotification.concat();
          if (newArr.length > 0) {
            newArr.pop();
          }
          this.props.setRunnerNotification(newArr);
        }}
      >
        <Text style={{color: 'white'}}>배달완료</Text>
      </TouchableOpacity>
    );
  }

  render() {
    const { nId } = this.props.runnersOrderDetails;

    return (
      <View style={[styles.container, {
        top: (this.checkIfOnDelivery()) ? 0 : -300
      }]}>
        <TouchableOpacity>
          <Text
            style={{
              backgroundColor: 'transparent',
              fontSize: 22,
              fontWeight: '700',
              color: '#205D98'
            }}>
            {nId && nId.n}
          </Text>
        </TouchableOpacity>
        <Text style={{
          backgroundColor: 'transparent',
          fontSize: 16,
          color: 'black',
          marginTop: 4
        }}>
          에서 배달물건을 구매하세요
        </Text>
      </View>
    );
  }
}

RunnerOnDeliveryView.propTypes = {
  // reducers/userStatus
  isRunner: PropTypes.bool,

  // reducers/runnerStatus
  waitingNewOrder: PropTypes.bool,
  setWaitingNewOrder: PropTypes.func,
  onDelivery: PropTypes.bool,
  setOnDelivery: PropTypes.func,

  // reducers/pushNotification
  runnerNotification: PropTypes.any,
  setRunnerNotification: PropTypes.func,

  // reducers/orderStatus
  runnersOrderDetails: PropTypes.object
};

function mapStateToProps(state) {
  return {
    isRunner: state.userStatus.isRunner,
    waitingNewOrder: state.runnerStatus.waitingNewOrder,
    onDelivery: state.runnerStatus.onDelivery,
    runnerNotification: state.pushNotification.runnerNotification,
    runnersOrderDetails: state.orderStatus.runnersOrderDetails
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    setWaitingNewOrder: (waitingNewOrder) => dispatch(setWaitingNewOrder(waitingNewOrder)),
    setRunnerNotification: (runnerNotification) => dispatch(setRunnerNotification(runnerNotification)),
    setOnDelivery: (onDelivery) => dispatch(setOnDelivery(onDelivery))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RunnerOnDeliveryView);
