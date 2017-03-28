import React, { Component, PropTypes } from 'react';
import {
  View
} from 'react-native';

import Header from './header/header';
import Overview from './bodies/overview';
import FindBrand from './bodies/findBrand';
import FindStore from './bodies/findStore';
import FindBrandV2 from './bodies/findBrandV2';
import AddProduct from './bodies/addProduct';

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
      step: 0,
      brandList: undefined,
      selectedBrand: undefined,
      brandListDataSource: [
        ['편의점', '음식점', '수퍼'],
        ['약국', '113', 'asdf'],
        ['Stationery shop', 'others', 'yangwoo'],
        ['events', 'hooka']
      ]
    };
  }

  handleHeaderBackBtn() {
    if (this.state.step === 0) {
      this.props.navigator.pop();
    } else {
      this.setState({step: this.state.step - 1});
    }
  }

  handleBrandBtn(rowData, i) {
    this.setState({
      step: this.state.step + 1,
      brandList: i,
      selectedBrand: rowData
    });
  }

  handleNextBtn() {
    this.setState({step: this.state.step + 1});
  }

  renderBody() {
    const { step, brandList, brandListDataSource, selectedBrand } = this.state;
    if (step === 0) {
      return (<FindBrand handleBrandBtn={this.handleBrandBtn.bind(this)}/>);
    } else if (step === 1) {
      return (
        <FindStore
          brandList={brandListDataSource[brandList]}
          selectedBrand={selectedBrand}
          handleNextBtn={this.handleNextBtn.bind(this)}
        />
      );
    } else if (step === 2) {
      return (
        <AddProduct/>
      );
    } else if (step === 3) {
      console.log(this.props);
      this.props.navigator.pop();
    }
    return null;
  }

  render() {
    return (
      <View style={styles.container}>
        {(this.state.step === 2) ?
          <Header
            back={this.handleHeaderBackBtn.bind(this)}
            next={this.handleNextBtn.bind(this)}
          />
          :
          <Header back={this.handleHeaderBackBtn.bind(this)}/>
        }
        {this.renderBody()}
      </View>
    );
  }
}

RegisterOrder.propTypes = {
  navigator: PropTypes.any,
  handleCreateOrderDone: PropTypes.func
};
