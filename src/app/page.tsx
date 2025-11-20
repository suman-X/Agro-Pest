import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Leaf, ShieldCheck, CloudRain } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link className="flex items-center justify-center" href="#">
          <Leaf className="h-6 w-6 text-green-600" />
          <span className="ml-2 text-xl font-bold text-green-900">AgriGuard AI</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Features
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            About
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Contact
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-green-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-green-900">
                  Protect Your Crops with AI Precision
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-600 md:text-xl">
                  Instant pest detection, disease diagnosis, and weather-based risk alerts powered by Gemini 3 Vision.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/analyze">
                  <Button className="bg-green-600 hover:bg-green-700 text-white" size="lg">
                    Start Analysis
                  </Button>
                </Link>
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 border-gray-200 p-4 rounded-lg">
                <div className="p-2 bg-green-100 rounded-full">
                  <Leaf className="h-6 w-6 text-green-600" />
                </div>
                <h2 className="text-xl font-bold text-green-900">Instant Detection</h2>
                <p className="text-center text-gray-500">
                  Upload a photo of your crop and get immediate identification of pests and diseases.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border-gray-200 p-4 rounded-lg">
                <div className="p-2 bg-blue-100 rounded-full">
                  <ShieldCheck className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-green-900">Smart Treatments</h2>
                <p className="text-center text-gray-500">
                  Receive tailored chemical and organic treatment plans based on severity and location.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border-gray-200 p-4 rounded-lg">
                <div className="p-2 bg-yellow-100 rounded-full">
                  <CloudRain className="h-6 w-6 text-yellow-600" />
                </div>
                <h2 className="text-xl font-bold text-green-900">Weather Alerts</h2>
                <p className="text-center text-gray-500">
                  Stay ahead of outbreaks with risk forecasts based on local weather conditions.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500">© 2025 AgriGuard AI. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}
