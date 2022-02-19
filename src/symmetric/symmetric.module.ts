import { Module } from '@nestjs/common';
import { SymmetricController } from './symmetric.controller';
import { SymmetricService } from './symmetric.service';

@Module({
  controllers: [SymmetricController],
  providers: [SymmetricService],
})
export class SymmetricModule {}
