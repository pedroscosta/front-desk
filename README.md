# Front Desk

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/yourusername/front-desk/pulls)

Front Desk is an open-source customer support platform designed to allow you to help your customers wherever they are. Built with design as a first-class citizen, it provides a seamless and super fast experience.

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- Docker (for local development)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/front-desk.git
   cd front-desk
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   ```bash
   cp apps/api/.env.local.example apps/api/.env.local
   ```
   Update the environment variables with your configuration.

4. Start the development servers:
   ```bash
   pnpm dev
   ```

## Project Structure

This project is built with a monorepo structure, using Turborepo and pnpm. Here are the overview of the structure:

```
front-desk/
├── apps/
│   ├── api/         # Backend API (NestJS)
│   └── web/         # Frontend (React + Vite)
├── packages/
│   └── ui/          # Shared UI components
└── docker-compose.yaml
```

## Contributing

Contributions are welcome! We don't have a contributing guide yet, but please open an issue or submit a pull request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: Add amazing feature'`)
4. Push to the branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.