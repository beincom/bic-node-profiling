import { Logger } from '@nestjs/common';

import { getCPUUsage } from '../profiling.util';

export function CPUProfiling(mark: string): MethodDecorator {
  const logger = new Logger(CPUProfiling.name);

  return (target: any, key: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      try {
        logger.log(`[${mark}]::[Start] CPU Usage: ${getCPUUsage()}`);
        return originalMethod.apply(this, args);
      } finally {
        logger.log(`[${mark}]::[End] CPU Usage: ${getCPUUsage()}`);
      }
    };

    return descriptor;
  };
}
