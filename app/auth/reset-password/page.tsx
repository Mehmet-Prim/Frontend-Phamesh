"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { MessageSquare } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { AuthService } from "@/lib/services/auth-service"

const formSchema = z
    .object({
        email: z.string().email({ message: "Please enter a valid email address" }),
        password: z.string().min(8, { message: "Password must be at least 8 characters" }),
        confirmPassword: z.string().min(8, { message: "Password must be at least 8 characters" }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    })

export default function ResetPasswordPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(false)

    const token = searchParams.get("token")
    const email = searchParams.get("email") || ""

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: email,
            password: "",
            confirmPassword: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!token) {
            toast({
                title: "Invalid token",
                description: "The reset link is invalid or has expired",
                variant: "destructive",
            })
            return
        }

        setIsLoading(true)
        try {
            await AuthService.resetPassword(token, values.email, values.password, values.confirmPassword)
            toast({
                title: "Password reset successful",
                description: "Your password has been reset successfully",
            })
            router.push("/auth/login")
        } catch (error) {
            toast({
                title: "Password reset failed",
                description: "The reset link is invalid or has expired",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    if (!token) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center p-4">
                <div className="mx-auto w-full max-w-md space-y-6">
                    <div className="flex flex-col items-center space-y-2 text-center">
                        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                            <MessageSquare className="h-6 w-6" />
                            <span>Phamesh</span>
                        </Link>
                        <h1 className="text-2xl font-bold">Invalid reset link</h1>
                        <p className="text-sm text-muted-foreground">The password reset link is invalid or has expired</p>
                    </div>
                    <div className="space-y-4">
                        <Button className="w-full" onClick={() => router.push("/auth/forgot-password")}>
                            Request a new reset link
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
            <div className="mx-auto w-full max-w-md space-y-6">
                <div className="flex flex-col items-center space-y-2 text-center">
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                        <MessageSquare className="h-6 w-6" />
                        <span>Phamesh</span>
                    </Link>
                    <h1 className="text-2xl font-bold">Reset your password</h1>
                    <p className="text-sm text-muted-foreground">Enter your new password below</p>
                </div>
                <div className="space-y-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="email@example.com" {...field} disabled={!!email} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>New Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="********" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirm New Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="********" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? "Resetting..." : "Reset Password"}
                            </Button>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    )
}

