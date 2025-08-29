import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEmails } from './entities/save.entity';
import { SaveController } from './save.controller';
import { SaveService } from './save.service';
import { RabbitmqService } from '../rabbitmq/rabbitmq.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([UserEmails])],
  controllers: [SaveController],
  providers: [ ConfigService, SaveService, RabbitmqService,],

})
export class SaveModule {}