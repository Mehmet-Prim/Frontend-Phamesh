"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { AuthService } from "@/lib/services/auth-service"
import { CompanyService } from "@/lib/services/company-service"
import { CreatorService } from "@/lib/services/creator-service"
import { UserRole, type Company, type ContentCreator } from "@/lib/types"

const companyProfileFormSchema = z.object({
    companyName: z.string().min(2, { message: "Company name must be at least 2 characters" }),
    contactName: z.string().min(2, { message: "Contact name must be at least 2 characters" }),
    companySize: z.string().optional(),
    industry: z.string().optional(),
    website: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal("")),
})

const creatorProfileFormSchema = z.object({
    firstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
    lastName: z.string().min(2, { message: "Last name must be at least 2 characters" }),
    username: z.string().min(3, { message: "Username must be at least 3 characters" }),
    contentType: z.string().optional(),
    bio: z.string().max(500, { message: "Bio must be less than 500 characters" }).optional(),
})

const socialMediaFormSchema = z.object({
    instagram: z.string().optional(),
    youtube: z.string().optional(),
    tiktok: z.string().optional(),
    twitter: z.string().optional(),
})

const passwordFormSchema = z
    .object({
        currentPassword: z.string().min(8, { message: "Password must be at least 8 characters" }),
        newPassword: z.string().min(8, { message: "Password must be at least 8 characters" }),
        confirmPassword: z.string().min(8, { message: "Password must be at least 8 characters" }),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    })

