import { AnyAction } from 'redux';
import { DEFAULT_EVENT_ID } from '../../constants/app';
import { ActionType } from '../actions/global.actions';

interface GlobalState {
  eventId: string;
  allStock: StockItem[];
  locations: any[];
  locationStock: {
    [key: string]: {
      itemById: { [key: string]: StockItem };
    };
  };
}

const initialState: GlobalState = {
  eventId: DEFAULT_EVENT_ID,
  allStock: [],
  locations: [],
  locationStock: {},
};

const globalReducer = (
  state = initialState,
  action: AnyAction
): GlobalState => {
  switch (action.type) {
    case ActionType.SET_EVENT_ID:
      return {
        ...state,
        eventId: action.payload.eventId,
      };
    case ActionType.SET_ALL_STOCK:
      return {
        ...state,
        allStock: action.payload.rows,
      };
    case ActionType.SET_LOCATIONS:
      return {
        ...state,
        locations: action.payload.locations,
      };
    case ActionType.SET_LOCATION_STOCK_DATA:
      return {
        ...state,
        locationStock: {
          ...state.locationStock,
          [action.payload.id]: action.payload.data,
        },
      };
    default:
      return state;
  }
};

export default globalReducer;
