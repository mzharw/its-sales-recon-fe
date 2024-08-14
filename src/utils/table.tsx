import { Header } from '@/components/Table';
import { isDateString, toPascalCase, withThousandSeparator } from '@/utils/string';
import { Table } from '@mantine/core';

// export function generateHeadersAlt<T extends object>(sampleObject: T): Header[] {
//     return Object.keys(sampleObject).map((key) => ({
//         key,
//         title: toPascalCase(key),
//         sortable: true,
//     }));
// }


// export function generateHeaders<T extends object>(sampleObject: T): { [K in keyof T]: Header } {
//     const headers = {} as { [K in keyof T]: Header };
//
//     Object.keys(sampleObject).forEach((key) => {
//         headers[key as keyof T] = {
//             key,
//             title: toPascalCase(key).replace('_', ' '),
//             sortable: true,
//         };
//     });
//
//     return headers;
// }

export function generateHeaders(...keys: string[]): { [key: string]: Header } {
  const headers = {} as { [key: string]: Header };

  keys.forEach((key) => {
    headers[key] = {
      key,
      title: toPascalCase(key).replace('_', ' '),
      sortable: true,
    };
  });

  return headers;
}


export function generateTds(count: number) {
  let tds = [];
  for (let i = 0; i < count; i++) {
    tds.push(<Table.Td key={i}></Table.Td>);
  }
  return tds;
}

export function serializeData(data: string): string {
  if (isDateString(data)) {
    const date = new Date(data);
    return date.toLocaleDateString();
  }

  if (!isNaN(+data)) {
    return withThousandSeparator(data)
  }

  return data;

}