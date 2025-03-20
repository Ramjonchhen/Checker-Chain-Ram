import { CameraPlusIcon } from "assets/icons"
import { MissingImage } from "assets/images"
import { constants } from "constants/common"
import React from "react"
import { useDropzone } from "react-dropzone"
import { useToastStore } from "stores/toast"
import { twMerge } from "tailwind-merge"

interface ImagePickerProps {
  onFileSelected: (file: File) => void
  className?: string
  title?: string
  titleClassName?: string
  required?: boolean
  errorMessage?: string
  imageContainerClassName?: string
  value: File | null
}

const ImagePicker: React.FC<ImagePickerProps> = ({
  onFileSelected,
  className,
  title = "",
  titleClassName = "",
  required = false,
  errorMessage = "",
  imageContainerClassName = "",
  value = null
}) => {
  // const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const { errorToast } = useToastStore()

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/jpeg": [".jpeg", "jpg"],
      "image/png": [".png"]
    },
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0]
      if (file) {
        if (file.size > constants.MAX_FILE_SIZE) {
          errorToast({ message: "Please upload a file less than 1 MB" })
          return
        }
        onFileSelected(acceptedFiles[0])
      }
      //   setPreviewUrl(URL.createObjectURL(acceptedFiles[0]))
    }
  })

  return (
    <div className="w-full h-full">
      {title && (
        <div
          className={twMerge(
            "text-xs leading-6 tracking-[0.02em] font-medium text-neutral-700",
            titleClassName
          )}
        >
          {title} {required && <span className="text-[#ef0000]">*</span>}
        </div>
      )}
      {/* <div
        {...getRootProps()}
        className={twMerge(
          "p-4 border-2 border-dashed rounded-lg text-center cursor-pointer min-h-[100px] w-full grid",
          isDragActive && "bg-gray-100",
          className
        )}
      >
        <input {...getInputProps()} />

        {selectedFile ? (
          <div className="grid h-full place-items-center">
            <p className="text-[11px] font-medium text-neutral-400 text-center">
              {selectedFile.name}
            </p>
          </div>
        ) : isDragActive ? (
          <div className="grid h-full place-items-center">
            <p className="text-[11px] font-medium text-neutral-400 text-center">
              Drop the image file here ...
            </p>
          </div>
        ) : (
          <div className="grid h-full  place-items-center">
            <p className="text-[11px] font-medium text-neutral-400 text-center">
              {placeholder}
            </p>
          </div>
        )}
      </div> */}

      <div
        {...getRootProps()}
        className={twMerge("h-full w-full cursor-pointer")}
      >
        <div className={twMerge(className)}>
          <input {...getInputProps()} />
          {value ? (
            <div className={twMerge("h-full w-full", imageContainerClassName)}>
              <img
                src={URL.createObjectURL(value)}
                alt=""
                className="object-cover h-full w-full"
              />
            </div>
          ) : (
            <div
              className={twMerge(
                "relative grid text-white place-items-center bg-[#BBBBBB]",
                imageContainerClassName
              )}
            >
              <MissingImage className="w-[57px] h-[48px] text-white" />

              <div className="absolute  h-full w-full bg-[linear-gradient(0deg,rgba(0,0,0,0.5),rgba(0,0,0,0.5))]">
                <div className="flex flex-col justify-center text-white items-center h-full w-full gap-1">
                  <CameraPlusIcon />
                  <div className="text-center text-xs leading-[18px] font-semibold">
                    Upload image
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {errorMessage && (
        <p
          className={`${"text-error"} italic text-xs leading-[18px] ml-3 mt-2`}
        >
          {errorMessage}
        </p>
      )}
    </div>
  )
}

export default ImagePicker
