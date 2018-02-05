import { singleton } from '@sphinx-software/fusion/MetaInjector/decorators';
import DiskManager   from '@sphinx-software/disk/DiskManager';


import multer from 'koa-multer';

const upload = multer({ storage: multer.memoryStorage() }).any();

@singleton(DiskManager, Config)
export class UploadMiddleware {

    constructor(diskManager, config) {
        this.diskManager = diskManager;
        this.config      = config;
    }

    handle(context, next) {
        return upload(context, () => {
            context.files = {};
            context.req.files.forEach(file => {
                context.files[file.fieldname] = new File(this.diskManager, file,
                    this.config);
            });
            return next();
        });
    }

}
