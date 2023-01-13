import { HttpAdapterHost } from '@nestjs/core';
import { ExpressPeerServer } from 'peer';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { CONFIG_OPTIONS } from './consts';
import { Express } from 'express';
import { Config } from './peer-server.module';
import { CustomExpress } from 'src/types/peer';

@Injectable()
export class PeerServerService implements OnModuleInit {
    private _server: CustomExpress;
    constructor(
        @Inject(CONFIG_OPTIONS) private readonly config: Config,
        private adapterHost: HttpAdapterHost,
    ) {}

    public get server() {
        return this._server;
    }

    private set server(value) {
        this._server = value;
    }

    onModuleInit() {
        const expressApp: Express = this.adapterHost.httpAdapter.getInstance();
        const httpServer = this.adapterHost.httpAdapter.getHttpServer();
        this.server = ExpressPeerServer(httpServer, this.config);

        expressApp.use('/peerjs', (req, res, next) => {
            next();
        });
        expressApp.use('/peerjs', this.server);
        this.server.on('connection', (event) => {
            //
        });
    }
}
