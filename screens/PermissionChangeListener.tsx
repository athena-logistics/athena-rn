import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PermissionEnum } from '../models/PermissionEnum';
import { RootState } from '../store';
import {
  switchToEvent,
  switchToLocation,
} from '../store/actions/global.actions';
import { RootParamsList } from '../components/Navigation';

const PERMISSON_KEY = 'permission';
const PERMISSION_ID_KEY = 'permissionId';
const API_HOST_KEY = 'apiHost';

const PermissionChangeListener = () => {
  const currentPermission = useSelector(
    (state: RootState) => state.global.currentPermission
  );

  const currentPermissionId = useSelector(
    (state: RootState) => state.global.currentPermissionId
  );

  const currentApiHost = useSelector(
    (state: RootState) => state.global.apiHost
  );

  const navigation = useNavigation<NavigationProp<RootParamsList>>();
  const dispatch = useDispatch();

  useEffect(() => {
    const loadPermissions = async () => {
      const permission = await AsyncStorage.getItem(PERMISSON_KEY);
      const permissionId = await AsyncStorage.getItem(PERMISSION_ID_KEY);
      const apiHost = await AsyncStorage.getItem(API_HOST_KEY);

      if (permissionId && permission && apiHost) {
        if (permission == PermissionEnum.EventAdmin.toString()) {
          dispatch(switchToEvent(permissionId, apiHost));
        }
        if (permission == PermissionEnum.LocationUser.toString()) {
          dispatch(switchToLocation(permissionId, apiHost));
        }
      }
    };

    loadPermissions();
  }, []);

  useEffect(() => {
    const setPermissions = async () => {
      if (currentPermission === PermissionEnum.EventAdmin) {
        navigation.navigate('Overview Stack', {
          screen: 'Overview',
          eventId: currentPermissionId,
        });
        await AsyncStorage.setItem(PERMISSON_KEY, currentPermission.toString());
        await AsyncStorage.setItem(
          PERMISSION_ID_KEY,
          currentPermissionId?.toString() || ''
        );
        await AsyncStorage.setItem(
          API_HOST_KEY,
          currentApiHost?.toString() || ''
        );
      }
      if (currentPermission === PermissionEnum.LocationUser) {
        navigation.navigate('Overview Stack', {
          screen: 'Location Details',
          params: { externalLocationId: currentPermissionId },
        });
        await AsyncStorage.setItem(PERMISSON_KEY, currentPermission.toString());
        await AsyncStorage.setItem(
          PERMISSION_ID_KEY,
          currentPermissionId?.toString() || ''
        );
        await AsyncStorage.setItem(
          API_HOST_KEY,
          currentApiHost?.toString() || ''
        );
      }
    };
    setPermissions();
  }, [currentPermission, currentPermissionId, currentApiHost]);

  return null;
};
export default PermissionChangeListener;
