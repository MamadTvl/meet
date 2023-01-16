import { Controller } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('room')
export class AppController {
    constructor(private readonly appService: AppService) {}
}
