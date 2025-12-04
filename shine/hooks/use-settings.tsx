// React Imports
import { useContext } from 'react';

// Context Imports
import { SettingsContext } from '@/contexts/settings-context';

export const useSettings = () => {
  // Hooks
  const context = useContext(SettingsContext);

  if (!context) {
    throw new Error('useSettingsContext must be used within a SettingsProvider');
  }

  return context;
};
