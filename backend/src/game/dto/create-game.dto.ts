import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateGameDto {
    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true })
    cards: Array<string>;

    @IsString()
    @IsNotEmpty()
    playerName: string;
}
