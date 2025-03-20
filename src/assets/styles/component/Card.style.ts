import { colors } from "assets/theme/theme";
import styled from "styled-components";

export const StyledPrimaryCard = styled.div`
  height: 370px;
  border: 1px solid red;
  width: 100%;
  border: 1px solid ${colors.grey5};
  box-shadow: 0px 15px 50px rgba(193, 193, 193, 0.25);
  margin: 0px 10px;
  border-radius: 15px;
  .card__header {
    border-radius: 15px 15px 0px 0px;
    height: 60px;
    display: flex;
    align-items: center;
    padding-left: 20px;
    font-family: Poppins;
    font-weight: 500;
    background: ${colors.primary};
    color: ${colors.light};
  }
  .card__body {
    height: calc(100% - 60px);
    background: ${colors.light};
    border-radius: 15px;
  }
`
export const StyledRewardCard = styled.div`
  min-height: calc(100vh - 140px);
  padding: 20px;
  border-radius: 10px !important;
  box-shadow: none;
  background: white;
  border: 0px;
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
  .card__title {
    font-family: Poppins;
    padding: 10px 20px;
    font-size: 28px;
    font-weight: 600;
    margin: 0px;
  }
  .card__description {
    font-size: 14px;
    color: ${colors.grey7};
    font-family: Poppins;
  }
`

export const StyledStakingCard = styled.div`
  display: flex;
  padding: 12px 10px;

  align-items: center;
  font-family: Poppins;
  background: linear-gradient(180.29deg, #084cb7 20%, #291cb4 80%);
  border-radius: 10px;
  color: white;
  .staking__image {
    height: 40px;
    width: 40px;
    background: white;
    display: flex;
    border-radius: 30%;
    justify-content: center;
    align-items: center;
  }
  .staking__details {
    h5 {
      font-size: 20px;
      margin: 0px;
      font-weight: 500;
    }
    h6 {
      font-size: 12px;
      margin: 2px;
      font-weight: 400;
    }
  }
`

