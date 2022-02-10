import * as TYPES from "../actions/types.js";

const initialState = {
  data: [],
  dataFetched: false,
  isFetching: false,
  error: false,
  searchHistory: []
};

export default function SearchReducer (state = initialState, action) {
  switch (action.type) {
    case TYPES.FETCHING_SEARCH_DATA:
      return {
        ...state,
        isFetching: true
      };
    case TYPES.FETCHING_SEARCH_DATA_SUCCESS:
      return {
        ...state,
        data: action.payload,
        isFetching: false,
        dataFetched: true,
        error: false
      };
    case TYPES.FETCHING_SEARCH_DATA_FAILURE:
      return {
        ...state,
        isFetching: false,
        error: true,
        dataFetched: true
      };
    case TYPES.FETCH_DATA_STATUS:
      return {
        ...state,
        isFetching: action.payload
      };
    case TYPES.FETCHING_SEARCH_HISTORY_DATA_SUCCESS:
      return {
        ...state,
        searchHistory: action.payload
      };

    default:
      return state;
  }
}