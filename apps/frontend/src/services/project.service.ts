import { apiClient } from '@/lib/api-client';
import { Project, CreateProjectDto, UpdateProjectDto, ProjectMember } from '@/types/project';

export const projectService = {
    async getAll(): Promise<Project[]> {
        const response = await apiClient.get<Project[]>('/projects');
        return response.data;
    },

    async getById(id: string): Promise<Project> {
        const response = await apiClient.get<Project>(`/projects/${id}`);
        return response.data;
    },

    async create(data: CreateProjectDto): Promise<Project> {
        const response = await apiClient.post<Project>('/projects', data);
        return response.data;
    },

    async update(id: string, data: UpdateProjectDto): Promise<Project> {
        const response = await apiClient.patch<Project>(`/projects/${id}`, data);
        return response.data;
    },

    async delete(id: string): Promise<void> {
        await apiClient.delete(`/projects/${id}`);
    },

    async search(query: string): Promise<Project[]> {
        const response = await apiClient.get<Project[]>(`/projects/search?q=${query}`);
        return response.data;
    },

    async getMembers(projectId: string): Promise<ProjectMember[]> {
        const response = await apiClient.get<ProjectMember[]>(`/projects/${projectId}/members`);
        return response.data;
    },

    async addMembers(projectId: string, userIds: string[]): Promise<unknown> {
        const response = await apiClient.post(`/projects/${projectId}/members`, { userIds });
        return response.data;
    },

    async removeMember(projectId: string, userId: string): Promise<void> {
        await apiClient.delete(`/projects/${projectId}/members/${userId}`);
    },
};