export default function ProfilePage() {
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(false)
    const [currentUser, setCurrentUser] = useState<Company | ContentCreator | null>(null)
    const [userRole, setUserRole] = useState<UserRole | null>(null)

    // Load current user
    useEffect(() => {
        async function loadCurrentUser() {
            try {
                const user = await AuthService.getCurrentUser()
                setUserRole(user.role as UserRole)

                if (user.role === UserRole.COMPANY) {
                    const company = await CompanyService.getCompanyProfile()
                    setCurrentUser(company)
                    companyProfileForm.reset({
                        companyName: company.companyName || "",
                        contactName: company.contactName || "",
                        companySize: company.companySize || "",
                        industry: company.industry || "",
                        website: company.website || "",
                    })
                } else {
                    const creator = await CreatorService.getCreatorProfile()
                    setCurrentUser(creator)
                    creatorProfileForm.reset({
                        firstName: creator.firstName || "",
                        lastName: creator.lastName || "",
                        username: creator.username || "",
                        contentType: creator.contentType || "",
                        bio: creator.bio || "",
                    })

                    if (creator.socialMedia) {
                        socialMediaForm.reset({
                            instagram: creator.socialMedia.instagram || "",
                            youtube: creator.socialMedia.youtube || "",
                            tiktok: creator.socialMedia.tiktok || "",
                            twitter: creator.socialMedia.twitter || "",
                        })
                    }
                }
            } catch (error) {
                console.error("Failed to load user profile:", error)
                toast({
                    title: "Fehler",
                    description: "Benutzerprofil konnte nicht geladen werden",
                    variant: "destructive",
                })
            }
        }

        loadCurrentUser()
    }, [toast])

    const companyProfileForm = useForm<z.infer<typeof companyProfileFormSchema>>({
        resolver: zodResolver(companyProfileFormSchema),
        defaultValues: {
            companyName: "",
            contactName: "",
            companySize: "",
            industry: "",
            website: "",
        },
    })

    const creatorProfileForm = useForm<z.infer<typeof creatorProfileFormSchema>>({
        resolver: zodResolver(creatorProfileFormSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            username: "",
            contentType: "",
            bio: "",
        },
    })

    const socialMediaForm = useForm<z.infer<typeof socialMediaFormSchema>>({
        resolver: zodResolver(socialMediaFormSchema),
        defaultValues: {
            instagram: "",
            youtube: "",
            tiktok: "",
            twitter: "",
        },
    })

    const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
        resolver: zodResolver(passwordFormSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    })

    async function onCompanyProfileSubmit(values: z.infer<typeof companyProfileFormSchema>) {
        setIsLoading(true)
        try {
            await CompanyService.updateCompanyProfile(values)
            toast({
                title: "Profile updated",
                description: "Your company profile has been updated successfully",
            })
        } catch (error) {
            toast({
                title: "Failed to update profile",
                description: "An error occurred while updating your profile",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    async function onCreatorProfileSubmit(values: z.infer<typeof creatorProfileFormSchema>) {
        setIsLoading(true)
        try {
            await CreatorService.updateCreatorProfile(values)
            toast({
                title: "Profile updated",
                description: "Your profile has been updated successfully",
            })
        } catch (error) {
            toast({
                title: "Failed to update profile",
                description: "An error occurred while updating your profile",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    async function onSocialMediaSubmit(values: z.infer<typeof socialMediaFormSchema>) {
        setIsLoading(true)
        try {
            await CreatorService.updateSocialMedia(values)
            toast({
                title: "Social media updated",
                description: "Your social media links have been updated successfully",
            })
        } catch (error) {
            toast({
                title: "Failed to update social media",
                description: "An error occurred while updating your social media links",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    async function onPasswordSubmit(values: z.infer<typeof passwordFormSchema>) {
        setIsLoading(true)
        try {
            // Implement password change API call
            toast({
                title: "Password changed",
                description: "Your password has been changed successfully",
            })
            passwordForm.reset({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            })
        } catch (error) {
            toast({
                title: "Failed to change password",
                description: "An error occurred while changing your password",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    if (!currentUser || !userRole) {
        return (
            <div className="flex flex-col gap-4">
                <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
                <div className="h-[400px] flex items-center justify-center">
                    <p className="text-muted-foreground">Loading profile...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
            <Tabs defaultValue="general" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="general">General</TabsTrigger>
                    {userRole === UserRole.CONTENT_CREATOR && <TabsTrigger value="social">Social Media</TabsTrigger>}
                    <TabsTrigger value="password">Password</TabsTrigger>
                </TabsList>
                <TabsContent value="general">
                    <Card>
                        <CardHeader>
                            <CardTitle>General Information</CardTitle>
                            <CardDescription>Update your personal information</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {userRole === UserRole.COMPANY ? (
                                <Form {...companyProfileForm}>
                                    <form onSubmit={companyProfileForm.handleSubmit(onCompanyProfileSubmit)} className="space-y-4">
                                        <FormField
                                            control={companyProfileForm.control}
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
                                            control={companyProfileForm.control}
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
                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                            <FormField
                                                control={companyProfileForm.control}
                                                name="companySize"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Company Size</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="1-10 employees" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={companyProfileForm.control}
                                                name="industry"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Industry</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Technology" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <FormField
                                            control={companyProfileForm.control}
                                            name="website"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Website</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="https://example.com" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button type="submit" disabled={isLoading}>
                                            {isLoading ? "Saving..." : "Save Changes"}
                                        </Button>
                                    </form>
                                </Form>
                            ) : (
                                <Form {...creatorProfileForm}>
                                    <form onSubmit={creatorProfileForm.handleSubmit(onCreatorProfileSubmit)} className="space-y-4">
                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                            <FormField
                                                control={creatorProfileForm.control}
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
                                                control={creatorProfileForm.control}
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
                                            control={creatorProfileForm.control}
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
                                        <FormField
                                            control={creatorProfileForm.control}
                                            name="contentType"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Content Type</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Tech & Lifestyle" {...field} />
                                                    </FormControl>
                                                    <FormDescription>
                                                        The type of content you create (e.g., Tech, Fashion, Fitness)
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={creatorProfileForm.control}
                                            name="bio"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Bio</FormLabel>
                                                    <FormControl>
                                                        <Textarea placeholder="Tell us about yourself" className="resize-none" {...field} />
                                                    </FormControl>
                                                    <FormDescription>Brief description about yourself and your content</FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button type="submit" disabled={isLoading}>
                                            {isLoading ? "Saving..." : "Save Changes"}
                                        </Button>
                                    </form>
                                </Form>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
                {userRole === UserRole.CONTENT_CREATOR && (
                    <TabsContent value="social">
                        <Card>
                            <CardHeader>
                                <CardTitle>Social Media</CardTitle>
                                <CardDescription>Connect your social media accounts</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form {...socialMediaForm}>
                                    <form onSubmit={socialMediaForm.handleSubmit(onSocialMediaSubmit)} className="space-y-4">
                                        <FormField
                                            control={socialMediaForm.control}
                                            name="instagram"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Instagram</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="username" {...field} />
                                                    </FormControl>
                                                    <FormDescription>Your Instagram username without the @ symbol</FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={socialMediaForm.control}
                                            name="youtube"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>YouTube</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="channel name" {...field} />
                                                    </FormControl>
                                                    <FormDescription>Your YouTube channel name</FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={socialMediaForm.control}
                                            name="tiktok"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>TikTok</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="username" {...field} />
                                                    </FormControl>
                                                    <FormDescription>Your TikTok username without the @ symbol</FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={socialMediaForm.control}
                                            name="twitter"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Twitter</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="username" {...field} />
                                                    </FormControl>
                                                    <FormDescription>Your Twitter username without the @ symbol</FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button type="submit" disabled={isLoading}>
                                            {isLoading ? "Saving..." : "Save Changes"}
                                        </Button>
                                    </form>
                                </Form>
                            </CardContent>
                        </Card>
                    </TabsContent>
                )}
                <TabsContent value="password">
                    <Card>
                        <CardHeader>
                            <CardTitle>Change Password</CardTitle>
                            <CardDescription>Update your password</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...passwordForm}>
                                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                                    <FormField
                                        control={passwordForm.control}
                                        name="currentPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Current Password</FormLabel>
                                                <FormControl>
                                                    <Input type="password" placeholder="********" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={passwordForm.control}
                                        name="newPassword"
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
                                        control={passwordForm.control}
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
                                    <Button type="submit" disabled={isLoading}>
                                        {isLoading ? "Changing..." : "Change Password"}
                                    </Button>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

