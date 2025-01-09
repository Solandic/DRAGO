export type Page = string;

export type PageId = string;

export type PagesMap = Record<Page, PageId>;

interface Router {
  pages?: PagesMap;
}

export const getPagesFromRouters = (routers: Router[]) => {
  const pagesMap: PagesMap = {};

  routers.forEach((router) => {
    Object.entries(router.pages ?? {}).forEach(([page, pageId]) => {
      pagesMap[page] = pageId;
    });
  });

  return pagesMap;
};
