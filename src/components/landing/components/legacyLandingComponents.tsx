import React from "react"
// import { GA_EVENT_SEARCH_FROM_HOMEPAGE, trackEvent } from "lib/GoogleAnalytics"

const legacySearch = () => {
  // const [search, setSearch] = useState<string>("")

  // const searchHandler = () => {
  //   router.push(`/search?query=${search}`)
  //   trackEvent({
  //     action: GA_EVENT_SEARCH_FROM_HOMEPAGE,
  //     category: "",
  //     label: "Searched from Homepage banner",
  //     value: search
  //   })
  // }

  //   {categories?.map((category) => (
  //     <Button
  //       key={category?.name}
  //       variant={
  //         selectedCategory === category?.name ? "default" : "outlined"
  //       }
  //       title={category?.name}
  //       titleClassName={
  //         selectedCategory === category?.name ? "text-white" : "text-black"
  //       }
  //       className={
  //         selectedCategory !== category?.name ? "" : "bg-neutral-600"
  //       }
  //       endIcon={getCategoryIcon(
  //         category?.name,
  //         selectedCategory === category?.name ? "text-white" : "text-black"
  //       )}
  //       onClick={() => {
  //         if (category?.name === selectedCategory) {
  //           setSelectedCategory("")
  //         } else {
  //           setSelectedCategory(category?.name)
  //         }
  //       }}
  //     />
  //   ))}
  // </div> */}

  // const getCategoryIcon = (category: string, className: string) => {
  //   switch (category) {
  //     case "Crypto & Blockchain":
  //       return <BlockchainIcon className={className} />
  //     case "Product & App":
  //       return <ProductIcon className={className} />
  //     case "Movies":
  //       return <MoviesIcon className={className} />
  //     case "Books":
  //       return <BooksIcon className={className} />
  //     case "Events":
  //       return <EventsIcon className={className} />
  //     default:
  //       return <BlockchainIcon className={className} />
  //   }
  // }

  return (
    <div>
      {/* {tabs.map((t) => t.link).includes(router.pathname) && (
            <div className="flex rounded-full cursor-pointer bg-background-muted text-secondary-500">
              {tabs.map((item) => (
                <div
                  key={item.name}
                  className={`flex items-center gap-1 sm:gap-2 py-[6px] px-2 sm:px-3 rounded-full text-xs sm:text-sm font-[500] ${
                    currentNavbarTab === item.name &&
                    "bg-secondary-700 text-white"
                  }`}
                  onClick={() => {
                    setCurrentNavbarTab(item.name)
                    router.push(item.link)
                  }}
                >
                  {item.icon}
                  {item.name}
                </div>
              ))}
            </div>
          )} */}
      {/*   <div
        style={{
          backgroundImage: `url(${LandingBackground.src})`
        }}
        className="h-auto lg:h-[250px] w-full grid place-items-center"
      >
        <div className="h-[180px] sm:h-[184px] sm:px-14 w-full lg:w-[880px] bg-transparent lg:bg-background-semi-transparent grid place-items-center">
          <div className="w-full   px-10 sm:px-0 flex flex-col justify-center items-center">
            <div className="flex w-full">
              <Input
                className="flex-grow"
                inputClassName="!h-[48px] !rounded-r-none w-full"
                type="text"
                placeholder="What do you want to review today?"
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && search) {
                    searchHandler()
                  }
                }}
              />
              <div
                className="bg-primary w-[97px] h-[48px] mt-1 rounded-r-[5px] text-white grid place-items-center cursor-pointer"
                onClick={() => {
                  if (search) {
                    searchHandler()
                  }
                }}
              >
                <SearchIcon />
              </div>
            </div>
            {/* <div className="gap-2 mt-0 lg:mt-4 hidden lg:flex">
              {categories?.map((category) => (
                <Button
                  key={category?.name}
                  variant={
                    selectedCategory === category?.name ? "default" : "outlined"
                  }
                  title={category?.name.replace("Crypto & ", "")}
                  titleClassName="text-white"
                  className={
                    selectedCategory !== category?.name ? "bg-neutral-600" : ""
                  }
                  endIcon={getCategoryIcon(category?.name, "text-white")}
                  onClick={() => {
                    if (category?.name === selectedCategory) {
                      setSelectedCategory("")
                    } else {
                      setSelectedCategory(category?.name)
                    }
                  }}
                />
              ))}
            </div> 
          </div>
        </div>
   </div>  */}
    </div>
  )
}

export default legacySearch
