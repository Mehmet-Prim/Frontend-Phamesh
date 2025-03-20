"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { MessageSquare, Building, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { AuthService } from "@/lib/services/auth-service"

const companyFormSchema = z
    .object({
        email: z.string().email({ message: "Please enter a valid email address" }),
        password: z.string().min(8, { message: "Password must be at least 8 characters" }),
        confirmPassword: z.string().min(8, { message: "Password must be at least 8 characters" }),
        companyName: z.string().min(2, { message: "Company name must be at least 2 characters" }),
        contactName: z.string().min(2, { message: "Contact name must be at least 2 characters" }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    })

const creatorFormSchema = z
    .object({
        email: z.string().email({ message: "Please enter a valid email address" }),
        password: z.string().min(8, { message: "Password must be at least 8 characters" }),
        confirmPassword: z.string().min(8, { message: "Password must be at least 8 characters" }),
        firstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
        lastName: z.string().min(2, { message: "Last name must be at least 2 characters" }),
        username: z.string().min(3, { message: "Username must be at least 3 characters" }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    })

export default function RegisterPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(false)
    const [activeTab, setActiveTab] = useState("company")

    useEffect(() => {
        const type = searchParams.get("type")
        if (type === "creator") {
            setActiveTab("creator")
        } else if (type === "company") {
            setActiveTab("company")
        }
    }, [searchParams])

    const companyForm = useForm<z.infer<typeof companyFormSchema>>({
        resolver: zodResolver(companyFormSchema),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
            companyName: "",
            contactName: "",
        },
    })

    const creatorForm = useForm<z.infer<typeof creatorFormSchema>>({
        resolver: zodResolver(creatorFormSchema),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
            firstName: "",
            lastName: "",
            username: "",
        },
    })

    async function onCompanySubmit(values: z.infer<typeof companyFormSchema>) {
        setIsLoading(true)
        try {
            await AuthService.registerCompany(values.email, values.password, values.companyName, values.contactName)
            toast({
                title: "Registration successful",
                description: "Please check your email to verify your account",
            })
            router.push("/auth/verify-email?email=" + encodeURIComponent(values.email))
        } catch (error) {
            toast({
                title: "Registration failed",
                description: "An error occurred during registration",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    async function onCreatorSubmit(values: z.infer<typeof creatorFormSchema>) {
        setIsLoading(true)
        try {
            await AuthService.registerCreator(
                values.email,
                values.password,
                values.firstName,
                values.lastName,
                values.username,
            )
            toast({
                title: "Registration successful",
                description: "Please check your email to verify your account",
            })
            router.push("/auth/verify-email?email=" + encodeURIComponent(values.email))
        } catch (error) {
            toast({
                title: "Registration failed",
                description: "An error occurred during registration",
                variant: "destructive",
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
                    <h1 className="text-2xl font-bold">Create an account</h1>
                    <p className="text-sm text-muted-foreground">
                        Choose your account type and enter your details to get started
                    </p>
                </div>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="company" className="flex items-center gap-2">
                            <Building className="h-4 w-4" />
                            Company
                        </TabsTrigger>
                        <TabsTrigger value="creator" className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Creator
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="company" className="space-y-4 pt-4">
                        <Form {...companyForm}>
                            <form onSubmit={companyForm.handleSubmit(onCompanySubmit)} className="space-y-4">
                                <FormField
                                    control={companyForm.control}
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
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={companyForm.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                    <Input type="password" placeholder="********" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={companyForm.control}
                                        name="confirmPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Confirm Password</FormLabel>
                                                <FormControl>
                                                    <Input type="password" placeholder="********" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={companyForm.control}
                                    name="companyName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Company Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Acme Inc." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={companyForm.control}
                                    name="contactName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Contact Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="John Doe" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? "Creating account..." : "Create Company Account"}
                                </Button>
                            </form>
                        </Form>
                    </TabsContent>
                    <TabsContent value="creator" className="space-y-4 pt-4">
                        <Form {...creatorForm}>
                            <form onSubmit={creatorForm.handleSubmit(onCreatorSubmit)} className="space-y-4">
                                <FormField
                                    control={creatorForm.control}
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
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={creatorForm.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                    <Input type="password" placeholder="********" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={creatorForm.control}
                                        name="confirmPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Confirm Password</FormLabel>
                                                <FormControl>
                                                    <Input type="password" placeholder="********" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={creatorForm.control}
                                        name="firstName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>First Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="John" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={creatorForm.control}
                                        name="lastName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Last Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Doe" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={creatorForm.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Username</FormLabel>
                                            <FormControl>
                                                <Input placeholder="johndoe" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? "Creating account..." : "Create Creator Account"}
                                </Button>
                            </form>
                        </Form>
                    </TabsContent>
                </Tabs>
                <div className="text-center text-sm">
                    Already have an account?{" "}
                    <Link href="/auth/login" className="text-primary underline-offset-4 hover:underline">
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    )
}

