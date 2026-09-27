import { ProfissionaisService } from './profissionais.service';
import { CreateProfissionalDto } from './dto/create-profissional.dto';
import { UpdateProfissionalDto } from './dto/update-profissional.dto';
import { QueryProfissionalDto } from './dto/query-profissional.dto';
export declare class ProfissionaisController {
    private readonly profissionaisService;
    constructor(profissionaisService: ProfissionaisService);
    findAll(query: QueryProfissionalDto): Promise<{
        dados: import("./entities/profissional.entity").Profissional[];
        total: number;
        pagina: number;
        limite: number;
    }>;
    findOne(id: string): Promise<import("./entities/profissional.entity").Profissional>;
    create(dto: CreateProfissionalDto): Promise<import("./entities/profissional.entity").Profissional>;
    update(id: string, dto: UpdateProfissionalDto): Promise<import("./entities/profissional.entity").Profissional>;
    remove(id: string): Promise<void>;
}
