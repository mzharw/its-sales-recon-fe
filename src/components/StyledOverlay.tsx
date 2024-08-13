import { LoadingOverlay } from '@mantine/core';

export default function StyledOverlay({ visibility = false }: { visibility: boolean }) {
  return (
    <LoadingOverlay visible={visibility} overlayProps={{opacity: 0}} transitionProps={{ transition: 'fade' }} />
  );
}