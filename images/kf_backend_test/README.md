# KrakenFlex Back End Test

## Introduction

This test is designed to help you showcase your back end engineering skills. We are interested to see how you work and
what your thought process is, there is no single correct way to complete the task.

## The Task

You should have been provided an API key and a Swagger specification defining endpoints in a file called `api.yaml`.
Don't worry if you haven't used Swagger before, it's just a standard way to document APIs. You can view the file by going
to [https://editor.swagger.io/](https://editor.swagger.io/) and pasting the contents of `api.yaml` into the panel on the
left.

There are three endpoints in this file:

1. `GET /outages` which returns all outages in our system
2. `GET /site-info/{siteId}` which returns specific information about a site
3. `POST /site-outages/{siteId}` which expects outages for a specific site to be posted to it

Your task is to write a small program that:

1. Retrieves all outages from the `GET /outages` endpoint
2. Retrieves information from the `GET /site-info/{siteId}` endpoint for the site with the ID `norwich-pear-tree`
3. Filters out any outages that began before `2022-01-01T00:00:00.000Z` or don't have an ID that is in the list of
   devices in the site information
4. For the remaining outages, it should attach the display name of the device in the site information to each appropriate outage
5. Sends this list of outages to `POST /site-outages/{siteId}` for the site with the ID `norwich-pear-tree`


### Example

Let's assume we want to do this for the site `kingfisher`.

Given `GET /outages` returns:

```json
[
  {
    "id": "002b28fc-283c-47ec-9af2-ea287336dc1b",
    "begin": "2021-07-26T17:09:31.036Z",
    "end": "2021-08-29T00:37:42.253Z"
  },
  {
    "id": "002b28fc-283c-47ec-9af2-ea287336dc1b",
    "begin": "2022-05-23T12:21:27.377Z",
    "end": "2022-11-13T02:16:38.905Z"
  },
  {
    "id": "002b28fc-283c-47ec-9af2-ea287336dc1b",
    "begin": "2022-12-04T09:59:33.628Z",
    "end": "2022-12-12T22:35:13.815Z"
  },
  {
    "id": "04ccad00-eb8d-4045-8994-b569cb4b64c1",
    "begin": "2022-07-12T16:31:47.254Z",
    "end": "2022-10-13T04:05:10.044Z"
  },
  {
    "id": "086b0d53-b311-4441-aaf3-935646f03d4d",
    "begin": "2022-07-12T16:31:47.254Z",
    "end": "2022-10-13T04:05:10.044Z"
  },
  {
    "id": "27820d4a-1bc4-4fc1-a5f0-bcb3627e94a1",
    "begin": "2021-07-12T16:31:47.254Z",
    "end": "2022-10-13T04:05:10.044Z"
  }
]
```

Given `GET /site-info/kingfisher` returns:

```json
{
  "id": "kingfisher",
  "name": "KingFisher",
  "devices": [
    {
      "id": "002b28fc-283c-47ec-9af2-ea287336dc1b",
      "name": "Battery 1"
    },
    {
      "id": "086b0d53-b311-4441-aaf3-935646f03d4d",
      "name": "Battery 2"
    }
  ]
}
```

We should send the following to `POST /site-outages/kingfisher`:

```json
[
  {
    "id": "002b28fc-283c-47ec-9af2-ea287336dc1b",
    "name": "Battery 1",
    "begin": "2022-05-23T12:21:27.377Z",
    "end": "2022-11-13T02:16:38.905Z"
  },
  {
    "id": "002b28fc-283c-47ec-9af2-ea287336dc1b",
    "name": "Battery 1",
    "begin": "2022-12-04T09:59:33.628Z",
    "end": "2022-12-12T22:35:13.815Z"
  },
  {
    "id": "086b0d53-b311-4441-aaf3-935646f03d4d",
    "name": "Battery 2",
    "begin": "2022-07-12T16:31:47.254Z",
    "end": "2022-10-13T04:05:10.044Z"
  }
]
```

### Requirements

We would like you to produce:

* A small program that solves the problem mentioned above
* A suite of appropriate unit tests
* A `README.md` file that documents what you have produced and explains how to run the program and tests (including installing any dependencies)

* Once you have a complete solution, please commit into a git repo that can be accessed by Kraken Flex. Email your recruitment contact with a link to this repository so that your suubmission can be reviewed. 

Thank you. 

### Bonus Requirements

* The API will occasionally return 500 status codes. Can you implement a solution that is resilient to this scenario?

### Tips and Things to Note

* Make sure to include the provided API key in each request that you send. For example, run the following to test
  this out:
  ```bash
  curl https://api.krakenflex.systems/interview-tests-mock-api/v1/outages -H "x-api-key: <API KEY>"
  ```
* Each endpoint has the base path `https://api.krakenflex.systems/interview-tests-mock-api/v1/`.
* If you are unsure of the schemas required, take a look at the `api.yaml` provided.
* You will only get a 200 success response from `POST /site-outages/{siteId}` if the payload is correct.

**Good luck!**
