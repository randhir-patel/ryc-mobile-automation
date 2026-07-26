export class BasePage {
    private readonly appId = process.env.ANDROID_APP_ID ?? 'com.recordyourcatch.app';

    async openApp() {
        await driver.activateApp(this.appId);
        await driver.waitUntil(async () => (await driver.getPageSource()).length > 0, {
            timeout: 20000,
            timeoutMsg: 'Android app did not finish launching.',
        });
    }

    async close() {
        await driver.terminateApp(this.appId);
    }

    async navigateTo(tab: string) {
        const tabElement = await $(`~${tab}`);
        await tabElement.waitForDisplayed({ timeout: 10000 });
        await tabElement.click();
    }

    async acceptAlert() {
        await driver.acceptAlert();
    }

    async dismissAlert() {
        await driver.dismissAlert();
    }

    async getAlertText(): Promise<string> {
        return await driver.getAlertText();
    }
}
