import { IFilmEntryUpdate } from "./types";

class EntryState {
  public readonly state: Partial<IFilmEntryUpdate>;
  public constructor(state: Partial<IFilmEntryUpdate>) {
    this.state = state;
  }
}

export class LoggedState extends EntryState {
  public constructor() {
    super({
      is_logged:true,
      is_in_watchlist: false,
      is_watched: true,
    });
  }
}

export class WatchedState extends EntryState {
  public constructor() {
    super({
      is_in_watchlist: false,
      is_watched: true,
    });
  }
}

export class loggedToWatchedState extends EntryState {
  public constructor() {
    super({
      is_logged: false,
      is_watched: true,
    });
  }
}

export class likedState extends EntryState {
  public constructor() {
    super({
      is_liked: true,
    });
  }
}

export class watchlistedState extends EntryState {
  public constructor() {
    super({
      is_in_watchlist: true,
    });
  }
}

export class reviewedState extends EntryState {
  public constructor() {
    super({
      ...new LoggedState().state,
      is_reviewed: true,
    });
  }
}

export default EntryState;
