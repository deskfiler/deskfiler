import React, { useState, useEffect, useRef } from 'react';
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
      const [processedFiles, setProcessedFiles] = useState(0);

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

      const increment = () => {
        setProcessedFiles(processedFiles + 1)
      };

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
            {processedFiles < filePaths.length
              ? (
                <h2>
                  Processing. <br />
                  {processedFiles} processed; <br />
                  {filePaths.length - processedFiles} yet to process;
                </h2>
              ) : (
                <h2>
                  Done! <br />
                  <button
                    style={{
                      background: 'blue',
                      color: 'white',
                      cursor: 'pointer',
                    }}
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
            {filePaths.map((filePath, index) => (
              <ImageProcessor
                index={index}
                key={filePath}
                filePath={filePath}
                settings={settings}
                system={system}
                token={token}
                saveDir={saveDir}
                onSuccess={increment}
              />
            ))}
          </div>
        );
      }

      return (
        <PluginSettings
          ticket={ticket}
          filesCount={filePaths.length}
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
