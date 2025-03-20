import { yupResolver } from "@hookform/resolvers/yup"
import * as Icons from "assets/icons"
import { Button, Text } from "components"
import { constants } from "constants/common"
import { DragEvent, FC, useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import * as Yup from "yup"
import { SelectFromWallet } from "./SelectFromWallet"
import {
  UploadProfilePictureFormData,
  UploadProfilePictureProps
} from "./UploadProfilePicture.d"

export const UploadProfilePicture: FC<UploadProfilePictureProps> = ({
  onChange,
  setImageFile
}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [isSelectFromWallet, setIsSelectFromWallet] = useState(false)

  const validationSchema: Yup.SchemaOf<UploadProfilePictureFormData> =
    Yup.object().shape({
      image: Yup.mixed()
        .required("Image is required")
        .test("check-file-format", "Invalid file format", () => {
          const fileFormat = getValues()?.image?.name.split(".") || []
          return constants.ALLOWED_FILES.toString()
            .toLowerCase()
            .includes(fileFormat[fileFormat.length - 1].toLowerCase())
        })
        .test("check-file-size", "File size must be less than 1MB", () => {
          const fileSize = getValues().image?.size || 0
          return fileSize < constants.MAX_FILE_SIZE
        })
    })
  const {
    formState: { errors },
    setValue,
    trigger,
    getValues,
    reset
  } = useForm<UploadProfilePictureFormData>({
    mode: "onChange",
    resolver: yupResolver(validationSchema)
  })

  const fileInputRef = useRef<HTMLInputElement>(null)
  const handleDragEvent = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "drop") {
      const data = e.dataTransfer.items?.length
        ? e.dataTransfer.items[0]
        : undefined
      setValue(
        "image",
        data?.kind === "file" ? (data.getAsFile() as File) : undefined
      )
      trigger("image")
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const data = e.target.files?.length ? e.target.files[0] : undefined
    setValue("image", data)
    trigger("image")
    e.target.files = null
  }

  const openFileUploadDialog = () => {
    fileInputRef.current ? (fileInputRef.current.value = "") : null
    fileInputRef?.current?.click()
  }

  useEffect(() => {
    if (!errors.image && !!getValues().image) {
      setImageFile(getValues().image)
      onChange && onChange()
    }
  }, [errors, onChange, getValues])

  if (isSelectFromWallet) {
    return <SelectFromWallet onChange={() => onChange && onChange()} />
  }
  return (
    <>
      <Text
        className="px-4 text-2xl leading-6 font-medium text-content border-b border-outline-secondary block pb-2"
        variant="body"
      >
        Upload Profile Picture
      </Text>

      {!getValues().image && (
        <div
          onDrop={handleDragEvent}
          onDragEnter={handleDragEvent}
          onDragOver={handleDragEvent}
          onDragLeave={handleDragEvent}
          onClick={openFileUploadDialog}
          className={`${
            !getValues().image?.name && "cursor-pointer"
          } sm:m-6 flex flex-col justify-center items-center relative rounded-lg border border-dashed border-outline bg-secondary-contrast w-full sm:w-[275px] h-[120px]`}
        >
          {!getValues().image?.name && <Icons.ImageGallerySolidIcon />}
          <div className="flex gap-3 text-content-secondary text-sm mt-3">
            {!getValues().image?.name && "Drag and drop or browse"}
          </div>

          <input
            ref={fileInputRef}
            onChange={handleFileChange}
            type="file"
            className="sr-only"
          />
        </div>
      )}
      {!!getValues().image?.name && (
        <>
          <div className="flex justify-center relative items-center flex-col w-[275px] pt-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="object-contain rounded-full w-[110px] h-[110px] border border-outline-avatar"
              alt="avatar"
              src={
                getValues().image &&
                URL.createObjectURL(getValues().image as File)
              }
            />
            <div
              onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                e.stopPropagation()
                reset()
                setImageFile(undefined)
              }}
              className="flex cursor-pointer text-primary pt-6"
            >
              Remove
            </div>
          </div>
        </>
      )}
      <p className={`text-error italic text-xs leading-[18px] ml-3 mt-2`}>
        {errors.image?.message?.toString()}
      </p>
      <div className="grid place-content-center gap-y-6 mb-6">
        {!getValues().image && (
          <>
            <div className="flex justify-center">
              <span>OR</span>
            </div>
            <Button
              type="button"
              onClick={() => setIsSelectFromWallet(true)}
              startIcon={<Icons.WalletIcon className="text-white" />}
              className="w-full"
              disabled
              title="Import from Wallet"
            />
          </>
        )}
      </div>
    </>
  )
}
