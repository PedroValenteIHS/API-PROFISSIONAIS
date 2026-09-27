import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProfissionaisModule } from './profissionais/profissionais.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'valente3747',
      database: 'clinica',
      autoLoadEntities: true,
      synchronize: true, 
    }),
    ProfissionaisModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}