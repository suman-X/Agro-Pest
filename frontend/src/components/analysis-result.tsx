"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertTriangle,
  Droplets,
  Leaf,
  Shield,
  Thermometer,
  Wind,
} from "lucide-react";

interface AnalysisResultProps {
  result: {
    diagnosis: {
      disease_name: string;
      confidence: number;
      symptoms: string[] | { name: string }[];
      severity: string;
    };
    weather: {
      temperature: number;
      humidity: number;
      conditions: string;
      risk_level: string;
      risk_factors: string[];
    };
    treatment: {
      immediate_steps: string[] | { name: string; dosage?: string }[];
      chemical_options: { name: string; dosage?: string }[] | string[];
      organic_options: { name: string; dosage?: string }[] | string[];
      prevention: string[] | { name: string }[];
      estimated_recovery: string;
    };
  };
}

export default function AnalysisResult({ result }: AnalysisResultProps) {
  const renderArrayItem = (item: any) => {
    if (typeof item === "string") {
      return item;
    }
    if (typeof item === "object" && item.name) {
      return item.dosage ? `${item.name} (${item.dosage})` : item.name;
    }
    return String(item);
  };

  return (
    <div className="space-y-6">
      {/* Diagnosis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf className="w-6 h-6 text-green-600" />
            Diagnosis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">
              {result.diagnosis.disease_name}
            </h3>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-sm text-gray-600">
                Confidence: {result.diagnosis.confidence}%
              </span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  result.diagnosis.severity === "High"
                    ? "bg-red-100 text-red-700"
                    : result.diagnosis.severity === "Moderate"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {result.diagnosis.severity} Severity
              </span>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Symptoms:</h4>
            <ul className="list-disc list-inside space-y-1">
              {result.diagnosis.symptoms.map((symptom, index) => (
                <li key={index} className="text-gray-700">
                  {renderArrayItem(symptom)}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Weather Risk */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-orange-600" />
            Weather Risk Assessment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <Thermometer className="w-5 h-5 text-red-500" />
              <div>
                <p className="text-sm text-gray-600">Temperature</p>
                <p className="font-semibold">{result.weather.temperature}°C</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Droplets className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Humidity</p>
                <p className="font-semibold">{result.weather.humidity}%</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Wind className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Conditions</p>
                <p className="font-semibold">{result.weather.conditions}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600">Risk Level</p>
                <p
                  className={`font-semibold ${
                    result.weather.risk_level === "High"
                      ? "text-red-600"
                      : result.weather.risk_level === "Moderate"
                      ? "text-yellow-600"
                      : "text-green-600"
                  }`}
                >
                  {result.weather.risk_level}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Risk Factors:</h4>
            <ul className="list-disc list-inside space-y-1">
              {result.weather.risk_factors.map((factor, index) => (
                <li key={index} className="text-gray-700">
                  {factor}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Treatment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-blue-600" />
            Treatment Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Immediate Steps:
            </h4>
            <ol className="list-decimal list-inside space-y-1">
              {result.treatment.immediate_steps.map((step, index) => (
                <li key={index} className="text-gray-700">
                  {renderArrayItem(step)}
                </li>
              ))}
            </ol>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Chemical Options:
            </h4>
            <ul className="list-disc list-inside space-y-1">
              {result.treatment.chemical_options.map((option, index) => (
                <li key={index} className="text-gray-700">
                  {renderArrayItem(option)}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Organic Options:
            </h4>
            <ul className="list-disc list-inside space-y-1">
              {result.treatment.organic_options.map((option, index) => (
                <li key={index} className="text-gray-700">
                  {renderArrayItem(option)}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Prevention:</h4>
            <ul className="list-disc list-inside space-y-1">
              {result.treatment.prevention.map((tip, index) => (
                <li key={index} className="text-gray-700">
                  {renderArrayItem(tip)}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <p className="text-sm font-medium text-blue-900">
              Estimated Recovery Time: {result.treatment.estimated_recovery}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
