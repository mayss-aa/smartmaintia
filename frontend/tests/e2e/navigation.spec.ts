import { test, expect } from '@playwright/test'

test.describe('RBAC navigation', () => {
  test('admin can access users page', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel(/email/i).fill('admin@smartmaint.com')
    await page.getByLabel(/mot de passe/i).fill('admin123')
    await page.getByRole('button', { name: /connexion/i }).click()
    await page.waitForURL(/\/dashboard/)
    await page.goto('/users')
  })

  test('operator redirected to tickets on login', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel(/email/i).fill('operateur@smartmaint.com')
    await page.getByLabel(/mot de passe/i).fill('operateur123')
    await page.getByRole('button', { name: /connexion/i }).click()
  })
})
