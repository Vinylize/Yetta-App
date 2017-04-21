import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  // Image,
  Text,
  View,
  Dimensions,
  StyleSheet
} from 'react-native';
// import BTclient from 'braintree-web/client';
// const createClient = BTclient.create;
import firebase from 'firebase';

import { URL } from './../../utils';

const Lokka = require('lokka').Lokka;
const Transport = require('lokka-transport-http').Transport;

const client = new Lokka({
  transport: new Transport(URL)
});

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
  profileSubject: {
    marginTop: 14,
    color: 'gray',
    fontSize: 10,
    fontWeight: '600'
  },
  profileContent: {
    marginTop: 4,
    fontSize: 16,
    fontWeight: '300'
  }
};

class PaymentInfo extends Component {
  constructor() {
    super();
  }

  componentDidMount() {
    firebase.auth().currentUser.getToken().then((token) => {
      client._transport._httpOptions.headers = {
        authorization: token
      };
      return client.query(`{
        viewer{
          braintreeToken
        }
      }`
      );
    })
    // .then(res => {
    //   createClient({
    //     authorization: res.viewer.braintreeToken
    //   }, function (createErr, clientInstance) {
    //     console.log(createErr,clientInstance);
    //     const data = {
    //       creditCard: {
    //         number: '12332132232323',
    //         cvv: '332',
    //         expirationDate: '0434',
    //         // billingAddress: {
    //         //   postalCode: form['cc-postal'].value
    //         // },
    //         options: {
    //           validate: false
    //         }
    //       }
    //     };
    //
    //     // Warning: For a merchant to be eligible for the easiest level of PCI compliance (SAQ A),
    //     // payment fields cannot be hosted on your checkout page.
    //     // For an alternative to the following, use Hosted Fields.
    //     clientInstance.request({
    //       endpoint: 'payment_methods/credit_cards',
    //       method: 'post',
    //       data: data
    //     }, function (requestErr, response) {
    //       // More detailed example of handling API errors: https://codepen.io/braintree/pen/MbwjdM
    //       if (requestErr) { throw new Error(requestErr); }
    //
    //       console.log('Got nonce:', response.creditCards[0].nonce);
    //     });
    //   });
    // });

  }

  renderProfileList(subject, content) {
    return (
      <View style={styles.profileList}>
        <Text style={styles.profileSubject}>{subject}</Text>
        <Text style={styles.profileContent}>{content}</Text>
      </View>);
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.topContainer}>
          <Text style={styles.topContainerText}>결제 정보</Text>
        </View>
        {this.renderProfileList('카드1', '1111 **** 1111 ****')}
        {this.renderProfileList('카드2', '2222 **** 2222 ****')}
        {this.renderProfileList('카드3', '3333 **** 3333 ****')}
      </View>
    );
  }
}

PaymentInfo.propTypes = {
  navigator: PropTypes.any,
  user: PropTypes.object
};

let mapStateToProps = (state) => {
  return {
    user: state.auth.user
  };
};

export default connect(mapStateToProps, undefined)(PaymentInfo);
