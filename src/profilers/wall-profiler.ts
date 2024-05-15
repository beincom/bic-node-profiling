import { Logger } from '@nestjs/common';
import { Profile } from 'pprof-format';

import { time, SourceMapper } from '@datadog/pprof';

import { ProfileExport } from '../exporters';
import { Profiler } from './profiler';

const MICROS_PER_SECOND = 1e6;

export interface WallProfilerStartArgs {
  samplingDurationMs: number;
  samplingIntervalMicros: number;
  sourceMapper: SourceMapper | undefined;
}

export class WallProfiler implements Profiler<WallProfilerStartArgs> {
  private labels: Record<string, number | string>;
  private lastProfiledAt: Date;
  private lastSamplingIntervalMicros!: number;

  constructor() {
    this.labels = {};
    this.lastProfiledAt = new Date();
  }

  public getLabels(): Record<string, number | string> {
    return this.labels;
  }

  public profile(): ProfileExport {
    Logger.log('profile');
    return this.innerProfile(true);
  }

  public setLabels(labels: Record<string, number | string>): void {
    this.labels = labels;
  }

  public start(args: WallProfilerStartArgs): void {
    if (!time.isStarted()) {
      Logger.log('start');

      this.lastProfiledAt = new Date();
      this.lastSamplingIntervalMicros = args.samplingDurationMs;
      time.start({
        sourceMapper: args.sourceMapper,
        durationMillis: args.samplingDurationMs,
        intervalMicros: args.samplingIntervalMicros,
        withContexts: true,
        workaroundV8Bug: true,
      });
      time.setContext({});
    }
  }

  public stop(): ProfileExport {
    Logger.log('stop');
    return this.innerProfile(false);
  }

  private innerProfile(restart: boolean): ProfileExport {
    time.setContext({});

    const profile: Profile = time.stop(
      restart,
      (): Record<string, number | string> => this.labels,
    );

    const lastProfileStartedAt: Date = this.lastProfiledAt;
    this.lastProfiledAt = new Date();

    return {
      profile,
      sampleRate: Math.ceil(
        MICROS_PER_SECOND / this.lastSamplingIntervalMicros,
      ),
      startedAt: lastProfileStartedAt,
      stoppedAt: this.lastProfiledAt,
    };
  }
}
