"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const amqp = require("amqplib");
const nodemailer = require("nodemailer");
let EmailService = class EmailService {
    cfg;
    conn;
    channel;
    queue;
    exchange = 'messages';
    transporter;
    constructor(cfg) {
        this.cfg = cfg;
        this.queue = this.cfg.get('RABBITMQ_QUEUE', 'email_queue');
    }
    async connectWithRetry(url, retries = 15, delay = 2000) {
        for (let i = 0; i < retries; i++) {
            try {
                return await amqp.connect(url);
            }
            catch {
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
    async handleMessage(msg) {
        if (!msg)
            return;
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
        }
        catch (err) {
            console.error('Failed to send email:', err);
            this.channel.nack(msg, false, false);
        }
    }
    async onModuleDestroy() {
        await this.channel?.close();
        await this.conn?.close();
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], EmailService);
//# sourceMappingURL=email.service.js.map