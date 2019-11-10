const inputs = {
  runOnStartUp: {
    label: 'Run on Startup',
    name: 'runOnStartUp',
    type: 'radio',
  },
  startWhenOpened: {
    label: 'Only start when opened',
    name: 'runOnStartUp',
    type: 'radio',
    isInverted: true,
  },
  language: {
    label: 'Language',
    name: 'language',
    type: 'text',
    placeholder: 'Select language',
  },
  defaultStoragePath: {
    label: 'Storage Path',
    buttonLabel: 'Change',
    name: 'defaultStoragePath',
    placeholder: 'Input default storage path',
  },
};

export default inputs;
