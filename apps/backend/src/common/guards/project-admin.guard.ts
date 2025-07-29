import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class ProjectAdminGuard implements CanActivate {
    constructor(private prisma: PrismaService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const projectId = request.params.projectId;

        if (!projectId) {
            return false;
        }

        // Check if user is owner
        const project = await this.prisma.project.findFirst({
            where: {
                id: projectId,
                ownerId: user.id,
            },
        });

        if (project) {
            request.project = project;
            return true;
        }

        // Check if user is ADMIN in project
        const projectUser = await this.prisma.projectUser.findFirst({
            where: {
                projectId,
                userId: user.id,
                role: 'ADMIN',
            },
        });

        if (!projectUser) {
            throw new ForbiddenException('Only project admins can perform this action');
        }

        return true;
    }
}