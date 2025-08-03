"use client"

import { Button } from "@/components/ui/Button"
import { Select } from "@/components/ui/Select"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { PaginationParams } from "@/schemas/common.schema"
import { PAGINATION_CONFIG } from "@/constants/config"

interface PaginationProps {
    pagination: PaginationParams
    onPageChange: (page: number) => void
    onPageSizeChange: (pageSize: number) => void
    total?: number
}

export function Pagination({
    pagination,
    onPageChange,
    onPageSizeChange,
    total = 0
}: PaginationProps) {
    const { page, pageSize } = pagination
    const totalPages = Math.ceil(total / pageSize)
    const startItem = (page - 1) * pageSize + 1
    const endItem = Math.min(page * pageSize, total)

    const pageSizeOptions = PAGINATION_CONFIG.PAGE_SIZE_OPTIONS.map(size => ({
        value: size.toString(),
        label: `${size} / trang`
    }))

    return (
        <div className="flex items-center justify-between px-2">
            <div className="flex-1 text-sm text-muted-foreground">
                Hiển thị {startItem} đến {endItem} trong tổng số {total} kết quả
            </div>
            <div className="flex items-center space-x-6 lg:space-x-8">
                <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium">Số lượng mỗi trang</p>
                    <Select
                        value={pageSize.toString()}
                        onValueChange={(value) => onPageSizeChange(Number(value))}
                    >
                        {pageSizeOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </Select>
                </div>
                <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                    Trang {page} / {totalPages}
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        className="hidden h-8 w-8 p-0 lg:flex"
                        onClick={() => onPageChange(1)}
                        disabled={page <= 1}
                    >
                        <span className="sr-only">Về trang đầu</span>
                        <ChevronsLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => onPageChange(page - 1)}
                        disabled={page <= 1}
                    >
                        <span className="sr-only">Trang trước</span>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => onPageChange(page + 1)}
                        disabled={page >= totalPages}
                    >
                        <span className="sr-only">Trang sau</span>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="hidden h-8 w-8 p-0 lg:flex"
                        onClick={() => onPageChange(totalPages)}
                        disabled={page >= totalPages}
                    >
                        <span className="sr-only">Đến trang cuối</span>
                        <ChevronsRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
} 