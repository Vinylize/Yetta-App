import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  Dimensions,
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

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

const styles = {
  container: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: WIDTH,
    height: HEIGHT,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    elevation: 1
  }
};

class NodeInfoView extends Component {
  constructor() {
    super();
    this.handleCancelBtn = this.handleCancelBtn.bind(this);
    this.shouldShowThisComponent = this.shouldShowThisComponent.bind(this);
  }

  componentWillUpdate(nextProps) {
    if (nextProps.markerTapped.show === true) {
      this.props.refBackgroundView && this.props.refBackgroundView.setNativeProps({style: {opacity: 0.5}});
    } else if (!nextProps.markerTapped.show) {
      this.props.refBackgroundView && this.props.refBackgroundView.setNativeProps({style: {opacity: 1}});
    }
  }

  handleCancelBtn() {
    this.props.resetMarkerTapped();
  }

  shouldShowThisComponent() {
    return (this.props.markerTapped.type === 'node');
  }

  render() {
    if (Platform.OS === 'ios' && !this.shouldShowThisComponent()) {
      return null;
    }
    const { eDP } = this.props.runnersOrderDetails;
    const { addr, n, p } = this.props.runnersOrderDetails.nId;
    const { customItem, regItem } = this.props.runnersOrderDetails.items;
    __DEV__ && console.log(regItem); // eslint-disable-line no-undef
    return (
      <View style={[styles.container, (Platform.OS === 'android' && !this.shouldShowThisComponent()) ? {
        height: 0} : {height: HEIGHT}]}>
        <View style={{
          height: HEIGHT * 0.5,
          width: WIDTH * 0.6,
          backgroundColor: '#f9f9f9',
          padding: 20,
          paddingRight: 0
        }}>
          <Text style={{
            color: 'black',
            fontSize: 16,
            marginBottom: 10
          }}>{n}</Text>
          <Text style={{
            color: 'black',
            fontSize: 14,
            marginBottom: 10
          }}>{addr}</Text>
          <Text style={{
            color: 'black',
            fontSize: 14,
            marginBottom: 10
          }}>{p}</Text>
          <Text style={{
            color: 'black',
            fontSize: 14,
            marginBottom: 10
          }}>{eDP}</Text>
          {customItem.map((el, i) =>
            <Text
              key={i}
              style={{
                color: 'black',
                fontSize: 14,
                marginBottom: 10
              }}
            >
              {el.n} x {el.cnt}
            </Text>
          )}
          <TouchableOpacity
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
              height: 30,
              width: 30,
              backgroundColor: 'transparent',
              justifyContent: 'center',
              alignItems: 'center'
            }}
            onPress={this.handleCancelBtn}
          >
            <Text style={{fontSize: 20}}>X</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

NodeInfoView.propTypes = {
  refBackgroundView: PropTypes.any.isRequired,

  // reducers/map
  markerTapped: PropTypes.object,
  setMarkerTapped: PropTypes.func,
  resetMarkerTapped: PropTypes.func,

  // reducers/orderStatus
  runnersOrderDetails: PropTypes.object
};

const mapStateToProps = (state) => {
  return {
    markerTapped: state.map.markerTapped,
    runnersOrderDetails: state.orderStatus.runnersOrderDetails
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setMarkerTapped: (markerTapped) => dispatch(setMarkerTapped(markerTapped)),
    resetMarkerTapped: () => dispatch(resetMarkerTapped())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NodeInfoView);
