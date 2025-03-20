import NFT1 from "assets/images/avatar/nft/1.png"
import NFT2 from "assets/images/avatar/nft/2.png"
import NFT3 from "assets/images/avatar/nft/3.png"
import NFT4 from "assets/images/avatar/nft/4.png"
import { Button, Text } from "components"
import { FC, useState } from "react"

const nfts = [
  NFT1.src,
  NFT2.src,
  NFT3.src,
  NFT4.src,
  NFT1.src,
  NFT2.src,
  NFT3.src,
  NFT4.src,
  NFT1.src,
  NFT2.src,
  NFT3.src,
  NFT4.src,
  NFT1.src,
  NFT2.src,
  NFT3.src,
  NFT4.src
]

interface SelectFromWalletProps {
  onChange?: () => void
}

export const SelectFromWallet: FC<SelectFromWalletProps> = ({ onChange }) => {
  const [selected, setSelected] = useState(0)
  return (
    <>
      <Text
        className="px-4 text-2xl leading-6 font-medium text-content border-b border-outline-secondary block pb-2"
        variant="body"
      >
        Select from Wallet
      </Text>
      <div
        className={`${"cursor-pointer"} m-6 grid gap-4 grid-cols-3 place-content-center w-[275px] h-[220px] overflow-y-auto`}
      >
        {nfts.map((item, index) => (
          <img
            onClick={() => setSelected(index)}
            src={item}
            key={item + index}
            className={`${
              index === selected ? "border-[3px] border-primary" : ""
            }`}
          />
        ))}
      </div>
      <div className="grid place-content-center gap-y-6">
        <Button
          onClick={() => {
            if (onChange) {
              onChange()
            }
          }}
          className="w-full"
          title="Confirm"
        />
      </div>
    </>
  )
}
