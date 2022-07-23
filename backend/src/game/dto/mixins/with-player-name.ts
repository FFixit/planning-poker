import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

type Constructor = new (...args: any[]) => Record<string, any>;

export function WithPlayerName<TBase extends Constructor>(Base: TBase) {
    class WithPlayerName extends Base {
        @IsString()
        @IsNotEmpty()
        @MinLength(3)
        @MaxLength(15)
        playerName: string;
    }

    return WithPlayerName;
}
