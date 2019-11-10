import React from 'react';

import {
  LogsIcon,
  PluginsIcon,
  SettingsIcon,
  Cog,
} from './icons';

export const Icon = ({ type, ...props }) => {
  switch (type) {
    case 'logs':
      return <LogsIcon {...props} />;
    case 'plugins':
      return <PluginsIcon {...props} />;
    case 'cog':
      return <Cog {...props} />;
    default:
      return <SettingsIcon {...props} />;
  }
};

export default Icon;
