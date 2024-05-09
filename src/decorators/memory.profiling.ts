import { Logger } from '@nestjs/common';

import { getMemoryUsage } from '../profiling.util';

export function MemoryProfiling(mark: string): MethodDecorator {
  const logger = new Logger(MemoryProfiling.name);

  return (target: any, key: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      try {
        logger.log(`[${mark}]::[Start] Memory Usage: ${getMemoryUsage()}`);
        return originalMethod.apply(this, args);
      } finally {
        logger.log(`[${mark}]::[End] Memory Usage: ${getMemoryUsage()}`);
      }
    };

    return descriptor;
  };
}
