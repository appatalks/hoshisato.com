export const SAVE_KEY = 'hoshi-mirror-signal-v1';
export const DEFAULT_SETTINGS = {
  music: 0.36,
  sound: 0.65,
  muted: false,
  reducedMotion: false,
  shake: true,
  difficulty: 'explorer',
};

export function freshSave() {
  return {
    version: 1,
    unlocked: 0,
    current: 0,
    checkpoint: null,
    completed: [],
    secrets: [],
    crystals: [],
    lore: [],
    routes: [],
    achievements: [],
    upgrades: [],
    activeCollection: 'star',
    away: { completed: [], discoveries: [], checkpoint: null, bestTimes: {} },
    shuttle: { completed: [], discoveries: [], checkpoint: null, bestTimes: {} },
    settings: { ...DEFAULT_SETTINGS },
  };
}

export function normalizeSave(raw) {
  const save = freshSave();
  if (!raw || raw.version !== 1) return save;
  for (const key of ['unlocked', 'current'])
    save[key] = Math.max(0, Math.min(9, Number.isInteger(raw[key]) ? raw[key] : 0));
  for (const key of ['completed', 'secrets', 'lore', 'routes']) {
    save[key] = [
      ...new Set(
        Array.isArray(raw[key])
          ? raw[key].filter((value) => Number.isInteger(value) && value >= 0 && value < 10)
          : [],
      ),
    ];
  }
  for (const key of ['crystals', 'achievements', 'upgrades']) {
    save[key] = [
      ...new Set(
        Array.isArray(raw[key])
          ? raw[key].filter((value) => typeof value === 'string' && value.length < 60).slice(0, 100)
          : [],
      ),
    ];
  }
  if (
    raw.checkpoint &&
    raw.checkpoint.level === save.current &&
    Number.isFinite(raw.checkpoint.x)
  ) {
    save.checkpoint = {
      level: save.current,
      x: Math.max(120, Math.min(4700, raw.checkpoint.x)),
      y: Number.isFinite(raw.checkpoint.y) ? Math.max(620, Math.min(1600, raw.checkpoint.y)) : 620,
      relays: Array.isArray(raw.checkpoint.relays)
        ? raw.checkpoint.relays.filter(
            (value) => Number.isInteger(value) && value >= 0 && value < 4,
          )
        : [],
    };
  }
  const settings = raw.settings || {};
  for (const collection of ['away', 'shuttle']) {
    const record = raw[collection] || {};
    for (const key of ['completed', 'discoveries']) {
      save[collection][key] = [
        ...new Set(
          Array.isArray(record[key])
            ? record[key].filter((value) => Number.isInteger(value) && value >= 0 && value < 10)
            : [],
        ),
      ];
    }
    const checkpoint = record.checkpoint;
    for (let level = 0; level < 10; level += 1) {
      const duration = record.bestTimes?.[level];
      if (Number.isFinite(duration) && duration > 0 && duration <= 86400000)
        save[collection].bestTimes[level] = duration;
    }
    if (
      checkpoint &&
      Number.isInteger(checkpoint.level) &&
      checkpoint.level >= 0 &&
      checkpoint.level < 10
    ) {
      save[collection].checkpoint = {
        level: checkpoint.level,
        elapsed: Number.isFinite(checkpoint.elapsed)
          ? Math.max(0, Math.min(86400000, checkpoint.elapsed))
          : 0,
        objectives: [
          ...new Set(
            Array.isArray(checkpoint.objectives)
              ? checkpoint.objectives.filter(
                  (value) => Number.isInteger(value) && value >= 0 && value < 6,
                )
              : [],
          ),
        ],
      };
    }
  }
  if (['away', 'shuttle'].includes(raw.activeCollection))
    save.activeCollection = raw.activeCollection;
  for (const key of ['music', 'sound'])
    if (Number.isFinite(settings[key]))
      save.settings[key] = Math.max(0, Math.min(1, settings[key]));
  for (const key of ['reducedMotion', 'shake', 'muted'])
    if (typeof settings[key] === 'boolean') save.settings[key] = settings[key];
  if (['explorer', 'voyager'].includes(settings.difficulty))
    save.settings.difficulty = settings.difficulty;
  return save;
}

export class SaveStore {
  constructor(storage) {
    this.persistent = true;
    try {
      this.storage = storage ?? globalThis.localStorage;
      this.data = normalizeSave(JSON.parse(this.storage.getItem(SAVE_KEY)));
    } catch {
      this.data = freshSave();
      this.persistent = false;
    }
  }
  write() {
    try {
      this.storage.setItem(SAVE_KEY, JSON.stringify(this.data));
      this.persistent = true;
    } catch {
      this.persistent = false;
    }
    return this.persistent;
  }
  add(key, value) {
    if (this.data[key].includes(value)) return false;
    this.data[key].push(value);
    this.write();
    return true;
  }
  complete(level) {
    this.add('completed', level);
    this.data.unlocked = Math.max(this.data.unlocked, Math.min(9, level + 1));
    this.data.checkpoint = null;
    this.write();
  }
  recordExpedition(collection, key, level, elapsed = 0) {
    if (
      !['away', 'shuttle'].includes(collection) ||
      !['completed', 'discoveries'].includes(key) ||
      !Number.isInteger(level) ||
      level < 0 ||
      level > 9
    )
      return false;
    const record = this.data[collection];
    const fresh = !record[key].includes(level);
    if (fresh) record[key].push(level);
    if (key === 'completed') {
      record.checkpoint = null;
      if (Number.isFinite(elapsed) && elapsed > 0 && elapsed <= 86400000)
        record.bestTimes[level] = Math.min(
          record.bestTimes[level] ?? Infinity,
          Math.round(elapsed),
        );
    }
    this.write();
    return fresh;
  }
  reset() {
    const settings = this.data.settings;
    this.data = freshSave();
    this.data.settings = settings;
    this.write();
  }
}
