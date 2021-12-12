import { ConnectionOptions } from 'typeorm';

export interface IServer {
    port: number;
}

export interface IEnvironment {
    server: IServer
    database: ConnectionOptions;
}
