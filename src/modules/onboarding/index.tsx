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
import { useUserStore } from "stores"

interface Props {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

export const Onboarding: FC<Props> = ({ isOpen, setIsOpen }) => {
  const { user } = useUserStore()
  const [currentStep, setCurrentStep] = useState(0)
  const [imageFile, setImageFile] = useState<File>()
  const router = useRouter()

  function nextStep() {
    setCurrentStep((current) => current + 1)
  }

  let steps = [
    {
      name: "Welcome",
      component: <Welcome goToNextStep={nextStep} />
    },
    {
      name: "Username",
      component: <Username goToNextStep={nextStep} />
    },
    {
      name: "Email",
      component: <Email goToNextStep={nextStep} />
    },
    {
      name: "Bio",
      component: <Bio goToNextStep={nextStep} />
    },
    {
      name: "Profile Picture",
      component: (
        <ProfilePicture
          goToNextStep={nextStep}
          imageFile={imageFile}
          setImageFile={setImageFile}
        />
      )
    },
    {
      name: "Role",
      component: <Role goToNextStep={nextStep} />
    },
    {
      name: "Preferences",
      component: <Preferences goToNextStep={nextStep} imageFile={imageFile} />
    },
    {
      name: "Follow People",
      component: <Interested goToNextStep={nextStep} />
    }
  ]
  if (user.email) {
    steps.splice(2, 1)
  }

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
