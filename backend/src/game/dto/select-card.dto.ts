import { IsNumber } from 'class-validator';
import { SessionSpecific } from './base/session-specific.dto';

export class SelectCardDto extends SessionSpecific {
    @IsNumber()
    index: number;
}
