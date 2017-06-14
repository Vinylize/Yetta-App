import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  ListView,
  Text,
  View,
  Dimensions,
  StyleSheet
} from 'react-native';
import * as YettaServerAPI from './../../service/YettaServerAPI/client';

import { handleError } from '../../utils/errorHandlers';

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
    marginLeft: DEFAULT_LEFT,
    marginBottom: 30,
    backgroundColor: '#ddd'
  },
  profileList: {
    height: 150,
    width: WIDTH,
    paddingLeft: DEFAULT_LEFT,
    paddingRight: DEFAULT_RIGHT,
    backgroundColor: 'white',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: LIST_BORDER_COLOR,
    flex: 1,
    flexDirection: 'column'
  },
  orderDate: {
    marginTop: 4,
    flexDirection: 'row'
  },
  orderDateText: {
    color: 'gray',
    fontSize: 10,
    fontWeight: '600'
  },
  orderStatus: {
    marginTop: 14,
    flexDirection: 'row'
  },
  orderStatusText: {
    fontSize: 16,
    fontWeight: '600'
  },
  orderStartInfo: {
    marginTop: 10,
    flexDirection: 'row'
  },
  orderStartInfoText: {
    fontSize: 11
  },
  orderFinishInfo: {
    marginTop: 3,
    flexDirection: 'row'
  },
  orderFinishInfoText: {
    fontSize: 11
  },
  orderItems: {
    marginTop: 5,
    justifyContent: 'flex-end',
    flexDirection: 'row'
  },
  orderItemsText: {
    fontSize: 13
  },
  orderPrice: {
    marginTop: 4,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  orderPriceText: {
    fontSize: 15,
    fontWeight: '600'
  }
};

class OrderHistory extends Component {
  constructor() {
    super();
    this.state = {
      orderHistory: [],
      statusCategory: {}
    };
  }

  componentDidMount() {
    YettaServerAPI.getLokkaClient()
      .then(client => {
        return client.query(`{
          viewer{
            orderStatusCategory
            orderHistory {
              id
              nId{
                n
                addr
              }
              rId{
                n
              }
              eDP
              rDP
              tP
              cAt
              status
              dest {
                n1
                n2
                lat
                lon
              }
              items{
                regItem {
                  iId
                  n
                  p
                  cnt
                }
                customItem {
                  manu
                  n
                  cnt
                }
              }
            }
          }
        }`);
      })
      .then(({viewer}) => {
        this.setState({
          statusCategory: JSON.parse(viewer.orderStatusCategory)
        });
        return viewer.orderHistory;
      })
      .then(orderHistory => {
        this.setState({
          orderHistory: orderHistory.map(order => {
            return {
              status: order.status,
              statusString: this.state.statusCategory[`${order.status}`].name,
              date: new Date(order.cAt).toISOString().slice(0, 10),
              itemSummary: this.getOrderItemSummary(order.items),
              startNode: `${order.nId.addr} ${order.nId.n}`,
              dest: `${order.dest.n1} ${order.dest.n2}`,
              eDP: order.eDP,
              rDP: order.rDP,
              tP: order.tP
            };
          })
        });
      })
      .catch(handleError);
  }

  getOrderItemSummary(item) {
    const allItems = item.regItem.map(el => el.n).concat(item.customItem.map(el => el.n));
    return allItems.length === 0 ? `${allItems[0]}` : `${allItems[0]} 외 ${allItems.length - 1}개`;
  }

