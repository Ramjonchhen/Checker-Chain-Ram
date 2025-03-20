/* eslint-disable @next/next/no-img-element */
import { CheckerLogo, ScrollDownIcon } from "assets/icons"
import {
  FloatingLanding,
  LandingLeftImage,
  LandingRightImage,
  WhyChooseUs,
  WhyChooseUsSmall
} from "assets/images"
import React from "react"
import * as Icons from "assets/icons"
import { twMerge } from "tailwind-merge"
import { useProductStore } from "stores/product"
import { getBaseBackendImageUrl } from "utils"
import { useEffect } from "react"
import CreateProductImage from "assets/images/products/CreateProduct.png"
import DiscussionImage from "assets/images/products/Discussion.png"
import NoticeImage from "assets/images/products/Notice.png"
import ReviewImage from "assets/images/products/Review.png"
import { Button } from "components/button"
import { useRouter } from "next/router"

export const Unauthorized = () => {
  const { trending } = useProductStore()
  const router = useRouter()
  const stickyImageRef = React.useRef<HTMLDivElement>(null)
  const firstSectionRef = React.useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = React.useState(0)
  useEffect(() => {
    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const handleScroll = () => {
    if (stickyImageRef.current) {
      const element = stickyImageRef.current
      const viewportHeight = window.innerHeight
      const scrollTop = window.scrollY
      const elementOffsetTop = stickyImageRef.current.offsetTop
      const elementHeight = element.offsetHeight
      // Calculate percentage of the element that's been seen
      const distance = scrollTop + viewportHeight - elementOffsetTop
      const percentage = distance / ((viewportHeight + elementHeight) / 100)

      // get percentage of the image that is visible
      // if the image is 50% visible, then we want to make it sticky

      if (percentage > 52) {
        setActiveIndex(3)
      } else if (percentage > 50) {
        setActiveIndex(2)
      } else if (percentage > 40) {
        setActiveIndex(1)
      } else if (percentage > 0) {
        setActiveIndex(0)
      }
    }
  }

  let products = trending
    .filter((product) => product.logo)
    .map((product) => product.logo)
  products = [...products, ...products, ...products]

  return (
    <div className="flex flex-col gap-6 items-center w-full 3xl:w-[1680px] 2xl:mx-auto">
      <section ref={firstSectionRef} className="flex gap-6 justify-between sm:mx-7 sm:px-8 m-8">
        <div className="hidden lg:flex animate__animated animate__fadeInLeft">
          <img
            alt="landing"
            src={LandingRightImage.src}
            className="object-contain w-[380px] xl:w-[469px] xl:h-[641px]"
          />
        </div>
        <div className="flex flex-col sm:justify-center items-center gap-y-4 animate__animated animate__fadeInUp">
          <CheckerLogo />
          <div className="flex gap-2 text-neutral-600 leading-6 text-lg">
            <span>Post .</span>
            <span>Review .</span>
            <span>Earn</span>
          </div>
          <div
            className="gap-4 flex flex-col items-center floating cursor-pointer"
            onClick={() => {
              if(firstSectionRef.current){
                // get first section height
                const firstSectionHeight = firstSectionRef.current.offsetHeight
                // scroll below the first section

                window.scrollTo({
                  top: firstSectionHeight + 64,
                  behavior: "smooth"
                })
              }
            }}
          >
            <div className="flex gap-2 discussion-text-gradient text-center text-[48px] leading-[64px] lg:leading-[50px] lg:text-[44px] xl:leading-[76px] xl:text-[60px] font-extrabold uppercase">
              Scroll to <br />
              find the <br />
              next big <br />
              project in <br />
              web3
            </div>
            <ScrollDownIcon />
          </div>
        </div>
        <div className="hidden lg:flex animate__animated animate__fadeInRight">
          <img
            alt="landing"
            src={LandingLeftImage.src}
            className="object-contain w-[380px] xl:w-[477px] xl:h-[546px]"
          />
        </div>
      </section>
      <section className="overflow-x-hidden">
        <div className="w-full mt-10">
          <div
            data-animate="animate__animated animate__fadeInLeft"
            className="animate-once flex flex-col text-center w-full font-[700] text-[48px] lg:text-[60px] leading-[48px] lg:leading-[58px]"
            style={{
              animationDuration: "2s"
            }}
          >
            <span className="text-neutral-600">What’s</span>
            <span className="text-primary">Trending</span>
          </div>
          <div
            data-animate="animate__animated animate__fadeInRight overflow-hidden"
            className="animate-once"
            style={{
              animationDuration: "2s"
            }}
          >
            <div className="my-12 flex flex-col gap-4 animate-marquee whitespace-nowrap">
              <div className="flex gap-4">
                {products
                  .sort(() => Math.random() - 0.5)
                  .map((logo, index) => (
                    <img
                      key={index}
                      alt="trending"
                      src={getBaseBackendImageUrl(logo, "other")}
                      className="w-[64px] h-[64px] md:w-[84px] md:h-[84px] lg:w-[104px] lg:h-[104px] object-contain rounded-lg"
                    />
                  ))}
              </div>
              <div className="flex gap-4 -ml-[52px]">
                {products
                  .sort(() => Math.random() - 0.5)
                  .map((logo, index) => (
                    <img
                      key={index}
                      alt="trending"
                      src={getBaseBackendImageUrl(logo, "other")}
                      className="w-[64px] h-[64px] md:w-[84px] md:h-[84px] lg:w-[104px] lg:h-[104px] object-contain rounded-lg"
                    />
                  ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="flex justify-between items-center w-full 2xl:w-[1311px] px-10 3xl:px-0">
        <div
          data-animate="animate__animated animate__fadeInUp"
          className="animate-once flex flex-col min-w-[160px] pr-4 sm:pr-0 sm:flex-row gap-2 items-center"
        >
          <img
            alt="landing"
            src={FloatingLanding.src}
            className="object-cover"
          />
          <div className="leading-6 text-[20px] font-semibold">
            Create Product. <br />
            Get Reviewed. <br />
            Earn Rewards <br />
            <hr className="bg-neutral-700 h-1 mt-3" />
          </div>
        </div>
        <div className="flex flex-col lg:flex-row items-center divide-x-2 divide-separator">
          {[
            {
              icon: <Icons.ProjectIcon className="w-8 h-8" />,
              title: "Total Project Registered",
              value: `10+`
            },
            {
              icon: <Icons.ReviewStarIcon className="w-8 h-8" />,
              title: "Total Reviews Accumulated",
              value: "100+"
            },
            {
              icon: <Icons.UsersIcon className="w-8 h-8" />,
              title: "Total Users Onboarded",
              value: "25K+"
            }
          ].map((item, index) => (
            <div
              key={item.title}
              className={twMerge(
                "animate-once flex gap-x-4 pl-6 lg:pl-12 lg:pr-6"
              )}
              data-animate="animate__animated animate__fadeInUp"
              style={{
                animationDelay: `${(index + 1) * 300}ms`,
                transitionDelay: `all ${(index + 1) * 300}ms`
              }}
            >
              <div className="bg-primary-500 flex justify-center items-center text-white w-10 h-10 lg:w-14 lg:h-14 rounded-lg">
                {item.icon}
              </div>
              <div className="flex flex-col w-24">
                <span className="text-primary text-2xl leading-8 font-semibold">
                  {item.value}
                </span>
                <span className="text-neutral-900 text-xs">{item.title}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-wrap  md:mt-[80px] w-full 2xl:w-[1311px] px-10 3xl:px-0 mb-12">
        <div className="gap-y-12 lg:flex-1 flex  items-center flex-wrap flex-col justify-between">
          {[
            {
              icon: <Icons.CreateProductIcon className="w-8 h-8" />,
              title: "Create Product",
              description:
                "With CheckerChain craft your product  page and exhibit your ideas, updates and activities through the  review platform "
            },

            {
              icon: <Icons.NoticedIcon className="w-8 h-8" />,
              title: "Get Noticed",
              description:
                "Get listed on the product wall of the platform and get noticed by thousands of other users with endless engagement possibilities."
            },
            {
              icon: <Icons.ReviewStarIcon className="w-8 h-8" />,
              title: "Get Reviews",
              description:
                "Now that you are noticed, get engagements through the users to get honest and bot-free reviews to build trust, upscale, and improve your products."
            },
            {
              icon: <Icons.DiscussionIcon className="w-8 h-8" />,
              title: "Make Discussions",
              description:
                "Using our newly introduced discussion portal, users are able to share their views and gather information."
            }
          ].map((item, index) => (
            <div
              onClick={() => {
                setActiveIndex(index);
              }}
              key={item.title}
              className={twMerge(
                "flex select-none    hover:cursor-pointer px-4 py-4 rounded-sm flex-col items-start gap-y-4 lg:pl-12 pr-6 w-full lg:w-[332px] lg:ml-12",
                index === activeIndex ? "opacity-100 lg:shadow-default hover:animate-fadeIn" : "lg:opacity-50"
              )}
            >
              <div
                // slideType="slideIn"
                className="flex flex-col items-start gap-y-3"
              >
                <span className="text-neutral-900 text-2xl font-semibold">
                  {index + 1}. {item.title}
                </span>
                <span className="text-neutral-600 text-base font-normal">
                  {item.description}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex-1">
          <div
            ref={stickyImageRef}
            className="sticky top-[100px] justify-center items-center hidden lg:flex"
          >
            <img
              alt="landing"
              src={CreateProductImage.src}
              className={twMerge(
                "object-cover transition-all rounded-xl duration-500 h-[512px]",
                activeIndex === 0 ? "block" : "hidden"
              )}
            />
            <img
              alt="landing"
              src={DiscussionImage.src}
              className={twMerge(
                "object-cover transition-all rounded-xl duration-500 h-[512px]",
                activeIndex === 3 ? "block" : "hidden"
              )}
            />
            <img
              alt="landing"
              src={NoticeImage.src}
              className={twMerge(
                "object-cover transition-all rounded-xl duration-500 h-[512px]",
                activeIndex === 1 ? "block" : "hidden"
              )}
            />
            <img
              alt="landing"
              src={ReviewImage.src}
              className={twMerge(
                "object-cover transition-all rounded-xl duration-500 h-[512px]",
                activeIndex === 2 ? "block" : "hidden"
              )}
            />
          </div>
        </div>
      </section>
      <section className="bg-primary-500 gap-4 px-4 sm:px-0 w-full flex flex-col items-center justify-center text-white py-10 pb-14">
        <div className="text-[34px] sm:text-[40px] leading-[48px] font-semibold">
          What we focus on
        </div>
        <span className="text-base w-full mx-4 sm:w-6/12 text-center">
          A platform that will help you understand products better and help you
          make better decisions.
        </span>
        <div className="flex gap-[80px] flex-wrap justify-center w-full 2xl:w-[1311px] px-10 3xl:px-0 mt-12">
          {[
            {
              title: "Crypto & Blockchain",
              icon: <Icons.BlockchainIcon className="w-8 h-8" />,
              description:
                "Get insights on the latest crypto and blockchain projects and make better decisions."
            },
            {
              title: "Products & Apps",
              icon: <Icons.ProductIcon className="w-8 h-8" />,
              description:
                "Better understand different products and engage with the community to make wise decisions."
            },
            {
              title: "Movies & Games",
              icon: <Icons.MoviesIcon className="w-8 h-8" />,
              description:
                "Review your favorite movies and games and get honest feedback from the community."
            },
            {
              title: "Events",
              icon: <Icons.EventsIcon className="w-8 h-8" />,
              description:
                "Notified about the latest events of your interest and participate to get rewards and recognition."
            },
            {
              title: "Books",
              icon: <Icons.BooksIcon className="w-8 h-8" />,
              description:
                "Enhance the reading experience by getting honest reviews and feedback from the community about interesting books."
            }
          ].map((item, index) => (
            <div
              key={item.title}
              data-animate="animate__animated animate__fadeInLeft"
              className={`animate-once cursor-default flex flex-col gap-y-4 w-[336px] bg-white px-8 py-7 relative hover:scale-105`}
              style={{
                transitionDelay: `all ${((index + 1) % 4) * 200}ms`,
                animationDelay: `${((index + 1) % 4) * 200}ms`
              }}
            >
              <Icons.FocusCard className="absolute -bottom-2 -right-2  text-primary-500" />
              <div className="absolute -top-8 border-[2px] border-white left-4 bg-primary w-14 h-14 flex justify-center items-center rounded-lg">
                {item.icon}
              </div>
              <div className="text-[20px] text-primary leading-[24px] font-semibold">
                {item.title}
              </div>
              <span className="text-xs text-neutral-700">
                {item.description}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 place-content-between mx-7 px-8 py-20">
        <div className="flex flex-col gap-y-4 text-neutral-700">
          <div
            data-animate="animate__animated animate__fadeInLeft"
            className="animate-once text-[32px] sm:text-[48px] text-center sm:text-left leading-10  sm:leading-[52px] font-bold text-[#4B4B4B]"
          >
            Get Started <br />
            With Your <span className="text-primary-500">New</span> <br />
            <span className="text-primary-500">Product Today.</span>
          </div>
          <div className="block lg:hidden">
            <WhyChooseUsSmall
              data-animate="animate__animated animate__fadeInRight"
              className="animate-once"
            />
          </div>
          <span
            data-animate="animate-fadeIn"
            className="animate-once text-base text-center sm:text-left max-w-[500px]"
          >
           There are various ways to get started with this product. You can create a product, review a product, or simply engage with the community.
          </span>
         

          <div className="flex flex-wrap gap-4 justify-center sm:justify-start gap-x-4">
            <Button
              data-animate="animate__animated animate__fadeInRight"
              className="animate-once"
              variant="default"
              onClick={() => {
                router.push("/")
              }}
            >
              Join CheckerChain
            </Button>
            <Button
              data-animate="animate__animated animate__fadeInRight"
              className="animate-once"
              variant="outlined"
              title="Whitepaper"
              endIcon={<Icons.LinkOutIcon className="w-4 h-4" />}
            />
          </div>
        </div>
        <div className="hidden lg:block">
          <WhyChooseUs
            data-animate="animate__animated animate__fadeInRight"
            className="animate-once"
          />
        </div>
      </section>
    </div>
  )
}
