import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDetailsDto } from './dto/save.dto';
import { SaveService } from './save.service';


@Controller('save')
export class SaveController {
  constructor(private readonly saveService: SaveService) {}

  @Post('save-user-data')
  async saveData(@Body() body: CreateUserDetailsDto) {
    const user = await this.saveService.saveUserInfo(
      body.fullName,
      body.email,
      body.message,
    );

    return {
      message: 'User info saved successfully',
      user,
    };
  }
}