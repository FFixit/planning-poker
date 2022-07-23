import { IsNumber } from 'class-validator';
import { WithSessionId } from './mixins/with-session-id';

export class SelectCardDto extends WithSessionId(class Base {}) {
    @IsNumber()
    index: number;
}
