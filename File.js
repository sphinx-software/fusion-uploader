import path      from 'path';
import UrlMapper from './UrlMapper';

class File {
    constructor(diskManager, readSteam, config) {
        this.diskManager = diskManager;
        this.readSteam   = readSteam;
        this.extension   = path.extname(readSteam.filename);
        this.name        = path.basename(readSteam.filename, this.extension);
        this.urlMapper   = new UrlMapper(diskManager, config);

    }

    store(directory = '', nameDisk = this.diskManager.defaultDisk, permission) {
        return new Promise((resolve, reject) => {
            let disk        = this.diskManager.disk(nameDisk);
            let fullUrlFile = path.join(directory, this.fileName);
            let writeSteam  = disk.createWriteStream(fullUrlFile, permission);
            writeSteam.on('error', (error) => reject(error));
            writeSteam.on('finish', () => {
                console.log(this.urlMapper.url(nameDisk, fullUrlFile));
                resolve(this.urlMapper.url(nameDisk, fullUrlFile));
            });
            this.readSteam.pipe(writeSteam);
        });
    }

    get fileName() {
        return this.name + this.extension;
    }

    setName(name) {
        this.name = name;
        return this;
    }

    setExtension(extension) {
        this.extension = extension;
        return this;
    }

}