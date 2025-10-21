"use client"

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"

interface Evaluation {
  id: string
  interaction_id: string
  prompt: string
  response: string
  score: number
  latency_ms: number
  flags: string[]
  pii_tokens_redacted: number
  created_at: string
}

interface EvalDetailSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  evaluation: Evaluation | null
}

export function EvalDetailSheet({ open, onOpenChange, evaluation }: EvalDetailSheetProps) {
  if (!evaluation) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Evaluation Details</SheetTitle>
          <SheetDescription>ID: {evaluation.id}</SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          <div>
            <h3 className="font-semibold text-sm mb-2">Interaction ID</h3>
            <p className="text-sm text-muted-foreground break-all">{evaluation.interaction_id}</p>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-2">Prompt</h3>
            <div className="bg-muted p-3 rounded-md max-h-40 overflow-y-auto">
              <p className="text-sm whitespace-pre-wrap">{evaluation.prompt}</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-2">Response</h3>
            <div className="bg-muted p-3 rounded-md max-h-40 overflow-y-auto">
              <p className="text-sm whitespace-pre-wrap">{evaluation.response}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-sm mb-2">Score</h3>
              <p className="text-2xl font-bold">{(evaluation.score * 100).toFixed(0)}%</p>
            </div>
            <div>
              <h3 className="font-semibold text-sm mb-2">Latency</h3>
              <p className="text-2xl font-bold">{evaluation.latency_ms}ms</p>
            </div>
          </div>

          {evaluation.flags.length > 0 && (
            <div>
              <h3 className="font-semibold text-sm mb-2">Flags</h3>
              <div className="flex flex-wrap gap-2">
                {evaluation.flags.map((flag) => (
                  <Badge key={flag} variant="secondary">
                    {flag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="font-semibold text-sm mb-2">PII Tokens Redacted</h3>
            <p className="text-sm text-muted-foreground">{evaluation.pii_tokens_redacted}</p>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-2">Created At</h3>
            <p className="text-sm text-muted-foreground">{new Date(evaluation.created_at).toLocaleString()}</p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
