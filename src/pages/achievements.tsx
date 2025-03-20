import { AcheivementTrophy, CheckerChainIcon } from "assets/icons"
import { Meta, Stats, TabView, Text } from "components"
import { Achievement } from "components/achievement"
import Layout from "layout"
import type { NextPage } from "next"
import { useRouter } from "next/router"
import { useEffect, useRef, useState } from "react"

const Achievements: NextPage = () => {
  const divRef = useRef<HTMLDivElement>(null)
  const [styles, setStyles] = useState({
    locked: {}
  })
  const router = useRouter()
  useEffect(() => {
    if (divRef) {
      setStyles({
        locked: {
          height: `${divRef.current?.scrollHeight}px`
        }
      })
    }
  }, [divRef])
  useEffect(() => {
    router.replace("/")
  }, [router])
  return (
    <Layout>
      <Meta
        title={`Achievements | CheckerChain - Crypto Reviews`}
        url="/achievements"
      />
      <div className="relative">
        <div
          style={styles.locked}
          className="z-10 flex-col text-content-primary text-heading-4 text-center absolute w-full h-full flex justify-center items-center"
        >
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-20 w-20"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <div>Sorry, achievement section is locked for now.</div>
        </div>
      </div>
      <div ref={divRef} className="m-10 p-10 bg-red blur-sm grayscale">
        <Text variant="subtitle" className="font-medium">
          My Achievements
        </Text>
        <div className="mt-16 flex gap-8">
          <Stats
            topText="Total CP Earned"
            // bottomText="End"
            value="2"
            startIcon={<CheckerChainIcon />}
          />
          <Stats
            topText="Achievements"
            // bottomText="End"
            value="20,000 CP"
            startIcon={<AcheivementTrophy />}
          />
        </div>
        <div className="mt-8">
          <TabView
            tabs={[
              {
                title: "All Achievements",
                componet: (
                  <div className="flex h-[450px] gap-3 py-6">
                    <div className="h-full w-[30%]">
                      <Achievement active={true} />
                    </div>
                    <div className="grid grid-cols-4 gap-5 w-[70%]">
                      <div>
                        <Achievement />
                      </div>
                      <div>
                        <Achievement />
                      </div>
                      <div>
                        <Achievement />
                      </div>
                      <div>
                        <Achievement />
                      </div>
                      <div>
                        <Achievement />
                      </div>
                      <div>
                        <Achievement />
                      </div>
                      <div>
                        <Achievement />
                      </div>
                      <div>
                        <Achievement />
                      </div>
                    </div>
                  </div>
                )
              },
              {
                title: "Unlocked Achievements",
                componet: <div>Unlocked Achievements</div>
              },
              {
                title: "Locked Achievements",
                componet: <div>Locked Achievements</div>
              }
            ]}
            type="achievement"
          />
        </div>
      </div>
    </Layout>
  )
}

export default Achievements
