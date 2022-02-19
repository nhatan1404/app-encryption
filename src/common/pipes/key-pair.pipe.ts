import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { KeyPairParamsAsymmetric } from '../types/params-asymmetric.type';
import { KeyPairSchema } from '../validations/params-asymmetric.validator';

@Injectable()
class KeyPairValidationPipe implements PipeTransform {
  transform(value: KeyPairParamsAsymmetric): KeyPairParamsAsymmetric {
    return this.validate(value);
  }

  private validate = (value: KeyPairParamsAsymmetric) => {
    const { error } = KeyPairSchema.validate(value);
    if (error) {
      throw new BadRequestException(error.details[0].message);
    }
    return value;
  };
}

export { KeyPairValidationPipe };
