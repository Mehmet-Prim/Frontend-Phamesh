import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Building } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import type { ConversationDto } from "@/lib/types"

interface ConversationListProps {
    conversations: ConversationDto[]
}

export function ConversationList({ conversations }: ConversationListProps) {
    return (
        <div className="space-y-2">
            {conversations.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-muted-foreground">No conversations yet</p>
                </div>
            ) : (
                conversations.map((conversation) => {
                    // Format the timestamp to a relative time (e.g., "2 hours ago")
                    const timeAgo = formatDistanceToNow(new Date(conversation.lastMessageTime), { addSuffix: true })

                    return (
                        <Link key={conversation.id} href={`/dashboard/messages/${conversation.id}`} className="block">
                            <div className="flex items-start gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50">
                                <Avatar>
                                    <AvatarFallback>
                                        <Building className="h-4 w-4" />
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center justify-between">
                                        <p className="font-medium">{conversation.companyName || conversation.contentCreatorName}</p>
                                        <p className="text-xs text-muted-foreground">{timeAgo}</p>
                                    </div>
                                    <p className="text-sm text-muted-foreground line-clamp-1">{conversation.lastMessage}</p>
                                </div>
                                {conversation.unreadCount > 0 && (
                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                                        {conversation.unreadCount}
                                    </div>
                                )}
                            </div>
                        </Link>
                    )
                })
            )}
        </div>
    )
}

