import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';

import PluginSettings from './containers/PluginSettings';
import ImageProcessor from './containers/Processor';

window.PLUGIN = {
  handleFiles: async ({
    inputs,
    context,
    system,
    ticket,
  }) => {
    const {
      exit,
      settings: contextSettings,
      openDialog,
      token,
      showPluginWindow,
      focus,
      openOutputFolder,
      openPaymentWindow,
    } = context;

    const { filePaths } = inputs;

    const root = document.querySelector('#root');

    const pluginSettings = await contextSettings.get();

    await showPluginWindow();

    const App = ({ initialSettings }) => {
      const [processing, setProcessing] = useState(false);
      const [saveDir, setSaveDir] = useState(null);
      const [settings, setSettings] = useState(initialSettings);
      const [filesToProcess, setFilesToProcess] = useState(filePaths.length);

      const onSubmit = async (newSettings) => {
        setSettings(newSettings);

        const { copyTaggedToExtraFolder, saveToJson } = newSettings;

        if (copyTaggedToExtraFolder || saveToJson) {
          const dialogResponse = await openDialog({ options: { title: 'Select saving directory' }, properties: ['openDirectory'] });
          setSaveDir(dialogResponse);
          focus();
        }

        setProcessing(true);
      };

      useEffect(() => {
        async function syncSettings() {
          await contextSettings.set(settings);
        }

        syncSettings();
      }, [settings]);

      /* const decrement = useCallback(() => {
        console.log('decrement');

        const newFilesToProcess = filesToProcess - 1;

        console.log('newFilesToProcess', newFilesToProcess, filesToProcess , ' - 1')

        setFilesToProcess(newFilesToProcess);
      }, [filesToProcess]); */

      /* console.log('render', filesToProcess); */

      if (processing) {
        return (
          <div
            style={{
              display: 'flex',
              flexFlow: 'row wrap',
              justifyContent: 'center',
              alignItems: 'center',
              overflow: 'auto',
            }}
          >
            {filesToProcess > 0
              ? (
                <h2>
                  Processing. <br />
                  {filesToProcess} files to process; <br />
                </h2>
              ) : (
                <h2>
                  Done! <br />
                  <button
                    type="button"
                    onClick={() => {
                      exit();
                      if (saveDir) {
                        openOutputFolder(saveDir);
                      }
                    }}
                  >
                    Close
                  </button>
                </h2>
              )
            }
            {filePaths.map(filePath => (
              <ImageProcessor
                key={filePath}
                filePath={filePath}
                settings={settings}
                system={system}
                token={token}
                saveDir={saveDir}
                onSuccess={() => {}}
              />
            ))}
          </div>
        );
      }

      return (
        <PluginSettings
          ticket={ticket}
          filesCount={filesToProcess}
          openPaymentWindow={openPaymentWindow}
          settings={pluginSettings}
          onSubmit={onSubmit}
          cancel={exit}
        />
      );
    };

    ReactDOM.render(<App initialSettings={pluginSettings} />, root);
  },
};
