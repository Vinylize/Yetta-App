import React from 'react';
import { render } from 'react-sketchapp';
import { View } from 'react-primitives';
import Menu from './Menu';
import HomeView from './homeView';

const WIDTH = 375;
const HEIGHT = 667;

const Page = () => (
  <View>
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: WIDTH * 2 + 50,
        height: HEIGHT,
        backgroundColor: 'white'
      }}
    >
      <HomeView/>
      <Menu/>
    </View>
  </View>
);

export default (context) => {
  render(<Page/>, context.document.currentPage());
};
