import React, { Component, PropTypes } from 'react';
import {
  Dimensions,
  ListView,
  View,
  Text
} from 'react-native';

const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;

export default class FindStore extends Component {
  constructor() {
    super();
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      verticalListViewDataSource: ds.cloneWithRows([
        '편의점',
        '약국',
        'Stationery shop',
        'Others'
      ])
    };
  }

  renderVerticalListView() {
    return (
      <View style={{height: HEIGHT - 90, backgroundColor: 'yellow', marginTop: 90}}>
        <ListView
          dataSource={this.state.verticalListViewDataSource}
          renderRow={(rowData) => this.renderVerticalRow(rowData)}
          style={{backgroundColor: 'white'}}
          enableEmptySections
          removeClippedSubviews={false}
        />
      </View>
    );
  }

  renderVerticalRow(data) {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    let dataSource;
    if (data === '편의점') {
      dataSource = ds.cloneWithRows([
        'CU', '7eleven', 'GS25'
      ]);
    } else if (data === '약국') {
      dataSource = ds.cloneWithRows([
        'Brand1', 'Brand2', 'Brand3'
      ]);
    } else if (data === 'Stationary shop') {
      dataSource = ds.cloneWithRows([
        'Brand1', 'Brand2', 'Brand3'
      ]);
    } else {
      dataSource = ds.cloneWithRows([
        '1', '2', '3'
      ]);
    }

    return (
      <View style={{
        height: 200,
        marginTop: 10,
        backgroundColor: 'white',
        flexDirection: 'column'
      }}>
        <View style={{
          marginTop: 10,
          marginLeft: 32
        }}>
          <Text>{data}</Text>
        </View>
        <ListView
          dataSource={dataSource}
          renderRow={(rowData) => this.renderHorizontalListView(rowData)}
          style={{flex: 1, paddingLeft: 22}}
          enableEmptySections
          horizontal
          removeClippedSubviews={false}
        />
      </View>
    );
  }

  renderHorizontalListView(rowData) {
    return (
      <View style={{
        flex: 1,
        width: 110,
        backgroundColor: 'white',
        borderRadius: 2,
        marginTop: 16,
        marginRight: 18,
        marginLeft: 10,
        marginBottom: 14,
        shadowOffset: {height: 3, width: 3},
        shadowOpacity: 0.3,
        shadowRadius: 5,
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <View style={{
          width: 55,
          height: 55,
          backgroundColor: '#eeeff3',
          marginTop: 5,
          marginBottom: 20
        }}>

        </View>
        <Text>{rowData}</Text>
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
