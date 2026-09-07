import { cp, mkdir, writeFile, readdir } from 'node:fs/promises';

const files = [
  'CNAME',
  'images/LindaPark300x300.png',
  'archive/original-index.html',
  'media/hoshisato.jpg',
  'media/hoshisatoblu.jpg',
  'tools/konami.js',
];
for (const file of files) {
  await mkdir(`dist/${file.substring(0, file.lastIndexOf('/') + 1)}`, { recursive: true });
  await cp(file, `dist/${file}`);
}
for (const file of ['ASSETS.md', 'README.md']) await cp(file, `dist/${file}`);
await mkdir('dist/licenses', { recursive: true });
for (const dependency of [
  'phaser',
  'lucide',
  '@fontsource/rajdhani',
  '@fontsource/space-grotesk',
]) {
  const directory = `node_modules/${dependency}`;
  const license = (await readdir(directory)).find((file) => /^licen[cs]e(?:\.|$)/i.test(file));
  if (!license) throw new Error(`Missing license for ${dependency}`);
  await cp(`${directory}/${license}`, `dist/licenses/${dependency.replaceAll('/', '-')}.txt`);
}
await writeFile('dist/.nojekyll', '');
console.log('Static site packaged with original autograph, archive, and CNAME.');
