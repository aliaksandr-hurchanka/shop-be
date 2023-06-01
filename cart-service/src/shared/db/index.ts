const { PG_HOST, PG_PORT, PG_DATABASE, PG_USER, PG_PASSWORD } = process.env;

export const dbOptions = {
  user: 'postgres',
  host: 'cart-service-dev-postgresqlrdsinstance-5meqpkri3cnc.cwgnpywpdc9k.eu-west-1.rds.amazonaws.com',
  database: 'postgres',
  password: 'amihuh15',
  port: 5432,
};