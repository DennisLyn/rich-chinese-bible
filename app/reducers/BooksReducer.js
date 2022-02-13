import * as TYPES from "../actions/types.js";

const initialState = {
  data: [],
  dataFetched: false,
  isFetching: false,
  error: false
};

export default function BooksReducer (state = initialState, action) {
  switch (action.type) {
    case TYPES.FETCHING_BOOKS_DATA:
      return {
        ...state,
        isFetching: true
      };
    case TYPES.FETCHING_BOOKS_DATA_SUCCESS:
      return {
        ...state,
        data: action.payload,
        isFetching: false,
        dataFetched: true,
        error: false
      };
    case TYPES.FETCHING_BOOKS_DATA_FAILURE:
      return {
        ...state,
        isFetching: false,
        error: true,
        dataFetched: true
      };

    default:
      return state;
  }
}

