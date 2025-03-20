import { Card } from "components"
import preferencesData from "data/preferences.json"
import { useEffect, useState } from "react"
import { Category } from "./category"

export const Preferences = () => {
  const [currentCategory, setCurrentCategory] = useState<string>(
    "Crypto & Blockchain"
  )
  const [badges, setBadges] = useState<string[]>([])
  const getBadges = (c: string) => {
    if (preferencesData.data.some((item) => item.category === c)) {
      return preferencesData.data.find((item) => item.category === c)
        ?.subcategory
    }
    return []
  }

  useEffect(() => {
    setBadges(getBadges(currentCategory) as string[])
  }, [currentCategory])
  return (
    <Card className="p-0">
      <div className="px-7 pt-5 pb-2 text-content-primary text-2xl font-medium border-b border-outline-secondary">
        Preferences
      </div>
      <div className="px-7 flex flex-col md:flex-row py-6 text-content-secondary text-xl">
        <div className="md:min-w-40 ">
          {preferencesData.data.map((category, index) => {
            return (
              <div
                key={index}
                className={`px-4 py-2 cursor-pointer  text-[16px] flex items-center ${
                  currentCategory === category.category
                    ? "bg-background-light"
                    : "bg-transparent"
                }`}
                onClick={() => setCurrentCategory(category.category)}
              >
                {category.category}
              </div>
            )
          })}
        </div>
        <div className="py-2 md:px-10 ">
          <Category key={5} title={currentCategory} badges={badges} />
        </div>
      </div>
    </Card>
  )
}
