import { Request, RequestHandler } from 'express';

import { HeapProfilerStartArgs } from '../profilers/heap-profiler';
import { Profiler, PyroscopeProfiler } from '../profilers';

import {
  collectProfileAfterMs,
  profileExpressHandler,
} from './profile.handler';

import { getProfiler } from '..//utils';

export const collectHeap = (ms: number): Promise<Buffer> => {
  const profiler: PyroscopeProfiler = getProfiler();

  const heapProfilerArgs: HeapProfilerStartArgs =
    profiler.heapProfiler.startArgs;
  const heapProfiler: Profiler<HeapProfilerStartArgs> =
    profiler.heapProfiler.profiler;

  return collectProfileAfterMs(heapProfiler, heapProfilerArgs, ms);
};

export const heapHandler: RequestHandler = profileExpressHandler(
  'Heap',
  (req: Request) => collectHeap(1000 * Number(req.query.seconds)),
);
