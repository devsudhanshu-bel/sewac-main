
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
 * Model Moderator
 * 
 */
export type Moderator = $Result.DefaultSelection<Prisma.$ModeratorPayload>
/**
 * Model RFIDMapping
 * 
 */
export type RFIDMapping = $Result.DefaultSelection<Prisma.$RFIDMappingPayload>
/**
 * Model TrackingLog
 * 
 */
export type TrackingLog = $Result.DefaultSelection<Prisma.$TrackingLogPayload>
/**
 * Model master_citizen_data
 * 
 */
export type master_citizen_data = $Result.DefaultSelection<Prisma.$master_citizen_dataPayload>
/**
 * Model survey_attribute_specific
 * 
 */
export type survey_attribute_specific = $Result.DefaultSelection<Prisma.$survey_attribute_specificPayload>
/**
 * Model users
 * 
 */
export type users = $Result.DefaultSelection<Prisma.$usersPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const TrackingStatus: {
  FOUND: 'FOUND',
  NOT_FOUND: 'NOT_FOUND'
};

export type TrackingStatus = (typeof TrackingStatus)[keyof typeof TrackingStatus]


export const WasteType: {
  DRY: 'DRY',
  WET: 'WET'
};

export type WasteType = (typeof WasteType)[keyof typeof WasteType]

}

export type TrackingStatus = $Enums.TrackingStatus

export const TrackingStatus: typeof $Enums.TrackingStatus

export type WasteType = $Enums.WasteType

