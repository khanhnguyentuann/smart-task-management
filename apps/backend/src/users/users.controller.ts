import { Body, Controller, Get, Query, UseGuards, Param, Post, Patch, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get()
  async findAll(@Query('search') search?: string) {
    return this.usersService.findAll(search);
  }

  // Place specific static route before param route to avoid conflicts
  @Get('profile')
  async me(@CurrentUser() user: User) {
    return this.usersService.findById(user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Patch('profile')
  async updateProfile(
    @CurrentUser() user: User,
    @Body() payload: { firstName?: string; lastName?: string; department?: string; dateOfBirth?: string; avatar?: string },
  ) {
    return this.usersService.updateProfile(user.id, payload);
  }

  @Post('avatar')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @CurrentUser() user: User,
    @UploadedFile() file?: any,
    @Body('avatar') avatarBase64?: string,
  ) {
    return this.usersService.updateAvatar(user.id, file, avatarBase64);
  }

  @Get('avatar/:userId')
  async getAvatar(@Param('userId') userId: string) {
    const avatar = await this.usersService.getAvatar(userId);
    return { avatar };
  }
}