import { AnyAction } from 'redux';
import { ActionType } from '../actions/global.actions';

interface GlobalState {
  eventId: string;
  allLocationData: OverviewRow[];
  locations: any[];
  locationStock: any;
}

const initialState: GlobalState = {
  eventId: '',
  allLocationData: [],
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
    case ActionType.SET_ALL_LOCATION_DATA:
      return {
        ...state,
        allLocationData: action.payload.rows,
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
