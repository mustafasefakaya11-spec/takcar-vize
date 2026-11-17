const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const pages = ['index.html', 'rental.html', 'profil.html'];
const viewports = [
  { device: 'phone', width: 390, height: 844 },
  { device: 'tablet', width: 820, height: 1180 },
  { device: 'desktop', width: 1440, height: 900 }
];

const outputDir = path.join(__dirname, 'screenshots');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

(async () => {
  const browser = await chromium.launch();
  for (const vp of viewports) {
    const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const page = await context.newPage();
    for (const p of pages) {
      const filePath = 'file://' + path.resolve(__dirname, p);
      await page.goto(filePath, { waitUntil: 'load' });
      await page.waitForTimeout(500);
      const nameWithoutExt = p.replace('.html', '');
      const fileName = `${nameWithoutExt}-${vp.device}.png`;
      await page.screenshot({ path: path.join(outputDir, fileName), fullPage: true });
      console.log(`[OK] Kaydedildi: ${fileName}`);
    }
    await context.close();
  }
  await browser.close();
  console.log('Tüm ekran görüntüleri başarıyla alındı!');
})();


// vize guncellemesi
