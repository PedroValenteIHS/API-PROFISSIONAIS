import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('profissionais')
export class Profissional {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 150 })
  nome: string;

  // Dado específico do profissional (RF-106, Tela 2)
  @Index({ unique: true })
  @Column({ length: 20 })
  crm: string;

  // UF do conselho (o mesmo número de CRM pode existir em UFs diferentes)
  @Column({ length: 2 })
  crmUf: string;

  @Column({ length: 100 })
  especialidade: string;

  @Column({ length: 150, nullable: true })
  email?: string;

  @Column({ length: 20, nullable: true })
  telefone?: string;

  // Permite "desativar" um profissional sem perder o histórico de agendamentos
  @Column({ default: true })
  ativo: boolean;

}
