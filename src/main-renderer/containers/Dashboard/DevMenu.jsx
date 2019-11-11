/* eslint-disable react/button-has-type */
import React, { useEffect, useState } from 'react';
import { ipcRenderer } from 'electron';
import { Flex } from 'styled';
import hotkeys from 'hotkeys-js';
import store from 'store';

const DevMenu = () => {
  const [open, setOpen] = useState(false);
  const [addingDevPlugin, setAddingDevPlugin] = useState(false);
  const [devPluginUrl, setDevPluginUrl] = useState('');

  useEffect(() => {
    hotkeys('command+shift+d', () => {
      setOpen(true);
    });
  }, []);

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
            <button onClick={() => onAddDevPlugin(devPluginUrl)}>add</button>
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
