"use client";
import { useState, useEffect } from "react";

export default function FavoriteButton({ item }) {
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    const checkFav = async () => {
      const res = await fetch("/api/favorites");
      const favs = await res.json();
      setIsFav(favs.some((f) => f.id === item.id && f.type === item.type));
    };
    if (item) checkFav();
  }, [item]);

  const toggleFavorite = async () => {
    if (!item) return;

    if (isFav) {
      await fetch("/api/favorites", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: item.id, type: item.type }),
      });
    } else {
      await fetch("/api/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(item),
      });
    }

    setIsFav(!isFav);
  };

  if (!item) return null;

  return (
    <button
      onClick={toggleFavorite}
      className={`mt-4 px-4 py-2 rounded text-white ${
        isFav ? "bg-red-500" : "bg-blue-500"
      }`}
    >
      {isFav ? "Ukloni iz favorita" : "Dodaj u favorite"}
    </button>
  );
}
