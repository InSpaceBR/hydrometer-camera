import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import styled from 'styled-components';

import colors from '../styles';

export const StyledButton = styled(Button)`
  position: relative;

  && {
    background-color: ${colors.primaryColor};
    color: ${colors.white};
    border-radius: 25px;
    padding: 12px 0;
    max-width: 240px;
    width: 100%;
  }

  &&:hover {
    background-color: ${colors.primaryColor};
    -webkit-box-shadow: 0px 3px 10px ${colors.buttonShadow};
    -moz-box-shadow: 0px 3px 10px ${colors.buttonShadow};
    box-shadow: 0px 3px 10px ${colors.buttonShadow};
  }

  &&:disabled {
    color: ${colors.white};
    background-color: ${colors.buttonDisabled};
  }
`;

export const StyledCircularProgress = styled(CircularProgress)`
  position: absolute;
  right: 10px;
`;
