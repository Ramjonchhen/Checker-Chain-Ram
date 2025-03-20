import {
  SmileRating1,
  SmileRating2,
  SmileRating3,
  SmileRating4,
  SmileRating5
} from "assets/images"
import Slider from "rc-slider"
import "rc-slider/assets/index.css"

type IPossibleRatings = 1 | 2 | 3 | 4 | 5
type Props = {
  handleChange: (value: IPossibleRatings) => void
  value: number
}

const ratingSliderData = [
  {
    SmileRatingImage: SmileRating1,
    activeColor: "#FF3722"
  },
  {
    SmileRatingImage: SmileRating2,
    activeColor: "#FF8622"
  },
  {
    SmileRatingImage: SmileRating3,
    activeColor: "#EBBE00"
  },
  {
    SmileRatingImage: SmileRating4,
    activeColor: "#73CF11"
  },
  {
    SmileRatingImage: SmileRating5,
    activeColor: "#009B68"
  }
]

function RatingSlider({ handleChange, value = 0 }: Props) {
  const { activeColor, SmileRatingImage } = ratingSliderData[value ?? 0]

  return (
    <div className="max-w-[350px] px-4 pb-5">
      <div className="flex flex-col items-center justify-center">
        <div className="pt-9">
          <SmileRatingImage />
          <div
            className="text-center text-2xl leading-9 font-semibold"
            style={{ color: activeColor }}
          >
            {value + 1}
          </div>
        </div>
        <Slider
          step={25}
          dots
          dotStyle={{
            top: 30
          }}
          activeDotStyle={{
            backgroundColor: activeColor,
            border: 0
          }}
          handleStyle={{
            height: 28,
            width: 28,
            top: "25%",
            backgroundColor: activeColor,
            border: "1px solid #E9E9EB"
          }}
          railStyle={{
            height: 8,
            backgroundColor: "#ECF2FA",
            borderRadius: 8
          }}
          trackStyle={{
            height: "100%",
            backgroundColor: activeColor
          }}
          value={value * 25}
          onChange={(value) => {
            const activeRatingIndex = (value as number) / 25
            // setActiveRating(activeRatingIndex)
            handleChange(activeRatingIndex as IPossibleRatings)
          }}
        />
      </div>
    </div>
  )
}

export default RatingSlider
