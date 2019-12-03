import React from 'react';
import ReactDOM from 'react-dom';
import piexifjs from 'piexifjs';
import b64converter from 'base64-img';
import sizeOf from 'image-size';
import png from 'png-metadata';
import { XmlEntities } from 'html-entities';

const entities = new XmlEntities();

const getTags = (filePath) => {
  const file = png.readFileSync(filePath);
  if (!png.isPNG(file)) {
    const base64File = b64converter.base64Sync(filePath);
    const loaded = piexifjs.load(base64File);
    return loaded['0th']['270'] ? loaded['0th']['270'].split(', ') : [];
  }
  const tagChunk = png
    .splitChunk(file)
    .find(c => c.data.startsWith('Tagged by Google Vision, in Deskfiler.'));
  if (tagChunk) {
    const { data: tagString } = tagChunk || {};
    return tagString
      .split('Tags:')[1]
      .split(', ')
      .map(t => t.trim());
  }
  return [];
};

window.PLUGIN = {
  handleFiles: async ({ inputs, context, system }) => {
    const { filePaths } = inputs;
    const { showPluginWindow, log } = context;
    const { path } = system;

    showPluginWindow();
    const fileCount = filePaths.length;
    const { dir } = path.parse(filePaths[0]);
    log({
      action: 'Viewed files',
      meta: {
        type: 'text',
        value: [`${fileCount} file${fileCount > 1 ? 's' : ''} viewed`, ...(fileCount > 10 ? [`Input directory: ${dir}`] : filePaths) ].join('; '),
      },
    });

    const root = document.querySelector('#root');

    const App = () => (
      <div style={{ display: 'flex', width: '100%', minHeight: 0, flexFlow: 'column nowrap' }}> {/* eslint-disable-line react/jsx-filename-extension */}
        {filePaths.map((filePath) => {
          const { name, ext } = path.parse(filePath);
          const dimensions = sizeOf(filePath);
          const tags = getTags(filePath);
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
                  alt={tags.length ? tags[0] : 'image'}
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
                    {tags.length ? tags.map(t => (
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
                        {entities.decode(t)}
                      </span>
                    )) : <span style={{ margin: '5px 10px' }}>This image has no tags.</span>}
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
