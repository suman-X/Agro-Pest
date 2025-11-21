"use client";

import { useState } from "react";
import AnalyzeForm from "../../components/analyze-form";
import AnalysisResult from "../../components/analysis-result";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Leaf } from "lucide-react";

export default function AnalyzePage() {
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalysisComplete = (result: any) => {
    setAnalysisResult(result);
    setIsLoading(false);
  };

  const handleAnalysisStart = () => {
    setIsLoading(true);
    setAnalysisResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Leaf className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Crop Disease Analysis
            </h1>
            <p className="text-gray-600">
              Upload or capture an image of the affected plant for instant diagnosis
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Upload Image</CardTitle>
            </CardHeader>
            <CardContent>
              <AnalyzeForm
                onAnalysisComplete={handleAnalysisComplete}
                onAnalysisStart={handleAnalysisStart}
              />
            </CardContent>
          </Card>

          {isLoading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
              <p className="mt-4 text-gray-600">Analyzing image...</p>
            </div>
          )}

          {analysisResult && !isLoading && (
            <AnalysisResult result={analysisResult} />
          )}
        </div>
      </div>
    </div>
  );
}
