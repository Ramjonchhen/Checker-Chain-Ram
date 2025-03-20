import ReactPaginate from "react-paginate"

interface Props {
  totalData: number
  currentLimit: number
  onPageChange: (pageNo: number) => void
  currentPage: number
}

const pageItemClassName =
  "bg-white rounded h-8 w-8 grid place-items-center border border-[#E9E9EB]"

const pageLinkClassName =
  "h-full w-full grid place-items-center text-xs font-medium leading-5 text-neutral-900"

const PaginateBtn = ({
  totalData,
  currentLimit = 10,
  onPageChange,
  currentPage
}: Props) => {
  const calcPageCount = Math.ceil(totalData / currentLimit)

  const handlePageChange = ({ selected }: { selected: number }) => {
    onPageChange(selected + 1)
  }

  return (
    <div>
      <ReactPaginate
        pageCount={calcPageCount}
        onPageChange={handlePageChange}
        forcePage={currentPage - 1}
        className=""
        marginPagesDisplayed={2}
        previousLabel="<"
        nextLabel=">"
        containerClassName="flex gap-2 items-center"
        pageClassName={pageItemClassName}
        pageLinkClassName={pageLinkClassName}
        previousClassName={pageItemClassName}
        previousLinkClassName={pageLinkClassName}
        nextClassName={pageItemClassName}
        nextLinkClassName={pageLinkClassName}
        breakClassName={pageItemClassName}
        breakLinkClassName={pageLinkClassName}
        activeClassName="border border-[#F25972] text-primary-500"
      />
    </div>
  )
}

export default PaginateBtn
