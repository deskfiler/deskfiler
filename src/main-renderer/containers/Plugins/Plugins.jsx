import React from 'react';
import { usePlugins } from 'hooks';
import { Flex } from 'styled';

import Plugin from './Plugin/index';
import AddPlugin from './AddPlugin';

const Plugins = ({ showBar }) => {
  const [plugins] = usePlugins();

  const pluginsKeys = Object.keys(plugins);


  return (
    <Flex
      padding={!showBar && '8px 0px 0px 8px'}
      width={showBar ? '70px' : '100%'}
      row={!showBar && 'row'}
      flexWrap={!showBar && true}
      top={showBar && '50px'}
      height={showBar ? '80%' : '100%'}
      paddingRight={!showBar && '48px'}
      overflow="auto"
      align="center"
      radius={showBar ? '18px' : '0px'}
      background={showBar ? '#fff' : 'transparent'}
      border={showBar ? '1px solid #c5c5c5' : 'none'}
    >
      {pluginsKeys.map(key => <Plugin showBar={showBar} key={key} pluginKey={key} />)}
      <AddPlugin showBar={showBar} />
    </Flex>
  );
};

export default Plugins;
