import {
  IPaginationMeta,
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import {
  EntityManager,
  EntityTarget,
  FindManyOptions,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
} from 'typeorm';

class CustomPaginationMeta {
  constructor(
    public readonly page: number,
    public readonly limit: number,
    public readonly totalPages: number,
    public readonly total: number,
  ) {}
}

export class TypeOrmRepository<
  Entity extends ObjectLiteral,
> extends Repository<Entity> {
  constructor(
    private readonly entityTarget: EntityTarget<Entity>,
    private readonly entityManager: EntityManager,
  ) {
    super(entityTarget, entityManager);
  }

  findMany(
    options: IPaginationOptions,
    findOptions?: FindManyOptions<Entity>,
  ): Promise<Pagination<Entity, CustomPaginationMeta>> {
    return paginate<Entity, CustomPaginationMeta>(
      this,
      {
        ...options,
        metaTransformer: (meta: IPaginationMeta): CustomPaginationMeta =>
          new CustomPaginationMeta(
            meta.currentPage,
            meta.itemsPerPage,
            meta.totalPages,
            meta.totalItems,
          ),
      },
      findOptions,
    );
  }

  async chunk(
    callback: (data: Entity[]) => Promise<void>,
    findOptions?: FindManyOptions<Entity>,
  ): Promise<void> {
    let currentPage = 1;
    let hasNextPage = true;

    while (hasNextPage) {
      const { items: data } = await this.findMany(
        { page: currentPage, limit: findOptions.take || 100 },
        findOptions,
      );

      if (data.length > 0) {
        await callback(data);
        currentPage++;
      } else {
        hasNextPage = false;
      }
    }
  }
}
