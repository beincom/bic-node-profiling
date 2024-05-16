import { DynamicModule, Global, Module, Provider } from '@nestjs/common';

import {
  IProfileModuleAsyncOptions,
  IProfileModuleModuleOptionsFactory,
} from './interfaces/profiling-module.interface';

import { ProfileConfig } from './type';

import { PROFILE_SERVICE_TOKEN, ProfileService } from './profiling.service';

@Global()
@Module({})
export class ProfileModule {
  public static forRoot(config: ProfileConfig): DynamicModule {
    return {
      module: ProfileModule,
      imports: [],
      providers: [
        {
          provide: PROFILE_SERVICE_TOKEN,
          useFactory: () => {
            return new ProfileService(config);
          },
        },
      ],
      exports: [PROFILE_SERVICE_TOKEN],
    };
  }

  public static forRootAsync(
    options: IProfileModuleAsyncOptions,
  ): DynamicModule {
    return {
      module: ProfileModule,
      imports: [...(options.imports || [])],
      providers: [
        ...this._createAsyncProviders(options),
        ...(options.extraProviders || []),
      ],
      exports: [
        ...this._createAsyncProviders(options),
        ...(options.extraProviders || []),
      ],
    };
  }

  private static _createAsyncProviders(
    options: IProfileModuleAsyncOptions,
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this._createAsyncOptionsProvider(options)];
    }
    return [
      this._createAsyncOptionsProvider(options),
      {
        provide: options.useClass,
        useClass: options.useClass,
      },
    ];
  }

  private static _createAsyncOptionsProvider(
    options: IProfileModuleAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: PROFILE_SERVICE_TOKEN,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }

    return {
      provide: PROFILE_SERVICE_TOKEN,
      useFactory: async (optionsFactory: IProfileModuleModuleOptionsFactory) =>
        optionsFactory.createOptions(),
      inject: [options.useExisting || options.useClass],
    };
  }
}
