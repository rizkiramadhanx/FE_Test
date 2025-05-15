# 🚀 Frontend Boilerplate

A frontend boilerplate powered by **Vite**, **React 19**, **Mantine UI 8**, and modern libraries such as **React Hook Form**, **Zustand**, **TanStack Query**, and more. Designed to kickstart frontend projects with clean and efficient architecture.

---

## 📦 Tech Stack

| Category        | Technologies                                                                                                       |
| --------------- | ------------------------------------------------------------------------------------------------------------------ |
| Core            | [React 19](https://reactjs.org/), [Vite](https://vitejs.dev/)                                                      |
| Styling         | [Mantine](https://mantine.dev/), [@mantine/emotion](https://mantine.dev/emotion)                                   |
| State Mgmt      | [Zustand](https://zustand-demo.pmnd.rs/), [React Hook Form](https://react-hook-form.com/), [Zod](https://zod.dev/) |
| API Handling    | [Axios](https://axios-http.com/), [TanStack React Query](https://tanstack.com/query)                               |
| Routing         | [React Router v7](https://reactrouter.com/)                                                                        |
| Date Handling   | [Day.js](https://day.js.org/)                                                                                      |
| Icons           | [Lucide React](https://lucide.dev/), [React Icons](https://react-icons.github.io/react-icons/)                     |
| Form Validation | [Zod](https://zod.dev/), [@hookform/resolvers](https://react-hook-form.com/get-started#SchemaValidation)           |
| Notifications   | [@mantine/notifications](https://mantine.dev/others/notifications/)                                                |
| Linting         | ESLint, TypeScript ESLint, Import Plugin, React Hooks Plugin                                                       |

---

## ▶️ Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd frontend-boilerplate
```

### 2. Install dependencies

```bash
yarn
# or
npm install
```

### 3. Start the development server

```bash
yarn dev
# or
npm run dev
```

### 4. Build for production

```bash
yarn build
# or
npm run build
```

### 5. Preview the production build

```bash
yarn preview
# or
npm run preview
```

---

## 🗂️ Project Folder Structure

```
src/
│
├── assets/                # Static files (images, icons, etc.)
├── components/            # Reusable UI components (layout, molecules, pages)
├── enum/                  # Enum constants and route/action definitions
├── features/              # Modular feature-based structure
│   ├── authentication/    # Authentication feature
│   └── master-data/role/  # Role management feature
│       ├── components/    # Local components specific to role
│       ├── hooks/         # Hooks for fetching/mutating role data
│       └── type.ts        # Type definitions related to role
├── hooks/                 # Global hooks used across features
├── libs/                  # External libraries abstraction (axios, dayjs, query)
├── routes/                # Application routing configuration
├── store/                 # Zustand stores (global state management)
├── styles/                # Global CSS and Mantine theme configuration
├── utils/                 # Utility functions
├── App.tsx                # Main application component
└── main.tsx               # React app bootstrap file
```
