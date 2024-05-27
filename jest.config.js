export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'],
    moduleFileExtensions: ['ts', 'js', 'json', 'node'],
    moduleNameMapper: {
        "^(\\.{1,2}/.*)\\.js$": "$1",
    },
    extensionsToTreatAsEsm: [".ts"],
    transform: {
        "^.+\\.(mt|t|cj|j)s$": [
            "ts-jest",
            {
                "useESM": true
            }
        ]
    },
};
