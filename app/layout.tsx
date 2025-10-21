import type React from "react"
import "./globals.css"

export const metadata = {
  title: "AI Agent Evaluation",
  description: "Monitor and analyze AI agent performance",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground">{children}</body>
    </html>
  )
}
