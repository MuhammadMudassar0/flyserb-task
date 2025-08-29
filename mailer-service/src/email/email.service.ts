import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqplib';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService implements OnModuleInit, OnModuleDestroy {
  private conn: amqp.Connection;
  private channel: amqp.Channel;
  private queue: string;
  private exchange = 'messages';
  private transporter: nodemailer.Transporter;

  constructor(private cfg: ConfigService) {
    this.queue = this.cfg.get('RABBITMQ_QUEUE', 'email_queue');
  }

  async connectWithRetry(url: string, retries = 25, delay = 2000): Promise<amqp.Connection> {
    let connected = false;
    while (!connected) {
      try {
        const con = await amqp.connect(url);
        connected = true;
        console.log('Connected to RabbitMQ');
        return con;
      } catch {
        console.log(`RabbitMQ not ready, retrying in ${delay}ms...`);
        await new Promise((res) => setTimeout(res, delay));
      }
    }
    throw new Error('Unable to connect to RabbitMQ');
  }

  async onModuleInit() {
    const rabbitUrl = this.cfg.get('RABBITMQ_URL');
    this.conn = await this.connectWithRetry(rabbitUrl);
    this.channel = await this.conn.createChannel();
    await this.channel.assertExchange(this.exchange, 'direct', { durable: true });
    await this.channel.assertQueue(this.queue, { durable: true });
    await this.channel.bindQueue(this.queue, this.exchange, 'email');

    this.transporter = nodemailer.createTransport({
      host: this.cfg.get('SMTP_HOST'),
      port: +this.cfg.get('SMTP_PORT'),
      secure: false,
      auth: {
        user: this.cfg.get('SMTP_USER'),
        pass: this.cfg.get('SMTP_PASS'),
      },
    });

    await this.channel.consume(this.queue, this.handleMessage.bind(this), { noAck: false });

    console.log('Email consumer listening on RabbitMQ queue:', this.queue);
  }

  async handleMessage(msg: amqp.ConsumeMessage | null) {
    if (!msg) return;

    try {
      const payload = JSON.parse(msg.content.toString());
      console.log('Received message for email:', payload);

      const mailOptions = {
        from: this.cfg.get('SMTP_USER'),
        to: payload.email,
        subject: 'Thanks for contacting us',
        text: `${payload.name},\n\nThanks for your message:\n\n${payload.message}\n\n— Team`,
        html: `<p>Hi <strong>${payload.name}</strong>,</p><p>Thanks for your message:</p><blockquote>${payload.message}</blockquote><p>— Team</p>`,
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent: ', info.messageId);

      this.channel.ack(msg);
    } catch (err) {
      console.error('Failed to send email:', err);
      this.channel.nack(msg, false, false);
    }
  }

  async onModuleDestroy() {
    await this.channel?.close();
    await this.conn?.close();
  }
}
