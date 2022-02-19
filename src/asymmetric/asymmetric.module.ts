import { Module } from '@nestjs/common';
import { AsymmetricController } from './asymmetric.controller';
import { AsymmetricService } from './asymmetric.service';

@Module({
  controllers: [AsymmetricController],
  providers: [AsymmetricService],
})
export class AsymmetricModule {}
