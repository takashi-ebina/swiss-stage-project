
# Contributing to swiss-stage-project

I appreciate your consideration to contribute to this project! This document is a guide to help make your contribution easier and more effective.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org)

    ```bash
    node --version
    v20.16.0
    ```

### Installation

1. Clone the repository

    ```bash
    git clone https://github.com/takashi-ebina/swiss-stage-project.git
    ```

2. Move to the directory and install dependencies

    ```bash
    cd swiss-stage-project
    npm install
    ```

### Development

- run the development server:

    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

- build:

    ```bash
    npm run build
    ```

- build electron:

    ```bash
    npm run electron:build
    ```

- run electron:

    ```bash
    npm run electron:dev
    ```

# Project Rules

## Branch Rules

### Central Repository

- main

### Develop Repository

- Branch Name
  - `prefix/#issueID`
- prefix
  - `feature`: Added functionality
  - `bugfix`: General bug fixes
  - `hotfix`: Prioritized bug fixes
  - `refactor`: refactoring
  - `documentation`: Documentation improvements or additions
  - `other`: others

## Commit Rules

### Commit Message

#### Prefix

- `feat`: a commit that adds new functionality.
- `fix`: a commit that fixes a bug.
- `docs`: a commit that adds or improves a documentation.
- `style`: changes that do not affect the meaning of the code.
- `refactor`: a code change that neither fixes a bug nor adds a feature.
- `perf`: a commit that improves performance, without functional changes.
- `test`: adding missing tests or correcting existing tests.
- `chore`: other changes that don't modify src or test files.

## Label Rules

### 0 系

The priority of the issue.

- 0.優先度 (高)
- 0.優先度 (中)
- 0.優先度 (低)

### 1 系

The type of issue.

- 1.feature
- 1.bugfix
- 1.hotfix
- 1.refactor
- 1.documentation
- 1.other

## Version Rules

Adopt Semantic Versioning.

```:txt
Major.Minor.Patch
```

- Major
  - Incompatible changes.
- Minor
  - Backwards compatible and adds functionality.
- Patch
  - Backwards compatible bug fixes.
