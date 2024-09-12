export type ImageObj = {
  id: string;
  url: string;
};

export type ImageApiResponse = {
  items: ImageObj[];
  hasMore: boolean;
};
