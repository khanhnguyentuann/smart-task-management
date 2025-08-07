import { Global, Module } from '@nestjs/common';
import { ProjectMemberGuard } from './guards/project-member.guard';
import { ProjectOwnerGuard } from './guards/project-owner.guard';

@Global()
@Module({
    providers: [
        ProjectMemberGuard,
        ProjectOwnerGuard,
    ],
    exports: [
        ProjectMemberGuard,
        ProjectOwnerGuard,
    ],
})
export class CommonModule { }