import * as Icons from "assets/icons"
import { FC, useEffect, useState } from "react"
import { Button } from "./button"
import { ButtonBaseProps } from "./button/index.d"

let isFirstTime = true

interface UpdateButtonProps extends ButtonBaseProps {
  loading?: boolean
  title: string
  loadingTitle?: string
  afterTitle?: string
}

let timeout: NodeJS.Timeout; 

export const UpdateButton: FC<UpdateButtonProps> = ({
  loading,
  title,
  loadingTitle,
  afterTitle,
  ...rest
}) => {
  const [buttonTitle, setButtonTitle] = useState(title)
  const [afterState, setAfterState] = useState(false)

  useEffect(() => {
    if (loading) {
      setButtonTitle(loadingTitle ?? title)
    } else {
      if (isFirstTime) {
        setButtonTitle(title)
        isFirstTime = false
      } else {
        setAfterState(true)
        setButtonTitle(afterTitle ?? title)
        timeout = setTimeout(() => {
          setAfterState(false)
          setButtonTitle(title)
        }, 800)
      }
    }

  return () => {
    clearTimeout(timeout)
    isFirstTime = true
  }
  }, [title, loading, afterTitle, loadingTitle])

  return (
    <Button
      disabled={loading}
      startIcon={
        afterState ? (
          <Icons.CheckTickIcon />
        ) : loading ? (
          <Icons.LoadingIcon />
        ) : (
          undefined
        )
      }
      title={buttonTitle}
      {...rest}
    />
  )
}
