
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
 * Model MasterTelemetry
 * 
 */
export type MasterTelemetry = $Result.DefaultSelection<Prisma.$MasterTelemetryPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more MasterTelemetries
 * const masterTelemetries = await prisma.masterTelemetry.findMany()
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
   * // Fetch zero or more MasterTelemetries
   * const masterTelemetries = await prisma.masterTelemetry.findMany()
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
   * `prisma.masterTelemetry`: Exposes CRUD operations for the **MasterTelemetry** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more MasterTelemetries
    * const masterTelemetries = await prisma.masterTelemetry.findMany()
    * ```
    */
  get masterTelemetry(): Prisma.MasterTelemetryDelegate<ExtArgs, ClientOptions>;
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
    MasterTelemetry: 'MasterTelemetry'
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
      modelProps: "masterTelemetry"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      MasterTelemetry: {
        payload: Prisma.$MasterTelemetryPayload<ExtArgs>
        fields: Prisma.MasterTelemetryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MasterTelemetryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MasterTelemetryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MasterTelemetryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MasterTelemetryPayload>
          }
          findFirst: {
            args: Prisma.MasterTelemetryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MasterTelemetryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MasterTelemetryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MasterTelemetryPayload>
          }
          findMany: {
            args: Prisma.MasterTelemetryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MasterTelemetryPayload>[]
          }
          create: {
            args: Prisma.MasterTelemetryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MasterTelemetryPayload>
          }
          createMany: {
            args: Prisma.MasterTelemetryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MasterTelemetryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MasterTelemetryPayload>[]
          }
          delete: {
            args: Prisma.MasterTelemetryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MasterTelemetryPayload>
          }
          update: {
            args: Prisma.MasterTelemetryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MasterTelemetryPayload>
          }
          deleteMany: {
            args: Prisma.MasterTelemetryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MasterTelemetryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MasterTelemetryUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MasterTelemetryPayload>[]
          }
          upsert: {
            args: Prisma.MasterTelemetryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MasterTelemetryPayload>
          }
          aggregate: {
            args: Prisma.MasterTelemetryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMasterTelemetry>
          }
          groupBy: {
            args: Prisma.MasterTelemetryGroupByArgs<ExtArgs>
            result: $Utils.Optional<MasterTelemetryGroupByOutputType>[]
          }
          count: {
            args: Prisma.MasterTelemetryCountArgs<ExtArgs>
            result: $Utils.Optional<MasterTelemetryCountAggregateOutputType> | number
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
    masterTelemetry?: MasterTelemetryOmit
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
   * Models
   */

  /**
   * Model MasterTelemetry
   */

  export type AggregateMasterTelemetry = {
    _count: MasterTelemetryCountAggregateOutputType | null
    _avg: MasterTelemetryAvgAggregateOutputType | null
    _sum: MasterTelemetrySumAggregateOutputType | null
    _min: MasterTelemetryMinAggregateOutputType | null
    _max: MasterTelemetryMaxAggregateOutputType | null
  }

  export type MasterTelemetryAvgAggregateOutputType = {
    id: number | null
    citizenId: number | null
    latitude: Decimal | null
    longitude: Decimal | null
    wetWeight: Decimal | null
    dryWeight: Decimal | null
    otherWeight: Decimal | null
    cumulativeWeight: Decimal | null
  }

  export type MasterTelemetrySumAggregateOutputType = {
    id: bigint | null
    citizenId: number | null
    latitude: Decimal | null
    longitude: Decimal | null
    wetWeight: Decimal | null
    dryWeight: Decimal | null
    otherWeight: Decimal | null
    cumulativeWeight: Decimal | null
  }

  export type MasterTelemetryMinAggregateOutputType = {
    id: bigint | null
    iotTimestamp: Date | null
    receivedTimestamp: Date | null
    rfidEpc: string | null
    citizenId: number | null
    wasteType: string | null
    latitude: Decimal | null
    longitude: Decimal | null
    wetWeight: Decimal | null
    dryWeight: Decimal | null
    otherWeight: Decimal | null
    cumulativeWeight: Decimal | null
    driverName: string | null
    vehicleNumber: string | null
    firmwareVersion: string | null
    unitNumber: string | null
    collectionType: string | null
    remarks: string | null
    errorCode: string | null
    citizenContact: string | null
    driverAction: string | null
    createdAt: Date | null
  }

  export type MasterTelemetryMaxAggregateOutputType = {
    id: bigint | null
    iotTimestamp: Date | null
    receivedTimestamp: Date | null
    rfidEpc: string | null
    citizenId: number | null
    wasteType: string | null
    latitude: Decimal | null
    longitude: Decimal | null
    wetWeight: Decimal | null
    dryWeight: Decimal | null
    otherWeight: Decimal | null
    cumulativeWeight: Decimal | null
    driverName: string | null
    vehicleNumber: string | null
    firmwareVersion: string | null
    unitNumber: string | null
    collectionType: string | null
    remarks: string | null
    errorCode: string | null
    citizenContact: string | null
    driverAction: string | null
    createdAt: Date | null
  }

  export type MasterTelemetryCountAggregateOutputType = {
    id: number
    iotTimestamp: number
    receivedTimestamp: number
    rfidEpc: number
    citizenId: number
    wasteType: number
    latitude: number
    longitude: number
    wetWeight: number
    dryWeight: number
    otherWeight: number
    cumulativeWeight: number
    driverName: number
    vehicleNumber: number
    firmwareVersion: number
    unitNumber: number
    collectionType: number
    remarks: number
    errorCode: number
    citizenContact: number
    driverAction: number
    createdAt: number
    _all: number
  }


  export type MasterTelemetryAvgAggregateInputType = {
    id?: true
    citizenId?: true
    latitude?: true
    longitude?: true
    wetWeight?: true
    dryWeight?: true
    otherWeight?: true
    cumulativeWeight?: true
  }

  export type MasterTelemetrySumAggregateInputType = {
    id?: true
    citizenId?: true
    latitude?: true
    longitude?: true
    wetWeight?: true
    dryWeight?: true
    otherWeight?: true
    cumulativeWeight?: true
  }

  export type MasterTelemetryMinAggregateInputType = {
    id?: true
    iotTimestamp?: true
    receivedTimestamp?: true
    rfidEpc?: true
    citizenId?: true
    wasteType?: true
    latitude?: true
    longitude?: true
    wetWeight?: true
    dryWeight?: true
    otherWeight?: true
    cumulativeWeight?: true
    driverName?: true
    vehicleNumber?: true
    firmwareVersion?: true
    unitNumber?: true
    collectionType?: true
    remarks?: true
    errorCode?: true
    citizenContact?: true
    driverAction?: true
    createdAt?: true
  }

  export type MasterTelemetryMaxAggregateInputType = {
    id?: true
    iotTimestamp?: true
    receivedTimestamp?: true
    rfidEpc?: true
    citizenId?: true
    wasteType?: true
    latitude?: true
    longitude?: true
    wetWeight?: true
    dryWeight?: true
    otherWeight?: true
    cumulativeWeight?: true
    driverName?: true
    vehicleNumber?: true
    firmwareVersion?: true
    unitNumber?: true
    collectionType?: true
    remarks?: true
    errorCode?: true
    citizenContact?: true
    driverAction?: true
    createdAt?: true
  }

  export type MasterTelemetryCountAggregateInputType = {
    id?: true
    iotTimestamp?: true
    receivedTimestamp?: true
    rfidEpc?: true
    citizenId?: true
    wasteType?: true
    latitude?: true
    longitude?: true
    wetWeight?: true
    dryWeight?: true
    otherWeight?: true
    cumulativeWeight?: true
    driverName?: true
    vehicleNumber?: true
    firmwareVersion?: true
    unitNumber?: true
    collectionType?: true
    remarks?: true
    errorCode?: true
    citizenContact?: true
    driverAction?: true
    createdAt?: true
    _all?: true
  }

  export type MasterTelemetryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MasterTelemetry to aggregate.
     */
    where?: MasterTelemetryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MasterTelemetries to fetch.
     */
    orderBy?: MasterTelemetryOrderByWithRelationInput | MasterTelemetryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MasterTelemetryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MasterTelemetries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MasterTelemetries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned MasterTelemetries
    **/
    _count?: true | MasterTelemetryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: MasterTelemetryAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: MasterTelemetrySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MasterTelemetryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MasterTelemetryMaxAggregateInputType
  }

  export type GetMasterTelemetryAggregateType<T extends MasterTelemetryAggregateArgs> = {
        [P in keyof T & keyof AggregateMasterTelemetry]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMasterTelemetry[P]>
      : GetScalarType<T[P], AggregateMasterTelemetry[P]>
  }




  export type MasterTelemetryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MasterTelemetryWhereInput
    orderBy?: MasterTelemetryOrderByWithAggregationInput | MasterTelemetryOrderByWithAggregationInput[]
    by: MasterTelemetryScalarFieldEnum[] | MasterTelemetryScalarFieldEnum
    having?: MasterTelemetryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MasterTelemetryCountAggregateInputType | true
    _avg?: MasterTelemetryAvgAggregateInputType
    _sum?: MasterTelemetrySumAggregateInputType
    _min?: MasterTelemetryMinAggregateInputType
    _max?: MasterTelemetryMaxAggregateInputType
  }

  export type MasterTelemetryGroupByOutputType = {
    id: bigint
    iotTimestamp: Date | null
    receivedTimestamp: Date
    rfidEpc: string | null
    citizenId: number | null
    wasteType: string | null
    latitude: Decimal | null
    longitude: Decimal | null
    wetWeight: Decimal | null
    dryWeight: Decimal | null
    otherWeight: Decimal | null
    cumulativeWeight: Decimal | null
    driverName: string | null
    vehicleNumber: string | null
    firmwareVersion: string | null
    unitNumber: string | null
    collectionType: string | null
    remarks: string | null
    errorCode: string | null
    citizenContact: string | null
    driverAction: string | null
    createdAt: Date
    _count: MasterTelemetryCountAggregateOutputType | null
    _avg: MasterTelemetryAvgAggregateOutputType | null
    _sum: MasterTelemetrySumAggregateOutputType | null
    _min: MasterTelemetryMinAggregateOutputType | null
    _max: MasterTelemetryMaxAggregateOutputType | null
  }

  type GetMasterTelemetryGroupByPayload<T extends MasterTelemetryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MasterTelemetryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MasterTelemetryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MasterTelemetryGroupByOutputType[P]>
            : GetScalarType<T[P], MasterTelemetryGroupByOutputType[P]>
        }
      >
    >


  export type MasterTelemetrySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    iotTimestamp?: boolean
    receivedTimestamp?: boolean
    rfidEpc?: boolean
    citizenId?: boolean
    wasteType?: boolean
    latitude?: boolean
    longitude?: boolean
    wetWeight?: boolean
    dryWeight?: boolean
    otherWeight?: boolean
    cumulativeWeight?: boolean
    driverName?: boolean
    vehicleNumber?: boolean
    firmwareVersion?: boolean
    unitNumber?: boolean
    collectionType?: boolean
    remarks?: boolean
    errorCode?: boolean
    citizenContact?: boolean
    driverAction?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["masterTelemetry"]>

  export type MasterTelemetrySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    iotTimestamp?: boolean
    receivedTimestamp?: boolean
    rfidEpc?: boolean
    citizenId?: boolean
    wasteType?: boolean
    latitude?: boolean
    longitude?: boolean
    wetWeight?: boolean
    dryWeight?: boolean
    otherWeight?: boolean
    cumulativeWeight?: boolean
    driverName?: boolean
    vehicleNumber?: boolean
    firmwareVersion?: boolean
    unitNumber?: boolean
    collectionType?: boolean
    remarks?: boolean
    errorCode?: boolean
    citizenContact?: boolean
    driverAction?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["masterTelemetry"]>

  export type MasterTelemetrySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    iotTimestamp?: boolean
    receivedTimestamp?: boolean
    rfidEpc?: boolean
    citizenId?: boolean
    wasteType?: boolean
    latitude?: boolean
    longitude?: boolean
    wetWeight?: boolean
    dryWeight?: boolean
    otherWeight?: boolean
    cumulativeWeight?: boolean
    driverName?: boolean
    vehicleNumber?: boolean
    firmwareVersion?: boolean
    unitNumber?: boolean
    collectionType?: boolean
    remarks?: boolean
    errorCode?: boolean
    citizenContact?: boolean
    driverAction?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["masterTelemetry"]>

  export type MasterTelemetrySelectScalar = {
    id?: boolean
    iotTimestamp?: boolean
    receivedTimestamp?: boolean
    rfidEpc?: boolean
    citizenId?: boolean
    wasteType?: boolean
    latitude?: boolean
    longitude?: boolean
    wetWeight?: boolean
    dryWeight?: boolean
    otherWeight?: boolean
    cumulativeWeight?: boolean
    driverName?: boolean
    vehicleNumber?: boolean
    firmwareVersion?: boolean
    unitNumber?: boolean
    collectionType?: boolean
    remarks?: boolean
    errorCode?: boolean
    citizenContact?: boolean
    driverAction?: boolean
    createdAt?: boolean
  }

  export type MasterTelemetryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "iotTimestamp" | "receivedTimestamp" | "rfidEpc" | "citizenId" | "wasteType" | "latitude" | "longitude" | "wetWeight" | "dryWeight" | "otherWeight" | "cumulativeWeight" | "driverName" | "vehicleNumber" | "firmwareVersion" | "unitNumber" | "collectionType" | "remarks" | "errorCode" | "citizenContact" | "driverAction" | "createdAt", ExtArgs["result"]["masterTelemetry"]>

  export type $MasterTelemetryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "MasterTelemetry"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: bigint
      iotTimestamp: Date | null
      receivedTimestamp: Date
      rfidEpc: string | null
      citizenId: number | null
      wasteType: string | null
      latitude: Prisma.Decimal | null
      longitude: Prisma.Decimal | null
      wetWeight: Prisma.Decimal | null
      dryWeight: Prisma.Decimal | null
      otherWeight: Prisma.Decimal | null
      cumulativeWeight: Prisma.Decimal | null
      driverName: string | null
      vehicleNumber: string | null
      firmwareVersion: string | null
      unitNumber: string | null
      collectionType: string | null
      remarks: string | null
      errorCode: string | null
      citizenContact: string | null
      driverAction: string | null
      createdAt: Date
    }, ExtArgs["result"]["masterTelemetry"]>
    composites: {}
  }

  type MasterTelemetryGetPayload<S extends boolean | null | undefined | MasterTelemetryDefaultArgs> = $Result.GetResult<Prisma.$MasterTelemetryPayload, S>

  type MasterTelemetryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MasterTelemetryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MasterTelemetryCountAggregateInputType | true
    }

  export interface MasterTelemetryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['MasterTelemetry'], meta: { name: 'MasterTelemetry' } }
    /**
     * Find zero or one MasterTelemetry that matches the filter.
     * @param {MasterTelemetryFindUniqueArgs} args - Arguments to find a MasterTelemetry
     * @example
     * // Get one MasterTelemetry
     * const masterTelemetry = await prisma.masterTelemetry.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MasterTelemetryFindUniqueArgs>(args: SelectSubset<T, MasterTelemetryFindUniqueArgs<ExtArgs>>): Prisma__MasterTelemetryClient<$Result.GetResult<Prisma.$MasterTelemetryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one MasterTelemetry that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MasterTelemetryFindUniqueOrThrowArgs} args - Arguments to find a MasterTelemetry
     * @example
     * // Get one MasterTelemetry
     * const masterTelemetry = await prisma.masterTelemetry.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MasterTelemetryFindUniqueOrThrowArgs>(args: SelectSubset<T, MasterTelemetryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MasterTelemetryClient<$Result.GetResult<Prisma.$MasterTelemetryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MasterTelemetry that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MasterTelemetryFindFirstArgs} args - Arguments to find a MasterTelemetry
     * @example
     * // Get one MasterTelemetry
     * const masterTelemetry = await prisma.masterTelemetry.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MasterTelemetryFindFirstArgs>(args?: SelectSubset<T, MasterTelemetryFindFirstArgs<ExtArgs>>): Prisma__MasterTelemetryClient<$Result.GetResult<Prisma.$MasterTelemetryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MasterTelemetry that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MasterTelemetryFindFirstOrThrowArgs} args - Arguments to find a MasterTelemetry
     * @example
     * // Get one MasterTelemetry
     * const masterTelemetry = await prisma.masterTelemetry.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MasterTelemetryFindFirstOrThrowArgs>(args?: SelectSubset<T, MasterTelemetryFindFirstOrThrowArgs<ExtArgs>>): Prisma__MasterTelemetryClient<$Result.GetResult<Prisma.$MasterTelemetryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more MasterTelemetries that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MasterTelemetryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MasterTelemetries
     * const masterTelemetries = await prisma.masterTelemetry.findMany()
     * 
     * // Get first 10 MasterTelemetries
     * const masterTelemetries = await prisma.masterTelemetry.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const masterTelemetryWithIdOnly = await prisma.masterTelemetry.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MasterTelemetryFindManyArgs>(args?: SelectSubset<T, MasterTelemetryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MasterTelemetryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a MasterTelemetry.
     * @param {MasterTelemetryCreateArgs} args - Arguments to create a MasterTelemetry.
     * @example
     * // Create one MasterTelemetry
     * const MasterTelemetry = await prisma.masterTelemetry.create({
     *   data: {
     *     // ... data to create a MasterTelemetry
     *   }
     * })
     * 
     */
    create<T extends MasterTelemetryCreateArgs>(args: SelectSubset<T, MasterTelemetryCreateArgs<ExtArgs>>): Prisma__MasterTelemetryClient<$Result.GetResult<Prisma.$MasterTelemetryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many MasterTelemetries.
     * @param {MasterTelemetryCreateManyArgs} args - Arguments to create many MasterTelemetries.
     * @example
     * // Create many MasterTelemetries
     * const masterTelemetry = await prisma.masterTelemetry.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MasterTelemetryCreateManyArgs>(args?: SelectSubset<T, MasterTelemetryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many MasterTelemetries and returns the data saved in the database.
     * @param {MasterTelemetryCreateManyAndReturnArgs} args - Arguments to create many MasterTelemetries.
     * @example
     * // Create many MasterTelemetries
     * const masterTelemetry = await prisma.masterTelemetry.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many MasterTelemetries and only return the `id`
     * const masterTelemetryWithIdOnly = await prisma.masterTelemetry.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MasterTelemetryCreateManyAndReturnArgs>(args?: SelectSubset<T, MasterTelemetryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MasterTelemetryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a MasterTelemetry.
     * @param {MasterTelemetryDeleteArgs} args - Arguments to delete one MasterTelemetry.
     * @example
     * // Delete one MasterTelemetry
     * const MasterTelemetry = await prisma.masterTelemetry.delete({
     *   where: {
     *     // ... filter to delete one MasterTelemetry
     *   }
     * })
     * 
     */
    delete<T extends MasterTelemetryDeleteArgs>(args: SelectSubset<T, MasterTelemetryDeleteArgs<ExtArgs>>): Prisma__MasterTelemetryClient<$Result.GetResult<Prisma.$MasterTelemetryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one MasterTelemetry.
     * @param {MasterTelemetryUpdateArgs} args - Arguments to update one MasterTelemetry.
     * @example
     * // Update one MasterTelemetry
     * const masterTelemetry = await prisma.masterTelemetry.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MasterTelemetryUpdateArgs>(args: SelectSubset<T, MasterTelemetryUpdateArgs<ExtArgs>>): Prisma__MasterTelemetryClient<$Result.GetResult<Prisma.$MasterTelemetryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more MasterTelemetries.
     * @param {MasterTelemetryDeleteManyArgs} args - Arguments to filter MasterTelemetries to delete.
     * @example
     * // Delete a few MasterTelemetries
     * const { count } = await prisma.masterTelemetry.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MasterTelemetryDeleteManyArgs>(args?: SelectSubset<T, MasterTelemetryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MasterTelemetries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MasterTelemetryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MasterTelemetries
     * const masterTelemetry = await prisma.masterTelemetry.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MasterTelemetryUpdateManyArgs>(args: SelectSubset<T, MasterTelemetryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MasterTelemetries and returns the data updated in the database.
     * @param {MasterTelemetryUpdateManyAndReturnArgs} args - Arguments to update many MasterTelemetries.
     * @example
     * // Update many MasterTelemetries
     * const masterTelemetry = await prisma.masterTelemetry.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more MasterTelemetries and only return the `id`
     * const masterTelemetryWithIdOnly = await prisma.masterTelemetry.updateManyAndReturn({
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
    updateManyAndReturn<T extends MasterTelemetryUpdateManyAndReturnArgs>(args: SelectSubset<T, MasterTelemetryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MasterTelemetryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one MasterTelemetry.
     * @param {MasterTelemetryUpsertArgs} args - Arguments to update or create a MasterTelemetry.
     * @example
     * // Update or create a MasterTelemetry
     * const masterTelemetry = await prisma.masterTelemetry.upsert({
     *   create: {
     *     // ... data to create a MasterTelemetry
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MasterTelemetry we want to update
     *   }
     * })
     */
    upsert<T extends MasterTelemetryUpsertArgs>(args: SelectSubset<T, MasterTelemetryUpsertArgs<ExtArgs>>): Prisma__MasterTelemetryClient<$Result.GetResult<Prisma.$MasterTelemetryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of MasterTelemetries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MasterTelemetryCountArgs} args - Arguments to filter MasterTelemetries to count.
     * @example
     * // Count the number of MasterTelemetries
     * const count = await prisma.masterTelemetry.count({
     *   where: {
     *     // ... the filter for the MasterTelemetries we want to count
     *   }
     * })
    **/
    count<T extends MasterTelemetryCountArgs>(
      args?: Subset<T, MasterTelemetryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MasterTelemetryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a MasterTelemetry.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MasterTelemetryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends MasterTelemetryAggregateArgs>(args: Subset<T, MasterTelemetryAggregateArgs>): Prisma.PrismaPromise<GetMasterTelemetryAggregateType<T>>

    /**
     * Group by MasterTelemetry.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MasterTelemetryGroupByArgs} args - Group by arguments.
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
      T extends MasterTelemetryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MasterTelemetryGroupByArgs['orderBy'] }
        : { orderBy?: MasterTelemetryGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, MasterTelemetryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMasterTelemetryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the MasterTelemetry model
   */
  readonly fields: MasterTelemetryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for MasterTelemetry.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MasterTelemetryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the MasterTelemetry model
   */
  interface MasterTelemetryFieldRefs {
    readonly id: FieldRef<"MasterTelemetry", 'BigInt'>
    readonly iotTimestamp: FieldRef<"MasterTelemetry", 'DateTime'>
    readonly receivedTimestamp: FieldRef<"MasterTelemetry", 'DateTime'>
    readonly rfidEpc: FieldRef<"MasterTelemetry", 'String'>
    readonly citizenId: FieldRef<"MasterTelemetry", 'Int'>
    readonly wasteType: FieldRef<"MasterTelemetry", 'String'>
    readonly latitude: FieldRef<"MasterTelemetry", 'Decimal'>
    readonly longitude: FieldRef<"MasterTelemetry", 'Decimal'>
    readonly wetWeight: FieldRef<"MasterTelemetry", 'Decimal'>
    readonly dryWeight: FieldRef<"MasterTelemetry", 'Decimal'>
    readonly otherWeight: FieldRef<"MasterTelemetry", 'Decimal'>
    readonly cumulativeWeight: FieldRef<"MasterTelemetry", 'Decimal'>
    readonly driverName: FieldRef<"MasterTelemetry", 'String'>
    readonly vehicleNumber: FieldRef<"MasterTelemetry", 'String'>
    readonly firmwareVersion: FieldRef<"MasterTelemetry", 'String'>
    readonly unitNumber: FieldRef<"MasterTelemetry", 'String'>
    readonly collectionType: FieldRef<"MasterTelemetry", 'String'>
    readonly remarks: FieldRef<"MasterTelemetry", 'String'>
    readonly errorCode: FieldRef<"MasterTelemetry", 'String'>
    readonly citizenContact: FieldRef<"MasterTelemetry", 'String'>
    readonly driverAction: FieldRef<"MasterTelemetry", 'String'>
    readonly createdAt: FieldRef<"MasterTelemetry", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * MasterTelemetry findUnique
   */
  export type MasterTelemetryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MasterTelemetry
     */
    select?: MasterTelemetrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the MasterTelemetry
     */
    omit?: MasterTelemetryOmit<ExtArgs> | null
    /**
     * Filter, which MasterTelemetry to fetch.
     */
    where: MasterTelemetryWhereUniqueInput
  }

  /**
   * MasterTelemetry findUniqueOrThrow
   */
  export type MasterTelemetryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MasterTelemetry
     */
    select?: MasterTelemetrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the MasterTelemetry
     */
    omit?: MasterTelemetryOmit<ExtArgs> | null
    /**
     * Filter, which MasterTelemetry to fetch.
     */
    where: MasterTelemetryWhereUniqueInput
  }

  /**
   * MasterTelemetry findFirst
   */
  export type MasterTelemetryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MasterTelemetry
     */
    select?: MasterTelemetrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the MasterTelemetry
     */
    omit?: MasterTelemetryOmit<ExtArgs> | null
    /**
     * Filter, which MasterTelemetry to fetch.
     */
    where?: MasterTelemetryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MasterTelemetries to fetch.
     */
    orderBy?: MasterTelemetryOrderByWithRelationInput | MasterTelemetryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MasterTelemetries.
     */
    cursor?: MasterTelemetryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MasterTelemetries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MasterTelemetries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MasterTelemetries.
     */
    distinct?: MasterTelemetryScalarFieldEnum | MasterTelemetryScalarFieldEnum[]
  }

  /**
   * MasterTelemetry findFirstOrThrow
   */
  export type MasterTelemetryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MasterTelemetry
     */
    select?: MasterTelemetrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the MasterTelemetry
     */
    omit?: MasterTelemetryOmit<ExtArgs> | null
    /**
     * Filter, which MasterTelemetry to fetch.
     */
    where?: MasterTelemetryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MasterTelemetries to fetch.
     */
    orderBy?: MasterTelemetryOrderByWithRelationInput | MasterTelemetryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MasterTelemetries.
     */
    cursor?: MasterTelemetryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MasterTelemetries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MasterTelemetries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MasterTelemetries.
     */
    distinct?: MasterTelemetryScalarFieldEnum | MasterTelemetryScalarFieldEnum[]
  }

  /**
   * MasterTelemetry findMany
   */
  export type MasterTelemetryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MasterTelemetry
     */
    select?: MasterTelemetrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the MasterTelemetry
     */
    omit?: MasterTelemetryOmit<ExtArgs> | null
    /**
     * Filter, which MasterTelemetries to fetch.
     */
    where?: MasterTelemetryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MasterTelemetries to fetch.
     */
    orderBy?: MasterTelemetryOrderByWithRelationInput | MasterTelemetryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing MasterTelemetries.
     */
    cursor?: MasterTelemetryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MasterTelemetries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MasterTelemetries.
     */
    skip?: number
    distinct?: MasterTelemetryScalarFieldEnum | MasterTelemetryScalarFieldEnum[]
  }

  /**
   * MasterTelemetry create
   */
  export type MasterTelemetryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MasterTelemetry
     */
    select?: MasterTelemetrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the MasterTelemetry
     */
    omit?: MasterTelemetryOmit<ExtArgs> | null
    /**
     * The data needed to create a MasterTelemetry.
     */
    data?: XOR<MasterTelemetryCreateInput, MasterTelemetryUncheckedCreateInput>
  }

  /**
   * MasterTelemetry createMany
   */
  export type MasterTelemetryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many MasterTelemetries.
     */
    data: MasterTelemetryCreateManyInput | MasterTelemetryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MasterTelemetry createManyAndReturn
   */
  export type MasterTelemetryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MasterTelemetry
     */
    select?: MasterTelemetrySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MasterTelemetry
     */
    omit?: MasterTelemetryOmit<ExtArgs> | null
    /**
     * The data used to create many MasterTelemetries.
     */
    data: MasterTelemetryCreateManyInput | MasterTelemetryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MasterTelemetry update
   */
  export type MasterTelemetryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MasterTelemetry
     */
    select?: MasterTelemetrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the MasterTelemetry
     */
    omit?: MasterTelemetryOmit<ExtArgs> | null
    /**
     * The data needed to update a MasterTelemetry.
     */
    data: XOR<MasterTelemetryUpdateInput, MasterTelemetryUncheckedUpdateInput>
    /**
     * Choose, which MasterTelemetry to update.
     */
    where: MasterTelemetryWhereUniqueInput
  }

  /**
   * MasterTelemetry updateMany
   */
  export type MasterTelemetryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update MasterTelemetries.
     */
    data: XOR<MasterTelemetryUpdateManyMutationInput, MasterTelemetryUncheckedUpdateManyInput>
    /**
     * Filter which MasterTelemetries to update
     */
    where?: MasterTelemetryWhereInput
    /**
     * Limit how many MasterTelemetries to update.
     */
    limit?: number
  }

  /**
   * MasterTelemetry updateManyAndReturn
   */
  export type MasterTelemetryUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MasterTelemetry
     */
    select?: MasterTelemetrySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MasterTelemetry
     */
    omit?: MasterTelemetryOmit<ExtArgs> | null
    /**
     * The data used to update MasterTelemetries.
     */
    data: XOR<MasterTelemetryUpdateManyMutationInput, MasterTelemetryUncheckedUpdateManyInput>
    /**
     * Filter which MasterTelemetries to update
     */
    where?: MasterTelemetryWhereInput
    /**
     * Limit how many MasterTelemetries to update.
     */
    limit?: number
  }

  /**
   * MasterTelemetry upsert
   */
  export type MasterTelemetryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MasterTelemetry
     */
    select?: MasterTelemetrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the MasterTelemetry
     */
    omit?: MasterTelemetryOmit<ExtArgs> | null
    /**
     * The filter to search for the MasterTelemetry to update in case it exists.
     */
    where: MasterTelemetryWhereUniqueInput
    /**
     * In case the MasterTelemetry found by the `where` argument doesn't exist, create a new MasterTelemetry with this data.
     */
    create: XOR<MasterTelemetryCreateInput, MasterTelemetryUncheckedCreateInput>
    /**
     * In case the MasterTelemetry was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MasterTelemetryUpdateInput, MasterTelemetryUncheckedUpdateInput>
  }

  /**
   * MasterTelemetry delete
   */
  export type MasterTelemetryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MasterTelemetry
     */
    select?: MasterTelemetrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the MasterTelemetry
     */
    omit?: MasterTelemetryOmit<ExtArgs> | null
    /**
     * Filter which MasterTelemetry to delete.
     */
    where: MasterTelemetryWhereUniqueInput
  }

  /**
   * MasterTelemetry deleteMany
   */
  export type MasterTelemetryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MasterTelemetries to delete
     */
    where?: MasterTelemetryWhereInput
    /**
     * Limit how many MasterTelemetries to delete.
     */
    limit?: number
  }

  /**
   * MasterTelemetry without action
   */
  export type MasterTelemetryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MasterTelemetry
     */
    select?: MasterTelemetrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the MasterTelemetry
     */
    omit?: MasterTelemetryOmit<ExtArgs> | null
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


  export const MasterTelemetryScalarFieldEnum: {
    id: 'id',
    iotTimestamp: 'iotTimestamp',
    receivedTimestamp: 'receivedTimestamp',
    rfidEpc: 'rfidEpc',
    citizenId: 'citizenId',
    wasteType: 'wasteType',
    latitude: 'latitude',
    longitude: 'longitude',
    wetWeight: 'wetWeight',
    dryWeight: 'dryWeight',
    otherWeight: 'otherWeight',
    cumulativeWeight: 'cumulativeWeight',
    driverName: 'driverName',
    vehicleNumber: 'vehicleNumber',
    firmwareVersion: 'firmwareVersion',
    unitNumber: 'unitNumber',
    collectionType: 'collectionType',
    remarks: 'remarks',
    errorCode: 'errorCode',
    citizenContact: 'citizenContact',
    driverAction: 'driverAction',
    createdAt: 'createdAt'
  };

  export type MasterTelemetryScalarFieldEnum = (typeof MasterTelemetryScalarFieldEnum)[keyof typeof MasterTelemetryScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'BigInt'
   */
  export type BigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt'>
    


  /**
   * Reference to a field of type 'BigInt[]'
   */
  export type ListBigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Decimal'
   */
  export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>
    


  /**
   * Reference to a field of type 'Decimal[]'
   */
  export type ListDecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal[]'>
    


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


  export type MasterTelemetryWhereInput = {
    AND?: MasterTelemetryWhereInput | MasterTelemetryWhereInput[]
    OR?: MasterTelemetryWhereInput[]
    NOT?: MasterTelemetryWhereInput | MasterTelemetryWhereInput[]
    id?: BigIntFilter<"MasterTelemetry"> | bigint | number
    iotTimestamp?: DateTimeNullableFilter<"MasterTelemetry"> | Date | string | null
    receivedTimestamp?: DateTimeFilter<"MasterTelemetry"> | Date | string
    rfidEpc?: StringNullableFilter<"MasterTelemetry"> | string | null
    citizenId?: IntNullableFilter<"MasterTelemetry"> | number | null
    wasteType?: StringNullableFilter<"MasterTelemetry"> | string | null
    latitude?: DecimalNullableFilter<"MasterTelemetry"> | Decimal | DecimalJsLike | number | string | null
    longitude?: DecimalNullableFilter<"MasterTelemetry"> | Decimal | DecimalJsLike | number | string | null
    wetWeight?: DecimalNullableFilter<"MasterTelemetry"> | Decimal | DecimalJsLike | number | string | null
    dryWeight?: DecimalNullableFilter<"MasterTelemetry"> | Decimal | DecimalJsLike | number | string | null
    otherWeight?: DecimalNullableFilter<"MasterTelemetry"> | Decimal | DecimalJsLike | number | string | null
    cumulativeWeight?: DecimalNullableFilter<"MasterTelemetry"> | Decimal | DecimalJsLike | number | string | null
    driverName?: StringNullableFilter<"MasterTelemetry"> | string | null
    vehicleNumber?: StringNullableFilter<"MasterTelemetry"> | string | null
    firmwareVersion?: StringNullableFilter<"MasterTelemetry"> | string | null
    unitNumber?: StringNullableFilter<"MasterTelemetry"> | string | null
    collectionType?: StringNullableFilter<"MasterTelemetry"> | string | null
    remarks?: StringNullableFilter<"MasterTelemetry"> | string | null
    errorCode?: StringNullableFilter<"MasterTelemetry"> | string | null
    citizenContact?: StringNullableFilter<"MasterTelemetry"> | string | null
    driverAction?: StringNullableFilter<"MasterTelemetry"> | string | null
    createdAt?: DateTimeFilter<"MasterTelemetry"> | Date | string
  }

  export type MasterTelemetryOrderByWithRelationInput = {
    id?: SortOrder
    iotTimestamp?: SortOrderInput | SortOrder
    receivedTimestamp?: SortOrder
    rfidEpc?: SortOrderInput | SortOrder
    citizenId?: SortOrderInput | SortOrder
    wasteType?: SortOrderInput | SortOrder
    latitude?: SortOrderInput | SortOrder
    longitude?: SortOrderInput | SortOrder
    wetWeight?: SortOrderInput | SortOrder
    dryWeight?: SortOrderInput | SortOrder
    otherWeight?: SortOrderInput | SortOrder
    cumulativeWeight?: SortOrderInput | SortOrder
    driverName?: SortOrderInput | SortOrder
    vehicleNumber?: SortOrderInput | SortOrder
    firmwareVersion?: SortOrderInput | SortOrder
    unitNumber?: SortOrderInput | SortOrder
    collectionType?: SortOrderInput | SortOrder
    remarks?: SortOrderInput | SortOrder
    errorCode?: SortOrderInput | SortOrder
    citizenContact?: SortOrderInput | SortOrder
    driverAction?: SortOrderInput | SortOrder
    createdAt?: SortOrder
  }

  export type MasterTelemetryWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number
    AND?: MasterTelemetryWhereInput | MasterTelemetryWhereInput[]
    OR?: MasterTelemetryWhereInput[]
    NOT?: MasterTelemetryWhereInput | MasterTelemetryWhereInput[]
    iotTimestamp?: DateTimeNullableFilter<"MasterTelemetry"> | Date | string | null
    receivedTimestamp?: DateTimeFilter<"MasterTelemetry"> | Date | string
    rfidEpc?: StringNullableFilter<"MasterTelemetry"> | string | null
    citizenId?: IntNullableFilter<"MasterTelemetry"> | number | null
    wasteType?: StringNullableFilter<"MasterTelemetry"> | string | null
    latitude?: DecimalNullableFilter<"MasterTelemetry"> | Decimal | DecimalJsLike | number | string | null
    longitude?: DecimalNullableFilter<"MasterTelemetry"> | Decimal | DecimalJsLike | number | string | null
    wetWeight?: DecimalNullableFilter<"MasterTelemetry"> | Decimal | DecimalJsLike | number | string | null
    dryWeight?: DecimalNullableFilter<"MasterTelemetry"> | Decimal | DecimalJsLike | number | string | null
    otherWeight?: DecimalNullableFilter<"MasterTelemetry"> | Decimal | DecimalJsLike | number | string | null
    cumulativeWeight?: DecimalNullableFilter<"MasterTelemetry"> | Decimal | DecimalJsLike | number | string | null
    driverName?: StringNullableFilter<"MasterTelemetry"> | string | null
    vehicleNumber?: StringNullableFilter<"MasterTelemetry"> | string | null
    firmwareVersion?: StringNullableFilter<"MasterTelemetry"> | string | null
    unitNumber?: StringNullableFilter<"MasterTelemetry"> | string | null
    collectionType?: StringNullableFilter<"MasterTelemetry"> | string | null
    remarks?: StringNullableFilter<"MasterTelemetry"> | string | null
    errorCode?: StringNullableFilter<"MasterTelemetry"> | string | null
    citizenContact?: StringNullableFilter<"MasterTelemetry"> | string | null
    driverAction?: StringNullableFilter<"MasterTelemetry"> | string | null
    createdAt?: DateTimeFilter<"MasterTelemetry"> | Date | string
  }, "id">

  export type MasterTelemetryOrderByWithAggregationInput = {
    id?: SortOrder
    iotTimestamp?: SortOrderInput | SortOrder
    receivedTimestamp?: SortOrder
    rfidEpc?: SortOrderInput | SortOrder
    citizenId?: SortOrderInput | SortOrder
    wasteType?: SortOrderInput | SortOrder
    latitude?: SortOrderInput | SortOrder
    longitude?: SortOrderInput | SortOrder
    wetWeight?: SortOrderInput | SortOrder
    dryWeight?: SortOrderInput | SortOrder
    otherWeight?: SortOrderInput | SortOrder
    cumulativeWeight?: SortOrderInput | SortOrder
    driverName?: SortOrderInput | SortOrder
    vehicleNumber?: SortOrderInput | SortOrder
    firmwareVersion?: SortOrderInput | SortOrder
    unitNumber?: SortOrderInput | SortOrder
    collectionType?: SortOrderInput | SortOrder
    remarks?: SortOrderInput | SortOrder
    errorCode?: SortOrderInput | SortOrder
    citizenContact?: SortOrderInput | SortOrder
    driverAction?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: MasterTelemetryCountOrderByAggregateInput
    _avg?: MasterTelemetryAvgOrderByAggregateInput
    _max?: MasterTelemetryMaxOrderByAggregateInput
    _min?: MasterTelemetryMinOrderByAggregateInput
    _sum?: MasterTelemetrySumOrderByAggregateInput
  }

  export type MasterTelemetryScalarWhereWithAggregatesInput = {
    AND?: MasterTelemetryScalarWhereWithAggregatesInput | MasterTelemetryScalarWhereWithAggregatesInput[]
    OR?: MasterTelemetryScalarWhereWithAggregatesInput[]
    NOT?: MasterTelemetryScalarWhereWithAggregatesInput | MasterTelemetryScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<"MasterTelemetry"> | bigint | number
    iotTimestamp?: DateTimeNullableWithAggregatesFilter<"MasterTelemetry"> | Date | string | null
    receivedTimestamp?: DateTimeWithAggregatesFilter<"MasterTelemetry"> | Date | string
    rfidEpc?: StringNullableWithAggregatesFilter<"MasterTelemetry"> | string | null
    citizenId?: IntNullableWithAggregatesFilter<"MasterTelemetry"> | number | null
    wasteType?: StringNullableWithAggregatesFilter<"MasterTelemetry"> | string | null
    latitude?: DecimalNullableWithAggregatesFilter<"MasterTelemetry"> | Decimal | DecimalJsLike | number | string | null
    longitude?: DecimalNullableWithAggregatesFilter<"MasterTelemetry"> | Decimal | DecimalJsLike | number | string | null
    wetWeight?: DecimalNullableWithAggregatesFilter<"MasterTelemetry"> | Decimal | DecimalJsLike | number | string | null
    dryWeight?: DecimalNullableWithAggregatesFilter<"MasterTelemetry"> | Decimal | DecimalJsLike | number | string | null
    otherWeight?: DecimalNullableWithAggregatesFilter<"MasterTelemetry"> | Decimal | DecimalJsLike | number | string | null
    cumulativeWeight?: DecimalNullableWithAggregatesFilter<"MasterTelemetry"> | Decimal | DecimalJsLike | number | string | null
    driverName?: StringNullableWithAggregatesFilter<"MasterTelemetry"> | string | null
    vehicleNumber?: StringNullableWithAggregatesFilter<"MasterTelemetry"> | string | null
    firmwareVersion?: StringNullableWithAggregatesFilter<"MasterTelemetry"> | string | null
    unitNumber?: StringNullableWithAggregatesFilter<"MasterTelemetry"> | string | null
    collectionType?: StringNullableWithAggregatesFilter<"MasterTelemetry"> | string | null
    remarks?: StringNullableWithAggregatesFilter<"MasterTelemetry"> | string | null
    errorCode?: StringNullableWithAggregatesFilter<"MasterTelemetry"> | string | null
    citizenContact?: StringNullableWithAggregatesFilter<"MasterTelemetry"> | string | null
    driverAction?: StringNullableWithAggregatesFilter<"MasterTelemetry"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"MasterTelemetry"> | Date | string
  }

  export type MasterTelemetryCreateInput = {
    id?: bigint | number
    iotTimestamp?: Date | string | null
    receivedTimestamp?: Date | string
    rfidEpc?: string | null
    citizenId?: number | null
    wasteType?: string | null
    latitude?: Decimal | DecimalJsLike | number | string | null
    longitude?: Decimal | DecimalJsLike | number | string | null
    wetWeight?: Decimal | DecimalJsLike | number | string | null
    dryWeight?: Decimal | DecimalJsLike | number | string | null
    otherWeight?: Decimal | DecimalJsLike | number | string | null
    cumulativeWeight?: Decimal | DecimalJsLike | number | string | null
    driverName?: string | null
    vehicleNumber?: string | null
    firmwareVersion?: string | null
    unitNumber?: string | null
    collectionType?: string | null
    remarks?: string | null
    errorCode?: string | null
    citizenContact?: string | null
    driverAction?: string | null
    createdAt?: Date | string
  }

  export type MasterTelemetryUncheckedCreateInput = {
    id?: bigint | number
    iotTimestamp?: Date | string | null
    receivedTimestamp?: Date | string
    rfidEpc?: string | null
    citizenId?: number | null
    wasteType?: string | null
    latitude?: Decimal | DecimalJsLike | number | string | null
    longitude?: Decimal | DecimalJsLike | number | string | null
    wetWeight?: Decimal | DecimalJsLike | number | string | null
    dryWeight?: Decimal | DecimalJsLike | number | string | null
    otherWeight?: Decimal | DecimalJsLike | number | string | null
    cumulativeWeight?: Decimal | DecimalJsLike | number | string | null
    driverName?: string | null
    vehicleNumber?: string | null
    firmwareVersion?: string | null
    unitNumber?: string | null
    collectionType?: string | null
    remarks?: string | null
    errorCode?: string | null
    citizenContact?: string | null
    driverAction?: string | null
    createdAt?: Date | string
  }

  export type MasterTelemetryUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    iotTimestamp?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    receivedTimestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    rfidEpc?: NullableStringFieldUpdateOperationsInput | string | null
    citizenId?: NullableIntFieldUpdateOperationsInput | number | null
    wasteType?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    longitude?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    wetWeight?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    dryWeight?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    otherWeight?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    cumulativeWeight?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    driverName?: NullableStringFieldUpdateOperationsInput | string | null
    vehicleNumber?: NullableStringFieldUpdateOperationsInput | string | null
    firmwareVersion?: NullableStringFieldUpdateOperationsInput | string | null
    unitNumber?: NullableStringFieldUpdateOperationsInput | string | null
    collectionType?: NullableStringFieldUpdateOperationsInput | string | null
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    errorCode?: NullableStringFieldUpdateOperationsInput | string | null
    citizenContact?: NullableStringFieldUpdateOperationsInput | string | null
    driverAction?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MasterTelemetryUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    iotTimestamp?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    receivedTimestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    rfidEpc?: NullableStringFieldUpdateOperationsInput | string | null
    citizenId?: NullableIntFieldUpdateOperationsInput | number | null
    wasteType?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    longitude?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    wetWeight?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    dryWeight?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    otherWeight?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    cumulativeWeight?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    driverName?: NullableStringFieldUpdateOperationsInput | string | null
    vehicleNumber?: NullableStringFieldUpdateOperationsInput | string | null
    firmwareVersion?: NullableStringFieldUpdateOperationsInput | string | null
    unitNumber?: NullableStringFieldUpdateOperationsInput | string | null
    collectionType?: NullableStringFieldUpdateOperationsInput | string | null
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    errorCode?: NullableStringFieldUpdateOperationsInput | string | null
    citizenContact?: NullableStringFieldUpdateOperationsInput | string | null
    driverAction?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MasterTelemetryCreateManyInput = {
    id?: bigint | number
    iotTimestamp?: Date | string | null
    receivedTimestamp?: Date | string
    rfidEpc?: string | null
    citizenId?: number | null
    wasteType?: string | null
    latitude?: Decimal | DecimalJsLike | number | string | null
    longitude?: Decimal | DecimalJsLike | number | string | null
    wetWeight?: Decimal | DecimalJsLike | number | string | null
    dryWeight?: Decimal | DecimalJsLike | number | string | null
    otherWeight?: Decimal | DecimalJsLike | number | string | null
    cumulativeWeight?: Decimal | DecimalJsLike | number | string | null
    driverName?: string | null
    vehicleNumber?: string | null
    firmwareVersion?: string | null
    unitNumber?: string | null
    collectionType?: string | null
    remarks?: string | null
    errorCode?: string | null
    citizenContact?: string | null
    driverAction?: string | null
    createdAt?: Date | string
  }

  export type MasterTelemetryUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    iotTimestamp?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    receivedTimestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    rfidEpc?: NullableStringFieldUpdateOperationsInput | string | null
    citizenId?: NullableIntFieldUpdateOperationsInput | number | null
    wasteType?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    longitude?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    wetWeight?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    dryWeight?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    otherWeight?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    cumulativeWeight?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    driverName?: NullableStringFieldUpdateOperationsInput | string | null
    vehicleNumber?: NullableStringFieldUpdateOperationsInput | string | null
    firmwareVersion?: NullableStringFieldUpdateOperationsInput | string | null
    unitNumber?: NullableStringFieldUpdateOperationsInput | string | null
    collectionType?: NullableStringFieldUpdateOperationsInput | string | null
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    errorCode?: NullableStringFieldUpdateOperationsInput | string | null
    citizenContact?: NullableStringFieldUpdateOperationsInput | string | null
    driverAction?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MasterTelemetryUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    iotTimestamp?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    receivedTimestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    rfidEpc?: NullableStringFieldUpdateOperationsInput | string | null
    citizenId?: NullableIntFieldUpdateOperationsInput | number | null
    wasteType?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    longitude?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    wetWeight?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    dryWeight?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    otherWeight?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    cumulativeWeight?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    driverName?: NullableStringFieldUpdateOperationsInput | string | null
    vehicleNumber?: NullableStringFieldUpdateOperationsInput | string | null
    firmwareVersion?: NullableStringFieldUpdateOperationsInput | string | null
    unitNumber?: NullableStringFieldUpdateOperationsInput | string | null
    collectionType?: NullableStringFieldUpdateOperationsInput | string | null
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    errorCode?: NullableStringFieldUpdateOperationsInput | string | null
    citizenContact?: NullableStringFieldUpdateOperationsInput | string | null
    driverAction?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
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

  export type DecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type MasterTelemetryCountOrderByAggregateInput = {
    id?: SortOrder
    iotTimestamp?: SortOrder
    receivedTimestamp?: SortOrder
    rfidEpc?: SortOrder
    citizenId?: SortOrder
    wasteType?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    wetWeight?: SortOrder
    dryWeight?: SortOrder
    otherWeight?: SortOrder
    cumulativeWeight?: SortOrder
    driverName?: SortOrder
    vehicleNumber?: SortOrder
    firmwareVersion?: SortOrder
    unitNumber?: SortOrder
    collectionType?: SortOrder
    remarks?: SortOrder
    errorCode?: SortOrder
    citizenContact?: SortOrder
    driverAction?: SortOrder
    createdAt?: SortOrder
  }

  export type MasterTelemetryAvgOrderByAggregateInput = {
    id?: SortOrder
    citizenId?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    wetWeight?: SortOrder
    dryWeight?: SortOrder
    otherWeight?: SortOrder
    cumulativeWeight?: SortOrder
  }

  export type MasterTelemetryMaxOrderByAggregateInput = {
    id?: SortOrder
    iotTimestamp?: SortOrder
    receivedTimestamp?: SortOrder
    rfidEpc?: SortOrder
    citizenId?: SortOrder
    wasteType?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    wetWeight?: SortOrder
    dryWeight?: SortOrder
    otherWeight?: SortOrder
    cumulativeWeight?: SortOrder
    driverName?: SortOrder
    vehicleNumber?: SortOrder
    firmwareVersion?: SortOrder
    unitNumber?: SortOrder
    collectionType?: SortOrder
    remarks?: SortOrder
    errorCode?: SortOrder
    citizenContact?: SortOrder
    driverAction?: SortOrder
    createdAt?: SortOrder
  }

  export type MasterTelemetryMinOrderByAggregateInput = {
    id?: SortOrder
    iotTimestamp?: SortOrder
    receivedTimestamp?: SortOrder
    rfidEpc?: SortOrder
    citizenId?: SortOrder
    wasteType?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    wetWeight?: SortOrder
    dryWeight?: SortOrder
    otherWeight?: SortOrder
    cumulativeWeight?: SortOrder
    driverName?: SortOrder
    vehicleNumber?: SortOrder
    firmwareVersion?: SortOrder
    unitNumber?: SortOrder
    collectionType?: SortOrder
    remarks?: SortOrder
    errorCode?: SortOrder
    citizenContact?: SortOrder
    driverAction?: SortOrder
    createdAt?: SortOrder
  }

  export type MasterTelemetrySumOrderByAggregateInput = {
    id?: SortOrder
    citizenId?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    wetWeight?: SortOrder
    dryWeight?: SortOrder
    otherWeight?: SortOrder
    cumulativeWeight?: SortOrder
  }

  export type BigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
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

  export type DecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
  }

  export type BigIntFieldUpdateOperationsInput = {
    set?: bigint | number
    increment?: bigint | number
    decrement?: bigint | number
    multiply?: bigint | number
    divide?: bigint | number
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableDecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string | null
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type NestedBigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
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

  export type NestedDecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }

  export type NestedBigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
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

  export type NestedDecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
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