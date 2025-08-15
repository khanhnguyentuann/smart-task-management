import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { AssigneesService } from './assignees/assignees.service';
import { DatabaseModule } from '../database/database.module';

@Module({
    imports: [DatabaseModule],
    controllers: [TasksController],
    providers: [TasksService, AssigneesService],
    exports: [TasksService],
})
export class TasksModule { }
