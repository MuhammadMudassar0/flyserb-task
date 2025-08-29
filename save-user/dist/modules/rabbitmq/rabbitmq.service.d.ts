import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export declare class RabbitmqService implements OnModuleInit, OnModuleDestroy {
    private cfg;
    private conn;
    private channel;
    private exchange;
    constructor(cfg: ConfigService);
    onModuleInit(): Promise<void>;
    publish(routingKey: string, payload: any): void;
    onModuleDestroy(): Promise<void>;
}
