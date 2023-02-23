# Northcoders News API

This is a backend service to host articles that can be posted and commented on by users.

A live version of the service is available [here](https://news-app-backend.onrender.com/).

All valid endpoints are available at [/api](https://news-app-backend.onrender.com/api)

## Setup instructions

This project was built using PostgreSQL v14.6 and Node.js v19.3.0 (`brew install postgresql@14 node`)

Clone this repository using `git clone https://github.com/Mielie/NewsAppBackEnd`

In the project directory install the dependencies `npm install`

## Environment Variables

Create a file in the project directorty called `.env.development` with the following contents to set the appropriate environment variable before running the backend.

```
PGDATABASE=nc_news
```

## Setup databases

To create and seed the nc_news database run:

`npm run setup-dbs`

`npm run seed`

## Running the server

The server can be run using:

`npm run start`

This will create a server instance listening on port 10000, to change the port either set a new environment variable of PORT at run time:

`PORT=9090 npm run start`

or edit the PORT in the `listener.js` file.

## Testing

Unit testing is done using jest.

To run the unit tests create a new environment file in the project directory called `.env.test` with the following contents:

```
PGDATABASE=nc_news_test
```

Database seeding is done automatically when the tests are executed.

To run the tests execute the test script:

`npm test`
