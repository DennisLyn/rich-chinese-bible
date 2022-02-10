import * as TYPES from "./types";
import {store} from "../AppContainer";

export function getBibleData() {
    return {
      type: TYPES.FETCHING_BIBLE_DATA,
      payload: null,
    };
}

export function getBibleSuccess(data) {
  return {
    type: TYPES.FETCHING_BIBLE_DATA_SUCCESS,
    payload: data,
  };
}

export function getBibleFailure() {
  return {
    type: TYPES.FETCHING_BIBLE_DATA_FAILURE,
    payload: [],
  };
}

export function fetchBibleData() {
  return (dispatch)=>{
    dispatch(getBibleData());
    let bible = require( '../data/bible.json');
    // console.log("Books " + JSON.stringify(bible));
    dispatch(getBibleSuccess(bible));
  }
}
