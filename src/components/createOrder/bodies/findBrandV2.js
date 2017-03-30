import React, { Component, PropTypes } from 'react';
import {
  Dimensions,
  ListView,
  View,
  Text,
  TouchableOpacity
} from 'react-native';

const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;

export default class FindBrandV2 extends Component {
  constructor() {
    super();
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      verticalListViewDataSource: ds.cloneWithRows([
        ['편의점', '음식점'],
        ['수퍼', '약국']
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

  renderVerticalRow(data, index) {
    let arr = [];
    data.map((name, i) => {
      arr.push(this.renderHorizontalListView(name, i, index));
    });
    return (
      <View style={{
        height: 174,
        marginTop: 40,
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        {arr}
      </View>
    );
  }

  renderHorizontalListView(rowData, i, index) {
    return (
      <TouchableOpacity
        key={i}
        style={{
          height: 150,
          width: WIDTH * 0.3,
          backgroundColor: 'white',
          borderRadius: 2,
          margin: 20,
          marginBottom: 14,
          shadowOffset: {height: 3, width: 3},
          shadowOpacity: 0.3,
          shadowRadius: 5,
          justifyContent: 'center',
          alignItems: 'center'
        }}
        onPress={() => this.props.handleBrandBtn(rowData, index)}
      >
        {false ? <View style={{
          width: 55,
          height: 55,
          backgroundColor: '#eeeff3',
          marginTop: 5,
          marginBottom: 20
        }}>
        </View> : null}
        <Text>{rowData}</Text>
      </TouchableOpacity>
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
