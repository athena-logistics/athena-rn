import { ReactNavigationInstrumentation } from '@sentry/react-native';
import { createContext } from 'react';

export const SentryRoutingInstrumentationContext =
  createContext<ReactNavigationInstrumentation | null>(null);
