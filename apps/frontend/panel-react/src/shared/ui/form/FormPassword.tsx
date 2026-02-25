import { FC, useState } from 'react';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput, { OutlinedInputProps } from '@mui/material/OutlinedInput';

export const FormPassword: FC<OutlinedInputProps & { helperText?: string }> = ({
  helperText,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormControl
      variant="outlined"
      fullWidth
      margin="normal"
      size="small"
      sx={{ my: 1 }}
    >
      <InputLabel htmlFor={props.id} color={props.color} error={props.error}>
        {props.label}
        {props.required && ' *'}
      </InputLabel>
      <OutlinedInput
        {...props}
        type={showPassword ? 'text' : 'password'}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={() => setShowPassword((show) => !show)}
              onMouseDown={(event) => event.preventDefault()}
              size="small"
              edge="end"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }
        label={props.label}
      />
      {helperText && (
        <FormHelperText error={props.error}>{helperText}</FormHelperText>
      )}
    </FormControl>
  );
};
