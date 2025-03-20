"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { MessageSquare, ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast"
import { AuthService } from "@/lib/services/auth-service"
import { UserRole } from "@/lib/types"

const formSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email address" }),
    role: z.nativeEnum(UserRole, {
        required_error: "Please select a role",
    }),
})

export default function ForgotPasswordPage() {
    const router = useRouter()
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            role: undefined,
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true)
        try {
            await AuthService.forgotPassword(values.email, values.role)
            setSubmitted(true)
            toast({
                title: "Reset link sent",
                description: "If an account exists with this email, you will receive a password reset link",
            })
        } catch (error) {
            // We don't show an error even if the email doesn't exist for security reasons
            setSubmitted(true)
            toast({
                title: "Reset link sent",
                description: "If an account exists with this email, you will receive a password reset link",
            })
        } finally {
            setIsLoading(false)
        }
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
                    <p className="text-sm text-muted-foreground">
                        {submitted
                            ? "Check your email for a reset link"
                            : "Enter your email and select your account type to receive a password reset link"}
                    </p>
                </div>
                {!submitted ? (
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
                                                <Input placeholder="email@example.com" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="role"
                                    render={({ field }) => (
                                        <FormItem className="space-y-3">
                                            <FormLabel>Account Type</FormLabel>
                                            <FormControl>
                                                <RadioGroup
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                    className="flex flex-col space-y-1"
                                                >
                                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                                        <FormControl>
                                                            <RadioGroupItem value={UserRole.COMPANY} />
                                                        </FormControl>
                                                        <FormLabel className="font-normal">Company</FormLabel>
                                                    </FormItem>
                                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                                        <FormControl>
                                                            <RadioGroupItem value={UserRole.CONTENT_CREATOR} />
                                                        </FormControl>
                                                        <FormLabel className="font-normal">Content Creator</FormLabel>
                                                    </FormItem>
                                                </RadioGroup>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? "Sending..." : "Send Reset Link"}
                                </Button>
                            </form>
                        </Form>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <Button className="w-full" onClick={() => router.push("/auth/login")}>
                            Return to Login
                        </Button>
                    </div>
                )}
                <div className="text-center text-sm">
                    <Link
                        href="/auth/login"
                        className="flex items-center justify-center gap-1 text-primary underline-offset-4 hover:underline"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to login
                    </Link>
                </div>
            </div>
        </div>
    )
}

