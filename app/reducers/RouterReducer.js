import * as TYPES from "../actions/types.js";

const initialState = {
  isUnmounting: false
};

export default function RouterReducer (state = initialState, action) {
  console.log(action.type);
  switch (action.type) {
  case 'REACT_NATIVE_ROUTER_FLUX_POP_TO':
    return {
      ...state,
      isUnmounting: true
    };
    case 'REACT_NATIVE_ROUTER_FLUX_BACK_ACTION':
      return {
        ...state,
        isUnmounting: true
      };
    case TYPES.UPDATE_UNMOUNT_STATE:
      return {
        ...state,
        isUnmounting: action.payload
      };
    default:
      return state;
  }
}
