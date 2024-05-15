import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

import { heapHandler } from './handlers/heap.handler';
import { wallHandler } from './handlers';

@Injectable()
export class ProfilingMiddleware implements NestMiddleware {
  public async use(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      if (req.method === 'GET') {
        if (req.path === '/debug/pprof/heap') {
          return heapHandler(req, res, next);
        }
        if (req.path === '/debug/pprof/profile') {
          return wallHandler(req, res, next);
        }
      }
      next();
    } catch (ex) {
      Logger.error(ex);
    }
    next();
  }
}
