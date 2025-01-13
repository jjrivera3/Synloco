# SynLoco

SynLoco is a versatile full-stack project management platform inspired by Jira. Designed to cater to agile and traditional teams, SynLoco streamlines workflows with a range of powerful features, all presented through an intuitive and customizable interface.

## Features

- **Kanban Boards**: Visualize workflows and manage tasks effortlessly.
- **Sprint Planning**: Plan and track sprints to enhance team productivity.
- **Time Tracking**: Keep track of project timelines and team efforts.
- **Reporting**: Gain insights with comprehensive, data-driven reports.
- **Team Collaboration**: Communicate effectively and collaborate seamlessly.
- **Customizable Workflows**: Tailor the platform to fit your team's needs.

## Tech Stack

- **Frontend**: React, Next.js, Tailwind CSS, Shadcn
- **Backend**: Prisma, Neon DB
- **Authentication**: Clerk Authentication

## Installation

Follow these steps to set up SynLoco locally:

1. **Clone the Repository:**

   ```bash
   git clone <repository_url>
   cd synloco
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory and add your database and Clerk credentials:

   ```env
   DATABASE_URL=your_neon_db_url
   CLERK_FRONTEND_API=your_clerk_frontend_api
   CLERK_API_KEY=your_clerk_api_key
   ```

4. **Run Database Migrations:**

   ```bash
   npx prisma migrate dev
   ```

5. **Start the Development Server:**

   ```bash
   npm run dev
   ```

6. **Access the Application:**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

- Log in using Clerk Authentication.
- Create projects, sprints, and tasks using the intuitive interface.
- Drag and drop tasks across the Kanban board to manage workflows.
- Use reporting tools to analyze project progress and team performance.

## Contributing

Contributions are welcome! Follow these steps to contribute:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Commit your changes and push them to your branch.
4. Open a pull request describing your changes.

## Acknowledgments

- Inspired by Jira and similar project management tools.
- Built with modern technologies like React, Next.js, and Tailwind CSS.
