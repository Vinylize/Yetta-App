import CreateOrder from './../components/createOrder/createOrder';
import { connect } from 'react-redux';
import { setNode } from './../actions/createOrderActions';

const mapStateToProps = (state) => {
  return {
    node: state.createOrder.node
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setNode: (node) => {
      return dispatch(setNode(node));
    }
  };
};

const CreateOrderLayout = connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateOrder);

export default CreateOrderLayout;
