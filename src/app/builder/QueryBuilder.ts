import { FilterQuery, Query } from 'mongoose';

/* ------- Search, Filter, Sort, Pagination and Field Filtering Using *Query Chaining Method*---------- */

class QueryBuilder<T> {
  public queryModel: Query<T[], T>;
  public query: Record<string, unknown>;

  constructor(queryModel: Query<T[], T>, query: Record<string, unknown>) {
    this.queryModel = queryModel;
    this.query = query;
  }

  // ------Method For Searching ------
  search(searchAbleFields: string[]) {
    const search = this.query?.search as string;
    if (search) {
      this.queryModel = this.queryModel.find({
        $or: searchAbleFields.map(
          (field) =>
            ({
              [field]: { $regex: search, $options: 'i' },
            }) as FilterQuery<T>,
        ),
      });
    }
    return this;
  }

  // ------Method For Filtering ------
  filter() {
    const queryObject = { ...this.query };
    const excludedFields = [
      'search',
      'sortBy',
      'sortOrder',
      'limit',
      'page',
      'fields',
      'minPrice',
      'maxPrice',
      'inStock',
    ];
    excludedFields.forEach((field) => delete queryObject[field]);

    const andConditions: FilterQuery<T>[] = [];

    // Add existing filters
    if (Object.keys(queryObject).length) {
      andConditions.push(queryObject as FilterQuery<T>);
    }

    // Price range filtering
    const minPrice = Number(this.query?.minPrice);
    const maxPrice = Number(this.query?.maxPrice);

    if (!isNaN(minPrice) || !isNaN(maxPrice)) {
      const priceCondition: Record<string, number> = {};

      if (!isNaN(minPrice)) priceCondition["$gte"] = minPrice;
      if (!isNaN(maxPrice)) priceCondition["$lte"] = maxPrice;

      andConditions.push({ price: priceCondition } as FilterQuery<T>);
    }

    // Availability filtering
    const inStock = this.query?.inStock;
    if (inStock !== undefined) {
      const inStockValue =
        inStock === 'true' ? true : inStock === 'false' ? false : null;
      if (inStockValue !== null) {
        andConditions.push({ inStock: inStockValue } as FilterQuery<T>);
      }
    }

    // Final query
    if (andConditions.length > 0) {
      this.queryModel = this.queryModel.find({ $and: andConditions });
    }

    return this;
  }


  // ------Method For Sorting ------
  sortBy() {
    const sortBy = (this.query?.sortBy as string) || 'createdAt';
    const sortOrder = (this.query?.sortOrder as string) === 'asc' ? '' : '-';
    this.queryModel = this.queryModel.sort(`${sortOrder}${sortBy}`);
    return this;
  }

  // ------Method For Pagination and Limit ------
  pagination() {
    const page = Number(this.query?.page) || 1;
    const limit = Number(this.query?.limit) || 10;
    const skip = (page - 1) * limit;
    this.queryModel = this.queryModel.skip(skip).limit(limit);
    return this;
  }

  // ------Method For Field Filtering ------
  fieldFiltering() {
    const fields =
      (this.query?.fields as string)?.split(',').join(' ') || '-__v';
    this.queryModel = this.queryModel.select(fields);
    return this;
  }

  // ------Method For Field Filtering ------
  async countTotal() {
    const totalQueries = this.queryModel.getFilter();
    const total = await this.queryModel.model.countDocuments(totalQueries);
    const page = Number(this?.query?.page) || 1;
    const limit = Number(this?.query?.limit) || 10;
    const totalPage = Math.ceil(total / limit);

    return {
      page,
      limit,
      total,
      totalPage,
    };
  }
}

export default QueryBuilder;