export const StyledAddStakeCard = styled.div`
  height: 100%;
  padding: 25px;
  font-family: 'Poppins', sans-serif;
  border: 0px;
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
  color: ${colors.darkPrimary};
  @media screen and (max-width: 640px) {
    margin-top: 20px !important;
    margin-bottom: 20px !important;
  }
  border-radius: 20px;
  h1 {
    font-size: 26px;
    font-weight: 600;
    position: relative;
    color: ${colors.primary};
  }
  p {
    font-size: 14px;
    margin: 0px;
    margin-bottom: 5px;
    font-weight: 300;
  }
  .add__stake__form {
    display: flex;
    @media screen and (max-width: 640px) {
      display: block;
    }
    width: 100%;
    justify-content: space-between;
    .add__stake__input {
      width: 69%;
      @media screen and (max-width: 640px) {
        width: 100%;
      }
      position:relative;
      height: 50px;
      .max-button{
        position:absolute;
        right:10px;
        height:22px;
        display:flex;
        align-items:center;
        justify-content:center;
        border-radius:10px;
        width:50px;
        background:#dadada;
        top:15px;
        font-size:12px;
        font-weight:400;
        cursor:pointer;

      }
      input {
        width: 100%;
        height: 100%;
        padding-left: 10px;
        font-size: 16px;
        border: 1px solid #cacaca;
          outline: 0px;
        }
        &:disabled {
          cursor: not-allowed;
          opacity: 0.8;
        }
      }
      small {
        color: red;
      }
      .error {
        border: 1px solid red;
      }
    }
    .add__stake__button {
      width: 30%;
      @media screen and (max-width: 640px) {
        width: 100%;
      }
      button {
        height: 100%;
        width: 100%;
        background: ${colors.primary};
        border-radius: 5px;
        border: 0px;
        color: ${colors.light};
        font-weight: 600;
        @media screen and (max-width: 640px) {
          height: 50px;
          margin-top: 10px;
        }
        &:disabled {
          cursor: not-allowed;
          opacity: 0.8;
        }
      }
    }
  }
`
export const StyledUnstakeCard = styled.div`
  height: 100%;
  font-family: 'Poppins', sans-serif;
  border: 0px;
  width: 100%;

  // color: ${colors.darkPrimary};
  border-radius: 20px;
  h1 {
    font-size: 26px;
    font-weight: 600;
    margin: 2px 0px;
  }
  p {
    font-size: 14px;
    margin: 0px;
    margin-bottom: 15px;
    font-weight: 300;
  }
  .add__stake__form {
    .add__stake__input {
      width: 100%;
      height: 50px;
      input {
        width: 100%;
        height: 100%;
        padding-left: 10px;
        font-size: 20px;
        border: 1px solid #cacaca;
        border-radius: 5px;
        &:focus {
          outline: 0px;
        }
      }
      .max__amount {
        cursor: pointer;
      }
      small {
        color: red;
      }
      .error {
        border: 1px solid red;
      }
    }
    .add__stake__button {
      width: 100%;
      button {
        height: 50px;
        width: 100%;
        background: ${colors.primary};
        border-radius: 5px;
        border: 0px;
        color: ${colors.light};
        font-weight: 600;
        &:disabled {
          cursor: not-allowed;
          opacity: 0.8;
        }
      }
    }
  }
`
export const StakingDisplayCard = styled.div<{
  color: string,
  textColor?: string,
  textWeight?: string,
  progressColor?: string,
}>`
  height: 250px;
  border: 1px solid red;
  width: 100%;
  background: #fff;
  padding: 20px;
  border: 1px solid ${colors.grey5};
  box-shadow: 0px 15px 50px rgba(193, 193, 193, 0.25);
  margin: 0px 10px;
    @media screen and (max-width: 640px) {
 margin: 0px;
 margin-top:10px !important;
  }
  font-family: 'Poppins', sans-serif;
  border-radius: 15px;
  h1 {
    font-size: 26px;
    font-weight: 600;
    position: relative;
    color: ${(props) => props.color || "black"};
    &:after {
      content: "";
      width: 12%;
      height: 5px;
      position: absolute;
       bottom: -6px;
      border-radius:20px;
      left: 0px;
      background: ${(props) => props.color || "black"};
    }
  }
  .staking__portfolio {
    .staking__portfolio__row {
      margin-top: 30px;
      h6 {
        font-size: 13px;
        font-weight: 400;
        color:#1c1c1c;
      }
        i {
          color: ${(props) => props.color || "black"};
        }
        h5 {
          font-size: 18px;
          color: ${(props) => props.textColor || "black"};
          font-weight: ${(props) => props.textWeight || "500"};
        }
      }
      .staking__row__button{
          font-size:12px;
          border: 1px solid #bababa;
          padding:0px 5px;
          width:80px;
          height:20px;
          color:#bababa;
          cursor:pointer;
            &:disabled {
          cursor: not-allowed;
          opacity: 0.8;
        }
      }
      button {
        height: 50px;
        border: 0px;
        background: transparent;
        color:${colors.primary};
        border:1px solid ${colors.primary};
        width: 100%;
        border-radius: 10px;
        font-weight:600;
        font-size:14px;
        outline:0px !important;
        box-shadow:none !important;
        &:focus,&:hover{
          outline:0px !important;
                  box-shadow:none !important;

        }
      }
      .progress{
        height:20px;
        .progress-bar{
          background:${(props) => props.progressColor};
        }
      }
    }
  }
`

