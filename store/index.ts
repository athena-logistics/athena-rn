import { applyMiddleware, combineReducers, createStore } from 'redux';
import reduxThunk from 'redux-thunk';

const rootReducer = combineReducers({});

const store = createStore(rootReducer, applyMiddleware(reduxThunk));

export default store;

export type RootState = ReturnType<typeof rootReducer>;
