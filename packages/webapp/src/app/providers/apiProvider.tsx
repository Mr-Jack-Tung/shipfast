import { ApiClientEvents, apiEmitter } from '@shipfast/webapp-api-client';
import { CommonQuery } from '@shipfast/webapp-api-client/providers';
import { useLocales } from '@shipfast/webapp-core/hooks';
import { getLocalePath } from '@shipfast/webapp-core/utils';
import { FC, PropsWithChildren, useCallback, useEffect } from 'react';
import { generatePath, useNavigate } from 'react-router';

import { RoutesConfig } from '../config/routes';
import { ApolloProvider } from './apollo';

export const ApiProvider: FC<PropsWithChildren> = ({ children }) => {
  const {
    locales: { language },
  } = useLocales();
  const navigate = useNavigate();

  const navigateToLogout = useCallback(() => {
    navigate(generatePath(getLocalePath(RoutesConfig.logout), { lang: language }));
  }, [navigate, language]);

  useEffect(() => {
    apiEmitter.addEventListener(ApiClientEvents.FORCE_LOGOUT_REQUESTED, navigateToLogout);
    return () => {
      apiEmitter.removeEventListener(ApiClientEvents.FORCE_LOGOUT_REQUESTED, navigateToLogout);
    };
  }, [navigateToLogout]);

  useEffect(() => {
    localStorage.setItem('LOCALES_LANGUAGE', language || '');
  }, [language]);

  return (
    <ApolloProvider>
      <CommonQuery>{children}</CommonQuery>
    </ApolloProvider>
  );
};
