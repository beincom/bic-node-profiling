import { Injectable } from '@nestjs/common';

import {
  checkPyroscopeConfig,
  getEnv,
  getProfiler,
  processConfig,
  setProfiler,
} from './utils';

import { PyroscopeConfig } from './config';
import { PyroscopeProfiler } from './profilers';

import { ProfileConfig } from './type';

export const PROFILE_SERVICE_TOKEN = Symbol('PROFILE_SERVICE_TOKEN');

@Injectable()
export class ProfileService {
  constructor(public readonly configs: ProfileConfig) {
    this.init({
      authToken: this.configs.authToken,
      appName: this.configs.applicationName,
      flushIntervalMs: this.configs.flushIntervalMs,
      heap: this.configs.heap,
      serverAddress: this.configs.serverAddress,
      tags: this.configs.tags,
      wall: this.configs.wall,
    });
  }

  private init(config: PyroscopeConfig = {}): void {
    checkPyroscopeConfig(config);

    const processedConfig: PyroscopeConfig = processConfig(config, getEnv());
    setProfiler(new PyroscopeProfiler(processedConfig));
  }

  public getWallLabels(): Record<string, number | string> {
    return getProfiler().wallProfiler.profiler.getLabels();
  }

  public setWallLabels(labels: Record<string, number | string>): void {
    getProfiler().wallProfiler.profiler.setLabels(labels);
  }

  public startWallProfiling(): void {
    getProfiler().wallProfiler.start();
  }

  // here for backwards compatibility
  public startCpuProfiling(): void {
    getProfiler().wallProfiler.start();
  }

  public async stopWallProfiling(): Promise<void> {
    await getProfiler().wallProfiler.stop();
  }

  // here for backwards compatibility
  public async stopCpuProfiling(): Promise<void> {
    await getProfiler().wallProfiler.stop();
  }

  public startHeapProfiling(): void {
    getProfiler().heapProfiler.start();
  }

  public async stopHeapProfiling(): Promise<void> {
    await getProfiler().heapProfiler.stop();
  }

  public start(): void {
    this.startWallProfiling();
    this.startHeapProfiling();
  }

  public async stop(): Promise<void> {
    await Promise.all([this.stopWallProfiling(), this.stopHeapProfiling()]);
  }
}
