import React from "react"
import { ProductAnnouncement } from "assets/images"
import * as Icons from "assets/icons"

export function Announcements() {
  return (
    <div className="flex flex-col gap-4 pt-4 relative">
      <div className="flex justify-between">
        <span className="block text-neutral-900 text-base font-semibold leading-6">
          Announcements
        </span>
        <Icons.More />
      </div>
      {/* <EmptyState
        className="pt-4 pb-4"
        title="You don’t have any announcements!"
        message="Start creating your announcements today."
        image={EmptyImage2.src}
        button={
          <Button
            type="button"
            onClick={() => {null}}
            title="Create an announcement"
            variant="outlined"
          />
        }
      /> */}

      <span className='block text-neutral-900 font-semibold'>
        CheckerChain is donating $500K for social service
      </span>
      <p className="m-0 p-0 text-neutral-700">
        It is a long established fact that a reader will be distracted by the readable content of a
      </p>
      <img
        alt="product-announcement"
        src={ProductAnnouncement.src}
        className="w-full h-72 object-cover"
      />
    </div>
  )
}
