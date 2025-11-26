export const getPagination = (page: number = 1, limit: number = 10) => {
  page = Number(page);
  limit = Number(limit);

  const skip = (page - 1) * limit;

  return { skip, take: limit, page, limit };
};
