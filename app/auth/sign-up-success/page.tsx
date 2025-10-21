"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

export default function SignUpSuccessPage() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email")

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Account Created!</CardTitle>
              <CardDescription>Welcome to AI Agent Evaluation</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>Your account has been successfully created{email && ` for ${email}`}.</p>

                <div className="rounded-lg bg-blue-50 p-3 text-blue-900 dark:bg-blue-900/20 dark:text-blue-200">
                  <p className="font-semibold mb-2">Next Steps:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Check your email for a confirmation link</li>
                    <li>Click the link to verify your email</li>
                    <li>Return here and log in with your credentials</li>
                  </ul>
                </div>

                <p className="text-xs">
                  <strong>Note:</strong> If you don&apos;t see the email, check your spam folder or contact support.
                </p>
              </div>

              <Link
                href="/auth/login"
                className="inline-block text-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Go to Login
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
