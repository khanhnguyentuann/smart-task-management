"use client"

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { useChartData } from '@/hooks/useChartData'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

interface PriorityChartProps {
  className?: string
}

export function PriorityChart({ className }: PriorityChartProps) {
  const { priorityData } = useChartData()

  const chartData = {
    labels: ['Low', 'Medium', 'High'],
    datasets: [
      {
        label: 'Number of Tasks',
        data: [
          priorityData.low,
          priorityData.medium,
          priorityData.high
        ],
        backgroundColor: [
          '#10b981', // Green for low
          '#f59e0b', // Yellow for medium
          '#ef4444'  // Red for high
        ],
        borderColor: [
          '#059669',
          '#d97706',
          '#dc2626'
        ],
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Task Priority Distribution',
        font: {
          size: 16,
          weight: 'bold' as const
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  }

  return (
    <div className={`w-full h-80 ${className}`}>
      <Bar data={chartData} options={options} />
    </div>
  )
} 