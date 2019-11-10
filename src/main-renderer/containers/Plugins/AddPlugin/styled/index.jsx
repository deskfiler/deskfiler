import styled, {
  css,
} from 'styled-components';

export const AddPluginCard = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: white;
  font-size: 20px;
  padding: 16px 0;
  height: 100%;
  transition: .5s ease;
  position: relative;
  overflow: hidden;
`;

export const AppFigureWrapper = styled.div`
  width: 80%;
  height: 190px;
`;

export const AppFigure = styled.figure`
  border-radius: 50%;
  padding: 3px;
  display: flex;
  justify-content: center;
  flex: 0 0 auto;
  background-color: #fff;
`;

export const AppIcon = styled.img`
  height: 190px;
  width: 50%;
  object-fit: scale-down;
  padding: 2px;
`;
export const AppInfo = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  flex: 1 0 auto;
  position: relative;
  margin-top: 8px;
`;

export const Divider = styled.hr`
  margin: 0;
  border-bottom: 1px solid black;
  width: 50%;
`;

export { CardOverlay, DropFilesTitle, AppTitle } from '../../Plugin/styled';
