import React, { useState } from 'react';

import {
  Grid,
  Cell,
  Button,
} from 'react-foundation';

import {
  Formik,
} from 'formik';

import { round } from '../../utils';

import chevronRightIcon from '../../assets/images/chevron-right.svg';
import closeIcon from '../../assets/images/closewhite.svg';

import Checkbox from '../../components/Checkbox';
import Select from '../../components/Select';

import { Flex, Title, HeaderLabel } from '../../styled';

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
    return {
      isInsufficientFunds: availableFilesToProcessCount < filesCount,
      fundsToSpend: filesCount * plugindetails.OZPRICE,
    };
  }
  return { isInsufficientFunds: true, fundsToSpend: null };
};

const PluginSettings = ({
  ticket: initialTicket,
  filesCount,
  openPaymentWindow,
  onSubmit,
  settings,
  cancel,
}) => {
  const [ticket, setTicket] = useState(initialTicket);

  const { userticket, plugindetails } = ticket || {};

  const { isInsufficientFunds, fundsToSpend } = checkFundsPerFile({ ticket, filesCount });
  return (
    <S.PluginSettings>
      <Title>gVision</Title>
      <HeaderLabel>You have dropped {filesCount} file{filesCount > 1 ? 's' : ''}, what shall I do?</HeaderLabel>
      <Formik
        enableReinitialize
        initialValues={settings}
        onSubmit={(values) => {
          onSubmit({ newSettings: values, fundsToSpend });
        }}
        render={({ handleSubmit }) => (
          <>
            <Flex>
              <Checkbox {...inputs.saveLabelInfo} />
              <Checkbox {...inputs.copyTaggedToExtraFolder} />
              <Checkbox {...inputs.saveToJson} />
            </Flex>
            <Grid className="grid-margin-x">
              <Cell small={6}>
                <Select style={{ flex: 1 }} {...inputs.labelsLanguage} />
              </Cell>
              <Cell large={6}>
                <Select style={{ height: '100%' }} style={{ flex: 1 }} {...inputs.certaintyLevel} />
              </Cell>
            </Grid>
            <Flex row style={{ marginTop: 12 }}>
              <Flex flex="0 0 50%">
                {isInsufficientFunds ? (
                  'Please add some funds to your account, this plugin requires payment in steps of 1,000 calls.'
                ) : (
                  <>
                    <Flex row justify="space-between">
                      <span>Current balance:</span>
                      <span>{`$ ${round(userticket.OZVALUE)}`}</span>
                    </Flex>
                    <Flex row justify="space-between" style={{ fontWeight: 700 }}>
                      <span>{`${filesCount} picture${filesCount > 1 ? 's' : ''} x $${plugindetails.OZPRICE}.`}</span>
                      <span>{`$ ${round(fundsToSpend)}`}</span>
                    </Flex>
                    <S.Divider />
                    <Flex row justify="space-between">
                      <span>Balance after processing:</span>
                      <span>{`$ ${round(userticket.OZVALUE - fundsToSpend)}`}</span>
                    </Flex>
                  </>
                )}
              </Flex>
              <Flex flex="0 0 50%" justify="flex-end" align="flex-end">
                <Flex row justify="flex-end" >
                  <Button
                    color="secondary"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      flex: '0 0 auto',
                      margin: '0 8px 0 0',
                      fontSize: '16px'
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      cancel();
                    }}
                  >
                    <S.Icon src={closeIcon} style={{ height: '15px', marginRight: '5px' }} />
                    Cancel
                  </Button>
                  <Button
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      flex: '0 0 auto',
                      margin: 0,
                      fontSize: '16px',
                    }}
                    color={isInsufficientFunds ? 'alert' : 'primary'}
                    onClick={async () => {
                      if (isInsufficientFunds) {
                        const newTicket = await openPaymentWindow(plugindetails.OZUSERID);
                        if (ticket) setTicket(newTicket);
                        return;
                      }
                      handleSubmit();
                    }}
                  >
                    {isInsufficientFunds ? 'Add funds' : 'Start processing'}
                    <S.Icon src={chevronRightIcon} style={{ marginLeft: '5px' }} />
                  </Button>
                </Flex>
              </Flex>
            </Flex>
          </>
        )}
      />
    </S.PluginSettings>
  );
};

export default PluginSettings;
