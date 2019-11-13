/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import b64converter from 'base64-img';
import piexif from 'piexifjs';

const ImageProcessor = ({
  index,
  filePath,
  settings: {
    saveToJson,
    certaintyLevel,
    labelsLanguage,
  },
  system: {
    fs,
    path,
  },
  token,
  saveDir,
  onSuccess,
}) => {
  const [isLoading, setIsLoading] = useState(true);

  const getGVisionTags = async () => {
    const { base } = path.parse(filePath);

    const url = 'https://plugins.deskfiler.org/api/index.php';

    const formData = {
      appaction: 'bridge',
      appid: 'gvision',
      appname: 'deskfiler',
      token,
      file: [new Blob([fs.readFileSync(filePath)]), `${base}`],
      ...(labelsLanguage ? { appsortstr: labelsLanguage } : {}),
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
      body,
      headers: {
        credentials: 'include',
        Authorization: 'Basic YTpi',
      },
    });

    const json = await response.json();

    if (json.error) throw new Error(json.error);

    const { data: { labelAnnotations: tags } } = json;

    return {
      tags,
      response: json,
    };
  };

  const writeTagsToExif = ({ tags }) => {
    const { name, ext, dir } = path.parse(filePath);

    if (!/(\.jpg|\.jpeg)/.test(ext)) {
      throw new Error('Exif tags not written for', `${name}${ext}`, 'image not jpeg!');
    }

    const base64File = b64converter.base64Sync(filePath);
    const [zeroth, exif, gps] = [{}, {}, {}];

    exif[piexif.ExifIFD.UserComment] = `Tagged by Google Vision, in Deskfiler. \n Tags: ${tags.join(', ')}`;
    zeroth[piexif.ImageIFD.ImageDescription] = `${tags.join(', ')}`;

    const exifObj = { '0th': zeroth, Exif: exif, GPS: gps };
    const exifStr = piexif.dump(exifObj);
    const inserted = piexif.insert(exifStr, base64File);

    b64converter.imgSync(inserted, dir, name);

    if (saveDir) {
      fs.copyFileSync(filePath, `${saveDir}/${name}-tagged-copy${ext}`);
    }
  };

  useEffect(() => {
    async function process() {
      const { tags, response } = await getGVisionTags({ filePath, labelsLanguage });

      const filteredTags = tags
        .filter(t => t.score >= parseInt(certaintyLevel || 0, 10))
        .map(({ description }) => description);

      writeTagsToExif({ filePath, tags: filteredTags, saveDir });

      if (saveToJson) {
        const { base } = path.parse(filePath);
        fs.writeFileSync(
          path.join(saveDir, `${base}-gvision-data.json`),
          JSON.stringify(response.data, null, 2),
        );
      }

      setIsLoading(false);
    }

    process();
  }, []);

  useEffect(() => {
    if (isLoading === false) {
      onSuccess();
    }
  }, [isLoading]);

  return (
    <img
      style={{
        width: 125,
        height: 125,
        margin: 10,
        border: `4px solid ${isLoading ? '#666' : '#66ff66'}`,
        transition: 'all .3s ease',
      }}
      src={`file://${filePath}`}
      alt={filePath}
    />
  );
};

export default ImageProcessor;
