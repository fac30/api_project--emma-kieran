# Spotify OpenAi API


## Project description

Our project requests a playlist from the Openai API based upon usser prompts andd feeds iit to the Spotify API to create custome playlists.

## Project setup

You require node.js and npm to run this project.  You can check if they are installed as follows:
**MacOS, Windows and Linux**

`node -v && npm -v`

If you do not have node.js and npm installed, follow instructions to install them depending on whether you are running the software in a Mac, Windows or Linux environment.

## Clone the repository

Create a folder for the program and navigate to it:

Run the command:
`git clone git@github.com:fac30/api_project--emma-kieran.git`

### Install dependencies and run the bot

In the program folder, run the commands:

`npm init -y`

`npm install`

Now you can run the bot with the command:

`npm start`

## Setting up the `.env` file
### What is a `.env` file?
A [`.env` file](https://blog.bitsrc.io/a-gentle-introduction-to-env-files-9ad424cc5ff4) is a way of storing sensitive information in key-value pairs known as environment variables. These are access keys and tokens that _shouldn't be public_.  

### Configuration
There is a `.env.template` file that contains keys readable by the rest of the code. Values should replace the `..._HERE` text. 

Using your IDE, create a .env file and set it up as pre the .env.template

### Obtaining Spotify Client ID and Client Secret

Navigate to: 

`https://developer.spotify.com/`

Create an account, the navigate to Dashboard, then click on Create App.  Select the app and then you can name it.  Following that in 'Redirect URIs':

`http://localhost:3000`

Now at the bottom, click the check box for Web API.  You can now save this app.

Under settings you can find Client ID and Client secret, copy those into your .env file.

### Obtaining OpenAI API key

Navigate to:

`https://openai.com/blog/openai-api`

Create an account and login, select API and then on the far left select API keys.  Here you can create a new API key.  This should be copied into the .env file