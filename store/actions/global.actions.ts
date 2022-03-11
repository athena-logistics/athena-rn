import { LogisticLocation } from '../../models/LogisticLocation';

export enum ActionType {
  SET_EVENT_ID = 'SET_EVENT_ID',
  SET_ALL_LOCATION_DATA_BY_STUFF = 'SET_ALL_LOCATION_DATA_BY_STUFF',
  SET_ALL_LOCATION_DATA_BY_LOCATION = 'SET_ALL_LOCATION_DATA_BY_LOCATION',
  SET_LOCATIONS = 'SET_LOCATIONS',
  SET_LOCATION_STOCK_DATA = 'SET_LOCATION_STOCK_DATA',
}

export const setEventId = (eventId: string | undefined) => {
  return { type: ActionType.SET_EVENT_ID, payload: { eventId } };
};
export const setAllLocationDataByStuff = (rows: OverviewRow[]) => {
  return { type: ActionType.SET_ALL_LOCATION_DATA_BY_STUFF, payload: { rows } };
};
export const setAllLocationDataByLocation = (rows: LogisticLocation[]) => {
  return {
    type: ActionType.SET_ALL_LOCATION_DATA_BY_LOCATION,
    payload: { rows },
  };
};
export const setLocations = (locations: any) => {
  return { type: ActionType.SET_LOCATIONS, payload: { locations } };
};
export const setLocationStockData = (id: string, data: any) => {
  return { type: ActionType.SET_LOCATION_STOCK_DATA, payload: { id, data } };
};
