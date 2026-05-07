import { test, expect } from '@playwright/test'

test.describe('homepage', () => {
  test('carica e mostra le sezioni principali', async ({ page }) => {
    const consoleErrors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text())
    })

    const response = await page.goto('/')
    expect(response?.ok(), 'la home deve rispondere 2xx').toBeTruthy()

    // Title impostato in nuxt.config.ts
    await expect(page).toHaveTitle(/Qualeadfied/i)

    // Hero presente (può venire sia da CMS che da fallback i18n)
    await expect(page.locator('h1').first()).toBeVisible()

    // Nessun errore console fatale (filtra warn comuni di dev)
    const fatal = consoleErrors.filter(
      (e) => !/devtools|hydration|favicon/i.test(e)
    )
    expect(fatal, `errori console: ${fatal.join('\n')}`).toHaveLength(0)
  })
})
