import React from 'react';
import { ipcRenderer } from 'electron';

import { Flex, Text } from 'styled';

export default class ContainersErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, cacheCleared: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    ipcRenderer.on('local-cache-cleared', () => {
      this.setState({
        cacheCleared: true,
      });
    })
  }

  render() {
    if (this.state.hasError) {
      return  (
        <Flex width="100%" height="100%" padding="16px">
          <Text.Bold>
            Something really bad happened...
          </Text.Bold>
          {this.state.cacheCleared
              ?  (
                <Flex
                  marginTop="12px"
                  cursor="pointer"
                  background="magenta"
                  padding="2px 6px"
                  radius="3px"
                  onClick={() => ipcRenderer.send('restart-app')}
                >
                  <Text.Medium color="white">
                    Restart
                  </Text.Medium>
                </Flex>
              ) : (
                <Flex
                  marginTop="12px"
                  cursor="pointer"
                  background="magenta"
                  padding="2px 6px"
                  radius="3px"
                  onClick={() => ipcRenderer.send('clear-local-cache')}
                >
                  <Text.Medium color="white">
                    Try resetting cache
                  </Text.Medium>
                </Flex>
              )
          }
        </Flex>
      )
    }
    return this.props.children;
  }
}
