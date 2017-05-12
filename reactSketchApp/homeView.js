import React from 'react';
import { Image } from 'react-sketchapp';
import { Text, View } from 'react-primitives';

// constants
const WIDTH = 375;
const HEIGHT = 667;


const renderAddBtn = () => {
  return (
    <View
      style={{
        position: 'absolute',
        right: 20,
        bottom: 20,
        height: 40,
        width: 40,
        borderRadius: 50,
        backgroundColor: 'white',
        shadowOffset: {height: 1, width: 2},
        shadowOpacity: 0.23,
        elevation: 3,
        zIndex: 0
      }}
    />
  );
};

const renderMap = () => {
  return (
    <Image
     style={{flex: 1}}
     source={{uri: 'https://www.dropbox.com/s/x909mzdnpe2877t/Screen%20Shot%202017-05-13%20at%201.42.36%20AM.png?raw=1'}}
    />
  );
};

const renderSearchBar = () => {
  return (
    <View
      style={{
        position: 'absolute',
        left: (WIDTH - WIDTH * 0.8) / 2,
        top: 100,
        width: WIDTH * 0.8,
        height: 50,
        backgroundColor: 'white',
        elevation: 40,
        zIndex: 3
      }}
    >
      <View style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: WIDTH * 0.8,
        height: 50,
        backgroundColor: 'white',
        shadowOffset: {height: 1, width: 1},
        shadowOpacity: 0.2,
        flexDirection: 'row'
      }}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
            shadowOffset: {height: 1, width: 1},
            shadowOpacity: 0.2,
            justifyContent: 'space-between',
            paddingLeft: 17,
            paddingRight: 20,
            paddingTop: 20,
            flexDirection: 'row',
            elevation: 1
          }}
        >
          <Text style={{
            alignSelf: 'center',
            color: '#979797',
            top: -9,
            fontSize: 16
          }}>어디로 배달하시겠어요?</Text>
        </View>
      </View>
    </View>
  );
};

const renderLocationBtn = () => {
  return (
    <View
      style={{
        position: 'absolute',
        right: 26,
        bottom: 80,
        height: 25,
        width: 25,
        borderRadius: 20,
        backgroundColor: '#2E3031',
        shadowOffset: {height: 1, width: 1},
        shadowOpacity: 0.2,
        elevation: 3,
        zIndex: 1
      }}
    />
  );
};

const renderMenuButton = () => {
  return (
    <View
      style={{
        backgroundColor: 'transparent',
        position: 'absolute',
        left: 20,
        top: 46,
        width: 30,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
        elevation: 70
      }}
    >
      <Text style={{fontSize: 11}}>Menu</Text>
    </View>
  );
};

const home = () => {
  return (
    <View style={{
      position: 'absolute',
      left: WIDTH + 50,
      top: 0,
      width: WIDTH,
      height: HEIGHT,
      backgroundColor: '#2E3031'
    }}>
      {renderMenuButton()}
      <View
        style={{flex: 1}}
      >
        {renderMap()}
        {renderAddBtn()}
        {renderSearchBar()}
        {renderLocationBtn()}
      </View>
    </View>
  );
};

export default home;
