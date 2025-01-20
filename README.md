
### 1. Install Dependencies

```bash
npm install
```

or, if you're using Yarn:

```bash
yarn install
```

### 2. Start the Development Server

```bash
npm start
```

or, with Yarn:

```bash
yarn start
```

This command will start the development server and open the project in your default web browser. By default, the application runs on [http://localhost:5173](http://localhost:5173).

### 3. Build the Project for Production

If you need to build the project for production:

```bash
npm run build
```

or, with Yarn:

```bash
yarn build
```

The production-ready files will be generated in the `build` directory.

## Project Structure

Here is a basic overview of the project structure:

```
project-root/
├── public/        # Static assets (index.html, images, etc.)
├── src/           # Application source code
│   ├── App.tsx     # Main application component
│   └── main.tsx    # Entry point for the app
│   └── NewOrders    # New Orders Page
├── package.json   # Project configuration and dependencies
└── README.md      # Project documentation
```
