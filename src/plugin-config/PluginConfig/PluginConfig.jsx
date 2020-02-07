import React, { useRef, useState, useEffect } from 'react';
import { remote, ipcRenderer } from 'electron';
import { Formik } from 'formik';
import { Grid, Cell, Button } from 'react-foundation';
import { Flex } from 'styled';
import store from 'store';

import Input from 'components/Input';
import Select from 'components/Select';
import Checkbox from 'components/Checkbox';
import InputGroup from 'components/InputGroup';

import { createOpenDialog } from 'utils';

import * as S from './styled';

const pluginConfigWindow = remote.getCurrentWindow();
const compTypes = (props, values) => ({
  input: (
    <Input
      {...props}
      style={{ marginBottom: '8px', width: '100%' }}
      type="password"
    />
  ),
  select: (
    <Select {...props} />
  ),
  path: (
    <InputGroup
      {...props}
      buttonLabel="Change path"
      onButtonClick={async (callback) => {
        try {
          const {
            canceled,
            filePaths,
          } = await createOpenDialog({
            options: {
              defaultPath: values[props.name],
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
  ),
  checkbox: (
    <Checkbox
      {...props}
    />
  ),
});

const PluginConfig = () => {
  const mainWindowId = useRef(null);
  const [currentPluginKey, setCurrentPluginKey] = useState(null);
  const [plugin, setPlugin] = useState(null);
  const [settings, setSettings] = useState(null);

  const {
    name: pluginName,
    icon,
    author,
    version,
    pluginSettings: sections,
  } = plugin || {};

  useEffect(() => {
    if (currentPluginKey) {
      const pluginData = store.get(`pluginData.${currentPluginKey}`);
      setPlugin(pluginData);

      const pluginSettings = store.get(`settings.${currentPluginKey}`);
      setSettings(pluginSettings);
    }
  }, [currentPluginKey]);

  useEffect(() => {
    ipcRenderer.on('new-config-loaded', (e, { pluginKey, mainId }) => {
      setCurrentPluginKey(pluginKey);
      mainWindowId.current = mainId;
    });
  }, []);

  const getUiFromSections = values => (
    sections ? sections.map(({ children, name: sectionName }) => (
      <section key={sectionName}>
        <S.InfoTitle>{`${sectionName.charAt(0).toUpperCase()}${sectionName.slice(1)}`}:</S.InfoTitle>
        {children.map((childProps) => {
          const {
            name,
            elementType,
            ...restChildProps
          } = childProps;
          return compTypes({ ...restChildProps, name, key: name }, values)[elementType];
        })}
      </section>
    )) : <div>no settings</div>
  );

  const iconUrl = `${process.env.LOCAL_URL}/${currentPluginKey}/${icon}`;
  return (
    plugin && (
    <Flex
      padding="20px 30px"
    >
      <Flex
        row
        width="100%"
        align="center"
        justify="space-between"
        paddingBottom="20px"
      >
        <S.Title>{pluginName}</S.Title>
        <S.PluginLogo src={iconUrl} />
      </Flex>
      <Formik
        enableReinitialize
        initialValues={settings}
        onSubmit={(values) => {
          ipcRenderer.sendTo(mainWindowId.current, 'update-plugin-settings', { pluginKey: currentPluginKey, values });
          pluginConfigWindow.close();
        }}
        render={({
          handleSubmit,
          values,
        }) => (
          <Grid style={{ width: '100%' }}>
            <Cell
              small={8}
            >
              <form
                style={{ width: '100%' }}
                onSubmit={handleSubmit}
              >
                {getUiFromSections(values)}
                <Flex
                  row
                  justify="space-between"
                >
                  <Button
                    type="submit"
                    style={{ flex: '0 0 50%' }}
                  >
                    Save
                  </Button>
                  <Button
                    color="secondary"
                    style={{ flex: '0 0 50%' }}
                    onClick={() => {
                      pluginConfigWindow.close();
                    }}
                  >
                    Cancel
                  </Button>
                </Flex>
              </form>
            </Cell>
            <Cell small={4}>
              <Flex
                padding="0 20px"
              >
                <S.InfoTitle>Info:</S.InfoTitle>
                <span>{`version: ${version}`}</span>
                <span>{`author: ${author}`}</span>
              </Flex>
            </Cell>
          </Grid>
        )}
      />
    </Flex>
    ));
};

export default PluginConfig;
