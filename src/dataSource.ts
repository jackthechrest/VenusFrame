import 'reflect-metadata';
import { DataSource, EntitySchema } from 'typeorm';
import glob from 'glob';
import { promisify } from 'util';

// This is a wonderfully hideous little hack to get dynamic entity module
// loading working properly on Windows.
async function loadEntities(): Promise<EntitySchema<unknown>[]> {
  const globPromise = promisify(glob);
  const globs = await globPromise('dist/entities/*.js');
  const entityFilePaths = globs.map((entity) => entity.replace('dist/', './'));
  const entityImports = entityFilePaths.map((entityFilePath) => import(entityFilePath));
  const entityModules = await Promise.all(entityImports);
  const entities = entityModules.map((entity) => entity[Object.keys(entity)[0]]);
  return entities;
}

export const AppDataSource = new DataSource({
  synchronize: true,
  logging: false,
  entities: await loadEntities(),
  type: 'sqlite',
  database: process.env.DATABASE_NAME ?? 'You Forgot to set DATABASE_NAME in .env',
});

await AppDataSource.initialize();
