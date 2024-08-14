'use client';
import { Group, NumberInput, Paper, SimpleGrid, Text } from '@mantine/core';
import {
  IconUserPlus,
  IconDiscount2,
  IconReceipt2,
  IconCoin,
  IconArrowUpRight,
  IconArrowDownRight, IconProps, Icon,
} from '@tabler/icons-react';
import classes from './styles/StatsGrid.module.css';
import { ForwardRefExoticComponent, RefAttributes } from 'react';

const icons: { [key: string]: ForwardRefExoticComponent<IconProps & RefAttributes<Icon>> } = {
  user: IconUserPlus,
  discount: IconDiscount2,
  receipt: IconReceipt2,
  coin: IconCoin,
};

export interface DataProps {
  title: string,
  icon: string,
  value: string | number,
  diff: number
}

export function StatsGrid({ data }: { data: DataProps[] }) {
  const stats = data ? data.map((stat) => {
    const Icon = icons[stat.icon];
    const DiffIcon = stat.diff >= 0 ? IconArrowUpRight : IconArrowDownRight;

    return (
      <Paper withBorder p="md" radius="md" key={stat.title}>
        <Group justify="space-between">
          <Text size="xs" c="dimmed" className={classes.title}>
            {stat.title}
          </Text>
          <Icon className={classes.icon} size="1.4rem" stroke={1.5} />
        </Group>

        <Group align="flex-end" gap="xs" mt={25} pos={'relative'}>
          <NumberInput
            classNames={
              {
                input: classes.value,
              }
            }
            min={0}
            thousandSeparator
            decimalScale={2}
            variant="unstyled"
            placeholder="Harga bandrol"
            value={stat.value}
            size={'xl'}
            width={'max-content'}
            readOnly
          />

          <Text c={stat.diff >= 0 ? stat.diff == 0 || stat.diff == null ? 'gray' : 'teal' : 'red'} fz="sm" fw={500}
                className={classes.diff} pos={'absolute'} right={0}>
            <span>{stat.diff ?? 0}%</span>
            <DiffIcon size="1rem" stroke={1.5} />
          </Text>

        </Group>

        <Text fz="xs" c="dimmed" mt={7}>
          Dibandingkan dengan bulan sebelumnya
        </Text>
      </Paper>
    );
  }) : (<></>);
  return (
    <SimpleGrid cols={{ base: 1, xs: 2, md: 4 }}>{stats}</SimpleGrid>
  );
}