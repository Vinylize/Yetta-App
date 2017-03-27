import React, { Component, PropTypes } from 'react';
import {
  TextInput,
  View,
  Keyboard,
  Dimensions,
  Animated,
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
      listViewDataSource: ds.cloneWithRows([])
    };
    this.renderListView = this.renderListView.bind(this);
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
    fetch(AUTOCOMPLETEURL, {method: 'GET'})
      .then(response => response.json())
      .then(rjson => {
        if (rjson.status === 'OK') {
          console.log(rjson);
          return rjson.predictions;
        }
        throw new Error(rjson.error_message);
      })
      .then(predictions => {
        console.log(predictions);
        predictions.map(place => {
          arr.push(place.description);
        });
        this.setState({listViewDataSource: this.state.listViewDataSource.cloneWithRows(arr)});
      })
      .catch(console.log);
  }

  render() {
    const { onFocused } = this.state;
    return (
      <View
        style={{
          position: 'absolute',
          left: (onFocused) ? 0 : (WIDTH - WIDTH * 0.8) / 2,
          top: 0,
          width: WIDTH * 0.8,
          height: 40,
          backgroundColor: 'transparent',
          zIndex: 100
        }}
      >
        <View
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
            top: 100,
            width: WIDTH * 0.8,
            height: 40,
            backgroundColor: 'white',
            shadowOffset: {height: 1, width: 1},
            shadowOpacity: 0.2,
            flexDirection: 'row'
          }
        }>
          <TouchableOpacity style={(onFocused) ? {
              flex: 1,
              backgroundColor: 'white',
              shadowOffset: {height: 1, width: 1},
              shadowOpacity: 0.2,
              justifyContent: 'space-between',
              paddingLeft: 17,
              paddingRight: 20,
              paddingTop: 20,
              flexDirection: 'row',
              zIndex: 1
            } : {
              flex: 10
            }}
            onPress={() => {
              this.setState({onFocused: !onFocused});
            }}
          >
            <View style={{
              width: 30,
              height: 20,
              alignSelf: 'center',
              marginTop: 5
            }}>
              {(onFocused) ?
                <TouchableOpacity onPress={() => {
                  this.setState({onFocused: false});
                  Keyboard.dismiss();
                }}>
                  <Text style={{fontSize: 10}}>back</Text>
                </TouchableOpacity>
                : null}
            </View>
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
              />
              : null}
          </TouchableOpacity>
          {(onFocused) ?
            <View style={{flex: 6.5}}>
              {this.renderListView()}
            </View>
            : null}
        </View>
      </View>
    );
  }
}

SearchBar.propTypes = {
  latitude: PropTypes.number,
  longitude: PropTypes.number
};
