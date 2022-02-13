import * as TYPES from "./types";

export function getBooksData() {
  return {
    type: TYPES.FETCHING_BOOKS_DATA,
    payload: null,
  };
}

export function getBooksSuccess(data) {
  console.log(JSON.stringify(data));
  return {
    type: TYPES.FETCHING_BOOKS_DATA_SUCCESS,
    payload: data,
  };
}

export function getBooksFailure() {
  return {
    type: TYPES.FETCHING_BOOKS_DATA_FAILURE,
    payload: [],
  };
}

export function fetchBooksData() {
  return (dispatch)=>{
    dispatch(getBooksData());

    let booksList = require( '../data/books.json');
    dispatch(getBooksSuccess(booksList));
  }
}
