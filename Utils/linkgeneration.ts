import { NextFunction, Request, Response } from 'express';

export function generateAnimeResourceLinks (): LinkStructure[] {
  const links: LinkStructure[] = [
    {
      rel: 'anime',
      href: '/anime{?page}',
      method: 'GET'
    }, {
      rel: 'search-anime',
      href: '/anime/search{?title,page}',
      method: 'GET'
    }
  ];
  return links;
}

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

export function generateAlwaysAccessibleLinks (): LinkStructure[] {
  const links: LinkStructure[] = [...generateAnimeResourceLinks(), generateAnimeListResourceLink()];
  return links;
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
    links.push(...generateLoggedInLinks(req.body.token.userId));
  } else {
    const links = req.body.responseData.links;
    links.push(generateLoginLink());
  }
  res.status(req.body.status).json(req.body.responseData);
}

export function generateEntryPointLinks (req: Request, res: Response) {
  const links = generateAlwaysAccessibleLinks();
  links.push(generateSelf(req.url, req.method as ValidMethods));
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

export function generateSelf (href: string, method: ValidMethods): LinkStructure {
  return {
    rel: 'self',
    href,
    method
  };
}

function generateLoggedInLinks (userId: number): LinkStructure[] {
  return [
    generateUserAnimeListLink(userId),
    generateUsernameUpdateLink(),
    generateRefreshTokenLink()
  ];
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
