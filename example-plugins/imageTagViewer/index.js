import React from 'react';
import ReactDOM from 'react-dom';
import piexifjs from 'piexifjs';
import b64converter from 'base64-img';
import sizeOf from 'image-size';

window.PLUGIN = {
  handleFiles: async ({ inputs, context, system }) => {
    const { filePaths } = inputs;
    const { showPluginWindow } = context;
    const { fs } = system;

    showPluginWindow();

    const root = document.querySelector('#root');

    const App = () => (
      <div style={{ display: 'flex', width: '100%', flexFlow: 'column nowrap' }}> {/* eslint-disable-line react/jsx-filename-extension */}
        {filePaths.map((filePath) => {
          const base64File = b64converter.base64Sync(filePath);
          const tags = piexifjs.load(base64File);
          const dimensions = sizeOf(filePath);

          return (
            <div style={{
              display: 'flex',
              width: '100%',
              margin: '0 0 10px 0',
            }}
            >
              <div style={{ flex: '4 1 20%' }}>
                <span>
                  {dimensions.width} x
                  {dimensions.height}
                </span>
                <img
                  alt={tags['0th']['270'] ? tags['0th']['270'].split(', ')[0] : 'image'}
                  src={`file://${filePath}`}
                  style={{
                    width: '100%',
                    borderRadius: 4,
                    boxShadow: '0 5px 10px 0 rgba(0, 0, 0, .2)',
                  }}
                />
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  flex: '1 0 20%',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '0 16px',
                    margin: '4px 0',
                    flex: '1 1 auto',
                    overflowY: 'auto',
                    height: '0px',
                    minWidth: 0,
                  }}
                >
                  {tags['0th']['270'] ? tags['0th']['270'].split(', ').map(t => (
                    <span
                      style={{
                        margin: '5px 10px',
                        padding: '5px 10px',
                        background: '#223',
                        color: 'rgba(255, 255, 255, .8)',
                        borderRadius: '6px',
                        boxShadow: '0 5px 5px 0 rgba(0, 0, 0, .1)',
                        wordBreak: 'break-word',
                      }}
                    >
                      {t}
                    </span>
                  )) : <span>This image has no tags.</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );

    ReactDOM.render(<App />, root);
  },
};
