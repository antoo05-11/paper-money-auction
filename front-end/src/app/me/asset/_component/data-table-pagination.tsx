import {
    ChevronLeftIcon,
    ChevronRightIcon,
    ArrowLeftIcon,
    ArrowRightIcon,
  } from "lucide-react"

  import { type Table } from "@tanstack/react-table"
  
  import { Button } from "@/components/ui/button"

  
  interface DataTablePaginationProps<TData> {
    table: Table<TData>
    pageSizeOptions?: number[]
  }
  
  export function DataTablePagination<TData>({
    table,
    pageSizeOptions = [10, 20, 30, 40, 50],
  }: DataTablePaginationProps<TData>) {
    return (
      <div className="flex w-full flex-col items-center justify-between gap-4 overflow-auto px-2 py-1 sm:flex-row sm:gap-8">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8">
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              aria-label="Go to first page"
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button
              aria-label="Go to previous page"
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button
              aria-label="Go to next page"
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button
              aria-label="Go to last page"
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>
    )
  }