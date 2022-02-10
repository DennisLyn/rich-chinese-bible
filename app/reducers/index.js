import { combineReducers } from 'redux';
import BooksReducer from './BooksReducer';
import BibleReducer from './BibleReducer';
import RouterReducer from './RouterReducer';
import FavoritesReducer from './FavoritesReducer';
import SearchReducer from './SearchReducer';

export default combineReducers({
  books: BooksReducer,
  bible: BibleReducer,
  router: RouterReducer,
  favorites: FavoritesReducer,
  search: SearchReducer
});
