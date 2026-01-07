import * as React from "react"
import { Label, Pie, PieChart, Sector } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { PieSectorDataItem } from "recharts/types/polar/Pie"

interface PieChartDataItem {
  label: string
  value: number
  color?: string
}

interface InteractivePieChartProps {
  data: PieChartDataItem[]
  title?: string
  description?: string
  centerLabel?: string
  className?: string
  defaultSelectedIndex?: number
  valueFormatter?: (value: number) => string
}

export function InteractivePieChart({
  data,
  title = "Pie Chart",
  description,
  centerLabel = "Total",
  className = "",
  defaultSelectedIndex = 0,
  valueFormatter = (value) => value.toLocaleString(),
}: InteractivePieChartProps) {
  const id = React.useId()

  // Transform data for recharts
  const chartData = React.useMemo(
    () =>
      data.map((item, index) => ({
        name: item.label,
        value: item.value,
        fill: item.color || `var(--color-item-${index})`,
      })),
    [data]
  )

  // Generate chart config
  const chartConfig = React.useMemo(() => {
    const config: ChartConfig = {
      value: {
        label: centerLabel,
      },
    }
    data.forEach((item, index) => {
      config[`item-${index}`] = {
        label: item.label,
        color: item.color || `hsl(var(--chart-${(index % 5) + 1}))`,
      }
    })
    return config
  }, [data, centerLabel])

  const [activeIndex, setActiveIndex] = React.useState(defaultSelectedIndex)

  const handleSelectChange = (value: string) => {
    const index = chartData.findIndex((item) => item.name === value)
    if (index !== -1) {
      setActiveIndex(index)
    }
  }

  return (
    <Card data-chart={id} className={`flex flex-col ${className}`}>
      <ChartStyle id={id} config={chartConfig} />
      <CardHeader className="flex-row items-start space-y-0 pb-0">
        <div className="grid gap-1">
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        <Select
          value={chartData[activeIndex]?.name}
          onValueChange={handleSelectChange}
        >
          <SelectTrigger
            className="ml-auto h-7 w-[130px] rounded-lg pl-2.5"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Select item" />
          </SelectTrigger>
          <SelectContent align="end" className="rounded-xl">
            {chartData.map((item) => (
              <SelectItem
                key={item.name}
                value={item.name}
                className="rounded-lg [&_span]:flex"
              >
                <div className="flex items-center gap-2 text-xs">
                  <span
                    className="flex h-3 w-3 shrink-0 rounded-sm"
                    style={{
                      backgroundColor: item.fill,
                    }}
                  />
                  {item.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="flex flex-1 justify-center pb-0">
        <ChartContainer
          id={id}
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[300px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              strokeWidth={5}
              activeIndex={activeIndex}
              activeShape={({
                outerRadius = 0,
                ...props
              }: PieSectorDataItem) => (
                <g>
                  <Sector {...props} outerRadius={outerRadius + 10} />
                  <Sector
                    {...props}
                    outerRadius={outerRadius + 25}
                    innerRadius={outerRadius + 12}
                  />
                </g>
              )}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {valueFormatter(chartData[activeIndex].value)}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          {centerLabel}
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
