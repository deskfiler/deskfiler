import React, { useState } from 'react';
import { Formik } from 'formik';
import { Grid, Cell } from 'react-foundation';
import { useUiState } from 'hooks';
import { Icon } from 'components';

import closeIcon from 'assets/images/close.svg';
import folderIcon from 'assets/images/folder.svg';
import chevronDownIcon from 'assets/images/chevron-down.svg';
import chevronUpIcon from 'assets/images/chevron-up.svg';

import Radio from 'components/Radio';
import Select from 'components/Select';
import InputGroup from 'components/InputGroup';

import { Flex } from 'styled';

import { useSettings, usePlugins } from 'hooks';

import {
  getPluginPath,
} from 'utils';

import inputs from './utils/inputsLib';

import * as S from './styled';

const tabs = {
  general: {
    title: 'General',
    value: 'general',
  },
  plugins: {
    title: 'Plugins',
    value: 'plugins',
  },
  profile: {
    title: 'Profile',
    value: 'profile',
  },
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

const SettingsView = ({
  openModal,
  openPluginConfig,
}) => {
  const [{ sideView }, { setUiState }] = useUiState();
  const [plugins] = usePlugins();
  const [settings, { updateSettings }] = useSettings();
  const [currentTab, setCurrentTab] = useState('general');
  const [order, setOrder] = useState('desc');
  const tabsContent = {
    general: (
      <>
        <fieldset
          className="fieldset"
        >
          <legend>Run on Startup</legend>
          <Radio {...inputs.runOnStartUp} />
          <Radio {...inputs.startWhenOpened} />
        </fieldset>
        <Select {...inputs.language} options={languageOptions} />
        <span>Default storage path</span>
        <InputGroup {...inputs.defaultStoragePath} onButtonClick={openModal} />
      </>
    ),
    plugins: <div>plugins</div>,
    profile: <div>Profile</div>,
    // cascade: <div>Cascade</div>,
    help: <div>Help</div>,
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
                          <td key={`${key}-name`}>{key}</td>
                          <td key={`${key}-path`}>{getPluginPath(key)}</td>
                          <td key={`${key}-config`} style={{ justifyContent: 'center', display: 'flex', alignItems: 'center' }}>
                            <Flex
                              cursor="pointer"
                              width="fit-content"
                              onClick={() => {
                                openPluginConfig(key);
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
                  <form onSubmit={handleSubmit}>
                    <fieldset className="fieldset">
                      <legend>{currentTab.toUpperCase()}</legend>
                      {tabsContent[currentTab]}
                    </fieldset>
                    <Flex
                      row
                    >
                      <S.Button
                        type="submit"
                        onClick={() => {
                          handleSubmit();
                        }}
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
                  </form>
                )}
              />
            </S.Settings>
          )}
        </Cell>
        <Cell auto="all" style={{ height: '100%' }}>
          <Flex
            height="100%"
            align="normal"
            background="#0f294b"
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
        </Cell>
      </Grid>
    </S.SettingsView>
  );
};

export default SettingsView;
