import React, { Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import {
  Dimensions,
  Image,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import ImagePicker from 'react-native-image-picker';

import * as YettaServerAPIverification from './../../service/YettaServerAPI/verification';

// assets
import IMG_ID_CARD from './../../../assets/id-card.png';

// const HEIGHT = Dimensions.get('window').height;
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
    this.state = {
      idImage: undefined,
      imageUri: undefined
    };
  }

  showImagePicker() {
    // change options for dialog customization
    const options = null;
    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        __DEV__ && console.log('User cancelled image picker'); // eslint-disable-line no-undef
      } else if (response.error) {
        __DEV__ && console.log('ImagePicker Error: ', response.error); // eslint-disable-line no-undef
      } else if (response.customButton) {
        __DEV__ && console.log('User tapped custom button: ', response.customButton); // eslint-disable-line no-undef
      } else {
        let source = { uri: response.uri };
        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };
        __DEV__ && console.log(source); // eslint-disable-line no-undef
        this.setState({
          idImage: source,
          imageDataBase64: `data:image/jpeg;base64,${response.data}`
        });
      }
    });
  }

  handleSubmitButton() {
    YettaServerAPIverification.idVerificationImageUpload(this.state.imageDataBase64);
  }

  renderImage() {
    return (
      <View>
        <Text style={{
          color: 'grey',
          marginLeft: 10
        }}>
          * Please expose the front numbers only of your social security card.
        </Text>
        <View style={{
          height: 210,
          width: WIDTH * 0.7 + 10,
          justifyContent: 'center',
          alignSelf: 'center',
          alignItems: 'center'
        }}>
          {(this.state.idImage) ?
            <Image
              style={{
                height: 200,
                width: WIDTH * 0.7,
                backgroundColor: 'transparent'
              }}
              source={this.state.idImage}
              resizeMode="contain"
            />
            :
            <Image
              style={{
                height: 200,
                width: WIDTH * 0.7,
                backgroundColor: 'transparent'
              }}
              source={IMG_ID_CARD}
              resizeMode="contain"
            />
          }
        </View>
      </View>
    );
  }

  renderBody() {
    return (
      <View style={{
        flex: 6,
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
            marginTop: 16,
            color: 'black'
          }}>
            러너 시작하기
          </Text>
          <Text style={{
            fontSize: 16,
            marginTop: 12,
            color: 'black'
          }}>
            간단히 신분증 사진만 찍으면 시작할수있어요!
          </Text>
        </View>
        <View style={{
          flex: 4,
          backgroundColor: 'transparent',
          justifyContent: 'center'
        }}>
          {this.renderImage()}
        </View>
      </View>
    );
  }

  renderBottom() {
    return (
      <View style={{
        flex: 2,
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        paddingLeft: WIDTH * 0.15,
        paddingRight: WIDTH * 0.15,
        backgroundColor: 'transparent'
      }}>
        <TouchableOpacity
          style={{
            height: 50,
            width: WIDTH * 0.31,
            backgroundColor: 'black',
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center'
          }}
          onPress={this.showImagePicker.bind(this)}
        >
          <Text style={{
            backgroundColor: 'transparent',
            color: 'white',
            fontWeight: '500'
          }}>
            {(this.state.idImage) ? '다시고르기' : '사진고르기'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            height: 50,
            width: WIDTH * 0.31,
            backgroundColor: (this.state.idImage) ? 'black' : 'grey',
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center'
          }}
          activeOpacity={(this.state.idImage) ? 0.7 : 1}
          onPress={this.handleSubmitButton.bind(this)}
        >
          <Text style={{
            backgroundColor: 'transparent',
            color: 'white',
            fontWeight: '500'
          }}>
            제출하기
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderBody()}
        {this.renderBottom()}
      </View>
    );
  }
}

IdVerification.propTypes = {
  user: PropTypes.object
};

let mapStateToProps = (state) => {
  return {
    user: state.auth.user
  };
};

export default connect(mapStateToProps, undefined)(IdVerification);
