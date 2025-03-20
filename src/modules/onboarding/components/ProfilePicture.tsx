import * as Icons from "assets/icons"
import { Button, Modal, Text } from "components"
import { UploadProfilePicture } from "modules/profile/components/UploadProfilePicture"
import { FC, useEffect, useState } from "react"

interface ProfilePictureProps {
  setCurrentStep: (step: number) => void
  setImageFile: (file: File | undefined) => void
  imageFile: File | undefined
}

export const ProfilePicture: FC<ProfilePictureProps> = ({ setCurrentStep, imageFile, setImageFile}) => {
  const [showUploadProfile, setShowUploadProfile] = useState(false)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    if (imageFile) {
      setIsError(false)
    }
  }, [imageFile])

  return (
    <div className="pt-10 flex flex-col items-center w-full">
      <Text variant="modal-header" className="!text-3xl">Pick a profile picture</Text>
      <Text
        variant="body"
        className="mt-2 text-content-tertiary text-base text-ellipsis text-center"
      >
        Upload a picture so that people <br /> can recognize you.
      </Text>
      <div
        aria-disabled
        onClick={() => setShowUploadProfile(true)}
        className={`${"cursor-pointer"} m-6 flex flex-col justify-center items-center rounded-full border border-dashed border-outline bg-secondary-contrast w-[120px] h-[120px]`}
      >
        {!imageFile && <Icons.CameraIcon className="text-content-light" />}
        {imageFile && <img
              className="object-contain rounded-full w-[110px] h-[110px] border border-outline-avatar"
              alt="avatar"
              src={
                URL.createObjectURL(imageFile)
            }
        />}
      </div>
      <Modal
        overlay={false}
        className="absolute top-48 w-auto left-auto right-auto md:right-20"
        onHide={() => setShowUploadProfile(false)}
        closeButton
        display={showUploadProfile}
      >
        <UploadProfilePicture onChange={() => setShowUploadProfile(false)} setImageFile={setImageFile}/>
      </Modal>
      {imageFile && <div
        onClick={(e: React.MouseEvent<HTMLDivElement>) => {
          e.stopPropagation()
          setImageFile(undefined)
        }}
        className="flex cursor-pointer text-primary pt-6"
      >
        Remove
      </div>}

      {isError && <p className={`text-center w-full text-error italic text-xs leading-[18px] ml-3 mt-2`}>
          Image is required
      </p>}
      <Button 
        className="w-full mt-8" size="large" title="Continue" 
        onClick={() => {
          if(imageFile) {
            setCurrentStep(5)
          } else {
            setIsError(true)
          }
        }}
      />
    </div>
  )
}
