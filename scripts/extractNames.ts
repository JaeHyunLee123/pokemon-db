import { PrismaClient } from '../src/generated/prisma/index.js';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('Fetching pokemon names from DB...');
  
  // Fetch all pokemon names ordered by ID
  const pokemons = await prisma.pokemon.findMany({
    select: { name: true },
    orderBy: { id: 'asc' },
  });
  
  const names = pokemons.map((p: { name: string }) => p.name);
  
  const dirPath = path.join(process.cwd(), 'src', 'constants');
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  
  const filePath = path.join(dirPath, 'pokemonNames.json');
  fs.writeFileSync(filePath, JSON.stringify(names, null, 2), 'utf-8');
  
  console.log(`Successfully extracted ${names.length} pokemon names to ${filePath}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
