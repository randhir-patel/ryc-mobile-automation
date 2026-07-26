import { baseConfig, mergeCommonCapabilities } from './wdio.base.conf';

export const config: WebdriverIO.Config = {
    ...baseConfig,

    user: process.env.BROWSERSTACK_USERNAME,
    key: process.env.BROWSERSTACK_ACCESS_KEY,
    hostname: 'hub.browserstack.com',

    services: [
        [
            'browserstack',
            {
                buildIdentifier: '${BUILD_NUMBER}',
                app: process.env.BROWSERSTACK_ANDROID_APP_URL,
                browserstackLocal: false,
            },
        ],
    ],

    capabilities: [
        {
            platformName: 'Android',
            'appium:automationName': 'UiAutomator2',
            'bstack:options': {
                deviceName: 'Samsung Galaxy S24',
                osVersion: '14.0',
                realMobile: true,
            },
        },
        {
            platformName: 'Android',
            'appium:automationName': 'UiAutomator2',
            'bstack:options': {
                deviceName: 'Google Pixel 8 Pro',
                osVersion: '14.0',
                realMobile: true,
            },
        },
    ],

    maxInstances: 10,

    specs: ['../test/android/specs/**/*.spec.ts'],

    connectionRetryTimeout: 90000,
};

mergeCommonCapabilities(config, {
    'appium:options': {
        orientation: 'PORTRAIT',
    },
    'bstack:options': {
        projectName: 'Android Appium WDIO',
        buildName: 'browserstack build',
        sessionName: 'WDIO Appium Tests',
        debug: true,
        networkLogs: true,
    },
});
