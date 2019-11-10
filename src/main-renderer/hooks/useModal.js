import useModals from './useModals';

export default function useModal(modalKey) {
  const [modals, { closeModal }] = useModals();

  const modal = modals[modalKey];

  const close = () => closeModal(modalKey);

  return [modal, { close }];
}
