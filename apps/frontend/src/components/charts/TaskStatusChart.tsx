"use client"

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js'
import { Doughnut } from 'react-chartjs-2'
import { useChartData } from '@/hooks/useChartData'

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
)

interface TaskStatusChartProps {
    className?: string
}

export function TaskStatusChart({ className }: TaskStatusChartProps) {
    const { taskStatusData } = useChartData()

    const chartData = {
        labels: ['To Do', 'In Progress', 'Done'],
        datasets: [
            {
                data: [
                    taskStatusData.todo,
                    taskStatusData.inProgress,
                    taskStatusData.done
                ],
                backgroundColor: [
                    '#fbbf24', // Yellow for todo
                    '#3b82f6', // Blue for in progress
                    '#10b981'  // Green for done
                ],
                borderColor: [
                    '#f59e0b',
                    '#2563eb',
                    '#059669'
                ],
                borderWidth: 2,
            },
        ],
    }

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom' as const,
                labels: {
                    padding: 20,
                    usePointStyle: true,
                    font: {
                        size: 12
                    }
                }
            },
            title: {
                display: true,
                text: 'Task Status Distribution',
                font: {
                    size: 16,
                    weight: 'bold' as const
                }
            },
        },
    }

    return (
        <div className={`w-full h-80 ${className}`}>
            <Doughnut data={chartData} options={options} />
        </div>
    )
} 