import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { baseConfig } from './wdio.base.conf';

const appsDir = join(process.cwd(), 'apps');
const ipaFile = existsSync(appsDir)
    ? readdirSync(appsDir).find((file) => file.endsWith('.ipa'))
    : undefined;
const iosDeviceName = process.env.IOS_DEVICE_NAME ?? 'iPhone 16';
const iosPlatformVersion = process.env.IOS_PLATFORM_VERSION ?? '18.0';
const iosUdid = process.env.IOS_UDID;
const noReset = process.env.APPIUM_NO_RESET === 'true';

if (!ipaFile) {
    throw new Error(
        'No .ipa found in ./apps. Place the Record Your Catch IPA in the ./apps folder.',
    );
}

export const config: WebdriverIO.Config = {
    ...baseConfig,

    capabilities: [
        {
            platformName: 'iOS',
            'wdio:maxInstances': 1,
            'appium:automationName': 'XCUITest',
            'appium:deviceName': iosDeviceName,
            'appium:platformVersion': iosPlatformVersion,
            ...(iosUdid ? { 'appium:udid': iosUdid } : {}),
            'appium:app': join(appsDir, ipaFile),
            'appium:orientation': 'PORTRAIT',
            'appium:autoAcceptAlerts': true,
            'appium:noReset': noReset,
            'appium:newCommandTimeout': 240,
        },
    ],

    specs: ['../test/ios/specs/**/*.spec.ts'],

    runner: 'local',
    bail: 0,
    connectionRetryTimeout: 120000,

    services: [
        [
            'appium',
            {
                command: 'appium',
                args: {
                    relaxedSecurity: true,
                    log: './logs/appium-ios.log',
                },
            },
        ],
    ],
};
