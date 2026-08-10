"use client"

import { useRef, useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Download, FileSpreadsheet, UploadCloud, X, CheckCircle2, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { LoadingLabel } from "@/components/ui/label"
import { BulkUploadOrderType, BulkUploadResponse, useBulkUploadOrders, useDownloadOrderTemplate } from "@/apis/useBulkUpload"

interface BulkUploadModalProps {
  open: boolean
  setOpen: (open: boolean) => void
  type: BulkUploadOrderType
  refetch?: () => void
}

const ACCEPTED_EXTENSIONS = [".xlsx", ".xls"]

export default function BulkUploadModal({ open, setOpen, type, refetch }: BulkUploadModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [result, setResult] = useState<BulkUploadResponse | null>(null)
  const [topLevelError, setTopLevelError] = useState<string | null>(null)

  const label = type === "inflow" ? "Inbound" : "Outbound"
  const queryClient = useQueryClient()

  const { mutate: downloadTemplate, isPending: isDownloading } = useDownloadOrderTemplate(type, {
    onError: () => toast.error("Couldn't download the template. Please try again."),
  })

  const { mutate: uploadFile, isPending: isUploading } = useBulkUploadOrders(type, {
    onSuccess: (data) => {
      setResult(data)
      setTopLevelError(null)
      if (data.failed_count === 0) {
        toast.success(`${data.created_count} order${data.created_count === 1 ? "" : "s"} created successfully`)
      }
      // Invalidate rather than relying on a refetch prop, so this works
      // regardless of where the modal is mounted - matches the query key
      // useInflowList/useOutflowList are generated under ("/inflow" and
      // "/outflow" respectively), and invalidateQueries partial-matches
      // on key prefix.
      queryClient.invalidateQueries({ queryKey: [type] })
      refetch?.()
    },
    onError: (error: any) => {
      const message =
        error?.payload?.error ||
        error?.payload?.detail ||
        (typeof error?.payload === "string" ? error.payload : null) ||
        "Something went wrong reading that file. Please check it and try again."
      setTopLevelError(message)
      setResult(null)
    },
  })

  function validateAndSetFile(selected: File) {
    const isValidExt = ACCEPTED_EXTENSIONS.some((ext) => selected.name.toLowerCase().endsWith(ext))
    if (!isValidExt) {
      toast.error("Please upload a .xlsx or .xls file.")
      return
    }
    setFile(selected)
    setResult(null)
    setTopLevelError(null)
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setIsDragOver(false)
    const dropped = e.dataTransfer.files?.[0]
    if (dropped) validateAndSetFile(dropped)
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0]
    if (selected) validateAndSetFile(selected)
    e.target.value = ""
  }

  function handleSubmit() {
    if (!file) return
    uploadFile(file)
  }

  function handleClose(nextOpen: boolean) {
    if (!nextOpen) {
      setFile(null)
      setResult(null)
      setTopLevelError(null)
    }
    setOpen(nextOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bulk Upload {label} Orders</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-4">
            <div>
              <p className="text-sm font-semibold text-black">1. Download the template</p>
              <p className="text-xs text-[#64748B] mt-0.5">
                Fill it in using the reference sheets for valid {type === "inflow" ? "warehouse, farm" : "warehouse, customer"} and product codes.
              </p>
            </div>
            <Button type="button" variant="outline" className="border shrink-0" onClick={() => downloadTemplate()} disabled={isDownloading}>
              <LoadingLabel isLoading={isDownloading}>
                <Download className="h-4 w-4 me-1" /> Template
              </LoadingLabel>
            </Button>
          </div>

          <div>
            <p className="text-sm font-semibold text-black mb-2">2. Upload the filled-in file</p>
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                isDragOver ? "border-[#4A8D34] bg-[#F0FDF4]" : "border-[#E2E8F0]"
              }`}
              onDrop={handleDrop}
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
              onDragLeave={(e) => { e.preventDefault(); setIsDragOver(false) }}
              onClick={() => fileInputRef.current?.click()}
            >
              {file ? (
                <div className="flex items-center justify-center gap-2">
                  <FileSpreadsheet className="h-5 w-5 text-[#4A8D34]" />
                  <span className="text-sm text-black truncate max-w-[260px]">{file.name}</span>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setFile(null); setResult(null); setTopLevelError(null) }}
                    className="text-[#94A3B8] hover:text-[#475569]"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <>
                  <UploadCloud className="h-8 w-8 mx-auto mb-2 text-[#94A3B8]" />
                  <p className="text-sm font-medium text-black">Drag and drop, or click to choose a file</p>
                  <p className="text-xs text-[#64748B] mt-1">.xlsx or .xls</p>
                </>
              )}
              <input ref={fileInputRef} type="file" accept=".xlsx,.xls" onChange={handleFileSelect} className="hidden" />
            </div>
          </div>

          {topLevelError && (
            <div className="flex items-start gap-2 bg-[#FEF2F2] border border-[#FCA5A5] rounded-lg px-4 py-3 text-sm text-[#7F1D1D]">
              <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>{topLevelError}</span>
            </div>
          )}

          {result && (
            <div className="space-y-3">
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1.5 text-[#166534]">
                  <CheckCircle2 className="h-4 w-4" /> {result.created_count} created
                </span>
                {result.failed_count > 0 && (
                  <span className="flex items-center gap-1.5 text-[#B91C1C]">
                    <AlertTriangle className="h-4 w-4" /> {result.failed_count} failed
                  </span>
                )}
              </div>

              {result.failed.length > 0 && (
                <div className="border border-[#FCA5A5] rounded-lg overflow-hidden">
                  <table className="w-full text-xs">
                    <thead className="bg-[#FEF2F2] text-[#7F1D1D]">
                      <tr>
                        <th className="text-left font-semibold px-3 py-2">Order Reference</th>
                        <th className="text-left font-semibold px-3 py-2">Row(s)</th>
                        <th className="text-left font-semibold px-3 py-2">Error</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.failed.map((f, idx) => (
                        <tr key={idx} className="border-t border-[#FCA5A5]/50">
                          <td className="px-3 py-2 align-top font-medium text-black">{f.order_reference}</td>
                          <td className="px-3 py-2 align-top text-[#64748B]">{f.rows.join(", ")}</td>
                          <td className="px-3 py-2 align-top text-[#7F1D1D]">
                            {f.errors.map((err, i) => <div key={i}>{err}</div>)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="ghost" className="border" onClick={() => handleClose(false)}>
            {result ? "Close" : "Cancel"}
          </Button>
          {!result || result.failed_count > 0 ? (
            <Button type="button" onClick={handleSubmit} disabled={!file || isUploading}>
              <LoadingLabel isLoading={isUploading}>
                {result ? "Re-upload" : "Upload"}
              </LoadingLabel>
            </Button>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}