// Script to build songs.json using Deezer API (no auth needed)
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Genres: rock | pop | hiphop | electro | rnb | francais
const SONGS_TO_SEARCH = [
  // 1950s
  { title: "Johnny B. Goode", artist: "Chuck Berry", year: 1958, genre: "rock" },
  { title: "Hound Dog", artist: "Elvis Presley", year: 1956, genre: "rock" },
  { title: "Great Balls of Fire", artist: "Jerry Lee Lewis", year: 1957, genre: "rock" },
  // 1960s
  { title: "Twist and Shout", artist: "The Beatles", year: 1963, genre: "rock" },
  { title: "My Generation", artist: "The Who", year: 1965, genre: "rock" },
  { title: "Hey Jude", artist: "The Beatles", year: 1968, genre: "rock" },
  { title: "Space Oddity", artist: "David Bowie", year: 1969, genre: "rock" },
  { title: "Good Vibrations", artist: "The Beach Boys", year: 1966, genre: "rock" },
  { title: "Respect", artist: "Aretha Franklin", year: 1967, genre: "rnb" },
  { title: "Purple Haze", artist: "Jimi Hendrix", year: 1967, genre: "rock" },
  { title: "Light My Fire", artist: "The Doors", year: 1967, genre: "rock" },
  // 1970s
  { title: "Let It Be", artist: "The Beatles", year: 1970, genre: "rock" },
  { title: "Brown Sugar", artist: "The Rolling Stones", year: 1971, genre: "rock" },
  { title: "Stairway to Heaven", artist: "Led Zeppelin", year: 1971, genre: "rock" },
  { title: "Superstition", artist: "Stevie Wonder", year: 1972, genre: "rnb" },
  { title: "Jolene", artist: "Dolly Parton", year: 1973, genre: "pop" },
  { title: "Bohemian Rhapsody", artist: "Queen", year: 1975, genre: "rock" },
  { title: "Somebody to Love", artist: "Queen", year: 1976, genre: "rock" },
  { title: "Hotel California", artist: "Eagles", year: 1977, genre: "rock" },
  { title: "We Will Rock You", artist: "Queen", year: 1977, genre: "rock" },
  { title: "Le Freak", artist: "Chic", year: 1978, genre: "electro" },
  { title: "I Will Survive", artist: "Gloria Gaynor", year: 1978, genre: "electro" },
  { title: "Roxanne", artist: "The Police", year: 1978, genre: "rock" },
  { title: "Heart of Glass", artist: "Blondie", year: 1978, genre: "pop" },
  { title: "Don't Stop Me Now", artist: "Queen", year: 1978, genre: "rock" },
  { title: "Ring My Bell", artist: "Anita Ward", year: 1979, genre: "electro" },
  // 1980s
  { title: "Another One Bites the Dust", artist: "Queen", year: 1980, genre: "rock" },
  { title: "Call Me", artist: "Blondie", year: 1980, genre: "pop" },
  { title: "Don't Stop Believin", artist: "Journey", year: 1981, genre: "rock" },
  { title: "Eye of the Tiger", artist: "Survivor", year: 1982, genre: "rock" },
  { title: "Billie Jean", artist: "Michael Jackson", year: 1982, genre: "pop" },
  { title: "Africa", artist: "Toto", year: 1982, genre: "rock" },
  { title: "Girls Just Want to Have Fun", artist: "Cyndi Lauper", year: 1983, genre: "pop" },
  { title: "True", artist: "Spandau Ballet", year: 1983, genre: "pop" },
  { title: "Total Eclipse of the Heart", artist: "Bonnie Tyler", year: 1983, genre: "pop" },
  { title: "Jump", artist: "Van Halen", year: 1984, genre: "rock" },
  { title: "Wake Me Up Before You Go-Go", artist: "Wham", year: 1984, genre: "pop" },
  { title: "Material Girl", artist: "Madonna", year: 1984, genre: "pop" },
  { title: "Holding Out for a Hero", artist: "Bonnie Tyler", year: 1984, genre: "pop" },
  { title: "Take On Me", artist: "a-ha", year: 1985, genre: "pop" },
  { title: "Everybody Wants to Rule the World", artist: "Tears for Fears", year: 1985, genre: "pop" },
  { title: "Don't You Forget About Me", artist: "Simple Minds", year: 1985, genre: "rock" },
  { title: "Running Up That Hill", artist: "Kate Bush", year: 1985, genre: "pop" },
  { title: "Living on a Prayer", artist: "Bon Jovi", year: 1986, genre: "rock" },
  { title: "Never Gonna Give You Up", artist: "Rick Astley", year: 1987, genre: "pop" },
  { title: "Sweet Child O Mine", artist: "Guns N Roses", year: 1987, genre: "rock" },
  { title: "La Bamba", artist: "Los Lobos", year: 1987, genre: "rock" },
  { title: "With or Without You", artist: "U2", year: 1987, genre: "rock" },
  { title: "Like a Prayer", artist: "Madonna", year: 1989, genre: "pop" },
  // 1990s
  { title: "Black or White", artist: "Michael Jackson", year: 1991, genre: "pop" },
  { title: "Smells Like Teen Spirit", artist: "Nirvana", year: 1991, genre: "rock" },
  { title: "November Rain", artist: "Guns N Roses", year: 1991, genre: "rock" },
  { title: "Losing My Religion", artist: "REM", year: 1991, genre: "rock" },
  { title: "Creep", artist: "Radiohead", year: 1992, genre: "rock" },
  { title: "Zombie", artist: "The Cranberries", year: 1994, genre: "rock" },
  { title: "Waterfalls", artist: "TLC", year: 1995, genre: "rnb" },
  { title: "Gangsta's Paradise", artist: "Coolio", year: 1995, genre: "hiphop" },
  { title: "Wannabe", artist: "Spice Girls", year: 1996, genre: "pop" },
  { title: "Around the World", artist: "Daft Punk", year: 1997, genre: "electro" },
  { title: "Iris", artist: "Goo Goo Dolls", year: 1998, genre: "rock" },
  { title: "Believe", artist: "Cher", year: 1998, genre: "pop" },
  { title: "La Tribu de Dana", artist: "Manau", year: 1998, genre: "francais" },
  { title: "All Star", artist: "Smash Mouth", year: 1999, genre: "rock" },
  { title: "Californication", artist: "Red Hot Chili Peppers", year: 1999, genre: "rock" },
  // 2000s
  { title: "One More Time", artist: "Daft Punk", year: 2000, genre: "electro" },
  { title: "Beautiful Day", artist: "U2", year: 2000, genre: "rock" },
  { title: "Lose Yourself", artist: "Eminem", year: 2002, genre: "hiphop" },
  { title: "Complicated", artist: "Avril Lavigne", year: 2002, genre: "rock" },
  { title: "In da Club", artist: "50 Cent", year: 2003, genre: "hiphop" },
  { title: "Crazy in Love", artist: "Beyonce", year: 2003, genre: "rnb" },
  { title: "Hey Ya", artist: "OutKast", year: 2003, genre: "hiphop" },
  { title: "Numb", artist: "Linkin Park", year: 2003, genre: "rock" },
  { title: "Mr Brightside", artist: "The Killers", year: 2003, genre: "rock" },
  { title: "Toxic", artist: "Britney Spears", year: 2003, genre: "pop" },
  { title: "Numb Encore", artist: "Jay-Z Linkin Park", year: 2004, genre: "hiphop" },
  { title: "Boulevard of Broken Dreams", artist: "Green Day", year: 2004, genre: "rock" },
  { title: "Since U Been Gone", artist: "Kelly Clarkson", year: 2004, genre: "pop" },
  { title: "Yeah!", artist: "Usher", year: 2004, genre: "rnb" },
  { title: "Crazy", artist: "Gnarls Barkley", year: 2006, genre: "rnb" },
  { title: "Hips Don't Lie", artist: "Shakira", year: 2006, genre: "pop" },
  { title: "Umbrella", artist: "Rihanna", year: 2007, genre: "pop" },
  { title: "Apologize", artist: "Timbaland", year: 2007, genre: "pop" },
  { title: "Poker Face", artist: "Lady Gaga", year: 2008, genre: "electro" },
  { title: "Single Ladies", artist: "Beyonce", year: 2008, genre: "rnb" },
  { title: "Just Dance", artist: "Lady Gaga", year: 2008, genre: "electro" },
  { title: "Viva la Vida", artist: "Coldplay", year: 2008, genre: "rock" },
  { title: "Use Somebody", artist: "Kings of Leon", year: 2008, genre: "rock" },
  { title: "Bad Romance", artist: "Lady Gaga", year: 2009, genre: "electro" },
  // 2010s
  { title: "Rolling in the Deep", artist: "Adele", year: 2010, genre: "pop" },
  { title: "Alors on danse", artist: "Stromae", year: 2010, genre: "francais" },
  { title: "Somebody That I Used to Know", artist: "Gotye", year: 2011, genre: "pop" },
  { title: "Gangnam Style", artist: "PSY", year: 2012, genre: "pop" },
  { title: "Call Me Maybe", artist: "Carly Rae Jepsen", year: 2012, genre: "pop" },
  { title: "Formidable", artist: "Stromae", year: 2013, genre: "francais" },
  { title: "Papaoutai", artist: "Stromae", year: 2013, genre: "francais" },
  { title: "Happy", artist: "Pharrell Williams", year: 2013, genre: "pop" },
  { title: "Get Lucky", artist: "Daft Punk", year: 2013, genre: "electro" },
  { title: "Uptown Funk", artist: "Mark Ronson Bruno Mars", year: 2014, genre: "rnb" },
  { title: "Stay With Me", artist: "Sam Smith", year: 2014, genre: "pop" },
  { title: "Shape of You", artist: "Ed Sheeran", year: 2017, genre: "pop" },
  { title: "Despacito", artist: "Luis Fonsi", year: 2017, genre: "pop" },
  { title: "Shallow", artist: "Lady Gaga", year: 2018, genre: "pop" },
  { title: "Blinding Lights", artist: "The Weeknd", year: 2019, genre: "pop" },
  { title: "Old Town Road", artist: "Lil Nas X", year: 2019, genre: "hiphop" },
  { title: "Bad Guy", artist: "Billie Eilish", year: 2019, genre: "pop" },
  { title: "Dance Monkey", artist: "Tones and I", year: 2019, genre: "pop" },
  // 2020s
  { title: "Bande organisee", artist: "Jul", year: 2020, genre: "francais" },
  { title: "Heat Waves", artist: "Glass Animals", year: 2020, genre: "rock" },
  { title: "Levitating", artist: "Dua Lipa", year: 2020, genre: "pop" },
  { title: "Peaches", artist: "Justin Bieber", year: 2021, genre: "pop" },
  { title: "As It Was", artist: "Harry Styles", year: 2022, genre: "pop" },
  { title: "Anti-Hero", artist: "Taylor Swift", year: 2022, genre: "pop" },
  { title: "Unholy", artist: "Sam Smith", year: 2022, genre: "pop" },
  { title: "Calm Down", artist: "Rema", year: 2022, genre: "rnb" },
  { title: "Flowers", artist: "Miley Cyrus", year: 2023, genre: "pop" },
  { title: "Vampire", artist: "Olivia Rodrigo", year: 2023, genre: "pop" },
  { title: "Paint The Town Red", artist: "Doja Cat", year: 2023, genre: "hiphop" },
  { title: "Espresso", artist: "Sabrina Carpenter", year: 2024, genre: "pop" },
  // French
  { title: "La Vie en rose", artist: "Edith Piaf", year: 1947, genre: "francais" },
  { title: "Avec le temps", artist: "Leo Ferre", year: 1971, genre: "francais" },
  { title: "Champs Elysees", artist: "Joe Dassin", year: 1970, genre: "francais" },
  { title: "Cruel Summer", artist: "Taylor Swift", year: 2019, genre: "pop" },
];

