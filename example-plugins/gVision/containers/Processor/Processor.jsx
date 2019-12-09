/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import b64converter from 'base64-img';
import piexif from 'piexifjs';
import png from 'png-metadata';

import xmarkIcon from '../../assets/images/x-mark.svg';
import checkmarkIcon from '../../assets/images/check-mark.svg';
import arrowRoundIcon from '../../assets/images/arrow-round.svg';

import { Flex } from '../../styled';
import * as S from './styled';

const writeTagsToExif = ({ filePath, tags, saveDir, fs, path }) => {
  try {
    const { name, ext } = path.parse(filePath);

    if (!/(\.jpg|\.jpeg|\.png)/i.test(ext)) {
      throw new Error('Exif tags not written for', `${name}${ext}`, 'image not jpeg or png!');
    }
  
    const fileBufferCopy = fs.readFileSync(filePath, 'binary');
    if (!png.isPNG(fileBufferCopy)) {
      const base64File = b64converter.base64Sync(filePath);
      const [zeroth, exif, gps] = [{}, {}, {}];
  
      exif[piexif.ExifIFD.UserComment] = `Tagged by Google Vision, in Deskfiler. \n Tags: ${tags.join(', ')}`;
      zeroth[piexif.ImageIFD.ImageDescription] = `${tags.join(', ')}`;
  
      const exifObj = { '0th': zeroth, Exif: exif, GPS: gps };
      const exifStr = piexif.dump(exifObj);
      const inserted = piexif.insert(exifStr, base64File);
  
      b64converter.imgSync(inserted, filePath);
    } else {
      try {
        const chunks = png.readFileSync(filePath);
        const list = png
          .splitChunk(chunks)
          .filter(c => !c.data.startsWith('Tagged by Google Vision, in Deskfiler.')
        );
        const iend = list.pop();
  
        const tagChunk = png.createChunk("aaAa", `Tagged by Google Vision, in Deskfiler. \n Tags: ${tags.join(', ')}`);
        list.push(tagChunk);
        list.push(iend);
  
        const taggedImage = png.joinChunk(list);
        fs.unlinkSync(filePath);
        png.writeFileSync(filePath, taggedImage);
      } catch (err) {
        fs.writeFileSync(filePath, fileBufferCopy, 'binary');
        throw new Error(err);
      }
      if (saveDir) {
        fs.copyFileSync(filePath, `${saveDir}/${name}-tagged-copy${ext}`);
      }
    } 
  } catch (err) {
    throw new Error(err);
  }
};

const ImageProcessor = ({
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
  onError,
  onInfo,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageData, setImageData] = useState(null);

  const getGVisionTags = async ({ filePath, labelsLanguage }) => {
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

  useEffect(() => {
    async function process() {
      try {
        const { tags, response } = await getGVisionTags({ filePath, labelsLanguage });
        const filteredTags = tags.reduce((acc, t, index) => {
          if (t.score >= parseInt(certaintyLevel || 0, 10)) {
            return [...acc, (
              labelsLanguage && /^[\u0000-\u00ff]+$/.test(response.data[`${labelsLanguage}Labels`][index])
                ? response.data[`${labelsLanguage}Labels`][index]
                : t.description
              )
            ];
          }
          return acc;
        }, []);

        setImageData({ ...response.data, tags: filteredTags });

        writeTagsToExif({ filePath, tags: filteredTags, saveDir, fs, path });

        if (saveToJson) {
          const { base } = path.parse(filePath);
          fs.writeFileSync(
            path.join(saveDir, `${base}-gvision-data.json`),
            JSON.stringify(response.data, null, 2),
          );
        }
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }
    process();
  }, []);

  useEffect(() => {
    if (isLoading === false) {
      if (error) {
        console.error('Image is not processed: ', error);
        onError(error);
      } else {
        onSuccess();
      }
    }
  }, [isLoading, error]);

  const { name, ext } = path.parse(filePath);

  return isLoading ? <S.Spinner src={arrowRoundIcon} /> : (
    <Flex style={{ margin: '10px 10px 25px', fontSize: '.875rem' }}>
      <S.ImageWrapper onClick={() => {
        if (!error) {
          onInfo({ filePath, data: imageData, labelsLanguage });
        }
      }}>
        <S.Image
          src={`file://${filePath}`}
          alt={filePath}
        />
        <Flex
          style={{
            position: 'absolute',
            bottom: '10px',
            right: '10px',
            padding: '3px',
            background: error ? 'red' : '#00CC33'
          }}
        >
          <S.Icon src={error ? xmarkIcon : checkmarkIcon} />
        </Flex> 
      </S.ImageWrapper>
      <div style={{ maxWidth: '125px' }}>
        <span
          style={{
            display: 'block',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            fontWeight: 700,
          }}
        >
          {`${name}${ext}`}
        </span>
        <span
          style={{
            display: 'block',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {error ? 'Processing failed' : `${imageData.tags.length} Tags set to image`}
        </span>
      </div>
      {!error && (
        <S.InfoLink
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onInfo({ filePath, data: imageData, labelsLanguage });
          }}
        >
          More information
        </S.InfoLink>
      )}
    </Flex>
  );
};

export default ImageProcessor;
