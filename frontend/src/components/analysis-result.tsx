"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
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

export default function AnalysisResult({ result }: { result: any }) {
  // Helper to safely render array items
  const renderArrayItem = (item: any) => {
    if (!item) return null;
    if (typeof item === "string") return item;
    if (typeof item === "object") {
      // Handle {name, dosage} objects
      if (item.name) {
        return item.dosage ? `${item.name} (${item.dosage})` : item.name;
      }
      // Handle nested objects or other structures by stringifying or picking a property
      return item.label || item.value || JSON.stringify(item);
    }
    return String(item);
  };

  // Adapt backend data structure to component needs
  const diagnosis = result.diagnosis || {
    disease_name: result.label || "Unknown",
    confidence: result.confidence || 0,
    symptoms: result.symptoms || [],
    severity: result.severity || "Unknown"
  };

  const weather = result.weather || {
    temperature: result.weather_risk?.forecast?.temp || 0,
    humidity: result.weather_risk?.forecast?.humidity || 0,
    conditions: result.weather_risk?.forecast?.condition || "Unknown",
    risk_level: result.weather_risk?.risk_level || "Unknown",
    risk_factors: result.weather_risk?.alert ? [result.weather_risk.alert] : []
  };

  const treatment = result.treatment || {
    immediate_steps: result.treatment?.steps || [], // Backend returns 'steps', frontend expects 'immediate_steps'
    chemical_options: [],
    organic_options: [],
    prevention: [],
    estimated_recovery: "Unknown"
  };

  // Ensure treatment arrays exist
  const immediate_steps = treatment.immediate_steps || treatment.steps || [];
  const chemical_options = treatment.chemical_options || [];
  const organic_options = treatment.organic_options || [];
  const prevention = treatment.prevention || [];
  const estimated_recovery = treatment.estimated_recovery || "Unknown";

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
              {diagnosis.disease_name}
            </h3>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-sm text-gray-600">
                Confidence: {diagnosis.confidence}%
              </span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${diagnosis.severity === "High"
                    ? "bg-red-100 text-red-700"
                    : diagnosis.severity === "Moderate"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                  }`}
              >
                {diagnosis.severity} Severity
              </span>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Symptoms:</h4>
            <ul className="list-disc list-inside space-y-1">
              {diagnosis.symptoms.map((symptom: any, index: number) => (
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
                <p className="font-semibold">{weather.temperature}°C</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Droplets className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Humidity</p>
                <p className="font-semibold">{weather.humidity}%</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Wind className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Conditions</p>
                <p className="font-semibold">{weather.conditions}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600">Risk Level</p>
                <p
                  className={`font-semibold ${weather.risk_level === "High"
                      ? "text-red-600"
                      : weather.risk_level === "Moderate"
                        ? "text-yellow-600"
                        : "text-green-600"
                    }`}
                >
                  {weather.risk_level}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Risk Factors:</h4>
            <ul className="list-disc list-inside space-y-1">
              {weather.risk_factors.map((factor: any, index: number) => (
                <li key={index} className="text-gray-700">
                  {renderArrayItem(factor)}
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
              {immediate_steps.map((step: any, index: number) => (
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
              {chemical_options.map((option: any, index: number) => (
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
              {organic_options.map((option: any, index: number) => (
                <li key={index} className="text-gray-700">
                  {renderArrayItem(option)}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Prevention:</h4>
            <ul className="list-disc list-inside space-y-1">
              {prevention.map((tip: any, index: number) => (
                <li key={index} className="text-gray-700">
                  {renderArrayItem(tip)}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <p className="text-sm font-medium text-blue-900">
              Estimated Recovery Time: {estimated_recovery}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
