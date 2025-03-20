import { useState } from "react"
import { twMerge } from "tailwind-merge"
import FormCardContent from "./FormCardContent"

type Props = {
  productId: string
  productSlug: string
}

const CreateReviewCard = ({ productId, productSlug }: Props) => {
  const [isExpanded, setIsExpanded] = useState(false)
  return (
    <div
      className={twMerge(
        "transition-all duration-300 mt-3 w-full max-h-[100px] bg-white rounded-lg",
        isExpanded && "max-h-[1421px]",
        "pt-3 pb-4"
      )}
    >
      <div className="w-full">
        <FormCardContent
          isExpanded={isExpanded}
          setIsExpanded={setIsExpanded}
          productId={productId}
          productSlug={productSlug}
        />

      </div>
    </div>
  )
}

export default CreateReviewCard
