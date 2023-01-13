import { CONFIG_OPTIONS } from './consts';
import { PeerServerService } from './peer-server.service';
import { DynamicModule, Module } from '@nestjs/common';

export interface Config {
    readonly port?: number;
    readonly expire_timeout?: number;
    readonly alive_timeout?: number;
    readonly key?: string;
    readonly path?: string;
    readonly concurrent_limit?: number;
    readonly allow_discovery?: boolean;
    readonly proxied?: boolean | string;
    readonly cleanup_out_msgs?: number;
    readonly ssl?: {
        key: string;
        cert: string;
    };
    readonly generateClientId?: () => string;
}

@Module({})
export class PeerServerModule {
    static register(config: Config): DynamicModule {
        return {
            module: PeerServerModule,
            providers: [
                {
                    provide: CONFIG_OPTIONS,
                    useValue: config,
                },
                PeerServerService,
            ],
            global: true,
            exports: [PeerServerService],
        };
    }
}
