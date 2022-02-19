import { Padding } from '../types/params.type';
import { BadRequestException, PipeTransform } from '@nestjs/common';

export class RSAPaddingValidationPipe implements PipeTransform {
  readonly allowedPadding: Array<{ key: string; value: Padding }> = [
    {
      key: 'RSA_PKCS1_PADDING',
      value: Padding.RSA_PKCS1_PADDING,
    },
    {
      key: 'RSA_SSLV23_PADDING',
      value: Padding.RSA_SSLV23_PADDING,
    },
    {
      key: 'RSA_NO_PADDING',
      value: Padding.RSA_NO_PADDING,
    },
    {
      key: 'RSA_PKCS1_OAEP_PADDING',
      value: Padding.RSA_PKCS1_OAEP_PADDING,
    },
    {
      key: ' RSA_X931_PADDING',
      value: Padding.RSA_X931_PADDING,
    },
    {
      key: 'RSA_PKCS1_PSS_PADDING',
      value: Padding.RSA_PKCS1_PSS_PADDING,
    },
    {
      key: ' RSA_PSS_SALTLEN_DIGEST',
      value: Padding.RSA_PSS_SALTLEN_DIGEST,
    },
    {
      key: 'RSA_PSS_SALTLEN_MAX_SIGN',
      value: Padding.RSA_PSS_SALTLEN_MAX_SIGN,
    },
    {
      key: 'RSA_PSS_SALTLEN_AUTO',
      value: Padding.RSA_PSS_SALTLEN_AUTO,
    },
  ];

  transform(value: any) {
    const { padding } = value;
    if (!padding)
      throw new BadRequestException(`"padding' is not allowed to be empty`);

    if (!this.isPaddingValid(padding)) {
      throw new BadRequestException(`"${padding}" is an invalid padding.`);
    }

    return {
      ...value,
      padding: this.getPadding(padding).value,
    };
  }

  private getPadding(paddingText: string) {
    return this.allowedPadding.find((pad) => pad.key === paddingText);
  }

  private isPaddingValid(padding: string) {
    return this.allowedPadding.includes(this.getPadding(padding));
  }
}
