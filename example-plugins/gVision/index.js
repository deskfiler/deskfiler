import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

import 'foundation-sites/dist/css/foundation.min.css';

import { Button } from 'react-foundation';

import PluginSettings from './containers/PluginSettings';
import ImageProcessor from './containers/Processor';
import DetailsModal from './containers/DetailsModal';

import closeIcon from './assets/images/closewhite.svg';

import { round } from './utils';

import { Flex, Title, HeaderLabel } from './styled';

const getHeaderLabel = ({ processedFiles, errorFiles, totalFiles }) => {
  const isDone = !((processedFiles + errorFiles) < totalFiles);
  return `${isDone ? 'Done' : 'Processing'}: ${processedFiles} processed ${errorFiles ? `/ ${errorFiles} failed` : ''} ${!isDone ? ` / ${totalFiles - (processedFiles + errorFiles)} yet to process` : ''}`; 
};

window.PLUGIN = {
  handleFiles: async ({
    inputs,
    context,
    system,
    ticket,
  }) => {
    const {
      log,
      exit,
      settings: contextSettings,
      openDialog,
      token,
      showPluginWindow,
      focus,
      startProgress,
      finishProgress,
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
      const [chargedFunds, setChargedFunds] = useState(0);
      const [processedFiles, setProcessedFiles] = useState(0);
      const [errorFiles, setErrorFiles] = useState(0);
      const [outputPaths, setOutputPaths] = useState(filePaths);
      const [modalInfo, setModalInfo] = useState({});
      const [isModalOpen, setModalOpen] = useState(false);

      const onSubmit = async ({ newSettings, fundsToSpend }) => {
        setSettings(newSettings);
        setChargedFunds(fundsToSpend);

        const { copyTaggedToExtraFolder, saveToJson } = newSettings;

        if (copyTaggedToExtraFolder || saveToJson) {
          const dialogResponse = await openDialog({ options: { title: 'Select saving directory' }, properties: ['openDirectory'] });
          const taggedPaths = filePaths.map(fp => {
            const { name, ext } = system.path.parse(fp);
            return `${dialogResponse}/${name}-tagged-copy${ext}`
          });
          setOutputPaths(taggedPaths);
          setSaveDir(dialogResponse);
          focus();
        }

        setProcessing(true);
        startProgress();
      };

      useEffect(() => {
        async function syncSettings() {
          await contextSettings.set(settings);
        }

        syncSettings();
      }, [settings]);

      const incrementProcessedFiles = () => {
        setProcessedFiles(processedFiles + 1);
      };

      const incrementErrorFiles = () => {
        setErrorFiles(errorFiles + 1);
      };

      useEffect(() => {
        if ((processedFiles + errorFiles) === filePaths.length) {
          const { userticket, plugindetails } = ticket || {};
          const { dir } = system.path.parse(outputPaths[0]);
          finishProgress();

          log({
            action: 'Processed files and added tags for them',
            meta: {
              type: 'text',
              value: [
                `Ticket start: ${round(userticket.OZVALUE)} ${userticket.OZCURR} - Ticket end: ${round((userticket.OZVALUE - (plugindetails.OZPRICE * (processedFiles + errorFiles))))} ${userticket.OZCURR}`,
                `${outputPaths.length} file${outputPaths.length > 1 ? 's' : ''} tagged`,
                ...(outputPaths.length > 10 ? [`Output directory: ${dir}`] : outputPaths),
              ].join('; '),
            },
          });
        }
      }, [processedFiles, errorFiles, filePaths.length, outputPaths]);

      if (processing) {
        const { userticket } = ticket || {};
        return (
          <Flex
            style={{
              width: '100%',
              height: '100%',
              padding: '20px 30px',
              position: 'absolute',
            }}
          >
            <Flex flex="0 0 auto">
              <Title>gVision</Title>
              <HeaderLabel>
                {getHeaderLabel({ processedFiles, errorFiles, totalFiles: filePaths.length })}
              </HeaderLabel>
            </Flex>
            <Flex
              row
              flexWrap
              flex="1 1 300px"
              style={{ overflow: 'auto', border: '1px solid #eee', marginBottom: 20 }}
            >
              {filePaths.map(filePath => (
                <ImageProcessor
                  key={filePath}
                  filePath={filePath}
                  settings={settings}
                  system={system}
                  token={token}
                  saveDir={saveDir}
                  onSuccess={incrementProcessedFiles}
                  onError={incrementErrorFiles}
                  onInfo={(modalInfo) => {
                    setModalInfo(modalInfo);
                    setModalOpen(true);
                  }}
                />
              ))}
            </Flex>
            {(processedFiles + errorFiles) === filePaths.length && (
              <Flex row flex="0 0 auto" align="flex-end" justify="space-between" style={{ fontSize: '.875rem;' }}>
                <Flex row justify="space-between" flex="0 0 50%">
                  <span>Balance after processing:</span>
                  <span>{`$ ${round(userticket.OZVALUE - chargedFunds)}`}</span>
                </Flex>
                <Flex row align="center" justify="flex-end" flex="0 0 50%">
                  <Button
                    type="button"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      flex: '0 0 auto',
                      margin: 0,
                    }}
                    onClick={() => {
                      exit();
                      if (saveDir) {
                        openOutputFolder(saveDir);
                      }
                    }}
                  >
                    <img src={closeIcon} style={{ height: '15px', marginRight: '5px' }} />
                    Done, close panel
                  </Button>
                </Flex>
              </Flex>
            )}
            <DetailsModal
              {...modalInfo}
              system={system}
              isOpen={isModalOpen}
              close={() => setModalOpen(false)}
            />
          </Flex>
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
