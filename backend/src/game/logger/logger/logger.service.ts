import { Injectable } from '@nestjs/common';
import { createWriteStream } from 'fs';
import { inspect } from 'util';

@Injectable()
export class LoggerService {
    constructor(private outputStream = createWriteStream('log/log')) {}

    write(...messageParts) {
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
