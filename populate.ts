import { connectDB } from './src/config/mongoose.ts';
import { AnimeModel } from './src/models/Anime.ts';
import animeData from './anime-offline-database.json';
import 'dotenv/config';
await connectDB(process.env.RESOURCE_DB_CONNECTION_STRING as string);
console.log(`Populating database, we have ${animeData.length} entries to add.`);
for (const anime of animeData as Array<IAnime>) {
  const newAnime = new AnimeModel({
    title: anime.title,
    type: anime.type,
    episodes: anime.episodes,
    status: anime.status,
    animeSeason: anime.animeSeason,
    synonyms: anime.synonyms,
    relatedAnime: anime.relatedAnime,
    tags: anime.tags,
    broadcast: anime.broadcast
  });
  await newAnime.save();
}
console.log('Resource DB fully populated.');
process.exit(0);
