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
exports.ProfissionaisService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const profissional_entity_1 = require("./entities/profissional.entity");
let ProfissionaisService = class ProfissionaisService {
    profissionalRepo;
    constructor(profissionalRepo) {
        this.profissionalRepo = profissionalRepo;
    }
    async findAll(query) {
        const { busca, pagina, limite } = query;
        const qb = this.profissionalRepo.createQueryBuilder('profissional');
        if (busca) {
            qb.andWhere('(profissional.nome ILIKE :busca OR profissional.crm ILIKE :busca OR profissional.especialidade ILIKE :busca)', { busca: `%${busca}%` });
        }
        qb.skip((pagina - 1) * limite).take(limite);
        const [dados, total] = await qb.getManyAndCount();
        return { dados, total, pagina, limite };
    }
    async create(dto) {
        const existente = await this.profissionalRepo.findOneBy({
            crm: dto.crm,
            crmUf: dto.crmUf,
        });
        if (existente) {
            throw new common_1.ConflictException(`Já existe profissional com CRM ${dto.crm}/${dto.crmUf}`);
        }
        const profissional = this.profissionalRepo.create(dto);
        return this.profissionalRepo.save(profissional);
    }
    async findOne(id) {
        const profissional = await this.profissionalRepo.findOneBy({ id });
        if (!profissional) {
            throw new common_1.NotFoundException('Profissional não encontrado');
        }
        return profissional;
    }
    async update(id, dto) {
        const profissional = await this.findOne(id);
        Object.assign(profissional, dto);
        return this.profissionalRepo.save(profissional);
    }
    async remove(id) {
        const profissional = await this.findOne(id);
        await this.profissionalRepo.remove(profissional);
    }
};
exports.ProfissionaisService = ProfissionaisService;
exports.ProfissionaisService = ProfissionaisService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(profissional_entity_1.Profissional)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ProfissionaisService);
//# sourceMappingURL=profissionais.service.js.map