import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PermissionEnum } from '../models/PermissionEnum';
import { RootState } from '../store';
import {
  switchToEvent,
  switchToLocation,
} from '../store/actions/global.actions';

const PERMISSON_KEY = 'permission';
const PERMISSION_ID_KEY = 'permissionId';

const PermissionChangeListener = () => {
  const currentPermission = useSelector(
    (state: RootState) => state.global.currentPermission
  );

  const currentPermissionId = useSelector(
    (state: RootState) => state.global.currentPermissionId
  );

  const navigation = useNavigation();
  const dispatch = useDispatch();

  useEffect(() => {
    const loadPermissions = async () => {
      const permission = await AsyncStorage.getItem(PERMISSON_KEY);
      const permissionId = await AsyncStorage.getItem(PERMISSION_ID_KEY);

      if (permissionId && permission) {
        if (permission == PermissionEnum.EventAdmin.toString()) {
          dispatch(switchToEvent(permissionId));
        }
        if (permission == PermissionEnum.LocationUser.toString()) {
          dispatch(switchToLocation(permissionId));
        }
      }
    };

    loadPermissions();
  }, []);

  useEffect(() => {
    const setPermissions = async () => {
      if (currentPermission === PermissionEnum.EventAdmin) {
        // @ts-ignore
        navigation.navigate('Overview Stack', {
          screen: 'Overview',
          eventId: currentPermissionId,
        });
        await AsyncStorage.setItem(PERMISSON_KEY, currentPermission.toString());
        await AsyncStorage.setItem(
          PERMISSION_ID_KEY,
          currentPermissionId?.toString() || ''
        );
      }
      if (currentPermission === PermissionEnum.LocationUser) {
        // @ts-ignore
        navigation.navigate('Overview Stack', {
          screen: 'Location Overview',
          params: { externalLocationId: currentPermissionId },
        });
        await AsyncStorage.setItem(PERMISSON_KEY, currentPermission.toString());
        await AsyncStorage.setItem(
          PERMISSION_ID_KEY,
          currentPermissionId?.toString() || ''
        );
      }
    };
    setPermissions();
  }, [currentPermission, currentPermissionId]);

  return null;
};
export default PermissionChangeListener;
