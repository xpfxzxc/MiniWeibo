export = [
  {
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'root',
    database: 'miniweibo',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/../migrations/*.ts'],
    cli: {
      migrationsDir: __dirname + '/../migrations',
    },
  },
  {
    name: 'seed',
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'root',
    database: 'miniweibo',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    migrationsTableName: 'seeds',
    migrations: [__dirname + '/../seeds/*.ts'],
    cli: {
      migrationsDir: __dirname + '/../seeds',
    },
  },
];
