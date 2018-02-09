import { singleton } from '@sphinx-software/fusion/MetaInjector/decorators';

import multer                   from 'koa-multer';
import { DiskManagerInterface } from '../sphinx-web-stdlib/src/Fusion/ServiceContracts';

const upload = multer({ storage: multer.memoryStorage() }).any();

@singleton('DiskManagerInterface', 'config')
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
