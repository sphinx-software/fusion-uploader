import asyncBusboy     from 'async-busboy';
import { singleton }   from '@sphinx-software/fusion/MetaInjector';
import { Config }      from '@sphinx-software/fusion/Fusion/ServiceContracts';
import { DiskManager } from '@sphinx-software/disk';

@singleton(DiskManager, Config)
export class UploadMiddleware {

    constructor(diskManager, config) {
        this.diskManager = diskManager;
        this.config      = config;
    }

    async handle(context, next) {
        const { files, fields } = await asyncBusboy(context.req);
        context.files           = files.reduce((files, steam) => {
            files[steam.fieldname] = new File(this.diskManager, steam,
                this.config);
            return files;
        }, {});

        context.params = { ...context.params, ...fields };
        next();
    }

}