import { NextFunction, Request, Response } from 'express';

export function generateAnimeIdLink (id: number): LinkStructure {
  return {
    rel: 'view-anime-info',
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
    rel: relation || 'animelist-profile',
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

export function generateAlwaysAccessibleLinks (req: Request, next: NextFunction): LinkStructure[] {
  const fullUrl = req.baseUrl + req.url;
  console.log(fullUrl);
  const links: LinkStructure[] = [
    ...generateAnimeResourceLinks(fullUrl),
    isAnimeListPageEndpoint(fullUrl) ? null : generateAnimeListResourceLink()
  ].filter(Boolean);
  if (fullUrl === '/') {
    return links;
  }
  req.body.responseData.links.push(...links);
  next();
}

export function constructNextAndPreviousPageLink (endpoint: string, page: number, totalPages: number):LinkStructure[] {
  return [
    {
      rel: 'next',
      href: page !== totalPages ? `/${endpoint}page=${page + 1}` : `/${endpoint}?page=${page}`,
      method: 'GET'
    },
    {
      rel: 'previous',
      href: page !== 1 ? `/${endpoint}?page=${page - 1}` : `/${endpoint}?page=${page}`,
      method: 'GET'
    }
  ];
}

export function generateAuthLinks (req: Request, res: Response) {
  if (req.body.token) {
    const links = req.body.responseData.links;
    links.push(...generateLoggedInLinks(req.body.token.userId, req));
  } else {
    const links = req.body.responseData.links;
    links.push(generateLoginLink());
  }
  res.status(req.body.status).json(req.body.responseData);
}

export function generateEntryPointLinks (req: Request, res: Response, next: NextFunction) {
  const links = generateAlwaysAccessibleLinks(req, next);
  links.push(generateSelfLink(req, next));
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

export function generateSelfLink (req: Request, next: NextFunction): LinkStructure {
  const fullUrl = req.baseUrl + req.url;
  if (fullUrl === '/') {
    return {
      rel: 'self',
      href: '/',
      method: 'GET'
    };
  } else {
    req.body.responseData.links.unshift({
      rel: 'self',
      href: fullUrl,
      method: req.method
    });
    next();
  }
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
    fullUrl === '/anime/search' ? null : generateSearchAnimeLink(),
    fullUrl === '/anime' ? null : generateAnimeResourceLink()
  ].filter(Boolean);
  return links;
}

function isAnimeListPageEndpoint (url: string) {
  return url === '/anime-list' || url.includes('/anime-list/?page') || url === '/anime-list/';
}
