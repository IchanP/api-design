import { Request, Response } from 'express';

export function generateAnimeIdLink (id: number, rel?: string): LinkStructure {
  return {
    rel: rel || 'view-anime-info',
    href: `/anime/${id}`,
    method: 'GET'
  };
}

export function generateLoginLink (): LinkStructure {
  return {
    rel: 'login',
    href: '/auth/login',
    method: 'POST'
  };
}

export function generateUserAnimeListLink (userId: number, relation?: string): LinkStructure {
  return {
    rel: relation || 'profile',
    href: `/anime-list/${userId}`,
    method: 'GET'
  };
}

export function generateAnimeListResourceLink (): LinkStructure {
  return {
    rel: 'animelists',
    href: '/anime-list{?page}',
    method: 'GET'
  };
}

export function generateRegisterLink (): LinkStructure {
  return {
    rel: 'register',
    href: '/auth/register',
    method: 'POST'
  };
}
export function generateAddToListLink (animeId: number, userId: number): LinkStructure {
  return {
    rel: 'add-to-list',
    href: `/anime-list/${userId}/anime/${animeId}`,
    method: 'POST'
  };
}

export function generateAlwaysAccessibleLinks (req: Request): LinkStructure[] {
  const fullUrl = req.baseUrl + req.url;
  const links: LinkStructure[] = [
    ...generateAnimeResourceLinks(fullUrl),
    isAnimeListPageEndpoint(fullUrl) ? null : generateAnimeListResourceLink()
  ].filter(Boolean);
  if (fullUrl === '/') {
    return links;
  }
  if (req.body.responseData) {
    req.body.responseData.links.push(...links);
  } else {
    req.body.responseData = { links };
  }
}

export function constructNextAndPreviousPageLink (endpoint: string, page: number, totalPages: number):LinkStructure[] {
  return [
    {
      rel: 'next',
      href: page !== totalPages ? `/${endpoint}page=${page + 1}` : `/${endpoint}?page=${page}`,
      method: 'GET'
    },
    {
      rel: 'prev',
      href: page !== 1 ? `/${endpoint}?page=${page - 1}` : `/${endpoint}?page=${page}`,
      method: 'GET'
    }
  ];
}

export function generateAuthLinks (req: Request) {
  if (req.body.token) {
    const links = req.body.responseData.links;
    links.push(...generateLoggedInLinks(req.body.token.userId, req));
  } else {
    const links = req.body.responseData.links;
    links.push(generateLoginLink());
  }
}

export function generateEntryPointLinks (req: Request, res: Response) {
  const links = generateAlwaysAccessibleLinks(req);
  links.unshift(generateSelfLink(req));
  links.push(generateRegisterLink());
  links.push(generateLoginLink());
  links.push(generateDocsLink());
  res.status(200).json({ links });
}

export function findAndTransformToSelf (links: Array<LinkStructure>, relation: string): Array<LinkStructure> {
  const self = links.find((link) => link.rel === relation);
  self.rel = 'self';
  return links;
}

export function generateSelfLink (req: Request): LinkStructure {
  const fullUrl = req.baseUrl + req.url;
  if (fullUrl === '/') {
    return {
      rel: 'self',
      href: '/',
      method: 'GET'
    };
  } else {
    return {
      rel: 'self',
      href: fullUrl,
      method: req.method as ValidMethods
    };
  }
}

export function generateSubscribeToWebhookLink (userId: number): LinkStructure {
  return {
    rel: 'subscribe',
    href: `/webhook/anime-list/${userId}/subscribe`,
    method: 'POST'
  };
}

export function generateUnsubscribeToWebhookLink (userId: number): LinkStructure {
  return {
    rel: 'unsubscribe',
    href: `/webhook/anime-list/${userId}/unsubscribe`,
    method: 'DELETE'
  };
}

export function generateEntryPointLink () {
  return {
    rel: 'entry-point',
    href: '/',
    method: 'GET'
  };
}

export function generateCommonLinks (req: Request, res: Response) {
  req.body.responseData.links.unshift(generateSelfLink(req));
  generateAlwaysAccessibleLinks(req);
  generateAuthLinks(req);
  return res.status(req.body.status).json(req.body.responseData);
}

function generateLoggedInLinks (userId: number, req: Request): LinkStructure[] {
  const fullUrl = req.baseUrl + req.url;
  return [
    generateUserAnimeListLink(userId),
    fullUrl === '/user/username' ? null : generateUsernameUpdateLink(),
    fullUrl === '/auth/refresh' ? null : generateRefreshTokenLink()
  ].filter(Boolean);
}

function generateUsernameUpdateLink (): LinkStructure {
  return {
    rel: 'update-username',
    href: '/user/username',
    method: 'PUT'
  };
}

function generateRefreshTokenLink (): LinkStructure {
  return {
    rel: 'refresh-login',
    href: '/auth/refresh',
    method: 'POST'
  };
}

function generateDocsLink (): LinkStructure {
  return {
    rel: 'documentation',
    href: '/api-docs',
    method: 'GET'
  };
}

function generateSearchAnimeLink (): LinkStructure {
  return {
    rel: 'search-anime',
    href: '/anime/search{?title,page}',
    method: 'GET'
  };
}

function generateAnimeResourceLink (): LinkStructure {
  return {
    rel: 'anime',
    href: '/anime{?page}',
    method: 'GET'
  };
}

function generateAnimeResourceLinks (fullUrl: string): LinkStructure[] {
  const links: LinkStructure[] = [
    isAnimePageEndPoint(fullUrl) ? null : generateAnimeResourceLink(),
    isAnimeSearchEndPoint(fullUrl) ? null : generateSearchAnimeLink()
  ].filter(Boolean);
  return links;
}

function isAnimeSearchEndPoint (url: string) {
  return url === '/anime/search' || url.includes('/anime/search') || url === '/anime/search/';
}

function isAnimePageEndPoint (url: string) {
  return url === '/anime' || url.includes('/anime/?page') || url === '/anime/';
}

function isAnimeListPageEndpoint (url: string) {
  return url === '/anime-list' || url.includes('/anime-list/?page') || url === '/anime-list/';
}
