import { WithSessionId } from './mixins/with-session-id';

export class LeaveGameDto extends WithSessionId(class Base {}) {}
