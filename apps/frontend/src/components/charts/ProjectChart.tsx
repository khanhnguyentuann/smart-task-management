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

interface ProjectChartProps {
  className?: string
}

export function ProjectChart({ className }: ProjectChartProps) {
  const { projectData } = useChartData()

  const chartData = {
    labels: projectData.labels,
    datasets: [
      {
        label: 'Total Tasks',
        data: projectData.tasks,
        backgroundColor: '#3b82f6',
        borderColor: '#2563eb',
        borderWidth: 2,
        borderRadius: 4,
      },
      {
        label: 'Completed Tasks',
        data: projectData.completed,
        backgroundColor: '#10b981',
        borderColor: '#059669',
        borderWidth: 2,
        borderRadius: 4,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Tasks by Project',
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
          stepSize: 2,
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