import Alert, { AlertProps } from '@mui/material/Alert';
import { FC } from 'react';

export const FormAlert: FC<AlertProps> = (props: AlertProps) => {
  return (
    <Alert
      sx={{
        display: 'inline-flex',
        whiteSpace: 'break-spaces',
        width: '100%',
        my: 1,
        py: 0.25,
        px: 1.5,
      }}
      variant="filled"
      {...props}
    />
  );
};
