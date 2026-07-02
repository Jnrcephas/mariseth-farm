"use client"

import type React from "react"

import { useState, useRef, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { X, FileImage } from "lucide-react"
import Image from "next/image"

export interface UploadedImage {
  id: string
  file: File
  base64: string
  preview: string
}

export default function UploadImagesCardCol1({handleImageSelect, id, title}:{handleImageSelect: (
  id: number, images: any[]) => void; 
  id: number; title: string}) {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(()=>{
    const images = uploadedImages?.map((item) => item?.base64)
    handleImageSelect(id, images)
  },[uploadedImages])


  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (error) => reject(error)
    })
  }

  const validateFile = (file: File): boolean => {
    const validTypes = ["image/png", "image/jpeg", "image/jpg", "application/pdf"]
    const maxSize = 5 * 1024 * 1024 // 5MB

    if (!validTypes.includes(file.type)) {
      alert(`Invalid file type: ${file.name}. Supported formats: PNG, JPEG, PDF`)
      return false
    }

    if (file.size > maxSize) {
      alert(`File too large: ${file.name}. Maximum size is 5MB`)
      return false
    }

    return true
  }

  const processFiles = async (files: FileList) => {
    setIsUploading(true)
    const validFiles = Array.from(files).filter(validateFile)

    const newImages: UploadedImage[] = []

    for (const file of validFiles) {
      try {
        const base64 = await convertToBase64(file)
        const preview = file.type.startsWith("image/") ? base64 : "/placeholder.svg?height=100&width=100"

        newImages.push({
          id: Math.random().toString(36).substr(2, 9),
          file,
          base64,
          preview,
        })

        
        
      } catch (error) {
        console.error(`Error processing file ${file.name}:`, error)
        alert(`Error processing file: ${file.name}`)
      }
    }

    setUploadedImages((prev: any) => [...prev, ...newImages])
    setIsUploading(false)
  }

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      processFiles(files)
    }
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      processFiles(files)
    }
    // Reset input value to allow selecting the same file again
    e.target.value = ""
  }

  const removeImage = (id: string) => {
    setUploadedImages((prev: any) => prev.filter((img: any) => img?.id !== id))
  }

  return (
    <div className="grid  grid-cols-1 gap-5">
      <div className="h-[150px] mb-5">
        <h1 className="text-sm font-semibold mb-2">{title}</h1>

        {/* Upload Area */}
        <Card
          className={`h-[150px] p-0 gap-0 border-2 border-dashed transition-colors ${
            isDragOver ? "border-blue-500 bg-blue-50" : "border-gray-300"
          }`}
        >
          <CardContent className=" h-full flex items-center justify-center">
            <div
              className="text-center cursor-pointer"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="w-13 h-13 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <FileImage className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-sm font-medium mb-2 ">Drag and drop or choose image to upload</p>
              <p className="text-xs text-gray-500">Supported formats: PNG, JPEG, PDF (5MB max file size)</p>
              {isUploading && <p className="text-sm text-blue-600 mt-2">Processing files...</p>}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/png,image/jpeg,image/jpg,application/pdf"
              onChange={handleFileSelect}
              className="hidden"
            />
          </CardContent>
        </Card>
      </div>

      {/* Uploaded Images */}
      {uploadedImages.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {uploadedImages.map((image) => (
              <Card key={image.id} className="relative py-2">
                <CardContent className="p-2 py-0">
                  <div className="relative mb-1">
                    {image.file.type.startsWith("image/") ? (
                      <Image
                        src={image.preview || "/placeholder.svg"}
                        alt={image.file.name}
                        width={200}
                        height={150}
                        className="w-full h-32 object-cover rounded"
                      />
                    ) : (
                      <div className="w-full h-32 bg-gray-100 rounded flex items-center justify-center">
                        <FileImage className="w-8 h-8 text-gray-400" />
                        <span className="ml-2 text-sm text-gray-600">PDF</span>
                      </div>
                    )}
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6"
                      onClick={() => removeImage(image.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-medium truncate" title={image.file.name}>
                      {image.file.name}
                    </p>
                    <p className="text-xs text-gray-500">{(image.file.size / 1024 / 1024).toFixed(2)} MB</p>

                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
      )}

    </div>
  )
}
