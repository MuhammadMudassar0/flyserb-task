"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaveModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const save_entity_1 = require("./entities/save.entity");
const save_controller_1 = require("./save.controller");
const save_service_1 = require("./save.service");
const rabbitmq_service_1 = require("../rabbitmq/rabbitmq.service");
const config_1 = require("@nestjs/config");
let SaveModule = class SaveModule {
};
exports.SaveModule = SaveModule;
exports.SaveModule = SaveModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([save_entity_1.UserEmails])],
        controllers: [save_controller_1.SaveController],
        providers: [config_1.ConfigService, save_service_1.SaveService, rabbitmq_service_1.RabbitmqService,],
    })
], SaveModule);
//# sourceMappingURL=save.module.js.map