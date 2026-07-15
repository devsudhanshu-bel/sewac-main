
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
 * Model division_table
 * 
 */
export type division_table = $Result.DefaultSelection<Prisma.$division_tablePayload>
/**
 * Model ward_table
 * 
 */
export type ward_table = $Result.DefaultSelection<Prisma.$ward_tablePayload>
/**
 * Model zone_table
 * 
 */
export type zone_table = $Result.DefaultSelection<Prisma.$zone_tablePayload>

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
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
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
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

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
   * `prisma.division_table`: Exposes CRUD operations for the **division_table** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Division_tables
    * const division_tables = await prisma.division_table.findMany()
    * ```
    */
  get division_table(): Prisma.division_tableDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.ward_table`: Exposes CRUD operations for the **ward_table** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Ward_tables
    * const ward_tables = await prisma.ward_table.findMany()
    * ```
    */
  get ward_table(): Prisma.ward_tableDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.zone_table`: Exposes CRUD operations for the **zone_table** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Zone_tables
    * const zone_tables = await prisma.zone_table.findMany()
    * ```
    */
  get zone_table(): Prisma.zone_tableDelegate<ExtArgs, ClientOptions>;
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
   * Prisma Client JS version: 6.8.2
   * Query Engine version: 2060c79ba17c6bb9f5823312b6f6b7f4a845738e
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


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
    division_table: 'division_table',
    ward_table: 'ward_table',
    zone_table: 'zone_table'
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
      modelProps: "city_table" | "division_table" | "ward_table" | "zone_table"
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
      division_table: {
        payload: Prisma.$division_tablePayload<ExtArgs>
        fields: Prisma.division_tableFieldRefs
        operations: {
          findUnique: {
            args: Prisma.division_tableFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$division_tablePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.division_tableFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$division_tablePayload>
          }
          findFirst: {
            args: Prisma.division_tableFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$division_tablePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.division_tableFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$division_tablePayload>
          }
          findMany: {
            args: Prisma.division_tableFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$division_tablePayload>[]
          }
          create: {
            args: Prisma.division_tableCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$division_tablePayload>
          }
          createMany: {
            args: Prisma.division_tableCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.division_tableCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$division_tablePayload>[]
          }
          delete: {
            args: Prisma.division_tableDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$division_tablePayload>
          }
          update: {
            args: Prisma.division_tableUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$division_tablePayload>
          }
          deleteMany: {
            args: Prisma.division_tableDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.division_tableUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.division_tableUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$division_tablePayload>[]
          }
          upsert: {
            args: Prisma.division_tableUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$division_tablePayload>
          }
          aggregate: {
            args: Prisma.Division_tableAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDivision_table>
          }
          groupBy: {
            args: Prisma.division_tableGroupByArgs<ExtArgs>
            result: $Utils.Optional<Division_tableGroupByOutputType>[]
          }
          count: {
            args: Prisma.division_tableCountArgs<ExtArgs>
            result: $Utils.Optional<Division_tableCountAggregateOutputType> | number
          }
        }
      }
      ward_table: {
        payload: Prisma.$ward_tablePayload<ExtArgs>
        fields: Prisma.ward_tableFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ward_tableFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ward_tablePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ward_tableFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ward_tablePayload>
          }
          findFirst: {
            args: Prisma.ward_tableFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ward_tablePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ward_tableFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ward_tablePayload>
          }
          findMany: {
            args: Prisma.ward_tableFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ward_tablePayload>[]
          }
          create: {
            args: Prisma.ward_tableCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ward_tablePayload>
          }
          createMany: {
            args: Prisma.ward_tableCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ward_tableCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ward_tablePayload>[]
          }
          delete: {
            args: Prisma.ward_tableDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ward_tablePayload>
          }
          update: {
            args: Prisma.ward_tableUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ward_tablePayload>
          }
          deleteMany: {
            args: Prisma.ward_tableDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ward_tableUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ward_tableUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ward_tablePayload>[]
          }
          upsert: {
            args: Prisma.ward_tableUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ward_tablePayload>
          }
          aggregate: {
            args: Prisma.Ward_tableAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateWard_table>
          }
          groupBy: {
            args: Prisma.ward_tableGroupByArgs<ExtArgs>
            result: $Utils.Optional<Ward_tableGroupByOutputType>[]
          }
          count: {
            args: Prisma.ward_tableCountArgs<ExtArgs>
            result: $Utils.Optional<Ward_tableCountAggregateOutputType> | number
          }
        }
      }
      zone_table: {
        payload: Prisma.$zone_tablePayload<ExtArgs>
        fields: Prisma.zone_tableFieldRefs
        operations: {
          findUnique: {
            args: Prisma.zone_tableFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$zone_tablePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.zone_tableFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$zone_tablePayload>
          }
          findFirst: {
            args: Prisma.zone_tableFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$zone_tablePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.zone_tableFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$zone_tablePayload>
          }
          findMany: {
            args: Prisma.zone_tableFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$zone_tablePayload>[]
          }
          create: {
            args: Prisma.zone_tableCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$zone_tablePayload>
          }
          createMany: {
            args: Prisma.zone_tableCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.zone_tableCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$zone_tablePayload>[]
          }
          delete: {
            args: Prisma.zone_tableDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$zone_tablePayload>
          }
          update: {
            args: Prisma.zone_tableUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$zone_tablePayload>
          }
          deleteMany: {
            args: Prisma.zone_tableDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.zone_tableUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.zone_tableUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$zone_tablePayload>[]
          }
          upsert: {
            args: Prisma.zone_tableUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$zone_tablePayload>
          }
          aggregate: {
            args: Prisma.Zone_tableAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateZone_table>
          }
          groupBy: {
            args: Prisma.zone_tableGroupByArgs<ExtArgs>
            result: $Utils.Optional<Zone_tableGroupByOutputType>[]
          }
          count: {
            args: Prisma.zone_tableCountArgs<ExtArgs>
            result: $Utils.Optional<Zone_tableCountAggregateOutputType> | number
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
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
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
    division_table?: division_tableOmit
    ward_table?: ward_tableOmit
    zone_table?: zone_tableOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

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

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

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
   * Count Type City_tableCountOutputType
   */

  export type City_tableCountOutputType = {
    division_table: number
    ward_table: number
    zone_table: number
  }

  export type City_tableCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    division_table?: boolean | City_tableCountOutputTypeCountDivision_tableArgs
    ward_table?: boolean | City_tableCountOutputTypeCountWard_tableArgs
    zone_table?: boolean | City_tableCountOutputTypeCountZone_tableArgs
  }

  // Custom InputTypes
  /**
   * City_tableCountOutputType without action
   */
  export type City_tableCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the City_tableCountOutputType
     */
    select?: City_tableCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * City_tableCountOutputType without action
   */
  export type City_tableCountOutputTypeCountDivision_tableArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: division_tableWhereInput
  }

  /**
   * City_tableCountOutputType without action
   */
  export type City_tableCountOutputTypeCountWard_tableArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ward_tableWhereInput
  }

  /**
   * City_tableCountOutputType without action
   */
  export type City_tableCountOutputTypeCountZone_tableArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: zone_tableWhereInput
  }


  /**
   * Count Type Division_tableCountOutputType
   */

  export type Division_tableCountOutputType = {
    ward_table: number
  }

  export type Division_tableCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    ward_table?: boolean | Division_tableCountOutputTypeCountWard_tableArgs
  }

  // Custom InputTypes
  /**
   * Division_tableCountOutputType without action
   */
  export type Division_tableCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Division_tableCountOutputType
     */
    select?: Division_tableCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * Division_tableCountOutputType without action
   */
  export type Division_tableCountOutputTypeCountWard_tableArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ward_tableWhereInput
  }


  /**
   * Count Type Zone_tableCountOutputType
   */

  export type Zone_tableCountOutputType = {
    division_table: number
    ward_table: number
  }

  export type Zone_tableCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    division_table?: boolean | Zone_tableCountOutputTypeCountDivision_tableArgs
    ward_table?: boolean | Zone_tableCountOutputTypeCountWard_tableArgs
  }

  // Custom InputTypes
  /**
   * Zone_tableCountOutputType without action
   */
  export type Zone_tableCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Zone_tableCountOutputType
     */
    select?: Zone_tableCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * Zone_tableCountOutputType without action
   */
  export type Zone_tableCountOutputTypeCountDivision_tableArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: division_tableWhereInput
  }

  /**
   * Zone_tableCountOutputType without action
   */
  export type Zone_tableCountOutputTypeCountWard_tableArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ward_tableWhereInput
  }


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
  }

  export type City_tableMaxAggregateOutputType = {
    city_id: number | null
    city_name: string | null
    created_at: Date | null
  }

  export type City_tableCountAggregateOutputType = {
    city_id: number
    city_name: number
    geo_boundary: number
    created_at: number
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
  }

  export type City_tableMaxAggregateInputType = {
    city_id?: true
    city_name?: true
    created_at?: true
  }

  export type City_tableCountAggregateInputType = {
    city_id?: true
    city_name?: true
    geo_boundary?: true
    created_at?: true
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
    division_table?: boolean | city_table$division_tableArgs<ExtArgs>
    ward_table?: boolean | city_table$ward_tableArgs<ExtArgs>
    zone_table?: boolean | city_table$zone_tableArgs<ExtArgs>
    _count?: boolean | City_tableCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["city_table"]>

  export type city_tableSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    city_id?: boolean
    city_name?: boolean
    geo_boundary?: boolean
    created_at?: boolean
  }, ExtArgs["result"]["city_table"]>

  export type city_tableSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    city_id?: boolean
    city_name?: boolean
    geo_boundary?: boolean
    created_at?: boolean
  }, ExtArgs["result"]["city_table"]>

  export type city_tableSelectScalar = {
    city_id?: boolean
    city_name?: boolean
    geo_boundary?: boolean
    created_at?: boolean
  }

  export type city_tableOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"city_id" | "city_name" | "geo_boundary" | "created_at", ExtArgs["result"]["city_table"]>
  export type city_tableInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    division_table?: boolean | city_table$division_tableArgs<ExtArgs>
    ward_table?: boolean | city_table$ward_tableArgs<ExtArgs>
    zone_table?: boolean | city_table$zone_tableArgs<ExtArgs>
    _count?: boolean | City_tableCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type city_tableIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type city_tableIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $city_tablePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "city_table"
    objects: {
      division_table: Prisma.$division_tablePayload<ExtArgs>[]
      ward_table: Prisma.$ward_tablePayload<ExtArgs>[]
      zone_table: Prisma.$zone_tablePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      city_id: number
      city_name: string
      geo_boundary: Prisma.JsonValue | null
      created_at: Date | null
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
    division_table<T extends city_table$division_tableArgs<ExtArgs> = {}>(args?: Subset<T, city_table$division_tableArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$division_tablePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    ward_table<T extends city_table$ward_tableArgs<ExtArgs> = {}>(args?: Subset<T, city_table$ward_tableArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ward_tablePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    zone_table<T extends city_table$zone_tableArgs<ExtArgs> = {}>(args?: Subset<T, city_table$zone_tableArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$zone_tablePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
     * Choose, which related nodes to fetch as well
     */
    include?: city_tableInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: city_tableInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: city_tableInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: city_tableInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: city_tableInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: city_tableInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: city_tableInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: city_tableInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: city_tableInclude<ExtArgs> | null
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
   * city_table.division_table
   */
  export type city_table$division_tableArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the division_table
     */
    select?: division_tableSelect<ExtArgs> | null
    /**
     * Omit specific fields from the division_table
     */
    omit?: division_tableOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: division_tableInclude<ExtArgs> | null
    where?: division_tableWhereInput
    orderBy?: division_tableOrderByWithRelationInput | division_tableOrderByWithRelationInput[]
    cursor?: division_tableWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Division_tableScalarFieldEnum | Division_tableScalarFieldEnum[]
  }

  /**
   * city_table.ward_table
   */
  export type city_table$ward_tableArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ward_table
     */
    select?: ward_tableSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ward_table
     */
    omit?: ward_tableOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ward_tableInclude<ExtArgs> | null
    where?: ward_tableWhereInput
    orderBy?: ward_tableOrderByWithRelationInput | ward_tableOrderByWithRelationInput[]
    cursor?: ward_tableWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Ward_tableScalarFieldEnum | Ward_tableScalarFieldEnum[]
  }

  /**
   * city_table.zone_table
   */
  export type city_table$zone_tableArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the zone_table
     */
    select?: zone_tableSelect<ExtArgs> | null
    /**
     * Omit specific fields from the zone_table
     */
    omit?: zone_tableOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: zone_tableInclude<ExtArgs> | null
    where?: zone_tableWhereInput
    orderBy?: zone_tableOrderByWithRelationInput | zone_tableOrderByWithRelationInput[]
    cursor?: zone_tableWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Zone_tableScalarFieldEnum | Zone_tableScalarFieldEnum[]
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
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: city_tableInclude<ExtArgs> | null
  }


  /**
   * Model division_table
   */

  export type AggregateDivision_table = {
    _count: Division_tableCountAggregateOutputType | null
    _avg: Division_tableAvgAggregateOutputType | null
    _sum: Division_tableSumAggregateOutputType | null
    _min: Division_tableMinAggregateOutputType | null
    _max: Division_tableMaxAggregateOutputType | null
  }

  export type Division_tableAvgAggregateOutputType = {
    division_id: number | null
    city_id: number | null
    zone_id: number | null
  }

  export type Division_tableSumAggregateOutputType = {
    division_id: number | null
    city_id: number | null
    zone_id: number | null
  }

  export type Division_tableMinAggregateOutputType = {
    division_id: number | null
    division_name: string | null
    city_id: number | null
    zone_id: number | null
    created_at: Date | null
  }

  export type Division_tableMaxAggregateOutputType = {
    division_id: number | null
    division_name: string | null
    city_id: number | null
    zone_id: number | null
    created_at: Date | null
  }

  export type Division_tableCountAggregateOutputType = {
    division_id: number
    division_name: number
    city_id: number
    zone_id: number
    geo_boundary: number
    created_at: number
    _all: number
  }


  export type Division_tableAvgAggregateInputType = {
    division_id?: true
    city_id?: true
    zone_id?: true
  }

  export type Division_tableSumAggregateInputType = {
    division_id?: true
    city_id?: true
    zone_id?: true
  }

  export type Division_tableMinAggregateInputType = {
    division_id?: true
    division_name?: true
    city_id?: true
    zone_id?: true
    created_at?: true
  }

  export type Division_tableMaxAggregateInputType = {
    division_id?: true
    division_name?: true
    city_id?: true
    zone_id?: true
    created_at?: true
  }

  export type Division_tableCountAggregateInputType = {
    division_id?: true
    division_name?: true
    city_id?: true
    zone_id?: true
    geo_boundary?: true
    created_at?: true
    _all?: true
  }

  export type Division_tableAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which division_table to aggregate.
     */
    where?: division_tableWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of division_tables to fetch.
     */
    orderBy?: division_tableOrderByWithRelationInput | division_tableOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: division_tableWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` division_tables from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` division_tables.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned division_tables
    **/
    _count?: true | Division_tableCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Division_tableAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Division_tableSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Division_tableMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Division_tableMaxAggregateInputType
  }

  export type GetDivision_tableAggregateType<T extends Division_tableAggregateArgs> = {
        [P in keyof T & keyof AggregateDivision_table]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDivision_table[P]>
      : GetScalarType<T[P], AggregateDivision_table[P]>
  }




  export type division_tableGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: division_tableWhereInput
    orderBy?: division_tableOrderByWithAggregationInput | division_tableOrderByWithAggregationInput[]
    by: Division_tableScalarFieldEnum[] | Division_tableScalarFieldEnum
    having?: division_tableScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Division_tableCountAggregateInputType | true
    _avg?: Division_tableAvgAggregateInputType
    _sum?: Division_tableSumAggregateInputType
    _min?: Division_tableMinAggregateInputType
    _max?: Division_tableMaxAggregateInputType
  }

  export type Division_tableGroupByOutputType = {
    division_id: number
    division_name: string
    city_id: number
    zone_id: number
    geo_boundary: JsonValue | null
    created_at: Date | null
    _count: Division_tableCountAggregateOutputType | null
    _avg: Division_tableAvgAggregateOutputType | null
    _sum: Division_tableSumAggregateOutputType | null
    _min: Division_tableMinAggregateOutputType | null
    _max: Division_tableMaxAggregateOutputType | null
  }

  type GetDivision_tableGroupByPayload<T extends division_tableGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Division_tableGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Division_tableGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Division_tableGroupByOutputType[P]>
            : GetScalarType<T[P], Division_tableGroupByOutputType[P]>
        }
      >
    >


  export type division_tableSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    division_id?: boolean
    division_name?: boolean
    city_id?: boolean
    zone_id?: boolean
    geo_boundary?: boolean
    created_at?: boolean
    city_table?: boolean | city_tableDefaultArgs<ExtArgs>
    zone_table?: boolean | zone_tableDefaultArgs<ExtArgs>
    ward_table?: boolean | division_table$ward_tableArgs<ExtArgs>
    _count?: boolean | Division_tableCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["division_table"]>

  export type division_tableSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    division_id?: boolean
    division_name?: boolean
    city_id?: boolean
    zone_id?: boolean
    geo_boundary?: boolean
    created_at?: boolean
    city_table?: boolean | city_tableDefaultArgs<ExtArgs>
    zone_table?: boolean | zone_tableDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["division_table"]>

  export type division_tableSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    division_id?: boolean
    division_name?: boolean
    city_id?: boolean
    zone_id?: boolean
    geo_boundary?: boolean
    created_at?: boolean
    city_table?: boolean | city_tableDefaultArgs<ExtArgs>
    zone_table?: boolean | zone_tableDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["division_table"]>

  export type division_tableSelectScalar = {
    division_id?: boolean
    division_name?: boolean
    city_id?: boolean
    zone_id?: boolean
    geo_boundary?: boolean
    created_at?: boolean
  }

  export type division_tableOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"division_id" | "division_name" | "city_id" | "zone_id" | "geo_boundary" | "created_at", ExtArgs["result"]["division_table"]>
  export type division_tableInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    city_table?: boolean | city_tableDefaultArgs<ExtArgs>
    zone_table?: boolean | zone_tableDefaultArgs<ExtArgs>
    ward_table?: boolean | division_table$ward_tableArgs<ExtArgs>
    _count?: boolean | Division_tableCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type division_tableIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    city_table?: boolean | city_tableDefaultArgs<ExtArgs>
    zone_table?: boolean | zone_tableDefaultArgs<ExtArgs>
  }
  export type division_tableIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    city_table?: boolean | city_tableDefaultArgs<ExtArgs>
    zone_table?: boolean | zone_tableDefaultArgs<ExtArgs>
  }

  export type $division_tablePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "division_table"
    objects: {
      city_table: Prisma.$city_tablePayload<ExtArgs>
      zone_table: Prisma.$zone_tablePayload<ExtArgs>
      ward_table: Prisma.$ward_tablePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      division_id: number
      division_name: string
      city_id: number
      zone_id: number
      geo_boundary: Prisma.JsonValue | null
      created_at: Date | null
    }, ExtArgs["result"]["division_table"]>
    composites: {}
  }

  type division_tableGetPayload<S extends boolean | null | undefined | division_tableDefaultArgs> = $Result.GetResult<Prisma.$division_tablePayload, S>

  type division_tableCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<division_tableFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Division_tableCountAggregateInputType | true
    }

  export interface division_tableDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['division_table'], meta: { name: 'division_table' } }
    /**
     * Find zero or one Division_table that matches the filter.
     * @param {division_tableFindUniqueArgs} args - Arguments to find a Division_table
     * @example
     * // Get one Division_table
     * const division_table = await prisma.division_table.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends division_tableFindUniqueArgs>(args: SelectSubset<T, division_tableFindUniqueArgs<ExtArgs>>): Prisma__division_tableClient<$Result.GetResult<Prisma.$division_tablePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Division_table that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {division_tableFindUniqueOrThrowArgs} args - Arguments to find a Division_table
     * @example
     * // Get one Division_table
     * const division_table = await prisma.division_table.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends division_tableFindUniqueOrThrowArgs>(args: SelectSubset<T, division_tableFindUniqueOrThrowArgs<ExtArgs>>): Prisma__division_tableClient<$Result.GetResult<Prisma.$division_tablePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Division_table that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {division_tableFindFirstArgs} args - Arguments to find a Division_table
     * @example
     * // Get one Division_table
     * const division_table = await prisma.division_table.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends division_tableFindFirstArgs>(args?: SelectSubset<T, division_tableFindFirstArgs<ExtArgs>>): Prisma__division_tableClient<$Result.GetResult<Prisma.$division_tablePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Division_table that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {division_tableFindFirstOrThrowArgs} args - Arguments to find a Division_table
     * @example
     * // Get one Division_table
     * const division_table = await prisma.division_table.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends division_tableFindFirstOrThrowArgs>(args?: SelectSubset<T, division_tableFindFirstOrThrowArgs<ExtArgs>>): Prisma__division_tableClient<$Result.GetResult<Prisma.$division_tablePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Division_tables that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {division_tableFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Division_tables
     * const division_tables = await prisma.division_table.findMany()
     * 
     * // Get first 10 Division_tables
     * const division_tables = await prisma.division_table.findMany({ take: 10 })
     * 
     * // Only select the `division_id`
     * const division_tableWithDivision_idOnly = await prisma.division_table.findMany({ select: { division_id: true } })
     * 
     */
    findMany<T extends division_tableFindManyArgs>(args?: SelectSubset<T, division_tableFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$division_tablePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Division_table.
     * @param {division_tableCreateArgs} args - Arguments to create a Division_table.
     * @example
     * // Create one Division_table
     * const Division_table = await prisma.division_table.create({
     *   data: {
     *     // ... data to create a Division_table
     *   }
     * })
     * 
     */
    create<T extends division_tableCreateArgs>(args: SelectSubset<T, division_tableCreateArgs<ExtArgs>>): Prisma__division_tableClient<$Result.GetResult<Prisma.$division_tablePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Division_tables.
     * @param {division_tableCreateManyArgs} args - Arguments to create many Division_tables.
     * @example
     * // Create many Division_tables
     * const division_table = await prisma.division_table.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends division_tableCreateManyArgs>(args?: SelectSubset<T, division_tableCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Division_tables and returns the data saved in the database.
     * @param {division_tableCreateManyAndReturnArgs} args - Arguments to create many Division_tables.
     * @example
     * // Create many Division_tables
     * const division_table = await prisma.division_table.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Division_tables and only return the `division_id`
     * const division_tableWithDivision_idOnly = await prisma.division_table.createManyAndReturn({
     *   select: { division_id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends division_tableCreateManyAndReturnArgs>(args?: SelectSubset<T, division_tableCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$division_tablePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Division_table.
     * @param {division_tableDeleteArgs} args - Arguments to delete one Division_table.
     * @example
     * // Delete one Division_table
     * const Division_table = await prisma.division_table.delete({
     *   where: {
     *     // ... filter to delete one Division_table
     *   }
     * })
     * 
     */
    delete<T extends division_tableDeleteArgs>(args: SelectSubset<T, division_tableDeleteArgs<ExtArgs>>): Prisma__division_tableClient<$Result.GetResult<Prisma.$division_tablePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Division_table.
     * @param {division_tableUpdateArgs} args - Arguments to update one Division_table.
     * @example
     * // Update one Division_table
     * const division_table = await prisma.division_table.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends division_tableUpdateArgs>(args: SelectSubset<T, division_tableUpdateArgs<ExtArgs>>): Prisma__division_tableClient<$Result.GetResult<Prisma.$division_tablePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Division_tables.
     * @param {division_tableDeleteManyArgs} args - Arguments to filter Division_tables to delete.
     * @example
     * // Delete a few Division_tables
     * const { count } = await prisma.division_table.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends division_tableDeleteManyArgs>(args?: SelectSubset<T, division_tableDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Division_tables.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {division_tableUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Division_tables
     * const division_table = await prisma.division_table.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends division_tableUpdateManyArgs>(args: SelectSubset<T, division_tableUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Division_tables and returns the data updated in the database.
     * @param {division_tableUpdateManyAndReturnArgs} args - Arguments to update many Division_tables.
     * @example
     * // Update many Division_tables
     * const division_table = await prisma.division_table.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Division_tables and only return the `division_id`
     * const division_tableWithDivision_idOnly = await prisma.division_table.updateManyAndReturn({
     *   select: { division_id: true },
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
    updateManyAndReturn<T extends division_tableUpdateManyAndReturnArgs>(args: SelectSubset<T, division_tableUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$division_tablePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Division_table.
     * @param {division_tableUpsertArgs} args - Arguments to update or create a Division_table.
     * @example
     * // Update or create a Division_table
     * const division_table = await prisma.division_table.upsert({
     *   create: {
     *     // ... data to create a Division_table
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Division_table we want to update
     *   }
     * })
     */
    upsert<T extends division_tableUpsertArgs>(args: SelectSubset<T, division_tableUpsertArgs<ExtArgs>>): Prisma__division_tableClient<$Result.GetResult<Prisma.$division_tablePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Division_tables.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {division_tableCountArgs} args - Arguments to filter Division_tables to count.
     * @example
     * // Count the number of Division_tables
     * const count = await prisma.division_table.count({
     *   where: {
     *     // ... the filter for the Division_tables we want to count
     *   }
     * })
    **/
    count<T extends division_tableCountArgs>(
      args?: Subset<T, division_tableCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Division_tableCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Division_table.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Division_tableAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends Division_tableAggregateArgs>(args: Subset<T, Division_tableAggregateArgs>): Prisma.PrismaPromise<GetDivision_tableAggregateType<T>>

    /**
     * Group by Division_table.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {division_tableGroupByArgs} args - Group by arguments.
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
      T extends division_tableGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: division_tableGroupByArgs['orderBy'] }
        : { orderBy?: division_tableGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, division_tableGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDivision_tableGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the division_table model
   */
  readonly fields: division_tableFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for division_table.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__division_tableClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    city_table<T extends city_tableDefaultArgs<ExtArgs> = {}>(args?: Subset<T, city_tableDefaultArgs<ExtArgs>>): Prisma__city_tableClient<$Result.GetResult<Prisma.$city_tablePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    zone_table<T extends zone_tableDefaultArgs<ExtArgs> = {}>(args?: Subset<T, zone_tableDefaultArgs<ExtArgs>>): Prisma__zone_tableClient<$Result.GetResult<Prisma.$zone_tablePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    ward_table<T extends division_table$ward_tableArgs<ExtArgs> = {}>(args?: Subset<T, division_table$ward_tableArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ward_tablePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the division_table model
   */
  interface division_tableFieldRefs {
    readonly division_id: FieldRef<"division_table", 'Int'>
    readonly division_name: FieldRef<"division_table", 'String'>
    readonly city_id: FieldRef<"division_table", 'Int'>
    readonly zone_id: FieldRef<"division_table", 'Int'>
    readonly geo_boundary: FieldRef<"division_table", 'Json'>
    readonly created_at: FieldRef<"division_table", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * division_table findUnique
   */
  export type division_tableFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the division_table
     */
    select?: division_tableSelect<ExtArgs> | null
    /**
     * Omit specific fields from the division_table
     */
    omit?: division_tableOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: division_tableInclude<ExtArgs> | null
    /**
     * Filter, which division_table to fetch.
     */
    where: division_tableWhereUniqueInput
  }

  /**
   * division_table findUniqueOrThrow
   */
  export type division_tableFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the division_table
     */
    select?: division_tableSelect<ExtArgs> | null
    /**
     * Omit specific fields from the division_table
     */
    omit?: division_tableOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: division_tableInclude<ExtArgs> | null
    /**
     * Filter, which division_table to fetch.
     */
    where: division_tableWhereUniqueInput
  }

  /**
   * division_table findFirst
   */
  export type division_tableFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the division_table
     */
    select?: division_tableSelect<ExtArgs> | null
    /**
     * Omit specific fields from the division_table
     */
    omit?: division_tableOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: division_tableInclude<ExtArgs> | null
    /**
     * Filter, which division_table to fetch.
     */
    where?: division_tableWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of division_tables to fetch.
     */
    orderBy?: division_tableOrderByWithRelationInput | division_tableOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for division_tables.
     */
    cursor?: division_tableWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` division_tables from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` division_tables.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of division_tables.
     */
    distinct?: Division_tableScalarFieldEnum | Division_tableScalarFieldEnum[]
  }

  /**
   * division_table findFirstOrThrow
   */
  export type division_tableFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the division_table
     */
    select?: division_tableSelect<ExtArgs> | null
    /**
     * Omit specific fields from the division_table
     */
    omit?: division_tableOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: division_tableInclude<ExtArgs> | null
    /**
     * Filter, which division_table to fetch.
     */
    where?: division_tableWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of division_tables to fetch.
     */
    orderBy?: division_tableOrderByWithRelationInput | division_tableOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for division_tables.
     */
    cursor?: division_tableWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` division_tables from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` division_tables.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of division_tables.
     */
    distinct?: Division_tableScalarFieldEnum | Division_tableScalarFieldEnum[]
  }

  /**
   * division_table findMany
   */
  export type division_tableFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the division_table
     */
    select?: division_tableSelect<ExtArgs> | null
    /**
     * Omit specific fields from the division_table
     */
    omit?: division_tableOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: division_tableInclude<ExtArgs> | null
    /**
     * Filter, which division_tables to fetch.
     */
    where?: division_tableWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of division_tables to fetch.
     */
    orderBy?: division_tableOrderByWithRelationInput | division_tableOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing division_tables.
     */
    cursor?: division_tableWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` division_tables from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` division_tables.
     */
    skip?: number
    distinct?: Division_tableScalarFieldEnum | Division_tableScalarFieldEnum[]
  }

  /**
   * division_table create
   */
  export type division_tableCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the division_table
     */
    select?: division_tableSelect<ExtArgs> | null
    /**
     * Omit specific fields from the division_table
     */
    omit?: division_tableOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: division_tableInclude<ExtArgs> | null
    /**
     * The data needed to create a division_table.
     */
    data: XOR<division_tableCreateInput, division_tableUncheckedCreateInput>
  }

  /**
   * division_table createMany
   */
  export type division_tableCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many division_tables.
     */
    data: division_tableCreateManyInput | division_tableCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * division_table createManyAndReturn
   */
  export type division_tableCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the division_table
     */
    select?: division_tableSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the division_table
     */
    omit?: division_tableOmit<ExtArgs> | null
    /**
     * The data used to create many division_tables.
     */
    data: division_tableCreateManyInput | division_tableCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: division_tableIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * division_table update
   */
  export type division_tableUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the division_table
     */
    select?: division_tableSelect<ExtArgs> | null
    /**
     * Omit specific fields from the division_table
     */
    omit?: division_tableOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: division_tableInclude<ExtArgs> | null
    /**
     * The data needed to update a division_table.
     */
    data: XOR<division_tableUpdateInput, division_tableUncheckedUpdateInput>
    /**
     * Choose, which division_table to update.
     */
    where: division_tableWhereUniqueInput
  }

  /**
   * division_table updateMany
   */
  export type division_tableUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update division_tables.
     */
    data: XOR<division_tableUpdateManyMutationInput, division_tableUncheckedUpdateManyInput>
    /**
     * Filter which division_tables to update
     */
    where?: division_tableWhereInput
    /**
     * Limit how many division_tables to update.
     */
    limit?: number
  }

  /**
   * division_table updateManyAndReturn
   */
  export type division_tableUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the division_table
     */
    select?: division_tableSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the division_table
     */
    omit?: division_tableOmit<ExtArgs> | null
    /**
     * The data used to update division_tables.
     */
    data: XOR<division_tableUpdateManyMutationInput, division_tableUncheckedUpdateManyInput>
    /**
     * Filter which division_tables to update
     */
    where?: division_tableWhereInput
    /**
     * Limit how many division_tables to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: division_tableIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * division_table upsert
   */
  export type division_tableUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the division_table
     */
    select?: division_tableSelect<ExtArgs> | null
    /**
     * Omit specific fields from the division_table
     */
    omit?: division_tableOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: division_tableInclude<ExtArgs> | null
    /**
     * The filter to search for the division_table to update in case it exists.
     */
    where: division_tableWhereUniqueInput
    /**
     * In case the division_table found by the `where` argument doesn't exist, create a new division_table with this data.
     */
    create: XOR<division_tableCreateInput, division_tableUncheckedCreateInput>
    /**
     * In case the division_table was found with the provided `where` argument, update it with this data.
     */
    update: XOR<division_tableUpdateInput, division_tableUncheckedUpdateInput>
  }

  /**
   * division_table delete
   */
  export type division_tableDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the division_table
     */
    select?: division_tableSelect<ExtArgs> | null
    /**
     * Omit specific fields from the division_table
     */
    omit?: division_tableOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: division_tableInclude<ExtArgs> | null
    /**
     * Filter which division_table to delete.
     */
    where: division_tableWhereUniqueInput
  }

  /**
   * division_table deleteMany
   */
  export type division_tableDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which division_tables to delete
     */
    where?: division_tableWhereInput
    /**
     * Limit how many division_tables to delete.
     */
    limit?: number
  }

  /**
   * division_table.ward_table
   */
  export type division_table$ward_tableArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ward_table
     */
    select?: ward_tableSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ward_table
     */
    omit?: ward_tableOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ward_tableInclude<ExtArgs> | null
    where?: ward_tableWhereInput
    orderBy?: ward_tableOrderByWithRelationInput | ward_tableOrderByWithRelationInput[]
    cursor?: ward_tableWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Ward_tableScalarFieldEnum | Ward_tableScalarFieldEnum[]
  }

  /**
   * division_table without action
   */
  export type division_tableDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the division_table
     */
    select?: division_tableSelect<ExtArgs> | null
    /**
     * Omit specific fields from the division_table
     */
    omit?: division_tableOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: division_tableInclude<ExtArgs> | null
  }


  /**
   * Model ward_table
   */

  export type AggregateWard_table = {
    _count: Ward_tableCountAggregateOutputType | null
    _avg: Ward_tableAvgAggregateOutputType | null
    _sum: Ward_tableSumAggregateOutputType | null
    _min: Ward_tableMinAggregateOutputType | null
    _max: Ward_tableMaxAggregateOutputType | null
  }

  export type Ward_tableAvgAggregateOutputType = {
    ward_id: number | null
    ward_no: number | null
    city_id: number | null
    zone_id: number | null
    division_id: number | null
  }

  export type Ward_tableSumAggregateOutputType = {
    ward_id: number | null
    ward_no: number | null
    city_id: number | null
    zone_id: number | null
    division_id: number | null
  }

  export type Ward_tableMinAggregateOutputType = {
    ward_id: number | null
    ward_no: number | null
    ward_name: string | null
    city_id: number | null
    zone_id: number | null
    division_id: number | null
    created_at: Date | null
  }

  export type Ward_tableMaxAggregateOutputType = {
    ward_id: number | null
    ward_no: number | null
    ward_name: string | null
    city_id: number | null
    zone_id: number | null
    division_id: number | null
    created_at: Date | null
  }

  export type Ward_tableCountAggregateOutputType = {
    ward_id: number
    ward_no: number
    ward_name: number
    city_id: number
    zone_id: number
    division_id: number
    geo_boundary: number
    created_at: number
    _all: number
  }


  export type Ward_tableAvgAggregateInputType = {
    ward_id?: true
    ward_no?: true
    city_id?: true
    zone_id?: true
    division_id?: true
  }

  export type Ward_tableSumAggregateInputType = {
    ward_id?: true
    ward_no?: true
    city_id?: true
    zone_id?: true
    division_id?: true
  }

  export type Ward_tableMinAggregateInputType = {
    ward_id?: true
    ward_no?: true
    ward_name?: true
    city_id?: true
    zone_id?: true
    division_id?: true
    created_at?: true
  }

  export type Ward_tableMaxAggregateInputType = {
    ward_id?: true
    ward_no?: true
    ward_name?: true
    city_id?: true
    zone_id?: true
    division_id?: true
    created_at?: true
  }

  export type Ward_tableCountAggregateInputType = {
    ward_id?: true
    ward_no?: true
    ward_name?: true
    city_id?: true
    zone_id?: true
    division_id?: true
    geo_boundary?: true
    created_at?: true
    _all?: true
  }

  export type Ward_tableAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ward_table to aggregate.
     */
    where?: ward_tableWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ward_tables to fetch.
     */
    orderBy?: ward_tableOrderByWithRelationInput | ward_tableOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ward_tableWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ward_tables from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ward_tables.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ward_tables
    **/
    _count?: true | Ward_tableCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Ward_tableAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Ward_tableSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Ward_tableMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Ward_tableMaxAggregateInputType
  }

  export type GetWard_tableAggregateType<T extends Ward_tableAggregateArgs> = {
        [P in keyof T & keyof AggregateWard_table]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateWard_table[P]>
      : GetScalarType<T[P], AggregateWard_table[P]>
  }




  export type ward_tableGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ward_tableWhereInput
    orderBy?: ward_tableOrderByWithAggregationInput | ward_tableOrderByWithAggregationInput[]
    by: Ward_tableScalarFieldEnum[] | Ward_tableScalarFieldEnum
    having?: ward_tableScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Ward_tableCountAggregateInputType | true
    _avg?: Ward_tableAvgAggregateInputType
    _sum?: Ward_tableSumAggregateInputType
    _min?: Ward_tableMinAggregateInputType
    _max?: Ward_tableMaxAggregateInputType
  }

  export type Ward_tableGroupByOutputType = {
    ward_id: number
    ward_no: number
    ward_name: string
    city_id: number
    zone_id: number
    division_id: number
    geo_boundary: JsonValue | null
    created_at: Date | null
    _count: Ward_tableCountAggregateOutputType | null
    _avg: Ward_tableAvgAggregateOutputType | null
    _sum: Ward_tableSumAggregateOutputType | null
    _min: Ward_tableMinAggregateOutputType | null
    _max: Ward_tableMaxAggregateOutputType | null
  }

  type GetWard_tableGroupByPayload<T extends ward_tableGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Ward_tableGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Ward_tableGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Ward_tableGroupByOutputType[P]>
            : GetScalarType<T[P], Ward_tableGroupByOutputType[P]>
        }
      >
    >


  export type ward_tableSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    ward_id?: boolean
    ward_no?: boolean
    ward_name?: boolean
    city_id?: boolean
    zone_id?: boolean
    division_id?: boolean
    geo_boundary?: boolean
    created_at?: boolean
    city_table?: boolean | city_tableDefaultArgs<ExtArgs>
    division_table?: boolean | division_tableDefaultArgs<ExtArgs>
    zone_table?: boolean | zone_tableDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["ward_table"]>

  export type ward_tableSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    ward_id?: boolean
    ward_no?: boolean
    ward_name?: boolean
    city_id?: boolean
    zone_id?: boolean
    division_id?: boolean
    geo_boundary?: boolean
    created_at?: boolean
    city_table?: boolean | city_tableDefaultArgs<ExtArgs>
    division_table?: boolean | division_tableDefaultArgs<ExtArgs>
    zone_table?: boolean | zone_tableDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["ward_table"]>

  export type ward_tableSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    ward_id?: boolean
    ward_no?: boolean
    ward_name?: boolean
    city_id?: boolean
    zone_id?: boolean
    division_id?: boolean
    geo_boundary?: boolean
    created_at?: boolean
    city_table?: boolean | city_tableDefaultArgs<ExtArgs>
    division_table?: boolean | division_tableDefaultArgs<ExtArgs>
    zone_table?: boolean | zone_tableDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["ward_table"]>

  export type ward_tableSelectScalar = {
    ward_id?: boolean
    ward_no?: boolean
    ward_name?: boolean
    city_id?: boolean
    zone_id?: boolean
    division_id?: boolean
    geo_boundary?: boolean
    created_at?: boolean
  }

  export type ward_tableOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"ward_id" | "ward_no" | "ward_name" | "city_id" | "zone_id" | "division_id" | "geo_boundary" | "created_at", ExtArgs["result"]["ward_table"]>
  export type ward_tableInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    city_table?: boolean | city_tableDefaultArgs<ExtArgs>
    division_table?: boolean | division_tableDefaultArgs<ExtArgs>
    zone_table?: boolean | zone_tableDefaultArgs<ExtArgs>
  }
  export type ward_tableIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    city_table?: boolean | city_tableDefaultArgs<ExtArgs>
    division_table?: boolean | division_tableDefaultArgs<ExtArgs>
    zone_table?: boolean | zone_tableDefaultArgs<ExtArgs>
  }
  export type ward_tableIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    city_table?: boolean | city_tableDefaultArgs<ExtArgs>
    division_table?: boolean | division_tableDefaultArgs<ExtArgs>
    zone_table?: boolean | zone_tableDefaultArgs<ExtArgs>
  }

  export type $ward_tablePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ward_table"
    objects: {
      city_table: Prisma.$city_tablePayload<ExtArgs>
      division_table: Prisma.$division_tablePayload<ExtArgs>
      zone_table: Prisma.$zone_tablePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      ward_id: number
      ward_no: number
      ward_name: string
      city_id: number
      zone_id: number
      division_id: number
      geo_boundary: Prisma.JsonValue | null
      created_at: Date | null
    }, ExtArgs["result"]["ward_table"]>
    composites: {}
  }

  type ward_tableGetPayload<S extends boolean | null | undefined | ward_tableDefaultArgs> = $Result.GetResult<Prisma.$ward_tablePayload, S>

  type ward_tableCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ward_tableFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Ward_tableCountAggregateInputType | true
    }

  export interface ward_tableDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ward_table'], meta: { name: 'ward_table' } }
    /**
     * Find zero or one Ward_table that matches the filter.
     * @param {ward_tableFindUniqueArgs} args - Arguments to find a Ward_table
     * @example
     * // Get one Ward_table
     * const ward_table = await prisma.ward_table.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ward_tableFindUniqueArgs>(args: SelectSubset<T, ward_tableFindUniqueArgs<ExtArgs>>): Prisma__ward_tableClient<$Result.GetResult<Prisma.$ward_tablePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Ward_table that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ward_tableFindUniqueOrThrowArgs} args - Arguments to find a Ward_table
     * @example
     * // Get one Ward_table
     * const ward_table = await prisma.ward_table.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ward_tableFindUniqueOrThrowArgs>(args: SelectSubset<T, ward_tableFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ward_tableClient<$Result.GetResult<Prisma.$ward_tablePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Ward_table that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ward_tableFindFirstArgs} args - Arguments to find a Ward_table
     * @example
     * // Get one Ward_table
     * const ward_table = await prisma.ward_table.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ward_tableFindFirstArgs>(args?: SelectSubset<T, ward_tableFindFirstArgs<ExtArgs>>): Prisma__ward_tableClient<$Result.GetResult<Prisma.$ward_tablePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Ward_table that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ward_tableFindFirstOrThrowArgs} args - Arguments to find a Ward_table
     * @example
     * // Get one Ward_table
     * const ward_table = await prisma.ward_table.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ward_tableFindFirstOrThrowArgs>(args?: SelectSubset<T, ward_tableFindFirstOrThrowArgs<ExtArgs>>): Prisma__ward_tableClient<$Result.GetResult<Prisma.$ward_tablePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Ward_tables that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ward_tableFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Ward_tables
     * const ward_tables = await prisma.ward_table.findMany()
     * 
     * // Get first 10 Ward_tables
     * const ward_tables = await prisma.ward_table.findMany({ take: 10 })
     * 
     * // Only select the `ward_id`
     * const ward_tableWithWard_idOnly = await prisma.ward_table.findMany({ select: { ward_id: true } })
     * 
     */
    findMany<T extends ward_tableFindManyArgs>(args?: SelectSubset<T, ward_tableFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ward_tablePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Ward_table.
     * @param {ward_tableCreateArgs} args - Arguments to create a Ward_table.
     * @example
     * // Create one Ward_table
     * const Ward_table = await prisma.ward_table.create({
     *   data: {
     *     // ... data to create a Ward_table
     *   }
     * })
     * 
     */
    create<T extends ward_tableCreateArgs>(args: SelectSubset<T, ward_tableCreateArgs<ExtArgs>>): Prisma__ward_tableClient<$Result.GetResult<Prisma.$ward_tablePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Ward_tables.
     * @param {ward_tableCreateManyArgs} args - Arguments to create many Ward_tables.
     * @example
     * // Create many Ward_tables
     * const ward_table = await prisma.ward_table.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ward_tableCreateManyArgs>(args?: SelectSubset<T, ward_tableCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Ward_tables and returns the data saved in the database.
     * @param {ward_tableCreateManyAndReturnArgs} args - Arguments to create many Ward_tables.
     * @example
     * // Create many Ward_tables
     * const ward_table = await prisma.ward_table.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Ward_tables and only return the `ward_id`
     * const ward_tableWithWard_idOnly = await prisma.ward_table.createManyAndReturn({
     *   select: { ward_id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ward_tableCreateManyAndReturnArgs>(args?: SelectSubset<T, ward_tableCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ward_tablePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Ward_table.
     * @param {ward_tableDeleteArgs} args - Arguments to delete one Ward_table.
     * @example
     * // Delete one Ward_table
     * const Ward_table = await prisma.ward_table.delete({
     *   where: {
     *     // ... filter to delete one Ward_table
     *   }
     * })
     * 
     */
    delete<T extends ward_tableDeleteArgs>(args: SelectSubset<T, ward_tableDeleteArgs<ExtArgs>>): Prisma__ward_tableClient<$Result.GetResult<Prisma.$ward_tablePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Ward_table.
     * @param {ward_tableUpdateArgs} args - Arguments to update one Ward_table.
     * @example
     * // Update one Ward_table
     * const ward_table = await prisma.ward_table.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ward_tableUpdateArgs>(args: SelectSubset<T, ward_tableUpdateArgs<ExtArgs>>): Prisma__ward_tableClient<$Result.GetResult<Prisma.$ward_tablePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Ward_tables.
     * @param {ward_tableDeleteManyArgs} args - Arguments to filter Ward_tables to delete.
     * @example
     * // Delete a few Ward_tables
     * const { count } = await prisma.ward_table.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ward_tableDeleteManyArgs>(args?: SelectSubset<T, ward_tableDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Ward_tables.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ward_tableUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Ward_tables
     * const ward_table = await prisma.ward_table.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ward_tableUpdateManyArgs>(args: SelectSubset<T, ward_tableUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Ward_tables and returns the data updated in the database.
     * @param {ward_tableUpdateManyAndReturnArgs} args - Arguments to update many Ward_tables.
     * @example
     * // Update many Ward_tables
     * const ward_table = await prisma.ward_table.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Ward_tables and only return the `ward_id`
     * const ward_tableWithWard_idOnly = await prisma.ward_table.updateManyAndReturn({
     *   select: { ward_id: true },
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
    updateManyAndReturn<T extends ward_tableUpdateManyAndReturnArgs>(args: SelectSubset<T, ward_tableUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ward_tablePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Ward_table.
     * @param {ward_tableUpsertArgs} args - Arguments to update or create a Ward_table.
     * @example
     * // Update or create a Ward_table
     * const ward_table = await prisma.ward_table.upsert({
     *   create: {
     *     // ... data to create a Ward_table
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Ward_table we want to update
     *   }
     * })
     */
    upsert<T extends ward_tableUpsertArgs>(args: SelectSubset<T, ward_tableUpsertArgs<ExtArgs>>): Prisma__ward_tableClient<$Result.GetResult<Prisma.$ward_tablePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Ward_tables.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ward_tableCountArgs} args - Arguments to filter Ward_tables to count.
     * @example
     * // Count the number of Ward_tables
     * const count = await prisma.ward_table.count({
     *   where: {
     *     // ... the filter for the Ward_tables we want to count
     *   }
     * })
    **/
    count<T extends ward_tableCountArgs>(
      args?: Subset<T, ward_tableCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Ward_tableCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Ward_table.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Ward_tableAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends Ward_tableAggregateArgs>(args: Subset<T, Ward_tableAggregateArgs>): Prisma.PrismaPromise<GetWard_tableAggregateType<T>>

    /**
     * Group by Ward_table.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ward_tableGroupByArgs} args - Group by arguments.
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
      T extends ward_tableGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ward_tableGroupByArgs['orderBy'] }
        : { orderBy?: ward_tableGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ward_tableGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWard_tableGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ward_table model
   */
  readonly fields: ward_tableFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ward_table.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ward_tableClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    city_table<T extends city_tableDefaultArgs<ExtArgs> = {}>(args?: Subset<T, city_tableDefaultArgs<ExtArgs>>): Prisma__city_tableClient<$Result.GetResult<Prisma.$city_tablePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    division_table<T extends division_tableDefaultArgs<ExtArgs> = {}>(args?: Subset<T, division_tableDefaultArgs<ExtArgs>>): Prisma__division_tableClient<$Result.GetResult<Prisma.$division_tablePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    zone_table<T extends zone_tableDefaultArgs<ExtArgs> = {}>(args?: Subset<T, zone_tableDefaultArgs<ExtArgs>>): Prisma__zone_tableClient<$Result.GetResult<Prisma.$zone_tablePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the ward_table model
   */
  interface ward_tableFieldRefs {
    readonly ward_id: FieldRef<"ward_table", 'Int'>
    readonly ward_no: FieldRef<"ward_table", 'Int'>
    readonly ward_name: FieldRef<"ward_table", 'String'>
    readonly city_id: FieldRef<"ward_table", 'Int'>
    readonly zone_id: FieldRef<"ward_table", 'Int'>
    readonly division_id: FieldRef<"ward_table", 'Int'>
    readonly geo_boundary: FieldRef<"ward_table", 'Json'>
    readonly created_at: FieldRef<"ward_table", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ward_table findUnique
   */
  export type ward_tableFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ward_table
     */
    select?: ward_tableSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ward_table
     */
    omit?: ward_tableOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ward_tableInclude<ExtArgs> | null
    /**
     * Filter, which ward_table to fetch.
     */
    where: ward_tableWhereUniqueInput
  }

  /**
   * ward_table findUniqueOrThrow
   */
  export type ward_tableFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ward_table
     */
    select?: ward_tableSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ward_table
     */
    omit?: ward_tableOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ward_tableInclude<ExtArgs> | null
    /**
     * Filter, which ward_table to fetch.
     */
    where: ward_tableWhereUniqueInput
  }

  /**
   * ward_table findFirst
   */
  export type ward_tableFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ward_table
     */
    select?: ward_tableSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ward_table
     */
    omit?: ward_tableOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ward_tableInclude<ExtArgs> | null
    /**
     * Filter, which ward_table to fetch.
     */
    where?: ward_tableWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ward_tables to fetch.
     */
    orderBy?: ward_tableOrderByWithRelationInput | ward_tableOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ward_tables.
     */
    cursor?: ward_tableWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ward_tables from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ward_tables.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ward_tables.
     */
    distinct?: Ward_tableScalarFieldEnum | Ward_tableScalarFieldEnum[]
  }

  /**
   * ward_table findFirstOrThrow
   */
  export type ward_tableFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ward_table
     */
    select?: ward_tableSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ward_table
     */
    omit?: ward_tableOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ward_tableInclude<ExtArgs> | null
    /**
     * Filter, which ward_table to fetch.
     */
    where?: ward_tableWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ward_tables to fetch.
     */
    orderBy?: ward_tableOrderByWithRelationInput | ward_tableOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ward_tables.
     */
    cursor?: ward_tableWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ward_tables from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ward_tables.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ward_tables.
     */
    distinct?: Ward_tableScalarFieldEnum | Ward_tableScalarFieldEnum[]
  }

  /**
   * ward_table findMany
   */
  export type ward_tableFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ward_table
     */
    select?: ward_tableSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ward_table
     */
    omit?: ward_tableOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ward_tableInclude<ExtArgs> | null
    /**
     * Filter, which ward_tables to fetch.
     */
    where?: ward_tableWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ward_tables to fetch.
     */
    orderBy?: ward_tableOrderByWithRelationInput | ward_tableOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ward_tables.
     */
    cursor?: ward_tableWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ward_tables from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ward_tables.
     */
    skip?: number
    distinct?: Ward_tableScalarFieldEnum | Ward_tableScalarFieldEnum[]
  }

  /**
   * ward_table create
   */
  export type ward_tableCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ward_table
     */
    select?: ward_tableSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ward_table
     */
    omit?: ward_tableOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ward_tableInclude<ExtArgs> | null
    /**
     * The data needed to create a ward_table.
     */
    data: XOR<ward_tableCreateInput, ward_tableUncheckedCreateInput>
  }

  /**
   * ward_table createMany
   */
  export type ward_tableCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ward_tables.
     */
    data: ward_tableCreateManyInput | ward_tableCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ward_table createManyAndReturn
   */
  export type ward_tableCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ward_table
     */
    select?: ward_tableSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ward_table
     */
    omit?: ward_tableOmit<ExtArgs> | null
    /**
     * The data used to create many ward_tables.
     */
    data: ward_tableCreateManyInput | ward_tableCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ward_tableIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ward_table update
   */
  export type ward_tableUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ward_table
     */
    select?: ward_tableSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ward_table
     */
    omit?: ward_tableOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ward_tableInclude<ExtArgs> | null
    /**
     * The data needed to update a ward_table.
     */
    data: XOR<ward_tableUpdateInput, ward_tableUncheckedUpdateInput>
    /**
     * Choose, which ward_table to update.
     */
    where: ward_tableWhereUniqueInput
  }

  /**
   * ward_table updateMany
   */
  export type ward_tableUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ward_tables.
     */
    data: XOR<ward_tableUpdateManyMutationInput, ward_tableUncheckedUpdateManyInput>
    /**
     * Filter which ward_tables to update
     */
    where?: ward_tableWhereInput
    /**
     * Limit how many ward_tables to update.
     */
    limit?: number
  }

  /**
   * ward_table updateManyAndReturn
   */
  export type ward_tableUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ward_table
     */
    select?: ward_tableSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ward_table
     */
    omit?: ward_tableOmit<ExtArgs> | null
    /**
     * The data used to update ward_tables.
     */
    data: XOR<ward_tableUpdateManyMutationInput, ward_tableUncheckedUpdateManyInput>
    /**
     * Filter which ward_tables to update
     */
    where?: ward_tableWhereInput
    /**
     * Limit how many ward_tables to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ward_tableIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ward_table upsert
   */
  export type ward_tableUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ward_table
     */
    select?: ward_tableSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ward_table
     */
    omit?: ward_tableOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ward_tableInclude<ExtArgs> | null
    /**
     * The filter to search for the ward_table to update in case it exists.
     */
    where: ward_tableWhereUniqueInput
    /**
     * In case the ward_table found by the `where` argument doesn't exist, create a new ward_table with this data.
     */
    create: XOR<ward_tableCreateInput, ward_tableUncheckedCreateInput>
    /**
     * In case the ward_table was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ward_tableUpdateInput, ward_tableUncheckedUpdateInput>
  }

  /**
   * ward_table delete
   */
  export type ward_tableDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ward_table
     */
    select?: ward_tableSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ward_table
     */
    omit?: ward_tableOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ward_tableInclude<ExtArgs> | null
    /**
     * Filter which ward_table to delete.
     */
    where: ward_tableWhereUniqueInput
  }

  /**
   * ward_table deleteMany
   */
  export type ward_tableDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ward_tables to delete
     */
    where?: ward_tableWhereInput
    /**
     * Limit how many ward_tables to delete.
     */
    limit?: number
  }

  /**
   * ward_table without action
   */
  export type ward_tableDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ward_table
     */
    select?: ward_tableSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ward_table
     */
    omit?: ward_tableOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ward_tableInclude<ExtArgs> | null
  }


  /**
   * Model zone_table
   */

  export type AggregateZone_table = {
    _count: Zone_tableCountAggregateOutputType | null
    _avg: Zone_tableAvgAggregateOutputType | null
    _sum: Zone_tableSumAggregateOutputType | null
    _min: Zone_tableMinAggregateOutputType | null
    _max: Zone_tableMaxAggregateOutputType | null
  }

  export type Zone_tableAvgAggregateOutputType = {
    zone_id: number | null
    city_id: number | null
    total_divisions: number | null
    total_wards: number | null
  }

  export type Zone_tableSumAggregateOutputType = {
    zone_id: number | null
    city_id: number | null
    total_divisions: number | null
    total_wards: number | null
  }

  export type Zone_tableMinAggregateOutputType = {
    zone_id: number | null
    zone_name: string | null
    city_id: number | null
    total_divisions: number | null
    total_wards: number | null
    created_at: Date | null
  }

  export type Zone_tableMaxAggregateOutputType = {
    zone_id: number | null
    zone_name: string | null
    city_id: number | null
    total_divisions: number | null
    total_wards: number | null
    created_at: Date | null
  }

  export type Zone_tableCountAggregateOutputType = {
    zone_id: number
    zone_name: number
    city_id: number
    total_divisions: number
    total_wards: number
    geo_boundary: number
    created_at: number
    _all: number
  }


  export type Zone_tableAvgAggregateInputType = {
    zone_id?: true
    city_id?: true
    total_divisions?: true
    total_wards?: true
  }

  export type Zone_tableSumAggregateInputType = {
    zone_id?: true
    city_id?: true
    total_divisions?: true
    total_wards?: true
  }

  export type Zone_tableMinAggregateInputType = {
    zone_id?: true
    zone_name?: true
    city_id?: true
    total_divisions?: true
    total_wards?: true
    created_at?: true
  }

  export type Zone_tableMaxAggregateInputType = {
    zone_id?: true
    zone_name?: true
    city_id?: true
    total_divisions?: true
    total_wards?: true
    created_at?: true
  }

  export type Zone_tableCountAggregateInputType = {
    zone_id?: true
    zone_name?: true
    city_id?: true
    total_divisions?: true
    total_wards?: true
    geo_boundary?: true
    created_at?: true
    _all?: true
  }

  export type Zone_tableAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which zone_table to aggregate.
     */
    where?: zone_tableWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of zone_tables to fetch.
     */
    orderBy?: zone_tableOrderByWithRelationInput | zone_tableOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: zone_tableWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` zone_tables from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` zone_tables.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned zone_tables
    **/
    _count?: true | Zone_tableCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Zone_tableAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Zone_tableSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Zone_tableMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Zone_tableMaxAggregateInputType
  }

  export type GetZone_tableAggregateType<T extends Zone_tableAggregateArgs> = {
        [P in keyof T & keyof AggregateZone_table]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateZone_table[P]>
      : GetScalarType<T[P], AggregateZone_table[P]>
  }




  export type zone_tableGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: zone_tableWhereInput
    orderBy?: zone_tableOrderByWithAggregationInput | zone_tableOrderByWithAggregationInput[]
    by: Zone_tableScalarFieldEnum[] | Zone_tableScalarFieldEnum
    having?: zone_tableScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Zone_tableCountAggregateInputType | true
    _avg?: Zone_tableAvgAggregateInputType
    _sum?: Zone_tableSumAggregateInputType
    _min?: Zone_tableMinAggregateInputType
    _max?: Zone_tableMaxAggregateInputType
  }

  export type Zone_tableGroupByOutputType = {
    zone_id: number
    zone_name: string
    city_id: number
    total_divisions: number | null
    total_wards: number | null
    geo_boundary: JsonValue | null
    created_at: Date | null
    _count: Zone_tableCountAggregateOutputType | null
    _avg: Zone_tableAvgAggregateOutputType | null
    _sum: Zone_tableSumAggregateOutputType | null
    _min: Zone_tableMinAggregateOutputType | null
    _max: Zone_tableMaxAggregateOutputType | null
  }

  type GetZone_tableGroupByPayload<T extends zone_tableGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Zone_tableGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Zone_tableGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Zone_tableGroupByOutputType[P]>
            : GetScalarType<T[P], Zone_tableGroupByOutputType[P]>
        }
      >
    >


  export type zone_tableSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    zone_id?: boolean
    zone_name?: boolean
    city_id?: boolean
    total_divisions?: boolean
    total_wards?: boolean
    geo_boundary?: boolean
    created_at?: boolean
    division_table?: boolean | zone_table$division_tableArgs<ExtArgs>
    ward_table?: boolean | zone_table$ward_tableArgs<ExtArgs>
    city_table?: boolean | city_tableDefaultArgs<ExtArgs>
    _count?: boolean | Zone_tableCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["zone_table"]>

  export type zone_tableSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    zone_id?: boolean
    zone_name?: boolean
    city_id?: boolean
    total_divisions?: boolean
    total_wards?: boolean
    geo_boundary?: boolean
    created_at?: boolean
    city_table?: boolean | city_tableDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["zone_table"]>

  export type zone_tableSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    zone_id?: boolean
    zone_name?: boolean
    city_id?: boolean
    total_divisions?: boolean
    total_wards?: boolean
    geo_boundary?: boolean
    created_at?: boolean
    city_table?: boolean | city_tableDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["zone_table"]>

  export type zone_tableSelectScalar = {
    zone_id?: boolean
    zone_name?: boolean
    city_id?: boolean
    total_divisions?: boolean
    total_wards?: boolean
    geo_boundary?: boolean
    created_at?: boolean
  }

  export type zone_tableOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"zone_id" | "zone_name" | "city_id" | "total_divisions" | "total_wards" | "geo_boundary" | "created_at", ExtArgs["result"]["zone_table"]>
  export type zone_tableInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    division_table?: boolean | zone_table$division_tableArgs<ExtArgs>
    ward_table?: boolean | zone_table$ward_tableArgs<ExtArgs>
    city_table?: boolean | city_tableDefaultArgs<ExtArgs>
    _count?: boolean | Zone_tableCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type zone_tableIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    city_table?: boolean | city_tableDefaultArgs<ExtArgs>
  }
  export type zone_tableIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    city_table?: boolean | city_tableDefaultArgs<ExtArgs>
  }

  export type $zone_tablePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "zone_table"
    objects: {
      division_table: Prisma.$division_tablePayload<ExtArgs>[]
      ward_table: Prisma.$ward_tablePayload<ExtArgs>[]
      city_table: Prisma.$city_tablePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      zone_id: number
      zone_name: string
      city_id: number
      total_divisions: number | null
      total_wards: number | null
      geo_boundary: Prisma.JsonValue | null
      created_at: Date | null
    }, ExtArgs["result"]["zone_table"]>
    composites: {}
  }

  type zone_tableGetPayload<S extends boolean | null | undefined | zone_tableDefaultArgs> = $Result.GetResult<Prisma.$zone_tablePayload, S>

  type zone_tableCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<zone_tableFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Zone_tableCountAggregateInputType | true
    }

  export interface zone_tableDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['zone_table'], meta: { name: 'zone_table' } }
    /**
     * Find zero or one Zone_table that matches the filter.
     * @param {zone_tableFindUniqueArgs} args - Arguments to find a Zone_table
     * @example
     * // Get one Zone_table
     * const zone_table = await prisma.zone_table.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends zone_tableFindUniqueArgs>(args: SelectSubset<T, zone_tableFindUniqueArgs<ExtArgs>>): Prisma__zone_tableClient<$Result.GetResult<Prisma.$zone_tablePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Zone_table that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {zone_tableFindUniqueOrThrowArgs} args - Arguments to find a Zone_table
     * @example
     * // Get one Zone_table
     * const zone_table = await prisma.zone_table.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends zone_tableFindUniqueOrThrowArgs>(args: SelectSubset<T, zone_tableFindUniqueOrThrowArgs<ExtArgs>>): Prisma__zone_tableClient<$Result.GetResult<Prisma.$zone_tablePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Zone_table that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {zone_tableFindFirstArgs} args - Arguments to find a Zone_table
     * @example
     * // Get one Zone_table
     * const zone_table = await prisma.zone_table.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends zone_tableFindFirstArgs>(args?: SelectSubset<T, zone_tableFindFirstArgs<ExtArgs>>): Prisma__zone_tableClient<$Result.GetResult<Prisma.$zone_tablePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Zone_table that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {zone_tableFindFirstOrThrowArgs} args - Arguments to find a Zone_table
     * @example
     * // Get one Zone_table
     * const zone_table = await prisma.zone_table.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends zone_tableFindFirstOrThrowArgs>(args?: SelectSubset<T, zone_tableFindFirstOrThrowArgs<ExtArgs>>): Prisma__zone_tableClient<$Result.GetResult<Prisma.$zone_tablePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Zone_tables that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {zone_tableFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Zone_tables
     * const zone_tables = await prisma.zone_table.findMany()
     * 
     * // Get first 10 Zone_tables
     * const zone_tables = await prisma.zone_table.findMany({ take: 10 })
     * 
     * // Only select the `zone_id`
     * const zone_tableWithZone_idOnly = await prisma.zone_table.findMany({ select: { zone_id: true } })
     * 
     */
    findMany<T extends zone_tableFindManyArgs>(args?: SelectSubset<T, zone_tableFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$zone_tablePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Zone_table.
     * @param {zone_tableCreateArgs} args - Arguments to create a Zone_table.
     * @example
     * // Create one Zone_table
     * const Zone_table = await prisma.zone_table.create({
     *   data: {
     *     // ... data to create a Zone_table
     *   }
     * })
     * 
     */
    create<T extends zone_tableCreateArgs>(args: SelectSubset<T, zone_tableCreateArgs<ExtArgs>>): Prisma__zone_tableClient<$Result.GetResult<Prisma.$zone_tablePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Zone_tables.
     * @param {zone_tableCreateManyArgs} args - Arguments to create many Zone_tables.
     * @example
     * // Create many Zone_tables
     * const zone_table = await prisma.zone_table.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends zone_tableCreateManyArgs>(args?: SelectSubset<T, zone_tableCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Zone_tables and returns the data saved in the database.
     * @param {zone_tableCreateManyAndReturnArgs} args - Arguments to create many Zone_tables.
     * @example
     * // Create many Zone_tables
     * const zone_table = await prisma.zone_table.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Zone_tables and only return the `zone_id`
     * const zone_tableWithZone_idOnly = await prisma.zone_table.createManyAndReturn({
     *   select: { zone_id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends zone_tableCreateManyAndReturnArgs>(args?: SelectSubset<T, zone_tableCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$zone_tablePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Zone_table.
     * @param {zone_tableDeleteArgs} args - Arguments to delete one Zone_table.
     * @example
     * // Delete one Zone_table
     * const Zone_table = await prisma.zone_table.delete({
     *   where: {
     *     // ... filter to delete one Zone_table
     *   }
     * })
     * 
     */
    delete<T extends zone_tableDeleteArgs>(args: SelectSubset<T, zone_tableDeleteArgs<ExtArgs>>): Prisma__zone_tableClient<$Result.GetResult<Prisma.$zone_tablePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Zone_table.
     * @param {zone_tableUpdateArgs} args - Arguments to update one Zone_table.
     * @example
     * // Update one Zone_table
     * const zone_table = await prisma.zone_table.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends zone_tableUpdateArgs>(args: SelectSubset<T, zone_tableUpdateArgs<ExtArgs>>): Prisma__zone_tableClient<$Result.GetResult<Prisma.$zone_tablePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Zone_tables.
     * @param {zone_tableDeleteManyArgs} args - Arguments to filter Zone_tables to delete.
     * @example
     * // Delete a few Zone_tables
     * const { count } = await prisma.zone_table.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends zone_tableDeleteManyArgs>(args?: SelectSubset<T, zone_tableDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Zone_tables.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {zone_tableUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Zone_tables
     * const zone_table = await prisma.zone_table.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends zone_tableUpdateManyArgs>(args: SelectSubset<T, zone_tableUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Zone_tables and returns the data updated in the database.
     * @param {zone_tableUpdateManyAndReturnArgs} args - Arguments to update many Zone_tables.
     * @example
     * // Update many Zone_tables
     * const zone_table = await prisma.zone_table.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Zone_tables and only return the `zone_id`
     * const zone_tableWithZone_idOnly = await prisma.zone_table.updateManyAndReturn({
     *   select: { zone_id: true },
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
    updateManyAndReturn<T extends zone_tableUpdateManyAndReturnArgs>(args: SelectSubset<T, zone_tableUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$zone_tablePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Zone_table.
     * @param {zone_tableUpsertArgs} args - Arguments to update or create a Zone_table.
     * @example
     * // Update or create a Zone_table
     * const zone_table = await prisma.zone_table.upsert({
     *   create: {
     *     // ... data to create a Zone_table
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Zone_table we want to update
     *   }
     * })
     */
    upsert<T extends zone_tableUpsertArgs>(args: SelectSubset<T, zone_tableUpsertArgs<ExtArgs>>): Prisma__zone_tableClient<$Result.GetResult<Prisma.$zone_tablePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Zone_tables.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {zone_tableCountArgs} args - Arguments to filter Zone_tables to count.
     * @example
     * // Count the number of Zone_tables
     * const count = await prisma.zone_table.count({
     *   where: {
     *     // ... the filter for the Zone_tables we want to count
     *   }
     * })
    **/
    count<T extends zone_tableCountArgs>(
      args?: Subset<T, zone_tableCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Zone_tableCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Zone_table.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Zone_tableAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends Zone_tableAggregateArgs>(args: Subset<T, Zone_tableAggregateArgs>): Prisma.PrismaPromise<GetZone_tableAggregateType<T>>

    /**
     * Group by Zone_table.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {zone_tableGroupByArgs} args - Group by arguments.
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
      T extends zone_tableGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: zone_tableGroupByArgs['orderBy'] }
        : { orderBy?: zone_tableGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, zone_tableGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetZone_tableGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the zone_table model
   */
  readonly fields: zone_tableFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for zone_table.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__zone_tableClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    division_table<T extends zone_table$division_tableArgs<ExtArgs> = {}>(args?: Subset<T, zone_table$division_tableArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$division_tablePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    ward_table<T extends zone_table$ward_tableArgs<ExtArgs> = {}>(args?: Subset<T, zone_table$ward_tableArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ward_tablePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    city_table<T extends city_tableDefaultArgs<ExtArgs> = {}>(args?: Subset<T, city_tableDefaultArgs<ExtArgs>>): Prisma__city_tableClient<$Result.GetResult<Prisma.$city_tablePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the zone_table model
   */
  interface zone_tableFieldRefs {
    readonly zone_id: FieldRef<"zone_table", 'Int'>
    readonly zone_name: FieldRef<"zone_table", 'String'>
    readonly city_id: FieldRef<"zone_table", 'Int'>
    readonly total_divisions: FieldRef<"zone_table", 'Int'>
    readonly total_wards: FieldRef<"zone_table", 'Int'>
    readonly geo_boundary: FieldRef<"zone_table", 'Json'>
    readonly created_at: FieldRef<"zone_table", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * zone_table findUnique
   */
  export type zone_tableFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the zone_table
     */
    select?: zone_tableSelect<ExtArgs> | null
    /**
     * Omit specific fields from the zone_table
     */
    omit?: zone_tableOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: zone_tableInclude<ExtArgs> | null
    /**
     * Filter, which zone_table to fetch.
     */
    where: zone_tableWhereUniqueInput
  }

  /**
   * zone_table findUniqueOrThrow
   */
  export type zone_tableFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the zone_table
     */
    select?: zone_tableSelect<ExtArgs> | null
    /**
     * Omit specific fields from the zone_table
     */
    omit?: zone_tableOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: zone_tableInclude<ExtArgs> | null
    /**
     * Filter, which zone_table to fetch.
     */
    where: zone_tableWhereUniqueInput
  }

  /**
   * zone_table findFirst
   */
  export type zone_tableFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the zone_table
     */
    select?: zone_tableSelect<ExtArgs> | null
    /**
     * Omit specific fields from the zone_table
     */
    omit?: zone_tableOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: zone_tableInclude<ExtArgs> | null
    /**
     * Filter, which zone_table to fetch.
     */
    where?: zone_tableWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of zone_tables to fetch.
     */
    orderBy?: zone_tableOrderByWithRelationInput | zone_tableOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for zone_tables.
     */
    cursor?: zone_tableWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` zone_tables from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` zone_tables.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of zone_tables.
     */
    distinct?: Zone_tableScalarFieldEnum | Zone_tableScalarFieldEnum[]
  }

  /**
   * zone_table findFirstOrThrow
   */
  export type zone_tableFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the zone_table
     */
    select?: zone_tableSelect<ExtArgs> | null
    /**
     * Omit specific fields from the zone_table
     */
    omit?: zone_tableOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: zone_tableInclude<ExtArgs> | null
    /**
     * Filter, which zone_table to fetch.
     */
    where?: zone_tableWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of zone_tables to fetch.
     */
    orderBy?: zone_tableOrderByWithRelationInput | zone_tableOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for zone_tables.
     */
    cursor?: zone_tableWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` zone_tables from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` zone_tables.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of zone_tables.
     */
    distinct?: Zone_tableScalarFieldEnum | Zone_tableScalarFieldEnum[]
  }

  /**
   * zone_table findMany
   */
  export type zone_tableFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the zone_table
     */
    select?: zone_tableSelect<ExtArgs> | null
    /**
     * Omit specific fields from the zone_table
     */
    omit?: zone_tableOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: zone_tableInclude<ExtArgs> | null
    /**
     * Filter, which zone_tables to fetch.
     */
    where?: zone_tableWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of zone_tables to fetch.
     */
    orderBy?: zone_tableOrderByWithRelationInput | zone_tableOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing zone_tables.
     */
    cursor?: zone_tableWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` zone_tables from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` zone_tables.
     */
    skip?: number
    distinct?: Zone_tableScalarFieldEnum | Zone_tableScalarFieldEnum[]
  }

  /**
   * zone_table create
   */
  export type zone_tableCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the zone_table
     */
    select?: zone_tableSelect<ExtArgs> | null
    /**
     * Omit specific fields from the zone_table
     */
    omit?: zone_tableOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: zone_tableInclude<ExtArgs> | null
    /**
     * The data needed to create a zone_table.
     */
    data: XOR<zone_tableCreateInput, zone_tableUncheckedCreateInput>
  }

  /**
   * zone_table createMany
   */
  export type zone_tableCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many zone_tables.
     */
    data: zone_tableCreateManyInput | zone_tableCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * zone_table createManyAndReturn
   */
  export type zone_tableCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the zone_table
     */
    select?: zone_tableSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the zone_table
     */
    omit?: zone_tableOmit<ExtArgs> | null
    /**
     * The data used to create many zone_tables.
     */
    data: zone_tableCreateManyInput | zone_tableCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: zone_tableIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * zone_table update
   */
  export type zone_tableUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the zone_table
     */
    select?: zone_tableSelect<ExtArgs> | null
    /**
     * Omit specific fields from the zone_table
     */
    omit?: zone_tableOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: zone_tableInclude<ExtArgs> | null
    /**
     * The data needed to update a zone_table.
     */
    data: XOR<zone_tableUpdateInput, zone_tableUncheckedUpdateInput>
    /**
     * Choose, which zone_table to update.
     */
    where: zone_tableWhereUniqueInput
  }

  /**
   * zone_table updateMany
   */
  export type zone_tableUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update zone_tables.
     */
    data: XOR<zone_tableUpdateManyMutationInput, zone_tableUncheckedUpdateManyInput>
    /**
     * Filter which zone_tables to update
     */
    where?: zone_tableWhereInput
    /**
     * Limit how many zone_tables to update.
     */
    limit?: number
  }

  /**
   * zone_table updateManyAndReturn
   */
  export type zone_tableUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the zone_table
     */
    select?: zone_tableSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the zone_table
     */
    omit?: zone_tableOmit<ExtArgs> | null
    /**
     * The data used to update zone_tables.
     */
    data: XOR<zone_tableUpdateManyMutationInput, zone_tableUncheckedUpdateManyInput>
    /**
     * Filter which zone_tables to update
     */
    where?: zone_tableWhereInput
    /**
     * Limit how many zone_tables to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: zone_tableIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * zone_table upsert
   */
  export type zone_tableUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the zone_table
     */
    select?: zone_tableSelect<ExtArgs> | null
    /**
     * Omit specific fields from the zone_table
     */
    omit?: zone_tableOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: zone_tableInclude<ExtArgs> | null
    /**
     * The filter to search for the zone_table to update in case it exists.
     */
    where: zone_tableWhereUniqueInput
    /**
     * In case the zone_table found by the `where` argument doesn't exist, create a new zone_table with this data.
     */
    create: XOR<zone_tableCreateInput, zone_tableUncheckedCreateInput>
    /**
     * In case the zone_table was found with the provided `where` argument, update it with this data.
     */
    update: XOR<zone_tableUpdateInput, zone_tableUncheckedUpdateInput>
  }

  /**
   * zone_table delete
   */
  export type zone_tableDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the zone_table
     */
    select?: zone_tableSelect<ExtArgs> | null
    /**
     * Omit specific fields from the zone_table
     */
    omit?: zone_tableOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: zone_tableInclude<ExtArgs> | null
    /**
     * Filter which zone_table to delete.
     */
    where: zone_tableWhereUniqueInput
  }

  /**
   * zone_table deleteMany
   */
  export type zone_tableDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which zone_tables to delete
     */
    where?: zone_tableWhereInput
    /**
     * Limit how many zone_tables to delete.
     */
    limit?: number
  }

  /**
   * zone_table.division_table
   */
  export type zone_table$division_tableArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the division_table
     */
    select?: division_tableSelect<ExtArgs> | null
    /**
     * Omit specific fields from the division_table
     */
    omit?: division_tableOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: division_tableInclude<ExtArgs> | null
    where?: division_tableWhereInput
    orderBy?: division_tableOrderByWithRelationInput | division_tableOrderByWithRelationInput[]
    cursor?: division_tableWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Division_tableScalarFieldEnum | Division_tableScalarFieldEnum[]
  }

  /**
   * zone_table.ward_table
   */
  export type zone_table$ward_tableArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ward_table
     */
    select?: ward_tableSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ward_table
     */
    omit?: ward_tableOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ward_tableInclude<ExtArgs> | null
    where?: ward_tableWhereInput
    orderBy?: ward_tableOrderByWithRelationInput | ward_tableOrderByWithRelationInput[]
    cursor?: ward_tableWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Ward_tableScalarFieldEnum | Ward_tableScalarFieldEnum[]
  }

  /**
   * zone_table without action
   */
  export type zone_tableDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the zone_table
     */
    select?: zone_tableSelect<ExtArgs> | null
    /**
     * Omit specific fields from the zone_table
     */
    omit?: zone_tableOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: zone_tableInclude<ExtArgs> | null
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
    created_at: 'created_at'
  };

  export type City_tableScalarFieldEnum = (typeof City_tableScalarFieldEnum)[keyof typeof City_tableScalarFieldEnum]


  export const Division_tableScalarFieldEnum: {
    division_id: 'division_id',
    division_name: 'division_name',
    city_id: 'city_id',
    zone_id: 'zone_id',
    geo_boundary: 'geo_boundary',
    created_at: 'created_at'
  };

  export type Division_tableScalarFieldEnum = (typeof Division_tableScalarFieldEnum)[keyof typeof Division_tableScalarFieldEnum]


  export const Ward_tableScalarFieldEnum: {
    ward_id: 'ward_id',
    ward_no: 'ward_no',
    ward_name: 'ward_name',
    city_id: 'city_id',
    zone_id: 'zone_id',
    division_id: 'division_id',
    geo_boundary: 'geo_boundary',
    created_at: 'created_at'
  };

  export type Ward_tableScalarFieldEnum = (typeof Ward_tableScalarFieldEnum)[keyof typeof Ward_tableScalarFieldEnum]


  export const Zone_tableScalarFieldEnum: {
    zone_id: 'zone_id',
    zone_name: 'zone_name',
    city_id: 'city_id',
    total_divisions: 'total_divisions',
    total_wards: 'total_wards',
    geo_boundary: 'geo_boundary',
    created_at: 'created_at'
  };

  export type Zone_tableScalarFieldEnum = (typeof Zone_tableScalarFieldEnum)[keyof typeof Zone_tableScalarFieldEnum]


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
    division_table?: Division_tableListRelationFilter
    ward_table?: Ward_tableListRelationFilter
    zone_table?: Zone_tableListRelationFilter
  }

  export type city_tableOrderByWithRelationInput = {
    city_id?: SortOrder
    city_name?: SortOrder
    geo_boundary?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    division_table?: division_tableOrderByRelationAggregateInput
    ward_table?: ward_tableOrderByRelationAggregateInput
    zone_table?: zone_tableOrderByRelationAggregateInput
  }

  export type city_tableWhereUniqueInput = Prisma.AtLeast<{
    city_id?: number
    city_name?: string
    AND?: city_tableWhereInput | city_tableWhereInput[]
    OR?: city_tableWhereInput[]
    NOT?: city_tableWhereInput | city_tableWhereInput[]
    geo_boundary?: JsonNullableFilter<"city_table">
    created_at?: DateTimeNullableFilter<"city_table"> | Date | string | null
    division_table?: Division_tableListRelationFilter
    ward_table?: Ward_tableListRelationFilter
    zone_table?: Zone_tableListRelationFilter
  }, "city_id" | "city_name">

  export type city_tableOrderByWithAggregationInput = {
    city_id?: SortOrder
    city_name?: SortOrder
    geo_boundary?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
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
  }

  export type division_tableWhereInput = {
    AND?: division_tableWhereInput | division_tableWhereInput[]
    OR?: division_tableWhereInput[]
    NOT?: division_tableWhereInput | division_tableWhereInput[]
    division_id?: IntFilter<"division_table"> | number
    division_name?: StringFilter<"division_table"> | string
    city_id?: IntFilter<"division_table"> | number
    zone_id?: IntFilter<"division_table"> | number
    geo_boundary?: JsonNullableFilter<"division_table">
    created_at?: DateTimeNullableFilter<"division_table"> | Date | string | null
    city_table?: XOR<City_tableScalarRelationFilter, city_tableWhereInput>
    zone_table?: XOR<Zone_tableScalarRelationFilter, zone_tableWhereInput>
    ward_table?: Ward_tableListRelationFilter
  }

  export type division_tableOrderByWithRelationInput = {
    division_id?: SortOrder
    division_name?: SortOrder
    city_id?: SortOrder
    zone_id?: SortOrder
    geo_boundary?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    city_table?: city_tableOrderByWithRelationInput
    zone_table?: zone_tableOrderByWithRelationInput
    ward_table?: ward_tableOrderByRelationAggregateInput
  }

  export type division_tableWhereUniqueInput = Prisma.AtLeast<{
    division_id?: number
    AND?: division_tableWhereInput | division_tableWhereInput[]
    OR?: division_tableWhereInput[]
    NOT?: division_tableWhereInput | division_tableWhereInput[]
    division_name?: StringFilter<"division_table"> | string
    city_id?: IntFilter<"division_table"> | number
    zone_id?: IntFilter<"division_table"> | number
    geo_boundary?: JsonNullableFilter<"division_table">
    created_at?: DateTimeNullableFilter<"division_table"> | Date | string | null
    city_table?: XOR<City_tableScalarRelationFilter, city_tableWhereInput>
    zone_table?: XOR<Zone_tableScalarRelationFilter, zone_tableWhereInput>
    ward_table?: Ward_tableListRelationFilter
  }, "division_id">

  export type division_tableOrderByWithAggregationInput = {
    division_id?: SortOrder
    division_name?: SortOrder
    city_id?: SortOrder
    zone_id?: SortOrder
    geo_boundary?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    _count?: division_tableCountOrderByAggregateInput
    _avg?: division_tableAvgOrderByAggregateInput
    _max?: division_tableMaxOrderByAggregateInput
    _min?: division_tableMinOrderByAggregateInput
    _sum?: division_tableSumOrderByAggregateInput
  }

  export type division_tableScalarWhereWithAggregatesInput = {
    AND?: division_tableScalarWhereWithAggregatesInput | division_tableScalarWhereWithAggregatesInput[]
    OR?: division_tableScalarWhereWithAggregatesInput[]
    NOT?: division_tableScalarWhereWithAggregatesInput | division_tableScalarWhereWithAggregatesInput[]
    division_id?: IntWithAggregatesFilter<"division_table"> | number
    division_name?: StringWithAggregatesFilter<"division_table"> | string
    city_id?: IntWithAggregatesFilter<"division_table"> | number
    zone_id?: IntWithAggregatesFilter<"division_table"> | number
    geo_boundary?: JsonNullableWithAggregatesFilter<"division_table">
    created_at?: DateTimeNullableWithAggregatesFilter<"division_table"> | Date | string | null
  }

  export type ward_tableWhereInput = {
    AND?: ward_tableWhereInput | ward_tableWhereInput[]
    OR?: ward_tableWhereInput[]
    NOT?: ward_tableWhereInput | ward_tableWhereInput[]
    ward_id?: IntFilter<"ward_table"> | number
    ward_no?: IntFilter<"ward_table"> | number
    ward_name?: StringFilter<"ward_table"> | string
    city_id?: IntFilter<"ward_table"> | number
    zone_id?: IntFilter<"ward_table"> | number
    division_id?: IntFilter<"ward_table"> | number
    geo_boundary?: JsonNullableFilter<"ward_table">
    created_at?: DateTimeNullableFilter<"ward_table"> | Date | string | null
    city_table?: XOR<City_tableScalarRelationFilter, city_tableWhereInput>
    division_table?: XOR<Division_tableScalarRelationFilter, division_tableWhereInput>
    zone_table?: XOR<Zone_tableScalarRelationFilter, zone_tableWhereInput>
  }

  export type ward_tableOrderByWithRelationInput = {
    ward_id?: SortOrder
    ward_no?: SortOrder
    ward_name?: SortOrder
    city_id?: SortOrder
    zone_id?: SortOrder
    division_id?: SortOrder
    geo_boundary?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    city_table?: city_tableOrderByWithRelationInput
    division_table?: division_tableOrderByWithRelationInput
    zone_table?: zone_tableOrderByWithRelationInput
  }

  export type ward_tableWhereUniqueInput = Prisma.AtLeast<{
    ward_id?: number
    ward_no?: number
    AND?: ward_tableWhereInput | ward_tableWhereInput[]
    OR?: ward_tableWhereInput[]
    NOT?: ward_tableWhereInput | ward_tableWhereInput[]
    ward_name?: StringFilter<"ward_table"> | string
    city_id?: IntFilter<"ward_table"> | number
    zone_id?: IntFilter<"ward_table"> | number
    division_id?: IntFilter<"ward_table"> | number
    geo_boundary?: JsonNullableFilter<"ward_table">
    created_at?: DateTimeNullableFilter<"ward_table"> | Date | string | null
    city_table?: XOR<City_tableScalarRelationFilter, city_tableWhereInput>
    division_table?: XOR<Division_tableScalarRelationFilter, division_tableWhereInput>
    zone_table?: XOR<Zone_tableScalarRelationFilter, zone_tableWhereInput>
  }, "ward_id" | "ward_no">

  export type ward_tableOrderByWithAggregationInput = {
    ward_id?: SortOrder
    ward_no?: SortOrder
    ward_name?: SortOrder
    city_id?: SortOrder
    zone_id?: SortOrder
    division_id?: SortOrder
    geo_boundary?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    _count?: ward_tableCountOrderByAggregateInput
    _avg?: ward_tableAvgOrderByAggregateInput
    _max?: ward_tableMaxOrderByAggregateInput
    _min?: ward_tableMinOrderByAggregateInput
    _sum?: ward_tableSumOrderByAggregateInput
  }

  export type ward_tableScalarWhereWithAggregatesInput = {
    AND?: ward_tableScalarWhereWithAggregatesInput | ward_tableScalarWhereWithAggregatesInput[]
    OR?: ward_tableScalarWhereWithAggregatesInput[]
    NOT?: ward_tableScalarWhereWithAggregatesInput | ward_tableScalarWhereWithAggregatesInput[]
    ward_id?: IntWithAggregatesFilter<"ward_table"> | number
    ward_no?: IntWithAggregatesFilter<"ward_table"> | number
    ward_name?: StringWithAggregatesFilter<"ward_table"> | string
    city_id?: IntWithAggregatesFilter<"ward_table"> | number
    zone_id?: IntWithAggregatesFilter<"ward_table"> | number
    division_id?: IntWithAggregatesFilter<"ward_table"> | number
    geo_boundary?: JsonNullableWithAggregatesFilter<"ward_table">
    created_at?: DateTimeNullableWithAggregatesFilter<"ward_table"> | Date | string | null
  }

  export type zone_tableWhereInput = {
    AND?: zone_tableWhereInput | zone_tableWhereInput[]
    OR?: zone_tableWhereInput[]
    NOT?: zone_tableWhereInput | zone_tableWhereInput[]
    zone_id?: IntFilter<"zone_table"> | number
    zone_name?: StringFilter<"zone_table"> | string
    city_id?: IntFilter<"zone_table"> | number
    total_divisions?: IntNullableFilter<"zone_table"> | number | null
    total_wards?: IntNullableFilter<"zone_table"> | number | null
    geo_boundary?: JsonNullableFilter<"zone_table">
    created_at?: DateTimeNullableFilter<"zone_table"> | Date | string | null
    division_table?: Division_tableListRelationFilter
    ward_table?: Ward_tableListRelationFilter
    city_table?: XOR<City_tableScalarRelationFilter, city_tableWhereInput>
  }

  export type zone_tableOrderByWithRelationInput = {
    zone_id?: SortOrder
    zone_name?: SortOrder
    city_id?: SortOrder
    total_divisions?: SortOrderInput | SortOrder
    total_wards?: SortOrderInput | SortOrder
    geo_boundary?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    division_table?: division_tableOrderByRelationAggregateInput
    ward_table?: ward_tableOrderByRelationAggregateInput
    city_table?: city_tableOrderByWithRelationInput
  }

  export type zone_tableWhereUniqueInput = Prisma.AtLeast<{
    zone_id?: number
    AND?: zone_tableWhereInput | zone_tableWhereInput[]
    OR?: zone_tableWhereInput[]
    NOT?: zone_tableWhereInput | zone_tableWhereInput[]
    zone_name?: StringFilter<"zone_table"> | string
    city_id?: IntFilter<"zone_table"> | number
    total_divisions?: IntNullableFilter<"zone_table"> | number | null
    total_wards?: IntNullableFilter<"zone_table"> | number | null
    geo_boundary?: JsonNullableFilter<"zone_table">
    created_at?: DateTimeNullableFilter<"zone_table"> | Date | string | null
    division_table?: Division_tableListRelationFilter
    ward_table?: Ward_tableListRelationFilter
    city_table?: XOR<City_tableScalarRelationFilter, city_tableWhereInput>
  }, "zone_id">

  export type zone_tableOrderByWithAggregationInput = {
    zone_id?: SortOrder
    zone_name?: SortOrder
    city_id?: SortOrder
    total_divisions?: SortOrderInput | SortOrder
    total_wards?: SortOrderInput | SortOrder
    geo_boundary?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    _count?: zone_tableCountOrderByAggregateInput
    _avg?: zone_tableAvgOrderByAggregateInput
    _max?: zone_tableMaxOrderByAggregateInput
    _min?: zone_tableMinOrderByAggregateInput
    _sum?: zone_tableSumOrderByAggregateInput
  }

  export type zone_tableScalarWhereWithAggregatesInput = {
    AND?: zone_tableScalarWhereWithAggregatesInput | zone_tableScalarWhereWithAggregatesInput[]
    OR?: zone_tableScalarWhereWithAggregatesInput[]
    NOT?: zone_tableScalarWhereWithAggregatesInput | zone_tableScalarWhereWithAggregatesInput[]
    zone_id?: IntWithAggregatesFilter<"zone_table"> | number
    zone_name?: StringWithAggregatesFilter<"zone_table"> | string
    city_id?: IntWithAggregatesFilter<"zone_table"> | number
    total_divisions?: IntNullableWithAggregatesFilter<"zone_table"> | number | null
    total_wards?: IntNullableWithAggregatesFilter<"zone_table"> | number | null
    geo_boundary?: JsonNullableWithAggregatesFilter<"zone_table">
    created_at?: DateTimeNullableWithAggregatesFilter<"zone_table"> | Date | string | null
  }

  export type city_tableCreateInput = {
    city_name: string
    geo_boundary?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
    division_table?: division_tableCreateNestedManyWithoutCity_tableInput
    ward_table?: ward_tableCreateNestedManyWithoutCity_tableInput
    zone_table?: zone_tableCreateNestedManyWithoutCity_tableInput
  }

  export type city_tableUncheckedCreateInput = {
    city_id?: number
    city_name: string
    geo_boundary?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
    division_table?: division_tableUncheckedCreateNestedManyWithoutCity_tableInput
    ward_table?: ward_tableUncheckedCreateNestedManyWithoutCity_tableInput
    zone_table?: zone_tableUncheckedCreateNestedManyWithoutCity_tableInput
  }

  export type city_tableUpdateInput = {
    city_name?: StringFieldUpdateOperationsInput | string
    geo_boundary?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    division_table?: division_tableUpdateManyWithoutCity_tableNestedInput
    ward_table?: ward_tableUpdateManyWithoutCity_tableNestedInput
    zone_table?: zone_tableUpdateManyWithoutCity_tableNestedInput
  }

  export type city_tableUncheckedUpdateInput = {
    city_id?: IntFieldUpdateOperationsInput | number
    city_name?: StringFieldUpdateOperationsInput | string
    geo_boundary?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    division_table?: division_tableUncheckedUpdateManyWithoutCity_tableNestedInput
    ward_table?: ward_tableUncheckedUpdateManyWithoutCity_tableNestedInput
    zone_table?: zone_tableUncheckedUpdateManyWithoutCity_tableNestedInput
  }

  export type city_tableCreateManyInput = {
    city_id?: number
    city_name: string
    geo_boundary?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
  }

  export type city_tableUpdateManyMutationInput = {
    city_name?: StringFieldUpdateOperationsInput | string
    geo_boundary?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type city_tableUncheckedUpdateManyInput = {
    city_id?: IntFieldUpdateOperationsInput | number
    city_name?: StringFieldUpdateOperationsInput | string
    geo_boundary?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type division_tableCreateInput = {
    division_name: string
    geo_boundary?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
    city_table: city_tableCreateNestedOneWithoutDivision_tableInput
    zone_table: zone_tableCreateNestedOneWithoutDivision_tableInput
    ward_table?: ward_tableCreateNestedManyWithoutDivision_tableInput
  }

  export type division_tableUncheckedCreateInput = {
    division_id?: number
    division_name: string
    city_id: number
    zone_id: number
    geo_boundary?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
    ward_table?: ward_tableUncheckedCreateNestedManyWithoutDivision_tableInput
  }

  export type division_tableUpdateInput = {
    division_name?: StringFieldUpdateOperationsInput | string
    geo_boundary?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    city_table?: city_tableUpdateOneRequiredWithoutDivision_tableNestedInput
    zone_table?: zone_tableUpdateOneRequiredWithoutDivision_tableNestedInput
    ward_table?: ward_tableUpdateManyWithoutDivision_tableNestedInput
  }

  export type division_tableUncheckedUpdateInput = {
    division_id?: IntFieldUpdateOperationsInput | number
    division_name?: StringFieldUpdateOperationsInput | string
    city_id?: IntFieldUpdateOperationsInput | number
    zone_id?: IntFieldUpdateOperationsInput | number
    geo_boundary?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ward_table?: ward_tableUncheckedUpdateManyWithoutDivision_tableNestedInput
  }

  export type division_tableCreateManyInput = {
    division_id?: number
    division_name: string
    city_id: number
    zone_id: number
    geo_boundary?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
  }

  export type division_tableUpdateManyMutationInput = {
    division_name?: StringFieldUpdateOperationsInput | string
    geo_boundary?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type division_tableUncheckedUpdateManyInput = {
    division_id?: IntFieldUpdateOperationsInput | number
    division_name?: StringFieldUpdateOperationsInput | string
    city_id?: IntFieldUpdateOperationsInput | number
    zone_id?: IntFieldUpdateOperationsInput | number
    geo_boundary?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ward_tableCreateInput = {
    ward_no: number
    ward_name: string
    geo_boundary?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
    city_table: city_tableCreateNestedOneWithoutWard_tableInput
    division_table: division_tableCreateNestedOneWithoutWard_tableInput
    zone_table: zone_tableCreateNestedOneWithoutWard_tableInput
  }

  export type ward_tableUncheckedCreateInput = {
    ward_id?: number
    ward_no: number
    ward_name: string
    city_id: number
    zone_id: number
    division_id: number
    geo_boundary?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
  }

  export type ward_tableUpdateInput = {
    ward_no?: IntFieldUpdateOperationsInput | number
    ward_name?: StringFieldUpdateOperationsInput | string
    geo_boundary?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    city_table?: city_tableUpdateOneRequiredWithoutWard_tableNestedInput
    division_table?: division_tableUpdateOneRequiredWithoutWard_tableNestedInput
    zone_table?: zone_tableUpdateOneRequiredWithoutWard_tableNestedInput
  }

  export type ward_tableUncheckedUpdateInput = {
    ward_id?: IntFieldUpdateOperationsInput | number
    ward_no?: IntFieldUpdateOperationsInput | number
    ward_name?: StringFieldUpdateOperationsInput | string
    city_id?: IntFieldUpdateOperationsInput | number
    zone_id?: IntFieldUpdateOperationsInput | number
    division_id?: IntFieldUpdateOperationsInput | number
    geo_boundary?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ward_tableCreateManyInput = {
    ward_id?: number
    ward_no: number
    ward_name: string
    city_id: number
    zone_id: number
    division_id: number
    geo_boundary?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
  }

  export type ward_tableUpdateManyMutationInput = {
    ward_no?: IntFieldUpdateOperationsInput | number
    ward_name?: StringFieldUpdateOperationsInput | string
    geo_boundary?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ward_tableUncheckedUpdateManyInput = {
    ward_id?: IntFieldUpdateOperationsInput | number
    ward_no?: IntFieldUpdateOperationsInput | number
    ward_name?: StringFieldUpdateOperationsInput | string
    city_id?: IntFieldUpdateOperationsInput | number
    zone_id?: IntFieldUpdateOperationsInput | number
    division_id?: IntFieldUpdateOperationsInput | number
    geo_boundary?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type zone_tableCreateInput = {
    zone_name: string
    total_divisions?: number | null
    total_wards?: number | null
    geo_boundary?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
    division_table?: division_tableCreateNestedManyWithoutZone_tableInput
    ward_table?: ward_tableCreateNestedManyWithoutZone_tableInput
    city_table: city_tableCreateNestedOneWithoutZone_tableInput
  }

  export type zone_tableUncheckedCreateInput = {
    zone_id?: number
    zone_name: string
    city_id: number
    total_divisions?: number | null
    total_wards?: number | null
    geo_boundary?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
    division_table?: division_tableUncheckedCreateNestedManyWithoutZone_tableInput
    ward_table?: ward_tableUncheckedCreateNestedManyWithoutZone_tableInput
  }

  export type zone_tableUpdateInput = {
    zone_name?: StringFieldUpdateOperationsInput | string
    total_divisions?: NullableIntFieldUpdateOperationsInput | number | null
    total_wards?: NullableIntFieldUpdateOperationsInput | number | null
    geo_boundary?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    division_table?: division_tableUpdateManyWithoutZone_tableNestedInput
    ward_table?: ward_tableUpdateManyWithoutZone_tableNestedInput
    city_table?: city_tableUpdateOneRequiredWithoutZone_tableNestedInput
  }

  export type zone_tableUncheckedUpdateInput = {
    zone_id?: IntFieldUpdateOperationsInput | number
    zone_name?: StringFieldUpdateOperationsInput | string
    city_id?: IntFieldUpdateOperationsInput | number
    total_divisions?: NullableIntFieldUpdateOperationsInput | number | null
    total_wards?: NullableIntFieldUpdateOperationsInput | number | null
    geo_boundary?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    division_table?: division_tableUncheckedUpdateManyWithoutZone_tableNestedInput
    ward_table?: ward_tableUncheckedUpdateManyWithoutZone_tableNestedInput
  }

  export type zone_tableCreateManyInput = {
    zone_id?: number
    zone_name: string
    city_id: number
    total_divisions?: number | null
    total_wards?: number | null
    geo_boundary?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
  }

  export type zone_tableUpdateManyMutationInput = {
    zone_name?: StringFieldUpdateOperationsInput | string
    total_divisions?: NullableIntFieldUpdateOperationsInput | number | null
    total_wards?: NullableIntFieldUpdateOperationsInput | number | null
    geo_boundary?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type zone_tableUncheckedUpdateManyInput = {
    zone_id?: IntFieldUpdateOperationsInput | number
    zone_name?: StringFieldUpdateOperationsInput | string
    city_id?: IntFieldUpdateOperationsInput | number
    total_divisions?: NullableIntFieldUpdateOperationsInput | number | null
    total_wards?: NullableIntFieldUpdateOperationsInput | number | null
    geo_boundary?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
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

  export type Division_tableListRelationFilter = {
    every?: division_tableWhereInput
    some?: division_tableWhereInput
    none?: division_tableWhereInput
  }

  export type Ward_tableListRelationFilter = {
    every?: ward_tableWhereInput
    some?: ward_tableWhereInput
    none?: ward_tableWhereInput
  }

  export type Zone_tableListRelationFilter = {
    every?: zone_tableWhereInput
    some?: zone_tableWhereInput
    none?: zone_tableWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type division_tableOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ward_tableOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type zone_tableOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type city_tableCountOrderByAggregateInput = {
    city_id?: SortOrder
    city_name?: SortOrder
    geo_boundary?: SortOrder
    created_at?: SortOrder
  }

  export type city_tableAvgOrderByAggregateInput = {
    city_id?: SortOrder
  }

  export type city_tableMaxOrderByAggregateInput = {
    city_id?: SortOrder
    city_name?: SortOrder
    created_at?: SortOrder
  }

  export type city_tableMinOrderByAggregateInput = {
    city_id?: SortOrder
    city_name?: SortOrder
    created_at?: SortOrder
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

  export type City_tableScalarRelationFilter = {
    is?: city_tableWhereInput
    isNot?: city_tableWhereInput
  }

  export type Zone_tableScalarRelationFilter = {
    is?: zone_tableWhereInput
    isNot?: zone_tableWhereInput
  }

  export type division_tableCountOrderByAggregateInput = {
    division_id?: SortOrder
    division_name?: SortOrder
    city_id?: SortOrder
    zone_id?: SortOrder
    geo_boundary?: SortOrder
    created_at?: SortOrder
  }

  export type division_tableAvgOrderByAggregateInput = {
    division_id?: SortOrder
    city_id?: SortOrder
    zone_id?: SortOrder
  }

  export type division_tableMaxOrderByAggregateInput = {
    division_id?: SortOrder
    division_name?: SortOrder
    city_id?: SortOrder
    zone_id?: SortOrder
    created_at?: SortOrder
  }

  export type division_tableMinOrderByAggregateInput = {
    division_id?: SortOrder
    division_name?: SortOrder
    city_id?: SortOrder
    zone_id?: SortOrder
    created_at?: SortOrder
  }

  export type division_tableSumOrderByAggregateInput = {
    division_id?: SortOrder
    city_id?: SortOrder
    zone_id?: SortOrder
  }

  export type Division_tableScalarRelationFilter = {
    is?: division_tableWhereInput
    isNot?: division_tableWhereInput
  }

  export type ward_tableCountOrderByAggregateInput = {
    ward_id?: SortOrder
    ward_no?: SortOrder
    ward_name?: SortOrder
    city_id?: SortOrder
    zone_id?: SortOrder
    division_id?: SortOrder
    geo_boundary?: SortOrder
    created_at?: SortOrder
  }

  export type ward_tableAvgOrderByAggregateInput = {
    ward_id?: SortOrder
    ward_no?: SortOrder
    city_id?: SortOrder
    zone_id?: SortOrder
    division_id?: SortOrder
  }

  export type ward_tableMaxOrderByAggregateInput = {
    ward_id?: SortOrder
    ward_no?: SortOrder
    ward_name?: SortOrder
    city_id?: SortOrder
    zone_id?: SortOrder
    division_id?: SortOrder
    created_at?: SortOrder
  }

  export type ward_tableMinOrderByAggregateInput = {
    ward_id?: SortOrder
    ward_no?: SortOrder
    ward_name?: SortOrder
    city_id?: SortOrder
    zone_id?: SortOrder
    division_id?: SortOrder
    created_at?: SortOrder
  }

  export type ward_tableSumOrderByAggregateInput = {
    ward_id?: SortOrder
    ward_no?: SortOrder
    city_id?: SortOrder
    zone_id?: SortOrder
    division_id?: SortOrder
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type zone_tableCountOrderByAggregateInput = {
    zone_id?: SortOrder
    zone_name?: SortOrder
    city_id?: SortOrder
    total_divisions?: SortOrder
    total_wards?: SortOrder
    geo_boundary?: SortOrder
    created_at?: SortOrder
  }

  export type zone_tableAvgOrderByAggregateInput = {
    zone_id?: SortOrder
    city_id?: SortOrder
    total_divisions?: SortOrder
    total_wards?: SortOrder
  }

  export type zone_tableMaxOrderByAggregateInput = {
    zone_id?: SortOrder
    zone_name?: SortOrder
    city_id?: SortOrder
    total_divisions?: SortOrder
    total_wards?: SortOrder
    created_at?: SortOrder
  }

  export type zone_tableMinOrderByAggregateInput = {
    zone_id?: SortOrder
    zone_name?: SortOrder
    city_id?: SortOrder
    total_divisions?: SortOrder
    total_wards?: SortOrder
    created_at?: SortOrder
  }

  export type zone_tableSumOrderByAggregateInput = {
    zone_id?: SortOrder
    city_id?: SortOrder
    total_divisions?: SortOrder
    total_wards?: SortOrder
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type division_tableCreateNestedManyWithoutCity_tableInput = {
    create?: XOR<division_tableCreateWithoutCity_tableInput, division_tableUncheckedCreateWithoutCity_tableInput> | division_tableCreateWithoutCity_tableInput[] | division_tableUncheckedCreateWithoutCity_tableInput[]
    connectOrCreate?: division_tableCreateOrConnectWithoutCity_tableInput | division_tableCreateOrConnectWithoutCity_tableInput[]
    createMany?: division_tableCreateManyCity_tableInputEnvelope
    connect?: division_tableWhereUniqueInput | division_tableWhereUniqueInput[]
  }

  export type ward_tableCreateNestedManyWithoutCity_tableInput = {
    create?: XOR<ward_tableCreateWithoutCity_tableInput, ward_tableUncheckedCreateWithoutCity_tableInput> | ward_tableCreateWithoutCity_tableInput[] | ward_tableUncheckedCreateWithoutCity_tableInput[]
    connectOrCreate?: ward_tableCreateOrConnectWithoutCity_tableInput | ward_tableCreateOrConnectWithoutCity_tableInput[]
    createMany?: ward_tableCreateManyCity_tableInputEnvelope
    connect?: ward_tableWhereUniqueInput | ward_tableWhereUniqueInput[]
  }

  export type zone_tableCreateNestedManyWithoutCity_tableInput = {
    create?: XOR<zone_tableCreateWithoutCity_tableInput, zone_tableUncheckedCreateWithoutCity_tableInput> | zone_tableCreateWithoutCity_tableInput[] | zone_tableUncheckedCreateWithoutCity_tableInput[]
    connectOrCreate?: zone_tableCreateOrConnectWithoutCity_tableInput | zone_tableCreateOrConnectWithoutCity_tableInput[]
    createMany?: zone_tableCreateManyCity_tableInputEnvelope
    connect?: zone_tableWhereUniqueInput | zone_tableWhereUniqueInput[]
  }

  export type division_tableUncheckedCreateNestedManyWithoutCity_tableInput = {
    create?: XOR<division_tableCreateWithoutCity_tableInput, division_tableUncheckedCreateWithoutCity_tableInput> | division_tableCreateWithoutCity_tableInput[] | division_tableUncheckedCreateWithoutCity_tableInput[]
    connectOrCreate?: division_tableCreateOrConnectWithoutCity_tableInput | division_tableCreateOrConnectWithoutCity_tableInput[]
    createMany?: division_tableCreateManyCity_tableInputEnvelope
    connect?: division_tableWhereUniqueInput | division_tableWhereUniqueInput[]
  }

  export type ward_tableUncheckedCreateNestedManyWithoutCity_tableInput = {
    create?: XOR<ward_tableCreateWithoutCity_tableInput, ward_tableUncheckedCreateWithoutCity_tableInput> | ward_tableCreateWithoutCity_tableInput[] | ward_tableUncheckedCreateWithoutCity_tableInput[]
    connectOrCreate?: ward_tableCreateOrConnectWithoutCity_tableInput | ward_tableCreateOrConnectWithoutCity_tableInput[]
    createMany?: ward_tableCreateManyCity_tableInputEnvelope
    connect?: ward_tableWhereUniqueInput | ward_tableWhereUniqueInput[]
  }

  export type zone_tableUncheckedCreateNestedManyWithoutCity_tableInput = {
    create?: XOR<zone_tableCreateWithoutCity_tableInput, zone_tableUncheckedCreateWithoutCity_tableInput> | zone_tableCreateWithoutCity_tableInput[] | zone_tableUncheckedCreateWithoutCity_tableInput[]
    connectOrCreate?: zone_tableCreateOrConnectWithoutCity_tableInput | zone_tableCreateOrConnectWithoutCity_tableInput[]
    createMany?: zone_tableCreateManyCity_tableInputEnvelope
    connect?: zone_tableWhereUniqueInput | zone_tableWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type division_tableUpdateManyWithoutCity_tableNestedInput = {
    create?: XOR<division_tableCreateWithoutCity_tableInput, division_tableUncheckedCreateWithoutCity_tableInput> | division_tableCreateWithoutCity_tableInput[] | division_tableUncheckedCreateWithoutCity_tableInput[]
    connectOrCreate?: division_tableCreateOrConnectWithoutCity_tableInput | division_tableCreateOrConnectWithoutCity_tableInput[]
    upsert?: division_tableUpsertWithWhereUniqueWithoutCity_tableInput | division_tableUpsertWithWhereUniqueWithoutCity_tableInput[]
    createMany?: division_tableCreateManyCity_tableInputEnvelope
    set?: division_tableWhereUniqueInput | division_tableWhereUniqueInput[]
    disconnect?: division_tableWhereUniqueInput | division_tableWhereUniqueInput[]
    delete?: division_tableWhereUniqueInput | division_tableWhereUniqueInput[]
    connect?: division_tableWhereUniqueInput | division_tableWhereUniqueInput[]
    update?: division_tableUpdateWithWhereUniqueWithoutCity_tableInput | division_tableUpdateWithWhereUniqueWithoutCity_tableInput[]
    updateMany?: division_tableUpdateManyWithWhereWithoutCity_tableInput | division_tableUpdateManyWithWhereWithoutCity_tableInput[]
    deleteMany?: division_tableScalarWhereInput | division_tableScalarWhereInput[]
  }

  export type ward_tableUpdateManyWithoutCity_tableNestedInput = {
    create?: XOR<ward_tableCreateWithoutCity_tableInput, ward_tableUncheckedCreateWithoutCity_tableInput> | ward_tableCreateWithoutCity_tableInput[] | ward_tableUncheckedCreateWithoutCity_tableInput[]
    connectOrCreate?: ward_tableCreateOrConnectWithoutCity_tableInput | ward_tableCreateOrConnectWithoutCity_tableInput[]
    upsert?: ward_tableUpsertWithWhereUniqueWithoutCity_tableInput | ward_tableUpsertWithWhereUniqueWithoutCity_tableInput[]
    createMany?: ward_tableCreateManyCity_tableInputEnvelope
    set?: ward_tableWhereUniqueInput | ward_tableWhereUniqueInput[]
    disconnect?: ward_tableWhereUniqueInput | ward_tableWhereUniqueInput[]
    delete?: ward_tableWhereUniqueInput | ward_tableWhereUniqueInput[]
    connect?: ward_tableWhereUniqueInput | ward_tableWhereUniqueInput[]
    update?: ward_tableUpdateWithWhereUniqueWithoutCity_tableInput | ward_tableUpdateWithWhereUniqueWithoutCity_tableInput[]
    updateMany?: ward_tableUpdateManyWithWhereWithoutCity_tableInput | ward_tableUpdateManyWithWhereWithoutCity_tableInput[]
    deleteMany?: ward_tableScalarWhereInput | ward_tableScalarWhereInput[]
  }

  export type zone_tableUpdateManyWithoutCity_tableNestedInput = {
    create?: XOR<zone_tableCreateWithoutCity_tableInput, zone_tableUncheckedCreateWithoutCity_tableInput> | zone_tableCreateWithoutCity_tableInput[] | zone_tableUncheckedCreateWithoutCity_tableInput[]
    connectOrCreate?: zone_tableCreateOrConnectWithoutCity_tableInput | zone_tableCreateOrConnectWithoutCity_tableInput[]
    upsert?: zone_tableUpsertWithWhereUniqueWithoutCity_tableInput | zone_tableUpsertWithWhereUniqueWithoutCity_tableInput[]
    createMany?: zone_tableCreateManyCity_tableInputEnvelope
    set?: zone_tableWhereUniqueInput | zone_tableWhereUniqueInput[]
    disconnect?: zone_tableWhereUniqueInput | zone_tableWhereUniqueInput[]
    delete?: zone_tableWhereUniqueInput | zone_tableWhereUniqueInput[]
    connect?: zone_tableWhereUniqueInput | zone_tableWhereUniqueInput[]
    update?: zone_tableUpdateWithWhereUniqueWithoutCity_tableInput | zone_tableUpdateWithWhereUniqueWithoutCity_tableInput[]
    updateMany?: zone_tableUpdateManyWithWhereWithoutCity_tableInput | zone_tableUpdateManyWithWhereWithoutCity_tableInput[]
    deleteMany?: zone_tableScalarWhereInput | zone_tableScalarWhereInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type division_tableUncheckedUpdateManyWithoutCity_tableNestedInput = {
    create?: XOR<division_tableCreateWithoutCity_tableInput, division_tableUncheckedCreateWithoutCity_tableInput> | division_tableCreateWithoutCity_tableInput[] | division_tableUncheckedCreateWithoutCity_tableInput[]
    connectOrCreate?: division_tableCreateOrConnectWithoutCity_tableInput | division_tableCreateOrConnectWithoutCity_tableInput[]
    upsert?: division_tableUpsertWithWhereUniqueWithoutCity_tableInput | division_tableUpsertWithWhereUniqueWithoutCity_tableInput[]
    createMany?: division_tableCreateManyCity_tableInputEnvelope
    set?: division_tableWhereUniqueInput | division_tableWhereUniqueInput[]
    disconnect?: division_tableWhereUniqueInput | division_tableWhereUniqueInput[]
    delete?: division_tableWhereUniqueInput | division_tableWhereUniqueInput[]
    connect?: division_tableWhereUniqueInput | division_tableWhereUniqueInput[]
    update?: division_tableUpdateWithWhereUniqueWithoutCity_tableInput | division_tableUpdateWithWhereUniqueWithoutCity_tableInput[]
    updateMany?: division_tableUpdateManyWithWhereWithoutCity_tableInput | division_tableUpdateManyWithWhereWithoutCity_tableInput[]
    deleteMany?: division_tableScalarWhereInput | division_tableScalarWhereInput[]
  }

  export type ward_tableUncheckedUpdateManyWithoutCity_tableNestedInput = {
    create?: XOR<ward_tableCreateWithoutCity_tableInput, ward_tableUncheckedCreateWithoutCity_tableInput> | ward_tableCreateWithoutCity_tableInput[] | ward_tableUncheckedCreateWithoutCity_tableInput[]
    connectOrCreate?: ward_tableCreateOrConnectWithoutCity_tableInput | ward_tableCreateOrConnectWithoutCity_tableInput[]
    upsert?: ward_tableUpsertWithWhereUniqueWithoutCity_tableInput | ward_tableUpsertWithWhereUniqueWithoutCity_tableInput[]
    createMany?: ward_tableCreateManyCity_tableInputEnvelope
    set?: ward_tableWhereUniqueInput | ward_tableWhereUniqueInput[]
    disconnect?: ward_tableWhereUniqueInput | ward_tableWhereUniqueInput[]
    delete?: ward_tableWhereUniqueInput | ward_tableWhereUniqueInput[]
    connect?: ward_tableWhereUniqueInput | ward_tableWhereUniqueInput[]
    update?: ward_tableUpdateWithWhereUniqueWithoutCity_tableInput | ward_tableUpdateWithWhereUniqueWithoutCity_tableInput[]
    updateMany?: ward_tableUpdateManyWithWhereWithoutCity_tableInput | ward_tableUpdateManyWithWhereWithoutCity_tableInput[]
    deleteMany?: ward_tableScalarWhereInput | ward_tableScalarWhereInput[]
  }

  export type zone_tableUncheckedUpdateManyWithoutCity_tableNestedInput = {
    create?: XOR<zone_tableCreateWithoutCity_tableInput, zone_tableUncheckedCreateWithoutCity_tableInput> | zone_tableCreateWithoutCity_tableInput[] | zone_tableUncheckedCreateWithoutCity_tableInput[]
    connectOrCreate?: zone_tableCreateOrConnectWithoutCity_tableInput | zone_tableCreateOrConnectWithoutCity_tableInput[]
    upsert?: zone_tableUpsertWithWhereUniqueWithoutCity_tableInput | zone_tableUpsertWithWhereUniqueWithoutCity_tableInput[]
    createMany?: zone_tableCreateManyCity_tableInputEnvelope
    set?: zone_tableWhereUniqueInput | zone_tableWhereUniqueInput[]
    disconnect?: zone_tableWhereUniqueInput | zone_tableWhereUniqueInput[]
    delete?: zone_tableWhereUniqueInput | zone_tableWhereUniqueInput[]
    connect?: zone_tableWhereUniqueInput | zone_tableWhereUniqueInput[]
    update?: zone_tableUpdateWithWhereUniqueWithoutCity_tableInput | zone_tableUpdateWithWhereUniqueWithoutCity_tableInput[]
    updateMany?: zone_tableUpdateManyWithWhereWithoutCity_tableInput | zone_tableUpdateManyWithWhereWithoutCity_tableInput[]
    deleteMany?: zone_tableScalarWhereInput | zone_tableScalarWhereInput[]
  }

  export type city_tableCreateNestedOneWithoutDivision_tableInput = {
    create?: XOR<city_tableCreateWithoutDivision_tableInput, city_tableUncheckedCreateWithoutDivision_tableInput>
    connectOrCreate?: city_tableCreateOrConnectWithoutDivision_tableInput
    connect?: city_tableWhereUniqueInput
  }

  export type zone_tableCreateNestedOneWithoutDivision_tableInput = {
    create?: XOR<zone_tableCreateWithoutDivision_tableInput, zone_tableUncheckedCreateWithoutDivision_tableInput>
    connectOrCreate?: zone_tableCreateOrConnectWithoutDivision_tableInput
    connect?: zone_tableWhereUniqueInput
  }

  export type ward_tableCreateNestedManyWithoutDivision_tableInput = {
    create?: XOR<ward_tableCreateWithoutDivision_tableInput, ward_tableUncheckedCreateWithoutDivision_tableInput> | ward_tableCreateWithoutDivision_tableInput[] | ward_tableUncheckedCreateWithoutDivision_tableInput[]
    connectOrCreate?: ward_tableCreateOrConnectWithoutDivision_tableInput | ward_tableCreateOrConnectWithoutDivision_tableInput[]
    createMany?: ward_tableCreateManyDivision_tableInputEnvelope
    connect?: ward_tableWhereUniqueInput | ward_tableWhereUniqueInput[]
  }

  export type ward_tableUncheckedCreateNestedManyWithoutDivision_tableInput = {
    create?: XOR<ward_tableCreateWithoutDivision_tableInput, ward_tableUncheckedCreateWithoutDivision_tableInput> | ward_tableCreateWithoutDivision_tableInput[] | ward_tableUncheckedCreateWithoutDivision_tableInput[]
    connectOrCreate?: ward_tableCreateOrConnectWithoutDivision_tableInput | ward_tableCreateOrConnectWithoutDivision_tableInput[]
    createMany?: ward_tableCreateManyDivision_tableInputEnvelope
    connect?: ward_tableWhereUniqueInput | ward_tableWhereUniqueInput[]
  }

  export type city_tableUpdateOneRequiredWithoutDivision_tableNestedInput = {
    create?: XOR<city_tableCreateWithoutDivision_tableInput, city_tableUncheckedCreateWithoutDivision_tableInput>
    connectOrCreate?: city_tableCreateOrConnectWithoutDivision_tableInput
    upsert?: city_tableUpsertWithoutDivision_tableInput
    connect?: city_tableWhereUniqueInput
    update?: XOR<XOR<city_tableUpdateToOneWithWhereWithoutDivision_tableInput, city_tableUpdateWithoutDivision_tableInput>, city_tableUncheckedUpdateWithoutDivision_tableInput>
  }

  export type zone_tableUpdateOneRequiredWithoutDivision_tableNestedInput = {
    create?: XOR<zone_tableCreateWithoutDivision_tableInput, zone_tableUncheckedCreateWithoutDivision_tableInput>
    connectOrCreate?: zone_tableCreateOrConnectWithoutDivision_tableInput
    upsert?: zone_tableUpsertWithoutDivision_tableInput
    connect?: zone_tableWhereUniqueInput
    update?: XOR<XOR<zone_tableUpdateToOneWithWhereWithoutDivision_tableInput, zone_tableUpdateWithoutDivision_tableInput>, zone_tableUncheckedUpdateWithoutDivision_tableInput>
  }

  export type ward_tableUpdateManyWithoutDivision_tableNestedInput = {
    create?: XOR<ward_tableCreateWithoutDivision_tableInput, ward_tableUncheckedCreateWithoutDivision_tableInput> | ward_tableCreateWithoutDivision_tableInput[] | ward_tableUncheckedCreateWithoutDivision_tableInput[]
    connectOrCreate?: ward_tableCreateOrConnectWithoutDivision_tableInput | ward_tableCreateOrConnectWithoutDivision_tableInput[]
    upsert?: ward_tableUpsertWithWhereUniqueWithoutDivision_tableInput | ward_tableUpsertWithWhereUniqueWithoutDivision_tableInput[]
    createMany?: ward_tableCreateManyDivision_tableInputEnvelope
    set?: ward_tableWhereUniqueInput | ward_tableWhereUniqueInput[]
    disconnect?: ward_tableWhereUniqueInput | ward_tableWhereUniqueInput[]
    delete?: ward_tableWhereUniqueInput | ward_tableWhereUniqueInput[]
    connect?: ward_tableWhereUniqueInput | ward_tableWhereUniqueInput[]
    update?: ward_tableUpdateWithWhereUniqueWithoutDivision_tableInput | ward_tableUpdateWithWhereUniqueWithoutDivision_tableInput[]
    updateMany?: ward_tableUpdateManyWithWhereWithoutDivision_tableInput | ward_tableUpdateManyWithWhereWithoutDivision_tableInput[]
    deleteMany?: ward_tableScalarWhereInput | ward_tableScalarWhereInput[]
  }

  export type ward_tableUncheckedUpdateManyWithoutDivision_tableNestedInput = {
    create?: XOR<ward_tableCreateWithoutDivision_tableInput, ward_tableUncheckedCreateWithoutDivision_tableInput> | ward_tableCreateWithoutDivision_tableInput[] | ward_tableUncheckedCreateWithoutDivision_tableInput[]
    connectOrCreate?: ward_tableCreateOrConnectWithoutDivision_tableInput | ward_tableCreateOrConnectWithoutDivision_tableInput[]
    upsert?: ward_tableUpsertWithWhereUniqueWithoutDivision_tableInput | ward_tableUpsertWithWhereUniqueWithoutDivision_tableInput[]
    createMany?: ward_tableCreateManyDivision_tableInputEnvelope
    set?: ward_tableWhereUniqueInput | ward_tableWhereUniqueInput[]
    disconnect?: ward_tableWhereUniqueInput | ward_tableWhereUniqueInput[]
    delete?: ward_tableWhereUniqueInput | ward_tableWhereUniqueInput[]
    connect?: ward_tableWhereUniqueInput | ward_tableWhereUniqueInput[]
    update?: ward_tableUpdateWithWhereUniqueWithoutDivision_tableInput | ward_tableUpdateWithWhereUniqueWithoutDivision_tableInput[]
    updateMany?: ward_tableUpdateManyWithWhereWithoutDivision_tableInput | ward_tableUpdateManyWithWhereWithoutDivision_tableInput[]
    deleteMany?: ward_tableScalarWhereInput | ward_tableScalarWhereInput[]
  }

  export type city_tableCreateNestedOneWithoutWard_tableInput = {
    create?: XOR<city_tableCreateWithoutWard_tableInput, city_tableUncheckedCreateWithoutWard_tableInput>
    connectOrCreate?: city_tableCreateOrConnectWithoutWard_tableInput
    connect?: city_tableWhereUniqueInput
  }

  export type division_tableCreateNestedOneWithoutWard_tableInput = {
    create?: XOR<division_tableCreateWithoutWard_tableInput, division_tableUncheckedCreateWithoutWard_tableInput>
    connectOrCreate?: division_tableCreateOrConnectWithoutWard_tableInput
    connect?: division_tableWhereUniqueInput
  }

  export type zone_tableCreateNestedOneWithoutWard_tableInput = {
    create?: XOR<zone_tableCreateWithoutWard_tableInput, zone_tableUncheckedCreateWithoutWard_tableInput>
    connectOrCreate?: zone_tableCreateOrConnectWithoutWard_tableInput
    connect?: zone_tableWhereUniqueInput
  }

  export type city_tableUpdateOneRequiredWithoutWard_tableNestedInput = {
    create?: XOR<city_tableCreateWithoutWard_tableInput, city_tableUncheckedCreateWithoutWard_tableInput>
    connectOrCreate?: city_tableCreateOrConnectWithoutWard_tableInput
    upsert?: city_tableUpsertWithoutWard_tableInput
    connect?: city_tableWhereUniqueInput
    update?: XOR<XOR<city_tableUpdateToOneWithWhereWithoutWard_tableInput, city_tableUpdateWithoutWard_tableInput>, city_tableUncheckedUpdateWithoutWard_tableInput>
  }

  export type division_tableUpdateOneRequiredWithoutWard_tableNestedInput = {
    create?: XOR<division_tableCreateWithoutWard_tableInput, division_tableUncheckedCreateWithoutWard_tableInput>
    connectOrCreate?: division_tableCreateOrConnectWithoutWard_tableInput
    upsert?: division_tableUpsertWithoutWard_tableInput
    connect?: division_tableWhereUniqueInput
    update?: XOR<XOR<division_tableUpdateToOneWithWhereWithoutWard_tableInput, division_tableUpdateWithoutWard_tableInput>, division_tableUncheckedUpdateWithoutWard_tableInput>
  }

  export type zone_tableUpdateOneRequiredWithoutWard_tableNestedInput = {
    create?: XOR<zone_tableCreateWithoutWard_tableInput, zone_tableUncheckedCreateWithoutWard_tableInput>
    connectOrCreate?: zone_tableCreateOrConnectWithoutWard_tableInput
    upsert?: zone_tableUpsertWithoutWard_tableInput
    connect?: zone_tableWhereUniqueInput
    update?: XOR<XOR<zone_tableUpdateToOneWithWhereWithoutWard_tableInput, zone_tableUpdateWithoutWard_tableInput>, zone_tableUncheckedUpdateWithoutWard_tableInput>
  }

  export type division_tableCreateNestedManyWithoutZone_tableInput = {
    create?: XOR<division_tableCreateWithoutZone_tableInput, division_tableUncheckedCreateWithoutZone_tableInput> | division_tableCreateWithoutZone_tableInput[] | division_tableUncheckedCreateWithoutZone_tableInput[]
    connectOrCreate?: division_tableCreateOrConnectWithoutZone_tableInput | division_tableCreateOrConnectWithoutZone_tableInput[]
    createMany?: division_tableCreateManyZone_tableInputEnvelope
    connect?: division_tableWhereUniqueInput | division_tableWhereUniqueInput[]
  }

  export type ward_tableCreateNestedManyWithoutZone_tableInput = {
    create?: XOR<ward_tableCreateWithoutZone_tableInput, ward_tableUncheckedCreateWithoutZone_tableInput> | ward_tableCreateWithoutZone_tableInput[] | ward_tableUncheckedCreateWithoutZone_tableInput[]
    connectOrCreate?: ward_tableCreateOrConnectWithoutZone_tableInput | ward_tableCreateOrConnectWithoutZone_tableInput[]
    createMany?: ward_tableCreateManyZone_tableInputEnvelope
    connect?: ward_tableWhereUniqueInput | ward_tableWhereUniqueInput[]
  }

  export type city_tableCreateNestedOneWithoutZone_tableInput = {
    create?: XOR<city_tableCreateWithoutZone_tableInput, city_tableUncheckedCreateWithoutZone_tableInput>
    connectOrCreate?: city_tableCreateOrConnectWithoutZone_tableInput
    connect?: city_tableWhereUniqueInput
  }

  export type division_tableUncheckedCreateNestedManyWithoutZone_tableInput = {
    create?: XOR<division_tableCreateWithoutZone_tableInput, division_tableUncheckedCreateWithoutZone_tableInput> | division_tableCreateWithoutZone_tableInput[] | division_tableUncheckedCreateWithoutZone_tableInput[]
    connectOrCreate?: division_tableCreateOrConnectWithoutZone_tableInput | division_tableCreateOrConnectWithoutZone_tableInput[]
    createMany?: division_tableCreateManyZone_tableInputEnvelope
    connect?: division_tableWhereUniqueInput | division_tableWhereUniqueInput[]
  }

  export type ward_tableUncheckedCreateNestedManyWithoutZone_tableInput = {
    create?: XOR<ward_tableCreateWithoutZone_tableInput, ward_tableUncheckedCreateWithoutZone_tableInput> | ward_tableCreateWithoutZone_tableInput[] | ward_tableUncheckedCreateWithoutZone_tableInput[]
    connectOrCreate?: ward_tableCreateOrConnectWithoutZone_tableInput | ward_tableCreateOrConnectWithoutZone_tableInput[]
    createMany?: ward_tableCreateManyZone_tableInputEnvelope
    connect?: ward_tableWhereUniqueInput | ward_tableWhereUniqueInput[]
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type division_tableUpdateManyWithoutZone_tableNestedInput = {
    create?: XOR<division_tableCreateWithoutZone_tableInput, division_tableUncheckedCreateWithoutZone_tableInput> | division_tableCreateWithoutZone_tableInput[] | division_tableUncheckedCreateWithoutZone_tableInput[]
    connectOrCreate?: division_tableCreateOrConnectWithoutZone_tableInput | division_tableCreateOrConnectWithoutZone_tableInput[]
    upsert?: division_tableUpsertWithWhereUniqueWithoutZone_tableInput | division_tableUpsertWithWhereUniqueWithoutZone_tableInput[]
    createMany?: division_tableCreateManyZone_tableInputEnvelope
    set?: division_tableWhereUniqueInput | division_tableWhereUniqueInput[]
    disconnect?: division_tableWhereUniqueInput | division_tableWhereUniqueInput[]
    delete?: division_tableWhereUniqueInput | division_tableWhereUniqueInput[]
    connect?: division_tableWhereUniqueInput | division_tableWhereUniqueInput[]
    update?: division_tableUpdateWithWhereUniqueWithoutZone_tableInput | division_tableUpdateWithWhereUniqueWithoutZone_tableInput[]
    updateMany?: division_tableUpdateManyWithWhereWithoutZone_tableInput | division_tableUpdateManyWithWhereWithoutZone_tableInput[]
    deleteMany?: division_tableScalarWhereInput | division_tableScalarWhereInput[]
  }

  export type ward_tableUpdateManyWithoutZone_tableNestedInput = {
    create?: XOR<ward_tableCreateWithoutZone_tableInput, ward_tableUncheckedCreateWithoutZone_tableInput> | ward_tableCreateWithoutZone_tableInput[] | ward_tableUncheckedCreateWithoutZone_tableInput[]
    connectOrCreate?: ward_tableCreateOrConnectWithoutZone_tableInput | ward_tableCreateOrConnectWithoutZone_tableInput[]
    upsert?: ward_tableUpsertWithWhereUniqueWithoutZone_tableInput | ward_tableUpsertWithWhereUniqueWithoutZone_tableInput[]
    createMany?: ward_tableCreateManyZone_tableInputEnvelope
    set?: ward_tableWhereUniqueInput | ward_tableWhereUniqueInput[]
    disconnect?: ward_tableWhereUniqueInput | ward_tableWhereUniqueInput[]
    delete?: ward_tableWhereUniqueInput | ward_tableWhereUniqueInput[]
    connect?: ward_tableWhereUniqueInput | ward_tableWhereUniqueInput[]
    update?: ward_tableUpdateWithWhereUniqueWithoutZone_tableInput | ward_tableUpdateWithWhereUniqueWithoutZone_tableInput[]
    updateMany?: ward_tableUpdateManyWithWhereWithoutZone_tableInput | ward_tableUpdateManyWithWhereWithoutZone_tableInput[]
    deleteMany?: ward_tableScalarWhereInput | ward_tableScalarWhereInput[]
  }

  export type city_tableUpdateOneRequiredWithoutZone_tableNestedInput = {
    create?: XOR<city_tableCreateWithoutZone_tableInput, city_tableUncheckedCreateWithoutZone_tableInput>
    connectOrCreate?: city_tableCreateOrConnectWithoutZone_tableInput
    upsert?: city_tableUpsertWithoutZone_tableInput
    connect?: city_tableWhereUniqueInput
    update?: XOR<XOR<city_tableUpdateToOneWithWhereWithoutZone_tableInput, city_tableUpdateWithoutZone_tableInput>, city_tableUncheckedUpdateWithoutZone_tableInput>
  }

  export type division_tableUncheckedUpdateManyWithoutZone_tableNestedInput = {
    create?: XOR<division_tableCreateWithoutZone_tableInput, division_tableUncheckedCreateWithoutZone_tableInput> | division_tableCreateWithoutZone_tableInput[] | division_tableUncheckedCreateWithoutZone_tableInput[]
    connectOrCreate?: division_tableCreateOrConnectWithoutZone_tableInput | division_tableCreateOrConnectWithoutZone_tableInput[]
    upsert?: division_tableUpsertWithWhereUniqueWithoutZone_tableInput | division_tableUpsertWithWhereUniqueWithoutZone_tableInput[]
    createMany?: division_tableCreateManyZone_tableInputEnvelope
    set?: division_tableWhereUniqueInput | division_tableWhereUniqueInput[]
    disconnect?: division_tableWhereUniqueInput | division_tableWhereUniqueInput[]
    delete?: division_tableWhereUniqueInput | division_tableWhereUniqueInput[]
    connect?: division_tableWhereUniqueInput | division_tableWhereUniqueInput[]
    update?: division_tableUpdateWithWhereUniqueWithoutZone_tableInput | division_tableUpdateWithWhereUniqueWithoutZone_tableInput[]
    updateMany?: division_tableUpdateManyWithWhereWithoutZone_tableInput | division_tableUpdateManyWithWhereWithoutZone_tableInput[]
    deleteMany?: division_tableScalarWhereInput | division_tableScalarWhereInput[]
  }

  export type ward_tableUncheckedUpdateManyWithoutZone_tableNestedInput = {
    create?: XOR<ward_tableCreateWithoutZone_tableInput, ward_tableUncheckedCreateWithoutZone_tableInput> | ward_tableCreateWithoutZone_tableInput[] | ward_tableUncheckedCreateWithoutZone_tableInput[]
    connectOrCreate?: ward_tableCreateOrConnectWithoutZone_tableInput | ward_tableCreateOrConnectWithoutZone_tableInput[]
    upsert?: ward_tableUpsertWithWhereUniqueWithoutZone_tableInput | ward_tableUpsertWithWhereUniqueWithoutZone_tableInput[]
    createMany?: ward_tableCreateManyZone_tableInputEnvelope
    set?: ward_tableWhereUniqueInput | ward_tableWhereUniqueInput[]
    disconnect?: ward_tableWhereUniqueInput | ward_tableWhereUniqueInput[]
    delete?: ward_tableWhereUniqueInput | ward_tableWhereUniqueInput[]
    connect?: ward_tableWhereUniqueInput | ward_tableWhereUniqueInput[]
    update?: ward_tableUpdateWithWhereUniqueWithoutZone_tableInput | ward_tableUpdateWithWhereUniqueWithoutZone_tableInput[]
    updateMany?: ward_tableUpdateManyWithWhereWithoutZone_tableInput | ward_tableUpdateManyWithWhereWithoutZone_tableInput[]
    deleteMany?: ward_tableScalarWhereInput | ward_tableScalarWhereInput[]
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

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type division_tableCreateWithoutCity_tableInput = {
    division_name: string
    geo_boundary?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
    zone_table: zone_tableCreateNestedOneWithoutDivision_tableInput
    ward_table?: ward_tableCreateNestedManyWithoutDivision_tableInput
  }

  export type division_tableUncheckedCreateWithoutCity_tableInput = {
    division_id?: number
    division_name: string
    zone_id: number
    geo_boundary?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
    ward_table?: ward_tableUncheckedCreateNestedManyWithoutDivision_tableInput
  }

  export type division_tableCreateOrConnectWithoutCity_tableInput = {
    where: division_tableWhereUniqueInput
    create: XOR<division_tableCreateWithoutCity_tableInput, division_tableUncheckedCreateWithoutCity_tableInput>
  }

  export type division_tableCreateManyCity_tableInputEnvelope = {
    data: division_tableCreateManyCity_tableInput | division_tableCreateManyCity_tableInput[]
    skipDuplicates?: boolean
  }

  export type ward_tableCreateWithoutCity_tableInput = {
    ward_no: number
    ward_name: string
    geo_boundary?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
    division_table: division_tableCreateNestedOneWithoutWard_tableInput
    zone_table: zone_tableCreateNestedOneWithoutWard_tableInput
  }

  export type ward_tableUncheckedCreateWithoutCity_tableInput = {
    ward_id?: number
    ward_no: number
    ward_name: string
    zone_id: number
    division_id: number
    geo_boundary?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
  }

  export type ward_tableCreateOrConnectWithoutCity_tableInput = {
    where: ward_tableWhereUniqueInput
    create: XOR<ward_tableCreateWithoutCity_tableInput, ward_tableUncheckedCreateWithoutCity_tableInput>
  }

  export type ward_tableCreateManyCity_tableInputEnvelope = {
    data: ward_tableCreateManyCity_tableInput | ward_tableCreateManyCity_tableInput[]
    skipDuplicates?: boolean
  }

  export type zone_tableCreateWithoutCity_tableInput = {
    zone_name: string
    total_divisions?: number | null
    total_wards?: number | null
    geo_boundary?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
    division_table?: division_tableCreateNestedManyWithoutZone_tableInput
    ward_table?: ward_tableCreateNestedManyWithoutZone_tableInput
  }

  export type zone_tableUncheckedCreateWithoutCity_tableInput = {
    zone_id?: number
    zone_name: string
    total_divisions?: number | null
    total_wards?: number | null
    geo_boundary?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
    division_table?: division_tableUncheckedCreateNestedManyWithoutZone_tableInput
    ward_table?: ward_tableUncheckedCreateNestedManyWithoutZone_tableInput
  }

  export type zone_tableCreateOrConnectWithoutCity_tableInput = {
    where: zone_tableWhereUniqueInput
    create: XOR<zone_tableCreateWithoutCity_tableInput, zone_tableUncheckedCreateWithoutCity_tableInput>
  }

  export type zone_tableCreateManyCity_tableInputEnvelope = {
    data: zone_tableCreateManyCity_tableInput | zone_tableCreateManyCity_tableInput[]
    skipDuplicates?: boolean
  }

  export type division_tableUpsertWithWhereUniqueWithoutCity_tableInput = {
    where: division_tableWhereUniqueInput
    update: XOR<division_tableUpdateWithoutCity_tableInput, division_tableUncheckedUpdateWithoutCity_tableInput>
    create: XOR<division_tableCreateWithoutCity_tableInput, division_tableUncheckedCreateWithoutCity_tableInput>
  }

  export type division_tableUpdateWithWhereUniqueWithoutCity_tableInput = {
    where: division_tableWhereUniqueInput
    data: XOR<division_tableUpdateWithoutCity_tableInput, division_tableUncheckedUpdateWithoutCity_tableInput>
  }

  export type division_tableUpdateManyWithWhereWithoutCity_tableInput = {
    where: division_tableScalarWhereInput
    data: XOR<division_tableUpdateManyMutationInput, division_tableUncheckedUpdateManyWithoutCity_tableInput>
  }

  export type division_tableScalarWhereInput = {
    AND?: division_tableScalarWhereInput | division_tableScalarWhereInput[]
    OR?: division_tableScalarWhereInput[]
    NOT?: division_tableScalarWhereInput | division_tableScalarWhereInput[]
    division_id?: IntFilter<"division_table"> | number
    division_name?: StringFilter<"division_table"> | string
    city_id?: IntFilter<"division_table"> | number
    zone_id?: IntFilter<"division_table"> | number
    geo_boundary?: JsonNullableFilter<"division_table">
    created_at?: DateTimeNullableFilter<"division_table"> | Date | string | null
  }

  export type ward_tableUpsertWithWhereUniqueWithoutCity_tableInput = {
    where: ward_tableWhereUniqueInput
    update: XOR<ward_tableUpdateWithoutCity_tableInput, ward_tableUncheckedUpdateWithoutCity_tableInput>
    create: XOR<ward_tableCreateWithoutCity_tableInput, ward_tableUncheckedCreateWithoutCity_tableInput>
  }

  export type ward_tableUpdateWithWhereUniqueWithoutCity_tableInput = {
    where: ward_tableWhereUniqueInput
    data: XOR<ward_tableUpdateWithoutCity_tableInput, ward_tableUncheckedUpdateWithoutCity_tableInput>
  }

  export type ward_tableUpdateManyWithWhereWithoutCity_tableInput = {
    where: ward_tableScalarWhereInput
    data: XOR<ward_tableUpdateManyMutationInput, ward_tableUncheckedUpdateManyWithoutCity_tableInput>
  }

  export type ward_tableScalarWhereInput = {
    AND?: ward_tableScalarWhereInput | ward_tableScalarWhereInput[]
    OR?: ward_tableScalarWhereInput[]
    NOT?: ward_tableScalarWhereInput | ward_tableScalarWhereInput[]
    ward_id?: IntFilter<"ward_table"> | number
    ward_no?: IntFilter<"ward_table"> | number
    ward_name?: StringFilter<"ward_table"> | string
    city_id?: IntFilter<"ward_table"> | number
    zone_id?: IntFilter<"ward_table"> | number
    division_id?: IntFilter<"ward_table"> | number
    geo_boundary?: JsonNullableFilter<"ward_table">
    created_at?: DateTimeNullableFilter<"ward_table"> | Date | string | null
  }

  export type zone_tableUpsertWithWhereUniqueWithoutCity_tableInput = {
    where: zone_tableWhereUniqueInput
    update: XOR<zone_tableUpdateWithoutCity_tableInput, zone_tableUncheckedUpdateWithoutCity_tableInput>
    create: XOR<zone_tableCreateWithoutCity_tableInput, zone_tableUncheckedCreateWithoutCity_tableInput>
  }

  export type zone_tableUpdateWithWhereUniqueWithoutCity_tableInput = {
    where: zone_tableWhereUniqueInput
    data: XOR<zone_tableUpdateWithoutCity_tableInput, zone_tableUncheckedUpdateWithoutCity_tableInput>
  }

  export type zone_tableUpdateManyWithWhereWithoutCity_tableInput = {
    where: zone_tableScalarWhereInput
    data: XOR<zone_tableUpdateManyMutationInput, zone_tableUncheckedUpdateManyWithoutCity_tableInput>
  }

  export type zone_tableScalarWhereInput = {
    AND?: zone_tableScalarWhereInput | zone_tableScalarWhereInput[]
    OR?: zone_tableScalarWhereInput[]
    NOT?: zone_tableScalarWhereInput | zone_tableScalarWhereInput[]
    zone_id?: IntFilter<"zone_table"> | number
    zone_name?: StringFilter<"zone_table"> | string
    city_id?: IntFilter<"zone_table"> | number
    total_divisions?: IntNullableFilter<"zone_table"> | number | null
    total_wards?: IntNullableFilter<"zone_table"> | number | null
    geo_boundary?: JsonNullableFilter<"zone_table">
    created_at?: DateTimeNullableFilter<"zone_table"> | Date | string | null
  }

  export type city_tableCreateWithoutDivision_tableInput = {
    city_name: string
    geo_boundary?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
    ward_table?: ward_tableCreateNestedManyWithoutCity_tableInput
    zone_table?: zone_tableCreateNestedManyWithoutCity_tableInput
  }

  export type city_tableUncheckedCreateWithoutDivision_tableInput = {
    city_id?: number
    city_name: string
    geo_boundary?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
    ward_table?: ward_tableUncheckedCreateNestedManyWithoutCity_tableInput
    zone_table?: zone_tableUncheckedCreateNestedManyWithoutCity_tableInput
  }

  export type city_tableCreateOrConnectWithoutDivision_tableInput = {
    where: city_tableWhereUniqueInput
    create: XOR<city_tableCreateWithoutDivision_tableInput, city_tableUncheckedCreateWithoutDivision_tableInput>
  }

  export type zone_tableCreateWithoutDivision_tableInput = {
    zone_name: string
    total_divisions?: number | null
    total_wards?: number | null
    geo_boundary?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
    ward_table?: ward_tableCreateNestedManyWithoutZone_tableInput
    city_table: city_tableCreateNestedOneWithoutZone_tableInput
  }

  export type zone_tableUncheckedCreateWithoutDivision_tableInput = {
    zone_id?: number
    zone_name: string
    city_id: number
    total_divisions?: number | null
    total_wards?: number | null
    geo_boundary?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
    ward_table?: ward_tableUncheckedCreateNestedManyWithoutZone_tableInput
  }

  export type zone_tableCreateOrConnectWithoutDivision_tableInput = {
    where: zone_tableWhereUniqueInput
    create: XOR<zone_tableCreateWithoutDivision_tableInput, zone_tableUncheckedCreateWithoutDivision_tableInput>
  }

  export type ward_tableCreateWithoutDivision_tableInput = {
    ward_no: number
    ward_name: string
    geo_boundary?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
    city_table: city_tableCreateNestedOneWithoutWard_tableInput
    zone_table: zone_tableCreateNestedOneWithoutWard_tableInput
  }

  export type ward_tableUncheckedCreateWithoutDivision_tableInput = {
    ward_id?: number
    ward_no: number
    ward_name: string
    city_id: number
    zone_id: number
    geo_boundary?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
  }

  export type ward_tableCreateOrConnectWithoutDivision_tableInput = {
    where: ward_tableWhereUniqueInput
    create: XOR<ward_tableCreateWithoutDivision_tableInput, ward_tableUncheckedCreateWithoutDivision_tableInput>
  }

  export type ward_tableCreateManyDivision_tableInputEnvelope = {
    data: ward_tableCreateManyDivision_tableInput | ward_tableCreateManyDivision_tableInput[]
    skipDuplicates?: boolean
  }

  export type city_tableUpsertWithoutDivision_tableInput = {
    update: XOR<city_tableUpdateWithoutDivision_tableInput, city_tableUncheckedUpdateWithoutDivision_tableInput>
    create: XOR<city_tableCreateWithoutDivision_tableInput, city_tableUncheckedCreateWithoutDivision_tableInput>
    where?: city_tableWhereInput
  }

  export type city_tableUpdateToOneWithWhereWithoutDivision_tableInput = {
    where?: city_tableWhereInput
    data: XOR<city_tableUpdateWithoutDivision_tableInput, city_tableUncheckedUpdateWithoutDivision_tableInput>
  }

  export type city_tableUpdateWithoutDivision_tableInput = {
    city_name?: StringFieldUpdateOperationsInput | string
    geo_boundary?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ward_table?: ward_tableUpdateManyWithoutCity_tableNestedInput
    zone_table?: zone_tableUpdateManyWithoutCity_tableNestedInput
  }

  export type city_tableUncheckedUpdateWithoutDivision_tableInput = {
    city_id?: IntFieldUpdateOperationsInput | number
    city_name?: StringFieldUpdateOperationsInput | string
    geo_boundary?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ward_table?: ward_tableUncheckedUpdateManyWithoutCity_tableNestedInput
    zone_table?: zone_tableUncheckedUpdateManyWithoutCity_tableNestedInput
  }

  export type zone_tableUpsertWithoutDivision_tableInput = {
    update: XOR<zone_tableUpdateWithoutDivision_tableInput, zone_tableUncheckedUpdateWithoutDivision_tableInput>
    create: XOR<zone_tableCreateWithoutDivision_tableInput, zone_tableUncheckedCreateWithoutDivision_tableInput>
    where?: zone_tableWhereInput
  }

  export type zone_tableUpdateToOneWithWhereWithoutDivision_tableInput = {
    where?: zone_tableWhereInput
    data: XOR<zone_tableUpdateWithoutDivision_tableInput, zone_tableUncheckedUpdateWithoutDivision_tableInput>
  }

  export type zone_tableUpdateWithoutDivision_tableInput = {
    zone_name?: StringFieldUpdateOperationsInput | string
    total_divisions?: NullableIntFieldUpdateOperationsInput | number | null
    total_wards?: NullableIntFieldUpdateOperationsInput | number | null
    geo_boundary?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ward_table?: ward_tableUpdateManyWithoutZone_tableNestedInput
    city_table?: city_tableUpdateOneRequiredWithoutZone_tableNestedInput
  }

  export type zone_tableUncheckedUpdateWithoutDivision_tableInput = {
    zone_id?: IntFieldUpdateOperationsInput | number
    zone_name?: StringFieldUpdateOperationsInput | string
    city_id?: IntFieldUpdateOperationsInput | number
    total_divisions?: NullableIntFieldUpdateOperationsInput | number | null
    total_wards?: NullableIntFieldUpdateOperationsInput | number | null
    geo_boundary?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ward_table?: ward_tableUncheckedUpdateManyWithoutZone_tableNestedInput
  }

  export type ward_tableUpsertWithWhereUniqueWithoutDivision_tableInput = {
    where: ward_tableWhereUniqueInput
    update: XOR<ward_tableUpdateWithoutDivision_tableInput, ward_tableUncheckedUpdateWithoutDivision_tableInput>
    create: XOR<ward_tableCreateWithoutDivision_tableInput, ward_tableUncheckedCreateWithoutDivision_tableInput>
  }

  export type ward_tableUpdateWithWhereUniqueWithoutDivision_tableInput = {
    where: ward_tableWhereUniqueInput
    data: XOR<ward_tableUpdateWithoutDivision_tableInput, ward_tableUncheckedUpdateWithoutDivision_tableInput>
  }

  export type ward_tableUpdateManyWithWhereWithoutDivision_tableInput = {
    where: ward_tableScalarWhereInput
    data: XOR<ward_tableUpdateManyMutationInput, ward_tableUncheckedUpdateManyWithoutDivision_tableInput>
  }

  export type city_tableCreateWithoutWard_tableInput = {
    city_name: string
    geo_boundary?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
    division_table?: division_tableCreateNestedManyWithoutCity_tableInput
    zone_table?: zone_tableCreateNestedManyWithoutCity_tableInput
  }

  export type city_tableUncheckedCreateWithoutWard_tableInput = {
    city_id?: number
    city_name: string
    geo_boundary?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
    division_table?: division_tableUncheckedCreateNestedManyWithoutCity_tableInput
    zone_table?: zone_tableUncheckedCreateNestedManyWithoutCity_tableInput
  }

  export type city_tableCreateOrConnectWithoutWard_tableInput = {
    where: city_tableWhereUniqueInput
    create: XOR<city_tableCreateWithoutWard_tableInput, city_tableUncheckedCreateWithoutWard_tableInput>
  }

  export type division_tableCreateWithoutWard_tableInput = {
    division_name: string
    geo_boundary?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
    city_table: city_tableCreateNestedOneWithoutDivision_tableInput
    zone_table: zone_tableCreateNestedOneWithoutDivision_tableInput
  }

  export type division_tableUncheckedCreateWithoutWard_tableInput = {
    division_id?: number
    division_name: string
    city_id: number
    zone_id: number
    geo_boundary?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
  }

  export type division_tableCreateOrConnectWithoutWard_tableInput = {
    where: division_tableWhereUniqueInput
    create: XOR<division_tableCreateWithoutWard_tableInput, division_tableUncheckedCreateWithoutWard_tableInput>
  }

  export type zone_tableCreateWithoutWard_tableInput = {
    zone_name: string
    total_divisions?: number | null
    total_wards?: number | null
    geo_boundary?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
    division_table?: division_tableCreateNestedManyWithoutZone_tableInput
    city_table: city_tableCreateNestedOneWithoutZone_tableInput
  }

  export type zone_tableUncheckedCreateWithoutWard_tableInput = {
    zone_id?: number
    zone_name: string
    city_id: number
    total_divisions?: number | null
    total_wards?: number | null
    geo_boundary?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
    division_table?: division_tableUncheckedCreateNestedManyWithoutZone_tableInput
  }

  export type zone_tableCreateOrConnectWithoutWard_tableInput = {
    where: zone_tableWhereUniqueInput
    create: XOR<zone_tableCreateWithoutWard_tableInput, zone_tableUncheckedCreateWithoutWard_tableInput>
  }

  export type city_tableUpsertWithoutWard_tableInput = {
    update: XOR<city_tableUpdateWithoutWard_tableInput, city_tableUncheckedUpdateWithoutWard_tableInput>
    create: XOR<city_tableCreateWithoutWard_tableInput, city_tableUncheckedCreateWithoutWard_tableInput>
    where?: city_tableWhereInput
  }

  export type city_tableUpdateToOneWithWhereWithoutWard_tableInput = {
    where?: city_tableWhereInput
    data: XOR<city_tableUpdateWithoutWard_tableInput, city_tableUncheckedUpdateWithoutWard_tableInput>
  }

  export type city_tableUpdateWithoutWard_tableInput = {
    city_name?: StringFieldUpdateOperationsInput | string
    geo_boundary?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    division_table?: division_tableUpdateManyWithoutCity_tableNestedInput
    zone_table?: zone_tableUpdateManyWithoutCity_tableNestedInput
  }

  export type city_tableUncheckedUpdateWithoutWard_tableInput = {
    city_id?: IntFieldUpdateOperationsInput | number
    city_name?: StringFieldUpdateOperationsInput | string
    geo_boundary?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    division_table?: division_tableUncheckedUpdateManyWithoutCity_tableNestedInput
    zone_table?: zone_tableUncheckedUpdateManyWithoutCity_tableNestedInput
  }

  export type division_tableUpsertWithoutWard_tableInput = {
    update: XOR<division_tableUpdateWithoutWard_tableInput, division_tableUncheckedUpdateWithoutWard_tableInput>
    create: XOR<division_tableCreateWithoutWard_tableInput, division_tableUncheckedCreateWithoutWard_tableInput>
    where?: division_tableWhereInput
  }

  export type division_tableUpdateToOneWithWhereWithoutWard_tableInput = {
    where?: division_tableWhereInput
    data: XOR<division_tableUpdateWithoutWard_tableInput, division_tableUncheckedUpdateWithoutWard_tableInput>
  }

  export type division_tableUpdateWithoutWard_tableInput = {
    division_name?: StringFieldUpdateOperationsInput | string
    geo_boundary?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    city_table?: city_tableUpdateOneRequiredWithoutDivision_tableNestedInput
    zone_table?: zone_tableUpdateOneRequiredWithoutDivision_tableNestedInput
  }

  export type division_tableUncheckedUpdateWithoutWard_tableInput = {
    division_id?: IntFieldUpdateOperationsInput | number
    division_name?: StringFieldUpdateOperationsInput | string
    city_id?: IntFieldUpdateOperationsInput | number
    zone_id?: IntFieldUpdateOperationsInput | number
    geo_boundary?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type zone_tableUpsertWithoutWard_tableInput = {
    update: XOR<zone_tableUpdateWithoutWard_tableInput, zone_tableUncheckedUpdateWithoutWard_tableInput>
    create: XOR<zone_tableCreateWithoutWard_tableInput, zone_tableUncheckedCreateWithoutWard_tableInput>
    where?: zone_tableWhereInput
  }

  export type zone_tableUpdateToOneWithWhereWithoutWard_tableInput = {
    where?: zone_tableWhereInput
    data: XOR<zone_tableUpdateWithoutWard_tableInput, zone_tableUncheckedUpdateWithoutWard_tableInput>
  }

  export type zone_tableUpdateWithoutWard_tableInput = {
    zone_name?: StringFieldUpdateOperationsInput | string
    total_divisions?: NullableIntFieldUpdateOperationsInput | number | null
    total_wards?: NullableIntFieldUpdateOperationsInput | number | null
    geo_boundary?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    division_table?: division_tableUpdateManyWithoutZone_tableNestedInput
    city_table?: city_tableUpdateOneRequiredWithoutZone_tableNestedInput
  }

  export type zone_tableUncheckedUpdateWithoutWard_tableInput = {
    zone_id?: IntFieldUpdateOperationsInput | number
    zone_name?: StringFieldUpdateOperationsInput | string
    city_id?: IntFieldUpdateOperationsInput | number
    total_divisions?: NullableIntFieldUpdateOperationsInput | number | null
    total_wards?: NullableIntFieldUpdateOperationsInput | number | null
    geo_boundary?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    division_table?: division_tableUncheckedUpdateManyWithoutZone_tableNestedInput
  }

  export type division_tableCreateWithoutZone_tableInput = {
    division_name: string
    geo_boundary?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
    city_table: city_tableCreateNestedOneWithoutDivision_tableInput
    ward_table?: ward_tableCreateNestedManyWithoutDivision_tableInput
  }

  export type division_tableUncheckedCreateWithoutZone_tableInput = {
    division_id?: number
    division_name: string
    city_id: number
    geo_boundary?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
    ward_table?: ward_tableUncheckedCreateNestedManyWithoutDivision_tableInput
  }

  export type division_tableCreateOrConnectWithoutZone_tableInput = {
    where: division_tableWhereUniqueInput
    create: XOR<division_tableCreateWithoutZone_tableInput, division_tableUncheckedCreateWithoutZone_tableInput>
  }

  export type division_tableCreateManyZone_tableInputEnvelope = {
    data: division_tableCreateManyZone_tableInput | division_tableCreateManyZone_tableInput[]
    skipDuplicates?: boolean
  }

  export type ward_tableCreateWithoutZone_tableInput = {
    ward_no: number
    ward_name: string
    geo_boundary?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
    city_table: city_tableCreateNestedOneWithoutWard_tableInput
    division_table: division_tableCreateNestedOneWithoutWard_tableInput
  }

  export type ward_tableUncheckedCreateWithoutZone_tableInput = {
    ward_id?: number
    ward_no: number
    ward_name: string
    city_id: number
    division_id: number
    geo_boundary?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
  }

  export type ward_tableCreateOrConnectWithoutZone_tableInput = {
    where: ward_tableWhereUniqueInput
    create: XOR<ward_tableCreateWithoutZone_tableInput, ward_tableUncheckedCreateWithoutZone_tableInput>
  }

  export type ward_tableCreateManyZone_tableInputEnvelope = {
    data: ward_tableCreateManyZone_tableInput | ward_tableCreateManyZone_tableInput[]
    skipDuplicates?: boolean
  }

  export type city_tableCreateWithoutZone_tableInput = {
    city_name: string
    geo_boundary?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
    division_table?: division_tableCreateNestedManyWithoutCity_tableInput
    ward_table?: ward_tableCreateNestedManyWithoutCity_tableInput
  }

  export type city_tableUncheckedCreateWithoutZone_tableInput = {
    city_id?: number
    city_name: string
    geo_boundary?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
    division_table?: division_tableUncheckedCreateNestedManyWithoutCity_tableInput
    ward_table?: ward_tableUncheckedCreateNestedManyWithoutCity_tableInput
  }

  export type city_tableCreateOrConnectWithoutZone_tableInput = {
    where: city_tableWhereUniqueInput
    create: XOR<city_tableCreateWithoutZone_tableInput, city_tableUncheckedCreateWithoutZone_tableInput>
  }

  export type division_tableUpsertWithWhereUniqueWithoutZone_tableInput = {
    where: division_tableWhereUniqueInput
    update: XOR<division_tableUpdateWithoutZone_tableInput, division_tableUncheckedUpdateWithoutZone_tableInput>
    create: XOR<division_tableCreateWithoutZone_tableInput, division_tableUncheckedCreateWithoutZone_tableInput>
  }

  export type division_tableUpdateWithWhereUniqueWithoutZone_tableInput = {
    where: division_tableWhereUniqueInput
    data: XOR<division_tableUpdateWithoutZone_tableInput, division_tableUncheckedUpdateWithoutZone_tableInput>
  }

  export type division_tableUpdateManyWithWhereWithoutZone_tableInput = {
    where: division_tableScalarWhereInput
    data: XOR<division_tableUpdateManyMutationInput, division_tableUncheckedUpdateManyWithoutZone_tableInput>
  }

  export type ward_tableUpsertWithWhereUniqueWithoutZone_tableInput = {
    where: ward_tableWhereUniqueInput
    update: XOR<ward_tableUpdateWithoutZone_tableInput, ward_tableUncheckedUpdateWithoutZone_tableInput>
    create: XOR<ward_tableCreateWithoutZone_tableInput, ward_tableUncheckedCreateWithoutZone_tableInput>
  }

  export type ward_tableUpdateWithWhereUniqueWithoutZone_tableInput = {
    where: ward_tableWhereUniqueInput
    data: XOR<ward_tableUpdateWithoutZone_tableInput, ward_tableUncheckedUpdateWithoutZone_tableInput>
  }

  export type ward_tableUpdateManyWithWhereWithoutZone_tableInput = {
    where: ward_tableScalarWhereInput
    data: XOR<ward_tableUpdateManyMutationInput, ward_tableUncheckedUpdateManyWithoutZone_tableInput>
  }

  export type city_tableUpsertWithoutZone_tableInput = {
    update: XOR<city_tableUpdateWithoutZone_tableInput, city_tableUncheckedUpdateWithoutZone_tableInput>
    create: XOR<city_tableCreateWithoutZone_tableInput, city_tableUncheckedCreateWithoutZone_tableInput>
    where?: city_tableWhereInput
  }

  export type city_tableUpdateToOneWithWhereWithoutZone_tableInput = {
    where?: city_tableWhereInput
    data: XOR<city_tableUpdateWithoutZone_tableInput, city_tableUncheckedUpdateWithoutZone_tableInput>
  }

  export type city_tableUpdateWithoutZone_tableInput = {
    city_name?: StringFieldUpdateOperationsInput | string
    geo_boundary?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    division_table?: division_tableUpdateManyWithoutCity_tableNestedInput
    ward_table?: ward_tableUpdateManyWithoutCity_tableNestedInput
  }

  export type city_tableUncheckedUpdateWithoutZone_tableInput = {
    city_id?: IntFieldUpdateOperationsInput | number
    city_name?: StringFieldUpdateOperationsInput | string
    geo_boundary?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    division_table?: division_tableUncheckedUpdateManyWithoutCity_tableNestedInput
    ward_table?: ward_tableUncheckedUpdateManyWithoutCity_tableNestedInput
  }

  export type division_tableCreateManyCity_tableInput = {
    division_id?: number
    division_name: string
    zone_id: number
    geo_boundary?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
  }

  export type ward_tableCreateManyCity_tableInput = {
    ward_id?: number
    ward_no: number
    ward_name: string
    zone_id: number
    division_id: number
    geo_boundary?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
  }

  export type zone_tableCreateManyCity_tableInput = {
    zone_id?: number
    zone_name: string
    total_divisions?: number | null
    total_wards?: number | null
    geo_boundary?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
  }

  export type division_tableUpdateWithoutCity_tableInput = {
    division_name?: StringFieldUpdateOperationsInput | string
    geo_boundary?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    zone_table?: zone_tableUpdateOneRequiredWithoutDivision_tableNestedInput
    ward_table?: ward_tableUpdateManyWithoutDivision_tableNestedInput
  }

  export type division_tableUncheckedUpdateWithoutCity_tableInput = {
    division_id?: IntFieldUpdateOperationsInput | number
    division_name?: StringFieldUpdateOperationsInput | string
    zone_id?: IntFieldUpdateOperationsInput | number
    geo_boundary?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ward_table?: ward_tableUncheckedUpdateManyWithoutDivision_tableNestedInput
  }

  export type division_tableUncheckedUpdateManyWithoutCity_tableInput = {
    division_id?: IntFieldUpdateOperationsInput | number
    division_name?: StringFieldUpdateOperationsInput | string
    zone_id?: IntFieldUpdateOperationsInput | number
    geo_boundary?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ward_tableUpdateWithoutCity_tableInput = {
    ward_no?: IntFieldUpdateOperationsInput | number
    ward_name?: StringFieldUpdateOperationsInput | string
    geo_boundary?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    division_table?: division_tableUpdateOneRequiredWithoutWard_tableNestedInput
    zone_table?: zone_tableUpdateOneRequiredWithoutWard_tableNestedInput
  }

  export type ward_tableUncheckedUpdateWithoutCity_tableInput = {
    ward_id?: IntFieldUpdateOperationsInput | number
    ward_no?: IntFieldUpdateOperationsInput | number
    ward_name?: StringFieldUpdateOperationsInput | string
    zone_id?: IntFieldUpdateOperationsInput | number
    division_id?: IntFieldUpdateOperationsInput | number
    geo_boundary?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ward_tableUncheckedUpdateManyWithoutCity_tableInput = {
    ward_id?: IntFieldUpdateOperationsInput | number
    ward_no?: IntFieldUpdateOperationsInput | number
    ward_name?: StringFieldUpdateOperationsInput | string
    zone_id?: IntFieldUpdateOperationsInput | number
    division_id?: IntFieldUpdateOperationsInput | number
    geo_boundary?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type zone_tableUpdateWithoutCity_tableInput = {
    zone_name?: StringFieldUpdateOperationsInput | string
    total_divisions?: NullableIntFieldUpdateOperationsInput | number | null
    total_wards?: NullableIntFieldUpdateOperationsInput | number | null
    geo_boundary?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    division_table?: division_tableUpdateManyWithoutZone_tableNestedInput
    ward_table?: ward_tableUpdateManyWithoutZone_tableNestedInput
  }

  export type zone_tableUncheckedUpdateWithoutCity_tableInput = {
    zone_id?: IntFieldUpdateOperationsInput | number
    zone_name?: StringFieldUpdateOperationsInput | string
    total_divisions?: NullableIntFieldUpdateOperationsInput | number | null
    total_wards?: NullableIntFieldUpdateOperationsInput | number | null
    geo_boundary?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    division_table?: division_tableUncheckedUpdateManyWithoutZone_tableNestedInput
    ward_table?: ward_tableUncheckedUpdateManyWithoutZone_tableNestedInput
  }

  export type zone_tableUncheckedUpdateManyWithoutCity_tableInput = {
    zone_id?: IntFieldUpdateOperationsInput | number
    zone_name?: StringFieldUpdateOperationsInput | string
    total_divisions?: NullableIntFieldUpdateOperationsInput | number | null
    total_wards?: NullableIntFieldUpdateOperationsInput | number | null
    geo_boundary?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ward_tableCreateManyDivision_tableInput = {
    ward_id?: number
    ward_no: number
    ward_name: string
    city_id: number
    zone_id: number
    geo_boundary?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
  }

  export type ward_tableUpdateWithoutDivision_tableInput = {
    ward_no?: IntFieldUpdateOperationsInput | number
    ward_name?: StringFieldUpdateOperationsInput | string
    geo_boundary?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    city_table?: city_tableUpdateOneRequiredWithoutWard_tableNestedInput
    zone_table?: zone_tableUpdateOneRequiredWithoutWard_tableNestedInput
  }

  export type ward_tableUncheckedUpdateWithoutDivision_tableInput = {
    ward_id?: IntFieldUpdateOperationsInput | number
    ward_no?: IntFieldUpdateOperationsInput | number
    ward_name?: StringFieldUpdateOperationsInput | string
    city_id?: IntFieldUpdateOperationsInput | number
    zone_id?: IntFieldUpdateOperationsInput | number
    geo_boundary?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ward_tableUncheckedUpdateManyWithoutDivision_tableInput = {
    ward_id?: IntFieldUpdateOperationsInput | number
    ward_no?: IntFieldUpdateOperationsInput | number
    ward_name?: StringFieldUpdateOperationsInput | string
    city_id?: IntFieldUpdateOperationsInput | number
    zone_id?: IntFieldUpdateOperationsInput | number
    geo_boundary?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type division_tableCreateManyZone_tableInput = {
    division_id?: number
    division_name: string
    city_id: number
    geo_boundary?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
  }

  export type ward_tableCreateManyZone_tableInput = {
    ward_id?: number
    ward_no: number
    ward_name: string
    city_id: number
    division_id: number
    geo_boundary?: NullableJsonNullValueInput | InputJsonValue
    created_at?: Date | string | null
  }

  export type division_tableUpdateWithoutZone_tableInput = {
    division_name?: StringFieldUpdateOperationsInput | string
    geo_boundary?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    city_table?: city_tableUpdateOneRequiredWithoutDivision_tableNestedInput
    ward_table?: ward_tableUpdateManyWithoutDivision_tableNestedInput
  }

  export type division_tableUncheckedUpdateWithoutZone_tableInput = {
    division_id?: IntFieldUpdateOperationsInput | number
    division_name?: StringFieldUpdateOperationsInput | string
    city_id?: IntFieldUpdateOperationsInput | number
    geo_boundary?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ward_table?: ward_tableUncheckedUpdateManyWithoutDivision_tableNestedInput
  }

  export type division_tableUncheckedUpdateManyWithoutZone_tableInput = {
    division_id?: IntFieldUpdateOperationsInput | number
    division_name?: StringFieldUpdateOperationsInput | string
    city_id?: IntFieldUpdateOperationsInput | number
    geo_boundary?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ward_tableUpdateWithoutZone_tableInput = {
    ward_no?: IntFieldUpdateOperationsInput | number
    ward_name?: StringFieldUpdateOperationsInput | string
    geo_boundary?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    city_table?: city_tableUpdateOneRequiredWithoutWard_tableNestedInput
    division_table?: division_tableUpdateOneRequiredWithoutWard_tableNestedInput
  }

  export type ward_tableUncheckedUpdateWithoutZone_tableInput = {
    ward_id?: IntFieldUpdateOperationsInput | number
    ward_no?: IntFieldUpdateOperationsInput | number
    ward_name?: StringFieldUpdateOperationsInput | string
    city_id?: IntFieldUpdateOperationsInput | number
    division_id?: IntFieldUpdateOperationsInput | number
    geo_boundary?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ward_tableUncheckedUpdateManyWithoutZone_tableInput = {
    ward_id?: IntFieldUpdateOperationsInput | number
    ward_no?: IntFieldUpdateOperationsInput | number
    ward_name?: StringFieldUpdateOperationsInput | string
    city_id?: IntFieldUpdateOperationsInput | number
    division_id?: IntFieldUpdateOperationsInput | number
    geo_boundary?: NullableJsonNullValueInput | InputJsonValue
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
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