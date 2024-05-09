import { ModuleMetadata, Provider, Type } from '@nestjs/common';

import { ProfileService } from '../profiling.service';

export interface IProfileModuleModuleOptionsFactory {
  createOptions(): Promise<ProfileService> | ProfileService;
}

export interface IProfileModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<IProfileModuleModuleOptionsFactory>;
  useClass?: Type<IProfileModuleModuleOptionsFactory>;
  useFactory?: (...args: any[]) => Promise<ProfileService> | ProfileService;
  inject?: any[];
  extraProviders?: Provider[];
}
