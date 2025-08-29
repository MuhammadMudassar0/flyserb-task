import { BadRequestException, Injectable } from '@nestjs/common';
import { UserEmails } from './entities/save.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RabbitmqService } from '../rabbitmq/rabbitmq.service';

@Injectable()
export class SaveService {
  constructor(
    @InjectRepository(UserEmails)
    private userEmailsRepository: Repository<UserEmails>,
    private rabbit: RabbitmqService,
  ) {}

  async saveUserInfo(fullName: string, email: string, message: string) {
    try {
      const payload = {
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        message: message.trim(),
      };

      const userInfo = this.userEmailsRepository.create({ ...payload });
      const savedDetails = await this.userEmailsRepository.save(userInfo);

      // publish to RabbitMQ with routing key 'email'
      this.rabbit.publish('email', {
        email: savedDetails.email,
        name: savedDetails.fullName,
        message: savedDetails.message,
      });

      return userInfo;
    } catch(error) {
       console.error('Error saving user details:', error); 
      throw new BadRequestException('Failed to save user details');
    }
  }
}