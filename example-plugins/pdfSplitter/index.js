import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

import { Button } from 'react-foundation';

import 'foundation-sites/dist/css/foundation.min.css';

import Spinner from './components/Spinner';

window.PLUGIN = {
  handleFiles: async ({
    inputs,
    context,
    system: { path },
  }) => {
    const html = document.querySelector('html');
    const body = document.querySelector('body');
    const root = document.querySelector('#root');

    html.style.height = '100%';
    body.style.height = '100%';
    body.style.margin = 0;
    root.style.height = '100%';

    const {
      log,
      exit,
      notify,
      openDialog,
      openOutputFolder,
      showPluginWindow,
      startProgress,
      finishProgress,
      pdf,
    } = context;

    const App = () => {
      const [processing, setProcessing] = useState(true);
      const [processingLabel, setProcessingLabel] = useState('Loading plugin...')

      const splitPDF = ({ filePaths, dirPath, pdf, path }) => {
        const pageFilePaths = [];
        filePaths.forEach((fp, index) => {
          const pdfReader = pdf.createReader(fp);
          const pagesCount = pdfReader.getPagesCount();
          const { name } = path.parse(fp);
          for (let i = 0; i < pagesCount; i += 1) {
            setProcessingLabel(`Splitting page ${i} of file ${index + 1} of ${filePaths.length} file${filePaths > 1 ? 's' : ''}...`);
            const pageFilePath = path.join(dirPath, `${name}-page-${i + 1}.pdf`);
            const pdfWriter = pdf.createWriter(pageFilePath);
            const copyContext = pdfWriter.createPDFCopyingContext(pdfReader);
            copyContext.appendPDFPageFromPDF(i);
            pdfWriter.end();
            pageFilePaths.push(pageFilePath);
          }
        });
        return pageFilePaths;
      };

      useEffect(() => {
        const startPlugin = async () => {
          try {
            startProgress();
            const { filePaths } = inputs;
            const dirPath = await openDialog({
              options: {
                title: 'Select save directory for splitted PDFs',
              },
              properties: ['openDirectory'],
            });
            await showPluginWindow();

            const pageFilePaths = splitPDF({
              filePaths,
              dirPath,
              pdf,
              path,
            });
            setProcessing(false);
            finishProgress();
            notify(`PDF file${filePaths > 1 ? 's' : ''} splitted.`);
            log({
              action: `Splitted PDF file${filePaths > 1 ? 's' : ''} to pages`,
              meta: {
                type: 'text',
                value: pageFilePaths.join(';'),
              },
            });
            await openOutputFolder(dirPath);
          } catch (err) {
            console.error(err);
            finishProgress();
            exit();
          }
        };
        startPlugin();
      }, []);

      const { filePaths } = inputs;

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
          <span
            style={{ fontSize: '25px', fontFamily: 'Roboto, sans-serif', marginTop: '30px' }}
          >
            {processing ? processingLabel : `Done. Splitted ${filePaths.length} file${filePaths.length > 1 ? 's' : ''}.`}
          </span>
          {(!processing) && <Button style={{ margin: '8px 0 0' }} onClick={() => { exit(); }}>Close</Button>}
        </div>
      );
    };

    ReactDOM.render(<App />, root);
  },
};
