import { IsNotEmpty, IsString } from 'class-validator';
import { SessionSpecific } from './base/session-specific.dto';

export class JoinGameDto extends SessionSpecific {
    @IsString()
    @IsNotEmpty()
    playerName: string;
}
