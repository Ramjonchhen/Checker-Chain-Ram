import React, { useEffect, useState } from "react"
import { useSwipeable } from "react-swipeable"
import * as Icons from "assets/icons"

interface CarouselProps {
  children: JSX.Element[]
}

interface CarouselItemProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  width?: string
  height?: string
  backgroundColor?: string
  image?: string
}
export const CarouselItem: React.FC<CarouselItemProps> = ({
  children,
  width,
  height,
  backgroundColor,
  image
}) => {
  return (
    <div
      className="carousel-item"
      style={{ width: width, height, backgroundColor }}
    >
      {image ? <img src={image} className="object-contain" style={{ width: width, height }}/> : children}
    </div>
  )
}

export const Carousel: React.FC<CarouselProps> = ({ children }) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  const updateIndex = (newIndex: number) => {
    if (newIndex < 0) {
      newIndex = React.Children.count(children) - 1
    } else if (newIndex >= React.Children.count(children)) {
      newIndex = 0
    }

    setActiveIndex(newIndex)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      if (!paused) {
        updateIndex(activeIndex + 1)
      }
    }, 3000)

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  })

  const handlers = useSwipeable({
    onSwipedLeft: () => updateIndex(activeIndex + 1),
    onSwipedRight: () => updateIndex(activeIndex - 1)
  })

  return (
    <div
      {...handlers}
      className="carousel relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="inner"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {React.Children.map(children, (child, index) => {
          return (
            <>
              <div className="carousel-item" style={{ width: "100%" }}>
                {children.length >= 10 && (
                  <div
                    style={{
                      width: "25%",
                      paddingRight: "10px",
                      opacity: "0.6"
                    }}
                  >
                    {React.cloneElement(
                      children[index === 0 ? children.length - 1 : index - 1],
                      { width: "100%", height: "50%", backgroundColor: "red" }
                    )}
                  </div>
                )}

                {React.cloneElement(child, {
                  width: children.length >= 10 ? "50%" : "100%",
                  height: "500px"
                })}
                {children.length >= 10 && (
                  <div
                    style={{
                      width: "25%",
                      paddingLeft: "10px",
                      opacity: "0.6"
                    }}
                  >
                    {React.cloneElement(
                      children[index === children.length - 1 ? 0 : index + 1],
                      {
                        width: "100%",
                        height: "50%",
                        backgroundColor: "orange"
                      }
                    )}
                  </div>
                )}
              </div>
            </>
          )
        })}
      </div>
      {children.length > 1 && (
        <div className="indicators absolute top-[36%] flex w-full !justify-between">
          <button
            onClick={() => {
              updateIndex(activeIndex - 1)
            }}
          >
            <Icons.PreviousIcon className="text-primary-300" />
          </button>
          {/* {React.Children.map(children, (child, index) => {
          return (
            <button
              className={`${index === activeIndex ? "active" : ""}`}
              onClick={() => {
                updateIndex(index);
              }}
            >
              {index + 1}
            </button>
          );
        })} */}
          <button
            onClick={() => {
              updateIndex(activeIndex + 1)
            }}
          >
            <Icons.NextIcon className="text-primary-300" />
          </button>
        </div>
      )}
    </div>
  )
}