  renderOrderHistoryRow(data) {
    switch (data.status) {
    case 0:
      return (
          <View style={styles.profileList}>
            <View style = {styles.orderStatus}>
              <Text style={styles.orderStatusText}>{data.statusString}</Text>
            </View>
            <View style = {styles.orderDate}>
              <Text style={styles.orderDateText}>{data.date}</Text>
            </View>
            <View style = {styles.orderStartInfo}>
              <Text style={styles.orderStartInfoText}>03:30</Text>
              <Text style={{...styles.orderStartInfoText, marginLeft: 30}}>{data.startNode}</Text>
            </View>
            <View style = {styles.orderFinishInfo}>
              <Text style={styles.orderFinishInfoText}>03:45</Text>
              <Text style={{...styles.orderFinishInfoText, marginLeft: 30}}>{data.dest}</Text>
            </View>
            <View style = {styles.orderItems}>
              <Text style={styles.orderItemsText}>{data.itemSummary}</Text>
            </View>
            <View style = {styles.orderPrice}>
              <Text style={styles.orderPriceText}>{`예상 결제금액 ${data.eDP + data.tP} 원`}</Text>
            </View>
          </View>);
    case 1:
      return (
          <View style={styles.profileList}>
            <View style = {styles.orderStatus}>
              <Text style={styles.orderStatusText}>{data.statusString}</Text>
            </View>
            <View style = {styles.orderDate}>
              <Text style={styles.orderDateText}>{data.date}</Text>
            </View>
            <View style = {styles.orderStartInfo}>
              <Text style={styles.orderStartInfoText}>03:30</Text>
              <Text style={{...styles.orderStartInfoText, marginLeft: 30}}>{data.startNode}</Text>
            </View>
            <View style = {styles.orderFinishInfo}>
              <Text style={styles.orderFinishInfoText}>03:45</Text>
              <Text style={{...styles.orderFinishInfoText, marginLeft: 30}}>{data.dest}</Text>
            </View>
            <View style = {styles.orderItems}>
              <Text style={styles.orderItemsText}>{data.itemSummary}</Text>
            </View>
            <View style = {styles.orderPrice}>
              <Text style={styles.orderPriceText}>0 원</Text>
            </View>
          </View>);
    case 2:
      return (
          <View style={styles.profileList}>
            <View style = {styles.orderStatus}>
              <Text style={styles.orderStatusText}>{data.statusString}</Text>
            </View>
            <View style = {styles.orderDate}>
              <Text style={styles.orderDateText}>{data.date}</Text>
            </View>
            <View style = {styles.orderStartInfo}>
              <Text style={styles.orderStartInfoText}>03:30</Text>
              <Text style={{...styles.orderStartInfoText, marginLeft: 30}}>{data.startNode}</Text>
            </View>
            <View style = {styles.orderFinishInfo}>
              <Text style={styles.orderFinishInfoText}>03:45</Text>
              <Text style={{...styles.orderFinishInfoText, marginLeft: 30}}>{data.dest}</Text>
            </View>
            <View style = {styles.orderItems}>
              <Text style={styles.orderItemsText}>{data.itemSummary}</Text>
            </View>
            <View style = {styles.orderPrice}>
              <Text style={styles.orderPriceText}>{`예상 결제금액 ${data.eDP + data.tP} 원`}</Text>
            </View>
          </View>);
    case 3:
      return (
          <View style={styles.profileList}>
            <View style = {styles.orderStatus}>
              <Text style={styles.orderStatusText}>{data.statusString}</Text>
            </View>
            <View style = {styles.orderDate}>
              <Text style={styles.orderDateText}>{data.date}</Text>
            </View>
            <View style = {styles.orderStartInfo}>
              <Text style={styles.orderStartInfoText}>03:30</Text>
              <Text style={{...styles.orderStartInfoText, marginLeft: 30}}>{data.startNode}</Text>
            </View>
            <View style = {styles.orderFinishInfo}>
              <Text style={styles.orderFinishInfoText}>03:45</Text>
              <Text style={{...styles.orderFinishInfoText, marginLeft: 30}}>{data.dest}</Text>
            </View>
            <View style = {styles.orderItems}>
              <Text style={styles.orderItemsText}>{data.itemSummary}</Text>
            </View>
            <View style = {styles.orderPrice}>
              <Text style={styles.orderPriceText}>{`총 결제금액 ${data.rDP + data.tP} 원`}</Text>
            </View>
          </View>);
    case 4:
      return (
          <View style={styles.profileList}>
            <View style = {styles.orderStatus}>
              <Text style={styles.orderStatusText}>{data.statusString}</Text>
            </View>
            <View style = {styles.orderDate}>
              <Text style={styles.orderDateText}>{data.date}</Text>
            </View>
            <View style = {styles.orderStartInfo}>
              <Text style={styles.orderStartInfoText}>03:30</Text>
              <Text style={{...styles.orderStartInfoText, marginLeft: 30}}>{data.startNode}</Text>
            </View>
            <View style = {styles.orderFinishInfo}>
              <Text style={styles.orderFinishInfoText}>03:45</Text>
              <Text style={{...styles.orderFinishInfoText, marginLeft: 30}}>{data.dest}</Text>
            </View>
            <View style = {styles.orderItems}>
              <Text style={styles.orderItemsText}>{data.itemSummary}</Text>
            </View>
            <View style = {styles.orderPrice}>
              <Text style={styles.orderPriceText}>취소 수수료 0 원</Text>
            </View>
          </View>);
    default :
      return null;
    }
  }

  render() {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return (
      <View style={styles.container}>
        <View style={styles.topContainer}>
          <Text style={styles.topContainerText}>주문 내역</Text>
        </View>
        <View style={{
          flex: 1
        }}>
          <ListView
            dataSource={ds.cloneWithRows(this.state.orderHistory)}
            renderRow={this.renderOrderHistoryRow}
            style={{backgroundColor: 'white'}}
          />
        </View>
      </View>
    );
  }
}

OrderHistory.propTypes = {
  navigation: PropTypes.object.isRequired,
  user: PropTypes.object
};

let mapStateToProps = (state) => {
  return {
    user: state.auth.user
  };
};

export default connect(mapStateToProps, undefined)(OrderHistory);
