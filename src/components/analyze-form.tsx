"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Upload, Camera, X } from "lucide-react"
import Image from "next/image"

const formSchema = z.object({
    crop_type: z.string().min(2, "Crop type is required"),
    location: z.string().min(2, "Location is required"),
})

interface AnalyzeFormProps {
    onAnalysisComplete: (data: any) => void
}

export function AnalyzeForm({ onAnalysisComplete }: AnalyzeFormProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [capturedImage, setCapturedImage] = useState<string | null>(null)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(formSchema),
    })

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setSelectedFile(file)
            
            // Create preview
            const reader = new FileReader()
            reader.onload = (event) => {
                setCapturedImage(event.target?.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const clearImage = () => {
        setCapturedImage(null)
        setSelectedFile(null)
    }

    const onSubmit = async (data: any) => {
        if (!selectedFile) {
            alert("Please capture or upload an image first")
            return
        }

        setIsLoading(true)
        try {
            const formData = new FormData()
            formData.append("crop_type", data.crop_type)
            formData.append("location", data.location)
            formData.append("image", selectedFile)

            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
            const response = await axios.post(`${apiUrl}/analyze`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })

            onAnalysisComplete(response.data)
        } catch (error: any) {
            console.error("Analysis failed", error)
            const errorMessage = error.response?.data?.error || error.message || "Analysis failed. Please try again."
            alert(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>New Analysis</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="crop_type">Crop Type</Label>
                        <Input id="crop_type" placeholder="e.g., Tomato, Corn" {...register("crop_type")} />
                        {errors.crop_type && <p className="text-sm text-red-500">{errors.crop_type.message as string}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input id="location" placeholder="e.g., Iowa, USA" {...register("location")} />
                        {errors.location && <p className="text-sm text-red-500">{errors.location.message as string}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label>Leaf Image</Label>
                        
                        {/* Image capture/upload options */}
                        {!capturedImage && (
                            <div className="grid grid-cols-2 gap-2">
                                <label htmlFor="camera-capture" className="w-full">
                                    <div className="flex items-center justify-center w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
                                        <Camera className="mr-2 h-4 w-4" />
                                        Capture Photo
                                    </div>
                                </label>
                                <label htmlFor="file-upload" className="w-full">
                                    <div className="flex items-center justify-center w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
                                        <Upload className="mr-2 h-4 w-4" />
                                        Upload File
                                    </div>
                                </label>
                            </div>
                        )}

                        <input
                            id="camera-capture"
                            type="file"
                            accept="image/*"
                            capture="environment"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                        
                        <input
                            id="file-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                        />

                        {/* Image preview */}
                        {capturedImage && (
                            <div className="relative">
                                <div className="relative w-full h-64 rounded-lg border overflow-hidden">
                                    <Image
                                        src={capturedImage}
                                        alt="Captured/Uploaded"
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    onClick={clearImage}
                                    className="mt-2 w-full"
                                >
                                    <X className="mr-2 h-4 w-4" />
                                    Remove Image
                                </Button>
                            </div>
                        )}
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading || !selectedFile}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Analyzing...
                            </>
                        ) : (
                            <>
                                <Upload className="mr-2 h-4 w-4" />
                                Analyze Image
                            </>
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
