import { IsNotEmpty, IsString } from 'class-validator';

export abstract class SessionSpecific {
    @IsString()
    @IsNotEmpty()
    sessionId: string;
}
