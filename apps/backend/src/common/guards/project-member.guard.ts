import {
    Injectable,
    CanActivate,
    ExecutionContext,
    NotFoundException,
    ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class ProjectMemberGuard implements CanActivate {
    constructor(private prisma: PrismaService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const projectId = request.params.projectId;

        if (!projectId) {
            return true; // No project ID in route, skip this guard
        }

        // Check if user is owner or member
        const project = await this.prisma.project.findFirst({
            where: {
                id: projectId,
                OR: [
                    { ownerId: user.id },
                    {
                        projectUsers: {
                            some: {
                                userId: user.id,
                            },
                        },
                    },
                ],
            },
        });

        if (!project) {
            throw new NotFoundException('Project not found or access denied');
        }

        // Attach project to request for use in controllers
        request.project = project;

        return true;
    }
}