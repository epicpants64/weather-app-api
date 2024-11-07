# Weather App API

API to support Weather App

## How to run with front end

1. clone both repositories down (make sure they are in the same parent folder)
1. navigate into the front end (weather-app)
1. run `npm run build`
1. navigate into this folder (the backend - weather-api)
1. update the copose.yml file with your API tokens for the weather service (see API Used section for details)
1. run `docker compose up --build` (should run on localhost:3000)

## How to run WITHOUT front end locally

1. clone repository
1. navigate into it
1. run `npm install`
1. update the copose.yml file with your API tokens for the weather service (see API Used section for details)
1. run `docker compose up --build` (should run on localhost:3000)

## How to see the swagger docs

1. run the api locally (see steps above under: How to run without front end locally)
2. navigate to localhost:{your port (this is 5001 if you didn't udpate the env)}/swagger

## How to run tests

run `npm run test`

## Design Pattern Explanation

You may be thinking to yourself, "this is a lot of boilerplate for such a simple API" and you would be 100% correct! This is just an example of how I may set up a larger project I know it is overkill for this particular project but it is a general example of how a larger project may be set up with dependency injection and some more general helpers like swagger implementation, logger, etc.

## Things I would love to add

- Database: I had every intention on storing data in a mongo database - which is why there is a setup for it with routes and a start to a seed file I just didn't have time to finish it and for the front end implementation
- Better Rate limiting - especially with the rate limit on the external call should rate limit the api per day not just per minute - could also password protect my redis instance
- Proper Auth: this is a given I would much prefer to have a more robust auth layer with more user validation and things based on the users setting such as coutnry and language - I also didn't have time to implement users on the front to authenticate with
- Caching layer ran out of time but especially since there is a limit on how many API requests can be made per day this would be very helpful
- More/better tests: isn't this the truth for all applications? lol I just ran out of time - could also move the basic set up for all similar services tests into a more central location - could also properly mock a container to test better and wouldn't have to mock functions like validate and strip would be easier to test actual functionality I would also create a proper mock mongo db to test the services and endpoints that use mongo (I started with the fixtures folder but just ran out of time) and didn't get to the user endpoint testing :(
- Better in app documentation - I would make my JS docs a bit more helpful
- Proper implementation of awilix controllers: this is again more complex than necessary for this project but awilix express has a pretty cool setup for controllers that works with express router that I didn't have time to implement nor the need to in this case it may make it a bit harder to follow as the application is so simple with already too much boilerplate
- Add responses to swagger - ran out of time but swagger would be much more helpful it had responses
- fix husky to do proper pre commits
- Implement TS - would make some check unecessary and may make the code a bit cleaner was just faster for me to do it in JS
- Narrow down payloads to front to just want they need

## Other Considerations

- I would generally use something like Axios to make my requests but due to the projects' constraints stuck to fetch
- If i could I would use their specific endpoints for specific data fetches but since they dont have that open/free I used their one call that was open/free
- Most utils i didn't add tests to because it would basically be validating that js or a package is doing what it should/testing js or the third party rather than my logic

## Tech Stack Used

- Node.js and express
- MongoDB and mongoose
- nodemon for development purposes
- Jest tests
- dotenv for reading environment variables
- awilix for dependency injection
- Docker for build/local run

## API Used

https://openweathermap.org/api

This is a free open source API you will need an API token to use the endpoints that call this API. It is free up to 1000 calls a day you just need your email - this was not included in the compose files for security reasons. - you will need access to both basic weather (just a normal login with an API key) location and [onecall](https://openweathermap.org/price#weather) you will need to go through the URL to specifically get access to one call. It is still free up to 1000 calls it just needs you to request it separately.
