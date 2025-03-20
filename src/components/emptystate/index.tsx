// import EmptyImg from "assets/images/nodata/empty_new.png"
import EmptyImg from "assets/images/nodata/empty_new.svg"
import { Text } from "components/text"
import { FC } from "react"
import { twMerge } from "tailwind-merge"
import { EmptyDataProps } from "./index.d"

export const EmptyState: FC<EmptyDataProps> = ({
  message,
  title,
  // image,
  button,
  ...rest
}) => {
  return (
    <div
      {...rest}
      className={twMerge(
        "p-20 flex flex-col items-center justify-center",
        rest?.className ?? ""
      )}
    >
      <EmptyImg />

      {title && (
        <Text
          variant="body"
          className="text-center mt-2 font-semibold text-neutral-900 text-base"
        >
          {title}
        </Text>
      )}

      <Text
        variant="body"
        className="text-center mt-2 text-neutral-600 text-xs"
      >
        {message}
      </Text>
      {button && <div className="mt-4">{button ?? ""}</div>}
    </div>
  )
}
