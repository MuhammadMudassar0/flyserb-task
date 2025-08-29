import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitmqService implements OnModuleInit, OnModuleDestroy {
  private conn: amqp.Connection;
  private channel: amqp.Channel;
  private exchange = 'messages';

  constructor(private cfg: ConfigService) {}

  async onModuleInit() {
    const url = this.cfg.get<string>('RABBITMQ_URL', 'amqp://rabbitmq:5672');
    let connected = false;

    while (!connected) {
      try {
        this.conn = await amqp.connect(url);
        this.channel = await this.conn.createChannel();
        await this.channel.assertExchange(this.exchange, 'direct', {
          durable: true,
        });
        connected = true;
        console.log('RabbitMQ publisher ready');
      } catch (err) {
        console.log('Waiting for RabbitMQ...', err.message);
        await new Promise((res) => setTimeout(res, 2000)); // wait 2 seconds
      }
    }
  }

  publish(routingKey: string, payload: any) {
    const buf = Buffer.from(JSON.stringify(payload));
    this.channel.publish(this.exchange, routingKey, buf, { persistent: true });
  }

  async onModuleDestroy() {
    await this.channel?.close();
    await this.conn?.close();
  }
}