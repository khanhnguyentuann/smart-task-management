import {
    Controller,
    Post,
    Delete,
    Get,
    Param,
    Body,
    UseGuards,
    ValidationPipe,
    ForbiddenException,
} from '@nestjs/common';
import { MembersService } from './members.service';
import { AddMembersDto } from './dto/add-members.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ProjectMemberGuard } from '../../common/guards/project-member.guard';
import { ProjectOwnerGuard } from '../../common/guards/project-owner.guard';
import { User } from '@prisma/client';

@Controller('projects/:projectId/members')
@UseGuards(JwtAuthGuard, ProjectMemberGuard)
export class MembersController {
    constructor(private readonly membersService: MembersService) { }

    @Get()
    async getMembers(@Param('projectId') projectId: string) {
        return this.membersService.getProjectMembers(projectId);
    }

    @Post()
    @UseGuards(ProjectOwnerGuard)
    async addMembers(
        @Param('projectId') projectId: string,
        @Body(ValidationPipe) addMembersDto: AddMembersDto,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        @CurrentUser() _user: User, // Required for guard validation
    ) {
        return this.membersService.addMembers(projectId, addMembersDto.userIds);
    }

    @Delete(':userId')
    @UseGuards(ProjectOwnerGuard)
    async removeMember(
        @Param('projectId') projectId: string,
        @Param('userId') userId: string,
        @CurrentUser() user: User,
    ) {
        // Prevent owner from removing themselves
        if (userId === user.id) {
            const isOwner = await this.membersService.isProjectOwner(projectId, userId);
            if (isOwner) {
                throw new ForbiddenException('Project owner cannot be removed');
            }
        }

        return this.membersService.removeMember(projectId, userId);
    }
}