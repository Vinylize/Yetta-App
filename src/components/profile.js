import React, { Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import store from './../store';
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  StyleSheet
} from 'react-native';
import ImagePicker from 'react-native-image-picker';

import * as YettaServerAPIprofile from './../service/YettaServerAPI/profile';
import * as YettaServerAPIuserInfo from './../service/YettaServerAPI/userInfo';

// redux
import { setUser } from './../actions/authActions';

// assets
import IMG_DEFAULT_PROFILE_PIC from './../../assets/defaultProfileImg.png';

// constants
const WIDTH = Dimensions.get('window').width;
const DEFAULT_LEFT = WIDTH * 0.1;
const LIST_BORDER_COLOR = '#eee';

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9'
  },
  topContainer: {
    height: 100,
    padding: DEFAULT_LEFT,
    marginTop: 30,
    justifyContent: 'center'
  },
  topContainerText: {
    fontSize: 30,
    fontWeight: '500'
  },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginLeft: WIDTH / 2 - 55,
    marginBottom: 30
  },
  profileList: {
    height: 60,
    paddingLeft: DEFAULT_LEFT,
    backgroundColor: 'white',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: LIST_BORDER_COLOR
  },
  profileSubject: {
    marginTop: 14,
    color: 'gray',
    fontSize: 10,
    fontWeight: '600'
  },
  profileContent: {
    marginTop: 4,
    fontSize: 16,
    fontWeight: '300'
  }
};

class Profile extends Component {
  constructor() {
    super();
    this.showImagePicker = this.showImagePicker.bind(this);
    this.handleImageLoadError = this.handleImageLoadError.bind(this);
  }

  componentWillMount() {
    YettaServerAPIuserInfo.queryUser()
      .then(viewer => {
        __DEV__ && console.log(viewer); // eslint-disable-line no-undef
        const { pUrl } = viewer;
        const { user } = store.getState().auth;
        if (pUrl && user.pUrl) {
          if (pUrl !== user.pUrl) {
            // pUrl has been updated since the last userInfo query
            store.dispatch(setUser({...user, pUrl}));
          }
        }
      })
      .catch(err => {
        __DEV__ && console.log(err); // eslint-disable-line no-undef
      });
  }

  showImagePicker() {
    // change options for dialog customization
    const options = {
      cancelButtonTitle: '취소',
      takePhotoButtonTitle: '새 프로필 사진 촬영',
      chooseFromLibraryButtonTitle: '라이브러리에서 가져오기',
      skipBackup: true,
      path: 'images',
      mediaType: 'photo',
      quality: 0.9,
      maxWidth: 1000,
      maxHeight: 1000
    };
    ImagePicker.showImagePicker(options, (response) => {
      __DEV__ && console.log(response); // eslint-disable-line no-undef
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
        const imageDataBase64 = `data:image/jpeg;base64,${response.data}`;
        YettaServerAPIprofile.userProfileImageUpload(imageDataBase64)
          .then(() => {
            store.dispatch(setUser({...this.props.user, pUrl: response.uri}));
          });
      }
    });
  }

  handleImageLoadError() {
    // when pUrl is invalid, set pUrl as null and make profile Image default
    store.dispatch(setUser({...store.getState().auth.user, pUrl: null}));
  }

  renderProfileList(subject, content) {
    return (
      <View style={styles.profileList}>
        <Text style={styles.profileSubject}>{subject}</Text>
        <Text style={styles.profileContent}>{content}</Text>
      </View>);
  }

  renderProfilePicture() {
    return (
        <TouchableOpacity
          style={{
            width: 110,
            height: 110,
            borderRadius: 55,
            marginLeft: WIDTH / 2 - 55,
            marginBottom: 30
          }}
          onPress={this.showImagePicker.bind(this)}
          activeOpacity={0.9}
        >
          <Image
            style={{
              width: 110,
              height: 110,
              borderRadius: 55
            }}
            source={(this.props.user.pUrl) ? {uri: this.props.user.pUrl} : IMG_DEFAULT_PROFILE_PIC}
            onError={this.handleImageLoadError}
          />
        </TouchableOpacity>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.topContainer}>
          <Text style={styles.topContainerText}>프로필</Text>
        </View>
        {this.renderProfilePicture()}
        {this.renderProfileList('이름', this.props.user.n)}
        {this.renderProfileList('이메일', this.props.user.e)}
        {this.renderProfileList('전화 번호', this.props.user.p)}
      </View>
    );
  }
}

Profile.propTypes = {
  navigation: PropTypes.object.isRequired,
  user: PropTypes.object
};

let mapStateToProps = (state) => {
  return {
    user: state.auth.user
  };
};

export default connect(mapStateToProps, undefined)(Profile);
