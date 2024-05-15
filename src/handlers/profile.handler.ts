import { Logger } from '@nestjs/common';
import { Profile } from 'pprof-format';
import { Request, RequestHandler, Response } from 'express';

import { encode } from '@datadog/pprof';

import { Profiler } from '../profilers';

export const collectProfile = async <TStartArgs>(
  profiler: Profiler<TStartArgs>,
): Promise<Buffer> => {
  const profile: Profile = profiler.profile().profile;

  profiler.stop();

  return encode(profile);
};

export const collectProfileAfterMs = async <TStartArgs>(
  profiler: Profiler<TStartArgs>,
  args: TStartArgs,
  delayMs: number,
): Promise<Buffer> => {
  profiler.start(args);

  if (delayMs === 0) {
    return collectProfile(profiler);
  }

  return new Promise(
    (resolve: (buffer: Buffer | PromiseLike<Buffer>) => void) => {
      setTimeout(() => {
        resolve(collectProfile(profiler));
      }, delayMs);
    },
  );
};

export const profileExpressHandler = (
  profileKind: string,
  useCaseHandler: (req: Request) => Promise<Buffer>,
): RequestHandler => {
  return async (
    req: Request,
    res: Response,
    // next: NextFunction
  ): Promise<void> => {
    Logger.log(`Fetching ${profileKind} Profile`);
    try {
      const profileBuffer = await useCaseHandler(req);
      res.status(200).send(profileBuffer);
    } catch (error: unknown) {
      Logger.log(`Error collecting ${profileKind}`, error);
      res.sendStatus(500);
    }
  };
};
