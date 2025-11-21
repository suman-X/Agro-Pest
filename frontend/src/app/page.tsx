import Link from "next/link";
import { Button } from "../components/ui/button";
import { Leaf, Camera, Cloud } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <Leaf className="w-16 h-16 text-green-600" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Smart Pest Detection
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            AI-powered crop disease diagnosis with personalized treatment recommendations
            and real-time weather insights
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <Camera className="w-12 h-12 text-green-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Upload Image</h3>
            <p className="text-gray-600">
              Capture or upload a photo of the affected plant leaf
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <Leaf className="w-12 h-12 text-green-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">AI Analysis</h3>
            <p className="text-gray-600">
              Get instant AI-powered diagnosis and treatment options
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <Cloud className="w-12 h-12 text-green-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Weather Insights</h3>
            <p className="text-gray-600">
              Receive weather-based risk assessment and prevention tips
            </p>
          </div>
        </div>

        <div className="text-center">
          <Link href="/analyze">
            <Button size="lg" className="text-lg px-8 py-6">
              Start Analysis
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
