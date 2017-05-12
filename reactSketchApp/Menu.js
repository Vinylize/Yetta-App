import React from 'react';
import { Image } from 'react-sketchapp';
import { Text, View, Platform } from 'react-primitives';

const WIDTH = 375;
const HEIGHT = 667;

const Menu = () => {
  return (
    <View
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        zIndex: 3,
        backgroundColor: 'transparent',
        width: WIDTH,
        height: HEIGHT - ((Platform.OS === 'android') ? 20 : 0),
        flexDirection: 'row',
        shadowOffset: {height: 1, width: 1},
        shadowOpacity: 0.2,
        elevation: 100
      }}
    >
      <View style={{
        flex: 75,
        paddingLeft: 48,
        borderBottomWidth: 1,
        borderColor: '#e0e3e5',
        width: WIDTH * 0.75,
        height: HEIGHT,
        backgroundColor: 'white',
        flexDirection: 'column',
        elevation: 30
      }}>
        <Image style={{
          height: 105,
          width: 105,
          borderRadius: 52.5,
          marginTop: 56
        }} source={{uri: 'https://www.dropbox.com/s/zv0zdbj578hw704/defaultProfileImg.png?raw=1'}}/>
        <View style={{
          marginTop: 20,
          flexDirection: 'row'
        }}>
          <Text style={{fontSize: 17, flex: 1, fontWeight: '600'}}>user name</Text>
          <View
            style={{
              marginRight: 50,
              padding: 3,
              alignItems: 'flex-end',
              width: 44,
              height: 20,
              justifyContent: 'center'
            }}
          >
            <Text style={{fontSize: 11}}>EDIT</Text>
          </View>
        </View>
        <View style={{marginTop: 9}}>
          <Text style={{fontSize: 13}}>111@111.com</Text>
        </View>
        <View style={{
          elevation: 30,
          marginTop: HEIGHT * 0.06,
          width: WIDTH * 0.75 - 48
        }}>
          <View
            style ={{
              marginTop: 40,
              height: 40,
              width: WIDTH * 0.2,
              justifyContent: 'center'
            }}
          >
            <Text
              style={{fontSize: 18}}
            >
              결제정보
            </Text>
          </View>
          <View
            style ={{
              marginTop: 12,
              height: 40,
              width: WIDTH * 0.2,
              justifyContent: 'center'
            }}>
            <Text
              style={{fontSize: 18}}
            >
              주문내역
            </Text>
          </View>
          <View
            style ={{
              marginTop: 12,
              height: 40,
              width: WIDTH * 0.2,
              justifyContent: 'center'
            }}>
            <Text style={{
              fontSize: 18
            }}>
              고객센터
            </Text>
          </View>
          <View
            style ={{
              marginTop: 12,
              height: 40,
              width: WIDTH * 0.2,
              justifyContent: 'center'
            }}
          >
            <Text
              style={{fontSize: 18}}
            >
              설정
            </Text>
          </View>
        </View>
      </View>
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          paddingRight: 16,
          backgroundColor: '#ff9700',
          height: 52,
          width: WIDTH * 0.75,
          justifyContent: 'center',
          alignItems: 'flex-end'
        }}
      >
        <Text style={{fontSize: 17, color: 'white'}}>
          배달하기
        </Text>
      </View>
      <View
        style={{flex: 30, backgroundColor: 'grey'}}
      />
    </View>
  );
};

export default Menu;
