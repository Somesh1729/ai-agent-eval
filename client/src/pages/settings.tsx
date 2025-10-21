import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { insertEvalSettingsSchema, type InsertEvalSettings, type EvalSettings } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Settings as SettingsIcon } from "lucide-react";

export default function Settings() {
  const { toast } = useToast();

  const { data: settings, isLoading } = useQuery<EvalSettings>({
    queryKey: ["/api/settings"],
  });

  const form = useForm<InsertEvalSettings>({
    resolver: zodResolver(insertEvalSettingsSchema),
    values: settings ? {
      runPolicy: settings.runPolicy,
      sampleRatePct: settings.sampleRatePct,
      obfuscatePii: settings.obfuscatePii,
      maxEvalPerDay: settings.maxEvalPerDay,
    } : undefined,
  });

  const updateMutation = useMutation({
    mutationFn: (data: InsertEvalSettings) => 
      apiRequest("PUT", "/api/settings", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      toast({
        title: "Success",
        description: "Settings updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update settings",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertEvalSettings) => {
    updateMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-2">
            Configure your evaluation preferences
          </p>
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Configure your evaluation preferences
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5" />
            Evaluation Configuration
          </CardTitle>
          <CardDescription>
            Manage how evaluations are processed and stored
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="runPolicy">Run Policy</Label>
                <Select
                  value={form.watch("runPolicy")}
                  onValueChange={(value) => form.setValue("runPolicy", value)}
                >
                  <SelectTrigger id="runPolicy" data-testid="select-run-policy">
                    <SelectValue placeholder="Select policy" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="always">Always Run</SelectItem>
                    <SelectItem value="sampled">Sampled</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Choose whether to evaluate all requests or use sampling
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sampleRatePct">Sample Rate (%)</Label>
                <Input
                  id="sampleRatePct"
                  type="number"
                  min="0"
                  max="100"
                  {...form.register("sampleRatePct", { valueAsNumber: true })}
                  data-testid="input-sample-rate"
                />
                <p className="text-xs text-muted-foreground">
                  Percentage of evaluations to process when using sampling (0-100)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxEvalPerDay">Max Evaluations per Day</Label>
                <Input
                  id="maxEvalPerDay"
                  type="number"
                  min="0"
                  {...form.register("maxEvalPerDay", { valueAsNumber: true })}
                  data-testid="input-max-eval"
                />
                <p className="text-xs text-muted-foreground">
                  Maximum number of evaluations to process daily
                </p>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="obfuscatePii" className="text-base">
                    Obfuscate PII
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Automatically redact personally identifiable information
                  </p>
                </div>
                <Switch
                  id="obfuscatePii"
                  checked={form.watch("obfuscatePii")}
                  onCheckedChange={(checked) => form.setValue("obfuscatePii", checked)}
                  data-testid="switch-obfuscate-pii"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={updateMutation.isPending}
              data-testid="button-save-settings"
            >
              {updateMutation.isPending ? "Saving..." : "Save Settings"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
