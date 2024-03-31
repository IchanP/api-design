import { connectDB } from './src/config/mongoose.ts';
import { AnimeModel } from './src/models/Anime.ts';
import animeData from './anime-offline-database.json';
import 'dotenv/config';

console.log('Starting population');
await connectDB(process.env.RESOURCE_DB_CONNECTION_STRING as string);
const count = await AnimeModel.countDocuments({});
// Will only populate the database if it's empty.
if (count === 0) {
  console.log(`Populating database, we have ${(<Array<IAnime>>animeData).length} entries to add.`);
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
} else {
  console.log('Resource DB already populated, no action taken.');
}
console.log('something went wrong');
process.exit(0);
