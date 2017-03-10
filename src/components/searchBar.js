import React, { Component, PropTypes } from 'react';
import {
  Alert,
  TextInput,
  View,
  Image,
  LayoutAnimation,
  Keyboard,
  PanResponder,
  Dimensions,
  Animated,
  Easing,
  Text,
  TouchableOpacity,
  ListView
} from 'react-native';
import {APIKEY} from './../utils';

const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;

export default class SearchBar extends Component {
  constructor() {
    super();
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      onFocused: false,
      afterOnFocused: false,
      animateSearchBoxTop: new Animated.Value(100),
      animRotateX: new Animated.Value(0),
      animRotateY: new Animated.Value(0),
      listViewDataSource: ds.cloneWithRows([])
    };
    this.renderListView = this.renderListView.bind(this);
  }

  componentWillMount() {
    this.searchBarPanResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: this.searchBarHandlePanResponderGrant.bind(this),
      onPanResponderMove: this.searchBarHandlePanResponderMove.bind(this),
      onPanResponderRelease: this.searchBarHandlePanResponderRelease.bind(this)
    });
  }

  searchBarHandlePanResponderMove(e, gestureState) {
    const {dx, dy} = gestureState;
    console.log(dx);
    const y = `${dx / 11}deg`;
    const x = `${-dy / 8}deg`;
    this.refViewSearchBar.setNativeProps({style: {transform: [{perspective: 1000}, {rotateX: x}, {rotateY: y}]}});

  }

  searchBarHandlePanResponderGrant() {

  }

  searchBarHandlePanResponderRelease(e, gestureState) {
    const {dx, dy} = gestureState;
    this.animateSearchBoxRepos(dx, dy);
  }

  animateSearchBoxRepos(dx, dy) {
    this.state.animRotateX.setValue(-dy / 10);
    this.state.animRotateY.setValue(dx / 10);
    Animated.parallel([
      Animated.timing(
        this.state.animRotateX,
        {
          toValue: 0,
          duration: 500
        }
      ),
      Animated.timing(
        this.state.animRotateY,
        {
          toValue: 0,
          duration: 500
        }
      )
    ]).start();
  }

  animateSearchBoxUp() {
    return;
    this.state.animateSearchBoxTop.setValue(100);
    Animated.timing(
      this.state.animateSearchBoxTop,
      {
        toValue: 50,
        duration: 300,
        easing: Easing.linear
      }).start();
    LayoutAnimation.easeInEaseOut();
    this.setState({onFocused: true});
    setTimeout(() => this.setState({afterOnFocused: true}), 100);
  }

  animateSearchBoxDown() {
    this.state.animateSearchBoxTop.setValue(50);
    Animated.timing(
      this.state.animateSearchBoxTop,
      {
        toValue: 100,
        duration: 300,
        easing: Easing.linear
      }).start();
    LayoutAnimation.easeInEaseOut();
    this.setState({onFocused: false});
    setTimeout(() => this.setState({afterOnFocused: false}), 100);
  }

  renderRow(rowData) {
    console.log(rowData);
    return (
      <View style={{
        height: 50,
        width: WIDTH,
        borderBottomWidth: 1,
        borderBottomColor: '#f7f9f9',
        justifyContent: 'center',
        paddingLeft: 40
      }}>
        <Text style={{
          color: '#303233'
        }}>{rowData}</Text>
      </View>
    );
  }

  renderListView() {
    return (
      <ListView
        dataSource={this.state.listViewDataSource}
        renderRow={(rowData) => this.renderRow(rowData)}
        style={{flex: 1}}
        enableEmptySections
      />
    );
  }

  handleTextChange(text) {
    const AUTOCOMPLETEURL = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${text}` +
      `&location=${this.props.latitude},${this.props.longitude}&radius=500&key=${APIKEY}`;
    console.log(AUTOCOMPLETEURL);
    const arr = [];
    this.setState({
      text: text
    });
    fetch(AUTOCOMPLETEURL,{method: 'GET'})
      .then(response => response.json())
      .then(rjson => {
        if (rjson.status === 'OK') {
          console.log(rjson);
          return rjson.predictions;
        } else {
          throw new Error(rjson.error_message);
        }
      })
      .then(predictions => {
        console.log(predictions);
        predictions.map(place => {
          arr.push(place.description);
        });
        this.setState({listViewDataSource: this.state.listViewDataSource.cloneWithRows(arr)});
      })
      .catch(console.log)
  }

  render() {
    const mappedOpacity = this.state.animateSearchBoxTop.interpolate({
      inputRange: [50, 100],
      outputRange: [1, 0]
    });
    const { onFocused, afterOnFocused, animRotateX, animRotateY } = this.state;
    const interpolatedRotateX = animRotateX.interpolate({
      inputRange: [0, 100],
      outputRange: ['0deg', '100deg']
    });
    const interpolatedRotateY = animRotateY.interpolate({
      inputRange: [0, 100],
      outputRange: ['0deg', '100deg']
    });
    return (
      <View
        style={{
          position: 'absolute',
          left: (WIDTH - WIDTH * 0.8) / 2,
          top: 100,
          width: WIDTH * 0.8,
          height: 40,
          backgroundColor: 'transparent',
          zIndex: 100
        }}
        {...this.searchBarPanResponder.panHandlers}
      >
        <Animated.View
          ref={component => this.refViewSearchBar = component}
          style={(onFocused) ? {
            position: 'absolute',
            left: 0,
            top: 0,
            width: WIDTH,
            height: HEIGHT,
            backgroundColor: 'white',
            flexDirection: 'column'
          } : {
            position: 'absolute',
            left: 0,
            top: this.state.animateSearchBoxTop - 100,
            width: WIDTH * 0.8,
            height: 40,
            backgroundColor: 'white',
            shadowOffset: {height: 1, width: 1},
            shadowOpacity: 0.2,
            flexDirection: 'row',
            transform: [{perspective: 1000}, {rotateX: interpolatedRotateX}, {rotateY: interpolatedRotateY}]
          }
        }>
          <View style={(onFocused) ? {
              flex: 1,
              backgroundColor: 'white',
              shadowOffset: {height: 1, width: 1},
              shadowOpacity: (afterOnFocused) ? 0.2 : 0,
              justifyContent: 'space-between',
              paddingLeft: 17,
              paddingRight: 20,
              paddingTop: 20,
              flexDirection: 'row',
              zIndex: 1
            } : {
              flex: 10
            }}>
            <Animated.View style={[{
              width: 30,
              height: 20,
              alignSelf: 'center',
              marginTop: 5,
              opacity: mappedOpacity
            }, (onFocused) ? null : {position: 'absolute'}]}>
              <TouchableOpacity
                onPress={() => {
                  this.animateSearchBoxDown();
                  Keyboard.dismiss();
                }}
              >
                <Text style={{fontSize: 10}}>back</Text>
              </TouchableOpacity>
            </Animated.View>
            {(onFocused) ?
              <TextInput
                style={(onFocused) ? {
                    height: 40,
                    width: WIDTH * 0.8,
                    backgroundColor: '#f9f9f9',
                    alignSelf: 'center',
                    borderRadius: 4,
                    paddingLeft: 10
                  } : {height: 40, paddingLeft: 10}}
                onChangeText={this.handleTextChange.bind(this)}
                value={this.state.text}
                onFocus={() => this.animateSearchBoxUp()}
              />
              : null}
          </View>
          {(onFocused) ?
            <View style={{flex: 6.5}}>
              {this.renderListView()}
            </View>
            : null}
        </Animated.View>
      </View>
    );
  }
}

SearchBar.propTypes = {
  latitude: PropTypes.number,
  longitude: PropTypes.number
};