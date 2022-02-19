import { AppController } from './app.controller';
import { Module } from '@nestjs/common';
import { SymmetricModule } from './symmetric/symmetric.module';
import { AsymmetricModule } from './asymmetric/asymmetric.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { HashModule } from './hash/hash.module';
import * as config from 'config';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', config.get('file.static')),
    }),
    SymmetricModule,
    AsymmetricModule,
    HashModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
