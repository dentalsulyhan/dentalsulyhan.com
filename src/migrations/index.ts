import * as migration_20260620_210555 from './20260620_210555';

export const migrations = [
  {
    up: migration_20260620_210555.up,
    down: migration_20260620_210555.down,
    name: '20260620_210555'
  },
];
