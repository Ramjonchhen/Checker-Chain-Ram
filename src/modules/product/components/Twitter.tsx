// TwitterContainer.js
import React, { FC, useEffect } from "react"

interface TwitterContainerProps {
  twitterUrl: string
}
const TwitterContainer: FC<TwitterContainerProps> = ({ twitterUrl }) => {
  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://platform.twitter.com/widgets.js"   
    document.getElementsByClassName("twitter-embed")[0].appendChild(script)
  }, [])

  return (
    <section className="twitterContainer">
      <div className="twitter-embed">
        <a
          className="twitter-timeline"
          href={
            twitterUrl.includes("https://")
              ? twitterUrl
              : `https://${twitterUrl}`
          }
          data-tweet-limit="5"
          data-dnt="true"
          // data-height="700"
          data-chrome="transparent"
        >
        </a>
      </div>
    </section>
  )
}

export default TwitterContainer
