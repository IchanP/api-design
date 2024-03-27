export function stripAnime (anime: IAnime): MinimizedAnime {
  return {
    animeId: anime.animeId,
    title: anime.title,
    type: anime.type,
    links: [] as LinkStructure[]
  };
}
