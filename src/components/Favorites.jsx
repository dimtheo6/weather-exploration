function Favorites({ favorites, onSelect }) {

  if (favorites.length === 0) return null;

  return (
    <div className="flex gap-2 overflow-x-auto rounded-xl bg-white p-2 shadow-lg">
      {favorites.map((place) => (
        <button
          key={`${place.lat},${place.lon}`}
          onClick={() => onSelect({ ...place, flyTo: true })}
          className="shrink-0 rounded-lg px-3 py-1 text-sm text-neutral-900 hover:bg-neutral-100"
        >
          ★ {place.name}
        </button>
      ))}
    </div>
  );
}

export default Favorites;
