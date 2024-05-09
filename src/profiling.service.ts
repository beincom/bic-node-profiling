import { Injectable, OnModuleInit } from '@nestjs/common';
import Pyroscope from '@pyroscope/nodejs';

import { ProfileConfig } from './type';

export const PROFILE_SERVICE_TOKEN = Symbol('PROFILE_SERVICE_TOKEN');

@Injectable()
export class ProfileService implements OnModuleInit {
  constructor(public readonly configs: ProfileConfig) {}

  public onModuleInit() {
    Pyroscope.init({
      authToken: this.configs.authToken,
      appName: this.configs.applicationName,
      serverAddress: this.configs.serverAddress,
      tags: this.configs.tags,
    });

    Pyroscope.start();
  }
}
