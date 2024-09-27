import React, { useEffect, useState, useCallback } from 'react';
import { Feature, FeatureCollection } from 'geojson';
import { Table, Pagination } from 'rsuite';
import { Cell, Column, HeaderCell } from 'rsuite-table';
import { Checkbox } from 'rsuite';

import StyledResultsTable from './styles';

interface IResultsTableProps {
  searchResults?: FeatureCollection;
  setSelectedResults: CallableFunction;
  loading: boolean;
}

const ResultsTable: React.FC<IResultsTableProps> = ({
  searchResults,
  setSelectedResults,
  loading
}) => {
  const [checkedKeys, setCheckedKeys] = useState<any[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [sortDataType, setDataSortType] = useState<'asc' | 'desc'>();
  const [sortDataKey, setSortDataKey] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const limit = 8;

  const getVisibleData = useCallback(() => {
    return features.filter((_, i) => {
      const start = limit * (page - 1);
      const end = start + limit;

      return i >= start && i < end;
    });
  }, [features, page, limit]);

  const handleCheckAll = (checked: boolean) => {
    const keys = checked ? getVisibleData().map((item) => item.id) : [];

    setCheckedKeys(keys);
    setSelectedResults(checked ? getVisibleData() : ([] as Feature[]));
  };

  const handleCheck = (value: any, checked: boolean) => {
    const keys = checked
      ? [...checkedKeys, value]
      : checkedKeys.filter((item) => item !== value);
    setCheckedKeys(keys);
    setSelectedResults(
      getVisibleData().filter((item) => keys.includes(item.id))
    );
  };

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  const CheckCell = ({
    rowData,
    onChange,
    checkedKeys,
    dataKey
  }: {
    rowData: any;
    onChange: any;
    checkedKeys: any[];
    dataKey: string;
  }) => (
    <div className='results-table--checkbox--container'>
      <Checkbox
        className='results-table--checkbox'
        value={rowData[dataKey]}
        inline
        onChange={onChange}
        checked={checkedKeys.some((item) => item === rowData[dataKey])}
      />
    </div>
  );

  const sortFeaturesByDataKey = (
    features: Feature[],
    dataKey: string,
    sortType: 'asc' | 'desc'
  ) => {
    const getNestedValue = (obj: any, path: string) => {
      return path.split('.').reduce((acc, key) => acc && acc[key], obj);
    };

    return [...features].sort((a, b) => {
      const valueA = getNestedValue(a, dataKey);
      const valueB = getNestedValue(b, dataKey);

      const isAInvalid = valueA === undefined || valueA === null;
      const isBInvalid = valueB === undefined || valueB === null;

      if (isAInvalid && isBInvalid) {
        return 0;
      } else if (isAInvalid) {
        return 1;
      } else if (isBInvalid) {
        return -1;
      }

      if (sortType === 'asc') {
        return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
      } else {
        return valueA > valueB ? -1 : valueA < valueB ? 1 : 0;
      }
    });
  };

  const handleSort = (dataKey: string, sortType?: 'asc' | 'desc') => {
    if (dataKey === sortDataKey && sortType === 'desc') {
      setDataSortType(undefined);
      setSortDataKey('');
      setFeatures(searchResults?.features || []);
    } else if (dataKey === sortDataKey && sortType === 'asc') {
      setDataSortType('asc');
      setSortDataKey(dataKey);
      setFeatures(sortFeaturesByDataKey(features, dataKey, 'asc'));
    } else {
      setDataSortType('desc');
      setSortDataKey(dataKey);
      setFeatures(sortFeaturesByDataKey(features, dataKey, 'desc'));
    }
  };

  useEffect(() => {
    setFeatures(searchResults?.features || []);
  }, [searchResults]);

  useEffect(() => {
    setCheckedKeys(getVisibleData().map((item) => item.id));
    setSelectedResults(getVisibleData());
  }, [features, page, getVisibleData, setSelectedResults]);

  return (
    <StyledResultsTable>
      <div className='results-table--container'>
        <Table
          autoHeight
          loadAnimation
          loading={loading}
          virtualized
          data={getVisibleData()}
          sortType={sortDataType}
          sortColumn={sortDataKey}
          onSortColumn={handleSort}
          className='results--table'
          bordered
        >
          <Column width={100} align='center' fixed>
            <HeaderCell className='results-table--header header--btn'>
              <div className='results-table--checkbox--container'>
                <Checkbox
                  inline
                  color='orange'
                  checked={
                    checkedKeys.length === getVisibleData().length
                      ? true
                      : false
                  }
                  indeterminate={
                    checkedKeys.length > 0 &&
                    checkedKeys.length < getVisibleData().length
                  }
                  onChange={(_, checked) => handleCheckAll(checked)}
                  className='results-table--checkbox'
                />
              </div>
            </HeaderCell>
            <Cell className='results-table--cell'>
              {(rowData) => (
                <CheckCell
                  rowData={rowData}
                  dataKey='id'
                  checkedKeys={checkedKeys}
                  onChange={handleCheck}
                />
              )}
            </Cell>
          </Column>
          <Column width={450} align='center' resizable sortable fixed>
            <HeaderCell className='results-table--header header--text'>
              Feature description
            </HeaderCell>
            <Cell dataKey='description' />
          </Column>
          <Column sortable width={125} align='center' resizable>
            <HeaderCell className='results-table--header header--text'>
              Cloud cover
            </HeaderCell>
            <Cell dataKey='properties.eo:cloud_cover' />
          </Column>
          <Column sortable width={140} align='center' resizable>
            <HeaderCell className='results-table--header header--text'>
              Land cloud cover
            </HeaderCell>
            <Cell dataKey='properties.landsat:cloud_cover_land' />
          </Column>
          <Column width={160} align='center' resizable>
            <HeaderCell className='results-table--header header--text'>
              Collection category
            </HeaderCell>
            <Cell dataKey='properties.landsat:collection_category' />
          </Column>
          <Column width={140} align='center' resizable>
            <HeaderCell className='results-table--header header--text'>
              Collection number
            </HeaderCell>
            <Cell dataKey='properties.landsat:collection_number' />
          </Column>
          <Column width={125} align='center' resizable>
            <HeaderCell className='results-table--header header--text'>
              Instruments
            </HeaderCell>
            <Cell dataKey='properties.instruments'>
              {(rowData) => <>{rowData.properties.instruments.join(', ')}</>}
            </Cell>
          </Column>
          <Column sortable width={150} align='center' resizable>
            <HeaderCell className='results-table--header header--text'>
              Sun azimuth
            </HeaderCell>
            <Cell dataKey='properties.view:sun_azimuth'>
              {(rowData) => (
                <span
                  className='results-table--custom-span'
                  style={{
                    color:
                      rowData.properties['view:sun_azimuth'] < 0
                        ? 'red'
                        : 'green'
                  }}
                >
                  <span>
                    {rowData.properties['view:sun_azimuth'] > 0 ? '+' : null}
                  </span>
                  <span>
                    {rowData.properties['view:sun_azimuth'].toFixed(2)}°
                  </span>
                </span>
              )}
            </Cell>
          </Column>
          <Column sortable width={150} align='center' resizable>
            <HeaderCell className='results-table--header header--text'>
              Sun elevation
            </HeaderCell>
            <Cell dataKey='properties.view:sun_elevation'>
              {(rowData) => (
                <span
                  className='results-table--custom-span'
                  style={{
                    color:
                      rowData.properties['view:sun_elevation'] < 0
                        ? 'red'
                        : 'green'
                  }}
                >
                  <span>
                    {rowData.properties['view:sun_elevation'] > 0 ? '+' : null}
                  </span>
                  <span>
                    {rowData.properties['view:sun_elevation'].toFixed(2)}°
                  </span>
                </span>
              )}
            </Cell>
          </Column>
          <Column width={150} align='center' sortable resizable>
            <HeaderCell className='results-table--header header--text'>
              Off nadir
            </HeaderCell>
            <Cell dataKey='properties.view:off_nadir'>
              {(rowData) => (
                <span className='results-table--custom-span'>
                  <span>
                    {rowData.properties['view:off_nadir'] > 0 ? '+' : null}
                  </span>
                  <span>
                    {rowData.properties['view:off_nadir'].toFixed(2)}°
                  </span>
                </span>
              )}
            </Cell>
          </Column>
          <Column width={340} align='center' resizable>
            <HeaderCell className='results-table--header header--text'>
              Datetime
            </HeaderCell>
            <Cell dataKey='properties.datetime' />
          </Column>
        </Table>
        <div className='pagination--container'>
          <Pagination
            prev
            next
            first
            last
            ellipsis
            boundaryLinks
            maxButtons={5}
            size='sm'
            layout={['-', 'total', '|', 'pager']}
            total={features.length}
            limit={limit}
            activePage={page}
            onChangePage={handlePageChange}
          />
        </div>
      </div>
    </StyledResultsTable>
  );
};

export default ResultsTable;
