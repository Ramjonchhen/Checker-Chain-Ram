import { Chip, UpdateButton } from "components"
import { FC, useEffect, useState } from "react"
import { useUserStore } from "stores"
import { CategoryProps } from "./category.d"
export const Category: FC<CategoryProps> = ({ title, badges }) => {
  const { user, updatePreferences, editProfile, preferenceLoading } =
    useUserStore((state) => state)
  const [error, setError] = useState<string>("")
  const [selectedPreferenes, setSelectedPreferences] = useState<string[]>([])
  useEffect(() => {
    if (
      user.preference &&
      user.preference.some((item) => item.category === title)
    ) {
      setSelectedPreferences(
        user.preference.find((item) => item.category === title)?.subcategory ||
          []
      )
    }
  }, [user, title, badges])

  return (
    <div>
      <span className="text-primary font-medium text-[16px]">{title}</span>
      <div className="flex flex-wrap mt-2 md:mt-6 gap-2">
        {badges.map((badge, index) => {
          return (
            <Chip
              onChange={(change: boolean) => {
                const intermediatePreferences = selectedPreferenes.map(
                  (item) => item
                )
                setSelectedPreferences([])
                if (change) {
                  if (!intermediatePreferences.includes(badge)) {
                    intermediatePreferences.push(badge)
                  }
                } else {
                  const indexOfbadge = intermediatePreferences.indexOf(badge)
                  if (indexOfbadge > -1) {
                    intermediatePreferences.splice(indexOfbadge, 1)
                  }
                }
                updatePreferences(title, intermediatePreferences)
              }}
              isSelected={!!selectedPreferenes?.includes(badge)}
              key={index}
              selectable={true}
              title={badge}
            />
          )
        })}
      </div>
      {error !== "" && (
        <p
          className={`${
            error ? "text-error" : "text-content-secondary"
          } italic text-xs leading-[18px] mt-3`}
        >
          {error}
        </p>
      )}
      <UpdateButton
        onClick={() => {
          if (
            user.preference
              .filter((item) => item.category !== title)
              .map((each) => each.subcategory.length)
              .reduce((a, b) => a + b, 0) +
              selectedPreferenes.length >=
            2
          ) {
            setError("")
            editProfile({ preference: user.preference })
          } else {
            setError("Select at most two preferences")
          }
        }}
        title="Save"
        afterTitle="Saved"
        loadingTitle="Saving"
        loading={preferenceLoading}
        className="mt-4"
      />
    </div>
  )
}
