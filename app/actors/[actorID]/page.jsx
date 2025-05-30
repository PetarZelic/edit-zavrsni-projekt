import Image from "next/image";
import fetchAllCastCredits from "@/app/components/fetchAllCastCredits";
import FavoriteButton from "@/app/components/FavoriteButton";

export default async function ActorPage({ params }) {
  const actorID = params.actorID;

  let actor;
  try {
    const actorRes = await fetch(`https://api.tvmaze.com/people/${actorID}`);
    if (!actorRes.ok) throw new Error("Neuspješan fetch glumca");
    actor = await actorRes.json();
  } catch (error) {
    console.error("Greška pri dohvaćanju glumca:", error);
    return <div className="text-red-500 text-center mt-10">❌ Greška pri dohvaćanju glumca.</div>;
  }

  let rawCredits = [];
  try {
    rawCredits = await fetchAllCastCredits(actorID);
  } catch (error) {
    console.error("Greška pri dohvaćanju uloga:", error);
    return <div className="text-red-500 text-center mt-10">❌ Greška pri dohvaćanju uloga.</div>;
  }

  const rolesWithCharacter = await Promise.all(
    rawCredits.map(async (credit) => {
      try {
        const characterUrl = credit._links?.character?.href;
        if (!characterUrl) return null;

        const charRes = await fetch(characterUrl);
        if (!charRes.ok) return null;

        const character = await charRes.json();
        const show = credit._embedded?.show;

        return { show, character };
      } catch (error) {
        console.warn("Greška pri dohvaćanju karaktera:", error);
        return null;
      }
    })
  );

  const filteredRoles = rolesWithCharacter.filter(Boolean);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-10 text-center">
        {actor.image?.medium ? (
          <Image
            src={actor.image.medium}
            width={200}
            height={200}
            alt={actor.name}
            priority
            className="mx-auto border shadow"
          />
        ) : (
          <div className="w-[200px] h-[200px] bg-gray-200 mx-auto rounded" />
        )}
        <h1 className="text-3xl font-bold mt-4">{actor.name}</h1>
        <FavoriteButton
          item={{
            id: actor.id,
            name: actor.name,
            image: actor.image,
            type: "actor",
          }}
        />
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-6 border-b pb-2">🎭 Uloge</h2>

        {filteredRoles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {filteredRoles.map((role, index) => (
              <div
                key={`${role.show?.id || 's'}-${role.character?.id || 'c'}-${index}`}
                className="border p-4 rounded-md shadow hover:shadow-lg transition"
              >
                <h3 className="text-lg font-bold mb-1">{role.show?.name || "Nepoznata serija"}</h3>
                <p className="mb-2">
                  Uloga: <span className="italic text-[#AE445A]">{role.character?.name || "Nepoznat lik"}</span>
                </p>
                {role.character.image?.medium ? (
                  <Image
                    src={role.character.image.medium}
                    width={100}
                    height={100}
                    alt={role.character.name}
                    className="rounded-md"
                  />
                ) : (
                  <p className="italic">Nema slike za lika</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-700">Ovaj glumac trenutno nema dostupnih uloga.</p>
        )}
      </div>
    </div>
  );
}
