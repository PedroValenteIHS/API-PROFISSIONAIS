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
exports.ProfissionaisController = void 0;
const profissionais_service_1 = require("./profissionais.service");
const common_1 = require("@nestjs/common");
const create_profissional_dto_1 = require("./dto/create-profissional.dto");
const update_profissional_dto_1 = require("./dto/update-profissional.dto");
const query_profissional_dto_1 = require("./dto/query-profissional.dto");
let ProfissionaisController = class ProfissionaisController {
    profissionaisService;
    constructor(profissionaisService) {
        this.profissionaisService = profissionaisService;
    }
    findAll(query) {
        return this.profissionaisService.findAll(query);
    }
    findOne(id) {
        return this.profissionaisService.findOne(id);
    }
    create(dto) {
        return this.profissionaisService.create(dto);
    }
    update(id, dto) {
        return this.profissionaisService.update(id, dto);
    }
    remove(id) {
        return this.profissionaisService.remove(id);
    }
};
exports.ProfissionaisController = ProfissionaisController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_profissional_dto_1.QueryProfissionalDto]),
    __metadata("design:returntype", void 0)
], ProfissionaisController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProfissionaisController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_profissional_dto_1.CreateProfissionalDto]),
    __metadata("design:returntype", void 0)
], ProfissionaisController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_profissional_dto_1.UpdateProfissionalDto]),
    __metadata("design:returntype", void 0)
], ProfissionaisController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProfissionaisController.prototype, "remove", null);
exports.ProfissionaisController = ProfissionaisController = __decorate([
    (0, common_1.Controller)('profissionais'),
    __metadata("design:paramtypes", [profissionais_service_1.ProfissionaisService])
], ProfissionaisController);
//# sourceMappingURL=profissionais.controller.js.map