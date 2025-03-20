import { colors } from "assets/theme/theme"
import styled from "styled-components"

export const Navbar = styled.div`
  .bg-light {
    background-color: #fff !important;
  }

  .navbar__logo {
    display: flex;
    align-items: center;
    @media screen and (max-width: 690px) {
      .icon {
        height: 30px;
      }
      .navbar__text {
        width: 140px;
        height: 40px;
      }
    }
  }
  .navbar-nav {
    display: flex;
    align-items: center;
    .nav-item {
      padding: 0px 20px;
       @media screen and (max-width: 640px) {
        padding: 10px 0px;
      }
      a {
        font-family: Poppins;
        cursor: pointer;
        font-size: 14px;
        font-weight: 400;
        text-decoration: none;
        color: black;
        &:hover {
          color: ${colors.primary};
          transition: 0.2s all;
        }
      }
      .active {
        color: #f45b69;
        font-weight: 500;
        font-size: 15px;
      }
    }
  }
`
export const Banner = styled.div`
  margin-top: 0px;
  min-height: 340px;
  padding:15px 0px;
  font-family: Poppins;
  background: ${colors.primary};
  .banner {
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin: auto;
    .banner__image{
        width:40%;
        text-align:center;
        margin-top:1.5em;
             @media screen and  (max-width:690px){
          display:none;
        }
    }
    .banner__contents{
        width:45%;
        @media screen and (max-width:690px){
          width:100%;
        }
        height:100%;
        .banner__contents__title {
            h1 {
                font-family: Poppins;
                font-weight: 600;
                font-size: 1.2rem;
                margin: 15px 0px;
                color: ${colors.light};
                letter-spacing: 0.05em;
            }
            }
            .banner__contents__description {
            h4 {
                font-family: Poppins;
                font-weight: normal;
                margin: 15px 0px;
                font-size: 1rem;
                color: ${colors.light};
                letter-spacing: 0.05em;
            }
            }
 
        .banner__contents__timer {
        width: 100%;
        margin-top:10px;
        height: 90px;
        display:flex;
        .timer__divider{
            width:5%;
                color:white;
                font-size:2rem;
                display:flex;
                margin-top:3%;
                justify-content:center;
            }
            .timer__card {
                width: 20%;
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
                border-radius:5px 5px 0px 0px;
                background: ${colors.grey4};
                font-family: 'Poppins', sans-serif;
                font-size: 3rem;
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
                color: ${colors.light};
                display: flex;
                justify-content: center;
                align-items: center;
                padding-bottom:5px;
                border-radius:0px 0px 5px 5px;
                position:relative;
                &:after{
                    content:"";
                    height:3px;
                    width:20px;
                    background:white;
                    border-radius:5px 5px 0px 0px;
                    color:${colors.grey1};
                    position:absolute;
                    font-weight:600;
                    bottom:0px;
                    left:20%:
                }
                }
      }
     
    }
     .banner__contents__details{
          color:white;
          border-top:1px solid ${colors.blue1};
          border-bottom:1px solid ${colors.blue1};
          padding:5px 0px;
          margin-top:30px;
          display:flex;
          .details__wrapper{
              width:33.33%;
              text-align:center;
              .details__number{
                  font-family:Poppins;
                  font-weight:500;
                  font-size:1.4rem;
              }
              .details__title{
                   font-family:Poppins;
                  font-weight:300;
                  font-size:0.7rem;
                  margin:2px 0px;
              }
          }
      }
    }
    
  }
`

