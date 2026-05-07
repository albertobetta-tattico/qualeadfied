import { test, expect } from '@playwright/test'

const ADMIN_EMAIL = 'admin@qualeadfied.com'
const ADMIN_PASSWORD = 'Passw0rd!'

test.describe('admin auth', () => {
  test('login admin redirige a /admin', async ({ page }) => {
    await page.goto('/admin/login')

    await page.getByLabel(/email/i).fill(ADMIN_EMAIL)
    await page.locator('input[autocomplete="current-password"]').fill(ADMIN_PASSWORD)

    await page.getByRole('button', { name: /accedi/i }).click()

    // Attendi redirect alla dashboard admin (non al /login né altrove)
    await page.waitForURL((url) => /\/admin\/?$/.test(url.pathname), { timeout: 15_000 })
    await expect(page).toHaveURL(/\/admin\/?$/)

    // Verifica admin_token (vedi stores/adminAuth.ts)
    const token = await page.evaluate(() => localStorage.getItem('admin_token'))
    expect(token, 'admin_token in localStorage dopo login').toBeTruthy()
  })
})
