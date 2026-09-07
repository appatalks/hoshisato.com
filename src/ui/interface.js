import {
  createIcons,
  Play,
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  ArrowUpRight,
  Orbit,
  Volume2,
  VolumeX,
  SlidersHorizontal,
  Feather,
  Sparkles,
  Pause,
  Radio,
  Repeat2,
  Wind,
  Hand,
  X,
  Lock,
  Check,
  Trophy,
  BookOpen,
  Home,
  RotateCcw,
  Shield,
  Map as MapIcon,
} from 'lucide';
import { LEVELS, ACHIEVEMENTS, completion } from '../data/campaign.js';
import { UPGRADES, unspentStars } from '../data/hub.js';
import { lowerRoute } from '../data/exploration.js';
import { ExpeditionInterface } from './expeditions.js';

const ICONS = {
  Play,
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  ArrowUpRight,
  Orbit,
  Volume2,
  VolumeX,
  SlidersHorizontal,
  Feather,
  Sparkles,
  Pause,
  Radio,
  Repeat2,
  Wind,
  Hand,
  X,
  Lock,
  Check,
  Trophy,
  BookOpen,
  Home,
  RotateCcw,
  Shield,
  Map: MapIcon,
};
const DISCLAIMER =
  'This is an unofficial fan-created project and is not affiliated with or endorsed by Paramount, CBS, Star Trek, or their respective rights holders.';
const action = (name, text, icon = 'arrow-right', primary = false) =>
  `<button class="${primary ? 'primary-button' : 'secondary-button'}" data-action="${name}"><i data-lucide="${icon}"></i>${text}</button>`;

