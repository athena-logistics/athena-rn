import { applyMiddleware, combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import reduxThunk from 'redux-thunk';
import globalReducer from './reducers/global.reducer';

const rootReducer = combineReducers({
  global: globalReducer,
});

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(reduxThunk))
);

export default store;

export type RootState = ReturnType<typeof rootReducer>;
