const params = new URLSearchParams(window.location.search);
const hasToken = params.get("hasToken");

const loginForm = document.getElementById("spotify-login");
const textSubmissionForm = document.querySelector("#textSubmissionForm");
const submitQueryButton = document.getElementById("submit-query");
const spotifyForm = document.getElementById("spotify-form");
const iframe = document.getElementById("spotify-player-iframe");

iframe.style.display = "none";

if (hasToken === "false") {
  loginForm.style.display = "block";
  spotifyForm.style.display = "none";
} else {
  loginForm.style.display = "none";
  spotifyForm.style.display = "flex";
}
textSubmissionForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const userInput = document.getElementById("textInput").value;

  submitQueryButton.value = "loading...";
  submitQueryButton.disabled = true;
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
      embedSpotifyPlaylist(json.playlistId);
    })
    .finally(() => {
      submitQueryButton.value = "Submit";
      submitQueryButton.disabled = false;
    });
});

document.getElementById("login-button").addEventListener("click", function () {
  window.location.href = "/login";
});

function embedSpotifyPlaylist(playlistId) {
  const embedUrl = `https://open.spotify.com/embed/playlist/${playlistId}`;

  iframe.setAttribute("src", embedUrl);
  iframe.setAttribute("frameborder", "0");
  iframe.setAttribute("allowtransparency", "true");
  iframe.setAttribute("allow", "encrypted-media");

  document.getElementById("spotify-player-placeholder").style.display = "none";
  iframe.style.display = "block";
}
