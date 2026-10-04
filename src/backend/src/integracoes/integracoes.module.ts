import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { CepController } from './cep/cep.controller';
import { CepService } from './cep/cep.service';

@Module({
  imports: [HttpModule.register({ timeout: 5000 })],
  controllers: [CepController],
  providers: [CepService],
})
export class IntegracoesModule {}
