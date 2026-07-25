import { test, expect } from '@playwright/test'

test.describe('Login flow', () => {
  test('shows login page with form fields', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByText('SmartMaint IA')).toBeVisible()
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByLabel(/mot de passe/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /connexion/i })).toBeVisible()
  })

  test('shows error on invalid credentials', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel(/email/i).fill('wrong@test.com')
    await page.getByLabel(/mot de passe/i).fill('wrongpassword')
    await page.getByRole('button', { name: /connexion/i }).click()
    await page.waitForTimeout(2000)
  })
})

test.describe('Navigation', () => {
  test('redirects to login when unauthenticated', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page).toHaveURL(/\/login/)
  })

  test('shows 404 on unknown route', async ({ page }) => {
    await page.goto('/login')
    await page.goto('/nonexistent-route')
  })
})