async function searchDeezer(title, artist) {
  const query = encodeURIComponent(`artist:"${artist}" track:"${title}"`);
  try {
    const res = await axios.get(`https://api.deezer.com/search?q=${query}&limit=5`);
    const tracks = res.data.data || [];
    // Prefer tracks with preview
    const withPreview = tracks.filter(t => t.preview);
    if (withPreview.length > 0) return withPreview[0];
    if (tracks.length > 0) return tracks[0];
    return null;
  } catch (e) {
    return null;
  }
}

async function main() {
  console.log(`Recherche de ${SONGS_TO_SEARCH.length} chansons sur Deezer...\n`);

  const results = [];
  let withPreview = 0;
  let notFound = 0;

  for (const song of SONGS_TO_SEARCH) {
    const track = await searchDeezer(song.title, song.artist);
    await new Promise(r => setTimeout(r, 250)); // rate limit

    if (!track) {
      console.log(`❌ Introuvable: ${song.title} — ${song.artist}`);
      notFound++;
      continue;
    }

    if (!track.preview) {
      console.log(`⚠️  Pas de preview: ${track.title} — ${track.artist.name}`);
      continue;
    }

    results.push({
      deezerId: track.id,
      title: track.title,
      artist: track.artist.name,
      year: song.year,
      genre: song.genre,
      previewUrl: track.preview,
    });
    withPreview++;
    console.log(`✅ [${song.genre}] ${track.title} — ${track.artist.name} (${song.year})`);
  }

  // Summary by genre
  const byGenre = {};
  results.forEach(s => { byGenre[s.genre] = (byGenre[s.genre] || 0) + 1; });
  console.log(`\n✅ Avec preview: ${withPreview}`);
  console.log(`❌ Introuvables: ${notFound}`);
  console.log('\nPar genre:');
  Object.entries(byGenre).sort().forEach(([g, n]) => console.log(`  ${g}: ${n}`));

  const output = path.join(__dirname, '../data/songs.json');
  fs.writeFileSync(output, JSON.stringify(results, null, 2));
  console.log(`\n✅ songs.json mis à jour avec ${results.length} chansons`);
}

main().catch(console.error);
