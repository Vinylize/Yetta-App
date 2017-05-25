import React, { Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import store from './../store';
import {
  Dimensions,
  Image,
  Keyboard,
  LayoutAnimation,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import ImagePicker from 'react-native-image-picker';

import * as YettaServerAPIprofile from './../service/YettaServerAPI/profile';
import * as YettaServerAPIuserInfo from './../service/YettaServerAPI/userInfo';

// redux
import { setUser } from './../actions/authActions';

// assets
import IMG_DEFAULT_PROFILE_PIC from './../../assets/defaultProfileImg.png';
import IMG_EDIT from './../../assets/edit.png';
import IMG_CHECKED from './../../assets/checked.png';
import IMG_CANCEL from './../../assets/cancel.png';

// constants
const WIDTH = Dimensions.get('window').width;
const DEFAULT_LEFT = WIDTH * 0.1;
const DEFAULT_RIGHT = WIDTH * 0.1;
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
    borderBottomColor: LIST_BORDER_COLOR,
    flexDirection: 'column'
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
  },
  profileNameEditContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'flex-end'
  },
  profileNameEditTouchableOpacity: {
    height: 30,
    width: 30,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center'
  },
  profileNameEditImage: {
    height: 20,
    width: 20,
    opacity: 0.5
  }
};

class Profile extends Component {
  constructor() {
    super();
    this.state = {
      currentlyEditingName: false,
      name: undefined
    };
    this.showImagePicker = this.showImagePicker.bind(this);
    this.handleImageLoadError = this.handleImageLoadError.bind(this);
  }

  componentWillMount() {
    YettaServerAPIuserInfo.queryUser()
      .then(viewer => {
        __DEV__ && console.log(viewer); // eslint-disable-line no-undef
        const { user } = store.getState().auth;

        // check if pUrl has been updated
        const { pUrl } = viewer;
        if (pUrl && user.pUrl) {
          if (pUrl !== user.pUrl) {
            // pUrl has been updated since the last userInfo query
            store.dispatch(setUser({...user, pUrl}));
          }
        }

        // check if user name has been updated
        const { n } = viewer;
        if (n && user.n) {
          if (n !== user.n) {
            store.dispatch(setUser({...user, n}));
          }
        }
      })
      .catch(err => {
        __DEV__ && console.log(err); // eslint-disable-line no-undef
      });
  }

  componentWillMount() {
    this.setState(() => {
      return {name: this.props.user.n};
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

  handleEditNameButton() {
    LayoutAnimation.easeInEaseOut();
    this.setState(() => {
      return {currentlyEditingName: true};
    });
  }

  handleCancelEditNameButton() {
    LayoutAnimation.easeInEaseOut();
    this.setState(() => {
      return {currentlyEditingName: false};
    });
  }

  handleSubmitNewNameButton() {
    YettaServerAPIprofile.userChangeName(this.state.name)
      .then(() => {
        this.setState(() => {
          return {currentlyEditingName: false};
        });
        store.dispatch(setUser({...this.props.user, n: this.state.name}));
      })
      .catch(err => {
        __DEV__ && console.log(err); // eslint-disable-line no-undef
      });
  }

  renderProfileList(subject, content) {
    return (
      <View style={styles.profileList}>
        <Text style={styles.profileSubject}>{subject}</Text>
        <Text style={styles.profileContent}>{content}</Text>
      </View>
    );
  }

  renderProfileName(subject, content) {
    return (
      <View style={[styles.profileList, {flexDirection: 'row'}]}>
        <View style={{flex: 1, flexDirection: 'column'}}>
          <Text style={styles.profileSubject}>{subject}</Text>
          <Text style={styles.profileContent}>{content}</Text>
        </View>
        <View style={styles.profileNameEditContainer}>
          <TouchableOpacity
            style={[styles.profileNameEditTouchableOpacity, {
              marginRight: DEFAULT_RIGHT
            }]}
            onPress={this.handleEditNameButton.bind(this)}
          >
            <Image
              style={styles.profileNameEditImage}
              source={IMG_EDIT}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  renderEditName() {
    return (
      <View style={[styles.profileList, {
        flexDirection: 'row',
        height: 80
      }]}>
        <View style={{
          flex: 1,
          backgroundColor: 'transparent',
          justifyContent: 'center'
        }}>
          <Text style={[styles.profileSubject, {marginTop: 0}]}>
            이름 바꾸기
          </Text>
          <TextInput
            style={{height: 40}}
            placeholder="이름 바꾸기"
            onChangeText={(text) => this.setState({name: text})}
            value={this.state.name}
            underlineColorAndroid={'white'}
            autoFocus
          />
        </View>
        <View style={{
          flex: 0.25,
          flexDirection: 'row',
          backgroundColor: 'transparent',
          alignItems: 'center'
        }}>
          <TouchableOpacity
            style={[styles.profileNameEditTouchableOpacity,
              {marginRight: 20}
            ]}
            onPress={this.handleSubmitNewNameButton.bind(this)}
          >
            <Image
              style={styles.profileNameEditImage}
              source={IMG_CHECKED}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
        <View style={{
          flex: 0.25,
          flexDirection: 'row',
          backgroundColor: 'transparent',
          alignItems: 'center'
        }}>
          <TouchableOpacity
            style={styles.profileNameEditTouchableOpacity}
            onPress={this.handleCancelEditNameButton.bind(this)}
          >
            <Image
              style={styles.profileNameEditImage}
              source={IMG_CANCEL}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>
    );
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
      <TouchableOpacity
        style={styles.container}
        onPress={Keyboard.dismiss}
        activeOpacity={1}
      >
        <View style={styles.topContainer}>
          <Text style={styles.topContainerText}>프로필</Text>
        </View>
        {this.renderProfilePicture()}
        {(this.state.currentlyEditingName) ?
          this.renderEditName() :
          this.renderProfileName('이름', this.props.user.n)}
        {this.renderProfileList('이메일', this.props.user.e)}
        {this.renderProfileList('전화 번호', this.props.user.p)}
      </TouchableOpacity>
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
