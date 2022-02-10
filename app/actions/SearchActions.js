import * as TYPES from "./types";
import {store} from "../AppContainer";
import {AsyncStorage} from 'react-native';
const searchHistoryAsyncKey = 'cbible_searchHistory';

export function getSearchData() {
    return {
      type: TYPES.FETCHING_SEARCH_DATA,
      payload: null
    };
}

export function getSearchDataSuccess(data) {
  return {
    type: TYPES.FETCHING_SEARCH_DATA_SUCCESS,
    payload: data
  };
}

export function getSearchDataFailure() {
  return {
    type: TYPES.FETCHING_SEARCH_DATA_FAILURE,
    payload: []
  };
}

export function fetchDataStatus(status) {
  return {
    type: TYPES.FETCH_DATA_STATUS,
    payload: status
  };
}

export function getSearchHistorySuccess(data) {
  return {
    type: TYPES.FETCHING_SEARCH_HISTORY_DATA_SUCCESS,
    payload: data,
  };
}

export function fetchSearchData() {
  return (dispatch)=>{
    dispatch(getSearchData());
    let searchData = require( '../data/bible-array.json');
    // console.log("search data " + JSON.stringify(searchData));
    dispatch(getSearchDataSuccess(searchData));
  }
}

export function searchByKeyword(keyword, book, cb) {
  return (dispatch)=> {
    let data = store.getState().search.data;
    // console.log('Search Data: ' + JSON.stringify(data));
    console.log('book: ' + book);
    
    if(Array.isArray(data) && keyword.length!=0){
      let result = data.filter((obj)=>{
        if (book) {
          return obj.book==book && obj.content.indexOf(keyword)!=-1;
        } else {
          return obj.content.indexOf(keyword)!=-1;
        }
      });
      cb(result);

    } else {
      cb([]);
    }
  }
}

export function fetchSearchHistoryData() {
  return async (dispatch)=>{
    try {
      // For debugging
      // AsyncStorage.removeItem(searchHistoryAsyncKey);
      /**
       *  result from AsyncStorage will be:
       *  null - no data has been set yet
       *  {} - data has been set before, but it's empty now
       *  dataString - data
       */
      let cBibleSearchHistory = await AsyncStorage.getItem(searchHistoryAsyncKey);
      console.log('Get cBibleSearchHistory from AsyncStorage:' + cBibleSearchHistory);
      
      let searchHistoryJsonData = JSON.parse(cBibleSearchHistory);
      if(Array.isArray(searchHistoryJsonData)) {
        dispatch(getSearchHistorySuccess(searchHistoryJsonData));
      } else {
        dispatch(getSearchHistorySuccess([]));
      }
    } catch(err){
      // console.log('Error: ' + err);
      dispatch(getSearchHistorySuccess([]));
    }
  }
}

export function addSearchHistory(keyword) {
  return (dispatch)=>{
    try {
      let searchHistory = store.getState().search.searchHistory;
      // Delete old keyword from list and unshift new one
      let oldKeyIndex = searchHistory.indexOf(keyword);
      if(oldKeyIndex!=-1) {
        searchHistory.splice(oldKeyIndex, 1);
      }

      searchHistory.unshift(keyword);

      AsyncStorage.setItem(searchHistoryAsyncKey, JSON.stringify(searchHistory), () => {
        AsyncStorage.getItem(searchHistoryAsyncKey, (err, result) => {
          console.log('addSearchHistory (result):' + result);
          dispatch(getSearchHistorySuccess(JSON.parse(result)));
        });
      });
    } catch(err){
      console.log('addSearchHistory (err):' + err);
    }
  }
}

export function removeSearchHistory(keyword) {
  return (dispatch)=>{
    try {
      let searchHistory = store.getState().search.searchHistory;
      
      let oldKeyIndex = searchHistory.indexOf(keyword);
      if(oldKeyIndex!=-1) {
        searchHistory.splice(oldKeyIndex, 1);
      }

      AsyncStorage.setItem(searchHistoryAsyncKey, JSON.stringify(searchHistory), () => {
        AsyncStorage.getItem(searchHistoryAsyncKey, (err, result) => {
          console.log('removeSearchHistory (result):' + result);
          dispatch(getSearchHistorySuccess(JSON.parse(result)));
        });
      });
    } catch(err){
      console.log('addSearchHistory (err):' + err);
    }
  }
}
