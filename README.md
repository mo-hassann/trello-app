![alt text](https://github.com/mo-hassann/my-portfolio/blob/master/public/projects-imgs/trello.png)

# Trello App

A Trello-inspired task management application built with Next.js, Prisma, Server Actions, and Auth.js. This app allows users to create boards, lists, and cards to organize tasks efficiently.

## ✨ Features

- **User Authentication**: Secure user authentication and session management using Auth.js.
- **Create Boards and Lists**: Users can create multiple boards and lists to organize their tasks.
- **Task Management**: Create, edit, delete, and move tasks (cards) within lists and across boards.
- **Real-time Updates**: Tasks and boards are updated in real-time using Server Actions.
- **Responsive Design**: Fully responsive design that works on all devices.

## 🛠️ Tech Stack

- **Next.js**: A React framework for building server-rendered and statically exported React applications.
- **Prisma**: A next-generation ORM for Node.js and TypeScript for database management.
- **Server Actions**: Next.js feature for server-side logic to handle data mutations and fetching.
- **Auth.js**: A library for handling user authentication in JavaScript applications.

## 📦 Getting Started

To get a local copy of this project up and running, follow these steps.

### Prerequisites

- **Node.js** (v16.x or higher)
- **npm** or **yarn** as your package manager
- **PostgreSQL** (or another supported SQL database)

### 🚀 Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/mo-hassann/trello-app.git
    cd trello-app
    ```

2. **Install dependencies:**

    Using npm:

    ```bash
    npm install
    ```

    Or using yarn:

    ```bash
    yarn install
    ```

3. **Set up environment variables:**

    Create a `.env` file in the root directory and add the following variables:

    ```env
    AUTH_TRUST_HOST=true
    DATABASE_URL=your_database_url
    AUTH_SECRET=any_random_secret
    ```

4. **Run Prisma migrations:**

    Ensure your database is running and then run:

    ```bash
    npx prisma migrate dev
    ```

5. **Start the development server:**

    Using npm:

    ```bash
    npm run dev
    ```

    Or using yarn:

    ```bash
    yarn dev
    ```

    Open [http://localhost:3000](http://localhost:3000) to view the app in your browser.

## 📖 Usage

### Running the app

- **Development mode:** `npm run dev` or `yarn dev`
- **Production mode:** `npm run build && npm start` or `yarn build && yarn start`

### Customization

To customize your Trello app:

1. **Update Styles**: Edit the CSS files in the `styles` folder to change the look and feel of the app.
2. **Modify Components**: Modify React components in the `components` folder to add new features or change existing ones.
3. **Update API Endpoints**: Update server actions in the `pages/api` directory to customize server-side logic.

## 🤝 Contributing

We welcome contributions to this project. To contribute:

1. **Fork the repository.**
2. **Create a new branch** (`git checkout -b feature/your-feature-name`).
3. **Make your changes** and commit them (`git commit -m 'Add some feature'`).
4. **Push to the branch** (`git push origin feature/your-feature-name`).
5. **Open a pull request**.

Please make sure to update tests as appropriate.

## 🐛 Issues

If you encounter any issues while using or setting up the project, please check the [Issues](https://github.com/mo-hassann/trello-app/issues) section to see if it has already been reported. If not, feel free to open a new issue detailing the problem.

When reporting an issue, please include:

- A clear and descriptive title.
- A detailed description of the problem.
- Steps to reproduce the issue.
- Any relevant logs or screenshots.
- The environment in which the issue occurs (OS, browser, Node.js version, etc.).

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.
