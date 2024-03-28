# AnimeList API

This API is intended to be a Restful implementation of an application similar to [MyAnimeList](https://myanimelist.net/) or [AniList](https://anilist.co/). It could, in the future, potentially serve as a backend for a web application similar to those (*with some future features added*).

## Anime Dataset

The anime data is sourced from [this repository](https://github.com/manami-project/anime-offline-database) by [manami-project](https://github.com/manami-project). The application currently uses the dataset from week 11 of 2024, with plans to make the dataset automatically update in the future.

## Application Links

- [API Entry Point]() // TODO
- [API Documentation]() // TODO
- [Postman Tests]() // TODO

### Clarifications on HATOEAS terminology

The rel term ``profile``will **ALWAYS** refer to the user's own animelist. The rel term ``owner`` is only used to refer to animelists which are not the current user's animelist.

### Known Issues and Limitations

There is currently no way for a user to change their password, logout or delete their account.

The anime dataset is static, meaning that any future anime that are released or rediscovered will not be in the dataset.

### Credits

- [manami-project](https://github.com/manami-project) For the anime dataset used in this project.
