import * as Icons from "assets/icons"
import React, { FC, useEffect, useState } from "react"

export type TransactionStatus =
  | "completed"
  | "outgoing"
  | "scheduled"
  | "cancelled"
  | "paused"
  | "none"

interface CircularProgressProps {
  status: TransactionStatus
  percentage?: number
  animation?: "clockwise" | "anti-clockwise"
  transitionDuration?: number
  caps?: "round" | "inherit" | "butt" | "square" | undefined
  spin?: boolean
  size?: number
  lineWidth?: number
  children?: React.ReactNode
  progressClassname?: string
  progressBgClassname?: string
}

const statusIconMapping = {
  completed: <Icons.CheckTickIcon className="text-success text-xl" />,
  scheduled: <Icons.SearchIcon className="text-content-secondary text-xl" />,
  cancelled: <Icons.CrossOutlineIcon className="text-error text-xl" />,
  paused: <Icons.PencilOutlineIcon className="text-content-contrast text-xl" />,
  none: null
}

const getIconOrPercentageBasedOnStatus = (
  status: TransactionStatus,
  percentage: number
) => {
  if (status === "outgoing") return `${parseInt(percentage.toString())}%`
  return statusIconMapping[status]
}

const getBackgroundByPercentage = (
  percentage: number,
  status: TransactionStatus
) => {
  if (percentage === 100) {
    return "text-success"
  }
  switch (status) {
    case "cancelled":
      return "text-error"
    case "paused":
      return "text-content-contrast"
    case "outgoing":
      return "text-primary-tertiary"
  }
  return ""
}

// Actual component
export const CircularProgress: FC<CircularProgressProps> = ({
  status,
  percentage = 0,
  animation = "clockwise",
  transitionDuration = 3000,
  caps = "round",
  spin = false,
  size = 56,
  lineWidth = 5,
  children,
  progressClassname = "",
  progressBgClassname = ""
}) => {
  const halfSize = size / 2
  const radius = halfSize - lineWidth / 2
  const circleLength = radius * 2 * Math.PI

  const [animatedStroke, setAnimatedStroke] = useState(circleLength)

  useEffect(() => {
    setAnimatedStroke(
      animation === "clockwise"
        ? circleLength * (1 + percentage / 100)
        : animation === "anti-clockwise"
        ? circleLength * (1 - percentage / 100)
        : circleLength * (1 + percentage / 100)
    )
  }, [percentage, animation, circleLength])

  return (
    <div
      className={`flex place-content-center place-items-center relative text-primary-tertiary`}
      style={{
        width: size,
        height: size
      }}
    >
      <svg
        height={size}
        width={size}
        className="absolute"
        style={{
          animation: spin ? "animation-rotate 9s linear infinite" : ""
        }}
        shapeRendering="geometricPrecision"
      >
        <g
          style={{
            transformOrigin: `${halfSize}px ${halfSize}px`,
            transform: "scaleX(-1) rotate(-90deg)"
          }}
        >
          <circle
            className={`text-outline-secondary ${progressBgClassname}`}
            cx={halfSize}
            cy={halfSize}
            r={radius}
            stroke="currentColor"
            strokeWidth={lineWidth}
            fill="none"
          />
          <circle
            className={`${getBackgroundByPercentage(
              percentage,
              status
            )}  ${progressClassname}`}
            cx={halfSize}
            cy={halfSize}
            r={radius}
            style={{
              transition:
                transitionDuration > 0
                  ? `${transitionDuration}ms stroke-dashoffset`
                  : "",
              strokeDashoffset: animatedStroke
            }}
            fill="none"
            strokeDasharray={circleLength}
            strokeWidth={lineWidth}
            stroke="currentColor"
            strokeLinecap={caps}
          />
        </g>
      </svg>
      <div style={{ zIndex: 1 }} className="text-content-primary">
        {children
          ? children
          : getIconOrPercentageBasedOnStatus(status, percentage)}
      </div>
    </div>
  )
}
