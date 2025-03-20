import { FC, useState } from "react"
import { Chip } from "components"

interface SubCategoriesProps {
  subcategories: string[]
}

export const SubCategoriesChips: FC<SubCategoriesProps> = ({
  subcategories
}) => {
  const [showAll, setShowAll] = useState(false)
  return (
    <>
      {(subcategories.length > 0 ? subcategories : ["Subcategory"])
        .slice(0, showAll ? subcategories.length : 5)
        .map((each, index) => (
          <Chip key={index} title={each} selectable={false} />
        ))}
      {!showAll &&
        (subcategories.length > 0 ? subcategories : ["Subcategory"]).length >
          5 && (
          <span
            className="border border-primary text-primary bg-primary-50 cursor-pointer rounded-xl items-center justify-center gap-1 px-[10px] py-1 text-[10px] font-normal leading-[14px] whitespace-nowrap"
            onClick={() => {
              setShowAll(true)
            }}
            aria-disabled
          >
            See all
          </span>
        )}
    </>
  )
}
