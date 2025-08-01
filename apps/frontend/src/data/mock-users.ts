export interface MockUser {
    id: string
    name: string
    email: string
    role: "Admin" | "Member"
    avatar: string
    department: string
}

export const mockUsers: MockUser[] = [
    {
        id: "1",
        name: "Sarah Chen",
        email: "sarah@company.com",
        role: "Admin",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
        department: "Product Design",
    },
    {
        id: "2",
        name: "Alex Rodriguez",
        email: "alex@company.com",
        role: "Member",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        department: "Engineering",
    },
    {
        id: "3",
        name: "Emily Johnson",
        email: "emily@company.com",
        role: "Admin",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
        department: "Marketing",
    },
    {
        id: "4",
        name: "Michael Kim",
        email: "michael@company.com",
        role: "Member",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        department: "Engineering",
    },
]