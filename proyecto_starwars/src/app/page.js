// src/app/page.js

// Esta función corre en el servidor (Server Component)
// Next puede hacer fetch directo acá sin useEffect ni estado del lado cliente.
async function getPeople() {
  const res = await fetch("https://www.swapi.tech/api/people?page=1&limit=10", {
    cache: "no-store", // así siempre trae data fresca en dev
  });

  if (!res.ok) {
    // si falla la API devolvemos array vacío así no rompe el render
    return [];
  }

  const data = await res.json();
  // data.results es un array con { name, uid, url }
  return data.results || [];
}

// Podemos pedir más info de cada personaje (altura, etc)
async function getPersonDetails(uid) {
  const res = await fetch(`https://www.swapi.tech/api/people/${uid}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return null;
  }

  const data = await res.json();
  // data.result.properties tiene toda la data posta
  return data.result?.properties || null;
}

export default async function Home() {
  // 1. Traigo la lista básica (nombres + uid)
  const peopleBasic = await getPeople();

  // 2. Para cada persona, pido detalles en paralelo
  const peopleFull = await Promise.all(
    peopleBasic.map(async (p) => {
      const details = await getPersonDetails(p.uid);
      return {
        id: p.uid,
        name: p.name,
        height: details?.height,
        mass: details?.mass,
        gender: details?.gender,
      };
    })
  );

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#000", // fondo negro estilo Star Wars
        color: "#fff",
        fontFamily: "system-ui, sans-serif",
        padding: "2rem",
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
        maxWidth: "900px",
        margin: "0 auto",
      }}
    >
      {/* HEADER */}
      <header style={{ textAlign: "center" }}>
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: "700",
            color: "#FFE81F", // amarillo Star Wars
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: "0.5rem",
          }}
        >
          Star Wars Database
        </h1>
        <p style={{ color: "#aaa", fontSize: "0.95rem", lineHeight: 1.4 }}>
          Datos del universo Star Wars consumidos en vivo desde{" "}
          <code style={{ color: "#fff", background: "#222", padding: "2px 4px", borderRadius: "4px" }}>
            swapi.tech
          </code>
        </p>
      </header>

      {/* LISTA DE PERSONAJES */}
      <section style={{ display: "grid", gap: "1rem" }}>
        {peopleFull.length === 0 ? (
          <div
            style={{
              backgroundColor: "#1a1a1a",
              border: "1px solid #333",
              borderRadius: "8px",
              padding: "1.5rem",
              textAlign: "center",
              color: "#999",
            }}
          >
            ⚠️ No se pudieron cargar los personajes.
          </div>
        ) : (
          peopleFull.map((person) => (
            <article
              key={person.id}
              style={{
                backgroundColor: "#0f0f0f",
                border: "1px solid #2a2a2a",
                borderRadius: "8px",
                padding: "1rem 1.25rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              {/* Nombre */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <h2
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: "600",
                    color: "#fff",
                    margin: 0,
                  }}
                >
                  {person.name}
                </h2>
                <span
                  style={{
                    fontSize: "0.7rem",
                    color: "#FFE81F",
                    backgroundColor: "#3a3a00",
                    padding: "2px 6px",
                    lineHeight: 1.4,
                    borderRadius: "4px",
                    textTransform: "uppercase",
                    fontWeight: "600",
                    letterSpacing: "0.05em",
                  }}
                >
                  #{person.id}
                </span>
              </div>

              {/* Datos físicos */}
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
                  gap: "0.5rem",
                  fontSize: "0.9rem",
                  color: "#ccc",
                }}
              >
                <li
                  style={{
                    backgroundColor: "#1a1a1a",
                    borderRadius: "4px",
                    padding: "0.5rem 0.75rem",
                    border: "1px solid #2a2a2a",
                  }}
                >
                  <div style={{ fontSize: "0.7rem", color: "#777", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Altura
                  </div>
                  <div style={{ fontWeight: "500", color: "#fff" }}>{person.height} cm</div>
                </li>

                <li
                  style={{
                    backgroundColor: "#1a1a1a",
                    borderRadius: "4px",
                    padding: "0.5rem 0.75rem",
                    border: "1px solid #2a2a2a",
                  }}
                >
                  <div style={{ fontSize: "0.7rem", color: "#777", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Peso
                  </div>
                  <div style={{ fontWeight: "500", color: "#fff" }}>{person.mass} kg</div>
                </li>

                <li
                  style={{
                    backgroundColor: "#1a1a1a",
                    borderRadius: "4px",
                    padding: "0.5rem 0.75rem",
                    border: "1px solid #2a2a2a",
                  }}
                >
                  <div style={{ fontSize: "0.7rem", color: "#777", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Género
                  </div>
                  <div style={{ fontWeight: "500", color: "#fff", textTransform: "capitalize" }}>
                    {person.gender}
                  </div>
                </li>
              </ul>
            </article>
          ))
        )}
      </section>

      {/* FOOTER CHIQUITO */}
      <footer
        style={{
          textAlign: "center",
          fontSize: "0.75rem",
          color: "#555",
          borderTop: "1px solid #222",
          paddingTop: "1rem",
          marginTop: "2rem",
        }}
      >
        <div>TP Programación con Nuevas Tecnologías II · ORT</div>
        <div style={{ color: "#666", marginTop: "0.25rem" }}>Hecho con Next.js + SWAPI</div>
      </footer>
    </main>
  );
}
