/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, type ReactNode } from 'react';
import type { AppInfo } from '../types';

interface GitHubAppsContextValue {
  allApps: AppInfo[];
  loading: boolean;
  error: string | null;
}

const GitHubAppsContext = createContext<GitHubAppsContextValue>({
  allApps: [],
  loading: true,
  error: null,
});

export function useGitHubAppsContext(): GitHubAppsContextValue {
  return useContext(GitHubAppsContext);
}

export function GitHubAppsProvider({ children, allApps, loading, error }: {
  children: ReactNode;
  allApps: AppInfo[];
  loading: boolean;
  error: string | null;
}) {
  return (
    <GitHubAppsContext.Provider value={{ allApps, loading, error }}>
      {children}
    </GitHubAppsContext.Provider>
  );
}
