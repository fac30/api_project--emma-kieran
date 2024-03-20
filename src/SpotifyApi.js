import SpotifyWebApi from "spotify-web-api-node";

export class SpotifyApi {
  constructor(clientId, clientSecret, redirectUri) {
    this.hasToken = false;

    this.clientId = clientId;
    this.secret = clientSecret;
    this.redirectUri = redirectUri;
    this.api = new SpotifyWebApi({ clientSecret, clientId, redirectUri });
  }

  getLoginUrl() {
    const scopes = [
      "user-read-private",
      "user-read-email",
      "user-read-playback-state",
      "user-modify-playback-state",
    ];
    return this.api.createAuthorizeURL(scopes, this.secret);
  }

  async getToken(code) {
    await this.api.authorizationCodeGrant(code).then(({ body }) => {
      const { access_token, refresh_token, expires_in } = body;
      this.api.setAccessToken(access_token);
      this.api.setRefreshToken(refresh_token);
      this.refreshToken(expires_in);
    });
    this.hasToken = true;
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
