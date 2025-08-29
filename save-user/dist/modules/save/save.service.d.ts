import { UserEmails } from './entities/save.entity';
import { Repository } from 'typeorm';
import { RabbitmqService } from '../rabbitmq/rabbitmq.service';
export declare class SaveService {
    private userEmailsRepository;
    private rabbit;
    constructor(userEmailsRepository: Repository<UserEmails>, rabbit: RabbitmqService);
    saveUserInfo(fullName: string, email: string, message: string): Promise<UserEmails>;
}
