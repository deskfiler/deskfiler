import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';

import { Button } from 'react-foundation';

import createWTClient from '@wetransfer/js-sdk';

import 'foundation-sites/dist/css/foundation.min.css';

import Spinner from './components/Spinner';

async function transferFiles({ filePaths, fs, path }) {
  const apiKey = 'WDrVAC468y4xZNGcspeir8ySxfzV7YqQjSrBxNKh';

  const files = filePaths.map((fp) => {
    const { name, ext } = path.parse(fp);
    const { size } = fs.statSync(fp);
    const content = fs.readFileSync(fp);
    return { size, name: `${name}${ext}`, path: fp, content };
  });

  const wtClient = await createWTClient(apiKey);

  const transfer = await wtClient.transfer.create({
    message: 'Transfered from Deskfiler',
    files,
  });

  return transfer;
}

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

      useEffect(() => {
        const startPlugin = async () => {
          try {
            await showPluginWindow();  
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
            {processing && <Spinner size="100px" style={{ alignItems: 'center' }} />}
            <span style={{ fontSize: '25px', fontFamily: 'Roboto, sans-serif', marginTop: '30px' }}>{processing ? 'Transfering files...' : `Done. Transfered ${filesCount} file${filesCount > 1 ? 's' : ''}.`}</span>
            {!processing && <Button style={{ margin: '8px 0 0' }} onClick={() => { exit(); }}>Close</Button>}
          </div>
      );
    };

    ReactDOM.render(<App />, root);
  },
};
