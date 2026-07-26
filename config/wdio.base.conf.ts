import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

const envPath = resolve(process.cwd(), '.env');
if (existsSync(envPath)) {
    process.loadEnvFile(envPath);
}

export const baseConfig: Partial<WebdriverIO.Config> = {
    logLevel: 'info',
    waitforTimeout: 20000,
    connectionRetryCount: 3,

    framework: 'mocha',
    mochaOpts: {
        ui: 'bdd',
        timeout: 120000,
    },

    reporters: [
        'spec',
        [
            'allure',
            {
                outputDir: 'allure-results',
                disableWebdriverStepsReporting: true,
                disableWebdriverScreenshotsReporting: false,
            },
        ],
    ],
};

export function mergeCommonCapabilities(
    config: WebdriverIO.Config,
    commonCaps: Record<string, any>,
): void {
    config.capabilities?.forEach((caps) => {
        const cap = caps as Record<string, any>;
        for (const [key, value] of Object.entries(commonCaps)) {
            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                cap[key] = {
                    ...(typeof cap[key] === 'object' &&
                    cap[key] !== null &&
                    !Array.isArray(cap[key])
                        ? cap[key]
                        : {}),
                    ...value,
                };
            } else {
                cap[key] = cap[key] ?? value;
            }
        }
    });
}
