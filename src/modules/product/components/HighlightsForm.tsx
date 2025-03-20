/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react"
import * as Icons from "assets/icons"
import { IconButton } from "components/iconButton"
import { TextArea, UpdateButton } from "components"
import { useToastStore } from "stores/toast"
import * as Yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"
import { useHighlightStore } from "stores/highlights"
import { useProductStore } from "stores/product"

interface HighlightFormProps {
  closeModal: () => void
}

interface HighlightFormData {
  description?: string
}

export const HighlightsForm: React.FC<HighlightFormProps> = ({
  closeModal
}) => {
  const validationSchema: Yup.SchemaOf<HighlightFormData> = Yup.object().shape({
    description: Yup.string().max(
      500,
      "Highlights description should be less than 500 characters"
    )
  })

  const {
    setValue,
    getValues,
    formState: { errors },
    handleSubmit,
    reset,
    trigger
  } = useForm<HighlightFormData>({
    mode: "onChange",
    resolver: yupResolver(validationSchema),
    defaultValues: {
      description: ""
    }
  })

  const [uploadedPics, setUploadedPics] = React.useState<File[]>([])
  const fileRef = React.useRef<HTMLInputElement>(null)
  const { uploadHighlight, loading } = useHighlightStore()
  const { successToast, errorToast } = useToastStore()
  const { product } = useProductStore()

  const onFileChange = (e: any) => {
    if ([...uploadedPics, ...e.target.files].length < 5) {
      // console.debug(e.target.files)
      setUploadedPics([...uploadedPics, ...e.target.files])
      e.target.files = null
      e.target.value = null
    } else {
      errorToast({
        message: "You can only upload 4 images"
      })
    }
  }

  const onSubmit = async (data: HighlightFormData) => {
    uploadHighlight({
      productId: product._id,
      description: data.description,
      images: uploadedPics
    })
      .then(() => {
        reset()
        setUploadedPics([])
        closeModal()
        successToast({
          message: "Highlight uploaded successfully"
        })
      })
      .catch((err) => {
        console.debug(err)
        errorToast({
          message: err.message
        })
      })
  }
  return (
    <div>
      <div className="text-[20px] font-semibold leading-6 flex justify-center pb-4 border-b-[2px] border-b-separator">
        Upload your highlights
      </div>
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <TextArea
          max={500}
          rows={5}
          error={!!errors.description}
          helper={errors.description?.message?.toString()}
          inputClassName="resize-none"
          className="mt-4"
          placeholder="Write your highlights here"
          value={getValues().description}
          onChange={(e) => {
            setValue("description", e.target.value)
            trigger("description")
          }}
        />
        <div className="grid gap-2 grid-cols-2">
          {uploadedPics.slice(0, 4).map((each, index) => (
            <div
              className={`relative border-[2px] border-separator rounded-sm ${
                uploadedPics.length === 1 ? "col-span-2" : ""
              }`}
              key={each.name}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className={`w-full h-[150px] object-contain`}
                alt={each.name}
                src={URL.createObjectURL(each)}
              />
              <Icons.CrossOutlineIcon
                className="text-error absolute top-2 right-2 cursor-pointer"
                onClick={() => {
                  console.debug(
                    uploadedPics.filter((i, ind) => index !== ind),
                    index
                  )
                  setUploadedPics(
                    uploadedPics.filter((i, ind) => index !== ind)
                  )
                }}
              />
            </div>
          ))}
        </div>
        <div className="flex mt-2">
          <input
            ref={fileRef}
            onChange={onFileChange}
            type="file"
            hidden
            multiple
            accept="image/*"
          />
          <IconButton
            onClick={() => {
              const fileElement = fileRef.current as HTMLInputElement
              if (fileElement) {
                fileElement.click()
              }
            }}
            icon={<Icons.ImagesUploadIcon />}
            type="button"
          />
          {/* <IconButton icon={<Icons.SmileEmojiIcon />} /> */}
        </div>
        <UpdateButton
          type="submit"
          loading={loading}
          title="Save"
          afterTitle="Saved"
          loadingTitle="Saving"
          disabled={false}
          className="w-full mt-4"
        />
      </form>
    </div>
  )
}
