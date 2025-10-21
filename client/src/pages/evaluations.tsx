import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EvalDetailSheet } from "@/components/eval-detail-sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight, Database, Search } from "lucide-react";
import type { Eval } from "@shared/schema";

const PAGE_SIZES = [20, 50, 100];

export default function Evaluations() {
  const [selectedEval, setSelectedEval] = useState<Eval | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchQuery, setSearchQuery] = useState("");
  const [flagFilter, setFlagFilter] = useState<string>("all");

  const { data: evals, isLoading } = useQuery<Eval[]>({
    queryKey: ["/api/evals", { page, pageSize, search: searchQuery, flag: flagFilter }],
  });

  const handleRowClick = (evaluation: Eval) => {
    setSelectedEval(evaluation);
    setSheetOpen(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Evaluations</h1>
          <p className="text-muted-foreground mt-2">
            View and analyze all evaluation records
          </p>
        </div>

        <div className="flex gap-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-40" />
        </div>

        <Skeleton className="h-96" />
      </div>
    );
  }

  const displayEvals = evals || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Evaluations</h1>
        <p className="text-muted-foreground mt-2">
          View and analyze all evaluation records
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by interaction ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
            data-testid="input-search-evals"
          />
        </div>
        <Select value={flagFilter} onValueChange={setFlagFilter}>
          <SelectTrigger className="w-full sm:w-40" data-testid="select-flag-filter">
            <SelectValue placeholder="Filter by flag" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Flags</SelectItem>
            <SelectItem value="error">Error</SelectItem>
            <SelectItem value="warning">Warning</SelectItem>
            <SelectItem value="success">Success</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {displayEvals.length === 0 ? (
        <div className="flex h-96 items-center justify-center">
          <div className="text-center space-y-4">
            <Database className="h-16 w-16 text-muted-foreground mx-auto" />
            <h2 className="text-2xl font-semibold">No evaluations found</h2>
            <p className="text-muted-foreground">
              {searchQuery || flagFilter !== "all"
                ? "Try adjusting your filters"
                : "Start by ingesting your first evaluation"}
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Interaction ID</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Latency</TableHead>
                  <TableHead>Flags</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayEvals.map((evaluation) => (
                  <TableRow
                    key={evaluation.id}
                    className="cursor-pointer hover-elevate"
                    onClick={() => handleRowClick(evaluation)}
                    data-testid={`row-eval-${evaluation.id}`}
                  >
                    <TableCell className="font-mono text-xs" data-testid={`cell-interaction-${evaluation.id}`}>
                      {evaluation.interactionId.slice(0, 12)}...
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold" data-testid={`cell-score-${evaluation.id}`}>
                        {(evaluation.score * 100).toFixed(1)}%
                      </span>
                    </TableCell>
                    <TableCell data-testid={`cell-latency-${evaluation.id}`}>
                      {evaluation.latencyMs}ms
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {evaluation.flags.slice(0, 2).map((flag, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {flag}
                          </Badge>
                        ))}
                        {evaluation.flags.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{evaluation.flags.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell data-testid={`cell-created-${evaluation.id}`}>
                      {new Date(evaluation.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Rows per page:</span>
              <Select value={pageSize.toString()} onValueChange={(v) => setPageSize(Number(v))}>
                <SelectTrigger className="w-20" data-testid="select-page-size">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PAGE_SIZES.map((size) => (
                    <SelectItem key={size} value={size.toString()}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                data-testid="button-prev-page"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground" data-testid="text-page-info">
                Page {page}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => p + 1)}
                disabled={displayEvals.length < pageSize}
                data-testid="button-next-page"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}

      <EvalDetailSheet
        evaluation={selectedEval}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </div>
  );
}
