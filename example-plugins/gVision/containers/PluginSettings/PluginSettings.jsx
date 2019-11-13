import React from 'react';

import {
  Button,
} from 'react-foundation';

import {
  Formik,
} from 'formik';

import Checkbox from '../../components/Checkbox';
import Select from '../../components/Select';

import { Flex } from '../../styled';

import 'foundation-sites/dist/css/foundation.min.css';

import * as S from './styled';

const inputs = {
  saveLabelInfo: {
    key: 'saveLabelInfo',
    label: 'Save "label" information in images headers, where possible (EXIF)?',
    name: 'saveLabelInfo',
    type: 'checkbox',
  },
  copyTaggedToExtraFolder: {
    key: 'copyTaggedToExtraFolder',
    label: 'Copy tagged images to extra folder?',
    name: 'copyTaggedToExtraFolder',
    type: 'checkbox',
  },
  saveToJson: {
    key: 'saveToJson',
    label: 'Save extensive data in extra file (image-name.json)?',
    name: 'saveToJson',
    type: 'text',
  },
  labelsLanguage: {
    key: 'labelsLanguage',
    label: 'Language for labels',
    name: 'labelsLanguage',
    type: 'text',
    options: [
      { label: 'en', value: 'en' },
      { label: 'de', value: 'de' },
      { label: 'ru', value: 'ru' },
      { label: 'es', value: 'es' },
      { label: 'it', value: 'it' },
      { label: 'fr', value: 'fr' },
      { label: 'pt', value: 'pt' }
    ],
  },
  certaintyLevel: {
    key: 'certaintyLevel',
    label: 'Certainty level before a label is accepted',
    name: 'certaintyLevel',
    options: [
      { label: '10%', value: 0.1 },
      { label: '20%', value: 0.2 },
      { label: '30%', value: 0.3 },
      { label: '40%', value: 0.4 },
      { label: '50%', value: 0.5 },
      { label: '60%', value: 0.6 },
      { label: '70%', value: 0.7 },
      { label: '80%', value: 0.8 },
      { label: '90%', value: 0.9 },
    ],
  },
};

const checkFundsPerFile = ({ ticket, filesCount }) => {
  if (ticket) {
    const {
      userticket,
      plugindetails,
    } = ticket || {};
    const availableFilesToProcessCount = Math.floor(userticket.OZVALUE / plugindetails.OZPRICE);
    return availableFilesToProcessCount < filesCount;
  }
  return false;
};

const PluginSettings = ({
  ticket,
  settings,
  setSettings,
  openPaymentWindow,
  startProcessing,
  filesCount,
  cancel,
}) => {
  const { plugindetails } = ticket || {};

  const showPaymentInfo = checkFundsPerFile({ ticket, filesCount });
  return (
    <S.PluginSettings>
      <S.Title>gVision</S.Title>
      <S.Title>You have dropped {filesCount} file{filesCount > 1 ? 's' : ''}, what shall I do?</S.Title>
      <Formik
        enableReinitialize
        initialValues={settings}
        onSubmit={async (values) => {
          setSettings(values);
          await startProcessing(values);
        }}
        render={({ handleSubmit }) => (
          <>
            <Flex>
              <Checkbox {...inputs.saveLabelInfo} />
              <Checkbox {...inputs.copyTaggedToExtraFolder} />
              <Checkbox {...inputs.saveToJson} />
            </Flex>
            <Flex>
              <Select {...inputs.labelsLanguage} />
              <Select {...inputs.certaintyLevel} />
            </Flex>
            <Flex
              row
            >
              {showPaymentInfo && (
                <S.PaymentInfo>
                  Please add some funds to your account, this plugin requires payment in steps of 1,000 calls
                </S.PaymentInfo>
              )}
              <Button
                style={{ flex: '0 0 auto' }}
                onClick={() => {
                  if (showPaymentInfo) {
                    openPaymentWindow(plugindetails.OZUSERID);
                    return;
                  }
                  handleSubmit();
                }}
              >
                {showPaymentInfo ? 'Add funds' : 'Start processing'}
              </Button>
              <Button
                color="secondary"
                style={{ flex: '0 0 auto' }}
                onClick={(e) => {
                  e.preventDefault();
                  cancel();
                }}
              >
                Cancel
              </Button>
            </Flex>
          </>
        )}
      />
    </S.PluginSettings>
  );
};

export default PluginSettings;