export const WasteType: typeof $Enums.WasteType

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Moderators
 * const moderators = await prisma.moderator.findMany()
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
   * // Fetch zero or more Moderators
   * const moderators = await prisma.moderator.findMany()
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
   * `prisma.moderator`: Exposes CRUD operations for the **Moderator** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Moderators
    * const moderators = await prisma.moderator.findMany()
    * ```
    */
  get moderator(): Prisma.ModeratorDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.rFIDMapping`: Exposes CRUD operations for the **RFIDMapping** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more RFIDMappings
    * const rFIDMappings = await prisma.rFIDMapping.findMany()
    * ```
    */
  get rFIDMapping(): Prisma.RFIDMappingDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.trackingLog`: Exposes CRUD operations for the **TrackingLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TrackingLogs
    * const trackingLogs = await prisma.trackingLog.findMany()
    * ```
    */
  get trackingLog(): Prisma.TrackingLogDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.master_citizen_data`: Exposes CRUD operations for the **master_citizen_data** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Master_citizen_data
    * const master_citizen_data = await prisma.master_citizen_data.findMany()
    * ```
    */
  get master_citizen_data(): Prisma.master_citizen_dataDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.survey_attribute_specific`: Exposes CRUD operations for the **survey_attribute_specific** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Survey_attribute_specifics
    * const survey_attribute_specifics = await prisma.survey_attribute_specific.findMany()
    * ```
    */
  get survey_attribute_specific(): Prisma.survey_attribute_specificDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.users`: Exposes CRUD operations for the **users** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.users.findMany()
    * ```
    */
  get users(): Prisma.usersDelegate<ExtArgs, ClientOptions>;
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
    Moderator: 'Moderator',
    RFIDMapping: 'RFIDMapping',
    TrackingLog: 'TrackingLog',
    master_citizen_data: 'master_citizen_data',
    survey_attribute_specific: 'survey_attribute_specific',
    users: 'users'
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
      modelProps: "moderator" | "rFIDMapping" | "trackingLog" | "master_citizen_data" | "survey_attribute_specific" | "users"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Moderator: {
        payload: Prisma.$ModeratorPayload<ExtArgs>
        fields: Prisma.ModeratorFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ModeratorFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ModeratorPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ModeratorFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ModeratorPayload>
          }
          findFirst: {
            args: Prisma.ModeratorFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ModeratorPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ModeratorFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ModeratorPayload>
          }
          findMany: {
            args: Prisma.ModeratorFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ModeratorPayload>[]
          }
          create: {
            args: Prisma.ModeratorCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ModeratorPayload>
          }
          createMany: {
            args: Prisma.ModeratorCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ModeratorCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ModeratorPayload>[]
          }
          delete: {
            args: Prisma.ModeratorDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ModeratorPayload>
          }
          update: {
            args: Prisma.ModeratorUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ModeratorPayload>
          }
          deleteMany: {
            args: Prisma.ModeratorDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ModeratorUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ModeratorUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ModeratorPayload>[]
          }
          upsert: {
            args: Prisma.ModeratorUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ModeratorPayload>
          }
          aggregate: {
            args: Prisma.ModeratorAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateModerator>
          }
          groupBy: {
            args: Prisma.ModeratorGroupByArgs<ExtArgs>
            result: $Utils.Optional<ModeratorGroupByOutputType>[]
          }
          count: {
            args: Prisma.ModeratorCountArgs<ExtArgs>
            result: $Utils.Optional<ModeratorCountAggregateOutputType> | number
          }
        }
      }
      RFIDMapping: {
        payload: Prisma.$RFIDMappingPayload<ExtArgs>
        fields: Prisma.RFIDMappingFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RFIDMappingFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RFIDMappingPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RFIDMappingFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RFIDMappingPayload>
          }
          findFirst: {
            args: Prisma.RFIDMappingFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RFIDMappingPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RFIDMappingFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RFIDMappingPayload>
          }
          findMany: {
            args: Prisma.RFIDMappingFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RFIDMappingPayload>[]
          }
          create: {
            args: Prisma.RFIDMappingCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RFIDMappingPayload>
          }
          createMany: {
            args: Prisma.RFIDMappingCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RFIDMappingCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RFIDMappingPayload>[]
          }
          delete: {
            args: Prisma.RFIDMappingDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RFIDMappingPayload>
          }
          update: {
            args: Prisma.RFIDMappingUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RFIDMappingPayload>
          }
          deleteMany: {
            args: Prisma.RFIDMappingDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RFIDMappingUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.RFIDMappingUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RFIDMappingPayload>[]
          }
          upsert: {
            args: Prisma.RFIDMappingUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RFIDMappingPayload>
          }
          aggregate: {
            args: Prisma.RFIDMappingAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRFIDMapping>
          }
          groupBy: {
            args: Prisma.RFIDMappingGroupByArgs<ExtArgs>
            result: $Utils.Optional<RFIDMappingGroupByOutputType>[]
          }
          count: {
            args: Prisma.RFIDMappingCountArgs<ExtArgs>
            result: $Utils.Optional<RFIDMappingCountAggregateOutputType> | number
          }
        }
      }
      TrackingLog: {
        payload: Prisma.$TrackingLogPayload<ExtArgs>
        fields: Prisma.TrackingLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TrackingLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrackingLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TrackingLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrackingLogPayload>
          }
          findFirst: {
            args: Prisma.TrackingLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrackingLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TrackingLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrackingLogPayload>
          }
          findMany: {
            args: Prisma.TrackingLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrackingLogPayload>[]
          }
          create: {
            args: Prisma.TrackingLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrackingLogPayload>
          }
          createMany: {
            args: Prisma.TrackingLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TrackingLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrackingLogPayload>[]
          }
          delete: {
            args: Prisma.TrackingLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrackingLogPayload>
          }
          update: {
            args: Prisma.TrackingLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrackingLogPayload>
          }
          deleteMany: {
            args: Prisma.TrackingLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TrackingLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TrackingLogUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrackingLogPayload>[]
          }
          upsert: {
            args: Prisma.TrackingLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrackingLogPayload>
          }
          aggregate: {
            args: Prisma.TrackingLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTrackingLog>
          }
          groupBy: {
            args: Prisma.TrackingLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<TrackingLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.TrackingLogCountArgs<ExtArgs>
            result: $Utils.Optional<TrackingLogCountAggregateOutputType> | number
          }
        }
      }
      master_citizen_data: {
        payload: Prisma.$master_citizen_dataPayload<ExtArgs>
        fields: Prisma.master_citizen_dataFieldRefs
        operations: {
          findUnique: {
            args: Prisma.master_citizen_dataFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$master_citizen_dataPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.master_citizen_dataFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$master_citizen_dataPayload>
          }
          findFirst: {
            args: Prisma.master_citizen_dataFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$master_citizen_dataPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.master_citizen_dataFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$master_citizen_dataPayload>
          }
          findMany: {
            args: Prisma.master_citizen_dataFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$master_citizen_dataPayload>[]
          }
          create: {
            args: Prisma.master_citizen_dataCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$master_citizen_dataPayload>
          }
          createMany: {
            args: Prisma.master_citizen_dataCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.master_citizen_dataCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$master_citizen_dataPayload>[]
          }
          delete: {
            args: Prisma.master_citizen_dataDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$master_citizen_dataPayload>
          }
          update: {
            args: Prisma.master_citizen_dataUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$master_citizen_dataPayload>
          }
          deleteMany: {
            args: Prisma.master_citizen_dataDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.master_citizen_dataUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.master_citizen_dataUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$master_citizen_dataPayload>[]
          }
          upsert: {
            args: Prisma.master_citizen_dataUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$master_citizen_dataPayload>
          }
          aggregate: {
            args: Prisma.Master_citizen_dataAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMaster_citizen_data>
          }
          groupBy: {
            args: Prisma.master_citizen_dataGroupByArgs<ExtArgs>
            result: $Utils.Optional<Master_citizen_dataGroupByOutputType>[]
          }
          count: {
            args: Prisma.master_citizen_dataCountArgs<ExtArgs>
            result: $Utils.Optional<Master_citizen_dataCountAggregateOutputType> | number
          }
        }
      }
      survey_attribute_specific: {
        payload: Prisma.$survey_attribute_specificPayload<ExtArgs>
        fields: Prisma.survey_attribute_specificFieldRefs
        operations: {
          findUnique: {
            args: Prisma.survey_attribute_specificFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$survey_attribute_specificPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.survey_attribute_specificFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$survey_attribute_specificPayload>
          }
          findFirst: {
            args: Prisma.survey_attribute_specificFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$survey_attribute_specificPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.survey_attribute_specificFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$survey_attribute_specificPayload>
          }
          findMany: {
            args: Prisma.survey_attribute_specificFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$survey_attribute_specificPayload>[]
          }
          create: {
            args: Prisma.survey_attribute_specificCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$survey_attribute_specificPayload>
          }
          createMany: {
            args: Prisma.survey_attribute_specificCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.survey_attribute_specificCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$survey_attribute_specificPayload>[]
          }
          delete: {
            args: Prisma.survey_attribute_specificDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$survey_attribute_specificPayload>
          }
          update: {
            args: Prisma.survey_attribute_specificUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$survey_attribute_specificPayload>
          }
          deleteMany: {
            args: Prisma.survey_attribute_specificDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.survey_attribute_specificUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.survey_attribute_specificUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$survey_attribute_specificPayload>[]
          }
          upsert: {
            args: Prisma.survey_attribute_specificUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$survey_attribute_specificPayload>
          }
          aggregate: {
            args: Prisma.Survey_attribute_specificAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSurvey_attribute_specific>
          }
          groupBy: {
            args: Prisma.survey_attribute_specificGroupByArgs<ExtArgs>
            result: $Utils.Optional<Survey_attribute_specificGroupByOutputType>[]
          }
          count: {
            args: Prisma.survey_attribute_specificCountArgs<ExtArgs>
            result: $Utils.Optional<Survey_attribute_specificCountAggregateOutputType> | number
          }
        }
      }
      users: {
        payload: Prisma.$usersPayload<ExtArgs>
        fields: Prisma.usersFieldRefs
        operations: {
          findUnique: {
            args: Prisma.usersFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.usersFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload>
          }
          findFirst: {
            args: Prisma.usersFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.usersFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload>
          }
          findMany: {
            args: Prisma.usersFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload>[]
          }
          create: {
            args: Prisma.usersCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload>
          }
          createMany: {
            args: Prisma.usersCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.usersCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload>[]
          }
          delete: {
            args: Prisma.usersDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload>
          }
          update: {
            args: Prisma.usersUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload>
          }
          deleteMany: {
            args: Prisma.usersDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.usersUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.usersUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload>[]
          }
          upsert: {
            args: Prisma.usersUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload>
          }
          aggregate: {
            args: Prisma.UsersAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUsers>
          }
          groupBy: {
            args: Prisma.usersGroupByArgs<ExtArgs>
            result: $Utils.Optional<UsersGroupByOutputType>[]
          }
          count: {
            args: Prisma.usersCountArgs<ExtArgs>
            result: $Utils.Optional<UsersCountAggregateOutputType> | number
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
    moderator?: ModeratorOmit
    rFIDMapping?: RFIDMappingOmit
    trackingLog?: TrackingLogOmit
    master_citizen_data?: master_citizen_dataOmit
    survey_attribute_specific?: survey_attribute_specificOmit
    users?: usersOmit
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
   * Model Moderator
   */

  export type AggregateModerator = {
    _count: ModeratorCountAggregateOutputType | null
    _avg: ModeratorAvgAggregateOutputType | null
    _sum: ModeratorSumAggregateOutputType | null
    _min: ModeratorMinAggregateOutputType | null
    _max: ModeratorMaxAggregateOutputType | null
  }

  export type ModeratorAvgAggregateOutputType = {
    id: number | null
  }

  export type ModeratorSumAggregateOutputType = {
    id: number | null
  }

  export type ModeratorMinAggregateOutputType = {
    id: number | null
    username: string | null
    password: string | null
    role: string | null
    createdAt: Date | null
  }

  export type ModeratorMaxAggregateOutputType = {
    id: number | null
    username: string | null
    password: string | null
    role: string | null
    createdAt: Date | null
  }

  export type ModeratorCountAggregateOutputType = {
    id: number
    username: number
    password: number
    role: number
    createdAt: number
    _all: number
  }


  export type ModeratorAvgAggregateInputType = {
    id?: true
  }

  export type ModeratorSumAggregateInputType = {
    id?: true
  }

  export type ModeratorMinAggregateInputType = {
    id?: true
    username?: true
    password?: true
    role?: true
    createdAt?: true
  }

  export type ModeratorMaxAggregateInputType = {
    id?: true
    username?: true
    password?: true
    role?: true
    createdAt?: true
  }

  export type ModeratorCountAggregateInputType = {
    id?: true
    username?: true
    password?: true
    role?: true
    createdAt?: true
    _all?: true
  }

  export type ModeratorAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Moderator to aggregate.
     */
    where?: ModeratorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Moderators to fetch.
     */
    orderBy?: ModeratorOrderByWithRelationInput | ModeratorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ModeratorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Moderators from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Moderators.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Moderators
    **/
    _count?: true | ModeratorCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ModeratorAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ModeratorSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ModeratorMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ModeratorMaxAggregateInputType
  }

  export type GetModeratorAggregateType<T extends ModeratorAggregateArgs> = {
        [P in keyof T & keyof AggregateModerator]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateModerator[P]>
      : GetScalarType<T[P], AggregateModerator[P]>
  }




  export type ModeratorGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ModeratorWhereInput
    orderBy?: ModeratorOrderByWithAggregationInput | ModeratorOrderByWithAggregationInput[]
    by: ModeratorScalarFieldEnum[] | ModeratorScalarFieldEnum
    having?: ModeratorScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ModeratorCountAggregateInputType | true
    _avg?: ModeratorAvgAggregateInputType
    _sum?: ModeratorSumAggregateInputType
    _min?: ModeratorMinAggregateInputType
    _max?: ModeratorMaxAggregateInputType
  }

  export type ModeratorGroupByOutputType = {
    id: number
    username: string
    password: string
    role: string
    createdAt: Date
    _count: ModeratorCountAggregateOutputType | null
    _avg: ModeratorAvgAggregateOutputType | null
    _sum: ModeratorSumAggregateOutputType | null
    _min: ModeratorMinAggregateOutputType | null
    _max: ModeratorMaxAggregateOutputType | null
  }

  type GetModeratorGroupByPayload<T extends ModeratorGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ModeratorGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ModeratorGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ModeratorGroupByOutputType[P]>
            : GetScalarType<T[P], ModeratorGroupByOutputType[P]>
        }
      >
    >


  export type ModeratorSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    username?: boolean
    password?: boolean
    role?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["moderator"]>

  export type ModeratorSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    username?: boolean
    password?: boolean
    role?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["moderator"]>

  export type ModeratorSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    username?: boolean
    password?: boolean
    role?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["moderator"]>

  export type ModeratorSelectScalar = {
    id?: boolean
    username?: boolean
    password?: boolean
    role?: boolean
    createdAt?: boolean
  }

  export type ModeratorOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "username" | "password" | "role" | "createdAt", ExtArgs["result"]["moderator"]>

  export type $ModeratorPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Moderator"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      username: string
      password: string
      role: string
      createdAt: Date
    }, ExtArgs["result"]["moderator"]>
    composites: {}
  }

  type ModeratorGetPayload<S extends boolean | null | undefined | ModeratorDefaultArgs> = $Result.GetResult<Prisma.$ModeratorPayload, S>

  type ModeratorCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ModeratorFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ModeratorCountAggregateInputType | true
    }

  export interface ModeratorDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Moderator'], meta: { name: 'Moderator' } }
    /**
     * Find zero or one Moderator that matches the filter.
     * @param {ModeratorFindUniqueArgs} args - Arguments to find a Moderator
     * @example
     * // Get one Moderator
     * const moderator = await prisma.moderator.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ModeratorFindUniqueArgs>(args: SelectSubset<T, ModeratorFindUniqueArgs<ExtArgs>>): Prisma__ModeratorClient<$Result.GetResult<Prisma.$ModeratorPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Moderator that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ModeratorFindUniqueOrThrowArgs} args - Arguments to find a Moderator
     * @example
     * // Get one Moderator
     * const moderator = await prisma.moderator.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ModeratorFindUniqueOrThrowArgs>(args: SelectSubset<T, ModeratorFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ModeratorClient<$Result.GetResult<Prisma.$ModeratorPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Moderator that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ModeratorFindFirstArgs} args - Arguments to find a Moderator
     * @example
     * // Get one Moderator
     * const moderator = await prisma.moderator.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ModeratorFindFirstArgs>(args?: SelectSubset<T, ModeratorFindFirstArgs<ExtArgs>>): Prisma__ModeratorClient<$Result.GetResult<Prisma.$ModeratorPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Moderator that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ModeratorFindFirstOrThrowArgs} args - Arguments to find a Moderator
     * @example
     * // Get one Moderator
     * const moderator = await prisma.moderator.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ModeratorFindFirstOrThrowArgs>(args?: SelectSubset<T, ModeratorFindFirstOrThrowArgs<ExtArgs>>): Prisma__ModeratorClient<$Result.GetResult<Prisma.$ModeratorPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Moderators that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ModeratorFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Moderators
     * const moderators = await prisma.moderator.findMany()
     * 
     * // Get first 10 Moderators
     * const moderators = await prisma.moderator.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const moderatorWithIdOnly = await prisma.moderator.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ModeratorFindManyArgs>(args?: SelectSubset<T, ModeratorFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ModeratorPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Moderator.
     * @param {ModeratorCreateArgs} args - Arguments to create a Moderator.
     * @example
     * // Create one Moderator
     * const Moderator = await prisma.moderator.create({
     *   data: {
     *     // ... data to create a Moderator
     *   }
     * })
     * 
     */
    create<T extends ModeratorCreateArgs>(args: SelectSubset<T, ModeratorCreateArgs<ExtArgs>>): Prisma__ModeratorClient<$Result.GetResult<Prisma.$ModeratorPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Moderators.
     * @param {ModeratorCreateManyArgs} args - Arguments to create many Moderators.
     * @example
     * // Create many Moderators
     * const moderator = await prisma.moderator.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ModeratorCreateManyArgs>(args?: SelectSubset<T, ModeratorCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Moderators and returns the data saved in the database.
     * @param {ModeratorCreateManyAndReturnArgs} args - Arguments to create many Moderators.
     * @example
     * // Create many Moderators
     * const moderator = await prisma.moderator.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Moderators and only return the `id`
     * const moderatorWithIdOnly = await prisma.moderator.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ModeratorCreateManyAndReturnArgs>(args?: SelectSubset<T, ModeratorCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ModeratorPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Moderator.
     * @param {ModeratorDeleteArgs} args - Arguments to delete one Moderator.
     * @example
     * // Delete one Moderator
     * const Moderator = await prisma.moderator.delete({
     *   where: {
     *     // ... filter to delete one Moderator
     *   }
     * })
     * 
     */
    delete<T extends ModeratorDeleteArgs>(args: SelectSubset<T, ModeratorDeleteArgs<ExtArgs>>): Prisma__ModeratorClient<$Result.GetResult<Prisma.$ModeratorPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Moderator.
     * @param {ModeratorUpdateArgs} args - Arguments to update one Moderator.
     * @example
     * // Update one Moderator
     * const moderator = await prisma.moderator.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ModeratorUpdateArgs>(args: SelectSubset<T, ModeratorUpdateArgs<ExtArgs>>): Prisma__ModeratorClient<$Result.GetResult<Prisma.$ModeratorPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Moderators.
     * @param {ModeratorDeleteManyArgs} args - Arguments to filter Moderators to delete.
     * @example
     * // Delete a few Moderators
     * const { count } = await prisma.moderator.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ModeratorDeleteManyArgs>(args?: SelectSubset<T, ModeratorDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Moderators.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ModeratorUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Moderators
     * const moderator = await prisma.moderator.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ModeratorUpdateManyArgs>(args: SelectSubset<T, ModeratorUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Moderators and returns the data updated in the database.
     * @param {ModeratorUpdateManyAndReturnArgs} args - Arguments to update many Moderators.
     * @example
     * // Update many Moderators
     * const moderator = await prisma.moderator.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Moderators and only return the `id`
     * const moderatorWithIdOnly = await prisma.moderator.updateManyAndReturn({
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
    updateManyAndReturn<T extends ModeratorUpdateManyAndReturnArgs>(args: SelectSubset<T, ModeratorUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ModeratorPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Moderator.
     * @param {ModeratorUpsertArgs} args - Arguments to update or create a Moderator.
     * @example
     * // Update or create a Moderator
     * const moderator = await prisma.moderator.upsert({
     *   create: {
     *     // ... data to create a Moderator
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Moderator we want to update
     *   }
     * })
     */
    upsert<T extends ModeratorUpsertArgs>(args: SelectSubset<T, ModeratorUpsertArgs<ExtArgs>>): Prisma__ModeratorClient<$Result.GetResult<Prisma.$ModeratorPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Moderators.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ModeratorCountArgs} args - Arguments to filter Moderators to count.
     * @example
     * // Count the number of Moderators
     * const count = await prisma.moderator.count({
     *   where: {
     *     // ... the filter for the Moderators we want to count
     *   }
     * })
    **/
    count<T extends ModeratorCountArgs>(
      args?: Subset<T, ModeratorCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ModeratorCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Moderator.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ModeratorAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ModeratorAggregateArgs>(args: Subset<T, ModeratorAggregateArgs>): Prisma.PrismaPromise<GetModeratorAggregateType<T>>

    /**
     * Group by Moderator.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ModeratorGroupByArgs} args - Group by arguments.
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
      T extends ModeratorGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ModeratorGroupByArgs['orderBy'] }
        : { orderBy?: ModeratorGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ModeratorGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetModeratorGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Moderator model
   */
  readonly fields: ModeratorFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Moderator.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ModeratorClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the Moderator model
   */
  interface ModeratorFieldRefs {
    readonly id: FieldRef<"Moderator", 'Int'>
    readonly username: FieldRef<"Moderator", 'String'>
    readonly password: FieldRef<"Moderator", 'String'>
    readonly role: FieldRef<"Moderator", 'String'>
    readonly createdAt: FieldRef<"Moderator", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Moderator findUnique
   */
  export type ModeratorFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Moderator
     */
    select?: ModeratorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Moderator
     */
    omit?: ModeratorOmit<ExtArgs> | null
    /**
     * Filter, which Moderator to fetch.
     */
    where: ModeratorWhereUniqueInput
  }

  /**
   * Moderator findUniqueOrThrow
   */
  export type ModeratorFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Moderator
     */
    select?: ModeratorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Moderator
     */
    omit?: ModeratorOmit<ExtArgs> | null
    /**
     * Filter, which Moderator to fetch.
     */
    where: ModeratorWhereUniqueInput
  }

  /**
   * Moderator findFirst
   */
  export type ModeratorFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Moderator
     */
    select?: ModeratorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Moderator
     */
    omit?: ModeratorOmit<ExtArgs> | null
    /**
     * Filter, which Moderator to fetch.
     */
    where?: ModeratorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Moderators to fetch.
     */
    orderBy?: ModeratorOrderByWithRelationInput | ModeratorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Moderators.
     */
    cursor?: ModeratorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Moderators from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Moderators.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Moderators.
     */
    distinct?: ModeratorScalarFieldEnum | ModeratorScalarFieldEnum[]
  }

  /**
   * Moderator findFirstOrThrow
   */
  export type ModeratorFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Moderator
     */
    select?: ModeratorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Moderator
     */
    omit?: ModeratorOmit<ExtArgs> | null
    /**
     * Filter, which Moderator to fetch.
     */
    where?: ModeratorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Moderators to fetch.
     */
    orderBy?: ModeratorOrderByWithRelationInput | ModeratorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Moderators.
     */
    cursor?: ModeratorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Moderators from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Moderators.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Moderators.
     */
    distinct?: ModeratorScalarFieldEnum | ModeratorScalarFieldEnum[]
  }

  /**
   * Moderator findMany
   */
  export type ModeratorFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Moderator
     */
    select?: ModeratorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Moderator
     */
    omit?: ModeratorOmit<ExtArgs> | null
    /**
     * Filter, which Moderators to fetch.
     */
    where?: ModeratorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Moderators to fetch.
     */
    orderBy?: ModeratorOrderByWithRelationInput | ModeratorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Moderators.
     */
    cursor?: ModeratorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Moderators from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Moderators.
     */
    skip?: number
    distinct?: ModeratorScalarFieldEnum | ModeratorScalarFieldEnum[]
  }

  /**
   * Moderator create
   */
  export type ModeratorCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Moderator
     */
    select?: ModeratorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Moderator
     */
    omit?: ModeratorOmit<ExtArgs> | null
    /**
     * The data needed to create a Moderator.
     */
    data: XOR<ModeratorCreateInput, ModeratorUncheckedCreateInput>
  }

  /**
   * Moderator createMany
   */
  export type ModeratorCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Moderators.
     */
    data: ModeratorCreateManyInput | ModeratorCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Moderator createManyAndReturn
   */
  export type ModeratorCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Moderator
     */
    select?: ModeratorSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Moderator
     */
    omit?: ModeratorOmit<ExtArgs> | null
    /**
     * The data used to create many Moderators.
     */
    data: ModeratorCreateManyInput | ModeratorCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Moderator update
   */
  export type ModeratorUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Moderator
     */
    select?: ModeratorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Moderator
     */
    omit?: ModeratorOmit<ExtArgs> | null
    /**
     * The data needed to update a Moderator.
     */
    data: XOR<ModeratorUpdateInput, ModeratorUncheckedUpdateInput>
    /**
     * Choose, which Moderator to update.
     */
    where: ModeratorWhereUniqueInput
  }

  /**
   * Moderator updateMany
   */
  export type ModeratorUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Moderators.
     */
    data: XOR<ModeratorUpdateManyMutationInput, ModeratorUncheckedUpdateManyInput>
    /**
     * Filter which Moderators to update
     */
    where?: ModeratorWhereInput
    /**
     * Limit how many Moderators to update.
     */
    limit?: number
  }

  /**
   * Moderator updateManyAndReturn
   */
  export type ModeratorUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Moderator
     */
    select?: ModeratorSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Moderator
     */
    omit?: ModeratorOmit<ExtArgs> | null
    /**
     * The data used to update Moderators.
     */
    data: XOR<ModeratorUpdateManyMutationInput, ModeratorUncheckedUpdateManyInput>
    /**
     * Filter which Moderators to update
     */
    where?: ModeratorWhereInput
    /**
     * Limit how many Moderators to update.
     */
    limit?: number
  }

  /**
   * Moderator upsert
   */
  export type ModeratorUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Moderator
     */
    select?: ModeratorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Moderator
     */
    omit?: ModeratorOmit<ExtArgs> | null
    /**
     * The filter to search for the Moderator to update in case it exists.
     */
    where: ModeratorWhereUniqueInput
    /**
     * In case the Moderator found by the `where` argument doesn't exist, create a new Moderator with this data.
     */
    create: XOR<ModeratorCreateInput, ModeratorUncheckedCreateInput>
    /**
     * In case the Moderator was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ModeratorUpdateInput, ModeratorUncheckedUpdateInput>
  }

  /**
   * Moderator delete
   */
  export type ModeratorDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Moderator
     */
    select?: ModeratorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Moderator
     */
    omit?: ModeratorOmit<ExtArgs> | null
    /**
     * Filter which Moderator to delete.
     */
    where: ModeratorWhereUniqueInput
  }

  /**
   * Moderator deleteMany
   */
  export type ModeratorDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Moderators to delete
     */
    where?: ModeratorWhereInput
    /**
     * Limit how many Moderators to delete.
     */
    limit?: number
  }

  /**
   * Moderator without action
   */
  export type ModeratorDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Moderator
     */
    select?: ModeratorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Moderator
     */
    omit?: ModeratorOmit<ExtArgs> | null
  }


  /**
   * Model RFIDMapping
   */

  export type AggregateRFIDMapping = {
    _count: RFIDMappingCountAggregateOutputType | null
    _avg: RFIDMappingAvgAggregateOutputType | null
    _sum: RFIDMappingSumAggregateOutputType | null
    _min: RFIDMappingMinAggregateOutputType | null
    _max: RFIDMappingMaxAggregateOutputType | null
  }

  export type RFIDMappingAvgAggregateOutputType = {
    id: number | null
  }

  export type RFIDMappingSumAggregateOutputType = {
    id: number | null
  }

  export type RFIDMappingMinAggregateOutputType = {
    id: number | null
    slno: string | null
    phoneNumber: string | null
    rfid: string | null
    wasteType: $Enums.WasteType | null
    createdAt: Date | null
  }

  export type RFIDMappingMaxAggregateOutputType = {
    id: number | null
    slno: string | null
    phoneNumber: string | null
    rfid: string | null
    wasteType: $Enums.WasteType | null
    createdAt: Date | null
  }

  export type RFIDMappingCountAggregateOutputType = {
    id: number
    slno: number
    phoneNumber: number
    rfid: number
    wasteType: number
    createdAt: number
    _all: number
  }


  export type RFIDMappingAvgAggregateInputType = {
    id?: true
  }

  export type RFIDMappingSumAggregateInputType = {
    id?: true
  }

  export type RFIDMappingMinAggregateInputType = {
    id?: true
    slno?: true
    phoneNumber?: true
    rfid?: true
    wasteType?: true
    createdAt?: true
  }

  export type RFIDMappingMaxAggregateInputType = {
    id?: true
    slno?: true
    phoneNumber?: true
    rfid?: true
    wasteType?: true
    createdAt?: true
  }

  export type RFIDMappingCountAggregateInputType = {
    id?: true
    slno?: true
    phoneNumber?: true
    rfid?: true
    wasteType?: true
    createdAt?: true
    _all?: true
  }

  export type RFIDMappingAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RFIDMapping to aggregate.
     */
    where?: RFIDMappingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RFIDMappings to fetch.
     */
    orderBy?: RFIDMappingOrderByWithRelationInput | RFIDMappingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RFIDMappingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RFIDMappings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RFIDMappings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned RFIDMappings
    **/
    _count?: true | RFIDMappingCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RFIDMappingAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RFIDMappingSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RFIDMappingMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RFIDMappingMaxAggregateInputType
  }

  export type GetRFIDMappingAggregateType<T extends RFIDMappingAggregateArgs> = {
        [P in keyof T & keyof AggregateRFIDMapping]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRFIDMapping[P]>
      : GetScalarType<T[P], AggregateRFIDMapping[P]>
  }




  export type RFIDMappingGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RFIDMappingWhereInput
    orderBy?: RFIDMappingOrderByWithAggregationInput | RFIDMappingOrderByWithAggregationInput[]
    by: RFIDMappingScalarFieldEnum[] | RFIDMappingScalarFieldEnum
    having?: RFIDMappingScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RFIDMappingCountAggregateInputType | true
    _avg?: RFIDMappingAvgAggregateInputType
    _sum?: RFIDMappingSumAggregateInputType
    _min?: RFIDMappingMinAggregateInputType
    _max?: RFIDMappingMaxAggregateInputType
  }

  export type RFIDMappingGroupByOutputType = {
    id: number
    slno: string
    phoneNumber: string | null
    rfid: string
    wasteType: $Enums.WasteType | null
    createdAt: Date
    _count: RFIDMappingCountAggregateOutputType | null
    _avg: RFIDMappingAvgAggregateOutputType | null
    _sum: RFIDMappingSumAggregateOutputType | null
    _min: RFIDMappingMinAggregateOutputType | null
    _max: RFIDMappingMaxAggregateOutputType | null
  }

  type GetRFIDMappingGroupByPayload<T extends RFIDMappingGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RFIDMappingGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RFIDMappingGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RFIDMappingGroupByOutputType[P]>
            : GetScalarType<T[P], RFIDMappingGroupByOutputType[P]>
        }
      >
    >


  export type RFIDMappingSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    slno?: boolean
    phoneNumber?: boolean
    rfid?: boolean
    wasteType?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["rFIDMapping"]>

  export type RFIDMappingSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    slno?: boolean
    phoneNumber?: boolean
    rfid?: boolean
    wasteType?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["rFIDMapping"]>

  export type RFIDMappingSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    slno?: boolean
    phoneNumber?: boolean
    rfid?: boolean
    wasteType?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["rFIDMapping"]>

  export type RFIDMappingSelectScalar = {
    id?: boolean
    slno?: boolean
    phoneNumber?: boolean
    rfid?: boolean
    wasteType?: boolean
    createdAt?: boolean
  }

  export type RFIDMappingOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "slno" | "phoneNumber" | "rfid" | "wasteType" | "createdAt", ExtArgs["result"]["rFIDMapping"]>

  export type $RFIDMappingPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "RFIDMapping"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      slno: string
      phoneNumber: string | null
      rfid: string
      wasteType: $Enums.WasteType | null
      createdAt: Date
    }, ExtArgs["result"]["rFIDMapping"]>
    composites: {}
  }

  type RFIDMappingGetPayload<S extends boolean | null | undefined | RFIDMappingDefaultArgs> = $Result.GetResult<Prisma.$RFIDMappingPayload, S>

  type RFIDMappingCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RFIDMappingFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RFIDMappingCountAggregateInputType | true
    }

  export interface RFIDMappingDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['RFIDMapping'], meta: { name: 'RFIDMapping' } }
    /**
     * Find zero or one RFIDMapping that matches the filter.
     * @param {RFIDMappingFindUniqueArgs} args - Arguments to find a RFIDMapping
     * @example
     * // Get one RFIDMapping
     * const rFIDMapping = await prisma.rFIDMapping.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RFIDMappingFindUniqueArgs>(args: SelectSubset<T, RFIDMappingFindUniqueArgs<ExtArgs>>): Prisma__RFIDMappingClient<$Result.GetResult<Prisma.$RFIDMappingPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one RFIDMapping that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RFIDMappingFindUniqueOrThrowArgs} args - Arguments to find a RFIDMapping
     * @example
     * // Get one RFIDMapping
     * const rFIDMapping = await prisma.rFIDMapping.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RFIDMappingFindUniqueOrThrowArgs>(args: SelectSubset<T, RFIDMappingFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RFIDMappingClient<$Result.GetResult<Prisma.$RFIDMappingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RFIDMapping that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RFIDMappingFindFirstArgs} args - Arguments to find a RFIDMapping
     * @example
     * // Get one RFIDMapping
     * const rFIDMapping = await prisma.rFIDMapping.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RFIDMappingFindFirstArgs>(args?: SelectSubset<T, RFIDMappingFindFirstArgs<ExtArgs>>): Prisma__RFIDMappingClient<$Result.GetResult<Prisma.$RFIDMappingPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RFIDMapping that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RFIDMappingFindFirstOrThrowArgs} args - Arguments to find a RFIDMapping
     * @example
     * // Get one RFIDMapping
     * const rFIDMapping = await prisma.rFIDMapping.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RFIDMappingFindFirstOrThrowArgs>(args?: SelectSubset<T, RFIDMappingFindFirstOrThrowArgs<ExtArgs>>): Prisma__RFIDMappingClient<$Result.GetResult<Prisma.$RFIDMappingPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more RFIDMappings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RFIDMappingFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RFIDMappings
     * const rFIDMappings = await prisma.rFIDMapping.findMany()
     * 
     * // Get first 10 RFIDMappings
     * const rFIDMappings = await prisma.rFIDMapping.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const rFIDMappingWithIdOnly = await prisma.rFIDMapping.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RFIDMappingFindManyArgs>(args?: SelectSubset<T, RFIDMappingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RFIDMappingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a RFIDMapping.
     * @param {RFIDMappingCreateArgs} args - Arguments to create a RFIDMapping.
     * @example
     * // Create one RFIDMapping
     * const RFIDMapping = await prisma.rFIDMapping.create({
     *   data: {
     *     // ... data to create a RFIDMapping
     *   }
     * })
     * 
     */
    create<T extends RFIDMappingCreateArgs>(args: SelectSubset<T, RFIDMappingCreateArgs<ExtArgs>>): Prisma__RFIDMappingClient<$Result.GetResult<Prisma.$RFIDMappingPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many RFIDMappings.
     * @param {RFIDMappingCreateManyArgs} args - Arguments to create many RFIDMappings.
     * @example
     * // Create many RFIDMappings
     * const rFIDMapping = await prisma.rFIDMapping.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RFIDMappingCreateManyArgs>(args?: SelectSubset<T, RFIDMappingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many RFIDMappings and returns the data saved in the database.
     * @param {RFIDMappingCreateManyAndReturnArgs} args - Arguments to create many RFIDMappings.
     * @example
     * // Create many RFIDMappings
     * const rFIDMapping = await prisma.rFIDMapping.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many RFIDMappings and only return the `id`
     * const rFIDMappingWithIdOnly = await prisma.rFIDMapping.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RFIDMappingCreateManyAndReturnArgs>(args?: SelectSubset<T, RFIDMappingCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RFIDMappingPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a RFIDMapping.
     * @param {RFIDMappingDeleteArgs} args - Arguments to delete one RFIDMapping.
     * @example
     * // Delete one RFIDMapping
     * const RFIDMapping = await prisma.rFIDMapping.delete({
     *   where: {
     *     // ... filter to delete one RFIDMapping
     *   }
     * })
     * 
     */
    delete<T extends RFIDMappingDeleteArgs>(args: SelectSubset<T, RFIDMappingDeleteArgs<ExtArgs>>): Prisma__RFIDMappingClient<$Result.GetResult<Prisma.$RFIDMappingPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one RFIDMapping.
     * @param {RFIDMappingUpdateArgs} args - Arguments to update one RFIDMapping.
     * @example
     * // Update one RFIDMapping
     * const rFIDMapping = await prisma.rFIDMapping.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RFIDMappingUpdateArgs>(args: SelectSubset<T, RFIDMappingUpdateArgs<ExtArgs>>): Prisma__RFIDMappingClient<$Result.GetResult<Prisma.$RFIDMappingPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more RFIDMappings.
     * @param {RFIDMappingDeleteManyArgs} args - Arguments to filter RFIDMappings to delete.
     * @example
     * // Delete a few RFIDMappings
     * const { count } = await prisma.rFIDMapping.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RFIDMappingDeleteManyArgs>(args?: SelectSubset<T, RFIDMappingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RFIDMappings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RFIDMappingUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RFIDMappings
     * const rFIDMapping = await prisma.rFIDMapping.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RFIDMappingUpdateManyArgs>(args: SelectSubset<T, RFIDMappingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RFIDMappings and returns the data updated in the database.
     * @param {RFIDMappingUpdateManyAndReturnArgs} args - Arguments to update many RFIDMappings.
     * @example
     * // Update many RFIDMappings
     * const rFIDMapping = await prisma.rFIDMapping.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more RFIDMappings and only return the `id`
     * const rFIDMappingWithIdOnly = await prisma.rFIDMapping.updateManyAndReturn({
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
    updateManyAndReturn<T extends RFIDMappingUpdateManyAndReturnArgs>(args: SelectSubset<T, RFIDMappingUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RFIDMappingPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one RFIDMapping.
     * @param {RFIDMappingUpsertArgs} args - Arguments to update or create a RFIDMapping.
     * @example
     * // Update or create a RFIDMapping
     * const rFIDMapping = await prisma.rFIDMapping.upsert({
     *   create: {
     *     // ... data to create a RFIDMapping
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RFIDMapping we want to update
     *   }
     * })
     */
    upsert<T extends RFIDMappingUpsertArgs>(args: SelectSubset<T, RFIDMappingUpsertArgs<ExtArgs>>): Prisma__RFIDMappingClient<$Result.GetResult<Prisma.$RFIDMappingPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of RFIDMappings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RFIDMappingCountArgs} args - Arguments to filter RFIDMappings to count.
     * @example
     * // Count the number of RFIDMappings
     * const count = await prisma.rFIDMapping.count({
     *   where: {
     *     // ... the filter for the RFIDMappings we want to count
     *   }
     * })
    **/
    count<T extends RFIDMappingCountArgs>(
      args?: Subset<T, RFIDMappingCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RFIDMappingCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a RFIDMapping.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RFIDMappingAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends RFIDMappingAggregateArgs>(args: Subset<T, RFIDMappingAggregateArgs>): Prisma.PrismaPromise<GetRFIDMappingAggregateType<T>>

    /**
     * Group by RFIDMapping.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RFIDMappingGroupByArgs} args - Group by arguments.
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
      T extends RFIDMappingGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RFIDMappingGroupByArgs['orderBy'] }
        : { orderBy?: RFIDMappingGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, RFIDMappingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRFIDMappingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the RFIDMapping model
   */
  readonly fields: RFIDMappingFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for RFIDMapping.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RFIDMappingClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the RFIDMapping model
   */
  interface RFIDMappingFieldRefs {
    readonly id: FieldRef<"RFIDMapping", 'Int'>
    readonly slno: FieldRef<"RFIDMapping", 'String'>
    readonly phoneNumber: FieldRef<"RFIDMapping", 'String'>
    readonly rfid: FieldRef<"RFIDMapping", 'String'>
    readonly wasteType: FieldRef<"RFIDMapping", 'WasteType'>
    readonly createdAt: FieldRef<"RFIDMapping", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * RFIDMapping findUnique
   */
  export type RFIDMappingFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RFIDMapping
     */
    select?: RFIDMappingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RFIDMapping
     */
    omit?: RFIDMappingOmit<ExtArgs> | null
    /**
     * Filter, which RFIDMapping to fetch.
     */
    where: RFIDMappingWhereUniqueInput
  }

  /**
   * RFIDMapping findUniqueOrThrow
   */
  export type RFIDMappingFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RFIDMapping
     */
    select?: RFIDMappingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RFIDMapping
     */
    omit?: RFIDMappingOmit<ExtArgs> | null
    /**
     * Filter, which RFIDMapping to fetch.
     */
    where: RFIDMappingWhereUniqueInput
  }

  /**
   * RFIDMapping findFirst
   */
  export type RFIDMappingFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RFIDMapping
     */
    select?: RFIDMappingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RFIDMapping
     */
    omit?: RFIDMappingOmit<ExtArgs> | null
    /**
     * Filter, which RFIDMapping to fetch.
     */
    where?: RFIDMappingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RFIDMappings to fetch.
     */
    orderBy?: RFIDMappingOrderByWithRelationInput | RFIDMappingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RFIDMappings.
     */
    cursor?: RFIDMappingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RFIDMappings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RFIDMappings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RFIDMappings.
     */
    distinct?: RFIDMappingScalarFieldEnum | RFIDMappingScalarFieldEnum[]
  }

  /**
   * RFIDMapping findFirstOrThrow
   */
  export type RFIDMappingFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RFIDMapping
     */
    select?: RFIDMappingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RFIDMapping
     */
    omit?: RFIDMappingOmit<ExtArgs> | null
    /**
     * Filter, which RFIDMapping to fetch.
     */
    where?: RFIDMappingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RFIDMappings to fetch.
     */
    orderBy?: RFIDMappingOrderByWithRelationInput | RFIDMappingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RFIDMappings.
     */
    cursor?: RFIDMappingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RFIDMappings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RFIDMappings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RFIDMappings.
     */
    distinct?: RFIDMappingScalarFieldEnum | RFIDMappingScalarFieldEnum[]
  }

  /**
   * RFIDMapping findMany
   */
  export type RFIDMappingFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RFIDMapping
     */
    select?: RFIDMappingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RFIDMapping
     */
    omit?: RFIDMappingOmit<ExtArgs> | null
    /**
     * Filter, which RFIDMappings to fetch.
     */
    where?: RFIDMappingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RFIDMappings to fetch.
     */
    orderBy?: RFIDMappingOrderByWithRelationInput | RFIDMappingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing RFIDMappings.
     */
    cursor?: RFIDMappingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RFIDMappings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RFIDMappings.
     */
    skip?: number
    distinct?: RFIDMappingScalarFieldEnum | RFIDMappingScalarFieldEnum[]
  }

  /**
   * RFIDMapping create
   */
  export type RFIDMappingCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RFIDMapping
     */
    select?: RFIDMappingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RFIDMapping
     */
    omit?: RFIDMappingOmit<ExtArgs> | null
    /**
     * The data needed to create a RFIDMapping.
     */
    data: XOR<RFIDMappingCreateInput, RFIDMappingUncheckedCreateInput>
  }

  /**
   * RFIDMapping createMany
   */
  export type RFIDMappingCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many RFIDMappings.
     */
    data: RFIDMappingCreateManyInput | RFIDMappingCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * RFIDMapping createManyAndReturn
   */
  export type RFIDMappingCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RFIDMapping
     */
    select?: RFIDMappingSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RFIDMapping
     */
    omit?: RFIDMappingOmit<ExtArgs> | null
    /**
     * The data used to create many RFIDMappings.
     */
    data: RFIDMappingCreateManyInput | RFIDMappingCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * RFIDMapping update
   */
  export type RFIDMappingUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RFIDMapping
     */
    select?: RFIDMappingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RFIDMapping
     */
    omit?: RFIDMappingOmit<ExtArgs> | null
    /**
     * The data needed to update a RFIDMapping.
     */
    data: XOR<RFIDMappingUpdateInput, RFIDMappingUncheckedUpdateInput>
    /**
     * Choose, which RFIDMapping to update.
     */
    where: RFIDMappingWhereUniqueInput
  }

  /**
   * RFIDMapping updateMany
   */
  export type RFIDMappingUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update RFIDMappings.
     */
    data: XOR<RFIDMappingUpdateManyMutationInput, RFIDMappingUncheckedUpdateManyInput>
    /**
     * Filter which RFIDMappings to update
     */
    where?: RFIDMappingWhereInput
    /**
     * Limit how many RFIDMappings to update.
     */
    limit?: number
  }

  /**
   * RFIDMapping updateManyAndReturn
   */
  export type RFIDMappingUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RFIDMapping
     */
    select?: RFIDMappingSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RFIDMapping
     */
    omit?: RFIDMappingOmit<ExtArgs> | null
    /**
     * The data used to update RFIDMappings.
     */
    data: XOR<RFIDMappingUpdateManyMutationInput, RFIDMappingUncheckedUpdateManyInput>
    /**
     * Filter which RFIDMappings to update
     */
    where?: RFIDMappingWhereInput
    /**
     * Limit how many RFIDMappings to update.
     */
    limit?: number
  }

  /**
   * RFIDMapping upsert
   */
  export type RFIDMappingUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RFIDMapping
     */
    select?: RFIDMappingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RFIDMapping
     */
    omit?: RFIDMappingOmit<ExtArgs> | null
    /**
     * The filter to search for the RFIDMapping to update in case it exists.
     */
    where: RFIDMappingWhereUniqueInput
    /**
     * In case the RFIDMapping found by the `where` argument doesn't exist, create a new RFIDMapping with this data.
     */
    create: XOR<RFIDMappingCreateInput, RFIDMappingUncheckedCreateInput>
    /**
     * In case the RFIDMapping was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RFIDMappingUpdateInput, RFIDMappingUncheckedUpdateInput>
  }

  /**
   * RFIDMapping delete
   */
  export type RFIDMappingDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RFIDMapping
     */
    select?: RFIDMappingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RFIDMapping
     */
    omit?: RFIDMappingOmit<ExtArgs> | null
    /**
     * Filter which RFIDMapping to delete.
     */
    where: RFIDMappingWhereUniqueInput
  }

  /**
   * RFIDMapping deleteMany
   */
  export type RFIDMappingDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RFIDMappings to delete
     */
    where?: RFIDMappingWhereInput
    /**
     * Limit how many RFIDMappings to delete.
     */
    limit?: number
  }

  /**
   * RFIDMapping without action
   */
  export type RFIDMappingDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RFIDMapping
     */
    select?: RFIDMappingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RFIDMapping
     */
    omit?: RFIDMappingOmit<ExtArgs> | null
  }


  /**
   * Model TrackingLog
   */

  export type AggregateTrackingLog = {
    _count: TrackingLogCountAggregateOutputType | null
    _avg: TrackingLogAvgAggregateOutputType | null
    _sum: TrackingLogSumAggregateOutputType | null
    _min: TrackingLogMinAggregateOutputType | null
    _max: TrackingLogMaxAggregateOutputType | null
  }

  export type TrackingLogAvgAggregateOutputType = {
    id: number | null
    latitude: number | null
    longitude: number | null
  }

  export type TrackingLogSumAggregateOutputType = {
    id: number | null
    latitude: number | null
    longitude: number | null
  }

  export type TrackingLogMinAggregateOutputType = {
    id: number | null
    workerId: string | null
    slno: string | null
    citizenName: string | null
    phoneNumber: string | null
    remarks: string | null
    createdAt: Date | null
    address: string | null
    buildingNo: string | null
    drySlno: string | null
    floorNo: string | null
    latitude: number | null
    longitude: number | null
    photoUrl: string | null
    updatedAt: Date | null
    wetSlno: string | null
    status: $Enums.TrackingStatus | null
  }

  export type TrackingLogMaxAggregateOutputType = {
    id: number | null
    workerId: string | null
    slno: string | null
    citizenName: string | null
    phoneNumber: string | null
    remarks: string | null
    createdAt: Date | null
    address: string | null
    buildingNo: string | null
    drySlno: string | null
    floorNo: string | null
    latitude: number | null
    longitude: number | null
    photoUrl: string | null
    updatedAt: Date | null
    wetSlno: string | null
    status: $Enums.TrackingStatus | null
  }

  export type TrackingLogCountAggregateOutputType = {
    id: number
    workerId: number
    slno: number
    citizenName: number
    phoneNumber: number
    remarks: number
    createdAt: number
    address: number
    buildingNo: number
    drySlno: number
    floorNo: number
    latitude: number
    longitude: number
    photoUrl: number
    updatedAt: number
    wetSlno: number
    status: number
    _all: number
  }


  export type TrackingLogAvgAggregateInputType = {
    id?: true
    latitude?: true
    longitude?: true
  }

  export type TrackingLogSumAggregateInputType = {
    id?: true
    latitude?: true
    longitude?: true
  }

  export type TrackingLogMinAggregateInputType = {
    id?: true
    workerId?: true
    slno?: true
    citizenName?: true
    phoneNumber?: true
    remarks?: true
    createdAt?: true
    address?: true
    buildingNo?: true
    drySlno?: true
    floorNo?: true
    latitude?: true
    longitude?: true
    photoUrl?: true
    updatedAt?: true
    wetSlno?: true
    status?: true
  }

  export type TrackingLogMaxAggregateInputType = {
    id?: true
    workerId?: true
    slno?: true
    citizenName?: true
    phoneNumber?: true
    remarks?: true
    createdAt?: true
    address?: true
    buildingNo?: true
    drySlno?: true
    floorNo?: true
    latitude?: true
    longitude?: true
    photoUrl?: true
    updatedAt?: true
    wetSlno?: true
    status?: true
  }

  export type TrackingLogCountAggregateInputType = {
    id?: true
    workerId?: true
    slno?: true
    citizenName?: true
    phoneNumber?: true
    remarks?: true
    createdAt?: true
    address?: true
    buildingNo?: true
    drySlno?: true
    floorNo?: true
    latitude?: true
    longitude?: true
    photoUrl?: true
    updatedAt?: true
    wetSlno?: true
    status?: true
    _all?: true
  }

  export type TrackingLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TrackingLog to aggregate.
     */
    where?: TrackingLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TrackingLogs to fetch.
     */
    orderBy?: TrackingLogOrderByWithRelationInput | TrackingLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TrackingLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TrackingLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TrackingLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TrackingLogs
    **/
    _count?: true | TrackingLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TrackingLogAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TrackingLogSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TrackingLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TrackingLogMaxAggregateInputType
  }

  export type GetTrackingLogAggregateType<T extends TrackingLogAggregateArgs> = {
        [P in keyof T & keyof AggregateTrackingLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTrackingLog[P]>
      : GetScalarType<T[P], AggregateTrackingLog[P]>
  }




  export type TrackingLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TrackingLogWhereInput
    orderBy?: TrackingLogOrderByWithAggregationInput | TrackingLogOrderByWithAggregationInput[]
    by: TrackingLogScalarFieldEnum[] | TrackingLogScalarFieldEnum
    having?: TrackingLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TrackingLogCountAggregateInputType | true
    _avg?: TrackingLogAvgAggregateInputType
    _sum?: TrackingLogSumAggregateInputType
    _min?: TrackingLogMinAggregateInputType
    _max?: TrackingLogMaxAggregateInputType
  }

  export type TrackingLogGroupByOutputType = {
    id: number
    workerId: string
    slno: string | null
    citizenName: string | null
    phoneNumber: string | null
    remarks: string | null
    createdAt: Date
    address: string | null
    buildingNo: string | null
    drySlno: string | null
    floorNo: string | null
    latitude: number | null
    longitude: number | null
    photoUrl: string | null
    updatedAt: Date
    wetSlno: string | null
    status: $Enums.TrackingStatus
    _count: TrackingLogCountAggregateOutputType | null
    _avg: TrackingLogAvgAggregateOutputType | null
    _sum: TrackingLogSumAggregateOutputType | null
    _min: TrackingLogMinAggregateOutputType | null
    _max: TrackingLogMaxAggregateOutputType | null
  }

  type GetTrackingLogGroupByPayload<T extends TrackingLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TrackingLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TrackingLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TrackingLogGroupByOutputType[P]>
            : GetScalarType<T[P], TrackingLogGroupByOutputType[P]>
        }
      >
    >


  export type TrackingLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    workerId?: boolean
    slno?: boolean
    citizenName?: boolean
    phoneNumber?: boolean
    remarks?: boolean
    createdAt?: boolean
    address?: boolean
    buildingNo?: boolean
    drySlno?: boolean
    floorNo?: boolean
    latitude?: boolean
    longitude?: boolean
    photoUrl?: boolean
    updatedAt?: boolean
    wetSlno?: boolean
    status?: boolean
  }, ExtArgs["result"]["trackingLog"]>

  export type TrackingLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    workerId?: boolean
    slno?: boolean
    citizenName?: boolean
    phoneNumber?: boolean
    remarks?: boolean
    createdAt?: boolean
    address?: boolean
    buildingNo?: boolean
    drySlno?: boolean
    floorNo?: boolean
    latitude?: boolean
    longitude?: boolean
    photoUrl?: boolean
    updatedAt?: boolean
    wetSlno?: boolean
    status?: boolean
  }, ExtArgs["result"]["trackingLog"]>

  export type TrackingLogSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    workerId?: boolean
    slno?: boolean
    citizenName?: boolean
    phoneNumber?: boolean
    remarks?: boolean
    createdAt?: boolean
    address?: boolean
    buildingNo?: boolean
    drySlno?: boolean
    floorNo?: boolean
    latitude?: boolean
    longitude?: boolean
    photoUrl?: boolean
    updatedAt?: boolean
    wetSlno?: boolean
    status?: boolean
  }, ExtArgs["result"]["trackingLog"]>

  export type TrackingLogSelectScalar = {
    id?: boolean
    workerId?: boolean
    slno?: boolean
    citizenName?: boolean
    phoneNumber?: boolean
    remarks?: boolean
    createdAt?: boolean
    address?: boolean
    buildingNo?: boolean
    drySlno?: boolean
    floorNo?: boolean
    latitude?: boolean
    longitude?: boolean
    photoUrl?: boolean
    updatedAt?: boolean
    wetSlno?: boolean
    status?: boolean
  }

  export type TrackingLogOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "workerId" | "slno" | "citizenName" | "phoneNumber" | "remarks" | "createdAt" | "address" | "buildingNo" | "drySlno" | "floorNo" | "latitude" | "longitude" | "photoUrl" | "updatedAt" | "wetSlno" | "status", ExtArgs["result"]["trackingLog"]>

  export type $TrackingLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TrackingLog"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      workerId: string
      slno: string | null
      citizenName: string | null
      phoneNumber: string | null
      remarks: string | null
      createdAt: Date
      address: string | null
      buildingNo: string | null
      drySlno: string | null
      floorNo: string | null
      latitude: number | null
      longitude: number | null
      photoUrl: string | null
      updatedAt: Date
      wetSlno: string | null
      status: $Enums.TrackingStatus
    }, ExtArgs["result"]["trackingLog"]>
    composites: {}
  }

  type TrackingLogGetPayload<S extends boolean | null | undefined | TrackingLogDefaultArgs> = $Result.GetResult<Prisma.$TrackingLogPayload, S>

  type TrackingLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TrackingLogFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TrackingLogCountAggregateInputType | true
    }

  export interface TrackingLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TrackingLog'], meta: { name: 'TrackingLog' } }
    /**
     * Find zero or one TrackingLog that matches the filter.
     * @param {TrackingLogFindUniqueArgs} args - Arguments to find a TrackingLog
     * @example
     * // Get one TrackingLog
     * const trackingLog = await prisma.trackingLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TrackingLogFindUniqueArgs>(args: SelectSubset<T, TrackingLogFindUniqueArgs<ExtArgs>>): Prisma__TrackingLogClient<$Result.GetResult<Prisma.$TrackingLogPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one TrackingLog that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TrackingLogFindUniqueOrThrowArgs} args - Arguments to find a TrackingLog
     * @example
     * // Get one TrackingLog
     * const trackingLog = await prisma.trackingLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TrackingLogFindUniqueOrThrowArgs>(args: SelectSubset<T, TrackingLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TrackingLogClient<$Result.GetResult<Prisma.$TrackingLogPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TrackingLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrackingLogFindFirstArgs} args - Arguments to find a TrackingLog
     * @example
     * // Get one TrackingLog
     * const trackingLog = await prisma.trackingLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TrackingLogFindFirstArgs>(args?: SelectSubset<T, TrackingLogFindFirstArgs<ExtArgs>>): Prisma__TrackingLogClient<$Result.GetResult<Prisma.$TrackingLogPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TrackingLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrackingLogFindFirstOrThrowArgs} args - Arguments to find a TrackingLog
     * @example
     * // Get one TrackingLog
     * const trackingLog = await prisma.trackingLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TrackingLogFindFirstOrThrowArgs>(args?: SelectSubset<T, TrackingLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__TrackingLogClient<$Result.GetResult<Prisma.$TrackingLogPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more TrackingLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrackingLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TrackingLogs
     * const trackingLogs = await prisma.trackingLog.findMany()
     * 
     * // Get first 10 TrackingLogs
     * const trackingLogs = await prisma.trackingLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const trackingLogWithIdOnly = await prisma.trackingLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TrackingLogFindManyArgs>(args?: SelectSubset<T, TrackingLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TrackingLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a TrackingLog.
     * @param {TrackingLogCreateArgs} args - Arguments to create a TrackingLog.
     * @example
     * // Create one TrackingLog
     * const TrackingLog = await prisma.trackingLog.create({
     *   data: {
     *     // ... data to create a TrackingLog
     *   }
     * })
     * 
     */
    create<T extends TrackingLogCreateArgs>(args: SelectSubset<T, TrackingLogCreateArgs<ExtArgs>>): Prisma__TrackingLogClient<$Result.GetResult<Prisma.$TrackingLogPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many TrackingLogs.
     * @param {TrackingLogCreateManyArgs} args - Arguments to create many TrackingLogs.
     * @example
     * // Create many TrackingLogs
     * const trackingLog = await prisma.trackingLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TrackingLogCreateManyArgs>(args?: SelectSubset<T, TrackingLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TrackingLogs and returns the data saved in the database.
     * @param {TrackingLogCreateManyAndReturnArgs} args - Arguments to create many TrackingLogs.
     * @example
     * // Create many TrackingLogs
     * const trackingLog = await prisma.trackingLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TrackingLogs and only return the `id`
     * const trackingLogWithIdOnly = await prisma.trackingLog.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TrackingLogCreateManyAndReturnArgs>(args?: SelectSubset<T, TrackingLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TrackingLogPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a TrackingLog.
     * @param {TrackingLogDeleteArgs} args - Arguments to delete one TrackingLog.
     * @example
     * // Delete one TrackingLog
     * const TrackingLog = await prisma.trackingLog.delete({
     *   where: {
     *     // ... filter to delete one TrackingLog
     *   }
     * })
     * 
     */
    delete<T extends TrackingLogDeleteArgs>(args: SelectSubset<T, TrackingLogDeleteArgs<ExtArgs>>): Prisma__TrackingLogClient<$Result.GetResult<Prisma.$TrackingLogPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one TrackingLog.
     * @param {TrackingLogUpdateArgs} args - Arguments to update one TrackingLog.
     * @example
     * // Update one TrackingLog
     * const trackingLog = await prisma.trackingLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TrackingLogUpdateArgs>(args: SelectSubset<T, TrackingLogUpdateArgs<ExtArgs>>): Prisma__TrackingLogClient<$Result.GetResult<Prisma.$TrackingLogPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more TrackingLogs.
     * @param {TrackingLogDeleteManyArgs} args - Arguments to filter TrackingLogs to delete.
     * @example
     * // Delete a few TrackingLogs
     * const { count } = await prisma.trackingLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TrackingLogDeleteManyArgs>(args?: SelectSubset<T, TrackingLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TrackingLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrackingLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TrackingLogs
     * const trackingLog = await prisma.trackingLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TrackingLogUpdateManyArgs>(args: SelectSubset<T, TrackingLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TrackingLogs and returns the data updated in the database.
     * @param {TrackingLogUpdateManyAndReturnArgs} args - Arguments to update many TrackingLogs.
     * @example
     * // Update many TrackingLogs
     * const trackingLog = await prisma.trackingLog.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more TrackingLogs and only return the `id`
     * const trackingLogWithIdOnly = await prisma.trackingLog.updateManyAndReturn({
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
    updateManyAndReturn<T extends TrackingLogUpdateManyAndReturnArgs>(args: SelectSubset<T, TrackingLogUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TrackingLogPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one TrackingLog.
     * @param {TrackingLogUpsertArgs} args - Arguments to update or create a TrackingLog.
     * @example
     * // Update or create a TrackingLog
     * const trackingLog = await prisma.trackingLog.upsert({
     *   create: {
     *     // ... data to create a TrackingLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TrackingLog we want to update
     *   }
     * })
     */
    upsert<T extends TrackingLogUpsertArgs>(args: SelectSubset<T, TrackingLogUpsertArgs<ExtArgs>>): Prisma__TrackingLogClient<$Result.GetResult<Prisma.$TrackingLogPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of TrackingLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrackingLogCountArgs} args - Arguments to filter TrackingLogs to count.
     * @example
     * // Count the number of TrackingLogs
     * const count = await prisma.trackingLog.count({
     *   where: {
     *     // ... the filter for the TrackingLogs we want to count
     *   }
     * })
    **/
    count<T extends TrackingLogCountArgs>(
      args?: Subset<T, TrackingLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TrackingLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TrackingLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrackingLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends TrackingLogAggregateArgs>(args: Subset<T, TrackingLogAggregateArgs>): Prisma.PrismaPromise<GetTrackingLogAggregateType<T>>

    /**
     * Group by TrackingLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrackingLogGroupByArgs} args - Group by arguments.
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
      T extends TrackingLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TrackingLogGroupByArgs['orderBy'] }
        : { orderBy?: TrackingLogGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, TrackingLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTrackingLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TrackingLog model
   */
  readonly fields: TrackingLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TrackingLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TrackingLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the TrackingLog model
   */
  interface TrackingLogFieldRefs {
    readonly id: FieldRef<"TrackingLog", 'Int'>
    readonly workerId: FieldRef<"TrackingLog", 'String'>
    readonly slno: FieldRef<"TrackingLog", 'String'>
    readonly citizenName: FieldRef<"TrackingLog", 'String'>
    readonly phoneNumber: FieldRef<"TrackingLog", 'String'>
    readonly remarks: FieldRef<"TrackingLog", 'String'>
    readonly createdAt: FieldRef<"TrackingLog", 'DateTime'>
    readonly address: FieldRef<"TrackingLog", 'String'>
    readonly buildingNo: FieldRef<"TrackingLog", 'String'>
    readonly drySlno: FieldRef<"TrackingLog", 'String'>
    readonly floorNo: FieldRef<"TrackingLog", 'String'>
    readonly latitude: FieldRef<"TrackingLog", 'Float'>
    readonly longitude: FieldRef<"TrackingLog", 'Float'>
    readonly photoUrl: FieldRef<"TrackingLog", 'String'>
    readonly updatedAt: FieldRef<"TrackingLog", 'DateTime'>
    readonly wetSlno: FieldRef<"TrackingLog", 'String'>
    readonly status: FieldRef<"TrackingLog", 'TrackingStatus'>
  }
    

  // Custom InputTypes
  /**
   * TrackingLog findUnique
   */
  export type TrackingLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrackingLog
     */
    select?: TrackingLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TrackingLog
     */
    omit?: TrackingLogOmit<ExtArgs> | null
    /**
     * Filter, which TrackingLog to fetch.
     */
    where: TrackingLogWhereUniqueInput
  }

  /**
   * TrackingLog findUniqueOrThrow
   */
  export type TrackingLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrackingLog
     */
    select?: TrackingLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TrackingLog
     */
    omit?: TrackingLogOmit<ExtArgs> | null
    /**
     * Filter, which TrackingLog to fetch.
     */
    where: TrackingLogWhereUniqueInput
  }

  /**
   * TrackingLog findFirst
   */
  export type TrackingLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrackingLog
     */
    select?: TrackingLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TrackingLog
     */
    omit?: TrackingLogOmit<ExtArgs> | null
    /**
     * Filter, which TrackingLog to fetch.
     */
    where?: TrackingLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TrackingLogs to fetch.
     */
    orderBy?: TrackingLogOrderByWithRelationInput | TrackingLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TrackingLogs.
     */
    cursor?: TrackingLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TrackingLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TrackingLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TrackingLogs.
     */
    distinct?: TrackingLogScalarFieldEnum | TrackingLogScalarFieldEnum[]
  }

  /**
   * TrackingLog findFirstOrThrow
   */
  export type TrackingLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrackingLog
     */
    select?: TrackingLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TrackingLog
     */
    omit?: TrackingLogOmit<ExtArgs> | null
    /**
     * Filter, which TrackingLog to fetch.
     */
    where?: TrackingLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TrackingLogs to fetch.
     */
    orderBy?: TrackingLogOrderByWithRelationInput | TrackingLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TrackingLogs.
     */
    cursor?: TrackingLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TrackingLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TrackingLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TrackingLogs.
     */
    distinct?: TrackingLogScalarFieldEnum | TrackingLogScalarFieldEnum[]
  }

  /**
   * TrackingLog findMany
   */
  export type TrackingLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrackingLog
     */
    select?: TrackingLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TrackingLog
     */
    omit?: TrackingLogOmit<ExtArgs> | null
    /**
     * Filter, which TrackingLogs to fetch.
     */
    where?: TrackingLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TrackingLogs to fetch.
     */
    orderBy?: TrackingLogOrderByWithRelationInput | TrackingLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TrackingLogs.
     */
    cursor?: TrackingLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TrackingLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TrackingLogs.
     */
    skip?: number
    distinct?: TrackingLogScalarFieldEnum | TrackingLogScalarFieldEnum[]
  }

  /**
   * TrackingLog create
   */
  export type TrackingLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrackingLog
     */
    select?: TrackingLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TrackingLog
     */
    omit?: TrackingLogOmit<ExtArgs> | null
    /**
     * The data needed to create a TrackingLog.
     */
    data: XOR<TrackingLogCreateInput, TrackingLogUncheckedCreateInput>
  }

  /**
   * TrackingLog createMany
   */
  export type TrackingLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TrackingLogs.
     */
    data: TrackingLogCreateManyInput | TrackingLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TrackingLog createManyAndReturn
   */
  export type TrackingLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrackingLog
     */
    select?: TrackingLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TrackingLog
     */
    omit?: TrackingLogOmit<ExtArgs> | null
    /**
     * The data used to create many TrackingLogs.
     */
    data: TrackingLogCreateManyInput | TrackingLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TrackingLog update
   */
  export type TrackingLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrackingLog
     */
    select?: TrackingLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TrackingLog
     */
    omit?: TrackingLogOmit<ExtArgs> | null
    /**
     * The data needed to update a TrackingLog.
     */
    data: XOR<TrackingLogUpdateInput, TrackingLogUncheckedUpdateInput>
    /**
     * Choose, which TrackingLog to update.
     */
    where: TrackingLogWhereUniqueInput
  }

  /**
   * TrackingLog updateMany
   */
  export type TrackingLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TrackingLogs.
     */
    data: XOR<TrackingLogUpdateManyMutationInput, TrackingLogUncheckedUpdateManyInput>
    /**
     * Filter which TrackingLogs to update
     */
    where?: TrackingLogWhereInput
    /**
     * Limit how many TrackingLogs to update.
     */
    limit?: number
  }

  /**
   * TrackingLog updateManyAndReturn
   */
  export type TrackingLogUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrackingLog
     */
    select?: TrackingLogSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TrackingLog
     */
    omit?: TrackingLogOmit<ExtArgs> | null
    /**
     * The data used to update TrackingLogs.
     */
    data: XOR<TrackingLogUpdateManyMutationInput, TrackingLogUncheckedUpdateManyInput>
    /**
     * Filter which TrackingLogs to update
     */
    where?: TrackingLogWhereInput
    /**
     * Limit how many TrackingLogs to update.
     */
    limit?: number
  }

  /**
   * TrackingLog upsert
   */
  export type TrackingLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrackingLog
     */
    select?: TrackingLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TrackingLog
     */
    omit?: TrackingLogOmit<ExtArgs> | null
    /**
     * The filter to search for the TrackingLog to update in case it exists.
     */
    where: TrackingLogWhereUniqueInput
    /**
     * In case the TrackingLog found by the `where` argument doesn't exist, create a new TrackingLog with this data.
     */
    create: XOR<TrackingLogCreateInput, TrackingLogUncheckedCreateInput>
    /**
     * In case the TrackingLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TrackingLogUpdateInput, TrackingLogUncheckedUpdateInput>
  }

  /**
   * TrackingLog delete
   */
  export type TrackingLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrackingLog
     */
    select?: TrackingLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TrackingLog
     */
    omit?: TrackingLogOmit<ExtArgs> | null
    /**
     * Filter which TrackingLog to delete.
     */
    where: TrackingLogWhereUniqueInput
  }

  /**
   * TrackingLog deleteMany
   */
  export type TrackingLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TrackingLogs to delete
     */
    where?: TrackingLogWhereInput
    /**
     * Limit how many TrackingLogs to delete.
     */
    limit?: number
  }

  /**
   * TrackingLog without action
   */
  export type TrackingLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrackingLog
     */
    select?: TrackingLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TrackingLog
     */
    omit?: TrackingLogOmit<ExtArgs> | null
  }


  /**
   * Model master_citizen_data
   */

  export type AggregateMaster_citizen_data = {
    _count: Master_citizen_dataCountAggregateOutputType | null
    _avg: Master_citizen_dataAvgAggregateOutputType | null
    _sum: Master_citizen_dataSumAggregateOutputType | null
    _min: Master_citizen_dataMinAggregateOutputType | null
    _max: Master_citizen_dataMaxAggregateOutputType | null
  }

  export type Master_citizen_dataAvgAggregateOutputType = {
    id: number | null
    lat: Decimal | null
    lng: Decimal | null
  }

  export type Master_citizen_dataSumAggregateOutputType = {
    id: number | null
    lat: Decimal | null
    lng: Decimal | null
  }

  export type Master_citizen_dataMinAggregateOutputType = {
    id: number | null
    phoneNumber: string | null
    city: string | null
    ward: string | null
    area: string | null
    wasteGeneratorTypes: string | null
    houseNumber: string | null
    floorNumber: string | null
    householdType: string | null
    personName: string | null
    contactNumber: string | null
    numberOfPeople: string | null
    buildingPhoto: string | null
    createdAt: Date | null
    updatedAt: Date | null
    dryRFID: string | null
    drySlno: string | null
    wetRFID: string | null
    wetSlno: string | null
    lat: Decimal | null
    lng: Decimal | null
  }

  export type Master_citizen_dataMaxAggregateOutputType = {
    id: number | null
    phoneNumber: string | null
    city: string | null
    ward: string | null
    area: string | null
    wasteGeneratorTypes: string | null
    houseNumber: string | null
    floorNumber: string | null
    householdType: string | null
    personName: string | null
    contactNumber: string | null
    numberOfPeople: string | null
    buildingPhoto: string | null
    createdAt: Date | null
    updatedAt: Date | null
    dryRFID: string | null
    drySlno: string | null
    wetRFID: string | null
    wetSlno: string | null
    lat: Decimal | null
    lng: Decimal | null
  }

  export type Master_citizen_dataCountAggregateOutputType = {
    id: number
    phoneNumber: number
    city: number
    ward: number
    area: number
    wasteGeneratorTypes: number
    houseNumber: number
    floorNumber: number
    householdType: number
    personName: number
    contactNumber: number
    numberOfPeople: number
    buildingPhoto: number
    createdAt: number
    updatedAt: number
    dryRFID: number
    drySlno: number
    wetRFID: number
    wetSlno: number
    lat: number
    lng: number
    _all: number
  }


  export type Master_citizen_dataAvgAggregateInputType = {
    id?: true
    lat?: true
    lng?: true
  }

  export type Master_citizen_dataSumAggregateInputType = {
    id?: true
    lat?: true
    lng?: true
  }

  export type Master_citizen_dataMinAggregateInputType = {
    id?: true
    phoneNumber?: true
    city?: true
    ward?: true
    area?: true
    wasteGeneratorTypes?: true
    houseNumber?: true
    floorNumber?: true
    householdType?: true
    personName?: true
    contactNumber?: true
    numberOfPeople?: true
    buildingPhoto?: true
    createdAt?: true
    updatedAt?: true
    dryRFID?: true
    drySlno?: true
    wetRFID?: true
    wetSlno?: true
    lat?: true
    lng?: true
  }

  export type Master_citizen_dataMaxAggregateInputType = {
    id?: true
    phoneNumber?: true
    city?: true
    ward?: true
    area?: true
    wasteGeneratorTypes?: true
    houseNumber?: true
    floorNumber?: true
    householdType?: true
    personName?: true
    contactNumber?: true
    numberOfPeople?: true
    buildingPhoto?: true
    createdAt?: true
    updatedAt?: true
    dryRFID?: true
    drySlno?: true
    wetRFID?: true
    wetSlno?: true
    lat?: true
    lng?: true
  }

  export type Master_citizen_dataCountAggregateInputType = {
    id?: true
    phoneNumber?: true
    city?: true
    ward?: true
    area?: true
    wasteGeneratorTypes?: true
    houseNumber?: true
    floorNumber?: true
    householdType?: true
    personName?: true
    contactNumber?: true
    numberOfPeople?: true
    buildingPhoto?: true
    createdAt?: true
    updatedAt?: true
    dryRFID?: true
    drySlno?: true
    wetRFID?: true
    wetSlno?: true
    lat?: true
    lng?: true
    _all?: true
  }

  export type Master_citizen_dataAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which master_citizen_data to aggregate.
     */
    where?: master_citizen_dataWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of master_citizen_data to fetch.
     */
    orderBy?: master_citizen_dataOrderByWithRelationInput | master_citizen_dataOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: master_citizen_dataWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` master_citizen_data from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` master_citizen_data.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned master_citizen_data
    **/
    _count?: true | Master_citizen_dataCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Master_citizen_dataAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Master_citizen_dataSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Master_citizen_dataMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Master_citizen_dataMaxAggregateInputType
  }

  export type GetMaster_citizen_dataAggregateType<T extends Master_citizen_dataAggregateArgs> = {
        [P in keyof T & keyof AggregateMaster_citizen_data]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMaster_citizen_data[P]>
      : GetScalarType<T[P], AggregateMaster_citizen_data[P]>
  }




  export type master_citizen_dataGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: master_citizen_dataWhereInput
    orderBy?: master_citizen_dataOrderByWithAggregationInput | master_citizen_dataOrderByWithAggregationInput[]
    by: Master_citizen_dataScalarFieldEnum[] | Master_citizen_dataScalarFieldEnum
    having?: master_citizen_dataScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Master_citizen_dataCountAggregateInputType | true
    _avg?: Master_citizen_dataAvgAggregateInputType
    _sum?: Master_citizen_dataSumAggregateInputType
    _min?: Master_citizen_dataMinAggregateInputType
    _max?: Master_citizen_dataMaxAggregateInputType
  }

  export type Master_citizen_dataGroupByOutputType = {
    id: number
    phoneNumber: string
    city: string | null
    ward: string | null
    area: string | null
    wasteGeneratorTypes: string | null
    houseNumber: string | null
    floorNumber: string | null
    householdType: string | null
    personName: string | null
    contactNumber: string | null
    numberOfPeople: string | null
    buildingPhoto: string | null
    createdAt: Date
    updatedAt: Date
    dryRFID: string | null
    drySlno: string | null
    wetRFID: string | null
    wetSlno: string | null
    lat: Decimal | null
    lng: Decimal | null
    _count: Master_citizen_dataCountAggregateOutputType | null
    _avg: Master_citizen_dataAvgAggregateOutputType | null
    _sum: Master_citizen_dataSumAggregateOutputType | null
    _min: Master_citizen_dataMinAggregateOutputType | null
    _max: Master_citizen_dataMaxAggregateOutputType | null
  }

  type GetMaster_citizen_dataGroupByPayload<T extends master_citizen_dataGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Master_citizen_dataGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Master_citizen_dataGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Master_citizen_dataGroupByOutputType[P]>
            : GetScalarType<T[P], Master_citizen_dataGroupByOutputType[P]>
        }
      >
    >


  export type master_citizen_dataSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    phoneNumber?: boolean
    city?: boolean
    ward?: boolean
    area?: boolean
    wasteGeneratorTypes?: boolean
    houseNumber?: boolean
    floorNumber?: boolean
    householdType?: boolean
    personName?: boolean
    contactNumber?: boolean
    numberOfPeople?: boolean
    buildingPhoto?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    dryRFID?: boolean
    drySlno?: boolean
    wetRFID?: boolean
    wetSlno?: boolean
    lat?: boolean
    lng?: boolean
  }, ExtArgs["result"]["master_citizen_data"]>

  export type master_citizen_dataSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    phoneNumber?: boolean
    city?: boolean
    ward?: boolean
    area?: boolean
    wasteGeneratorTypes?: boolean
    houseNumber?: boolean
    floorNumber?: boolean
    householdType?: boolean
    personName?: boolean
    contactNumber?: boolean
    numberOfPeople?: boolean
    buildingPhoto?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    dryRFID?: boolean
    drySlno?: boolean
    wetRFID?: boolean
    wetSlno?: boolean
    lat?: boolean
    lng?: boolean
  }, ExtArgs["result"]["master_citizen_data"]>

  export type master_citizen_dataSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    phoneNumber?: boolean
    city?: boolean
    ward?: boolean
    area?: boolean
    wasteGeneratorTypes?: boolean
    houseNumber?: boolean
    floorNumber?: boolean
    householdType?: boolean
    personName?: boolean
    contactNumber?: boolean
    numberOfPeople?: boolean
    buildingPhoto?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    dryRFID?: boolean
    drySlno?: boolean
    wetRFID?: boolean
    wetSlno?: boolean
    lat?: boolean
    lng?: boolean
  }, ExtArgs["result"]["master_citizen_data"]>

  export type master_citizen_dataSelectScalar = {
    id?: boolean
    phoneNumber?: boolean
    city?: boolean
    ward?: boolean
    area?: boolean
    wasteGeneratorTypes?: boolean
    houseNumber?: boolean
    floorNumber?: boolean
    householdType?: boolean
    personName?: boolean
    contactNumber?: boolean
    numberOfPeople?: boolean
    buildingPhoto?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    dryRFID?: boolean
    drySlno?: boolean
    wetRFID?: boolean
    wetSlno?: boolean
    lat?: boolean
    lng?: boolean
  }

  export type master_citizen_dataOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "phoneNumber" | "city" | "ward" | "area" | "wasteGeneratorTypes" | "houseNumber" | "floorNumber" | "householdType" | "personName" | "contactNumber" | "numberOfPeople" | "buildingPhoto" | "createdAt" | "updatedAt" | "dryRFID" | "drySlno" | "wetRFID" | "wetSlno" | "lat" | "lng", ExtArgs["result"]["master_citizen_data"]>

  export type $master_citizen_dataPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "master_citizen_data"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      phoneNumber: string
      city: string | null
      ward: string | null
      area: string | null
      wasteGeneratorTypes: string | null
      houseNumber: string | null
      floorNumber: string | null
      householdType: string | null
      personName: string | null
      contactNumber: string | null
      numberOfPeople: string | null
      buildingPhoto: string | null
      createdAt: Date
      updatedAt: Date
      dryRFID: string | null
      drySlno: string | null
      wetRFID: string | null
      wetSlno: string | null
      lat: Prisma.Decimal | null
      lng: Prisma.Decimal | null
    }, ExtArgs["result"]["master_citizen_data"]>
    composites: {}
  }

  type master_citizen_dataGetPayload<S extends boolean | null | undefined | master_citizen_dataDefaultArgs> = $Result.GetResult<Prisma.$master_citizen_dataPayload, S>

  type master_citizen_dataCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<master_citizen_dataFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Master_citizen_dataCountAggregateInputType | true
    }

  export interface master_citizen_dataDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['master_citizen_data'], meta: { name: 'master_citizen_data' } }
    /**
     * Find zero or one Master_citizen_data that matches the filter.
     * @param {master_citizen_dataFindUniqueArgs} args - Arguments to find a Master_citizen_data
     * @example
     * // Get one Master_citizen_data
     * const master_citizen_data = await prisma.master_citizen_data.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends master_citizen_dataFindUniqueArgs>(args: SelectSubset<T, master_citizen_dataFindUniqueArgs<ExtArgs>>): Prisma__master_citizen_dataClient<$Result.GetResult<Prisma.$master_citizen_dataPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Master_citizen_data that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {master_citizen_dataFindUniqueOrThrowArgs} args - Arguments to find a Master_citizen_data
     * @example
     * // Get one Master_citizen_data
     * const master_citizen_data = await prisma.master_citizen_data.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends master_citizen_dataFindUniqueOrThrowArgs>(args: SelectSubset<T, master_citizen_dataFindUniqueOrThrowArgs<ExtArgs>>): Prisma__master_citizen_dataClient<$Result.GetResult<Prisma.$master_citizen_dataPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Master_citizen_data that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {master_citizen_dataFindFirstArgs} args - Arguments to find a Master_citizen_data
     * @example
     * // Get one Master_citizen_data
     * const master_citizen_data = await prisma.master_citizen_data.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends master_citizen_dataFindFirstArgs>(args?: SelectSubset<T, master_citizen_dataFindFirstArgs<ExtArgs>>): Prisma__master_citizen_dataClient<$Result.GetResult<Prisma.$master_citizen_dataPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Master_citizen_data that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {master_citizen_dataFindFirstOrThrowArgs} args - Arguments to find a Master_citizen_data
     * @example
     * // Get one Master_citizen_data
     * const master_citizen_data = await prisma.master_citizen_data.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends master_citizen_dataFindFirstOrThrowArgs>(args?: SelectSubset<T, master_citizen_dataFindFirstOrThrowArgs<ExtArgs>>): Prisma__master_citizen_dataClient<$Result.GetResult<Prisma.$master_citizen_dataPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Master_citizen_data that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {master_citizen_dataFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Master_citizen_data
     * const master_citizen_data = await prisma.master_citizen_data.findMany()
     * 
     * // Get first 10 Master_citizen_data
     * const master_citizen_data = await prisma.master_citizen_data.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const master_citizen_dataWithIdOnly = await prisma.master_citizen_data.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends master_citizen_dataFindManyArgs>(args?: SelectSubset<T, master_citizen_dataFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$master_citizen_dataPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Master_citizen_data.
     * @param {master_citizen_dataCreateArgs} args - Arguments to create a Master_citizen_data.
     * @example
     * // Create one Master_citizen_data
     * const Master_citizen_data = await prisma.master_citizen_data.create({
     *   data: {
     *     // ... data to create a Master_citizen_data
     *   }
     * })
     * 
     */
    create<T extends master_citizen_dataCreateArgs>(args: SelectSubset<T, master_citizen_dataCreateArgs<ExtArgs>>): Prisma__master_citizen_dataClient<$Result.GetResult<Prisma.$master_citizen_dataPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Master_citizen_data.
     * @param {master_citizen_dataCreateManyArgs} args - Arguments to create many Master_citizen_data.
     * @example
     * // Create many Master_citizen_data
     * const master_citizen_data = await prisma.master_citizen_data.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends master_citizen_dataCreateManyArgs>(args?: SelectSubset<T, master_citizen_dataCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Master_citizen_data and returns the data saved in the database.
     * @param {master_citizen_dataCreateManyAndReturnArgs} args - Arguments to create many Master_citizen_data.
     * @example
     * // Create many Master_citizen_data
     * const master_citizen_data = await prisma.master_citizen_data.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Master_citizen_data and only return the `id`
     * const master_citizen_dataWithIdOnly = await prisma.master_citizen_data.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends master_citizen_dataCreateManyAndReturnArgs>(args?: SelectSubset<T, master_citizen_dataCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$master_citizen_dataPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Master_citizen_data.
     * @param {master_citizen_dataDeleteArgs} args - Arguments to delete one Master_citizen_data.
     * @example
     * // Delete one Master_citizen_data
     * const Master_citizen_data = await prisma.master_citizen_data.delete({
     *   where: {
     *     // ... filter to delete one Master_citizen_data
     *   }
     * })
     * 
     */
    delete<T extends master_citizen_dataDeleteArgs>(args: SelectSubset<T, master_citizen_dataDeleteArgs<ExtArgs>>): Prisma__master_citizen_dataClient<$Result.GetResult<Prisma.$master_citizen_dataPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Master_citizen_data.
     * @param {master_citizen_dataUpdateArgs} args - Arguments to update one Master_citizen_data.
     * @example
     * // Update one Master_citizen_data
     * const master_citizen_data = await prisma.master_citizen_data.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends master_citizen_dataUpdateArgs>(args: SelectSubset<T, master_citizen_dataUpdateArgs<ExtArgs>>): Prisma__master_citizen_dataClient<$Result.GetResult<Prisma.$master_citizen_dataPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Master_citizen_data.
     * @param {master_citizen_dataDeleteManyArgs} args - Arguments to filter Master_citizen_data to delete.
     * @example
     * // Delete a few Master_citizen_data
     * const { count } = await prisma.master_citizen_data.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends master_citizen_dataDeleteManyArgs>(args?: SelectSubset<T, master_citizen_dataDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Master_citizen_data.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {master_citizen_dataUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Master_citizen_data
     * const master_citizen_data = await prisma.master_citizen_data.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends master_citizen_dataUpdateManyArgs>(args: SelectSubset<T, master_citizen_dataUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Master_citizen_data and returns the data updated in the database.
     * @param {master_citizen_dataUpdateManyAndReturnArgs} args - Arguments to update many Master_citizen_data.
     * @example
     * // Update many Master_citizen_data
     * const master_citizen_data = await prisma.master_citizen_data.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Master_citizen_data and only return the `id`
     * const master_citizen_dataWithIdOnly = await prisma.master_citizen_data.updateManyAndReturn({
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
    updateManyAndReturn<T extends master_citizen_dataUpdateManyAndReturnArgs>(args: SelectSubset<T, master_citizen_dataUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$master_citizen_dataPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Master_citizen_data.
     * @param {master_citizen_dataUpsertArgs} args - Arguments to update or create a Master_citizen_data.
     * @example
     * // Update or create a Master_citizen_data
     * const master_citizen_data = await prisma.master_citizen_data.upsert({
     *   create: {
     *     // ... data to create a Master_citizen_data
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Master_citizen_data we want to update
     *   }
     * })
     */
    upsert<T extends master_citizen_dataUpsertArgs>(args: SelectSubset<T, master_citizen_dataUpsertArgs<ExtArgs>>): Prisma__master_citizen_dataClient<$Result.GetResult<Prisma.$master_citizen_dataPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Master_citizen_data.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {master_citizen_dataCountArgs} args - Arguments to filter Master_citizen_data to count.
     * @example
     * // Count the number of Master_citizen_data
     * const count = await prisma.master_citizen_data.count({
     *   where: {
     *     // ... the filter for the Master_citizen_data we want to count
     *   }
     * })
    **/
    count<T extends master_citizen_dataCountArgs>(
      args?: Subset<T, master_citizen_dataCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Master_citizen_dataCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Master_citizen_data.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Master_citizen_dataAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends Master_citizen_dataAggregateArgs>(args: Subset<T, Master_citizen_dataAggregateArgs>): Prisma.PrismaPromise<GetMaster_citizen_dataAggregateType<T>>

    /**
     * Group by Master_citizen_data.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {master_citizen_dataGroupByArgs} args - Group by arguments.
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
      T extends master_citizen_dataGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: master_citizen_dataGroupByArgs['orderBy'] }
        : { orderBy?: master_citizen_dataGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, master_citizen_dataGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMaster_citizen_dataGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the master_citizen_data model
   */
  readonly fields: master_citizen_dataFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for master_citizen_data.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__master_citizen_dataClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the master_citizen_data model
   */
  interface master_citizen_dataFieldRefs {
    readonly id: FieldRef<"master_citizen_data", 'Int'>
    readonly phoneNumber: FieldRef<"master_citizen_data", 'String'>
    readonly city: FieldRef<"master_citizen_data", 'String'>
    readonly ward: FieldRef<"master_citizen_data", 'String'>
    readonly area: FieldRef<"master_citizen_data", 'String'>
    readonly wasteGeneratorTypes: FieldRef<"master_citizen_data", 'String'>
    readonly houseNumber: FieldRef<"master_citizen_data", 'String'>
    readonly floorNumber: FieldRef<"master_citizen_data", 'String'>
    readonly householdType: FieldRef<"master_citizen_data", 'String'>
    readonly personName: FieldRef<"master_citizen_data", 'String'>
    readonly contactNumber: FieldRef<"master_citizen_data", 'String'>
    readonly numberOfPeople: FieldRef<"master_citizen_data", 'String'>
    readonly buildingPhoto: FieldRef<"master_citizen_data", 'String'>
    readonly createdAt: FieldRef<"master_citizen_data", 'DateTime'>
    readonly updatedAt: FieldRef<"master_citizen_data", 'DateTime'>
    readonly dryRFID: FieldRef<"master_citizen_data", 'String'>
    readonly drySlno: FieldRef<"master_citizen_data", 'String'>
    readonly wetRFID: FieldRef<"master_citizen_data", 'String'>
    readonly wetSlno: FieldRef<"master_citizen_data", 'String'>
    readonly lat: FieldRef<"master_citizen_data", 'Decimal'>
    readonly lng: FieldRef<"master_citizen_data", 'Decimal'>
  }
    

  // Custom InputTypes
  /**
   * master_citizen_data findUnique
   */
  export type master_citizen_dataFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the master_citizen_data
     */
    select?: master_citizen_dataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the master_citizen_data
     */
    omit?: master_citizen_dataOmit<ExtArgs> | null
    /**
     * Filter, which master_citizen_data to fetch.
     */
    where: master_citizen_dataWhereUniqueInput
  }

  /**
   * master_citizen_data findUniqueOrThrow
   */
  export type master_citizen_dataFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the master_citizen_data
     */
    select?: master_citizen_dataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the master_citizen_data
     */
    omit?: master_citizen_dataOmit<ExtArgs> | null
    /**
     * Filter, which master_citizen_data to fetch.
     */
    where: master_citizen_dataWhereUniqueInput
  }

  /**
   * master_citizen_data findFirst
   */
  export type master_citizen_dataFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the master_citizen_data
     */
    select?: master_citizen_dataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the master_citizen_data
     */
    omit?: master_citizen_dataOmit<ExtArgs> | null
    /**
     * Filter, which master_citizen_data to fetch.
     */
    where?: master_citizen_dataWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of master_citizen_data to fetch.
     */
    orderBy?: master_citizen_dataOrderByWithRelationInput | master_citizen_dataOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for master_citizen_data.
     */
    cursor?: master_citizen_dataWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` master_citizen_data from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` master_citizen_data.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of master_citizen_data.
     */
    distinct?: Master_citizen_dataScalarFieldEnum | Master_citizen_dataScalarFieldEnum[]
  }

  /**
   * master_citizen_data findFirstOrThrow
   */
  export type master_citizen_dataFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the master_citizen_data
     */
    select?: master_citizen_dataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the master_citizen_data
     */
    omit?: master_citizen_dataOmit<ExtArgs> | null
    /**
     * Filter, which master_citizen_data to fetch.
     */
    where?: master_citizen_dataWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of master_citizen_data to fetch.
     */
    orderBy?: master_citizen_dataOrderByWithRelationInput | master_citizen_dataOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for master_citizen_data.
     */
    cursor?: master_citizen_dataWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` master_citizen_data from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` master_citizen_data.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of master_citizen_data.
     */
    distinct?: Master_citizen_dataScalarFieldEnum | Master_citizen_dataScalarFieldEnum[]
  }

  /**
   * master_citizen_data findMany
   */
  export type master_citizen_dataFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the master_citizen_data
     */
    select?: master_citizen_dataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the master_citizen_data
     */
    omit?: master_citizen_dataOmit<ExtArgs> | null
    /**
     * Filter, which master_citizen_data to fetch.
     */
    where?: master_citizen_dataWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of master_citizen_data to fetch.
     */
    orderBy?: master_citizen_dataOrderByWithRelationInput | master_citizen_dataOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing master_citizen_data.
     */
    cursor?: master_citizen_dataWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` master_citizen_data from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` master_citizen_data.
     */
    skip?: number
    distinct?: Master_citizen_dataScalarFieldEnum | Master_citizen_dataScalarFieldEnum[]
  }

  /**
   * master_citizen_data create
   */
  export type master_citizen_dataCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the master_citizen_data
     */
    select?: master_citizen_dataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the master_citizen_data
     */
    omit?: master_citizen_dataOmit<ExtArgs> | null
    /**
     * The data needed to create a master_citizen_data.
     */
    data: XOR<master_citizen_dataCreateInput, master_citizen_dataUncheckedCreateInput>
  }

  /**
   * master_citizen_data createMany
   */
  export type master_citizen_dataCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many master_citizen_data.
     */
    data: master_citizen_dataCreateManyInput | master_citizen_dataCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * master_citizen_data createManyAndReturn
   */
  export type master_citizen_dataCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the master_citizen_data
     */
    select?: master_citizen_dataSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the master_citizen_data
     */
    omit?: master_citizen_dataOmit<ExtArgs> | null
    /**
     * The data used to create many master_citizen_data.
     */
    data: master_citizen_dataCreateManyInput | master_citizen_dataCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * master_citizen_data update
   */
  export type master_citizen_dataUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the master_citizen_data
     */
    select?: master_citizen_dataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the master_citizen_data
     */
    omit?: master_citizen_dataOmit<ExtArgs> | null
    /**
     * The data needed to update a master_citizen_data.
     */
    data: XOR<master_citizen_dataUpdateInput, master_citizen_dataUncheckedUpdateInput>
    /**
     * Choose, which master_citizen_data to update.
     */
    where: master_citizen_dataWhereUniqueInput
  }

  /**
   * master_citizen_data updateMany
   */
  export type master_citizen_dataUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update master_citizen_data.
     */
    data: XOR<master_citizen_dataUpdateManyMutationInput, master_citizen_dataUncheckedUpdateManyInput>
    /**
     * Filter which master_citizen_data to update
     */
    where?: master_citizen_dataWhereInput
    /**
     * Limit how many master_citizen_data to update.
     */
    limit?: number
  }

  /**
   * master_citizen_data updateManyAndReturn
   */
  export type master_citizen_dataUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the master_citizen_data
     */
    select?: master_citizen_dataSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the master_citizen_data
     */
    omit?: master_citizen_dataOmit<ExtArgs> | null
    /**
     * The data used to update master_citizen_data.
     */
    data: XOR<master_citizen_dataUpdateManyMutationInput, master_citizen_dataUncheckedUpdateManyInput>
    /**
     * Filter which master_citizen_data to update
     */
    where?: master_citizen_dataWhereInput
    /**
     * Limit how many master_citizen_data to update.
     */
    limit?: number
  }

  /**
   * master_citizen_data upsert
   */
  export type master_citizen_dataUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the master_citizen_data
     */
    select?: master_citizen_dataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the master_citizen_data
     */
    omit?: master_citizen_dataOmit<ExtArgs> | null
    /**
     * The filter to search for the master_citizen_data to update in case it exists.
     */
    where: master_citizen_dataWhereUniqueInput
    /**
     * In case the master_citizen_data found by the `where` argument doesn't exist, create a new master_citizen_data with this data.
     */
    create: XOR<master_citizen_dataCreateInput, master_citizen_dataUncheckedCreateInput>
    /**
     * In case the master_citizen_data was found with the provided `where` argument, update it with this data.
     */
    update: XOR<master_citizen_dataUpdateInput, master_citizen_dataUncheckedUpdateInput>
  }

  /**
   * master_citizen_data delete
   */
  export type master_citizen_dataDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the master_citizen_data
     */
    select?: master_citizen_dataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the master_citizen_data
     */
    omit?: master_citizen_dataOmit<ExtArgs> | null
    /**
     * Filter which master_citizen_data to delete.
     */
    where: master_citizen_dataWhereUniqueInput
  }

  /**
   * master_citizen_data deleteMany
   */
  export type master_citizen_dataDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which master_citizen_data to delete
     */
    where?: master_citizen_dataWhereInput
    /**
     * Limit how many master_citizen_data to delete.
     */
    limit?: number
  }

  /**
   * master_citizen_data without action
   */
  export type master_citizen_dataDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the master_citizen_data
     */
    select?: master_citizen_dataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the master_citizen_data
     */
    omit?: master_citizen_dataOmit<ExtArgs> | null
  }


  /**
   * Model survey_attribute_specific
   */

  export type AggregateSurvey_attribute_specific = {
    _count: Survey_attribute_specificCountAggregateOutputType | null
    _avg: Survey_attribute_specificAvgAggregateOutputType | null
    _sum: Survey_attribute_specificSumAggregateOutputType | null
    _min: Survey_attribute_specificMinAggregateOutputType | null
    _max: Survey_attribute_specificMaxAggregateOutputType | null
  }

  export type Survey_attribute_specificAvgAggregateOutputType = {
    id: number | null
    lat: Decimal | null
    lng: Decimal | null
  }

  export type Survey_attribute_specificSumAggregateOutputType = {
    id: number | null
    lat: Decimal | null
    lng: Decimal | null
  }

  export type Survey_attribute_specificMinAggregateOutputType = {
    city: string | null
    ward: string | null
    area: string | null
    wasteGeneratorTypes: string | null
    houseNumber: string | null
    floorNumber: string | null
    householdType: string | null
    personName: string | null
    contactNumber: string | null
    numberOfPeople: string | null
    buildingPhoto: string | null
    id: number | null
    lat: Decimal | null
    lng: Decimal | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type Survey_attribute_specificMaxAggregateOutputType = {
    city: string | null
    ward: string | null
    area: string | null
    wasteGeneratorTypes: string | null
    houseNumber: string | null
    floorNumber: string | null
    householdType: string | null
    personName: string | null
    contactNumber: string | null
    numberOfPeople: string | null
    buildingPhoto: string | null
    id: number | null
    lat: Decimal | null
    lng: Decimal | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type Survey_attribute_specificCountAggregateOutputType = {
    city: number
    ward: number
    area: number
    wasteGeneratorTypes: number
    houseNumber: number
    floorNumber: number
    householdType: number
    personName: number
    contactNumber: number
    numberOfPeople: number
    buildingPhoto: number
    id: number
    lat: number
    lng: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type Survey_attribute_specificAvgAggregateInputType = {
    id?: true
    lat?: true
    lng?: true
  }

  export type Survey_attribute_specificSumAggregateInputType = {
    id?: true
    lat?: true
    lng?: true
  }

  export type Survey_attribute_specificMinAggregateInputType = {
    city?: true
    ward?: true
    area?: true
    wasteGeneratorTypes?: true
    houseNumber?: true
    floorNumber?: true
    householdType?: true
    personName?: true
    contactNumber?: true
    numberOfPeople?: true
    buildingPhoto?: true
    id?: true
    lat?: true
    lng?: true
    createdAt?: true
    updatedAt?: true
  }

  export type Survey_attribute_specificMaxAggregateInputType = {
    city?: true
    ward?: true
    area?: true
    wasteGeneratorTypes?: true
    houseNumber?: true
    floorNumber?: true
    householdType?: true
    personName?: true
    contactNumber?: true
    numberOfPeople?: true
    buildingPhoto?: true
    id?: true
    lat?: true
    lng?: true
    createdAt?: true
    updatedAt?: true
  }

  export type Survey_attribute_specificCountAggregateInputType = {
    city?: true
    ward?: true
    area?: true
    wasteGeneratorTypes?: true
    houseNumber?: true
    floorNumber?: true
    householdType?: true
    personName?: true
    contactNumber?: true
    numberOfPeople?: true
    buildingPhoto?: true
    id?: true
    lat?: true
    lng?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type Survey_attribute_specificAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which survey_attribute_specific to aggregate.
     */
    where?: survey_attribute_specificWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of survey_attribute_specifics to fetch.
     */
    orderBy?: survey_attribute_specificOrderByWithRelationInput | survey_attribute_specificOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: survey_attribute_specificWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` survey_attribute_specifics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` survey_attribute_specifics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned survey_attribute_specifics
    **/
    _count?: true | Survey_attribute_specificCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Survey_attribute_specificAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Survey_attribute_specificSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Survey_attribute_specificMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Survey_attribute_specificMaxAggregateInputType
  }

  export type GetSurvey_attribute_specificAggregateType<T extends Survey_attribute_specificAggregateArgs> = {
        [P in keyof T & keyof AggregateSurvey_attribute_specific]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSurvey_attribute_specific[P]>
      : GetScalarType<T[P], AggregateSurvey_attribute_specific[P]>
  }




  export type survey_attribute_specificGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: survey_attribute_specificWhereInput
    orderBy?: survey_attribute_specificOrderByWithAggregationInput | survey_attribute_specificOrderByWithAggregationInput[]
    by: Survey_attribute_specificScalarFieldEnum[] | Survey_attribute_specificScalarFieldEnum
    having?: survey_attribute_specificScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Survey_attribute_specificCountAggregateInputType | true
    _avg?: Survey_attribute_specificAvgAggregateInputType
    _sum?: Survey_attribute_specificSumAggregateInputType
    _min?: Survey_attribute_specificMinAggregateInputType
    _max?: Survey_attribute_specificMaxAggregateInputType
  }

  export type Survey_attribute_specificGroupByOutputType = {
    city: string | null
    ward: string | null
    area: string | null
    wasteGeneratorTypes: string | null
    houseNumber: string | null
    floorNumber: string | null
    householdType: string | null
    personName: string | null
    contactNumber: string | null
    numberOfPeople: string | null
    buildingPhoto: string | null
    id: number
    lat: Decimal | null
    lng: Decimal | null
    createdAt: Date
    updatedAt: Date
    _count: Survey_attribute_specificCountAggregateOutputType | null
    _avg: Survey_attribute_specificAvgAggregateOutputType | null
    _sum: Survey_attribute_specificSumAggregateOutputType | null
    _min: Survey_attribute_specificMinAggregateOutputType | null
    _max: Survey_attribute_specificMaxAggregateOutputType | null
  }

  type GetSurvey_attribute_specificGroupByPayload<T extends survey_attribute_specificGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Survey_attribute_specificGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Survey_attribute_specificGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Survey_attribute_specificGroupByOutputType[P]>
            : GetScalarType<T[P], Survey_attribute_specificGroupByOutputType[P]>
        }
      >
    >


  export type survey_attribute_specificSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    city?: boolean
    ward?: boolean
    area?: boolean
    wasteGeneratorTypes?: boolean
    houseNumber?: boolean
    floorNumber?: boolean
    householdType?: boolean
    personName?: boolean
    contactNumber?: boolean
    numberOfPeople?: boolean
    buildingPhoto?: boolean
    id?: boolean
    lat?: boolean
    lng?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["survey_attribute_specific"]>

  export type survey_attribute_specificSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    city?: boolean
    ward?: boolean
    area?: boolean
    wasteGeneratorTypes?: boolean
    houseNumber?: boolean
    floorNumber?: boolean
    householdType?: boolean
    personName?: boolean
    contactNumber?: boolean
    numberOfPeople?: boolean
    buildingPhoto?: boolean
    id?: boolean
    lat?: boolean
    lng?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["survey_attribute_specific"]>

  export type survey_attribute_specificSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    city?: boolean
    ward?: boolean
    area?: boolean
    wasteGeneratorTypes?: boolean
    houseNumber?: boolean
    floorNumber?: boolean
    householdType?: boolean
    personName?: boolean
    contactNumber?: boolean
    numberOfPeople?: boolean
    buildingPhoto?: boolean
    id?: boolean
    lat?: boolean
    lng?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["survey_attribute_specific"]>

  export type survey_attribute_specificSelectScalar = {
    city?: boolean
    ward?: boolean
    area?: boolean
    wasteGeneratorTypes?: boolean
    houseNumber?: boolean
    floorNumber?: boolean
    householdType?: boolean
    personName?: boolean
    contactNumber?: boolean
    numberOfPeople?: boolean
    buildingPhoto?: boolean
    id?: boolean
    lat?: boolean
    lng?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type survey_attribute_specificOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"city" | "ward" | "area" | "wasteGeneratorTypes" | "houseNumber" | "floorNumber" | "householdType" | "personName" | "contactNumber" | "numberOfPeople" | "buildingPhoto" | "id" | "lat" | "lng" | "createdAt" | "updatedAt", ExtArgs["result"]["survey_attribute_specific"]>

  export type $survey_attribute_specificPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "survey_attribute_specific"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      city: string | null
      ward: string | null
      area: string | null
      wasteGeneratorTypes: string | null
      houseNumber: string | null
      floorNumber: string | null
      householdType: string | null
      personName: string | null
      contactNumber: string | null
      numberOfPeople: string | null
      buildingPhoto: string | null
      id: number
      lat: Prisma.Decimal | null
      lng: Prisma.Decimal | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["survey_attribute_specific"]>
    composites: {}
  }

  type survey_attribute_specificGetPayload<S extends boolean | null | undefined | survey_attribute_specificDefaultArgs> = $Result.GetResult<Prisma.$survey_attribute_specificPayload, S>

  type survey_attribute_specificCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<survey_attribute_specificFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Survey_attribute_specificCountAggregateInputType | true
    }

  export interface survey_attribute_specificDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['survey_attribute_specific'], meta: { name: 'survey_attribute_specific' } }
    /**
     * Find zero or one Survey_attribute_specific that matches the filter.
     * @param {survey_attribute_specificFindUniqueArgs} args - Arguments to find a Survey_attribute_specific
     * @example
     * // Get one Survey_attribute_specific
     * const survey_attribute_specific = await prisma.survey_attribute_specific.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends survey_attribute_specificFindUniqueArgs>(args: SelectSubset<T, survey_attribute_specificFindUniqueArgs<ExtArgs>>): Prisma__survey_attribute_specificClient<$Result.GetResult<Prisma.$survey_attribute_specificPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Survey_attribute_specific that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {survey_attribute_specificFindUniqueOrThrowArgs} args - Arguments to find a Survey_attribute_specific
     * @example
     * // Get one Survey_attribute_specific
     * const survey_attribute_specific = await prisma.survey_attribute_specific.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends survey_attribute_specificFindUniqueOrThrowArgs>(args: SelectSubset<T, survey_attribute_specificFindUniqueOrThrowArgs<ExtArgs>>): Prisma__survey_attribute_specificClient<$Result.GetResult<Prisma.$survey_attribute_specificPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Survey_attribute_specific that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {survey_attribute_specificFindFirstArgs} args - Arguments to find a Survey_attribute_specific
     * @example
     * // Get one Survey_attribute_specific
     * const survey_attribute_specific = await prisma.survey_attribute_specific.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends survey_attribute_specificFindFirstArgs>(args?: SelectSubset<T, survey_attribute_specificFindFirstArgs<ExtArgs>>): Prisma__survey_attribute_specificClient<$Result.GetResult<Prisma.$survey_attribute_specificPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Survey_attribute_specific that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {survey_attribute_specificFindFirstOrThrowArgs} args - Arguments to find a Survey_attribute_specific
     * @example
     * // Get one Survey_attribute_specific
     * const survey_attribute_specific = await prisma.survey_attribute_specific.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends survey_attribute_specificFindFirstOrThrowArgs>(args?: SelectSubset<T, survey_attribute_specificFindFirstOrThrowArgs<ExtArgs>>): Prisma__survey_attribute_specificClient<$Result.GetResult<Prisma.$survey_attribute_specificPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Survey_attribute_specifics that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {survey_attribute_specificFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Survey_attribute_specifics
     * const survey_attribute_specifics = await prisma.survey_attribute_specific.findMany()
     * 
     * // Get first 10 Survey_attribute_specifics
     * const survey_attribute_specifics = await prisma.survey_attribute_specific.findMany({ take: 10 })
     * 
     * // Only select the `city`
     * const survey_attribute_specificWithCityOnly = await prisma.survey_attribute_specific.findMany({ select: { city: true } })
     * 
     */
    findMany<T extends survey_attribute_specificFindManyArgs>(args?: SelectSubset<T, survey_attribute_specificFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$survey_attribute_specificPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Survey_attribute_specific.
     * @param {survey_attribute_specificCreateArgs} args - Arguments to create a Survey_attribute_specific.
     * @example
     * // Create one Survey_attribute_specific
     * const Survey_attribute_specific = await prisma.survey_attribute_specific.create({
     *   data: {
     *     // ... data to create a Survey_attribute_specific
     *   }
     * })
     * 
     */
    create<T extends survey_attribute_specificCreateArgs>(args: SelectSubset<T, survey_attribute_specificCreateArgs<ExtArgs>>): Prisma__survey_attribute_specificClient<$Result.GetResult<Prisma.$survey_attribute_specificPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Survey_attribute_specifics.
     * @param {survey_attribute_specificCreateManyArgs} args - Arguments to create many Survey_attribute_specifics.
     * @example
     * // Create many Survey_attribute_specifics
     * const survey_attribute_specific = await prisma.survey_attribute_specific.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends survey_attribute_specificCreateManyArgs>(args?: SelectSubset<T, survey_attribute_specificCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Survey_attribute_specifics and returns the data saved in the database.
     * @param {survey_attribute_specificCreateManyAndReturnArgs} args - Arguments to create many Survey_attribute_specifics.
     * @example
     * // Create many Survey_attribute_specifics
     * const survey_attribute_specific = await prisma.survey_attribute_specific.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Survey_attribute_specifics and only return the `city`
     * const survey_attribute_specificWithCityOnly = await prisma.survey_attribute_specific.createManyAndReturn({
     *   select: { city: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends survey_attribute_specificCreateManyAndReturnArgs>(args?: SelectSubset<T, survey_attribute_specificCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$survey_attribute_specificPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Survey_attribute_specific.
     * @param {survey_attribute_specificDeleteArgs} args - Arguments to delete one Survey_attribute_specific.
     * @example
     * // Delete one Survey_attribute_specific
     * const Survey_attribute_specific = await prisma.survey_attribute_specific.delete({
     *   where: {
     *     // ... filter to delete one Survey_attribute_specific
     *   }
     * })
     * 
     */
    delete<T extends survey_attribute_specificDeleteArgs>(args: SelectSubset<T, survey_attribute_specificDeleteArgs<ExtArgs>>): Prisma__survey_attribute_specificClient<$Result.GetResult<Prisma.$survey_attribute_specificPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Survey_attribute_specific.
     * @param {survey_attribute_specificUpdateArgs} args - Arguments to update one Survey_attribute_specific.
     * @example
     * // Update one Survey_attribute_specific
     * const survey_attribute_specific = await prisma.survey_attribute_specific.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends survey_attribute_specificUpdateArgs>(args: SelectSubset<T, survey_attribute_specificUpdateArgs<ExtArgs>>): Prisma__survey_attribute_specificClient<$Result.GetResult<Prisma.$survey_attribute_specificPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Survey_attribute_specifics.
     * @param {survey_attribute_specificDeleteManyArgs} args - Arguments to filter Survey_attribute_specifics to delete.
     * @example
     * // Delete a few Survey_attribute_specifics
     * const { count } = await prisma.survey_attribute_specific.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends survey_attribute_specificDeleteManyArgs>(args?: SelectSubset<T, survey_attribute_specificDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Survey_attribute_specifics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {survey_attribute_specificUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Survey_attribute_specifics
     * const survey_attribute_specific = await prisma.survey_attribute_specific.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends survey_attribute_specificUpdateManyArgs>(args: SelectSubset<T, survey_attribute_specificUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Survey_attribute_specifics and returns the data updated in the database.
     * @param {survey_attribute_specificUpdateManyAndReturnArgs} args - Arguments to update many Survey_attribute_specifics.
     * @example
     * // Update many Survey_attribute_specifics
     * const survey_attribute_specific = await prisma.survey_attribute_specific.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Survey_attribute_specifics and only return the `city`
     * const survey_attribute_specificWithCityOnly = await prisma.survey_attribute_specific.updateManyAndReturn({
     *   select: { city: true },
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
    updateManyAndReturn<T extends survey_attribute_specificUpdateManyAndReturnArgs>(args: SelectSubset<T, survey_attribute_specificUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$survey_attribute_specificPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Survey_attribute_specific.
     * @param {survey_attribute_specificUpsertArgs} args - Arguments to update or create a Survey_attribute_specific.
     * @example
     * // Update or create a Survey_attribute_specific
     * const survey_attribute_specific = await prisma.survey_attribute_specific.upsert({
     *   create: {
     *     // ... data to create a Survey_attribute_specific
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Survey_attribute_specific we want to update
     *   }
     * })
     */
    upsert<T extends survey_attribute_specificUpsertArgs>(args: SelectSubset<T, survey_attribute_specificUpsertArgs<ExtArgs>>): Prisma__survey_attribute_specificClient<$Result.GetResult<Prisma.$survey_attribute_specificPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Survey_attribute_specifics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {survey_attribute_specificCountArgs} args - Arguments to filter Survey_attribute_specifics to count.
     * @example
     * // Count the number of Survey_attribute_specifics
     * const count = await prisma.survey_attribute_specific.count({
     *   where: {
     *     // ... the filter for the Survey_attribute_specifics we want to count
     *   }
     * })
    **/
    count<T extends survey_attribute_specificCountArgs>(
      args?: Subset<T, survey_attribute_specificCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Survey_attribute_specificCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Survey_attribute_specific.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Survey_attribute_specificAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends Survey_attribute_specificAggregateArgs>(args: Subset<T, Survey_attribute_specificAggregateArgs>): Prisma.PrismaPromise<GetSurvey_attribute_specificAggregateType<T>>

    /**
     * Group by Survey_attribute_specific.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {survey_attribute_specificGroupByArgs} args - Group by arguments.
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
      T extends survey_attribute_specificGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: survey_attribute_specificGroupByArgs['orderBy'] }
        : { orderBy?: survey_attribute_specificGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, survey_attribute_specificGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSurvey_attribute_specificGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the survey_attribute_specific model
   */
  readonly fields: survey_attribute_specificFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for survey_attribute_specific.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__survey_attribute_specificClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the survey_attribute_specific model
   */
  interface survey_attribute_specificFieldRefs {
    readonly city: FieldRef<"survey_attribute_specific", 'String'>
    readonly ward: FieldRef<"survey_attribute_specific", 'String'>
    readonly area: FieldRef<"survey_attribute_specific", 'String'>
    readonly wasteGeneratorTypes: FieldRef<"survey_attribute_specific", 'String'>
    readonly houseNumber: FieldRef<"survey_attribute_specific", 'String'>
    readonly floorNumber: FieldRef<"survey_attribute_specific", 'String'>
    readonly householdType: FieldRef<"survey_attribute_specific", 'String'>
    readonly personName: FieldRef<"survey_attribute_specific", 'String'>
    readonly contactNumber: FieldRef<"survey_attribute_specific", 'String'>
    readonly numberOfPeople: FieldRef<"survey_attribute_specific", 'String'>
    readonly buildingPhoto: FieldRef<"survey_attribute_specific", 'String'>
    readonly id: FieldRef<"survey_attribute_specific", 'Int'>
    readonly lat: FieldRef<"survey_attribute_specific", 'Decimal'>
    readonly lng: FieldRef<"survey_attribute_specific", 'Decimal'>
    readonly createdAt: FieldRef<"survey_attribute_specific", 'DateTime'>
    readonly updatedAt: FieldRef<"survey_attribute_specific", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * survey_attribute_specific findUnique
   */
  export type survey_attribute_specificFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the survey_attribute_specific
     */
    select?: survey_attribute_specificSelect<ExtArgs> | null
    /**
     * Omit specific fields from the survey_attribute_specific
     */
    omit?: survey_attribute_specificOmit<ExtArgs> | null
    /**
     * Filter, which survey_attribute_specific to fetch.
     */
    where: survey_attribute_specificWhereUniqueInput
  }

  /**
   * survey_attribute_specific findUniqueOrThrow
   */
  export type survey_attribute_specificFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the survey_attribute_specific
     */
    select?: survey_attribute_specificSelect<ExtArgs> | null
    /**
     * Omit specific fields from the survey_attribute_specific
     */
    omit?: survey_attribute_specificOmit<ExtArgs> | null
    /**
     * Filter, which survey_attribute_specific to fetch.
     */
    where: survey_attribute_specificWhereUniqueInput
  }

  /**
   * survey_attribute_specific findFirst
   */
  export type survey_attribute_specificFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the survey_attribute_specific
     */
    select?: survey_attribute_specificSelect<ExtArgs> | null
    /**
     * Omit specific fields from the survey_attribute_specific
     */
    omit?: survey_attribute_specificOmit<ExtArgs> | null
    /**
     * Filter, which survey_attribute_specific to fetch.
     */
    where?: survey_attribute_specificWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of survey_attribute_specifics to fetch.
     */
    orderBy?: survey_attribute_specificOrderByWithRelationInput | survey_attribute_specificOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for survey_attribute_specifics.
     */
    cursor?: survey_attribute_specificWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` survey_attribute_specifics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` survey_attribute_specifics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of survey_attribute_specifics.
     */
    distinct?: Survey_attribute_specificScalarFieldEnum | Survey_attribute_specificScalarFieldEnum[]
  }

  /**
   * survey_attribute_specific findFirstOrThrow
   */
  export type survey_attribute_specificFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the survey_attribute_specific
     */
    select?: survey_attribute_specificSelect<ExtArgs> | null
    /**
     * Omit specific fields from the survey_attribute_specific
     */
    omit?: survey_attribute_specificOmit<ExtArgs> | null
    /**
     * Filter, which survey_attribute_specific to fetch.
     */
    where?: survey_attribute_specificWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of survey_attribute_specifics to fetch.
     */
    orderBy?: survey_attribute_specificOrderByWithRelationInput | survey_attribute_specificOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for survey_attribute_specifics.
     */
    cursor?: survey_attribute_specificWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` survey_attribute_specifics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` survey_attribute_specifics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of survey_attribute_specifics.
     */
    distinct?: Survey_attribute_specificScalarFieldEnum | Survey_attribute_specificScalarFieldEnum[]
  }

  /**
   * survey_attribute_specific findMany
   */
  export type survey_attribute_specificFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the survey_attribute_specific
     */
    select?: survey_attribute_specificSelect<ExtArgs> | null
    /**
     * Omit specific fields from the survey_attribute_specific
     */
    omit?: survey_attribute_specificOmit<ExtArgs> | null
    /**
     * Filter, which survey_attribute_specifics to fetch.
     */
    where?: survey_attribute_specificWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of survey_attribute_specifics to fetch.
     */
    orderBy?: survey_attribute_specificOrderByWithRelationInput | survey_attribute_specificOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing survey_attribute_specifics.
     */
    cursor?: survey_attribute_specificWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` survey_attribute_specifics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` survey_attribute_specifics.
     */
    skip?: number
    distinct?: Survey_attribute_specificScalarFieldEnum | Survey_attribute_specificScalarFieldEnum[]
  }

  /**
   * survey_attribute_specific create
   */
  export type survey_attribute_specificCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the survey_attribute_specific
     */
    select?: survey_attribute_specificSelect<ExtArgs> | null
    /**
     * Omit specific fields from the survey_attribute_specific
     */
    omit?: survey_attribute_specificOmit<ExtArgs> | null
    /**
     * The data needed to create a survey_attribute_specific.
     */
    data: XOR<survey_attribute_specificCreateInput, survey_attribute_specificUncheckedCreateInput>
  }

  /**
   * survey_attribute_specific createMany
   */
  export type survey_attribute_specificCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many survey_attribute_specifics.
     */
    data: survey_attribute_specificCreateManyInput | survey_attribute_specificCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * survey_attribute_specific createManyAndReturn
   */
  export type survey_attribute_specificCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the survey_attribute_specific
     */
    select?: survey_attribute_specificSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the survey_attribute_specific
     */
    omit?: survey_attribute_specificOmit<ExtArgs> | null
    /**
     * The data used to create many survey_attribute_specifics.
     */
    data: survey_attribute_specificCreateManyInput | survey_attribute_specificCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * survey_attribute_specific update
   */
  export type survey_attribute_specificUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the survey_attribute_specific
     */
    select?: survey_attribute_specificSelect<ExtArgs> | null
    /**
     * Omit specific fields from the survey_attribute_specific
     */
    omit?: survey_attribute_specificOmit<ExtArgs> | null
    /**
     * The data needed to update a survey_attribute_specific.
     */
    data: XOR<survey_attribute_specificUpdateInput, survey_attribute_specificUncheckedUpdateInput>
    /**
     * Choose, which survey_attribute_specific to update.
     */
    where: survey_attribute_specificWhereUniqueInput
  }

  /**
   * survey_attribute_specific updateMany
   */
  export type survey_attribute_specificUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update survey_attribute_specifics.
     */
    data: XOR<survey_attribute_specificUpdateManyMutationInput, survey_attribute_specificUncheckedUpdateManyInput>
    /**
     * Filter which survey_attribute_specifics to update
     */
    where?: survey_attribute_specificWhereInput
    /**
     * Limit how many survey_attribute_specifics to update.
     */
    limit?: number
  }

  /**
   * survey_attribute_specific updateManyAndReturn
   */
  export type survey_attribute_specificUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the survey_attribute_specific
     */
    select?: survey_attribute_specificSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the survey_attribute_specific
     */
    omit?: survey_attribute_specificOmit<ExtArgs> | null
    /**
     * The data used to update survey_attribute_specifics.
     */
    data: XOR<survey_attribute_specificUpdateManyMutationInput, survey_attribute_specificUncheckedUpdateManyInput>
    /**
     * Filter which survey_attribute_specifics to update
     */
    where?: survey_attribute_specificWhereInput
    /**
     * Limit how many survey_attribute_specifics to update.
     */
    limit?: number
  }

  /**
   * survey_attribute_specific upsert
   */
  export type survey_attribute_specificUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the survey_attribute_specific
     */
    select?: survey_attribute_specificSelect<ExtArgs> | null
    /**
     * Omit specific fields from the survey_attribute_specific
     */
    omit?: survey_attribute_specificOmit<ExtArgs> | null
    /**
     * The filter to search for the survey_attribute_specific to update in case it exists.
     */
    where: survey_attribute_specificWhereUniqueInput
    /**
     * In case the survey_attribute_specific found by the `where` argument doesn't exist, create a new survey_attribute_specific with this data.
     */
    create: XOR<survey_attribute_specificCreateInput, survey_attribute_specificUncheckedCreateInput>
    /**
     * In case the survey_attribute_specific was found with the provided `where` argument, update it with this data.
     */
    update: XOR<survey_attribute_specificUpdateInput, survey_attribute_specificUncheckedUpdateInput>
  }

  /**
   * survey_attribute_specific delete
   */
  export type survey_attribute_specificDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the survey_attribute_specific
     */
    select?: survey_attribute_specificSelect<ExtArgs> | null
    /**
     * Omit specific fields from the survey_attribute_specific
     */
    omit?: survey_attribute_specificOmit<ExtArgs> | null
    /**
     * Filter which survey_attribute_specific to delete.
     */
    where: survey_attribute_specificWhereUniqueInput
  }

  /**
   * survey_attribute_specific deleteMany
   */
  export type survey_attribute_specificDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which survey_attribute_specifics to delete
     */
    where?: survey_attribute_specificWhereInput
    /**
     * Limit how many survey_attribute_specifics to delete.
     */
    limit?: number
  }

  /**
   * survey_attribute_specific without action
   */
  export type survey_attribute_specificDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the survey_attribute_specific
     */
    select?: survey_attribute_specificSelect<ExtArgs> | null
    /**
     * Omit specific fields from the survey_attribute_specific
     */
    omit?: survey_attribute_specificOmit<ExtArgs> | null
  }


  /**
   * Model users
   */

  export type AggregateUsers = {
    _count: UsersCountAggregateOutputType | null
    _avg: UsersAvgAggregateOutputType | null
    _sum: UsersSumAggregateOutputType | null
    _min: UsersMinAggregateOutputType | null
    _max: UsersMaxAggregateOutputType | null
  }

  export type UsersAvgAggregateOutputType = {
    id: number | null
  }

  export type UsersSumAggregateOutputType = {
    id: number | null
  }

  export type UsersMinAggregateOutputType = {
    id: number | null
    full_name: string | null
    email: string | null
    password_hash: string | null
    role: string | null
    created_at: Date | null
  }

  export type UsersMaxAggregateOutputType = {
    id: number | null
    full_name: string | null
    email: string | null
    password_hash: string | null
    role: string | null
    created_at: Date | null
  }

  export type UsersCountAggregateOutputType = {
    id: number
    full_name: number
    email: number
    password_hash: number
    role: number
    created_at: number
    _all: number
  }


  export type UsersAvgAggregateInputType = {
    id?: true
  }

  export type UsersSumAggregateInputType = {
    id?: true
  }

  export type UsersMinAggregateInputType = {
    id?: true
    full_name?: true
    email?: true
    password_hash?: true
    role?: true
    created_at?: true
  }

  export type UsersMaxAggregateInputType = {
    id?: true
    full_name?: true
    email?: true
    password_hash?: true
    role?: true
    created_at?: true
  }

  export type UsersCountAggregateInputType = {
    id?: true
    full_name?: true
    email?: true
    password_hash?: true
    role?: true
    created_at?: true
    _all?: true
  }

  export type UsersAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which users to aggregate.
     */
    where?: usersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of users to fetch.
     */
    orderBy?: usersOrderByWithRelationInput | usersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: usersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned users
    **/
    _count?: true | UsersCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UsersAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UsersSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UsersMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UsersMaxAggregateInputType
  }

  export type GetUsersAggregateType<T extends UsersAggregateArgs> = {
        [P in keyof T & keyof AggregateUsers]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUsers[P]>
      : GetScalarType<T[P], AggregateUsers[P]>
  }




  export type usersGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: usersWhereInput
    orderBy?: usersOrderByWithAggregationInput | usersOrderByWithAggregationInput[]
    by: UsersScalarFieldEnum[] | UsersScalarFieldEnum
    having?: usersScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UsersCountAggregateInputType | true
    _avg?: UsersAvgAggregateInputType
    _sum?: UsersSumAggregateInputType
    _min?: UsersMinAggregateInputType
    _max?: UsersMaxAggregateInputType
  }

  export type UsersGroupByOutputType = {
    id: number
    full_name: string
    email: string
    password_hash: string
    role: string
    created_at: Date | null
    _count: UsersCountAggregateOutputType | null
    _avg: UsersAvgAggregateOutputType | null
    _sum: UsersSumAggregateOutputType | null
    _min: UsersMinAggregateOutputType | null
    _max: UsersMaxAggregateOutputType | null
  }

  type GetUsersGroupByPayload<T extends usersGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UsersGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UsersGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UsersGroupByOutputType[P]>
            : GetScalarType<T[P], UsersGroupByOutputType[P]>
        }
      >
    >


  export type usersSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    full_name?: boolean
    email?: boolean
    password_hash?: boolean
    role?: boolean
    created_at?: boolean
  }, ExtArgs["result"]["users"]>

  export type usersSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    full_name?: boolean
    email?: boolean
    password_hash?: boolean
    role?: boolean
    created_at?: boolean
  }, ExtArgs["result"]["users"]>

  export type usersSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    full_name?: boolean
    email?: boolean
    password_hash?: boolean
    role?: boolean
    created_at?: boolean
  }, ExtArgs["result"]["users"]>

  export type usersSelectScalar = {
    id?: boolean
    full_name?: boolean
    email?: boolean
    password_hash?: boolean
    role?: boolean
    created_at?: boolean
  }

  export type usersOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "full_name" | "email" | "password_hash" | "role" | "created_at", ExtArgs["result"]["users"]>

  export type $usersPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "users"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      full_name: string
      email: string
      password_hash: string
      role: string
      created_at: Date | null
    }, ExtArgs["result"]["users"]>
    composites: {}
  }

  type usersGetPayload<S extends boolean | null | undefined | usersDefaultArgs> = $Result.GetResult<Prisma.$usersPayload, S>

  type usersCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<usersFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UsersCountAggregateInputType | true
    }

  export interface usersDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['users'], meta: { name: 'users' } }
    /**
     * Find zero or one Users that matches the filter.
     * @param {usersFindUniqueArgs} args - Arguments to find a Users
     * @example
     * // Get one Users
     * const users = await prisma.users.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends usersFindUniqueArgs>(args: SelectSubset<T, usersFindUniqueArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Users that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {usersFindUniqueOrThrowArgs} args - Arguments to find a Users
     * @example
     * // Get one Users
     * const users = await prisma.users.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends usersFindUniqueOrThrowArgs>(args: SelectSubset<T, usersFindUniqueOrThrowArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {usersFindFirstArgs} args - Arguments to find a Users
     * @example
     * // Get one Users
     * const users = await prisma.users.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends usersFindFirstArgs>(args?: SelectSubset<T, usersFindFirstArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Users that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {usersFindFirstOrThrowArgs} args - Arguments to find a Users
     * @example
     * // Get one Users
     * const users = await prisma.users.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends usersFindFirstOrThrowArgs>(args?: SelectSubset<T, usersFindFirstOrThrowArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {usersFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.users.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.users.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const usersWithIdOnly = await prisma.users.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends usersFindManyArgs>(args?: SelectSubset<T, usersFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Users.
     * @param {usersCreateArgs} args - Arguments to create a Users.
     * @example
     * // Create one Users
     * const Users = await prisma.users.create({
     *   data: {
     *     // ... data to create a Users
     *   }
     * })
     * 
     */
    create<T extends usersCreateArgs>(args: SelectSubset<T, usersCreateArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {usersCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const users = await prisma.users.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends usersCreateManyArgs>(args?: SelectSubset<T, usersCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {usersCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const users = await prisma.users.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const usersWithIdOnly = await prisma.users.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends usersCreateManyAndReturnArgs>(args?: SelectSubset<T, usersCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Users.
     * @param {usersDeleteArgs} args - Arguments to delete one Users.
     * @example
     * // Delete one Users
     * const Users = await prisma.users.delete({
     *   where: {
     *     // ... filter to delete one Users
     *   }
     * })
     * 
     */
    delete<T extends usersDeleteArgs>(args: SelectSubset<T, usersDeleteArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Users.
     * @param {usersUpdateArgs} args - Arguments to update one Users.
     * @example
     * // Update one Users
     * const users = await prisma.users.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends usersUpdateArgs>(args: SelectSubset<T, usersUpdateArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {usersDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.users.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends usersDeleteManyArgs>(args?: SelectSubset<T, usersDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {usersUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const users = await prisma.users.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends usersUpdateManyArgs>(args: SelectSubset<T, usersUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {usersUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const users = await prisma.users.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const usersWithIdOnly = await prisma.users.updateManyAndReturn({
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
    updateManyAndReturn<T extends usersUpdateManyAndReturnArgs>(args: SelectSubset<T, usersUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Users.
     * @param {usersUpsertArgs} args - Arguments to update or create a Users.
     * @example
     * // Update or create a Users
     * const users = await prisma.users.upsert({
     *   create: {
     *     // ... data to create a Users
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Users we want to update
     *   }
     * })
     */
    upsert<T extends usersUpsertArgs>(args: SelectSubset<T, usersUpsertArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {usersCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.users.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends usersCountArgs>(
      args?: Subset<T, usersCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UsersCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsersAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends UsersAggregateArgs>(args: Subset<T, UsersAggregateArgs>): Prisma.PrismaPromise<GetUsersAggregateType<T>>

    /**
     * Group by Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {usersGroupByArgs} args - Group by arguments.
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
      T extends usersGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: usersGroupByArgs['orderBy'] }
        : { orderBy?: usersGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, usersGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUsersGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the users model
   */
  readonly fields: usersFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for users.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__usersClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the users model
   */
  interface usersFieldRefs {
    readonly id: FieldRef<"users", 'Int'>
    readonly full_name: FieldRef<"users", 'String'>
    readonly email: FieldRef<"users", 'String'>
    readonly password_hash: FieldRef<"users", 'String'>
    readonly role: FieldRef<"users", 'String'>
    readonly created_at: FieldRef<"users", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * users findUnique
   */
  export type usersFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Filter, which users to fetch.
     */
    where: usersWhereUniqueInput
  }

  /**
   * users findUniqueOrThrow
   */
  export type usersFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Filter, which users to fetch.
     */
    where: usersWhereUniqueInput
  }

  /**
   * users findFirst
   */
  export type usersFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Filter, which users to fetch.
     */
    where?: usersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of users to fetch.
     */
    orderBy?: usersOrderByWithRelationInput | usersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for users.
     */
    cursor?: usersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of users.
     */
    distinct?: UsersScalarFieldEnum | UsersScalarFieldEnum[]
  }

  /**
   * users findFirstOrThrow
   */
  export type usersFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Filter, which users to fetch.
     */
    where?: usersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of users to fetch.
     */
    orderBy?: usersOrderByWithRelationInput | usersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for users.
     */
    cursor?: usersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of users.
     */
    distinct?: UsersScalarFieldEnum | UsersScalarFieldEnum[]
  }

  /**
   * users findMany
   */
  export type usersFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Filter, which users to fetch.
     */
    where?: usersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of users to fetch.
     */
    orderBy?: usersOrderByWithRelationInput | usersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing users.
     */
    cursor?: usersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` users.
     */
    skip?: number
    distinct?: UsersScalarFieldEnum | UsersScalarFieldEnum[]
  }

  /**
   * users create
   */
  export type usersCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * The data needed to create a users.
     */
    data: XOR<usersCreateInput, usersUncheckedCreateInput>
  }

  /**
   * users createMany
   */
  export type usersCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many users.
     */
    data: usersCreateManyInput | usersCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * users createManyAndReturn
   */
  export type usersCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * The data used to create many users.
     */
    data: usersCreateManyInput | usersCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * users update
   */
  export type usersUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * The data needed to update a users.
     */
    data: XOR<usersUpdateInput, usersUncheckedUpdateInput>
    /**
     * Choose, which users to update.
     */
    where: usersWhereUniqueInput
  }

  /**
   * users updateMany
   */
  export type usersUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update users.
     */
    data: XOR<usersUpdateManyMutationInput, usersUncheckedUpdateManyInput>
    /**
     * Filter which users to update
     */
    where?: usersWhereInput
    /**
     * Limit how many users to update.
     */
    limit?: number
  }

  /**
   * users updateManyAndReturn
   */
  export type usersUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * The data used to update users.
     */
    data: XOR<usersUpdateManyMutationInput, usersUncheckedUpdateManyInput>
    /**
     * Filter which users to update
     */
    where?: usersWhereInput
    /**
     * Limit how many users to update.
     */
    limit?: number
  }

  /**
   * users upsert
   */
  export type usersUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * The filter to search for the users to update in case it exists.
     */
    where: usersWhereUniqueInput
    /**
     * In case the users found by the `where` argument doesn't exist, create a new users with this data.
     */
    create: XOR<usersCreateInput, usersUncheckedCreateInput>
    /**
     * In case the users was found with the provided `where` argument, update it with this data.
     */
    update: XOR<usersUpdateInput, usersUncheckedUpdateInput>
  }

  /**
   * users delete
   */
  export type usersDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Filter which users to delete.
     */
    where: usersWhereUniqueInput
  }

  /**
   * users deleteMany
   */
  export type usersDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which users to delete
     */
    where?: usersWhereInput
    /**
     * Limit how many users to delete.
     */
    limit?: number
  }

  /**
   * users without action
   */
  export type usersDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
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


  export const ModeratorScalarFieldEnum: {
    id: 'id',
    username: 'username',
    password: 'password',
    role: 'role',
    createdAt: 'createdAt'
  };

  export type ModeratorScalarFieldEnum = (typeof ModeratorScalarFieldEnum)[keyof typeof ModeratorScalarFieldEnum]


  export const RFIDMappingScalarFieldEnum: {
    id: 'id',
    slno: 'slno',
    phoneNumber: 'phoneNumber',
    rfid: 'rfid',
    wasteType: 'wasteType',
    createdAt: 'createdAt'
  };

  export type RFIDMappingScalarFieldEnum = (typeof RFIDMappingScalarFieldEnum)[keyof typeof RFIDMappingScalarFieldEnum]


  export const TrackingLogScalarFieldEnum: {
    id: 'id',
    workerId: 'workerId',
    slno: 'slno',
    citizenName: 'citizenName',
    phoneNumber: 'phoneNumber',
    remarks: 'remarks',
    createdAt: 'createdAt',
    address: 'address',
    buildingNo: 'buildingNo',
    drySlno: 'drySlno',
    floorNo: 'floorNo',
    latitude: 'latitude',
    longitude: 'longitude',
    photoUrl: 'photoUrl',
    updatedAt: 'updatedAt',
    wetSlno: 'wetSlno',
    status: 'status'
  };

  export type TrackingLogScalarFieldEnum = (typeof TrackingLogScalarFieldEnum)[keyof typeof TrackingLogScalarFieldEnum]


  export const Master_citizen_dataScalarFieldEnum: {
    id: 'id',
    phoneNumber: 'phoneNumber',
    city: 'city',
    ward: 'ward',
    area: 'area',
    wasteGeneratorTypes: 'wasteGeneratorTypes',
    houseNumber: 'houseNumber',
    floorNumber: 'floorNumber',
    householdType: 'householdType',
    personName: 'personName',
    contactNumber: 'contactNumber',
    numberOfPeople: 'numberOfPeople',
    buildingPhoto: 'buildingPhoto',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    dryRFID: 'dryRFID',
    drySlno: 'drySlno',
    wetRFID: 'wetRFID',
    wetSlno: 'wetSlno',
    lat: 'lat',
    lng: 'lng'
  };

  export type Master_citizen_dataScalarFieldEnum = (typeof Master_citizen_dataScalarFieldEnum)[keyof typeof Master_citizen_dataScalarFieldEnum]


  export const Survey_attribute_specificScalarFieldEnum: {
    city: 'city',
    ward: 'ward',
    area: 'area',
    wasteGeneratorTypes: 'wasteGeneratorTypes',
    houseNumber: 'houseNumber',
    floorNumber: 'floorNumber',
    householdType: 'householdType',
    personName: 'personName',
    contactNumber: 'contactNumber',
    numberOfPeople: 'numberOfPeople',
    buildingPhoto: 'buildingPhoto',
    id: 'id',
    lat: 'lat',
    lng: 'lng',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type Survey_attribute_specificScalarFieldEnum = (typeof Survey_attribute_specificScalarFieldEnum)[keyof typeof Survey_attribute_specificScalarFieldEnum]


  export const UsersScalarFieldEnum: {
    id: 'id',
    full_name: 'full_name',
    email: 'email',
    password_hash: 'password_hash',
    role: 'role',
    created_at: 'created_at'
  };

  export type UsersScalarFieldEnum = (typeof UsersScalarFieldEnum)[keyof typeof UsersScalarFieldEnum]


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
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'WasteType'
   */
  export type EnumWasteTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'WasteType'>
    


  /**
   * Reference to a field of type 'WasteType[]'
   */
  export type ListEnumWasteTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'WasteType[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'TrackingStatus'
   */
  export type EnumTrackingStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TrackingStatus'>
    


  /**
   * Reference to a field of type 'TrackingStatus[]'
   */
  export type ListEnumTrackingStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TrackingStatus[]'>
    


  /**
   * Reference to a field of type 'Decimal'
   */
  export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>
    


  /**
   * Reference to a field of type 'Decimal[]'
   */
  export type ListDecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal[]'>
    
  /**
   * Deep Input Types
   */


  export type ModeratorWhereInput = {
    AND?: ModeratorWhereInput | ModeratorWhereInput[]
    OR?: ModeratorWhereInput[]
    NOT?: ModeratorWhereInput | ModeratorWhereInput[]
    id?: IntFilter<"Moderator"> | number
    username?: StringFilter<"Moderator"> | string
    password?: StringFilter<"Moderator"> | string
    role?: StringFilter<"Moderator"> | string
    createdAt?: DateTimeFilter<"Moderator"> | Date | string
  }

  export type ModeratorOrderByWithRelationInput = {
    id?: SortOrder
    username?: SortOrder
    password?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
  }

  export type ModeratorWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    username?: string
    AND?: ModeratorWhereInput | ModeratorWhereInput[]
    OR?: ModeratorWhereInput[]
    NOT?: ModeratorWhereInput | ModeratorWhereInput[]
    password?: StringFilter<"Moderator"> | string
    role?: StringFilter<"Moderator"> | string
    createdAt?: DateTimeFilter<"Moderator"> | Date | string
  }, "id" | "username">

  export type ModeratorOrderByWithAggregationInput = {
    id?: SortOrder
    username?: SortOrder
    password?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    _count?: ModeratorCountOrderByAggregateInput
    _avg?: ModeratorAvgOrderByAggregateInput
    _max?: ModeratorMaxOrderByAggregateInput
    _min?: ModeratorMinOrderByAggregateInput
    _sum?: ModeratorSumOrderByAggregateInput
  }

  export type ModeratorScalarWhereWithAggregatesInput = {
    AND?: ModeratorScalarWhereWithAggregatesInput | ModeratorScalarWhereWithAggregatesInput[]
    OR?: ModeratorScalarWhereWithAggregatesInput[]
    NOT?: ModeratorScalarWhereWithAggregatesInput | ModeratorScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Moderator"> | number
    username?: StringWithAggregatesFilter<"Moderator"> | string
    password?: StringWithAggregatesFilter<"Moderator"> | string
    role?: StringWithAggregatesFilter<"Moderator"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Moderator"> | Date | string
  }

  export type RFIDMappingWhereInput = {
    AND?: RFIDMappingWhereInput | RFIDMappingWhereInput[]
    OR?: RFIDMappingWhereInput[]
    NOT?: RFIDMappingWhereInput | RFIDMappingWhereInput[]
    id?: IntFilter<"RFIDMapping"> | number
    slno?: StringFilter<"RFIDMapping"> | string
    phoneNumber?: StringNullableFilter<"RFIDMapping"> | string | null
    rfid?: StringFilter<"RFIDMapping"> | string
    wasteType?: EnumWasteTypeNullableFilter<"RFIDMapping"> | $Enums.WasteType | null
    createdAt?: DateTimeFilter<"RFIDMapping"> | Date | string
  }

  export type RFIDMappingOrderByWithRelationInput = {
    id?: SortOrder
    slno?: SortOrder
    phoneNumber?: SortOrderInput | SortOrder
    rfid?: SortOrder
    wasteType?: SortOrderInput | SortOrder
    createdAt?: SortOrder
  }

  export type RFIDMappingWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    rfid?: string
    slno_wasteType?: RFIDMappingSlnoWasteTypeCompoundUniqueInput
    AND?: RFIDMappingWhereInput | RFIDMappingWhereInput[]
    OR?: RFIDMappingWhereInput[]
    NOT?: RFIDMappingWhereInput | RFIDMappingWhereInput[]
    slno?: StringFilter<"RFIDMapping"> | string
    phoneNumber?: StringNullableFilter<"RFIDMapping"> | string | null
    wasteType?: EnumWasteTypeNullableFilter<"RFIDMapping"> | $Enums.WasteType | null
    createdAt?: DateTimeFilter<"RFIDMapping"> | Date | string
  }, "id" | "rfid" | "slno_wasteType">

  export type RFIDMappingOrderByWithAggregationInput = {
    id?: SortOrder
    slno?: SortOrder
    phoneNumber?: SortOrderInput | SortOrder
    rfid?: SortOrder
    wasteType?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: RFIDMappingCountOrderByAggregateInput
    _avg?: RFIDMappingAvgOrderByAggregateInput
    _max?: RFIDMappingMaxOrderByAggregateInput
    _min?: RFIDMappingMinOrderByAggregateInput
    _sum?: RFIDMappingSumOrderByAggregateInput
  }

  export type RFIDMappingScalarWhereWithAggregatesInput = {
    AND?: RFIDMappingScalarWhereWithAggregatesInput | RFIDMappingScalarWhereWithAggregatesInput[]
    OR?: RFIDMappingScalarWhereWithAggregatesInput[]
    NOT?: RFIDMappingScalarWhereWithAggregatesInput | RFIDMappingScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"RFIDMapping"> | number
    slno?: StringWithAggregatesFilter<"RFIDMapping"> | string
    phoneNumber?: StringNullableWithAggregatesFilter<"RFIDMapping"> | string | null
    rfid?: StringWithAggregatesFilter<"RFIDMapping"> | string
    wasteType?: EnumWasteTypeNullableWithAggregatesFilter<"RFIDMapping"> | $Enums.WasteType | null
    createdAt?: DateTimeWithAggregatesFilter<"RFIDMapping"> | Date | string
  }

  export type TrackingLogWhereInput = {
    AND?: TrackingLogWhereInput | TrackingLogWhereInput[]
    OR?: TrackingLogWhereInput[]
    NOT?: TrackingLogWhereInput | TrackingLogWhereInput[]
    id?: IntFilter<"TrackingLog"> | number
    workerId?: StringFilter<"TrackingLog"> | string
    slno?: StringNullableFilter<"TrackingLog"> | string | null
    citizenName?: StringNullableFilter<"TrackingLog"> | string | null
    phoneNumber?: StringNullableFilter<"TrackingLog"> | string | null
    remarks?: StringNullableFilter<"TrackingLog"> | string | null
    createdAt?: DateTimeFilter<"TrackingLog"> | Date | string
    address?: StringNullableFilter<"TrackingLog"> | string | null
    buildingNo?: StringNullableFilter<"TrackingLog"> | string | null
    drySlno?: StringNullableFilter<"TrackingLog"> | string | null
    floorNo?: StringNullableFilter<"TrackingLog"> | string | null
    latitude?: FloatNullableFilter<"TrackingLog"> | number | null
    longitude?: FloatNullableFilter<"TrackingLog"> | number | null
    photoUrl?: StringNullableFilter<"TrackingLog"> | string | null
    updatedAt?: DateTimeFilter<"TrackingLog"> | Date | string
    wetSlno?: StringNullableFilter<"TrackingLog"> | string | null
    status?: EnumTrackingStatusFilter<"TrackingLog"> | $Enums.TrackingStatus
  }

  export type TrackingLogOrderByWithRelationInput = {
    id?: SortOrder
    workerId?: SortOrder
    slno?: SortOrderInput | SortOrder
    citizenName?: SortOrderInput | SortOrder
    phoneNumber?: SortOrderInput | SortOrder
    remarks?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    address?: SortOrderInput | SortOrder
    buildingNo?: SortOrderInput | SortOrder
    drySlno?: SortOrderInput | SortOrder
    floorNo?: SortOrderInput | SortOrder
    latitude?: SortOrderInput | SortOrder
    longitude?: SortOrderInput | SortOrder
    photoUrl?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
    wetSlno?: SortOrderInput | SortOrder
    status?: SortOrder
  }

  export type TrackingLogWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: TrackingLogWhereInput | TrackingLogWhereInput[]
    OR?: TrackingLogWhereInput[]
    NOT?: TrackingLogWhereInput | TrackingLogWhereInput[]
    workerId?: StringFilter<"TrackingLog"> | string
    slno?: StringNullableFilter<"TrackingLog"> | string | null
    citizenName?: StringNullableFilter<"TrackingLog"> | string | null
    phoneNumber?: StringNullableFilter<"TrackingLog"> | string | null
    remarks?: StringNullableFilter<"TrackingLog"> | string | null
    createdAt?: DateTimeFilter<"TrackingLog"> | Date | string
    address?: StringNullableFilter<"TrackingLog"> | string | null
    buildingNo?: StringNullableFilter<"TrackingLog"> | string | null
    drySlno?: StringNullableFilter<"TrackingLog"> | string | null
    floorNo?: StringNullableFilter<"TrackingLog"> | string | null
    latitude?: FloatNullableFilter<"TrackingLog"> | number | null
    longitude?: FloatNullableFilter<"TrackingLog"> | number | null
    photoUrl?: StringNullableFilter<"TrackingLog"> | string | null
    updatedAt?: DateTimeFilter<"TrackingLog"> | Date | string
    wetSlno?: StringNullableFilter<"TrackingLog"> | string | null
    status?: EnumTrackingStatusFilter<"TrackingLog"> | $Enums.TrackingStatus
  }, "id">

  export type TrackingLogOrderByWithAggregationInput = {
    id?: SortOrder
    workerId?: SortOrder
    slno?: SortOrderInput | SortOrder
    citizenName?: SortOrderInput | SortOrder
    phoneNumber?: SortOrderInput | SortOrder
    remarks?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    address?: SortOrderInput | SortOrder
    buildingNo?: SortOrderInput | SortOrder
    drySlno?: SortOrderInput | SortOrder
    floorNo?: SortOrderInput | SortOrder
    latitude?: SortOrderInput | SortOrder
    longitude?: SortOrderInput | SortOrder
    photoUrl?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
    wetSlno?: SortOrderInput | SortOrder
    status?: SortOrder
    _count?: TrackingLogCountOrderByAggregateInput
    _avg?: TrackingLogAvgOrderByAggregateInput
    _max?: TrackingLogMaxOrderByAggregateInput
    _min?: TrackingLogMinOrderByAggregateInput
    _sum?: TrackingLogSumOrderByAggregateInput
  }

  export type TrackingLogScalarWhereWithAggregatesInput = {
    AND?: TrackingLogScalarWhereWithAggregatesInput | TrackingLogScalarWhereWithAggregatesInput[]
    OR?: TrackingLogScalarWhereWithAggregatesInput[]
    NOT?: TrackingLogScalarWhereWithAggregatesInput | TrackingLogScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"TrackingLog"> | number
    workerId?: StringWithAggregatesFilter<"TrackingLog"> | string
    slno?: StringNullableWithAggregatesFilter<"TrackingLog"> | string | null
    citizenName?: StringNullableWithAggregatesFilter<"TrackingLog"> | string | null
    phoneNumber?: StringNullableWithAggregatesFilter<"TrackingLog"> | string | null
    remarks?: StringNullableWithAggregatesFilter<"TrackingLog"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"TrackingLog"> | Date | string
    address?: StringNullableWithAggregatesFilter<"TrackingLog"> | string | null
    buildingNo?: StringNullableWithAggregatesFilter<"TrackingLog"> | string | null
    drySlno?: StringNullableWithAggregatesFilter<"TrackingLog"> | string | null
    floorNo?: StringNullableWithAggregatesFilter<"TrackingLog"> | string | null
    latitude?: FloatNullableWithAggregatesFilter<"TrackingLog"> | number | null
    longitude?: FloatNullableWithAggregatesFilter<"TrackingLog"> | number | null
    photoUrl?: StringNullableWithAggregatesFilter<"TrackingLog"> | string | null
    updatedAt?: DateTimeWithAggregatesFilter<"TrackingLog"> | Date | string
    wetSlno?: StringNullableWithAggregatesFilter<"TrackingLog"> | string | null
    status?: EnumTrackingStatusWithAggregatesFilter<"TrackingLog"> | $Enums.TrackingStatus
  }

  export type master_citizen_dataWhereInput = {
    AND?: master_citizen_dataWhereInput | master_citizen_dataWhereInput[]
    OR?: master_citizen_dataWhereInput[]
    NOT?: master_citizen_dataWhereInput | master_citizen_dataWhereInput[]
    id?: IntFilter<"master_citizen_data"> | number
    phoneNumber?: StringFilter<"master_citizen_data"> | string
    city?: StringNullableFilter<"master_citizen_data"> | string | null
    ward?: StringNullableFilter<"master_citizen_data"> | string | null
    area?: StringNullableFilter<"master_citizen_data"> | string | null
    wasteGeneratorTypes?: StringNullableFilter<"master_citizen_data"> | string | null
    houseNumber?: StringNullableFilter<"master_citizen_data"> | string | null
    floorNumber?: StringNullableFilter<"master_citizen_data"> | string | null
    householdType?: StringNullableFilter<"master_citizen_data"> | string | null
    personName?: StringNullableFilter<"master_citizen_data"> | string | null
    contactNumber?: StringNullableFilter<"master_citizen_data"> | string | null
    numberOfPeople?: StringNullableFilter<"master_citizen_data"> | string | null
    buildingPhoto?: StringNullableFilter<"master_citizen_data"> | string | null
    createdAt?: DateTimeFilter<"master_citizen_data"> | Date | string
    updatedAt?: DateTimeFilter<"master_citizen_data"> | Date | string
    dryRFID?: StringNullableFilter<"master_citizen_data"> | string | null
    drySlno?: StringNullableFilter<"master_citizen_data"> | string | null
    wetRFID?: StringNullableFilter<"master_citizen_data"> | string | null
    wetSlno?: StringNullableFilter<"master_citizen_data"> | string | null
    lat?: DecimalNullableFilter<"master_citizen_data"> | Decimal | DecimalJsLike | number | string | null
    lng?: DecimalNullableFilter<"master_citizen_data"> | Decimal | DecimalJsLike | number | string | null
  }

  export type master_citizen_dataOrderByWithRelationInput = {
    id?: SortOrder
    phoneNumber?: SortOrder
    city?: SortOrderInput | SortOrder
    ward?: SortOrderInput | SortOrder
    area?: SortOrderInput | SortOrder
    wasteGeneratorTypes?: SortOrderInput | SortOrder
    houseNumber?: SortOrderInput | SortOrder
    floorNumber?: SortOrderInput | SortOrder
    householdType?: SortOrderInput | SortOrder
    personName?: SortOrderInput | SortOrder
    contactNumber?: SortOrderInput | SortOrder
    numberOfPeople?: SortOrderInput | SortOrder
    buildingPhoto?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    dryRFID?: SortOrderInput | SortOrder
    drySlno?: SortOrderInput | SortOrder
    wetRFID?: SortOrderInput | SortOrder
    wetSlno?: SortOrderInput | SortOrder
    lat?: SortOrderInput | SortOrder
    lng?: SortOrderInput | SortOrder
  }

  export type master_citizen_dataWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    phoneNumber?: string
    AND?: master_citizen_dataWhereInput | master_citizen_dataWhereInput[]
    OR?: master_citizen_dataWhereInput[]
    NOT?: master_citizen_dataWhereInput | master_citizen_dataWhereInput[]
    city?: StringNullableFilter<"master_citizen_data"> | string | null
    ward?: StringNullableFilter<"master_citizen_data"> | string | null
    area?: StringNullableFilter<"master_citizen_data"> | string | null
    wasteGeneratorTypes?: StringNullableFilter<"master_citizen_data"> | string | null
    houseNumber?: StringNullableFilter<"master_citizen_data"> | string | null
    floorNumber?: StringNullableFilter<"master_citizen_data"> | string | null
    householdType?: StringNullableFilter<"master_citizen_data"> | string | null
    personName?: StringNullableFilter<"master_citizen_data"> | string | null
    contactNumber?: StringNullableFilter<"master_citizen_data"> | string | null
    numberOfPeople?: StringNullableFilter<"master_citizen_data"> | string | null
    buildingPhoto?: StringNullableFilter<"master_citizen_data"> | string | null
    createdAt?: DateTimeFilter<"master_citizen_data"> | Date | string
    updatedAt?: DateTimeFilter<"master_citizen_data"> | Date | string
    dryRFID?: StringNullableFilter<"master_citizen_data"> | string | null
    drySlno?: StringNullableFilter<"master_citizen_data"> | string | null
    wetRFID?: StringNullableFilter<"master_citizen_data"> | string | null
    wetSlno?: StringNullableFilter<"master_citizen_data"> | string | null
    lat?: DecimalNullableFilter<"master_citizen_data"> | Decimal | DecimalJsLike | number | string | null
    lng?: DecimalNullableFilter<"master_citizen_data"> | Decimal | DecimalJsLike | number | string | null
  }, "id" | "phoneNumber">

  export type master_citizen_dataOrderByWithAggregationInput = {
    id?: SortOrder
    phoneNumber?: SortOrder
    city?: SortOrderInput | SortOrder
    ward?: SortOrderInput | SortOrder
    area?: SortOrderInput | SortOrder
    wasteGeneratorTypes?: SortOrderInput | SortOrder
    houseNumber?: SortOrderInput | SortOrder
    floorNumber?: SortOrderInput | SortOrder
    householdType?: SortOrderInput | SortOrder
    personName?: SortOrderInput | SortOrder
    contactNumber?: SortOrderInput | SortOrder
    numberOfPeople?: SortOrderInput | SortOrder
    buildingPhoto?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    dryRFID?: SortOrderInput | SortOrder
    drySlno?: SortOrderInput | SortOrder
    wetRFID?: SortOrderInput | SortOrder
    wetSlno?: SortOrderInput | SortOrder
    lat?: SortOrderInput | SortOrder
    lng?: SortOrderInput | SortOrder
    _count?: master_citizen_dataCountOrderByAggregateInput
    _avg?: master_citizen_dataAvgOrderByAggregateInput
    _max?: master_citizen_dataMaxOrderByAggregateInput
    _min?: master_citizen_dataMinOrderByAggregateInput
    _sum?: master_citizen_dataSumOrderByAggregateInput
  }

  export type master_citizen_dataScalarWhereWithAggregatesInput = {
    AND?: master_citizen_dataScalarWhereWithAggregatesInput | master_citizen_dataScalarWhereWithAggregatesInput[]
    OR?: master_citizen_dataScalarWhereWithAggregatesInput[]
    NOT?: master_citizen_dataScalarWhereWithAggregatesInput | master_citizen_dataScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"master_citizen_data"> | number
    phoneNumber?: StringWithAggregatesFilter<"master_citizen_data"> | string
    city?: StringNullableWithAggregatesFilter<"master_citizen_data"> | string | null
    ward?: StringNullableWithAggregatesFilter<"master_citizen_data"> | string | null
    area?: StringNullableWithAggregatesFilter<"master_citizen_data"> | string | null
    wasteGeneratorTypes?: StringNullableWithAggregatesFilter<"master_citizen_data"> | string | null
    houseNumber?: StringNullableWithAggregatesFilter<"master_citizen_data"> | string | null
    floorNumber?: StringNullableWithAggregatesFilter<"master_citizen_data"> | string | null
    householdType?: StringNullableWithAggregatesFilter<"master_citizen_data"> | string | null
    personName?: StringNullableWithAggregatesFilter<"master_citizen_data"> | string | null
    contactNumber?: StringNullableWithAggregatesFilter<"master_citizen_data"> | string | null
    numberOfPeople?: StringNullableWithAggregatesFilter<"master_citizen_data"> | string | null
    buildingPhoto?: StringNullableWithAggregatesFilter<"master_citizen_data"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"master_citizen_data"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"master_citizen_data"> | Date | string
    dryRFID?: StringNullableWithAggregatesFilter<"master_citizen_data"> | string | null
    drySlno?: StringNullableWithAggregatesFilter<"master_citizen_data"> | string | null
    wetRFID?: StringNullableWithAggregatesFilter<"master_citizen_data"> | string | null
    wetSlno?: StringNullableWithAggregatesFilter<"master_citizen_data"> | string | null
    lat?: DecimalNullableWithAggregatesFilter<"master_citizen_data"> | Decimal | DecimalJsLike | number | string | null
    lng?: DecimalNullableWithAggregatesFilter<"master_citizen_data"> | Decimal | DecimalJsLike | number | string | null
  }

  export type survey_attribute_specificWhereInput = {
    AND?: survey_attribute_specificWhereInput | survey_attribute_specificWhereInput[]
    OR?: survey_attribute_specificWhereInput[]
    NOT?: survey_attribute_specificWhereInput | survey_attribute_specificWhereInput[]
    city?: StringNullableFilter<"survey_attribute_specific"> | string | null
    ward?: StringNullableFilter<"survey_attribute_specific"> | string | null
    area?: StringNullableFilter<"survey_attribute_specific"> | string | null
    wasteGeneratorTypes?: StringNullableFilter<"survey_attribute_specific"> | string | null
    houseNumber?: StringNullableFilter<"survey_attribute_specific"> | string | null
    floorNumber?: StringNullableFilter<"survey_attribute_specific"> | string | null
    householdType?: StringNullableFilter<"survey_attribute_specific"> | string | null
    personName?: StringNullableFilter<"survey_attribute_specific"> | string | null
    contactNumber?: StringNullableFilter<"survey_attribute_specific"> | string | null
    numberOfPeople?: StringNullableFilter<"survey_attribute_specific"> | string | null
    buildingPhoto?: StringNullableFilter<"survey_attribute_specific"> | string | null
    id?: IntFilter<"survey_attribute_specific"> | number
    lat?: DecimalNullableFilter<"survey_attribute_specific"> | Decimal | DecimalJsLike | number | string | null
    lng?: DecimalNullableFilter<"survey_attribute_specific"> | Decimal | DecimalJsLike | number | string | null
    createdAt?: DateTimeFilter<"survey_attribute_specific"> | Date | string
    updatedAt?: DateTimeFilter<"survey_attribute_specific"> | Date | string
  }

  export type survey_attribute_specificOrderByWithRelationInput = {
    city?: SortOrderInput | SortOrder
    ward?: SortOrderInput | SortOrder
    area?: SortOrderInput | SortOrder
    wasteGeneratorTypes?: SortOrderInput | SortOrder
    houseNumber?: SortOrderInput | SortOrder
    floorNumber?: SortOrderInput | SortOrder
    householdType?: SortOrderInput | SortOrder
    personName?: SortOrderInput | SortOrder
    contactNumber?: SortOrderInput | SortOrder
    numberOfPeople?: SortOrderInput | SortOrder
    buildingPhoto?: SortOrderInput | SortOrder
    id?: SortOrder
    lat?: SortOrderInput | SortOrder
    lng?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type survey_attribute_specificWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: survey_attribute_specificWhereInput | survey_attribute_specificWhereInput[]
    OR?: survey_attribute_specificWhereInput[]
    NOT?: survey_attribute_specificWhereInput | survey_attribute_specificWhereInput[]
    city?: StringNullableFilter<"survey_attribute_specific"> | string | null
    ward?: StringNullableFilter<"survey_attribute_specific"> | string | null
    area?: StringNullableFilter<"survey_attribute_specific"> | string | null
    wasteGeneratorTypes?: StringNullableFilter<"survey_attribute_specific"> | string | null
    houseNumber?: StringNullableFilter<"survey_attribute_specific"> | string | null
    floorNumber?: StringNullableFilter<"survey_attribute_specific"> | string | null
    householdType?: StringNullableFilter<"survey_attribute_specific"> | string | null
    personName?: StringNullableFilter<"survey_attribute_specific"> | string | null
    contactNumber?: StringNullableFilter<"survey_attribute_specific"> | string | null
    numberOfPeople?: StringNullableFilter<"survey_attribute_specific"> | string | null
    buildingPhoto?: StringNullableFilter<"survey_attribute_specific"> | string | null
    lat?: DecimalNullableFilter<"survey_attribute_specific"> | Decimal | DecimalJsLike | number | string | null
    lng?: DecimalNullableFilter<"survey_attribute_specific"> | Decimal | DecimalJsLike | number | string | null
    createdAt?: DateTimeFilter<"survey_attribute_specific"> | Date | string
    updatedAt?: DateTimeFilter<"survey_attribute_specific"> | Date | string
  }, "id">

  export type survey_attribute_specificOrderByWithAggregationInput = {
    city?: SortOrderInput | SortOrder
    ward?: SortOrderInput | SortOrder
    area?: SortOrderInput | SortOrder
    wasteGeneratorTypes?: SortOrderInput | SortOrder
    houseNumber?: SortOrderInput | SortOrder
    floorNumber?: SortOrderInput | SortOrder
    householdType?: SortOrderInput | SortOrder
    personName?: SortOrderInput | SortOrder
    contactNumber?: SortOrderInput | SortOrder
    numberOfPeople?: SortOrderInput | SortOrder
    buildingPhoto?: SortOrderInput | SortOrder
    id?: SortOrder
    lat?: SortOrderInput | SortOrder
    lng?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: survey_attribute_specificCountOrderByAggregateInput
    _avg?: survey_attribute_specificAvgOrderByAggregateInput
    _max?: survey_attribute_specificMaxOrderByAggregateInput
    _min?: survey_attribute_specificMinOrderByAggregateInput
    _sum?: survey_attribute_specificSumOrderByAggregateInput
  }

  export type survey_attribute_specificScalarWhereWithAggregatesInput = {
    AND?: survey_attribute_specificScalarWhereWithAggregatesInput | survey_attribute_specificScalarWhereWithAggregatesInput[]
    OR?: survey_attribute_specificScalarWhereWithAggregatesInput[]
    NOT?: survey_attribute_specificScalarWhereWithAggregatesInput | survey_attribute_specificScalarWhereWithAggregatesInput[]
    city?: StringNullableWithAggregatesFilter<"survey_attribute_specific"> | string | null
    ward?: StringNullableWithAggregatesFilter<"survey_attribute_specific"> | string | null
    area?: StringNullableWithAggregatesFilter<"survey_attribute_specific"> | string | null
    wasteGeneratorTypes?: StringNullableWithAggregatesFilter<"survey_attribute_specific"> | string | null
    houseNumber?: StringNullableWithAggregatesFilter<"survey_attribute_specific"> | string | null
    floorNumber?: StringNullableWithAggregatesFilter<"survey_attribute_specific"> | string | null
    householdType?: StringNullableWithAggregatesFilter<"survey_attribute_specific"> | string | null
    personName?: StringNullableWithAggregatesFilter<"survey_attribute_specific"> | string | null
    contactNumber?: StringNullableWithAggregatesFilter<"survey_attribute_specific"> | string | null
    numberOfPeople?: StringNullableWithAggregatesFilter<"survey_attribute_specific"> | string | null
    buildingPhoto?: StringNullableWithAggregatesFilter<"survey_attribute_specific"> | string | null
    id?: IntWithAggregatesFilter<"survey_attribute_specific"> | number
    lat?: DecimalNullableWithAggregatesFilter<"survey_attribute_specific"> | Decimal | DecimalJsLike | number | string | null
    lng?: DecimalNullableWithAggregatesFilter<"survey_attribute_specific"> | Decimal | DecimalJsLike | number | string | null
    createdAt?: DateTimeWithAggregatesFilter<"survey_attribute_specific"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"survey_attribute_specific"> | Date | string
  }

  export type usersWhereInput = {
    AND?: usersWhereInput | usersWhereInput[]
    OR?: usersWhereInput[]
    NOT?: usersWhereInput | usersWhereInput[]
    id?: IntFilter<"users"> | number
    full_name?: StringFilter<"users"> | string
    email?: StringFilter<"users"> | string
    password_hash?: StringFilter<"users"> | string
    role?: StringFilter<"users"> | string
    created_at?: DateTimeNullableFilter<"users"> | Date | string | null
  }

  export type usersOrderByWithRelationInput = {
    id?: SortOrder
    full_name?: SortOrder
    email?: SortOrder
    password_hash?: SortOrder
    role?: SortOrder
    created_at?: SortOrderInput | SortOrder
  }

  export type usersWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    email?: string
    AND?: usersWhereInput | usersWhereInput[]
    OR?: usersWhereInput[]
    NOT?: usersWhereInput | usersWhereInput[]
    full_name?: StringFilter<"users"> | string
    password_hash?: StringFilter<"users"> | string
    role?: StringFilter<"users"> | string
    created_at?: DateTimeNullableFilter<"users"> | Date | string | null
  }, "id" | "email">

  export type usersOrderByWithAggregationInput = {
    id?: SortOrder
    full_name?: SortOrder
    email?: SortOrder
    password_hash?: SortOrder
    role?: SortOrder
    created_at?: SortOrderInput | SortOrder
    _count?: usersCountOrderByAggregateInput
    _avg?: usersAvgOrderByAggregateInput
    _max?: usersMaxOrderByAggregateInput
    _min?: usersMinOrderByAggregateInput
    _sum?: usersSumOrderByAggregateInput
  }

  export type usersScalarWhereWithAggregatesInput = {
    AND?: usersScalarWhereWithAggregatesInput | usersScalarWhereWithAggregatesInput[]
    OR?: usersScalarWhereWithAggregatesInput[]
    NOT?: usersScalarWhereWithAggregatesInput | usersScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"users"> | number
    full_name?: StringWithAggregatesFilter<"users"> | string
    email?: StringWithAggregatesFilter<"users"> | string
    password_hash?: StringWithAggregatesFilter<"users"> | string
    role?: StringWithAggregatesFilter<"users"> | string
    created_at?: DateTimeNullableWithAggregatesFilter<"users"> | Date | string | null
  }

  export type ModeratorCreateInput = {
    username: string
    password: string
    role?: string
    createdAt?: Date | string
  }

  export type ModeratorUncheckedCreateInput = {
    id?: number
    username: string
    password: string
    role?: string
    createdAt?: Date | string
  }

  export type ModeratorUpdateInput = {
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ModeratorUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ModeratorCreateManyInput = {
    id?: number
    username: string
    password: string
    role?: string
    createdAt?: Date | string
  }

  export type ModeratorUpdateManyMutationInput = {
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ModeratorUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RFIDMappingCreateInput = {
    slno: string
    phoneNumber?: string | null
    rfid: string
    wasteType?: $Enums.WasteType | null
    createdAt?: Date | string
  }

  export type RFIDMappingUncheckedCreateInput = {
    id?: number
    slno: string
    phoneNumber?: string | null
    rfid: string
    wasteType?: $Enums.WasteType | null
    createdAt?: Date | string
  }

  export type RFIDMappingUpdateInput = {
    slno?: StringFieldUpdateOperationsInput | string
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    rfid?: StringFieldUpdateOperationsInput | string
    wasteType?: NullableEnumWasteTypeFieldUpdateOperationsInput | $Enums.WasteType | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RFIDMappingUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    slno?: StringFieldUpdateOperationsInput | string
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    rfid?: StringFieldUpdateOperationsInput | string
    wasteType?: NullableEnumWasteTypeFieldUpdateOperationsInput | $Enums.WasteType | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RFIDMappingCreateManyInput = {
    id?: number
    slno: string
    phoneNumber?: string | null
    rfid: string
    wasteType?: $Enums.WasteType | null
    createdAt?: Date | string
  }

  export type RFIDMappingUpdateManyMutationInput = {
    slno?: StringFieldUpdateOperationsInput | string
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    rfid?: StringFieldUpdateOperationsInput | string
    wasteType?: NullableEnumWasteTypeFieldUpdateOperationsInput | $Enums.WasteType | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RFIDMappingUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    slno?: StringFieldUpdateOperationsInput | string
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    rfid?: StringFieldUpdateOperationsInput | string
    wasteType?: NullableEnumWasteTypeFieldUpdateOperationsInput | $Enums.WasteType | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TrackingLogCreateInput = {
    workerId: string
    slno?: string | null
    citizenName?: string | null
    phoneNumber?: string | null
    remarks?: string | null
    createdAt?: Date | string
    address?: string | null
    buildingNo?: string | null
    drySlno?: string | null
    floorNo?: string | null
    latitude?: number | null
    longitude?: number | null
    photoUrl?: string | null
    updatedAt: Date | string
    wetSlno?: string | null
    status?: $Enums.TrackingStatus
  }

  export type TrackingLogUncheckedCreateInput = {
    id?: number
    workerId: string
    slno?: string | null
    citizenName?: string | null
    phoneNumber?: string | null
    remarks?: string | null
    createdAt?: Date | string
    address?: string | null
    buildingNo?: string | null
    drySlno?: string | null
    floorNo?: string | null
    latitude?: number | null
    longitude?: number | null
    photoUrl?: string | null
    updatedAt: Date | string
    wetSlno?: string | null
    status?: $Enums.TrackingStatus
  }

  export type TrackingLogUpdateInput = {
    workerId?: StringFieldUpdateOperationsInput | string
    slno?: NullableStringFieldUpdateOperationsInput | string | null
    citizenName?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    buildingNo?: NullableStringFieldUpdateOperationsInput | string | null
    drySlno?: NullableStringFieldUpdateOperationsInput | string | null
    floorNo?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    photoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    wetSlno?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumTrackingStatusFieldUpdateOperationsInput | $Enums.TrackingStatus
  }

  export type TrackingLogUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    workerId?: StringFieldUpdateOperationsInput | string
    slno?: NullableStringFieldUpdateOperationsInput | string | null
    citizenName?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    buildingNo?: NullableStringFieldUpdateOperationsInput | string | null
    drySlno?: NullableStringFieldUpdateOperationsInput | string | null
    floorNo?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    photoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    wetSlno?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumTrackingStatusFieldUpdateOperationsInput | $Enums.TrackingStatus
  }

  export type TrackingLogCreateManyInput = {
    id?: number
    workerId: string
    slno?: string | null
    citizenName?: string | null
    phoneNumber?: string | null
    remarks?: string | null
    createdAt?: Date | string
    address?: string | null
    buildingNo?: string | null
    drySlno?: string | null
    floorNo?: string | null
    latitude?: number | null
    longitude?: number | null
    photoUrl?: string | null
    updatedAt: Date | string
    wetSlno?: string | null
    status?: $Enums.TrackingStatus
  }

  export type TrackingLogUpdateManyMutationInput = {
    workerId?: StringFieldUpdateOperationsInput | string
    slno?: NullableStringFieldUpdateOperationsInput | string | null
    citizenName?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    buildingNo?: NullableStringFieldUpdateOperationsInput | string | null
    drySlno?: NullableStringFieldUpdateOperationsInput | string | null
    floorNo?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    photoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    wetSlno?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumTrackingStatusFieldUpdateOperationsInput | $Enums.TrackingStatus
  }

  export type TrackingLogUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    workerId?: StringFieldUpdateOperationsInput | string
    slno?: NullableStringFieldUpdateOperationsInput | string | null
    citizenName?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    buildingNo?: NullableStringFieldUpdateOperationsInput | string | null
    drySlno?: NullableStringFieldUpdateOperationsInput | string | null
    floorNo?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    photoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    wetSlno?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumTrackingStatusFieldUpdateOperationsInput | $Enums.TrackingStatus
  }

  export type master_citizen_dataCreateInput = {
    phoneNumber: string
    city?: string | null
    ward?: string | null
    area?: string | null
    wasteGeneratorTypes?: string | null
    houseNumber?: string | null
    floorNumber?: string | null
    householdType?: string | null
    personName?: string | null
    contactNumber?: string | null
    numberOfPeople?: string | null
    buildingPhoto?: string | null
    createdAt?: Date | string
    updatedAt: Date | string
    dryRFID?: string | null
    drySlno?: string | null
    wetRFID?: string | null
    wetSlno?: string | null
    lat?: Decimal | DecimalJsLike | number | string | null
    lng?: Decimal | DecimalJsLike | number | string | null
  }

  export type master_citizen_dataUncheckedCreateInput = {
    id?: number
    phoneNumber: string
    city?: string | null
    ward?: string | null
    area?: string | null
    wasteGeneratorTypes?: string | null
    houseNumber?: string | null
    floorNumber?: string | null
    householdType?: string | null
    personName?: string | null
    contactNumber?: string | null
    numberOfPeople?: string | null
    buildingPhoto?: string | null
    createdAt?: Date | string
    updatedAt: Date | string
    dryRFID?: string | null
    drySlno?: string | null
    wetRFID?: string | null
    wetSlno?: string | null
    lat?: Decimal | DecimalJsLike | number | string | null
    lng?: Decimal | DecimalJsLike | number | string | null
  }

  export type master_citizen_dataUpdateInput = {
    phoneNumber?: StringFieldUpdateOperationsInput | string
    city?: NullableStringFieldUpdateOperationsInput | string | null
    ward?: NullableStringFieldUpdateOperationsInput | string | null
    area?: NullableStringFieldUpdateOperationsInput | string | null
    wasteGeneratorTypes?: NullableStringFieldUpdateOperationsInput | string | null
    houseNumber?: NullableStringFieldUpdateOperationsInput | string | null
    floorNumber?: NullableStringFieldUpdateOperationsInput | string | null
    householdType?: NullableStringFieldUpdateOperationsInput | string | null
    personName?: NullableStringFieldUpdateOperationsInput | string | null
    contactNumber?: NullableStringFieldUpdateOperationsInput | string | null
    numberOfPeople?: NullableStringFieldUpdateOperationsInput | string | null
    buildingPhoto?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    dryRFID?: NullableStringFieldUpdateOperationsInput | string | null
    drySlno?: NullableStringFieldUpdateOperationsInput | string | null
    wetRFID?: NullableStringFieldUpdateOperationsInput | string | null
    wetSlno?: NullableStringFieldUpdateOperationsInput | string | null
    lat?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    lng?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
  }

  export type master_citizen_dataUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    phoneNumber?: StringFieldUpdateOperationsInput | string
    city?: NullableStringFieldUpdateOperationsInput | string | null
    ward?: NullableStringFieldUpdateOperationsInput | string | null
    area?: NullableStringFieldUpdateOperationsInput | string | null
    wasteGeneratorTypes?: NullableStringFieldUpdateOperationsInput | string | null
    houseNumber?: NullableStringFieldUpdateOperationsInput | string | null
    floorNumber?: NullableStringFieldUpdateOperationsInput | string | null
    householdType?: NullableStringFieldUpdateOperationsInput | string | null
    personName?: NullableStringFieldUpdateOperationsInput | string | null
    contactNumber?: NullableStringFieldUpdateOperationsInput | string | null
    numberOfPeople?: NullableStringFieldUpdateOperationsInput | string | null
    buildingPhoto?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    dryRFID?: NullableStringFieldUpdateOperationsInput | string | null
    drySlno?: NullableStringFieldUpdateOperationsInput | string | null
    wetRFID?: NullableStringFieldUpdateOperationsInput | string | null
    wetSlno?: NullableStringFieldUpdateOperationsInput | string | null
    lat?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    lng?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
  }

  export type master_citizen_dataCreateManyInput = {
    id?: number
    phoneNumber: string
    city?: string | null
    ward?: string | null
    area?: string | null
    wasteGeneratorTypes?: string | null
    houseNumber?: string | null
    floorNumber?: string | null
    householdType?: string | null
    personName?: string | null
    contactNumber?: string | null
    numberOfPeople?: string | null
    buildingPhoto?: string | null
    createdAt?: Date | string
    updatedAt: Date | string
    dryRFID?: string | null
    drySlno?: string | null
    wetRFID?: string | null
    wetSlno?: string | null
    lat?: Decimal | DecimalJsLike | number | string | null
    lng?: Decimal | DecimalJsLike | number | string | null
  }

  export type master_citizen_dataUpdateManyMutationInput = {
    phoneNumber?: StringFieldUpdateOperationsInput | string
    city?: NullableStringFieldUpdateOperationsInput | string | null
    ward?: NullableStringFieldUpdateOperationsInput | string | null
    area?: NullableStringFieldUpdateOperationsInput | string | null
    wasteGeneratorTypes?: NullableStringFieldUpdateOperationsInput | string | null
    houseNumber?: NullableStringFieldUpdateOperationsInput | string | null
    floorNumber?: NullableStringFieldUpdateOperationsInput | string | null
    householdType?: NullableStringFieldUpdateOperationsInput | string | null
    personName?: NullableStringFieldUpdateOperationsInput | string | null
    contactNumber?: NullableStringFieldUpdateOperationsInput | string | null
    numberOfPeople?: NullableStringFieldUpdateOperationsInput | string | null
    buildingPhoto?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    dryRFID?: NullableStringFieldUpdateOperationsInput | string | null
    drySlno?: NullableStringFieldUpdateOperationsInput | string | null
    wetRFID?: NullableStringFieldUpdateOperationsInput | string | null
    wetSlno?: NullableStringFieldUpdateOperationsInput | string | null
    lat?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    lng?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
  }

  export type master_citizen_dataUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    phoneNumber?: StringFieldUpdateOperationsInput | string
    city?: NullableStringFieldUpdateOperationsInput | string | null
    ward?: NullableStringFieldUpdateOperationsInput | string | null
    area?: NullableStringFieldUpdateOperationsInput | string | null
    wasteGeneratorTypes?: NullableStringFieldUpdateOperationsInput | string | null
    houseNumber?: NullableStringFieldUpdateOperationsInput | string | null
    floorNumber?: NullableStringFieldUpdateOperationsInput | string | null
    householdType?: NullableStringFieldUpdateOperationsInput | string | null
    personName?: NullableStringFieldUpdateOperationsInput | string | null
    contactNumber?: NullableStringFieldUpdateOperationsInput | string | null
    numberOfPeople?: NullableStringFieldUpdateOperationsInput | string | null
    buildingPhoto?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    dryRFID?: NullableStringFieldUpdateOperationsInput | string | null
    drySlno?: NullableStringFieldUpdateOperationsInput | string | null
    wetRFID?: NullableStringFieldUpdateOperationsInput | string | null
    wetSlno?: NullableStringFieldUpdateOperationsInput | string | null
    lat?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    lng?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
  }

  export type survey_attribute_specificCreateInput = {
    city?: string | null
    ward?: string | null
    area?: string | null
    wasteGeneratorTypes?: string | null
    houseNumber?: string | null
    floorNumber?: string | null
    householdType?: string | null
    personName?: string | null
    contactNumber?: string | null
    numberOfPeople?: string | null
    buildingPhoto?: string | null
    lat?: Decimal | DecimalJsLike | number | string | null
    lng?: Decimal | DecimalJsLike | number | string | null
    createdAt?: Date | string
    updatedAt: Date | string
  }

  export type survey_attribute_specificUncheckedCreateInput = {
    city?: string | null
    ward?: string | null
    area?: string | null
    wasteGeneratorTypes?: string | null
    houseNumber?: string | null
    floorNumber?: string | null
    householdType?: string | null
    personName?: string | null
    contactNumber?: string | null
    numberOfPeople?: string | null
    buildingPhoto?: string | null
    id?: number
    lat?: Decimal | DecimalJsLike | number | string | null
    lng?: Decimal | DecimalJsLike | number | string | null
    createdAt?: Date | string
    updatedAt: Date | string
  }

  export type survey_attribute_specificUpdateInput = {
    city?: NullableStringFieldUpdateOperationsInput | string | null
    ward?: NullableStringFieldUpdateOperationsInput | string | null
    area?: NullableStringFieldUpdateOperationsInput | string | null
    wasteGeneratorTypes?: NullableStringFieldUpdateOperationsInput | string | null
    houseNumber?: NullableStringFieldUpdateOperationsInput | string | null
    floorNumber?: NullableStringFieldUpdateOperationsInput | string | null
    householdType?: NullableStringFieldUpdateOperationsInput | string | null
    personName?: NullableStringFieldUpdateOperationsInput | string | null
    contactNumber?: NullableStringFieldUpdateOperationsInput | string | null
    numberOfPeople?: NullableStringFieldUpdateOperationsInput | string | null
    buildingPhoto?: NullableStringFieldUpdateOperationsInput | string | null
    lat?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    lng?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type survey_attribute_specificUncheckedUpdateInput = {
    city?: NullableStringFieldUpdateOperationsInput | string | null
    ward?: NullableStringFieldUpdateOperationsInput | string | null
    area?: NullableStringFieldUpdateOperationsInput | string | null
    wasteGeneratorTypes?: NullableStringFieldUpdateOperationsInput | string | null
    houseNumber?: NullableStringFieldUpdateOperationsInput | string | null
    floorNumber?: NullableStringFieldUpdateOperationsInput | string | null
    householdType?: NullableStringFieldUpdateOperationsInput | string | null
    personName?: NullableStringFieldUpdateOperationsInput | string | null
    contactNumber?: NullableStringFieldUpdateOperationsInput | string | null
    numberOfPeople?: NullableStringFieldUpdateOperationsInput | string | null
    buildingPhoto?: NullableStringFieldUpdateOperationsInput | string | null
    id?: IntFieldUpdateOperationsInput | number
    lat?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    lng?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type survey_attribute_specificCreateManyInput = {
    city?: string | null
    ward?: string | null
    area?: string | null
    wasteGeneratorTypes?: string | null
    houseNumber?: string | null
    floorNumber?: string | null
    householdType?: string | null
    personName?: string | null
    contactNumber?: string | null
    numberOfPeople?: string | null
    buildingPhoto?: string | null
    id?: number
    lat?: Decimal | DecimalJsLike | number | string | null
    lng?: Decimal | DecimalJsLike | number | string | null
    createdAt?: Date | string
    updatedAt: Date | string
  }

  export type survey_attribute_specificUpdateManyMutationInput = {
    city?: NullableStringFieldUpdateOperationsInput | string | null
    ward?: NullableStringFieldUpdateOperationsInput | string | null
    area?: NullableStringFieldUpdateOperationsInput | string | null
    wasteGeneratorTypes?: NullableStringFieldUpdateOperationsInput | string | null
    houseNumber?: NullableStringFieldUpdateOperationsInput | string | null
    floorNumber?: NullableStringFieldUpdateOperationsInput | string | null
    householdType?: NullableStringFieldUpdateOperationsInput | string | null
    personName?: NullableStringFieldUpdateOperationsInput | string | null
    contactNumber?: NullableStringFieldUpdateOperationsInput | string | null
    numberOfPeople?: NullableStringFieldUpdateOperationsInput | string | null
    buildingPhoto?: NullableStringFieldUpdateOperationsInput | string | null
    lat?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    lng?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type survey_attribute_specificUncheckedUpdateManyInput = {
    city?: NullableStringFieldUpdateOperationsInput | string | null
    ward?: NullableStringFieldUpdateOperationsInput | string | null
    area?: NullableStringFieldUpdateOperationsInput | string | null
    wasteGeneratorTypes?: NullableStringFieldUpdateOperationsInput | string | null
    houseNumber?: NullableStringFieldUpdateOperationsInput | string | null
    floorNumber?: NullableStringFieldUpdateOperationsInput | string | null
    householdType?: NullableStringFieldUpdateOperationsInput | string | null
    personName?: NullableStringFieldUpdateOperationsInput | string | null
    contactNumber?: NullableStringFieldUpdateOperationsInput | string | null
    numberOfPeople?: NullableStringFieldUpdateOperationsInput | string | null
    buildingPhoto?: NullableStringFieldUpdateOperationsInput | string | null
    id?: IntFieldUpdateOperationsInput | number
    lat?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    lng?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type usersCreateInput = {
    full_name: string
    email: string
    password_hash: string
    role?: string
    created_at?: Date | string | null
  }

  export type usersUncheckedCreateInput = {
    id?: number
    full_name: string
    email: string
    password_hash: string
    role?: string
    created_at?: Date | string | null
  }

  export type usersUpdateInput = {
    full_name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type usersUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    full_name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type usersCreateManyInput = {
    id?: number
    full_name: string
    email: string
    password_hash: string
    role?: string
    created_at?: Date | string | null
  }

  export type usersUpdateManyMutationInput = {
    full_name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type usersUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    full_name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
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

  export type ModeratorCountOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    password?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
  }

  export type ModeratorAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type ModeratorMaxOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    password?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
  }

  export type ModeratorMinOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    password?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
  }

  export type ModeratorSumOrderByAggregateInput = {
    id?: SortOrder
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

  export type EnumWasteTypeNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.WasteType | EnumWasteTypeFieldRefInput<$PrismaModel> | null
    in?: $Enums.WasteType[] | ListEnumWasteTypeFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.WasteType[] | ListEnumWasteTypeFieldRefInput<$PrismaModel> | null
    not?: NestedEnumWasteTypeNullableFilter<$PrismaModel> | $Enums.WasteType | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type RFIDMappingSlnoWasteTypeCompoundUniqueInput = {
    slno: string
    wasteType: $Enums.WasteType
  }

  export type RFIDMappingCountOrderByAggregateInput = {
    id?: SortOrder
    slno?: SortOrder
    phoneNumber?: SortOrder
    rfid?: SortOrder
    wasteType?: SortOrder
    createdAt?: SortOrder
  }

  export type RFIDMappingAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type RFIDMappingMaxOrderByAggregateInput = {
    id?: SortOrder
    slno?: SortOrder
    phoneNumber?: SortOrder
    rfid?: SortOrder
    wasteType?: SortOrder
    createdAt?: SortOrder
  }

  export type RFIDMappingMinOrderByAggregateInput = {
    id?: SortOrder
    slno?: SortOrder
    phoneNumber?: SortOrder
    rfid?: SortOrder
    wasteType?: SortOrder
    createdAt?: SortOrder
  }

  export type RFIDMappingSumOrderByAggregateInput = {
    id?: SortOrder
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

  export type EnumWasteTypeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.WasteType | EnumWasteTypeFieldRefInput<$PrismaModel> | null
    in?: $Enums.WasteType[] | ListEnumWasteTypeFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.WasteType[] | ListEnumWasteTypeFieldRefInput<$PrismaModel> | null
    not?: NestedEnumWasteTypeNullableWithAggregatesFilter<$PrismaModel> | $Enums.WasteType | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumWasteTypeNullableFilter<$PrismaModel>
    _max?: NestedEnumWasteTypeNullableFilter<$PrismaModel>
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type EnumTrackingStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.TrackingStatus | EnumTrackingStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TrackingStatus[] | ListEnumTrackingStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TrackingStatus[] | ListEnumTrackingStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTrackingStatusFilter<$PrismaModel> | $Enums.TrackingStatus
  }

  export type TrackingLogCountOrderByAggregateInput = {
    id?: SortOrder
    workerId?: SortOrder
    slno?: SortOrder
    citizenName?: SortOrder
    phoneNumber?: SortOrder
    remarks?: SortOrder
    createdAt?: SortOrder
    address?: SortOrder
    buildingNo?: SortOrder
    drySlno?: SortOrder
    floorNo?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    photoUrl?: SortOrder
    updatedAt?: SortOrder
    wetSlno?: SortOrder
    status?: SortOrder
  }

  export type TrackingLogAvgOrderByAggregateInput = {
    id?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
  }

  export type TrackingLogMaxOrderByAggregateInput = {
    id?: SortOrder
    workerId?: SortOrder
    slno?: SortOrder
    citizenName?: SortOrder
    phoneNumber?: SortOrder
    remarks?: SortOrder
    createdAt?: SortOrder
    address?: SortOrder
    buildingNo?: SortOrder
    drySlno?: SortOrder
    floorNo?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    photoUrl?: SortOrder
    updatedAt?: SortOrder
    wetSlno?: SortOrder
    status?: SortOrder
  }

  export type TrackingLogMinOrderByAggregateInput = {
    id?: SortOrder
    workerId?: SortOrder
    slno?: SortOrder
    citizenName?: SortOrder
    phoneNumber?: SortOrder
    remarks?: SortOrder
    createdAt?: SortOrder
    address?: SortOrder
    buildingNo?: SortOrder
    drySlno?: SortOrder
    floorNo?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    photoUrl?: SortOrder
    updatedAt?: SortOrder
    wetSlno?: SortOrder
    status?: SortOrder
  }

  export type TrackingLogSumOrderByAggregateInput = {
    id?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type EnumTrackingStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TrackingStatus | EnumTrackingStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TrackingStatus[] | ListEnumTrackingStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TrackingStatus[] | ListEnumTrackingStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTrackingStatusWithAggregatesFilter<$PrismaModel> | $Enums.TrackingStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTrackingStatusFilter<$PrismaModel>
    _max?: NestedEnumTrackingStatusFilter<$PrismaModel>
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

  export type master_citizen_dataCountOrderByAggregateInput = {
    id?: SortOrder
    phoneNumber?: SortOrder
    city?: SortOrder
    ward?: SortOrder
    area?: SortOrder
    wasteGeneratorTypes?: SortOrder
    houseNumber?: SortOrder
    floorNumber?: SortOrder
    householdType?: SortOrder
    personName?: SortOrder
    contactNumber?: SortOrder
    numberOfPeople?: SortOrder
    buildingPhoto?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    dryRFID?: SortOrder
    drySlno?: SortOrder
    wetRFID?: SortOrder
    wetSlno?: SortOrder
    lat?: SortOrder
    lng?: SortOrder
  }

  export type master_citizen_dataAvgOrderByAggregateInput = {
    id?: SortOrder
    lat?: SortOrder
    lng?: SortOrder
  }

  export type master_citizen_dataMaxOrderByAggregateInput = {
    id?: SortOrder
    phoneNumber?: SortOrder
    city?: SortOrder
    ward?: SortOrder
    area?: SortOrder
    wasteGeneratorTypes?: SortOrder
    houseNumber?: SortOrder
    floorNumber?: SortOrder
    householdType?: SortOrder
    personName?: SortOrder
    contactNumber?: SortOrder
    numberOfPeople?: SortOrder
    buildingPhoto?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    dryRFID?: SortOrder
    drySlno?: SortOrder
    wetRFID?: SortOrder
    wetSlno?: SortOrder
    lat?: SortOrder
    lng?: SortOrder
  }

  export type master_citizen_dataMinOrderByAggregateInput = {
    id?: SortOrder
    phoneNumber?: SortOrder
    city?: SortOrder
    ward?: SortOrder
    area?: SortOrder
    wasteGeneratorTypes?: SortOrder
    houseNumber?: SortOrder
    floorNumber?: SortOrder
    householdType?: SortOrder
    personName?: SortOrder
    contactNumber?: SortOrder
    numberOfPeople?: SortOrder
    buildingPhoto?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    dryRFID?: SortOrder
    drySlno?: SortOrder
    wetRFID?: SortOrder
    wetSlno?: SortOrder
    lat?: SortOrder
    lng?: SortOrder
  }

  export type master_citizen_dataSumOrderByAggregateInput = {
    id?: SortOrder
    lat?: SortOrder
    lng?: SortOrder
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

  export type survey_attribute_specificCountOrderByAggregateInput = {
    city?: SortOrder
    ward?: SortOrder
    area?: SortOrder
    wasteGeneratorTypes?: SortOrder
    houseNumber?: SortOrder
    floorNumber?: SortOrder
    householdType?: SortOrder
    personName?: SortOrder
    contactNumber?: SortOrder
    numberOfPeople?: SortOrder
    buildingPhoto?: SortOrder
    id?: SortOrder
    lat?: SortOrder
    lng?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type survey_attribute_specificAvgOrderByAggregateInput = {
    id?: SortOrder
    lat?: SortOrder
    lng?: SortOrder
  }

  export type survey_attribute_specificMaxOrderByAggregateInput = {
    city?: SortOrder
    ward?: SortOrder
    area?: SortOrder
    wasteGeneratorTypes?: SortOrder
    houseNumber?: SortOrder
    floorNumber?: SortOrder
    householdType?: SortOrder
    personName?: SortOrder
    contactNumber?: SortOrder
    numberOfPeople?: SortOrder
    buildingPhoto?: SortOrder
    id?: SortOrder
    lat?: SortOrder
    lng?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type survey_attribute_specificMinOrderByAggregateInput = {
    city?: SortOrder
    ward?: SortOrder
    area?: SortOrder
    wasteGeneratorTypes?: SortOrder
    houseNumber?: SortOrder
    floorNumber?: SortOrder
    householdType?: SortOrder
    personName?: SortOrder
    contactNumber?: SortOrder
    numberOfPeople?: SortOrder
    buildingPhoto?: SortOrder
    id?: SortOrder
    lat?: SortOrder
    lng?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type survey_attribute_specificSumOrderByAggregateInput = {
    id?: SortOrder
    lat?: SortOrder
    lng?: SortOrder
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

  export type usersCountOrderByAggregateInput = {
    id?: SortOrder
    full_name?: SortOrder
    email?: SortOrder
    password_hash?: SortOrder
    role?: SortOrder
    created_at?: SortOrder
  }

  export type usersAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type usersMaxOrderByAggregateInput = {
    id?: SortOrder
    full_name?: SortOrder
    email?: SortOrder
    password_hash?: SortOrder
    role?: SortOrder
    created_at?: SortOrder
  }

  export type usersMinOrderByAggregateInput = {
    id?: SortOrder
    full_name?: SortOrder
    email?: SortOrder
    password_hash?: SortOrder
    role?: SortOrder
    created_at?: SortOrder
  }

  export type usersSumOrderByAggregateInput = {
    id?: SortOrder
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

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NullableEnumWasteTypeFieldUpdateOperationsInput = {
    set?: $Enums.WasteType | null
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type EnumTrackingStatusFieldUpdateOperationsInput = {
    set?: $Enums.TrackingStatus
  }

  export type NullableDecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string | null
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
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

  export type NestedEnumWasteTypeNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.WasteType | EnumWasteTypeFieldRefInput<$PrismaModel> | null
    in?: $Enums.WasteType[] | ListEnumWasteTypeFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.WasteType[] | ListEnumWasteTypeFieldRefInput<$PrismaModel> | null
    not?: NestedEnumWasteTypeNullableFilter<$PrismaModel> | $Enums.WasteType | null
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

  export type NestedEnumWasteTypeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.WasteType | EnumWasteTypeFieldRefInput<$PrismaModel> | null
    in?: $Enums.WasteType[] | ListEnumWasteTypeFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.WasteType[] | ListEnumWasteTypeFieldRefInput<$PrismaModel> | null
    not?: NestedEnumWasteTypeNullableWithAggregatesFilter<$PrismaModel> | $Enums.WasteType | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumWasteTypeNullableFilter<$PrismaModel>
    _max?: NestedEnumWasteTypeNullableFilter<$PrismaModel>
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

  export type NestedEnumTrackingStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.TrackingStatus | EnumTrackingStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TrackingStatus[] | ListEnumTrackingStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TrackingStatus[] | ListEnumTrackingStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTrackingStatusFilter<$PrismaModel> | $Enums.TrackingStatus
  }

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type NestedEnumTrackingStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TrackingStatus | EnumTrackingStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TrackingStatus[] | ListEnumTrackingStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TrackingStatus[] | ListEnumTrackingStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTrackingStatusWithAggregatesFilter<$PrismaModel> | $Enums.TrackingStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTrackingStatusFilter<$PrismaModel>
    _max?: NestedEnumTrackingStatusFilter<$PrismaModel>
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