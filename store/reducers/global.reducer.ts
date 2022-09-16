import { AnyAction } from 'redux';
import { PermissionEnum } from '../../models/PermissionEnum';
import { ActionType } from '../actions/global.actions';

interface GlobalState {
  eventId: string;
  eventName: string;
  allStock: StockItem[];
  allItems: Item[];
  locations: any[];
  locationStock: {
    [key: string]: {
      itemById: { [key: string]: StockItem };
    };
  };
  currentPermission: PermissionEnum;
  currentPermissionId?: string;
  apiHost?: string;
}

const initialState: GlobalState = {
  eventId: '',
  eventName: '',
  allStock: [],
  allItems: [],
  locations: [],
  locationStock: {},
  currentPermission: PermissionEnum.Guest,
  currentPermissionId: undefined,
  apiHost: undefined,
};

const globalReducer = (
  state = initialState,
  action: AnyAction
): GlobalState => {
  switch (action.type) {
    case ActionType.SET_ALL_STOCK:
      return {
        ...state,
        allStock: action.payload.rows,
      };
    case ActionType.SET_ALL_ITEMS:
      return {
        ...state,
        allItems: action.payload.rows,
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
    case ActionType.RESET_PERMISSIONS:
      return {
        ...state,
        currentPermission: PermissionEnum.Guest,
        currentPermissionId: undefined,
        apiHost: '',
        eventId: '',
        eventName: '',
      };
    case ActionType.SWITCH_TO_EVENT:
      return {
        ...state,
        currentPermission: PermissionEnum.EventAdmin,
        currentPermissionId: action.payload.eventId,
        eventId: action.payload.eventId,
        apiHost: action.payload.apiHost,
      };
    case ActionType.SWITCH_TO_LOCATION:
      return {
        ...state,
        currentPermission: PermissionEnum.LocationUser,
        currentPermissionId: action.payload.locationId,
        apiHost: action.payload.apiHost,
      };
    case ActionType.SET_EVENT_NAME:
      return {
        ...state,
        eventName: action.payload.eventName,
      };
    default:
      return state;
  }
};

export default globalReducer;
