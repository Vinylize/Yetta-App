import React, { Component, PropTypes } from 'react';
import {
  Dimensions,
  Image,
  ListView,
  View,
  Text,
  TouchableOpacity
} from 'react-native';

import picFood from './../../../../assets/category/food.jpg';
import picConvenienceStore from './../../../../assets/category/convenienceStore.jpg';
import picGroceries from './../../../../assets/category/groceries.jpg';
import picDrugStore from './../../../../assets/category/Drugstore.jpg';
import picCosmetics from './../../../../assets/category/cosmetics.jpg';

const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;

export default class FindBrandV2 extends Component {
  constructor() {
    super();
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      verticalListViewDataSource: ds.cloneWithRows([
        ['음식 배달시키기', picFood],
        ['편의점에서 배달시키기', picConvenienceStore],
        ['수퍼에서 배달시키기', picGroceries],
        ['약 배달시키기', picDrugStore],
        ['화장품 배달시키기', picCosmetics],
        ['기타', '']
      ])
    };
  }

  renderVerticalListView() {
    return (
      <View style={{height: HEIGHT - 90, backgroundColor: 'yellow', marginTop: 90}}>
        <ListView
          dataSource={this.state.verticalListViewDataSource}
          renderRow={(rowData, sectionID, rowID) => this.renderVerticalRow(rowData, rowID)}
          style={{backgroundColor: 'white'}}
          enableEmptySections
          removeClippedSubviews={false}
        />
      </View>
    );
  }

  renderVerticalRow(rowData, rowID) {
    return (
      <View style={{
        height: 140,
        width: WIDTH,
        marginTop: 0,
        marginBottom: 1,
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Image
          style={{
            height: 140,
            width: WIDTH,
            opacity: 0.5,
            justifyContent: 'center',
            alignItems: 'center'
          }}
          source={rowData[1]}
          resizeMode={Image.resizeMode.cover}
        />
        <TouchableOpacity
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: 140,
            width: WIDTH,
            justifyContent: 'center',
            alignItems: 'center'
          }}
          onPress={() => this.props.handleBrandBtn(rowData, rowID)}
        >
          <Text style={{
            backgroundColor: 'transparent',
            fontSize: 26,
            fontWeight: '600',
            color: 'black'
          }}>{rowData[0]}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    return (
      <View style={{
        flex: 1,
        width: WIDTH
      }}>
        {this.renderVerticalListView()}
      </View>
    );
  }
}

FindBrandV2.propTypes = {
  handleBrandBtn: PropTypes.func.isRequired
};
