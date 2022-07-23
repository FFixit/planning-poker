import { WithPlayerName } from './mixins/with-player-name';
import { WithSessionId } from './mixins/with-session-id';

export class JoinGameDto extends WithPlayerName(WithSessionId(class Base {})) {}
