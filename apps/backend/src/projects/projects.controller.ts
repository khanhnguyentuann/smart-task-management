import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Query,
    ValidationPipe,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '@prisma/client';
import { SkipResponseWrapper } from 'src/common/decorators/skip-response-wrapper.decorator';

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
    constructor(private readonly projectsService: ProjectsService) { }

    @Post()
    create(
        @Body(ValidationPipe) createProjectDto: CreateProjectDto,
        @CurrentUser() user: User,
    ) {
        return this.projectsService.create(createProjectDto, user.id);
    }

    @Get()
    @SkipResponseWrapper()
    findAll(@CurrentUser() user: User) {
        return this.projectsService.findAll(user.id);
    }

    @Get('search')
    search(
        @Query('q') query: string,
        @CurrentUser() user: User,
    ) {
        return this.projectsService.searchProjects(user.id, query || '');
    }

    @Get(':id')
    findOne(@Param('id') id: string, @CurrentUser() user: User) {
        return this.projectsService.findOne(id, user.id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body(ValidationPipe) updateProjectDto: UpdateProjectDto,
        @CurrentUser() user: User,
    ) {
        return this.projectsService.update(id, updateProjectDto, user.id);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @CurrentUser() user: User) {
        return this.projectsService.remove(id, user.id);
    }
}