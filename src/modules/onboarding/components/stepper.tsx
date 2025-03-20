import * as Icons from "assets/icons"
import { FC } from "react"

interface StepperProps {
  steps: number
  currentStep: number
  setCurrentStep: (step: number) => void
}

export const Stepper: FC<StepperProps> = ({
  steps,
  currentStep,
  setCurrentStep
}) => {
  const skips = [3, 4]
  return (
    <div
      className={`cursor-pointer w-full flex gap-2 ${
        currentStep === 0 ? "justify-center" : "justify-between"
      } items-center`}
    >
      {currentStep !== 0 && (
        <Icons.ArrowLeftLong
          onClick={() => setCurrentStep(currentStep - 1)}
          className="text-content-primary cursor-pointer"
        />
      )}
      <div className="flex gap-2 justify-center items-center">
        {new Array(steps).fill(0).map((_, index) => {
          return (
            <div
              // onClick={() => setCurrentStep(index)}
              key={index}
              className={`${
                currentStep === index
                  ? "h-[11px] w-[11px] bg-primary"
                  : "h-2 w-2 bg-primary-500"
              } rounded-full `}
            />
          )
        })}
      </div>
      {skips.includes(currentStep) ? (
        <span
          onClick={() => setCurrentStep(currentStep + 1)}
          className="text-primary cursor-pointer"
        >
          Skip
        </span>
      ) : (
        <div></div>
      )}
    </div>
  )
}
