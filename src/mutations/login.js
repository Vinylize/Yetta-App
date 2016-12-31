import Relay from 'react-relay';

export default class LoginMutation extends Relay.Mutation {
  static initialVariables = {
    input: null
  };

  getMutation() {
    return Relay.QL`
      mutation {
        getToken
      }
    `;
  }

  getVariables() {
    return {
      email: this.props.input.email,
      password: this.props.input.password
    };
  }

  getFatQuery() {
    return Relay.QL`
      fragment on getTokenPayload {
        user{
          _id
          name
        }
      }
    `
  }

  getConfigs() {
    return [{
      type: 'REQUIRED_CHILDREN',
      children: [Relay.QL `
        fragment on getTokenPayload {
          user{
            _id
            accessToken
          }
        }
      `]
    }]
  }

  getOptimisticResponse() {
    return {
      loginUser: this.props.loginUser
    }
  }
}
