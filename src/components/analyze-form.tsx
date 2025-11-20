"use client"

import { useState, useRef } from "react"
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
    const [uploadMethod, setUploadMethod] = useState<'upload' | 'capture'>('upload')
    const videoRef = useRef<HTMLVideoElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [isCameraActive, setIsCameraActive] = useState(false)
    
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(formSchema),
    })

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: 'environment' } // Use back camera on mobile
            })
            if (videoRef.current) {
                videoRef.current.srcObject = stream
                setIsCameraActive(true)
                setUploadMethod('capture')
            }
        } catch (error) {
            console.error("Camera access denied", error)
            alert("Unable to access camera. Please check permissions.")
        }
    }

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream
            stream.getTracks().forEach(track => track.stop())
            videoRef.current.srcObject = null
            setIsCameraActive(false)
        }
    }

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current
            const canvas = canvasRef.current
            
            canvas.width = video.videoWidth
            canvas.height = video.videoHeight
            
            const ctx = canvas.getContext('2d')
            if (ctx) {
                ctx.drawImage(video, 0, 0)
                const imageDataUrl = canvas.toDataURL('image/jpeg')
                setCapturedImage(imageDataUrl)
                
                // Convert to file
                canvas.toBlob((blob) => {
                    if (blob) {
                        const file = new File([blob], 'captured-image.jpg', { type: 'image/jpeg' })
                        setSelectedFile(file)
                    }
                }, 'image/jpeg')
                
                stopCamera()
            }
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setSelectedFile(file)
            setCapturedImage(null)
            setUploadMethod('upload')
            
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
        stopCamera()
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

            const response = await axios.post("http://localhost:3001/analyze", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })

            onAnalysisComplete(response.data)
        } catch (error) {
            console.error("Analysis failed", error)
            alert("Analysis failed. Please try again.")
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
                        {!capturedImage && !isCameraActive && (
                            <div className="grid grid-cols-2 gap-2">
                                <Button 
                                    type="button" 
                                    variant="outline" 
                                    onClick={startCamera}
                                    className="w-full"
                                >
                                    <Camera className="mr-2 h-4 w-4" />
                                    Capture Photo
                                </Button>
                                <Button 
                                    type="button" 
                                    variant="outline" 
                                    onClick={() => document.getElementById('file-upload')?.click()}
                                    className="w-full"
                                >
                                    <Upload className="mr-2 h-4 w-4" />
                                    Upload File
                                </Button>
                            </div>
                        )}

                        <input
                            id="file-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                        />

                        {/* Camera view */}
                        {isCameraActive && (
                            <div className="relative">
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                    className="w-full rounded-lg border"
                                />
                                <div className="flex gap-2 mt-2">
                                    <Button 
                                        type="button" 
                                        onClick={capturePhoto}
                                        className="flex-1"
                                    >
                                        <Camera className="mr-2 h-4 w-4" />
                                        Capture
                                    </Button>
                                    <Button 
                                        type="button" 
                                        variant="outline"
                                        onClick={stopCamera}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Image preview */}
                        {capturedImage && !isCameraActive && (
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

                        <canvas ref={canvasRef} className="hidden" />
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
