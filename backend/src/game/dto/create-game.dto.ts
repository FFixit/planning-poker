import { ArrayNotEmpty, IsArray, IsInt, IsString, Max, Min } from 'class-validator';
import { WithPlayerName } from './mixins/with-player-name';

export class CreateGameDto extends WithPlayerName(class {}) {
    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true })
    cards: Array<string>;

    @IsInt()
    @Min(1)
    @Max(60)
    roundTime: number;
}
