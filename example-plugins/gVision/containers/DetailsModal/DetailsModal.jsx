import React, { useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import sizeOf from 'image-size';

import {
  Flex,
} from '../../styled';

import * as S from './styled';

const useClickOutside = (ref, callback) => {
  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      callback();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });
};

const DetailsModal = ({
  filePath,
  data,
  isOpen,
  labelsLanguage,
  close,
  system,
}) => {
  const wrapperRef = useRef(null);
  useClickOutside(wrapperRef, close);

  if (!isOpen || !data) return null;

  const { 
    webDetection: {
      webEntities,
      fullMatchingImages,
      visuallySimilarImages,
    },
    tags,
  } = data;

  const { shell, path } = system;

  const { name, ext } = path.parse(filePath);

  const { width, height } = sizeOf(filePath);

  return (
    ReactDOM.createPortal(
      <S.ModalContainer>
        <S.Modal ref={wrapperRef}>
          <Flex width="100%" maxHeight="600px" overflowY="auto" margin="8px 0px">
            <Flex row justify="space-between">
              <S.Image
                src={`file://${filePath}`}
                alt={filePath}
              />
              <Flex flex="1 1 auto" style={{ margin: '0 10px' }}>
                <S.Table>
                  <tbody style={{ border: 0 }}>
                    <tr key="Title">
                      <td style={{ width: '20px' }}>Title:</td>
                      <td style={{ maxWidth: 0, overflow: 'auto', whiteSpace: 'nowrap', fontWeight: 700 }}>{`${name}${ext}`}</td>
                    </tr>
                    <tr key="Size">
                      <td>Size:</td>
                      <td>{`${width} x ${height}`}</td>
                    </tr>
                    {tags && (
                      <tr key="Tags">
                        <td>Tags:</td>
                        <td style={{ maxWidth: 0, overflow: 'auto' }}>
                          {tags
                            .map(t => t.description ? description : t)
                            .map(t => `#${t.trim().replace(/\s+/g, '-').toLowerCase()}`)
                            .join(' ')}
                        </td>
                      </tr>
                    )}
                    {webEntities && (
                      <tr key="Found text">
                        <td style={{ verticalAlign: 'baseline', maxWidth: 0, whiteSpace: 'nowrap' }}>Found text:</td>
                        <td style={{ maxWidth: 0, overflow: 'auto' }}>
                          {webEntities.map(({ description }) => description).join(', ')}
                        </td>
                      </tr>
                    )}
                    <tr key="Language">
                      <td>Language:</td>
                      <td>{labelsLanguage.toUpperCase()}</td>
                    </tr>
                    {fullMatchingImages && (
                      <tr key="Full matches">
                        <td style={{ verticalAlign: 'baseline' }}>Full matches:</td>
                        <td style={{ maxWidth: 0, overflow: 'auto', whiteSpace: 'nowrap' }}>
                          {fullMatchingImages.map(({ url }) => (
                            <a
                              key={url}
                              href="#"
                              style={{ display: 'block' }}
                              onClick={() => {
                                shell.openExternal(url)
                              }}
                            >
                              {url}
                            </a>
                          ))}
                        </td>
                      </tr>
                    )}
                    {visuallySimilarImages && (
                      <tr key="Similar images">
                        <td style={{ verticalAlign: 'baseline' }}>Similar images:</td>
                        <td style={{ maxWidth: 0, overflow: 'auto', whiteSpace: 'nowrap' }}>
                          {visuallySimilarImages.map(({ url }) => (
                            <a
                              key={url}
                              href="#"
                              style={{ display: 'block' }}
                              onClick={() => {
                                shell.openExternal(url)
                              }}
                            >
                              {url}
                            </a>
                          ))}
                        </td>
                    </tr>
                  )}
                  </tbody>
                </S.Table>
              </Flex>
              <S.Close
                onClick={(e) => {
                  e.preventDefault();
                  close();
                }}
              >
                <S.CloseIcon />
              </S.Close>
            </Flex>
          </Flex>
        </S.Modal>
      </S.ModalContainer>,
    document.body,
  ));
};

export default DetailsModal;