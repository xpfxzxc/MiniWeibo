export = [
  {
    type: process.env.TYPEORM_DB_TYPE,
    host: process.env.TYPEORM_HOST,
    port: parseInt(process.env.TYPEORM_PORT),
    username: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/../migrations/*.ts'],
    cli: {
      migrationsDir: __dirname + '/../migrations',
    },
  },
  {
    name: 'seed',
    type: process.env.TYPEORM_CONNECTION,
    host: process.env.TYPEORM_HOST,
    port: parseInt(process.env.TYPEORM_PORT),
    username: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    migrationsTableName: 'seeds',
    migrations: [__dirname + '/../seeds/*.ts'],
    cli: {
      migrationsDir: __dirname + '/../seeds',
    },
  },
];
