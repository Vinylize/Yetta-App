import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  Text,
  TouchableOpacity,
  View
} from 'react-native';

// [start redux functions]
import {
  setWaitingNewOrder,
  setOnDelivery
} from '../../actions/runnerStatusActions';
import { setRunnerNotification } from '../../actions/pushNotificationActions';
// [end redux functions]

const styles = {
  container: {
    flex: 0.2,
    backgroundColor: '#f9f9f9',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100
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

  render() {
    let lastNotif = '';
    let title = '';
    let body = '';
    if (this.props.runnerNotification) {
      lastNotif = this.props.runnerNotification[this.props.runnerNotification.length - 1];
      if (lastNotif) {
        const { message } = lastNotif;
        if (message) {
          title = message.title;
          body = message.body;
        }
      }
    }

    return (
      <View style={styles.container}>
        <Text
          style={{
            top: -40,
            backgroundColor: 'transparent',
            fontSize: 15,
            fontWeight: '700'
          }}>{title}</Text>
        <Text
          style={{
            top: -20,
            backgroundColor: 'transparent',
            textAlign: 'center',
            marginLeft: 30,
            marginRight: 30
          }}
        >{body}</Text>
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
