import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, Flag, Shield, Target } from "lucide-react";
import type { Eval } from "@shared/schema";

interface EvalDetailSheetProps {
  evaluation: Eval | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EvalDetailSheet({ evaluation, open, onOpenChange }: EvalDetailSheetProps) {
  if (!evaluation) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto" data-testid="sheet-eval-detail">
        <SheetHeader>
          <SheetTitle>Evaluation Details</SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Target className="h-3 w-3" />
                Score
              </div>
              <div className="text-2xl font-bold" data-testid="text-eval-score">
                {(evaluation.score * 100).toFixed(1)}%
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                Latency
              </div>
              <div className="text-2xl font-bold" data-testid="text-eval-latency">
                {evaluation.latencyMs}ms
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Shield className="h-3 w-3" />
                PII Redacted
              </div>
              <div className="text-2xl font-bold" data-testid="text-eval-pii">
                {evaluation.piiTokensRedacted}
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                Created
              </div>
              <div className="text-sm font-medium">
                {new Date(evaluation.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Flag className="h-4 w-4" />
              Flags
            </div>
            <div className="flex flex-wrap gap-2">
              {evaluation.flags.length > 0 ? (
                evaluation.flags.map((flag, index) => (
                  <Badge key={index} variant="secondary" data-testid={`badge-flag-${index}`}>
                    {flag}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">No flags</span>
              )}
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="text-sm font-medium">Interaction ID</div>
            <div className="text-sm text-muted-foreground font-mono bg-muted p-3 rounded-md" data-testid="text-interaction-id">
              {evaluation.interactionId}
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="text-sm font-medium">Prompt</div>
            <div className="text-sm bg-muted p-4 rounded-md whitespace-pre-wrap" data-testid="text-prompt">
              {evaluation.prompt}
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="text-sm font-medium">Response</div>
            <div className="text-sm bg-muted p-4 rounded-md whitespace-pre-wrap" data-testid="text-response">
              {evaluation.response}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
