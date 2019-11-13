import React from 'react';
import ReactDOM from 'react-dom';
import piexifjs from 'piexifjs';
import b64converter from 'base64-img';
import sizeOf from 'image-size';

window.PLUGIN = {
  handleFiles: async ({ inputs, context, system }) => {
    const { filePaths } = inputs;
    const { showPluginWindow } = context;
    const { path } = system;

    showPluginWindow();

    const root = document.querySelector('#root');

    const App = () => (
      <div style={{ display: 'flex', width: '100%', minHeight: 0, flexFlow: 'column nowrap' }}> {/* eslint-disable-line react/jsx-filename-extension */}
        {filePaths.map((filePath) => {
          const base64File = b64converter.base64Sync(filePath);
          const tags = piexifjs.load(base64File);
          const dimensions = sizeOf(filePath);
          const { name, ext } = path.parse(filePath);
          return (
            <div style={{
              display: 'flex',
              width: '100%',
              margin: '0 0 10px 0',
              minHeight: 0,
            }}
            >
              <div style={{ flex: '0 0 200px' }}>
                <span style={{ margin: '5px' }}>
                  {`${dimensions.width} x ${dimensions.height}`}
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
                  minHeight: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  flex: '1 0 40%',
                  padding: '5px 8px',
                }}
              >
                <span style={{ margin: '5px 10px', flex: '0 0 auto' }}>{name}{ext}</span>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    overflowY: 'scroll',
                    flex: '1 1 20px',
                    height: 0,
                    width: '100%',
                  }}
                >
                  <div style={{ display: 'flex', flexWrap: 'wrap' }}>
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
            </div>
          );
        })}
      </div>
    );

    ReactDOM.render(<App />, root);
  },
};
