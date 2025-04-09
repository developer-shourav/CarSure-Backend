import { Server } from 'http';
import app from './app';
import config from './app/config';
import mongoose from 'mongoose';
import seedDefaultAdmin from './app/DB';

let server: Server;
const { port, database_url } = config;

async function main() {
  try {
    await mongoose.connect(database_url as string);
    /* -----After Starting Server Find default Admin if not Exist then create  */
    seedDefaultAdmin();

    server = app.listen(port, () => {
      console.log(`App is running on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
}

main();

// Handle unhandled promise rejections and exit the process (gracefully)
process.on('unhandledRejection', () => {
  console.log(
    '👻 UnhandledRejection is detected, exiting the server process...',
  );
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
});

// Handle uncaught exceptions and exit the process (gracefully)
process.on('uncaughtException', () => {
  console.log(
    '💀 UncaughtException is detected, exiting the server process...',
  );
  process.exit(1);
});
