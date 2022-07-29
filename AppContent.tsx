import { ApolloProvider } from '@apollo/client';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';
import { useSelector } from 'react-redux';
import client from './apollo';
import Navigation from './components/Navigation';
import PermissionChangeListener from './screens/PermissionChangeListener';
import { RootState } from './store';

const AppContent = () => {
  const apiHost = useSelector((state: RootState) => state.global.apiHost);
  return (
    <>
      <ApolloProvider client={client(apiHost)}>
        <NavigationContainer>
          <Navigation />
          <PermissionChangeListener />
        </NavigationContainer>
      </ApolloProvider>
      <Toast />
    </>
  );
};

const styles = StyleSheet.create({});

export default AppContent;
