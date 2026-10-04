import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AgendamentosModule } from './agendamentos/agendamentos.module';
import { AvaliacoesModule } from './avaliacoes/avaliacoes.module';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { IntegracoesModule } from './integracoes/integracoes.module';
import { NotificacoesModule } from './notificacoes/notificacoes.module';
import { PacientesModule } from './pacientes/pacientes.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    EventEmitterModule.forRoot(),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    PrismaModule,
    AuthModule,
    HealthModule,
    PacientesModule,
    AgendamentosModule,
    AvaliacoesModule,
    IntegracoesModule,
    NotificacoesModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
