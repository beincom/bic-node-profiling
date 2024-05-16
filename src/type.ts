import { PyroscopeHeapConfig, PyroscopeWallConfig } from './config';

export type ProfileConfig = {
  applicationName?: string;
  authToken?: string;
  flushIntervalMs?: number | undefined;
  heap?: ProfileHeapConfig | undefined;
  serverAddress?: string;
  samplingInterval?: number;
  sampleDuration?: number;
  tags?: Record<string, any>;
  wall?: ProfileWallConfig | undefined;
};

export interface ProfileWallConfig extends PyroscopeWallConfig {}

export interface ProfileHeapConfig extends PyroscopeHeapConfig {}
