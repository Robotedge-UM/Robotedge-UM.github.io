# Robotedge - AI Robotics Lab Website

Welcome to the official website of Robotedge, the AI Robotics Lab at Universiti Malaya.

## About Robotedge

Robotedge is the AI Robotics Lab of Universiti Malaya, led by Dr. Zati Hakim Azizul Hasan. We specialize in service robotics and humanoid soccer, advancing ethical robotics guided by our EDGE principles: Ethics, Diversity, Green technology, and Engagement with society.

## Our Achievements

- 🥇 **RoboCup Malaysia 2025** - 1st Place (@Home)
- 🥇 **RoboCup Malaysia 2024** - 1st Place (@Home & @HomeEDU)
- 🥈 **RoboCup Thailand 2022** - 2nd Place (@Home)
- 🥈 **RCAP Chongqing Invitational 2025** - 2nd Place (5v5 Humanoid Soccer)

## Research Areas

- **Service Robotics**: Autonomous robots for domestic and professional applications
- **Computer Vision**: Advanced visual perception systems for robotics
- **Speech Recognition**: Natural language processing and voice interaction
- **Humanoid Robotics**: Bipedal locomotion and human-like robot behaviors

## Technology Stack

This website is built with:

- **Next.js 15** - React framework for production
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Prisma** - Next-generation ORM for database management
- **PostgreSQL** - Robust relational database
- **Docker** - Containerization for deployment

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- Docker and Docker Compose (for database)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/Robotedge-UM/Robotedge-UM.github.io.git
cd Robotedge-UM.github.io
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

4. Start the database:

```bash
docker-compose up -d db
```

5. Set up the database:

```bash
pnpm db:push
pnpm db:seed
```

6. Start the development server:

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the website.

## Project Structure

```
src/
├── app/                 # Next.js app router pages
├── components/          # Reusable React components
│   ├── sections/       # Website sections (Hero, About, etc.)
│   ├── navigation/     # Navigation components
│   ├── layouts/        # Layout components
│   └── ui/            # UI components
├── lib/                # Utility functions and configurations
└── types/              # TypeScript type definitions

public/                 # Static assets (images, icons)
prisma/                # Database schema and migrations
```

## Deployment

The website is automatically deployed to GitHub Pages when changes are pushed to the main branch.

For manual deployment:

```bash
pnpm build
pnpm start
```

## Contributing

We welcome contributions from the community! Please read our contributing guidelines and submit pull requests for any improvements.

## Contact

- **Email**: umrobotedge@gmail.com
- **Academic Supervisor**: Dr. Zati Hakim Azizul Hasan (zati@um.edu.my)
- **Location**: Faculty of Computer Science and Information Technology, Universiti Malaya

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

© 2025 Robotedge - Universiti Malaya. All rights reserved.
