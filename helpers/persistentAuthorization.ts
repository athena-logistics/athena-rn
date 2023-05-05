import AsyncStorage from '@react-native-async-storage/async-storage';

const STATE_VERSION = '1';

async function getRequiredItem(name: string): Promise<string> {
  const item = await AsyncStorage.getItem(name);
  if (!item) throw new Error(`Item ${name} not found`);
  return item;
}

export enum Type {
  Guest = 'guest',
  Logistics = 'logistics',
  Vendor = 'vendor',
}

interface BaseState {
  type: Type;
}
interface GuestState extends BaseState {
  type: Type.Guest;
}
interface LoggedInState extends BaseState {
  apiHost: string;
}
interface LogisticsState extends LoggedInState {
  type: Type.Logistics;
  eventId: string;
}
interface VendorState extends LoggedInState {
  type: Type.Vendor;
  locationId: string;
}

export type State = GuestState | LogisticsState | VendorState;

export const defaultInitialState: State = {
  type: Type.Guest,
};

export async function loadInitialState(): Promise<State> {
  if ((await AsyncStorage.getItem('version')) !== STATE_VERSION)
    return { ...defaultInitialState };

  switch (await AsyncStorage.getItem('type')) {
    case Type.Logistics:
      return {
        type: Type.Logistics,
        apiHost: await getRequiredItem('apiHost'),
        eventId: await getRequiredItem('eventId'),
      };
    case Type.Vendor:
      return {
        type: Type.Vendor,
        apiHost: await getRequiredItem('apiHost'),
        locationId: await getRequiredItem('locationId'),
      };
    case Type.Guest:
    default:
      return { ...defaultInitialState };
  }
}

export async function persistState(state: State): Promise<void> {
  switch (state.type) {
    case Type.Logistics:
      await Promise.all([
        AsyncStorage.setItem('version', STATE_VERSION),
        AsyncStorage.setItem('type', Type.Logistics),
        AsyncStorage.setItem('apiHost', state.apiHost),
        AsyncStorage.setItem('eventId', state.eventId),
        AsyncStorage.removeItem('locationId'),
      ]);
      return;
    case Type.Vendor:
      await Promise.all([
        AsyncStorage.setItem('version', STATE_VERSION),
        AsyncStorage.setItem('type', Type.Vendor),
        AsyncStorage.setItem('apiHost', state.apiHost),
        AsyncStorage.setItem('locationId', state.locationId),
        AsyncStorage.removeItem('eventId'),
      ]);
      return;
    case Type.Guest:
      await Promise.all([
        AsyncStorage.setItem('version', STATE_VERSION),
        AsyncStorage.setItem('type', Type.Guest),
        AsyncStorage.removeItem('apiHost'),
        AsyncStorage.removeItem('locationId'),
        AsyncStorage.removeItem('eventId'),
      ]);
      return;
  }
}
