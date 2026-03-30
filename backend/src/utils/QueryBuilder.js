/**
 * Builds a Mongoose query with pagination, sorting, filtering, and search.
 */
class QueryBuilder {
  constructor(model, queryParams) {
    this.model = model;
    this.queryParams = queryParams;
    this.query = model.find();
    this.countQuery = model.find();
  }

  /** Apply keyword search on specified fields. */
  search(fields = []) {
    const { search } = this.queryParams;
    if (search && fields.length > 0) {
      const searchRegex = new RegExp(search, 'i');
      const searchConditions = fields.map((field) => ({
        [field]: searchRegex,
      }));
      this.query = this.query.find({ $or: searchConditions });
      this.countQuery = this.countQuery.find({ $or: searchConditions });
    }
    return this;
  }

  /** Apply filters from query params (excludes reserved keys). */
  filter() {
    const excluded = ['page', 'limit', 'sort', 'search', 'fields'];
    const filterObj = { ...this.queryParams };
    excluded.forEach((key) => delete filterObj[key]);

    // Support gte, gt, lte, lt operators
    let filterStr = JSON.stringify(filterObj);
    filterStr = filterStr.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`,
    );
    const parsed = JSON.parse(filterStr);

    this.query = this.query.find(parsed);
    this.countQuery = this.countQuery.find(parsed);
    return this;
  }

  /** Apply sorting. Default: -createdAt. */
  sort() {
    if (this.queryParams.sort) {
      const sortBy = this.queryParams.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  /** Apply field selection. */
  selectFields() {
    if (this.queryParams.fields) {
      const fields = this.queryParams.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    }
    return this;
  }

  /** Apply pagination. Returns pagination metadata. */
  async paginate() {
    const page = Math.max(parseInt(this.queryParams.page, 10) || 1, 1);
    const limit = Math.min(
      Math.max(parseInt(this.queryParams.limit, 10) || 10, 1),
      100,
    );
    const skip = (page - 1) * limit;

    const total = await this.countQuery.countDocuments();
    this.query = this.query.skip(skip).limit(limit);

    return {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  /** Execute query and return results. */
  async exec() {
    return this.query.exec();
  }
}

export default QueryBuilder;
