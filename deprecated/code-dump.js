
// // Spotify API endpoint
// app.post('/spotify', async (req, res) => {
//     console.log('Endpoint /spotify hit with data:', req.body);

//     const artist = req.body.artist;

//     if (!artist) {
//         return res.status(400).send('Artist is required');
//     }

//     try {
//         const response = await spotifyApi.searchArtists(artist);
//         console.log('!!!!!!!', response.body.artists.items[0].name);

//         res.json({ response: response.body.artists.items[0].name });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Error calling Spotify API');
//     }
// }