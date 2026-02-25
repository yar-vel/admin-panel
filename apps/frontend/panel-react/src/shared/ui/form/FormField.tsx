import TextField, { TextFieldProps } from '@mui/material/TextField';
import { FC } from 'react';

export const FormField: FC<TextFieldProps> = (props) => {
  return (
    <TextField
      fullWidth
      margin="normal"
      size="small"
      sx={{ my: 1 }}
      {...props}
    />
  );
};
