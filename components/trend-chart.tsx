"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface TrendData {
  date: string
  score?: number
  latency?: number
  count?: number
}

interface TrendChartProps {
  title: string
  description?: string
  data: TrendData[]
  dataKey: "score" | "latency" | "count"
  unit?: string
}

export function TrendChart({ title, description, data, dataKey, unit }: TrendChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip
              formatter={(value) => {
                if (dataKey === "score") return [(value as number).toFixed(2), "Score"]
                if (dataKey === "latency") return [`${value}ms`, "Latency"]
                return [value, "Count"]
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke="#3b82f6"
              dot={{ fill: "#3b82f6" }}
              activeDot={{ r: 6 }}
              name={`${dataKey.charAt(0).toUpperCase() + dataKey.slice(1)} ${unit || ""}`}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