export const StyledAddIDOCard = styled.div<{
  height?: string
}>`
  min-height: ${(props) => props.height || "360px"};
  border-radius: 10px !important;
  box-shadow: none;
  background: white;
  border: 0px;
  font-family: Poppins;
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
  .max_button {
    cursor: pointer;
    font-size: 12px;
  }
  .nav {
    padding: 20px;
    .nav-link {
      border: 0px;
      font-size: 18px;
      color: #cacaca;
      padding: 0px 10px;
      font-weight: 500;
    }

    .active {
      color: ${colors.primary};
      position: relative;
      &:after {
        content: "";
        position: absolute;
        height: 3px;
        bottom: -5px;
        left: 10px;
        width: 80%;
        background: red;
      }
    }
  }
  .tickets-row {
    h6 {
      font-size: 12px;
      font-weight: 400;
    }
    h5 {
      font-weight: 500;
      font-size: 16px;
      span {
        font-size: 12px;
        font-weight: 300;
        cursor: pointer;
        padding-left: 5px;
        text-decoration: underline;
      }
    }
    button {
      height: 45px;
      width: 100%;
      background: ${colors.primary};
      border-radius: 5px;
      border: 0px;
      color: ${colors.light};
      font-weight: 500;
      @media screen and (max-width: 640px) {
        height: 50px;
        margin-top: 10px;
      }
      &:disabled {
        cursor: not-allowed;
        opacity: 0.8;
      }
    }
    .card {
      height: 50px;
      display: flex;
      background: #eaeaea;
      border: 0px;
      justify-content: center;
      align-items: center;
    }
  }
  .apply-section {
    input {
      background: #ebf0f3;
      height: 45px !important;
      color: #696969;
      margin: 10px 0px;
      border: 0px;
      font-size: 16px;
      font-family: Poppins;
      &:focus,
      &:active {
        outline: 0px !important;
        box-shadow: none;
      }
    }
    .error {
      &:focus {
        outline: 1px solid red !important;
      }
      outline: 1px solid red;
    }
    .error-message {
      height: 14px !important;
      font-size: 12px;
    }
    .egld-input {
      position: relative;
      height: 100%;
      width: 100%;
    }
    button {
      height: 45px;
      width: 100%;
      background: ${colors.primary};
      border-radius: 5px;
      border: 0px;
      color: ${colors.light};
      font-weight: 500;
      @media screen and (max-width: 640px) {
        height: 50px;
        margin-top: 10px;
      }
      &:disabled {
        cursor: not-allowed;
        opacity: 0.8;
      }
    }
    .egld-card {
      width: 90px;
      border-radius: 10px;
      border: none;
      height: 35px;
      font-family: Poppins;
      text-align: center;
      position: absolute;
      right: 20px;
      font-size: 12px;
      flex-direction: row;
      font-weight: 500;
      display: flex;
      justify-content: center;
      align-items: center;
      top: 5px;
    }
  }
  .ambassador-info {
    padding: 20px;
    h6 {
      color: #1c1c1c;
      font-weight: 400;
      font-size: 14px;
    }
    .banner__contents__timer {
      width: 100%;
      margin-top: 10px;
      height: 70px;
      display: flex;
      .timer__divider {
        width: 5%;
        color: white;
        font-size: 2rem;
        display: flex;
        margin-top: 3%;
        justify-content: center;
      }
      .timer__card {
        width: 15%;
        height: 100%;
        position: relative;
        .timer__card__time {
          height: 73%;
          border-radius: 5px 5px 0px 0px;
          background: #084cb7;
          color: white;
          font-family: 'Poppins', sans-serif;
          font-size: 35px;
          display: flex;
          font-weight: 500;
          justify-content: center;
          align-items: center;
        }
        .timer__card__footer {
          height: 27%;
          font-family: 'Poppins', sans-serif;
          font-size: 0.7rem;
          background: #084cb7;
          color: white;
          padding-top: 5px;
          display: flex;
          justify-content: center;
          align-items: center;
          padding-bottom: 5px;
          border-top: 1px solid #fff;
          border-radius: 0px 0px 5px 5px;
          position: relative;
        }
      }
    }
  }
`
export const StyledLiquidityCard = styled.div`
  min-height: 650px;
  padding: 20px;
  margin-bottom: 30px !important;
  font-family: Poppins;
  background: white !imporant;
  width: 100%;
  border: 1px solid ${colors.grey5};
  box-shadow: 0px 15px 50px rgba(193, 193, 193, 0.25);
  margin: 0px 10px;
  border-radius: 15px;
  .card__title {
    font-family: Poppins;
    padding: 10px 20px;
    font-size: 28px;
    font-weight: 600;
    margin: 0px;
  }
  .border-none {
    border: none !important;
  }
  .info-card {
    height: 150px;
    padding: 30px;
    width: 100%;
    border: 0px;
    border-radius: 0px;
    border-right: 1px solid grey;
    @media screen and (max-width: 994px) {
      border-right: 0px;
    }

    background: transparent;
    .icon {
      i {
        font-size: 35px;
        margin-bottom: 15px;
      }
    }
    h5 {
      font-size: 30px;
      font-weight: 500;
    }
    h6 {
      font-size: 12px;
      margin-bottom: 5px;
      font-weight: 300;
    }
  }
  .card-row {
    h5 {
      font-size: 16px;
      font-weight: 500;
      margin-top: 2px;
    }
    h6 {
      font-size: 12px;
      margin-bottom: 5px;
      font-weight: 300;
      @media screen and (max-width: 994px) {
        margin-top: 20px;
      }
    }
  }
  .pool-card {
    min-height: 140px;
    border-radius: 10px;
    @media screen and (max-width: 994px) {
      display: block !important;
    }
    border: 0px;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  }
  .listed-logo {
    height: 130px;
    margin: 10px;
    width: 100%;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: rgba(0, 0, 0, 0.02) 0px 1px 3px 0px,
      rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;
    cursor: pointer;
  }
  .alert {
    i {
      cursor: pointer;
    }
    overflow-wrap: break-word;
    width: 100%;
    button {
      background: transparent;
      border: none;
      font-size: 18px;
      margin-left: 4px;
      border-radius: 10px;
      box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    }
  }
`
