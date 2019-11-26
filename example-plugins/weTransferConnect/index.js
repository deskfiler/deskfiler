import React, { useState, useEffect, useRef, useCallback } from 'react';
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

  const { files } = filePaths.reduce((acc, fp) => {
    const { name, ext } = path.parse(fp);
    const { size } = fs.statSync(fp);
    const content = fs.readFileSync(fp);

    return {
      files: [
        ...acc.files,
        {
          size,
          name: `${acc.names.includes(name) ? `${name}-${acc.names.filter(n => n.startsWith(name)).length}` : name}${ext}`,
          path: fp,
          content,
        }],
      names: [...acc.names, name],
    };
  }, { names: [], files: [] });

  const wtClient = await createWTClient(apiKey);

  const transfer = await wtClient.transfer.create({
    message: 'Transfered from Deskfiler',
    files,
  });

  return transfer;
}

const getNetworkUploadSpeed = async () => {
  const options = {
    hostname: 'wetransfer-eu-prod-outgoing.s3.eu-west-1.amazonaws.com',
    port: 80,
    path: '/v2/transfers',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const { bps } = await testNetworkSpeed.checkUploadSpeed(options);
  return bps;
};

const useUploadingTimer = () => {
  const [elapsed, setElapsed] = useState(0);
  const [value, setValue] = useState(0);
  const [isCountdownRunning, setIsCountdownRunning] = useState(false);
  const [isUploading, setIsUploading] = useState(null);
  const [allSize, setAllSize] = useState(null);
  const countdownInterval = useRef(null);
  const uploadingInterval = useRef(null);

  const startCountdown = (initialValue) => {
    setValue(initialValue);
    setIsCountdownRunning(true);
  };

  const stopCountdown = () => {
    setValue(0);
    setIsCountdownRunning(false);
  };

  const stop = () => {
    stopCountdown();
    clearInterval(uploadingInterval.current);
  };

  const start = ({ initialSpeed, totalSize }) => {
    const eta = Math.ceil(totalSize / initialSpeed);
    startCountdown(eta + 6); // approximate amount of seconds to do non-fetch things
    setAllSize(totalSize);
    setIsUploading(true);
  };

  useEffect(() => {
    const tick = () => {
      setValue(prevValue => {
        if (prevValue > 1) {
          setElapsed(prevElapsed => prevElapsed + 1);
          return prevValue - 1;
        }
        stopCountdown();
        return prevValue;
      });
    };

    if (isCountdownRunning) {
      countdownInterval.current = setInterval(tick, 1000);
    }

    return () => {
      clearInterval(countdownInterval.current);
    };
  }, [isCountdownRunning]);

  useEffect(() => {
    const tick = async () => {
      const speed = await getNetworkUploadSpeed();
      if (!isFinite(speed)) {
        return;
      }
      const eta = Math.ceil(allSize / speed);
      setElapsed(prevElapsed => {
        setValue((eta - prevElapsed) < 0 ? 0 : (eta - prevElapsed));
        return prevElapsed;
      });
    };

    
    if (isUploading && allSize) {
      uploadingInterval.current = setInterval(tick, 2000);
    }
  }, [isUploading, allSize]);

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
      const [estimate, { start, stop }] = useUploadingTimer();
      const [estimateLabel, setEstimateLabel] = useState('');
      const [errorMessage, setErrorMessage] = useState('');

      const getInitialSpeed = () => new Promise((resolve) => {
        let counter = 0;
          const timer = setInterval(async () => {
            if (counter > 5) {
              clearInterval(timer);
              resolve(null);
            }
            setEstimateLabel('Checking init connection speed...');
            const bps = await getNetworkUploadSpeed();
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

            const initialSpeed = await getInitialSpeed();
            if (!isFinite(initialSpeed)) {
              return;
            }

            start({ totalSize, initialSpeed });
            startProgress();

            const { url, files } = await transferFiles({ filePaths, fs, path });

            alert([{ url }]);
            setFilesCount(files.length);
            setProcessing(false);
            stop();
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
            setErrorMessage('Something bad happened. Transfer failed.');
            finishProgress();
          }
        };
        startPlugin();

        return () => {
          setProcessing(false);
          finishProgress();
          stop();
        };
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
