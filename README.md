# Project Generator

Project Generator is a command-line interface (CLI) tool written in TypeScript that helps developers quickly scaffold new projects with essential configurations and dependencies pre-installed and set up. It supports generating projects for different frameworks and databases, including linting, formatting, testing, and CI/CD pipelines.

## Utility

This tool simplifies project initialization by automating the setup of common development tools and best practices. Instead of manually configuring ESLint, Prettier, Jest, Husky, and database integrations, you can use this generator to create a fully configured project in minutes. It is particularly useful for teams looking to standardize project structures and enforce code quality from the start.

Currently supported project types:
- NestJS (fully implemented)
- Node.js (planned)
- TypeScript (planned)

Supported databases:
- PostgreSQL
- Oracle
- None (no database)

## Features

- **Interactive CLI**: Prompts for project name, type, and database via inquirer.
- **Common Tools Setup**:
  - Husky for Git hooks (pre-commit, pre-push, commit-msg).
  - CommitLint for conventional commit messages.
  - Prettier for code formatting.
  - ESLint for linting with TypeScript support.
  - EditorConfig for consistent editor settings.
  - GitIgnore configuration.
- **Framework-Specific Configurations**:
  - NestJS: Includes dependencies like @nestjs/config, @nestjs/terminus, nestjs-pino, class-transformer, class-validator, Helmet, and Compodoc for documentation.
  - Jest for unit testing with coverage and JUnit reporting.
  - Docker pipelines for containerization (with database-specific Dockerfiles).
- **Database Integration**: Automatic installation of TypeORM and database drivers based on selection.
- **Testing Framework**: Jest configured with TypeScript support, including mocks for file system and process operations.
- **CI/CD**: GitHub Actions workflow for automated testing on multiple Node.js versions.

## Installation

To install the tool globally on your system:

```shell
npm run install-project
```

This command installs dependencies, builds the project, and installs it globally as projectgen.

## Usage

After installation, run the CLI in an empty directory:

```shell
projectgen
```

The tool will:

    1. Display a welcome message.
    2. Check for an existing configuration file (projectGen.json):
        - If found, it updates the existing project.
        - If not, it prompts for:
            * Project name
            * Project type (from available options)
            * Database type
    3. Generate the project structure, install dependencies, and configure tools.
    4. Save the configuration for future updates.

Example output:

    1. Creates a new directory with the project name.
    2. Installs and configures all specified tools.
    3. Sets up Git hooks and scripts.

## Commands
The generated projects include the following npm scripts (defined in package.json):

```shell
    npm run build //Compiles TypeScript to JavaScript using tsc.
    npm run start //Runs the built application from dist/index.js.
    npm run test  //Runs Jest tests.
    npm run test:watch  //Runs Jest in watch mode.
    npm run test:cov //Runs Jest with coverage reporting.
    npm run format //Formats code using Prettier.
    npm run lint //Lints code using ESLint and fixes issues.
    npm run compodoc //Generates documentation using Compodoc (NestJS only).
```

## Testing system

The project uses Jest as the testing framework, configured in jest.config.js with TypeScript support via ts-jest. Tests are located in src/__tests__/ and cover key components:

    - ConfigService: Tests loading and saving configuration from/to projectGen.json.
    - CommonGenerator: Tests installation and configuration of common tools, including database dependencies.
    - NestGenerator: Tests NestJS-specific generation, including Docker pipeline setup.

Key testing features:
    - Mocks for fs and child_process.execSync to avoid real file system or process interactions.
    - Coverage thresholds set to 80% for branches, functions, lines, and statements.
    - JUnit reporting for CI integration.
    - Excludes the CLI entry point (src/index.ts) from coverage.

The CI pipeline in .github/workflows/test.yml runs tests on Node.js versions 18.x, 20.x, and 22.x using Yarn.

## Contributing
Contributions are welcome. Please ensure tests pass and follow the established code style (ESLint and Prettier). Use conventional commits for pull requests.

## License
This project is licensed under the MIT License. See LICENSE for details. ``````