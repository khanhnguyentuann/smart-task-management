export interface Project {
    id: string;
    name: string;
    description?: string;
    ownerId: string;
    createdAt: string;
    updatedAt: string;
    owner: {
        id: string;
        email: string;
        role: string;
    };
    _count?: {
        projectUsers: number;
    };
}

export interface CreateProjectDto {
    name: string;
    description?: string;
    memberIds?: string[];
}

export interface UpdateProjectDto {
    name?: string;
    description?: string;
}

export interface ProjectMember {
    user: {
        id: string;
        email: string;
        role: string;
    };
    projectRole: 'ADMIN' | 'MEMBER';
    joinedAt: string;
}