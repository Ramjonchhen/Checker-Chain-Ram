type Props = {
  colsLength: number
}

const LoadingPoolItems = ({ colsLength }: Props) => {
  return (
    <tr className="text-neutral-900 font-medium">
      <td
        colSpan={colsLength}
        className="whitespace-nowrap text-sm font-medium bg-white"
      >
        <div className="flex items-center justify-center mt-2 px-8 pt-6 pb-10 border-b border-separator w-full">
          Loading...
        </div>
      </td>
    </tr>
  )
}

export default LoadingPoolItems
