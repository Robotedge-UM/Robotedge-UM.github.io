"use client"

import React from "react"
import {
  ResponsiveContainer,
  PieChart as RechartsPie,
  Pie,
  Cell,
  Tooltip,
  Legend,
  LineChart as RechartsLine,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart as RechartsBar,
  Bar,
} from "recharts"

interface ChartProps {
  data: Array<any>
  height?: number
  colors?: string[]
}

interface LineChartProps extends ChartProps {
  xAxis: string
  yAxis: string
  lineColor?: string
}

interface BarChartProps extends ChartProps {
  xAxis: string
  yAxis: string
  barColor?: string
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]
const DEFAULT_HEIGHT = 250

export function PieChart({
  data,
  height = DEFAULT_HEIGHT,
  colors = COLORS,
}: ChartProps) {
  if (!data || data.length === 0) return null

  const renderLabel = (entry: any) => {
    return entry.name
  }

  return (
    <ResponsiveContainer
      width="100%"
      height={height}
    >
      <RechartsPie>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderLabel}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={colors[index % colors.length]}
            />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number) => [`$${value.toFixed(2)}`, "Amount"]}
          labelFormatter={(name) => name}
        />
        <Legend />
      </RechartsPie>
    </ResponsiveContainer>
  )
}

export function LineChart({
  data,
  height = DEFAULT_HEIGHT,
  xAxis,
  yAxis,
  lineColor = "#8884d8",
}: LineChartProps) {
  if (!data || data.length === 0) return null

  return (
    <ResponsiveContainer
      width="100%"
      height={height}
    >
      <RechartsLine
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          opacity={0.3}
        />
        <XAxis dataKey={xAxis} />
        <YAxis tickFormatter={(value) => `$${value}`} />
        <Tooltip
          formatter={(value: number) => [`$${value.toFixed(2)}`, "Amount"]}
          labelFormatter={(name) => name}
        />
        <Line
          type="monotone"
          dataKey={yAxis}
          stroke={lineColor}
          activeDot={{ r: 8 }}
          strokeWidth={2}
        />
      </RechartsLine>
    </ResponsiveContainer>
  )
}

export function BarChart({
  data,
  height = DEFAULT_HEIGHT,
  xAxis,
  yAxis,
  barColor = "#8884d8",
}: BarChartProps) {
  if (!data || data.length === 0) return null

  return (
    <ResponsiveContainer
      width="100%"
      height={height}
    >
      <RechartsBar
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          opacity={0.3}
        />
        <XAxis dataKey={xAxis} />
        <YAxis tickFormatter={(value) => `$${value}`} />
        <Tooltip
          formatter={(value: number) => [`$${value.toFixed(2)}`, "Amount"]}
          labelFormatter={(name) => name}
        />
        <Bar
          dataKey={yAxis}
          fill={barColor}
          radius={[4, 4, 0, 0]}
        />
      </RechartsBar>
    </ResponsiveContainer>
  )
}
