import { Controller, Get, Param, Query, Render, Res } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Response } from 'express';
import { AppService } from './app.service';

@Controller('room')
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get()
    // @Render('index')
    index(@Res() res: Response) {
        res.redirect('/room/' + randomUUID());
    }

    @Get(':id')
    @Render('index')
    getHello(@Param('id') id: string) {
        console.log('dada');

        return { roomId: id };
    }
}
