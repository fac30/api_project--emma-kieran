document
  .querySelector("#textSubmissionForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const userInput = document.getElementById("textInput").value;
    fetch("/generate", {
      // Make sure this matches your server's endpoint
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ textInput: userInput }),
    })
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        embedSpotifyPlaylist(json.playlistId);
      });
  });

document.getElementById("login-button").addEventListener("click", function () {
  window.location.href = "/login";
});

function embedSpotifyPlaylist(playlistId) {
  const embedUrl = `https://open.spotify.com/embed/playlist/${playlistId}`;
  const iframe = document.createElement("iframe");

  iframe.setAttribute("src", embedUrl);
  iframe.setAttribute("width", "300");
  iframe.setAttribute("height", "380");
  iframe.setAttribute("frameborder", "0");
  iframe.setAttribute("allowtransparency", "true");
  iframe.setAttribute("allow", "encrypted-media");

  console.info(embedUrl);

  // Assuming there's a div with id="spotify-player" in your HTML where you want to embed the player
  document.getElementById("spotify-player").appendChild(iframe);
}
