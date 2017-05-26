import React, { Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import {
  Dimensions,
  Image,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

// redux functions
import { setWaitingNewOrder } from './../../actions/runnerStatusActions';

// assets
import IMG_DEFAULT_PROFILE_PIC from './../../../assets/defaultProfileImg.png';
import IMG_COINS from './../../../assets/runnerDashboard/coins.png';
import IMG_PRESENTATION from './../../../assets/runnerDashboard/presentation.png';
import IMG_QUESTION from './../../../assets/runnerDashboard/question.png';

const WIDTH = Dimensions.get('window').width;

const styles = {
  container: {
    flex: 1
  }
};

class RunnerOnDeliveryView extends Component {
  constructor() {
    super();
    this.state = {
      // TBD
    };
    this.handleStartButton = this.handleStartButton.bind(this);
  }

  handleStartButton() {
    this.props.setWaitingNewOrder(true);
  }

  renderTop() {
    return (
      <View style={{
        flex: 1.1,
        flexDirection: 'column',
        backgroundColor: 'transparent'
      }}>
        <View style={{
          flex: 1,
          justifyContent: 'flex-end',
          alignItems: 'center'
        }}>
          <Image
            style={{
              width: 100,
              height: 100,
              borderRadius: 50
            }}
            source={(this.props.user.pUrl) ? {uri: this.props.user.pUrl} : IMG_DEFAULT_PROFILE_PIC}
          />
        </View>
        <View style={{
          flex: 0.35,
          backgroundColor: 'transparent',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Text style={{
            fontSize: 20,
            color: 'black',
            fontWeight: '600'
          }}>러너 {this.props.user.n}</Text>
        </View>
      </View>
    );
  }

  renderBodyStatistics(name, number, unit) {
    return (
      <View style={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <View style={{flexDirection: 'row'}}>
          <Text style={{
            fontSize: 20,
            fontWeight: '600',
            color: 'black',
            marginBottom: 4
          }}>{number}</Text>
          <Text style={{
            alignSelf: 'center'
          }}>{unit}</Text>
        </View>
        <Text style={{
          fontSize: 12,
          color: 'grey'
        }}>{name}</Text>
      </View>
    );
  }

  renderBodyButton(name, img) {
    return (
      <TouchableOpacity style={{
        flex: 1,
        backgroundColor: 'transparent',
        margin: 0,
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Image
          style={{
            height: 40,
            width: 40
          }}
          source={img}
        />
        <Text style={{
          marginTop: 12
        }}>{name}</Text>
      </TouchableOpacity>
    );
  }

  renderBody() {
    return (
      <View style={{
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'transparent',
        justifyContent: 'flex-start'
      }}>
        <View style={{
          height: 80,
          flexDirection: 'row',
          borderTopWidth: 1,
          borderBottomWidth: 1,
          borderColor: '#e0e0e0',
          marginLeft: 20,
          marginRight: 20,
          marginTop: 20
        }}>
          {this.renderBodyStatistics('내 별점', this.props.user.r)}
          {this.renderBodyStatistics('이번달 수익', '12,000', '원')}
          {this.renderBodyStatistics('이번달 총 건수', '8', '번')}
        </View>
        <View style={{
          height: 100,
          flexDirection: 'row',
          marginTop: 20,
          marginLeft: 20,
          marginRight: 20,
          backgroundColor: 'transparent'
        }}>
          {this.renderBodyButton('내 지갑', IMG_COINS)}
          {this.renderBodyButton('통계', IMG_PRESENTATION)}
          {this.renderBodyButton('도움말', IMG_QUESTION)}
        </View>
      </View>
    );
  }

  renderBottom() {
    return (
      <View style={{
        flex: 0.54,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <TouchableOpacity
          style={{
            height: 60,
            width: WIDTH * 0.7,
            backgroundColor: 'black',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 2
          }}
          onPress={this.handleStartButton}
        >
          <Text style={{
            fontSize: 18,
            color: 'white'
          }}>
            러너 시작하기
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderTop()}
        <View style={{flex: 0.1, backgroundColor: 'transparent'}}/>
        {this.renderBody()}
        {this.renderBottom()}
      </View>
    );
  }
}

RunnerOnDeliveryView.propTypes = {
  setWaitingNewOrder: PropTypes.func,
  user: PropTypes.object
};

const mapStateToProps = (state) => {
  return {
    user: state.auth.user
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setWaitingNewOrder: (waitingNewOrder) => dispatch(setWaitingNewOrder(waitingNewOrder))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RunnerOnDeliveryView);
