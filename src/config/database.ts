export default {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'root',
  database: 'miniweibo',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true,
};
