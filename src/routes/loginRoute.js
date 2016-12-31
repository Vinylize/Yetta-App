import Relay from 'react-relay';

export default class LoginRoute extends Relay.Route {
  static routeName = 'LoginRoute';
  static queries = {
    Users: (Component) => {
      return Relay.QL `
        query {
          viewer {
            ${Component.getFragment('Users')}
          }
        }
      `;
    }
  };
}