export class Interface {
  constructor(app) {
    this.app = app;
    this.panel = document.querySelector('#panel');
    this.toastTimer = null;
    this.expeditions = new ExpeditionInterface(this);
    document.addEventListener('click', (event) => {
      const button = event.target.closest(
        '[data-action], [data-level], [data-buy], [data-difficulty], [data-expedition]',
      );
      if (!button || button.disabled) return;
      this.app.audio.cue('click');
      if (button.dataset.expedition !== undefined) {
        this.app.startExpedition(button.dataset.collection, Number(button.dataset.expedition));
        return;
      }
      if (button.dataset.level !== undefined) {
        this.app.startLevel(Number(button.dataset.level));
        return;
      }
      if (button.dataset.buy) {
        this.buy(button.dataset.buy);
        return;
      }
      if (button.dataset.difficulty) {
        this.app.store.data.settings.difficulty = button.dataset.difficulty;
        this.app.store.write();
        this.options();
        return;
      }
      this.handle(button.dataset.action);
    });
    this.panel.addEventListener('cancel', (event) => {
      event.preventDefault();
      this.close();
    });
    this.panel.addEventListener('input', (event) => {
      const key = event.target.dataset.setting;
      if (!key) return;
      this.app.store.data.settings[key] =
        event.target.type === 'checkbox' ? event.target.checked : Number(event.target.value);
      this.app.store.write();
      this.applySettings();
    });
    this.icons();
    this.title();
    this.menuButtons = [];
    this.menuDirection = 0;
    this.menuTimer = setInterval(() => this.pollController(), 100);
  }
  icons() {
    createIcons({ icons: ICONS, attrs: { 'aria-hidden': 'true' } });
  }
  expeditionHud(scene) {
    return this.expeditions.hud(scene);
  }
  expeditionTelemetry(scene) {
    return this.expeditions.telemetry(scene);
  }
  expeditionSurvey(scene) {
    return this.expeditions.survey(scene);
  }
  expeditionCompleted(scene) {
    return this.expeditions.completed(scene);
  }
  pollController() {
    const pad = Array.from(navigator.getGamepads?.() || []).find(
      (entry) => entry?.connected && entry.mapping === 'standard',
    );
    const buttons = pad?.buttons.map((button) => button.pressed) || [];
    if (this.panel.open && pad) {
      const direction =
        buttons[13] || pad.axes[1] > 0.5 ? 1 : buttons[12] || pad.axes[1] < -0.5 ? -1 : 0;
      if (direction && direction !== this.menuDirection) {
        const items = Array.from(
          this.panel.querySelectorAll('button:not(:disabled), input, a[href]'),
        );
        const index = items.indexOf(document.activeElement);
        items[(index + direction + items.length) % items.length]?.focus();
      }
      if (buttons[0] && !this.menuButtons[0]) document.activeElement?.click();
      if ((buttons[1] && !this.menuButtons[1]) || (buttons[9] && !this.menuButtons[9]))
        this.close();
      this.menuDirection = direction;
    }
    this.menuButtons = buttons;
  }
  applySettings() {
    const settings = this.app.store.data.settings;
    document.body.classList.toggle('reduced-motion', settings.reducedMotion);
    this.app.audio.update();
    if (this.app.scene?.ambient) {
      if (settings.reducedMotion) this.app.scene.ambient.stop();
      else this.app.scene.ambient.start();
    }
  }
  handle(name) {
    const actions = {
      play: () => this.app.play(),
      pause: () => this.pause(),
      close: () => this.close(),
      controls: () => this.controls(),
      options: () => this.options(),
      missions: () => this.missions(),
      away: () => this.expeditions.list('away'),
      shuttle: () => this.expeditions.list('shuttle'),
      'expedition-journal': () => this.expeditions.journal(),
      survey: () => this.survey(),
      archive: () => this.archive(),
      credits: () => this.credits(),
      achievements: () => this.achievements(),
      journal: () => this.journal(),
      hub: () => this.app.startHub(),
      title: () => this.app.toTitle(),
      restart: () => this.app.restart(),
      workshop: () => this.workshop(),
      audio: async () => {
        try {
          await this.app.audio.start();
        } catch {
          this.toast('Audio is unavailable in this browser. The adventure still works.');
        }
        this.app.audio.muted = !this.app.audio.muted;
        this.app.store.data.settings.muted = this.app.audio.muted;
        this.app.store.write();
        this.app.audio.update();
        const button = document.querySelector('[data-action="audio"]');
        button.innerHTML = `<i data-lucide="${this.app.audio.muted ? 'volume-x' : 'volume-2'}"></i>`;
        button.setAttribute('aria-pressed', String(this.app.audio.muted));
        button.title = this.app.audio.muted ? 'Unmute audio' : 'Mute audio';
        this.icons();
      },
      reset: () =>
        this.show(
          'A Fresh Frequency',
          `<p>Erase your campaign, archives, stars, achievements, and upgrades on this device? Your audio and accessibility settings will stay.</p><div class="panel-actions">${action('confirm-reset', 'Erase progress', 'rotate-ccw')}${action('options', 'Keep my journey', 'arrow-left', true)}</div>`,
        ),
      'confirm-reset': () => {
        this.app.toTitle();
        this.app.store.reset();
        this.title();
        this.toast('A fresh journey is ready.');
      },
    };
    actions[name]?.();
  }
  show(title, content, eyebrow = 'THE MIRROR SIGNAL') {
    this.menuButtons =
      Array.from(navigator.getGamepads?.() || [])
        .find((entry) => entry?.connected)
        ?.buttons.map((button) => button.pressed) || [];
    if (this.app.scene) {
      if (this.app.scene.scene.isActive()) this.app.scene.sys.pause();
      this.app.input.clear();
      this.app.audio.suspend(true);
    }
    document.querySelector('#panel-title').textContent = title;
    document.querySelector('#panel-eyebrow').textContent = eyebrow;
    document.querySelector('#panel-content').innerHTML = content;
    if (!this.panel.open) this.panel.showModal();
    this.panel.scrollTop = 0;
    this.icons();
  }
  close(resume = true) {
    if (this.panel.open) this.panel.close();
    if (resume && this.app.scene?.finished) {
      this.app.startHub();
      return;
    }
    if (resume && this.app.scene) {
      this.app.input.clear();
      if (this.app.scene.scene.isPaused()) this.app.scene.sys.resume();
      this.app.audio.suspend(false);
    }
  }
  title() {
    const save = this.app.store.data;
    const audioButton = document.querySelector('[data-action="audio"]');
    audioButton.innerHTML = `<i data-lucide="${save.settings.muted ? 'volume-x' : 'volume-2'}"></i>`;
    audioButton.setAttribute('aria-pressed', String(save.settings.muted));
    this.icons();
    const checkpoint =
      save.activeCollection === 'star' ? save.checkpoint : save[save.activeCollection]?.checkpoint;
    document.querySelector('#play-label').textContent = checkpoint
      ? 'RESUME YOUR JOURNEY'
      : save.completed.length || save.away.completed.length || save.shuttle.completed.length
        ? 'RETURN TO THE DEFIANT'
        : 'BEGIN YOUR JOURNEY';
    document.querySelector('#title-progress').textContent =
      `${String(save.completed.length).padStart(2, '0')} / 10`;
  }
  loading() {
    this.close(false);
    document.querySelector('#loading').hidden = false;
  }
  ready() {
    document.querySelector('#loading').hidden = true;
    document.querySelector('#title-screen').hidden = true;
    document.querySelector('#game-screen').hidden = false;
  }
  toast(text) {
    const element = document.querySelector('#toast');
    element.textContent = text;
    element.hidden = false;
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      element.hidden = true;
    }, 4400);
  }
  hud(scene) {
    if (scene.collection && scene.collection !== 'star') return this.expeditions.hud(scene);
    const save = this.app.store.data;
    document.querySelector('#hud-place').textContent =
      scene.exploration && scene.player.sprite.y > 785
        ? `${scene.level.place} / LOWER PASSAGE`
        : scene.level.place;
    document.querySelector('#hud-title').textContent =
      scene.exploration && scene.player.sprite.y > 785
        ? scene.exploration.route.name
        : scene.level.title;
    document.querySelector('#hud-stars').textContent = String(save.crystals.length);
    document.querySelector('#hud-objective').textContent = scene.isHub
      ? `${save.completed.length} WORLDS / ${completion(save)}% DISCOVERED`
      : scene.relays.every((relay) => relay.active)
        ? scene.keeper && !scene.keeper.done
          ? 'HARMONIZE THE KEEPER'
          : 'RETURN TO THE DEFIANT'
        : 'RESTORE THE WORLD SIGNAL';
    document.querySelector('#relay-dots').innerHTML = scene.relays
      .map(
        (relay) =>
          `<span class="${relay.active ? 'active' : ''}" aria-label="Receiver ${relay.index + 1}: ${relay.active ? 'connected' : 'waiting'}"></span>`,
      )
      .join('');
    document
      .querySelectorAll('.integrity span')
      .forEach((element, index) =>
        element.classList.toggle('empty', index >= scene.player.stability),
      );
    document
      .querySelector('.integrity')
      .setAttribute('aria-label', `Signal stability ${scene.player.stability} of 3`);
    document.querySelector('#hud-tool').textContent = scene.signals.tool.name.toUpperCase();
    document.querySelector('.tool-hud').style.color = scene.signals.tool.hex;
    document.querySelector('#hud-ability').textContent = scene.isHub
      ? 'M / STAR CHART'
      : 'Q / CHANGE SIGNAL';
    document.querySelector('#tool-meter').style.background = scene.signals.tool.hex;
  }
  pause() {
    if (!this.app.scene || this.panel.open) return;
    this.show(
      'A Moment Between Stars',
      `<p>${this.app.scene.level.place}</p><div class="panel-actions">${action('close', 'Continue', 'play', true)}${action('survey', 'Deck survey', 'map')}${action('achievements', 'Achievements', 'trophy')}${action('restart', 'Return to checkpoint', 'rotate-ccw')}${action('hub', 'The Defiant', 'home')}${action('options', 'Options', 'sliders-horizontal')}${action('controls', 'Controls', 'hand')}${action('title', 'Title screen', 'arrow-left')}<a class="secondary-button" href="https://www.instagram.com/reallindapark" target="_blank" rel="noopener noreferrer"><i data-lucide="arrow-up-right"></i>Linda's Instagram</a></div>`,
    );
  }
  survey() {
    const scene = this.app.scene;
    if (!scene) return;
    if (scene.collection && scene.collection !== 'star') return this.expeditions.survey(scene);
    this.show(
      'Beneath the Official Maps',
      '<canvas class="survey-map" width="1000" height="540" aria-label="Deck survey showing upper platforms, the lower passage, return lift, and Hoshi\'s location"></canvas><div class="survey-legend"><span><b class="survey-upper"></b>Upper route</span><span><b class="survey-lower"></b>Lower passage</span><span><b class="survey-player"></b>Hoshi</span><span><b class="survey-exit"></b>Return lift</span></div>',
      scene.level.place,
    );
    const canvas = this.panel.querySelector('.survey-map');
    const context = canvas.getContext('2d');
    const scaleX = 920 / scene.level.width;
    const scaleY = 430 / (scene.level.height || 800);
    context.fillStyle = '#111e2b';
    context.fillRect(0, 0, 1000, 540);
    context.strokeStyle = '#9bbcaf16';
    context.lineWidth = 1;
    for (let left = 40; left < 1000; left += 60) {
      context.beginPath();
      context.moveTo(left, 20);
      context.lineTo(left, 515);
      context.stroke();
    }
    for (let top = 35; top < 530; top += 60) {
      context.beginPath();
      context.moveTo(25, top);
      context.lineTo(975, top);
      context.stroke();
    }
    for (const platform of scene.ground.getChildren()) {
      context.fillStyle = platform.body.top > 740 ? '#b095cb' : '#e4c78d';
      context.fillRect(
        40 + platform.body.left * scaleX,
        40 + platform.body.top * scaleY,
        Math.max(2, platform.body.width * scaleX),
        Math.max(3, Math.min(15, platform.body.height * scaleY)),
      );
    }
    if (scene.exploration) {
      const route = scene.exploration.route;
      context.strokeStyle = '#ba9aca55';
      context.lineWidth = 2;
      context.strokeRect(
        40 + route.left * scaleX,
        40 + 737 * scaleY,
        (route.right - route.left) * scaleX,
        (route.bottom - 737) * scaleY,
      );
      context.fillStyle = '#86e2cc';
      context.fillRect(35 + route.lift.x * scaleX, 25 + route.lift.y * scaleY, 10, 15);
    }
    context.fillStyle = '#f498aa';
    context.beginPath();
    context.arc(
      40 + scene.player.sprite.x * scaleX,
      35 + scene.player.sprite.y * scaleY,
      6,
      0,
      Math.PI * 2,
    );
    context.fill();
  }
  controls() {
    if (this.app.scene?.collection && this.app.scene.collection !== 'star')
      return this.expeditions.controls(this.app.scene);
    const rows = [
      ['Move / run', 'A D / Left Right', 'Left stick / D-pad'],
      ['Jump / double jump', 'Space', 'A'],
      ['Crouch / drop through', 'S / S + Space', 'Down / Down + A'],
      ['Send signal', 'F', 'X'],
      ['Aim up / manual aim', 'W or Up', 'Right stick'],
      ['Interact / tune nearby', 'E', 'Y'],
      ['Change signal tool', 'Q', 'RB'],
      ['Phase step (world 2 onward)', 'Shift', 'B'],
      ['Signal shield (world 6 onward)', 'R', 'LT'],
      ['Pause', 'Escape', 'Menu'],
      ['Star chart / home', 'M / H', 'Pause menu'],
    ];
    this.show(
      'Find Your Footing',
      `<p>Keyboard and standard controllers. Touch controls appear on phones and tablets.</p>${rows.map(([label, keys, pad]) => `<div class="control-row"><span>${label}</span><span><kbd>${keys}</kbd><small>${pad}</small></span></div>`).join('')}<p class="control-note">Hold jump to rise higher. Signals gently aim at nearby receivers in the direction Hoshi faces. Match the receiver's tool name and shape. A signal gives a patrol drone a short, peaceful break. Phase steps and shields pass through scanning light.</p><p class="control-note">Explorer mode gives three chances before a recall. Voyager recalls you whenever a scanner finds you. Falls always return you safely. Your discoveries are kept. Landscape offers the widest view on a phone.</p>`,
    );
  }
  options() {
    const settings = this.app.store.data.settings;
    this.show(
      'Your Frequency',
      `<label class="option-row">Music<input data-setting="music" type="range" min="0" max="1" step="0.05" value="${settings.music}" aria-label="Music volume"></label><label class="option-row">Sound effects<input data-setting="sound" type="range" min="0" max="1" step="0.05" value="${settings.sound}" aria-label="Sound effects volume"></label><label class="option-row">Reduced motion<input data-setting="reducedMotion" type="checkbox" ${settings.reducedMotion ? 'checked' : ''}></label><label class="option-row">Camera feedback<input data-setting="shake" type="checkbox" ${settings.shake ? 'checked' : ''}></label><div class="option-row"><span>Journey style</span><div class="segmented">${['explorer', 'voyager'].map((name) => `<button data-difficulty="${name}" class="${settings.difficulty === name ? 'selected' : ''}" aria-pressed="${settings.difficulty === name}">${name === 'explorer' ? 'Explorer' : 'Voyager'}</button>`).join('')}</div></div><p class="control-note">Explorer: generous second chances. Voyager: each scanner returns you to your checkpoint. Both include the complete story.</p><p class="control-note ${this.app.store.persistent ? '' : 'storage-warning'}">${this.app.store.persistent ? 'Progress saves automatically on this device.' : 'Storage is blocked. Progress will last only for this visit.'}</p><button class="danger-button" data-action="reset">Reset progress on this device</button>`,
    );
  }
  missions() {
    const save = this.app.store.data;
    this.show(
      'Ten Worlds. One Channel.',
      `<div class="mission-list">${LEVELS.map((level) => `<button class="mission ${save.completed.includes(level.id) ? 'mission-complete' : ''}" data-level="${level.id}"><span class="mission-number">${String(level.id + 1).padStart(2, '0')}</span><span><strong>${level.title}</strong><small>${level.place} / ${level.mechanic}</small><span class="mission-status">${save.completed.includes(level.id) ? 'COMPLETED / REVISIT' : save.checkpoint?.level === level.id ? 'IN PROGRESS / RESUME' : 'AVAILABLE / NOT COMPLETED'}</span></span><i data-lucide="${save.completed.includes(level.id) ? 'check' : 'arrow-right'}"></i></button>`).join('')}</div><div class="panel-actions">${action('hub', 'Walk the Defiant', 'home')}</div>`,
      'THE DEFIANT / STAR CHART',
    );
    this.panel
      .querySelector('#panel-content')
      .insertAdjacentHTML(
        'afterbegin',
        '<div class="collection-tabs"><button data-action="missions" aria-current="page">Star Chart</button><button data-action="away">Away Missions</button><button data-action="shuttle">Shuttle Bay</button></div>',
      );
  }
  archive() {
    this.show(
      'A Note From Linda',
      `<p class="archive-intro">Before there was a universe to explore, there was this little corner of the internet. This is the site's original Linda Park autograph, preserved in its original image file.</p><a href="images/LindaPark300x300.png" target="_blank" rel="noopener" aria-label="Open the original Linda Park autograph"><img class="autograph-original" src="images/LindaPark300x300.png" width="300" height="330" alt="Linda Park's original handwritten note and autograph"></a><div class="panel-actions">${action('journal', 'World logs', 'book-open')}${action('achievements', 'Discoveries', 'sparkles')}</div><h3>The Original Corner of the Internet</h3><p><a href="archive/original-index.html" target="_blank" rel="noopener">Visit the historical homepage</a> or <a href="https://github.com/appatalks/hoshisato.com" target="_blank" rel="noopener">explore the repository and legacy tools</a>.</p><p class="disclaimer">${DISCLAIMER}</p>`,
      'HOSHISATO.COM / THE ARCHIVE',
    );
  }
  journal() {
    const save = this.app.store.data;
    const messages = save.completed.length
      ? `<h3>Incoming Transmissions</h3>${save.completed.map((id) => `<div class="lore-entry"><span>${LEVELS[id].place}</span><p>${LEVELS[id].ending}</p></div>`).join('')}`
      : '';
    const logs = save.lore.length
      ? `<h3>Recovered World Logs</h3>${save.lore.map((id) => `<div class="lore-entry"><span>${LEVELS[id].place}</span><p>${LEVELS[id].lore}</p></div>`).join('')}`
      : '<p>The listening post is quiet. The worlds have stories for those who stop at their terminals.</p>';
    const caches = save.routes.length
      ? `<h3>Imperial Intelligence / ${save.routes.length} of 10</h3>${save.routes.map((id) => `<div class="lore-entry"><span>${lowerRoute(LEVELS[id]).name.toUpperCase()}</span><p>${lowerRoute(LEVELS[id]).message}</p></div>`).join('')}`
      : '<p>Imperial intelligence caches: 0 / 10 recovered.</p>';
    this.show(
      'The Things We Hear',
      caches + messages + logs,
      'THE DEFIANT / INTERCEPTED TRANSMISSIONS',
    );
  }
  achievements() {
    const save = this.app.store.data;
    const earned = Object.keys(ACHIEVEMENTS).filter((key) =>
      save.achievements.includes(key),
    ).length;
    this.show(
      'Achievements',
      `<div class="stats-band"><div><strong>${earned}/${Object.keys(ACHIEVEMENTS).length}</strong><span>ACHIEVEMENTS EARNED</span></div><div><strong>${save.secrets.length}/10</strong><span>ARCHIVES</span></div><div><strong>${save.crystals.length}/50</strong><span>MEMORY STARS</span></div></div>${Object.entries(
        ACHIEVEMENTS,
      )
        .map(
          ([key, [title, description]]) =>
            `<div class="achievement ${save.achievements.includes(key) ? '' : 'locked'}" data-achievement="${key}"><i data-lucide="${save.achievements.includes(key) ? 'trophy' : 'lock'}"></i><div><strong>${title}</strong><small>${description}</small><span class="achievement-status">${save.achievements.includes(key) ? 'EARNED' : 'LOCKED'}</span></div></div>`,
        )
        .join('')}`,
    );
  }
  workshop() {
    const save = this.app.store.data;
    this.show(
      'A Little Ingenuity',
      `<p>${unspentStars(save)} memory stars available. Permanent upgrades for the journeys ahead.</p>${UPGRADES.map((upgrade) => `<div class="archive-row"><div>${upgrade.name}<small>${upgrade.text}</small></div><button class="secondary-button" data-buy="${upgrade.id}" ${save.upgrades.includes(upgrade.id) || unspentStars(save) < upgrade.cost ? 'disabled' : ''}>${save.upgrades.includes(upgrade.id) ? 'Installed' : `${upgrade.cost} stars`}</button></div>`).join('')}<p class="control-note">Three hidden archives unlock the Echo Lantern, a rare tool that speaks every receiver's language.</p>`,
      'THE DEFIANT / SIGNAL WORKSHOP',
    );
  }
  buy(id) {
    const upgrade = UPGRADES.find((entry) => entry.id === id);
    const save = this.app.store.data;
    if (!upgrade || save.upgrades.includes(id) || unspentStars(save) < upgrade.cost) return;
    this.app.store.add('upgrades', id);
    this.app.audio.cue('pickup');
    this.workshop();
  }
  completed(scene) {
    const finale = scene.level.id === 9;
    this.show(
      finale ? 'A Universe to Share' : 'Another Light in the Dark',
      `<p>${scene.level.ending}</p><div class="stats-band"><div><strong>${this.app.store.data.completed.length}/10</strong><span>WORLDS CONNECTED</span></div><div><strong>${scene.recalls}</strong><span>DETOURS</span></div><div><strong>${this.app.store.data.secrets.includes(scene.level.id) ? 'FOUND' : 'WAITING'}</strong><span>HIDDEN ARCHIVE</span></div></div><p>${this.app.store.data.completed.length === 10 ? 'Every world is connected. The Defiant is waiting, and there are still quiet corners to discover.' : 'Another world answers your signal. The remaining destinations are waiting on the star chart.'}</p><div class="panel-actions">${action('hub', 'Return to the Defiant', 'home', true)}${finale ? action('credits', 'Credits', 'sparkles') : ''}</div>`,
      finale ? 'THE MIRROR SIGNAL / FINALE' : scene.level.place,
    );
  }
  message(title, text) {
    this.show(title, '<p id="message-text"></p>');
    document.querySelector('#message-text').textContent = text;
  }
  credits() {
    this.show(
      'A Strange Little Corner',
      `<p><strong>Hoshi Sato: The Mirror Signal</strong><br>An original, non-commercial, family-friendly fan adventure for hoshisato.com.</p><p>Inspired by Hoshi Sato, portrayed by Linda Park, and the alternate-universe premise of <em>Star Trek: Enterprise</em>. This imaginative continuation is not franchise canon.</p><h3>Made for the Open Web</h3><p>Original code-drawn illustrations, character art, environments, and synthesized music and sounds. Built with Phaser, Lucide, Rajdhani, and Space Grotesk. No television footage, soundtrack recordings, or extracted game assets.</p><p>The original Linda Park autograph and historical site belong to this site's history and have not been altered. Their presence does not imply endorsement.</p><p><a href="ASSETS.md" target="_blank" rel="noopener">Asset origins and licenses</a> / <a href="https://github.com/appatalks/hoshisato.com" target="_blank" rel="noopener">Source and acknowledgments</a> / <a href="https://memory-alpha.fandom.com/wiki/Hoshi_Sato_(mirror)" target="_blank" rel="noopener">Character background</a></p><p class="disclaimer">${DISCLAIMER}</p><div class="panel-actions">${action('archive', 'Linda Park archive', 'feather')}${action('close', 'Back to the stars', 'arrow-left')}</div>`,
    );
  }
}
