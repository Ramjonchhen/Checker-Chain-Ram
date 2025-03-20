import styled from "styled-components"

export const StyledIDODescription = styled.div`
  font-family: Poppins;
  h1 {
    color: #084cb7;
    font-size: 30px;
    line-height: 45px;
    font-weight: 600;
    margin: 0px;
  }
  ul {
    padding: 0px;
    margin-top: 20px;
    padding-left: 10px;
    list-style: none;
    li {
      font-family: Poppins;
      padding: 15px 5px;
      line-height: 30px;
      font-size: 18px;
      display: flex;
      align-items: center;
      color: #1c1c1c;
    }
  }
`
export const LeaderboardSection = styled.div`
  font-family: Poppins;
  h4 {
    color: #084cb7;
    font-size: 30px;
    line-height: 45px;
    font-weight: 600;
    margin: 0px;
  }
  .table-badge{
    font-weight:400;
    font-size:12px;
    background:transparent !important;
    color:#084cb7;
    border:1px solid #084cb7;

  }
  .table-wrapper {
    height: 600px;
    overflow-y: scroll;
    .table {
      width: 100%;
      font-size: 16px;
      thead {
        position: sticky;
        top: 0;
        background: #edeef0;
        tr {
          th {
            background: #edeef0;
            padding: 15px 10px;
            border: 0px;
            font-weight: 500;
            font-size: 14px;
          }
        }
      }
      tbody {
        width: 100%;

        tr {
          td {
            padding: 15px 10px;
          }
        }
      }
    }
  }
  .table-wrapper::-webkit-scrollbar {
    width: 10px;
  }

  .table-wrapper::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  .table-wrapper::-webkit-scrollbar-thumb {
    background: #bababa;
    border-radius: 20px;
  }

  .table-wrapper::-webkit-scrollbar-thumb:hover {
    background: #bababa;
  }
  .accordion-flush {
    font-family: Poppins !important;
    .accordion-item {
      margin: 10px 0px;
      border: 1px solid #edeef0;
      border-radius: 10px;
      background: transparent;
      min-height: 80px;
    }
    .accordion-header {
      outline: 0px !important;
      font-size: 18px !important;
      box-shadow: none !important;
      padding-top: 10px;
    }
    .accordion-body {
      font-size: 16px;
      
    }
    .accordion-button:not(.collapsed) {
      color: #084cb7;
      font-weight: 500;
    }
    .accordion-button {
      background: transparent;
      outline: 0px !important;
      box-shadow: none !important;
      &:after {
        background-image: url("/plus.png");
      }
    }
  }
`
