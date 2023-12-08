import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto(
    '/learn/2022/responsive-web-design/learn-html-by-building-a-cat-photo-app/step-2'
  );
});

test.describe('Editor Component', () => {
  test('Should be clicked and able to insert text', async ({ page }) => {
    const monacoEditor = page.getByLabel('Editor content');
    await monacoEditor.focus();
    await page.keyboard.insertText('<h2>FreeCodeCamp</h2>');
    const text = page.getByText('<h2>FreeCodeCamp</h2>');
    await expect(text).toBeVisible();
  });
});
