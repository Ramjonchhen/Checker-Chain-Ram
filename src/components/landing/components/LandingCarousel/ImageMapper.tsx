type Props = {
  currentSlide: number
  slideImages: string[]
  keyTitle: string
}

function ImageMapper({ currentSlide, slideImages, keyTitle }: Props) {
  return (
    <>
      {slideImages.map((image, index) => (
        <div
          key={`${keyTitle}-${index}`}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-[800ms]  ${
            index === currentSlide ? "opacity-80" : "opacity-0"
          }`}
        >
          <img
            src={image}
            alt={`${keyTitle} ${index + 1}`}
            className="object-cover w-full h-full"
          />
        </div>
      ))}
    </>
  )
}

export default ImageMapper
