import React, { Component, PropTypes} from 'react';
import {
  View,
  Dimensions,
  Text,
  TouchableOpacity
} from 'react-native';

const WIDTH = Dimensions.get('window').width;
const viewHeight = 150;

const styles = {
  container: {
    position: 'absolute',
    left: 0,
    top: -viewHeight - 20,
    width: WIDTH,
    height: viewHeight,
    backgroundColor: '#f9f9f9',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
    elevation: 50,
    zIndex: 1,
    shadowOffset: {height: 1, width: 2},
    shadowOpacity: 0.23
  }
};

export default class RunnerOnDeliveryView extends Component {
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
      <View style={[styles.container,
        {top:(this.checkIfOnDelivery()) ? 0 : -viewHeight - 20}]}>
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
  navigator: PropTypes.any,
  isRunner: PropTypes.bool.isRequired,
  waitingNewOrder: PropTypes.bool.isRequired,
  setWaitingNewOrder: PropTypes.func.isRequired,
  runnerNotification: PropTypes.any.isRequired,
  setRunnerNotification: PropTypes.func.isRequired,
  onDelivery: PropTypes.bool.isRequired,
  setOnDelivery: PropTypes.func.isRequired
};
