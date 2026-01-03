type IPaginationAndSort = {
  page?: number | string;
  limit?: number | string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

const buildPaginationAndSort = (options: IPaginationAndSort) => {
  const page = Number(options.page) || 1;
  const limit = Number(options.limit) || 5;
  const skip = (page - 1) * limit;

  const orderBy =
    options.sortBy && options.sortOrder
      ? { [options.sortBy]: options.sortOrder }
      : undefined;

  return {
    skip: skip,
    take: limit,
    orderBy,
  };
};

export { buildPaginationAndSort, type IPaginationAndSort };
