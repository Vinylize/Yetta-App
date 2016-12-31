import Relay from 'react-relay';

export default class HomeRoute extends Relay.Route {
  static routeName = 'HomeRoute';
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
