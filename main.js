const { Actor } = require('apify');

Actor.main(async () => {
    const input = await Actor.getInput();
    const { email, password } = input;

    const browser = await Actor.launchPuppeteer();
    const page = await browser.newPage();

    try {
        // Otwórz stronę logowania
        await page.goto('https://singlekey-id.com/pl-pl/home', { waitUntil: 'networkidle2' });

        // Kliknij "Zaloguj się"
        await page.waitForSelector('button[data-testid="login-button"]', { timeout: 10000 });
        await page.click('button[data-testid="login-button"]');

        // Poczekaj na formularz logowania
        await page.waitForSelector('input[type="email"]', { timeout: 10000 });
        await page.type('input[type="email"]', email, { delay: 50 });

        await page.waitForSelector('input[type="password"]', { timeout: 10000 });
        await page.type('input[type="password"]', password, { delay: 50 });

        // Kliknij "Zaloguj się"
        await Promise.all([
            page.click('button[type="submit"]'),
            page.waitForNavigation({ waitUntil: 'networkidle2' }),
        ]);

        // Zapisz zrzut ekranu
        await page.screenshot({ path: 'logged-in.png' });
        await Actor.setValue('OUTPUT', { success: true, message: 'Zalogowano pomyślnie' });
    } catch (error) {
        console.error('Błąd logowania:', error.stack);
        await page.screenshot({ path: 'login-error.png' });
        await Actor.setValue('OUTPUT', { success: false, message: error.message });
        throw error;
    } finally {
        await browser.close();
    }
});