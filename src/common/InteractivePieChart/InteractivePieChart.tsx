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

type ChartSize = "sm" | "md" | "lg" | "xl"

interface InteractivePieChartProps {
  data: PieChartDataItem[]
  title?: string
  description?: string
  centerLabel?: string
  className?: string
  defaultSelectedIndex?: number
  valueFormatter?: (value: number) => string
  size?: ChartSize
}

const sizeConfig = {
  sm: {
    maxWidth: "200px",
    innerRadius: 40,
    strokeWidth: 3,
    outerRadiusOffset: 6,
    labelFontSize: "text-xl",
  },
  md: {
    maxWidth: "300px",
    innerRadius: 60,
    strokeWidth: 5,
    outerRadiusOffset: 10,
    labelFontSize: "text-3xl",
  },
  lg: {
    maxWidth: "400px",
    innerRadius: 80,
    strokeWidth: 6,
    outerRadiusOffset: 12,
    labelFontSize: "text-4xl",
  },
  xl: {
    maxWidth: "500px",
    innerRadius: 100,
    strokeWidth: 8,
    outerRadiusOffset: 15,
    labelFontSize: "text-5xl",
  },
}

export function InteractivePieChart({
  data,
  title = "Pie Chart",
  description,
  centerLabel = "Total",
  className = "",
  defaultSelectedIndex = 0,
  valueFormatter = (value) => value.toLocaleString(),
  size = "md",
}: InteractivePieChartProps) {
  const id = React.useId()
  const config = sizeConfig[size]

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
    const chartCfg: ChartConfig = {
      value: {
        label: centerLabel,
      },
    }
    data.forEach((item, index) => {
      chartCfg[`item-${index}`] = {
        label: item.label,
        color: item.color || `hsl(var(--chart-${(index % 5) + 1}))`,
      }
    })
    return chartCfg
  }, [data, centerLabel])

  const [activeIndex, setActiveIndex] = React.useState(defaultSelectedIndex)

  const handleSelectChange = (value: string) => {
    const index = chartData.findIndex((item) => item.name === value)
    if (index !== -1) {
      setActiveIndex(index)
    }
  }

  return (
    <Card data-chart={id} className={`flex flex-col ${className} bg-transparent`}>
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
          className="mx-auto aspect-square w-full"
          style={{ maxWidth: config.maxWidth }}
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
              innerRadius={config.innerRadius}
              strokeWidth={config.strokeWidth}
              activeIndex={activeIndex}
              activeShape={({
                outerRadius = 0,
                ...props
              }: PieSectorDataItem) => (
                <g>
                  <Sector {...props} outerRadius={outerRadius + config.outerRadiusOffset} />
                  <Sector
                    {...props}
                    outerRadius={outerRadius + config.outerRadiusOffset * 2.5}
                    innerRadius={outerRadius + config.outerRadiusOffset * 1.2}
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
                          className={`fill-foreground ${config.labelFontSize} font-bold`}
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