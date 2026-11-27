// Fictional reference identities. Player display names are independent.
export const avatarIdentities=Object.freeze([
  {
    "id": "01",
    "name": "Luca",
    "origin": "Bologna, Italia",
    "bio": "Socievole e ironico. Ti convince a fare l’ultima serie e poi resta ad aiutarti."
  },
  {
    "id": "02",
    "name": "Noah",
    "origin": "Rotterdam, Paesi Bassi",
    "bio": "Carismatico e competitivo. Trasforma ogni piccolo progresso in una vittoria da festeggiare."
  },
  {
    "id": "03",
    "name": "Diego",
    "origin": "Valencia, Spagna",
    "bio": "Curioso e istintivo. Prova tutto, fa domande e perde regolarmente il conto delle ripetizioni."
  },
  {
    "id": "04",
    "name": "Erik",
    "origin": "Göteborg, Svezia",
    "bio": "Tranquillo e metodico. Parla poco, tiene un diario impeccabile e presta sempre i dischi."
  },
  {
    "id": "05",
    "name": "Finn",
    "origin": "Cork, Irlanda",
    "bio": "Battuta pronta e spirito di squadra. Si lamenta del giorno gambe, ma non lo salta mai."
  },
  {
    "id": "06",
    "name": "Amara",
    "origin": "Lione, Francia",
    "bio": "Determinata e diretta. Sa incoraggiarti, ma sa anche dirti quando è ora di recuperare."
  },
  {
    "id": "07",
    "name": "Elena",
    "origin": "Praga, Repubblica Ceca",
    "bio": "Precisa e indipendente. Ama padroneggiare un movimento prima di aumentare il carico."
  },
  {
    "id": "08",
    "name": "Sofia",
    "origin": "Porto, Portogallo",
    "bio": "Solare e versatile. Alterna ferro e cardio e trova sempre qualcuno con cui allenarsi."
  },
  {
    "id": "09",
    "name": "Nadia",
    "origin": "Torino, Italia",
    "bio": "Riservata, con un umorismo asciutto. Arriva con un piano e affronta un obiettivo alla volta."
  },
  {
    "id": "10",
    "name": "Freya",
    "origin": "Edimburgo, Scozia",
    "bio": "Energica e avventurosa. Ama le sfide personali e considera anche un piccolo miglioramento una conquista."
  }
].map(person=>Object.freeze(person)));
export function avatarIdentity(id){return avatarIdentities.find(person=>person.id===id)||avatarIdentities[0];}
