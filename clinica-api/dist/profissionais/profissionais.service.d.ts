import { Repository } from 'typeorm';
import { Profissional } from './entities/profissional.entity';
import { CreateProfissionalDto } from './dto/create-profissional.dto';
import { UpdateProfissionalDto } from './dto/update-profissional.dto';
import { QueryProfissionalDto } from './dto/query-profissional.dto';
export declare class ProfissionaisService {
    private readonly profissionalRepo;
    constructor(profissionalRepo: Repository<Profissional>);
    findAll(query: QueryProfissionalDto): Promise<{
        dados: Profissional[];
        total: number;
        pagina: number;
        limite: number;
    }>;
    create(dto: CreateProfissionalDto): Promise<Profissional>;
    findOne(id: string): Promise<Profissional>;
    update(id: string, dto: UpdateProfissionalDto): Promise<Profissional>;
    remove(id: string): Promise<void>;
}
