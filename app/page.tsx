import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Navigation */}
      <nav className="border-b border-slate-700 bg-slate-900/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-white">AI Agent Eval</div>
          <div className="flex gap-4">
            <Link href="/auth/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">Monitor Your AI Agent Performance</h1>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Track evaluations, analyze trends, and optimize your AI agents with real-time insights and comprehensive
            analytics.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/auth/sign-up">
              <Button size="lg">Get Started</Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="outline">
                Login
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-8">
            <div className="text-3xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-white mb-2">Real-time Dashboard</h3>
            <p className="text-slate-400">
              Monitor KPIs, trends, and performance metrics in real-time with interactive charts.
            </p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-8">
            <div className="text-3xl mb-4">🔧</div>
            <h3 className="text-xl font-bold text-white mb-2">Flexible Configuration</h3>
            <p className="text-slate-400">
              Control sampling rates, daily limits, and PII obfuscation with easy-to-use settings.
            </p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-8">
            <div className="text-3xl mb-4">🔐</div>
            <h3 className="text-xl font-bold text-white mb-2">Enterprise Security</h3>
            <p className="text-slate-400">
              Row-level security, user isolation, and encrypted data handling for complete privacy.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-4 gap-8 mt-20 text-center">
          <div>
            <div className="text-4xl font-bold text-blue-400 mb-2">20K+</div>
            <p className="text-slate-400">Evaluations per day</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-400 mb-2">99.9%</div>
            <p className="text-slate-400">Uptime SLA</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-400 mb-2">Sub-100ms</div>
            <p className="text-slate-400">API latency</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-400 mb-2">100%</div>
            <p className="text-slate-400">Data encrypted</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-700 bg-slate-900/50 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center text-slate-400">
          <p>AI Agent Evaluation Framework © 2025</p>
        </div>
      </div>
    </div>
  )
}
