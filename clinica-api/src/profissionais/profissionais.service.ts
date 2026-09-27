import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository} from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profissional } from './entities/profissional.entity';
import { CreateProfissionalDto } from './dto/create-profissional.dto';
import { UpdateProfissionalDto } from './dto/update-profissional.dto';
import { QueryProfissionalDto } from './dto/query-profissional.dto';

@Injectable()
export class ProfissionaisService {
  constructor(
    @InjectRepository(Profissional)
    private readonly profissionalRepo: Repository<Profissional>,
  ) {}
  async findAll(query: QueryProfissionalDto) {
    const { busca, pagina, limite } = query;

    const qb = this.profissionalRepo.createQueryBuilder('profissional');

    if (busca) {
      qb.andWhere(
        '(profissional.nome ILIKE :busca OR profissional.crm ILIKE :busca OR profissional.especialidade ILIKE :busca)',
        { busca: `%${busca}%` },
      );
    }

    qb.skip((pagina - 1) * limite).take(limite);

    const [dados, total] = await qb.getManyAndCount();

    return { dados, total, pagina, limite };
  }
  async create(dto: CreateProfissionalDto): Promise<Profissional> {
    const existente = await this.profissionalRepo.findOneBy({
      crm: dto.crm,
      crmUf: dto.crmUf,
    });

    if (existente) {
      throw new ConflictException(`Já existe profissional com CRM ${dto.crm}/${dto.crmUf}`);
    }

    const profissional = this.profissionalRepo.create(dto);
    return this.profissionalRepo.save(profissional);
  }
  async findOne (id: string): Promise<Profissional>{
    const profissional = await this.profissionalRepo.findOneBy({ id });
    
    if (!profissional){
      throw new NotFoundException('Profissional não encontrado');
    }           
    return profissional;
  }
  async update(id: string, dto: UpdateProfissionalDto): Promise<Profissional>{
    const profissional = await this.findOne(id);

    Object.assign(profissional, dto);

    return this.profissionalRepo.save(profissional);
  }
  async remove(id: string): Promise<void>{
    const profissional = await this.findOne(id);

    await this.profissionalRepo.remove(profissional);
  }
} 

