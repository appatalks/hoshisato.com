import '../expeditions.css';
import { COLLECTIONS } from '../data/expeditions.js';

export class ExpeditionInterface {
  constructor(ui) {
    this.ui = ui;
    this.app = ui.app;
    const container = document.createElement('div');
    container.id = 'expedition-overlay';
    container.innerHTML =
      '<canvas id="expedition-radar" width="240" height="180" aria-label="Local survey showing objectives and return point"></canvas><div id="expedition-telemetry"></div><div id="expedition-touch"><div class="exp-dpad"><button data-touch="up" aria-label="Move north or apply thrust"><i data-lucide="arrow-up"></i></button><button data-touch="left" aria-label="Move west or turn left"><i data-lucide="arrow-left"></i></button><button data-touch="down" aria-label="Move south or brake"><i data-lucide="arrow-down"></i></button><button data-touch="right" aria-label="Move east or turn right"><i data-lucide="arrow-right"></i></button></div><div class="exp-actions"><button data-touch="map" aria-label="Field survey"><i data-lucide="map"></i></button><button data-touch="signal" aria-label="Scanner or sensor decoy"><i data-lucide="radio"></i></button><button data-touch="interact" aria-label="Interact or dock"><i data-lucide="hand"></i></button><button data-touch="jump" aria-label="Flight boost"><i data-lucide="wind"></i></button></div></div>';
    document.querySelector('#game-screen').append(container);
  }
  list(collection) {
    const catalog = COLLECTIONS[collection];
    const record = this.app.store.data[collection];
    this.ui.show(
      catalog.name,
      `<div class="collection-tabs"><button data-action="missions">Star Chart</button><button data-action="away" ${collection === 'away' ? 'aria-current="page"' : ''}>Away Missions</button><button data-action="shuttle" ${collection === 'shuttle' ? 'aria-current="page"' : ''}>Shuttle Bay</button></div><div class="stats-band"><div><strong>${record.completed.length}/10</strong><span>COMPLETED</span></div><div><strong>${record.discoveries.length}/10</strong><span>DISCOVERIES</span></div></div><div class="mission-list">${catalog.missions.map((mission) => `<button class="mission ${record.completed.includes(mission.id) ? 'mission-complete' : ''}" data-expedition="${mission.id}" data-collection="${collection}"><span class="mission-number">${String(mission.id + 1).padStart(2, '0')}</span><span><strong>${mission.title}</strong><small>${mission.place}</small><small>${mission.mechanic}</small><span class="mission-status">${record.completed.includes(mission.id) ? 'COMPLETED / REVISIT' : record.checkpoint?.level === mission.id ? 'IN PROGRESS / RESUME' : 'AVAILABLE / NOT COMPLETED'}</span></span><i data-lucide="${record.completed.includes(mission.id) ? 'check' : 'arrow-right'}"></i></button>`).join('')}</div><div class="panel-actions"><button class="secondary-button" data-action="expedition-journal">Field logs</button><button class="secondary-button" data-action="hub">Return to the Defiant</button></div>`,
      catalog.subtitle,
    );
    this.ui.panel.querySelectorAll('[data-expedition]').forEach((button) => {
      const duration = record.bestTimes[button.dataset.expedition];
      if (!duration) return;
      const seconds = Math.floor(duration / 1000);
      const label = document.createElement('small');
      label.textContent = `PERSONAL BEST / ${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
      button.querySelector('.mission-status').after(label);
    });
  }
  hud(scene) {
    const record = this.app.store.data[scene.collection];
    document.querySelector('#hud-place').textContent = scene.level.place;
    document.querySelector('#hud-title').textContent = scene.level.title;
    document.querySelector('#hud-stars').textContent = `${record.discoveries.length}/10`;
    const next = scene.nodes?.find((node) => !scene.completed.includes(node.index));
    document.querySelector('#hud-objective').textContent = next
      ? `${scene.completed.length}/${scene.level.objectives.length} / ${next.name.toUpperCase()}`
      : scene.collection === 'away'
        ? 'RETURN TO EXTRACTION'
        : 'RETURN TO DOCK';
    document.querySelector('#relay-dots').innerHTML = scene.level.objectives
      .map(
        (node, index) =>
          `<span class="${scene.completed.includes(index) ? 'active' : ''}" aria-label="${node.name}: ${scene.completed.includes(index) ? 'complete' : 'waiting'}"></span>`,
      )
      .join('');
    document
      .querySelectorAll('.integrity span')
      .forEach((element, index) =>
        element.classList.toggle('empty', index >= scene.player.stability),
      );
    document
      .querySelector('.integrity')
      .setAttribute('aria-label', `Navigation stability ${scene.player.stability} of 3`);
    document.querySelector('#hud-tool').textContent =
      scene.collection === 'away' ? 'FIELD SCANNER' : 'MIRROR ENTERPRISE';
    document.querySelector('#hud-ability').textContent =
      scene.collection === 'away'
        ? 'WASD / MOVE   F / SCAN   E / INTERACT'
        : 'A D / TURN   W / THRUST   S / BRAKE';
    document
      .querySelector('#expedition-touch [data-touch="jump"]')
      .setAttribute('aria-label', scene.collection === 'away' ? 'Quick step' : 'Flight boost');
    this.telemetry(scene);
  }
  map(canvas, scene) {
    const context = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    context.fillStyle = '#0b1b28ed';
    context.fillRect(0, 0, width, height);
    const scaleX = width / scene.level.width;
    const scaleY = height / scene.level.height;
    context.strokeStyle = '#91acaa25';
    context.lineWidth = 1;
    for (let left = 0; left < width; left += width / 8) {
      context.beginPath();
      context.moveTo(left, 0);
      context.lineTo(left, height);
      context.stroke();
    }
    context.fillStyle = '#657787';
    for (const [left, top, span, rise] of scene.level.walls || [])
      context.fillRect(left * scaleX, top * scaleY, span * scaleX, rise * scaleY);
    for (const rock of scene.environment.rocks || []) {
      context.fillStyle = '#758590';
      context.beginPath();
      context.arc(
        rock.image.x * scaleX,
        rock.image.y * scaleY,
        Math.max(1.5, rock.radius * scaleX),
        0,
        Math.PI * 2,
      );
      context.fill();
    }
    scene.nodes.forEach((node) => {
      context.fillStyle = scene.completed.includes(node.index) ? '#8dd3ba' : '#efcc8d';
      context.beginPath();
      context.arc(node.x * scaleX, node.y * scaleY, 3.5, 0, Math.PI * 2);
      context.fill();
    });
    context.strokeStyle = '#a0dfc9';
    context.strokeRect(scene.level.exit[0] * scaleX - 4, scene.level.exit[1] * scaleY - 4, 8, 8);
    if (scene.escort) {
      context.fillStyle = '#9fe4b6';
      context.fillRect(scene.escort.x * scaleX - 3, scene.escort.y * scaleY - 3, 6, 6);
    }
    context.fillStyle = '#f1a2b5';
    context.beginPath();
    context.arc(
      scene.player.sprite.x * scaleX,
      scene.player.sprite.y * scaleY,
      3.5,
      0,
      Math.PI * 2,
    );
    context.fill();
  }
  telemetry(scene) {
    this.map(document.querySelector('#expedition-radar'), scene);
    const next = scene.nodes.find((node) => !scene.completed.includes(node.index));
    const target = next || { x: scene.level.exit[0], y: scene.level.exit[1] };
    const distance = Math.round(
      Math.hypot(scene.player.sprite.x - target.x, scene.player.sprite.y - target.y),
    );
    const seconds = Math.floor(scene.elapsed / 1000);
    const support = scene.towing
      ? ' / TRACTOR LINK'
      : scene.escort
        ? ` / ESCORT ${Math.round(Math.hypot(scene.escort.x - scene.player.sprite.x, scene.escort.y - scene.player.sprite.y))} M`
        : '';
    document.querySelector('#expedition-telemetry').textContent =
      scene.collection === 'shuttle'
        ? `${Math.round(scene.player.sprite.body.speed)} M/S / ${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')} / ${distance} M TO ${next ? 'OBJECTIVE' : 'DOCK'}${support}`
        : `FIELD SURVEY / ${distance} M TO ${next ? 'OBJECTIVE' : 'EXTRACTION'}`;
  }
  survey(scene) {
    this.ui.show(
      scene.collection === 'away' ? 'Planetary Field Survey' : 'Navigation Plot',
      `<canvas class="survey-map expedition-survey" width="1000" height="750" aria-label="Mission map with objective locations"></canvas><div class="survey-legend"><span><b class="survey-upper"></b>Open objective</span><span><b class="survey-exit"></b>Complete / extraction</span><span><b class="survey-player"></b>Your position</span></div><p>${scene.level.briefing}</p>${scene.nodes.map((node) => `<div class="archive-row"><span>${node.index + 1} / ${node.name}</span><span>${scene.completed.includes(node.index) ? 'COMPLETE' : 'OPEN'}</span></div>`).join('')}`,
      scene.level.place,
    );
    this.map(this.ui.panel.querySelector('.expedition-survey'), scene);
  }
  completed(scene) {
    const catalog = COLLECTIONS[scene.collection];
    const record = this.app.store.data[scene.collection];
    this.ui.show(
      'Mission Complete',
      `<p>${scene.level.ending}</p><div class="stats-band"><div><strong>${record.completed.length}/10</strong><span>${catalog.name.toUpperCase()}</span></div><div><strong>${scene.recalls}</strong><span>RECALLS</span></div><div><strong>${Math.floor(scene.elapsed / 60000)}:${String(Math.floor(scene.elapsed / 1000) % 60).padStart(2, '0')}</strong><span>MISSION TIME</span></div></div><div class="panel-actions"><button class="primary-button" data-action="hub"><i data-lucide="home"></i>Return to the Defiant</button><button class="secondary-button" data-action="${scene.collection}">Mission catalog</button></div>`,
      scene.level.place,
    );
  }
  journal() {
    let content = '';
    for (const [collection, catalog] of Object.entries(COLLECTIONS)) {
      const record = this.app.store.data[collection];
      content += `<h3>${catalog.name} / ${record.completed.length} complete</h3>`;
      if (!record.completed.length && !record.discoveries.length)
        content += '<p>No field reports recorded yet.</p>';
      for (const id of record.completed)
        content += `<div class="lore-entry"><span>${catalog.missions[id].place}</span><p>${catalog.missions[id].ending}</p></div>`;
      for (const id of record.discoveries)
        content += `<div class="lore-entry"><span>UNCHARTED / ${catalog.missions[id].title}</span><p>${catalog.missions[id].discovery}</p></div>`;
    }
    this.ui.show('Beyond the Star Chart', content, 'THE DEFIANT / EXPEDITION LOGS');
  }
  controls(scene) {
    const flight = scene?.collection === 'shuttle';
    const rows = flight
      ? [
          ['Turn', 'A / D or Left / Right', 'Left stick / D-pad'],
          ['Thrust', 'W or Up', 'Stick up / D-pad up'],
          ['Brake', 'S or Down', 'Stick down / D-pad down'],
          ['Boost', 'Space', 'A'],
          ['Scanner / decoy', 'F', 'X'],
          ['Dock / interact', 'E', 'Y'],
        ]
      : [
          ['Move', 'W A S D / Arrows', 'Left stick / D-pad'],
          ['Scanner', 'F', 'X'],
          ['Interact / translate', 'E', 'Y'],
          ['Quick step', 'Shift', 'B'],
        ];
    this.ui.show(
      flight ? 'At the Helm' : 'On an Away Mission',
      `${rows.map(([label, keys, pad]) => `<div class="control-row"><span>${label}</span><span><kbd>${keys}</kbd><small>${pad}</small></span></div>`).join('')}<div class="control-row"><span>Survey / return home</span><span><kbd>M / H</kbd></span></div><div class="control-row"><span>Pause</span><span><kbd>Escape</kbd><small>Menu</small></span></div><p>${flight ? 'Thrust changes velocity; releasing it lets the ship drift. Brake below 85 m/s to dock, rescue, or transfer cargo. Fly through racing rings. F reveals nearby signals and distracts traffic monitors.' : 'Explore in every direction. F reveals hidden discoveries and distant landmarks. E records findings, translates inscriptions, or greets inhabitants. Watch environmental cycles and take alternate paths.'}</p><p>Objectives save immediately. Restart resumes at the last completed objective. All discoveries remain safe after a navigation recall.</p>`,
    );
  }
}
