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
      .then((data) => {
        if (data.songTitles && Array.isArray(data.songTitles)) {
          // Join the array of song titles into a string and display in the textarea
          document.getElementById("apiResponse").value =
            data.songTitles.join(", ");
        } else {
          // If the response doesn't contain 'songTitles', log the whole response for debugging
          console.error("Unexpected response structure:", data);
          document.getElementById("apiResponse").value =
            "Unexpected response structure, check console for details.";
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        document.getElementById("apiResponse").value =
          "Failed to get response from API.";
      });
  });
