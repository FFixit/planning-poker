import { Injectable } from '@nestjs/common';
import { createWriteStream, mkdirSync, readdirSync, WriteStream } from 'fs';
import { join } from 'path';
import { inspect } from 'util';

@Injectable()
export class LoggerService {
    private outputStream: WriteStream;
    directory = 'log';

    constructor() {
        const filename = this.getFileName();
        this.outputStream = createWriteStream(join(this.directory, filename), { encoding: 'utf8' });
    }

    write(...messageParts: any[]) {
        const message = messageParts.map((part) => this.formatObject(part)).join(' ');
        const time = '[' + this.getCurrentTime() + ']';
        const line = time + ' ' + message + '\n';

        this.outputStream.write(line);
    }

    private getCurrentTime() {
        const now = new Date();
        return (
            now.getFullYear() +
            '-' +
            String(now.getMonth() + 1).padStart(2, '0') +
            '-' +
            now.getDate() +
            ' ' +
            String(now.getHours()).padStart(2, '0') +
            ':' +
            String(now.getMinutes()).padStart(2, '0') +
            ':' +
            String(now.getSeconds()).padStart(2, '0')
        );
    }

    private formatObject(object: any) {
        if (typeof object === 'string') {
            return object;
        } else {
            return inspect(object, {
                showHidden: false,
                depth: Infinity,
                colors: false,
                breakLength: Infinity,
                compact: true,
                sorted: false,
            });
        }
    }

    private getFileName() {
        mkdirSync(this.directory, { recursive: true });
        const dirEntries = readdirSync(this.directory, { withFileTypes: true });
        let highest = 0;
        dirEntries
            .filter((entry) => entry.isFile())
            .filter((file) => /^log_\d+$/.test(file.name))
            .forEach((file) => {
                const index = Number(file.name.split('_')[1]);
                if (index > highest) {
                    highest = index;
                }
            });
        const filename = 'log_' + (highest + 1);
        return filename;
    }
}
