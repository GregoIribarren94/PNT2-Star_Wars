import CharacterList from "./components/CharacterList/CharacterList";

export const metadata = {
  title: "Batalla",
};

export default async function Page() {
  const res = await fetch('https://swapi.info/api/people/', { cache: 'no-cache'});
  const data = await res.json();
  
  const personajes = data.results.map((p) => {
    return {
      id: 1,
      name: p.name,
      image: `https://vieraboschkova.github.io/swapi-gallery/static/assets/img/people/1.jpg`,
      data: {
        altura: p.height,
        peso: p.mass,
        genero: p.gender,
      },
    };
  });

  return <CharacterList personajes={personajes} />;
}
