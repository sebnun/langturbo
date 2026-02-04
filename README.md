# LangTurbo
LangTurbo is a language learning application available for iOS, Android and the Web. Learn more about [how the app works from a user’s perspective](https://www.langturbo.com/blog/langturbo/getting-started).

This repo includes all the code that makes the app function, including the marketing site.

* `/agent`
	* A Python microservice that powers the real-time voice-to-voice AI agent for pronunciation feedback.
* `/app`
	* A React Native application with iOS, Android and web clients.
* `/cron`
	* Several TypeScript ETL microservices related to podcast data.
* `/nextjs`
	* Nextjs application that powers the API for the clients and the static marketing site.
* `/terraform`
	* Infrastructure as Code (IaC) for Oracle Cloud–related services.
* `/whisper`
	* A Whisper (Automatic Speech Recognition) deployment in Google Cloud Platform.

Everything is deployed using  [Kamal](https://kamal-deploy.org/).

## A picture is worth ...
![Langturbo architecture diagram](https://raw.githubusercontent.com/sebnun/langturbo/refs/heads/main/diagram.png)

## Current state of the codebase

This is an MVP. As such, there are a lot of things missing, most notably tests, a proper architecture and better docs. Sorry for the mess.

## How can you help?

I am definitely not an expert in language learning. If you think there's something missing or there's something that can be improved, feel free to leave your feedback through the “Feedback” option in the app.
