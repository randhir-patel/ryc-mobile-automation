import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { baseConfig } from './wdio.base.conf';

const appsDir = join(process.cwd(), 'apps');
const apkFile = existsSync(appsDir)
    ? readdirSync(appsDir).find((file) => file.endsWith('.apk'))
    : undefined;
const androidUdid = process.env.ANDROID_UDID;
const noReset = process.env.APPIUM_NO_RESET === 'true';

if (!apkFile) {
    throw new Error(
        'No .apk found in ./apps. Place the Record Your Catch APK in the ./apps folder.',
    );
}

export const config: WebdriverIO.Config = {
    ...baseConfig,

    capabilities: [
        {
            platformName: 'Android',
            'wdio:maxInstances': 1,
            'appium:automationName': 'UiAutomator2',
            ...(androidUdid ? { 'appium:udid': androidUdid } : {}),
            'appium:app': join(appsDir, apkFile),
            'appium:orientation': 'PORTRAIT',
            'appium:autoGrantPermissions': true,
            'appium:ignoreHiddenApiPolicyError': true,
            'appium:noReset': noReset,
            'appium:newCommandTimeout': 240,
        },
    ],

    specs: ['../test/android/specs/**/*.spec.ts'],

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
                    log: './logs/appium.log',
                },
            },
        ],
    ],
};
