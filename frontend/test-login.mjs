import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

page.on('console', msg => {
  console.log(`[BROWSER ${msg.type()}] ${msg.text()}`);
});

page.on('pageerror', err => {
  console.log(`[BROWSER ERROR] ${err.message}`);
});

page.on('request', request => {
  console.log(`[REQUEST] ${request.method()} ${request.url()}`);
});

page.on('response', response => {
  console.log(`[RESPONSE] ${response.status()} ${response.url()}`);
});

await page.goto('http://localhost:5174/login', { waitUntil: 'networkidle' });
console.log('--- PAGE LOADED ---');

// Wait for the form to render
await page.waitForSelector('form');
console.log('--- FORM FOUND ---');

// Fill the form
await page.fill('input[type="email"]', 'admin@example.com');
await page.fill('input[type="password"]', 'Admin123!');
console.log('--- FORM FILLED ---');

// Click the submit button
await page.click('button[type="submit"]');
console.log('--- BUTTON CLICKED ---');

// Wait a bit for any request
await page.waitForTimeout(5000);

// Check current URL
console.log(`--- CURRENT URL: ${page.url()} ---`);

await browser.close();
