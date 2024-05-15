import { Controller, Get, Logger, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

import { collectHeap, collectWall } from './handlers';

@Controller()
export class ProfilingController {
  @Get('/debug/pprof/heap')
  public async getHeap(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    Logger.log('Collecting heap for', req.query.seconds);
    try {
      const data = await collectHeap(1000 * Number(req.query.seconds ?? '0'));
      return res.send(data);
    } catch (e) {
      Logger.error('Error collecting heap', e);
      return res.sendStatus(500);
    }
  }

  @Get('/debug/pprof/profile')
  public async getProfile(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    Logger.log('Collecting profile for', req.query.seconds);
    try {
      const data = await collectWall(1000 * Number(req.query.seconds ?? '0'));
      return res.send(data);
    } catch (e) {
      Logger.error('Error collecting profile', e);
      return res.sendStatus(500);
    }
  }
}
