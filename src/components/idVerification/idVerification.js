import React, { Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import {
  Dimensions,
  Image,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

// assets
import IMG_BACK from './../../../assets/left-arrow-key.png';

const WIDTH = Dimensions.get('window').width;

const styles = {
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#f9f9f9'
  }
};

class IdVerification extends Component {
  constructor() {
    super();
  }

  renderHeader() {
    return (
      <View style={{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <TouchableOpacity
          style={{marginTop: 10}}
          onPress={() => this.props.navigation.goBack()}
        >
          <Image
            style={{height: 24, width: 24, marginLeft: 12}}
            source={IMG_BACK}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={{marginTop: 10}}
          onPress={() => this.props.navigation.goBack()}
        >
          <Text style={{
            marginRight: 20,
            fontSize: 16
          }}>Skip</Text>
        </TouchableOpacity>
      </View>
    );
  }

  renderBody() {
    return (
      <View style={{
        flex: 7,
        paddingLeft: WIDTH * 0.1,
        paddingRight: WIDTH * 0.1
      }}>
        <View style={{
          flex: 1,
          justifyContent: 'flex-start',
          backgroundColor: 'transparent'
        }}>
          <Text style={{
            fontSize: 24,
            fontWeight: '600',
            marginTop: 16
          }}>
            러너 시작하기
          </Text>
          <Text style={{
            fontSize: 16,
            marginTop: 12
          }}>
            간단히 신분증 사진만 찍으면 시작할수있어요!
          </Text>
        </View>
        <View style={{flex: 4, backgroundColor: 'transparent'}}/>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderHeader()}
        {this.renderBody()}
      </View>
    );
  }
}

IdVerification.propTypes = {
  navigation: PropTypes.object.isRequired,
  user: PropTypes.object
};

let mapStateToProps = (state) => {
  return {
    user: state.auth.user
  };
};

export default connect(mapStateToProps, undefined)(IdVerification);
