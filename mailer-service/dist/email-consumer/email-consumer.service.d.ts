import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmailService } from 'src/email/email.service';
export declare class EmailConsumer implements OnModuleInit {
    private readonly configService;
    private readonly emailService;
    private readonly logger;
    constructor(configService: ConfigService, emailService: EmailService);
    onModuleInit(): Promise<void>;
}
