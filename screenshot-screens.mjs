// Switchr screenshots — naviguer naturellement via clicks réels.
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const URL = 'http://localhost:3033';
const OUT = path.resolve('./screenshots');
fs.mkdirSync(OUT, { recursive: true });

const VP = { width: 412, height: 915, deviceScaleFactor: 2, isMobile: true, hasTouch: true };

const wait = (ms) => new Promise(r => setTimeout(r, ms));

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport(VP);

  async function shot(name) {
    await wait(700);
    const file = path.join(OUT, name + '.png');
    await page.screenshot({ path: file });
    console.log('✓ ' + name);
  }

  // Helper : clique le bouton React qui contient un texte (cherche dans tous les boutons visibles)
  async function clickButtonWithText(regex) {
    const handles = await page.$$('button');
    for (const h of handles) {
      const txt = await h.evaluate(el => el.textContent || '');
      if (regex.test(txt)) {
        await h.click();
        return true;
      }
    }
    return false;
  }

  // ─── Frais state : clean le localStorage avant chaque session
  await page.goto(URL, { waitUntil: 'networkidle0' });
  await page.evaluate(() => localStorage.clear());

  // 1) WELCOME (état déconnecté, 1er render après React mount)
  await page.goto(URL, { waitUntil: 'networkidle0' });
  await page.waitForFunction(
    () => document.querySelector('#root button') !== null,
    { timeout: 8000 }
  );
  await shot('01-welcome');

  // 2) SIGNUP — clique "Creer un compte"
  await clickButtonWithText(/cr[ée]er.*compte/i);
  await wait(500);
  await shot('02-signup-empty');

  // 2b) SIGNUP rempli — pour montrer le form en action
  const inputs = await page.$$('#root input');
  if (inputs.length >= 2) {
    await inputs[0].type('Joseph Pino Lando', { delay: 30 });
    if (inputs[1]) await inputs[1].type('TestPassword123!', { delay: 30 });
    if (inputs[2]) await inputs[2].type('TestPassword123!', { delay: 30 });
  }
  await shot('02b-signup-filled');

  // 3) Submit signup → devrait naviguer vers Home
  await clickButtonWithText(/^(creer|cr[ée]er|valider|s'inscrire|continuer)/i);
  await wait(1500);
  await shot('04-home');

  // 5) PROFILE — clique sur le bouton Profil/avatar
  const wentToProfile = await clickButtonWithText(/profil|avatar|joseph/i);
  if (!wentToProfile) {
    // fallback : essaye un click sur un avatar (pas un button maybe)
    await page.evaluate(() => {
      const els = Array.from(document.querySelectorAll('div, a, [role="button"]'));
      const el = els.find(e => /profil|avatar/i.test(e.textContent || ''));
      if (el) el.click();
    });
  }
  await wait(800);
  await shot('05-profile');

  // 6) EXCHANGE — back home + clic Échanger
  await page.goto(URL, { waitUntil: 'networkidle0' });
  await wait(1000);
  await clickButtonWithText(/[ée]changer|partager|qr|envoyer/i);
  await wait(1200);
  await shot('06-exchange');

  // 3-bis) LOGIN — logout + retour Welcome + clic Login
  await page.goto(URL, { waitUntil: 'networkidle0' });
  await wait(800);
  await page.evaluate(() => {
    // simule logout via API auth si dispo
    const sess = JSON.parse(localStorage.getItem('switchr_session') || '{"uid":null}');
    sess.uid = null;
    localStorage.setItem('switchr_session', JSON.stringify(sess));
  });
  await page.reload({ waitUntil: 'networkidle0' });
  await wait(800);
  await clickButtonWithText(/d[eé]j[aà].*compte|connexion|login|connecter/i);
  await wait(800);
  await shot('03-login');

  await browser.close();
  console.log('\nDONE → ' + OUT);
})().catch(e => { console.error('ERR:', e.message); console.error(e.stack); process.exit(1); });
