import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { AssigneesService } from './assignees/assignees.service';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { DatabaseModule } from '../database/database.module';

@Module({
    imports: [DatabaseModule],
    controllers: [TasksController, CommentsController],
    providers: [TasksService, AssigneesService, CommentsService],
    exports: [TasksService, CommentsService],
})
export class TasksModule { }
