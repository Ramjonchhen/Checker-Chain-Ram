import { Modal } from "components"
import { useRouter } from "next/router"
import { FC, useState } from "react"
import { Bio } from "./components/Bio"
import { Email } from "./components/email"
import { Interested } from "./components/Interested"
import { Preferences } from "./components/Preferences"
import { ProfilePicture } from "./components/ProfilePicture"
import { Role } from "./components/Role"
import { Stepper } from "./components/stepper"
import { Username } from "./components/username"
import { Welcome } from "./components/welcome"

interface Props {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

export const Onboarding: FC<Props> = ({ isOpen, setIsOpen }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [imageFile, setImageFile] = useState<File>()
  const router = useRouter()
  const steps = [
    {
      name: "Welcome",
      component: <Welcome setCurrentStep={setCurrentStep} />
    },
    {
      name: "Username",
      component: <Username setCurrentStep={setCurrentStep} />
    },
    {
      name: "Email",
      component: <Email setCurrentStep={setCurrentStep} />
    },
    {
      name: "Bio",
      component: <Bio setCurrentStep={setCurrentStep} />
    },
    {
      name: "Profile Picture",
      component: (
        <ProfilePicture
          setCurrentStep={setCurrentStep}
          imageFile={imageFile}
          setImageFile={setImageFile}
        />
      )
    },
    {
      name: "Role",
      component: <Role setCurrentStep={setCurrentStep} />
    },
    {
      name: "Preferences",
      component: (
        <Preferences setCurrentStep={setCurrentStep} imageFile={imageFile} />
      )
    },
    {
      name: "Follow People",
      component: <Interested setCurrentStep={setCurrentStep} />
    }
  ]
  return (
    <div>
      {currentStep >= 0 && currentStep < steps.length && (
        <Modal
          className="w-[470px] py-[37px] px-[25px]"
          display={isOpen}
          onHide={() => {
            setIsOpen(false)
            router.replace("/")
          }}
        >
          <div className="flex flex-col justify-center items-center text-center">
            <Stepper
              setCurrentStep={setCurrentStep}
              steps={steps.length}
              currentStep={currentStep}
            />
            {steps[currentStep]?.component}
          </div>
        </Modal>
      )}
    </div>
  )
}
