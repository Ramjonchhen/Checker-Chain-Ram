import styled from "styled-components"
export const StyledTable = styled.table`
  font-family: Poppins;
  border-collapse: separate;
    border-spacing:20px 15px;
  thead {
    tr {
      th {
        font-weight: 500;
        border-bottom-color: transparent !important;
        padding-bottom: 10px !important;
      }
    }
  }
  a{
    color:black;
  }
  .badge{
    color:black;
    border:1px solid #1c1c1c;
    font-weight:300;
    font-size:8pxs;
    padding:6px 15px;
    border-radius:10px;
  }
  .badge-success{
    color:#299c39 !important;
    border:1px solid #299c39;
  }
   .badge-error{
    color:#522994 !important;
    border:1px solid #522994;
  }
  tbody {
    overflow: auto;
    padding-top: 10px;
    tr {
      height: 90px;
      border-radius: 10px;
      vertical-align: middle;
      background: transparent !important;
      box-shadow: rgba(0, 0, 0, 0.02) 0px 1px 3px 0px,
        rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;
      td {
        border: 0px;
        background: transparent !important;
      }
    }
  }
`
