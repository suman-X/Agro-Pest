import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, CheckCircle, Droplets, Thermometer } from "lucide-react"

interface AnalysisResultProps {
    result: any
}

export function AnalysisResult({ result }: AnalysisResultProps) {
    if (!result) return null

    const { label, confidence, severity, symptoms, treatment, weather_risk } = result

    return (
        <div className="space-y-6 w-full max-w-4xl mx-auto">
            <div className="grid gap-6 md:grid-cols-2">
                {/* Diagnosis Card */}
                <Card className="border-l-4 border-l-blue-500">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span>Diagnosis</span>
                            <span className="text-sm font-normal text-gray-500">Confidence: {confidence}%</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <h3 className="text-2xl font-bold text-blue-900">{label}</h3>
                            <div className="flex items-center mt-2">
                                <span className="text-sm font-medium mr-2">Severity:</span>
                                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${severity > 70 ? 'bg-red-500' : severity > 30 ? 'bg-yellow-500' : 'bg-green-500'}`}
                                        style={{ width: `${severity}%` }}
                                    />
                                </div>
                                <span className="ml-2 text-sm">{severity}/100</span>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-1">Symptoms:</h4>
                            <ul className="list-disc list-inside text-sm text-gray-700">
                                {symptoms?.map((s: any, i: number) => (
                                    <li key={i}>{typeof s === 'string' ? s : s?.name || s?.description || JSON.stringify(s)}</li>
                                ))}
                            </ul>
                        </div>
                    </CardContent>
                </Card>

                {/* Weather Risk Card */}
                <Card className="border-l-4 border-l-yellow-500">
                    <CardHeader>
                        <CardTitle>Weather Risk</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                                <Thermometer className="h-5 w-5 text-red-500 mr-1" />
                                <span>{weather_risk?.forecast?.temp}°C</span>
                            </div>
                            <div className="flex items-center">
                                <Droplets className="h-5 w-5 text-blue-500 mr-1" />
                                <span>{weather_risk?.forecast?.humidity}%</span>
                            </div>
                        </div>
                        <div className="p-3 bg-yellow-50 rounded-md">
                            <p className="text-sm font-medium text-yellow-800">
                                Risk Level: {weather_risk?.risk_level}
                            </p>
                            <p className="text-xs text-yellow-700 mt-1">
                                {weather_risk?.alert}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Treatment Plan */}
            <Card className="border-l-4 border-l-green-500">
                <CardHeader>
                    <CardTitle>Recommended Treatment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <h4 className="font-semibold text-green-800 mb-2">Immediate Actions</h4>
                        <ul className="space-y-2">
                            {treatment?.steps?.map((step: any, i: number) => (
                                <li key={i} className="flex items-start">
                                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                                    <span className="text-sm">{typeof step === 'string' ? step : step?.name || step?.description || JSON.stringify(step)}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="bg-green-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-green-800 mb-2">Organic Options</h4>
                            <ul className="list-disc list-inside text-sm text-green-700">
                                {treatment?.organic_options?.map((opt: any, i: number) => (
                                    <li key={i}>{typeof opt === 'string' ? opt : opt?.name ? `${opt.name}${opt.dosage ? ` - ${opt.dosage}` : ''}` : JSON.stringify(opt)}</li>
                                ))}
                            </ul>
                        </div>

                        {treatment?.chemical_options?.length > 0 && (
                            <div className="bg-red-50 p-4 rounded-lg">
                                <h4 className="font-semibold text-red-800 mb-2 flex items-center">
                                    <AlertTriangle className="h-4 w-4 mr-2" />
                                    Chemical Options
                                </h4>
                                <ul className="list-disc list-inside text-sm text-red-700">
                                    {treatment?.chemical_options?.map((opt: any, i: number) => (
                                        <li key={i}>
                                            {typeof opt === 'string' ? opt : 
                                             opt.name ? `${opt.name}${opt.dosage ? ` - ${opt.dosage}` : ''}` : 
                                             JSON.stringify(opt)}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    <div>
                        <h4 className="font-semibold text-blue-800 mb-2">Long-term Prevention</h4>
                        <ul className="list-disc list-inside text-sm text-gray-700">
                            {treatment?.prevention?.map((prev: any, i: number) => (
                                <li key={i}>{typeof prev === 'string' ? prev : prev?.name || prev?.description || JSON.stringify(prev)}</li>
                            ))}
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
