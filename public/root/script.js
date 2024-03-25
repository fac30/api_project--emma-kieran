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
  iframe.style.width = "100%"; // Ensure iframe takes full width of its container
  iframe.style.height = "380px"; // Set a fixed height or adjust as needed
  iframe.setAttribute("frameborder", "0");
  iframe.setAttribute("allowtransparency", "true");
  iframe.setAttribute("allow", "encrypted-media");

  // Replace the contents of the spotify-player div with the new iframe
  document.getElementById("spotify-player").innerHTML = ''; // Clear existing contents
  document.getElementById("spotify-player").appendChild(iframe);

  console.info(embedUrl);
}


