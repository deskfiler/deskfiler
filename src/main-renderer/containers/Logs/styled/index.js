import styled from 'styled-components';

export const LogsView = styled.div`
  height: 100%;
  overflow: hidden;
  width: 100vw;
  background: #fff;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  transform: ${props => (props.show
    ? 'translate3d(0px, 0px, 0px)'
    : 'translate3d(-100%, 0px, 0px)'
  )};
  transition: transform .3s ease-out;
  font-family: Roboto;
`;

export const TableHeader = styled.th`
  white-space: nowrap;
`;

export const ResetFilters = styled.a`
  text-decoration: none;
`;

export const Filter = styled.a`
  text-decoration: none;
`;

export const FilterIcon = styled.img`
  height: 20px;
`;

export const LogsMenuItem = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px;
  min-height: 41px;
  white-space: nowrap;
  color: black;
  background: #fff;
  border-bottom: 1px solid black;
  cursor: pointer;
`;

export const LogsMenuTitle = styled(LogsMenuItem)`
  background: #f4c036;
  cursor: default;
`;

export const LogsMenuPlugin = styled(LogsMenuItem)`
  background: #1D4779;
  border-bottom: 1px solid #0f294b;
  &:hover {
    background: #004a87;
  };
`;

export const CloseIcon = styled.img`
  height: 14px;
`;
