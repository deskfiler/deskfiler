import React from 'react';

import { usePlugins } from 'hooks';
import { Flex } from 'styled';

import Plugin from './Plugin/index';
import AddPlugin from './AddPlugin';

const Plugins = () => {
  const [plugins] = usePlugins();

  const pluginsKeys = Object.keys(plugins);

  return (
    <Flex padding="8px 0px 0px 8px" width="100%" row wrap height="100%" paddingRight="48px" align="normal">
      {pluginsKeys.map(key => <Plugin key={key} pluginKey={key} />)}
      <AddPlugin />
    </Flex>
  );
};

export default Plugins;
