export enum ActionType {
  SET_ALL_STOCK = 'SET_ALL_STOCK',
  SET_ALL_ITEMS = 'SET_ALL_ITEMS',
  SET_LOCATIONS = 'SET_LOCATIONS',
  SET_LOCATION_STOCK_DATA = 'SET_LOCATION_STOCK_DATA',
  SWITCH_TO_EVENT = 'SWITCH_TO_EVENT',
  SWITCH_TO_LOCATION = 'SWITCH_TO_LOCATION',
  RESET_PERMISSIONS = 'RESET_PERMISSIONS',
  SET_EVENT_NAME = 'SET_EVENT_NAME',
  SET_ITEM_LOCATION_TOTALS = 'SET_ITEM_LOCATION_TOTALS',
}

export const setAllStock = (rows: StockItem[]) => {
  return { type: ActionType.SET_ALL_STOCK, payload: { rows } };
};
export const setAllItems = (rows: Item[]) => {
  return { type: ActionType.SET_ALL_ITEMS, payload: { rows } };
};
export const setLocations = (locations: any) => {
  return { type: ActionType.SET_LOCATIONS, payload: { locations } };
};
export const setLocationStockData = (id: string, data: any) => {
  return { type: ActionType.SET_LOCATION_STOCK_DATA, payload: { id, data } };
};
export const switchToEvent = (eventId: string, apiHost: string) => {
  return { type: ActionType.SWITCH_TO_EVENT, payload: { eventId, apiHost } };
};
export const switchToLocation = (locationId: string, apiHost: string) => {
  return {
    type: ActionType.SWITCH_TO_LOCATION,
    payload: { locationId, apiHost },
  };
};
export const resetPermissions = () => {
  return { type: ActionType.RESET_PERMISSIONS, payload: {} };
};
export const setEventName = (eventName: string) => {
  return { type: ActionType.SET_EVENT_NAME, payload: { eventName } };
};
export const setItemLocationTotals = (
  itemId: string,
  locationId: string,
  data: Total[]
) => {
  return {
    type: ActionType.SET_ITEM_LOCATION_TOTALS,
    payload: { itemId, locationId, data },
  };
};
