# AnimeList API

This API is intended to be a Restful implementation of an application similar to [MyAnimeList](https://myanimelist.net/) or [AniList](https://anilist.co/). It could, in the future, potentially serve as a backend for a web application similar to those (*with some future features added*).

## Anime Dataset

The anime data is sourced from [this repository](https://github.com/manami-project/anime-offline-database) by [manami-project](https://github.com/manami-project). The application currently uses the dataset from week 11 of 2024, with plans to make the dataset automatically update in the future.

## Application Links

- [API Entry Point](https://aninac.com)
- [API Documentation](https://aninac.com/api-docs)
- [Postman Tests](./postman-tests.json) Download the file and import it into Postman to run the tests.

### Webhook

The application offers the ability to subscribe to a specific users anime list. This is done through calling the POST method found under the webhook section in the [API Documentation](https://aninac.com/api-docs). When the specified user adds an anime to their list the application will send a POST request to the provided URL with information about the anime that was added.

An example of what the webhook callback body may look like is as follows:

```json
{
  
  "message": "New anime added to Dedrick_Dooley's list: Otome Youkai Zakuro Picture Drama - SPECIAL",
  "userProfile": "/anime-list/36",
  "data": {
    "animeId": 21349,
    "title": "Otome Youkai Zakuro Picture Drama",
    "type": "SPECIAL",
    "links": [ 
        { 
            "rel": "self", 
            "href": "/anime/25", 
            "method": "GET" 
        } 
    ]
  },
  "eventType": "anime-added",
  "eventId": "92a9b87c-94e6-465d-9d81-e45cc7976ad0"
}
```

### Clarifications on HATOEAS terminology

The rel term ``profile`` will **ALWAYS** refer to the user's own animelist. The rel term ``owner`` is only used to refer to animelists which are not the current user's animelist.

### Known Issues and Limitations

There is currently no way for a user to change their password, logout or delete their account.

The anime dataset is static, meaning that any future anime that are released or rediscovered will not be in the dataset.

### Credits

- [manami-project](https://github.com/manami-project) For the anime dataset used in this project.
