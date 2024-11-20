"use client"

import { Bar, BarChart, XAxis, YAxis } from "recharts"
import {Rsvp} from "@prisma/client"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
    count: {
        label: "Count",
    },
    YES: {
        label: "Yes",
        color: "#d33cc8",
    },
    NO: {
        label: "No",
        color: "hsl(var(--chart-1))",
    },
    MAYBE: {
        label: "Maybe",
        color: "hsl(var(--chart-1))",
    },
    NO_RESPONSE: {
        label: "None",
        color: "#404040",
    },
} satisfies ChartConfig

type RsvpGraphProps = {
    rsvps: Rsvp[]
}

export function RSVPGraph({ rsvps }: RsvpGraphProps) {
    const chartData = [
        { response: 'YES', count: rsvps.filter(rsvp => rsvp.response === 'YES').length },
        { response: 'NO', count: rsvps.filter(rsvp => rsvp.response === 'NO').length },
        { response: 'MAYBE', count: rsvps.filter(rsvp => rsvp.response === 'MAYBE').length },
        { response: 'NO_RESPONSE', count: rsvps.filter(rsvp => rsvp.response === 'NO_RESPONSE').length },
    ]

    return (
        <>
            <ChartContainer config={chartConfig} className="min-h-[150px] w-full">
                <BarChart
                    accessibilityLayer
                    data={chartData}
                    layout="vertical"
                    margin={{
                        left: 0,
                    }}
                >
                    <YAxis
                        dataKey="response"
                        type="category"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        tickFormatter={(value) =>
                            chartConfig[value as keyof typeof chartConfig]?.label
                        }
                    />
                    <XAxis dataKey="count" type="number" hide />
                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                    />
                    <Bar dataKey="count" layout="vertical" radius={5} fill="#d33cc8"/>
                </BarChart>
            </ChartContainer>
            <p className="text-xs text-muted-foreground">Total Invites: {rsvps.length}</p>
        </>
    )
}