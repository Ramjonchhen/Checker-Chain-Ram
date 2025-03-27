import { Chip, Text, UpdateButton } from "components"
import { FC, useEffect, useState } from "react"
import { useUserStore } from "stores"
import { useCategoryStore } from "stores/category"

interface PreferencesProps {
  goToNextStep: () => void
  imageFile: File | undefined
}

export interface Preference {
  category: string
  subcategory: string[]
}

export const Preferences: FC<PreferencesProps> = ({
  goToNextStep,
  imageFile
}) => {
  const [preferences, setPreferences] = useState<Preference[]>([])
  const { getCategories, categories } = useCategoryStore()
  useEffect(() => {
    getCategories()
  }, [])

  const [isError, setIsError] = useState(false)
  const [loading, setLoading] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { editProfile, uploadImage, onboarding } = useUserStore(
    (state: any) => state
  )
  const onSubmit = async () => {
    try {
      if (
        preferences
          .map((preference) => preference.subcategory.length)
          .reduce((a, b) => a + b, 0) < 2
      ) {
        setIsError(true)
        return
      }
      setLoading(true)
      if (imageFile) {
        // const formData = new FormData()
        // formData.append('image', imageFile)
        await uploadImage(imageFile, "profilePicture")
      }
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const response = await editProfile({
        ...onboarding,
        preference: preferences
      })
      setLoading(false)
      if (response.success) {
        console.log("preference is success going to next step")
        goToNextStep()
      }
    } catch (error) {
      console.log("preferences error is: ", error)
    }
  }

  return (
    <div className="pt-10 flex flex-col items-center w-full">
      <Text variant="modal-header" className="!text-3xl">
        Select Preferences
      </Text>
      <div className="my-4 w-full overflow-auto h-[270px]">
        {categories?.map((categoryItem) => (
          <div className="w-full text-start mt-4" key={categoryItem.name}>
            <span className="text-base font-medium">{categoryItem.name}</span>
            <div className="flex flex-row flex-wrap gap-2 mt-2">
              {categoryItem?.subcategories?.map((subCategoryItem) => (
                <Chip
                  key={subCategoryItem}
                  title={subCategoryItem}
                  selectable={true}
                  onChange={(checked) => {
                    if (checked) {
                      const preference = preferences.find(
                        (p) => p.category === categoryItem.name
                      )
                      if (preference) {
                        setPreferences([
                          ...preferences.filter(
                            (p) => p.category !== categoryItem.name
                          ),
                          {
                            category: categoryItem.name,
                            subcategory: [
                              ...preference.subcategory,
                              subCategoryItem
                            ]
                          }
                        ])
                      } else {
                        setPreferences([
                          ...preferences,
                          {
                            category: categoryItem.name,
                            subcategory: [subCategoryItem]
                          }
                        ])
                      }
                      if (
                        preferences
                          .map((preference) => preference.subcategory.length)
                          .reduce((a, b) => a + b, 0) > 0
                      ) {
                        setIsError(false)
                      }
                    } else {
                      const preference = preferences.find(
                        (p) => p.category === categoryItem.name
                      )
                      if (preference) {
                        setPreferences([
                          ...preferences.filter(
                            (p) => p.category !== categoryItem.name
                          ),
                          {
                            category: categoryItem.name,
                            subcategory: preference.subcategory.filter(
                              (s) => s !== subCategoryItem
                            )
                          }
                        ])
                      }
                    }
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      {isError && (
        <p
          className={`text-start w-full text-error italic text-xs leading-[18px] ml-3 mt-2`}
        >
          Select atleast 2 preferences to proceed.
        </p>
      )}

      <UpdateButton
        type="button"
        loading={loading}
        className="w-full"
        size="large"
        title="Continue"
        loadingTitle="Saving"
        afterTitle="Saved"
        onClick={onSubmit}
      />
    </div>
  )
}
