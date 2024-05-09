export type ProfileConfig = {
  applicationName?: string;
  authToken?: string;
  serverAddress?: string;
  samplingInterval?: number;
  sampleDuration?: number;
  tags?: Record<string, any>;
};
