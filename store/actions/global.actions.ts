export enum ActionType {
  SET_EVENT_ID = 'SET_EVENT_ID',
  SET_ALL_LOCATION_DATA = 'SET_ALL_LOCATION_DATA',
  SET_LOCATIONS = 'SET_LOCATIONS',
  SET_LOCATION_STOCK_DATA = 'SET_LOCATION_STOCK_DATA',
}

export const setEventId = (eventId: string | undefined) => {
  return { type: ActionType.SET_EVENT_ID, payload: { eventId } };
};
export const setAllLocationData = (rows: OverviewRow[]) => {
  return { type: ActionType.SET_ALL_LOCATION_DATA, payload: { rows } };
};
export const setLocations = (locations: any) => {
  return { type: ActionType.SET_LOCATIONS, payload: { locations } };
};
export const setLocationStockData = (id: string, data: any) => {
  return { type: ActionType.SET_LOCATION_STOCK_DATA, payload: { id, data } };
};
