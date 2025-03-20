/* eslint-disable @typescript-eslint/no-explicit-any */
import { yupResolver } from "@hookform/resolvers/yup"
import * as Icons from "assets/icons"
import { Text, UpdateButton, Button } from "components"
import { constants } from "constants/common"
import { DragEvent, FC, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import * as Yup from "yup"

interface UploadImageForm {
  image: File | undefined | null
}
interface UploadImageProps {
  image?: string
  title: string
  setImageFile: (file: UploadImageForm["image"]) => void
  onUpload: () => void
  onRemove: () => void
  loading?: boolean
}

export const UploadImage: FC<UploadImageProps> = ({
  title,
  setImageFile,
  onUpload,
  onRemove,
  loading,
  image: initialImage
}) => {
  const [image, setImage] = useState(initialImage)

  const validationSchema: Yup.SchemaOf<UploadImageForm> = Yup.object().shape({
    image: Yup.mixed()
      .required("Image is required")
      .test("check-file-format", "Invalid file format", () => {
        const fileFormat: any = getValues()?.image?.name.split(".") || []
        return constants.ALLOWED_FILES.toString()
          .toLowerCase()
          .includes(fileFormat[fileFormat.length - 1].toLowerCase())
      })
      .test("check-file-size", "File size must be less than 1MB", () => {
        const fileSize: any = getValues().image?.size || 0
        return fileSize < constants.MAX_FILE_SIZE
      })
  })

  const {
    formState: { errors },
    setValue,
    trigger,
    getValues,
    reset
  } = useForm<UploadImageForm>({
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
      setTimeout(() => {
        if (!errors.image && !!getValues().image) {
          setImageFile(getValues().image)
        }
      }, 100)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const data = e.target.files?.length ? e.target.files[0] : undefined
    setValue("image", data)
    trigger("image")
    e.target.files = null
    setTimeout(() => {
      console.debug(errors)
      if (!errors.image && !!getValues().image) {
        setImageFile(getValues().image)
      }
    }, 100)
  }

  const openFileUploadDialog = () => {
    fileInputRef.current ? (fileInputRef.current.value = "") : null
    fileInputRef?.current?.click()
  }

  return (
    <>
      <Text
        className="text-center px-4 text-xl leading-6 font-semibold border-b border-separate block pb-2"
        variant="body"
      >
        {title}
      </Text>

      {!getValues().image && !image && (
        <div
          onDrop={handleDragEvent}
          onDragEnter={handleDragEvent}
          onDragOver={handleDragEvent}
          onDragLeave={handleDragEvent}
          onClick={openFileUploadDialog}
          className={`${
            !getValues().image?.name && "cursor-pointer"
          } mt-[22px] flex flex-col justify-center items-center relative rounded-lg border border-dashed border-outline bg-secondary-contrast w-full h-[236px]`}
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
      {(!!getValues().image?.name || image) && (
        <>
          <div className="flex justify-center relative items-center flex-col w-full pt-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="object-contain rounded-sm w-full h-[236px] border border-outline-avatar"
              alt="image"
              src={
                image ||
                (getValues().image &&
                  URL.createObjectURL(getValues().image as File)) ||
                ""
              }
            />
            {!image && (
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
            )}
          </div>
        </>
      )}
      <p className={`text-error italic text-xs leading-[18px] ml-3 mt-2`}>
        {errors.image?.message?.toString()}
      </p>
      {!image && (
        <UpdateButton
          loading={!!loading}
          title="Upload Image"
          className="mt-6 w-full"
          onClick={onUpload}
        />
      )}
      {image && (
        <>
          <UpdateButton
            loading={!!loading}
            title="Remove Image"
            className="mt-6 w-full"
            onClick={onRemove}
          />
          <Button
            title="Change Image"
            className="mt-2 w-full"
            onClick={() => setImage(undefined)}
          />
        </>
      )}
    </>
  )
}
