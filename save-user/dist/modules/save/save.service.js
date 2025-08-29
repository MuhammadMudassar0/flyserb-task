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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaveService = void 0;
const common_1 = require("@nestjs/common");
const save_entity_1 = require("./entities/save.entity");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const rabbitmq_service_1 = require("../rabbitmq/rabbitmq.service");
let SaveService = class SaveService {
    userEmailsRepository;
    rabbit;
    constructor(userEmailsRepository, rabbit) {
        this.userEmailsRepository = userEmailsRepository;
        this.rabbit = rabbit;
    }
    async saveUserInfo(fullName, email, message) {
        try {
            const payload = {
                fullName: fullName.trim(),
                email: email.trim().toLowerCase(),
                message: message.trim(),
            };
            const userInfo = this.userEmailsRepository.create({ ...payload });
            const savedDetails = await this.userEmailsRepository.save(userInfo);
            this.rabbit.publish('email', {
                email: savedDetails.email,
                name: savedDetails.fullName,
                message: savedDetails.message,
            });
            return userInfo;
        }
        catch (error) {
            console.error('Error saving user details:', error);
            throw new common_1.BadRequestException('Failed to save user details');
        }
    }
};
exports.SaveService = SaveService;
exports.SaveService = SaveService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(save_entity_1.UserEmails)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        rabbitmq_service_1.RabbitmqService])
], SaveService);
//# sourceMappingURL=save.service.js.map