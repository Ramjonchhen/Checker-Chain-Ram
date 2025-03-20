/* eslint-disable @next/next/no-img-element */
import * as Icons from "assets/icons"
import { TextArea } from "components"
import React, { FC } from "react"
import { Comment, Discussion, useDiscussionStore } from "stores/discussion"
import { getBaseBackendImageUrl } from "utils"
import * as Yup from "yup"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { IconButton } from "components/iconButton"
import { useToastStore } from "stores/toast"
import { useUserStore } from "stores"

interface CommentCardProps {
  discussion: Discussion
  parentId?: string
  setCommentData?: (data: Comment) => void
}

interface CommentFormFieldProps {
  comment: string
}

export const CommentFormField: FC<CommentCardProps> = ({
  discussion,
  parentId,
  setCommentData
}) => {
  const buttonRef = React.useRef<HTMLButtonElement>(null)
  const { commentDiscussion } = useDiscussionStore()
  const { user } = useUserStore()
  const { successToast, errorToast } = useToastStore()

  const validationSchema: Yup.SchemaOf<CommentFormFieldProps> =
    Yup.object().shape({
      comment: Yup.string()
        .required()
        .max(500, "Comment should be less than 500 characters")
    })
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset
  } = useForm<CommentFormFieldProps>({
    mode: "onChange",
    resolver: yupResolver(validationSchema),
    defaultValues: {
      comment: ""
    }
  })

  const onSubmit = async (data: CommentFormFieldProps) => {
    const response = await commentDiscussion(discussion._id, {
      comment: data.comment,
      parent: parentId
    })
    if (response) {
      successToast({
        message: "Commented successfully"
      })
      reset()
      setCommentData && setCommentData(response.data)
    } else {
      errorToast({
        message: "Something went wrong"
      })
    }
  }

  return (
    <div className="py-4 flex gap-4 items-start">
      <img
        className="w-10 h-10 rounded-full object-cover"
        src={getBaseBackendImageUrl(user?.profilePicture, "avatar")}
        alt="user"
      />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full relative"
        autoComplete="off"
      >
        <TextArea
          max={500}
          error={!!errors.comment}
          helper={errors.comment?.message?.toString()}
          className="flex-grow"
          inputClassName="bg-neutral-50 w-full rounded-md resize-none min-h-[40px]"
          placeholder="Write a comment ..."
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              const button = buttonRef.current as HTMLButtonElement
              button.click()
            }
          }}
          {...register("comment")}
        />
        <IconButton
          buttonRef={buttonRef}
          icon={
            <Icons.SendIcon className="absolute bottom-14 right-2 h-8 w-8 text-primary-500 cursor-pointer" />
          }
          type="submit"
        />
      </form>
    </div>
  )
}
