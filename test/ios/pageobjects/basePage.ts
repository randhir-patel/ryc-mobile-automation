export class BasePage {
    private readonly bundleId = process.env.IOS_BUNDLE_ID ?? 'com.recordyourcatch.app';

    async openApp() {
        await driver.activateApp(this.bundleId);
        await driver.waitUntil(async () => (await driver.getPageSource()).length > 0, {
            timeout: 20000,
            timeoutMsg: 'iOS app did not finish launching.',
        });
    }

    async close() {
        await driver.terminateApp(this.bundleId);
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
