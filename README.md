# Spotify OpenAi API


## Project description

Our project requests a playlist from the Openai API based upon usser prompts andd feeds iit to the Spotify API to create custome playlists.

## Project setup

You require node.js and npm to run this project.  You can check if they are installed as follows:
**MacOS, Windows and Linux**

`node -v && npm -v`

If you do not have node.js and npm installed, follow instructions to install them depending on whether you are running the software in a Mac, Windows or Linux environment.

### Install dependencies and run the bot
Create a folder for the program and navigate to it:

`npm init -y`

`npm install`

Now you can run the bot with the command:

`npm run dev`

## Setting up the `.env` file
### What is a `.env` file?
A [`.env` file](https://blog.bitsrc.io/a-gentle-introduction-to-env-files-9ad424cc5ff4) is a way of storing sensitive information in key-value pairs known as environment variables. These are access keys and tokens that _shouldn't be public_.  

### Configuration
There is a `.env.template` file that contains keys readable by the rest of the code. Values should replace the `..._HERE` text. Below is how to retrieve the relevant values. 

