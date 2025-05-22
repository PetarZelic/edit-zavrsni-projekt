import EpisodeListClient from './EpisodeListClient';

export default async function EpisodeList({ showID }) {
  try {
    const seasonRes = await fetch(`https://api.tvmaze.com/shows/${showID}/seasons`, {
      cache: 'no-store',
    });

    if (!seasonRes.ok) throw new Error("Failed to fetch seasons");

    const seasonData = await seasonRes.json();
    console.log("Sezone dohvacene:", seasonData.length);

    const seasonsWithEpisodes = await Promise.all(
      seasonData.map(async (season) => {
        if (!season.id) {
          console.warn("Season bez ID-a:", season);
          return null;
        }

        try {
          const epRes = await fetch(`https://api.tvmaze.com/seasons/${season.id}/episodes`, {
            cache: 'no-store',
          });

          if (!epRes.ok) {
            console.warn(`Neuspješan dohvat epizoda za sezonu ${season.id}`);
            return null;
          }

          const episodes = await epRes.json();
          return { ...season, episodes };
        } catch (err) {
          console.warn(`Greška pri dohvaćanju epizoda za sezonu ${season.id}:`, err);
          return null;
        }
      })
    );

    const validSeasons = seasonsWithEpisodes.filter(Boolean);

    return <EpisodeListClient seasons={validSeasons} />;
  } catch (error) {
    console.error("Fetch error:", error);
    return <p>Greška pri dohvaćanju podataka.</p>;
  }
}
