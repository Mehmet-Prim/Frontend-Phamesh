"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { BarChart, LineChart, Users, ShoppingCart, TrendingUp, AlertTriangle, RefreshCw } from "lucide-react"
import { format } from "date-fns"
import { de } from "date-fns/locale"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"

// Typen für die Dashboard-Daten
interface DashboardData {
    stats: {
        totalUsers: number
        activeUsers: number
        totalOrders: number
        revenue: number
        growth: number
    }
    recentActivity: {
        id: string
        type: string
        user: string
        timestamp: string
        details: string
    }[]
    alerts: {
        id: string
        severity: "low" | "medium" | "high"
        message: string
        timestamp: string
    }[]
    performance: {
        cpu: number
        memory: number
        disk: number
        network: number
    }
}

export default function DashboardPage() {
    const router = useRouter()
    const [data, setData] = useState<DashboardData | null>(null)
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)

    const { toast } = useToast()

    const fetchDashboardData = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dashboard`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })

            if (response.status === 401) {
                // Token ist abgelaufen oder ungültig
                localStorage.removeItem("token")
                router.push("/login")
                return
            }

            if (!response.ok) {
                throw new Error("Fehler beim Laden der Dashboard-Daten")
            }

            const dashboardData = await response.json()
            setData(dashboardData)
        } catch (error) {
            console.error("Fehler beim Laden der Dashboard-Daten:", error)
            toast({
                title: "Fehler",
                description: "Die Dashboard-Daten konnten nicht geladen werden.",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }

    useEffect(() => {
        // Prüfen, ob der Benutzer eingeloggt ist
        const token = localStorage.getItem("token")
        if (!token) {
            router.push("/login")
            return
        }

        fetchDashboardData()

        // Daten alle 30 Sekunden aktualisieren
        const intervalId = setInterval(() => {
            fetchDashboardData()
        }, 30000)

        return () => clearInterval(intervalId)
    }, [router])

    const handleRefresh = () => {
        setRefreshing(true)
        fetchDashboardData()
    }

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case "high":
                return "bg-red-100 text-red-800 border-red-200"
            case "medium":
                return "bg-yellow-100 text-yellow-800 border-yellow-200"
            case "low":
                return "bg-green-100 text-green-800 border-green-200"
            default:
                return "bg-gray-100 text-gray-800 border-gray-200"
        }
    }

    if (loading) {
        return (
            <div className="container mx-auto p-6">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                    <Skeleton className="h-10 w-24" />
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} className="h-32 w-full" />
                    ))}
                </div>
                <div className="mt-6 grid gap-6 md:grid-cols-2">
                    <Skeleton className="h-96 w-full" />
                    <Skeleton className="h-96 w-full" />
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-6">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <Button onClick={handleRefresh} disabled={refreshing} className="flex items-center gap-2">
                    <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                    Aktualisieren
                </Button>
            </div>

            {data && (
                <>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">Benutzer</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{data.stats.totalUsers.toLocaleString()}</div>
                                <p className="text-xs text-muted-foreground">
                                    {data.stats.activeUsers.toLocaleString()} aktive Benutzer
                                </p>
                                <div className="mt-4">
                                    <Progress value={(data.stats.activeUsers / data.stats.totalUsers) * 100} />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">Bestellungen</CardTitle>
                                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{data.stats.totalOrders.toLocaleString()}</div>
                                <p className="text-xs text-muted-foreground">{format(new Date(), "MMMM yyyy", { locale: de })}</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">Umsatz</CardTitle>
                                <LineChart className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {data.stats.revenue.toLocaleString("de-DE", {
                                        style: "currency",
                                        currency: "EUR",
                                    })}
                                </div>
                                <p className="text-xs text-muted-foreground">{format(new Date(), "MMMM yyyy", { locale: de })}</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">Wachstum</CardTitle>
                                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {data.stats.growth > 0 ? "+" : ""}
                                    {data.stats.growth.toFixed(1)}%
                                </div>
                                <p className="text-xs text-muted-foreground">Im Vergleich zum Vormonat</p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="mt-6 grid gap-6 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Systemleistung</CardTitle>
                                <CardDescription>Aktuelle Auslastung der Systemressourcen</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <div className="mb-1 flex items-center justify-between">
                                        <span className="text-sm">CPU</span>
                                        <span className="text-sm font-medium">{data.performance.cpu}%</span>
                                    </div>
                                    <Progress value={data.performance.cpu} className="h-2" />
                                </div>
                                <div>
                                    <div className="mb-1 flex items-center justify-between">
                                        <span className="text-sm">Arbeitsspeicher</span>
                                        <span className="text-sm font-medium">{data.performance.memory}%</span>
                                    </div>
                                    <Progress value={data.performance.memory} className="h-2" />
                                </div>
                                <div>
                                    <div className="mb-1 flex items-center justify-between">
                                        <span className="text-sm">Festplatte</span>
                                        <span className="text-sm font-medium">{data.performance.disk}%</span>
                                    </div>
                                    <Progress value={data.performance.disk} className="h-2" />
                                </div>
                                <div>
                                    <div className="mb-1 flex items-center justify-between">
                                        <span className="text-sm">Netzwerk</span>
                                        <span className="text-sm font-medium">{data.performance.network}%</span>
                                    </div>
                                    <Progress value={data.performance.network} className="h-2" />
                                </div>
                            </CardContent>
                        </Card>

                        <Tabs defaultValue="activity">
                            <Card>
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                        <CardTitle>Übersicht</CardTitle>
                                        <TabsList>
                                            <TabsTrigger value="activity">Aktivität</TabsTrigger>
                                            <TabsTrigger value="alerts">Warnungen</TabsTrigger>
                                        </TabsList>
                                    </div>
                                </CardHeader>
                                <CardContent className="px-0 pt-0">
                                    <TabsContent value="activity" className="px-6">
                                        <div className="space-y-4">
                                            {data.recentActivity.map((activity) => (
                                                <div key={activity.id} className="flex items-start gap-4 rounded-lg border p-3">
                                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                                                        {activity.type === "login" && <Users className="h-5 w-5 text-primary" />}
                                                        {activity.type === "order" && <ShoppingCart className="h-5 w-5 text-primary" />}
                                                        {activity.type === "system" && <BarChart className="h-5 w-5 text-primary" />}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between">
                                                            <p className="text-sm font-medium">{activity.user}</p>
                                                            <time className="text-xs text-muted-foreground">
                                                                {format(new Date(activity.timestamp), "dd.MM.yyyy HH:mm")}
                                                            </time>
                                                        </div>
                                                        <p className="mt-1 text-sm text-muted-foreground">{activity.details}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </TabsContent>
                                    <TabsContent value="alerts" className="px-6">
                                        <div className="space-y-4">
                                            {data.alerts.length === 0 ? (
                                                <p className="text-center text-sm text-muted-foreground">Keine Warnungen vorhanden</p>
                                            ) : (
                                                data.alerts.map((alert) => (
                                                    <div key={alert.id} className="flex items-start gap-4 rounded-lg border p-3">
                                                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-100">
                                                            <AlertTriangle className="h-5 w-5 text-red-600" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex items-center justify-between">
                                                                <Badge className={getSeverityColor(alert.severity)}>
                                                                    {alert.severity === "high" && "Hoch"}
                                                                    {alert.severity === "medium" && "Mittel"}
                                                                    {alert.severity === "low" && "Niedrig"}
                                                                </Badge>
                                                                <time className="text-xs text-muted-foreground">
                                                                    {format(new Date(alert.timestamp), "dd.MM.yyyy HH:mm")}
                                                                </time>
                                                            </div>
                                                            <p className="mt-1 text-sm">{alert.message}</p>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </TabsContent>
                                </CardContent>
                                <CardFooter>
                                    <Button variant="outline" className="w-full">
                                        Alle anzeigen
                                    </Button>
                                </CardFooter>
                            </Card>
                        </Tabs>
                    </div>
                </>
            )}
        </div>
    )
}

