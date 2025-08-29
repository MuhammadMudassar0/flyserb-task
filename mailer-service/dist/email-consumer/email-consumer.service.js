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
var EmailConsumer_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailConsumer = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const amqp = require("amqplib");
const email_service_1 = require("../email/email.service");
let EmailConsumer = EmailConsumer_1 = class EmailConsumer {
    configService;
    emailService;
    logger = new common_1.Logger(EmailConsumer_1.name);
    constructor(configService, emailService) {
        this.configService = configService;
        this.emailService = emailService;
    }
    async onModuleInit() {
        const connection = await amqp.connect(this.configService.get('RABBITMQ_URL'));
        const channel = await connection.createChannel();
        const queue = this.configService.get('RABBITMQ_QUEUE');
        await channel.assertQueue(queue, { durable: true });
        this.logger.log(`Listening for messages on queue: ${queue}`);
        channel.consume(queue, async (msg) => {
            if (msg) {
                const data = JSON.parse(msg.content.toString());
                this.logger.log(`Received message: ${JSON.stringify(data)}`);
                try {
                    await this.emailService.sendMail(data.email, `Hello ${data.name}`, `Hi ${data.name},\n\n${data.message}`, `<p>Hi <b>${data.name}</b>,</p><p>${data.message}</p>`);
                    channel.ack(msg);
                }
                catch (err) {
                    this.logger.error(`Error processing message: ${err.message}`);
                    channel.nack(msg, false, true);
                }
            }
        });
    }
};
exports.EmailConsumer = EmailConsumer;
exports.EmailConsumer = EmailConsumer = EmailConsumer_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        email_service_1.EmailService])
], EmailConsumer);
//# sourceMappingURL=email-consumer.service.js.map