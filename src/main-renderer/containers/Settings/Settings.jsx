import React, { useState } from 'react';
import { shell, ipcRenderer } from 'electron';
import { Formik } from 'formik';
import { Grid, Cell } from 'react-foundation';
import { Icon } from 'components';

import closeIcon from 'assets/images/close.svg';

import chevronDownIcon from 'assets/images/chevron-down.svg';

import chevronUpIcon from 'assets/images/chevron-up.svg';

import InputGroup from 'components/InputGroup';

import { Flex, Text } from 'styled';


import {
  useSettings,
  usePlugins,
  useUiState,
  useIpc,
} from 'hooks';

import { getPluginPath, createOpenDialog } from 'utils';
import FastCheckbox from '../../components/Checkbox';

import inputs from './utils/inputsLib';

import * as S from './styled';

import pJson from '../../../package.json';

const store = require('store');

const tabs = {
  general: {
    title: 'General',
    value: 'general',
  },
  plugins: {
    title: 'Plugins',
    value: 'plugins',
  },
  // profile: {
  //   title: 'Profile',
  //   value: 'profile',
  // },
  // cascade: {
  //   title: 'Cascade',
  //   value: 'cascade',
  // },
  help: {
    title: 'Help',
    value: 'help',
  },
};

const languageOptions = [{
  label: 'ENGLISH',
  value: 'english',
},
{
  label: 'GERMAN',
  value: 'german',
}];

const SettingsView = () => {
  const [{ sideView }, { setUiState }] = useUiState();
  const [plugins] = usePlugins();
  const [settings, { updateSettings }] = useSettings();
  const { openSettingsWindow } = useIpc();
  const [currentTab, setCurrentTab] = useState('general');
  const [order, setOrder] = useState('desc');
  const tabsContent = {
    general: (
      <>
        {<div style={{
          width: '100%',
          height: '40%',
        }}
        >

          <FastCheckbox
            name="startup"
            defaultChecked={store.get('autolaunch')}
            //onChange={ipcRenderer.send('clear-local-cache')}
          />
          <span>Run on startup</span>
        </div> }
        {/* <Select {...inputs.language} options={languageOptions} /> */}
        <span>Default storage path</span>
        <InputGroup
          {...inputs.defaultStoragePath}
          onButtonClick={async (callback) => {
            try {
              const {
                canceled,
                filePaths,
              } = await createOpenDialog({
                options: {
                  defaultPath: settings.general.defaultStoragePath,
                },
                properties: ['openDirectory'],
              });
              if (!canceled) {
                callback(filePaths[0]);
              }
            } catch (err) {
              console.error(err);
            }
          }}
        />
      </>
    ),
    plugins: <div>plugins</div>,
    // profile: <div>Profile</div>,
    // cascade: <div>Cascade</div>,
    help: (
      <div>
        <S.Link
          onClick={(e) => {
            e.preventDefault();
            shell.openExternal('http://deskfiler.org/');
          }}
        >
          Homepage
        </S.Link>
        <S.Link
          onClick={(e) => {
            e.preventDefault();
            shell.openExternal('http://deskfiler.org/docs.php');
          }}
        >
          Help
        </S.Link>
      </div>
    ),
  };

  return (
    <S.SettingsView
      className="plugin-view"
      show={sideView === 'settings'}
    >
      <Grid style={{ height: '100%' }}>
        <Cell small={10} style={{ height: '100%' }}>
          {currentTab === 'plugins' ? (
            <Flex
              height="100%"
            >
              <Flex
                width="100%"
                overflow="auto"
                flex="0 1 auto"
              >
                <table>
                  <thead>
                    <tr key="table-header">
                      <th key="table-header-name">Name
                        <S.SortIcon
                          src={order === 'asc' ? chevronUpIcon : chevronDownIcon}
                          onClick={() => setOrder(prevOrder => (prevOrder === 'asc' ? 'desc' : 'asc'))}
                        />
                      </th>
                      <th key="table-header-installation">Installation path</th>
                      <th key="table-header-config">Config</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(plugins)
                      .sort((a, b) => (order === 'desc' ? b.localeCompare(a) : a.localeCompare(b)))
                      .map(key => (
                        <tr key={key}>
                          <td key={`${key}-name`}>{plugins[key].name}</td>
                          <td key={`${key}-path`}>{getPluginPath(key)}</td>
                          <td key={`${key}-config`} style={{ justifyContent: 'center', display: 'flex', alignItems: 'center' }}>
                            <Flex
                              cursor="pointer"
                              width="fit-content"
                              onClick={() => {
                                openSettingsWindow(key);
                              }}
                            >
                              <Icon type="cog" width="18px" />
                            </Flex>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </Flex>
            </Flex>
          ) : (
            <S.Settings>
              <Formik
                enableReinitialize
                initialValues={settings[currentTab]}
                onSubmit={(values) => {
                  updateSettings({
                    key: [currentTab],
                    values,
                  });
                }}
                render={({
                  handleSubmit,
                  resetForm,
                }) => (
                  <form onSubmit={handleSubmit} style={{ 'z-index': '5' }}>
                    <fieldset className="fieldset">
                      <legend>{currentTab.toUpperCase()}</legend>
                      {tabsContent[currentTab]}
                    </fieldset>
                    {currentTab !== 'help' && (
                      <Flex
                        row
                      >
                        <S.Button
                          type="submit"
                        >
                          Save
                        </S.Button>
                        <S.Button
                          color="secondary"
                          onClick={() => {
                            resetForm();
                          }}
                        >
                          Cancel
                        </S.Button>
                      </Flex>
                    )}
                  </form>
                )}
              />
            </S.Settings>
          )}
        </Cell>
        <Flex
          height="100%"
          justify="space-between"
          grow={1}
          background="#0f294b"
        >
          <Flex
            height="100%"
            width="100%"
            align="normal"
          >
            <S.SettingsMenuItem
              onClick={() => setUiState({ sideView: null })}
            >
              <S.CloseIcon src={closeIcon} />
            </S.SettingsMenuItem>
            <S.SettingsMenuTitle>Settings</S.SettingsMenuTitle>
            {Object.keys(tabs).map(key => (
              <S.SettingsMenuTab
                key={key}
                onClick={() => setCurrentTab(tabs[key].value)}
                isSelected={tabs[key].value === currentTab}
              >
                {tabs[key].title}
              </S.SettingsMenuTab>
            ))}
          </Flex>
          <Flex width="100%" align="flex-end" justify="flex-end" padding="8px">
            <Text.Bold color="rgba(255, 255, 255, .4)">
              version {pJson.version}
            </Text.Bold>
          </Flex>
        </Flex>
      </Grid>
    </S.SettingsView>
  );
};

export default SettingsView;
