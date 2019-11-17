/* eslint-disable react/prop-types */ // temporary
import React, { useState, useEffect } from 'react';
import { Grid, Cell, Button } from 'react-foundation';
import { DateTime } from 'luxon';
import { Flex, Text } from 'styled';
import path from 'path';
import fs from 'fs';
import { usePlugins, useUiState } from 'hooks';
import { exportLogs } from 'utils';
import {
  Table,
  AutoSizer,
  Column,
  SortDirection,
  SortIndicator,
} from 'react-virtualized';

import closeIcon from 'assets/images/close.svg';

import { LOGS_DIR } from '../../constants';
import * as S from './styled';

const TableCell = ({ children, ...props }) => (
  <Flex padding="4px" {...props} overflow="auto">
    {children}
  </Flex>
);

const HeaderCell = ({ title, sortDirection }) => (
  <TableCell borderBottom="1px solid #f2f2f2">
    <Text.Bold size=".8em">
      {title}
      {sortDirection && <SortIndicator sortDirection={sortDirection} />}
    </Text.Bold>
  </TableCell>
);

const TextCell = ({ children, props }) => (
  <TableCell>
    <Text {...props}>
      {children}
    </Text>
  </TableCell>
);

const DateCell = ({ timestamp, props }) => (
  <TableCell {...props}>
    <Text.Medium>
      {DateTime.fromMillis(timestamp).toLocaleString(DateTime.DATETIME_MED)}
    </Text.Medium>
  </TableCell>
);

const Logs = () => {
  const [plugins] = usePlugins();
  const [{ sideView }, { setUiState }] = useUiState();
  const [selectedPluginKey, setSelectedPluginKey] = useState(null);
  const [data, setData] = useState([]);
  const [sortBy, setSortBy] = useState('timestamp');
  const [sortDirection, setSortDirection] = useState(SortDirection.DESC);

  const compare = key => (a, b) => (a[key] && b[key] ? (key === 'timestamp' ? b[key] - a[key] : b[key].localeCompare(a[key])) : 0); // eslint-disable-line no-nested-ternary

  const sortData = ({ sortBy: sortKey, sortDirection: sDirection }) => {
    const sortedData = data.sort(compare(sortKey));
    setSortBy(sortKey);
    setSortDirection(sDirection);
    setData(sDirection === SortDirection.ASC ? sortedData.reverse() : sortedData);
  };

  useEffect(() => {
    if (selectedPluginKey) {
      const logFilePath = path.join(LOGS_DIR, `${selectedPluginKey}-logs.json`);
      let logsTxt = '[]';
      if (fs.existsSync(logFilePath)) {
        logsTxt = fs.readFileSync(path.join(LOGS_DIR, `${selectedPluginKey}-logs.json`));
      }
      const logs = JSON.parse(logsTxt);
      setData(logs.sort((a, b) => b.timestamp - a.timestamp));
    }
  }, [selectedPluginKey, sideView]);

  useEffect(() => {
    setSortDirection(SortDirection.DESC);
  }, [plugins, sideView]);

  return (
    <S.LogsView
      className="logs-view"
      show={sideView === 'logs'}
    >
      <Grid style={{ height: '100%' }}>
        <Cell small={10} style={{ height: '100%', display: 'flex', flexFlow: 'column nowrap' }}>
          <Flex width="100%" height="100%" padding="16px" grow={1}>
            {(selectedPluginKey && data.length) ? (
              <AutoSizer>
                {({ width, height }) => (
                  <Table
                    height={height - 64}
                    width={width}
                    headerHeight={50}
                    rowHeight={35}
                    rowCount={data.length}
                    rowGetter={({ index }) => data[index]}
                    sort={sortData}
                    sortBy={sortBy}
                    sortDirection={sortDirection}
                  >
                    <Column
                      dataKey="timestamp"
                      width={150}
                      cellRenderer={({ cellData }) => (<DateCell timestamp={cellData} />)}
                      headerRenderer={() => (<HeaderCell title="Date" sortDirection={sortDirection} />)}
                    />
                    <Column
                      dataKey="action"
                      width={250}
                      cellRenderer={({ cellData }) => (<TextCell>{cellData}</TextCell>)}
                      headerRenderer={() => (<HeaderCell title="Action" sortDirection={sortDirection} />)}
                    />
                    <Column
                      dataKey="meta"
                      disableSort
                      flexGrow={1}
                      width={300}
                      cellRenderer={({ cellData }) => (<TextCell>{cellData.value}</TextCell>)}
                      headerRenderer={() => (<HeaderCell title="Additional Information" />)}
                    />
                  </Table>
                )}
              </AutoSizer>
            ) : (
              <Flex
                width="100%"
                height="100%"
                padding="16px"
                grow={1}
                align="center"
                justify="center"
              >
                <span>{!selectedPluginKey ? 'Please select a plugin on the right side to see the logs for it' : 'No logs yet...'}</span>
              </Flex>
            )}
          </Flex>
          {(selectedPluginKey && data.length) && (
            <Flex>
              <Flex
                row
                justify="flex-end"
                padding="12px 25px"
                flex="0 0 auto"
                width="100%"
              >
                <Button
                  style={{ marginLeft: 16 }}
                  isHollow
                  color="alert"
                  onClick={() => {
                    const logFilePath = path.join(LOGS_DIR, `${selectedPluginKey}-logs.json`);
                    fs.writeFileSync(logFilePath, '[]');
                    setData([]);
                  }}
                >
                  Clear Logs
                </Button>
                <Button
                  isHollow
                  onClick={() => {
                    exportLogs(data);
                  }}
                >
                  Export Log
                </Button>
              </Flex>
            </Flex>
          )}
        </Cell>
        <Cell auto="all" style={{ height: '100%' }}>
          <Flex
            height="100%"
            align="normal"
            background="#0f294b"
          >
            <S.LogsMenuItem onClick={() => setUiState('sideView', null)}>
              <S.CloseIcon src={closeIcon} />
            </S.LogsMenuItem>
            <S.LogsMenuTitle>Logs</S.LogsMenuTitle>
            {Object.keys(plugins).map(pluginKey => (
              <S.LogsMenuPlugin
                key={pluginKey}
                style={{ minWidth: 0 }}
                onClick={() => {
                  setSelectedPluginKey(pluginKey);
                }}
              >
                <Text
                  hideOverflow
                  size="15px"
                  style={{ color: selectedPluginKey === pluginKey ? '#f4c036' : '#fff'}} >
                  {plugins[pluginKey].name}
                </Text>
              </S.LogsMenuPlugin>
            ))}
          </Flex>
        </Cell>
      </Grid>
    </S.LogsView>
  );
};

export default Logs;
