import { colors } from "assets/theme/theme"
import styled from "styled-components"

export const StakingHeader = styled.div`
  background: url("/staking-bg.png") no-repeat center;
  min-height: 190px;
  background-size: 100% 100%;
  color: white;
  padding: 20px 30px;
  @media screen and (max-width: 994px) {
    background: #2318a1;
    border-radius: 20px;
    padding: 10px;
    padding-bottom: 30px;
  }
  font-family: Poppins;
  .staking__header__left {
    display: flex;
    height: 100%;
    flex-direction: column;
    justify-content: space-around;
    .staking__header__amount {
      font-size: 20px;
    }
  }
  .staking__header__right {
    height: 100%;
    .staking__apr {
      text-align: center;
      @media screen and (max-width: 994px) {
        text-align: left;
      }
      @media screen and (max-width: 640px) {
        margin-top: 20px;
      }
      h4 {
        font-size: 28px;
        margin: 0px;
        height: 80px;
        display: flex;
        align-items: center;
      }
      h6 {
        font-size: 16px;
        font-weight: 400;
        margin: 0px;
          display: flex;
        align-items: center;
      }
    }
    .staking__timer {
      h6 {
        font-size: 16px;
        font-weight: 400;
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
          width: 22%;
          height: 100%;
          position: relative;
          &:after {
            content: "•";
            position: absolute;
            top: -5px;
            right: 5px;
            font-size: 1.3rem;
            color: ${colors.yellow};
          }

          .timer__card__time {
            height: 73%;
            border-radius: 5px 5px 0px 0px;
            background: ${colors.grey4};
            color: ${colors.darkPrimary};
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
            background: ${colors.darkPrimary};
            color: white;
            display: flex;
            justify-content: center;
            align-items: center;
            padding-bottom: 5px;
            border-radius: 0px 0px 5px 5px;
            position: relative;
            &:after {
              content: "";
              height: 3px;
              width: 20px;
              background: white;
              border-radius: 5px 5px 0px 0px;
              color: #fafafa;
              position: absolute;
              font-weight: 600;
              bottom: 0px;
              left: 35%;
            }
          }
        }
      }
    }
  }
`
