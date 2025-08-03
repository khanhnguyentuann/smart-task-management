"use client"

import { ProtectedLayout } from "@/components/layout/ProtectedLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import {
    TaskStatusChart,
    PriorityChart,
    ProgressChart,
    ProjectChart
} from "@/components/charts"

export default function ReportsPage() {
    return (
        <ProtectedLayout>
            <div className="p-6 space-y-6">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-3xl font-bold tracking-tight">
                        Analytics & Reports
                    </h1>
                    <p className="text-muted-foreground">
                        Track your team&apos;s productivity and project progress
                    </p>
                </motion.div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Task Status Distribution */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle>Task Status Overview</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <TaskStatusChart />
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Priority Distribution */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle>Task Priority Analysis</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <PriorityChart />
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Progress Timeline */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="md:col-span-2"
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle>Weekly Progress</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ProgressChart />
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Project Comparison */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="md:col-span-2"
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle>Project Performance</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ProjectChart />
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </ProtectedLayout>
    )
} 