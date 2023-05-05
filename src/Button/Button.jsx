import React from 'react';

import { StyledButton, StyledCircularProgress } from './styles';

const Button = (props) => {
  const { children, loading, disabled } = props;

  return (
    <StyledButton variant="contained" disabled={disabled || loading} {...props}>
      {children}
      {loading && <StyledCircularProgress color="white" size={25} />}
    </StyledButton>
  );
};

export default Button;
