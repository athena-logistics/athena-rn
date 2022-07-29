export enum ActionType {
  SET_ALL_STOCK = 'SET_ALL_STOCK',
  SET_ALL_ITEMS = 'SET_ALL_ITEMS',
  SET_LOCATIONS = 'SET_LOCATIONS',
  SET_LOCATION_STOCK_DATA = 'SET_LOCATION_STOCK_DATA',
  SWITCH_TO_EVENT = 'SWITCH_TO_EVENT',
  SWITCH_TO_LOCATION = 'SWITCH_TO_LOCATION',
  RESET_PERMISSIONS = 'RESET_PERMISSIONS',
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
export const switchToEvent = (eventId: string) => {
  return { type: ActionType.SWITCH_TO_EVENT, payload: { eventId } };
};
export const switchToLocation = (locationId: string) => {
  return { type: ActionType.SWITCH_TO_LOCATION, payload: { locationId } };
};
export const resetPermissions = () => {
  return { type: ActionType.RESET_PERMISSIONS, payload: {} };
};
