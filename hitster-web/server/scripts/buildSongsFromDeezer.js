// Script to build songs.json using Deezer API (no auth needed)
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const SONGS_TO_SEARCH = [
  { title: "Twist and Shout", artist: "The Beatles", year: 1963 },
  { title: "My Generation", artist: "The Who", year: 1965 },
  { title: "Hey Jude", artist: "The Beatles", year: 1968 },
  { title: "Space Oddity", artist: "David Bowie", year: 1969 },
  { title: "Let It Be", artist: "The Beatles", year: 1970 },
  { title: "Brown Sugar", artist: "The Rolling Stones", year: 1971 },
  { title: "Stairway to Heaven", artist: "Led Zeppelin", year: 1971 },
  { title: "Superstition", artist: "Stevie Wonder", year: 1972 },
  { title: "Jolene", artist: "Dolly Parton", year: 1973 },
  { title: "Bohemian Rhapsody", artist: "Queen", year: 1975 },
  { title: "Hotel California", artist: "Eagles", year: 1977 },
  { title: "Le Freak", artist: "Chic", year: 1978 },
  { title: "I Will Survive", artist: "Gloria Gaynor", year: 1978 },
  { title: "Roxanne", artist: "The Police", year: 1978 },
  { title: "Heart of Glass", artist: "Blondie", year: 1978 },
  { title: "Ring My Bell", artist: "Anita Ward", year: 1979 },
  { title: "Another One Bites the Dust", artist: "Queen", year: 1980 },
  { title: "Don't Stop Believin", artist: "Journey", year: 1981 },
  { title: "Tainted Love", artist: "Soft Cell", year: 1981 },
  { title: "Eye of the Tiger", artist: "Survivor", year: 1982 },
  { title: "Billie Jean", artist: "Michael Jackson", year: 1982 },
  { title: "Africa", artist: "Toto", year: 1982 },
  { title: "Girls Just Want to Have Fun", artist: "Cyndi Lauper", year: 1983 },
  { title: "True", artist: "Spandau Ballet", year: 1983 },
  { title: "Total Eclipse of the Heart", artist: "Bonnie Tyler", year: 1983 },
  { title: "Jump", artist: "Van Halen", year: 1984 },
  { title: "Wake Me Up Before You Go-Go", artist: "Wham", year: 1984 },
  { title: "Material Girl", artist: "Madonna", year: 1984 },
  { title: "Holding Out for a Hero", artist: "Bonnie Tyler", year: 1984 },
  { title: "Take On Me", artist: "a-ha", year: 1985 },
  { title: "Everybody Wants to Rule the World", artist: "Tears for Fears", year: 1985 },
  { title: "Don't You Forget About Me", artist: "Simple Minds", year: 1985 },
  { title: "Living on a Prayer", artist: "Bon Jovi", year: 1986 },
  { title: "Never Gonna Give You Up", artist: "Rick Astley", year: 1987 },
  { title: "Sweet Child O Mine", artist: "Guns N Roses", year: 1987 },
  { title: "La Bamba", artist: "Los Lobos", year: 1987 },
  { title: "With or Without You", artist: "U2", year: 1987 },
  { title: "Like a Prayer", artist: "Madonna", year: 1989 },
  { title: "Black or White", artist: "Michael Jackson", year: 1991 },
  { title: "Smells Like Teen Spirit", artist: "Nirvana", year: 1991 },
  { title: "November Rain", artist: "Guns N Roses", year: 1991 },
  { title: "Losing My Religion", artist: "REM", year: 1991 },
  { title: "Creep", artist: "Radiohead", year: 1992 },
  { title: "Zombie", artist: "The Cranberries", year: 1994 },
  { title: "Waterfalls", artist: "TLC", year: 1995 },
  { title: "Gangsta's Paradise", artist: "Coolio", year: 1995 },
  { title: "Wannabe", artist: "Spice Girls", year: 1996 },
  { title: "Around the World", artist: "Daft Punk", year: 1997 },
  { title: "Iris", artist: "Goo Goo Dolls", year: 1998 },
  { title: "Believe", artist: "Cher", year: 1998 },
  { title: "All Star", artist: "Smash Mouth", year: 1999 },
  { title: "Californication", artist: "Red Hot Chili Peppers", year: 1999 },
  { title: "One More Time", artist: "Daft Punk", year: 2000 },
  { title: "Beautiful Day", artist: "U2", year: 2000 },
  { title: "Champs Elysees", artist: "Joe Dassin", year: 1970 },
  { title: "Lose Yourself", artist: "Eminem", year: 2002 },
  { title: "Complicated", artist: "Avril Lavigne", year: 2002 },
  { title: "In da Club", artist: "50 Cent", year: 2003 },
  { title: "Crazy in Love", artist: "Beyonce", year: 2003 },
  { title: "Hey Ya", artist: "OutKast", year: 2003 },
  { title: "Numb", artist: "Linkin Park", year: 2003 },
  { title: "Mr Brightside", artist: "The Killers", year: 2003 },
  { title: "Toxic", artist: "Britney Spears", year: 2003 },
  { title: "Umbrella", artist: "Rihanna", year: 2007 },
  { title: "Poker Face", artist: "Lady Gaga", year: 2008 },
  { title: "Rolling in the Deep", artist: "Adele", year: 2010 },
  { title: "Alors on danse", artist: "Stromae", year: 2010 },
  { title: "Somebody That I Used to Know", artist: "Gotye", year: 2011 },
  { title: "Gangnam Style", artist: "PSY", year: 2012 },
  { title: "Formidable", artist: "Stromae", year: 2013 },
  { title: "Papaoutai", artist: "Stromae", year: 2013 },
  { title: "Happy", artist: "Pharrell Williams", year: 2013 },
  { title: "Get Lucky", artist: "Daft Punk", year: 2013 },
  { title: "Uptown Funk", artist: "Mark Ronson Bruno Mars", year: 2014 },
  { title: "Shape of You", artist: "Ed Sheeran", year: 2017 },
  { title: "Blinding Lights", artist: "The Weeknd", year: 2019 },
  { title: "Old Town Road", artist: "Lil Nas X", year: 2019 },
  { title: "Bad Guy", artist: "Billie Eilish", year: 2019 },
  { title: "Dance Monkey", artist: "Tones and I", year: 2019 },
  { title: "Bande organisee", artist: "Jul", year: 2020 },
  { title: "As It Was", artist: "Harry Styles", year: 2022 },
  { title: "Anti-Hero", artist: "Taylor Swift", year: 2022 },
  { title: "Flowers", artist: "Miley Cyrus", year: 2023 },
  { title: "Espresso", artist: "Sabrina Carpenter", year: 2024 },
  { title: "Don't Stop Me Now", artist: "Queen", year: 1978 },
  { title: "Somebody to Love", artist: "Queen", year: 1976 },
  { title: "La Vie en rose", artist: "Edith Piaf", year: 1947 },
  { title: "Call Me", artist: "Blondie", year: 1980 },
  { title: "La Tribu de Dana", artist: "Manau", year: 1998 },
  { title: "Numb Encore", artist: "Jay-Z Linkin Park", year: 2004 },
  { title: "We Will Rock You", artist: "Queen", year: 1977 },
  { title: "Avec le temps", artist: "Leo Ferre", year: 1971 },
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
      previewUrl: track.preview,
    });
    withPreview++;
    console.log(`✅ ${track.title} — ${track.artist.name} (${song.year})`);
  }

  console.log(`\n✅ Avec preview: ${withPreview}`);
  console.log(`❌ Introuvables: ${notFound}`);
  console.log(`⚠️  Sans preview: ${SONGS_TO_SEARCH.length - withPreview - notFound}`);

  const output = path.join(__dirname, '../data/songs.json');
  fs.writeFileSync(output, JSON.stringify(results, null, 2));
  console.log(`\n✅ songs.json mis à jour avec ${results.length} chansons`);
}

main().catch(console.error);
