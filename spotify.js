//  Require the necessary packages
const express = require('express');
require('dotenv').config() 

if (!process.env.CLIENT_ID || !process.env.CLIENT_SECRET || !process.env.REDIRECT_URL) {
    console.error('Missing required environment variables. Check CLIENT_ID, CLIENT_SECRET, and REDIRECT_URL in your .env file.');
    process.exit(1); // Exit the application if the environment variables are not set
}


//spotify
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

// Set the port to 3000
const port = 3000;

// New instance of SpotifyWebApi
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: process.env.REDIRECT_URL
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Spotify Login
app.get('/login', (req, res) => {
    const scopes = ['user-read-private', 'user-read-email', 'user-read-playback-state', 'user-modify-playback-state'];
    console.log(`Redirect URI: ${process.env.REDIRECT_URL}`);
    res.redirect(spotifyApi.createAuthorizeURL(scopes));
});


// Spotify Callback
app.get('/callback', async (req, res) => {
  const error = req.query.error;
  const code = req.query.code;
  const state = req.query.state;

  if (error) {
    console.error('Callback error:', error);
    res.status(500).send('Callback error');
    return;
  }

  spotifyApi.authorizationCodeGrant(code).then(data => {
    const access_token = data.body['access_token'];
    const refresh_token = data.body['refresh_token'];
    const expires_in = data.body['expires_in'];

    spotifyApi.setAccessToken(access_token);
    spotifyApi.setRefreshToken(refresh_token);

    console.log('access_token:', access_token, 'refresh_token:', refresh_token);
    res.send('Success!');

    setInterval(async () => {
      const data = await spotifyApi.refreshAccessToken();
      const access_token = data.body['access_token'];
      console.log('The access token has been refreshed!', access_token);
      spotifyApi.setAccessToken(access_token);
    }, expires_in / 2 * 1000);
    }).catch(err => {
        console.error('Error getting Tokens:', err.message);
        if (err.body) {
            console.error('Detailed error:', JSON.stringify(err.body));
        }
        res.status(500).send('Error getting Tokens');
    });
    

});


// Spotify search
app.get('/search', async (req, res) => {
  const {q} = req.query;
  spotifyApi.searchTracks(q).then(searchData => {
    const trackUri = searchData.body.tracks.items[0].uri;
    res.send(trackUri);
  }).catch(err => {
    console.error(err);
    res.status(500).send('Error searching Spotify API');
  }
  );
});

// Spotify Play
app.get('/play', async (req, res) => {
  const {uri} = req.query;
  spotifyApi.play({uris: [uri]}).then(() => {
    res.send('Playing track');
  }).catch(err => {
    console.error(err);
    res.status(500).send('Error playing track');
  });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
  
  
  
