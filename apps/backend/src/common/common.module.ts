import { Global, Module } from '@nestjs/common';
import { ProjectMemberGuard } from './guards/project-member.guard';
import { ProjectOwnerGuard } from './guards/project-owner.guard';
import { ProjectAdminGuard } from './guards/project-admin.guard';

@Global()
@Module({
    providers: [
        ProjectMemberGuard,
        ProjectOwnerGuard,
        ProjectAdminGuard,
    ],
    exports: [
        ProjectMemberGuard,
        ProjectOwnerGuard,
        ProjectAdminGuard,
    ],
})
export class CommonModule { }