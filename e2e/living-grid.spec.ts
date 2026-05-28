import { expect, test } from '@playwright/test';

function luminance([r, g, b]: number[]) {
  const values = [r, g, b].map((value) => {
    const normalized = value / 255;
    return normalized <= 0.03928 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
  });
  return values[0] * 0.2126 + values[1] * 0.7152 + values[2] * 0.0722;
}

function contrastRatio(foreground: number[], background: number[]) {
  const lighter = Math.max(luminance(foreground), luminance(background));
  const darker = Math.min(luminance(foreground), luminance(background));
  return (lighter + 0.05) / (darker + 0.05);
}

function rgbValues(color: string) {
  const matches = color.match(/\d+(?:\.\d+)?/g)?.slice(0, 3).map(Number);
  if (!matches || matches.length < 3) throw new Error(`Unsupported color: ${color}`);
  return matches;
}

test('50% scroll keeps contrast above 7:1 and triggers Living Grid data pulse', async ({ page }) => {
  await page.goto(process.env.PLAYWRIGHT_TARGET_URL ?? 'http://localhost:4173');
  await page.waitForLoadState('domcontentloaded');
  await expect(page.locator('.living-grid-backdrop')).toBeAttached();

  await page.evaluate(() => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: max * 0.5, behavior: 'instant' });
  });

  await page.waitForFunction(() => document.querySelector('.living-grid-backdrop')?.getAttribute('data-pulse-active') === 'true');

  const ratio = await page.evaluate(() => {
    const heading = document.querySelector('h1');
    if (!heading) return 0;
    const color = window.getComputedStyle(heading).color;
    return { color };
  });

  expect(contrastRatio(rgbValues(ratio.color), [18, 18, 18])).toBeGreaterThan(7);
});
