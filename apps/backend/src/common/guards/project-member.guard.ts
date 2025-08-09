import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class ProjectMemberGuard implements CanActivate {
    constructor(private prisma: PrismaService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const projectId = request.params.projectId || request.body.projectId;

        if (!user || !projectId) {
            throw new ForbiddenException('Access denied');
        }

        // Check if user is project owner or member
        const project = await this.prisma.project.findFirst({
            where: {
                id: projectId,
                OR: [
                    { ownerId: user.id },
                    {
                        members: {
                            some: {
                                userId: user.id,
                            },
                        },
                    },
                ],
            },
        });

        if (!project) {
            throw new ForbiddenException('You are not a member of this project');
        }

        return true;
    }
}