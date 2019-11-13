/* eslint-disable react/button-has-type */
import React, { useEffect, useState, useCallback } from 'react';
import request from 'request-promise-native';
import { ipcRenderer } from 'electron';
import { Flex } from 'styled';
import hotkeys from 'hotkeys-js';
import store from 'store';
import { usePlugins } from 'hooks';

const DevMenu = () => {
  const [open, setOpen] = useState(false);
  const [addingDevPlugin, setAddingDevPlugin] = useState(false);
  const [devPluginUrl, setDevPluginUrl] = useState('');
  const [plugins, setPlugins] = usePlugins();

  useEffect(() => {
    hotkeys('command+shift+d', () => {
      setOpen(true);
    });
  }, []);

  const onAddDevPlugin = useCallback(() => {
    console.log('onAddDevPlugin');

    async function getManifest() {
      const response = await request(`${devPluginUrl}/manifest.json`);
      console.log(response);

      const manifest = JSON.parse(response);

      setPlugins({
        ...plugins,
        [manifest.pluginKey]: {
          ...manifest,
          devPluginUrl,
          inDevelopment: true,
        },
      });

      console.log('got manifest', manifest);
    }


    getManifest();
  }, [devPluginUrl]);

  return (
    <Flex
      position="absolute"
      width="100%"
      height="100%"
      z={4}
      justify="center"
      align="center"
      style={{
        display: open ? 'flex' : 'none',
      }}
    >
      <Flex column background="white" padding="16px">
        {addingDevPlugin && (
          <Flex
            position="absolute"
            width="100%"
            height="100%"
            background="white"
            padding="16px"
          >
            <span>
              Plugin url
            </span>
            <input value={devPluginUrl} onChange={e => setDevPluginUrl(e.target.value)} id="pluginUrl" />
            <button onClick={() => onAddDevPlugin()}>add</button>
            <button onClick={() => setAddingDevPlugin(false)}>cancel</button>
          </Flex>
        )}
        <button onClick={() => setAddingDevPlugin(true)}>
          Add development plugin
        </button>
        <button onClick={() => store.clear()}>
          Clear Storage
        </button>
        <button onClick={() => console.log(store.store)}>
          Log storage
        </button>
        <button onClick={() => { ipcRenderer.send('manifest-delete-all'); }}>
          Delete All plugins
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            // getPluginInfo({ token: auth.token, pluginKey: 'gvision' });
          }}
        >
          Get Plugin Info
        </button>
        <button
          color="secondary"
          onClick={() => {
            setOpen(false);
          }}
        >
          Back
        </button>
      </Flex>
    </Flex>
  );
};

export default DevMenu;
