import { test, expect } from '@playwright/test'

const TEST_EMAIL = 'test@qualeadfied.com'
const TEST_PASSWORD = 'Passw0rd!'

test.describe('client auth', () => {
  test('login client redirige a /dashboard', async ({ page }) => {
    await page.goto('/login')

    // Form fields (label-based selectors; resistenti a id wrapper PrimeVue)
    await page.getByLabel(/email/i).fill(TEST_EMAIL)
    // Il password field è un PrimePassword (toggleMask) → input[autocomplete="current-password"]
    await page.locator('input[autocomplete="current-password"]').fill(TEST_PASSWORD)

    await page.getByRole('button', { name: /accedi/i }).click()

    // Attendi redirect alla dashboard client
    await page.waitForURL('**/dashboard', { timeout: 15_000 })
    await expect(page).toHaveURL(/\/dashboard$/)

    // Verifica che il token sia stato salvato (auth_token nello store/auth.ts)
    const token = await page.evaluate(() => localStorage.getItem('auth_token'))
    expect(token, 'auth_token in localStorage dopo login').toBeTruthy()
  })
})
