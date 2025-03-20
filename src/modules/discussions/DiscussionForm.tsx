/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from "react"
import * as Icons from "assets/icons"
// import { IconButton } from "components/iconButton"
import { Input, Select, TextArea, UpdateButton } from "components"
import { useToastStore } from "stores/toast"
import * as Yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"
import { useDiscussionStore } from "stores/discussion"
import { useCategoryStore } from "stores/category"

interface DiscussionFormProps {
  closeModal: () => void
}

interface DiscussionFormData {
  title?: string
  category: string
  description?: string
}

export const DiscussionForm: React.FC<DiscussionFormProps> = ({
  closeModal
}) => {
  const { categories, getCategories } = useCategoryStore()
  const { getMyDiscussions } = useDiscussionStore()
  const validationSchema: Yup.SchemaOf<DiscussionFormData> = Yup.object().shape(
    {
      title: Yup.string().required("Discussion title is required"),
      category: Yup.string().required("Category is required"),
      description: Yup.string().max(
        1000,
        "Discussion should be less than 1000 characters"
      )
    }
  )

  const {
    setValue,
    getValues,
    formState: { errors },
    handleSubmit,
    reset,
    trigger,
    register
  } = useForm<DiscussionFormData>({
    mode: "onChange",
    resolver: yupResolver(validationSchema),
    defaultValues: {
      description: ""
    }
  })

  const [uploadedPics, setUploadedPics] = React.useState<File[]>([])
  // const fileRef = React.useRef<HTMLInputElement>(null)
  const { uploadDiscussion, loading } = useDiscussionStore()
  const { successToast, errorToast } = useToastStore()

  // const onFileChange = (e: any) => {
  //   if ([...uploadedPics, ...e.target.files].length < 5) {
  //     console.debug(e.target.files)
  //     setUploadedPics([...uploadedPics, ...e.target.files])
  //     e.target.files = null
  //     e.target.value = null
  //   } else {
  //     errorToast({
  //       message: "You can only upload 4 images"
  //     })
  //   }
  // }

  const onSubmit = async (data: DiscussionFormData) => {
    const response = await uploadDiscussion({
      title: data.title,
      description: data.description,
      images: uploadedPics,
      category: data.category
    })
    if (response) {
      reset()
      setUploadedPics([])
      closeModal()
      successToast({
        message: "Discussion created successfully"
      })
      getMyDiscussions({})
    } else {
      errorToast({
        message: "Failed to created discussion"
      })
    }
  }

  useEffect(() => {
    if (!categories.length) {
      getCategories()
    }
  }, [categories, getCategories])

  return (
    <div>
      <div className="text-[20px] font-semibold leading-6 flex justify-center pb-4 border-b-[2px] border-b-separator">
        Create a Discussion
      </div>
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <Select
          label="Select a category"
          items={categories.map((item) => item.name)}
          value={getValues().category}
          onValueChange={(val) => {
            setValue("category", val as string)
            trigger("category")
          }}
          placeholder="Select a category"
        />
        <Input
          label="Title"
          type="text"
          error={!!errors.title}
          placeholder="Write title here"
          {...register("title")}
        />
        <TextArea
          max={1000}
          rows={5}
          error={!!errors.description}
          helper={errors.description?.message?.toString()}
          inputClassName="resize-none"
          className="mt-4"
          placeholder="Write your discussion here"
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
        {/* <div className="flex mt-2"> */}
          {/* <input
            ref={fileRef}
            onChange={onFileChange}
            type="file"
            hidden
            multiple
            accept="image/*"
          /> */}
          {/* <IconButton
            onClick={() => {
              const fileElement = fileRef.current as HTMLInputElement
              if (fileElement) {
                fileElement.click()
              }
            }}
            icon={<Icons.ImagesUploadIcon />}
            type="button"
          /> */}
          {/* <IconButton icon={<Icons.SmileEmojiIcon />} /> */}
        {/* </div> */}
        <UpdateButton
          type="submit"
          loading={loading}
          title="Post in community"
          afterTitle="Posted in community"
          loadingTitle="Posting..."
          disabled={loading}
          className="w-full mt-4"
        />
      </form>
    </div>
  )
}
