import React from 'react';
import ReactDOM from 'react-dom';
import sevenBin from '7zip-bin';
import { add } from 'node-7z';

import PluginSettings from './containers/PluginSettings';

const getFilePaths = async ({
  path,
  filePaths,
  readFilePath,
}) => {
  const { name } = path.parse(filePaths[0]);
  const paths = await readFilePath({
    title: 'Select save directory',
    defaultFileName: filePaths.length > 1 ? 'group.zip' : `${name}.zip`,
    filters: [{
      name: 'Archive',
      extensions: ['zip'],
    }],
  });
  return paths;
};

const pluginUi = [{
  elementType: 'input',
  name: 'password',
  type: 'password',
  label: 'Enter Password:',
  placeholder: '(optional)',
  value: '',
}];

const archive = ({ filePaths, password, path, filePath, selfDir }) => new Promise((resolve, reject) => {
  try {
    const pathTo7zip = sevenBin.path7za;
    const fullPathToBin = path.join(selfDir, '7zip-bin', pathTo7zip);

    const stream = add(filePath, filePaths, {
      $bin: fullPathToBin,
      recursive: true,
      ...(password ? { password } : {}), 
    });
        
    stream.on('end', () => {
      resolve();
    });
  } catch (err) {
    reject();
  }
});

window.PLUGIN = {
  handleFiles: async ({
    inputs,
    system,
    context,
  }) => {
    const { filePaths } = inputs;
    const { fs, path } = system;
    const {
      log,
      exit,
      notify,
      settings,
      readFilePath,
      readUserInput,
      startProgress,
      finishProgress,
      openOutputFolder,
      selfDir,
    } = context;

    try {
      if (filePaths) {
        const pluginSettings = await settings.get();
        const ui = pluginUi.map(el => (pluginSettings[el.name] ? { ...el, value: pluginSettings[el.name] } : el));

        const { password } = await readUserInput({ title: 'Options', ui });
        const { filePath } = await getFilePaths({ path, readFilePath, filePaths });
        startProgress();
        await archive({
          selfDir,
          filePaths,
          password,
          fs,
          path,
          filePath,
        });
        log({
          action: `Compressed files ${password ? 'and added password ' : ''}to zip archive`,
          meta: {
            type: 'text',
            value: `Path: ${filePath}, Password: ${password || 'none'}`,
          },
        });
        finishProgress();
        await openOutputFolder(filePath);
        notify(`Files compressed${password ? ' and password protected' : ''}.`);
      }
    } catch (err) {
      finishProgress();
      if (err) {
        console.error(err);
      }
    } finally {
      exit();
    }
  },
  handleOpen: async ({ system, context }) => {
    const { fs, path } = system;
    const {
      log,
      exit,
      notify,
      settings,
      readFilePath,
      showPluginWindow,
      hidePluginWindow,
      startProgress,
      finishProgress,
      openOutputFolder,
    } = context;
    try {
      const pluginSettings = await settings.get();
      const root = document.getElementById('root');
      const App = () => (
        <PluginSettings /* eslint-disable-line react/jsx-filename-extension */
          settings={pluginSettings}
          pluginUi={pluginUi}
          startProcessing={async ({ filePaths, password }) => {
            hidePluginWindow();
            try {
              const { filePath } = await getFilePaths({ path, readFilePath, filePaths });
              startProgress();
              await archive({
                filePaths,
                password,
                fs,
                path,
                filePath,
              });
              log({
                action: `Compressed files ${password ? 'and added password ' : ''}to zip archive`,
                meta: {
                  type: 'text',
                  value: `Path: ${filePath}, Password: ${password || 'none'}`,
                },
              });
              finishProgress();
              await openOutputFolder(filePath);
              notify(`Files compressed${password ? ' and password protected' : ''}.`);
            } catch (err) {
              finishProgress();
              if (err) {
                console.error(err);
              }
            } finally {
              exit();
            }
          }}
          cancel={() => {
            exit();
          }}
        />
      );
      ReactDOM.render(<App />, root);
      await showPluginWindow();
    } catch (err) {
      finishProgress();
      if (err) {
        console.error(err);
        exit();
      }
    }
  },
};
