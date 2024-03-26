import SpotifyWebApi from "spotify-web-api-node";

export class SpotifyApi {
  constructor(clientId, clientSecret, redirectUri) {
    this.hasToken = false;

    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.redirectUri = redirectUri;
    this.api = new SpotifyWebApi({ clientSecret, clientId, redirectUri });
  }

  getLoginUrl() {
    const scopes = [
      "user-read-private",
      "user-read-email",
      "user-read-playback-state",
      "user-modify-playback-state",
      "playlist-modify-public",
      "playlist-modify-private",
    ];
    return this.api.createAuthorizeURL(scopes);
  }

  async getToken(code) {
    await this.api.authorizationCodeGrant(code).then(({ body }) => {
      this.api.setAccessToken(body.access_token);
      this.api.setRefreshToken(body.refresh_token);
      console.log("Access and refresh tokens set successfully");
      this.refreshToken(body.expires_in); 
    }).catch(error => {
      console.error("Error during token acquisition:", error);
    });    
    this.hasToken = true;
  }

  /**
   * Gets the URI of a track
   * @param {{name:string, artist:string}} songData object with name and artist of the song
   * @private
   */
  async getSingleTrackURI(songData) {
    const { name, artist } = songData;
    const query = `track:${name} artist:${artist}`;
    return this.api.searchTracks(query).then((data, index) => {
      if (data.body.tracks.items.length > 0) {
        return data.body.tracks.items[0].uri;
      }
    });
  }

  async findOrCreatePlaylist(userId, playlistName) {
    const data = await this.api.getUserPlaylists(userId);

    const playlist = data.body.items.find((p) => p.name === playlistName);

    if (playlist) {
      console.log(`Found existing playlist: ${playlistName} with ID: ${playlist.id}`);
      return playlist.id; // Return existing playlist ID
    } else {
      console.log(`Creating new playlist: ${playlistName}`);
      try {
        const playList = await this.api.createPlaylist(playlistName, {
          public: true,
        });
        return playList.body.id;
      } catch (e) {
        console.error("something went wrong,", e);
      }

      // return newPlaylist.body.id; // Return new playlist ID
    }
  }

  /**
   * Uses the spotify API to generate pa playlist from the titles
   * It tries to use an existing playlist so it doesn't create a new one every time
   * @param {{song:string, artist:string}[]} titles object with name and artist of the song
   * @param {string} playlistName name of the playlist to create.
   * @returns playlist id for the link embed
   */
  async generatePlaylistFromTitles(titles, playlistName = "AI playlist") {
    try {
      const userId = await this.api.getMe().then((data) => data.body.id);
      console.log({ userId });
      const playlistId = await this.findOrCreatePlaylist(userId, playlistName);
      console.log({ playlistId });
      // Finds all the tracks
      const trackUris = await Promise.all(
        titles.map((title) => this.getSingleTrackURI(title))
      ).then((results) => results.filter((uri) => !!uri));
      console.log({ trackUris });
      if (!trackUris.length) {
        return;
      }

      const playlist = await this.api.replaceTracksInPlaylist(
        playlistId,
        trackUris
      );

      console.log({ playlist });
      console.log("Successfully generated playlist with ID:", playlistId);
      return playlistId;
    } catch (e) {
      console.log("Error generating playlist, ", e);
    }
  }


  async getCurrentPlaybackAlbum() {
    if (!this.hasToken) {
      console.error('Access token is required to fetch current playback state.');
      return;
    }
  
    try {
      const playbackState = await this.api.getMyCurrentPlaybackState();
      console.log("Raw Playback State:", playbackState.body); // Log raw response for debugging
      if (playbackState.body && playbackState.body.item && playbackState.body.item.album) {
        const album = playbackState.body.item.album;
        return {
          name: album.name,
          release_date: album.release_date,
        };
      } else {
        console.log('No current playback found or it does not contain album information.');
        return null;
      }
    } catch (error) {
      console.error('Failed to fetch current playback state:', error);
      return null;
    }
  }
  

  // TODO: Make this fail
  refreshToken(expires_in) {
    setInterval(
      () =>
        this.api.refreshAccessToken().then(({ body: { access_token } }) => {
          this.api.setAccessToken(access_token);
        }),
      (expires_in / 2) * 1000
    );
  }
}
