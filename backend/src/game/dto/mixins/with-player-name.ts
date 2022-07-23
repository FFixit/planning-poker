import { IsNotEmpty, IsString } from 'class-validator';

type Constructor = new (...args: any[]) => Record<string, any>;

export function WithPlayerName<TBase extends Constructor>(Base: TBase) {
    class WithPlayerName extends Base {
        @IsString()
        @IsNotEmpty()
        playerName: string;
    }

    return WithPlayerName;
}
