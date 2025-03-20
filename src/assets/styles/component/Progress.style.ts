import styled from "styled-components"
import { colors } from "../../theme/theme"

export const StyledPrimaryProgress = styled.div`
  width: 80%;
  margin: auto;
  height: 22px;
  border-radius: 10px;
  background: ${colors.black1};
  position: relative;
  box-shadow: 0px 4px 10px rgba(133, 133, 133, 0.25);
  &:after {
    content: "";
    position: absolute;
    height: 100%;
    border-radius: 10px;
    width: $ {(props: any) => props?.$percentage || 0}%;
    background: linear-gradient(
      90deg,
      #2f3188 0%,
      rgba(47, 49, 136, 0.37) 100%
    );
  }
`
