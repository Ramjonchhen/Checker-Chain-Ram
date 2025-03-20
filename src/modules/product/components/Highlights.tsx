import React, { FC, useEffect, useRef, useState } from "react"
// import { Carousel, CarouselItem } from "./Carousel"
import { EmptyState, Button, Modal, Dropdown } from "components"
import { HighlightsForm } from "./HighlightsForm"
import { Carousel, CarouselItem } from "./Carousel"
import { useProductStore } from "stores/product"
import { useHighlightStore } from "stores/highlights"
import { getBaseBackendImageUrl } from "utils"
import { More } from "assets/icons"
import { useClickOutside } from "hooks/useOutsideClick"

interface Props {
  isProductCreate?: boolean
}
export const Highlights: FC<Props> = ({ isProductCreate = false }) => {
  const [isHighlightModalEnable, setIsHighlightModalEnable] = useState(false)
  const { product } = useProductStore()
  const { highlight, getHighlight, removeHighlight } = useHighlightStore()
  const [showDropdown, setShowDropdown] = useState(false)
  const dropDownRef = useRef<HTMLDivElement>(null)
  const [showDialog, setShowDialog] = React.useState(false)

  useEffect(() => {
    if (product._id) {
      getHighlight(product._id)
    }
  }, [product._id, getHighlight])

  useClickOutside(dropDownRef, {
    onClickOutside: () => {
      setShowDropdown(false)
    }
  })
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <span className="text-neutral-900 text-base font-semibold leading-6">
          Highlights
        </span>
        {product.isOwner &&
          !isProductCreate &&
          (highlight.description || highlight.images.length > 0) && (
            <div ref={dropDownRef} className="relative">
              <More
                className="cursor-pointer"
                onClick={() => setShowDropdown(!showDropdown)}
              />
              <Dropdown
                className="bg-white border border-separate w-[180px] -mt-4 rounded-lg p-1 shadow-md"
                show={showDropdown}
                position="right"
              >
                <div
                  className="hover:bg-primary-50 p-2 cursor-pointer text-base w-full"
                  onClick={() => {
                    setShowDropdown(false)
                    setIsHighlightModalEnable(true)
                  }}
                >
                  Edit Highlight
                </div>
                <div
                  className="hover:bg-primary-50 p-2 cursor-pointer text-base w-full"
                  onClick={() => {
                    setShowDialog(true)
                    setShowDropdown(false)
                  }}
                >
                  Remove Highlight
                </div>
              </Dropdown>
              <Modal
                closeButton
                display={showDialog}
                onHide={() => {
                  setShowDialog(false)
                }}
                className="!min-w-[340px] min-h-[120px] px-5"
              >
                <div className="flex gap-6 flex-col">
                  <div className="text-md font-semibold">
                    {" "}
                    {"Are you sure ?"}{" "}
                  </div>
                  <div className="flex gap-2 justify-end items-center">
                    <Button
                      title="Confirm"
                      onClick={() => {
                        removeHighlight(product._id).then(() => {
                          setShowDropdown(false)
                          setShowDialog(false)
                        })
                      }}
                    />
                    <Button
                      title="Cancel"
                      variant="outlined"
                      onClick={() => {
                        setShowDialog(false)
                      }}
                    />
                  </div>
                </div>
              </Modal>
            </div>
          )}
      </div>

      {!isProductCreate && highlight.description && (
        <p className="m-0 p-0 text-neutral-700">
          {highlight.description || ""}
        </p>
      )}
      {!isProductCreate && (
        <Carousel>
          {highlight?.images.map((each) => (
            <CarouselItem
              key={each}
              image={`${getBaseBackendImageUrl()}${each}`}
            />
          ))}
        </Carousel>
      )}
      {(!(highlight.description || highlight.images.length > 0) ||
        isProductCreate) && (
        <EmptyState
          className="pt-4 pb-4"
          title="No highlights found."
          message={
            !isProductCreate && product.isOwner
              ? "Upload your first highlights"
              : ""
          }
          button={
            !isProductCreate &&
            product.isOwner && (
              <Button
                type="button"
                onClick={() => {
                  setIsHighlightModalEnable(true)
                }}
                title="Upload Highlights"
                variant="outlined"
              />
            )
          }
        />
      )}
      <Modal
        className="!min-w-[440px]"
        onHide={() => setIsHighlightModalEnable(false)}
        closeButton
        display={isHighlightModalEnable}
      >
        <HighlightsForm closeModal={() => setIsHighlightModalEnable(false)} />
      </Modal>
    </div>
  )
}
