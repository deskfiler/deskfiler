/* eslint-disable react/jsx-filename-extension */

import React from 'react';
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
  const { name, ext } = path.parse(filePath);

  try {
    const url = 'https://plugins.deskfiler.org/api/index.php';

    const formData = {
      appaction: 'bridge',
      appid: 'gvision',
      appname: 'deskfiler',
      appsortstr: settings.labelsLanguage,
      file: [new Blob([fs.readFileSync(filePath)]), `${name}${ext}`],
    };

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
      headers: {
        credentials: 'include',
        Cookie: `PHPSESSID=${token}`,
        Authorization: 'Basic YTpi',
      },
      body,
    });

    const json = await response.json();

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
  path,
  tags,
  dirPath,
  saveCopy,
}) {
  const base64File = b64converter.base64Sync(path);

  const zeroth = {};
  const exif = {};
  const gps = {};

  exif[piexif.ExifIFD.UserComment] = `Tagged by Google Vision, in Deskfiler. \n Tags: ${tags.join(', ')}`;
  zeroth[piexif.ImageIFD.ImageDescription] = `${tags.join(', ')}`;

  const pathArray = path.split('/');

  const fileNameWithoutExtension = pathArray[pathArray.length - 1].split('.').slice(0, -1).join('.');

  const filePath = pathArray.slice(0, -1).join('/');


  try {
    const exifObj = { '0th': zeroth, Exif: exif, GPS: gps };
    const exifStr = piexif.dump(exifObj);

    const inserted = piexif.insert(exifStr, base64File);

    b64converter.imgSync(inserted, filePath, fileNameWithoutExtension);


    if (saveCopy) {
      const copyFileName = `${fileNameWithoutExtension}-tagged`;

      b64converter.imgSync(inserted, dirPath, copyFileName);
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
      hidePluginWindow,
      showPluginWindow,
      openOutputFolder,
      openPaymentWindow,
      startProgress,
      finishProgress,
      resetProgress,
    } = context;
    const { filePaths } = inputs;

    const root = document.querySelector('#root');

    const pluginSettings = await settings.get();

    await showPluginWindow();

    const App = () => (
      <PluginSettings
        ticket={ticket}
        settings={pluginSettings}
        setSettings={settings.set}
        filesCount={filePaths.length}
        openPaymentWindow={openPaymentWindow}
        startProcessing={async (updatedSettings) => {
          try {
            // hidePluginWindow();

            const { copyTaggedToExtraFolder } = updatedSettings;

            let saveDir = null;
            const promises = [];

            if (copyTaggedToExtraFolder) {
              saveDir = await openDialog({ options: { title: 'Select saving directory' }, properties: ['openDirectory'] });
            }

            const processFile = async (filePath) => {
              // eslint-disable-next-line no-await-in-loop
              const { tags, response } = await getGVisionTags({
                filePath,
                token: context.token,
                settings: updatedSettings,
                fs,
                path,
              });

              if (updatedSettings.saveToJson) {
                const parsedPath = path.parse(filePath);
                fs.writeFileSync(path.join(saveDir, `${parsedPath.base}-gvision-data.json`), JSON.stringify(response.data, null, 2));
              }

              writeTagsToExif({
                path: filePath,
                tags,
                dirPath: saveDir,
                saveCopy: copyTaggedToExtraFolder,
              });
            };

            startProgress();
            for (const filePath of filePaths) { // eslint-disable-line no-restricted-syntax
              try {
                promises.push(processFile(filePath));
              } catch (e) {
                alert(`Error: ${e.message}`);
                resetProgress();
                // exit();
              }
            }

            await Promise.all(promises)
              .then(
                async () => {
                  if (copyTaggedToExtraFolder) {
                    await openOutputFolder(saveDir);
                  }
                  finishProgress();
                  // exit();
                },
              );
          } catch (err) {
            resetProgress();
            console.log('Error during processing', err);
          }
        }}
        cancel={() => {
          // exit();
        }}
      />
    );

    ReactDOM.render(<App />, root);
  },
};
