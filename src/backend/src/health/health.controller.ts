import {
  Controller,
  Get,
  ServiceUnavailableException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  applicationHealth() {
    return {
      status: 'ok',
      service: 'medagenda-api',
    };
  }

  @Get('database')
  async databaseHealth() {
    const connected = await this.prisma.checkConnection();

    if (!connected) {
      throw new ServiceUnavailableException({
        status: 'error',
        database: 'postgresql',
        message: 'Banco de dados indisponível ou ainda não configurado.',
      });
    }

    return {
      status: 'ok',
      database: 'postgresql',
    };
  }
}
