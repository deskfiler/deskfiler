import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

import { Button } from 'react-foundation';
import { DateTime } from 'luxon';

import createWTClient from '@wetransfer/js-sdk';

import NetworkSpeed from 'network-speed';

import 'foundation-sites/dist/css/foundation.min.css';

import Spinner from './components/Spinner';

const testNetworkSpeed = new NetworkSpeed();

async function transferFiles({ filePaths, fs, path }) {
  const apiKey = 'WDrVAC468y4xZNGcspeir8ySxfzV7YqQjSrBxNKh';

  const files = filePaths.map((fp) => {
    const { name, ext } = path.parse(fp);
    const { size } = fs.statSync(fp);
    const content = fs.readFileSync(fp);
    return {
      size,
      name: `${name}${ext}`,
      path: fp,
      content,
    };
  });

  const wtClient = await createWTClient(apiKey);

  const transfer = await wtClient.transfer.create({
    message: 'Transferred from Deskfiler',
    files,
  });

  return transfer;
}

const useTimer = () => {
  const [value, setValue] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const interval = useRef(null);

  const start = initialValue => {
    setValue(initialValue);
    setIsRunning(true);
  };

  const stop = () => {
    setValue(0);
    setIsRunning(false);
  };

  useEffect(() => {
    const tick = () => {
      setValue(prevValue => {
        if (prevValue > 1) {
          return prevValue - 1;
        }
        stop();
        return prevValue;
      });
    };

    if (isRunning) {
      interval.current = setInterval(tick, 1000);
    }

    return () => {
      clearInterval(interval.current);
    };
  }, [isRunning]);

  return [value, { start, stop }];
};

window.PLUGIN = {
  handleFiles: async ({
    inputs,
    context,
    system,
  }) => {
    const { fs, path } = system;
    const {
      log,
      exit,
      showPluginWindow,
      startProgress,
      finishProgress,
      alert,
    } = context;

    const { filePaths } = inputs;

    const html = document.querySelector('html');
    const body = document.querySelector('body');
    const root = document.querySelector('#root');

    html.style.height = '100%';
    body.style.height = '100%';
    body.style.margin = 0;
    root.style.height = '100%';

    const App = () => {
      const [processing, setProcessing] = useState(true);
      const [filesCount, setFilesCount] = useState(0);
      const [estimate, { start }] = useTimer();
      const [estimateLabel, setEstimateLabel] = useState('');
      const [errorMessage, setErrorMessage] = useState('');

      const getNetworkUploadSpeed = () => new Promise((resolve) => {
        const options = {
          hostname: 'wetransfer-eu-prod-outgoing.s3.eu-west-1.amazonaws.com',
          port: 80,
          path: '/v2/transfers',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        };

        let counter = 0;
        const timer = setInterval(async () => {
          if (counter > 5) {
            clearInterval(timer);
            resolve(null);
          }
          setEstimateLabel('Checking connection speed...');
          const { bps } = await testNetworkSpeed.checkUploadSpeed(options);
          if (!isFinite(bps)) {
            counter += 1;
            setEstimateLabel('Connection speed is too slow. Retrying...');
          } else {
            clearInterval(timer);
            resolve(bps);
          }
        }, 5000);
      });

      useEffect(() => {
        const getTimeString = (seconds) => {
          const dateTime = DateTime.fromMillis(seconds * 1000);
          if (seconds >= 3600) {
            return dateTime.toFormat("h 'hours' m 'minutes' s 'seconds'");
          }
          if (seconds < 60) {
            return dateTime.toFormat("s 'seconds'");
          }
          return dateTime.toFormat("m 'minutes' s 'seconds'");
        };
        if (estimate) {
          setEstimateLabel(`Transfering files... ${getTimeString(estimate)}`);
        }

        return () => {
          setEstimateLabel('Recieving link to uploaded files...');
        };
      }, [estimate]);

      useEffect(() => {
        const startPlugin = async () => {
          try {
            await showPluginWindow();
            const totalSize = filePaths.reduce((acc, fp) => acc + fs.statSync(fp).size, 0);

            const overflow = totalSize > (2 * (1024 ** 3));

            if (overflow) {
              setErrorMessage('This plugin can upload no more than 2 GB of content.');
              return;
            }

            const speed = await getNetworkUploadSpeed();

            if (!speed) {
              setErrorMessage('The connection speed to WeTransfer is too small. Please try again later.');
              return;
            }

            const eta = Math.ceil(totalSize / speed);
            start(eta + 6);
            startProgress();

            const { url, files } = await transferFiles({ filePaths, fs, path });

            alert([{ url }]);
            setFilesCount(files.length);
            setProcessing(false);
            finishProgress();
            log({
              action: `Transfered file${filePaths.length > 1 ? 's' : ''} to We Transfer storage`,
              meta: {
                type: 'text',
                value: url,
              },
            });
          } catch (err) {
            console.error(err);
            finishProgress();
            exit();
          }
        };
        startPlugin();
      }, []);

      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {errorMessage ? (
            <span
              style={{ fontSize: '25px', fontFamily: 'Roboto, sans-serif', marginTop: '30px' }}
            >
              {errorMessage}
            </span>
          ) : (
            <>
              {processing && <Spinner size="100px" style={{ alignItems: 'center' }} />}
              <span
                style={{ fontSize: '25px', fontFamily: 'Roboto, sans-serif', marginTop: '30px' }}
              >
                {processing ? (estimateLabel || 'Loading plugin...') : `Done. Transfered ${filesCount} file${filesCount > 1 ? 's' : ''}.`}
              </span>
            </>
          )}
          {(!processing || errorMessage) && <Button style={{ margin: '8px 0 0' }} onClick={() => { exit(); }}>Close</Button>}
        </div>
      );
    };

    ReactDOM.render(<App />, root);
  },
};
