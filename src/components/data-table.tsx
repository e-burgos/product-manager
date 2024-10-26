/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  type SortingState,
  getSortedRowModel,
  getExpandedRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Fragment, useState } from "react";
import { Tag } from "lucide-react";
import { Variant } from "@/lib/db";
import EditVariantModal from "./modals/edit-variant-modal";
import DeleteVariant from "./modals/delete-variant";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [expanded, setExpanded] = useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    onExpandedChange: setExpanded,
    state: {
      sorting,
      expanded,
    },
  });

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      style={{ width: `${header.getSize()}px` }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <Fragment key={row.id}>
                  <TableRow key={row.id + "-group"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                  {row.getIsExpanded() && (
                    <TableRow>
                      <TableCell colSpan={columns.length}>
                        <div className="p-4 bg-muted/50 rounded-md">
                          <div className="flex items-center gap-2 mb-2">
                            <Tag className="h-4 w-4" />
                            <h4 className="font-medium">Variantes</h4>
                          </div>
                          <div className="space-y-2">
                            {/* @ts-ignore */}
                            {row.original?.variants?.map((variant: Variant) => (
                              <div
                                key={variant.id}
                                className="grid grid-cols-4 gap-4 p-2 bg-background -rounded-md"
                              >
                                <div>
                                  <span className="font-medium">
                                    {variant.title}
                                  </span>
                                </div>
                                <div className="text-muted-foreground">
                                  {variant.description}
                                </div>
                                <div className="text-right">
                                  {new Intl.NumberFormat("es-AR", {
                                    style: "currency",
                                    currency: "ARS",
                                  }).format(variant.amount)}
                                </div>
                                <div className="text-right">
                                  <DeleteVariant variant={variant} />
                                  <EditVariantModal variant={variant} />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 1}
                  className="h-24 text-center"
                >
                  No hay resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          className="p-2"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="p-2"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
}
