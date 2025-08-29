import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqplib';
export declare class EmailService implements OnModuleInit, OnModuleDestroy {
    private cfg;
    private conn;
    private channel;
    private queue;
    private exchange;
    private transporter;
    constructor(cfg: ConfigService);
    connectWithRetry(url: string, retries?: number, delay?: number): Promise<amqp.Connection>;
    onModuleInit(): Promise<void>;
    handleMessage(msg: amqp.ConsumeMessage | null): Promise<void>;
    onModuleDestroy(): Promise<void>;
}
