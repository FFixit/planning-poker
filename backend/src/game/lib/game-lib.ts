import { Injectable } from '@nestjs/common';
import * as LFSR from 'lfsr';

@Injectable()
export class GameLib {
    private rng: LFSR;

    constructor() {
        this.rng = new LFSR(28, new Date().getTime());
    }

    getNextGameId(): string {
        this.rng.shift();
        while (this.rng.register <= parseInt('ffffff', 16)) {
            this.rng.shift();
        }
        return this.rng.register.toString(16);
    }
}
