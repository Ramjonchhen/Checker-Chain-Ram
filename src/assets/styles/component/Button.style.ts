import styled from "styled-components"
import { colors } from "assets/theme/theme"

export const StyledPrimaryButton = styled.button`
  font-family: 'Poppins', sans-serif;
  width:150px;
  background: ${colors.primary};
  cursor:disabled;
  border:0px;
  color:${colors.light};
  border-radius: 6px;
  padding:10px 15px;
  font-size:0.9rem;
  &:hover{
    background:transparent !important;
    border:1px solid ${colors.primary};
    color:${colors.primary};
    transition:0.2s all;
  }
  &:disabled{
    opacity:0.5;
    background:${colors.primary}!important;
    color:${colors.light} !important;
    border:none !important;
  }
  
`
export const StyledSecondaryButton = styled.button`
  font-family: 'Poppins', sans-serif;
  margin-top:5px;
  background: ${colors.primary};
  color:${colors.light};
  box-shadow: 0px 10px 25px rgba(0, 52, 185, 0.2);
  border-radius: 8px;
  font-size:1rem;
   cursor:pointer;
  padding:10px 20px;
  width:100%;
  &[disabled] {
    opacity: 0.5;
  }
`
