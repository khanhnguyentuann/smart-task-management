import { apiClient } from '@/lib/api-client';
import { Project, CreateProjectDto, UpdateProjectDto, ProjectMember } from '@/types/project';
import { API_ENDPOINTS } from '@/constants/api';

export const projectService = {
    async getAll(): Promise<Project[]> {
        const response = await apiClient.get<Project[]>(API_ENDPOINTS.PROJECTS.BASE);
        return response.data;
    },

    async getById(id: string): Promise<Project> {
        const response = await apiClient.get<Project>(API_ENDPOINTS.PROJECTS.BY_ID(id));
        return response.data;
    },

    async create(data: CreateProjectDto): Promise<Project> {
        const response = await apiClient.post<Project>(API_ENDPOINTS.PROJECTS.BASE, data);
        return response.data;
    },

    async update(id: string, data: UpdateProjectDto): Promise<Project> {
        const response = await apiClient.patch<Project>(
            API_ENDPOINTS.PROJECTS.BY_ID(id),
            data
        );
        return response.data;
    },

    async delete(id: string): Promise<void> {
        await apiClient.delete(API_ENDPOINTS.PROJECTS.BY_ID(id));
    },

    async search(query: string): Promise<Project[]> {
        const response = await apiClient.get<Project[]>(
            `${API_ENDPOINTS.PROJECTS.SEARCH}?q=${encodeURIComponent(query)}`
        );
        return response.data;
    },

    async getMembers(projectId: string): Promise<ProjectMember[]> {
        const response = await apiClient.get<ProjectMember[]>(
            API_ENDPOINTS.PROJECTS.MEMBERS(projectId)
        );
        return response.data;
    },

    async addMembers(projectId: string, userIds: string[]): Promise<unknown> {
        const response = await apiClient.post(
            API_ENDPOINTS.PROJECTS.MEMBERS(projectId),
            { userIds }
        );
        return response.data;
    },

    async removeMember(projectId: string, userId: string): Promise<void> {
        await apiClient.delete(API_ENDPOINTS.PROJECTS.MEMBER(projectId, userId));
    },
};