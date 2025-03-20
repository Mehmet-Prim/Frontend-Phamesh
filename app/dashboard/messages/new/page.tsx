"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { MessageService } from "@/lib/services/message-service"
import { UserService } from "@/lib/services/user-service"
import { type Company, type ContentCreator, UserRole } from "@/lib/types"

const formSchema = z.object({
    recipientId: z.string({
        required_error: "Please select a recipient",
    }),
    message: z.string().min(1, { message: "Message is required" }),
})

export default function NewConversationPage() {
    const router = useRouter()
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(false)
    const [recipients, setRecipients] = useState<(Company | ContentCreator)[]>([])
    const [recipientsLoading, setRecipientsLoading] = useState(true)

    // In a real app, this would come from an auth context
    const currentUserRole = UserRole.COMPANY // Placeholder

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            recipientId: "",
            message: "",
        },
    })

    useEffect(() => {
        async function loadRecipients() {
            setRecipientsLoading(true)
            try {
                // Load the appropriate recipients based on the current user's role
                if (currentUserRole === UserRole.COMPANY) {
                    const creators = await UserService.getCreators()
                    setRecipients(creators)
                } else {
                    const companies = await UserService.getCompanies()
                    setRecipients(companies)
                }
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Failed to load recipients",
                    variant: "destructive",
                })
            } finally {
                setRecipientsLoading(false)
            }
        }

        loadRecipients()
    }, [currentUserRole, toast])

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true)
        try {
            const recipientId = Number.parseInt(values.recipientId)
            const conversation = await MessageService.startConversation(recipientId, values.message)

            toast({
                title: "Message sent",
                description: "Your message has been sent successfully",
            })

            router.push(`/dashboard/messages/${conversation.id}`)
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to send message",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold tracking-tight">New Conversation</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Start a new conversation</CardTitle>
                    <CardDescription>
                        Send a message to a {currentUserRole === UserRole.COMPANY ? "content creator" : "company"}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="recipientId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Recipient</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={recipientsLoading}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a recipient" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {recipients.map((recipient) => (
                                                    <SelectItem key={recipient.id} value={recipient.id.toString()}>
                                                        {currentUserRole === UserRole.COMPANY
                                                            ? `${(recipient as ContentCreator).firstName} ${(recipient as ContentCreator).lastName}`
                                                            : (recipient as Company).companyName}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="message"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Message</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Type your message here..." className="min-h-[120px]" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex justify-end">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="mr-2"
                                    onClick={() => router.push("/dashboard/messages")}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isLoading || recipientsLoading}>
                                    {isLoading ? "Sending..." : "Send Message"}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}

