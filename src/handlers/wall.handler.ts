import { Request, RequestHandler } from 'express';

import {
  Profiler,
  PyroscopeProfiler,
  WallProfilerStartArgs,
} from '../profilers';

import { getProfiler } from '../utils';
import {
  collectProfileAfterMs,
  profileExpressHandler,
} from './profile.handler';

export const collectWall = (ms: number): Promise<Buffer> => {
  const profiler: PyroscopeProfiler = getProfiler();

  const wallProfilerArgs: WallProfilerStartArgs =
    profiler.wallProfiler.startArgs;
  const wallProfiler: Profiler<WallProfilerStartArgs> =
    profiler.wallProfiler.profiler;

  return collectProfileAfterMs(wallProfiler, wallProfilerArgs, ms);
};

export const wallHandler: RequestHandler = profileExpressHandler(
  'Wall',
  (req: Request) => collectWall(1000 * Number(req.query.seconds)),
);
