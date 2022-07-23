import { ArrayNotEmpty, IsArray, IsString } from 'class-validator';
import { WithPlayerName } from './mixins/with-player-name';

export class CreateGameDto extends WithPlayerName(class Base {}) {
    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true })
    cards: Array<string>;
}
