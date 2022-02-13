import * as TYPES from "./types";
import {store} from "../AppContainer";
import {AsyncStorage} from 'react-native';
const favoritesAsyncKey = 'cbible_favorites';

export function getFavoritesData() {
  return {
    type: TYPES.FETCHING_FAVORITES_DATA,
    payload: null,
  };
}

export function getFavoritesSuccess(data) {
  return {
    type: TYPES.FETCHING_FAVORITES_DATA_SUCCESS,
    payload: data,
  };
}

export function getFavoritesFailure() {
  return {
    type: TYPES.FETCHING_FAVORITES_DATA_FAILURE,
    payload: null,
  };
}

export function fetchFavoritesData() {
  return async (dispatch)=>{
    dispatch(getFavoritesData());
    try {
      // For debugging
      // AsyncStorage.removeItem(favoritesAsyncKey);
      /**
       *  result from AsyncStorage will be:
       *  null - no data has been set yet
       *  {} - data has been set before, but it's empty now
       *  dataString - data
       */
      let cBibleFavorites = await AsyncStorage.getItem(favoritesAsyncKey);
      let favoritesJsonData = JSON.parse(cBibleFavorites);
      dispatch(getFavoritesSuccess(favoritesJsonData));
    } catch(err){
      dispatch(getFavoritesFailure());
    }
  }
}

export function removeFavorite(selected) {
  return (dispatch)=>{
    dispatch(getFavoritesData());
    try{
      let favorites = store.getState().favorites.data;
      if(favorites) {
        let key = Object.keys(selected)[0];
        let newFavorite = favorites;
        delete newFavorite[key];
        AsyncStorage.removeItem(favoritesAsyncKey, ()=> {
          AsyncStorage.setItem(favoritesAsyncKey, JSON.stringify(newFavorite), () => {
            AsyncStorage.getItem(favoritesAsyncKey, (err, result) => {
              dispatch(getFavoritesSuccess(newFavorite));
            });
          });
        });
      }
    } catch(e){
      dispatch(getFavoritesFailure());
    }
  }
}

export function addFavorite(selected) {
  return (dispatch)=>{
    dispatch(getFavoritesData());
    try {
      let favorites = store.getState().favorites.data;
      if (favorites) {
        AsyncStorage.mergeItem(favoritesAsyncKey, JSON.stringify(selected), () => {
          AsyncStorage.getItem(favoritesAsyncKey, (err, result) => {
            dispatch(getFavoritesSuccess(JSON.parse(result)));
          });
        });
      } else {
        AsyncStorage.setItem(favoritesAsyncKey, JSON.stringify(selected), () => {
          AsyncStorage.getItem(favoritesAsyncKey, (err, result) => {
            dispatch(getFavoritesSuccess(JSON.parse(result)));
          });
        });
      }
    } catch(err){
      dispatch(getFavoritesFailure());
    }
  }
}
