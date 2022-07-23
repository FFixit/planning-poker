import { IsNotEmpty, IsString } from 'class-validator';

type Constructor = new (...args: any[]) => Record<string, any>;

export function WithSessionId<TBase extends Constructor>(Base: TBase) {
    class WithSessionId extends Base {
        @IsString()
        @IsNotEmpty()
        sessionId: string;
    }

    return WithSessionId;
}
