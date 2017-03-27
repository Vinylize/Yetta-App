import React, { Component, PropTypes } from 'react';
import {
  View
} from 'react-native';

import Header from './header/header';
import Overview from './bodies/overview';
import FindStore from './bodies/findStore';

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

  handleHeaderBackBtn() {
    this.props.navigator.pop();
  }

  render() {
    return (
      <View style={styles.container}>
        <Header back={this.handleHeaderBackBtn.bind(this)}/>
        <FindStore/>
      </View>
    );
  }
}

RegisterOrder.propTypes = {
  navigator: PropTypes.any
};
