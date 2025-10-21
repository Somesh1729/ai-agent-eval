"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface EvalSettings {
  id: string
  run_policy: "always" | "sampled"
  sample_rate_pct: number
  obfuscate_pii: boolean
  max_eval_per_day: number
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<EvalSettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [runPolicy, setRunPolicy] = useState<"always" | "sampled">("always")
  const [sampleRate, setSampleRate] = useState(100)
  const [obfuscatePii, setObfuscatePii] = useState(false)
  const [maxEvalPerDay, setMaxEvalPerDay] = useState(10000)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) {
          router.push("/auth/login")
          return
        }

        const { data, error } = await supabase.from("eval_settings").select("*").eq("user_id", user.id).single()

        if (error && error.code !== "PGRST116") {
          throw error
        }

        if (data) {
          setSettings(data)
          setRunPolicy(data.run_policy)
          setSampleRate(data.sample_rate_pct)
          setObfuscatePii(data.obfuscate_pii)
          setMaxEvalPerDay(data.max_eval_per_day)
        }
      } catch (error) {
        console.error("Error fetching settings:", error)
        toast.error("Failed to load settings")
      } finally {
        setIsLoading(false)
      }
    }

    fetchSettings()
  }, [supabase, router])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      if (settings) {
        const { error } = await supabase
          .from("eval_settings")
          .update({
            run_policy: runPolicy,
            sample_rate_pct: sampleRate,
            obfuscate_pii: obfuscatePii,
            max_eval_per_day: maxEvalPerDay,
            updated_at: new Date().toISOString(),
          })
          .eq("id", settings.id)

        if (error) throw error
      } else {
        const { error } = await supabase.from("eval_settings").insert({
          user_id: user.id,
          run_policy: runPolicy,
          sample_rate_pct: sampleRate,
          obfuscate_pii: obfuscatePii,
          max_eval_per_day: maxEvalPerDay,
        })

        if (error) throw error
      }

      toast.success("Settings saved successfully")
    } catch (error) {
      console.error("Error saving settings:", error)
      toast.error("Failed to save settings")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading settings...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6 md:p-10">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Evaluation Settings</h1>
          <p className="text-muted-foreground mt-2">Configure how evaluations are collected and processed</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Collection Policy</CardTitle>
            <CardDescription>Control how evaluations are collected</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="run-policy">Run Policy</Label>
              <Select value={runPolicy} onValueChange={(value) => setRunPolicy(value as "always" | "sampled")}>
                <SelectTrigger id="run-policy">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="always">Always</SelectItem>
                  <SelectItem value="sampled">Sampled</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Choose whether to collect all evaluations or sample them</p>
            </div>

            {runPolicy === "sampled" && (
              <div className="space-y-2">
                <Label htmlFor="sample-rate">Sample Rate: {sampleRate}%</Label>
                <Input
                  id="sample-rate"
                  type="range"
                  min="0"
                  max="100"
                  value={sampleRate}
                  onChange={(e) => setSampleRate(Number(e.target.value))}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">Percentage of evaluations to collect</p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="max-eval">Max Evaluations Per Day</Label>
              <Input
                id="max-eval"
                type="number"
                min="1"
                value={maxEvalPerDay}
                onChange={(e) => setMaxEvalPerDay(Number(e.target.value))}
              />
              <p className="text-xs text-muted-foreground">Maximum number of evaluations to collect per day</p>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Privacy Settings</CardTitle>
            <CardDescription>Control how sensitive data is handled</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="obfuscate-pii">Obfuscate PII</Label>
                <p className="text-xs text-muted-foreground">Automatically mask personally identifiable information</p>
              </div>
              <Switch id="obfuscate-pii" checked={obfuscatePii} onCheckedChange={setObfuscatePii} />
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 flex gap-4">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Settings"}
          </Button>
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  )
}
