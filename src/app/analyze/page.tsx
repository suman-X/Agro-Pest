"use client"

import { useState } from "react"
import { AnalyzeForm } from "@/components/analyze-form"
import { AnalysisResult } from "@/components/analysis-result"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function AnalyzePage() {
    const [result, setResult] = useState<any>(null)

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-5xl mx-auto space-y-8">
                <div className="flex items-center">
                    <Link href="/">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Home
                        </Button>
                    </Link>
                </div>

                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold text-gray-900">Pest & Disease Analysis</h1>
                    <p className="text-gray-500">Upload a clear photo of the affected leaf for instant diagnosis.</p>
                </div>

                {!result ? (
                    <AnalyzeForm onAnalysisComplete={setResult} />
                ) : (
                    <div className="space-y-6">
                        <AnalysisResult result={result} />
                        <div className="text-center">
                            <Button onClick={() => setResult(null)} variant="outline">
                                Analyze Another Image
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
