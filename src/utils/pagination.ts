import { Document, Model, QueryWithHelpers } from "mongoose";

interface PaginationOptions{
  page: number;
  limit: number;
  sort?: any;
  filter?: any;
  select?: any;
  populate?: any;
}

interface PaginationResult<T> {
  page: number;
  totalPages: number;
  results: Partial<T[]>;
  totalResults: number;
}

async function paginate<T extends Document>(
  model: Model<T>,
  options: PaginationOptions
): Promise<PaginationResult<T>> {
  const { page, limit, sort, filter, select={}, populate } = options;

  const query = filter ? model.find(filter, {...select, __v:0}) : model.find({}, {...select, __v:0});
  const countQuery = filter
    ? model.countDocuments(filter)
    : model.countDocuments();

  if (sort) {
    query.sort(sort);
  }

  const skip = (page - 1) * limit;
  query.skip(skip).limit(limit);

  const [
results, totalResults
] = await Promise.all([
    query.exec(),
    countQuery.exec(),
  ]);

  const totalPages = Math.ceil(totalResults / limit);

  return {
    page,
    totalPages,
    results,
    totalResults,
  };
}

export default paginate;

export type SortOrder = -1 | 1 | "asc" | "ascending" | "desc" | "descending";