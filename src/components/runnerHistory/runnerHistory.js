import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  ListView,
  Text,
  View,
  Dimensions,
  StyleSheet
} from 'react-native';

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
    marginLeft: DEFAULT_LEFT,
    marginBottom: 30,
    backgroundColor: '#ddd'
  },
  profileList: {
    height: 60,
    paddingLeft: DEFAULT_LEFT,
    backgroundColor: 'white',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: LIST_BORDER_COLOR
  },
  orderDate: {
    marginTop: 14,
    color: 'gray',
    fontSize: 10,
    fontWeight: '600'
  },
  orderStatus: {
    marginTop: 4,
    fontSize: 16,
    fontWeight: '300'
  }
};

class RunnerHistory extends Component {
  constructor() {
    super();
  }

  renderOrderHistoryRow() {
    return (
      <View style={styles.profileList}>
        <Text style={styles.orderDate}>dssd</Text>
        <Text style={styles.orderStatus}>dssdsd</Text>
      </View>);
  }

  render() {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return (
      <View style={styles.container}>
        <View style={styles.topContainer}>
          <Text style={styles.topContainerText}>배달 내역</Text>
        </View>
        <View style={{
          flex: 1,
          backgroundColor: 'white'
        }}>
          <ListView
            dataSource={ds.cloneWithRows(this.state.orderHistory)}
            renderRow={this.renderOrderHistoryRow}
            style={{backgroundColor: 'white'}}
            enableEmptySections
            removeClippedSubviews={false}
            contentContainerStyle={{alignItems: 'center'}}
          />
        </View>
      </View>
    );
  }
}

RunnerHistory.propTypes = {
  navigator: PropTypes.any,
  user: PropTypes.object
};

let mapStateToProps = (state) => {
  return {
    user: state.auth.user
  };
};

export default connect(mapStateToProps, undefined)(RunnerHistory);
