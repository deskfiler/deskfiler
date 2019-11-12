/* eslint-disable react/jsx-filename-extension */

import React, { useState } from 'react';
import ReactDOM from 'react-dom';

import request from 'request-promise-native';
import requestDebug from 'request-debug';
import b64converter from 'base64-img';
import piexif from 'piexifjs';

import PluginSettings from './containers/PluginSettings';

requestDebug(request);

async function getGVisionTags({
  filePath,
  token,
  settings,
  fs,
  path,
}) {
  console.log('getGVisionTags', filePath, token, settings);
  const { base, ext } = path.parse(filePath);

  try {
    const url = 'https://plugins.deskfiler.org/api/index.php';

    const formData = {
      appaction: 'bridge',
      appid: 'gvision',
      appname: 'deskfiler',
      token,
      file: [new Blob([fs.readFileSync(filePath)]), `${base}`],
      ...(settings.labelsLanguage ? { appsortstr: settings.labelsLanguage } : {}),
    };

    console.log('formData', formData);

    const body = new FormData();

    Object.keys(formData).forEach((key) => {
      if (key === 'file') {
        body.append(key, ...formData[key]);
      } else {
        body.append(key, formData[key]);
      }
    });

    const response = await fetch(url, {
      method: 'POST',
      body,
      headers: {
        credentials: 'include',
        Authorization: 'Basic YTpi',
      },
    });

    console.log(response);

    const json = await response.json();

    console.log(json);

    if (json.error) throw new Error(json.error);

    const { data: { labelAnnotations: tags } } = json;
    return {
      tags: tags
        .filter(i => i.score >= settings.certaintyLevel)
        .map(i => i.description.toLowerCase()),
      response: json,
    };
  } catch (err) {
    throw new Error(err);
  }
}

function writeTagsToExif({
  filePath,
  path,
  tags,
  dirPath,
  saveCopy,
}) {
  const base64File = b64converter.base64Sync(filePath);

  const zeroth = {};
  const exif = {};
  const gps = {};

  exif[piexif.ExifIFD.UserComment] = `Tagged by Google Vision, in Deskfiler. \n Tags: ${tags.join(', ')}`;
  zeroth[piexif.ImageIFD.ImageDescription] = `${tags.join(', ')}`;

  const { name, ext } = path.parse(filePath);

  try {
    if (/(jpg|jpeg)/.test(ext)) {
      throw new Error('Exif tags not written for', `${name}.${ext}`, 'image not jpeg!');
    }

    const exifObj = { '0th': zeroth, Exif: exif, GPS: gps };
    const exifStr = piexif.dump(exifObj);

    const inserted = piexif.insert(exifStr, base64File);

    b64converter.imgSync(inserted, filePath, name);

    if (saveCopy) {
      b64converter.imgSync(inserted, dirPath, `${name}-tagged`);
    }
  } catch (error) {
    console.error(error);
  }
}

window.PLUGIN = {
  handleFiles: async ({
    inputs,
    context,
    system: {
      fs,
      path,
    },
    ticket,
  }) => {
    const {
      exit,
      settings,
      openDialog,
      alert,
      token,
      showPluginWindow,
      openOutputFolder,
      openPaymentWindow,
    } = context;
    const { filePaths } = inputs;

    const root = document.querySelector('#root');

    const pluginSettings = await settings.get();

    await showPluginWindow();

    const App = () => {
      const [processing, setProcessing] = useState(false);
      const [filesToProcess, setFilesToProcess] = useState(0);

      return (
        <div>
          {processing && (
            <div
              style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#fff',
              }}
            >
              <span style={{ fontWeight: 900, size: '20px' }}>
                processing... {filesToProcess} images left
              </span>
            </div>
          )}
          <PluginSettings
            ticket={ticket}
            settings={pluginSettings}
            setSettings={settings.set}
            filesCount={filePaths.length}
            openPaymentWindow={openPaymentWindow}
            startProcessing={async (updatedSettings) => {
              try {
                // hidePluginWindow();
                setProcessing(true);
                setFilesToProcess(filePaths.length);
          
                const { copyTaggedToExtraFolder } = updatedSettings;
          
                let saveDir = null;
                const promises = [];
          
                if (copyTaggedToExtraFolder || updatedSettings.saveToJson) {
                  saveDir = await openDialog({ options: { title: 'Select saving directory' }, properties: ['openDirectory'] });
                }
          
                const processFile = async (filePath) => {
                  console.log('process file');
                  // eslint-disable-next-line no-await-in-loop
                  const { tags, response } = await getGVisionTags({
                    filePath,
                    token,
                    settings: updatedSettings,
                    fs,
                    path,
                  });
          
                  if (updatedSettings.saveToJson) {
                    const parsedPath = path.parse(filePath);
                    fs.writeFileSync(path.join(saveDir, `${parsedPath.base}-gvision-data.json`), JSON.stringify(response.data, null, 2));
                  }
          
                  writeTagsToExif({
                    filePath,
                    tags,
                    dirPath: saveDir,
                    saveCopy: copyTaggedToExtraFolder,
                    path,
                  });
          
                  setFilesToProcess(filesToProcess - 1);
                };
          
                for (const filePath of filePaths) { // eslint-disable-line no-restricted-syntax
                  try {
                    promises.push(processFile(filePath));
                  } catch (e) {
                    setProcessing(false);
                    alert([`Error: ${e.message}`]);
                    exit();
                  }
                }
          
                await Promise.all(promises)
                  .then(
                    async () => {
                      setProcessing(false);
                      if (copyTaggedToExtraFolder) {
                        await openOutputFolder(saveDir);
                      }
                      exit();
                    },
                  );
              } catch (err) {
                console.error(err);
                alert([`Error during processing \n ${err}`]);
              }
            }}
            cancel={() => {
              exit();
            }}
          />
        </div>
      );
    }

    ReactDOM.render(<App />, root);
  },
};
