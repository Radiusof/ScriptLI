module.exports = async () => {
    return {
        moduleFileExtensions: ['js','json','ts'],
        rootDir: 'src',
        testRegex: '.*\\.spec\\.ts$',
        transform : {
            '^.+\\.(t|j)s$': 'ts-jest',
        },
        reporters: ['default', 'jest-junit'],
        collectCoverageFrom: [
            '**/*.(t|j)s',
            '!**/main.(t|j)s',
            '!**/routes.(t|j)s',
            '!**/*.module.(t|j)s',
            '!**/*.entity.(t|j)s',
            '!**/*.dto.(t|j)s',
        ],
        coverageDirectory: '../coverage',
        testEnvironment: 'node',
        coverageThreshold: {
            global:{
                branches: 80,
                functions: 80,
                lines: 80,
                statement: 80,
            },
        },
    };
}