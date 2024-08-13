'use client';
import {
  Button,
  Center, Flex, Grid, Group,
  keys,
  rem,
  ScrollArea,
  Table,
  Text,
  TextInput,
  UnstyledButton,
} from '@mantine/core';

import {
  IconChevronDown,
  IconChevronUp, IconEye, IconPencil,
  IconSearch,
  IconSelector, IconTrashX,
} from '@tabler/icons-react';
import { ChangeEvent, ReactNode, useEffect, useState } from 'react';
import { modals } from '@mantine/modals';
import { notify } from '@/utils/notifications';
import { MESSAGES } from '@/constants/messages';
import EmptyTable from '@/components/tables/EmptyTable';
import { serializeData } from '@/utils/table';

export interface Header {
  key: string,
  title?: string,
  sortable?: boolean,
}

export type HeaderProps = { [key: string]: Header };

interface OptionProps {
  title?: string,
  update?: Function;
  view?: Function;
  deletePath?: string,
  refreshFn?: () => void,
  isLoading?: boolean,
}

interface DataProps {
  items: [],
  total: number
}

interface TableProps {
  data: DataProps[] | any[],
  headers: HeaderProps,
  headersMap?: { [key: string]: string | number },
  options?: OptionProps
}

interface ThProps {
  children: ReactNode;
  reversed?: boolean;
  sorted?: boolean;
  onSort?: () => void;
}

function Th({ children, reversed, sorted, onSort }: ThProps) {
  const Icon = sorted ? (reversed ? IconChevronUp : IconChevronDown) : IconSelector;
  return (
    <Table.Th>
      <UnstyledButton onClick={onSort}>
        <Group justify="space-between">
          <Text fw={500} fz="sm">
            {children}
          </Text>
          <Center>
            <Icon style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
          </Center>
        </Group>
      </UnstyledButton>
    </Table.Th>
  );
}

export default function TableComponent({ data, headers, headersMap, options }: TableProps) {
  const [search, setSearch] = useState('');
  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  const headerKeys = keys(headers) as (keyof typeof headers)[];

  type Keys = typeof headerKeys[number];

  interface DataRow {
    [key: Keys]: any;
  }


  const cols: DataRow[] = 'items' in data ? data.items as DataRow[] : data;
  const [sortBy, setSortBy] = useState<keyof DataRow | null>(null);
  const [sortedData, setSortedData] = useState(cols);

  function transformKey(key: string | number) {
    if (headersMap) {
      return headersMap[key] ?? key;
    } else {
      return key;
    }
  }

  function filterData(data: DataRow[], search: string) {
    const query = search.toLowerCase().trim();
    return data.filter((item) =>
      headerKeys.some((key) =>
        String(item[transformKey(key)]).toLowerCase().includes(query),
      ),
    );
  }

  function sortData(
    data: DataRow[],
    payload: { sortBy: keyof DataRow | null; reversed: boolean; search: string },
  ) {
    const { sortBy } = payload;

    if (!sortBy) {
      return filterData(data, payload.search);
    }

    const key = transformKey(sortBy);
    return filterData(
      [...data].sort((a, b) => {
        if (payload.reversed) {
          return b[key].localeCompare(a[key]);
        }

        return a[key].localeCompare(b[key]);
      }),
      payload.search,
    );
  }

  const setSorting = (field: Keys) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedData(sortData(cols, { sortBy: field, reversed, search }));
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearch(value);
    setSortedData(sortData(cols, { sortBy, reversed: reverseSortDirection, search: value }));
  };

  useEffect(() => {
    setSortedData(cols);
  }, [cols]);

  const thRows = Object.values(headers).map((header) => (
    <Th sorted={sortBy === header.key}
        reversed={reverseSortDirection}
        onSort={() => setSorting(header.key)}
        key={header.key}>
      {header.title}
    </Th>
  ));

  const actionable = options?.deletePath ?? options?.update ?? options?.view ?? false;
  const actionButton = (id: string | number) => {
    if (actionable) {
      const actions = [];

      if (options?.deletePath) {
        actions.push(
          <Button key={'action_delete_' + id} onClick={() => actionDelete(id)} size={'compact-sm'} variant={'light'}
                  color={'red'}
                  type={'button'}>
            <IconTrashX size={'20'} />
          </Button>,
        );
      }

      if (options?.update) {
        actions.push(
          <Button key={'action_update_' + id} onClick={() => options.update!(id)} size={'compact-sm'} variant={'light'}
                  color={'green'}
                  type={'button'}>
            <IconPencil size={'20'} />
          </Button>,
        );
      }

      if (options?.view) {
        actions.push(
          <Button key={'action_view_' + id} onClick={() => options.view!(id)} size={'compact-sm'} variant={'light'}
                  color={'blue'}
                  type={'button'}>
            <IconEye size={'20'} />
          </Button>,
        );
      }

      return actions.length ? (
        <Table.Td key={'action_' + id}>
          <Flex gap={'md'}>
            {actions}
          </Flex>
        </Table.Td>
      ) : actions;
    }
  };

  function actionDelete(id: string | number) {
    if (options?.deletePath) {
      modals.openConfirmModal({
        title: 'Delete confirmation',
        centered: true,
        confirmProps: { color: 'red' },
        labels: { confirm: 'Delete', cancel: 'Cancel' },
        children: (<Text size={'sm'}>{`Are you sure want to delete ${options?.title} ?`}</Text>),
        onConfirm: async () => {
          const response = await fetch(`/api/proxy?path=${options.deletePath}/` + id, {
            method: 'DELETE',
          });

          if (response.ok) {
            notify(MESSAGES.SUCCESS.DELETE + options?.title, 'success');
            if (options?.refreshFn) options.refreshFn();
          } else {
            notify(MESSAGES.ERROR.DELETE, 'error');
          }
        },
      });
    }
  }

  const thOption = actionable ? <Table.Th /> : null;
  const rows = sortedData.length ? sortedData.map((row, index) => (
    <Table.Tr key={index}>
      {headerKeys.map((key) => (
        <Table.Td key={key}>{serializeData(row[transformKey(key)])}</Table.Td>
      ))}
      {actionButton(row['id'])}
    </Table.Tr>
  )) : [];

  const showEmpty = options?.isLoading === undefined ? true : !options?.isLoading;

  const empty = showEmpty && !rows.length ? <Table.Caption><EmptyTable /></Table.Caption> : null;

  return (
    <>
      <TextInput
        placeholder="Search by any field"
        mb="md"
        classNames={{ input: 'w-50' }}
        leftSection={<IconSearch style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
        value={search}
        onChange={handleSearchChange}
      />
      <Table.ScrollContainer minWidth={100}>
        <Table highlightOnHover horizontalSpacing="sm" verticalSpacing="xs" classNames={{ td: 'break-words whitespace-nowrap text-ellipsis overflow-hidden text-sm' }} className={''}>
          <Table.Tbody>
            <Table.Tr>
              {thRows}
              {thOption}
            </Table.Tr>
          </Table.Tbody>
          <Table.Tbody>
            {rows}
          </Table.Tbody>
          {empty}
        </Table>
      </Table.ScrollContainer>

    </>
  );
}