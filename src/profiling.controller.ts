import { Controller, Get, Logger, Query } from '@nestjs/common';
import Pyroscope from '@pyroscope/nodejs';

@Controller()
export class ProfileController {
  private readonly _logger = new Logger(ProfileController.name);

  @Get('/debug/pprof/profile')
  public async collectCpu(@Query() query: { seconds: number }): Promise<any> {
    try {
      return await Pyroscope.collectCpu(query.seconds);
    } catch (err) {
      this._logger.error(err);
      throw err;
    }
  }

  @Get('/debug/pprof/heap')
  public async getHeap(): Promise<any> {
    try {
      return await Pyroscope.collectHeap();
    } catch (err) {
      this._logger.error(err);
      throw err;
    }
  }
}
