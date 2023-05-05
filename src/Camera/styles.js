import FormHelperText from "@material-ui/core/FormHelperText";
import styled from "styled-components";

export const CameraWrapper = styled.div`
  height: 100%;
  width: 100%;
  padding: 12px 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const StyledFormHelperText = styled(FormHelperText)`
  height: 1rem;
  margin-left: 0 !important;
`;
