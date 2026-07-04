"use client";
import {
	ColumnFiltersState,
	OnChangeFn,
	SortingState,
	VisibilityState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

import { ReactNode, useEffect, useMemo, useRef, useState } from "react";

import { PER_PAGES } from "@/lib/constants";
import { ChevronDown, Loader } from "lucide-react";
import { Button } from "./ui/button";

export interface IPagination{
	total: number;
	page: number;
	pages: number;
    has_next: boolean;
    has_previous: boolean;
}

// Checkbox component for individual rows
const IndeterminateCheckbox = ({
	indeterminate,
	className = '',
	...rest
}: {
	indeterminate?: boolean;
	className?: string;
} & React.HTMLProps<HTMLInputElement>) => {
	const ref = useRef<HTMLInputElement>(null!);

	useEffect(() => {
		if (typeof indeterminate === 'boolean') {
			ref.current.indeterminate = !rest.checked && indeterminate;
		}
	}, [ref, indeterminate, rest.checked]);

	return (
		<div className={`relative ${className} `}>
		<input
			type="checkbox"
			ref={ref}
			className="absolute opacity-0 h-5 w-5 cursor-pointer mt-0 z-9"
			{...rest}
		/>
		<div
			className={`mr-2 flex h-4 w-4 items-center justify-center rounded border ${
			rest?.checked
				? "border-green-800 bg-green-800"
				: "border-green-600"
			}`}
		>
			<span className={`opacity-0 ${rest?.checked && "!opacity-100"}`}>
			<svg
				width="11"
				height="8"
				viewBox="0 0 11 8"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
				d="M10.0915 0.951972L10.0867 0.946075L10.0813 0.940568C9.90076 0.753564 9.61034 0.753146 9.42927 0.939309L4.16201 6.22962L1.58507 3.63469C1.40401 3.44841 1.11351 3.44879 0.932892 3.63584C0.755703 3.81933 0.755703 4.10875 0.932892 4.29224L0.932878 4.29225L0.934851 4.29424L3.58046 6.95832C3.73676 7.11955 3.94983 7.2 4.1473 7.2C4.36196 7.2 4.55963 7.11773 4.71406 6.9584L10.0468 1.60234C10.2436 1.4199 10.2421 1.1339 10.0915 0.951972ZM4.2327 6.30081L4.2317 6.2998C4.23206 6.30015 4.23237 6.30049 4.23269 6.30082L4.2327 6.30081Z"
				fill="white"
				stroke="white"
				strokeWidth="0.4"
				/>
			</svg>
			</span>
		</div>
		</div>
	);
};

// Pagination helper function to generate page numbers with ellipsis
const getPaginationRange = (currentPage: number, totalPages: number) => {
	const delta = 2; // Number of pages to show on each side of current page
	const range: (number | string)[] = [];
	const rangeWithDots: (number | string)[] = [];

	// Always show first page
	range.push(1);

	// Calculate start and end of the range around current page
	for (let i = currentPage - delta; i <= currentPage + delta; i++) {
		if (i > 1 && i < totalPages) {
			range.push(i);
		}
	}

	// Always show last page
	if (totalPages > 1) {
		range.push(totalPages);
	}

	// Add ellipsis where there are gaps
	let prev = 0;
	for (const i of range) {
		if (typeof i === 'number') {
			if (prev && i - prev > 1) {
				rangeWithDots.push('...');
			}
			rangeWithDots.push(i);
			prev = i;
		}
	}

	return rangeWithDots;
};

function CustomTable({
	columns,
	data,
	isLoading = false,
	handlePaginationChange,
	count = 0,
	setColumnFilters = () => { },
    currentPage = 1,
	pagination,
	setPerPage,
	perPage,
	searchFilter,
	enableRowSelection = false,
	onRowSelectionChange,
	selectedRows,
	bulkActions
}: {
	columns: any[];
	data: any[];
	isLoading?: boolean;
	handlePaginationChange?: (page: number) => void;
	count?: number;
	setColumnFilters?: OnChangeFn<ColumnFiltersState>;
    currentPage?: number
	pagination?: IPagination;
	setPerPage?: (page: number) => void;
	perPage: number
	searchFilter?: ReactNode
	enableRowSelection?: boolean;
	onRowSelectionChange?: (selectedRows: any) => void;
	selectedRows?: any;
	bulkActions?: (selected: any[]) => void;
}) {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
	const [currentIndex, setCurrentIndex] = useState<number>(1)
	const [internalRowSelection, setInternalRowSelection] = useState({});

	// Use external selectedRows if provided, otherwise use internal state
	const rowSelection = selectedRows !== undefined ? (selectedRows || {}) : internalRowSelection;

	// Clean up invalid selections when data changes
	useEffect(() => {
		if (!enableRowSelection || !rowSelection || Object.keys(rowSelection).length === 0) return;
		
		const currentRowIds = new Set(data.map((row, index) => {
			const id = row?.id ?? index;
			return typeof id === 'string' ? id : id.toString();
		}));
		
		const selectionKeys = Object.keys(rowSelection as Record<string, any>);
		const hasInvalidSelection = selectionKeys.some(key => 
			!currentRowIds.has(key)
		);
		
		if (hasInvalidSelection) {
			const validSelection: Record<string, any> = {};
			selectionKeys.forEach(key => {
				if (currentRowIds.has(key)) {
					validSelection[key] = (rowSelection as Record<string, any>)[key];
				}
			});
			
			if (selectedRows !== undefined && onRowSelectionChange) {
				onRowSelectionChange(validSelection);
			} else {
				setInternalRowSelection(validSelection);
			}
		}
	}, [data, enableRowSelection]);

	// Handle row selection changes with validation
	const handleRowSelectionChange = (updaterOrValue: any) => {
		let newSelection;
		if (typeof updaterOrValue === 'function') {
			newSelection = updaterOrValue(rowSelection || {});
		} else {
			newSelection = updaterOrValue || {};
		}
		
		// Validate selection against current data
		const validSelection: Record<string, any> = {};
		const currentRowIds = new Set(data.map((row, index) => {
			const id = row?.id ?? index;
			return typeof id === 'string' ? id : id.toString();
		}));
		
		Object.keys(newSelection).forEach(key => {
			if (currentRowIds.has(key)) {
				validSelection[key] = newSelection[key];
			}
		});
		
		// If external selectedRows is provided, notify parent
		if (selectedRows !== undefined && onRowSelectionChange) {
			onRowSelectionChange(validSelection);
		} else {
			// Otherwise update internal state
			setInternalRowSelection(validSelection);
		}
	};

	// Create columns with selection column if enabled
	const columnsWithSelection = useMemo(() => {
		if (!enableRowSelection) return columns;

		const selectionColumn = {
			id: 'select',
			header: ({ table }: { table: any }) => (
				<IndeterminateCheckbox
					{...{
						checked: table.getIsAllRowsSelected(),
						indeterminate: table.getIsSomeRowsSelected(),
						onChange: table.getToggleAllRowsSelectedHandler(),
					}}
				/>
			),
			cell: ({ row }: { row: any }) => (
				<div className="">
					<IndeterminateCheckbox
						{...{
							checked: row.getIsSelected(),
							disabled: !row.getCanSelect(),
							indeterminate: row.getIsSomeSelected(),
							onChange: row.getToggleSelectedHandler(),
						}}
					/>
				</div>
			),
			size: 50,
		};

		return [selectionColumn, ...columns];
	}, [columns, enableRowSelection]);

	const table = useReactTable({
		data,
		columns: columnsWithSelection,
		rowCount: count,
		initialState: {
			pagination: { pageIndex: 0, pageSize: perPage },
		},
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: handleRowSelectionChange,
		enableRowSelection: enableRowSelection,
		getRowId(originalRow, index) {
			return originalRow?.id ?? index;
		},
		state: {
			sorting,
			columnVisibility,
			rowSelection: rowSelection || {},
			pagination: {
				pageSize: perPage,
				pageIndex: 0,
			},
		},
	});

	function getDataCount(){
		let totalRecords = 0
		let currentTotalCount = 0
		let currentPageIndex = currentPage - 1;
		if(pagination?.total){
			totalRecords = pagination.total
		}else{
			totalRecords = table.getPrePaginationRowModel().rows.length;
			currentPageIndex = table.getState().pagination.pageIndex;
		}
		const currentPageRows = table.getRowModel().rows.length;
		currentTotalCount = currentPageRows === totalRecords ? totalRecords : (currentPageIndex * perPage) + currentPageRows;

		return `1 - ${currentTotalCount} of ${totalRecords} records`
	}

	// Get selected row data
	const getSelectedRowData = () => {
		try {
			return table.getSelectedRowModel().rows.map(row => row.original);
		} catch (error) {
			console.warn('Error getting selected row data:', error);
			return [];
		}
	};

	// Clear selection helper
	const clearSelection = () => {
		if (selectedRows !== undefined && onRowSelectionChange) {
			onRowSelectionChange({});
		} else {
			setInternalRowSelection({});
		}
	};

	// Get pagination range with ellipsis
	const paginationRange = useMemo(() => {
		return getPaginationRange(currentPage, table.getPageCount());
	}, [currentPage, table.getPageCount()]);

	return (
		<div className=" bg-white rounded-lg">
			{searchFilter}
			{/* Selection Info Bar */}
			{enableRowSelection && rowSelection && Object.keys(rowSelection).length > 0 && (
				<div className="flex items-center justify-between px-6 py-3 bg-blue-50 dark:bg-blue-900/20 border-b dark:border-dark-3">
					<div className="flex items-center space-x-4">
						<span className="text-sm font-medium text-green-700 dark:text-blue-300">
							{Object.keys(rowSelection || {}).length} row(s) selected
						</span>
						<button
							onClick={clearSelection}
							className="cursor-pointer text-sm text-red-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
						>
							Clear selection
						</button>
					</div>
					<div className="flex space-x-2">
						{bulkActions && (() => {
							const result = bulkActions(getSelectedRowData());
							return result !== undefined ? result : null;
						})()}
					</div>
				</div>
			)}

			<div className="">
				<table role="table" className="rounded-top-table datatable-table w-full border-0">
					<thead className={`bg-[#0B3D19] text-white h-12 text-sm font-semibold`}>
						{table.getHeaderGroups().map((headerGroup, idx) => (
							<tr key={`trh-${idx}`} role="row" >
								{headerGroup.headers.map((header, idx) => {
									return (
										<th
                                            role="columnheader"
											key={`th-${idx}`}
											className="text-nowrap border-0 text-left px-4 text-xs uppercase tracking-wide"
										>
											{header.isPlaceholder
												? null
												: flexRender(
													header.column.columnDef.header,
													header.getContext()
												)}
										</th>
									);
								})}
							</tr>
						))}
					</thead>
					<tbody role="rowgroup" className="text-[#334155] font-medium">
						{isLoading ? (
							<tr className="h-[50px]">
								<td
									colSpan={columnsWithSelection.length}
									className="w-full flex items-center justify-center text-center py-5"
								>
									Loading<Loader className="animate-spin"/>
								</td>
							</tr>
						) : table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row, idx) => (
								<tr
									key={`tr-${idx}`}
									className={`text-sm h-[68px] border-b border-[#F1F5F9] ${
										(() => {
											try {
												return row && typeof row.getIsSelected === 'function' && row.getIsSelected()
													? 'bg-blue-50 dark:bg-blue-900/20' 
													: 'hover:bg-[#F8FAFC]';
											} catch (error) {
												console.warn('Error checking row selection state:', error);
												return 'hover:bg-[#F8FAFC]';
											}
										})()
									}`}
									data-state={(() => {
										try {
											return row && typeof row.getIsSelected === 'function' && row.getIsSelected() ? "selected" : undefined;
										} catch (error) {
											return error;
										}
									})()}
								>
									{row.getVisibleCells().map((cell) => (
										<td
											key={cell.id}
											className="content-center px-4 "
										>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</td>
									))}
								</tr>
							))
						) : (
							<tr className="h-[50px]">
								<td
									colSpan={columnsWithSelection.length}
									className="text-center"
								>
									No results.
								</td>
							</tr>
						)}
					</tbody>
				</table>
				{(table.getRowModel().rows?.length && setPerPage)? 
					<div className="flex justify-between px-4 py-5">
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="outline" className="w-[136px] bg-white border-gray-200 text-gray-800 flex items-center gap-2">
									{perPage} per page
									<ChevronDown/>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent>
								{PER_PAGES.map((page, idx) => (
									<DropdownMenuItem key={idx} onClick={() => setPerPage(page)}>{page} per page</DropdownMenuItem>
								))}
							</DropdownMenuContent>
						</DropdownMenu>
						<div>
							{(!isLoading && handlePaginationChange)  && (
								<div className="">
									<div className="flex items-center gap-2">
										<div className="flex text-xs text-nowrap text-[#475569] font-medium">{getDataCount()}</div>
										<Pagination className="border rounded-lg h-[35px]">
											<PaginationContent>
												<PaginationItem 
													onClick={() => {
														if (currentIndex === 1) return;
														setCurrentIndex((prev) => {
															const newIndex = prev - 1
															handlePaginationChange(newIndex)
															return newIndex;
														})
													}}
												>
													<PaginationPrevious href="#" />
												</PaginationItem>
												
												{paginationRange.map((page, idx) => {
													if (page === '...') {
														return (
															<PaginationItem key={`ellipsis-${idx}`}>
																<PaginationEllipsis />
															</PaginationItem>
														);
													}
													return (
														<PaginationItem 
															key={idx} 
															onClick={() => {
																const pageNum = page as number;
																setCurrentIndex(pageNum);
																handlePaginationChange(pageNum);
															}}
														>
															<PaginationLink 
																href="#" 
																isActive={currentPage === page} 
																size={"sm"}
															>
																{page}
															</PaginationLink>
														</PaginationItem>
													);
												})}

												<PaginationItem onClick={() => {
													const total = table.getPageCount()
													if (currentIndex === total) return;

													setCurrentIndex((prev) => {
														const newIndex = prev + 1
														handlePaginationChange(newIndex)
														return newIndex;
													})
												}}>
													<PaginationNext href="#" />
												</PaginationItem>
											</PaginationContent>
										</Pagination>
									</div>
								</div>
							)}
						</div>
					</div> :""
				}
			</div>
        </div>
    )}
        
export default CustomTable;