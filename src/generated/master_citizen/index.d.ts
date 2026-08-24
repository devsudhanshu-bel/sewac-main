
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model city_table
 * 
 */
export type city_table = $Result.DefaultSelection<Prisma.$city_tablePayload>
/**
 * Model master_citizen_map
 * 
 */
export type master_citizen_map = $Result.DefaultSelection<Prisma.$master_citizen_mapPayload>
/**
 * Model master_citizen_map_backup
 * 
 */
export type master_citizen_map_backup = $Result.DefaultSelection<Prisma.$master_citizen_map_backupPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more City_tables
 * const city_tables = await prisma.city_table.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more City_tables
   * const city_tables = await prisma.city_table.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.city_table`: Exposes CRUD operations for the **city_table** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more City_tables
    * const city_tables = await prisma.city_table.findMany()
    * ```
    */
  get city_table(): Prisma.city_tableDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.master_citizen_map`: Exposes CRUD operations for the **master_citizen_map** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Master_citizen_maps
    * const master_citizen_maps = await prisma.master_citizen_map.findMany()
    * ```
    */
  get master_citizen_map(): Prisma.master_citizen_mapDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.master_citizen_map_backup`: Exposes CRUD operations for the **master_citizen_map_backup** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Master_citizen_map_backups
    * const master_citizen_map_backups = await prisma.master_citizen_map_backup.findMany()
    * ```
    */
  get master_citizen_map_backup(): Prisma.master_citizen_map_backupDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.19.3
   * Query Engine version: c2990dca591cba766e3b7ef5d9e8a84796e47ab7
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    city_table: 'city_table',
    master_citizen_map: 'master_citizen_map',
    master_citizen_map_backup: 'master_citizen_map_backup'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "city_table" | "master_citizen_map" | "master_citizen_map_backup"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      city_table: {
        payload: Prisma.$city_tablePayload<ExtArgs>
        fields: Prisma.city_tableFieldRefs
        operations: {
          findUnique: {
            args: Prisma.city_tableFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$city_tablePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.city_tableFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$city_tablePayload>
          }
          findFirst: {
            args: Prisma.city_tableFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$city_tablePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.city_tableFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$city_tablePayload>
          }
          findMany: {
            args: Prisma.city_tableFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$city_tablePayload>[]
          }
          create: {
            args: Prisma.city_tableCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$city_tablePayload>
          }
          createMany: {
            args: Prisma.city_tableCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.city_tableCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$city_tablePayload>[]
          }
          delete: {
            args: Prisma.city_tableDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$city_tablePayload>
          }
          update: {
            args: Prisma.city_tableUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$city_tablePayload>
          }
          deleteMany: {
            args: Prisma.city_tableDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.city_tableUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.city_tableUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$city_tablePayload>[]
          }
          upsert: {
            args: Prisma.city_tableUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$city_tablePayload>
          }
          aggregate: {
            args: Prisma.City_tableAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCity_table>
          }
          groupBy: {
            args: Prisma.city_tableGroupByArgs<ExtArgs>
            result: $Utils.Optional<City_tableGroupByOutputType>[]
          }
          count: {
            args: Prisma.city_tableCountArgs<ExtArgs>
            result: $Utils.Optional<City_tableCountAggregateOutputType> | number
          }
        }
      }
      master_citizen_map: {
        payload: Prisma.$master_citizen_mapPayload<ExtArgs>
        fields: Prisma.master_citizen_mapFieldRefs
        operations: {
          findUnique: {
            args: Prisma.master_citizen_mapFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$master_citizen_mapPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.master_citizen_mapFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$master_citizen_mapPayload>
          }
          findFirst: {
            args: Prisma.master_citizen_mapFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$master_citizen_mapPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.master_citizen_mapFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$master_citizen_mapPayload>
          }
          findMany: {
            args: Prisma.master_citizen_mapFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$master_citizen_mapPayload>[]
          }
          create: {
            args: Prisma.master_citizen_mapCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$master_citizen_mapPayload>
          }
          createMany: {
            args: Prisma.master_citizen_mapCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.master_citizen_mapCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$master_citizen_mapPayload>[]
          }
          delete: {
            args: Prisma.master_citizen_mapDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$master_citizen_mapPayload>
          }
          update: {
            args: Prisma.master_citizen_mapUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$master_citizen_mapPayload>
          }
          deleteMany: {
            args: Prisma.master_citizen_mapDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.master_citizen_mapUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.master_citizen_mapUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$master_citizen_mapPayload>[]
          }
          upsert: {
            args: Prisma.master_citizen_mapUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$master_citizen_mapPayload>
          }
          aggregate: {
            args: Prisma.Master_citizen_mapAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMaster_citizen_map>
          }
          groupBy: {
            args: Prisma.master_citizen_mapGroupByArgs<ExtArgs>
            result: $Utils.Optional<Master_citizen_mapGroupByOutputType>[]
          }
          count: {
            args: Prisma.master_citizen_mapCountArgs<ExtArgs>
            result: $Utils.Optional<Master_citizen_mapCountAggregateOutputType> | number
          }
        }
      }
      master_citizen_map_backup: {
        payload: Prisma.$master_citizen_map_backupPayload<ExtArgs>
        fields: Prisma.master_citizen_map_backupFieldRefs
        operations: {
          findUnique: {
            args: Prisma.master_citizen_map_backupFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$master_citizen_map_backupPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.master_citizen_map_backupFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$master_citizen_map_backupPayload>
          }
          findFirst: {
            args: Prisma.master_citizen_map_backupFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$master_citizen_map_backupPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.master_citizen_map_backupFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$master_citizen_map_backupPayload>
          }
          findMany: {
            args: Prisma.master_citizen_map_backupFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$master_citizen_map_backupPayload>[]
          }
          create: {
            args: Prisma.master_citizen_map_backupCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$master_citizen_map_backupPayload>
          }
          createMany: {
            args: Prisma.master_citizen_map_backupCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.master_citizen_map_backupCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$master_citizen_map_backupPayload>[]
          }
          delete: {
            args: Prisma.master_citizen_map_backupDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$master_citizen_map_backupPayload>
          }
          update: {
            args: Prisma.master_citizen_map_backupUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$master_citizen_map_backupPayload>
          }
          deleteMany: {
            args: Prisma.master_citizen_map_backupDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.master_citizen_map_backupUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.master_citizen_map_backupUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$master_citizen_map_backupPayload>[]
          }
          upsert: {
            args: Prisma.master_citizen_map_backupUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$master_citizen_map_backupPayload>
          }
          aggregate: {
            args: Prisma.Master_citizen_map_backupAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMaster_citizen_map_backup>
          }
          groupBy: {
            args: Prisma.master_citizen_map_backupGroupByArgs<ExtArgs>
            result: $Utils.Optional<Master_citizen_map_backupGroupByOutputType>[]
          }
          count: {
            args: Prisma.master_citizen_map_backupCountArgs<ExtArgs>
            result: $Utils.Optional<Master_citizen_map_backupCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    city_table?: city_tableOmit
    master_citizen_map?: master_citizen_mapOmit
    master_citizen_map_backup?: master_citizen_map_backupOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */



  /**
   * Models
   */

  /**
   * Model city_table
   */

  export type AggregateCity_table = {
    _count: City_tableCountAggregateOutputType | null
    _avg: City_tableAvgAggregateOutputType | null
    _sum: City_tableSumAggregateOutputType | null
    _min: City_tableMinAggregateOutputType | null
    _max: City_tableMaxAggregateOutputType | null
  }

  export type City_tableAvgAggregateOutputType = {
    city_id: number | null
  }

  export type City_tableSumAggregateOutputType = {
    city_id: number | null
  }

  export type City_tableMinAggregateOutputType = {
    city_id: number | null
    city_name: string | null
    created_at: Date | null
    city_table_name: string | null
  }

  export type City_tableMaxAggregateOutputType = {
    city_id: number | null
    city_name: string | null
    created_at: Date | null
    city_table_name: string | null
  }

  export type City_tableCountAggregateOutputType = {
    city_id: number
    city_name: number
    geo_boundary: number
    created_at: number
    city_table_name: number
    _all: number
  }


  export type City_tableAvgAggregateInputType = {
    city_id?: true
  }

  export type City_tableSumAggregateInputType = {
    city_id?: true
  }

  export type City_tableMinAggregateInputType = {
    city_id?: true
    city_name?: true
    created_at?: true
    city_table_name?: true
  }

  export type City_tableMaxAggregateInputType = {
    city_id?: true
    city_name?: true
    created_at?: true
    city_table_name?: true
  }

  export type City_tableCountAggregateInputType = {
    city_id?: true
    city_name?: true
    geo_boundary?: true
    created_at?: true
    city_table_name?: true
    _all?: true
  }

  export type City_tableAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which city_table to aggregate.
     */
    where?: city_tableWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of city_tables to fetch.
     */
    orderBy?: city_tableOrderByWithRelationInput | city_tableOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: city_tableWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` city_tables from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` city_tables.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned city_tables
    **/
    _count?: true | City_tableCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: City_tableAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: City_tableSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: City_tableMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: City_tableMaxAggregateInputType
  }

  export type GetCity_tableAggregateType<T extends City_tableAggregateArgs> = {
        [P in keyof T & keyof AggregateCity_table]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCity_table[P]>
      : GetScalarType<T[P], AggregateCity_table[P]>
  }




  export type city_tableGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: city_tableWhereInput
    orderBy?: city_tableOrderByWithAggregationInput | city_tableOrderByWithAggregationInput[]
    by: City_tableScalarFieldEnum[] | City_tableScalarFieldEnum
    having?: city_tableScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: City_tableCountAggregateInputType | true
    _avg?: City_tableAvgAggregateInputType
    _sum?: City_tableSumAggregateInputType
    _min?: City_tableMinAggregateInputType
    _max?: City_tableMaxAggregateInputType
  }

  export type City_tableGroupByOutputType = {
    city_id: number
    city_name: string
    geo_boundary: JsonValue | null
    created_at: Date | null
    city_table_name: string | null
    _count: City_tableCountAggregateOutputType | null
    _avg: City_tableAvgAggregateOutputType | null
    _sum: City_tableSumAggregateOutputType | null
    _min: City_tableMinAggregateOutputType | null
    _max: City_tableMaxAggregateOutputType | null
  }

  type GetCity_tableGroupByPayload<T extends city_tableGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<City_tableGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof City_tableGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], City_tableGroupByOutputType[P]>
            : GetScalarType<T[P], City_tableGroupByOutputType[P]>
        }
      >
    >


  export type city_tableSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    city_id?: boolean
    city_name?: boolean
    geo_boundary?: boolean
    created_at?: boolean
    city_table_name?: boolean
  }, ExtArgs["result"]["city_table"]>

  export type city_tableSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    city_id?: boolean
    city_name?: boolean
    geo_boundary?: boolean
    created_at?: boolean
    city_table_name?: boolean
  }, ExtArgs["result"]["city_table"]>

  export type city_tableSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    city_id?: boolean
    city_name?: boolean
    geo_boundary?: boolean
    created_at?: boolean
    city_table_name?: boolean
  }, ExtArgs["result"]["city_table"]>

  export type city_tableSelectScalar = {
    city_id?: boolean
    city_name?: boolean
    geo_boundary?: boolean
    created_at?: boolean
    city_table_name?: boolean
  }

  export type city_tableOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"city_id" | "city_name" | "geo_boundary" | "created_at" | "city_table_name", ExtArgs["result"]["city_table"]>

  export type $city_tablePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "city_table"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      city_id: number
      city_name: string
      geo_boundary: Prisma.JsonValue | null
      created_at: Date | null
      city_table_name: string | null
    }, ExtArgs["result"]["city_table"]>
    composites: {}
  }

  type city_tableGetPayload<S extends boolean | null | undefined | city_tableDefaultArgs> = $Result.GetResult<Prisma.$city_tablePayload, S>

  type city_tableCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<city_tableFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: City_tableCountAggregateInputType | true
    }

  export interface city_tableDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['city_table'], meta: { name: 'city_table' } }
    /**
     * Find zero or one City_table that matches the filter.
     * @param {city_tableFindUniqueArgs} args - Arguments to find a City_table
     * @example
     * // Get one City_table
     * const city_table = await prisma.city_table.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends city_tableFindUniqueArgs>(args: SelectSubset<T, city_tableFindUniqueArgs<ExtArgs>>): Prisma__city_tableClient<$Result.GetResult<Prisma.$city_tablePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one City_table that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {city_tableFindUniqueOrThrowArgs} args - Arguments to find a City_table
     * @example
     * // Get one City_table
     * const city_table = await prisma.city_table.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends city_tableFindUniqueOrThrowArgs>(args: SelectSubset<T, city_tableFindUniqueOrThrowArgs<ExtArgs>>): Prisma__city_tableClient<$Result.GetResult<Prisma.$city_tablePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first City_table that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {city_tableFindFirstArgs} args - Arguments to find a City_table
     * @example
     * // Get one City_table
     * const city_table = await prisma.city_table.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends city_tableFindFirstArgs>(args?: SelectSubset<T, city_tableFindFirstArgs<ExtArgs>>): Prisma__city_tableClient<$Result.GetResult<Prisma.$city_tablePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first City_table that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {city_tableFindFirstOrThrowArgs} args - Arguments to find a City_table
     * @example
     * // Get one City_table
     * const city_table = await prisma.city_table.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends city_tableFindFirstOrThrowArgs>(args?: SelectSubset<T, city_tableFindFirstOrThrowArgs<ExtArgs>>): Prisma__city_tableClient<$Result.GetResult<Prisma.$city_tablePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more City_tables that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {city_tableFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all City_tables
     * const city_tables = await prisma.city_table.findMany()
     * 
     * // Get first 10 City_tables
     * const city_tables = await prisma.city_table.findMany({ take: 10 })
     * 
     * // Only select the `city_id`
     * const city_tableWithCity_idOnly = await prisma.city_table.findMany({ select: { city_id: true } })
     * 
     */
    findMany<T extends city_tableFindManyArgs>(args?: SelectSubset<T, city_tableFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$city_tablePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a City_table.
     * @param {city_tableCreateArgs} args - Arguments to create a City_table.
     * @example
     * // Create one City_table
     * const City_table = await prisma.city_table.create({
     *   data: {
     *     // ... data to create a City_table
     *   }
     * })
     * 
     */
    create<T extends city_tableCreateArgs>(args: SelectSubset<T, city_tableCreateArgs<ExtArgs>>): Prisma__city_tableClient<$Result.GetResult<Prisma.$city_tablePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many City_tables.
     * @param {city_tableCreateManyArgs} args - Arguments to create many City_tables.
     * @example
     * // Create many City_tables
     * const city_table = await prisma.city_table.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends city_tableCreateManyArgs>(args?: SelectSubset<T, city_tableCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many City_tables and returns the data saved in the database.
     * @param {city_tableCreateManyAndReturnArgs} args - Arguments to create many City_tables.
     * @example
     * // Create many City_tables
     * const city_table = await prisma.city_table.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many City_tables and only return the `city_id`
     * const city_tableWithCity_idOnly = await prisma.city_table.createManyAndReturn({
     *   select: { city_id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends city_tableCreateManyAndReturnArgs>(args?: SelectSubset<T, city_tableCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$city_tablePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a City_table.
     * @param {city_tableDeleteArgs} args - Arguments to delete one City_table.
     * @example
     * // Delete one City_table
     * const City_table = await prisma.city_table.delete({
     *   where: {
     *     // ... filter to delete one City_table
     *   }
     * })
     * 
     */
    delete<T extends city_tableDeleteArgs>(args: SelectSubset<T, city_tableDeleteArgs<ExtArgs>>): Prisma__city_tableClient<$Result.GetResult<Prisma.$city_tablePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one City_table.
     * @param {city_tableUpdateArgs} args - Arguments to update one City_table.
     * @example
     * // Update one City_table
     * const city_table = await prisma.city_table.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends city_tableUpdateArgs>(args: SelectSubset<T, city_tableUpdateArgs<ExtArgs>>): Prisma__city_tableClient<$Result.GetResult<Prisma.$city_tablePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more City_tables.
     * @param {city_tableDeleteManyArgs} args - Arguments to filter City_tables to delete.
     * @example
     * // Delete a few City_tables
     * const { count } = await prisma.city_table.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends city_tableDeleteManyArgs>(args?: SelectSubset<T, city_tableDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more City_tables.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {city_tableUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many City_tables
     * const city_table = await prisma.city_table.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends city_tableUpdateManyArgs>(args: SelectSubset<T, city_tableUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more City_tables and returns the data updated in the database.
     * @param {city_tableUpdateManyAndReturnArgs} args - Arguments to update many City_tables.
     * @example
     * // Update many City_tables
     * const city_table = await prisma.city_table.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more City_tables and only return the `city_id`
     * const city_tableWithCity_idOnly = await prisma.city_table.updateManyAndReturn({
     *   select: { city_id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends city_tableUpdateManyAndReturnArgs>(args: SelectSubset<T, city_tableUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$city_tablePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one City_table.
     * @param {city_tableUpsertArgs} args - Arguments to update or create a City_table.
     * @example
     * // Update or create a City_table
     * const city_table = await prisma.city_table.upsert({
     *   create: {
     *     // ... data to create a City_table
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the City_table we want to update
     *   }
     * })
     */
    upsert<T extends city_tableUpsertArgs>(args: SelectSubset<T, city_tableUpsertArgs<ExtArgs>>): Prisma__city_tableClient<$Result.GetResult<Prisma.$city_tablePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of City_tables.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {city_tableCountArgs} args - Arguments to filter City_tables to count.
     * @example
     * // Count the number of City_tables
     * const count = await prisma.city_table.count({
     *   where: {
     *     // ... the filter for the City_tables we want to count
     *   }
     * })
    **/
    count<T extends city_tableCountArgs>(
      args?: Subset<T, city_tableCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], City_tableCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a City_table.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {City_tableAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends City_tableAggregateArgs>(args: Subset<T, City_tableAggregateArgs>): Prisma.PrismaPromise<GetCity_tableAggregateType<T>>

    /**
     * Group by City_table.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {city_tableGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends city_tableGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: city_tableGroupByArgs['orderBy'] }
        : { orderBy?: city_tableGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, city_tableGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCity_tableGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the city_table model
   */
  readonly fields: city_tableFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for city_table.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__city_tableClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the city_table model
   */
  interface city_tableFieldRefs {
    readonly city_id: FieldRef<"city_table", 'Int'>
    readonly city_name: FieldRef<"city_table", 'String'>
    readonly geo_boundary: FieldRef<"city_table", 'Json'>
    readonly created_at: FieldRef<"city_table", 'DateTime'>
    readonly city_table_name: FieldRef<"city_table", 'String'>
  }
    

  // Custom InputTypes
  /**
   * city_table findUnique
   */
  export type city_tableFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the city_table
     */
    select?: city_tableSelect<ExtArgs> | null
    /**
     * Omit specific fields from the city_table
     */
    omit?: city_tableOmit<ExtArgs> | null
    /**
     * Filter, which city_table to fetch.
     */
    where: city_tableWhereUniqueInput
  }

  /**
   * city_table findUniqueOrThrow
   */
  export type city_tableFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the city_table
     */
    select?: city_tableSelect<ExtArgs> | null
    /**
     * Omit specific fields from the city_table
     */
    omit?: city_tableOmit<ExtArgs> | null
    /**
     * Filter, which city_table to fetch.
     */
    where: city_tableWhereUniqueInput
  }

  /**
   * city_table findFirst
   */
  export type city_tableFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the city_table
     */
    select?: city_tableSelect<ExtArgs> | null
    /**
     * Omit specific fields from the city_table
     */
    omit?: city_tableOmit<ExtArgs> | null
    /**
     * Filter, which city_table to fetch.
     */
    where?: city_tableWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of city_tables to fetch.
     */
    orderBy?: city_tableOrderByWithRelationInput | city_tableOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for city_tables.
     */
    cursor?: city_tableWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` city_tables from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` city_tables.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of city_tables.
     */
    distinct?: City_tableScalarFieldEnum | City_tableScalarFieldEnum[]
  }

  /**
   * city_table findFirstOrThrow
   */
  export type city_tableFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the city_table
     */
    select?: city_tableSelect<ExtArgs> | null
    /**
     * Omit specific fields from the city_table
     */
    omit?: city_tableOmit<ExtArgs> | null
    /**
     * Filter, which city_table to fetch.
     */
    where?: city_tableWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of city_tables to fetch.
     */
    orderBy?: city_tableOrderByWithRelationInput | city_tableOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for city_tables.
     */
    cursor?: city_tableWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` city_tables from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` city_tables.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of city_tables.
     */
    distinct?: City_tableScalarFieldEnum | City_tableScalarFieldEnum[]
  }

  /**
   * city_table findMany
   */
  export type city_tableFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the city_table
     */
    select?: city_tableSelect<ExtArgs> | null
    /**
     * Omit specific fields from the city_table
     */
    omit?: city_tableOmit<ExtArgs> | null
    /**
     * Filter, which city_tables to fetch.
     */
    where?: city_tableWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of city_tables to fetch.
     */
    orderBy?: city_tableOrderByWithRelationInput | city_tableOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing city_tables.
     */
    cursor?: city_tableWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` city_tables from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` city_tables.
     */
    skip?: number
    distinct?: City_tableScalarFieldEnum | City_tableScalarFieldEnum[]
  }

  /**
   * city_table create
   */
  export type city_tableCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the city_table
     */
    select?: city_tableSelect<ExtArgs> | null
    /**
     * Omit specific fields from the city_table
     */
    omit?: city_tableOmit<ExtArgs> | null
    /**
     * The data needed to create a city_table.
     */
    data: XOR<city_tableCreateInput, city_tableUncheckedCreateInput>
  }

  /**
   * city_table createMany
   */
  export type city_tableCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many city_tables.
     */
    data: city_tableCreateManyInput | city_tableCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * city_table createManyAndReturn
   */
  export type city_tableCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the city_table
     */
    select?: city_tableSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the city_table
     */
    omit?: city_tableOmit<ExtArgs> | null
    /**
     * The data used to create many city_tables.
     */
    data: city_tableCreateManyInput | city_tableCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * city_table update
   */
  export type city_tableUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the city_table
     */
    select?: city_tableSelect<ExtArgs> | null
    /**
     * Omit specific fields from the city_table
     */
    omit?: city_tableOmit<ExtArgs> | null
    /**
     * The data needed to update a city_table.
     */
    data: XOR<city_tableUpdateInput, city_tableUncheckedUpdateInput>
    /**
     * Choose, which city_table to update.
     */
    where: city_tableWhereUniqueInput
  }

  /**
   * city_table updateMany
   */
  export type city_tableUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update city_tables.
     */
    data: XOR<city_tableUpdateManyMutationInput, city_tableUncheckedUpdateManyInput>
    /**
     * Filter which city_tables to update
     */
    where?: city_tableWhereInput
    /**
     * Limit how many city_tables to update.
     */
    limit?: number
  }

  /**
   * city_table updateManyAndReturn
   */
  export type city_tableUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the city_table
     */
    select?: city_tableSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the city_table
     */
    omit?: city_tableOmit<ExtArgs> | null
    /**
     * The data used to update city_tables.
     */
    data: XOR<city_tableUpdateManyMutationInput, city_tableUncheckedUpdateManyInput>
    /**
     * Filter which city_tables to update
     */
    where?: city_tableWhereInput
    /**
     * Limit how many city_tables to update.
     */
    limit?: number
  }

  /**
   * city_table upsert
   */
  export type city_tableUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the city_table
     */
    select?: city_tableSelect<ExtArgs> | null
    /**
     * Omit specific fields from the city_table
     */
    omit?: city_tableOmit<ExtArgs> | null
    /**
     * The filter to search for the city_table to update in case it exists.
     */
    where: city_tableWhereUniqueInput
    /**
     * In case the city_table found by the `where` argument doesn't exist, create a new city_table with this data.
     */
    create: XOR<city_tableCreateInput, city_tableUncheckedCreateInput>
    /**
     * In case the city_table was found with the provided `where` argument, update it with this data.
     */
    update: XOR<city_tableUpdateInput, city_tableUncheckedUpdateInput>
  }

  /**
   * city_table delete
   */
  export type city_tableDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the city_table
     */
    select?: city_tableSelect<ExtArgs> | null
    /**
     * Omit specific fields from the city_table
     */
    omit?: city_tableOmit<ExtArgs> | null
    /**
     * Filter which city_table to delete.
     */
    where: city_tableWhereUniqueInput
  }

  /**
   * city_table deleteMany
   */
  export type city_tableDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which city_tables to delete
     */
    where?: city_tableWhereInput
    /**
     * Limit how many city_tables to delete.
     */
    limit?: number
  }

  /**
   * city_table without action
   */
  export type city_tableDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the city_table
     */
    select?: city_tableSelect<ExtArgs> | null
    /**
     * Omit specific fields from the city_table
     */
    omit?: city_tableOmit<ExtArgs> | null
  }


  /**
   * Model master_citizen_map
   */

  export type AggregateMaster_citizen_map = {
    _count: Master_citizen_mapCountAggregateOutputType | null
    _avg: Master_citizen_mapAvgAggregateOutputType | null
    _sum: Master_citizen_mapSumAggregateOutputType | null
    _min: Master_citizen_mapMinAggregateOutputType | null
    _max: Master_citizen_mapMaxAggregateOutputType | null
  }

  export type Master_citizen_mapAvgAggregateOutputType = {
    id: number | null
    ward_id: number | null
  }

  export type Master_citizen_mapSumAggregateOutputType = {
    id: number | null
    ward_id: number | null
  }

  export type Master_citizen_mapMinAggregateOutputType = {
    id: number | null
    phone_number: string | null
    ward_id: number | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type Master_citizen_mapMaxAggregateOutputType = {
    id: number | null
    phone_number: string | null
    ward_id: number | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type Master_citizen_mapCountAggregateOutputType = {
    id: number
    phone_number: number
    ward_id: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type Master_citizen_mapAvgAggregateInputType = {
    id?: true
    ward_id?: true
  }

  export type Master_citizen_mapSumAggregateInputType = {
    id?: true
    ward_id?: true
  }

  export type Master_citizen_mapMinAggregateInputType = {
    id?: true
    phone_number?: true
    ward_id?: true
    created_at?: true
    updated_at?: true
  }

  export type Master_citizen_mapMaxAggregateInputType = {
    id?: true
    phone_number?: true
    ward_id?: true
    created_at?: true
    updated_at?: true
  }

  export type Master_citizen_mapCountAggregateInputType = {
    id?: true
    phone_number?: true
    ward_id?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type Master_citizen_mapAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which master_citizen_map to aggregate.
     */
    where?: master_citizen_mapWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of master_citizen_maps to fetch.
     */
    orderBy?: master_citizen_mapOrderByWithRelationInput | master_citizen_mapOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: master_citizen_mapWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` master_citizen_maps from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` master_citizen_maps.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned master_citizen_maps
    **/
    _count?: true | Master_citizen_mapCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Master_citizen_mapAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Master_citizen_mapSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Master_citizen_mapMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Master_citizen_mapMaxAggregateInputType
  }

  export type GetMaster_citizen_mapAggregateType<T extends Master_citizen_mapAggregateArgs> = {
        [P in keyof T & keyof AggregateMaster_citizen_map]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMaster_citizen_map[P]>
      : GetScalarType<T[P], AggregateMaster_citizen_map[P]>
  }




  export type master_citizen_mapGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: master_citizen_mapWhereInput
    orderBy?: master_citizen_mapOrderByWithAggregationInput | master_citizen_mapOrderByWithAggregationInput[]
    by: Master_citizen_mapScalarFieldEnum[] | Master_citizen_mapScalarFieldEnum
    having?: master_citizen_mapScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Master_citizen_mapCountAggregateInputType | true
    _avg?: Master_citizen_mapAvgAggregateInputType
    _sum?: Master_citizen_mapSumAggregateInputType
    _min?: Master_citizen_mapMinAggregateInputType
    _max?: Master_citizen_mapMaxAggregateInputType
  }

  export type Master_citizen_mapGroupByOutputType = {
    id: number
    phone_number: string
    ward_id: number
    created_at: Date
    updated_at: Date
    _count: Master_citizen_mapCountAggregateOutputType | null
    _avg: Master_citizen_mapAvgAggregateOutputType | null
    _sum: Master_citizen_mapSumAggregateOutputType | null
    _min: Master_citizen_mapMinAggregateOutputType | null
    _max: Master_citizen_mapMaxAggregateOutputType | null
  }

  type GetMaster_citizen_mapGroupByPayload<T extends master_citizen_mapGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Master_citizen_mapGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Master_citizen_mapGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Master_citizen_mapGroupByOutputType[P]>
            : GetScalarType<T[P], Master_citizen_mapGroupByOutputType[P]>
        }
      >
    >


  export type master_citizen_mapSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    phone_number?: boolean
    ward_id?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["master_citizen_map"]>

  export type master_citizen_mapSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    phone_number?: boolean
    ward_id?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["master_citizen_map"]>

  export type master_citizen_mapSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    phone_number?: boolean
    ward_id?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["master_citizen_map"]>

  export type master_citizen_mapSelectScalar = {
    id?: boolean
    phone_number?: boolean
    ward_id?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type master_citizen_mapOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "phone_number" | "ward_id" | "created_at" | "updated_at", ExtArgs["result"]["master_citizen_map"]>

  export type $master_citizen_mapPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "master_citizen_map"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      phone_number: string
      ward_id: number
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["master_citizen_map"]>
    composites: {}
  }

  type master_citizen_mapGetPayload<S extends boolean | null | undefined | master_citizen_mapDefaultArgs> = $Result.GetResult<Prisma.$master_citizen_mapPayload, S>

  type master_citizen_mapCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<master_citizen_mapFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Master_citizen_mapCountAggregateInputType | true
    }

  export interface master_citizen_mapDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['master_citizen_map'], meta: { name: 'master_citizen_map' } }
    /**
     * Find zero or one Master_citizen_map that matches the filter.
     * @param {master_citizen_mapFindUniqueArgs} args - Arguments to find a Master_citizen_map
     * @example
     * // Get one Master_citizen_map
     * const master_citizen_map = await prisma.master_citizen_map.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends master_citizen_mapFindUniqueArgs>(args: SelectSubset<T, master_citizen_mapFindUniqueArgs<ExtArgs>>): Prisma__master_citizen_mapClient<$Result.GetResult<Prisma.$master_citizen_mapPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Master_citizen_map that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {master_citizen_mapFindUniqueOrThrowArgs} args - Arguments to find a Master_citizen_map
     * @example
     * // Get one Master_citizen_map
     * const master_citizen_map = await prisma.master_citizen_map.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends master_citizen_mapFindUniqueOrThrowArgs>(args: SelectSubset<T, master_citizen_mapFindUniqueOrThrowArgs<ExtArgs>>): Prisma__master_citizen_mapClient<$Result.GetResult<Prisma.$master_citizen_mapPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Master_citizen_map that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {master_citizen_mapFindFirstArgs} args - Arguments to find a Master_citizen_map
     * @example
     * // Get one Master_citizen_map
     * const master_citizen_map = await prisma.master_citizen_map.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends master_citizen_mapFindFirstArgs>(args?: SelectSubset<T, master_citizen_mapFindFirstArgs<ExtArgs>>): Prisma__master_citizen_mapClient<$Result.GetResult<Prisma.$master_citizen_mapPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Master_citizen_map that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {master_citizen_mapFindFirstOrThrowArgs} args - Arguments to find a Master_citizen_map
     * @example
     * // Get one Master_citizen_map
     * const master_citizen_map = await prisma.master_citizen_map.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends master_citizen_mapFindFirstOrThrowArgs>(args?: SelectSubset<T, master_citizen_mapFindFirstOrThrowArgs<ExtArgs>>): Prisma__master_citizen_mapClient<$Result.GetResult<Prisma.$master_citizen_mapPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Master_citizen_maps that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {master_citizen_mapFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Master_citizen_maps
     * const master_citizen_maps = await prisma.master_citizen_map.findMany()
     * 
     * // Get first 10 Master_citizen_maps
     * const master_citizen_maps = await prisma.master_citizen_map.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const master_citizen_mapWithIdOnly = await prisma.master_citizen_map.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends master_citizen_mapFindManyArgs>(args?: SelectSubset<T, master_citizen_mapFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$master_citizen_mapPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Master_citizen_map.
     * @param {master_citizen_mapCreateArgs} args - Arguments to create a Master_citizen_map.
     * @example
     * // Create one Master_citizen_map
     * const Master_citizen_map = await prisma.master_citizen_map.create({
     *   data: {
     *     // ... data to create a Master_citizen_map
     *   }
     * })
     * 
     */
    create<T extends master_citizen_mapCreateArgs>(args: SelectSubset<T, master_citizen_mapCreateArgs<ExtArgs>>): Prisma__master_citizen_mapClient<$Result.GetResult<Prisma.$master_citizen_mapPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Master_citizen_maps.
     * @param {master_citizen_mapCreateManyArgs} args - Arguments to create many Master_citizen_maps.
     * @example
     * // Create many Master_citizen_maps
     * const master_citizen_map = await prisma.master_citizen_map.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends master_citizen_mapCreateManyArgs>(args?: SelectSubset<T, master_citizen_mapCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Master_citizen_maps and returns the data saved in the database.
     * @param {master_citizen_mapCreateManyAndReturnArgs} args - Arguments to create many Master_citizen_maps.
     * @example
     * // Create many Master_citizen_maps
     * const master_citizen_map = await prisma.master_citizen_map.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Master_citizen_maps and only return the `id`
     * const master_citizen_mapWithIdOnly = await prisma.master_citizen_map.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends master_citizen_mapCreateManyAndReturnArgs>(args?: SelectSubset<T, master_citizen_mapCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$master_citizen_mapPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Master_citizen_map.
     * @param {master_citizen_mapDeleteArgs} args - Arguments to delete one Master_citizen_map.
     * @example
     * // Delete one Master_citizen_map
     * const Master_citizen_map = await prisma.master_citizen_map.delete({
     *   where: {
     *     // ... filter to delete one Master_citizen_map
     *   }
     * })
     * 
     */
    delete<T extends master_citizen_mapDeleteArgs>(args: SelectSubset<T, master_citizen_mapDeleteArgs<ExtArgs>>): Prisma__master_citizen_mapClient<$Result.GetResult<Prisma.$master_citizen_mapPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Master_citizen_map.
     * @param {master_citizen_mapUpdateArgs} args - Arguments to update one Master_citizen_map.
     * @example
     * // Update one Master_citizen_map
     * const master_citizen_map = await prisma.master_citizen_map.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends master_citizen_mapUpdateArgs>(args: SelectSubset<T, master_citizen_mapUpdateArgs<ExtArgs>>): Prisma__master_citizen_mapClient<$Result.GetResult<Prisma.$master_citizen_mapPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Master_citizen_maps.
     * @param {master_citizen_mapDeleteManyArgs} args - Arguments to filter Master_citizen_maps to delete.
     * @example
     * // Delete a few Master_citizen_maps
     * const { count } = await prisma.master_citizen_map.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends master_citizen_mapDeleteManyArgs>(args?: SelectSubset<T, master_citizen_mapDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Master_citizen_maps.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {master_citizen_mapUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Master_citizen_maps
     * const master_citizen_map = await prisma.master_citizen_map.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends master_citizen_mapUpdateManyArgs>(args: SelectSubset<T, master_citizen_mapUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Master_citizen_maps and returns the data updated in the database.
     * @param {master_citizen_mapUpdateManyAndReturnArgs} args - Arguments to update many Master_citizen_maps.
     * @example
     * // Update many Master_citizen_maps
     * const master_citizen_map = await prisma.master_citizen_map.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Master_citizen_maps and only return the `id`
     * const master_citizen_mapWithIdOnly = await prisma.master_citizen_map.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends master_citizen_mapUpdateManyAndReturnArgs>(args: SelectSubset<T, master_citizen_mapUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$master_citizen_mapPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Master_citizen_map.
     * @param {master_citizen_mapUpsertArgs} args - Arguments to update or create a Master_citizen_map.
     * @example
     * // Update or create a Master_citizen_map
     * const master_citizen_map = await prisma.master_citizen_map.upsert({
     *   create: {
     *     // ... data to create a Master_citizen_map
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Master_citizen_map we want to update
     *   }
     * })
     */
    upsert<T extends master_citizen_mapUpsertArgs>(args: SelectSubset<T, master_citizen_mapUpsertArgs<ExtArgs>>): Prisma__master_citizen_mapClient<$Result.GetResult<Prisma.$master_citizen_mapPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Master_citizen_maps.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {master_citizen_mapCountArgs} args - Arguments to filter Master_citizen_maps to count.
     * @example
     * // Count the number of Master_citizen_maps
     * const count = await prisma.master_citizen_map.count({
     *   where: {
     *     // ... the filter for the Master_citizen_maps we want to count
     *   }
     * })
    **/
    count<T extends master_citizen_mapCountArgs>(
      args?: Subset<T, master_citizen_mapCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Master_citizen_mapCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Master_citizen_map.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Master_citizen_mapAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Master_citizen_mapAggregateArgs>(args: Subset<T, Master_citizen_mapAggregateArgs>): Prisma.PrismaPromise<GetMaster_citizen_mapAggregateType<T>>

    /**
     * Group by Master_citizen_map.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {master_citizen_mapGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends master_citizen_mapGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: master_citizen_mapGroupByArgs['orderBy'] }
        : { orderBy?: master_citizen_mapGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, master_citizen_mapGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMaster_citizen_mapGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the master_citizen_map model
   */
  readonly fields: master_citizen_mapFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for master_citizen_map.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__master_citizen_mapClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the master_citizen_map model
   */
  interface master_citizen_mapFieldRefs {
    readonly id: FieldRef<"master_citizen_map", 'Int'>
    readonly phone_number: FieldRef<"master_citizen_map", 'String'>
    readonly ward_id: FieldRef<"master_citizen_map", 'Int'>
    readonly created_at: FieldRef<"master_citizen_map", 'DateTime'>
    readonly updated_at: FieldRef<"master_citizen_map", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * master_citizen_map findUnique
   */
  export type master_citizen_mapFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the master_citizen_map
     */
    select?: master_citizen_mapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the master_citizen_map
     */
    omit?: master_citizen_mapOmit<ExtArgs> | null
    /**
     * Filter, which master_citizen_map to fetch.
     */
    where: master_citizen_mapWhereUniqueInput
  }

  /**
   * master_citizen_map findUniqueOrThrow
   */
  export type master_citizen_mapFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the master_citizen_map
     */
    select?: master_citizen_mapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the master_citizen_map
     */
    omit?: master_citizen_mapOmit<ExtArgs> | null
    /**
     * Filter, which master_citizen_map to fetch.
     */
    where: master_citizen_mapWhereUniqueInput
  }

  /**
   * master_citizen_map findFirst
   */
  export type master_citizen_mapFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the master_citizen_map
     */
    select?: master_citizen_mapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the master_citizen_map
     */
    omit?: master_citizen_mapOmit<ExtArgs> | null
    /**
     * Filter, which master_citizen_map to fetch.
     */
    where?: master_citizen_mapWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of master_citizen_maps to fetch.
     */
    orderBy?: master_citizen_mapOrderByWithRelationInput | master_citizen_mapOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for master_citizen_maps.
     */
    cursor?: master_citizen_mapWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` master_citizen_maps from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` master_citizen_maps.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of master_citizen_maps.
     */
    distinct?: Master_citizen_mapScalarFieldEnum | Master_citizen_mapScalarFieldEnum[]
  }

  /**
   * master_citizen_map findFirstOrThrow
   */
  export type master_citizen_mapFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the master_citizen_map
     */
    select?: master_citizen_mapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the master_citizen_map
     */
    omit?: master_citizen_mapOmit<ExtArgs> | null
    /**
     * Filter, which master_citizen_map to fetch.
     */
    where?: master_citizen_mapWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of master_citizen_maps to fetch.
     */
    orderBy?: master_citizen_mapOrderByWithRelationInput | master_citizen_mapOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for master_citizen_maps.
     */
    cursor?: master_citizen_mapWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` master_citizen_maps from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` master_citizen_maps.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of master_citizen_maps.
     */
    distinct?: Master_citizen_mapScalarFieldEnum | Master_citizen_mapScalarFieldEnum[]
  }

  /**
   * master_citizen_map findMany
   */
  export type master_citizen_mapFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the master_citizen_map
     */
    select?: master_citizen_mapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the master_citizen_map
     */
    omit?: master_citizen_mapOmit<ExtArgs> | null
    /**
     * Filter, which master_citizen_maps to fetch.
     */
    where?: master_citizen_mapWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of master_citizen_maps to fetch.
     */
    orderBy?: master_citizen_mapOrderByWithRelationInput | master_citizen_mapOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing master_citizen_maps.
     */
    cursor?: master_citizen_mapWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` master_citizen_maps from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` master_citizen_maps.
     */
    skip?: number
    distinct?: Master_citizen_mapScalarFieldEnum | Master_citizen_mapScalarFieldEnum[]
  }

  /**
   * master_citizen_map create
   */
  export type master_citizen_mapCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the master_citizen_map
     */
    select?: master_citizen_mapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the master_citizen_map
     */
    omit?: master_citizen_mapOmit<ExtArgs> | null
    /**
     * The data needed to create a master_citizen_map.
     */
    data: XOR<master_citizen_mapCreateInput, master_citizen_mapUncheckedCreateInput>
  }

  /**
   * master_citizen_map createMany
   */
  export type master_citizen_mapCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many master_citizen_maps.
     */
    data: master_citizen_mapCreateManyInput | master_citizen_mapCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * master_citizen_map createManyAndReturn
   */
  export type master_citizen_mapCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the master_citizen_map
     */
    select?: master_citizen_mapSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the master_citizen_map
     */
    omit?: master_citizen_mapOmit<ExtArgs> | null
    /**
     * The data used to create many master_citizen_maps.
     */
    data: master_citizen_mapCreateManyInput | master_citizen_mapCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * master_citizen_map update
   */
  export type master_citizen_mapUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the master_citizen_map
     */
    select?: master_citizen_mapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the master_citizen_map
     */
    omit?: master_citizen_mapOmit<ExtArgs> | null
    /**
     * The data needed to update a master_citizen_map.
     */
    data: XOR<master_citizen_mapUpdateInput, master_citizen_mapUncheckedUpdateInput>
    /**
     * Choose, which master_citizen_map to update.
     */
    where: master_citizen_mapWhereUniqueInput
  }

  /**
   * master_citizen_map updateMany
   */
  export type master_citizen_mapUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update master_citizen_maps.
     */
    data: XOR<master_citizen_mapUpdateManyMutationInput, master_citizen_mapUncheckedUpdateManyInput>
    /**
     * Filter which master_citizen_maps to update
     */
    where?: master_citizen_mapWhereInput
    /**
     * Limit how many master_citizen_maps to update.
     */
    limit?: number
  }

  /**
   * master_citizen_map updateManyAndReturn
   */
  export type master_citizen_mapUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the master_citizen_map
     */
    select?: master_citizen_mapSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the master_citizen_map
     */
    omit?: master_citizen_mapOmit<ExtArgs> | null
    /**
     * The data used to update master_citizen_maps.
     */
    data: XOR<master_citizen_mapUpdateManyMutationInput, master_citizen_mapUncheckedUpdateManyInput>
    /**
     * Filter which master_citizen_maps to update
     */
    where?: master_citizen_mapWhereInput
    /**
     * Limit how many master_citizen_maps to update.
     */
    limit?: number
  }

  /**
   * master_citizen_map upsert
   */
  export type master_citizen_mapUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the master_citizen_map
     */
    select?: master_citizen_mapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the master_citizen_map
     */
    omit?: master_citizen_mapOmit<ExtArgs> | null
    /**
     * The filter to search for the master_citizen_map to update in case it exists.
     */
    where: master_citizen_mapWhereUniqueInput
    /**
     * In case the master_citizen_map found by the `where` argument doesn't exist, create a new master_citizen_map with this data.
     */
    create: XOR<master_citizen_mapCreateInput, master_citizen_mapUncheckedCreateInput>
    /**
     * In case the master_citizen_map was found with the provided `where` argument, update it with this data.
     */
    update: XOR<master_citizen_mapUpdateInput, master_citizen_mapUncheckedUpdateInput>
  }

  /**
   * master_citizen_map delete
   */
  export type master_citizen_mapDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the master_citizen_map
     */
    select?: master_citizen_mapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the master_citizen_map
     */
    omit?: master_citizen_mapOmit<ExtArgs> | null
    /**
     * Filter which master_citizen_map to delete.
     */
    where: master_citizen_mapWhereUniqueInput
  }

  /**
   * master_citizen_map deleteMany
   */
  export type master_citizen_mapDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which master_citizen_maps to delete
     */
    where?: master_citizen_mapWhereInput
    /**
     * Limit how many master_citizen_maps to delete.
     */
    limit?: number
  }

  /**
   * master_citizen_map without action
   */
  export type master_citizen_mapDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the master_citizen_map
     */
    select?: master_citizen_mapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the master_citizen_map
     */
    omit?: master_citizen_mapOmit<ExtArgs> | null
  }


  /**
   * Model master_citizen_map_backup
   */

  export type AggregateMaster_citizen_map_backup = {
    _count: Master_citizen_map_backupCountAggregateOutputType | null
    _avg: Master_citizen_map_backupAvgAggregateOutputType | null
    _sum: Master_citizen_map_backupSumAggregateOutputType | null
    _min: Master_citizen_map_backupMinAggregateOutputType | null
    _max: Master_citizen_map_backupMaxAggregateOutputType | null
  }

  export type Master_citizen_map_backupAvgAggregateOutputType = {
    id: number | null
    ward_id: number | null
  }

  export type Master_citizen_map_backupSumAggregateOutputType = {
    id: number | null
    ward_id: number | null
  }

  export type Master_citizen_map_backupMinAggregateOutputType = {
    id: number | null
    phone_number: string | null
    ward_id: number | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type Master_citizen_map_backupMaxAggregateOutputType = {
    id: number | null
    phone_number: string | null
    ward_id: number | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type Master_citizen_map_backupCountAggregateOutputType = {
    id: number
    phone_number: number
    ward_id: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type Master_citizen_map_backupAvgAggregateInputType = {
    id?: true
    ward_id?: true
  }

  export type Master_citizen_map_backupSumAggregateInputType = {
    id?: true
    ward_id?: true
  }

  export type Master_citizen_map_backupMinAggregateInputType = {
    id?: true
    phone_number?: true
    ward_id?: true
    created_at?: true
    updated_at?: true
  }

  export type Master_citizen_map_backupMaxAggregateInputType = {
    id?: true
    phone_number?: true
    ward_id?: true
    created_at?: true
    updated_at?: true
  }

  export type Master_citizen_map_backupCountAggregateInputType = {
    id?: true
    phone_number?: true
    ward_id?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type Master_citizen_map_backupAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which master_citizen_map_backup to aggregate.
     */
    where?: master_citizen_map_backupWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of master_citizen_map_backups to fetch.
     */
    orderBy?: master_citizen_map_backupOrderByWithRelationInput | master_citizen_map_backupOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: master_citizen_map_backupWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` master_citizen_map_backups from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` master_citizen_map_backups.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned master_citizen_map_backups
    **/
    _count?: true | Master_citizen_map_backupCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Master_citizen_map_backupAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Master_citizen_map_backupSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Master_citizen_map_backupMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Master_citizen_map_backupMaxAggregateInputType
  }

  export type GetMaster_citizen_map_backupAggregateType<T extends Master_citizen_map_backupAggregateArgs> = {
        [P in keyof T & keyof AggregateMaster_citizen_map_backup]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMaster_citizen_map_backup[P]>
      : GetScalarType<T[P], AggregateMaster_citizen_map_backup[P]>
  }




  export type master_citizen_map_backupGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: master_citizen_map_backupWhereInput
    orderBy?: master_citizen_map_backupOrderByWithAggregationInput | master_citizen_map_backupOrderByWithAggregationInput[]
    by: Master_citizen_map_backupScalarFieldEnum[] | Master_citizen_map_backupScalarFieldEnum
    having?: master_citizen_map_backupScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Master_citizen_map_backupCountAggregateInputType | true
    _avg?: Master_citizen_map_backupAvgAggregateInputType
    _sum?: Master_citizen_map_backupSumAggregateInputType
    _min?: Master_citizen_map_backupMinAggregateInputType
    _max?: Master_citizen_map_backupMaxAggregateInputType
  }

  export type Master_citizen_map_backupGroupByOutputType = {
    id: number
    phone_number: string
    ward_id: number
    created_at: Date
    updated_at: Date
    _count: Master_citizen_map_backupCountAggregateOutputType | null
    _avg: Master_citizen_map_backupAvgAggregateOutputType | null
    _sum: Master_citizen_map_backupSumAggregateOutputType | null
    _min: Master_citizen_map_backupMinAggregateOutputType | null
    _max: Master_citizen_map_backupMaxAggregateOutputType | null
  }

  type GetMaster_citizen_map_backupGroupByPayload<T extends master_citizen_map_backupGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Master_citizen_map_backupGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Master_citizen_map_backupGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Master_citizen_map_backupGroupByOutputType[P]>
            : GetScalarType<T[P], Master_citizen_map_backupGroupByOutputType[P]>
        }
      >
    >


  export type master_citizen_map_backupSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    phone_number?: boolean
    ward_id?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["master_citizen_map_backup"]>

  export type master_citizen_map_backupSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    phone_number?: boolean
    ward_id?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["master_citizen_map_backup"]>

  export type master_citizen_map_backupSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    phone_number?: boolean
    ward_id?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["master_citizen_map_backup"]>

  export type master_citizen_map_backupSelectScalar = {
    id?: boolean
    phone_number?: boolean
    ward_id?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type master_citizen_map_backupOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "phone_number" | "ward_id" | "created_at" | "updated_at", ExtArgs["result"]["master_citizen_map_backup"]>

  export type $master_citizen_map_backupPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "master_citizen_map_backup"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      phone_number: string
      ward_id: number
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["master_citizen_map_backup"]>
    composites: {}
  }

  type master_citizen_map_backupGetPayload<S extends boolean | null | undefined | master_citizen_map_backupDefaultArgs> = $Result.GetResult<Prisma.$master_citizen_map_backupPayload, S>

  type master_citizen_map_backupCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<master_citizen_map_backupFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Master_citizen_map_backupCountAggregateInputType | true
    }

  export interface master_citizen_map_backupDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['master_citizen_map_backup'], meta: { name: 'master_citizen_map_backup' } }
    /**
     * Find zero or one Master_citizen_map_backup that matches the filter.
     * @param {master_citizen_map_backupFindUniqueArgs} args - Arguments to find a Master_citizen_map_backup
     * @example
     * // Get one Master_citizen_map_backup
     * const master_citizen_map_backup = await prisma.master_citizen_map_backup.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends master_citizen_map_backupFindUniqueArgs>(args: SelectSubset<T, master_citizen_map_backupFindUniqueArgs<ExtArgs>>): Prisma__master_citizen_map_backupClient<$Result.GetResult<Prisma.$master_citizen_map_backupPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Master_citizen_map_backup that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {master_citizen_map_backupFindUniqueOrThrowArgs} args - Arguments to find a Master_citizen_map_backup
     * @example
     * // Get one Master_citizen_map_backup
     * const master_citizen_map_backup = await prisma.master_citizen_map_backup.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends master_citizen_map_backupFindUniqueOrThrowArgs>(args: SelectSubset<T, master_citizen_map_backupFindUniqueOrThrowArgs<ExtArgs>>): Prisma__master_citizen_map_backupClient<$Result.GetResult<Prisma.$master_citizen_map_backupPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Master_citizen_map_backup that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {master_citizen_map_backupFindFirstArgs} args - Arguments to find a Master_citizen_map_backup
     * @example
     * // Get one Master_citizen_map_backup
     * const master_citizen_map_backup = await prisma.master_citizen_map_backup.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends master_citizen_map_backupFindFirstArgs>(args?: SelectSubset<T, master_citizen_map_backupFindFirstArgs<ExtArgs>>): Prisma__master_citizen_map_backupClient<$Result.GetResult<Prisma.$master_citizen_map_backupPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Master_citizen_map_backup that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {master_citizen_map_backupFindFirstOrThrowArgs} args - Arguments to find a Master_citizen_map_backup
     * @example
     * // Get one Master_citizen_map_backup
     * const master_citizen_map_backup = await prisma.master_citizen_map_backup.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends master_citizen_map_backupFindFirstOrThrowArgs>(args?: SelectSubset<T, master_citizen_map_backupFindFirstOrThrowArgs<ExtArgs>>): Prisma__master_citizen_map_backupClient<$Result.GetResult<Prisma.$master_citizen_map_backupPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Master_citizen_map_backups that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {master_citizen_map_backupFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Master_citizen_map_backups
     * const master_citizen_map_backups = await prisma.master_citizen_map_backup.findMany()
     * 
     * // Get first 10 Master_citizen_map_backups
     * const master_citizen_map_backups = await prisma.master_citizen_map_backup.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const master_citizen_map_backupWithIdOnly = await prisma.master_citizen_map_backup.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends master_citizen_map_backupFindManyArgs>(args?: SelectSubset<T, master_citizen_map_backupFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$master_citizen_map_backupPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Master_citizen_map_backup.
     * @param {master_citizen_map_backupCreateArgs} args - Arguments to create a Master_citizen_map_backup.
     * @example
     * // Create one Master_citizen_map_backup
     * const Master_citizen_map_backup = await prisma.master_citizen_map_backup.create({
     *   data: {
     *     // ... data to create a Master_citizen_map_backup
     *   }
     * })
     * 
     */
    create<T extends master_citizen_map_backupCreateArgs>(args: SelectSubset<T, master_citizen_map_backupCreateArgs<ExtArgs>>): Prisma__master_citizen_map_backupClient<$Result.GetResult<Prisma.$master_citizen_map_backupPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Master_citizen_map_backups.
     * @param {master_citizen_map_backupCreateManyArgs} args - Arguments to create many Master_citizen_map_backups.
     * @example
     * // Create many Master_citizen_map_backups
     * const master_citizen_map_backup = await prisma.master_citizen_map_backup.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends master_citizen_map_backupCreateManyArgs>(args?: SelectSubset<T, master_citizen_map_backupCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Master_citizen_map_backups and returns the data saved in the database.
     * @param {master_citizen_map_backupCreateManyAndReturnArgs} args - Arguments to create many Master_citizen_map_backups.
     * @example
     * // Create many Master_citizen_map_backups
     * const master_citizen_map_backup = await prisma.master_citizen_map_backup.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Master_citizen_map_backups and only return the `id`
     * const master_citizen_map_backupWithIdOnly = await prisma.master_citizen_map_backup.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends master_citizen_map_backupCreateManyAndReturnArgs>(args?: SelectSubset<T, master_citizen_map_backupCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$master_citizen_map_backupPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Master_citizen_map_backup.
     * @param {master_citizen_map_backupDeleteArgs} args - Arguments to delete one Master_citizen_map_backup.
     * @example
     * // Delete one Master_citizen_map_backup
     * const Master_citizen_map_backup = await prisma.master_citizen_map_backup.delete({
     *   where: {
     *     // ... filter to delete one Master_citizen_map_backup
     *   }
     * })
     * 
     */
    delete<T extends master_citizen_map_backupDeleteArgs>(args: SelectSubset<T, master_citizen_map_backupDeleteArgs<ExtArgs>>): Prisma__master_citizen_map_backupClient<$Result.GetResult<Prisma.$master_citizen_map_backupPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Master_citizen_map_backup.
     * @param {master_citizen_map_backupUpdateArgs} args - Arguments to update one Master_citizen_map_backup.
     * @example
     * // Update one Master_citizen_map_backup
     * const master_citizen_map_backup = await prisma.master_citizen_map_backup.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends master_citizen_map_backupUpdateArgs>(args: SelectSubset<T, master_citizen_map_backupUpdateArgs<ExtArgs>>): Prisma__master_citizen_map_backupClient<$Result.GetResult<Prisma.$master_citizen_map_backupPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Master_citizen_map_backups.
     * @param {master_citizen_map_backupDeleteManyArgs} args - Arguments to filter Master_citizen_map_backups to delete.
     * @example
     * // Delete a few Master_citizen_map_backups
     * const { count } = await prisma.master_citizen_map_backup.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends master_citizen_map_backupDeleteManyArgs>(args?: SelectSubset<T, master_citizen_map_backupDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Master_citizen_map_backups.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {master_citizen_map_backupUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Master_citizen_map_backups
     * const master_citizen_map_backup = await prisma.master_citizen_map_backup.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends master_citizen_map_backupUpdateManyArgs>(args: SelectSubset<T, master_citizen_map_backupUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Master_citizen_map_backups and returns the data updated in the database.
     * @param {master_citizen_map_backupUpdateManyAndReturnArgs} args - Arguments to update many Master_citizen_map_backups.
     * @example
     * // Update many Master_citizen_map_backups
     * const master_citizen_map_backup = await prisma.master_citizen_map_backup.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Master_citizen_map_backups and only return the `id`
     * const master_citizen_map_backupWithIdOnly = await prisma.master_citizen_map_backup.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends master_citizen_map_backupUpdateManyAndReturnArgs>(args: SelectSubset<T, master_citizen_map_backupUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$master_citizen_map_backupPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Master_citizen_map_backup.
     * @param {master_citizen_map_backupUpsertArgs} args - Arguments to update or create a Master_citizen_map_backup.
     * @example
     * // Update or create a Master_citizen_map_backup
     * const master_citizen_map_backup = await prisma.master_citizen_map_backup.upsert({
     *   create: {
     *     // ... data to create a Master_citizen_map_backup
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Master_citizen_map_backup we want to update
     *   }
     * })
     */
    upsert<T extends master_citizen_map_backupUpsertArgs>(args: SelectSubset<T, master_citizen_map_backupUpsertArgs<ExtArgs>>): Prisma__master_citizen_map_backupClient<$Result.GetResult<Prisma.$master_citizen_map_backupPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Master_citizen_map_backups.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {master_citizen_map_backupCountArgs} args - Arguments to filter Master_citizen_map_backups to count.
     * @example
     * // Count the number of Master_citizen_map_backups
     * const count = await prisma.master_citizen_map_backup.count({
     *   where: {
     *     // ... the filter for the Master_citizen_map_backups we want to count
     *   }
     * })
    **/
    count<T extends master_citizen_map_backupCountArgs>(
      args?: Subset<T, master_citizen_map_backupCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Master_citizen_map_backupCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Master_citizen_map_backup.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Master_citizen_map_backupAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Master_citizen_map_backupAggregateArgs>(args: Subset<T, Master_citizen_map_backupAggregateArgs>): Prisma.PrismaPromise<GetMaster_citizen_map_backupAggregateType<T>>

    /**
     * Group by Master_citizen_map_backup.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {master_citizen_map_backupGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends master_citizen_map_backupGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: master_citizen_map_backupGroupByArgs['orderBy'] }
        : { orderBy?: master_citizen_map_backupGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, master_citizen_map_backupGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMaster_citizen_map_backupGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the master_citizen_map_backup model
   */
  readonly fields: master_citizen_map_backupFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for master_citizen_map_backup.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__master_citizen_map_backupClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the master_citizen_map_backup model
   */
  interface master_citizen_map_backupFieldRefs {
    readonly id: FieldRef<"master_citizen_map_backup", 'Int'>
    readonly phone_number: FieldRef<"master_citizen_map_backup", 'String'>
    readonly ward_id: FieldRef<"master_citizen_map_backup", 'Int'>
    readonly created_at: FieldRef<"master_citizen_map_backup", 'DateTime'>
    readonly updated_at: FieldRef<"master_citizen_map_backup", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * master_citizen_map_backup findUnique
   */
  export type master_citizen_map_backupFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the master_citizen_map_backup
     */
    select?: master_citizen_map_backupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the master_citizen_map_backup
     */
    omit?: master_citizen_map_backupOmit<ExtArgs> | null
    /**
     * Filter, which master_citizen_map_backup to fetch.
     */
    where: master_citizen_map_backupWhereUniqueInput
  }

  /**
   * master_citizen_map_backup findUniqueOrThrow
   */
  export type master_citizen_map_backupFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the master_citizen_map_backup
     */
    select?: master_citizen_map_backupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the master_citizen_map_backup
     */
    omit?: master_citizen_map_backupOmit<ExtArgs> | null
    /**
     * Filter, which master_citizen_map_backup to fetch.
     */
    where: master_citizen_map_backupWhereUniqueInput
  }

  /**
   * master_citizen_map_backup findFirst
   */
  export type master_citizen_map_backupFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the master_citizen_map_backup
     */
    select?: master_citizen_map_backupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the master_citizen_map_backup
     */
    omit?: master_citizen_map_backupOmit<ExtArgs> | null
    /**
     * Filter, which master_citizen_map_backup to fetch.
     */
    where?: master_citizen_map_backupWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of master_citizen_map_backups to fetch.
     */
    orderBy?: master_citizen_map_backupOrderByWithRelationInput | master_citizen_map_backupOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for master_citizen_map_backups.
     */
    cursor?: master_citizen_map_backupWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` master_citizen_map_backups from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` master_citizen_map_backups.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of master_citizen_map_backups.
     */
    distinct?: Master_citizen_map_backupScalarFieldEnum | Master_citizen_map_backupScalarFieldEnum[]
  }

  /**
   * master_citizen_map_backup findFirstOrThrow
   */
  export type master_citizen_map_backupFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the master_citizen_map_backup
     */
    select?: master_citizen_map_backupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the master_citizen_map_backup
     */
    omit?: master_citizen_map_backupOmit<ExtArgs> | null
    /**
     * Filter, which master_citizen_map_backup to fetch.
     */
    where?: master_citizen_map_backupWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of master_citizen_map_backups to fetch.
     */
    orderBy?: master_citizen_map_backupOrderByWithRelationInput | master_citizen_map_backupOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for master_citizen_map_backups.
     */
    cursor?: master_citizen_map_backupWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` master_citizen_map_backups from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` master_citizen_map_backups.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of master_citizen_map_backups.
     */
    distinct?: Master_citizen_map_backupScalarFieldEnum | Master_citizen_map_backupScalarFieldEnum[]
  }

  /**
   * master_citizen_map_backup findMany
   */
  export type master_citizen_map_backupFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the master_citizen_map_backup
     */
    select?: master_citizen_map_backupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the master_citizen_map_backup
     */
    omit?: master_citizen_map_backupOmit<ExtArgs> | null
    /**
     * Filter, which master_citizen_map_backups to fetch.
     */
    where?: master_citizen_map_backupWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of master_citizen_map_backups to fetch.
     */
    orderBy?: master_citizen_map_backupOrderByWithRelationInput | master_citizen_map_backupOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing master_citizen_map_backups.
     */
    cursor?: master_citizen_map_backupWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` master_citizen_map_backups from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` master_citizen_map_backups.
     */
    skip?: number
    distinct?: Master_citizen_map_backupScalarFieldEnum | Master_citizen_map_backupScalarFieldEnum[]
  }

  /**
   * master_citizen_map_backup create
   */
  export type master_citizen_map_backupCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the master_citizen_map_backup
     */
    select?: master_citizen_map_backupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the master_citizen_map_backup
     */
    omit?: master_citizen_map_backupOmit<ExtArgs> | null
    /**
     * The data needed to create a master_citizen_map_backup.
     */
    data: XOR<master_citizen_map_backupCreateInput, master_citizen_map_backupUncheckedCreateInput>
  }

  /**
   * master_citizen_map_backup createMany
   */
  export type master_citizen_map_backupCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many master_citizen_map_backups.
     */
    data: master_citizen_map_backupCreateManyInput | master_citizen_map_backupCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * master_citizen_map_backup createManyAndReturn
   */
  export type master_citizen_map_backupCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the master_citizen_map_backup
     */
    select?: master_citizen_map_backupSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the master_citizen_map_backup
     */
    omit?: master_citizen_map_backupOmit<ExtArgs> | null
    /**
     * The data used to create many master_citizen_map_backups.
     */
    data: master_citizen_map_backupCreateManyInput | master_citizen_map_backupCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * master_citizen_map_backup update
   */
  export type master_citizen_map_backupUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the master_citizen_map_backup
     */
    select?: master_citizen_map_backupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the master_citizen_map_backup
     */
    omit?: master_citizen_map_backupOmit<ExtArgs> | null
    /**
     * The data needed to update a master_citizen_map_backup.
     */
    data: XOR<master_citizen_map_backupUpdateInput, master_citizen_map_backupUncheckedUpdateInput>
    /**
     * Choose, which master_citizen_map_backup to update.
     */
    where: master_citizen_map_backupWhereUniqueInput
  }

  /**
   * master_citizen_map_backup updateMany
   */
  export type master_citizen_map_backupUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update master_citizen_map_backups.
     */
    data: XOR<master_citizen_map_backupUpdateManyMutationInput, master_citizen_map_backupUncheckedUpdateManyInput>
    /**
     * Filter which master_citizen_map_backups to update
     */
    where?: master_citizen_map_backupWhereInput
    /**
     * Limit how many master_citizen_map_backups to update.
     */
    limit?: number
  }

  /**
   * master_citizen_map_backup updateManyAndReturn
   */
  export type master_citizen_map_backupUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the master_citizen_map_backup
     */
    select?: master_citizen_map_backupSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the master_citizen_map_backup
     */
    omit?: master_citizen_map_backupOmit<ExtArgs> | null
    /**
     * The data used to update master_citizen_map_backups.
     */
    data: XOR<master_citizen_map_backupUpdateManyMutationInput, master_citizen_map_backupUncheckedUpdateManyInput>
    /**
     * Filter which master_citizen_map_backups to update
     */
    where?: master_citizen_map_backupWhereInput
    /**
     * Limit how many master_citizen_map_backups to update.
     */
    limit?: number
  }

  /**
   * master_citizen_map_backup upsert
   */
  export type master_citizen_map_backupUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the master_citizen_map_backup
     */
    select?: master_citizen_map_backupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the master_citizen_map_backup
     */
    omit?: master_citizen_map_backupOmit<ExtArgs> | null
    /**
     * The filter to search for the master_citizen_map_backup to update in case it exists.
     */
    where: master_citizen_map_backupWhereUniqueInput
    /**
     * In case the master_citizen_map_backup found by the `where` argument doesn't exist, create a new master_citizen_map_backup with this data.
     */
    create: XOR<master_citizen_map_backupCreateInput, master_citizen_map_backupUncheckedCreateInput>
    /**
     * In case the master_citizen_map_backup was found with the provided `where` argument, update it with this data.
     */
    update: XOR<master_citizen_map_backupUpdateInput, master_citizen_map_backupUncheckedUpdateInput>
  }

  /**
   * master_citizen_map_backup delete
   */
  export type master_citizen_map_backupDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the master_citizen_map_backup
     */
    select?: master_citizen_map_backupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the master_citizen_map_backup
     */
    omit?: master_citizen_map_backupOmit<ExtArgs> | null
    /**
     * Filter which master_citizen_map_backup to delete.
     */
    where: master_citizen_map_backupWhereUniqueInput
  }

  /**
   * master_citizen_map_backup deleteMany
   */
  export type master_citizen_map_backupDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which master_citizen_map_backups to delete
     */
    where?: master_citizen_map_backupWhereInput
    /**
     * Limit how many master_citizen_map_backups to delete.
     */
    limit?: number
  }

  /**
   * master_citizen_map_backup without action
   */
  export type master_citizen_map_backupDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the master_citizen_map_backup
     */
    select?: master_citizen_map_backupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the master_citizen_map_backup
     */
    omit?: master_citizen_map_backupOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const City_tableScalarFieldEnum: {
    city_id: 'city_id',
    city_name: 'city_name',
    geo_boundary: 'geo_boundary',
    created_at: 'created_at',
    city_table_name: 'city_table_name'
  };

  export type City_tableScalarFieldEnum = (typeof City_tableScalarFieldEnum)[keyof typeof City_tableScalarFieldEnum]


  export const Master_citizen_mapScalarFieldEnum: {
    id: 'id',
    phone_number: 'phone_number',
    ward_id: 'ward_id',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type Master_citizen_mapScalarFieldEnum = (typeof Master_citizen_mapScalarFieldEnum)[keyof typeof Master_citizen_mapScalarFieldEnum]


  export const Master_citizen_map_backupScalarFieldEnum: {
    id: 'id',
    phone_number: 'phone_number',
    ward_id: 'ward_id',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type Master_citizen_map_backupScalarFieldEnum = (typeof Master_citizen_map_backupScalarFieldEnum)[keyof typeof Master_citizen_map_backupScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type city_tableWhereInput = {
    AND?: city_tableWhereInput | city_tableWhereInput[]
    OR?: city_tableWhereInput[]
    NOT?: city_tableWhereInput | city_tableWhereInput[]
    city_id?: IntFilter<"city_table"> | number
    city_name?: StringFilter<"city_table"> | string
    geo_boundary?: JsonNullableFilter<"city_table">
    created_at?: DateTimeNullableFilter<"city_table"> | Date | string | null
    city_table_name?: StringNullableFilter<"city_table"> | string | null
  }

  export type city_tableOrderByWithRelationInput = {
    city_id?: SortOrder
    city_name?: SortOrder
    geo_boundary?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    city_table_name?: SortOrderInput | SortOrder
  }

  export type city_tableWhereUniqueInput = Prisma.AtLeast<{
    city_id?: number
    city_name?: string
    AND?: city_tableWhereInput | city_tableWhereInput[]
    OR?: city_tableWhereInput[]
    NOT?: city_tableWhereInput | city_tableWhereInput[]
    geo_boundary?: JsonNullableFilter<"city_table">
    created_at?: DateTimeNullableFilter<"city_table"> | Date | string | null
    city_table_name?: StringNullableFilter<"city_table"> | string | null
  }, "city_id" | "city_name">

  export type city_tableOrderByWithAggregationInput = {
    city_id?: SortOrder
    city_name?: SortOrder
    geo_boundary?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    city_table_name?: SortOrderInput | SortOrder
    _count?: city_tableCountOrderByAggregateInput
    _avg?: city_tableAvgOrderByAggregateInput
    _max?: city_tableMaxOrderByAggregateInput
    _min?: city_tableMinOrderByAggregateInput
    _sum?: city_tableSumOrderByAggregateInput
  }

  export type city_tableScalarWhereWithAggregatesInput = {
    AND?: city_tableScalarWhereWithAggregatesInput | city_tableScalarWhereWithAggregatesInput[]
    OR?: city_tableScalarWhereWithAggregatesInput[]
    NOT?: city_tableScalarWhereWithAggregatesInput | city_tableScalarWhereWithAggregatesInput[]
    city_id?: IntWithAggregatesFilter<"city_table"> | number
    city_name?: StringWithAggregatesFilter<"city_table"> | string
    geo_boundary?: JsonNullableWithAggregatesFilter<"city_table">
    created_at?: DateTimeNullableWithAggregatesFilter<"city_table"> | Date | string | null
    city_table_name?: StringNullableWithAggregatesFilter<"city_table"> | string | null
  }

  export type master_citizen_mapWhereInput = {
    AND?: master_citizen_mapWhereInput | master_citizen_mapWhereInput[]
    OR?: master_citizen_mapWhereInput[]
    NOT?: master_citizen_mapWhereInput | master_citizen_mapWhereInput[]
    id?: IntFilter<"master_citizen_map"> | number
    phone_number?: StringFilter<"master_citizen_map"> | string
    ward_id?: IntFilter<"master_citizen_map"> | number
    created_at?: DateTimeFilter<"master_citizen_map"> | Date | string
    updated_at?: DateTimeFilter<"master_citizen_map"> | Date | string
  }

  export type master_citizen_mapOrderByWithRelationInput = {
    id?: SortOrder
    phone_number?: SortOrder
    ward_id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type master_citizen_mapWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    phone_number?: string
    AND?: master_citizen_mapWhereInput | master_citizen_mapWhereInput[]
    OR?: master_citizen_mapWhereInput[]
    NOT?: master_citizen_mapWhereInput | master_citizen_mapWhereInput[]
    ward_id?: IntFilter<"master_citizen_map"> | number
    created_at?: DateTimeFilter<"master_citizen_map"> | Date | string
    updated_at?: DateTimeFilter<"master_citizen_map"> | Date | string
  }, "id" | "phone_number">

  export type master_citizen_mapOrderByWithAggregationInput = {
    id?: SortOrder
    phone_number?: SortOrder
    ward_id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: master_citizen_mapCountOrderByAggregateInput
    _avg?: master_citizen_mapAvgOrderByAggregateInput
    _max?: master_citizen_mapMaxOrderByAggregateInput
    _min?: master_citizen_mapMinOrderByAggregateInput
    _sum?: master_citizen_mapSumOrderByAggregateInput
  }

  export type master_citizen_mapScalarWhereWithAggregatesInput = {
    AND?: master_citizen_mapScalarWhereWithAggregatesInput | master_citizen_mapScalarWhereWithAggregatesInput[]
    OR?: master_citizen_mapScalarWhereWithAggregatesInput[]
    NOT?: master_citizen_mapScalarWhereWithAggregatesInput | master_citizen_mapScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"master_citizen_map"> | number
    phone_number?: StringWithAggregatesFilter<"master_citizen_map"> | string
    ward_id?: IntWithAggregatesFilter<"master_citizen_map"> | number
    created_at?: DateTimeWithAggregatesFilter<"master_citizen_map"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"master_citizen_map"> | Date | string
  }

  export type master_citizen_map_backupWhereInput = {
    AND?: master_citizen_map_backupWhereInput | master_citizen_map_backupWhereInput[]
    OR?: master_citizen_map_backupWhereInput[]
    NOT?: master_citizen_map_backupWhereInput | master_citizen_map_backupWhereInput[]
    id?: IntFilter<"master_citizen_map_backup"> | number
    phone_number?: StringFilter<"master_citizen_map_backup"> | string
    ward_id?: IntFilter<"master_citizen_map_backup"> | number
    created_at?: DateTimeFilter<"master_citizen_map_backup"> | Date | string
    updated_at?: DateTimeFilter<"master_citizen_map_backup"> | Date | string
  }

  export type master_citizen_map_backupOrderByWithRelationInput = {
    id?: SortOrder
    phone_number?: SortOrder
    ward_id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type master_citizen_map_backupWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: master_citizen_map_backupWhereInput | master_citizen_map_backupWhereInput[]
    OR?: master_citizen_map_backupWhereInput[]
    NOT?: master_citizen_map_backupWhereInput | master_citizen_map_backupWhereInput[]
    phone_number?: StringFilter<"master_citizen_map_backup"> | string
    ward_id?: IntFilter<"master_citizen_map_backup"> | number
    created_at?: DateTimeFilter<"master_citizen_map_backup"> | Date | string
    updated_at?: DateTimeFilter<"master_citizen_map_backup"> | Date | string
  }, "id">

  export type master_citizen_map_backupOrderByWithAggregationInput = {
    id?: SortOrder
    phone_number?: SortOrder
    ward_id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: master_citizen_map_backupCountOrderByAggregateInput
    _avg?: master_citizen_map_backupAvgOrderByAggregateInput
    _max?: master_citizen_map_backupMaxOrderByAggregateInput
    _min?: master_citizen_map_backupMinOrderByAggregateInput
    _sum?: master_citizen_map_backupSumOrderByAggregateInput
  }

  export type master_citizen_map_backupScalarWhereWithAggregatesInput = {
    AND?: master_citizen_map_backupScalarWhereWithAggregatesInput | master_citizen_map_backupScalarWhereWithAggregatesInput[]
    OR?: master_citizen_map_backupScalarWhereWithAggregatesInput[]
    NOT?: master_citizen_map_backupScalarWhereWithAggregatesInput | master_citizen_map_backupScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"master_citizen_map_backup"> | number
    phone_number?: StringWithAggregatesFilter<"master_citizen_map_backup"> | string
    ward_id?: IntWithAggregatesFilter<"master_citizen_map_backup"> | number
    created_at?: DateTimeWithAggregatesFilter<"master_citizen_map_backup"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"master_citizen_map_backup"> | Date | string
  }

  export type city_tableCreateInput = {
    city_name: string
    geo_boundary?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
    city_table_name?: string | null
  }

  export type city_tableUncheckedCreateInput = {
    city_id?: number
    city_name: string
    geo_boundary?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
    city_table_name?: string | null
  }

  export type city_tableUpdateInput = {
    city_name?: StringFieldUpdateOperationsInput | string
    geo_boundary?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    city_table_name?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type city_tableUncheckedUpdateInput = {
    city_id?: IntFieldUpdateOperationsInput | number
    city_name?: StringFieldUpdateOperationsInput | string
    geo_boundary?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    city_table_name?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type city_tableCreateManyInput = {
    city_id?: number
    city_name: string
    geo_boundary?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
    city_table_name?: string | null
  }

  export type city_tableUpdateManyMutationInput = {
    city_name?: StringFieldUpdateOperationsInput | string
    geo_boundary?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    city_table_name?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type city_tableUncheckedUpdateManyInput = {
    city_id?: IntFieldUpdateOperationsInput | number
    city_name?: StringFieldUpdateOperationsInput | string
    geo_boundary?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    city_table_name?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type master_citizen_mapCreateInput = {
    phone_number: string
    ward_id: number
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type master_citizen_mapUncheckedCreateInput = {
    id?: number
    phone_number: string
    ward_id: number
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type master_citizen_mapUpdateInput = {
    phone_number?: StringFieldUpdateOperationsInput | string
    ward_id?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type master_citizen_mapUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    phone_number?: StringFieldUpdateOperationsInput | string
    ward_id?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type master_citizen_mapCreateManyInput = {
    id?: number
    phone_number: string
    ward_id: number
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type master_citizen_mapUpdateManyMutationInput = {
    phone_number?: StringFieldUpdateOperationsInput | string
    ward_id?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type master_citizen_mapUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    phone_number?: StringFieldUpdateOperationsInput | string
    ward_id?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type master_citizen_map_backupCreateInput = {
    phone_number: string
    ward_id: number
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type master_citizen_map_backupUncheckedCreateInput = {
    id?: number
    phone_number: string
    ward_id: number
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type master_citizen_map_backupUpdateInput = {
    phone_number?: StringFieldUpdateOperationsInput | string
    ward_id?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type master_citizen_map_backupUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    phone_number?: StringFieldUpdateOperationsInput | string
    ward_id?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type master_citizen_map_backupCreateManyInput = {
    id?: number
    phone_number: string
    ward_id: number
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type master_citizen_map_backupUpdateManyMutationInput = {
    phone_number?: StringFieldUpdateOperationsInput | string
    ward_id?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type master_citizen_map_backupUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    phone_number?: StringFieldUpdateOperationsInput | string
    ward_id?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type city_tableCountOrderByAggregateInput = {
    city_id?: SortOrder
    city_name?: SortOrder
    geo_boundary?: SortOrder
    created_at?: SortOrder
    city_table_name?: SortOrder
  }

  export type city_tableAvgOrderByAggregateInput = {
    city_id?: SortOrder
  }

  export type city_tableMaxOrderByAggregateInput = {
    city_id?: SortOrder
    city_name?: SortOrder
    created_at?: SortOrder
    city_table_name?: SortOrder
  }

  export type city_tableMinOrderByAggregateInput = {
    city_id?: SortOrder
    city_name?: SortOrder
    created_at?: SortOrder
    city_table_name?: SortOrder
  }

  export type city_tableSumOrderByAggregateInput = {
    city_id?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type master_citizen_mapCountOrderByAggregateInput = {
    id?: SortOrder
    phone_number?: SortOrder
    ward_id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type master_citizen_mapAvgOrderByAggregateInput = {
    id?: SortOrder
    ward_id?: SortOrder
  }

  export type master_citizen_mapMaxOrderByAggregateInput = {
    id?: SortOrder
    phone_number?: SortOrder
    ward_id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type master_citizen_mapMinOrderByAggregateInput = {
    id?: SortOrder
    phone_number?: SortOrder
    ward_id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type master_citizen_mapSumOrderByAggregateInput = {
    id?: SortOrder
    ward_id?: SortOrder
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type master_citizen_map_backupCountOrderByAggregateInput = {
    id?: SortOrder
    phone_number?: SortOrder
    ward_id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type master_citizen_map_backupAvgOrderByAggregateInput = {
    id?: SortOrder
    ward_id?: SortOrder
  }

  export type master_citizen_map_backupMaxOrderByAggregateInput = {
    id?: SortOrder
    phone_number?: SortOrder
    ward_id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type master_citizen_map_backupMinOrderByAggregateInput = {
    id?: SortOrder
    phone_number?: SortOrder
    ward_id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type master_citizen_map_backupSumOrderByAggregateInput = {
    id?: SortOrder
    ward_id?: SortOrder
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}