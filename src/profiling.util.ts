import * as os from 'os';

export const getCPUUsage = () => {
  const usage = process.cpuUsage();
  return (usage.user + usage.system) / (os.cpus().length * 1000 * 1000);
};

export const getMemoryUsage = () => {
  const usage = process.memoryUsage();
  return usage.heapUsed / usage.heapTotal;
};