export const PresaleTimeline = styled.div`
  padding: 80px 0px;

  @media screen and (max-width: 690px) {
    padding: 20px;
  }
  width: 80%;
  margin: auto;
  .presale__timeline {
    height: 1px;
    background: ${colors.grey6};
    position: relative;
    width: 100%;
    .presale__round {
      position: absolute;
      background: ${colors.light};
      height: 40px;
      cursor: pointer;
      max-width: 250px;
      display: flex;
      justify-content: center;
      align-items: center;
      top: -20px;
      .presale__round__number {
        height: 35px;
        width: 35px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
        font-family: Poppins;
        border: 1px solid ${colors.grey7};
        background: ${colors.light};
        color: ${colors.grey7};
      }
      .presale__round__number__active {
        border: 2px solid ${colors.primary};
        font-weight: 500;
        background: ${colors.light};
        color: ${colors.primary};
      }

      .presale__round__name {
        font-size: 1rem;
        font-family: Poppins;
        padding-left: 10px;
        color: ${colors.grey7};
      }
      .presale__round__name__active {
        color: ${colors.primary} !important;
        font-weight: 500;
      }
    }
    .presale_round1 {
      left: 0%;
    }
    .presale_round2 {
      left: 30%;
    }
    .presale_round3 {
      left: 60%;
    }
    .presale_round4 {
      right: 0%;
    }
  }
`
export const Presale = styled.div`
  height: 360px;
  margin-bottom: 100px;
  background: url("/Background.png") no-repeat;
  background-size: 100%;
  .presale__details {
    display: flex;
    justify-content: space-between;
    margin: auto;
  }
     .presale__tokenomics{
      padding:20px;
      display:flex;
      .presale__tokenomics__chart{
        width:70%;
      }
      .presale__tokenomics__label{
        overflow-y:scroll;
        position:relative;
        height:220px;
        width:30%;
          padding:0px;
          margin:0px;
       
        li{
           list-style:none;
           font-size:0.6rem;
           font-family:Poppins;
          margin:0px;
          padding:0px;
          display:flex;
          align-items:center;
          margin:5px 0px;
        }
      }
    }
     .presale__expand{
          text-align:right;
          padding-right:10px;
          font-size:0.8rem;
        }
        .presale__link{
         text-align:right;
          padding-right:10px;
          font-size:0.8rem;
          i{
            cursor:pointer;
          }
        }
  .round__info {
    width: 100%;
    .round__info__title {
      font-family: Poppins;
      color: #000;
      font-size: 0.8rem;
      text-align: center;
      padding-top: 20px;
    }
    .round__info__price {
      font-family: Poppins;
      font-size: 3rem;
      text-align: center;
      margin: 5px 0px;
      color: ${colors.primary};
      font-weight: 500;
      span {
        font-size: 1rem;
      }
    }
    .round__info__presale {
      font-family: Poppins;
      color: #000;
      font-size: 0.8rem;
      text-align: center;
      background: ${colors.grey3};
      padding: 10px 0px;
      span {
        font-family: Poppins;
        color: #000;
        font-weight: 600;
        padding-left: 10px;
      }
    }
    .round__info__progress{
        padding-top:60px;
       .progress__text{
           text-align:center;
           margin:10px 0px;
           font-family:Poppins;
           font-size:0.8rem;
           color:${colors.black1};
       }
    }
 
    }
 
    .buy__tokens{
        .form__input{
            padding:10px 15px;
            .form__input__label{
                font-family:Poppins;
                text-transform:uppercase;
                font-size:0.9rem;
                margin-bottom:5px;
            }
            .form__input__field{
                position:relative;
                input{
                  width:100%;
                height:50px;
                border-radius:15px;
                  border:0px;
                font-family:Poppins;
                font-size:1.3rem;
                padding-left:10px;
                background:${colors.grey3};
             }
             .error{
                 border:1px solid red !important;
                 &:active,&:focus{
                  outline:1px solid red !important;

                 }
             }
          
            }
            input::placeholder{
                 font-family:Poppins;
                 font-size:1.3rem;
                 padding-left:10px;

            }
            .form__input__token{
                position:absolute;
                right:5px;
                top:7px;
                display:flex;
                align-items:center;
                justify-content:center;
                width:100px;
                border-radius:15px;
                font-family:Poppins;
                font-weight:500;
                background:#FCFCFC;
                height:40px;
                z-index:999;
            }
            .form__input__button{
                padding:10px 0px;
            }
        }
    }
  }
`
