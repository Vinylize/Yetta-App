import React, { Component, PropTypes } from 'react';
import {
  View
} from 'react-native';

import Header from './header/header';
import Overview from './bodies/overview';
import FindBrand from './bodies/findBrand';
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
      step: 0
    };
  }

  handleHeaderBackBtn() {
    this.props.navigator.pop();
  }

  handleBrandBtn() {
    this.setState({step: this.state.step + 1});
  }

  renderBody() {
    const { step } = this.state;
    if (step === 0) {
      return (<FindBrand handleBrandBtn={this.handleBrandBtn.bind(this)}/>);
    } else if (step === 1) {
      return (<FindStore/>);
    }
    return null;
  }

  render() {
    return (
      <View style={styles.container}>
        <Header back={this.handleHeaderBackBtn.bind(this)}/>
        {this.renderBody()}
      </View>
    );
  }
}

RegisterOrder.propTypes = {
  navigator: PropTypes.any
};
