# Reactive Table

[![REUSE status](https://api.reuse.software/badge/github.com/noi-techpark/webcomp-boilerplate)](https://api.reuse.software/info/github.com/noi-techpark/webcomp-boilerplate)
[![CI/CD](https://github.com/noi-techpark/webcomp-boilerplate/actions/workflows/main.yml/badge.svg)](https://github.com/noi-techpark/webcomp-boilerplate/actions/workflows/main.yml)

This webcomponent is a generic table that is used to show arbitrary data.

The data is fed into the component either statically from the HTML where the component is declared, or dynamically by the Javascript of the including page. The component needs to know the schema of the input data in order to be able to create the correct amount of columns, with appropriate header labels, and format the data according to its type.

The component is reactive, in the sense that changing the input data will result in a change in the rendered output, and the same applies for a change in the schema.

- [Reactive Table](#reactive-table)
  - [Usage](#usage)
    - [Attributes](#attributes)
      - [schema](#schema)
        - [type](#type)
      - [data](#data)
      - [date-format](#date-format)
  - [Getting started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Source code](#source-code)
    - [Dependencies](#dependencies)
    - [Build](#build)
  - [Tests and linting](#tests-and-linting)
  - [Deployment](#deployment)
  - [Run with docker](#run-with-docker)
    - [Installation](#installation)
    - [Start the docker containers](#start-the-docker-containers)
    - [Publish a new version of your webcomponent](#publish-a-new-version-of-your-webcomponent)
    - [Stop the docker containers](#stop-the-docker-containers)
    - [Delete your webcomponents from the store](#delete-your-webcomponents-from-the-store)
  - [Information](#information)
    - [Support](#support)
    - [Contributing](#contributing)
    - [Documentation](#documentation)
    - [Boilerplate](#boilerplate)
    - [License](#license)

## Usage

Include the script file `dist/reactive-table.min.js` in your HTML and define the web component like this:

```html
<reactive-table
  id="my-table"
  schema='[
    {
      "key": "Accept-Encoding",
      "name": "My Column Header Label for Accept-Encoding",
      "type": "string"
    },
    {
      "key": "Accept-Language",
      "name": "My Column Header Label for Accept-Language",
      "type": "string"
    }
  ]'  
/>
<script>
  // at any time, hit an API and feed the data into the table
  const table = document.getElementById('my-table')
  fetch('https://httpbin.org/get')
    .then(response => response.json())
    .then(json => [json.headers]) // do some data manipulation if needed
    .then(data => table._data = data)
  // you can also change the schema at runtime, e.g.
  // table._schema = [/* some new schema here */]
</script>
```

Alternatively, if you just need to render something statically, you can also do it like this:

```html
  <reactive-table
    data='
      [
        {
          "id": 1,
          "name": "pippo",
          "value": "Ambaraba Cici Coco"
        },
        [
          {
            "id": 2,
            "name": "ciccio",
            "value": "Tre Civette Sul Como"
          },
          {
            "id": 3,
            "name": "Che Facevano LAmore"
          },
          {
            "id": 4,
            "value": "Con La Figlia Del Dottore"
          }
        ],
        {
          "id": 5,
          "name": "Il Dottore Si Ammalo"
        },
        {
          "id": 6,
          "value": "Ambaraba Cici Coco",
          "date": "2022-11-01T13:57",
          "html": "<a href=https://www.google.com>goto google</a>",
          "image": "https://noi.bz.it/themes/custom/noi_techpark/logo_bn.svg"
        }
      ]
    '
    schema='
      [
        {
          "key": "id",
          "name": "Identifier",
          "type": "integer"
        },
        {
          "key": "name",
          "name": "Full Name",
          "type": "string",
          "default": "-"
        },
        {
          "key": "value",
          "name": "The Value",
          "type": "string",
          "default": "-"
        },
        {
          "key": "date",
          "name": "The Date",
          "type": "date"
        },
        {
          "key": "html",
          "name": "The HTML",
          "type": "html"
        },
        {
          "key": "image",
          "name": "The Image",
          "type": "image"
        }
      ]
    '
    date-format="DD/MM/yyyy - hh:mm:ss"
  />
```

### Attributes

#### schema

The schema of the data to show, expressed as a JSON encoded array of objects (every object describing a table column) with the following properties:

| property name | meaning                                                                         |
|---------------|---------------------------------------------------------------------------------|
| key           | the object property to use                                                      |
| name          | this will be the header of that column                                          |
| type          | if set to date, html, image, the value will be formatted (explained later)      |
| default       | in case the value is not [truthy](https://developer.mozilla.org/en-US/docs/Glossary/Truthy) this will be used as default |

This attribute has a corresponding Javascript property that can be used to feed the schema into the table, and it has the same name but prepended with a low dash: `_schema`

##### type

The type indicates what kind of data is going to be present in that column.

* `html` data will be rendered as HTML (**be careful to sanitize your input!**)
* `image` expects to find an URL of an image; will be translated to `<img src="{THE_URL}" />`
* `date` expects to find an ISO 8601 string as input (output will be formatted according to the value of the `date-format` attribute)

#### data

The data to visualize, expressed as a JSON encoded array of objects matching (at least partially) the schema declared in the `schema` attribute. Object properties that are not matched by the schema are ignored.

This attribute has a corresponding Javascript property that can be used to feed the schema into the table, and it has the same name but prepended with a low dash: `_data`

#### date-format
Whenever an object having a schema of `"type": "date"`" is handled, this is the formatting string that will be used to format the output. Refer to [this syntax](https://momentjs.com/docs/#/displaying/format/).

## Getting started

These instructions will get you a copy of the project up and running
on your local machine for development and testing purposes.

### Prerequisites

To build the project, the following prerequisites must be met:

- Node 12 / NPM 6

For a ready to use Docker environment with all prerequisites already installed and prepared, you can check out the [Docker environment](#docker-environment) section.

### Source code

Get a copy of the repository:

```bash
git clone https://github.com/noi-techpark/webcomp-reactive-table.git
```

Change directory:

```bash
cd webcomp-reactive-table
```

### Dependencies

Download all dependencies:

```bash
npm ci
```

### Build

Build and start the project:

```bash
npm run start
```

The application will be served and can be accessed at [http://localhost:8998](http://localhost:8998).

## Tests and linting

The tests and the linting can be executed with the following commands:

```bash
npm run test
npm run lint
```

## Deployment

To create the distributable files, execute the following command:

```bash
npm run build
```

## Run with docker

If you want to test the webcomponent on a local instance of the [webcomponent store](https://webcomponents.opendatahub.com/) to make sure that it will run correctly also on the real store.
You can also access the webcomponent running in a simple separated docker container outside of the store.

If you have already developed your webcomponent and now want to test it on a local instance of the store, just copy `.env.example`, `docker-compose.yml`, `wcs-manifest.json` and `infrastructure/docker` into your root folder. Adjust your `package.json` and `wcs-manifest.json` files as described on the top of this readme. Then follow the instructions below.

For accessing the webcomponent in a separated docker in the browser you will need a server (e.g. webpack dev-server) that is hosting a page which includes the webcomponent tag, as well as the script defining it. This page needs to be hosted on port 8080 as specified in your docker-compose file.

### Installation

Install [Docker](https://docs.docker.com/install/) (with Docker Compose) locally on your machine.

### Start the docker containers
- Create a .env file: <br>
  `cp .env.example .env`
- [Optional] Adjust port numbers in .env if they have conflicts with services already running on your machine
- Start the store with: <br>
  `docker-compose up -d`
- Wait until the containers are running. You can check the current state with: <br>
  `docker-compose logs --tail 500 -f`
- Access the store in your browser on: <br>
  `localhost:8999`
- Access webcomponent running in separated docker in your browser on: <br>
  `localhost:8998`

### Publish a new version of your webcomponent
- Increase version number WC_VERSION in your .env file
- Then run: `docker-compose up wcstore-cli`

### Stop the docker containers
- `docker-compose stop`

### Delete your webcomponents from the store
- `[sudo] rm -f workspace`
- `docker-compose rm -f -v postgres`


## Information

### Support

For support, please contact [help@opendatahub.bz.it](mailto:help@opendatahub.bz.it).

### Contributing

If you'd like to contribute, please follow the following instructions:

- Fork the repository.
- Checkout a topic branch from the `main` branch.
- Make sure the tests are passing.
- Create a pull request against the `main` branch.

A more detailed description have a look at our [Getting Started
Guide](https://github.com/noi-techpark/odh-docs/wiki/Contributor-Guidelines:-Getting-started).

### Documentation

More documentation can be found at [https://docs.opendatahub.com](https://docs.opendatahub.com).

### Boilerplate

The project uses this boilerplate: [https://github.com/noi-techpark/webcomp-boilerplate](https://github.com/noi-techpark/webcomp-boilerplate).

### License

The code in this project is licensed under the GNU AFFERO GENERAL PUBLIC LICENSE Version 3 license. See the [LICENSE.md](LICENSE.md) file for more information.
