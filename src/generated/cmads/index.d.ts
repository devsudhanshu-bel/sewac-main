
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
 * Model admins
 * 
 */
export type admins = $Result.DefaultSelection<Prisma.$adminsPayload>
/**
 * Model admin_preferences
 * 
 */
export type admin_preferences = $Result.DefaultSelection<Prisma.$admin_preferencesPayload>
/**
 * Model audit_logs
 * 
 */
export type audit_logs = $Result.DefaultSelection<Prisma.$audit_logsPayload>
/**
 * Model behavior_profiles
 * 
 */
export type behavior_profiles = $Result.DefaultSelection<Prisma.$behavior_profilesPayload>
/**
 * Model behavior_samples
 * 
 */
export type behavior_samples = $Result.DefaultSelection<Prisma.$behavior_samplesPayload>
/**
 * Model devices
 * 
 */
export type devices = $Result.DefaultSelection<Prisma.$devicesPayload>
/**
 * Model risk_events
 * 
 */
export type risk_events = $Result.DefaultSelection<Prisma.$risk_eventsPayload>
/**
 * Model security_alerts
 * 
 */
export type security_alerts = $Result.DefaultSelection<Prisma.$security_alertsPayload>
/**
 * Model edit_requests
 * 
 */
export type edit_requests = $Result.DefaultSelection<Prisma.$edit_requestsPayload>
/**
 * Model temporary_permissions
 * 
 */
export type temporary_permissions = $Result.DefaultSelection<Prisma.$temporary_permissionsPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Admins
 * const admins = await prisma.admins.findMany()
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
   * // Fetch zero or more Admins
   * const admins = await prisma.admins.findMany()
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
   * `prisma.admins`: Exposes CRUD operations for the **admins** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Admins
    * const admins = await prisma.admins.findMany()
    * ```
    */
  get admins(): Prisma.adminsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.admin_preferences`: Exposes CRUD operations for the **admin_preferences** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Admin_preferences
    * const admin_preferences = await prisma.admin_preferences.findMany()
    * ```
    */
  get admin_preferences(): Prisma.admin_preferencesDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.audit_logs`: Exposes CRUD operations for the **audit_logs** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Audit_logs
    * const audit_logs = await prisma.audit_logs.findMany()
    * ```
    */
  get audit_logs(): Prisma.audit_logsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.behavior_profiles`: Exposes CRUD operations for the **behavior_profiles** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Behavior_profiles
    * const behavior_profiles = await prisma.behavior_profiles.findMany()
    * ```
    */
  get behavior_profiles(): Prisma.behavior_profilesDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.behavior_samples`: Exposes CRUD operations for the **behavior_samples** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Behavior_samples
    * const behavior_samples = await prisma.behavior_samples.findMany()
    * ```
    */
  get behavior_samples(): Prisma.behavior_samplesDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.devices`: Exposes CRUD operations for the **devices** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Devices
    * const devices = await prisma.devices.findMany()
    * ```
    */
  get devices(): Prisma.devicesDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.risk_events`: Exposes CRUD operations for the **risk_events** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Risk_events
    * const risk_events = await prisma.risk_events.findMany()
    * ```
    */
  get risk_events(): Prisma.risk_eventsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.security_alerts`: Exposes CRUD operations for the **security_alerts** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Security_alerts
    * const security_alerts = await prisma.security_alerts.findMany()
    * ```
    */
  get security_alerts(): Prisma.security_alertsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.edit_requests`: Exposes CRUD operations for the **edit_requests** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Edit_requests
    * const edit_requests = await prisma.edit_requests.findMany()
    * ```
    */
  get edit_requests(): Prisma.edit_requestsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.temporary_permissions`: Exposes CRUD operations for the **temporary_permissions** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Temporary_permissions
    * const temporary_permissions = await prisma.temporary_permissions.findMany()
    * ```
    */
  get temporary_permissions(): Prisma.temporary_permissionsDelegate<ExtArgs, ClientOptions>;
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
    admins: 'admins',
    admin_preferences: 'admin_preferences',
    audit_logs: 'audit_logs',
    behavior_profiles: 'behavior_profiles',
    behavior_samples: 'behavior_samples',
    devices: 'devices',
    risk_events: 'risk_events',
    security_alerts: 'security_alerts',
    edit_requests: 'edit_requests',
    temporary_permissions: 'temporary_permissions'
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
      modelProps: "admins" | "admin_preferences" | "audit_logs" | "behavior_profiles" | "behavior_samples" | "devices" | "risk_events" | "security_alerts" | "edit_requests" | "temporary_permissions"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      admins: {
        payload: Prisma.$adminsPayload<ExtArgs>
        fields: Prisma.adminsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.adminsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$adminsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.adminsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$adminsPayload>
          }
          findFirst: {
            args: Prisma.adminsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$adminsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.adminsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$adminsPayload>
          }
          findMany: {
            args: Prisma.adminsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$adminsPayload>[]
          }
          create: {
            args: Prisma.adminsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$adminsPayload>
          }
          createMany: {
            args: Prisma.adminsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.adminsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$adminsPayload>[]
          }
          delete: {
            args: Prisma.adminsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$adminsPayload>
          }
          update: {
            args: Prisma.adminsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$adminsPayload>
          }
          deleteMany: {
            args: Prisma.adminsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.adminsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.adminsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$adminsPayload>[]
          }
          upsert: {
            args: Prisma.adminsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$adminsPayload>
          }
          aggregate: {
            args: Prisma.AdminsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAdmins>
          }
          groupBy: {
            args: Prisma.adminsGroupByArgs<ExtArgs>
            result: $Utils.Optional<AdminsGroupByOutputType>[]
          }
          count: {
            args: Prisma.adminsCountArgs<ExtArgs>
            result: $Utils.Optional<AdminsCountAggregateOutputType> | number
          }
        }
      }
      admin_preferences: {
        payload: Prisma.$admin_preferencesPayload<ExtArgs>
        fields: Prisma.admin_preferencesFieldRefs
        operations: {
          findUnique: {
            args: Prisma.admin_preferencesFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$admin_preferencesPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.admin_preferencesFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$admin_preferencesPayload>
          }
          findFirst: {
            args: Prisma.admin_preferencesFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$admin_preferencesPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.admin_preferencesFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$admin_preferencesPayload>
          }
          findMany: {
            args: Prisma.admin_preferencesFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$admin_preferencesPayload>[]
          }
          create: {
            args: Prisma.admin_preferencesCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$admin_preferencesPayload>
          }
          createMany: {
            args: Prisma.admin_preferencesCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.admin_preferencesCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$admin_preferencesPayload>[]
          }
          delete: {
            args: Prisma.admin_preferencesDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$admin_preferencesPayload>
          }
          update: {
            args: Prisma.admin_preferencesUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$admin_preferencesPayload>
          }
          deleteMany: {
            args: Prisma.admin_preferencesDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.admin_preferencesUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.admin_preferencesUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$admin_preferencesPayload>[]
          }
          upsert: {
            args: Prisma.admin_preferencesUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$admin_preferencesPayload>
          }
          aggregate: {
            args: Prisma.Admin_preferencesAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAdmin_preferences>
          }
          groupBy: {
            args: Prisma.admin_preferencesGroupByArgs<ExtArgs>
            result: $Utils.Optional<Admin_preferencesGroupByOutputType>[]
          }
          count: {
            args: Prisma.admin_preferencesCountArgs<ExtArgs>
            result: $Utils.Optional<Admin_preferencesCountAggregateOutputType> | number
          }
        }
      }
      audit_logs: {
        payload: Prisma.$audit_logsPayload<ExtArgs>
        fields: Prisma.audit_logsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.audit_logsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$audit_logsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.audit_logsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$audit_logsPayload>
          }
          findFirst: {
            args: Prisma.audit_logsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$audit_logsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.audit_logsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$audit_logsPayload>
          }
          findMany: {
            args: Prisma.audit_logsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$audit_logsPayload>[]
          }
          create: {
            args: Prisma.audit_logsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$audit_logsPayload>
          }
          createMany: {
            args: Prisma.audit_logsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.audit_logsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$audit_logsPayload>[]
          }
          delete: {
            args: Prisma.audit_logsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$audit_logsPayload>
          }
          update: {
            args: Prisma.audit_logsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$audit_logsPayload>
          }
          deleteMany: {
            args: Prisma.audit_logsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.audit_logsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.audit_logsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$audit_logsPayload>[]
          }
          upsert: {
            args: Prisma.audit_logsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$audit_logsPayload>
          }
          aggregate: {
            args: Prisma.Audit_logsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAudit_logs>
          }
          groupBy: {
            args: Prisma.audit_logsGroupByArgs<ExtArgs>
            result: $Utils.Optional<Audit_logsGroupByOutputType>[]
          }
          count: {
            args: Prisma.audit_logsCountArgs<ExtArgs>
            result: $Utils.Optional<Audit_logsCountAggregateOutputType> | number
          }
        }
      }
      behavior_profiles: {
        payload: Prisma.$behavior_profilesPayload<ExtArgs>
        fields: Prisma.behavior_profilesFieldRefs
        operations: {
          findUnique: {
            args: Prisma.behavior_profilesFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$behavior_profilesPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.behavior_profilesFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$behavior_profilesPayload>
          }
          findFirst: {
            args: Prisma.behavior_profilesFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$behavior_profilesPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.behavior_profilesFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$behavior_profilesPayload>
          }
          findMany: {
            args: Prisma.behavior_profilesFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$behavior_profilesPayload>[]
          }
          create: {
            args: Prisma.behavior_profilesCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$behavior_profilesPayload>
          }
          createMany: {
            args: Prisma.behavior_profilesCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.behavior_profilesCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$behavior_profilesPayload>[]
          }
          delete: {
            args: Prisma.behavior_profilesDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$behavior_profilesPayload>
          }
          update: {
            args: Prisma.behavior_profilesUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$behavior_profilesPayload>
          }
          deleteMany: {
            args: Prisma.behavior_profilesDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.behavior_profilesUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.behavior_profilesUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$behavior_profilesPayload>[]
          }
          upsert: {
            args: Prisma.behavior_profilesUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$behavior_profilesPayload>
          }
          aggregate: {
            args: Prisma.Behavior_profilesAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBehavior_profiles>
          }
          groupBy: {
            args: Prisma.behavior_profilesGroupByArgs<ExtArgs>
            result: $Utils.Optional<Behavior_profilesGroupByOutputType>[]
          }
          count: {
            args: Prisma.behavior_profilesCountArgs<ExtArgs>
            result: $Utils.Optional<Behavior_profilesCountAggregateOutputType> | number
          }
        }
      }
      behavior_samples: {
        payload: Prisma.$behavior_samplesPayload<ExtArgs>
        fields: Prisma.behavior_samplesFieldRefs
        operations: {
          findUnique: {
            args: Prisma.behavior_samplesFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$behavior_samplesPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.behavior_samplesFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$behavior_samplesPayload>
          }
          findFirst: {
            args: Prisma.behavior_samplesFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$behavior_samplesPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.behavior_samplesFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$behavior_samplesPayload>
          }
          findMany: {
            args: Prisma.behavior_samplesFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$behavior_samplesPayload>[]
          }
          create: {
            args: Prisma.behavior_samplesCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$behavior_samplesPayload>
          }
          createMany: {
            args: Prisma.behavior_samplesCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.behavior_samplesCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$behavior_samplesPayload>[]
          }
          delete: {
            args: Prisma.behavior_samplesDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$behavior_samplesPayload>
          }
          update: {
            args: Prisma.behavior_samplesUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$behavior_samplesPayload>
          }
          deleteMany: {
            args: Prisma.behavior_samplesDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.behavior_samplesUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.behavior_samplesUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$behavior_samplesPayload>[]
          }
          upsert: {
            args: Prisma.behavior_samplesUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$behavior_samplesPayload>
          }
          aggregate: {
            args: Prisma.Behavior_samplesAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBehavior_samples>
          }
          groupBy: {
            args: Prisma.behavior_samplesGroupByArgs<ExtArgs>
            result: $Utils.Optional<Behavior_samplesGroupByOutputType>[]
          }
          count: {
            args: Prisma.behavior_samplesCountArgs<ExtArgs>
            result: $Utils.Optional<Behavior_samplesCountAggregateOutputType> | number
          }
        }
      }
      devices: {
        payload: Prisma.$devicesPayload<ExtArgs>
        fields: Prisma.devicesFieldRefs
        operations: {
          findUnique: {
            args: Prisma.devicesFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$devicesPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.devicesFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$devicesPayload>
          }
          findFirst: {
            args: Prisma.devicesFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$devicesPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.devicesFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$devicesPayload>
          }
          findMany: {
            args: Prisma.devicesFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$devicesPayload>[]
          }
          create: {
            args: Prisma.devicesCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$devicesPayload>
          }
          createMany: {
            args: Prisma.devicesCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.devicesCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$devicesPayload>[]
          }
          delete: {
            args: Prisma.devicesDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$devicesPayload>
          }
          update: {
            args: Prisma.devicesUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$devicesPayload>
          }
          deleteMany: {
            args: Prisma.devicesDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.devicesUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.devicesUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$devicesPayload>[]
          }
          upsert: {
            args: Prisma.devicesUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$devicesPayload>
          }
          aggregate: {
            args: Prisma.DevicesAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDevices>
          }
          groupBy: {
            args: Prisma.devicesGroupByArgs<ExtArgs>
            result: $Utils.Optional<DevicesGroupByOutputType>[]
          }
          count: {
            args: Prisma.devicesCountArgs<ExtArgs>
            result: $Utils.Optional<DevicesCountAggregateOutputType> | number
          }
        }
      }
      risk_events: {
        payload: Prisma.$risk_eventsPayload<ExtArgs>
        fields: Prisma.risk_eventsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.risk_eventsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$risk_eventsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.risk_eventsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$risk_eventsPayload>
          }
          findFirst: {
            args: Prisma.risk_eventsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$risk_eventsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.risk_eventsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$risk_eventsPayload>
          }
          findMany: {
            args: Prisma.risk_eventsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$risk_eventsPayload>[]
          }
          create: {
            args: Prisma.risk_eventsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$risk_eventsPayload>
          }
          createMany: {
            args: Prisma.risk_eventsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.risk_eventsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$risk_eventsPayload>[]
          }
          delete: {
            args: Prisma.risk_eventsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$risk_eventsPayload>
          }
          update: {
            args: Prisma.risk_eventsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$risk_eventsPayload>
          }
          deleteMany: {
            args: Prisma.risk_eventsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.risk_eventsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.risk_eventsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$risk_eventsPayload>[]
          }
          upsert: {
            args: Prisma.risk_eventsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$risk_eventsPayload>
          }
          aggregate: {
            args: Prisma.Risk_eventsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRisk_events>
          }
          groupBy: {
            args: Prisma.risk_eventsGroupByArgs<ExtArgs>
            result: $Utils.Optional<Risk_eventsGroupByOutputType>[]
          }
          count: {
            args: Prisma.risk_eventsCountArgs<ExtArgs>
            result: $Utils.Optional<Risk_eventsCountAggregateOutputType> | number
          }
        }
      }
      security_alerts: {
        payload: Prisma.$security_alertsPayload<ExtArgs>
        fields: Prisma.security_alertsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.security_alertsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$security_alertsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.security_alertsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$security_alertsPayload>
          }
          findFirst: {
            args: Prisma.security_alertsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$security_alertsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.security_alertsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$security_alertsPayload>
          }
          findMany: {
            args: Prisma.security_alertsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$security_alertsPayload>[]
          }
          create: {
            args: Prisma.security_alertsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$security_alertsPayload>
          }
          createMany: {
            args: Prisma.security_alertsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.security_alertsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$security_alertsPayload>[]
          }
          delete: {
            args: Prisma.security_alertsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$security_alertsPayload>
          }
          update: {
            args: Prisma.security_alertsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$security_alertsPayload>
          }
          deleteMany: {
            args: Prisma.security_alertsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.security_alertsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.security_alertsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$security_alertsPayload>[]
          }
          upsert: {
            args: Prisma.security_alertsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$security_alertsPayload>
          }
          aggregate: {
            args: Prisma.Security_alertsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSecurity_alerts>
          }
          groupBy: {
            args: Prisma.security_alertsGroupByArgs<ExtArgs>
            result: $Utils.Optional<Security_alertsGroupByOutputType>[]
          }
          count: {
            args: Prisma.security_alertsCountArgs<ExtArgs>
            result: $Utils.Optional<Security_alertsCountAggregateOutputType> | number
          }
        }
      }
      edit_requests: {
        payload: Prisma.$edit_requestsPayload<ExtArgs>
        fields: Prisma.edit_requestsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.edit_requestsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$edit_requestsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.edit_requestsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$edit_requestsPayload>
          }
          findFirst: {
            args: Prisma.edit_requestsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$edit_requestsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.edit_requestsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$edit_requestsPayload>
          }
          findMany: {
            args: Prisma.edit_requestsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$edit_requestsPayload>[]
          }
          create: {
            args: Prisma.edit_requestsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$edit_requestsPayload>
          }
          createMany: {
            args: Prisma.edit_requestsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.edit_requestsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$edit_requestsPayload>[]
          }
          delete: {
            args: Prisma.edit_requestsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$edit_requestsPayload>
          }
          update: {
            args: Prisma.edit_requestsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$edit_requestsPayload>
          }
          deleteMany: {
            args: Prisma.edit_requestsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.edit_requestsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.edit_requestsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$edit_requestsPayload>[]
          }
          upsert: {
            args: Prisma.edit_requestsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$edit_requestsPayload>
          }
          aggregate: {
            args: Prisma.Edit_requestsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEdit_requests>
          }
          groupBy: {
            args: Prisma.edit_requestsGroupByArgs<ExtArgs>
            result: $Utils.Optional<Edit_requestsGroupByOutputType>[]
          }
          count: {
            args: Prisma.edit_requestsCountArgs<ExtArgs>
            result: $Utils.Optional<Edit_requestsCountAggregateOutputType> | number
          }
        }
      }
      temporary_permissions: {
        payload: Prisma.$temporary_permissionsPayload<ExtArgs>
        fields: Prisma.temporary_permissionsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.temporary_permissionsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$temporary_permissionsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.temporary_permissionsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$temporary_permissionsPayload>
          }
          findFirst: {
            args: Prisma.temporary_permissionsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$temporary_permissionsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.temporary_permissionsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$temporary_permissionsPayload>
          }
          findMany: {
            args: Prisma.temporary_permissionsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$temporary_permissionsPayload>[]
          }
          create: {
            args: Prisma.temporary_permissionsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$temporary_permissionsPayload>
          }
          createMany: {
            args: Prisma.temporary_permissionsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.temporary_permissionsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$temporary_permissionsPayload>[]
          }
          delete: {
            args: Prisma.temporary_permissionsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$temporary_permissionsPayload>
          }
          update: {
            args: Prisma.temporary_permissionsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$temporary_permissionsPayload>
          }
          deleteMany: {
            args: Prisma.temporary_permissionsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.temporary_permissionsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.temporary_permissionsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$temporary_permissionsPayload>[]
          }
          upsert: {
            args: Prisma.temporary_permissionsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$temporary_permissionsPayload>
          }
          aggregate: {
            args: Prisma.Temporary_permissionsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTemporary_permissions>
          }
          groupBy: {
            args: Prisma.temporary_permissionsGroupByArgs<ExtArgs>
            result: $Utils.Optional<Temporary_permissionsGroupByOutputType>[]
          }
          count: {
            args: Prisma.temporary_permissionsCountArgs<ExtArgs>
            result: $Utils.Optional<Temporary_permissionsCountAggregateOutputType> | number
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
    admins?: adminsOmit
    admin_preferences?: admin_preferencesOmit
    audit_logs?: audit_logsOmit
    behavior_profiles?: behavior_profilesOmit
    behavior_samples?: behavior_samplesOmit
    devices?: devicesOmit
    risk_events?: risk_eventsOmit
    security_alerts?: security_alertsOmit
    edit_requests?: edit_requestsOmit
    temporary_permissions?: temporary_permissionsOmit
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
   * Count Type AdminsCountOutputType
   */

  export type AdminsCountOutputType = {
    behavior_profiles: number
    behavior_samples: number
    devices: number
    risk_events: number
    edit_requests_requested: number
    edit_requests_approved: number
    temporary_permissions: number
  }

  export type AdminsCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    behavior_profiles?: boolean | AdminsCountOutputTypeCountBehavior_profilesArgs
    behavior_samples?: boolean | AdminsCountOutputTypeCountBehavior_samplesArgs
    devices?: boolean | AdminsCountOutputTypeCountDevicesArgs
    risk_events?: boolean | AdminsCountOutputTypeCountRisk_eventsArgs
    edit_requests_requested?: boolean | AdminsCountOutputTypeCountEdit_requests_requestedArgs
    edit_requests_approved?: boolean | AdminsCountOutputTypeCountEdit_requests_approvedArgs
    temporary_permissions?: boolean | AdminsCountOutputTypeCountTemporary_permissionsArgs
  }

  // Custom InputTypes
  /**
   * AdminsCountOutputType without action
   */
  export type AdminsCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminsCountOutputType
     */
    select?: AdminsCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * AdminsCountOutputType without action
   */
  export type AdminsCountOutputTypeCountBehavior_profilesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: behavior_profilesWhereInput
  }

  /**
   * AdminsCountOutputType without action
   */
  export type AdminsCountOutputTypeCountBehavior_samplesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: behavior_samplesWhereInput
  }

  /**
   * AdminsCountOutputType without action
   */
  export type AdminsCountOutputTypeCountDevicesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: devicesWhereInput
  }

  /**
   * AdminsCountOutputType without action
   */
  export type AdminsCountOutputTypeCountRisk_eventsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: risk_eventsWhereInput
  }

  /**
   * AdminsCountOutputType without action
   */
  export type AdminsCountOutputTypeCountEdit_requests_requestedArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: edit_requestsWhereInput
  }

  /**
   * AdminsCountOutputType without action
   */
  export type AdminsCountOutputTypeCountEdit_requests_approvedArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: edit_requestsWhereInput
  }

  /**
   * AdminsCountOutputType without action
   */
  export type AdminsCountOutputTypeCountTemporary_permissionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: temporary_permissionsWhereInput
  }


  /**
   * Models
   */

  /**
   * Model admins
   */

  export type AggregateAdmins = {
    _count: AdminsCountAggregateOutputType | null
    _avg: AdminsAvgAggregateOutputType | null
    _sum: AdminsSumAggregateOutputType | null
    _min: AdminsMinAggregateOutputType | null
    _max: AdminsMaxAggregateOutputType | null
  }

  export type AdminsAvgAggregateOutputType = {
    id: number | null
    parent_admin_id: number | null
  }

  export type AdminsSumAggregateOutputType = {
    id: number | null
    parent_admin_id: number | null
  }

  export type AdminsMinAggregateOutputType = {
    id: number | null
    full_name: string | null
    email: string | null
    password_hash: string | null
    created_at: Date | null
    role: string | null
    phone_number: string | null
    parent_admin_id: number | null
    status: string | null
  }

  export type AdminsMaxAggregateOutputType = {
    id: number | null
    full_name: string | null
    email: string | null
    password_hash: string | null
    created_at: Date | null
    role: string | null
    phone_number: string | null
    parent_admin_id: number | null
    status: string | null
  }

  export type AdminsCountAggregateOutputType = {
    id: number
    full_name: number
    email: number
    password_hash: number
    created_at: number
    role: number
    phone_number: number
    parent_admin_id: number
    status: number
    _all: number
  }


  export type AdminsAvgAggregateInputType = {
    id?: true
    parent_admin_id?: true
  }

  export type AdminsSumAggregateInputType = {
    id?: true
    parent_admin_id?: true
  }

  export type AdminsMinAggregateInputType = {
    id?: true
    full_name?: true
    email?: true
    password_hash?: true
    created_at?: true
    role?: true
    phone_number?: true
    parent_admin_id?: true
    status?: true
  }

  export type AdminsMaxAggregateInputType = {
    id?: true
    full_name?: true
    email?: true
    password_hash?: true
    created_at?: true
    role?: true
    phone_number?: true
    parent_admin_id?: true
    status?: true
  }

  export type AdminsCountAggregateInputType = {
    id?: true
    full_name?: true
    email?: true
    password_hash?: true
    created_at?: true
    role?: true
    phone_number?: true
    parent_admin_id?: true
    status?: true
    _all?: true
  }

  export type AdminsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which admins to aggregate.
     */
    where?: adminsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of admins to fetch.
     */
    orderBy?: adminsOrderByWithRelationInput | adminsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: adminsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` admins from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` admins.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned admins
    **/
    _count?: true | AdminsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AdminsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AdminsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AdminsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AdminsMaxAggregateInputType
  }

  export type GetAdminsAggregateType<T extends AdminsAggregateArgs> = {
        [P in keyof T & keyof AggregateAdmins]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAdmins[P]>
      : GetScalarType<T[P], AggregateAdmins[P]>
  }




  export type adminsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: adminsWhereInput
    orderBy?: adminsOrderByWithAggregationInput | adminsOrderByWithAggregationInput[]
    by: AdminsScalarFieldEnum[] | AdminsScalarFieldEnum
    having?: adminsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AdminsCountAggregateInputType | true
    _avg?: AdminsAvgAggregateInputType
    _sum?: AdminsSumAggregateInputType
    _min?: AdminsMinAggregateInputType
    _max?: AdminsMaxAggregateInputType
  }

  export type AdminsGroupByOutputType = {
    id: number
    full_name: string
    email: string
    password_hash: string
    created_at: Date | null
    role: string
    phone_number: string | null
    parent_admin_id: number | null
    status: string | null
    _count: AdminsCountAggregateOutputType | null
    _avg: AdminsAvgAggregateOutputType | null
    _sum: AdminsSumAggregateOutputType | null
    _min: AdminsMinAggregateOutputType | null
    _max: AdminsMaxAggregateOutputType | null
  }

  type GetAdminsGroupByPayload<T extends adminsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AdminsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AdminsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AdminsGroupByOutputType[P]>
            : GetScalarType<T[P], AdminsGroupByOutputType[P]>
        }
      >
    >


  export type adminsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    full_name?: boolean
    email?: boolean
    password_hash?: boolean
    created_at?: boolean
    role?: boolean
    phone_number?: boolean
    parent_admin_id?: boolean
    status?: boolean
    behavior_profiles?: boolean | admins$behavior_profilesArgs<ExtArgs>
    behavior_samples?: boolean | admins$behavior_samplesArgs<ExtArgs>
    devices?: boolean | admins$devicesArgs<ExtArgs>
    risk_events?: boolean | admins$risk_eventsArgs<ExtArgs>
    preferences?: boolean | admins$preferencesArgs<ExtArgs>
    edit_requests_requested?: boolean | admins$edit_requests_requestedArgs<ExtArgs>
    edit_requests_approved?: boolean | admins$edit_requests_approvedArgs<ExtArgs>
    temporary_permissions?: boolean | admins$temporary_permissionsArgs<ExtArgs>
    _count?: boolean | AdminsCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["admins"]>

  export type adminsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    full_name?: boolean
    email?: boolean
    password_hash?: boolean
    created_at?: boolean
    role?: boolean
    phone_number?: boolean
    parent_admin_id?: boolean
    status?: boolean
  }, ExtArgs["result"]["admins"]>

  export type adminsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    full_name?: boolean
    email?: boolean
    password_hash?: boolean
    created_at?: boolean
    role?: boolean
    phone_number?: boolean
    parent_admin_id?: boolean
    status?: boolean
  }, ExtArgs["result"]["admins"]>

  export type adminsSelectScalar = {
    id?: boolean
    full_name?: boolean
    email?: boolean
    password_hash?: boolean
    created_at?: boolean
    role?: boolean
    phone_number?: boolean
    parent_admin_id?: boolean
    status?: boolean
  }

  export type adminsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "full_name" | "email" | "password_hash" | "created_at" | "role" | "phone_number" | "parent_admin_id" | "status", ExtArgs["result"]["admins"]>
  export type adminsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    behavior_profiles?: boolean | admins$behavior_profilesArgs<ExtArgs>
    behavior_samples?: boolean | admins$behavior_samplesArgs<ExtArgs>
    devices?: boolean | admins$devicesArgs<ExtArgs>
    risk_events?: boolean | admins$risk_eventsArgs<ExtArgs>
    preferences?: boolean | admins$preferencesArgs<ExtArgs>
    edit_requests_requested?: boolean | admins$edit_requests_requestedArgs<ExtArgs>
    edit_requests_approved?: boolean | admins$edit_requests_approvedArgs<ExtArgs>
    temporary_permissions?: boolean | admins$temporary_permissionsArgs<ExtArgs>
    _count?: boolean | AdminsCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type adminsIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type adminsIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $adminsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "admins"
    objects: {
      behavior_profiles: Prisma.$behavior_profilesPayload<ExtArgs>[]
      behavior_samples: Prisma.$behavior_samplesPayload<ExtArgs>[]
      devices: Prisma.$devicesPayload<ExtArgs>[]
      risk_events: Prisma.$risk_eventsPayload<ExtArgs>[]
      preferences: Prisma.$admin_preferencesPayload<ExtArgs> | null
      edit_requests_requested: Prisma.$edit_requestsPayload<ExtArgs>[]
      edit_requests_approved: Prisma.$edit_requestsPayload<ExtArgs>[]
      temporary_permissions: Prisma.$temporary_permissionsPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      full_name: string
      email: string
      password_hash: string
      created_at: Date | null
      role: string
      phone_number: string | null
      parent_admin_id: number | null
      status: string | null
    }, ExtArgs["result"]["admins"]>
    composites: {}
  }

  type adminsGetPayload<S extends boolean | null | undefined | adminsDefaultArgs> = $Result.GetResult<Prisma.$adminsPayload, S>

  type adminsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<adminsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AdminsCountAggregateInputType | true
    }

  export interface adminsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['admins'], meta: { name: 'admins' } }
    /**
     * Find zero or one Admins that matches the filter.
     * @param {adminsFindUniqueArgs} args - Arguments to find a Admins
     * @example
     * // Get one Admins
     * const admins = await prisma.admins.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends adminsFindUniqueArgs>(args: SelectSubset<T, adminsFindUniqueArgs<ExtArgs>>): Prisma__adminsClient<$Result.GetResult<Prisma.$adminsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Admins that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {adminsFindUniqueOrThrowArgs} args - Arguments to find a Admins
     * @example
     * // Get one Admins
     * const admins = await prisma.admins.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends adminsFindUniqueOrThrowArgs>(args: SelectSubset<T, adminsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__adminsClient<$Result.GetResult<Prisma.$adminsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Admins that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {adminsFindFirstArgs} args - Arguments to find a Admins
     * @example
     * // Get one Admins
     * const admins = await prisma.admins.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends adminsFindFirstArgs>(args?: SelectSubset<T, adminsFindFirstArgs<ExtArgs>>): Prisma__adminsClient<$Result.GetResult<Prisma.$adminsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Admins that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {adminsFindFirstOrThrowArgs} args - Arguments to find a Admins
     * @example
     * // Get one Admins
     * const admins = await prisma.admins.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends adminsFindFirstOrThrowArgs>(args?: SelectSubset<T, adminsFindFirstOrThrowArgs<ExtArgs>>): Prisma__adminsClient<$Result.GetResult<Prisma.$adminsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Admins that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {adminsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Admins
     * const admins = await prisma.admins.findMany()
     * 
     * // Get first 10 Admins
     * const admins = await prisma.admins.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const adminsWithIdOnly = await prisma.admins.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends adminsFindManyArgs>(args?: SelectSubset<T, adminsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$adminsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Admins.
     * @param {adminsCreateArgs} args - Arguments to create a Admins.
     * @example
     * // Create one Admins
     * const Admins = await prisma.admins.create({
     *   data: {
     *     // ... data to create a Admins
     *   }
     * })
     * 
     */
    create<T extends adminsCreateArgs>(args: SelectSubset<T, adminsCreateArgs<ExtArgs>>): Prisma__adminsClient<$Result.GetResult<Prisma.$adminsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Admins.
     * @param {adminsCreateManyArgs} args - Arguments to create many Admins.
     * @example
     * // Create many Admins
     * const admins = await prisma.admins.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends adminsCreateManyArgs>(args?: SelectSubset<T, adminsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Admins and returns the data saved in the database.
     * @param {adminsCreateManyAndReturnArgs} args - Arguments to create many Admins.
     * @example
     * // Create many Admins
     * const admins = await prisma.admins.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Admins and only return the `id`
     * const adminsWithIdOnly = await prisma.admins.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends adminsCreateManyAndReturnArgs>(args?: SelectSubset<T, adminsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$adminsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Admins.
     * @param {adminsDeleteArgs} args - Arguments to delete one Admins.
     * @example
     * // Delete one Admins
     * const Admins = await prisma.admins.delete({
     *   where: {
     *     // ... filter to delete one Admins
     *   }
     * })
     * 
     */
    delete<T extends adminsDeleteArgs>(args: SelectSubset<T, adminsDeleteArgs<ExtArgs>>): Prisma__adminsClient<$Result.GetResult<Prisma.$adminsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Admins.
     * @param {adminsUpdateArgs} args - Arguments to update one Admins.
     * @example
     * // Update one Admins
     * const admins = await prisma.admins.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends adminsUpdateArgs>(args: SelectSubset<T, adminsUpdateArgs<ExtArgs>>): Prisma__adminsClient<$Result.GetResult<Prisma.$adminsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Admins.
     * @param {adminsDeleteManyArgs} args - Arguments to filter Admins to delete.
     * @example
     * // Delete a few Admins
     * const { count } = await prisma.admins.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends adminsDeleteManyArgs>(args?: SelectSubset<T, adminsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Admins.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {adminsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Admins
     * const admins = await prisma.admins.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends adminsUpdateManyArgs>(args: SelectSubset<T, adminsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Admins and returns the data updated in the database.
     * @param {adminsUpdateManyAndReturnArgs} args - Arguments to update many Admins.
     * @example
     * // Update many Admins
     * const admins = await prisma.admins.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Admins and only return the `id`
     * const adminsWithIdOnly = await prisma.admins.updateManyAndReturn({
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
    updateManyAndReturn<T extends adminsUpdateManyAndReturnArgs>(args: SelectSubset<T, adminsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$adminsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Admins.
     * @param {adminsUpsertArgs} args - Arguments to update or create a Admins.
     * @example
     * // Update or create a Admins
     * const admins = await prisma.admins.upsert({
     *   create: {
     *     // ... data to create a Admins
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Admins we want to update
     *   }
     * })
     */
    upsert<T extends adminsUpsertArgs>(args: SelectSubset<T, adminsUpsertArgs<ExtArgs>>): Prisma__adminsClient<$Result.GetResult<Prisma.$adminsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Admins.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {adminsCountArgs} args - Arguments to filter Admins to count.
     * @example
     * // Count the number of Admins
     * const count = await prisma.admins.count({
     *   where: {
     *     // ... the filter for the Admins we want to count
     *   }
     * })
    **/
    count<T extends adminsCountArgs>(
      args?: Subset<T, adminsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AdminsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Admins.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends AdminsAggregateArgs>(args: Subset<T, AdminsAggregateArgs>): Prisma.PrismaPromise<GetAdminsAggregateType<T>>

    /**
     * Group by Admins.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {adminsGroupByArgs} args - Group by arguments.
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
      T extends adminsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: adminsGroupByArgs['orderBy'] }
        : { orderBy?: adminsGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, adminsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAdminsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the admins model
   */
  readonly fields: adminsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for admins.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__adminsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    behavior_profiles<T extends admins$behavior_profilesArgs<ExtArgs> = {}>(args?: Subset<T, admins$behavior_profilesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$behavior_profilesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    behavior_samples<T extends admins$behavior_samplesArgs<ExtArgs> = {}>(args?: Subset<T, admins$behavior_samplesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$behavior_samplesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    devices<T extends admins$devicesArgs<ExtArgs> = {}>(args?: Subset<T, admins$devicesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$devicesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    risk_events<T extends admins$risk_eventsArgs<ExtArgs> = {}>(args?: Subset<T, admins$risk_eventsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$risk_eventsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    preferences<T extends admins$preferencesArgs<ExtArgs> = {}>(args?: Subset<T, admins$preferencesArgs<ExtArgs>>): Prisma__admin_preferencesClient<$Result.GetResult<Prisma.$admin_preferencesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    edit_requests_requested<T extends admins$edit_requests_requestedArgs<ExtArgs> = {}>(args?: Subset<T, admins$edit_requests_requestedArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$edit_requestsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    edit_requests_approved<T extends admins$edit_requests_approvedArgs<ExtArgs> = {}>(args?: Subset<T, admins$edit_requests_approvedArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$edit_requestsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    temporary_permissions<T extends admins$temporary_permissionsArgs<ExtArgs> = {}>(args?: Subset<T, admins$temporary_permissionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$temporary_permissionsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the admins model
   */
  interface adminsFieldRefs {
    readonly id: FieldRef<"admins", 'Int'>
    readonly full_name: FieldRef<"admins", 'String'>
    readonly email: FieldRef<"admins", 'String'>
    readonly password_hash: FieldRef<"admins", 'String'>
    readonly created_at: FieldRef<"admins", 'DateTime'>
    readonly role: FieldRef<"admins", 'String'>
    readonly phone_number: FieldRef<"admins", 'String'>
    readonly parent_admin_id: FieldRef<"admins", 'Int'>
    readonly status: FieldRef<"admins", 'String'>
  }
    

  // Custom InputTypes
  /**
   * admins findUnique
   */
  export type adminsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the admins
     */
    select?: adminsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the admins
     */
    omit?: adminsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: adminsInclude<ExtArgs> | null
    /**
     * Filter, which admins to fetch.
     */
    where: adminsWhereUniqueInput
  }

  /**
   * admins findUniqueOrThrow
   */
  export type adminsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the admins
     */
    select?: adminsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the admins
     */
    omit?: adminsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: adminsInclude<ExtArgs> | null
    /**
     * Filter, which admins to fetch.
     */
    where: adminsWhereUniqueInput
  }

  /**
   * admins findFirst
   */
  export type adminsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the admins
     */
    select?: adminsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the admins
     */
    omit?: adminsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: adminsInclude<ExtArgs> | null
    /**
     * Filter, which admins to fetch.
     */
    where?: adminsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of admins to fetch.
     */
    orderBy?: adminsOrderByWithRelationInput | adminsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for admins.
     */
    cursor?: adminsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` admins from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` admins.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of admins.
     */
    distinct?: AdminsScalarFieldEnum | AdminsScalarFieldEnum[]
  }

  /**
   * admins findFirstOrThrow
   */
  export type adminsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the admins
     */
    select?: adminsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the admins
     */
    omit?: adminsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: adminsInclude<ExtArgs> | null
    /**
     * Filter, which admins to fetch.
     */
    where?: adminsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of admins to fetch.
     */
    orderBy?: adminsOrderByWithRelationInput | adminsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for admins.
     */
    cursor?: adminsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` admins from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` admins.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of admins.
     */
    distinct?: AdminsScalarFieldEnum | AdminsScalarFieldEnum[]
  }

  /**
   * admins findMany
   */
  export type adminsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the admins
     */
    select?: adminsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the admins
     */
    omit?: adminsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: adminsInclude<ExtArgs> | null
    /**
     * Filter, which admins to fetch.
     */
    where?: adminsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of admins to fetch.
     */
    orderBy?: adminsOrderByWithRelationInput | adminsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing admins.
     */
    cursor?: adminsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` admins from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` admins.
     */
    skip?: number
    distinct?: AdminsScalarFieldEnum | AdminsScalarFieldEnum[]
  }

  /**
   * admins create
   */
  export type adminsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the admins
     */
    select?: adminsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the admins
     */
    omit?: adminsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: adminsInclude<ExtArgs> | null
    /**
     * The data needed to create a admins.
     */
    data: XOR<adminsCreateInput, adminsUncheckedCreateInput>
  }

  /**
   * admins createMany
   */
  export type adminsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many admins.
     */
    data: adminsCreateManyInput | adminsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * admins createManyAndReturn
   */
  export type adminsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the admins
     */
    select?: adminsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the admins
     */
    omit?: adminsOmit<ExtArgs> | null
    /**
     * The data used to create many admins.
     */
    data: adminsCreateManyInput | adminsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * admins update
   */
  export type adminsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the admins
     */
    select?: adminsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the admins
     */
    omit?: adminsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: adminsInclude<ExtArgs> | null
    /**
     * The data needed to update a admins.
     */
    data: XOR<adminsUpdateInput, adminsUncheckedUpdateInput>
    /**
     * Choose, which admins to update.
     */
    where: adminsWhereUniqueInput
  }

  /**
   * admins updateMany
   */
  export type adminsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update admins.
     */
    data: XOR<adminsUpdateManyMutationInput, adminsUncheckedUpdateManyInput>
    /**
     * Filter which admins to update
     */
    where?: adminsWhereInput
    /**
     * Limit how many admins to update.
     */
    limit?: number
  }

  /**
   * admins updateManyAndReturn
   */
  export type adminsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the admins
     */
    select?: adminsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the admins
     */
    omit?: adminsOmit<ExtArgs> | null
    /**
     * The data used to update admins.
     */
    data: XOR<adminsUpdateManyMutationInput, adminsUncheckedUpdateManyInput>
    /**
     * Filter which admins to update
     */
    where?: adminsWhereInput
    /**
     * Limit how many admins to update.
     */
    limit?: number
  }

  /**
   * admins upsert
   */
  export type adminsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the admins
     */
    select?: adminsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the admins
     */
    omit?: adminsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: adminsInclude<ExtArgs> | null
    /**
     * The filter to search for the admins to update in case it exists.
     */
    where: adminsWhereUniqueInput
    /**
     * In case the admins found by the `where` argument doesn't exist, create a new admins with this data.
     */
    create: XOR<adminsCreateInput, adminsUncheckedCreateInput>
    /**
     * In case the admins was found with the provided `where` argument, update it with this data.
     */
    update: XOR<adminsUpdateInput, adminsUncheckedUpdateInput>
  }

  /**
   * admins delete
   */
  export type adminsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the admins
     */
    select?: adminsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the admins
     */
    omit?: adminsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: adminsInclude<ExtArgs> | null
    /**
     * Filter which admins to delete.
     */
    where: adminsWhereUniqueInput
  }

  /**
   * admins deleteMany
   */
  export type adminsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which admins to delete
     */
    where?: adminsWhereInput
    /**
     * Limit how many admins to delete.
     */
    limit?: number
  }

  /**
   * admins.behavior_profiles
   */
  export type admins$behavior_profilesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the behavior_profiles
     */
    select?: behavior_profilesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the behavior_profiles
     */
    omit?: behavior_profilesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: behavior_profilesInclude<ExtArgs> | null
    where?: behavior_profilesWhereInput
    orderBy?: behavior_profilesOrderByWithRelationInput | behavior_profilesOrderByWithRelationInput[]
    cursor?: behavior_profilesWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Behavior_profilesScalarFieldEnum | Behavior_profilesScalarFieldEnum[]
  }

  /**
   * admins.behavior_samples
   */
  export type admins$behavior_samplesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the behavior_samples
     */
    select?: behavior_samplesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the behavior_samples
     */
    omit?: behavior_samplesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: behavior_samplesInclude<ExtArgs> | null
    where?: behavior_samplesWhereInput
    orderBy?: behavior_samplesOrderByWithRelationInput | behavior_samplesOrderByWithRelationInput[]
    cursor?: behavior_samplesWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Behavior_samplesScalarFieldEnum | Behavior_samplesScalarFieldEnum[]
  }

  /**
   * admins.devices
   */
  export type admins$devicesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the devices
     */
    select?: devicesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the devices
     */
    omit?: devicesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: devicesInclude<ExtArgs> | null
    where?: devicesWhereInput
    orderBy?: devicesOrderByWithRelationInput | devicesOrderByWithRelationInput[]
    cursor?: devicesWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DevicesScalarFieldEnum | DevicesScalarFieldEnum[]
  }

  /**
   * admins.risk_events
   */
  export type admins$risk_eventsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the risk_events
     */
    select?: risk_eventsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the risk_events
     */
    omit?: risk_eventsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: risk_eventsInclude<ExtArgs> | null
    where?: risk_eventsWhereInput
    orderBy?: risk_eventsOrderByWithRelationInput | risk_eventsOrderByWithRelationInput[]
    cursor?: risk_eventsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Risk_eventsScalarFieldEnum | Risk_eventsScalarFieldEnum[]
  }

  /**
   * admins.preferences
   */
  export type admins$preferencesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the admin_preferences
     */
    select?: admin_preferencesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the admin_preferences
     */
    omit?: admin_preferencesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: admin_preferencesInclude<ExtArgs> | null
    where?: admin_preferencesWhereInput
  }

  /**
   * admins.edit_requests_requested
   */
  export type admins$edit_requests_requestedArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the edit_requests
     */
    select?: edit_requestsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the edit_requests
     */
    omit?: edit_requestsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: edit_requestsInclude<ExtArgs> | null
    where?: edit_requestsWhereInput
    orderBy?: edit_requestsOrderByWithRelationInput | edit_requestsOrderByWithRelationInput[]
    cursor?: edit_requestsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Edit_requestsScalarFieldEnum | Edit_requestsScalarFieldEnum[]
  }

  /**
   * admins.edit_requests_approved
   */
  export type admins$edit_requests_approvedArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the edit_requests
     */
    select?: edit_requestsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the edit_requests
     */
    omit?: edit_requestsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: edit_requestsInclude<ExtArgs> | null
    where?: edit_requestsWhereInput
    orderBy?: edit_requestsOrderByWithRelationInput | edit_requestsOrderByWithRelationInput[]
    cursor?: edit_requestsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Edit_requestsScalarFieldEnum | Edit_requestsScalarFieldEnum[]
  }

  /**
   * admins.temporary_permissions
   */
  export type admins$temporary_permissionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the temporary_permissions
     */
    select?: temporary_permissionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the temporary_permissions
     */
    omit?: temporary_permissionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: temporary_permissionsInclude<ExtArgs> | null
    where?: temporary_permissionsWhereInput
    orderBy?: temporary_permissionsOrderByWithRelationInput | temporary_permissionsOrderByWithRelationInput[]
    cursor?: temporary_permissionsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Temporary_permissionsScalarFieldEnum | Temporary_permissionsScalarFieldEnum[]
  }

  /**
   * admins without action
   */
  export type adminsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the admins
     */
    select?: adminsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the admins
     */
    omit?: adminsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: adminsInclude<ExtArgs> | null
  }


  /**
   * Model admin_preferences
   */

  export type AggregateAdmin_preferences = {
    _count: Admin_preferencesCountAggregateOutputType | null
    _avg: Admin_preferencesAvgAggregateOutputType | null
    _sum: Admin_preferencesSumAggregateOutputType | null
    _min: Admin_preferencesMinAggregateOutputType | null
    _max: Admin_preferencesMaxAggregateOutputType | null
  }

  export type Admin_preferencesAvgAggregateOutputType = {
    id: number | null
    admin_id: number | null
  }

  export type Admin_preferencesSumAggregateOutputType = {
    id: number | null
    admin_id: number | null
  }

  export type Admin_preferencesMinAggregateOutputType = {
    id: number | null
    admin_id: number | null
    language: string | null
    theme: string | null
    date_format: string | null
    time_format: string | null
    default_dashboard: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type Admin_preferencesMaxAggregateOutputType = {
    id: number | null
    admin_id: number | null
    language: string | null
    theme: string | null
    date_format: string | null
    time_format: string | null
    default_dashboard: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type Admin_preferencesCountAggregateOutputType = {
    id: number
    admin_id: number
    language: number
    theme: number
    date_format: number
    time_format: number
    default_dashboard: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type Admin_preferencesAvgAggregateInputType = {
    id?: true
    admin_id?: true
  }

  export type Admin_preferencesSumAggregateInputType = {
    id?: true
    admin_id?: true
  }

  export type Admin_preferencesMinAggregateInputType = {
    id?: true
    admin_id?: true
    language?: true
    theme?: true
    date_format?: true
    time_format?: true
    default_dashboard?: true
    created_at?: true
    updated_at?: true
  }

  export type Admin_preferencesMaxAggregateInputType = {
    id?: true
    admin_id?: true
    language?: true
    theme?: true
    date_format?: true
    time_format?: true
    default_dashboard?: true
    created_at?: true
    updated_at?: true
  }

  export type Admin_preferencesCountAggregateInputType = {
    id?: true
    admin_id?: true
    language?: true
    theme?: true
    date_format?: true
    time_format?: true
    default_dashboard?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type Admin_preferencesAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which admin_preferences to aggregate.
     */
    where?: admin_preferencesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of admin_preferences to fetch.
     */
    orderBy?: admin_preferencesOrderByWithRelationInput | admin_preferencesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: admin_preferencesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` admin_preferences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` admin_preferences.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned admin_preferences
    **/
    _count?: true | Admin_preferencesCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Admin_preferencesAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Admin_preferencesSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Admin_preferencesMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Admin_preferencesMaxAggregateInputType
  }

  export type GetAdmin_preferencesAggregateType<T extends Admin_preferencesAggregateArgs> = {
        [P in keyof T & keyof AggregateAdmin_preferences]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAdmin_preferences[P]>
      : GetScalarType<T[P], AggregateAdmin_preferences[P]>
  }




  export type admin_preferencesGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: admin_preferencesWhereInput
    orderBy?: admin_preferencesOrderByWithAggregationInput | admin_preferencesOrderByWithAggregationInput[]
    by: Admin_preferencesScalarFieldEnum[] | Admin_preferencesScalarFieldEnum
    having?: admin_preferencesScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Admin_preferencesCountAggregateInputType | true
    _avg?: Admin_preferencesAvgAggregateInputType
    _sum?: Admin_preferencesSumAggregateInputType
    _min?: Admin_preferencesMinAggregateInputType
    _max?: Admin_preferencesMaxAggregateInputType
  }

  export type Admin_preferencesGroupByOutputType = {
    id: number
    admin_id: number
    language: string
    theme: string
    date_format: string
    time_format: string
    default_dashboard: string
    created_at: Date
    updated_at: Date
    _count: Admin_preferencesCountAggregateOutputType | null
    _avg: Admin_preferencesAvgAggregateOutputType | null
    _sum: Admin_preferencesSumAggregateOutputType | null
    _min: Admin_preferencesMinAggregateOutputType | null
    _max: Admin_preferencesMaxAggregateOutputType | null
  }

  type GetAdmin_preferencesGroupByPayload<T extends admin_preferencesGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Admin_preferencesGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Admin_preferencesGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Admin_preferencesGroupByOutputType[P]>
            : GetScalarType<T[P], Admin_preferencesGroupByOutputType[P]>
        }
      >
    >


  export type admin_preferencesSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    admin_id?: boolean
    language?: boolean
    theme?: boolean
    date_format?: boolean
    time_format?: boolean
    default_dashboard?: boolean
    created_at?: boolean
    updated_at?: boolean
    admin?: boolean | adminsDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["admin_preferences"]>

  export type admin_preferencesSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    admin_id?: boolean
    language?: boolean
    theme?: boolean
    date_format?: boolean
    time_format?: boolean
    default_dashboard?: boolean
    created_at?: boolean
    updated_at?: boolean
    admin?: boolean | adminsDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["admin_preferences"]>

  export type admin_preferencesSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    admin_id?: boolean
    language?: boolean
    theme?: boolean
    date_format?: boolean
    time_format?: boolean
    default_dashboard?: boolean
    created_at?: boolean
    updated_at?: boolean
    admin?: boolean | adminsDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["admin_preferences"]>

  export type admin_preferencesSelectScalar = {
    id?: boolean
    admin_id?: boolean
    language?: boolean
    theme?: boolean
    date_format?: boolean
    time_format?: boolean
    default_dashboard?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type admin_preferencesOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "admin_id" | "language" | "theme" | "date_format" | "time_format" | "default_dashboard" | "created_at" | "updated_at", ExtArgs["result"]["admin_preferences"]>
  export type admin_preferencesInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    admin?: boolean | adminsDefaultArgs<ExtArgs>
  }
  export type admin_preferencesIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    admin?: boolean | adminsDefaultArgs<ExtArgs>
  }
  export type admin_preferencesIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    admin?: boolean | adminsDefaultArgs<ExtArgs>
  }

  export type $admin_preferencesPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "admin_preferences"
    objects: {
      admin: Prisma.$adminsPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      admin_id: number
      language: string
      theme: string
      date_format: string
      time_format: string
      default_dashboard: string
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["admin_preferences"]>
    composites: {}
  }

  type admin_preferencesGetPayload<S extends boolean | null | undefined | admin_preferencesDefaultArgs> = $Result.GetResult<Prisma.$admin_preferencesPayload, S>

  type admin_preferencesCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<admin_preferencesFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Admin_preferencesCountAggregateInputType | true
    }

  export interface admin_preferencesDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['admin_preferences'], meta: { name: 'admin_preferences' } }
    /**
     * Find zero or one Admin_preferences that matches the filter.
     * @param {admin_preferencesFindUniqueArgs} args - Arguments to find a Admin_preferences
     * @example
     * // Get one Admin_preferences
     * const admin_preferences = await prisma.admin_preferences.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends admin_preferencesFindUniqueArgs>(args: SelectSubset<T, admin_preferencesFindUniqueArgs<ExtArgs>>): Prisma__admin_preferencesClient<$Result.GetResult<Prisma.$admin_preferencesPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Admin_preferences that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {admin_preferencesFindUniqueOrThrowArgs} args - Arguments to find a Admin_preferences
     * @example
     * // Get one Admin_preferences
     * const admin_preferences = await prisma.admin_preferences.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends admin_preferencesFindUniqueOrThrowArgs>(args: SelectSubset<T, admin_preferencesFindUniqueOrThrowArgs<ExtArgs>>): Prisma__admin_preferencesClient<$Result.GetResult<Prisma.$admin_preferencesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Admin_preferences that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {admin_preferencesFindFirstArgs} args - Arguments to find a Admin_preferences
     * @example
     * // Get one Admin_preferences
     * const admin_preferences = await prisma.admin_preferences.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends admin_preferencesFindFirstArgs>(args?: SelectSubset<T, admin_preferencesFindFirstArgs<ExtArgs>>): Prisma__admin_preferencesClient<$Result.GetResult<Prisma.$admin_preferencesPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Admin_preferences that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {admin_preferencesFindFirstOrThrowArgs} args - Arguments to find a Admin_preferences
     * @example
     * // Get one Admin_preferences
     * const admin_preferences = await prisma.admin_preferences.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends admin_preferencesFindFirstOrThrowArgs>(args?: SelectSubset<T, admin_preferencesFindFirstOrThrowArgs<ExtArgs>>): Prisma__admin_preferencesClient<$Result.GetResult<Prisma.$admin_preferencesPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Admin_preferences that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {admin_preferencesFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Admin_preferences
     * const admin_preferences = await prisma.admin_preferences.findMany()
     * 
     * // Get first 10 Admin_preferences
     * const admin_preferences = await prisma.admin_preferences.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const admin_preferencesWithIdOnly = await prisma.admin_preferences.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends admin_preferencesFindManyArgs>(args?: SelectSubset<T, admin_preferencesFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$admin_preferencesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Admin_preferences.
     * @param {admin_preferencesCreateArgs} args - Arguments to create a Admin_preferences.
     * @example
     * // Create one Admin_preferences
     * const Admin_preferences = await prisma.admin_preferences.create({
     *   data: {
     *     // ... data to create a Admin_preferences
     *   }
     * })
     * 
     */
    create<T extends admin_preferencesCreateArgs>(args: SelectSubset<T, admin_preferencesCreateArgs<ExtArgs>>): Prisma__admin_preferencesClient<$Result.GetResult<Prisma.$admin_preferencesPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Admin_preferences.
     * @param {admin_preferencesCreateManyArgs} args - Arguments to create many Admin_preferences.
     * @example
     * // Create many Admin_preferences
     * const admin_preferences = await prisma.admin_preferences.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends admin_preferencesCreateManyArgs>(args?: SelectSubset<T, admin_preferencesCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Admin_preferences and returns the data saved in the database.
     * @param {admin_preferencesCreateManyAndReturnArgs} args - Arguments to create many Admin_preferences.
     * @example
     * // Create many Admin_preferences
     * const admin_preferences = await prisma.admin_preferences.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Admin_preferences and only return the `id`
     * const admin_preferencesWithIdOnly = await prisma.admin_preferences.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends admin_preferencesCreateManyAndReturnArgs>(args?: SelectSubset<T, admin_preferencesCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$admin_preferencesPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Admin_preferences.
     * @param {admin_preferencesDeleteArgs} args - Arguments to delete one Admin_preferences.
     * @example
     * // Delete one Admin_preferences
     * const Admin_preferences = await prisma.admin_preferences.delete({
     *   where: {
     *     // ... filter to delete one Admin_preferences
     *   }
     * })
     * 
     */
    delete<T extends admin_preferencesDeleteArgs>(args: SelectSubset<T, admin_preferencesDeleteArgs<ExtArgs>>): Prisma__admin_preferencesClient<$Result.GetResult<Prisma.$admin_preferencesPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Admin_preferences.
     * @param {admin_preferencesUpdateArgs} args - Arguments to update one Admin_preferences.
     * @example
     * // Update one Admin_preferences
     * const admin_preferences = await prisma.admin_preferences.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends admin_preferencesUpdateArgs>(args: SelectSubset<T, admin_preferencesUpdateArgs<ExtArgs>>): Prisma__admin_preferencesClient<$Result.GetResult<Prisma.$admin_preferencesPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Admin_preferences.
     * @param {admin_preferencesDeleteManyArgs} args - Arguments to filter Admin_preferences to delete.
     * @example
     * // Delete a few Admin_preferences
     * const { count } = await prisma.admin_preferences.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends admin_preferencesDeleteManyArgs>(args?: SelectSubset<T, admin_preferencesDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Admin_preferences.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {admin_preferencesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Admin_preferences
     * const admin_preferences = await prisma.admin_preferences.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends admin_preferencesUpdateManyArgs>(args: SelectSubset<T, admin_preferencesUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Admin_preferences and returns the data updated in the database.
     * @param {admin_preferencesUpdateManyAndReturnArgs} args - Arguments to update many Admin_preferences.
     * @example
     * // Update many Admin_preferences
     * const admin_preferences = await prisma.admin_preferences.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Admin_preferences and only return the `id`
     * const admin_preferencesWithIdOnly = await prisma.admin_preferences.updateManyAndReturn({
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
    updateManyAndReturn<T extends admin_preferencesUpdateManyAndReturnArgs>(args: SelectSubset<T, admin_preferencesUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$admin_preferencesPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Admin_preferences.
     * @param {admin_preferencesUpsertArgs} args - Arguments to update or create a Admin_preferences.
     * @example
     * // Update or create a Admin_preferences
     * const admin_preferences = await prisma.admin_preferences.upsert({
     *   create: {
     *     // ... data to create a Admin_preferences
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Admin_preferences we want to update
     *   }
     * })
     */
    upsert<T extends admin_preferencesUpsertArgs>(args: SelectSubset<T, admin_preferencesUpsertArgs<ExtArgs>>): Prisma__admin_preferencesClient<$Result.GetResult<Prisma.$admin_preferencesPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Admin_preferences.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {admin_preferencesCountArgs} args - Arguments to filter Admin_preferences to count.
     * @example
     * // Count the number of Admin_preferences
     * const count = await prisma.admin_preferences.count({
     *   where: {
     *     // ... the filter for the Admin_preferences we want to count
     *   }
     * })
    **/
    count<T extends admin_preferencesCountArgs>(
      args?: Subset<T, admin_preferencesCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Admin_preferencesCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Admin_preferences.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Admin_preferencesAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends Admin_preferencesAggregateArgs>(args: Subset<T, Admin_preferencesAggregateArgs>): Prisma.PrismaPromise<GetAdmin_preferencesAggregateType<T>>

    /**
     * Group by Admin_preferences.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {admin_preferencesGroupByArgs} args - Group by arguments.
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
      T extends admin_preferencesGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: admin_preferencesGroupByArgs['orderBy'] }
        : { orderBy?: admin_preferencesGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, admin_preferencesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAdmin_preferencesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the admin_preferences model
   */
  readonly fields: admin_preferencesFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for admin_preferences.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__admin_preferencesClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    admin<T extends adminsDefaultArgs<ExtArgs> = {}>(args?: Subset<T, adminsDefaultArgs<ExtArgs>>): Prisma__adminsClient<$Result.GetResult<Prisma.$adminsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the admin_preferences model
   */
  interface admin_preferencesFieldRefs {
    readonly id: FieldRef<"admin_preferences", 'Int'>
    readonly admin_id: FieldRef<"admin_preferences", 'Int'>
    readonly language: FieldRef<"admin_preferences", 'String'>
    readonly theme: FieldRef<"admin_preferences", 'String'>
    readonly date_format: FieldRef<"admin_preferences", 'String'>
    readonly time_format: FieldRef<"admin_preferences", 'String'>
    readonly default_dashboard: FieldRef<"admin_preferences", 'String'>
    readonly created_at: FieldRef<"admin_preferences", 'DateTime'>
    readonly updated_at: FieldRef<"admin_preferences", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * admin_preferences findUnique
   */
  export type admin_preferencesFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the admin_preferences
     */
    select?: admin_preferencesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the admin_preferences
     */
    omit?: admin_preferencesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: admin_preferencesInclude<ExtArgs> | null
    /**
     * Filter, which admin_preferences to fetch.
     */
    where: admin_preferencesWhereUniqueInput
  }

  /**
   * admin_preferences findUniqueOrThrow
   */
  export type admin_preferencesFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the admin_preferences
     */
    select?: admin_preferencesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the admin_preferences
     */
    omit?: admin_preferencesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: admin_preferencesInclude<ExtArgs> | null
    /**
     * Filter, which admin_preferences to fetch.
     */
    where: admin_preferencesWhereUniqueInput
  }

  /**
   * admin_preferences findFirst
   */
  export type admin_preferencesFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the admin_preferences
     */
    select?: admin_preferencesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the admin_preferences
     */
    omit?: admin_preferencesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: admin_preferencesInclude<ExtArgs> | null
    /**
     * Filter, which admin_preferences to fetch.
     */
    where?: admin_preferencesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of admin_preferences to fetch.
     */
    orderBy?: admin_preferencesOrderByWithRelationInput | admin_preferencesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for admin_preferences.
     */
    cursor?: admin_preferencesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` admin_preferences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` admin_preferences.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of admin_preferences.
     */
    distinct?: Admin_preferencesScalarFieldEnum | Admin_preferencesScalarFieldEnum[]
  }

  /**
   * admin_preferences findFirstOrThrow
   */
  export type admin_preferencesFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the admin_preferences
     */
    select?: admin_preferencesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the admin_preferences
     */
    omit?: admin_preferencesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: admin_preferencesInclude<ExtArgs> | null
    /**
     * Filter, which admin_preferences to fetch.
     */
    where?: admin_preferencesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of admin_preferences to fetch.
     */
    orderBy?: admin_preferencesOrderByWithRelationInput | admin_preferencesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for admin_preferences.
     */
    cursor?: admin_preferencesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` admin_preferences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` admin_preferences.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of admin_preferences.
     */
    distinct?: Admin_preferencesScalarFieldEnum | Admin_preferencesScalarFieldEnum[]
  }

  /**
   * admin_preferences findMany
   */
  export type admin_preferencesFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the admin_preferences
     */
    select?: admin_preferencesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the admin_preferences
     */
    omit?: admin_preferencesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: admin_preferencesInclude<ExtArgs> | null
    /**
     * Filter, which admin_preferences to fetch.
     */
    where?: admin_preferencesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of admin_preferences to fetch.
     */
    orderBy?: admin_preferencesOrderByWithRelationInput | admin_preferencesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing admin_preferences.
     */
    cursor?: admin_preferencesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` admin_preferences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` admin_preferences.
     */
    skip?: number
    distinct?: Admin_preferencesScalarFieldEnum | Admin_preferencesScalarFieldEnum[]
  }

  /**
   * admin_preferences create
   */
  export type admin_preferencesCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the admin_preferences
     */
    select?: admin_preferencesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the admin_preferences
     */
    omit?: admin_preferencesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: admin_preferencesInclude<ExtArgs> | null
    /**
     * The data needed to create a admin_preferences.
     */
    data: XOR<admin_preferencesCreateInput, admin_preferencesUncheckedCreateInput>
  }

  /**
   * admin_preferences createMany
   */
  export type admin_preferencesCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many admin_preferences.
     */
    data: admin_preferencesCreateManyInput | admin_preferencesCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * admin_preferences createManyAndReturn
   */
  export type admin_preferencesCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the admin_preferences
     */
    select?: admin_preferencesSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the admin_preferences
     */
    omit?: admin_preferencesOmit<ExtArgs> | null
    /**
     * The data used to create many admin_preferences.
     */
    data: admin_preferencesCreateManyInput | admin_preferencesCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: admin_preferencesIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * admin_preferences update
   */
  export type admin_preferencesUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the admin_preferences
     */
    select?: admin_preferencesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the admin_preferences
     */
    omit?: admin_preferencesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: admin_preferencesInclude<ExtArgs> | null
    /**
     * The data needed to update a admin_preferences.
     */
    data: XOR<admin_preferencesUpdateInput, admin_preferencesUncheckedUpdateInput>
    /**
     * Choose, which admin_preferences to update.
     */
    where: admin_preferencesWhereUniqueInput
  }

  /**
   * admin_preferences updateMany
   */
  export type admin_preferencesUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update admin_preferences.
     */
    data: XOR<admin_preferencesUpdateManyMutationInput, admin_preferencesUncheckedUpdateManyInput>
    /**
     * Filter which admin_preferences to update
     */
    where?: admin_preferencesWhereInput
    /**
     * Limit how many admin_preferences to update.
     */
    limit?: number
  }

  /**
   * admin_preferences updateManyAndReturn
   */
  export type admin_preferencesUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the admin_preferences
     */
    select?: admin_preferencesSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the admin_preferences
     */
    omit?: admin_preferencesOmit<ExtArgs> | null
    /**
     * The data used to update admin_preferences.
     */
    data: XOR<admin_preferencesUpdateManyMutationInput, admin_preferencesUncheckedUpdateManyInput>
    /**
     * Filter which admin_preferences to update
     */
    where?: admin_preferencesWhereInput
    /**
     * Limit how many admin_preferences to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: admin_preferencesIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * admin_preferences upsert
   */
  export type admin_preferencesUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the admin_preferences
     */
    select?: admin_preferencesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the admin_preferences
     */
    omit?: admin_preferencesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: admin_preferencesInclude<ExtArgs> | null
    /**
     * The filter to search for the admin_preferences to update in case it exists.
     */
    where: admin_preferencesWhereUniqueInput
    /**
     * In case the admin_preferences found by the `where` argument doesn't exist, create a new admin_preferences with this data.
     */
    create: XOR<admin_preferencesCreateInput, admin_preferencesUncheckedCreateInput>
    /**
     * In case the admin_preferences was found with the provided `where` argument, update it with this data.
     */
    update: XOR<admin_preferencesUpdateInput, admin_preferencesUncheckedUpdateInput>
  }

  /**
   * admin_preferences delete
   */
  export type admin_preferencesDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the admin_preferences
     */
    select?: admin_preferencesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the admin_preferences
     */
    omit?: admin_preferencesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: admin_preferencesInclude<ExtArgs> | null
    /**
     * Filter which admin_preferences to delete.
     */
    where: admin_preferencesWhereUniqueInput
  }

  /**
   * admin_preferences deleteMany
   */
  export type admin_preferencesDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which admin_preferences to delete
     */
    where?: admin_preferencesWhereInput
    /**
     * Limit how many admin_preferences to delete.
     */
    limit?: number
  }

  /**
   * admin_preferences without action
   */
  export type admin_preferencesDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the admin_preferences
     */
    select?: admin_preferencesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the admin_preferences
     */
    omit?: admin_preferencesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: admin_preferencesInclude<ExtArgs> | null
  }


  /**
   * Model audit_logs
   */

  export type AggregateAudit_logs = {
    _count: Audit_logsCountAggregateOutputType | null
    _avg: Audit_logsAvgAggregateOutputType | null
    _sum: Audit_logsSumAggregateOutputType | null
    _min: Audit_logsMinAggregateOutputType | null
    _max: Audit_logsMaxAggregateOutputType | null
  }

  export type Audit_logsAvgAggregateOutputType = {
    id: number | null
    admin_id: number | null
  }

  export type Audit_logsSumAggregateOutputType = {
    id: number | null
    admin_id: number | null
  }

  export type Audit_logsMinAggregateOutputType = {
    id: number | null
    admin_id: number | null
    event_type: string | null
    event_description: string | null
    ip_address: string | null
    created_at: Date | null
  }

  export type Audit_logsMaxAggregateOutputType = {
    id: number | null
    admin_id: number | null
    event_type: string | null
    event_description: string | null
    ip_address: string | null
    created_at: Date | null
  }

  export type Audit_logsCountAggregateOutputType = {
    id: number
    admin_id: number
    event_type: number
    event_description: number
    ip_address: number
    created_at: number
    _all: number
  }


  export type Audit_logsAvgAggregateInputType = {
    id?: true
    admin_id?: true
  }

  export type Audit_logsSumAggregateInputType = {
    id?: true
    admin_id?: true
  }

  export type Audit_logsMinAggregateInputType = {
    id?: true
    admin_id?: true
    event_type?: true
    event_description?: true
    ip_address?: true
    created_at?: true
  }

  export type Audit_logsMaxAggregateInputType = {
    id?: true
    admin_id?: true
    event_type?: true
    event_description?: true
    ip_address?: true
    created_at?: true
  }

  export type Audit_logsCountAggregateInputType = {
    id?: true
    admin_id?: true
    event_type?: true
    event_description?: true
    ip_address?: true
    created_at?: true
    _all?: true
  }

  export type Audit_logsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which audit_logs to aggregate.
     */
    where?: audit_logsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of audit_logs to fetch.
     */
    orderBy?: audit_logsOrderByWithRelationInput | audit_logsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: audit_logsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` audit_logs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` audit_logs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned audit_logs
    **/
    _count?: true | Audit_logsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Audit_logsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Audit_logsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Audit_logsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Audit_logsMaxAggregateInputType
  }

  export type GetAudit_logsAggregateType<T extends Audit_logsAggregateArgs> = {
        [P in keyof T & keyof AggregateAudit_logs]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAudit_logs[P]>
      : GetScalarType<T[P], AggregateAudit_logs[P]>
  }




  export type audit_logsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: audit_logsWhereInput
    orderBy?: audit_logsOrderByWithAggregationInput | audit_logsOrderByWithAggregationInput[]
    by: Audit_logsScalarFieldEnum[] | Audit_logsScalarFieldEnum
    having?: audit_logsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Audit_logsCountAggregateInputType | true
    _avg?: Audit_logsAvgAggregateInputType
    _sum?: Audit_logsSumAggregateInputType
    _min?: Audit_logsMinAggregateInputType
    _max?: Audit_logsMaxAggregateInputType
  }

  export type Audit_logsGroupByOutputType = {
    id: number
    admin_id: number | null
    event_type: string
    event_description: string | null
    ip_address: string | null
    created_at: Date | null
    _count: Audit_logsCountAggregateOutputType | null
    _avg: Audit_logsAvgAggregateOutputType | null
    _sum: Audit_logsSumAggregateOutputType | null
    _min: Audit_logsMinAggregateOutputType | null
    _max: Audit_logsMaxAggregateOutputType | null
  }

  type GetAudit_logsGroupByPayload<T extends audit_logsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Audit_logsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Audit_logsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Audit_logsGroupByOutputType[P]>
            : GetScalarType<T[P], Audit_logsGroupByOutputType[P]>
        }
      >
    >


  export type audit_logsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    admin_id?: boolean
    event_type?: boolean
    event_description?: boolean
    ip_address?: boolean
    created_at?: boolean
  }, ExtArgs["result"]["audit_logs"]>

  export type audit_logsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    admin_id?: boolean
    event_type?: boolean
    event_description?: boolean
    ip_address?: boolean
    created_at?: boolean
  }, ExtArgs["result"]["audit_logs"]>

  export type audit_logsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    admin_id?: boolean
    event_type?: boolean
    event_description?: boolean
    ip_address?: boolean
    created_at?: boolean
  }, ExtArgs["result"]["audit_logs"]>

  export type audit_logsSelectScalar = {
    id?: boolean
    admin_id?: boolean
    event_type?: boolean
    event_description?: boolean
    ip_address?: boolean
    created_at?: boolean
  }

  export type audit_logsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "admin_id" | "event_type" | "event_description" | "ip_address" | "created_at", ExtArgs["result"]["audit_logs"]>

  export type $audit_logsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "audit_logs"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      admin_id: number | null
      event_type: string
      event_description: string | null
      ip_address: string | null
      created_at: Date | null
    }, ExtArgs["result"]["audit_logs"]>
    composites: {}
  }

  type audit_logsGetPayload<S extends boolean | null | undefined | audit_logsDefaultArgs> = $Result.GetResult<Prisma.$audit_logsPayload, S>

  type audit_logsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<audit_logsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Audit_logsCountAggregateInputType | true
    }

  export interface audit_logsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['audit_logs'], meta: { name: 'audit_logs' } }
    /**
     * Find zero or one Audit_logs that matches the filter.
     * @param {audit_logsFindUniqueArgs} args - Arguments to find a Audit_logs
     * @example
     * // Get one Audit_logs
     * const audit_logs = await prisma.audit_logs.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends audit_logsFindUniqueArgs>(args: SelectSubset<T, audit_logsFindUniqueArgs<ExtArgs>>): Prisma__audit_logsClient<$Result.GetResult<Prisma.$audit_logsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Audit_logs that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {audit_logsFindUniqueOrThrowArgs} args - Arguments to find a Audit_logs
     * @example
     * // Get one Audit_logs
     * const audit_logs = await prisma.audit_logs.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends audit_logsFindUniqueOrThrowArgs>(args: SelectSubset<T, audit_logsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__audit_logsClient<$Result.GetResult<Prisma.$audit_logsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Audit_logs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {audit_logsFindFirstArgs} args - Arguments to find a Audit_logs
     * @example
     * // Get one Audit_logs
     * const audit_logs = await prisma.audit_logs.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends audit_logsFindFirstArgs>(args?: SelectSubset<T, audit_logsFindFirstArgs<ExtArgs>>): Prisma__audit_logsClient<$Result.GetResult<Prisma.$audit_logsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Audit_logs that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {audit_logsFindFirstOrThrowArgs} args - Arguments to find a Audit_logs
     * @example
     * // Get one Audit_logs
     * const audit_logs = await prisma.audit_logs.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends audit_logsFindFirstOrThrowArgs>(args?: SelectSubset<T, audit_logsFindFirstOrThrowArgs<ExtArgs>>): Prisma__audit_logsClient<$Result.GetResult<Prisma.$audit_logsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Audit_logs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {audit_logsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Audit_logs
     * const audit_logs = await prisma.audit_logs.findMany()
     * 
     * // Get first 10 Audit_logs
     * const audit_logs = await prisma.audit_logs.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const audit_logsWithIdOnly = await prisma.audit_logs.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends audit_logsFindManyArgs>(args?: SelectSubset<T, audit_logsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$audit_logsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Audit_logs.
     * @param {audit_logsCreateArgs} args - Arguments to create a Audit_logs.
     * @example
     * // Create one Audit_logs
     * const Audit_logs = await prisma.audit_logs.create({
     *   data: {
     *     // ... data to create a Audit_logs
     *   }
     * })
     * 
     */
    create<T extends audit_logsCreateArgs>(args: SelectSubset<T, audit_logsCreateArgs<ExtArgs>>): Prisma__audit_logsClient<$Result.GetResult<Prisma.$audit_logsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Audit_logs.
     * @param {audit_logsCreateManyArgs} args - Arguments to create many Audit_logs.
     * @example
     * // Create many Audit_logs
     * const audit_logs = await prisma.audit_logs.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends audit_logsCreateManyArgs>(args?: SelectSubset<T, audit_logsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Audit_logs and returns the data saved in the database.
     * @param {audit_logsCreateManyAndReturnArgs} args - Arguments to create many Audit_logs.
     * @example
     * // Create many Audit_logs
     * const audit_logs = await prisma.audit_logs.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Audit_logs and only return the `id`
     * const audit_logsWithIdOnly = await prisma.audit_logs.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends audit_logsCreateManyAndReturnArgs>(args?: SelectSubset<T, audit_logsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$audit_logsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Audit_logs.
     * @param {audit_logsDeleteArgs} args - Arguments to delete one Audit_logs.
     * @example
     * // Delete one Audit_logs
     * const Audit_logs = await prisma.audit_logs.delete({
     *   where: {
     *     // ... filter to delete one Audit_logs
     *   }
     * })
     * 
     */
    delete<T extends audit_logsDeleteArgs>(args: SelectSubset<T, audit_logsDeleteArgs<ExtArgs>>): Prisma__audit_logsClient<$Result.GetResult<Prisma.$audit_logsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Audit_logs.
     * @param {audit_logsUpdateArgs} args - Arguments to update one Audit_logs.
     * @example
     * // Update one Audit_logs
     * const audit_logs = await prisma.audit_logs.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends audit_logsUpdateArgs>(args: SelectSubset<T, audit_logsUpdateArgs<ExtArgs>>): Prisma__audit_logsClient<$Result.GetResult<Prisma.$audit_logsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Audit_logs.
     * @param {audit_logsDeleteManyArgs} args - Arguments to filter Audit_logs to delete.
     * @example
     * // Delete a few Audit_logs
     * const { count } = await prisma.audit_logs.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends audit_logsDeleteManyArgs>(args?: SelectSubset<T, audit_logsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Audit_logs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {audit_logsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Audit_logs
     * const audit_logs = await prisma.audit_logs.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends audit_logsUpdateManyArgs>(args: SelectSubset<T, audit_logsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Audit_logs and returns the data updated in the database.
     * @param {audit_logsUpdateManyAndReturnArgs} args - Arguments to update many Audit_logs.
     * @example
     * // Update many Audit_logs
     * const audit_logs = await prisma.audit_logs.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Audit_logs and only return the `id`
     * const audit_logsWithIdOnly = await prisma.audit_logs.updateManyAndReturn({
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
    updateManyAndReturn<T extends audit_logsUpdateManyAndReturnArgs>(args: SelectSubset<T, audit_logsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$audit_logsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Audit_logs.
     * @param {audit_logsUpsertArgs} args - Arguments to update or create a Audit_logs.
     * @example
     * // Update or create a Audit_logs
     * const audit_logs = await prisma.audit_logs.upsert({
     *   create: {
     *     // ... data to create a Audit_logs
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Audit_logs we want to update
     *   }
     * })
     */
    upsert<T extends audit_logsUpsertArgs>(args: SelectSubset<T, audit_logsUpsertArgs<ExtArgs>>): Prisma__audit_logsClient<$Result.GetResult<Prisma.$audit_logsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Audit_logs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {audit_logsCountArgs} args - Arguments to filter Audit_logs to count.
     * @example
     * // Count the number of Audit_logs
     * const count = await prisma.audit_logs.count({
     *   where: {
     *     // ... the filter for the Audit_logs we want to count
     *   }
     * })
    **/
    count<T extends audit_logsCountArgs>(
      args?: Subset<T, audit_logsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Audit_logsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Audit_logs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Audit_logsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends Audit_logsAggregateArgs>(args: Subset<T, Audit_logsAggregateArgs>): Prisma.PrismaPromise<GetAudit_logsAggregateType<T>>

    /**
     * Group by Audit_logs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {audit_logsGroupByArgs} args - Group by arguments.
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
      T extends audit_logsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: audit_logsGroupByArgs['orderBy'] }
        : { orderBy?: audit_logsGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, audit_logsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAudit_logsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the audit_logs model
   */
  readonly fields: audit_logsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for audit_logs.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__audit_logsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the audit_logs model
   */
  interface audit_logsFieldRefs {
    readonly id: FieldRef<"audit_logs", 'Int'>
    readonly admin_id: FieldRef<"audit_logs", 'Int'>
    readonly event_type: FieldRef<"audit_logs", 'String'>
    readonly event_description: FieldRef<"audit_logs", 'String'>
    readonly ip_address: FieldRef<"audit_logs", 'String'>
    readonly created_at: FieldRef<"audit_logs", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * audit_logs findUnique
   */
  export type audit_logsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the audit_logs
     */
    select?: audit_logsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the audit_logs
     */
    omit?: audit_logsOmit<ExtArgs> | null
    /**
     * Filter, which audit_logs to fetch.
     */
    where: audit_logsWhereUniqueInput
  }

  /**
   * audit_logs findUniqueOrThrow
   */
  export type audit_logsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the audit_logs
     */
    select?: audit_logsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the audit_logs
     */
    omit?: audit_logsOmit<ExtArgs> | null
    /**
     * Filter, which audit_logs to fetch.
     */
    where: audit_logsWhereUniqueInput
  }

  /**
   * audit_logs findFirst
   */
  export type audit_logsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the audit_logs
     */
    select?: audit_logsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the audit_logs
     */
    omit?: audit_logsOmit<ExtArgs> | null
    /**
     * Filter, which audit_logs to fetch.
     */
    where?: audit_logsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of audit_logs to fetch.
     */
    orderBy?: audit_logsOrderByWithRelationInput | audit_logsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for audit_logs.
     */
    cursor?: audit_logsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` audit_logs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` audit_logs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of audit_logs.
     */
    distinct?: Audit_logsScalarFieldEnum | Audit_logsScalarFieldEnum[]
  }

  /**
   * audit_logs findFirstOrThrow
   */
  export type audit_logsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the audit_logs
     */
    select?: audit_logsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the audit_logs
     */
    omit?: audit_logsOmit<ExtArgs> | null
    /**
     * Filter, which audit_logs to fetch.
     */
    where?: audit_logsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of audit_logs to fetch.
     */
    orderBy?: audit_logsOrderByWithRelationInput | audit_logsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for audit_logs.
     */
    cursor?: audit_logsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` audit_logs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` audit_logs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of audit_logs.
     */
    distinct?: Audit_logsScalarFieldEnum | Audit_logsScalarFieldEnum[]
  }

  /**
   * audit_logs findMany
   */
  export type audit_logsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the audit_logs
     */
    select?: audit_logsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the audit_logs
     */
    omit?: audit_logsOmit<ExtArgs> | null
    /**
     * Filter, which audit_logs to fetch.
     */
    where?: audit_logsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of audit_logs to fetch.
     */
    orderBy?: audit_logsOrderByWithRelationInput | audit_logsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing audit_logs.
     */
    cursor?: audit_logsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` audit_logs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` audit_logs.
     */
    skip?: number
    distinct?: Audit_logsScalarFieldEnum | Audit_logsScalarFieldEnum[]
  }

  /**
   * audit_logs create
   */
  export type audit_logsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the audit_logs
     */
    select?: audit_logsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the audit_logs
     */
    omit?: audit_logsOmit<ExtArgs> | null
    /**
     * The data needed to create a audit_logs.
     */
    data: XOR<audit_logsCreateInput, audit_logsUncheckedCreateInput>
  }

  /**
   * audit_logs createMany
   */
  export type audit_logsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many audit_logs.
     */
    data: audit_logsCreateManyInput | audit_logsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * audit_logs createManyAndReturn
   */
  export type audit_logsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the audit_logs
     */
    select?: audit_logsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the audit_logs
     */
    omit?: audit_logsOmit<ExtArgs> | null
    /**
     * The data used to create many audit_logs.
     */
    data: audit_logsCreateManyInput | audit_logsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * audit_logs update
   */
  export type audit_logsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the audit_logs
     */
    select?: audit_logsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the audit_logs
     */
    omit?: audit_logsOmit<ExtArgs> | null
    /**
     * The data needed to update a audit_logs.
     */
    data: XOR<audit_logsUpdateInput, audit_logsUncheckedUpdateInput>
    /**
     * Choose, which audit_logs to update.
     */
    where: audit_logsWhereUniqueInput
  }

  /**
   * audit_logs updateMany
   */
  export type audit_logsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update audit_logs.
     */
    data: XOR<audit_logsUpdateManyMutationInput, audit_logsUncheckedUpdateManyInput>
    /**
     * Filter which audit_logs to update
     */
    where?: audit_logsWhereInput
    /**
     * Limit how many audit_logs to update.
     */
    limit?: number
  }

  /**
   * audit_logs updateManyAndReturn
   */
  export type audit_logsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the audit_logs
     */
    select?: audit_logsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the audit_logs
     */
    omit?: audit_logsOmit<ExtArgs> | null
    /**
     * The data used to update audit_logs.
     */
    data: XOR<audit_logsUpdateManyMutationInput, audit_logsUncheckedUpdateManyInput>
    /**
     * Filter which audit_logs to update
     */
    where?: audit_logsWhereInput
    /**
     * Limit how many audit_logs to update.
     */
    limit?: number
  }

  /**
   * audit_logs upsert
   */
  export type audit_logsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the audit_logs
     */
    select?: audit_logsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the audit_logs
     */
    omit?: audit_logsOmit<ExtArgs> | null
    /**
     * The filter to search for the audit_logs to update in case it exists.
     */
    where: audit_logsWhereUniqueInput
    /**
     * In case the audit_logs found by the `where` argument doesn't exist, create a new audit_logs with this data.
     */
    create: XOR<audit_logsCreateInput, audit_logsUncheckedCreateInput>
    /**
     * In case the audit_logs was found with the provided `where` argument, update it with this data.
     */
    update: XOR<audit_logsUpdateInput, audit_logsUncheckedUpdateInput>
  }

  /**
   * audit_logs delete
   */
  export type audit_logsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the audit_logs
     */
    select?: audit_logsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the audit_logs
     */
    omit?: audit_logsOmit<ExtArgs> | null
    /**
     * Filter which audit_logs to delete.
     */
    where: audit_logsWhereUniqueInput
  }

  /**
   * audit_logs deleteMany
   */
  export type audit_logsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which audit_logs to delete
     */
    where?: audit_logsWhereInput
    /**
     * Limit how many audit_logs to delete.
     */
    limit?: number
  }

  /**
   * audit_logs without action
   */
  export type audit_logsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the audit_logs
     */
    select?: audit_logsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the audit_logs
     */
    omit?: audit_logsOmit<ExtArgs> | null
  }


  /**
   * Model behavior_profiles
   */

  export type AggregateBehavior_profiles = {
    _count: Behavior_profilesCountAggregateOutputType | null
    _avg: Behavior_profilesAvgAggregateOutputType | null
    _sum: Behavior_profilesSumAggregateOutputType | null
    _min: Behavior_profilesMinAggregateOutputType | null
    _max: Behavior_profilesMaxAggregateOutputType | null
  }

  export type Behavior_profilesAvgAggregateOutputType = {
    id: number | null
    admin_id: number | null
    avg_dwell_time: Decimal | null
    avg_flight_time: Decimal | null
    avg_typing_speed: Decimal | null
    avg_backspace_usage: Decimal | null
    avg_error_rate: Decimal | null
  }

  export type Behavior_profilesSumAggregateOutputType = {
    id: number | null
    admin_id: number | null
    avg_dwell_time: Decimal | null
    avg_flight_time: Decimal | null
    avg_typing_speed: Decimal | null
    avg_backspace_usage: Decimal | null
    avg_error_rate: Decimal | null
  }

  export type Behavior_profilesMinAggregateOutputType = {
    id: number | null
    admin_id: number | null
    enrollment_phrase: string | null
    avg_dwell_time: Decimal | null
    avg_flight_time: Decimal | null
    avg_typing_speed: Decimal | null
    avg_backspace_usage: Decimal | null
    avg_error_rate: Decimal | null
    created_at: Date | null
  }

  export type Behavior_profilesMaxAggregateOutputType = {
    id: number | null
    admin_id: number | null
    enrollment_phrase: string | null
    avg_dwell_time: Decimal | null
    avg_flight_time: Decimal | null
    avg_typing_speed: Decimal | null
    avg_backspace_usage: Decimal | null
    avg_error_rate: Decimal | null
    created_at: Date | null
  }

  export type Behavior_profilesCountAggregateOutputType = {
    id: number
    admin_id: number
    enrollment_phrase: number
    avg_dwell_time: number
    avg_flight_time: number
    avg_typing_speed: number
    avg_backspace_usage: number
    avg_error_rate: number
    created_at: number
    _all: number
  }


  export type Behavior_profilesAvgAggregateInputType = {
    id?: true
    admin_id?: true
    avg_dwell_time?: true
    avg_flight_time?: true
    avg_typing_speed?: true
    avg_backspace_usage?: true
    avg_error_rate?: true
  }

  export type Behavior_profilesSumAggregateInputType = {
    id?: true
    admin_id?: true
    avg_dwell_time?: true
    avg_flight_time?: true
    avg_typing_speed?: true
    avg_backspace_usage?: true
    avg_error_rate?: true
  }

  export type Behavior_profilesMinAggregateInputType = {
    id?: true
    admin_id?: true
    enrollment_phrase?: true
    avg_dwell_time?: true
    avg_flight_time?: true
    avg_typing_speed?: true
    avg_backspace_usage?: true
    avg_error_rate?: true
    created_at?: true
  }

  export type Behavior_profilesMaxAggregateInputType = {
    id?: true
    admin_id?: true
    enrollment_phrase?: true
    avg_dwell_time?: true
    avg_flight_time?: true
    avg_typing_speed?: true
    avg_backspace_usage?: true
    avg_error_rate?: true
    created_at?: true
  }

  export type Behavior_profilesCountAggregateInputType = {
    id?: true
    admin_id?: true
    enrollment_phrase?: true
    avg_dwell_time?: true
    avg_flight_time?: true
    avg_typing_speed?: true
    avg_backspace_usage?: true
    avg_error_rate?: true
    created_at?: true
    _all?: true
  }

  export type Behavior_profilesAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which behavior_profiles to aggregate.
     */
    where?: behavior_profilesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of behavior_profiles to fetch.
     */
    orderBy?: behavior_profilesOrderByWithRelationInput | behavior_profilesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: behavior_profilesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` behavior_profiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` behavior_profiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned behavior_profiles
    **/
    _count?: true | Behavior_profilesCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Behavior_profilesAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Behavior_profilesSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Behavior_profilesMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Behavior_profilesMaxAggregateInputType
  }

  export type GetBehavior_profilesAggregateType<T extends Behavior_profilesAggregateArgs> = {
        [P in keyof T & keyof AggregateBehavior_profiles]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBehavior_profiles[P]>
      : GetScalarType<T[P], AggregateBehavior_profiles[P]>
  }




  export type behavior_profilesGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: behavior_profilesWhereInput
    orderBy?: behavior_profilesOrderByWithAggregationInput | behavior_profilesOrderByWithAggregationInput[]
    by: Behavior_profilesScalarFieldEnum[] | Behavior_profilesScalarFieldEnum
    having?: behavior_profilesScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Behavior_profilesCountAggregateInputType | true
    _avg?: Behavior_profilesAvgAggregateInputType
    _sum?: Behavior_profilesSumAggregateInputType
    _min?: Behavior_profilesMinAggregateInputType
    _max?: Behavior_profilesMaxAggregateInputType
  }

  export type Behavior_profilesGroupByOutputType = {
    id: number
    admin_id: number
    enrollment_phrase: string
    avg_dwell_time: Decimal | null
    avg_flight_time: Decimal | null
    avg_typing_speed: Decimal | null
    avg_backspace_usage: Decimal | null
    avg_error_rate: Decimal | null
    created_at: Date | null
    _count: Behavior_profilesCountAggregateOutputType | null
    _avg: Behavior_profilesAvgAggregateOutputType | null
    _sum: Behavior_profilesSumAggregateOutputType | null
    _min: Behavior_profilesMinAggregateOutputType | null
    _max: Behavior_profilesMaxAggregateOutputType | null
  }

  type GetBehavior_profilesGroupByPayload<T extends behavior_profilesGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Behavior_profilesGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Behavior_profilesGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Behavior_profilesGroupByOutputType[P]>
            : GetScalarType<T[P], Behavior_profilesGroupByOutputType[P]>
        }
      >
    >


  export type behavior_profilesSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    admin_id?: boolean
    enrollment_phrase?: boolean
    avg_dwell_time?: boolean
    avg_flight_time?: boolean
    avg_typing_speed?: boolean
    avg_backspace_usage?: boolean
    avg_error_rate?: boolean
    created_at?: boolean
    admins?: boolean | adminsDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["behavior_profiles"]>

  export type behavior_profilesSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    admin_id?: boolean
    enrollment_phrase?: boolean
    avg_dwell_time?: boolean
    avg_flight_time?: boolean
    avg_typing_speed?: boolean
    avg_backspace_usage?: boolean
    avg_error_rate?: boolean
    created_at?: boolean
    admins?: boolean | adminsDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["behavior_profiles"]>

  export type behavior_profilesSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    admin_id?: boolean
    enrollment_phrase?: boolean
    avg_dwell_time?: boolean
    avg_flight_time?: boolean
    avg_typing_speed?: boolean
    avg_backspace_usage?: boolean
    avg_error_rate?: boolean
    created_at?: boolean
    admins?: boolean | adminsDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["behavior_profiles"]>

  export type behavior_profilesSelectScalar = {
    id?: boolean
    admin_id?: boolean
    enrollment_phrase?: boolean
    avg_dwell_time?: boolean
    avg_flight_time?: boolean
    avg_typing_speed?: boolean
    avg_backspace_usage?: boolean
    avg_error_rate?: boolean
    created_at?: boolean
  }

  export type behavior_profilesOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "admin_id" | "enrollment_phrase" | "avg_dwell_time" | "avg_flight_time" | "avg_typing_speed" | "avg_backspace_usage" | "avg_error_rate" | "created_at", ExtArgs["result"]["behavior_profiles"]>
  export type behavior_profilesInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    admins?: boolean | adminsDefaultArgs<ExtArgs>
  }
  export type behavior_profilesIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    admins?: boolean | adminsDefaultArgs<ExtArgs>
  }
  export type behavior_profilesIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    admins?: boolean | adminsDefaultArgs<ExtArgs>
  }

  export type $behavior_profilesPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "behavior_profiles"
    objects: {
      admins: Prisma.$adminsPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      admin_id: number
      enrollment_phrase: string
      avg_dwell_time: Prisma.Decimal | null
      avg_flight_time: Prisma.Decimal | null
      avg_typing_speed: Prisma.Decimal | null
      avg_backspace_usage: Prisma.Decimal | null
      avg_error_rate: Prisma.Decimal | null
      created_at: Date | null
    }, ExtArgs["result"]["behavior_profiles"]>
    composites: {}
  }

  type behavior_profilesGetPayload<S extends boolean | null | undefined | behavior_profilesDefaultArgs> = $Result.GetResult<Prisma.$behavior_profilesPayload, S>

  type behavior_profilesCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<behavior_profilesFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Behavior_profilesCountAggregateInputType | true
    }

  export interface behavior_profilesDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['behavior_profiles'], meta: { name: 'behavior_profiles' } }
    /**
     * Find zero or one Behavior_profiles that matches the filter.
     * @param {behavior_profilesFindUniqueArgs} args - Arguments to find a Behavior_profiles
     * @example
     * // Get one Behavior_profiles
     * const behavior_profiles = await prisma.behavior_profiles.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends behavior_profilesFindUniqueArgs>(args: SelectSubset<T, behavior_profilesFindUniqueArgs<ExtArgs>>): Prisma__behavior_profilesClient<$Result.GetResult<Prisma.$behavior_profilesPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Behavior_profiles that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {behavior_profilesFindUniqueOrThrowArgs} args - Arguments to find a Behavior_profiles
     * @example
     * // Get one Behavior_profiles
     * const behavior_profiles = await prisma.behavior_profiles.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends behavior_profilesFindUniqueOrThrowArgs>(args: SelectSubset<T, behavior_profilesFindUniqueOrThrowArgs<ExtArgs>>): Prisma__behavior_profilesClient<$Result.GetResult<Prisma.$behavior_profilesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Behavior_profiles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {behavior_profilesFindFirstArgs} args - Arguments to find a Behavior_profiles
     * @example
     * // Get one Behavior_profiles
     * const behavior_profiles = await prisma.behavior_profiles.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends behavior_profilesFindFirstArgs>(args?: SelectSubset<T, behavior_profilesFindFirstArgs<ExtArgs>>): Prisma__behavior_profilesClient<$Result.GetResult<Prisma.$behavior_profilesPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Behavior_profiles that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {behavior_profilesFindFirstOrThrowArgs} args - Arguments to find a Behavior_profiles
     * @example
     * // Get one Behavior_profiles
     * const behavior_profiles = await prisma.behavior_profiles.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends behavior_profilesFindFirstOrThrowArgs>(args?: SelectSubset<T, behavior_profilesFindFirstOrThrowArgs<ExtArgs>>): Prisma__behavior_profilesClient<$Result.GetResult<Prisma.$behavior_profilesPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Behavior_profiles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {behavior_profilesFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Behavior_profiles
     * const behavior_profiles = await prisma.behavior_profiles.findMany()
     * 
     * // Get first 10 Behavior_profiles
     * const behavior_profiles = await prisma.behavior_profiles.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const behavior_profilesWithIdOnly = await prisma.behavior_profiles.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends behavior_profilesFindManyArgs>(args?: SelectSubset<T, behavior_profilesFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$behavior_profilesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Behavior_profiles.
     * @param {behavior_profilesCreateArgs} args - Arguments to create a Behavior_profiles.
     * @example
     * // Create one Behavior_profiles
     * const Behavior_profiles = await prisma.behavior_profiles.create({
     *   data: {
     *     // ... data to create a Behavior_profiles
     *   }
     * })
     * 
     */
    create<T extends behavior_profilesCreateArgs>(args: SelectSubset<T, behavior_profilesCreateArgs<ExtArgs>>): Prisma__behavior_profilesClient<$Result.GetResult<Prisma.$behavior_profilesPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Behavior_profiles.
     * @param {behavior_profilesCreateManyArgs} args - Arguments to create many Behavior_profiles.
     * @example
     * // Create many Behavior_profiles
     * const behavior_profiles = await prisma.behavior_profiles.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends behavior_profilesCreateManyArgs>(args?: SelectSubset<T, behavior_profilesCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Behavior_profiles and returns the data saved in the database.
     * @param {behavior_profilesCreateManyAndReturnArgs} args - Arguments to create many Behavior_profiles.
     * @example
     * // Create many Behavior_profiles
     * const behavior_profiles = await prisma.behavior_profiles.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Behavior_profiles and only return the `id`
     * const behavior_profilesWithIdOnly = await prisma.behavior_profiles.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends behavior_profilesCreateManyAndReturnArgs>(args?: SelectSubset<T, behavior_profilesCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$behavior_profilesPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Behavior_profiles.
     * @param {behavior_profilesDeleteArgs} args - Arguments to delete one Behavior_profiles.
     * @example
     * // Delete one Behavior_profiles
     * const Behavior_profiles = await prisma.behavior_profiles.delete({
     *   where: {
     *     // ... filter to delete one Behavior_profiles
     *   }
     * })
     * 
     */
    delete<T extends behavior_profilesDeleteArgs>(args: SelectSubset<T, behavior_profilesDeleteArgs<ExtArgs>>): Prisma__behavior_profilesClient<$Result.GetResult<Prisma.$behavior_profilesPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Behavior_profiles.
     * @param {behavior_profilesUpdateArgs} args - Arguments to update one Behavior_profiles.
     * @example
     * // Update one Behavior_profiles
     * const behavior_profiles = await prisma.behavior_profiles.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends behavior_profilesUpdateArgs>(args: SelectSubset<T, behavior_profilesUpdateArgs<ExtArgs>>): Prisma__behavior_profilesClient<$Result.GetResult<Prisma.$behavior_profilesPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Behavior_profiles.
     * @param {behavior_profilesDeleteManyArgs} args - Arguments to filter Behavior_profiles to delete.
     * @example
     * // Delete a few Behavior_profiles
     * const { count } = await prisma.behavior_profiles.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends behavior_profilesDeleteManyArgs>(args?: SelectSubset<T, behavior_profilesDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Behavior_profiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {behavior_profilesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Behavior_profiles
     * const behavior_profiles = await prisma.behavior_profiles.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends behavior_profilesUpdateManyArgs>(args: SelectSubset<T, behavior_profilesUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Behavior_profiles and returns the data updated in the database.
     * @param {behavior_profilesUpdateManyAndReturnArgs} args - Arguments to update many Behavior_profiles.
     * @example
     * // Update many Behavior_profiles
     * const behavior_profiles = await prisma.behavior_profiles.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Behavior_profiles and only return the `id`
     * const behavior_profilesWithIdOnly = await prisma.behavior_profiles.updateManyAndReturn({
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
    updateManyAndReturn<T extends behavior_profilesUpdateManyAndReturnArgs>(args: SelectSubset<T, behavior_profilesUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$behavior_profilesPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Behavior_profiles.
     * @param {behavior_profilesUpsertArgs} args - Arguments to update or create a Behavior_profiles.
     * @example
     * // Update or create a Behavior_profiles
     * const behavior_profiles = await prisma.behavior_profiles.upsert({
     *   create: {
     *     // ... data to create a Behavior_profiles
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Behavior_profiles we want to update
     *   }
     * })
     */
    upsert<T extends behavior_profilesUpsertArgs>(args: SelectSubset<T, behavior_profilesUpsertArgs<ExtArgs>>): Prisma__behavior_profilesClient<$Result.GetResult<Prisma.$behavior_profilesPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Behavior_profiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {behavior_profilesCountArgs} args - Arguments to filter Behavior_profiles to count.
     * @example
     * // Count the number of Behavior_profiles
     * const count = await prisma.behavior_profiles.count({
     *   where: {
     *     // ... the filter for the Behavior_profiles we want to count
     *   }
     * })
    **/
    count<T extends behavior_profilesCountArgs>(
      args?: Subset<T, behavior_profilesCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Behavior_profilesCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Behavior_profiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Behavior_profilesAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends Behavior_profilesAggregateArgs>(args: Subset<T, Behavior_profilesAggregateArgs>): Prisma.PrismaPromise<GetBehavior_profilesAggregateType<T>>

    /**
     * Group by Behavior_profiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {behavior_profilesGroupByArgs} args - Group by arguments.
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
      T extends behavior_profilesGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: behavior_profilesGroupByArgs['orderBy'] }
        : { orderBy?: behavior_profilesGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, behavior_profilesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBehavior_profilesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the behavior_profiles model
   */
  readonly fields: behavior_profilesFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for behavior_profiles.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__behavior_profilesClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    admins<T extends adminsDefaultArgs<ExtArgs> = {}>(args?: Subset<T, adminsDefaultArgs<ExtArgs>>): Prisma__adminsClient<$Result.GetResult<Prisma.$adminsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the behavior_profiles model
   */
  interface behavior_profilesFieldRefs {
    readonly id: FieldRef<"behavior_profiles", 'Int'>
    readonly admin_id: FieldRef<"behavior_profiles", 'Int'>
    readonly enrollment_phrase: FieldRef<"behavior_profiles", 'String'>
    readonly avg_dwell_time: FieldRef<"behavior_profiles", 'Decimal'>
    readonly avg_flight_time: FieldRef<"behavior_profiles", 'Decimal'>
    readonly avg_typing_speed: FieldRef<"behavior_profiles", 'Decimal'>
    readonly avg_backspace_usage: FieldRef<"behavior_profiles", 'Decimal'>
    readonly avg_error_rate: FieldRef<"behavior_profiles", 'Decimal'>
    readonly created_at: FieldRef<"behavior_profiles", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * behavior_profiles findUnique
   */
  export type behavior_profilesFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the behavior_profiles
     */
    select?: behavior_profilesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the behavior_profiles
     */
    omit?: behavior_profilesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: behavior_profilesInclude<ExtArgs> | null
    /**
     * Filter, which behavior_profiles to fetch.
     */
    where: behavior_profilesWhereUniqueInput
  }

  /**
   * behavior_profiles findUniqueOrThrow
   */
  export type behavior_profilesFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the behavior_profiles
     */
    select?: behavior_profilesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the behavior_profiles
     */
    omit?: behavior_profilesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: behavior_profilesInclude<ExtArgs> | null
    /**
     * Filter, which behavior_profiles to fetch.
     */
    where: behavior_profilesWhereUniqueInput
  }

  /**
   * behavior_profiles findFirst
   */
  export type behavior_profilesFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the behavior_profiles
     */
    select?: behavior_profilesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the behavior_profiles
     */
    omit?: behavior_profilesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: behavior_profilesInclude<ExtArgs> | null
    /**
     * Filter, which behavior_profiles to fetch.
     */
    where?: behavior_profilesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of behavior_profiles to fetch.
     */
    orderBy?: behavior_profilesOrderByWithRelationInput | behavior_profilesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for behavior_profiles.
     */
    cursor?: behavior_profilesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` behavior_profiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` behavior_profiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of behavior_profiles.
     */
    distinct?: Behavior_profilesScalarFieldEnum | Behavior_profilesScalarFieldEnum[]
  }

  /**
   * behavior_profiles findFirstOrThrow
   */
  export type behavior_profilesFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the behavior_profiles
     */
    select?: behavior_profilesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the behavior_profiles
     */
    omit?: behavior_profilesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: behavior_profilesInclude<ExtArgs> | null
    /**
     * Filter, which behavior_profiles to fetch.
     */
    where?: behavior_profilesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of behavior_profiles to fetch.
     */
    orderBy?: behavior_profilesOrderByWithRelationInput | behavior_profilesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for behavior_profiles.
     */
    cursor?: behavior_profilesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` behavior_profiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` behavior_profiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of behavior_profiles.
     */
    distinct?: Behavior_profilesScalarFieldEnum | Behavior_profilesScalarFieldEnum[]
  }

  /**
   * behavior_profiles findMany
   */
  export type behavior_profilesFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the behavior_profiles
     */
    select?: behavior_profilesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the behavior_profiles
     */
    omit?: behavior_profilesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: behavior_profilesInclude<ExtArgs> | null
    /**
     * Filter, which behavior_profiles to fetch.
     */
    where?: behavior_profilesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of behavior_profiles to fetch.
     */
    orderBy?: behavior_profilesOrderByWithRelationInput | behavior_profilesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing behavior_profiles.
     */
    cursor?: behavior_profilesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` behavior_profiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` behavior_profiles.
     */
    skip?: number
    distinct?: Behavior_profilesScalarFieldEnum | Behavior_profilesScalarFieldEnum[]
  }

  /**
   * behavior_profiles create
   */
  export type behavior_profilesCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the behavior_profiles
     */
    select?: behavior_profilesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the behavior_profiles
     */
    omit?: behavior_profilesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: behavior_profilesInclude<ExtArgs> | null
    /**
     * The data needed to create a behavior_profiles.
     */
    data: XOR<behavior_profilesCreateInput, behavior_profilesUncheckedCreateInput>
  }

  /**
   * behavior_profiles createMany
   */
  export type behavior_profilesCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many behavior_profiles.
     */
    data: behavior_profilesCreateManyInput | behavior_profilesCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * behavior_profiles createManyAndReturn
   */
  export type behavior_profilesCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the behavior_profiles
     */
    select?: behavior_profilesSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the behavior_profiles
     */
    omit?: behavior_profilesOmit<ExtArgs> | null
    /**
     * The data used to create many behavior_profiles.
     */
    data: behavior_profilesCreateManyInput | behavior_profilesCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: behavior_profilesIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * behavior_profiles update
   */
  export type behavior_profilesUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the behavior_profiles
     */
    select?: behavior_profilesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the behavior_profiles
     */
    omit?: behavior_profilesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: behavior_profilesInclude<ExtArgs> | null
    /**
     * The data needed to update a behavior_profiles.
     */
    data: XOR<behavior_profilesUpdateInput, behavior_profilesUncheckedUpdateInput>
    /**
     * Choose, which behavior_profiles to update.
     */
    where: behavior_profilesWhereUniqueInput
  }

  /**
   * behavior_profiles updateMany
   */
  export type behavior_profilesUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update behavior_profiles.
     */
    data: XOR<behavior_profilesUpdateManyMutationInput, behavior_profilesUncheckedUpdateManyInput>
    /**
     * Filter which behavior_profiles to update
     */
    where?: behavior_profilesWhereInput
    /**
     * Limit how many behavior_profiles to update.
     */
    limit?: number
  }

  /**
   * behavior_profiles updateManyAndReturn
   */
  export type behavior_profilesUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the behavior_profiles
     */
    select?: behavior_profilesSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the behavior_profiles
     */
    omit?: behavior_profilesOmit<ExtArgs> | null
    /**
     * The data used to update behavior_profiles.
     */
    data: XOR<behavior_profilesUpdateManyMutationInput, behavior_profilesUncheckedUpdateManyInput>
    /**
     * Filter which behavior_profiles to update
     */
    where?: behavior_profilesWhereInput
    /**
     * Limit how many behavior_profiles to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: behavior_profilesIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * behavior_profiles upsert
   */
  export type behavior_profilesUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the behavior_profiles
     */
    select?: behavior_profilesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the behavior_profiles
     */
    omit?: behavior_profilesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: behavior_profilesInclude<ExtArgs> | null
    /**
     * The filter to search for the behavior_profiles to update in case it exists.
     */
    where: behavior_profilesWhereUniqueInput
    /**
     * In case the behavior_profiles found by the `where` argument doesn't exist, create a new behavior_profiles with this data.
     */
    create: XOR<behavior_profilesCreateInput, behavior_profilesUncheckedCreateInput>
    /**
     * In case the behavior_profiles was found with the provided `where` argument, update it with this data.
     */
    update: XOR<behavior_profilesUpdateInput, behavior_profilesUncheckedUpdateInput>
  }

  /**
   * behavior_profiles delete
   */
  export type behavior_profilesDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the behavior_profiles
     */
    select?: behavior_profilesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the behavior_profiles
     */
    omit?: behavior_profilesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: behavior_profilesInclude<ExtArgs> | null
    /**
     * Filter which behavior_profiles to delete.
     */
    where: behavior_profilesWhereUniqueInput
  }

  /**
   * behavior_profiles deleteMany
   */
  export type behavior_profilesDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which behavior_profiles to delete
     */
    where?: behavior_profilesWhereInput
    /**
     * Limit how many behavior_profiles to delete.
     */
    limit?: number
  }

  /**
   * behavior_profiles without action
   */
  export type behavior_profilesDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the behavior_profiles
     */
    select?: behavior_profilesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the behavior_profiles
     */
    omit?: behavior_profilesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: behavior_profilesInclude<ExtArgs> | null
  }


  /**
   * Model behavior_samples
   */

  export type AggregateBehavior_samples = {
    _count: Behavior_samplesCountAggregateOutputType | null
    _avg: Behavior_samplesAvgAggregateOutputType | null
    _sum: Behavior_samplesSumAggregateOutputType | null
    _min: Behavior_samplesMinAggregateOutputType | null
    _max: Behavior_samplesMaxAggregateOutputType | null
  }

  export type Behavior_samplesAvgAggregateOutputType = {
    id: number | null
    admin_id: number | null
    dwell_time: Decimal | null
    flight_time: Decimal | null
    typing_speed: Decimal | null
    backspace_usage: Decimal | null
    error_rate: Decimal | null
    similarity_score: Decimal | null
  }

  export type Behavior_samplesSumAggregateOutputType = {
    id: number | null
    admin_id: number | null
    dwell_time: Decimal | null
    flight_time: Decimal | null
    typing_speed: Decimal | null
    backspace_usage: Decimal | null
    error_rate: Decimal | null
    similarity_score: Decimal | null
  }

  export type Behavior_samplesMinAggregateOutputType = {
    id: number | null
    admin_id: number | null
    dwell_time: Decimal | null
    flight_time: Decimal | null
    typing_speed: Decimal | null
    backspace_usage: Decimal | null
    error_rate: Decimal | null
    similarity_score: Decimal | null
    verification_result: string | null
    created_at: Date | null
    sample_type: string | null
  }

  export type Behavior_samplesMaxAggregateOutputType = {
    id: number | null
    admin_id: number | null
    dwell_time: Decimal | null
    flight_time: Decimal | null
    typing_speed: Decimal | null
    backspace_usage: Decimal | null
    error_rate: Decimal | null
    similarity_score: Decimal | null
    verification_result: string | null
    created_at: Date | null
    sample_type: string | null
  }

  export type Behavior_samplesCountAggregateOutputType = {
    id: number
    admin_id: number
    dwell_time: number
    flight_time: number
    typing_speed: number
    backspace_usage: number
    error_rate: number
    similarity_score: number
    verification_result: number
    created_at: number
    sample_type: number
    _all: number
  }


  export type Behavior_samplesAvgAggregateInputType = {
    id?: true
    admin_id?: true
    dwell_time?: true
    flight_time?: true
    typing_speed?: true
    backspace_usage?: true
    error_rate?: true
    similarity_score?: true
  }

  export type Behavior_samplesSumAggregateInputType = {
    id?: true
    admin_id?: true
    dwell_time?: true
    flight_time?: true
    typing_speed?: true
    backspace_usage?: true
    error_rate?: true
    similarity_score?: true
  }

  export type Behavior_samplesMinAggregateInputType = {
    id?: true
    admin_id?: true
    dwell_time?: true
    flight_time?: true
    typing_speed?: true
    backspace_usage?: true
    error_rate?: true
    similarity_score?: true
    verification_result?: true
    created_at?: true
    sample_type?: true
  }

  export type Behavior_samplesMaxAggregateInputType = {
    id?: true
    admin_id?: true
    dwell_time?: true
    flight_time?: true
    typing_speed?: true
    backspace_usage?: true
    error_rate?: true
    similarity_score?: true
    verification_result?: true
    created_at?: true
    sample_type?: true
  }

  export type Behavior_samplesCountAggregateInputType = {
    id?: true
    admin_id?: true
    dwell_time?: true
    flight_time?: true
    typing_speed?: true
    backspace_usage?: true
    error_rate?: true
    similarity_score?: true
    verification_result?: true
    created_at?: true
    sample_type?: true
    _all?: true
  }

  export type Behavior_samplesAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which behavior_samples to aggregate.
     */
    where?: behavior_samplesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of behavior_samples to fetch.
     */
    orderBy?: behavior_samplesOrderByWithRelationInput | behavior_samplesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: behavior_samplesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` behavior_samples from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` behavior_samples.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned behavior_samples
    **/
    _count?: true | Behavior_samplesCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Behavior_samplesAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Behavior_samplesSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Behavior_samplesMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Behavior_samplesMaxAggregateInputType
  }

  export type GetBehavior_samplesAggregateType<T extends Behavior_samplesAggregateArgs> = {
        [P in keyof T & keyof AggregateBehavior_samples]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBehavior_samples[P]>
      : GetScalarType<T[P], AggregateBehavior_samples[P]>
  }




  export type behavior_samplesGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: behavior_samplesWhereInput
    orderBy?: behavior_samplesOrderByWithAggregationInput | behavior_samplesOrderByWithAggregationInput[]
    by: Behavior_samplesScalarFieldEnum[] | Behavior_samplesScalarFieldEnum
    having?: behavior_samplesScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Behavior_samplesCountAggregateInputType | true
    _avg?: Behavior_samplesAvgAggregateInputType
    _sum?: Behavior_samplesSumAggregateInputType
    _min?: Behavior_samplesMinAggregateInputType
    _max?: Behavior_samplesMaxAggregateInputType
  }

  export type Behavior_samplesGroupByOutputType = {
    id: number
    admin_id: number
    dwell_time: Decimal | null
    flight_time: Decimal | null
    typing_speed: Decimal | null
    backspace_usage: Decimal | null
    error_rate: Decimal | null
    similarity_score: Decimal | null
    verification_result: string | null
    created_at: Date | null
    sample_type: string | null
    _count: Behavior_samplesCountAggregateOutputType | null
    _avg: Behavior_samplesAvgAggregateOutputType | null
    _sum: Behavior_samplesSumAggregateOutputType | null
    _min: Behavior_samplesMinAggregateOutputType | null
    _max: Behavior_samplesMaxAggregateOutputType | null
  }

  type GetBehavior_samplesGroupByPayload<T extends behavior_samplesGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Behavior_samplesGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Behavior_samplesGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Behavior_samplesGroupByOutputType[P]>
            : GetScalarType<T[P], Behavior_samplesGroupByOutputType[P]>
        }
      >
    >


  export type behavior_samplesSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    admin_id?: boolean
    dwell_time?: boolean
    flight_time?: boolean
    typing_speed?: boolean
    backspace_usage?: boolean
    error_rate?: boolean
    similarity_score?: boolean
    verification_result?: boolean
    created_at?: boolean
    sample_type?: boolean
    admins?: boolean | adminsDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["behavior_samples"]>

  export type behavior_samplesSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    admin_id?: boolean
    dwell_time?: boolean
    flight_time?: boolean
    typing_speed?: boolean
    backspace_usage?: boolean
    error_rate?: boolean
    similarity_score?: boolean
    verification_result?: boolean
    created_at?: boolean
    sample_type?: boolean
    admins?: boolean | adminsDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["behavior_samples"]>

  export type behavior_samplesSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    admin_id?: boolean
    dwell_time?: boolean
    flight_time?: boolean
    typing_speed?: boolean
    backspace_usage?: boolean
    error_rate?: boolean
    similarity_score?: boolean
    verification_result?: boolean
    created_at?: boolean
    sample_type?: boolean
    admins?: boolean | adminsDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["behavior_samples"]>

  export type behavior_samplesSelectScalar = {
    id?: boolean
    admin_id?: boolean
    dwell_time?: boolean
    flight_time?: boolean
    typing_speed?: boolean
    backspace_usage?: boolean
    error_rate?: boolean
    similarity_score?: boolean
    verification_result?: boolean
    created_at?: boolean
    sample_type?: boolean
  }

  export type behavior_samplesOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "admin_id" | "dwell_time" | "flight_time" | "typing_speed" | "backspace_usage" | "error_rate" | "similarity_score" | "verification_result" | "created_at" | "sample_type", ExtArgs["result"]["behavior_samples"]>
  export type behavior_samplesInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    admins?: boolean | adminsDefaultArgs<ExtArgs>
  }
  export type behavior_samplesIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    admins?: boolean | adminsDefaultArgs<ExtArgs>
  }
  export type behavior_samplesIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    admins?: boolean | adminsDefaultArgs<ExtArgs>
  }

  export type $behavior_samplesPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "behavior_samples"
    objects: {
      admins: Prisma.$adminsPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      admin_id: number
      dwell_time: Prisma.Decimal | null
      flight_time: Prisma.Decimal | null
      typing_speed: Prisma.Decimal | null
      backspace_usage: Prisma.Decimal | null
      error_rate: Prisma.Decimal | null
      similarity_score: Prisma.Decimal | null
      verification_result: string | null
      created_at: Date | null
      sample_type: string | null
    }, ExtArgs["result"]["behavior_samples"]>
    composites: {}
  }

  type behavior_samplesGetPayload<S extends boolean | null | undefined | behavior_samplesDefaultArgs> = $Result.GetResult<Prisma.$behavior_samplesPayload, S>

  type behavior_samplesCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<behavior_samplesFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Behavior_samplesCountAggregateInputType | true
    }

  export interface behavior_samplesDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['behavior_samples'], meta: { name: 'behavior_samples' } }
    /**
     * Find zero or one Behavior_samples that matches the filter.
     * @param {behavior_samplesFindUniqueArgs} args - Arguments to find a Behavior_samples
     * @example
     * // Get one Behavior_samples
     * const behavior_samples = await prisma.behavior_samples.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends behavior_samplesFindUniqueArgs>(args: SelectSubset<T, behavior_samplesFindUniqueArgs<ExtArgs>>): Prisma__behavior_samplesClient<$Result.GetResult<Prisma.$behavior_samplesPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Behavior_samples that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {behavior_samplesFindUniqueOrThrowArgs} args - Arguments to find a Behavior_samples
     * @example
     * // Get one Behavior_samples
     * const behavior_samples = await prisma.behavior_samples.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends behavior_samplesFindUniqueOrThrowArgs>(args: SelectSubset<T, behavior_samplesFindUniqueOrThrowArgs<ExtArgs>>): Prisma__behavior_samplesClient<$Result.GetResult<Prisma.$behavior_samplesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Behavior_samples that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {behavior_samplesFindFirstArgs} args - Arguments to find a Behavior_samples
     * @example
     * // Get one Behavior_samples
     * const behavior_samples = await prisma.behavior_samples.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends behavior_samplesFindFirstArgs>(args?: SelectSubset<T, behavior_samplesFindFirstArgs<ExtArgs>>): Prisma__behavior_samplesClient<$Result.GetResult<Prisma.$behavior_samplesPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Behavior_samples that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {behavior_samplesFindFirstOrThrowArgs} args - Arguments to find a Behavior_samples
     * @example
     * // Get one Behavior_samples
     * const behavior_samples = await prisma.behavior_samples.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends behavior_samplesFindFirstOrThrowArgs>(args?: SelectSubset<T, behavior_samplesFindFirstOrThrowArgs<ExtArgs>>): Prisma__behavior_samplesClient<$Result.GetResult<Prisma.$behavior_samplesPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Behavior_samples that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {behavior_samplesFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Behavior_samples
     * const behavior_samples = await prisma.behavior_samples.findMany()
     * 
     * // Get first 10 Behavior_samples
     * const behavior_samples = await prisma.behavior_samples.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const behavior_samplesWithIdOnly = await prisma.behavior_samples.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends behavior_samplesFindManyArgs>(args?: SelectSubset<T, behavior_samplesFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$behavior_samplesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Behavior_samples.
     * @param {behavior_samplesCreateArgs} args - Arguments to create a Behavior_samples.
     * @example
     * // Create one Behavior_samples
     * const Behavior_samples = await prisma.behavior_samples.create({
     *   data: {
     *     // ... data to create a Behavior_samples
     *   }
     * })
     * 
     */
    create<T extends behavior_samplesCreateArgs>(args: SelectSubset<T, behavior_samplesCreateArgs<ExtArgs>>): Prisma__behavior_samplesClient<$Result.GetResult<Prisma.$behavior_samplesPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Behavior_samples.
     * @param {behavior_samplesCreateManyArgs} args - Arguments to create many Behavior_samples.
     * @example
     * // Create many Behavior_samples
     * const behavior_samples = await prisma.behavior_samples.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends behavior_samplesCreateManyArgs>(args?: SelectSubset<T, behavior_samplesCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Behavior_samples and returns the data saved in the database.
     * @param {behavior_samplesCreateManyAndReturnArgs} args - Arguments to create many Behavior_samples.
     * @example
     * // Create many Behavior_samples
     * const behavior_samples = await prisma.behavior_samples.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Behavior_samples and only return the `id`
     * const behavior_samplesWithIdOnly = await prisma.behavior_samples.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends behavior_samplesCreateManyAndReturnArgs>(args?: SelectSubset<T, behavior_samplesCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$behavior_samplesPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Behavior_samples.
     * @param {behavior_samplesDeleteArgs} args - Arguments to delete one Behavior_samples.
     * @example
     * // Delete one Behavior_samples
     * const Behavior_samples = await prisma.behavior_samples.delete({
     *   where: {
     *     // ... filter to delete one Behavior_samples
     *   }
     * })
     * 
     */
    delete<T extends behavior_samplesDeleteArgs>(args: SelectSubset<T, behavior_samplesDeleteArgs<ExtArgs>>): Prisma__behavior_samplesClient<$Result.GetResult<Prisma.$behavior_samplesPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Behavior_samples.
     * @param {behavior_samplesUpdateArgs} args - Arguments to update one Behavior_samples.
     * @example
     * // Update one Behavior_samples
     * const behavior_samples = await prisma.behavior_samples.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends behavior_samplesUpdateArgs>(args: SelectSubset<T, behavior_samplesUpdateArgs<ExtArgs>>): Prisma__behavior_samplesClient<$Result.GetResult<Prisma.$behavior_samplesPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Behavior_samples.
     * @param {behavior_samplesDeleteManyArgs} args - Arguments to filter Behavior_samples to delete.
     * @example
     * // Delete a few Behavior_samples
     * const { count } = await prisma.behavior_samples.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends behavior_samplesDeleteManyArgs>(args?: SelectSubset<T, behavior_samplesDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Behavior_samples.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {behavior_samplesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Behavior_samples
     * const behavior_samples = await prisma.behavior_samples.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends behavior_samplesUpdateManyArgs>(args: SelectSubset<T, behavior_samplesUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Behavior_samples and returns the data updated in the database.
     * @param {behavior_samplesUpdateManyAndReturnArgs} args - Arguments to update many Behavior_samples.
     * @example
     * // Update many Behavior_samples
     * const behavior_samples = await prisma.behavior_samples.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Behavior_samples and only return the `id`
     * const behavior_samplesWithIdOnly = await prisma.behavior_samples.updateManyAndReturn({
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
    updateManyAndReturn<T extends behavior_samplesUpdateManyAndReturnArgs>(args: SelectSubset<T, behavior_samplesUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$behavior_samplesPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Behavior_samples.
     * @param {behavior_samplesUpsertArgs} args - Arguments to update or create a Behavior_samples.
     * @example
     * // Update or create a Behavior_samples
     * const behavior_samples = await prisma.behavior_samples.upsert({
     *   create: {
     *     // ... data to create a Behavior_samples
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Behavior_samples we want to update
     *   }
     * })
     */
    upsert<T extends behavior_samplesUpsertArgs>(args: SelectSubset<T, behavior_samplesUpsertArgs<ExtArgs>>): Prisma__behavior_samplesClient<$Result.GetResult<Prisma.$behavior_samplesPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Behavior_samples.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {behavior_samplesCountArgs} args - Arguments to filter Behavior_samples to count.
     * @example
     * // Count the number of Behavior_samples
     * const count = await prisma.behavior_samples.count({
     *   where: {
     *     // ... the filter for the Behavior_samples we want to count
     *   }
     * })
    **/
    count<T extends behavior_samplesCountArgs>(
      args?: Subset<T, behavior_samplesCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Behavior_samplesCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Behavior_samples.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Behavior_samplesAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends Behavior_samplesAggregateArgs>(args: Subset<T, Behavior_samplesAggregateArgs>): Prisma.PrismaPromise<GetBehavior_samplesAggregateType<T>>

    /**
     * Group by Behavior_samples.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {behavior_samplesGroupByArgs} args - Group by arguments.
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
      T extends behavior_samplesGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: behavior_samplesGroupByArgs['orderBy'] }
        : { orderBy?: behavior_samplesGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, behavior_samplesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBehavior_samplesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the behavior_samples model
   */
  readonly fields: behavior_samplesFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for behavior_samples.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__behavior_samplesClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    admins<T extends adminsDefaultArgs<ExtArgs> = {}>(args?: Subset<T, adminsDefaultArgs<ExtArgs>>): Prisma__adminsClient<$Result.GetResult<Prisma.$adminsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the behavior_samples model
   */
  interface behavior_samplesFieldRefs {
    readonly id: FieldRef<"behavior_samples", 'Int'>
    readonly admin_id: FieldRef<"behavior_samples", 'Int'>
    readonly dwell_time: FieldRef<"behavior_samples", 'Decimal'>
    readonly flight_time: FieldRef<"behavior_samples", 'Decimal'>
    readonly typing_speed: FieldRef<"behavior_samples", 'Decimal'>
    readonly backspace_usage: FieldRef<"behavior_samples", 'Decimal'>
    readonly error_rate: FieldRef<"behavior_samples", 'Decimal'>
    readonly similarity_score: FieldRef<"behavior_samples", 'Decimal'>
    readonly verification_result: FieldRef<"behavior_samples", 'String'>
    readonly created_at: FieldRef<"behavior_samples", 'DateTime'>
    readonly sample_type: FieldRef<"behavior_samples", 'String'>
  }
    

  // Custom InputTypes
  /**
   * behavior_samples findUnique
   */
  export type behavior_samplesFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the behavior_samples
     */
    select?: behavior_samplesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the behavior_samples
     */
    omit?: behavior_samplesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: behavior_samplesInclude<ExtArgs> | null
    /**
     * Filter, which behavior_samples to fetch.
     */
    where: behavior_samplesWhereUniqueInput
  }

  /**
   * behavior_samples findUniqueOrThrow
   */
  export type behavior_samplesFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the behavior_samples
     */
    select?: behavior_samplesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the behavior_samples
     */
    omit?: behavior_samplesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: behavior_samplesInclude<ExtArgs> | null
    /**
     * Filter, which behavior_samples to fetch.
     */
    where: behavior_samplesWhereUniqueInput
  }

  /**
   * behavior_samples findFirst
   */
  export type behavior_samplesFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the behavior_samples
     */
    select?: behavior_samplesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the behavior_samples
     */
    omit?: behavior_samplesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: behavior_samplesInclude<ExtArgs> | null
    /**
     * Filter, which behavior_samples to fetch.
     */
    where?: behavior_samplesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of behavior_samples to fetch.
     */
    orderBy?: behavior_samplesOrderByWithRelationInput | behavior_samplesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for behavior_samples.
     */
    cursor?: behavior_samplesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` behavior_samples from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` behavior_samples.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of behavior_samples.
     */
    distinct?: Behavior_samplesScalarFieldEnum | Behavior_samplesScalarFieldEnum[]
  }

  /**
   * behavior_samples findFirstOrThrow
   */
  export type behavior_samplesFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the behavior_samples
     */
    select?: behavior_samplesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the behavior_samples
     */
    omit?: behavior_samplesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: behavior_samplesInclude<ExtArgs> | null
    /**
     * Filter, which behavior_samples to fetch.
     */
    where?: behavior_samplesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of behavior_samples to fetch.
     */
    orderBy?: behavior_samplesOrderByWithRelationInput | behavior_samplesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for behavior_samples.
     */
    cursor?: behavior_samplesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` behavior_samples from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` behavior_samples.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of behavior_samples.
     */
    distinct?: Behavior_samplesScalarFieldEnum | Behavior_samplesScalarFieldEnum[]
  }

  /**
   * behavior_samples findMany
   */
  export type behavior_samplesFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the behavior_samples
     */
    select?: behavior_samplesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the behavior_samples
     */
    omit?: behavior_samplesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: behavior_samplesInclude<ExtArgs> | null
    /**
     * Filter, which behavior_samples to fetch.
     */
    where?: behavior_samplesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of behavior_samples to fetch.
     */
    orderBy?: behavior_samplesOrderByWithRelationInput | behavior_samplesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing behavior_samples.
     */
    cursor?: behavior_samplesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` behavior_samples from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` behavior_samples.
     */
    skip?: number
    distinct?: Behavior_samplesScalarFieldEnum | Behavior_samplesScalarFieldEnum[]
  }

  /**
   * behavior_samples create
   */
  export type behavior_samplesCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the behavior_samples
     */
    select?: behavior_samplesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the behavior_samples
     */
    omit?: behavior_samplesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: behavior_samplesInclude<ExtArgs> | null
    /**
     * The data needed to create a behavior_samples.
     */
    data: XOR<behavior_samplesCreateInput, behavior_samplesUncheckedCreateInput>
  }

  /**
   * behavior_samples createMany
   */
  export type behavior_samplesCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many behavior_samples.
     */
    data: behavior_samplesCreateManyInput | behavior_samplesCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * behavior_samples createManyAndReturn
   */
  export type behavior_samplesCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the behavior_samples
     */
    select?: behavior_samplesSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the behavior_samples
     */
    omit?: behavior_samplesOmit<ExtArgs> | null
    /**
     * The data used to create many behavior_samples.
     */
    data: behavior_samplesCreateManyInput | behavior_samplesCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: behavior_samplesIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * behavior_samples update
   */
  export type behavior_samplesUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the behavior_samples
     */
    select?: behavior_samplesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the behavior_samples
     */
    omit?: behavior_samplesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: behavior_samplesInclude<ExtArgs> | null
    /**
     * The data needed to update a behavior_samples.
     */
    data: XOR<behavior_samplesUpdateInput, behavior_samplesUncheckedUpdateInput>
    /**
     * Choose, which behavior_samples to update.
     */
    where: behavior_samplesWhereUniqueInput
  }

  /**
   * behavior_samples updateMany
   */
  export type behavior_samplesUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update behavior_samples.
     */
    data: XOR<behavior_samplesUpdateManyMutationInput, behavior_samplesUncheckedUpdateManyInput>
    /**
     * Filter which behavior_samples to update
     */
    where?: behavior_samplesWhereInput
    /**
     * Limit how many behavior_samples to update.
     */
    limit?: number
  }

  /**
   * behavior_samples updateManyAndReturn
   */
  export type behavior_samplesUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the behavior_samples
     */
    select?: behavior_samplesSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the behavior_samples
     */
    omit?: behavior_samplesOmit<ExtArgs> | null
    /**
     * The data used to update behavior_samples.
     */
    data: XOR<behavior_samplesUpdateManyMutationInput, behavior_samplesUncheckedUpdateManyInput>
    /**
     * Filter which behavior_samples to update
     */
    where?: behavior_samplesWhereInput
    /**
     * Limit how many behavior_samples to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: behavior_samplesIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * behavior_samples upsert
   */
  export type behavior_samplesUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the behavior_samples
     */
    select?: behavior_samplesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the behavior_samples
     */
    omit?: behavior_samplesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: behavior_samplesInclude<ExtArgs> | null
    /**
     * The filter to search for the behavior_samples to update in case it exists.
     */
    where: behavior_samplesWhereUniqueInput
    /**
     * In case the behavior_samples found by the `where` argument doesn't exist, create a new behavior_samples with this data.
     */
    create: XOR<behavior_samplesCreateInput, behavior_samplesUncheckedCreateInput>
    /**
     * In case the behavior_samples was found with the provided `where` argument, update it with this data.
     */
    update: XOR<behavior_samplesUpdateInput, behavior_samplesUncheckedUpdateInput>
  }

  /**
   * behavior_samples delete
   */
  export type behavior_samplesDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the behavior_samples
     */
    select?: behavior_samplesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the behavior_samples
     */
    omit?: behavior_samplesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: behavior_samplesInclude<ExtArgs> | null
    /**
     * Filter which behavior_samples to delete.
     */
    where: behavior_samplesWhereUniqueInput
  }

  /**
   * behavior_samples deleteMany
   */
  export type behavior_samplesDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which behavior_samples to delete
     */
    where?: behavior_samplesWhereInput
    /**
     * Limit how many behavior_samples to delete.
     */
    limit?: number
  }

  /**
   * behavior_samples without action
   */
  export type behavior_samplesDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the behavior_samples
     */
    select?: behavior_samplesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the behavior_samples
     */
    omit?: behavior_samplesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: behavior_samplesInclude<ExtArgs> | null
  }


  /**
   * Model devices
   */

  export type AggregateDevices = {
    _count: DevicesCountAggregateOutputType | null
    _avg: DevicesAvgAggregateOutputType | null
    _sum: DevicesSumAggregateOutputType | null
    _min: DevicesMinAggregateOutputType | null
    _max: DevicesMaxAggregateOutputType | null
  }

  export type DevicesAvgAggregateOutputType = {
    id: number | null
    admin_id: number | null
    trust_score: number | null
  }

  export type DevicesSumAggregateOutputType = {
    id: number | null
    admin_id: number | null
    trust_score: number | null
  }

  export type DevicesMinAggregateOutputType = {
    id: number | null
    admin_id: number | null
    device_fingerprint: string | null
    device_name: string | null
    trust_score: number | null
    status: string | null
    registration_token_hash: string | null
    token_expires_at: Date | null
    first_seen: Date | null
    last_seen: Date | null
    created_at: Date | null
  }

  export type DevicesMaxAggregateOutputType = {
    id: number | null
    admin_id: number | null
    device_fingerprint: string | null
    device_name: string | null
    trust_score: number | null
    status: string | null
    registration_token_hash: string | null
    token_expires_at: Date | null
    first_seen: Date | null
    last_seen: Date | null
    created_at: Date | null
  }

  export type DevicesCountAggregateOutputType = {
    id: number
    admin_id: number
    device_fingerprint: number
    device_name: number
    trust_score: number
    status: number
    registration_token_hash: number
    token_expires_at: number
    first_seen: number
    last_seen: number
    created_at: number
    _all: number
  }


  export type DevicesAvgAggregateInputType = {
    id?: true
    admin_id?: true
    trust_score?: true
  }

  export type DevicesSumAggregateInputType = {
    id?: true
    admin_id?: true
    trust_score?: true
  }

  export type DevicesMinAggregateInputType = {
    id?: true
    admin_id?: true
    device_fingerprint?: true
    device_name?: true
    trust_score?: true
    status?: true
    registration_token_hash?: true
    token_expires_at?: true
    first_seen?: true
    last_seen?: true
    created_at?: true
  }

  export type DevicesMaxAggregateInputType = {
    id?: true
    admin_id?: true
    device_fingerprint?: true
    device_name?: true
    trust_score?: true
    status?: true
    registration_token_hash?: true
    token_expires_at?: true
    first_seen?: true
    last_seen?: true
    created_at?: true
  }

  export type DevicesCountAggregateInputType = {
    id?: true
    admin_id?: true
    device_fingerprint?: true
    device_name?: true
    trust_score?: true
    status?: true
    registration_token_hash?: true
    token_expires_at?: true
    first_seen?: true
    last_seen?: true
    created_at?: true
    _all?: true
  }

  export type DevicesAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which devices to aggregate.
     */
    where?: devicesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of devices to fetch.
     */
    orderBy?: devicesOrderByWithRelationInput | devicesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: devicesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` devices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` devices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned devices
    **/
    _count?: true | DevicesCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DevicesAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DevicesSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DevicesMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DevicesMaxAggregateInputType
  }

  export type GetDevicesAggregateType<T extends DevicesAggregateArgs> = {
        [P in keyof T & keyof AggregateDevices]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDevices[P]>
      : GetScalarType<T[P], AggregateDevices[P]>
  }




  export type devicesGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: devicesWhereInput
    orderBy?: devicesOrderByWithAggregationInput | devicesOrderByWithAggregationInput[]
    by: DevicesScalarFieldEnum[] | DevicesScalarFieldEnum
    having?: devicesScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DevicesCountAggregateInputType | true
    _avg?: DevicesAvgAggregateInputType
    _sum?: DevicesSumAggregateInputType
    _min?: DevicesMinAggregateInputType
    _max?: DevicesMaxAggregateInputType
  }

  export type DevicesGroupByOutputType = {
    id: number
    admin_id: number
    device_fingerprint: string
    device_name: string | null
    trust_score: number | null
    status: string | null
    registration_token_hash: string | null
    token_expires_at: Date | null
    first_seen: Date | null
    last_seen: Date | null
    created_at: Date | null
    _count: DevicesCountAggregateOutputType | null
    _avg: DevicesAvgAggregateOutputType | null
    _sum: DevicesSumAggregateOutputType | null
    _min: DevicesMinAggregateOutputType | null
    _max: DevicesMaxAggregateOutputType | null
  }

  type GetDevicesGroupByPayload<T extends devicesGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DevicesGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DevicesGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DevicesGroupByOutputType[P]>
            : GetScalarType<T[P], DevicesGroupByOutputType[P]>
        }
      >
    >


  export type devicesSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    admin_id?: boolean
    device_fingerprint?: boolean
    device_name?: boolean
    trust_score?: boolean
    status?: boolean
    registration_token_hash?: boolean
    token_expires_at?: boolean
    first_seen?: boolean
    last_seen?: boolean
    created_at?: boolean
    admins?: boolean | adminsDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["devices"]>

  export type devicesSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    admin_id?: boolean
    device_fingerprint?: boolean
    device_name?: boolean
    trust_score?: boolean
    status?: boolean
    registration_token_hash?: boolean
    token_expires_at?: boolean
    first_seen?: boolean
    last_seen?: boolean
    created_at?: boolean
    admins?: boolean | adminsDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["devices"]>

  export type devicesSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    admin_id?: boolean
    device_fingerprint?: boolean
    device_name?: boolean
    trust_score?: boolean
    status?: boolean
    registration_token_hash?: boolean
    token_expires_at?: boolean
    first_seen?: boolean
    last_seen?: boolean
    created_at?: boolean
    admins?: boolean | adminsDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["devices"]>

  export type devicesSelectScalar = {
    id?: boolean
    admin_id?: boolean
    device_fingerprint?: boolean
    device_name?: boolean
    trust_score?: boolean
    status?: boolean
    registration_token_hash?: boolean
    token_expires_at?: boolean
    first_seen?: boolean
    last_seen?: boolean
    created_at?: boolean
  }

  export type devicesOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "admin_id" | "device_fingerprint" | "device_name" | "trust_score" | "status" | "registration_token_hash" | "token_expires_at" | "first_seen" | "last_seen" | "created_at", ExtArgs["result"]["devices"]>
  export type devicesInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    admins?: boolean | adminsDefaultArgs<ExtArgs>
  }
  export type devicesIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    admins?: boolean | adminsDefaultArgs<ExtArgs>
  }
  export type devicesIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    admins?: boolean | adminsDefaultArgs<ExtArgs>
  }

  export type $devicesPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "devices"
    objects: {
      admins: Prisma.$adminsPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      admin_id: number
      device_fingerprint: string
      device_name: string | null
      trust_score: number | null
      status: string | null
      registration_token_hash: string | null
      token_expires_at: Date | null
      first_seen: Date | null
      last_seen: Date | null
      created_at: Date | null
    }, ExtArgs["result"]["devices"]>
    composites: {}
  }

  type devicesGetPayload<S extends boolean | null | undefined | devicesDefaultArgs> = $Result.GetResult<Prisma.$devicesPayload, S>

  type devicesCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<devicesFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DevicesCountAggregateInputType | true
    }

  export interface devicesDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['devices'], meta: { name: 'devices' } }
    /**
     * Find zero or one Devices that matches the filter.
     * @param {devicesFindUniqueArgs} args - Arguments to find a Devices
     * @example
     * // Get one Devices
     * const devices = await prisma.devices.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends devicesFindUniqueArgs>(args: SelectSubset<T, devicesFindUniqueArgs<ExtArgs>>): Prisma__devicesClient<$Result.GetResult<Prisma.$devicesPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Devices that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {devicesFindUniqueOrThrowArgs} args - Arguments to find a Devices
     * @example
     * // Get one Devices
     * const devices = await prisma.devices.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends devicesFindUniqueOrThrowArgs>(args: SelectSubset<T, devicesFindUniqueOrThrowArgs<ExtArgs>>): Prisma__devicesClient<$Result.GetResult<Prisma.$devicesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Devices that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {devicesFindFirstArgs} args - Arguments to find a Devices
     * @example
     * // Get one Devices
     * const devices = await prisma.devices.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends devicesFindFirstArgs>(args?: SelectSubset<T, devicesFindFirstArgs<ExtArgs>>): Prisma__devicesClient<$Result.GetResult<Prisma.$devicesPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Devices that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {devicesFindFirstOrThrowArgs} args - Arguments to find a Devices
     * @example
     * // Get one Devices
     * const devices = await prisma.devices.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends devicesFindFirstOrThrowArgs>(args?: SelectSubset<T, devicesFindFirstOrThrowArgs<ExtArgs>>): Prisma__devicesClient<$Result.GetResult<Prisma.$devicesPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Devices that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {devicesFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Devices
     * const devices = await prisma.devices.findMany()
     * 
     * // Get first 10 Devices
     * const devices = await prisma.devices.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const devicesWithIdOnly = await prisma.devices.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends devicesFindManyArgs>(args?: SelectSubset<T, devicesFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$devicesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Devices.
     * @param {devicesCreateArgs} args - Arguments to create a Devices.
     * @example
     * // Create one Devices
     * const Devices = await prisma.devices.create({
     *   data: {
     *     // ... data to create a Devices
     *   }
     * })
     * 
     */
    create<T extends devicesCreateArgs>(args: SelectSubset<T, devicesCreateArgs<ExtArgs>>): Prisma__devicesClient<$Result.GetResult<Prisma.$devicesPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Devices.
     * @param {devicesCreateManyArgs} args - Arguments to create many Devices.
     * @example
     * // Create many Devices
     * const devices = await prisma.devices.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends devicesCreateManyArgs>(args?: SelectSubset<T, devicesCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Devices and returns the data saved in the database.
     * @param {devicesCreateManyAndReturnArgs} args - Arguments to create many Devices.
     * @example
     * // Create many Devices
     * const devices = await prisma.devices.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Devices and only return the `id`
     * const devicesWithIdOnly = await prisma.devices.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends devicesCreateManyAndReturnArgs>(args?: SelectSubset<T, devicesCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$devicesPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Devices.
     * @param {devicesDeleteArgs} args - Arguments to delete one Devices.
     * @example
     * // Delete one Devices
     * const Devices = await prisma.devices.delete({
     *   where: {
     *     // ... filter to delete one Devices
     *   }
     * })
     * 
     */
    delete<T extends devicesDeleteArgs>(args: SelectSubset<T, devicesDeleteArgs<ExtArgs>>): Prisma__devicesClient<$Result.GetResult<Prisma.$devicesPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Devices.
     * @param {devicesUpdateArgs} args - Arguments to update one Devices.
     * @example
     * // Update one Devices
     * const devices = await prisma.devices.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends devicesUpdateArgs>(args: SelectSubset<T, devicesUpdateArgs<ExtArgs>>): Prisma__devicesClient<$Result.GetResult<Prisma.$devicesPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Devices.
     * @param {devicesDeleteManyArgs} args - Arguments to filter Devices to delete.
     * @example
     * // Delete a few Devices
     * const { count } = await prisma.devices.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends devicesDeleteManyArgs>(args?: SelectSubset<T, devicesDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Devices.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {devicesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Devices
     * const devices = await prisma.devices.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends devicesUpdateManyArgs>(args: SelectSubset<T, devicesUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Devices and returns the data updated in the database.
     * @param {devicesUpdateManyAndReturnArgs} args - Arguments to update many Devices.
     * @example
     * // Update many Devices
     * const devices = await prisma.devices.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Devices and only return the `id`
     * const devicesWithIdOnly = await prisma.devices.updateManyAndReturn({
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
    updateManyAndReturn<T extends devicesUpdateManyAndReturnArgs>(args: SelectSubset<T, devicesUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$devicesPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Devices.
     * @param {devicesUpsertArgs} args - Arguments to update or create a Devices.
     * @example
     * // Update or create a Devices
     * const devices = await prisma.devices.upsert({
     *   create: {
     *     // ... data to create a Devices
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Devices we want to update
     *   }
     * })
     */
    upsert<T extends devicesUpsertArgs>(args: SelectSubset<T, devicesUpsertArgs<ExtArgs>>): Prisma__devicesClient<$Result.GetResult<Prisma.$devicesPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Devices.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {devicesCountArgs} args - Arguments to filter Devices to count.
     * @example
     * // Count the number of Devices
     * const count = await prisma.devices.count({
     *   where: {
     *     // ... the filter for the Devices we want to count
     *   }
     * })
    **/
    count<T extends devicesCountArgs>(
      args?: Subset<T, devicesCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DevicesCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Devices.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DevicesAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends DevicesAggregateArgs>(args: Subset<T, DevicesAggregateArgs>): Prisma.PrismaPromise<GetDevicesAggregateType<T>>

    /**
     * Group by Devices.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {devicesGroupByArgs} args - Group by arguments.
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
      T extends devicesGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: devicesGroupByArgs['orderBy'] }
        : { orderBy?: devicesGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, devicesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDevicesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the devices model
   */
  readonly fields: devicesFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for devices.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__devicesClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    admins<T extends adminsDefaultArgs<ExtArgs> = {}>(args?: Subset<T, adminsDefaultArgs<ExtArgs>>): Prisma__adminsClient<$Result.GetResult<Prisma.$adminsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the devices model
   */
  interface devicesFieldRefs {
    readonly id: FieldRef<"devices", 'Int'>
    readonly admin_id: FieldRef<"devices", 'Int'>
    readonly device_fingerprint: FieldRef<"devices", 'String'>
    readonly device_name: FieldRef<"devices", 'String'>
    readonly trust_score: FieldRef<"devices", 'Int'>
    readonly status: FieldRef<"devices", 'String'>
    readonly registration_token_hash: FieldRef<"devices", 'String'>
    readonly token_expires_at: FieldRef<"devices", 'DateTime'>
    readonly first_seen: FieldRef<"devices", 'DateTime'>
    readonly last_seen: FieldRef<"devices", 'DateTime'>
    readonly created_at: FieldRef<"devices", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * devices findUnique
   */
  export type devicesFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the devices
     */
    select?: devicesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the devices
     */
    omit?: devicesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: devicesInclude<ExtArgs> | null
    /**
     * Filter, which devices to fetch.
     */
    where: devicesWhereUniqueInput
  }

  /**
   * devices findUniqueOrThrow
   */
  export type devicesFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the devices
     */
    select?: devicesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the devices
     */
    omit?: devicesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: devicesInclude<ExtArgs> | null
    /**
     * Filter, which devices to fetch.
     */
    where: devicesWhereUniqueInput
  }

  /**
   * devices findFirst
   */
  export type devicesFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the devices
     */
    select?: devicesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the devices
     */
    omit?: devicesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: devicesInclude<ExtArgs> | null
    /**
     * Filter, which devices to fetch.
     */
    where?: devicesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of devices to fetch.
     */
    orderBy?: devicesOrderByWithRelationInput | devicesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for devices.
     */
    cursor?: devicesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` devices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` devices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of devices.
     */
    distinct?: DevicesScalarFieldEnum | DevicesScalarFieldEnum[]
  }

  /**
   * devices findFirstOrThrow
   */
  export type devicesFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the devices
     */
    select?: devicesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the devices
     */
    omit?: devicesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: devicesInclude<ExtArgs> | null
    /**
     * Filter, which devices to fetch.
     */
    where?: devicesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of devices to fetch.
     */
    orderBy?: devicesOrderByWithRelationInput | devicesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for devices.
     */
    cursor?: devicesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` devices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` devices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of devices.
     */
    distinct?: DevicesScalarFieldEnum | DevicesScalarFieldEnum[]
  }

  /**
   * devices findMany
   */
  export type devicesFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the devices
     */
    select?: devicesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the devices
     */
    omit?: devicesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: devicesInclude<ExtArgs> | null
    /**
     * Filter, which devices to fetch.
     */
    where?: devicesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of devices to fetch.
     */
    orderBy?: devicesOrderByWithRelationInput | devicesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing devices.
     */
    cursor?: devicesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` devices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` devices.
     */
    skip?: number
    distinct?: DevicesScalarFieldEnum | DevicesScalarFieldEnum[]
  }

  /**
   * devices create
   */
  export type devicesCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the devices
     */
    select?: devicesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the devices
     */
    omit?: devicesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: devicesInclude<ExtArgs> | null
    /**
     * The data needed to create a devices.
     */
    data: XOR<devicesCreateInput, devicesUncheckedCreateInput>
  }

  /**
   * devices createMany
   */
  export type devicesCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many devices.
     */
    data: devicesCreateManyInput | devicesCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * devices createManyAndReturn
   */
  export type devicesCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the devices
     */
    select?: devicesSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the devices
     */
    omit?: devicesOmit<ExtArgs> | null
    /**
     * The data used to create many devices.
     */
    data: devicesCreateManyInput | devicesCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: devicesIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * devices update
   */
  export type devicesUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the devices
     */
    select?: devicesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the devices
     */
    omit?: devicesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: devicesInclude<ExtArgs> | null
    /**
     * The data needed to update a devices.
     */
    data: XOR<devicesUpdateInput, devicesUncheckedUpdateInput>
    /**
     * Choose, which devices to update.
     */
    where: devicesWhereUniqueInput
  }

  /**
   * devices updateMany
   */
  export type devicesUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update devices.
     */
    data: XOR<devicesUpdateManyMutationInput, devicesUncheckedUpdateManyInput>
    /**
     * Filter which devices to update
     */
    where?: devicesWhereInput
    /**
     * Limit how many devices to update.
     */
    limit?: number
  }

  /**
   * devices updateManyAndReturn
   */
  export type devicesUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the devices
     */
    select?: devicesSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the devices
     */
    omit?: devicesOmit<ExtArgs> | null
    /**
     * The data used to update devices.
     */
    data: XOR<devicesUpdateManyMutationInput, devicesUncheckedUpdateManyInput>
    /**
     * Filter which devices to update
     */
    where?: devicesWhereInput
    /**
     * Limit how many devices to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: devicesIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * devices upsert
   */
  export type devicesUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the devices
     */
    select?: devicesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the devices
     */
    omit?: devicesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: devicesInclude<ExtArgs> | null
    /**
     * The filter to search for the devices to update in case it exists.
     */
    where: devicesWhereUniqueInput
    /**
     * In case the devices found by the `where` argument doesn't exist, create a new devices with this data.
     */
    create: XOR<devicesCreateInput, devicesUncheckedCreateInput>
    /**
     * In case the devices was found with the provided `where` argument, update it with this data.
     */
    update: XOR<devicesUpdateInput, devicesUncheckedUpdateInput>
  }

  /**
   * devices delete
   */
  export type devicesDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the devices
     */
    select?: devicesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the devices
     */
    omit?: devicesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: devicesInclude<ExtArgs> | null
    /**
     * Filter which devices to delete.
     */
    where: devicesWhereUniqueInput
  }

  /**
   * devices deleteMany
   */
  export type devicesDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which devices to delete
     */
    where?: devicesWhereInput
    /**
     * Limit how many devices to delete.
     */
    limit?: number
  }

  /**
   * devices without action
   */
  export type devicesDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the devices
     */
    select?: devicesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the devices
     */
    omit?: devicesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: devicesInclude<ExtArgs> | null
  }


  /**
   * Model risk_events
   */

  export type AggregateRisk_events = {
    _count: Risk_eventsCountAggregateOutputType | null
    _avg: Risk_eventsAvgAggregateOutputType | null
    _sum: Risk_eventsSumAggregateOutputType | null
    _min: Risk_eventsMinAggregateOutputType | null
    _max: Risk_eventsMaxAggregateOutputType | null
  }

  export type Risk_eventsAvgAggregateOutputType = {
    id: number | null
    admin_id: number | null
    identity_score: Decimal | null
    device_score: Decimal | null
    behavior_score: Decimal | null
    overall_risk_score: Decimal | null
  }

  export type Risk_eventsSumAggregateOutputType = {
    id: number | null
    admin_id: number | null
    identity_score: Decimal | null
    device_score: Decimal | null
    behavior_score: Decimal | null
    overall_risk_score: Decimal | null
  }

  export type Risk_eventsMinAggregateOutputType = {
    id: number | null
    admin_id: number | null
    identity_score: Decimal | null
    device_score: Decimal | null
    behavior_score: Decimal | null
    overall_risk_score: Decimal | null
    decision: string | null
    created_at: Date | null
  }

  export type Risk_eventsMaxAggregateOutputType = {
    id: number | null
    admin_id: number | null
    identity_score: Decimal | null
    device_score: Decimal | null
    behavior_score: Decimal | null
    overall_risk_score: Decimal | null
    decision: string | null
    created_at: Date | null
  }

  export type Risk_eventsCountAggregateOutputType = {
    id: number
    admin_id: number
    identity_score: number
    device_score: number
    behavior_score: number
    overall_risk_score: number
    decision: number
    created_at: number
    _all: number
  }


  export type Risk_eventsAvgAggregateInputType = {
    id?: true
    admin_id?: true
    identity_score?: true
    device_score?: true
    behavior_score?: true
    overall_risk_score?: true
  }

  export type Risk_eventsSumAggregateInputType = {
    id?: true
    admin_id?: true
    identity_score?: true
    device_score?: true
    behavior_score?: true
    overall_risk_score?: true
  }

  export type Risk_eventsMinAggregateInputType = {
    id?: true
    admin_id?: true
    identity_score?: true
    device_score?: true
    behavior_score?: true
    overall_risk_score?: true
    decision?: true
    created_at?: true
  }

  export type Risk_eventsMaxAggregateInputType = {
    id?: true
    admin_id?: true
    identity_score?: true
    device_score?: true
    behavior_score?: true
    overall_risk_score?: true
    decision?: true
    created_at?: true
  }

  export type Risk_eventsCountAggregateInputType = {
    id?: true
    admin_id?: true
    identity_score?: true
    device_score?: true
    behavior_score?: true
    overall_risk_score?: true
    decision?: true
    created_at?: true
    _all?: true
  }

  export type Risk_eventsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which risk_events to aggregate.
     */
    where?: risk_eventsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of risk_events to fetch.
     */
    orderBy?: risk_eventsOrderByWithRelationInput | risk_eventsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: risk_eventsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` risk_events from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` risk_events.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned risk_events
    **/
    _count?: true | Risk_eventsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Risk_eventsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Risk_eventsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Risk_eventsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Risk_eventsMaxAggregateInputType
  }

  export type GetRisk_eventsAggregateType<T extends Risk_eventsAggregateArgs> = {
        [P in keyof T & keyof AggregateRisk_events]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRisk_events[P]>
      : GetScalarType<T[P], AggregateRisk_events[P]>
  }




  export type risk_eventsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: risk_eventsWhereInput
    orderBy?: risk_eventsOrderByWithAggregationInput | risk_eventsOrderByWithAggregationInput[]
    by: Risk_eventsScalarFieldEnum[] | Risk_eventsScalarFieldEnum
    having?: risk_eventsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Risk_eventsCountAggregateInputType | true
    _avg?: Risk_eventsAvgAggregateInputType
    _sum?: Risk_eventsSumAggregateInputType
    _min?: Risk_eventsMinAggregateInputType
    _max?: Risk_eventsMaxAggregateInputType
  }

  export type Risk_eventsGroupByOutputType = {
    id: number
    admin_id: number | null
    identity_score: Decimal | null
    device_score: Decimal | null
    behavior_score: Decimal | null
    overall_risk_score: Decimal | null
    decision: string | null
    created_at: Date | null
    _count: Risk_eventsCountAggregateOutputType | null
    _avg: Risk_eventsAvgAggregateOutputType | null
    _sum: Risk_eventsSumAggregateOutputType | null
    _min: Risk_eventsMinAggregateOutputType | null
    _max: Risk_eventsMaxAggregateOutputType | null
  }

  type GetRisk_eventsGroupByPayload<T extends risk_eventsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Risk_eventsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Risk_eventsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Risk_eventsGroupByOutputType[P]>
            : GetScalarType<T[P], Risk_eventsGroupByOutputType[P]>
        }
      >
    >


  export type risk_eventsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    admin_id?: boolean
    identity_score?: boolean
    device_score?: boolean
    behavior_score?: boolean
    overall_risk_score?: boolean
    decision?: boolean
    created_at?: boolean
    admins?: boolean | risk_events$adminsArgs<ExtArgs>
  }, ExtArgs["result"]["risk_events"]>

  export type risk_eventsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    admin_id?: boolean
    identity_score?: boolean
    device_score?: boolean
    behavior_score?: boolean
    overall_risk_score?: boolean
    decision?: boolean
    created_at?: boolean
    admins?: boolean | risk_events$adminsArgs<ExtArgs>
  }, ExtArgs["result"]["risk_events"]>

  export type risk_eventsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    admin_id?: boolean
    identity_score?: boolean
    device_score?: boolean
    behavior_score?: boolean
    overall_risk_score?: boolean
    decision?: boolean
    created_at?: boolean
    admins?: boolean | risk_events$adminsArgs<ExtArgs>
  }, ExtArgs["result"]["risk_events"]>

  export type risk_eventsSelectScalar = {
    id?: boolean
    admin_id?: boolean
    identity_score?: boolean
    device_score?: boolean
    behavior_score?: boolean
    overall_risk_score?: boolean
    decision?: boolean
    created_at?: boolean
  }

  export type risk_eventsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "admin_id" | "identity_score" | "device_score" | "behavior_score" | "overall_risk_score" | "decision" | "created_at", ExtArgs["result"]["risk_events"]>
  export type risk_eventsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    admins?: boolean | risk_events$adminsArgs<ExtArgs>
  }
  export type risk_eventsIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    admins?: boolean | risk_events$adminsArgs<ExtArgs>
  }
  export type risk_eventsIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    admins?: boolean | risk_events$adminsArgs<ExtArgs>
  }

  export type $risk_eventsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "risk_events"
    objects: {
      admins: Prisma.$adminsPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      admin_id: number | null
      identity_score: Prisma.Decimal | null
      device_score: Prisma.Decimal | null
      behavior_score: Prisma.Decimal | null
      overall_risk_score: Prisma.Decimal | null
      decision: string | null
      created_at: Date | null
    }, ExtArgs["result"]["risk_events"]>
    composites: {}
  }

  type risk_eventsGetPayload<S extends boolean | null | undefined | risk_eventsDefaultArgs> = $Result.GetResult<Prisma.$risk_eventsPayload, S>

  type risk_eventsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<risk_eventsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Risk_eventsCountAggregateInputType | true
    }

  export interface risk_eventsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['risk_events'], meta: { name: 'risk_events' } }
    /**
     * Find zero or one Risk_events that matches the filter.
     * @param {risk_eventsFindUniqueArgs} args - Arguments to find a Risk_events
     * @example
     * // Get one Risk_events
     * const risk_events = await prisma.risk_events.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends risk_eventsFindUniqueArgs>(args: SelectSubset<T, risk_eventsFindUniqueArgs<ExtArgs>>): Prisma__risk_eventsClient<$Result.GetResult<Prisma.$risk_eventsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Risk_events that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {risk_eventsFindUniqueOrThrowArgs} args - Arguments to find a Risk_events
     * @example
     * // Get one Risk_events
     * const risk_events = await prisma.risk_events.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends risk_eventsFindUniqueOrThrowArgs>(args: SelectSubset<T, risk_eventsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__risk_eventsClient<$Result.GetResult<Prisma.$risk_eventsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Risk_events that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {risk_eventsFindFirstArgs} args - Arguments to find a Risk_events
     * @example
     * // Get one Risk_events
     * const risk_events = await prisma.risk_events.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends risk_eventsFindFirstArgs>(args?: SelectSubset<T, risk_eventsFindFirstArgs<ExtArgs>>): Prisma__risk_eventsClient<$Result.GetResult<Prisma.$risk_eventsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Risk_events that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {risk_eventsFindFirstOrThrowArgs} args - Arguments to find a Risk_events
     * @example
     * // Get one Risk_events
     * const risk_events = await prisma.risk_events.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends risk_eventsFindFirstOrThrowArgs>(args?: SelectSubset<T, risk_eventsFindFirstOrThrowArgs<ExtArgs>>): Prisma__risk_eventsClient<$Result.GetResult<Prisma.$risk_eventsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Risk_events that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {risk_eventsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Risk_events
     * const risk_events = await prisma.risk_events.findMany()
     * 
     * // Get first 10 Risk_events
     * const risk_events = await prisma.risk_events.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const risk_eventsWithIdOnly = await prisma.risk_events.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends risk_eventsFindManyArgs>(args?: SelectSubset<T, risk_eventsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$risk_eventsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Risk_events.
     * @param {risk_eventsCreateArgs} args - Arguments to create a Risk_events.
     * @example
     * // Create one Risk_events
     * const Risk_events = await prisma.risk_events.create({
     *   data: {
     *     // ... data to create a Risk_events
     *   }
     * })
     * 
     */
    create<T extends risk_eventsCreateArgs>(args: SelectSubset<T, risk_eventsCreateArgs<ExtArgs>>): Prisma__risk_eventsClient<$Result.GetResult<Prisma.$risk_eventsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Risk_events.
     * @param {risk_eventsCreateManyArgs} args - Arguments to create many Risk_events.
     * @example
     * // Create many Risk_events
     * const risk_events = await prisma.risk_events.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends risk_eventsCreateManyArgs>(args?: SelectSubset<T, risk_eventsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Risk_events and returns the data saved in the database.
     * @param {risk_eventsCreateManyAndReturnArgs} args - Arguments to create many Risk_events.
     * @example
     * // Create many Risk_events
     * const risk_events = await prisma.risk_events.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Risk_events and only return the `id`
     * const risk_eventsWithIdOnly = await prisma.risk_events.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends risk_eventsCreateManyAndReturnArgs>(args?: SelectSubset<T, risk_eventsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$risk_eventsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Risk_events.
     * @param {risk_eventsDeleteArgs} args - Arguments to delete one Risk_events.
     * @example
     * // Delete one Risk_events
     * const Risk_events = await prisma.risk_events.delete({
     *   where: {
     *     // ... filter to delete one Risk_events
     *   }
     * })
     * 
     */
    delete<T extends risk_eventsDeleteArgs>(args: SelectSubset<T, risk_eventsDeleteArgs<ExtArgs>>): Prisma__risk_eventsClient<$Result.GetResult<Prisma.$risk_eventsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Risk_events.
     * @param {risk_eventsUpdateArgs} args - Arguments to update one Risk_events.
     * @example
     * // Update one Risk_events
     * const risk_events = await prisma.risk_events.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends risk_eventsUpdateArgs>(args: SelectSubset<T, risk_eventsUpdateArgs<ExtArgs>>): Prisma__risk_eventsClient<$Result.GetResult<Prisma.$risk_eventsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Risk_events.
     * @param {risk_eventsDeleteManyArgs} args - Arguments to filter Risk_events to delete.
     * @example
     * // Delete a few Risk_events
     * const { count } = await prisma.risk_events.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends risk_eventsDeleteManyArgs>(args?: SelectSubset<T, risk_eventsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Risk_events.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {risk_eventsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Risk_events
     * const risk_events = await prisma.risk_events.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends risk_eventsUpdateManyArgs>(args: SelectSubset<T, risk_eventsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Risk_events and returns the data updated in the database.
     * @param {risk_eventsUpdateManyAndReturnArgs} args - Arguments to update many Risk_events.
     * @example
     * // Update many Risk_events
     * const risk_events = await prisma.risk_events.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Risk_events and only return the `id`
     * const risk_eventsWithIdOnly = await prisma.risk_events.updateManyAndReturn({
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
    updateManyAndReturn<T extends risk_eventsUpdateManyAndReturnArgs>(args: SelectSubset<T, risk_eventsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$risk_eventsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Risk_events.
     * @param {risk_eventsUpsertArgs} args - Arguments to update or create a Risk_events.
     * @example
     * // Update or create a Risk_events
     * const risk_events = await prisma.risk_events.upsert({
     *   create: {
     *     // ... data to create a Risk_events
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Risk_events we want to update
     *   }
     * })
     */
    upsert<T extends risk_eventsUpsertArgs>(args: SelectSubset<T, risk_eventsUpsertArgs<ExtArgs>>): Prisma__risk_eventsClient<$Result.GetResult<Prisma.$risk_eventsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Risk_events.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {risk_eventsCountArgs} args - Arguments to filter Risk_events to count.
     * @example
     * // Count the number of Risk_events
     * const count = await prisma.risk_events.count({
     *   where: {
     *     // ... the filter for the Risk_events we want to count
     *   }
     * })
    **/
    count<T extends risk_eventsCountArgs>(
      args?: Subset<T, risk_eventsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Risk_eventsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Risk_events.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Risk_eventsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends Risk_eventsAggregateArgs>(args: Subset<T, Risk_eventsAggregateArgs>): Prisma.PrismaPromise<GetRisk_eventsAggregateType<T>>

    /**
     * Group by Risk_events.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {risk_eventsGroupByArgs} args - Group by arguments.
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
      T extends risk_eventsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: risk_eventsGroupByArgs['orderBy'] }
        : { orderBy?: risk_eventsGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, risk_eventsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRisk_eventsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the risk_events model
   */
  readonly fields: risk_eventsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for risk_events.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__risk_eventsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    admins<T extends risk_events$adminsArgs<ExtArgs> = {}>(args?: Subset<T, risk_events$adminsArgs<ExtArgs>>): Prisma__adminsClient<$Result.GetResult<Prisma.$adminsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the risk_events model
   */
  interface risk_eventsFieldRefs {
    readonly id: FieldRef<"risk_events", 'Int'>
    readonly admin_id: FieldRef<"risk_events", 'Int'>
    readonly identity_score: FieldRef<"risk_events", 'Decimal'>
    readonly device_score: FieldRef<"risk_events", 'Decimal'>
    readonly behavior_score: FieldRef<"risk_events", 'Decimal'>
    readonly overall_risk_score: FieldRef<"risk_events", 'Decimal'>
    readonly decision: FieldRef<"risk_events", 'String'>
    readonly created_at: FieldRef<"risk_events", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * risk_events findUnique
   */
  export type risk_eventsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the risk_events
     */
    select?: risk_eventsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the risk_events
     */
    omit?: risk_eventsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: risk_eventsInclude<ExtArgs> | null
    /**
     * Filter, which risk_events to fetch.
     */
    where: risk_eventsWhereUniqueInput
  }

  /**
   * risk_events findUniqueOrThrow
   */
  export type risk_eventsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the risk_events
     */
    select?: risk_eventsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the risk_events
     */
    omit?: risk_eventsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: risk_eventsInclude<ExtArgs> | null
    /**
     * Filter, which risk_events to fetch.
     */
    where: risk_eventsWhereUniqueInput
  }

  /**
   * risk_events findFirst
   */
  export type risk_eventsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the risk_events
     */
    select?: risk_eventsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the risk_events
     */
    omit?: risk_eventsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: risk_eventsInclude<ExtArgs> | null
    /**
     * Filter, which risk_events to fetch.
     */
    where?: risk_eventsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of risk_events to fetch.
     */
    orderBy?: risk_eventsOrderByWithRelationInput | risk_eventsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for risk_events.
     */
    cursor?: risk_eventsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` risk_events from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` risk_events.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of risk_events.
     */
    distinct?: Risk_eventsScalarFieldEnum | Risk_eventsScalarFieldEnum[]
  }

  /**
   * risk_events findFirstOrThrow
   */
  export type risk_eventsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the risk_events
     */
    select?: risk_eventsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the risk_events
     */
    omit?: risk_eventsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: risk_eventsInclude<ExtArgs> | null
    /**
     * Filter, which risk_events to fetch.
     */
    where?: risk_eventsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of risk_events to fetch.
     */
    orderBy?: risk_eventsOrderByWithRelationInput | risk_eventsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for risk_events.
     */
    cursor?: risk_eventsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` risk_events from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` risk_events.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of risk_events.
     */
    distinct?: Risk_eventsScalarFieldEnum | Risk_eventsScalarFieldEnum[]
  }

  /**
   * risk_events findMany
   */
  export type risk_eventsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the risk_events
     */
    select?: risk_eventsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the risk_events
     */
    omit?: risk_eventsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: risk_eventsInclude<ExtArgs> | null
    /**
     * Filter, which risk_events to fetch.
     */
    where?: risk_eventsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of risk_events to fetch.
     */
    orderBy?: risk_eventsOrderByWithRelationInput | risk_eventsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing risk_events.
     */
    cursor?: risk_eventsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` risk_events from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` risk_events.
     */
    skip?: number
    distinct?: Risk_eventsScalarFieldEnum | Risk_eventsScalarFieldEnum[]
  }

  /**
   * risk_events create
   */
  export type risk_eventsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the risk_events
     */
    select?: risk_eventsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the risk_events
     */
    omit?: risk_eventsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: risk_eventsInclude<ExtArgs> | null
    /**
     * The data needed to create a risk_events.
     */
    data?: XOR<risk_eventsCreateInput, risk_eventsUncheckedCreateInput>
  }

  /**
   * risk_events createMany
   */
  export type risk_eventsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many risk_events.
     */
    data: risk_eventsCreateManyInput | risk_eventsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * risk_events createManyAndReturn
   */
  export type risk_eventsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the risk_events
     */
    select?: risk_eventsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the risk_events
     */
    omit?: risk_eventsOmit<ExtArgs> | null
    /**
     * The data used to create many risk_events.
     */
    data: risk_eventsCreateManyInput | risk_eventsCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: risk_eventsIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * risk_events update
   */
  export type risk_eventsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the risk_events
     */
    select?: risk_eventsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the risk_events
     */
    omit?: risk_eventsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: risk_eventsInclude<ExtArgs> | null
    /**
     * The data needed to update a risk_events.
     */
    data: XOR<risk_eventsUpdateInput, risk_eventsUncheckedUpdateInput>
    /**
     * Choose, which risk_events to update.
     */
    where: risk_eventsWhereUniqueInput
  }

  /**
   * risk_events updateMany
   */
  export type risk_eventsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update risk_events.
     */
    data: XOR<risk_eventsUpdateManyMutationInput, risk_eventsUncheckedUpdateManyInput>
    /**
     * Filter which risk_events to update
     */
    where?: risk_eventsWhereInput
    /**
     * Limit how many risk_events to update.
     */
    limit?: number
  }

  /**
   * risk_events updateManyAndReturn
   */
  export type risk_eventsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the risk_events
     */
    select?: risk_eventsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the risk_events
     */
    omit?: risk_eventsOmit<ExtArgs> | null
    /**
     * The data used to update risk_events.
     */
    data: XOR<risk_eventsUpdateManyMutationInput, risk_eventsUncheckedUpdateManyInput>
    /**
     * Filter which risk_events to update
     */
    where?: risk_eventsWhereInput
    /**
     * Limit how many risk_events to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: risk_eventsIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * risk_events upsert
   */
  export type risk_eventsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the risk_events
     */
    select?: risk_eventsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the risk_events
     */
    omit?: risk_eventsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: risk_eventsInclude<ExtArgs> | null
    /**
     * The filter to search for the risk_events to update in case it exists.
     */
    where: risk_eventsWhereUniqueInput
    /**
     * In case the risk_events found by the `where` argument doesn't exist, create a new risk_events with this data.
     */
    create: XOR<risk_eventsCreateInput, risk_eventsUncheckedCreateInput>
    /**
     * In case the risk_events was found with the provided `where` argument, update it with this data.
     */
    update: XOR<risk_eventsUpdateInput, risk_eventsUncheckedUpdateInput>
  }

  /**
   * risk_events delete
   */
  export type risk_eventsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the risk_events
     */
    select?: risk_eventsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the risk_events
     */
    omit?: risk_eventsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: risk_eventsInclude<ExtArgs> | null
    /**
     * Filter which risk_events to delete.
     */
    where: risk_eventsWhereUniqueInput
  }

  /**
   * risk_events deleteMany
   */
  export type risk_eventsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which risk_events to delete
     */
    where?: risk_eventsWhereInput
    /**
     * Limit how many risk_events to delete.
     */
    limit?: number
  }

  /**
   * risk_events.admins
   */
  export type risk_events$adminsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the admins
     */
    select?: adminsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the admins
     */
    omit?: adminsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: adminsInclude<ExtArgs> | null
    where?: adminsWhereInput
  }

  /**
   * risk_events without action
   */
  export type risk_eventsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the risk_events
     */
    select?: risk_eventsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the risk_events
     */
    omit?: risk_eventsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: risk_eventsInclude<ExtArgs> | null
  }


  /**
   * Model security_alerts
   */

  export type AggregateSecurity_alerts = {
    _count: Security_alertsCountAggregateOutputType | null
    _avg: Security_alertsAvgAggregateOutputType | null
    _sum: Security_alertsSumAggregateOutputType | null
    _min: Security_alertsMinAggregateOutputType | null
    _max: Security_alertsMaxAggregateOutputType | null
  }

  export type Security_alertsAvgAggregateOutputType = {
    id: number | null
    admin_id: number | null
  }

  export type Security_alertsSumAggregateOutputType = {
    id: number | null
    admin_id: number | null
  }

  export type Security_alertsMinAggregateOutputType = {
    id: number | null
    admin_id: number | null
    alert_layer: string | null
    severity: string | null
    alert_type: string | null
    description: string | null
    ip_address: string | null
    created_at: Date | null
  }

  export type Security_alertsMaxAggregateOutputType = {
    id: number | null
    admin_id: number | null
    alert_layer: string | null
    severity: string | null
    alert_type: string | null
    description: string | null
    ip_address: string | null
    created_at: Date | null
  }

  export type Security_alertsCountAggregateOutputType = {
    id: number
    admin_id: number
    alert_layer: number
    severity: number
    alert_type: number
    description: number
    ip_address: number
    created_at: number
    _all: number
  }


  export type Security_alertsAvgAggregateInputType = {
    id?: true
    admin_id?: true
  }

  export type Security_alertsSumAggregateInputType = {
    id?: true
    admin_id?: true
  }

  export type Security_alertsMinAggregateInputType = {
    id?: true
    admin_id?: true
    alert_layer?: true
    severity?: true
    alert_type?: true
    description?: true
    ip_address?: true
    created_at?: true
  }

  export type Security_alertsMaxAggregateInputType = {
    id?: true
    admin_id?: true
    alert_layer?: true
    severity?: true
    alert_type?: true
    description?: true
    ip_address?: true
    created_at?: true
  }

  export type Security_alertsCountAggregateInputType = {
    id?: true
    admin_id?: true
    alert_layer?: true
    severity?: true
    alert_type?: true
    description?: true
    ip_address?: true
    created_at?: true
    _all?: true
  }

  export type Security_alertsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which security_alerts to aggregate.
     */
    where?: security_alertsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of security_alerts to fetch.
     */
    orderBy?: security_alertsOrderByWithRelationInput | security_alertsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: security_alertsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` security_alerts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` security_alerts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned security_alerts
    **/
    _count?: true | Security_alertsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Security_alertsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Security_alertsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Security_alertsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Security_alertsMaxAggregateInputType
  }

  export type GetSecurity_alertsAggregateType<T extends Security_alertsAggregateArgs> = {
        [P in keyof T & keyof AggregateSecurity_alerts]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSecurity_alerts[P]>
      : GetScalarType<T[P], AggregateSecurity_alerts[P]>
  }




  export type security_alertsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: security_alertsWhereInput
    orderBy?: security_alertsOrderByWithAggregationInput | security_alertsOrderByWithAggregationInput[]
    by: Security_alertsScalarFieldEnum[] | Security_alertsScalarFieldEnum
    having?: security_alertsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Security_alertsCountAggregateInputType | true
    _avg?: Security_alertsAvgAggregateInputType
    _sum?: Security_alertsSumAggregateInputType
    _min?: Security_alertsMinAggregateInputType
    _max?: Security_alertsMaxAggregateInputType
  }

  export type Security_alertsGroupByOutputType = {
    id: number
    admin_id: number | null
    alert_layer: string | null
    severity: string | null
    alert_type: string | null
    description: string | null
    ip_address: string | null
    created_at: Date | null
    _count: Security_alertsCountAggregateOutputType | null
    _avg: Security_alertsAvgAggregateOutputType | null
    _sum: Security_alertsSumAggregateOutputType | null
    _min: Security_alertsMinAggregateOutputType | null
    _max: Security_alertsMaxAggregateOutputType | null
  }

  type GetSecurity_alertsGroupByPayload<T extends security_alertsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Security_alertsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Security_alertsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Security_alertsGroupByOutputType[P]>
            : GetScalarType<T[P], Security_alertsGroupByOutputType[P]>
        }
      >
    >


  export type security_alertsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    admin_id?: boolean
    alert_layer?: boolean
    severity?: boolean
    alert_type?: boolean
    description?: boolean
    ip_address?: boolean
    created_at?: boolean
  }, ExtArgs["result"]["security_alerts"]>

  export type security_alertsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    admin_id?: boolean
    alert_layer?: boolean
    severity?: boolean
    alert_type?: boolean
    description?: boolean
    ip_address?: boolean
    created_at?: boolean
  }, ExtArgs["result"]["security_alerts"]>

  export type security_alertsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    admin_id?: boolean
    alert_layer?: boolean
    severity?: boolean
    alert_type?: boolean
    description?: boolean
    ip_address?: boolean
    created_at?: boolean
  }, ExtArgs["result"]["security_alerts"]>

  export type security_alertsSelectScalar = {
    id?: boolean
    admin_id?: boolean
    alert_layer?: boolean
    severity?: boolean
    alert_type?: boolean
    description?: boolean
    ip_address?: boolean
    created_at?: boolean
  }

  export type security_alertsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "admin_id" | "alert_layer" | "severity" | "alert_type" | "description" | "ip_address" | "created_at", ExtArgs["result"]["security_alerts"]>

  export type $security_alertsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "security_alerts"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      admin_id: number | null
      alert_layer: string | null
      severity: string | null
      alert_type: string | null
      description: string | null
      ip_address: string | null
      created_at: Date | null
    }, ExtArgs["result"]["security_alerts"]>
    composites: {}
  }

  type security_alertsGetPayload<S extends boolean | null | undefined | security_alertsDefaultArgs> = $Result.GetResult<Prisma.$security_alertsPayload, S>

  type security_alertsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<security_alertsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Security_alertsCountAggregateInputType | true
    }

  export interface security_alertsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['security_alerts'], meta: { name: 'security_alerts' } }
    /**
     * Find zero or one Security_alerts that matches the filter.
     * @param {security_alertsFindUniqueArgs} args - Arguments to find a Security_alerts
     * @example
     * // Get one Security_alerts
     * const security_alerts = await prisma.security_alerts.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends security_alertsFindUniqueArgs>(args: SelectSubset<T, security_alertsFindUniqueArgs<ExtArgs>>): Prisma__security_alertsClient<$Result.GetResult<Prisma.$security_alertsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Security_alerts that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {security_alertsFindUniqueOrThrowArgs} args - Arguments to find a Security_alerts
     * @example
     * // Get one Security_alerts
     * const security_alerts = await prisma.security_alerts.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends security_alertsFindUniqueOrThrowArgs>(args: SelectSubset<T, security_alertsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__security_alertsClient<$Result.GetResult<Prisma.$security_alertsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Security_alerts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {security_alertsFindFirstArgs} args - Arguments to find a Security_alerts
     * @example
     * // Get one Security_alerts
     * const security_alerts = await prisma.security_alerts.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends security_alertsFindFirstArgs>(args?: SelectSubset<T, security_alertsFindFirstArgs<ExtArgs>>): Prisma__security_alertsClient<$Result.GetResult<Prisma.$security_alertsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Security_alerts that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {security_alertsFindFirstOrThrowArgs} args - Arguments to find a Security_alerts
     * @example
     * // Get one Security_alerts
     * const security_alerts = await prisma.security_alerts.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends security_alertsFindFirstOrThrowArgs>(args?: SelectSubset<T, security_alertsFindFirstOrThrowArgs<ExtArgs>>): Prisma__security_alertsClient<$Result.GetResult<Prisma.$security_alertsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Security_alerts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {security_alertsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Security_alerts
     * const security_alerts = await prisma.security_alerts.findMany()
     * 
     * // Get first 10 Security_alerts
     * const security_alerts = await prisma.security_alerts.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const security_alertsWithIdOnly = await prisma.security_alerts.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends security_alertsFindManyArgs>(args?: SelectSubset<T, security_alertsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$security_alertsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Security_alerts.
     * @param {security_alertsCreateArgs} args - Arguments to create a Security_alerts.
     * @example
     * // Create one Security_alerts
     * const Security_alerts = await prisma.security_alerts.create({
     *   data: {
     *     // ... data to create a Security_alerts
     *   }
     * })
     * 
     */
    create<T extends security_alertsCreateArgs>(args: SelectSubset<T, security_alertsCreateArgs<ExtArgs>>): Prisma__security_alertsClient<$Result.GetResult<Prisma.$security_alertsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Security_alerts.
     * @param {security_alertsCreateManyArgs} args - Arguments to create many Security_alerts.
     * @example
     * // Create many Security_alerts
     * const security_alerts = await prisma.security_alerts.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends security_alertsCreateManyArgs>(args?: SelectSubset<T, security_alertsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Security_alerts and returns the data saved in the database.
     * @param {security_alertsCreateManyAndReturnArgs} args - Arguments to create many Security_alerts.
     * @example
     * // Create many Security_alerts
     * const security_alerts = await prisma.security_alerts.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Security_alerts and only return the `id`
     * const security_alertsWithIdOnly = await prisma.security_alerts.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends security_alertsCreateManyAndReturnArgs>(args?: SelectSubset<T, security_alertsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$security_alertsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Security_alerts.
     * @param {security_alertsDeleteArgs} args - Arguments to delete one Security_alerts.
     * @example
     * // Delete one Security_alerts
     * const Security_alerts = await prisma.security_alerts.delete({
     *   where: {
     *     // ... filter to delete one Security_alerts
     *   }
     * })
     * 
     */
    delete<T extends security_alertsDeleteArgs>(args: SelectSubset<T, security_alertsDeleteArgs<ExtArgs>>): Prisma__security_alertsClient<$Result.GetResult<Prisma.$security_alertsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Security_alerts.
     * @param {security_alertsUpdateArgs} args - Arguments to update one Security_alerts.
     * @example
     * // Update one Security_alerts
     * const security_alerts = await prisma.security_alerts.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends security_alertsUpdateArgs>(args: SelectSubset<T, security_alertsUpdateArgs<ExtArgs>>): Prisma__security_alertsClient<$Result.GetResult<Prisma.$security_alertsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Security_alerts.
     * @param {security_alertsDeleteManyArgs} args - Arguments to filter Security_alerts to delete.
     * @example
     * // Delete a few Security_alerts
     * const { count } = await prisma.security_alerts.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends security_alertsDeleteManyArgs>(args?: SelectSubset<T, security_alertsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Security_alerts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {security_alertsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Security_alerts
     * const security_alerts = await prisma.security_alerts.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends security_alertsUpdateManyArgs>(args: SelectSubset<T, security_alertsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Security_alerts and returns the data updated in the database.
     * @param {security_alertsUpdateManyAndReturnArgs} args - Arguments to update many Security_alerts.
     * @example
     * // Update many Security_alerts
     * const security_alerts = await prisma.security_alerts.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Security_alerts and only return the `id`
     * const security_alertsWithIdOnly = await prisma.security_alerts.updateManyAndReturn({
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
    updateManyAndReturn<T extends security_alertsUpdateManyAndReturnArgs>(args: SelectSubset<T, security_alertsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$security_alertsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Security_alerts.
     * @param {security_alertsUpsertArgs} args - Arguments to update or create a Security_alerts.
     * @example
     * // Update or create a Security_alerts
     * const security_alerts = await prisma.security_alerts.upsert({
     *   create: {
     *     // ... data to create a Security_alerts
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Security_alerts we want to update
     *   }
     * })
     */
    upsert<T extends security_alertsUpsertArgs>(args: SelectSubset<T, security_alertsUpsertArgs<ExtArgs>>): Prisma__security_alertsClient<$Result.GetResult<Prisma.$security_alertsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Security_alerts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {security_alertsCountArgs} args - Arguments to filter Security_alerts to count.
     * @example
     * // Count the number of Security_alerts
     * const count = await prisma.security_alerts.count({
     *   where: {
     *     // ... the filter for the Security_alerts we want to count
     *   }
     * })
    **/
    count<T extends security_alertsCountArgs>(
      args?: Subset<T, security_alertsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Security_alertsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Security_alerts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Security_alertsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends Security_alertsAggregateArgs>(args: Subset<T, Security_alertsAggregateArgs>): Prisma.PrismaPromise<GetSecurity_alertsAggregateType<T>>

    /**
     * Group by Security_alerts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {security_alertsGroupByArgs} args - Group by arguments.
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
      T extends security_alertsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: security_alertsGroupByArgs['orderBy'] }
        : { orderBy?: security_alertsGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, security_alertsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSecurity_alertsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the security_alerts model
   */
  readonly fields: security_alertsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for security_alerts.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__security_alertsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the security_alerts model
   */
  interface security_alertsFieldRefs {
    readonly id: FieldRef<"security_alerts", 'Int'>
    readonly admin_id: FieldRef<"security_alerts", 'Int'>
    readonly alert_layer: FieldRef<"security_alerts", 'String'>
    readonly severity: FieldRef<"security_alerts", 'String'>
    readonly alert_type: FieldRef<"security_alerts", 'String'>
    readonly description: FieldRef<"security_alerts", 'String'>
    readonly ip_address: FieldRef<"security_alerts", 'String'>
    readonly created_at: FieldRef<"security_alerts", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * security_alerts findUnique
   */
  export type security_alertsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the security_alerts
     */
    select?: security_alertsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the security_alerts
     */
    omit?: security_alertsOmit<ExtArgs> | null
    /**
     * Filter, which security_alerts to fetch.
     */
    where: security_alertsWhereUniqueInput
  }

  /**
   * security_alerts findUniqueOrThrow
   */
  export type security_alertsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the security_alerts
     */
    select?: security_alertsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the security_alerts
     */
    omit?: security_alertsOmit<ExtArgs> | null
    /**
     * Filter, which security_alerts to fetch.
     */
    where: security_alertsWhereUniqueInput
  }

  /**
   * security_alerts findFirst
   */
  export type security_alertsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the security_alerts
     */
    select?: security_alertsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the security_alerts
     */
    omit?: security_alertsOmit<ExtArgs> | null
    /**
     * Filter, which security_alerts to fetch.
     */
    where?: security_alertsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of security_alerts to fetch.
     */
    orderBy?: security_alertsOrderByWithRelationInput | security_alertsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for security_alerts.
     */
    cursor?: security_alertsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` security_alerts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` security_alerts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of security_alerts.
     */
    distinct?: Security_alertsScalarFieldEnum | Security_alertsScalarFieldEnum[]
  }

  /**
   * security_alerts findFirstOrThrow
   */
  export type security_alertsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the security_alerts
     */
    select?: security_alertsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the security_alerts
     */
    omit?: security_alertsOmit<ExtArgs> | null
    /**
     * Filter, which security_alerts to fetch.
     */
    where?: security_alertsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of security_alerts to fetch.
     */
    orderBy?: security_alertsOrderByWithRelationInput | security_alertsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for security_alerts.
     */
    cursor?: security_alertsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` security_alerts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` security_alerts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of security_alerts.
     */
    distinct?: Security_alertsScalarFieldEnum | Security_alertsScalarFieldEnum[]
  }

  /**
   * security_alerts findMany
   */
  export type security_alertsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the security_alerts
     */
    select?: security_alertsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the security_alerts
     */
    omit?: security_alertsOmit<ExtArgs> | null
    /**
     * Filter, which security_alerts to fetch.
     */
    where?: security_alertsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of security_alerts to fetch.
     */
    orderBy?: security_alertsOrderByWithRelationInput | security_alertsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing security_alerts.
     */
    cursor?: security_alertsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` security_alerts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` security_alerts.
     */
    skip?: number
    distinct?: Security_alertsScalarFieldEnum | Security_alertsScalarFieldEnum[]
  }

  /**
   * security_alerts create
   */
  export type security_alertsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the security_alerts
     */
    select?: security_alertsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the security_alerts
     */
    omit?: security_alertsOmit<ExtArgs> | null
    /**
     * The data needed to create a security_alerts.
     */
    data?: XOR<security_alertsCreateInput, security_alertsUncheckedCreateInput>
  }

  /**
   * security_alerts createMany
   */
  export type security_alertsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many security_alerts.
     */
    data: security_alertsCreateManyInput | security_alertsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * security_alerts createManyAndReturn
   */
  export type security_alertsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the security_alerts
     */
    select?: security_alertsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the security_alerts
     */
    omit?: security_alertsOmit<ExtArgs> | null
    /**
     * The data used to create many security_alerts.
     */
    data: security_alertsCreateManyInput | security_alertsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * security_alerts update
   */
  export type security_alertsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the security_alerts
     */
    select?: security_alertsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the security_alerts
     */
    omit?: security_alertsOmit<ExtArgs> | null
    /**
     * The data needed to update a security_alerts.
     */
    data: XOR<security_alertsUpdateInput, security_alertsUncheckedUpdateInput>
    /**
     * Choose, which security_alerts to update.
     */
    where: security_alertsWhereUniqueInput
  }

  /**
   * security_alerts updateMany
   */
  export type security_alertsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update security_alerts.
     */
    data: XOR<security_alertsUpdateManyMutationInput, security_alertsUncheckedUpdateManyInput>
    /**
     * Filter which security_alerts to update
     */
    where?: security_alertsWhereInput
    /**
     * Limit how many security_alerts to update.
     */
    limit?: number
  }

  /**
   * security_alerts updateManyAndReturn
   */
  export type security_alertsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the security_alerts
     */
    select?: security_alertsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the security_alerts
     */
    omit?: security_alertsOmit<ExtArgs> | null
    /**
     * The data used to update security_alerts.
     */
    data: XOR<security_alertsUpdateManyMutationInput, security_alertsUncheckedUpdateManyInput>
    /**
     * Filter which security_alerts to update
     */
    where?: security_alertsWhereInput
    /**
     * Limit how many security_alerts to update.
     */
    limit?: number
  }

  /**
   * security_alerts upsert
   */
  export type security_alertsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the security_alerts
     */
    select?: security_alertsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the security_alerts
     */
    omit?: security_alertsOmit<ExtArgs> | null
    /**
     * The filter to search for the security_alerts to update in case it exists.
     */
    where: security_alertsWhereUniqueInput
    /**
     * In case the security_alerts found by the `where` argument doesn't exist, create a new security_alerts with this data.
     */
    create: XOR<security_alertsCreateInput, security_alertsUncheckedCreateInput>
    /**
     * In case the security_alerts was found with the provided `where` argument, update it with this data.
     */
    update: XOR<security_alertsUpdateInput, security_alertsUncheckedUpdateInput>
  }

  /**
   * security_alerts delete
   */
  export type security_alertsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the security_alerts
     */
    select?: security_alertsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the security_alerts
     */
    omit?: security_alertsOmit<ExtArgs> | null
    /**
     * Filter which security_alerts to delete.
     */
    where: security_alertsWhereUniqueInput
  }

  /**
   * security_alerts deleteMany
   */
  export type security_alertsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which security_alerts to delete
     */
    where?: security_alertsWhereInput
    /**
     * Limit how many security_alerts to delete.
     */
    limit?: number
  }

  /**
   * security_alerts without action
   */
  export type security_alertsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the security_alerts
     */
    select?: security_alertsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the security_alerts
     */
    omit?: security_alertsOmit<ExtArgs> | null
  }


  /**
   * Model edit_requests
   */

  export type AggregateEdit_requests = {
    _count: Edit_requestsCountAggregateOutputType | null
    _avg: Edit_requestsAvgAggregateOutputType | null
    _sum: Edit_requestsSumAggregateOutputType | null
    _min: Edit_requestsMinAggregateOutputType | null
    _max: Edit_requestsMaxAggregateOutputType | null
  }

  export type Edit_requestsAvgAggregateOutputType = {
    id: number | null
    requested_by_admin_id: number | null
    approved_by_admin_id: number | null
  }

  export type Edit_requestsSumAggregateOutputType = {
    id: number | null
    requested_by_admin_id: number | null
    approved_by_admin_id: number | null
  }

  export type Edit_requestsMinAggregateOutputType = {
    id: number | null
    requested_by_admin_id: number | null
    approved_by_admin_id: number | null
    module: string | null
    action: string | null
    target_identifier: string | null
    reason: string | null
    status: string | null
    approval_token: string | null
    requested_at: Date | null
    approved_at: Date | null
    expires_at: Date | null
  }

  export type Edit_requestsMaxAggregateOutputType = {
    id: number | null
    requested_by_admin_id: number | null
    approved_by_admin_id: number | null
    module: string | null
    action: string | null
    target_identifier: string | null
    reason: string | null
    status: string | null
    approval_token: string | null
    requested_at: Date | null
    approved_at: Date | null
    expires_at: Date | null
  }

  export type Edit_requestsCountAggregateOutputType = {
    id: number
    requested_by_admin_id: number
    approved_by_admin_id: number
    module: number
    action: number
    target_identifier: number
    reason: number
    status: number
    approval_token: number
    requested_at: number
    approved_at: number
    expires_at: number
    _all: number
  }


  export type Edit_requestsAvgAggregateInputType = {
    id?: true
    requested_by_admin_id?: true
    approved_by_admin_id?: true
  }

  export type Edit_requestsSumAggregateInputType = {
    id?: true
    requested_by_admin_id?: true
    approved_by_admin_id?: true
  }

  export type Edit_requestsMinAggregateInputType = {
    id?: true
    requested_by_admin_id?: true
    approved_by_admin_id?: true
    module?: true
    action?: true
    target_identifier?: true
    reason?: true
    status?: true
    approval_token?: true
    requested_at?: true
    approved_at?: true
    expires_at?: true
  }

  export type Edit_requestsMaxAggregateInputType = {
    id?: true
    requested_by_admin_id?: true
    approved_by_admin_id?: true
    module?: true
    action?: true
    target_identifier?: true
    reason?: true
    status?: true
    approval_token?: true
    requested_at?: true
    approved_at?: true
    expires_at?: true
  }

  export type Edit_requestsCountAggregateInputType = {
    id?: true
    requested_by_admin_id?: true
    approved_by_admin_id?: true
    module?: true
    action?: true
    target_identifier?: true
    reason?: true
    status?: true
    approval_token?: true
    requested_at?: true
    approved_at?: true
    expires_at?: true
    _all?: true
  }

  export type Edit_requestsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which edit_requests to aggregate.
     */
    where?: edit_requestsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of edit_requests to fetch.
     */
    orderBy?: edit_requestsOrderByWithRelationInput | edit_requestsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: edit_requestsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` edit_requests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` edit_requests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned edit_requests
    **/
    _count?: true | Edit_requestsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Edit_requestsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Edit_requestsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Edit_requestsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Edit_requestsMaxAggregateInputType
  }

  export type GetEdit_requestsAggregateType<T extends Edit_requestsAggregateArgs> = {
        [P in keyof T & keyof AggregateEdit_requests]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEdit_requests[P]>
      : GetScalarType<T[P], AggregateEdit_requests[P]>
  }




  export type edit_requestsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: edit_requestsWhereInput
    orderBy?: edit_requestsOrderByWithAggregationInput | edit_requestsOrderByWithAggregationInput[]
    by: Edit_requestsScalarFieldEnum[] | Edit_requestsScalarFieldEnum
    having?: edit_requestsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Edit_requestsCountAggregateInputType | true
    _avg?: Edit_requestsAvgAggregateInputType
    _sum?: Edit_requestsSumAggregateInputType
    _min?: Edit_requestsMinAggregateInputType
    _max?: Edit_requestsMaxAggregateInputType
  }

  export type Edit_requestsGroupByOutputType = {
    id: number
    requested_by_admin_id: number
    approved_by_admin_id: number | null
    module: string
    action: string
    target_identifier: string
    reason: string
    status: string
    approval_token: string | null
    requested_at: Date
    approved_at: Date | null
    expires_at: Date | null
    _count: Edit_requestsCountAggregateOutputType | null
    _avg: Edit_requestsAvgAggregateOutputType | null
    _sum: Edit_requestsSumAggregateOutputType | null
    _min: Edit_requestsMinAggregateOutputType | null
    _max: Edit_requestsMaxAggregateOutputType | null
  }

  type GetEdit_requestsGroupByPayload<T extends edit_requestsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Edit_requestsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Edit_requestsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Edit_requestsGroupByOutputType[P]>
            : GetScalarType<T[P], Edit_requestsGroupByOutputType[P]>
        }
      >
    >


  export type edit_requestsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    requested_by_admin_id?: boolean
    approved_by_admin_id?: boolean
    module?: boolean
    action?: boolean
    target_identifier?: boolean
    reason?: boolean
    status?: boolean
    approval_token?: boolean
    requested_at?: boolean
    approved_at?: boolean
    expires_at?: boolean
    requester?: boolean | adminsDefaultArgs<ExtArgs>
    approver?: boolean | edit_requests$approverArgs<ExtArgs>
  }, ExtArgs["result"]["edit_requests"]>

  export type edit_requestsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    requested_by_admin_id?: boolean
    approved_by_admin_id?: boolean
    module?: boolean
    action?: boolean
    target_identifier?: boolean
    reason?: boolean
    status?: boolean
    approval_token?: boolean
    requested_at?: boolean
    approved_at?: boolean
    expires_at?: boolean
    requester?: boolean | adminsDefaultArgs<ExtArgs>
    approver?: boolean | edit_requests$approverArgs<ExtArgs>
  }, ExtArgs["result"]["edit_requests"]>

  export type edit_requestsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    requested_by_admin_id?: boolean
    approved_by_admin_id?: boolean
    module?: boolean
    action?: boolean
    target_identifier?: boolean
    reason?: boolean
    status?: boolean
    approval_token?: boolean
    requested_at?: boolean
    approved_at?: boolean
    expires_at?: boolean
    requester?: boolean | adminsDefaultArgs<ExtArgs>
    approver?: boolean | edit_requests$approverArgs<ExtArgs>
  }, ExtArgs["result"]["edit_requests"]>

  export type edit_requestsSelectScalar = {
    id?: boolean
    requested_by_admin_id?: boolean
    approved_by_admin_id?: boolean
    module?: boolean
    action?: boolean
    target_identifier?: boolean
    reason?: boolean
    status?: boolean
    approval_token?: boolean
    requested_at?: boolean
    approved_at?: boolean
    expires_at?: boolean
  }

  export type edit_requestsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "requested_by_admin_id" | "approved_by_admin_id" | "module" | "action" | "target_identifier" | "reason" | "status" | "approval_token" | "requested_at" | "approved_at" | "expires_at", ExtArgs["result"]["edit_requests"]>
  export type edit_requestsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    requester?: boolean | adminsDefaultArgs<ExtArgs>
    approver?: boolean | edit_requests$approverArgs<ExtArgs>
  }
  export type edit_requestsIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    requester?: boolean | adminsDefaultArgs<ExtArgs>
    approver?: boolean | edit_requests$approverArgs<ExtArgs>
  }
  export type edit_requestsIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    requester?: boolean | adminsDefaultArgs<ExtArgs>
    approver?: boolean | edit_requests$approverArgs<ExtArgs>
  }

  export type $edit_requestsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "edit_requests"
    objects: {
      requester: Prisma.$adminsPayload<ExtArgs>
      approver: Prisma.$adminsPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      requested_by_admin_id: number
      approved_by_admin_id: number | null
      module: string
      action: string
      target_identifier: string
      reason: string
      status: string
      approval_token: string | null
      requested_at: Date
      approved_at: Date | null
      expires_at: Date | null
    }, ExtArgs["result"]["edit_requests"]>
    composites: {}
  }

  type edit_requestsGetPayload<S extends boolean | null | undefined | edit_requestsDefaultArgs> = $Result.GetResult<Prisma.$edit_requestsPayload, S>

  type edit_requestsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<edit_requestsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Edit_requestsCountAggregateInputType | true
    }

  export interface edit_requestsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['edit_requests'], meta: { name: 'edit_requests' } }
    /**
     * Find zero or one Edit_requests that matches the filter.
     * @param {edit_requestsFindUniqueArgs} args - Arguments to find a Edit_requests
     * @example
     * // Get one Edit_requests
     * const edit_requests = await prisma.edit_requests.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends edit_requestsFindUniqueArgs>(args: SelectSubset<T, edit_requestsFindUniqueArgs<ExtArgs>>): Prisma__edit_requestsClient<$Result.GetResult<Prisma.$edit_requestsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Edit_requests that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {edit_requestsFindUniqueOrThrowArgs} args - Arguments to find a Edit_requests
     * @example
     * // Get one Edit_requests
     * const edit_requests = await prisma.edit_requests.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends edit_requestsFindUniqueOrThrowArgs>(args: SelectSubset<T, edit_requestsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__edit_requestsClient<$Result.GetResult<Prisma.$edit_requestsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Edit_requests that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {edit_requestsFindFirstArgs} args - Arguments to find a Edit_requests
     * @example
     * // Get one Edit_requests
     * const edit_requests = await prisma.edit_requests.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends edit_requestsFindFirstArgs>(args?: SelectSubset<T, edit_requestsFindFirstArgs<ExtArgs>>): Prisma__edit_requestsClient<$Result.GetResult<Prisma.$edit_requestsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Edit_requests that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {edit_requestsFindFirstOrThrowArgs} args - Arguments to find a Edit_requests
     * @example
     * // Get one Edit_requests
     * const edit_requests = await prisma.edit_requests.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends edit_requestsFindFirstOrThrowArgs>(args?: SelectSubset<T, edit_requestsFindFirstOrThrowArgs<ExtArgs>>): Prisma__edit_requestsClient<$Result.GetResult<Prisma.$edit_requestsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Edit_requests that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {edit_requestsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Edit_requests
     * const edit_requests = await prisma.edit_requests.findMany()
     * 
     * // Get first 10 Edit_requests
     * const edit_requests = await prisma.edit_requests.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const edit_requestsWithIdOnly = await prisma.edit_requests.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends edit_requestsFindManyArgs>(args?: SelectSubset<T, edit_requestsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$edit_requestsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Edit_requests.
     * @param {edit_requestsCreateArgs} args - Arguments to create a Edit_requests.
     * @example
     * // Create one Edit_requests
     * const Edit_requests = await prisma.edit_requests.create({
     *   data: {
     *     // ... data to create a Edit_requests
     *   }
     * })
     * 
     */
    create<T extends edit_requestsCreateArgs>(args: SelectSubset<T, edit_requestsCreateArgs<ExtArgs>>): Prisma__edit_requestsClient<$Result.GetResult<Prisma.$edit_requestsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Edit_requests.
     * @param {edit_requestsCreateManyArgs} args - Arguments to create many Edit_requests.
     * @example
     * // Create many Edit_requests
     * const edit_requests = await prisma.edit_requests.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends edit_requestsCreateManyArgs>(args?: SelectSubset<T, edit_requestsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Edit_requests and returns the data saved in the database.
     * @param {edit_requestsCreateManyAndReturnArgs} args - Arguments to create many Edit_requests.
     * @example
     * // Create many Edit_requests
     * const edit_requests = await prisma.edit_requests.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Edit_requests and only return the `id`
     * const edit_requestsWithIdOnly = await prisma.edit_requests.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends edit_requestsCreateManyAndReturnArgs>(args?: SelectSubset<T, edit_requestsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$edit_requestsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Edit_requests.
     * @param {edit_requestsDeleteArgs} args - Arguments to delete one Edit_requests.
     * @example
     * // Delete one Edit_requests
     * const Edit_requests = await prisma.edit_requests.delete({
     *   where: {
     *     // ... filter to delete one Edit_requests
     *   }
     * })
     * 
     */
    delete<T extends edit_requestsDeleteArgs>(args: SelectSubset<T, edit_requestsDeleteArgs<ExtArgs>>): Prisma__edit_requestsClient<$Result.GetResult<Prisma.$edit_requestsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Edit_requests.
     * @param {edit_requestsUpdateArgs} args - Arguments to update one Edit_requests.
     * @example
     * // Update one Edit_requests
     * const edit_requests = await prisma.edit_requests.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends edit_requestsUpdateArgs>(args: SelectSubset<T, edit_requestsUpdateArgs<ExtArgs>>): Prisma__edit_requestsClient<$Result.GetResult<Prisma.$edit_requestsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Edit_requests.
     * @param {edit_requestsDeleteManyArgs} args - Arguments to filter Edit_requests to delete.
     * @example
     * // Delete a few Edit_requests
     * const { count } = await prisma.edit_requests.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends edit_requestsDeleteManyArgs>(args?: SelectSubset<T, edit_requestsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Edit_requests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {edit_requestsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Edit_requests
     * const edit_requests = await prisma.edit_requests.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends edit_requestsUpdateManyArgs>(args: SelectSubset<T, edit_requestsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Edit_requests and returns the data updated in the database.
     * @param {edit_requestsUpdateManyAndReturnArgs} args - Arguments to update many Edit_requests.
     * @example
     * // Update many Edit_requests
     * const edit_requests = await prisma.edit_requests.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Edit_requests and only return the `id`
     * const edit_requestsWithIdOnly = await prisma.edit_requests.updateManyAndReturn({
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
    updateManyAndReturn<T extends edit_requestsUpdateManyAndReturnArgs>(args: SelectSubset<T, edit_requestsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$edit_requestsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Edit_requests.
     * @param {edit_requestsUpsertArgs} args - Arguments to update or create a Edit_requests.
     * @example
     * // Update or create a Edit_requests
     * const edit_requests = await prisma.edit_requests.upsert({
     *   create: {
     *     // ... data to create a Edit_requests
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Edit_requests we want to update
     *   }
     * })
     */
    upsert<T extends edit_requestsUpsertArgs>(args: SelectSubset<T, edit_requestsUpsertArgs<ExtArgs>>): Prisma__edit_requestsClient<$Result.GetResult<Prisma.$edit_requestsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Edit_requests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {edit_requestsCountArgs} args - Arguments to filter Edit_requests to count.
     * @example
     * // Count the number of Edit_requests
     * const count = await prisma.edit_requests.count({
     *   where: {
     *     // ... the filter for the Edit_requests we want to count
     *   }
     * })
    **/
    count<T extends edit_requestsCountArgs>(
      args?: Subset<T, edit_requestsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Edit_requestsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Edit_requests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Edit_requestsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends Edit_requestsAggregateArgs>(args: Subset<T, Edit_requestsAggregateArgs>): Prisma.PrismaPromise<GetEdit_requestsAggregateType<T>>

    /**
     * Group by Edit_requests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {edit_requestsGroupByArgs} args - Group by arguments.
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
      T extends edit_requestsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: edit_requestsGroupByArgs['orderBy'] }
        : { orderBy?: edit_requestsGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, edit_requestsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEdit_requestsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the edit_requests model
   */
  readonly fields: edit_requestsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for edit_requests.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__edit_requestsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    requester<T extends adminsDefaultArgs<ExtArgs> = {}>(args?: Subset<T, adminsDefaultArgs<ExtArgs>>): Prisma__adminsClient<$Result.GetResult<Prisma.$adminsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    approver<T extends edit_requests$approverArgs<ExtArgs> = {}>(args?: Subset<T, edit_requests$approverArgs<ExtArgs>>): Prisma__adminsClient<$Result.GetResult<Prisma.$adminsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the edit_requests model
   */
  interface edit_requestsFieldRefs {
    readonly id: FieldRef<"edit_requests", 'Int'>
    readonly requested_by_admin_id: FieldRef<"edit_requests", 'Int'>
    readonly approved_by_admin_id: FieldRef<"edit_requests", 'Int'>
    readonly module: FieldRef<"edit_requests", 'String'>
    readonly action: FieldRef<"edit_requests", 'String'>
    readonly target_identifier: FieldRef<"edit_requests", 'String'>
    readonly reason: FieldRef<"edit_requests", 'String'>
    readonly status: FieldRef<"edit_requests", 'String'>
    readonly approval_token: FieldRef<"edit_requests", 'String'>
    readonly requested_at: FieldRef<"edit_requests", 'DateTime'>
    readonly approved_at: FieldRef<"edit_requests", 'DateTime'>
    readonly expires_at: FieldRef<"edit_requests", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * edit_requests findUnique
   */
  export type edit_requestsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the edit_requests
     */
    select?: edit_requestsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the edit_requests
     */
    omit?: edit_requestsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: edit_requestsInclude<ExtArgs> | null
    /**
     * Filter, which edit_requests to fetch.
     */
    where: edit_requestsWhereUniqueInput
  }

  /**
   * edit_requests findUniqueOrThrow
   */
  export type edit_requestsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the edit_requests
     */
    select?: edit_requestsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the edit_requests
     */
    omit?: edit_requestsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: edit_requestsInclude<ExtArgs> | null
    /**
     * Filter, which edit_requests to fetch.
     */
    where: edit_requestsWhereUniqueInput
  }

  /**
   * edit_requests findFirst
   */
  export type edit_requestsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the edit_requests
     */
    select?: edit_requestsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the edit_requests
     */
    omit?: edit_requestsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: edit_requestsInclude<ExtArgs> | null
    /**
     * Filter, which edit_requests to fetch.
     */
    where?: edit_requestsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of edit_requests to fetch.
     */
    orderBy?: edit_requestsOrderByWithRelationInput | edit_requestsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for edit_requests.
     */
    cursor?: edit_requestsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` edit_requests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` edit_requests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of edit_requests.
     */
    distinct?: Edit_requestsScalarFieldEnum | Edit_requestsScalarFieldEnum[]
  }

  /**
   * edit_requests findFirstOrThrow
   */
  export type edit_requestsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the edit_requests
     */
    select?: edit_requestsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the edit_requests
     */
    omit?: edit_requestsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: edit_requestsInclude<ExtArgs> | null
    /**
     * Filter, which edit_requests to fetch.
     */
    where?: edit_requestsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of edit_requests to fetch.
     */
    orderBy?: edit_requestsOrderByWithRelationInput | edit_requestsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for edit_requests.
     */
    cursor?: edit_requestsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` edit_requests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` edit_requests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of edit_requests.
     */
    distinct?: Edit_requestsScalarFieldEnum | Edit_requestsScalarFieldEnum[]
  }

  /**
   * edit_requests findMany
   */
  export type edit_requestsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the edit_requests
     */
    select?: edit_requestsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the edit_requests
     */
    omit?: edit_requestsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: edit_requestsInclude<ExtArgs> | null
    /**
     * Filter, which edit_requests to fetch.
     */
    where?: edit_requestsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of edit_requests to fetch.
     */
    orderBy?: edit_requestsOrderByWithRelationInput | edit_requestsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing edit_requests.
     */
    cursor?: edit_requestsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` edit_requests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` edit_requests.
     */
    skip?: number
    distinct?: Edit_requestsScalarFieldEnum | Edit_requestsScalarFieldEnum[]
  }

  /**
   * edit_requests create
   */
  export type edit_requestsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the edit_requests
     */
    select?: edit_requestsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the edit_requests
     */
    omit?: edit_requestsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: edit_requestsInclude<ExtArgs> | null
    /**
     * The data needed to create a edit_requests.
     */
    data: XOR<edit_requestsCreateInput, edit_requestsUncheckedCreateInput>
  }

  /**
   * edit_requests createMany
   */
  export type edit_requestsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many edit_requests.
     */
    data: edit_requestsCreateManyInput | edit_requestsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * edit_requests createManyAndReturn
   */
  export type edit_requestsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the edit_requests
     */
    select?: edit_requestsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the edit_requests
     */
    omit?: edit_requestsOmit<ExtArgs> | null
    /**
     * The data used to create many edit_requests.
     */
    data: edit_requestsCreateManyInput | edit_requestsCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: edit_requestsIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * edit_requests update
   */
  export type edit_requestsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the edit_requests
     */
    select?: edit_requestsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the edit_requests
     */
    omit?: edit_requestsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: edit_requestsInclude<ExtArgs> | null
    /**
     * The data needed to update a edit_requests.
     */
    data: XOR<edit_requestsUpdateInput, edit_requestsUncheckedUpdateInput>
    /**
     * Choose, which edit_requests to update.
     */
    where: edit_requestsWhereUniqueInput
  }

  /**
   * edit_requests updateMany
   */
  export type edit_requestsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update edit_requests.
     */
    data: XOR<edit_requestsUpdateManyMutationInput, edit_requestsUncheckedUpdateManyInput>
    /**
     * Filter which edit_requests to update
     */
    where?: edit_requestsWhereInput
    /**
     * Limit how many edit_requests to update.
     */
    limit?: number
  }

  /**
   * edit_requests updateManyAndReturn
   */
  export type edit_requestsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the edit_requests
     */
    select?: edit_requestsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the edit_requests
     */
    omit?: edit_requestsOmit<ExtArgs> | null
    /**
     * The data used to update edit_requests.
     */
    data: XOR<edit_requestsUpdateManyMutationInput, edit_requestsUncheckedUpdateManyInput>
    /**
     * Filter which edit_requests to update
     */
    where?: edit_requestsWhereInput
    /**
     * Limit how many edit_requests to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: edit_requestsIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * edit_requests upsert
   */
  export type edit_requestsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the edit_requests
     */
    select?: edit_requestsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the edit_requests
     */
    omit?: edit_requestsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: edit_requestsInclude<ExtArgs> | null
    /**
     * The filter to search for the edit_requests to update in case it exists.
     */
    where: edit_requestsWhereUniqueInput
    /**
     * In case the edit_requests found by the `where` argument doesn't exist, create a new edit_requests with this data.
     */
    create: XOR<edit_requestsCreateInput, edit_requestsUncheckedCreateInput>
    /**
     * In case the edit_requests was found with the provided `where` argument, update it with this data.
     */
    update: XOR<edit_requestsUpdateInput, edit_requestsUncheckedUpdateInput>
  }

  /**
   * edit_requests delete
   */
  export type edit_requestsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the edit_requests
     */
    select?: edit_requestsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the edit_requests
     */
    omit?: edit_requestsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: edit_requestsInclude<ExtArgs> | null
    /**
     * Filter which edit_requests to delete.
     */
    where: edit_requestsWhereUniqueInput
  }

  /**
   * edit_requests deleteMany
   */
  export type edit_requestsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which edit_requests to delete
     */
    where?: edit_requestsWhereInput
    /**
     * Limit how many edit_requests to delete.
     */
    limit?: number
  }

  /**
   * edit_requests.approver
   */
  export type edit_requests$approverArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the admins
     */
    select?: adminsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the admins
     */
    omit?: adminsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: adminsInclude<ExtArgs> | null
    where?: adminsWhereInput
  }

  /**
   * edit_requests without action
   */
  export type edit_requestsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the edit_requests
     */
    select?: edit_requestsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the edit_requests
     */
    omit?: edit_requestsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: edit_requestsInclude<ExtArgs> | null
  }


  /**
   * Model temporary_permissions
   */

  export type AggregateTemporary_permissions = {
    _count: Temporary_permissionsCountAggregateOutputType | null
    _avg: Temporary_permissionsAvgAggregateOutputType | null
    _sum: Temporary_permissionsSumAggregateOutputType | null
    _min: Temporary_permissionsMinAggregateOutputType | null
    _max: Temporary_permissionsMaxAggregateOutputType | null
  }

  export type Temporary_permissionsAvgAggregateOutputType = {
    id: number | null
    admin_id: number | null
    approved_by: number | null
  }

  export type Temporary_permissionsSumAggregateOutputType = {
    id: number | null
    admin_id: number | null
    approved_by: number | null
  }

  export type Temporary_permissionsMinAggregateOutputType = {
    id: number | null
    admin_id: number | null
    module: string | null
    target_identifier: string | null
    approved_by: number | null
    expires_at: Date | null
    created_at: Date | null
  }

  export type Temporary_permissionsMaxAggregateOutputType = {
    id: number | null
    admin_id: number | null
    module: string | null
    target_identifier: string | null
    approved_by: number | null
    expires_at: Date | null
    created_at: Date | null
  }

  export type Temporary_permissionsCountAggregateOutputType = {
    id: number
    admin_id: number
    module: number
    target_identifier: number
    approved_by: number
    expires_at: number
    created_at: number
    _all: number
  }


  export type Temporary_permissionsAvgAggregateInputType = {
    id?: true
    admin_id?: true
    approved_by?: true
  }

  export type Temporary_permissionsSumAggregateInputType = {
    id?: true
    admin_id?: true
    approved_by?: true
  }

  export type Temporary_permissionsMinAggregateInputType = {
    id?: true
    admin_id?: true
    module?: true
    target_identifier?: true
    approved_by?: true
    expires_at?: true
    created_at?: true
  }

  export type Temporary_permissionsMaxAggregateInputType = {
    id?: true
    admin_id?: true
    module?: true
    target_identifier?: true
    approved_by?: true
    expires_at?: true
    created_at?: true
  }

  export type Temporary_permissionsCountAggregateInputType = {
    id?: true
    admin_id?: true
    module?: true
    target_identifier?: true
    approved_by?: true
    expires_at?: true
    created_at?: true
    _all?: true
  }

  export type Temporary_permissionsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which temporary_permissions to aggregate.
     */
    where?: temporary_permissionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of temporary_permissions to fetch.
     */
    orderBy?: temporary_permissionsOrderByWithRelationInput | temporary_permissionsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: temporary_permissionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` temporary_permissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` temporary_permissions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned temporary_permissions
    **/
    _count?: true | Temporary_permissionsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Temporary_permissionsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Temporary_permissionsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Temporary_permissionsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Temporary_permissionsMaxAggregateInputType
  }

  export type GetTemporary_permissionsAggregateType<T extends Temporary_permissionsAggregateArgs> = {
        [P in keyof T & keyof AggregateTemporary_permissions]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTemporary_permissions[P]>
      : GetScalarType<T[P], AggregateTemporary_permissions[P]>
  }




  export type temporary_permissionsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: temporary_permissionsWhereInput
    orderBy?: temporary_permissionsOrderByWithAggregationInput | temporary_permissionsOrderByWithAggregationInput[]
    by: Temporary_permissionsScalarFieldEnum[] | Temporary_permissionsScalarFieldEnum
    having?: temporary_permissionsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Temporary_permissionsCountAggregateInputType | true
    _avg?: Temporary_permissionsAvgAggregateInputType
    _sum?: Temporary_permissionsSumAggregateInputType
    _min?: Temporary_permissionsMinAggregateInputType
    _max?: Temporary_permissionsMaxAggregateInputType
  }

  export type Temporary_permissionsGroupByOutputType = {
    id: number
    admin_id: number
    module: string
    target_identifier: string
    approved_by: number
    expires_at: Date
    created_at: Date
    _count: Temporary_permissionsCountAggregateOutputType | null
    _avg: Temporary_permissionsAvgAggregateOutputType | null
    _sum: Temporary_permissionsSumAggregateOutputType | null
    _min: Temporary_permissionsMinAggregateOutputType | null
    _max: Temporary_permissionsMaxAggregateOutputType | null
  }

  type GetTemporary_permissionsGroupByPayload<T extends temporary_permissionsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Temporary_permissionsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Temporary_permissionsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Temporary_permissionsGroupByOutputType[P]>
            : GetScalarType<T[P], Temporary_permissionsGroupByOutputType[P]>
        }
      >
    >


  export type temporary_permissionsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    admin_id?: boolean
    module?: boolean
    target_identifier?: boolean
    approved_by?: boolean
    expires_at?: boolean
    created_at?: boolean
    admin?: boolean | adminsDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["temporary_permissions"]>

  export type temporary_permissionsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    admin_id?: boolean
    module?: boolean
    target_identifier?: boolean
    approved_by?: boolean
    expires_at?: boolean
    created_at?: boolean
    admin?: boolean | adminsDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["temporary_permissions"]>

  export type temporary_permissionsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    admin_id?: boolean
    module?: boolean
    target_identifier?: boolean
    approved_by?: boolean
    expires_at?: boolean
    created_at?: boolean
    admin?: boolean | adminsDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["temporary_permissions"]>

  export type temporary_permissionsSelectScalar = {
    id?: boolean
    admin_id?: boolean
    module?: boolean
    target_identifier?: boolean
    approved_by?: boolean
    expires_at?: boolean
    created_at?: boolean
  }

  export type temporary_permissionsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "admin_id" | "module" | "target_identifier" | "approved_by" | "expires_at" | "created_at", ExtArgs["result"]["temporary_permissions"]>
  export type temporary_permissionsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    admin?: boolean | adminsDefaultArgs<ExtArgs>
  }
  export type temporary_permissionsIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    admin?: boolean | adminsDefaultArgs<ExtArgs>
  }
  export type temporary_permissionsIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    admin?: boolean | adminsDefaultArgs<ExtArgs>
  }

  export type $temporary_permissionsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "temporary_permissions"
    objects: {
      admin: Prisma.$adminsPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      admin_id: number
      module: string
      target_identifier: string
      approved_by: number
      expires_at: Date
      created_at: Date
    }, ExtArgs["result"]["temporary_permissions"]>
    composites: {}
  }

  type temporary_permissionsGetPayload<S extends boolean | null | undefined | temporary_permissionsDefaultArgs> = $Result.GetResult<Prisma.$temporary_permissionsPayload, S>

  type temporary_permissionsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<temporary_permissionsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Temporary_permissionsCountAggregateInputType | true
    }

  export interface temporary_permissionsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['temporary_permissions'], meta: { name: 'temporary_permissions' } }
    /**
     * Find zero or one Temporary_permissions that matches the filter.
     * @param {temporary_permissionsFindUniqueArgs} args - Arguments to find a Temporary_permissions
     * @example
     * // Get one Temporary_permissions
     * const temporary_permissions = await prisma.temporary_permissions.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends temporary_permissionsFindUniqueArgs>(args: SelectSubset<T, temporary_permissionsFindUniqueArgs<ExtArgs>>): Prisma__temporary_permissionsClient<$Result.GetResult<Prisma.$temporary_permissionsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Temporary_permissions that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {temporary_permissionsFindUniqueOrThrowArgs} args - Arguments to find a Temporary_permissions
     * @example
     * // Get one Temporary_permissions
     * const temporary_permissions = await prisma.temporary_permissions.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends temporary_permissionsFindUniqueOrThrowArgs>(args: SelectSubset<T, temporary_permissionsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__temporary_permissionsClient<$Result.GetResult<Prisma.$temporary_permissionsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Temporary_permissions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {temporary_permissionsFindFirstArgs} args - Arguments to find a Temporary_permissions
     * @example
     * // Get one Temporary_permissions
     * const temporary_permissions = await prisma.temporary_permissions.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends temporary_permissionsFindFirstArgs>(args?: SelectSubset<T, temporary_permissionsFindFirstArgs<ExtArgs>>): Prisma__temporary_permissionsClient<$Result.GetResult<Prisma.$temporary_permissionsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Temporary_permissions that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {temporary_permissionsFindFirstOrThrowArgs} args - Arguments to find a Temporary_permissions
     * @example
     * // Get one Temporary_permissions
     * const temporary_permissions = await prisma.temporary_permissions.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends temporary_permissionsFindFirstOrThrowArgs>(args?: SelectSubset<T, temporary_permissionsFindFirstOrThrowArgs<ExtArgs>>): Prisma__temporary_permissionsClient<$Result.GetResult<Prisma.$temporary_permissionsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Temporary_permissions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {temporary_permissionsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Temporary_permissions
     * const temporary_permissions = await prisma.temporary_permissions.findMany()
     * 
     * // Get first 10 Temporary_permissions
     * const temporary_permissions = await prisma.temporary_permissions.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const temporary_permissionsWithIdOnly = await prisma.temporary_permissions.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends temporary_permissionsFindManyArgs>(args?: SelectSubset<T, temporary_permissionsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$temporary_permissionsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Temporary_permissions.
     * @param {temporary_permissionsCreateArgs} args - Arguments to create a Temporary_permissions.
     * @example
     * // Create one Temporary_permissions
     * const Temporary_permissions = await prisma.temporary_permissions.create({
     *   data: {
     *     // ... data to create a Temporary_permissions
     *   }
     * })
     * 
     */
    create<T extends temporary_permissionsCreateArgs>(args: SelectSubset<T, temporary_permissionsCreateArgs<ExtArgs>>): Prisma__temporary_permissionsClient<$Result.GetResult<Prisma.$temporary_permissionsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Temporary_permissions.
     * @param {temporary_permissionsCreateManyArgs} args - Arguments to create many Temporary_permissions.
     * @example
     * // Create many Temporary_permissions
     * const temporary_permissions = await prisma.temporary_permissions.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends temporary_permissionsCreateManyArgs>(args?: SelectSubset<T, temporary_permissionsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Temporary_permissions and returns the data saved in the database.
     * @param {temporary_permissionsCreateManyAndReturnArgs} args - Arguments to create many Temporary_permissions.
     * @example
     * // Create many Temporary_permissions
     * const temporary_permissions = await prisma.temporary_permissions.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Temporary_permissions and only return the `id`
     * const temporary_permissionsWithIdOnly = await prisma.temporary_permissions.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends temporary_permissionsCreateManyAndReturnArgs>(args?: SelectSubset<T, temporary_permissionsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$temporary_permissionsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Temporary_permissions.
     * @param {temporary_permissionsDeleteArgs} args - Arguments to delete one Temporary_permissions.
     * @example
     * // Delete one Temporary_permissions
     * const Temporary_permissions = await prisma.temporary_permissions.delete({
     *   where: {
     *     // ... filter to delete one Temporary_permissions
     *   }
     * })
     * 
     */
    delete<T extends temporary_permissionsDeleteArgs>(args: SelectSubset<T, temporary_permissionsDeleteArgs<ExtArgs>>): Prisma__temporary_permissionsClient<$Result.GetResult<Prisma.$temporary_permissionsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Temporary_permissions.
     * @param {temporary_permissionsUpdateArgs} args - Arguments to update one Temporary_permissions.
     * @example
     * // Update one Temporary_permissions
     * const temporary_permissions = await prisma.temporary_permissions.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends temporary_permissionsUpdateArgs>(args: SelectSubset<T, temporary_permissionsUpdateArgs<ExtArgs>>): Prisma__temporary_permissionsClient<$Result.GetResult<Prisma.$temporary_permissionsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Temporary_permissions.
     * @param {temporary_permissionsDeleteManyArgs} args - Arguments to filter Temporary_permissions to delete.
     * @example
     * // Delete a few Temporary_permissions
     * const { count } = await prisma.temporary_permissions.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends temporary_permissionsDeleteManyArgs>(args?: SelectSubset<T, temporary_permissionsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Temporary_permissions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {temporary_permissionsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Temporary_permissions
     * const temporary_permissions = await prisma.temporary_permissions.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends temporary_permissionsUpdateManyArgs>(args: SelectSubset<T, temporary_permissionsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Temporary_permissions and returns the data updated in the database.
     * @param {temporary_permissionsUpdateManyAndReturnArgs} args - Arguments to update many Temporary_permissions.
     * @example
     * // Update many Temporary_permissions
     * const temporary_permissions = await prisma.temporary_permissions.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Temporary_permissions and only return the `id`
     * const temporary_permissionsWithIdOnly = await prisma.temporary_permissions.updateManyAndReturn({
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
    updateManyAndReturn<T extends temporary_permissionsUpdateManyAndReturnArgs>(args: SelectSubset<T, temporary_permissionsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$temporary_permissionsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Temporary_permissions.
     * @param {temporary_permissionsUpsertArgs} args - Arguments to update or create a Temporary_permissions.
     * @example
     * // Update or create a Temporary_permissions
     * const temporary_permissions = await prisma.temporary_permissions.upsert({
     *   create: {
     *     // ... data to create a Temporary_permissions
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Temporary_permissions we want to update
     *   }
     * })
     */
    upsert<T extends temporary_permissionsUpsertArgs>(args: SelectSubset<T, temporary_permissionsUpsertArgs<ExtArgs>>): Prisma__temporary_permissionsClient<$Result.GetResult<Prisma.$temporary_permissionsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Temporary_permissions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {temporary_permissionsCountArgs} args - Arguments to filter Temporary_permissions to count.
     * @example
     * // Count the number of Temporary_permissions
     * const count = await prisma.temporary_permissions.count({
     *   where: {
     *     // ... the filter for the Temporary_permissions we want to count
     *   }
     * })
    **/
    count<T extends temporary_permissionsCountArgs>(
      args?: Subset<T, temporary_permissionsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Temporary_permissionsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Temporary_permissions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Temporary_permissionsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends Temporary_permissionsAggregateArgs>(args: Subset<T, Temporary_permissionsAggregateArgs>): Prisma.PrismaPromise<GetTemporary_permissionsAggregateType<T>>

    /**
     * Group by Temporary_permissions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {temporary_permissionsGroupByArgs} args - Group by arguments.
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
      T extends temporary_permissionsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: temporary_permissionsGroupByArgs['orderBy'] }
        : { orderBy?: temporary_permissionsGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, temporary_permissionsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTemporary_permissionsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the temporary_permissions model
   */
  readonly fields: temporary_permissionsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for temporary_permissions.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__temporary_permissionsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    admin<T extends adminsDefaultArgs<ExtArgs> = {}>(args?: Subset<T, adminsDefaultArgs<ExtArgs>>): Prisma__adminsClient<$Result.GetResult<Prisma.$adminsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the temporary_permissions model
   */
  interface temporary_permissionsFieldRefs {
    readonly id: FieldRef<"temporary_permissions", 'Int'>
    readonly admin_id: FieldRef<"temporary_permissions", 'Int'>
    readonly module: FieldRef<"temporary_permissions", 'String'>
    readonly target_identifier: FieldRef<"temporary_permissions", 'String'>
    readonly approved_by: FieldRef<"temporary_permissions", 'Int'>
    readonly expires_at: FieldRef<"temporary_permissions", 'DateTime'>
    readonly created_at: FieldRef<"temporary_permissions", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * temporary_permissions findUnique
   */
  export type temporary_permissionsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the temporary_permissions
     */
    select?: temporary_permissionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the temporary_permissions
     */
    omit?: temporary_permissionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: temporary_permissionsInclude<ExtArgs> | null
    /**
     * Filter, which temporary_permissions to fetch.
     */
    where: temporary_permissionsWhereUniqueInput
  }

  /**
   * temporary_permissions findUniqueOrThrow
   */
  export type temporary_permissionsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the temporary_permissions
     */
    select?: temporary_permissionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the temporary_permissions
     */
    omit?: temporary_permissionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: temporary_permissionsInclude<ExtArgs> | null
    /**
     * Filter, which temporary_permissions to fetch.
     */
    where: temporary_permissionsWhereUniqueInput
  }

  /**
   * temporary_permissions findFirst
   */
  export type temporary_permissionsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the temporary_permissions
     */
    select?: temporary_permissionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the temporary_permissions
     */
    omit?: temporary_permissionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: temporary_permissionsInclude<ExtArgs> | null
    /**
     * Filter, which temporary_permissions to fetch.
     */
    where?: temporary_permissionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of temporary_permissions to fetch.
     */
    orderBy?: temporary_permissionsOrderByWithRelationInput | temporary_permissionsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for temporary_permissions.
     */
    cursor?: temporary_permissionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` temporary_permissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` temporary_permissions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of temporary_permissions.
     */
    distinct?: Temporary_permissionsScalarFieldEnum | Temporary_permissionsScalarFieldEnum[]
  }

  /**
   * temporary_permissions findFirstOrThrow
   */
  export type temporary_permissionsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the temporary_permissions
     */
    select?: temporary_permissionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the temporary_permissions
     */
    omit?: temporary_permissionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: temporary_permissionsInclude<ExtArgs> | null
    /**
     * Filter, which temporary_permissions to fetch.
     */
    where?: temporary_permissionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of temporary_permissions to fetch.
     */
    orderBy?: temporary_permissionsOrderByWithRelationInput | temporary_permissionsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for temporary_permissions.
     */
    cursor?: temporary_permissionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` temporary_permissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` temporary_permissions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of temporary_permissions.
     */
    distinct?: Temporary_permissionsScalarFieldEnum | Temporary_permissionsScalarFieldEnum[]
  }

  /**
   * temporary_permissions findMany
   */
  export type temporary_permissionsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the temporary_permissions
     */
    select?: temporary_permissionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the temporary_permissions
     */
    omit?: temporary_permissionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: temporary_permissionsInclude<ExtArgs> | null
    /**
     * Filter, which temporary_permissions to fetch.
     */
    where?: temporary_permissionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of temporary_permissions to fetch.
     */
    orderBy?: temporary_permissionsOrderByWithRelationInput | temporary_permissionsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing temporary_permissions.
     */
    cursor?: temporary_permissionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` temporary_permissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` temporary_permissions.
     */
    skip?: number
    distinct?: Temporary_permissionsScalarFieldEnum | Temporary_permissionsScalarFieldEnum[]
  }

  /**
   * temporary_permissions create
   */
  export type temporary_permissionsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the temporary_permissions
     */
    select?: temporary_permissionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the temporary_permissions
     */
    omit?: temporary_permissionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: temporary_permissionsInclude<ExtArgs> | null
    /**
     * The data needed to create a temporary_permissions.
     */
    data: XOR<temporary_permissionsCreateInput, temporary_permissionsUncheckedCreateInput>
  }

  /**
   * temporary_permissions createMany
   */
  export type temporary_permissionsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many temporary_permissions.
     */
    data: temporary_permissionsCreateManyInput | temporary_permissionsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * temporary_permissions createManyAndReturn
   */
  export type temporary_permissionsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the temporary_permissions
     */
    select?: temporary_permissionsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the temporary_permissions
     */
    omit?: temporary_permissionsOmit<ExtArgs> | null
    /**
     * The data used to create many temporary_permissions.
     */
    data: temporary_permissionsCreateManyInput | temporary_permissionsCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: temporary_permissionsIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * temporary_permissions update
   */
  export type temporary_permissionsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the temporary_permissions
     */
    select?: temporary_permissionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the temporary_permissions
     */
    omit?: temporary_permissionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: temporary_permissionsInclude<ExtArgs> | null
    /**
     * The data needed to update a temporary_permissions.
     */
    data: XOR<temporary_permissionsUpdateInput, temporary_permissionsUncheckedUpdateInput>
    /**
     * Choose, which temporary_permissions to update.
     */
    where: temporary_permissionsWhereUniqueInput
  }

  /**
   * temporary_permissions updateMany
   */
  export type temporary_permissionsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update temporary_permissions.
     */
    data: XOR<temporary_permissionsUpdateManyMutationInput, temporary_permissionsUncheckedUpdateManyInput>
    /**
     * Filter which temporary_permissions to update
     */
    where?: temporary_permissionsWhereInput
    /**
     * Limit how many temporary_permissions to update.
     */
    limit?: number
  }

  /**
   * temporary_permissions updateManyAndReturn
   */
  export type temporary_permissionsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the temporary_permissions
     */
    select?: temporary_permissionsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the temporary_permissions
     */
    omit?: temporary_permissionsOmit<ExtArgs> | null
    /**
     * The data used to update temporary_permissions.
     */
    data: XOR<temporary_permissionsUpdateManyMutationInput, temporary_permissionsUncheckedUpdateManyInput>
    /**
     * Filter which temporary_permissions to update
     */
    where?: temporary_permissionsWhereInput
    /**
     * Limit how many temporary_permissions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: temporary_permissionsIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * temporary_permissions upsert
   */
  export type temporary_permissionsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the temporary_permissions
     */
    select?: temporary_permissionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the temporary_permissions
     */
    omit?: temporary_permissionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: temporary_permissionsInclude<ExtArgs> | null
    /**
     * The filter to search for the temporary_permissions to update in case it exists.
     */
    where: temporary_permissionsWhereUniqueInput
    /**
     * In case the temporary_permissions found by the `where` argument doesn't exist, create a new temporary_permissions with this data.
     */
    create: XOR<temporary_permissionsCreateInput, temporary_permissionsUncheckedCreateInput>
    /**
     * In case the temporary_permissions was found with the provided `where` argument, update it with this data.
     */
    update: XOR<temporary_permissionsUpdateInput, temporary_permissionsUncheckedUpdateInput>
  }

  /**
   * temporary_permissions delete
   */
  export type temporary_permissionsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the temporary_permissions
     */
    select?: temporary_permissionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the temporary_permissions
     */
    omit?: temporary_permissionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: temporary_permissionsInclude<ExtArgs> | null
    /**
     * Filter which temporary_permissions to delete.
     */
    where: temporary_permissionsWhereUniqueInput
  }

  /**
   * temporary_permissions deleteMany
   */
  export type temporary_permissionsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which temporary_permissions to delete
     */
    where?: temporary_permissionsWhereInput
    /**
     * Limit how many temporary_permissions to delete.
     */
    limit?: number
  }

  /**
   * temporary_permissions without action
   */
  export type temporary_permissionsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the temporary_permissions
     */
    select?: temporary_permissionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the temporary_permissions
     */
    omit?: temporary_permissionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: temporary_permissionsInclude<ExtArgs> | null
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


  export const AdminsScalarFieldEnum: {
    id: 'id',
    full_name: 'full_name',
    email: 'email',
    password_hash: 'password_hash',
    created_at: 'created_at',
    role: 'role',
    phone_number: 'phone_number',
    parent_admin_id: 'parent_admin_id',
    status: 'status'
  };

  export type AdminsScalarFieldEnum = (typeof AdminsScalarFieldEnum)[keyof typeof AdminsScalarFieldEnum]


  export const Admin_preferencesScalarFieldEnum: {
    id: 'id',
    admin_id: 'admin_id',
    language: 'language',
    theme: 'theme',
    date_format: 'date_format',
    time_format: 'time_format',
    default_dashboard: 'default_dashboard',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type Admin_preferencesScalarFieldEnum = (typeof Admin_preferencesScalarFieldEnum)[keyof typeof Admin_preferencesScalarFieldEnum]


  export const Audit_logsScalarFieldEnum: {
    id: 'id',
    admin_id: 'admin_id',
    event_type: 'event_type',
    event_description: 'event_description',
    ip_address: 'ip_address',
    created_at: 'created_at'
  };

  export type Audit_logsScalarFieldEnum = (typeof Audit_logsScalarFieldEnum)[keyof typeof Audit_logsScalarFieldEnum]


  export const Behavior_profilesScalarFieldEnum: {
    id: 'id',
    admin_id: 'admin_id',
    enrollment_phrase: 'enrollment_phrase',
    avg_dwell_time: 'avg_dwell_time',
    avg_flight_time: 'avg_flight_time',
    avg_typing_speed: 'avg_typing_speed',
    avg_backspace_usage: 'avg_backspace_usage',
    avg_error_rate: 'avg_error_rate',
    created_at: 'created_at'
  };

  export type Behavior_profilesScalarFieldEnum = (typeof Behavior_profilesScalarFieldEnum)[keyof typeof Behavior_profilesScalarFieldEnum]


  export const Behavior_samplesScalarFieldEnum: {
    id: 'id',
    admin_id: 'admin_id',
    dwell_time: 'dwell_time',
    flight_time: 'flight_time',
    typing_speed: 'typing_speed',
    backspace_usage: 'backspace_usage',
    error_rate: 'error_rate',
    similarity_score: 'similarity_score',
    verification_result: 'verification_result',
    created_at: 'created_at',
    sample_type: 'sample_type'
  };

  export type Behavior_samplesScalarFieldEnum = (typeof Behavior_samplesScalarFieldEnum)[keyof typeof Behavior_samplesScalarFieldEnum]


  export const DevicesScalarFieldEnum: {
    id: 'id',
    admin_id: 'admin_id',
    device_fingerprint: 'device_fingerprint',
    device_name: 'device_name',
    trust_score: 'trust_score',
    status: 'status',
    registration_token_hash: 'registration_token_hash',
    token_expires_at: 'token_expires_at',
    first_seen: 'first_seen',
    last_seen: 'last_seen',
    created_at: 'created_at'
  };

  export type DevicesScalarFieldEnum = (typeof DevicesScalarFieldEnum)[keyof typeof DevicesScalarFieldEnum]


  export const Risk_eventsScalarFieldEnum: {
    id: 'id',
    admin_id: 'admin_id',
    identity_score: 'identity_score',
    device_score: 'device_score',
    behavior_score: 'behavior_score',
    overall_risk_score: 'overall_risk_score',
    decision: 'decision',
    created_at: 'created_at'
  };

  export type Risk_eventsScalarFieldEnum = (typeof Risk_eventsScalarFieldEnum)[keyof typeof Risk_eventsScalarFieldEnum]


  export const Security_alertsScalarFieldEnum: {
    id: 'id',
    admin_id: 'admin_id',
    alert_layer: 'alert_layer',
    severity: 'severity',
    alert_type: 'alert_type',
    description: 'description',
    ip_address: 'ip_address',
    created_at: 'created_at'
  };

  export type Security_alertsScalarFieldEnum = (typeof Security_alertsScalarFieldEnum)[keyof typeof Security_alertsScalarFieldEnum]


  export const Edit_requestsScalarFieldEnum: {
    id: 'id',
    requested_by_admin_id: 'requested_by_admin_id',
    approved_by_admin_id: 'approved_by_admin_id',
    module: 'module',
    action: 'action',
    target_identifier: 'target_identifier',
    reason: 'reason',
    status: 'status',
    approval_token: 'approval_token',
    requested_at: 'requested_at',
    approved_at: 'approved_at',
    expires_at: 'expires_at'
  };

  export type Edit_requestsScalarFieldEnum = (typeof Edit_requestsScalarFieldEnum)[keyof typeof Edit_requestsScalarFieldEnum]


  export const Temporary_permissionsScalarFieldEnum: {
    id: 'id',
    admin_id: 'admin_id',
    module: 'module',
    target_identifier: 'target_identifier',
    approved_by: 'approved_by',
    expires_at: 'expires_at',
    created_at: 'created_at'
  };

  export type Temporary_permissionsScalarFieldEnum = (typeof Temporary_permissionsScalarFieldEnum)[keyof typeof Temporary_permissionsScalarFieldEnum]


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


  export type adminsWhereInput = {
    AND?: adminsWhereInput | adminsWhereInput[]
    OR?: adminsWhereInput[]
    NOT?: adminsWhereInput | adminsWhereInput[]
    id?: IntFilter<"admins"> | number
    full_name?: StringFilter<"admins"> | string
    email?: StringFilter<"admins"> | string
    password_hash?: StringFilter<"admins"> | string
    created_at?: DateTimeNullableFilter<"admins"> | Date | string | null
    role?: StringFilter<"admins"> | string
    phone_number?: StringNullableFilter<"admins"> | string | null
    parent_admin_id?: IntNullableFilter<"admins"> | number | null
    status?: StringNullableFilter<"admins"> | string | null
    behavior_profiles?: Behavior_profilesListRelationFilter
    behavior_samples?: Behavior_samplesListRelationFilter
    devices?: DevicesListRelationFilter
    risk_events?: Risk_eventsListRelationFilter
    preferences?: XOR<Admin_preferencesNullableScalarRelationFilter, admin_preferencesWhereInput> | null
    edit_requests_requested?: Edit_requestsListRelationFilter
    edit_requests_approved?: Edit_requestsListRelationFilter
    temporary_permissions?: Temporary_permissionsListRelationFilter
  }

  export type adminsOrderByWithRelationInput = {
    id?: SortOrder
    full_name?: SortOrder
    email?: SortOrder
    password_hash?: SortOrder
    created_at?: SortOrderInput | SortOrder
    role?: SortOrder
    phone_number?: SortOrderInput | SortOrder
    parent_admin_id?: SortOrderInput | SortOrder
    status?: SortOrderInput | SortOrder
    behavior_profiles?: behavior_profilesOrderByRelationAggregateInput
    behavior_samples?: behavior_samplesOrderByRelationAggregateInput
    devices?: devicesOrderByRelationAggregateInput
    risk_events?: risk_eventsOrderByRelationAggregateInput
    preferences?: admin_preferencesOrderByWithRelationInput
    edit_requests_requested?: edit_requestsOrderByRelationAggregateInput
    edit_requests_approved?: edit_requestsOrderByRelationAggregateInput
    temporary_permissions?: temporary_permissionsOrderByRelationAggregateInput
  }

  export type adminsWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    email?: string
    AND?: adminsWhereInput | adminsWhereInput[]
    OR?: adminsWhereInput[]
    NOT?: adminsWhereInput | adminsWhereInput[]
    full_name?: StringFilter<"admins"> | string
    password_hash?: StringFilter<"admins"> | string
    created_at?: DateTimeNullableFilter<"admins"> | Date | string | null
    role?: StringFilter<"admins"> | string
    phone_number?: StringNullableFilter<"admins"> | string | null
    parent_admin_id?: IntNullableFilter<"admins"> | number | null
    status?: StringNullableFilter<"admins"> | string | null
    behavior_profiles?: Behavior_profilesListRelationFilter
    behavior_samples?: Behavior_samplesListRelationFilter
    devices?: DevicesListRelationFilter
    risk_events?: Risk_eventsListRelationFilter
    preferences?: XOR<Admin_preferencesNullableScalarRelationFilter, admin_preferencesWhereInput> | null
    edit_requests_requested?: Edit_requestsListRelationFilter
    edit_requests_approved?: Edit_requestsListRelationFilter
    temporary_permissions?: Temporary_permissionsListRelationFilter
  }, "id" | "email">

  export type adminsOrderByWithAggregationInput = {
    id?: SortOrder
    full_name?: SortOrder
    email?: SortOrder
    password_hash?: SortOrder
    created_at?: SortOrderInput | SortOrder
    role?: SortOrder
    phone_number?: SortOrderInput | SortOrder
    parent_admin_id?: SortOrderInput | SortOrder
    status?: SortOrderInput | SortOrder
    _count?: adminsCountOrderByAggregateInput
    _avg?: adminsAvgOrderByAggregateInput
    _max?: adminsMaxOrderByAggregateInput
    _min?: adminsMinOrderByAggregateInput
    _sum?: adminsSumOrderByAggregateInput
  }

  export type adminsScalarWhereWithAggregatesInput = {
    AND?: adminsScalarWhereWithAggregatesInput | adminsScalarWhereWithAggregatesInput[]
    OR?: adminsScalarWhereWithAggregatesInput[]
    NOT?: adminsScalarWhereWithAggregatesInput | adminsScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"admins"> | number
    full_name?: StringWithAggregatesFilter<"admins"> | string
    email?: StringWithAggregatesFilter<"admins"> | string
    password_hash?: StringWithAggregatesFilter<"admins"> | string
    created_at?: DateTimeNullableWithAggregatesFilter<"admins"> | Date | string | null
    role?: StringWithAggregatesFilter<"admins"> | string
    phone_number?: StringNullableWithAggregatesFilter<"admins"> | string | null
    parent_admin_id?: IntNullableWithAggregatesFilter<"admins"> | number | null
    status?: StringNullableWithAggregatesFilter<"admins"> | string | null
  }

  export type admin_preferencesWhereInput = {
    AND?: admin_preferencesWhereInput | admin_preferencesWhereInput[]
    OR?: admin_preferencesWhereInput[]
    NOT?: admin_preferencesWhereInput | admin_preferencesWhereInput[]
    id?: IntFilter<"admin_preferences"> | number
    admin_id?: IntFilter<"admin_preferences"> | number
    language?: StringFilter<"admin_preferences"> | string
    theme?: StringFilter<"admin_preferences"> | string
    date_format?: StringFilter<"admin_preferences"> | string
    time_format?: StringFilter<"admin_preferences"> | string
    default_dashboard?: StringFilter<"admin_preferences"> | string
    created_at?: DateTimeFilter<"admin_preferences"> | Date | string
    updated_at?: DateTimeFilter<"admin_preferences"> | Date | string
    admin?: XOR<AdminsScalarRelationFilter, adminsWhereInput>
  }

  export type admin_preferencesOrderByWithRelationInput = {
    id?: SortOrder
    admin_id?: SortOrder
    language?: SortOrder
    theme?: SortOrder
    date_format?: SortOrder
    time_format?: SortOrder
    default_dashboard?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    admin?: adminsOrderByWithRelationInput
  }

  export type admin_preferencesWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    admin_id?: number
    AND?: admin_preferencesWhereInput | admin_preferencesWhereInput[]
    OR?: admin_preferencesWhereInput[]
    NOT?: admin_preferencesWhereInput | admin_preferencesWhereInput[]
    language?: StringFilter<"admin_preferences"> | string
    theme?: StringFilter<"admin_preferences"> | string
    date_format?: StringFilter<"admin_preferences"> | string
    time_format?: StringFilter<"admin_preferences"> | string
    default_dashboard?: StringFilter<"admin_preferences"> | string
    created_at?: DateTimeFilter<"admin_preferences"> | Date | string
    updated_at?: DateTimeFilter<"admin_preferences"> | Date | string
    admin?: XOR<AdminsScalarRelationFilter, adminsWhereInput>
  }, "id" | "admin_id">

  export type admin_preferencesOrderByWithAggregationInput = {
    id?: SortOrder
    admin_id?: SortOrder
    language?: SortOrder
    theme?: SortOrder
    date_format?: SortOrder
    time_format?: SortOrder
    default_dashboard?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: admin_preferencesCountOrderByAggregateInput
    _avg?: admin_preferencesAvgOrderByAggregateInput
    _max?: admin_preferencesMaxOrderByAggregateInput
    _min?: admin_preferencesMinOrderByAggregateInput
    _sum?: admin_preferencesSumOrderByAggregateInput
  }

  export type admin_preferencesScalarWhereWithAggregatesInput = {
    AND?: admin_preferencesScalarWhereWithAggregatesInput | admin_preferencesScalarWhereWithAggregatesInput[]
    OR?: admin_preferencesScalarWhereWithAggregatesInput[]
    NOT?: admin_preferencesScalarWhereWithAggregatesInput | admin_preferencesScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"admin_preferences"> | number
    admin_id?: IntWithAggregatesFilter<"admin_preferences"> | number
    language?: StringWithAggregatesFilter<"admin_preferences"> | string
    theme?: StringWithAggregatesFilter<"admin_preferences"> | string
    date_format?: StringWithAggregatesFilter<"admin_preferences"> | string
    time_format?: StringWithAggregatesFilter<"admin_preferences"> | string
    default_dashboard?: StringWithAggregatesFilter<"admin_preferences"> | string
    created_at?: DateTimeWithAggregatesFilter<"admin_preferences"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"admin_preferences"> | Date | string
  }

  export type audit_logsWhereInput = {
    AND?: audit_logsWhereInput | audit_logsWhereInput[]
    OR?: audit_logsWhereInput[]
    NOT?: audit_logsWhereInput | audit_logsWhereInput[]
    id?: IntFilter<"audit_logs"> | number
    admin_id?: IntNullableFilter<"audit_logs"> | number | null
    event_type?: StringFilter<"audit_logs"> | string
    event_description?: StringNullableFilter<"audit_logs"> | string | null
    ip_address?: StringNullableFilter<"audit_logs"> | string | null
    created_at?: DateTimeNullableFilter<"audit_logs"> | Date | string | null
  }

  export type audit_logsOrderByWithRelationInput = {
    id?: SortOrder
    admin_id?: SortOrderInput | SortOrder
    event_type?: SortOrder
    event_description?: SortOrderInput | SortOrder
    ip_address?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
  }

  export type audit_logsWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: audit_logsWhereInput | audit_logsWhereInput[]
    OR?: audit_logsWhereInput[]
    NOT?: audit_logsWhereInput | audit_logsWhereInput[]
    admin_id?: IntNullableFilter<"audit_logs"> | number | null
    event_type?: StringFilter<"audit_logs"> | string
    event_description?: StringNullableFilter<"audit_logs"> | string | null
    ip_address?: StringNullableFilter<"audit_logs"> | string | null
    created_at?: DateTimeNullableFilter<"audit_logs"> | Date | string | null
  }, "id">

  export type audit_logsOrderByWithAggregationInput = {
    id?: SortOrder
    admin_id?: SortOrderInput | SortOrder
    event_type?: SortOrder
    event_description?: SortOrderInput | SortOrder
    ip_address?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    _count?: audit_logsCountOrderByAggregateInput
    _avg?: audit_logsAvgOrderByAggregateInput
    _max?: audit_logsMaxOrderByAggregateInput
    _min?: audit_logsMinOrderByAggregateInput
    _sum?: audit_logsSumOrderByAggregateInput
  }

  export type audit_logsScalarWhereWithAggregatesInput = {
    AND?: audit_logsScalarWhereWithAggregatesInput | audit_logsScalarWhereWithAggregatesInput[]
    OR?: audit_logsScalarWhereWithAggregatesInput[]
    NOT?: audit_logsScalarWhereWithAggregatesInput | audit_logsScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"audit_logs"> | number
    admin_id?: IntNullableWithAggregatesFilter<"audit_logs"> | number | null
    event_type?: StringWithAggregatesFilter<"audit_logs"> | string
    event_description?: StringNullableWithAggregatesFilter<"audit_logs"> | string | null
    ip_address?: StringNullableWithAggregatesFilter<"audit_logs"> | string | null
    created_at?: DateTimeNullableWithAggregatesFilter<"audit_logs"> | Date | string | null
  }

  export type behavior_profilesWhereInput = {
    AND?: behavior_profilesWhereInput | behavior_profilesWhereInput[]
    OR?: behavior_profilesWhereInput[]
    NOT?: behavior_profilesWhereInput | behavior_profilesWhereInput[]
    id?: IntFilter<"behavior_profiles"> | number
    admin_id?: IntFilter<"behavior_profiles"> | number
    enrollment_phrase?: StringFilter<"behavior_profiles"> | string
    avg_dwell_time?: DecimalNullableFilter<"behavior_profiles"> | Decimal | DecimalJsLike | number | string | null
    avg_flight_time?: DecimalNullableFilter<"behavior_profiles"> | Decimal | DecimalJsLike | number | string | null
    avg_typing_speed?: DecimalNullableFilter<"behavior_profiles"> | Decimal | DecimalJsLike | number | string | null
    avg_backspace_usage?: DecimalNullableFilter<"behavior_profiles"> | Decimal | DecimalJsLike | number | string | null
    avg_error_rate?: DecimalNullableFilter<"behavior_profiles"> | Decimal | DecimalJsLike | number | string | null
    created_at?: DateTimeNullableFilter<"behavior_profiles"> | Date | string | null
    admins?: XOR<AdminsScalarRelationFilter, adminsWhereInput>
  }

  export type behavior_profilesOrderByWithRelationInput = {
    id?: SortOrder
    admin_id?: SortOrder
    enrollment_phrase?: SortOrder
    avg_dwell_time?: SortOrderInput | SortOrder
    avg_flight_time?: SortOrderInput | SortOrder
    avg_typing_speed?: SortOrderInput | SortOrder
    avg_backspace_usage?: SortOrderInput | SortOrder
    avg_error_rate?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    admins?: adminsOrderByWithRelationInput
  }

  export type behavior_profilesWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: behavior_profilesWhereInput | behavior_profilesWhereInput[]
    OR?: behavior_profilesWhereInput[]
    NOT?: behavior_profilesWhereInput | behavior_profilesWhereInput[]
    admin_id?: IntFilter<"behavior_profiles"> | number
    enrollment_phrase?: StringFilter<"behavior_profiles"> | string
    avg_dwell_time?: DecimalNullableFilter<"behavior_profiles"> | Decimal | DecimalJsLike | number | string | null
    avg_flight_time?: DecimalNullableFilter<"behavior_profiles"> | Decimal | DecimalJsLike | number | string | null
    avg_typing_speed?: DecimalNullableFilter<"behavior_profiles"> | Decimal | DecimalJsLike | number | string | null
    avg_backspace_usage?: DecimalNullableFilter<"behavior_profiles"> | Decimal | DecimalJsLike | number | string | null
    avg_error_rate?: DecimalNullableFilter<"behavior_profiles"> | Decimal | DecimalJsLike | number | string | null
    created_at?: DateTimeNullableFilter<"behavior_profiles"> | Date | string | null
    admins?: XOR<AdminsScalarRelationFilter, adminsWhereInput>
  }, "id">

  export type behavior_profilesOrderByWithAggregationInput = {
    id?: SortOrder
    admin_id?: SortOrder
    enrollment_phrase?: SortOrder
    avg_dwell_time?: SortOrderInput | SortOrder
    avg_flight_time?: SortOrderInput | SortOrder
    avg_typing_speed?: SortOrderInput | SortOrder
    avg_backspace_usage?: SortOrderInput | SortOrder
    avg_error_rate?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    _count?: behavior_profilesCountOrderByAggregateInput
    _avg?: behavior_profilesAvgOrderByAggregateInput
    _max?: behavior_profilesMaxOrderByAggregateInput
    _min?: behavior_profilesMinOrderByAggregateInput
    _sum?: behavior_profilesSumOrderByAggregateInput
  }

  export type behavior_profilesScalarWhereWithAggregatesInput = {
    AND?: behavior_profilesScalarWhereWithAggregatesInput | behavior_profilesScalarWhereWithAggregatesInput[]
    OR?: behavior_profilesScalarWhereWithAggregatesInput[]
    NOT?: behavior_profilesScalarWhereWithAggregatesInput | behavior_profilesScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"behavior_profiles"> | number
    admin_id?: IntWithAggregatesFilter<"behavior_profiles"> | number
    enrollment_phrase?: StringWithAggregatesFilter<"behavior_profiles"> | string
    avg_dwell_time?: DecimalNullableWithAggregatesFilter<"behavior_profiles"> | Decimal | DecimalJsLike | number | string | null
    avg_flight_time?: DecimalNullableWithAggregatesFilter<"behavior_profiles"> | Decimal | DecimalJsLike | number | string | null
    avg_typing_speed?: DecimalNullableWithAggregatesFilter<"behavior_profiles"> | Decimal | DecimalJsLike | number | string | null
    avg_backspace_usage?: DecimalNullableWithAggregatesFilter<"behavior_profiles"> | Decimal | DecimalJsLike | number | string | null
    avg_error_rate?: DecimalNullableWithAggregatesFilter<"behavior_profiles"> | Decimal | DecimalJsLike | number | string | null
    created_at?: DateTimeNullableWithAggregatesFilter<"behavior_profiles"> | Date | string | null
  }

  export type behavior_samplesWhereInput = {
    AND?: behavior_samplesWhereInput | behavior_samplesWhereInput[]
    OR?: behavior_samplesWhereInput[]
    NOT?: behavior_samplesWhereInput | behavior_samplesWhereInput[]
    id?: IntFilter<"behavior_samples"> | number
    admin_id?: IntFilter<"behavior_samples"> | number
    dwell_time?: DecimalNullableFilter<"behavior_samples"> | Decimal | DecimalJsLike | number | string | null
    flight_time?: DecimalNullableFilter<"behavior_samples"> | Decimal | DecimalJsLike | number | string | null
    typing_speed?: DecimalNullableFilter<"behavior_samples"> | Decimal | DecimalJsLike | number | string | null
    backspace_usage?: DecimalNullableFilter<"behavior_samples"> | Decimal | DecimalJsLike | number | string | null
    error_rate?: DecimalNullableFilter<"behavior_samples"> | Decimal | DecimalJsLike | number | string | null
    similarity_score?: DecimalNullableFilter<"behavior_samples"> | Decimal | DecimalJsLike | number | string | null
    verification_result?: StringNullableFilter<"behavior_samples"> | string | null
    created_at?: DateTimeNullableFilter<"behavior_samples"> | Date | string | null
    sample_type?: StringNullableFilter<"behavior_samples"> | string | null
    admins?: XOR<AdminsScalarRelationFilter, adminsWhereInput>
  }

  export type behavior_samplesOrderByWithRelationInput = {
    id?: SortOrder
    admin_id?: SortOrder
    dwell_time?: SortOrderInput | SortOrder
    flight_time?: SortOrderInput | SortOrder
    typing_speed?: SortOrderInput | SortOrder
    backspace_usage?: SortOrderInput | SortOrder
    error_rate?: SortOrderInput | SortOrder
    similarity_score?: SortOrderInput | SortOrder
    verification_result?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    sample_type?: SortOrderInput | SortOrder
    admins?: adminsOrderByWithRelationInput
  }

  export type behavior_samplesWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: behavior_samplesWhereInput | behavior_samplesWhereInput[]
    OR?: behavior_samplesWhereInput[]
    NOT?: behavior_samplesWhereInput | behavior_samplesWhereInput[]
    admin_id?: IntFilter<"behavior_samples"> | number
    dwell_time?: DecimalNullableFilter<"behavior_samples"> | Decimal | DecimalJsLike | number | string | null
    flight_time?: DecimalNullableFilter<"behavior_samples"> | Decimal | DecimalJsLike | number | string | null
    typing_speed?: DecimalNullableFilter<"behavior_samples"> | Decimal | DecimalJsLike | number | string | null
    backspace_usage?: DecimalNullableFilter<"behavior_samples"> | Decimal | DecimalJsLike | number | string | null
    error_rate?: DecimalNullableFilter<"behavior_samples"> | Decimal | DecimalJsLike | number | string | null
    similarity_score?: DecimalNullableFilter<"behavior_samples"> | Decimal | DecimalJsLike | number | string | null
    verification_result?: StringNullableFilter<"behavior_samples"> | string | null
    created_at?: DateTimeNullableFilter<"behavior_samples"> | Date | string | null
    sample_type?: StringNullableFilter<"behavior_samples"> | string | null
    admins?: XOR<AdminsScalarRelationFilter, adminsWhereInput>
  }, "id">

  export type behavior_samplesOrderByWithAggregationInput = {
    id?: SortOrder
    admin_id?: SortOrder
    dwell_time?: SortOrderInput | SortOrder
    flight_time?: SortOrderInput | SortOrder
    typing_speed?: SortOrderInput | SortOrder
    backspace_usage?: SortOrderInput | SortOrder
    error_rate?: SortOrderInput | SortOrder
    similarity_score?: SortOrderInput | SortOrder
    verification_result?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    sample_type?: SortOrderInput | SortOrder
    _count?: behavior_samplesCountOrderByAggregateInput
    _avg?: behavior_samplesAvgOrderByAggregateInput
    _max?: behavior_samplesMaxOrderByAggregateInput
    _min?: behavior_samplesMinOrderByAggregateInput
    _sum?: behavior_samplesSumOrderByAggregateInput
  }

  export type behavior_samplesScalarWhereWithAggregatesInput = {
    AND?: behavior_samplesScalarWhereWithAggregatesInput | behavior_samplesScalarWhereWithAggregatesInput[]
    OR?: behavior_samplesScalarWhereWithAggregatesInput[]
    NOT?: behavior_samplesScalarWhereWithAggregatesInput | behavior_samplesScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"behavior_samples"> | number
    admin_id?: IntWithAggregatesFilter<"behavior_samples"> | number
    dwell_time?: DecimalNullableWithAggregatesFilter<"behavior_samples"> | Decimal | DecimalJsLike | number | string | null
    flight_time?: DecimalNullableWithAggregatesFilter<"behavior_samples"> | Decimal | DecimalJsLike | number | string | null
    typing_speed?: DecimalNullableWithAggregatesFilter<"behavior_samples"> | Decimal | DecimalJsLike | number | string | null
    backspace_usage?: DecimalNullableWithAggregatesFilter<"behavior_samples"> | Decimal | DecimalJsLike | number | string | null
    error_rate?: DecimalNullableWithAggregatesFilter<"behavior_samples"> | Decimal | DecimalJsLike | number | string | null
    similarity_score?: DecimalNullableWithAggregatesFilter<"behavior_samples"> | Decimal | DecimalJsLike | number | string | null
    verification_result?: StringNullableWithAggregatesFilter<"behavior_samples"> | string | null
    created_at?: DateTimeNullableWithAggregatesFilter<"behavior_samples"> | Date | string | null
    sample_type?: StringNullableWithAggregatesFilter<"behavior_samples"> | string | null
  }

  export type devicesWhereInput = {
    AND?: devicesWhereInput | devicesWhereInput[]
    OR?: devicesWhereInput[]
    NOT?: devicesWhereInput | devicesWhereInput[]
    id?: IntFilter<"devices"> | number
    admin_id?: IntFilter<"devices"> | number
    device_fingerprint?: StringFilter<"devices"> | string
    device_name?: StringNullableFilter<"devices"> | string | null
    trust_score?: IntNullableFilter<"devices"> | number | null
    status?: StringNullableFilter<"devices"> | string | null
    registration_token_hash?: StringNullableFilter<"devices"> | string | null
    token_expires_at?: DateTimeNullableFilter<"devices"> | Date | string | null
    first_seen?: DateTimeNullableFilter<"devices"> | Date | string | null
    last_seen?: DateTimeNullableFilter<"devices"> | Date | string | null
    created_at?: DateTimeNullableFilter<"devices"> | Date | string | null
    admins?: XOR<AdminsScalarRelationFilter, adminsWhereInput>
  }

  export type devicesOrderByWithRelationInput = {
    id?: SortOrder
    admin_id?: SortOrder
    device_fingerprint?: SortOrder
    device_name?: SortOrderInput | SortOrder
    trust_score?: SortOrderInput | SortOrder
    status?: SortOrderInput | SortOrder
    registration_token_hash?: SortOrderInput | SortOrder
    token_expires_at?: SortOrderInput | SortOrder
    first_seen?: SortOrderInput | SortOrder
    last_seen?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    admins?: adminsOrderByWithRelationInput
  }

  export type devicesWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    device_fingerprint?: string
    AND?: devicesWhereInput | devicesWhereInput[]
    OR?: devicesWhereInput[]
    NOT?: devicesWhereInput | devicesWhereInput[]
    admin_id?: IntFilter<"devices"> | number
    device_name?: StringNullableFilter<"devices"> | string | null
    trust_score?: IntNullableFilter<"devices"> | number | null
    status?: StringNullableFilter<"devices"> | string | null
    registration_token_hash?: StringNullableFilter<"devices"> | string | null
    token_expires_at?: DateTimeNullableFilter<"devices"> | Date | string | null
    first_seen?: DateTimeNullableFilter<"devices"> | Date | string | null
    last_seen?: DateTimeNullableFilter<"devices"> | Date | string | null
    created_at?: DateTimeNullableFilter<"devices"> | Date | string | null
    admins?: XOR<AdminsScalarRelationFilter, adminsWhereInput>
  }, "id" | "device_fingerprint">

  export type devicesOrderByWithAggregationInput = {
    id?: SortOrder
    admin_id?: SortOrder
    device_fingerprint?: SortOrder
    device_name?: SortOrderInput | SortOrder
    trust_score?: SortOrderInput | SortOrder
    status?: SortOrderInput | SortOrder
    registration_token_hash?: SortOrderInput | SortOrder
    token_expires_at?: SortOrderInput | SortOrder
    first_seen?: SortOrderInput | SortOrder
    last_seen?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    _count?: devicesCountOrderByAggregateInput
    _avg?: devicesAvgOrderByAggregateInput
    _max?: devicesMaxOrderByAggregateInput
    _min?: devicesMinOrderByAggregateInput
    _sum?: devicesSumOrderByAggregateInput
  }

  export type devicesScalarWhereWithAggregatesInput = {
    AND?: devicesScalarWhereWithAggregatesInput | devicesScalarWhereWithAggregatesInput[]
    OR?: devicesScalarWhereWithAggregatesInput[]
    NOT?: devicesScalarWhereWithAggregatesInput | devicesScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"devices"> | number
    admin_id?: IntWithAggregatesFilter<"devices"> | number
    device_fingerprint?: StringWithAggregatesFilter<"devices"> | string
    device_name?: StringNullableWithAggregatesFilter<"devices"> | string | null
    trust_score?: IntNullableWithAggregatesFilter<"devices"> | number | null
    status?: StringNullableWithAggregatesFilter<"devices"> | string | null
    registration_token_hash?: StringNullableWithAggregatesFilter<"devices"> | string | null
    token_expires_at?: DateTimeNullableWithAggregatesFilter<"devices"> | Date | string | null
    first_seen?: DateTimeNullableWithAggregatesFilter<"devices"> | Date | string | null
    last_seen?: DateTimeNullableWithAggregatesFilter<"devices"> | Date | string | null
    created_at?: DateTimeNullableWithAggregatesFilter<"devices"> | Date | string | null
  }

  export type risk_eventsWhereInput = {
    AND?: risk_eventsWhereInput | risk_eventsWhereInput[]
    OR?: risk_eventsWhereInput[]
    NOT?: risk_eventsWhereInput | risk_eventsWhereInput[]
    id?: IntFilter<"risk_events"> | number
    admin_id?: IntNullableFilter<"risk_events"> | number | null
    identity_score?: DecimalNullableFilter<"risk_events"> | Decimal | DecimalJsLike | number | string | null
    device_score?: DecimalNullableFilter<"risk_events"> | Decimal | DecimalJsLike | number | string | null
    behavior_score?: DecimalNullableFilter<"risk_events"> | Decimal | DecimalJsLike | number | string | null
    overall_risk_score?: DecimalNullableFilter<"risk_events"> | Decimal | DecimalJsLike | number | string | null
    decision?: StringNullableFilter<"risk_events"> | string | null
    created_at?: DateTimeNullableFilter<"risk_events"> | Date | string | null
    admins?: XOR<AdminsNullableScalarRelationFilter, adminsWhereInput> | null
  }

  export type risk_eventsOrderByWithRelationInput = {
    id?: SortOrder
    admin_id?: SortOrderInput | SortOrder
    identity_score?: SortOrderInput | SortOrder
    device_score?: SortOrderInput | SortOrder
    behavior_score?: SortOrderInput | SortOrder
    overall_risk_score?: SortOrderInput | SortOrder
    decision?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    admins?: adminsOrderByWithRelationInput
  }

  export type risk_eventsWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: risk_eventsWhereInput | risk_eventsWhereInput[]
    OR?: risk_eventsWhereInput[]
    NOT?: risk_eventsWhereInput | risk_eventsWhereInput[]
    admin_id?: IntNullableFilter<"risk_events"> | number | null
    identity_score?: DecimalNullableFilter<"risk_events"> | Decimal | DecimalJsLike | number | string | null
    device_score?: DecimalNullableFilter<"risk_events"> | Decimal | DecimalJsLike | number | string | null
    behavior_score?: DecimalNullableFilter<"risk_events"> | Decimal | DecimalJsLike | number | string | null
    overall_risk_score?: DecimalNullableFilter<"risk_events"> | Decimal | DecimalJsLike | number | string | null
    decision?: StringNullableFilter<"risk_events"> | string | null
    created_at?: DateTimeNullableFilter<"risk_events"> | Date | string | null
    admins?: XOR<AdminsNullableScalarRelationFilter, adminsWhereInput> | null
  }, "id">

  export type risk_eventsOrderByWithAggregationInput = {
    id?: SortOrder
    admin_id?: SortOrderInput | SortOrder
    identity_score?: SortOrderInput | SortOrder
    device_score?: SortOrderInput | SortOrder
    behavior_score?: SortOrderInput | SortOrder
    overall_risk_score?: SortOrderInput | SortOrder
    decision?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    _count?: risk_eventsCountOrderByAggregateInput
    _avg?: risk_eventsAvgOrderByAggregateInput
    _max?: risk_eventsMaxOrderByAggregateInput
    _min?: risk_eventsMinOrderByAggregateInput
    _sum?: risk_eventsSumOrderByAggregateInput
  }

  export type risk_eventsScalarWhereWithAggregatesInput = {
    AND?: risk_eventsScalarWhereWithAggregatesInput | risk_eventsScalarWhereWithAggregatesInput[]
    OR?: risk_eventsScalarWhereWithAggregatesInput[]
    NOT?: risk_eventsScalarWhereWithAggregatesInput | risk_eventsScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"risk_events"> | number
    admin_id?: IntNullableWithAggregatesFilter<"risk_events"> | number | null
    identity_score?: DecimalNullableWithAggregatesFilter<"risk_events"> | Decimal | DecimalJsLike | number | string | null
    device_score?: DecimalNullableWithAggregatesFilter<"risk_events"> | Decimal | DecimalJsLike | number | string | null
    behavior_score?: DecimalNullableWithAggregatesFilter<"risk_events"> | Decimal | DecimalJsLike | number | string | null
    overall_risk_score?: DecimalNullableWithAggregatesFilter<"risk_events"> | Decimal | DecimalJsLike | number | string | null
    decision?: StringNullableWithAggregatesFilter<"risk_events"> | string | null
    created_at?: DateTimeNullableWithAggregatesFilter<"risk_events"> | Date | string | null
  }

  export type security_alertsWhereInput = {
    AND?: security_alertsWhereInput | security_alertsWhereInput[]
    OR?: security_alertsWhereInput[]
    NOT?: security_alertsWhereInput | security_alertsWhereInput[]
    id?: IntFilter<"security_alerts"> | number
    admin_id?: IntNullableFilter<"security_alerts"> | number | null
    alert_layer?: StringNullableFilter<"security_alerts"> | string | null
    severity?: StringNullableFilter<"security_alerts"> | string | null
    alert_type?: StringNullableFilter<"security_alerts"> | string | null
    description?: StringNullableFilter<"security_alerts"> | string | null
    ip_address?: StringNullableFilter<"security_alerts"> | string | null
    created_at?: DateTimeNullableFilter<"security_alerts"> | Date | string | null
  }

  export type security_alertsOrderByWithRelationInput = {
    id?: SortOrder
    admin_id?: SortOrderInput | SortOrder
    alert_layer?: SortOrderInput | SortOrder
    severity?: SortOrderInput | SortOrder
    alert_type?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    ip_address?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
  }

  export type security_alertsWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: security_alertsWhereInput | security_alertsWhereInput[]
    OR?: security_alertsWhereInput[]
    NOT?: security_alertsWhereInput | security_alertsWhereInput[]
    admin_id?: IntNullableFilter<"security_alerts"> | number | null
    alert_layer?: StringNullableFilter<"security_alerts"> | string | null
    severity?: StringNullableFilter<"security_alerts"> | string | null
    alert_type?: StringNullableFilter<"security_alerts"> | string | null
    description?: StringNullableFilter<"security_alerts"> | string | null
    ip_address?: StringNullableFilter<"security_alerts"> | string | null
    created_at?: DateTimeNullableFilter<"security_alerts"> | Date | string | null
  }, "id">

  export type security_alertsOrderByWithAggregationInput = {
    id?: SortOrder
    admin_id?: SortOrderInput | SortOrder
    alert_layer?: SortOrderInput | SortOrder
    severity?: SortOrderInput | SortOrder
    alert_type?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    ip_address?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    _count?: security_alertsCountOrderByAggregateInput
    _avg?: security_alertsAvgOrderByAggregateInput
    _max?: security_alertsMaxOrderByAggregateInput
    _min?: security_alertsMinOrderByAggregateInput
    _sum?: security_alertsSumOrderByAggregateInput
  }

  export type security_alertsScalarWhereWithAggregatesInput = {
    AND?: security_alertsScalarWhereWithAggregatesInput | security_alertsScalarWhereWithAggregatesInput[]
    OR?: security_alertsScalarWhereWithAggregatesInput[]
    NOT?: security_alertsScalarWhereWithAggregatesInput | security_alertsScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"security_alerts"> | number
    admin_id?: IntNullableWithAggregatesFilter<"security_alerts"> | number | null
    alert_layer?: StringNullableWithAggregatesFilter<"security_alerts"> | string | null
    severity?: StringNullableWithAggregatesFilter<"security_alerts"> | string | null
    alert_type?: StringNullableWithAggregatesFilter<"security_alerts"> | string | null
    description?: StringNullableWithAggregatesFilter<"security_alerts"> | string | null
    ip_address?: StringNullableWithAggregatesFilter<"security_alerts"> | string | null
    created_at?: DateTimeNullableWithAggregatesFilter<"security_alerts"> | Date | string | null
  }

  export type edit_requestsWhereInput = {
    AND?: edit_requestsWhereInput | edit_requestsWhereInput[]
    OR?: edit_requestsWhereInput[]
    NOT?: edit_requestsWhereInput | edit_requestsWhereInput[]
    id?: IntFilter<"edit_requests"> | number
    requested_by_admin_id?: IntFilter<"edit_requests"> | number
    approved_by_admin_id?: IntNullableFilter<"edit_requests"> | number | null
    module?: StringFilter<"edit_requests"> | string
    action?: StringFilter<"edit_requests"> | string
    target_identifier?: StringFilter<"edit_requests"> | string
    reason?: StringFilter<"edit_requests"> | string
    status?: StringFilter<"edit_requests"> | string
    approval_token?: StringNullableFilter<"edit_requests"> | string | null
    requested_at?: DateTimeFilter<"edit_requests"> | Date | string
    approved_at?: DateTimeNullableFilter<"edit_requests"> | Date | string | null
    expires_at?: DateTimeNullableFilter<"edit_requests"> | Date | string | null
    requester?: XOR<AdminsScalarRelationFilter, adminsWhereInput>
    approver?: XOR<AdminsNullableScalarRelationFilter, adminsWhereInput> | null
  }

  export type edit_requestsOrderByWithRelationInput = {
    id?: SortOrder
    requested_by_admin_id?: SortOrder
    approved_by_admin_id?: SortOrderInput | SortOrder
    module?: SortOrder
    action?: SortOrder
    target_identifier?: SortOrder
    reason?: SortOrder
    status?: SortOrder
    approval_token?: SortOrderInput | SortOrder
    requested_at?: SortOrder
    approved_at?: SortOrderInput | SortOrder
    expires_at?: SortOrderInput | SortOrder
    requester?: adminsOrderByWithRelationInput
    approver?: adminsOrderByWithRelationInput
  }

  export type edit_requestsWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    approval_token?: string
    AND?: edit_requestsWhereInput | edit_requestsWhereInput[]
    OR?: edit_requestsWhereInput[]
    NOT?: edit_requestsWhereInput | edit_requestsWhereInput[]
    requested_by_admin_id?: IntFilter<"edit_requests"> | number
    approved_by_admin_id?: IntNullableFilter<"edit_requests"> | number | null
    module?: StringFilter<"edit_requests"> | string
    action?: StringFilter<"edit_requests"> | string
    target_identifier?: StringFilter<"edit_requests"> | string
    reason?: StringFilter<"edit_requests"> | string
    status?: StringFilter<"edit_requests"> | string
    requested_at?: DateTimeFilter<"edit_requests"> | Date | string
    approved_at?: DateTimeNullableFilter<"edit_requests"> | Date | string | null
    expires_at?: DateTimeNullableFilter<"edit_requests"> | Date | string | null
    requester?: XOR<AdminsScalarRelationFilter, adminsWhereInput>
    approver?: XOR<AdminsNullableScalarRelationFilter, adminsWhereInput> | null
  }, "id" | "approval_token">

  export type edit_requestsOrderByWithAggregationInput = {
    id?: SortOrder
    requested_by_admin_id?: SortOrder
    approved_by_admin_id?: SortOrderInput | SortOrder
    module?: SortOrder
    action?: SortOrder
    target_identifier?: SortOrder
    reason?: SortOrder
    status?: SortOrder
    approval_token?: SortOrderInput | SortOrder
    requested_at?: SortOrder
    approved_at?: SortOrderInput | SortOrder
    expires_at?: SortOrderInput | SortOrder
    _count?: edit_requestsCountOrderByAggregateInput
    _avg?: edit_requestsAvgOrderByAggregateInput
    _max?: edit_requestsMaxOrderByAggregateInput
    _min?: edit_requestsMinOrderByAggregateInput
    _sum?: edit_requestsSumOrderByAggregateInput
  }

  export type edit_requestsScalarWhereWithAggregatesInput = {
    AND?: edit_requestsScalarWhereWithAggregatesInput | edit_requestsScalarWhereWithAggregatesInput[]
    OR?: edit_requestsScalarWhereWithAggregatesInput[]
    NOT?: edit_requestsScalarWhereWithAggregatesInput | edit_requestsScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"edit_requests"> | number
    requested_by_admin_id?: IntWithAggregatesFilter<"edit_requests"> | number
    approved_by_admin_id?: IntNullableWithAggregatesFilter<"edit_requests"> | number | null
    module?: StringWithAggregatesFilter<"edit_requests"> | string
    action?: StringWithAggregatesFilter<"edit_requests"> | string
    target_identifier?: StringWithAggregatesFilter<"edit_requests"> | string
    reason?: StringWithAggregatesFilter<"edit_requests"> | string
    status?: StringWithAggregatesFilter<"edit_requests"> | string
    approval_token?: StringNullableWithAggregatesFilter<"edit_requests"> | string | null
    requested_at?: DateTimeWithAggregatesFilter<"edit_requests"> | Date | string
    approved_at?: DateTimeNullableWithAggregatesFilter<"edit_requests"> | Date | string | null
    expires_at?: DateTimeNullableWithAggregatesFilter<"edit_requests"> | Date | string | null
  }

  export type temporary_permissionsWhereInput = {
    AND?: temporary_permissionsWhereInput | temporary_permissionsWhereInput[]
    OR?: temporary_permissionsWhereInput[]
    NOT?: temporary_permissionsWhereInput | temporary_permissionsWhereInput[]
    id?: IntFilter<"temporary_permissions"> | number
    admin_id?: IntFilter<"temporary_permissions"> | number
    module?: StringFilter<"temporary_permissions"> | string
    target_identifier?: StringFilter<"temporary_permissions"> | string
    approved_by?: IntFilter<"temporary_permissions"> | number
    expires_at?: DateTimeFilter<"temporary_permissions"> | Date | string
    created_at?: DateTimeFilter<"temporary_permissions"> | Date | string
    admin?: XOR<AdminsScalarRelationFilter, adminsWhereInput>
  }

  export type temporary_permissionsOrderByWithRelationInput = {
    id?: SortOrder
    admin_id?: SortOrder
    module?: SortOrder
    target_identifier?: SortOrder
    approved_by?: SortOrder
    expires_at?: SortOrder
    created_at?: SortOrder
    admin?: adminsOrderByWithRelationInput
  }

  export type temporary_permissionsWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    admin_id_module_target_identifier?: temporary_permissionsAdmin_idModuleTarget_identifierCompoundUniqueInput
    AND?: temporary_permissionsWhereInput | temporary_permissionsWhereInput[]
    OR?: temporary_permissionsWhereInput[]
    NOT?: temporary_permissionsWhereInput | temporary_permissionsWhereInput[]
    admin_id?: IntFilter<"temporary_permissions"> | number
    module?: StringFilter<"temporary_permissions"> | string
    target_identifier?: StringFilter<"temporary_permissions"> | string
    approved_by?: IntFilter<"temporary_permissions"> | number
    expires_at?: DateTimeFilter<"temporary_permissions"> | Date | string
    created_at?: DateTimeFilter<"temporary_permissions"> | Date | string
    admin?: XOR<AdminsScalarRelationFilter, adminsWhereInput>
  }, "id" | "admin_id_module_target_identifier">

  export type temporary_permissionsOrderByWithAggregationInput = {
    id?: SortOrder
    admin_id?: SortOrder
    module?: SortOrder
    target_identifier?: SortOrder
    approved_by?: SortOrder
    expires_at?: SortOrder
    created_at?: SortOrder
    _count?: temporary_permissionsCountOrderByAggregateInput
    _avg?: temporary_permissionsAvgOrderByAggregateInput
    _max?: temporary_permissionsMaxOrderByAggregateInput
    _min?: temporary_permissionsMinOrderByAggregateInput
    _sum?: temporary_permissionsSumOrderByAggregateInput
  }

  export type temporary_permissionsScalarWhereWithAggregatesInput = {
    AND?: temporary_permissionsScalarWhereWithAggregatesInput | temporary_permissionsScalarWhereWithAggregatesInput[]
    OR?: temporary_permissionsScalarWhereWithAggregatesInput[]
    NOT?: temporary_permissionsScalarWhereWithAggregatesInput | temporary_permissionsScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"temporary_permissions"> | number
    admin_id?: IntWithAggregatesFilter<"temporary_permissions"> | number
    module?: StringWithAggregatesFilter<"temporary_permissions"> | string
    target_identifier?: StringWithAggregatesFilter<"temporary_permissions"> | string
    approved_by?: IntWithAggregatesFilter<"temporary_permissions"> | number
    expires_at?: DateTimeWithAggregatesFilter<"temporary_permissions"> | Date | string
    created_at?: DateTimeWithAggregatesFilter<"temporary_permissions"> | Date | string
  }

  export type adminsCreateInput = {
    full_name: string
    email: string
    password_hash: string
    created_at?: Date | string | null
    role?: string
    phone_number?: string | null
    parent_admin_id?: number | null
    status?: string | null
    behavior_profiles?: behavior_profilesCreateNestedManyWithoutAdminsInput
    behavior_samples?: behavior_samplesCreateNestedManyWithoutAdminsInput
    devices?: devicesCreateNestedManyWithoutAdminsInput
    risk_events?: risk_eventsCreateNestedManyWithoutAdminsInput
    preferences?: admin_preferencesCreateNestedOneWithoutAdminInput
    edit_requests_requested?: edit_requestsCreateNestedManyWithoutRequesterInput
    edit_requests_approved?: edit_requestsCreateNestedManyWithoutApproverInput
    temporary_permissions?: temporary_permissionsCreateNestedManyWithoutAdminInput
  }

  export type adminsUncheckedCreateInput = {
    id?: number
    full_name: string
    email: string
    password_hash: string
    created_at?: Date | string | null
    role?: string
    phone_number?: string | null
    parent_admin_id?: number | null
    status?: string | null
    behavior_profiles?: behavior_profilesUncheckedCreateNestedManyWithoutAdminsInput
    behavior_samples?: behavior_samplesUncheckedCreateNestedManyWithoutAdminsInput
    devices?: devicesUncheckedCreateNestedManyWithoutAdminsInput
    risk_events?: risk_eventsUncheckedCreateNestedManyWithoutAdminsInput
    preferences?: admin_preferencesUncheckedCreateNestedOneWithoutAdminInput
    edit_requests_requested?: edit_requestsUncheckedCreateNestedManyWithoutRequesterInput
    edit_requests_approved?: edit_requestsUncheckedCreateNestedManyWithoutApproverInput
    temporary_permissions?: temporary_permissionsUncheckedCreateNestedManyWithoutAdminInput
  }

  export type adminsUpdateInput = {
    full_name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    role?: StringFieldUpdateOperationsInput | string
    phone_number?: NullableStringFieldUpdateOperationsInput | string | null
    parent_admin_id?: NullableIntFieldUpdateOperationsInput | number | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    behavior_profiles?: behavior_profilesUpdateManyWithoutAdminsNestedInput
    behavior_samples?: behavior_samplesUpdateManyWithoutAdminsNestedInput
    devices?: devicesUpdateManyWithoutAdminsNestedInput
    risk_events?: risk_eventsUpdateManyWithoutAdminsNestedInput
    preferences?: admin_preferencesUpdateOneWithoutAdminNestedInput
    edit_requests_requested?: edit_requestsUpdateManyWithoutRequesterNestedInput
    edit_requests_approved?: edit_requestsUpdateManyWithoutApproverNestedInput
    temporary_permissions?: temporary_permissionsUpdateManyWithoutAdminNestedInput
  }

  export type adminsUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    full_name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    role?: StringFieldUpdateOperationsInput | string
    phone_number?: NullableStringFieldUpdateOperationsInput | string | null
    parent_admin_id?: NullableIntFieldUpdateOperationsInput | number | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    behavior_profiles?: behavior_profilesUncheckedUpdateManyWithoutAdminsNestedInput
    behavior_samples?: behavior_samplesUncheckedUpdateManyWithoutAdminsNestedInput
    devices?: devicesUncheckedUpdateManyWithoutAdminsNestedInput
    risk_events?: risk_eventsUncheckedUpdateManyWithoutAdminsNestedInput
    preferences?: admin_preferencesUncheckedUpdateOneWithoutAdminNestedInput
    edit_requests_requested?: edit_requestsUncheckedUpdateManyWithoutRequesterNestedInput
    edit_requests_approved?: edit_requestsUncheckedUpdateManyWithoutApproverNestedInput
    temporary_permissions?: temporary_permissionsUncheckedUpdateManyWithoutAdminNestedInput
  }

  export type adminsCreateManyInput = {
    id?: number
    full_name: string
    email: string
    password_hash: string
    created_at?: Date | string | null
    role?: string
    phone_number?: string | null
    parent_admin_id?: number | null
    status?: string | null
  }

  export type adminsUpdateManyMutationInput = {
    full_name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    role?: StringFieldUpdateOperationsInput | string
    phone_number?: NullableStringFieldUpdateOperationsInput | string | null
    parent_admin_id?: NullableIntFieldUpdateOperationsInput | number | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type adminsUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    full_name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    role?: StringFieldUpdateOperationsInput | string
    phone_number?: NullableStringFieldUpdateOperationsInput | string | null
    parent_admin_id?: NullableIntFieldUpdateOperationsInput | number | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type admin_preferencesCreateInput = {
    language?: string
    theme?: string
    date_format?: string
    time_format?: string
    default_dashboard?: string
    created_at?: Date | string
    updated_at?: Date | string
    admin: adminsCreateNestedOneWithoutPreferencesInput
  }

  export type admin_preferencesUncheckedCreateInput = {
    id?: number
    admin_id: number
    language?: string
    theme?: string
    date_format?: string
    time_format?: string
    default_dashboard?: string
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type admin_preferencesUpdateInput = {
    language?: StringFieldUpdateOperationsInput | string
    theme?: StringFieldUpdateOperationsInput | string
    date_format?: StringFieldUpdateOperationsInput | string
    time_format?: StringFieldUpdateOperationsInput | string
    default_dashboard?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    admin?: adminsUpdateOneRequiredWithoutPreferencesNestedInput
  }

  export type admin_preferencesUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    admin_id?: IntFieldUpdateOperationsInput | number
    language?: StringFieldUpdateOperationsInput | string
    theme?: StringFieldUpdateOperationsInput | string
    date_format?: StringFieldUpdateOperationsInput | string
    time_format?: StringFieldUpdateOperationsInput | string
    default_dashboard?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type admin_preferencesCreateManyInput = {
    id?: number
    admin_id: number
    language?: string
    theme?: string
    date_format?: string
    time_format?: string
    default_dashboard?: string
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type admin_preferencesUpdateManyMutationInput = {
    language?: StringFieldUpdateOperationsInput | string
    theme?: StringFieldUpdateOperationsInput | string
    date_format?: StringFieldUpdateOperationsInput | string
    time_format?: StringFieldUpdateOperationsInput | string
    default_dashboard?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type admin_preferencesUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    admin_id?: IntFieldUpdateOperationsInput | number
    language?: StringFieldUpdateOperationsInput | string
    theme?: StringFieldUpdateOperationsInput | string
    date_format?: StringFieldUpdateOperationsInput | string
    time_format?: StringFieldUpdateOperationsInput | string
    default_dashboard?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type audit_logsCreateInput = {
    admin_id?: number | null
    event_type: string
    event_description?: string | null
    ip_address?: string | null
    created_at?: Date | string | null
  }

  export type audit_logsUncheckedCreateInput = {
    id?: number
    admin_id?: number | null
    event_type: string
    event_description?: string | null
    ip_address?: string | null
    created_at?: Date | string | null
  }

  export type audit_logsUpdateInput = {
    admin_id?: NullableIntFieldUpdateOperationsInput | number | null
    event_type?: StringFieldUpdateOperationsInput | string
    event_description?: NullableStringFieldUpdateOperationsInput | string | null
    ip_address?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type audit_logsUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    admin_id?: NullableIntFieldUpdateOperationsInput | number | null
    event_type?: StringFieldUpdateOperationsInput | string
    event_description?: NullableStringFieldUpdateOperationsInput | string | null
    ip_address?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type audit_logsCreateManyInput = {
    id?: number
    admin_id?: number | null
    event_type: string
    event_description?: string | null
    ip_address?: string | null
    created_at?: Date | string | null
  }

  export type audit_logsUpdateManyMutationInput = {
    admin_id?: NullableIntFieldUpdateOperationsInput | number | null
    event_type?: StringFieldUpdateOperationsInput | string
    event_description?: NullableStringFieldUpdateOperationsInput | string | null
    ip_address?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type audit_logsUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    admin_id?: NullableIntFieldUpdateOperationsInput | number | null
    event_type?: StringFieldUpdateOperationsInput | string
    event_description?: NullableStringFieldUpdateOperationsInput | string | null
    ip_address?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type behavior_profilesCreateInput = {
    enrollment_phrase: string
    avg_dwell_time?: Decimal | DecimalJsLike | number | string | null
    avg_flight_time?: Decimal | DecimalJsLike | number | string | null
    avg_typing_speed?: Decimal | DecimalJsLike | number | string | null
    avg_backspace_usage?: Decimal | DecimalJsLike | number | string | null
    avg_error_rate?: Decimal | DecimalJsLike | number | string | null
    created_at?: Date | string | null
    admins: adminsCreateNestedOneWithoutBehavior_profilesInput
  }

  export type behavior_profilesUncheckedCreateInput = {
    id?: number
    admin_id: number
    enrollment_phrase: string
    avg_dwell_time?: Decimal | DecimalJsLike | number | string | null
    avg_flight_time?: Decimal | DecimalJsLike | number | string | null
    avg_typing_speed?: Decimal | DecimalJsLike | number | string | null
    avg_backspace_usage?: Decimal | DecimalJsLike | number | string | null
    avg_error_rate?: Decimal | DecimalJsLike | number | string | null
    created_at?: Date | string | null
  }

  export type behavior_profilesUpdateInput = {
    enrollment_phrase?: StringFieldUpdateOperationsInput | string
    avg_dwell_time?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    avg_flight_time?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    avg_typing_speed?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    avg_backspace_usage?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    avg_error_rate?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    admins?: adminsUpdateOneRequiredWithoutBehavior_profilesNestedInput
  }

  export type behavior_profilesUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    admin_id?: IntFieldUpdateOperationsInput | number
    enrollment_phrase?: StringFieldUpdateOperationsInput | string
    avg_dwell_time?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    avg_flight_time?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    avg_typing_speed?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    avg_backspace_usage?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    avg_error_rate?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type behavior_profilesCreateManyInput = {
    id?: number
    admin_id: number
    enrollment_phrase: string
    avg_dwell_time?: Decimal | DecimalJsLike | number | string | null
    avg_flight_time?: Decimal | DecimalJsLike | number | string | null
    avg_typing_speed?: Decimal | DecimalJsLike | number | string | null
    avg_backspace_usage?: Decimal | DecimalJsLike | number | string | null
    avg_error_rate?: Decimal | DecimalJsLike | number | string | null
    created_at?: Date | string | null
  }

  export type behavior_profilesUpdateManyMutationInput = {
    enrollment_phrase?: StringFieldUpdateOperationsInput | string
    avg_dwell_time?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    avg_flight_time?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    avg_typing_speed?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    avg_backspace_usage?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    avg_error_rate?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type behavior_profilesUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    admin_id?: IntFieldUpdateOperationsInput | number
    enrollment_phrase?: StringFieldUpdateOperationsInput | string
    avg_dwell_time?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    avg_flight_time?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    avg_typing_speed?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    avg_backspace_usage?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    avg_error_rate?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type behavior_samplesCreateInput = {
    dwell_time?: Decimal | DecimalJsLike | number | string | null
    flight_time?: Decimal | DecimalJsLike | number | string | null
    typing_speed?: Decimal | DecimalJsLike | number | string | null
    backspace_usage?: Decimal | DecimalJsLike | number | string | null
    error_rate?: Decimal | DecimalJsLike | number | string | null
    similarity_score?: Decimal | DecimalJsLike | number | string | null
    verification_result?: string | null
    created_at?: Date | string | null
    sample_type?: string | null
    admins: adminsCreateNestedOneWithoutBehavior_samplesInput
  }

  export type behavior_samplesUncheckedCreateInput = {
    id?: number
    admin_id: number
    dwell_time?: Decimal | DecimalJsLike | number | string | null
    flight_time?: Decimal | DecimalJsLike | number | string | null
    typing_speed?: Decimal | DecimalJsLike | number | string | null
    backspace_usage?: Decimal | DecimalJsLike | number | string | null
    error_rate?: Decimal | DecimalJsLike | number | string | null
    similarity_score?: Decimal | DecimalJsLike | number | string | null
    verification_result?: string | null
    created_at?: Date | string | null
    sample_type?: string | null
  }

  export type behavior_samplesUpdateInput = {
    dwell_time?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    flight_time?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    typing_speed?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    backspace_usage?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    error_rate?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    similarity_score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    verification_result?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sample_type?: NullableStringFieldUpdateOperationsInput | string | null
    admins?: adminsUpdateOneRequiredWithoutBehavior_samplesNestedInput
  }

  export type behavior_samplesUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    admin_id?: IntFieldUpdateOperationsInput | number
    dwell_time?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    flight_time?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    typing_speed?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    backspace_usage?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    error_rate?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    similarity_score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    verification_result?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sample_type?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type behavior_samplesCreateManyInput = {
    id?: number
    admin_id: number
    dwell_time?: Decimal | DecimalJsLike | number | string | null
    flight_time?: Decimal | DecimalJsLike | number | string | null
    typing_speed?: Decimal | DecimalJsLike | number | string | null
    backspace_usage?: Decimal | DecimalJsLike | number | string | null
    error_rate?: Decimal | DecimalJsLike | number | string | null
    similarity_score?: Decimal | DecimalJsLike | number | string | null
    verification_result?: string | null
    created_at?: Date | string | null
    sample_type?: string | null
  }

  export type behavior_samplesUpdateManyMutationInput = {
    dwell_time?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    flight_time?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    typing_speed?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    backspace_usage?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    error_rate?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    similarity_score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    verification_result?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sample_type?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type behavior_samplesUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    admin_id?: IntFieldUpdateOperationsInput | number
    dwell_time?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    flight_time?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    typing_speed?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    backspace_usage?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    error_rate?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    similarity_score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    verification_result?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sample_type?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type devicesCreateInput = {
    device_fingerprint: string
    device_name?: string | null
    trust_score?: number | null
    status?: string | null
    registration_token_hash?: string | null
    token_expires_at?: Date | string | null
    first_seen?: Date | string | null
    last_seen?: Date | string | null
    created_at?: Date | string | null
    admins: adminsCreateNestedOneWithoutDevicesInput
  }

  export type devicesUncheckedCreateInput = {
    id?: number
    admin_id: number
    device_fingerprint: string
    device_name?: string | null
    trust_score?: number | null
    status?: string | null
    registration_token_hash?: string | null
    token_expires_at?: Date | string | null
    first_seen?: Date | string | null
    last_seen?: Date | string | null
    created_at?: Date | string | null
  }

  export type devicesUpdateInput = {
    device_fingerprint?: StringFieldUpdateOperationsInput | string
    device_name?: NullableStringFieldUpdateOperationsInput | string | null
    trust_score?: NullableIntFieldUpdateOperationsInput | number | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    registration_token_hash?: NullableStringFieldUpdateOperationsInput | string | null
    token_expires_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    first_seen?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    last_seen?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    admins?: adminsUpdateOneRequiredWithoutDevicesNestedInput
  }

  export type devicesUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    admin_id?: IntFieldUpdateOperationsInput | number
    device_fingerprint?: StringFieldUpdateOperationsInput | string
    device_name?: NullableStringFieldUpdateOperationsInput | string | null
    trust_score?: NullableIntFieldUpdateOperationsInput | number | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    registration_token_hash?: NullableStringFieldUpdateOperationsInput | string | null
    token_expires_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    first_seen?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    last_seen?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type devicesCreateManyInput = {
    id?: number
    admin_id: number
    device_fingerprint: string
    device_name?: string | null
    trust_score?: number | null
    status?: string | null
    registration_token_hash?: string | null
    token_expires_at?: Date | string | null
    first_seen?: Date | string | null
    last_seen?: Date | string | null
    created_at?: Date | string | null
  }

  export type devicesUpdateManyMutationInput = {
    device_fingerprint?: StringFieldUpdateOperationsInput | string
    device_name?: NullableStringFieldUpdateOperationsInput | string | null
    trust_score?: NullableIntFieldUpdateOperationsInput | number | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    registration_token_hash?: NullableStringFieldUpdateOperationsInput | string | null
    token_expires_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    first_seen?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    last_seen?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type devicesUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    admin_id?: IntFieldUpdateOperationsInput | number
    device_fingerprint?: StringFieldUpdateOperationsInput | string
    device_name?: NullableStringFieldUpdateOperationsInput | string | null
    trust_score?: NullableIntFieldUpdateOperationsInput | number | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    registration_token_hash?: NullableStringFieldUpdateOperationsInput | string | null
    token_expires_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    first_seen?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    last_seen?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type risk_eventsCreateInput = {
    identity_score?: Decimal | DecimalJsLike | number | string | null
    device_score?: Decimal | DecimalJsLike | number | string | null
    behavior_score?: Decimal | DecimalJsLike | number | string | null
    overall_risk_score?: Decimal | DecimalJsLike | number | string | null
    decision?: string | null
    created_at?: Date | string | null
    admins?: adminsCreateNestedOneWithoutRisk_eventsInput
  }

  export type risk_eventsUncheckedCreateInput = {
    id?: number
    admin_id?: number | null
    identity_score?: Decimal | DecimalJsLike | number | string | null
    device_score?: Decimal | DecimalJsLike | number | string | null
    behavior_score?: Decimal | DecimalJsLike | number | string | null
    overall_risk_score?: Decimal | DecimalJsLike | number | string | null
    decision?: string | null
    created_at?: Date | string | null
  }

  export type risk_eventsUpdateInput = {
    identity_score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    device_score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    behavior_score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    overall_risk_score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    decision?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    admins?: adminsUpdateOneWithoutRisk_eventsNestedInput
  }

  export type risk_eventsUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    admin_id?: NullableIntFieldUpdateOperationsInput | number | null
    identity_score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    device_score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    behavior_score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    overall_risk_score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    decision?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type risk_eventsCreateManyInput = {
    id?: number
    admin_id?: number | null
    identity_score?: Decimal | DecimalJsLike | number | string | null
    device_score?: Decimal | DecimalJsLike | number | string | null
    behavior_score?: Decimal | DecimalJsLike | number | string | null
    overall_risk_score?: Decimal | DecimalJsLike | number | string | null
    decision?: string | null
    created_at?: Date | string | null
  }

  export type risk_eventsUpdateManyMutationInput = {
    identity_score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    device_score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    behavior_score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    overall_risk_score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    decision?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type risk_eventsUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    admin_id?: NullableIntFieldUpdateOperationsInput | number | null
    identity_score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    device_score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    behavior_score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    overall_risk_score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    decision?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type security_alertsCreateInput = {
    admin_id?: number | null
    alert_layer?: string | null
    severity?: string | null
    alert_type?: string | null
    description?: string | null
    ip_address?: string | null
    created_at?: Date | string | null
  }

  export type security_alertsUncheckedCreateInput = {
    id?: number
    admin_id?: number | null
    alert_layer?: string | null
    severity?: string | null
    alert_type?: string | null
    description?: string | null
    ip_address?: string | null
    created_at?: Date | string | null
  }

  export type security_alertsUpdateInput = {
    admin_id?: NullableIntFieldUpdateOperationsInput | number | null
    alert_layer?: NullableStringFieldUpdateOperationsInput | string | null
    severity?: NullableStringFieldUpdateOperationsInput | string | null
    alert_type?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    ip_address?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type security_alertsUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    admin_id?: NullableIntFieldUpdateOperationsInput | number | null
    alert_layer?: NullableStringFieldUpdateOperationsInput | string | null
    severity?: NullableStringFieldUpdateOperationsInput | string | null
    alert_type?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    ip_address?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type security_alertsCreateManyInput = {
    id?: number
    admin_id?: number | null
    alert_layer?: string | null
    severity?: string | null
    alert_type?: string | null
    description?: string | null
    ip_address?: string | null
    created_at?: Date | string | null
  }

  export type security_alertsUpdateManyMutationInput = {
    admin_id?: NullableIntFieldUpdateOperationsInput | number | null
    alert_layer?: NullableStringFieldUpdateOperationsInput | string | null
    severity?: NullableStringFieldUpdateOperationsInput | string | null
    alert_type?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    ip_address?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type security_alertsUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    admin_id?: NullableIntFieldUpdateOperationsInput | number | null
    alert_layer?: NullableStringFieldUpdateOperationsInput | string | null
    severity?: NullableStringFieldUpdateOperationsInput | string | null
    alert_type?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    ip_address?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type edit_requestsCreateInput = {
    module: string
    action: string
    target_identifier: string
    reason: string
    status?: string
    approval_token?: string | null
    requested_at?: Date | string
    approved_at?: Date | string | null
    expires_at?: Date | string | null
    requester: adminsCreateNestedOneWithoutEdit_requests_requestedInput
    approver?: adminsCreateNestedOneWithoutEdit_requests_approvedInput
  }

  export type edit_requestsUncheckedCreateInput = {
    id?: number
    requested_by_admin_id: number
    approved_by_admin_id?: number | null
    module: string
    action: string
    target_identifier: string
    reason: string
    status?: string
    approval_token?: string | null
    requested_at?: Date | string
    approved_at?: Date | string | null
    expires_at?: Date | string | null
  }

  export type edit_requestsUpdateInput = {
    module?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    target_identifier?: StringFieldUpdateOperationsInput | string
    reason?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    approval_token?: NullableStringFieldUpdateOperationsInput | string | null
    requested_at?: DateTimeFieldUpdateOperationsInput | Date | string
    approved_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expires_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    requester?: adminsUpdateOneRequiredWithoutEdit_requests_requestedNestedInput
    approver?: adminsUpdateOneWithoutEdit_requests_approvedNestedInput
  }

  export type edit_requestsUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    requested_by_admin_id?: IntFieldUpdateOperationsInput | number
    approved_by_admin_id?: NullableIntFieldUpdateOperationsInput | number | null
    module?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    target_identifier?: StringFieldUpdateOperationsInput | string
    reason?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    approval_token?: NullableStringFieldUpdateOperationsInput | string | null
    requested_at?: DateTimeFieldUpdateOperationsInput | Date | string
    approved_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expires_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type edit_requestsCreateManyInput = {
    id?: number
    requested_by_admin_id: number
    approved_by_admin_id?: number | null
    module: string
    action: string
    target_identifier: string
    reason: string
    status?: string
    approval_token?: string | null
    requested_at?: Date | string
    approved_at?: Date | string | null
    expires_at?: Date | string | null
  }

  export type edit_requestsUpdateManyMutationInput = {
    module?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    target_identifier?: StringFieldUpdateOperationsInput | string
    reason?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    approval_token?: NullableStringFieldUpdateOperationsInput | string | null
    requested_at?: DateTimeFieldUpdateOperationsInput | Date | string
    approved_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expires_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type edit_requestsUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    requested_by_admin_id?: IntFieldUpdateOperationsInput | number
    approved_by_admin_id?: NullableIntFieldUpdateOperationsInput | number | null
    module?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    target_identifier?: StringFieldUpdateOperationsInput | string
    reason?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    approval_token?: NullableStringFieldUpdateOperationsInput | string | null
    requested_at?: DateTimeFieldUpdateOperationsInput | Date | string
    approved_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expires_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type temporary_permissionsCreateInput = {
    module: string
    target_identifier: string
    approved_by: number
    expires_at: Date | string
    created_at?: Date | string
    admin: adminsCreateNestedOneWithoutTemporary_permissionsInput
  }

  export type temporary_permissionsUncheckedCreateInput = {
    id?: number
    admin_id: number
    module: string
    target_identifier: string
    approved_by: number
    expires_at: Date | string
    created_at?: Date | string
  }

  export type temporary_permissionsUpdateInput = {
    module?: StringFieldUpdateOperationsInput | string
    target_identifier?: StringFieldUpdateOperationsInput | string
    approved_by?: IntFieldUpdateOperationsInput | number
    expires_at?: DateTimeFieldUpdateOperationsInput | Date | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    admin?: adminsUpdateOneRequiredWithoutTemporary_permissionsNestedInput
  }

  export type temporary_permissionsUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    admin_id?: IntFieldUpdateOperationsInput | number
    module?: StringFieldUpdateOperationsInput | string
    target_identifier?: StringFieldUpdateOperationsInput | string
    approved_by?: IntFieldUpdateOperationsInput | number
    expires_at?: DateTimeFieldUpdateOperationsInput | Date | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type temporary_permissionsCreateManyInput = {
    id?: number
    admin_id: number
    module: string
    target_identifier: string
    approved_by: number
    expires_at: Date | string
    created_at?: Date | string
  }

  export type temporary_permissionsUpdateManyMutationInput = {
    module?: StringFieldUpdateOperationsInput | string
    target_identifier?: StringFieldUpdateOperationsInput | string
    approved_by?: IntFieldUpdateOperationsInput | number
    expires_at?: DateTimeFieldUpdateOperationsInput | Date | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type temporary_permissionsUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    admin_id?: IntFieldUpdateOperationsInput | number
    module?: StringFieldUpdateOperationsInput | string
    target_identifier?: StringFieldUpdateOperationsInput | string
    approved_by?: IntFieldUpdateOperationsInput | number
    expires_at?: DateTimeFieldUpdateOperationsInput | Date | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
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

  export type Behavior_profilesListRelationFilter = {
    every?: behavior_profilesWhereInput
    some?: behavior_profilesWhereInput
    none?: behavior_profilesWhereInput
  }

  export type Behavior_samplesListRelationFilter = {
    every?: behavior_samplesWhereInput
    some?: behavior_samplesWhereInput
    none?: behavior_samplesWhereInput
  }

  export type DevicesListRelationFilter = {
    every?: devicesWhereInput
    some?: devicesWhereInput
    none?: devicesWhereInput
  }

  export type Risk_eventsListRelationFilter = {
    every?: risk_eventsWhereInput
    some?: risk_eventsWhereInput
    none?: risk_eventsWhereInput
  }

  export type Admin_preferencesNullableScalarRelationFilter = {
    is?: admin_preferencesWhereInput | null
    isNot?: admin_preferencesWhereInput | null
  }

  export type Edit_requestsListRelationFilter = {
    every?: edit_requestsWhereInput
    some?: edit_requestsWhereInput
    none?: edit_requestsWhereInput
  }

  export type Temporary_permissionsListRelationFilter = {
    every?: temporary_permissionsWhereInput
    some?: temporary_permissionsWhereInput
    none?: temporary_permissionsWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type behavior_profilesOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type behavior_samplesOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type devicesOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type risk_eventsOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type edit_requestsOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type temporary_permissionsOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type adminsCountOrderByAggregateInput = {
    id?: SortOrder
    full_name?: SortOrder
    email?: SortOrder
    password_hash?: SortOrder
    created_at?: SortOrder
    role?: SortOrder
    phone_number?: SortOrder
    parent_admin_id?: SortOrder
    status?: SortOrder
  }

  export type adminsAvgOrderByAggregateInput = {
    id?: SortOrder
    parent_admin_id?: SortOrder
  }

  export type adminsMaxOrderByAggregateInput = {
    id?: SortOrder
    full_name?: SortOrder
    email?: SortOrder
    password_hash?: SortOrder
    created_at?: SortOrder
    role?: SortOrder
    phone_number?: SortOrder
    parent_admin_id?: SortOrder
    status?: SortOrder
  }

  export type adminsMinOrderByAggregateInput = {
    id?: SortOrder
    full_name?: SortOrder
    email?: SortOrder
    password_hash?: SortOrder
    created_at?: SortOrder
    role?: SortOrder
    phone_number?: SortOrder
    parent_admin_id?: SortOrder
    status?: SortOrder
  }

  export type adminsSumOrderByAggregateInput = {
    id?: SortOrder
    parent_admin_id?: SortOrder
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

  export type AdminsScalarRelationFilter = {
    is?: adminsWhereInput
    isNot?: adminsWhereInput
  }

  export type admin_preferencesCountOrderByAggregateInput = {
    id?: SortOrder
    admin_id?: SortOrder
    language?: SortOrder
    theme?: SortOrder
    date_format?: SortOrder
    time_format?: SortOrder
    default_dashboard?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type admin_preferencesAvgOrderByAggregateInput = {
    id?: SortOrder
    admin_id?: SortOrder
  }

  export type admin_preferencesMaxOrderByAggregateInput = {
    id?: SortOrder
    admin_id?: SortOrder
    language?: SortOrder
    theme?: SortOrder
    date_format?: SortOrder
    time_format?: SortOrder
    default_dashboard?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type admin_preferencesMinOrderByAggregateInput = {
    id?: SortOrder
    admin_id?: SortOrder
    language?: SortOrder
    theme?: SortOrder
    date_format?: SortOrder
    time_format?: SortOrder
    default_dashboard?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type admin_preferencesSumOrderByAggregateInput = {
    id?: SortOrder
    admin_id?: SortOrder
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

  export type audit_logsCountOrderByAggregateInput = {
    id?: SortOrder
    admin_id?: SortOrder
    event_type?: SortOrder
    event_description?: SortOrder
    ip_address?: SortOrder
    created_at?: SortOrder
  }

  export type audit_logsAvgOrderByAggregateInput = {
    id?: SortOrder
    admin_id?: SortOrder
  }

  export type audit_logsMaxOrderByAggregateInput = {
    id?: SortOrder
    admin_id?: SortOrder
    event_type?: SortOrder
    event_description?: SortOrder
    ip_address?: SortOrder
    created_at?: SortOrder
  }

  export type audit_logsMinOrderByAggregateInput = {
    id?: SortOrder
    admin_id?: SortOrder
    event_type?: SortOrder
    event_description?: SortOrder
    ip_address?: SortOrder
    created_at?: SortOrder
  }

  export type audit_logsSumOrderByAggregateInput = {
    id?: SortOrder
    admin_id?: SortOrder
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

  export type behavior_profilesCountOrderByAggregateInput = {
    id?: SortOrder
    admin_id?: SortOrder
    enrollment_phrase?: SortOrder
    avg_dwell_time?: SortOrder
    avg_flight_time?: SortOrder
    avg_typing_speed?: SortOrder
    avg_backspace_usage?: SortOrder
    avg_error_rate?: SortOrder
    created_at?: SortOrder
  }

  export type behavior_profilesAvgOrderByAggregateInput = {
    id?: SortOrder
    admin_id?: SortOrder
    avg_dwell_time?: SortOrder
    avg_flight_time?: SortOrder
    avg_typing_speed?: SortOrder
    avg_backspace_usage?: SortOrder
    avg_error_rate?: SortOrder
  }

  export type behavior_profilesMaxOrderByAggregateInput = {
    id?: SortOrder
    admin_id?: SortOrder
    enrollment_phrase?: SortOrder
    avg_dwell_time?: SortOrder
    avg_flight_time?: SortOrder
    avg_typing_speed?: SortOrder
    avg_backspace_usage?: SortOrder
    avg_error_rate?: SortOrder
    created_at?: SortOrder
  }

  export type behavior_profilesMinOrderByAggregateInput = {
    id?: SortOrder
    admin_id?: SortOrder
    enrollment_phrase?: SortOrder
    avg_dwell_time?: SortOrder
    avg_flight_time?: SortOrder
    avg_typing_speed?: SortOrder
    avg_backspace_usage?: SortOrder
    avg_error_rate?: SortOrder
    created_at?: SortOrder
  }

  export type behavior_profilesSumOrderByAggregateInput = {
    id?: SortOrder
    admin_id?: SortOrder
    avg_dwell_time?: SortOrder
    avg_flight_time?: SortOrder
    avg_typing_speed?: SortOrder
    avg_backspace_usage?: SortOrder
    avg_error_rate?: SortOrder
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

  export type behavior_samplesCountOrderByAggregateInput = {
    id?: SortOrder
    admin_id?: SortOrder
    dwell_time?: SortOrder
    flight_time?: SortOrder
    typing_speed?: SortOrder
    backspace_usage?: SortOrder
    error_rate?: SortOrder
    similarity_score?: SortOrder
    verification_result?: SortOrder
    created_at?: SortOrder
    sample_type?: SortOrder
  }

  export type behavior_samplesAvgOrderByAggregateInput = {
    id?: SortOrder
    admin_id?: SortOrder
    dwell_time?: SortOrder
    flight_time?: SortOrder
    typing_speed?: SortOrder
    backspace_usage?: SortOrder
    error_rate?: SortOrder
    similarity_score?: SortOrder
  }

  export type behavior_samplesMaxOrderByAggregateInput = {
    id?: SortOrder
    admin_id?: SortOrder
    dwell_time?: SortOrder
    flight_time?: SortOrder
    typing_speed?: SortOrder
    backspace_usage?: SortOrder
    error_rate?: SortOrder
    similarity_score?: SortOrder
    verification_result?: SortOrder
    created_at?: SortOrder
    sample_type?: SortOrder
  }

  export type behavior_samplesMinOrderByAggregateInput = {
    id?: SortOrder
    admin_id?: SortOrder
    dwell_time?: SortOrder
    flight_time?: SortOrder
    typing_speed?: SortOrder
    backspace_usage?: SortOrder
    error_rate?: SortOrder
    similarity_score?: SortOrder
    verification_result?: SortOrder
    created_at?: SortOrder
    sample_type?: SortOrder
  }

  export type behavior_samplesSumOrderByAggregateInput = {
    id?: SortOrder
    admin_id?: SortOrder
    dwell_time?: SortOrder
    flight_time?: SortOrder
    typing_speed?: SortOrder
    backspace_usage?: SortOrder
    error_rate?: SortOrder
    similarity_score?: SortOrder
  }

  export type devicesCountOrderByAggregateInput = {
    id?: SortOrder
    admin_id?: SortOrder
    device_fingerprint?: SortOrder
    device_name?: SortOrder
    trust_score?: SortOrder
    status?: SortOrder
    registration_token_hash?: SortOrder
    token_expires_at?: SortOrder
    first_seen?: SortOrder
    last_seen?: SortOrder
    created_at?: SortOrder
  }

  export type devicesAvgOrderByAggregateInput = {
    id?: SortOrder
    admin_id?: SortOrder
    trust_score?: SortOrder
  }

  export type devicesMaxOrderByAggregateInput = {
    id?: SortOrder
    admin_id?: SortOrder
    device_fingerprint?: SortOrder
    device_name?: SortOrder
    trust_score?: SortOrder
    status?: SortOrder
    registration_token_hash?: SortOrder
    token_expires_at?: SortOrder
    first_seen?: SortOrder
    last_seen?: SortOrder
    created_at?: SortOrder
  }

  export type devicesMinOrderByAggregateInput = {
    id?: SortOrder
    admin_id?: SortOrder
    device_fingerprint?: SortOrder
    device_name?: SortOrder
    trust_score?: SortOrder
    status?: SortOrder
    registration_token_hash?: SortOrder
    token_expires_at?: SortOrder
    first_seen?: SortOrder
    last_seen?: SortOrder
    created_at?: SortOrder
  }

  export type devicesSumOrderByAggregateInput = {
    id?: SortOrder
    admin_id?: SortOrder
    trust_score?: SortOrder
  }

  export type AdminsNullableScalarRelationFilter = {
    is?: adminsWhereInput | null
    isNot?: adminsWhereInput | null
  }

  export type risk_eventsCountOrderByAggregateInput = {
    id?: SortOrder
    admin_id?: SortOrder
    identity_score?: SortOrder
    device_score?: SortOrder
    behavior_score?: SortOrder
    overall_risk_score?: SortOrder
    decision?: SortOrder
    created_at?: SortOrder
  }

  export type risk_eventsAvgOrderByAggregateInput = {
    id?: SortOrder
    admin_id?: SortOrder
    identity_score?: SortOrder
    device_score?: SortOrder
    behavior_score?: SortOrder
    overall_risk_score?: SortOrder
  }

  export type risk_eventsMaxOrderByAggregateInput = {
    id?: SortOrder
    admin_id?: SortOrder
    identity_score?: SortOrder
    device_score?: SortOrder
    behavior_score?: SortOrder
    overall_risk_score?: SortOrder
    decision?: SortOrder
    created_at?: SortOrder
  }

  export type risk_eventsMinOrderByAggregateInput = {
    id?: SortOrder
    admin_id?: SortOrder
    identity_score?: SortOrder
    device_score?: SortOrder
    behavior_score?: SortOrder
    overall_risk_score?: SortOrder
    decision?: SortOrder
    created_at?: SortOrder
  }

  export type risk_eventsSumOrderByAggregateInput = {
    id?: SortOrder
    admin_id?: SortOrder
    identity_score?: SortOrder
    device_score?: SortOrder
    behavior_score?: SortOrder
    overall_risk_score?: SortOrder
  }

  export type security_alertsCountOrderByAggregateInput = {
    id?: SortOrder
    admin_id?: SortOrder
    alert_layer?: SortOrder
    severity?: SortOrder
    alert_type?: SortOrder
    description?: SortOrder
    ip_address?: SortOrder
    created_at?: SortOrder
  }

  export type security_alertsAvgOrderByAggregateInput = {
    id?: SortOrder
    admin_id?: SortOrder
  }

  export type security_alertsMaxOrderByAggregateInput = {
    id?: SortOrder
    admin_id?: SortOrder
    alert_layer?: SortOrder
    severity?: SortOrder
    alert_type?: SortOrder
    description?: SortOrder
    ip_address?: SortOrder
    created_at?: SortOrder
  }

  export type security_alertsMinOrderByAggregateInput = {
    id?: SortOrder
    admin_id?: SortOrder
    alert_layer?: SortOrder
    severity?: SortOrder
    alert_type?: SortOrder
    description?: SortOrder
    ip_address?: SortOrder
    created_at?: SortOrder
  }

  export type security_alertsSumOrderByAggregateInput = {
    id?: SortOrder
    admin_id?: SortOrder
  }

  export type edit_requestsCountOrderByAggregateInput = {
    id?: SortOrder
    requested_by_admin_id?: SortOrder
    approved_by_admin_id?: SortOrder
    module?: SortOrder
    action?: SortOrder
    target_identifier?: SortOrder
    reason?: SortOrder
    status?: SortOrder
    approval_token?: SortOrder
    requested_at?: SortOrder
    approved_at?: SortOrder
    expires_at?: SortOrder
  }

  export type edit_requestsAvgOrderByAggregateInput = {
    id?: SortOrder
    requested_by_admin_id?: SortOrder
    approved_by_admin_id?: SortOrder
  }

  export type edit_requestsMaxOrderByAggregateInput = {
    id?: SortOrder
    requested_by_admin_id?: SortOrder
    approved_by_admin_id?: SortOrder
    module?: SortOrder
    action?: SortOrder
    target_identifier?: SortOrder
    reason?: SortOrder
    status?: SortOrder
    approval_token?: SortOrder
    requested_at?: SortOrder
    approved_at?: SortOrder
    expires_at?: SortOrder
  }

  export type edit_requestsMinOrderByAggregateInput = {
    id?: SortOrder
    requested_by_admin_id?: SortOrder
    approved_by_admin_id?: SortOrder
    module?: SortOrder
    action?: SortOrder
    target_identifier?: SortOrder
    reason?: SortOrder
    status?: SortOrder
    approval_token?: SortOrder
    requested_at?: SortOrder
    approved_at?: SortOrder
    expires_at?: SortOrder
  }

  export type edit_requestsSumOrderByAggregateInput = {
    id?: SortOrder
    requested_by_admin_id?: SortOrder
    approved_by_admin_id?: SortOrder
  }

  export type temporary_permissionsAdmin_idModuleTarget_identifierCompoundUniqueInput = {
    admin_id: number
    module: string
    target_identifier: string
  }

  export type temporary_permissionsCountOrderByAggregateInput = {
    id?: SortOrder
    admin_id?: SortOrder
    module?: SortOrder
    target_identifier?: SortOrder
    approved_by?: SortOrder
    expires_at?: SortOrder
    created_at?: SortOrder
  }

  export type temporary_permissionsAvgOrderByAggregateInput = {
    id?: SortOrder
    admin_id?: SortOrder
    approved_by?: SortOrder
  }

  export type temporary_permissionsMaxOrderByAggregateInput = {
    id?: SortOrder
    admin_id?: SortOrder
    module?: SortOrder
    target_identifier?: SortOrder
    approved_by?: SortOrder
    expires_at?: SortOrder
    created_at?: SortOrder
  }

  export type temporary_permissionsMinOrderByAggregateInput = {
    id?: SortOrder
    admin_id?: SortOrder
    module?: SortOrder
    target_identifier?: SortOrder
    approved_by?: SortOrder
    expires_at?: SortOrder
    created_at?: SortOrder
  }

  export type temporary_permissionsSumOrderByAggregateInput = {
    id?: SortOrder
    admin_id?: SortOrder
    approved_by?: SortOrder
  }

  export type behavior_profilesCreateNestedManyWithoutAdminsInput = {
    create?: XOR<behavior_profilesCreateWithoutAdminsInput, behavior_profilesUncheckedCreateWithoutAdminsInput> | behavior_profilesCreateWithoutAdminsInput[] | behavior_profilesUncheckedCreateWithoutAdminsInput[]
    connectOrCreate?: behavior_profilesCreateOrConnectWithoutAdminsInput | behavior_profilesCreateOrConnectWithoutAdminsInput[]
    createMany?: behavior_profilesCreateManyAdminsInputEnvelope
    connect?: behavior_profilesWhereUniqueInput | behavior_profilesWhereUniqueInput[]
  }

  export type behavior_samplesCreateNestedManyWithoutAdminsInput = {
    create?: XOR<behavior_samplesCreateWithoutAdminsInput, behavior_samplesUncheckedCreateWithoutAdminsInput> | behavior_samplesCreateWithoutAdminsInput[] | behavior_samplesUncheckedCreateWithoutAdminsInput[]
    connectOrCreate?: behavior_samplesCreateOrConnectWithoutAdminsInput | behavior_samplesCreateOrConnectWithoutAdminsInput[]
    createMany?: behavior_samplesCreateManyAdminsInputEnvelope
    connect?: behavior_samplesWhereUniqueInput | behavior_samplesWhereUniqueInput[]
  }

  export type devicesCreateNestedManyWithoutAdminsInput = {
    create?: XOR<devicesCreateWithoutAdminsInput, devicesUncheckedCreateWithoutAdminsInput> | devicesCreateWithoutAdminsInput[] | devicesUncheckedCreateWithoutAdminsInput[]
    connectOrCreate?: devicesCreateOrConnectWithoutAdminsInput | devicesCreateOrConnectWithoutAdminsInput[]
    createMany?: devicesCreateManyAdminsInputEnvelope
    connect?: devicesWhereUniqueInput | devicesWhereUniqueInput[]
  }

  export type risk_eventsCreateNestedManyWithoutAdminsInput = {
    create?: XOR<risk_eventsCreateWithoutAdminsInput, risk_eventsUncheckedCreateWithoutAdminsInput> | risk_eventsCreateWithoutAdminsInput[] | risk_eventsUncheckedCreateWithoutAdminsInput[]
    connectOrCreate?: risk_eventsCreateOrConnectWithoutAdminsInput | risk_eventsCreateOrConnectWithoutAdminsInput[]
    createMany?: risk_eventsCreateManyAdminsInputEnvelope
    connect?: risk_eventsWhereUniqueInput | risk_eventsWhereUniqueInput[]
  }

  export type admin_preferencesCreateNestedOneWithoutAdminInput = {
    create?: XOR<admin_preferencesCreateWithoutAdminInput, admin_preferencesUncheckedCreateWithoutAdminInput>
    connectOrCreate?: admin_preferencesCreateOrConnectWithoutAdminInput
    connect?: admin_preferencesWhereUniqueInput
  }

  export type edit_requestsCreateNestedManyWithoutRequesterInput = {
    create?: XOR<edit_requestsCreateWithoutRequesterInput, edit_requestsUncheckedCreateWithoutRequesterInput> | edit_requestsCreateWithoutRequesterInput[] | edit_requestsUncheckedCreateWithoutRequesterInput[]
    connectOrCreate?: edit_requestsCreateOrConnectWithoutRequesterInput | edit_requestsCreateOrConnectWithoutRequesterInput[]
    createMany?: edit_requestsCreateManyRequesterInputEnvelope
    connect?: edit_requestsWhereUniqueInput | edit_requestsWhereUniqueInput[]
  }

  export type edit_requestsCreateNestedManyWithoutApproverInput = {
    create?: XOR<edit_requestsCreateWithoutApproverInput, edit_requestsUncheckedCreateWithoutApproverInput> | edit_requestsCreateWithoutApproverInput[] | edit_requestsUncheckedCreateWithoutApproverInput[]
    connectOrCreate?: edit_requestsCreateOrConnectWithoutApproverInput | edit_requestsCreateOrConnectWithoutApproverInput[]
    createMany?: edit_requestsCreateManyApproverInputEnvelope
    connect?: edit_requestsWhereUniqueInput | edit_requestsWhereUniqueInput[]
  }

  export type temporary_permissionsCreateNestedManyWithoutAdminInput = {
    create?: XOR<temporary_permissionsCreateWithoutAdminInput, temporary_permissionsUncheckedCreateWithoutAdminInput> | temporary_permissionsCreateWithoutAdminInput[] | temporary_permissionsUncheckedCreateWithoutAdminInput[]
    connectOrCreate?: temporary_permissionsCreateOrConnectWithoutAdminInput | temporary_permissionsCreateOrConnectWithoutAdminInput[]
    createMany?: temporary_permissionsCreateManyAdminInputEnvelope
    connect?: temporary_permissionsWhereUniqueInput | temporary_permissionsWhereUniqueInput[]
  }

  export type behavior_profilesUncheckedCreateNestedManyWithoutAdminsInput = {
    create?: XOR<behavior_profilesCreateWithoutAdminsInput, behavior_profilesUncheckedCreateWithoutAdminsInput> | behavior_profilesCreateWithoutAdminsInput[] | behavior_profilesUncheckedCreateWithoutAdminsInput[]
    connectOrCreate?: behavior_profilesCreateOrConnectWithoutAdminsInput | behavior_profilesCreateOrConnectWithoutAdminsInput[]
    createMany?: behavior_profilesCreateManyAdminsInputEnvelope
    connect?: behavior_profilesWhereUniqueInput | behavior_profilesWhereUniqueInput[]
  }

  export type behavior_samplesUncheckedCreateNestedManyWithoutAdminsInput = {
    create?: XOR<behavior_samplesCreateWithoutAdminsInput, behavior_samplesUncheckedCreateWithoutAdminsInput> | behavior_samplesCreateWithoutAdminsInput[] | behavior_samplesUncheckedCreateWithoutAdminsInput[]
    connectOrCreate?: behavior_samplesCreateOrConnectWithoutAdminsInput | behavior_samplesCreateOrConnectWithoutAdminsInput[]
    createMany?: behavior_samplesCreateManyAdminsInputEnvelope
    connect?: behavior_samplesWhereUniqueInput | behavior_samplesWhereUniqueInput[]
  }

  export type devicesUncheckedCreateNestedManyWithoutAdminsInput = {
    create?: XOR<devicesCreateWithoutAdminsInput, devicesUncheckedCreateWithoutAdminsInput> | devicesCreateWithoutAdminsInput[] | devicesUncheckedCreateWithoutAdminsInput[]
    connectOrCreate?: devicesCreateOrConnectWithoutAdminsInput | devicesCreateOrConnectWithoutAdminsInput[]
    createMany?: devicesCreateManyAdminsInputEnvelope
    connect?: devicesWhereUniqueInput | devicesWhereUniqueInput[]
  }

  export type risk_eventsUncheckedCreateNestedManyWithoutAdminsInput = {
    create?: XOR<risk_eventsCreateWithoutAdminsInput, risk_eventsUncheckedCreateWithoutAdminsInput> | risk_eventsCreateWithoutAdminsInput[] | risk_eventsUncheckedCreateWithoutAdminsInput[]
    connectOrCreate?: risk_eventsCreateOrConnectWithoutAdminsInput | risk_eventsCreateOrConnectWithoutAdminsInput[]
    createMany?: risk_eventsCreateManyAdminsInputEnvelope
    connect?: risk_eventsWhereUniqueInput | risk_eventsWhereUniqueInput[]
  }

  export type admin_preferencesUncheckedCreateNestedOneWithoutAdminInput = {
    create?: XOR<admin_preferencesCreateWithoutAdminInput, admin_preferencesUncheckedCreateWithoutAdminInput>
    connectOrCreate?: admin_preferencesCreateOrConnectWithoutAdminInput
    connect?: admin_preferencesWhereUniqueInput
  }

  export type edit_requestsUncheckedCreateNestedManyWithoutRequesterInput = {
    create?: XOR<edit_requestsCreateWithoutRequesterInput, edit_requestsUncheckedCreateWithoutRequesterInput> | edit_requestsCreateWithoutRequesterInput[] | edit_requestsUncheckedCreateWithoutRequesterInput[]
    connectOrCreate?: edit_requestsCreateOrConnectWithoutRequesterInput | edit_requestsCreateOrConnectWithoutRequesterInput[]
    createMany?: edit_requestsCreateManyRequesterInputEnvelope
    connect?: edit_requestsWhereUniqueInput | edit_requestsWhereUniqueInput[]
  }

  export type edit_requestsUncheckedCreateNestedManyWithoutApproverInput = {
    create?: XOR<edit_requestsCreateWithoutApproverInput, edit_requestsUncheckedCreateWithoutApproverInput> | edit_requestsCreateWithoutApproverInput[] | edit_requestsUncheckedCreateWithoutApproverInput[]
    connectOrCreate?: edit_requestsCreateOrConnectWithoutApproverInput | edit_requestsCreateOrConnectWithoutApproverInput[]
    createMany?: edit_requestsCreateManyApproverInputEnvelope
    connect?: edit_requestsWhereUniqueInput | edit_requestsWhereUniqueInput[]
  }

  export type temporary_permissionsUncheckedCreateNestedManyWithoutAdminInput = {
    create?: XOR<temporary_permissionsCreateWithoutAdminInput, temporary_permissionsUncheckedCreateWithoutAdminInput> | temporary_permissionsCreateWithoutAdminInput[] | temporary_permissionsUncheckedCreateWithoutAdminInput[]
    connectOrCreate?: temporary_permissionsCreateOrConnectWithoutAdminInput | temporary_permissionsCreateOrConnectWithoutAdminInput[]
    createMany?: temporary_permissionsCreateManyAdminInputEnvelope
    connect?: temporary_permissionsWhereUniqueInput | temporary_permissionsWhereUniqueInput[]
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

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type behavior_profilesUpdateManyWithoutAdminsNestedInput = {
    create?: XOR<behavior_profilesCreateWithoutAdminsInput, behavior_profilesUncheckedCreateWithoutAdminsInput> | behavior_profilesCreateWithoutAdminsInput[] | behavior_profilesUncheckedCreateWithoutAdminsInput[]
    connectOrCreate?: behavior_profilesCreateOrConnectWithoutAdminsInput | behavior_profilesCreateOrConnectWithoutAdminsInput[]
    upsert?: behavior_profilesUpsertWithWhereUniqueWithoutAdminsInput | behavior_profilesUpsertWithWhereUniqueWithoutAdminsInput[]
    createMany?: behavior_profilesCreateManyAdminsInputEnvelope
    set?: behavior_profilesWhereUniqueInput | behavior_profilesWhereUniqueInput[]
    disconnect?: behavior_profilesWhereUniqueInput | behavior_profilesWhereUniqueInput[]
    delete?: behavior_profilesWhereUniqueInput | behavior_profilesWhereUniqueInput[]
    connect?: behavior_profilesWhereUniqueInput | behavior_profilesWhereUniqueInput[]
    update?: behavior_profilesUpdateWithWhereUniqueWithoutAdminsInput | behavior_profilesUpdateWithWhereUniqueWithoutAdminsInput[]
    updateMany?: behavior_profilesUpdateManyWithWhereWithoutAdminsInput | behavior_profilesUpdateManyWithWhereWithoutAdminsInput[]
    deleteMany?: behavior_profilesScalarWhereInput | behavior_profilesScalarWhereInput[]
  }

  export type behavior_samplesUpdateManyWithoutAdminsNestedInput = {
    create?: XOR<behavior_samplesCreateWithoutAdminsInput, behavior_samplesUncheckedCreateWithoutAdminsInput> | behavior_samplesCreateWithoutAdminsInput[] | behavior_samplesUncheckedCreateWithoutAdminsInput[]
    connectOrCreate?: behavior_samplesCreateOrConnectWithoutAdminsInput | behavior_samplesCreateOrConnectWithoutAdminsInput[]
    upsert?: behavior_samplesUpsertWithWhereUniqueWithoutAdminsInput | behavior_samplesUpsertWithWhereUniqueWithoutAdminsInput[]
    createMany?: behavior_samplesCreateManyAdminsInputEnvelope
    set?: behavior_samplesWhereUniqueInput | behavior_samplesWhereUniqueInput[]
    disconnect?: behavior_samplesWhereUniqueInput | behavior_samplesWhereUniqueInput[]
    delete?: behavior_samplesWhereUniqueInput | behavior_samplesWhereUniqueInput[]
    connect?: behavior_samplesWhereUniqueInput | behavior_samplesWhereUniqueInput[]
    update?: behavior_samplesUpdateWithWhereUniqueWithoutAdminsInput | behavior_samplesUpdateWithWhereUniqueWithoutAdminsInput[]
    updateMany?: behavior_samplesUpdateManyWithWhereWithoutAdminsInput | behavior_samplesUpdateManyWithWhereWithoutAdminsInput[]
    deleteMany?: behavior_samplesScalarWhereInput | behavior_samplesScalarWhereInput[]
  }

  export type devicesUpdateManyWithoutAdminsNestedInput = {
    create?: XOR<devicesCreateWithoutAdminsInput, devicesUncheckedCreateWithoutAdminsInput> | devicesCreateWithoutAdminsInput[] | devicesUncheckedCreateWithoutAdminsInput[]
    connectOrCreate?: devicesCreateOrConnectWithoutAdminsInput | devicesCreateOrConnectWithoutAdminsInput[]
    upsert?: devicesUpsertWithWhereUniqueWithoutAdminsInput | devicesUpsertWithWhereUniqueWithoutAdminsInput[]
    createMany?: devicesCreateManyAdminsInputEnvelope
    set?: devicesWhereUniqueInput | devicesWhereUniqueInput[]
    disconnect?: devicesWhereUniqueInput | devicesWhereUniqueInput[]
    delete?: devicesWhereUniqueInput | devicesWhereUniqueInput[]
    connect?: devicesWhereUniqueInput | devicesWhereUniqueInput[]
    update?: devicesUpdateWithWhereUniqueWithoutAdminsInput | devicesUpdateWithWhereUniqueWithoutAdminsInput[]
    updateMany?: devicesUpdateManyWithWhereWithoutAdminsInput | devicesUpdateManyWithWhereWithoutAdminsInput[]
    deleteMany?: devicesScalarWhereInput | devicesScalarWhereInput[]
  }

  export type risk_eventsUpdateManyWithoutAdminsNestedInput = {
    create?: XOR<risk_eventsCreateWithoutAdminsInput, risk_eventsUncheckedCreateWithoutAdminsInput> | risk_eventsCreateWithoutAdminsInput[] | risk_eventsUncheckedCreateWithoutAdminsInput[]
    connectOrCreate?: risk_eventsCreateOrConnectWithoutAdminsInput | risk_eventsCreateOrConnectWithoutAdminsInput[]
    upsert?: risk_eventsUpsertWithWhereUniqueWithoutAdminsInput | risk_eventsUpsertWithWhereUniqueWithoutAdminsInput[]
    createMany?: risk_eventsCreateManyAdminsInputEnvelope
    set?: risk_eventsWhereUniqueInput | risk_eventsWhereUniqueInput[]
    disconnect?: risk_eventsWhereUniqueInput | risk_eventsWhereUniqueInput[]
    delete?: risk_eventsWhereUniqueInput | risk_eventsWhereUniqueInput[]
    connect?: risk_eventsWhereUniqueInput | risk_eventsWhereUniqueInput[]
    update?: risk_eventsUpdateWithWhereUniqueWithoutAdminsInput | risk_eventsUpdateWithWhereUniqueWithoutAdminsInput[]
    updateMany?: risk_eventsUpdateManyWithWhereWithoutAdminsInput | risk_eventsUpdateManyWithWhereWithoutAdminsInput[]
    deleteMany?: risk_eventsScalarWhereInput | risk_eventsScalarWhereInput[]
  }

  export type admin_preferencesUpdateOneWithoutAdminNestedInput = {
    create?: XOR<admin_preferencesCreateWithoutAdminInput, admin_preferencesUncheckedCreateWithoutAdminInput>
    connectOrCreate?: admin_preferencesCreateOrConnectWithoutAdminInput
    upsert?: admin_preferencesUpsertWithoutAdminInput
    disconnect?: admin_preferencesWhereInput | boolean
    delete?: admin_preferencesWhereInput | boolean
    connect?: admin_preferencesWhereUniqueInput
    update?: XOR<XOR<admin_preferencesUpdateToOneWithWhereWithoutAdminInput, admin_preferencesUpdateWithoutAdminInput>, admin_preferencesUncheckedUpdateWithoutAdminInput>
  }

  export type edit_requestsUpdateManyWithoutRequesterNestedInput = {
    create?: XOR<edit_requestsCreateWithoutRequesterInput, edit_requestsUncheckedCreateWithoutRequesterInput> | edit_requestsCreateWithoutRequesterInput[] | edit_requestsUncheckedCreateWithoutRequesterInput[]
    connectOrCreate?: edit_requestsCreateOrConnectWithoutRequesterInput | edit_requestsCreateOrConnectWithoutRequesterInput[]
    upsert?: edit_requestsUpsertWithWhereUniqueWithoutRequesterInput | edit_requestsUpsertWithWhereUniqueWithoutRequesterInput[]
    createMany?: edit_requestsCreateManyRequesterInputEnvelope
    set?: edit_requestsWhereUniqueInput | edit_requestsWhereUniqueInput[]
    disconnect?: edit_requestsWhereUniqueInput | edit_requestsWhereUniqueInput[]
    delete?: edit_requestsWhereUniqueInput | edit_requestsWhereUniqueInput[]
    connect?: edit_requestsWhereUniqueInput | edit_requestsWhereUniqueInput[]
    update?: edit_requestsUpdateWithWhereUniqueWithoutRequesterInput | edit_requestsUpdateWithWhereUniqueWithoutRequesterInput[]
    updateMany?: edit_requestsUpdateManyWithWhereWithoutRequesterInput | edit_requestsUpdateManyWithWhereWithoutRequesterInput[]
    deleteMany?: edit_requestsScalarWhereInput | edit_requestsScalarWhereInput[]
  }

  export type edit_requestsUpdateManyWithoutApproverNestedInput = {
    create?: XOR<edit_requestsCreateWithoutApproverInput, edit_requestsUncheckedCreateWithoutApproverInput> | edit_requestsCreateWithoutApproverInput[] | edit_requestsUncheckedCreateWithoutApproverInput[]
    connectOrCreate?: edit_requestsCreateOrConnectWithoutApproverInput | edit_requestsCreateOrConnectWithoutApproverInput[]
    upsert?: edit_requestsUpsertWithWhereUniqueWithoutApproverInput | edit_requestsUpsertWithWhereUniqueWithoutApproverInput[]
    createMany?: edit_requestsCreateManyApproverInputEnvelope
    set?: edit_requestsWhereUniqueInput | edit_requestsWhereUniqueInput[]
    disconnect?: edit_requestsWhereUniqueInput | edit_requestsWhereUniqueInput[]
    delete?: edit_requestsWhereUniqueInput | edit_requestsWhereUniqueInput[]
    connect?: edit_requestsWhereUniqueInput | edit_requestsWhereUniqueInput[]
    update?: edit_requestsUpdateWithWhereUniqueWithoutApproverInput | edit_requestsUpdateWithWhereUniqueWithoutApproverInput[]
    updateMany?: edit_requestsUpdateManyWithWhereWithoutApproverInput | edit_requestsUpdateManyWithWhereWithoutApproverInput[]
    deleteMany?: edit_requestsScalarWhereInput | edit_requestsScalarWhereInput[]
  }

  export type temporary_permissionsUpdateManyWithoutAdminNestedInput = {
    create?: XOR<temporary_permissionsCreateWithoutAdminInput, temporary_permissionsUncheckedCreateWithoutAdminInput> | temporary_permissionsCreateWithoutAdminInput[] | temporary_permissionsUncheckedCreateWithoutAdminInput[]
    connectOrCreate?: temporary_permissionsCreateOrConnectWithoutAdminInput | temporary_permissionsCreateOrConnectWithoutAdminInput[]
    upsert?: temporary_permissionsUpsertWithWhereUniqueWithoutAdminInput | temporary_permissionsUpsertWithWhereUniqueWithoutAdminInput[]
    createMany?: temporary_permissionsCreateManyAdminInputEnvelope
    set?: temporary_permissionsWhereUniqueInput | temporary_permissionsWhereUniqueInput[]
    disconnect?: temporary_permissionsWhereUniqueInput | temporary_permissionsWhereUniqueInput[]
    delete?: temporary_permissionsWhereUniqueInput | temporary_permissionsWhereUniqueInput[]
    connect?: temporary_permissionsWhereUniqueInput | temporary_permissionsWhereUniqueInput[]
    update?: temporary_permissionsUpdateWithWhereUniqueWithoutAdminInput | temporary_permissionsUpdateWithWhereUniqueWithoutAdminInput[]
    updateMany?: temporary_permissionsUpdateManyWithWhereWithoutAdminInput | temporary_permissionsUpdateManyWithWhereWithoutAdminInput[]
    deleteMany?: temporary_permissionsScalarWhereInput | temporary_permissionsScalarWhereInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type behavior_profilesUncheckedUpdateManyWithoutAdminsNestedInput = {
    create?: XOR<behavior_profilesCreateWithoutAdminsInput, behavior_profilesUncheckedCreateWithoutAdminsInput> | behavior_profilesCreateWithoutAdminsInput[] | behavior_profilesUncheckedCreateWithoutAdminsInput[]
    connectOrCreate?: behavior_profilesCreateOrConnectWithoutAdminsInput | behavior_profilesCreateOrConnectWithoutAdminsInput[]
    upsert?: behavior_profilesUpsertWithWhereUniqueWithoutAdminsInput | behavior_profilesUpsertWithWhereUniqueWithoutAdminsInput[]
    createMany?: behavior_profilesCreateManyAdminsInputEnvelope
    set?: behavior_profilesWhereUniqueInput | behavior_profilesWhereUniqueInput[]
    disconnect?: behavior_profilesWhereUniqueInput | behavior_profilesWhereUniqueInput[]
    delete?: behavior_profilesWhereUniqueInput | behavior_profilesWhereUniqueInput[]
    connect?: behavior_profilesWhereUniqueInput | behavior_profilesWhereUniqueInput[]
    update?: behavior_profilesUpdateWithWhereUniqueWithoutAdminsInput | behavior_profilesUpdateWithWhereUniqueWithoutAdminsInput[]
    updateMany?: behavior_profilesUpdateManyWithWhereWithoutAdminsInput | behavior_profilesUpdateManyWithWhereWithoutAdminsInput[]
    deleteMany?: behavior_profilesScalarWhereInput | behavior_profilesScalarWhereInput[]
  }

  export type behavior_samplesUncheckedUpdateManyWithoutAdminsNestedInput = {
    create?: XOR<behavior_samplesCreateWithoutAdminsInput, behavior_samplesUncheckedCreateWithoutAdminsInput> | behavior_samplesCreateWithoutAdminsInput[] | behavior_samplesUncheckedCreateWithoutAdminsInput[]
    connectOrCreate?: behavior_samplesCreateOrConnectWithoutAdminsInput | behavior_samplesCreateOrConnectWithoutAdminsInput[]
    upsert?: behavior_samplesUpsertWithWhereUniqueWithoutAdminsInput | behavior_samplesUpsertWithWhereUniqueWithoutAdminsInput[]
    createMany?: behavior_samplesCreateManyAdminsInputEnvelope
    set?: behavior_samplesWhereUniqueInput | behavior_samplesWhereUniqueInput[]
    disconnect?: behavior_samplesWhereUniqueInput | behavior_samplesWhereUniqueInput[]
    delete?: behavior_samplesWhereUniqueInput | behavior_samplesWhereUniqueInput[]
    connect?: behavior_samplesWhereUniqueInput | behavior_samplesWhereUniqueInput[]
    update?: behavior_samplesUpdateWithWhereUniqueWithoutAdminsInput | behavior_samplesUpdateWithWhereUniqueWithoutAdminsInput[]
    updateMany?: behavior_samplesUpdateManyWithWhereWithoutAdminsInput | behavior_samplesUpdateManyWithWhereWithoutAdminsInput[]
    deleteMany?: behavior_samplesScalarWhereInput | behavior_samplesScalarWhereInput[]
  }

  export type devicesUncheckedUpdateManyWithoutAdminsNestedInput = {
    create?: XOR<devicesCreateWithoutAdminsInput, devicesUncheckedCreateWithoutAdminsInput> | devicesCreateWithoutAdminsInput[] | devicesUncheckedCreateWithoutAdminsInput[]
    connectOrCreate?: devicesCreateOrConnectWithoutAdminsInput | devicesCreateOrConnectWithoutAdminsInput[]
    upsert?: devicesUpsertWithWhereUniqueWithoutAdminsInput | devicesUpsertWithWhereUniqueWithoutAdminsInput[]
    createMany?: devicesCreateManyAdminsInputEnvelope
    set?: devicesWhereUniqueInput | devicesWhereUniqueInput[]
    disconnect?: devicesWhereUniqueInput | devicesWhereUniqueInput[]
    delete?: devicesWhereUniqueInput | devicesWhereUniqueInput[]
    connect?: devicesWhereUniqueInput | devicesWhereUniqueInput[]
    update?: devicesUpdateWithWhereUniqueWithoutAdminsInput | devicesUpdateWithWhereUniqueWithoutAdminsInput[]
    updateMany?: devicesUpdateManyWithWhereWithoutAdminsInput | devicesUpdateManyWithWhereWithoutAdminsInput[]
    deleteMany?: devicesScalarWhereInput | devicesScalarWhereInput[]
  }

  export type risk_eventsUncheckedUpdateManyWithoutAdminsNestedInput = {
    create?: XOR<risk_eventsCreateWithoutAdminsInput, risk_eventsUncheckedCreateWithoutAdminsInput> | risk_eventsCreateWithoutAdminsInput[] | risk_eventsUncheckedCreateWithoutAdminsInput[]
    connectOrCreate?: risk_eventsCreateOrConnectWithoutAdminsInput | risk_eventsCreateOrConnectWithoutAdminsInput[]
    upsert?: risk_eventsUpsertWithWhereUniqueWithoutAdminsInput | risk_eventsUpsertWithWhereUniqueWithoutAdminsInput[]
    createMany?: risk_eventsCreateManyAdminsInputEnvelope
    set?: risk_eventsWhereUniqueInput | risk_eventsWhereUniqueInput[]
    disconnect?: risk_eventsWhereUniqueInput | risk_eventsWhereUniqueInput[]
    delete?: risk_eventsWhereUniqueInput | risk_eventsWhereUniqueInput[]
    connect?: risk_eventsWhereUniqueInput | risk_eventsWhereUniqueInput[]
    update?: risk_eventsUpdateWithWhereUniqueWithoutAdminsInput | risk_eventsUpdateWithWhereUniqueWithoutAdminsInput[]
    updateMany?: risk_eventsUpdateManyWithWhereWithoutAdminsInput | risk_eventsUpdateManyWithWhereWithoutAdminsInput[]
    deleteMany?: risk_eventsScalarWhereInput | risk_eventsScalarWhereInput[]
  }

  export type admin_preferencesUncheckedUpdateOneWithoutAdminNestedInput = {
    create?: XOR<admin_preferencesCreateWithoutAdminInput, admin_preferencesUncheckedCreateWithoutAdminInput>
    connectOrCreate?: admin_preferencesCreateOrConnectWithoutAdminInput
    upsert?: admin_preferencesUpsertWithoutAdminInput
    disconnect?: admin_preferencesWhereInput | boolean
    delete?: admin_preferencesWhereInput | boolean
    connect?: admin_preferencesWhereUniqueInput
    update?: XOR<XOR<admin_preferencesUpdateToOneWithWhereWithoutAdminInput, admin_preferencesUpdateWithoutAdminInput>, admin_preferencesUncheckedUpdateWithoutAdminInput>
  }

  export type edit_requestsUncheckedUpdateManyWithoutRequesterNestedInput = {
    create?: XOR<edit_requestsCreateWithoutRequesterInput, edit_requestsUncheckedCreateWithoutRequesterInput> | edit_requestsCreateWithoutRequesterInput[] | edit_requestsUncheckedCreateWithoutRequesterInput[]
    connectOrCreate?: edit_requestsCreateOrConnectWithoutRequesterInput | edit_requestsCreateOrConnectWithoutRequesterInput[]
    upsert?: edit_requestsUpsertWithWhereUniqueWithoutRequesterInput | edit_requestsUpsertWithWhereUniqueWithoutRequesterInput[]
    createMany?: edit_requestsCreateManyRequesterInputEnvelope
    set?: edit_requestsWhereUniqueInput | edit_requestsWhereUniqueInput[]
    disconnect?: edit_requestsWhereUniqueInput | edit_requestsWhereUniqueInput[]
    delete?: edit_requestsWhereUniqueInput | edit_requestsWhereUniqueInput[]
    connect?: edit_requestsWhereUniqueInput | edit_requestsWhereUniqueInput[]
    update?: edit_requestsUpdateWithWhereUniqueWithoutRequesterInput | edit_requestsUpdateWithWhereUniqueWithoutRequesterInput[]
    updateMany?: edit_requestsUpdateManyWithWhereWithoutRequesterInput | edit_requestsUpdateManyWithWhereWithoutRequesterInput[]
    deleteMany?: edit_requestsScalarWhereInput | edit_requestsScalarWhereInput[]
  }

  export type edit_requestsUncheckedUpdateManyWithoutApproverNestedInput = {
    create?: XOR<edit_requestsCreateWithoutApproverInput, edit_requestsUncheckedCreateWithoutApproverInput> | edit_requestsCreateWithoutApproverInput[] | edit_requestsUncheckedCreateWithoutApproverInput[]
    connectOrCreate?: edit_requestsCreateOrConnectWithoutApproverInput | edit_requestsCreateOrConnectWithoutApproverInput[]
    upsert?: edit_requestsUpsertWithWhereUniqueWithoutApproverInput | edit_requestsUpsertWithWhereUniqueWithoutApproverInput[]
    createMany?: edit_requestsCreateManyApproverInputEnvelope
    set?: edit_requestsWhereUniqueInput | edit_requestsWhereUniqueInput[]
    disconnect?: edit_requestsWhereUniqueInput | edit_requestsWhereUniqueInput[]
    delete?: edit_requestsWhereUniqueInput | edit_requestsWhereUniqueInput[]
    connect?: edit_requestsWhereUniqueInput | edit_requestsWhereUniqueInput[]
    update?: edit_requestsUpdateWithWhereUniqueWithoutApproverInput | edit_requestsUpdateWithWhereUniqueWithoutApproverInput[]
    updateMany?: edit_requestsUpdateManyWithWhereWithoutApproverInput | edit_requestsUpdateManyWithWhereWithoutApproverInput[]
    deleteMany?: edit_requestsScalarWhereInput | edit_requestsScalarWhereInput[]
  }

  export type temporary_permissionsUncheckedUpdateManyWithoutAdminNestedInput = {
    create?: XOR<temporary_permissionsCreateWithoutAdminInput, temporary_permissionsUncheckedCreateWithoutAdminInput> | temporary_permissionsCreateWithoutAdminInput[] | temporary_permissionsUncheckedCreateWithoutAdminInput[]
    connectOrCreate?: temporary_permissionsCreateOrConnectWithoutAdminInput | temporary_permissionsCreateOrConnectWithoutAdminInput[]
    upsert?: temporary_permissionsUpsertWithWhereUniqueWithoutAdminInput | temporary_permissionsUpsertWithWhereUniqueWithoutAdminInput[]
    createMany?: temporary_permissionsCreateManyAdminInputEnvelope
    set?: temporary_permissionsWhereUniqueInput | temporary_permissionsWhereUniqueInput[]
    disconnect?: temporary_permissionsWhereUniqueInput | temporary_permissionsWhereUniqueInput[]
    delete?: temporary_permissionsWhereUniqueInput | temporary_permissionsWhereUniqueInput[]
    connect?: temporary_permissionsWhereUniqueInput | temporary_permissionsWhereUniqueInput[]
    update?: temporary_permissionsUpdateWithWhereUniqueWithoutAdminInput | temporary_permissionsUpdateWithWhereUniqueWithoutAdminInput[]
    updateMany?: temporary_permissionsUpdateManyWithWhereWithoutAdminInput | temporary_permissionsUpdateManyWithWhereWithoutAdminInput[]
    deleteMany?: temporary_permissionsScalarWhereInput | temporary_permissionsScalarWhereInput[]
  }

  export type adminsCreateNestedOneWithoutPreferencesInput = {
    create?: XOR<adminsCreateWithoutPreferencesInput, adminsUncheckedCreateWithoutPreferencesInput>
    connectOrCreate?: adminsCreateOrConnectWithoutPreferencesInput
    connect?: adminsWhereUniqueInput
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type adminsUpdateOneRequiredWithoutPreferencesNestedInput = {
    create?: XOR<adminsCreateWithoutPreferencesInput, adminsUncheckedCreateWithoutPreferencesInput>
    connectOrCreate?: adminsCreateOrConnectWithoutPreferencesInput
    upsert?: adminsUpsertWithoutPreferencesInput
    connect?: adminsWhereUniqueInput
    update?: XOR<XOR<adminsUpdateToOneWithWhereWithoutPreferencesInput, adminsUpdateWithoutPreferencesInput>, adminsUncheckedUpdateWithoutPreferencesInput>
  }

  export type adminsCreateNestedOneWithoutBehavior_profilesInput = {
    create?: XOR<adminsCreateWithoutBehavior_profilesInput, adminsUncheckedCreateWithoutBehavior_profilesInput>
    connectOrCreate?: adminsCreateOrConnectWithoutBehavior_profilesInput
    connect?: adminsWhereUniqueInput
  }

  export type NullableDecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string | null
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type adminsUpdateOneRequiredWithoutBehavior_profilesNestedInput = {
    create?: XOR<adminsCreateWithoutBehavior_profilesInput, adminsUncheckedCreateWithoutBehavior_profilesInput>
    connectOrCreate?: adminsCreateOrConnectWithoutBehavior_profilesInput
    upsert?: adminsUpsertWithoutBehavior_profilesInput
    connect?: adminsWhereUniqueInput
    update?: XOR<XOR<adminsUpdateToOneWithWhereWithoutBehavior_profilesInput, adminsUpdateWithoutBehavior_profilesInput>, adminsUncheckedUpdateWithoutBehavior_profilesInput>
  }

  export type adminsCreateNestedOneWithoutBehavior_samplesInput = {
    create?: XOR<adminsCreateWithoutBehavior_samplesInput, adminsUncheckedCreateWithoutBehavior_samplesInput>
    connectOrCreate?: adminsCreateOrConnectWithoutBehavior_samplesInput
    connect?: adminsWhereUniqueInput
  }

  export type adminsUpdateOneRequiredWithoutBehavior_samplesNestedInput = {
    create?: XOR<adminsCreateWithoutBehavior_samplesInput, adminsUncheckedCreateWithoutBehavior_samplesInput>
    connectOrCreate?: adminsCreateOrConnectWithoutBehavior_samplesInput
    upsert?: adminsUpsertWithoutBehavior_samplesInput
    connect?: adminsWhereUniqueInput
    update?: XOR<XOR<adminsUpdateToOneWithWhereWithoutBehavior_samplesInput, adminsUpdateWithoutBehavior_samplesInput>, adminsUncheckedUpdateWithoutBehavior_samplesInput>
  }

  export type adminsCreateNestedOneWithoutDevicesInput = {
    create?: XOR<adminsCreateWithoutDevicesInput, adminsUncheckedCreateWithoutDevicesInput>
    connectOrCreate?: adminsCreateOrConnectWithoutDevicesInput
    connect?: adminsWhereUniqueInput
  }

  export type adminsUpdateOneRequiredWithoutDevicesNestedInput = {
    create?: XOR<adminsCreateWithoutDevicesInput, adminsUncheckedCreateWithoutDevicesInput>
    connectOrCreate?: adminsCreateOrConnectWithoutDevicesInput
    upsert?: adminsUpsertWithoutDevicesInput
    connect?: adminsWhereUniqueInput
    update?: XOR<XOR<adminsUpdateToOneWithWhereWithoutDevicesInput, adminsUpdateWithoutDevicesInput>, adminsUncheckedUpdateWithoutDevicesInput>
  }

  export type adminsCreateNestedOneWithoutRisk_eventsInput = {
    create?: XOR<adminsCreateWithoutRisk_eventsInput, adminsUncheckedCreateWithoutRisk_eventsInput>
    connectOrCreate?: adminsCreateOrConnectWithoutRisk_eventsInput
    connect?: adminsWhereUniqueInput
  }

  export type adminsUpdateOneWithoutRisk_eventsNestedInput = {
    create?: XOR<adminsCreateWithoutRisk_eventsInput, adminsUncheckedCreateWithoutRisk_eventsInput>
    connectOrCreate?: adminsCreateOrConnectWithoutRisk_eventsInput
    upsert?: adminsUpsertWithoutRisk_eventsInput
    disconnect?: adminsWhereInput | boolean
    delete?: adminsWhereInput | boolean
    connect?: adminsWhereUniqueInput
    update?: XOR<XOR<adminsUpdateToOneWithWhereWithoutRisk_eventsInput, adminsUpdateWithoutRisk_eventsInput>, adminsUncheckedUpdateWithoutRisk_eventsInput>
  }

  export type adminsCreateNestedOneWithoutEdit_requests_requestedInput = {
    create?: XOR<adminsCreateWithoutEdit_requests_requestedInput, adminsUncheckedCreateWithoutEdit_requests_requestedInput>
    connectOrCreate?: adminsCreateOrConnectWithoutEdit_requests_requestedInput
    connect?: adminsWhereUniqueInput
  }

  export type adminsCreateNestedOneWithoutEdit_requests_approvedInput = {
    create?: XOR<adminsCreateWithoutEdit_requests_approvedInput, adminsUncheckedCreateWithoutEdit_requests_approvedInput>
    connectOrCreate?: adminsCreateOrConnectWithoutEdit_requests_approvedInput
    connect?: adminsWhereUniqueInput
  }

  export type adminsUpdateOneRequiredWithoutEdit_requests_requestedNestedInput = {
    create?: XOR<adminsCreateWithoutEdit_requests_requestedInput, adminsUncheckedCreateWithoutEdit_requests_requestedInput>
    connectOrCreate?: adminsCreateOrConnectWithoutEdit_requests_requestedInput
    upsert?: adminsUpsertWithoutEdit_requests_requestedInput
    connect?: adminsWhereUniqueInput
    update?: XOR<XOR<adminsUpdateToOneWithWhereWithoutEdit_requests_requestedInput, adminsUpdateWithoutEdit_requests_requestedInput>, adminsUncheckedUpdateWithoutEdit_requests_requestedInput>
  }

  export type adminsUpdateOneWithoutEdit_requests_approvedNestedInput = {
    create?: XOR<adminsCreateWithoutEdit_requests_approvedInput, adminsUncheckedCreateWithoutEdit_requests_approvedInput>
    connectOrCreate?: adminsCreateOrConnectWithoutEdit_requests_approvedInput
    upsert?: adminsUpsertWithoutEdit_requests_approvedInput
    disconnect?: adminsWhereInput | boolean
    delete?: adminsWhereInput | boolean
    connect?: adminsWhereUniqueInput
    update?: XOR<XOR<adminsUpdateToOneWithWhereWithoutEdit_requests_approvedInput, adminsUpdateWithoutEdit_requests_approvedInput>, adminsUncheckedUpdateWithoutEdit_requests_approvedInput>
  }

  export type adminsCreateNestedOneWithoutTemporary_permissionsInput = {
    create?: XOR<adminsCreateWithoutTemporary_permissionsInput, adminsUncheckedCreateWithoutTemporary_permissionsInput>
    connectOrCreate?: adminsCreateOrConnectWithoutTemporary_permissionsInput
    connect?: adminsWhereUniqueInput
  }

  export type adminsUpdateOneRequiredWithoutTemporary_permissionsNestedInput = {
    create?: XOR<adminsCreateWithoutTemporary_permissionsInput, adminsUncheckedCreateWithoutTemporary_permissionsInput>
    connectOrCreate?: adminsCreateOrConnectWithoutTemporary_permissionsInput
    upsert?: adminsUpsertWithoutTemporary_permissionsInput
    connect?: adminsWhereUniqueInput
    update?: XOR<XOR<adminsUpdateToOneWithWhereWithoutTemporary_permissionsInput, adminsUpdateWithoutTemporary_permissionsInput>, adminsUncheckedUpdateWithoutTemporary_permissionsInput>
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

  export type behavior_profilesCreateWithoutAdminsInput = {
    enrollment_phrase: string
    avg_dwell_time?: Decimal | DecimalJsLike | number | string | null
    avg_flight_time?: Decimal | DecimalJsLike | number | string | null
    avg_typing_speed?: Decimal | DecimalJsLike | number | string | null
    avg_backspace_usage?: Decimal | DecimalJsLike | number | string | null
    avg_error_rate?: Decimal | DecimalJsLike | number | string | null
    created_at?: Date | string | null
  }

  export type behavior_profilesUncheckedCreateWithoutAdminsInput = {
    id?: number
    enrollment_phrase: string
    avg_dwell_time?: Decimal | DecimalJsLike | number | string | null
    avg_flight_time?: Decimal | DecimalJsLike | number | string | null
    avg_typing_speed?: Decimal | DecimalJsLike | number | string | null
    avg_backspace_usage?: Decimal | DecimalJsLike | number | string | null
    avg_error_rate?: Decimal | DecimalJsLike | number | string | null
    created_at?: Date | string | null
  }

  export type behavior_profilesCreateOrConnectWithoutAdminsInput = {
    where: behavior_profilesWhereUniqueInput
    create: XOR<behavior_profilesCreateWithoutAdminsInput, behavior_profilesUncheckedCreateWithoutAdminsInput>
  }

  export type behavior_profilesCreateManyAdminsInputEnvelope = {
    data: behavior_profilesCreateManyAdminsInput | behavior_profilesCreateManyAdminsInput[]
    skipDuplicates?: boolean
  }

  export type behavior_samplesCreateWithoutAdminsInput = {
    dwell_time?: Decimal | DecimalJsLike | number | string | null
    flight_time?: Decimal | DecimalJsLike | number | string | null
    typing_speed?: Decimal | DecimalJsLike | number | string | null
    backspace_usage?: Decimal | DecimalJsLike | number | string | null
    error_rate?: Decimal | DecimalJsLike | number | string | null
    similarity_score?: Decimal | DecimalJsLike | number | string | null
    verification_result?: string | null
    created_at?: Date | string | null
    sample_type?: string | null
  }

  export type behavior_samplesUncheckedCreateWithoutAdminsInput = {
    id?: number
    dwell_time?: Decimal | DecimalJsLike | number | string | null
    flight_time?: Decimal | DecimalJsLike | number | string | null
    typing_speed?: Decimal | DecimalJsLike | number | string | null
    backspace_usage?: Decimal | DecimalJsLike | number | string | null
    error_rate?: Decimal | DecimalJsLike | number | string | null
    similarity_score?: Decimal | DecimalJsLike | number | string | null
    verification_result?: string | null
    created_at?: Date | string | null
    sample_type?: string | null
  }

  export type behavior_samplesCreateOrConnectWithoutAdminsInput = {
    where: behavior_samplesWhereUniqueInput
    create: XOR<behavior_samplesCreateWithoutAdminsInput, behavior_samplesUncheckedCreateWithoutAdminsInput>
  }

  export type behavior_samplesCreateManyAdminsInputEnvelope = {
    data: behavior_samplesCreateManyAdminsInput | behavior_samplesCreateManyAdminsInput[]
    skipDuplicates?: boolean
  }

  export type devicesCreateWithoutAdminsInput = {
    device_fingerprint: string
    device_name?: string | null
    trust_score?: number | null
    status?: string | null
    registration_token_hash?: string | null
    token_expires_at?: Date | string | null
    first_seen?: Date | string | null
    last_seen?: Date | string | null
    created_at?: Date | string | null
  }

  export type devicesUncheckedCreateWithoutAdminsInput = {
    id?: number
    device_fingerprint: string
    device_name?: string | null
    trust_score?: number | null
    status?: string | null
    registration_token_hash?: string | null
    token_expires_at?: Date | string | null
    first_seen?: Date | string | null
    last_seen?: Date | string | null
    created_at?: Date | string | null
  }

  export type devicesCreateOrConnectWithoutAdminsInput = {
    where: devicesWhereUniqueInput
    create: XOR<devicesCreateWithoutAdminsInput, devicesUncheckedCreateWithoutAdminsInput>
  }

  export type devicesCreateManyAdminsInputEnvelope = {
    data: devicesCreateManyAdminsInput | devicesCreateManyAdminsInput[]
    skipDuplicates?: boolean
  }

  export type risk_eventsCreateWithoutAdminsInput = {
    identity_score?: Decimal | DecimalJsLike | number | string | null
    device_score?: Decimal | DecimalJsLike | number | string | null
    behavior_score?: Decimal | DecimalJsLike | number | string | null
    overall_risk_score?: Decimal | DecimalJsLike | number | string | null
    decision?: string | null
    created_at?: Date | string | null
  }

  export type risk_eventsUncheckedCreateWithoutAdminsInput = {
    id?: number
    identity_score?: Decimal | DecimalJsLike | number | string | null
    device_score?: Decimal | DecimalJsLike | number | string | null
    behavior_score?: Decimal | DecimalJsLike | number | string | null
    overall_risk_score?: Decimal | DecimalJsLike | number | string | null
    decision?: string | null
    created_at?: Date | string | null
  }

  export type risk_eventsCreateOrConnectWithoutAdminsInput = {
    where: risk_eventsWhereUniqueInput
    create: XOR<risk_eventsCreateWithoutAdminsInput, risk_eventsUncheckedCreateWithoutAdminsInput>
  }

  export type risk_eventsCreateManyAdminsInputEnvelope = {
    data: risk_eventsCreateManyAdminsInput | risk_eventsCreateManyAdminsInput[]
    skipDuplicates?: boolean
  }

  export type admin_preferencesCreateWithoutAdminInput = {
    language?: string
    theme?: string
    date_format?: string
    time_format?: string
    default_dashboard?: string
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type admin_preferencesUncheckedCreateWithoutAdminInput = {
    id?: number
    language?: string
    theme?: string
    date_format?: string
    time_format?: string
    default_dashboard?: string
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type admin_preferencesCreateOrConnectWithoutAdminInput = {
    where: admin_preferencesWhereUniqueInput
    create: XOR<admin_preferencesCreateWithoutAdminInput, admin_preferencesUncheckedCreateWithoutAdminInput>
  }

  export type edit_requestsCreateWithoutRequesterInput = {
    module: string
    action: string
    target_identifier: string
    reason: string
    status?: string
    approval_token?: string | null
    requested_at?: Date | string
    approved_at?: Date | string | null
    expires_at?: Date | string | null
    approver?: adminsCreateNestedOneWithoutEdit_requests_approvedInput
  }

  export type edit_requestsUncheckedCreateWithoutRequesterInput = {
    id?: number
    approved_by_admin_id?: number | null
    module: string
    action: string
    target_identifier: string
    reason: string
    status?: string
    approval_token?: string | null
    requested_at?: Date | string
    approved_at?: Date | string | null
    expires_at?: Date | string | null
  }

  export type edit_requestsCreateOrConnectWithoutRequesterInput = {
    where: edit_requestsWhereUniqueInput
    create: XOR<edit_requestsCreateWithoutRequesterInput, edit_requestsUncheckedCreateWithoutRequesterInput>
  }

  export type edit_requestsCreateManyRequesterInputEnvelope = {
    data: edit_requestsCreateManyRequesterInput | edit_requestsCreateManyRequesterInput[]
    skipDuplicates?: boolean
  }

  export type edit_requestsCreateWithoutApproverInput = {
    module: string
    action: string
    target_identifier: string
    reason: string
    status?: string
    approval_token?: string | null
    requested_at?: Date | string
    approved_at?: Date | string | null
    expires_at?: Date | string | null
    requester: adminsCreateNestedOneWithoutEdit_requests_requestedInput
  }

  export type edit_requestsUncheckedCreateWithoutApproverInput = {
    id?: number
    requested_by_admin_id: number
    module: string
    action: string
    target_identifier: string
    reason: string
    status?: string
    approval_token?: string | null
    requested_at?: Date | string
    approved_at?: Date | string | null
    expires_at?: Date | string | null
  }

  export type edit_requestsCreateOrConnectWithoutApproverInput = {
    where: edit_requestsWhereUniqueInput
    create: XOR<edit_requestsCreateWithoutApproverInput, edit_requestsUncheckedCreateWithoutApproverInput>
  }

  export type edit_requestsCreateManyApproverInputEnvelope = {
    data: edit_requestsCreateManyApproverInput | edit_requestsCreateManyApproverInput[]
    skipDuplicates?: boolean
  }

  export type temporary_permissionsCreateWithoutAdminInput = {
    module: string
    target_identifier: string
    approved_by: number
    expires_at: Date | string
    created_at?: Date | string
  }

  export type temporary_permissionsUncheckedCreateWithoutAdminInput = {
    id?: number
    module: string
    target_identifier: string
    approved_by: number
    expires_at: Date | string
    created_at?: Date | string
  }

  export type temporary_permissionsCreateOrConnectWithoutAdminInput = {
    where: temporary_permissionsWhereUniqueInput
    create: XOR<temporary_permissionsCreateWithoutAdminInput, temporary_permissionsUncheckedCreateWithoutAdminInput>
  }

  export type temporary_permissionsCreateManyAdminInputEnvelope = {
    data: temporary_permissionsCreateManyAdminInput | temporary_permissionsCreateManyAdminInput[]
    skipDuplicates?: boolean
  }

  export type behavior_profilesUpsertWithWhereUniqueWithoutAdminsInput = {
    where: behavior_profilesWhereUniqueInput
    update: XOR<behavior_profilesUpdateWithoutAdminsInput, behavior_profilesUncheckedUpdateWithoutAdminsInput>
    create: XOR<behavior_profilesCreateWithoutAdminsInput, behavior_profilesUncheckedCreateWithoutAdminsInput>
  }

  export type behavior_profilesUpdateWithWhereUniqueWithoutAdminsInput = {
    where: behavior_profilesWhereUniqueInput
    data: XOR<behavior_profilesUpdateWithoutAdminsInput, behavior_profilesUncheckedUpdateWithoutAdminsInput>
  }

  export type behavior_profilesUpdateManyWithWhereWithoutAdminsInput = {
    where: behavior_profilesScalarWhereInput
    data: XOR<behavior_profilesUpdateManyMutationInput, behavior_profilesUncheckedUpdateManyWithoutAdminsInput>
  }

  export type behavior_profilesScalarWhereInput = {
    AND?: behavior_profilesScalarWhereInput | behavior_profilesScalarWhereInput[]
    OR?: behavior_profilesScalarWhereInput[]
    NOT?: behavior_profilesScalarWhereInput | behavior_profilesScalarWhereInput[]
    id?: IntFilter<"behavior_profiles"> | number
    admin_id?: IntFilter<"behavior_profiles"> | number
    enrollment_phrase?: StringFilter<"behavior_profiles"> | string
    avg_dwell_time?: DecimalNullableFilter<"behavior_profiles"> | Decimal | DecimalJsLike | number | string | null
    avg_flight_time?: DecimalNullableFilter<"behavior_profiles"> | Decimal | DecimalJsLike | number | string | null
    avg_typing_speed?: DecimalNullableFilter<"behavior_profiles"> | Decimal | DecimalJsLike | number | string | null
    avg_backspace_usage?: DecimalNullableFilter<"behavior_profiles"> | Decimal | DecimalJsLike | number | string | null
    avg_error_rate?: DecimalNullableFilter<"behavior_profiles"> | Decimal | DecimalJsLike | number | string | null
    created_at?: DateTimeNullableFilter<"behavior_profiles"> | Date | string | null
  }

  export type behavior_samplesUpsertWithWhereUniqueWithoutAdminsInput = {
    where: behavior_samplesWhereUniqueInput
    update: XOR<behavior_samplesUpdateWithoutAdminsInput, behavior_samplesUncheckedUpdateWithoutAdminsInput>
    create: XOR<behavior_samplesCreateWithoutAdminsInput, behavior_samplesUncheckedCreateWithoutAdminsInput>
  }

  export type behavior_samplesUpdateWithWhereUniqueWithoutAdminsInput = {
    where: behavior_samplesWhereUniqueInput
    data: XOR<behavior_samplesUpdateWithoutAdminsInput, behavior_samplesUncheckedUpdateWithoutAdminsInput>
  }

  export type behavior_samplesUpdateManyWithWhereWithoutAdminsInput = {
    where: behavior_samplesScalarWhereInput
    data: XOR<behavior_samplesUpdateManyMutationInput, behavior_samplesUncheckedUpdateManyWithoutAdminsInput>
  }

  export type behavior_samplesScalarWhereInput = {
    AND?: behavior_samplesScalarWhereInput | behavior_samplesScalarWhereInput[]
    OR?: behavior_samplesScalarWhereInput[]
    NOT?: behavior_samplesScalarWhereInput | behavior_samplesScalarWhereInput[]
    id?: IntFilter<"behavior_samples"> | number
    admin_id?: IntFilter<"behavior_samples"> | number
    dwell_time?: DecimalNullableFilter<"behavior_samples"> | Decimal | DecimalJsLike | number | string | null
    flight_time?: DecimalNullableFilter<"behavior_samples"> | Decimal | DecimalJsLike | number | string | null
    typing_speed?: DecimalNullableFilter<"behavior_samples"> | Decimal | DecimalJsLike | number | string | null
    backspace_usage?: DecimalNullableFilter<"behavior_samples"> | Decimal | DecimalJsLike | number | string | null
    error_rate?: DecimalNullableFilter<"behavior_samples"> | Decimal | DecimalJsLike | number | string | null
    similarity_score?: DecimalNullableFilter<"behavior_samples"> | Decimal | DecimalJsLike | number | string | null
    verification_result?: StringNullableFilter<"behavior_samples"> | string | null
    created_at?: DateTimeNullableFilter<"behavior_samples"> | Date | string | null
    sample_type?: StringNullableFilter<"behavior_samples"> | string | null
  }

  export type devicesUpsertWithWhereUniqueWithoutAdminsInput = {
    where: devicesWhereUniqueInput
    update: XOR<devicesUpdateWithoutAdminsInput, devicesUncheckedUpdateWithoutAdminsInput>
    create: XOR<devicesCreateWithoutAdminsInput, devicesUncheckedCreateWithoutAdminsInput>
  }

  export type devicesUpdateWithWhereUniqueWithoutAdminsInput = {
    where: devicesWhereUniqueInput
    data: XOR<devicesUpdateWithoutAdminsInput, devicesUncheckedUpdateWithoutAdminsInput>
  }

  export type devicesUpdateManyWithWhereWithoutAdminsInput = {
    where: devicesScalarWhereInput
    data: XOR<devicesUpdateManyMutationInput, devicesUncheckedUpdateManyWithoutAdminsInput>
  }

  export type devicesScalarWhereInput = {
    AND?: devicesScalarWhereInput | devicesScalarWhereInput[]
    OR?: devicesScalarWhereInput[]
    NOT?: devicesScalarWhereInput | devicesScalarWhereInput[]
    id?: IntFilter<"devices"> | number
    admin_id?: IntFilter<"devices"> | number
    device_fingerprint?: StringFilter<"devices"> | string
    device_name?: StringNullableFilter<"devices"> | string | null
    trust_score?: IntNullableFilter<"devices"> | number | null
    status?: StringNullableFilter<"devices"> | string | null
    registration_token_hash?: StringNullableFilter<"devices"> | string | null
    token_expires_at?: DateTimeNullableFilter<"devices"> | Date | string | null
    first_seen?: DateTimeNullableFilter<"devices"> | Date | string | null
    last_seen?: DateTimeNullableFilter<"devices"> | Date | string | null
    created_at?: DateTimeNullableFilter<"devices"> | Date | string | null
  }

  export type risk_eventsUpsertWithWhereUniqueWithoutAdminsInput = {
    where: risk_eventsWhereUniqueInput
    update: XOR<risk_eventsUpdateWithoutAdminsInput, risk_eventsUncheckedUpdateWithoutAdminsInput>
    create: XOR<risk_eventsCreateWithoutAdminsInput, risk_eventsUncheckedCreateWithoutAdminsInput>
  }

  export type risk_eventsUpdateWithWhereUniqueWithoutAdminsInput = {
    where: risk_eventsWhereUniqueInput
    data: XOR<risk_eventsUpdateWithoutAdminsInput, risk_eventsUncheckedUpdateWithoutAdminsInput>
  }

  export type risk_eventsUpdateManyWithWhereWithoutAdminsInput = {
    where: risk_eventsScalarWhereInput
    data: XOR<risk_eventsUpdateManyMutationInput, risk_eventsUncheckedUpdateManyWithoutAdminsInput>
  }

  export type risk_eventsScalarWhereInput = {
    AND?: risk_eventsScalarWhereInput | risk_eventsScalarWhereInput[]
    OR?: risk_eventsScalarWhereInput[]
    NOT?: risk_eventsScalarWhereInput | risk_eventsScalarWhereInput[]
    id?: IntFilter<"risk_events"> | number
    admin_id?: IntNullableFilter<"risk_events"> | number | null
    identity_score?: DecimalNullableFilter<"risk_events"> | Decimal | DecimalJsLike | number | string | null
    device_score?: DecimalNullableFilter<"risk_events"> | Decimal | DecimalJsLike | number | string | null
    behavior_score?: DecimalNullableFilter<"risk_events"> | Decimal | DecimalJsLike | number | string | null
    overall_risk_score?: DecimalNullableFilter<"risk_events"> | Decimal | DecimalJsLike | number | string | null
    decision?: StringNullableFilter<"risk_events"> | string | null
    created_at?: DateTimeNullableFilter<"risk_events"> | Date | string | null
  }

  export type admin_preferencesUpsertWithoutAdminInput = {
    update: XOR<admin_preferencesUpdateWithoutAdminInput, admin_preferencesUncheckedUpdateWithoutAdminInput>
    create: XOR<admin_preferencesCreateWithoutAdminInput, admin_preferencesUncheckedCreateWithoutAdminInput>
    where?: admin_preferencesWhereInput
  }

  export type admin_preferencesUpdateToOneWithWhereWithoutAdminInput = {
    where?: admin_preferencesWhereInput
    data: XOR<admin_preferencesUpdateWithoutAdminInput, admin_preferencesUncheckedUpdateWithoutAdminInput>
  }

  export type admin_preferencesUpdateWithoutAdminInput = {
    language?: StringFieldUpdateOperationsInput | string
    theme?: StringFieldUpdateOperationsInput | string
    date_format?: StringFieldUpdateOperationsInput | string
    time_format?: StringFieldUpdateOperationsInput | string
    default_dashboard?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type admin_preferencesUncheckedUpdateWithoutAdminInput = {
    id?: IntFieldUpdateOperationsInput | number
    language?: StringFieldUpdateOperationsInput | string
    theme?: StringFieldUpdateOperationsInput | string
    date_format?: StringFieldUpdateOperationsInput | string
    time_format?: StringFieldUpdateOperationsInput | string
    default_dashboard?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type edit_requestsUpsertWithWhereUniqueWithoutRequesterInput = {
    where: edit_requestsWhereUniqueInput
    update: XOR<edit_requestsUpdateWithoutRequesterInput, edit_requestsUncheckedUpdateWithoutRequesterInput>
    create: XOR<edit_requestsCreateWithoutRequesterInput, edit_requestsUncheckedCreateWithoutRequesterInput>
  }

  export type edit_requestsUpdateWithWhereUniqueWithoutRequesterInput = {
    where: edit_requestsWhereUniqueInput
    data: XOR<edit_requestsUpdateWithoutRequesterInput, edit_requestsUncheckedUpdateWithoutRequesterInput>
  }

  export type edit_requestsUpdateManyWithWhereWithoutRequesterInput = {
    where: edit_requestsScalarWhereInput
    data: XOR<edit_requestsUpdateManyMutationInput, edit_requestsUncheckedUpdateManyWithoutRequesterInput>
  }

  export type edit_requestsScalarWhereInput = {
    AND?: edit_requestsScalarWhereInput | edit_requestsScalarWhereInput[]
    OR?: edit_requestsScalarWhereInput[]
    NOT?: edit_requestsScalarWhereInput | edit_requestsScalarWhereInput[]
    id?: IntFilter<"edit_requests"> | number
    requested_by_admin_id?: IntFilter<"edit_requests"> | number
    approved_by_admin_id?: IntNullableFilter<"edit_requests"> | number | null
    module?: StringFilter<"edit_requests"> | string
    action?: StringFilter<"edit_requests"> | string
    target_identifier?: StringFilter<"edit_requests"> | string
    reason?: StringFilter<"edit_requests"> | string
    status?: StringFilter<"edit_requests"> | string
    approval_token?: StringNullableFilter<"edit_requests"> | string | null
    requested_at?: DateTimeFilter<"edit_requests"> | Date | string
    approved_at?: DateTimeNullableFilter<"edit_requests"> | Date | string | null
    expires_at?: DateTimeNullableFilter<"edit_requests"> | Date | string | null
  }

  export type edit_requestsUpsertWithWhereUniqueWithoutApproverInput = {
    where: edit_requestsWhereUniqueInput
    update: XOR<edit_requestsUpdateWithoutApproverInput, edit_requestsUncheckedUpdateWithoutApproverInput>
    create: XOR<edit_requestsCreateWithoutApproverInput, edit_requestsUncheckedCreateWithoutApproverInput>
  }

  export type edit_requestsUpdateWithWhereUniqueWithoutApproverInput = {
    where: edit_requestsWhereUniqueInput
    data: XOR<edit_requestsUpdateWithoutApproverInput, edit_requestsUncheckedUpdateWithoutApproverInput>
  }

  export type edit_requestsUpdateManyWithWhereWithoutApproverInput = {
    where: edit_requestsScalarWhereInput
    data: XOR<edit_requestsUpdateManyMutationInput, edit_requestsUncheckedUpdateManyWithoutApproverInput>
  }

  export type temporary_permissionsUpsertWithWhereUniqueWithoutAdminInput = {
    where: temporary_permissionsWhereUniqueInput
    update: XOR<temporary_permissionsUpdateWithoutAdminInput, temporary_permissionsUncheckedUpdateWithoutAdminInput>
    create: XOR<temporary_permissionsCreateWithoutAdminInput, temporary_permissionsUncheckedCreateWithoutAdminInput>
  }

  export type temporary_permissionsUpdateWithWhereUniqueWithoutAdminInput = {
    where: temporary_permissionsWhereUniqueInput
    data: XOR<temporary_permissionsUpdateWithoutAdminInput, temporary_permissionsUncheckedUpdateWithoutAdminInput>
  }

  export type temporary_permissionsUpdateManyWithWhereWithoutAdminInput = {
    where: temporary_permissionsScalarWhereInput
    data: XOR<temporary_permissionsUpdateManyMutationInput, temporary_permissionsUncheckedUpdateManyWithoutAdminInput>
  }

  export type temporary_permissionsScalarWhereInput = {
    AND?: temporary_permissionsScalarWhereInput | temporary_permissionsScalarWhereInput[]
    OR?: temporary_permissionsScalarWhereInput[]
    NOT?: temporary_permissionsScalarWhereInput | temporary_permissionsScalarWhereInput[]
    id?: IntFilter<"temporary_permissions"> | number
    admin_id?: IntFilter<"temporary_permissions"> | number
    module?: StringFilter<"temporary_permissions"> | string
    target_identifier?: StringFilter<"temporary_permissions"> | string
    approved_by?: IntFilter<"temporary_permissions"> | number
    expires_at?: DateTimeFilter<"temporary_permissions"> | Date | string
    created_at?: DateTimeFilter<"temporary_permissions"> | Date | string
  }

  export type adminsCreateWithoutPreferencesInput = {
    full_name: string
    email: string
    password_hash: string
    created_at?: Date | string | null
    role?: string
    phone_number?: string | null
    parent_admin_id?: number | null
    status?: string | null
    behavior_profiles?: behavior_profilesCreateNestedManyWithoutAdminsInput
    behavior_samples?: behavior_samplesCreateNestedManyWithoutAdminsInput
    devices?: devicesCreateNestedManyWithoutAdminsInput
    risk_events?: risk_eventsCreateNestedManyWithoutAdminsInput
    edit_requests_requested?: edit_requestsCreateNestedManyWithoutRequesterInput
    edit_requests_approved?: edit_requestsCreateNestedManyWithoutApproverInput
    temporary_permissions?: temporary_permissionsCreateNestedManyWithoutAdminInput
  }

  export type adminsUncheckedCreateWithoutPreferencesInput = {
    id?: number
    full_name: string
    email: string
    password_hash: string
    created_at?: Date | string | null
    role?: string
    phone_number?: string | null
    parent_admin_id?: number | null
    status?: string | null
    behavior_profiles?: behavior_profilesUncheckedCreateNestedManyWithoutAdminsInput
    behavior_samples?: behavior_samplesUncheckedCreateNestedManyWithoutAdminsInput
    devices?: devicesUncheckedCreateNestedManyWithoutAdminsInput
    risk_events?: risk_eventsUncheckedCreateNestedManyWithoutAdminsInput
    edit_requests_requested?: edit_requestsUncheckedCreateNestedManyWithoutRequesterInput
    edit_requests_approved?: edit_requestsUncheckedCreateNestedManyWithoutApproverInput
    temporary_permissions?: temporary_permissionsUncheckedCreateNestedManyWithoutAdminInput
  }

  export type adminsCreateOrConnectWithoutPreferencesInput = {
    where: adminsWhereUniqueInput
    create: XOR<adminsCreateWithoutPreferencesInput, adminsUncheckedCreateWithoutPreferencesInput>
  }

  export type adminsUpsertWithoutPreferencesInput = {
    update: XOR<adminsUpdateWithoutPreferencesInput, adminsUncheckedUpdateWithoutPreferencesInput>
    create: XOR<adminsCreateWithoutPreferencesInput, adminsUncheckedCreateWithoutPreferencesInput>
    where?: adminsWhereInput
  }

  export type adminsUpdateToOneWithWhereWithoutPreferencesInput = {
    where?: adminsWhereInput
    data: XOR<adminsUpdateWithoutPreferencesInput, adminsUncheckedUpdateWithoutPreferencesInput>
  }

  export type adminsUpdateWithoutPreferencesInput = {
    full_name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    role?: StringFieldUpdateOperationsInput | string
    phone_number?: NullableStringFieldUpdateOperationsInput | string | null
    parent_admin_id?: NullableIntFieldUpdateOperationsInput | number | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    behavior_profiles?: behavior_profilesUpdateManyWithoutAdminsNestedInput
    behavior_samples?: behavior_samplesUpdateManyWithoutAdminsNestedInput
    devices?: devicesUpdateManyWithoutAdminsNestedInput
    risk_events?: risk_eventsUpdateManyWithoutAdminsNestedInput
    edit_requests_requested?: edit_requestsUpdateManyWithoutRequesterNestedInput
    edit_requests_approved?: edit_requestsUpdateManyWithoutApproverNestedInput
    temporary_permissions?: temporary_permissionsUpdateManyWithoutAdminNestedInput
  }

  export type adminsUncheckedUpdateWithoutPreferencesInput = {
    id?: IntFieldUpdateOperationsInput | number
    full_name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    role?: StringFieldUpdateOperationsInput | string
    phone_number?: NullableStringFieldUpdateOperationsInput | string | null
    parent_admin_id?: NullableIntFieldUpdateOperationsInput | number | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    behavior_profiles?: behavior_profilesUncheckedUpdateManyWithoutAdminsNestedInput
    behavior_samples?: behavior_samplesUncheckedUpdateManyWithoutAdminsNestedInput
    devices?: devicesUncheckedUpdateManyWithoutAdminsNestedInput
    risk_events?: risk_eventsUncheckedUpdateManyWithoutAdminsNestedInput
    edit_requests_requested?: edit_requestsUncheckedUpdateManyWithoutRequesterNestedInput
    edit_requests_approved?: edit_requestsUncheckedUpdateManyWithoutApproverNestedInput
    temporary_permissions?: temporary_permissionsUncheckedUpdateManyWithoutAdminNestedInput
  }

  export type adminsCreateWithoutBehavior_profilesInput = {
    full_name: string
    email: string
    password_hash: string
    created_at?: Date | string | null
    role?: string
    phone_number?: string | null
    parent_admin_id?: number | null
    status?: string | null
    behavior_samples?: behavior_samplesCreateNestedManyWithoutAdminsInput
    devices?: devicesCreateNestedManyWithoutAdminsInput
    risk_events?: risk_eventsCreateNestedManyWithoutAdminsInput
    preferences?: admin_preferencesCreateNestedOneWithoutAdminInput
    edit_requests_requested?: edit_requestsCreateNestedManyWithoutRequesterInput
    edit_requests_approved?: edit_requestsCreateNestedManyWithoutApproverInput
    temporary_permissions?: temporary_permissionsCreateNestedManyWithoutAdminInput
  }

  export type adminsUncheckedCreateWithoutBehavior_profilesInput = {
    id?: number
    full_name: string
    email: string
    password_hash: string
    created_at?: Date | string | null
    role?: string
    phone_number?: string | null
    parent_admin_id?: number | null
    status?: string | null
    behavior_samples?: behavior_samplesUncheckedCreateNestedManyWithoutAdminsInput
    devices?: devicesUncheckedCreateNestedManyWithoutAdminsInput
    risk_events?: risk_eventsUncheckedCreateNestedManyWithoutAdminsInput
    preferences?: admin_preferencesUncheckedCreateNestedOneWithoutAdminInput
    edit_requests_requested?: edit_requestsUncheckedCreateNestedManyWithoutRequesterInput
    edit_requests_approved?: edit_requestsUncheckedCreateNestedManyWithoutApproverInput
    temporary_permissions?: temporary_permissionsUncheckedCreateNestedManyWithoutAdminInput
  }

  export type adminsCreateOrConnectWithoutBehavior_profilesInput = {
    where: adminsWhereUniqueInput
    create: XOR<adminsCreateWithoutBehavior_profilesInput, adminsUncheckedCreateWithoutBehavior_profilesInput>
  }

  export type adminsUpsertWithoutBehavior_profilesInput = {
    update: XOR<adminsUpdateWithoutBehavior_profilesInput, adminsUncheckedUpdateWithoutBehavior_profilesInput>
    create: XOR<adminsCreateWithoutBehavior_profilesInput, adminsUncheckedCreateWithoutBehavior_profilesInput>
    where?: adminsWhereInput
  }

  export type adminsUpdateToOneWithWhereWithoutBehavior_profilesInput = {
    where?: adminsWhereInput
    data: XOR<adminsUpdateWithoutBehavior_profilesInput, adminsUncheckedUpdateWithoutBehavior_profilesInput>
  }

  export type adminsUpdateWithoutBehavior_profilesInput = {
    full_name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    role?: StringFieldUpdateOperationsInput | string
    phone_number?: NullableStringFieldUpdateOperationsInput | string | null
    parent_admin_id?: NullableIntFieldUpdateOperationsInput | number | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    behavior_samples?: behavior_samplesUpdateManyWithoutAdminsNestedInput
    devices?: devicesUpdateManyWithoutAdminsNestedInput
    risk_events?: risk_eventsUpdateManyWithoutAdminsNestedInput
    preferences?: admin_preferencesUpdateOneWithoutAdminNestedInput
    edit_requests_requested?: edit_requestsUpdateManyWithoutRequesterNestedInput
    edit_requests_approved?: edit_requestsUpdateManyWithoutApproverNestedInput
    temporary_permissions?: temporary_permissionsUpdateManyWithoutAdminNestedInput
  }

  export type adminsUncheckedUpdateWithoutBehavior_profilesInput = {
    id?: IntFieldUpdateOperationsInput | number
    full_name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    role?: StringFieldUpdateOperationsInput | string
    phone_number?: NullableStringFieldUpdateOperationsInput | string | null
    parent_admin_id?: NullableIntFieldUpdateOperationsInput | number | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    behavior_samples?: behavior_samplesUncheckedUpdateManyWithoutAdminsNestedInput
    devices?: devicesUncheckedUpdateManyWithoutAdminsNestedInput
    risk_events?: risk_eventsUncheckedUpdateManyWithoutAdminsNestedInput
    preferences?: admin_preferencesUncheckedUpdateOneWithoutAdminNestedInput
    edit_requests_requested?: edit_requestsUncheckedUpdateManyWithoutRequesterNestedInput
    edit_requests_approved?: edit_requestsUncheckedUpdateManyWithoutApproverNestedInput
    temporary_permissions?: temporary_permissionsUncheckedUpdateManyWithoutAdminNestedInput
  }

  export type adminsCreateWithoutBehavior_samplesInput = {
    full_name: string
    email: string
    password_hash: string
    created_at?: Date | string | null
    role?: string
    phone_number?: string | null
    parent_admin_id?: number | null
    status?: string | null
    behavior_profiles?: behavior_profilesCreateNestedManyWithoutAdminsInput
    devices?: devicesCreateNestedManyWithoutAdminsInput
    risk_events?: risk_eventsCreateNestedManyWithoutAdminsInput
    preferences?: admin_preferencesCreateNestedOneWithoutAdminInput
    edit_requests_requested?: edit_requestsCreateNestedManyWithoutRequesterInput
    edit_requests_approved?: edit_requestsCreateNestedManyWithoutApproverInput
    temporary_permissions?: temporary_permissionsCreateNestedManyWithoutAdminInput
  }

  export type adminsUncheckedCreateWithoutBehavior_samplesInput = {
    id?: number
    full_name: string
    email: string
    password_hash: string
    created_at?: Date | string | null
    role?: string
    phone_number?: string | null
    parent_admin_id?: number | null
    status?: string | null
    behavior_profiles?: behavior_profilesUncheckedCreateNestedManyWithoutAdminsInput
    devices?: devicesUncheckedCreateNestedManyWithoutAdminsInput
    risk_events?: risk_eventsUncheckedCreateNestedManyWithoutAdminsInput
    preferences?: admin_preferencesUncheckedCreateNestedOneWithoutAdminInput
    edit_requests_requested?: edit_requestsUncheckedCreateNestedManyWithoutRequesterInput
    edit_requests_approved?: edit_requestsUncheckedCreateNestedManyWithoutApproverInput
    temporary_permissions?: temporary_permissionsUncheckedCreateNestedManyWithoutAdminInput
  }

  export type adminsCreateOrConnectWithoutBehavior_samplesInput = {
    where: adminsWhereUniqueInput
    create: XOR<adminsCreateWithoutBehavior_samplesInput, adminsUncheckedCreateWithoutBehavior_samplesInput>
  }

  export type adminsUpsertWithoutBehavior_samplesInput = {
    update: XOR<adminsUpdateWithoutBehavior_samplesInput, adminsUncheckedUpdateWithoutBehavior_samplesInput>
    create: XOR<adminsCreateWithoutBehavior_samplesInput, adminsUncheckedCreateWithoutBehavior_samplesInput>
    where?: adminsWhereInput
  }

  export type adminsUpdateToOneWithWhereWithoutBehavior_samplesInput = {
    where?: adminsWhereInput
    data: XOR<adminsUpdateWithoutBehavior_samplesInput, adminsUncheckedUpdateWithoutBehavior_samplesInput>
  }

  export type adminsUpdateWithoutBehavior_samplesInput = {
    full_name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    role?: StringFieldUpdateOperationsInput | string
    phone_number?: NullableStringFieldUpdateOperationsInput | string | null
    parent_admin_id?: NullableIntFieldUpdateOperationsInput | number | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    behavior_profiles?: behavior_profilesUpdateManyWithoutAdminsNestedInput
    devices?: devicesUpdateManyWithoutAdminsNestedInput
    risk_events?: risk_eventsUpdateManyWithoutAdminsNestedInput
    preferences?: admin_preferencesUpdateOneWithoutAdminNestedInput
    edit_requests_requested?: edit_requestsUpdateManyWithoutRequesterNestedInput
    edit_requests_approved?: edit_requestsUpdateManyWithoutApproverNestedInput
    temporary_permissions?: temporary_permissionsUpdateManyWithoutAdminNestedInput
  }

  export type adminsUncheckedUpdateWithoutBehavior_samplesInput = {
    id?: IntFieldUpdateOperationsInput | number
    full_name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    role?: StringFieldUpdateOperationsInput | string
    phone_number?: NullableStringFieldUpdateOperationsInput | string | null
    parent_admin_id?: NullableIntFieldUpdateOperationsInput | number | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    behavior_profiles?: behavior_profilesUncheckedUpdateManyWithoutAdminsNestedInput
    devices?: devicesUncheckedUpdateManyWithoutAdminsNestedInput
    risk_events?: risk_eventsUncheckedUpdateManyWithoutAdminsNestedInput
    preferences?: admin_preferencesUncheckedUpdateOneWithoutAdminNestedInput
    edit_requests_requested?: edit_requestsUncheckedUpdateManyWithoutRequesterNestedInput
    edit_requests_approved?: edit_requestsUncheckedUpdateManyWithoutApproverNestedInput
    temporary_permissions?: temporary_permissionsUncheckedUpdateManyWithoutAdminNestedInput
  }

  export type adminsCreateWithoutDevicesInput = {
    full_name: string
    email: string
    password_hash: string
    created_at?: Date | string | null
    role?: string
    phone_number?: string | null
    parent_admin_id?: number | null
    status?: string | null
    behavior_profiles?: behavior_profilesCreateNestedManyWithoutAdminsInput
    behavior_samples?: behavior_samplesCreateNestedManyWithoutAdminsInput
    risk_events?: risk_eventsCreateNestedManyWithoutAdminsInput
    preferences?: admin_preferencesCreateNestedOneWithoutAdminInput
    edit_requests_requested?: edit_requestsCreateNestedManyWithoutRequesterInput
    edit_requests_approved?: edit_requestsCreateNestedManyWithoutApproverInput
    temporary_permissions?: temporary_permissionsCreateNestedManyWithoutAdminInput
  }

  export type adminsUncheckedCreateWithoutDevicesInput = {
    id?: number
    full_name: string
    email: string
    password_hash: string
    created_at?: Date | string | null
    role?: string
    phone_number?: string | null
    parent_admin_id?: number | null
    status?: string | null
    behavior_profiles?: behavior_profilesUncheckedCreateNestedManyWithoutAdminsInput
    behavior_samples?: behavior_samplesUncheckedCreateNestedManyWithoutAdminsInput
    risk_events?: risk_eventsUncheckedCreateNestedManyWithoutAdminsInput
    preferences?: admin_preferencesUncheckedCreateNestedOneWithoutAdminInput
    edit_requests_requested?: edit_requestsUncheckedCreateNestedManyWithoutRequesterInput
    edit_requests_approved?: edit_requestsUncheckedCreateNestedManyWithoutApproverInput
    temporary_permissions?: temporary_permissionsUncheckedCreateNestedManyWithoutAdminInput
  }

  export type adminsCreateOrConnectWithoutDevicesInput = {
    where: adminsWhereUniqueInput
    create: XOR<adminsCreateWithoutDevicesInput, adminsUncheckedCreateWithoutDevicesInput>
  }

  export type adminsUpsertWithoutDevicesInput = {
    update: XOR<adminsUpdateWithoutDevicesInput, adminsUncheckedUpdateWithoutDevicesInput>
    create: XOR<adminsCreateWithoutDevicesInput, adminsUncheckedCreateWithoutDevicesInput>
    where?: adminsWhereInput
  }

  export type adminsUpdateToOneWithWhereWithoutDevicesInput = {
    where?: adminsWhereInput
    data: XOR<adminsUpdateWithoutDevicesInput, adminsUncheckedUpdateWithoutDevicesInput>
  }

  export type adminsUpdateWithoutDevicesInput = {
    full_name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    role?: StringFieldUpdateOperationsInput | string
    phone_number?: NullableStringFieldUpdateOperationsInput | string | null
    parent_admin_id?: NullableIntFieldUpdateOperationsInput | number | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    behavior_profiles?: behavior_profilesUpdateManyWithoutAdminsNestedInput
    behavior_samples?: behavior_samplesUpdateManyWithoutAdminsNestedInput
    risk_events?: risk_eventsUpdateManyWithoutAdminsNestedInput
    preferences?: admin_preferencesUpdateOneWithoutAdminNestedInput
    edit_requests_requested?: edit_requestsUpdateManyWithoutRequesterNestedInput
    edit_requests_approved?: edit_requestsUpdateManyWithoutApproverNestedInput
    temporary_permissions?: temporary_permissionsUpdateManyWithoutAdminNestedInput
  }

  export type adminsUncheckedUpdateWithoutDevicesInput = {
    id?: IntFieldUpdateOperationsInput | number
    full_name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    role?: StringFieldUpdateOperationsInput | string
    phone_number?: NullableStringFieldUpdateOperationsInput | string | null
    parent_admin_id?: NullableIntFieldUpdateOperationsInput | number | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    behavior_profiles?: behavior_profilesUncheckedUpdateManyWithoutAdminsNestedInput
    behavior_samples?: behavior_samplesUncheckedUpdateManyWithoutAdminsNestedInput
    risk_events?: risk_eventsUncheckedUpdateManyWithoutAdminsNestedInput
    preferences?: admin_preferencesUncheckedUpdateOneWithoutAdminNestedInput
    edit_requests_requested?: edit_requestsUncheckedUpdateManyWithoutRequesterNestedInput
    edit_requests_approved?: edit_requestsUncheckedUpdateManyWithoutApproverNestedInput
    temporary_permissions?: temporary_permissionsUncheckedUpdateManyWithoutAdminNestedInput
  }

  export type adminsCreateWithoutRisk_eventsInput = {
    full_name: string
    email: string
    password_hash: string
    created_at?: Date | string | null
    role?: string
    phone_number?: string | null
    parent_admin_id?: number | null
    status?: string | null
    behavior_profiles?: behavior_profilesCreateNestedManyWithoutAdminsInput
    behavior_samples?: behavior_samplesCreateNestedManyWithoutAdminsInput
    devices?: devicesCreateNestedManyWithoutAdminsInput
    preferences?: admin_preferencesCreateNestedOneWithoutAdminInput
    edit_requests_requested?: edit_requestsCreateNestedManyWithoutRequesterInput
    edit_requests_approved?: edit_requestsCreateNestedManyWithoutApproverInput
    temporary_permissions?: temporary_permissionsCreateNestedManyWithoutAdminInput
  }

  export type adminsUncheckedCreateWithoutRisk_eventsInput = {
    id?: number
    full_name: string
    email: string
    password_hash: string
    created_at?: Date | string | null
    role?: string
    phone_number?: string | null
    parent_admin_id?: number | null
    status?: string | null
    behavior_profiles?: behavior_profilesUncheckedCreateNestedManyWithoutAdminsInput
    behavior_samples?: behavior_samplesUncheckedCreateNestedManyWithoutAdminsInput
    devices?: devicesUncheckedCreateNestedManyWithoutAdminsInput
    preferences?: admin_preferencesUncheckedCreateNestedOneWithoutAdminInput
    edit_requests_requested?: edit_requestsUncheckedCreateNestedManyWithoutRequesterInput
    edit_requests_approved?: edit_requestsUncheckedCreateNestedManyWithoutApproverInput
    temporary_permissions?: temporary_permissionsUncheckedCreateNestedManyWithoutAdminInput
  }

  export type adminsCreateOrConnectWithoutRisk_eventsInput = {
    where: adminsWhereUniqueInput
    create: XOR<adminsCreateWithoutRisk_eventsInput, adminsUncheckedCreateWithoutRisk_eventsInput>
  }

  export type adminsUpsertWithoutRisk_eventsInput = {
    update: XOR<adminsUpdateWithoutRisk_eventsInput, adminsUncheckedUpdateWithoutRisk_eventsInput>
    create: XOR<adminsCreateWithoutRisk_eventsInput, adminsUncheckedCreateWithoutRisk_eventsInput>
    where?: adminsWhereInput
  }

  export type adminsUpdateToOneWithWhereWithoutRisk_eventsInput = {
    where?: adminsWhereInput
    data: XOR<adminsUpdateWithoutRisk_eventsInput, adminsUncheckedUpdateWithoutRisk_eventsInput>
  }

  export type adminsUpdateWithoutRisk_eventsInput = {
    full_name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    role?: StringFieldUpdateOperationsInput | string
    phone_number?: NullableStringFieldUpdateOperationsInput | string | null
    parent_admin_id?: NullableIntFieldUpdateOperationsInput | number | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    behavior_profiles?: behavior_profilesUpdateManyWithoutAdminsNestedInput
    behavior_samples?: behavior_samplesUpdateManyWithoutAdminsNestedInput
    devices?: devicesUpdateManyWithoutAdminsNestedInput
    preferences?: admin_preferencesUpdateOneWithoutAdminNestedInput
    edit_requests_requested?: edit_requestsUpdateManyWithoutRequesterNestedInput
    edit_requests_approved?: edit_requestsUpdateManyWithoutApproverNestedInput
    temporary_permissions?: temporary_permissionsUpdateManyWithoutAdminNestedInput
  }

  export type adminsUncheckedUpdateWithoutRisk_eventsInput = {
    id?: IntFieldUpdateOperationsInput | number
    full_name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    role?: StringFieldUpdateOperationsInput | string
    phone_number?: NullableStringFieldUpdateOperationsInput | string | null
    parent_admin_id?: NullableIntFieldUpdateOperationsInput | number | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    behavior_profiles?: behavior_profilesUncheckedUpdateManyWithoutAdminsNestedInput
    behavior_samples?: behavior_samplesUncheckedUpdateManyWithoutAdminsNestedInput
    devices?: devicesUncheckedUpdateManyWithoutAdminsNestedInput
    preferences?: admin_preferencesUncheckedUpdateOneWithoutAdminNestedInput
    edit_requests_requested?: edit_requestsUncheckedUpdateManyWithoutRequesterNestedInput
    edit_requests_approved?: edit_requestsUncheckedUpdateManyWithoutApproverNestedInput
    temporary_permissions?: temporary_permissionsUncheckedUpdateManyWithoutAdminNestedInput
  }

  export type adminsCreateWithoutEdit_requests_requestedInput = {
    full_name: string
    email: string
    password_hash: string
    created_at?: Date | string | null
    role?: string
    phone_number?: string | null
    parent_admin_id?: number | null
    status?: string | null
    behavior_profiles?: behavior_profilesCreateNestedManyWithoutAdminsInput
    behavior_samples?: behavior_samplesCreateNestedManyWithoutAdminsInput
    devices?: devicesCreateNestedManyWithoutAdminsInput
    risk_events?: risk_eventsCreateNestedManyWithoutAdminsInput
    preferences?: admin_preferencesCreateNestedOneWithoutAdminInput
    edit_requests_approved?: edit_requestsCreateNestedManyWithoutApproverInput
    temporary_permissions?: temporary_permissionsCreateNestedManyWithoutAdminInput
  }

  export type adminsUncheckedCreateWithoutEdit_requests_requestedInput = {
    id?: number
    full_name: string
    email: string
    password_hash: string
    created_at?: Date | string | null
    role?: string
    phone_number?: string | null
    parent_admin_id?: number | null
    status?: string | null
    behavior_profiles?: behavior_profilesUncheckedCreateNestedManyWithoutAdminsInput
    behavior_samples?: behavior_samplesUncheckedCreateNestedManyWithoutAdminsInput
    devices?: devicesUncheckedCreateNestedManyWithoutAdminsInput
    risk_events?: risk_eventsUncheckedCreateNestedManyWithoutAdminsInput
    preferences?: admin_preferencesUncheckedCreateNestedOneWithoutAdminInput
    edit_requests_approved?: edit_requestsUncheckedCreateNestedManyWithoutApproverInput
    temporary_permissions?: temporary_permissionsUncheckedCreateNestedManyWithoutAdminInput
  }

  export type adminsCreateOrConnectWithoutEdit_requests_requestedInput = {
    where: adminsWhereUniqueInput
    create: XOR<adminsCreateWithoutEdit_requests_requestedInput, adminsUncheckedCreateWithoutEdit_requests_requestedInput>
  }

  export type adminsCreateWithoutEdit_requests_approvedInput = {
    full_name: string
    email: string
    password_hash: string
    created_at?: Date | string | null
    role?: string
    phone_number?: string | null
    parent_admin_id?: number | null
    status?: string | null
    behavior_profiles?: behavior_profilesCreateNestedManyWithoutAdminsInput
    behavior_samples?: behavior_samplesCreateNestedManyWithoutAdminsInput
    devices?: devicesCreateNestedManyWithoutAdminsInput
    risk_events?: risk_eventsCreateNestedManyWithoutAdminsInput
    preferences?: admin_preferencesCreateNestedOneWithoutAdminInput
    edit_requests_requested?: edit_requestsCreateNestedManyWithoutRequesterInput
    temporary_permissions?: temporary_permissionsCreateNestedManyWithoutAdminInput
  }

  export type adminsUncheckedCreateWithoutEdit_requests_approvedInput = {
    id?: number
    full_name: string
    email: string
    password_hash: string
    created_at?: Date | string | null
    role?: string
    phone_number?: string | null
    parent_admin_id?: number | null
    status?: string | null
    behavior_profiles?: behavior_profilesUncheckedCreateNestedManyWithoutAdminsInput
    behavior_samples?: behavior_samplesUncheckedCreateNestedManyWithoutAdminsInput
    devices?: devicesUncheckedCreateNestedManyWithoutAdminsInput
    risk_events?: risk_eventsUncheckedCreateNestedManyWithoutAdminsInput
    preferences?: admin_preferencesUncheckedCreateNestedOneWithoutAdminInput
    edit_requests_requested?: edit_requestsUncheckedCreateNestedManyWithoutRequesterInput
    temporary_permissions?: temporary_permissionsUncheckedCreateNestedManyWithoutAdminInput
  }

  export type adminsCreateOrConnectWithoutEdit_requests_approvedInput = {
    where: adminsWhereUniqueInput
    create: XOR<adminsCreateWithoutEdit_requests_approvedInput, adminsUncheckedCreateWithoutEdit_requests_approvedInput>
  }

  export type adminsUpsertWithoutEdit_requests_requestedInput = {
    update: XOR<adminsUpdateWithoutEdit_requests_requestedInput, adminsUncheckedUpdateWithoutEdit_requests_requestedInput>
    create: XOR<adminsCreateWithoutEdit_requests_requestedInput, adminsUncheckedCreateWithoutEdit_requests_requestedInput>
    where?: adminsWhereInput
  }

  export type adminsUpdateToOneWithWhereWithoutEdit_requests_requestedInput = {
    where?: adminsWhereInput
    data: XOR<adminsUpdateWithoutEdit_requests_requestedInput, adminsUncheckedUpdateWithoutEdit_requests_requestedInput>
  }

  export type adminsUpdateWithoutEdit_requests_requestedInput = {
    full_name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    role?: StringFieldUpdateOperationsInput | string
    phone_number?: NullableStringFieldUpdateOperationsInput | string | null
    parent_admin_id?: NullableIntFieldUpdateOperationsInput | number | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    behavior_profiles?: behavior_profilesUpdateManyWithoutAdminsNestedInput
    behavior_samples?: behavior_samplesUpdateManyWithoutAdminsNestedInput
    devices?: devicesUpdateManyWithoutAdminsNestedInput
    risk_events?: risk_eventsUpdateManyWithoutAdminsNestedInput
    preferences?: admin_preferencesUpdateOneWithoutAdminNestedInput
    edit_requests_approved?: edit_requestsUpdateManyWithoutApproverNestedInput
    temporary_permissions?: temporary_permissionsUpdateManyWithoutAdminNestedInput
  }

  export type adminsUncheckedUpdateWithoutEdit_requests_requestedInput = {
    id?: IntFieldUpdateOperationsInput | number
    full_name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    role?: StringFieldUpdateOperationsInput | string
    phone_number?: NullableStringFieldUpdateOperationsInput | string | null
    parent_admin_id?: NullableIntFieldUpdateOperationsInput | number | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    behavior_profiles?: behavior_profilesUncheckedUpdateManyWithoutAdminsNestedInput
    behavior_samples?: behavior_samplesUncheckedUpdateManyWithoutAdminsNestedInput
    devices?: devicesUncheckedUpdateManyWithoutAdminsNestedInput
    risk_events?: risk_eventsUncheckedUpdateManyWithoutAdminsNestedInput
    preferences?: admin_preferencesUncheckedUpdateOneWithoutAdminNestedInput
    edit_requests_approved?: edit_requestsUncheckedUpdateManyWithoutApproverNestedInput
    temporary_permissions?: temporary_permissionsUncheckedUpdateManyWithoutAdminNestedInput
  }

  export type adminsUpsertWithoutEdit_requests_approvedInput = {
    update: XOR<adminsUpdateWithoutEdit_requests_approvedInput, adminsUncheckedUpdateWithoutEdit_requests_approvedInput>
    create: XOR<adminsCreateWithoutEdit_requests_approvedInput, adminsUncheckedCreateWithoutEdit_requests_approvedInput>
    where?: adminsWhereInput
  }

  export type adminsUpdateToOneWithWhereWithoutEdit_requests_approvedInput = {
    where?: adminsWhereInput
    data: XOR<adminsUpdateWithoutEdit_requests_approvedInput, adminsUncheckedUpdateWithoutEdit_requests_approvedInput>
  }

  export type adminsUpdateWithoutEdit_requests_approvedInput = {
    full_name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    role?: StringFieldUpdateOperationsInput | string
    phone_number?: NullableStringFieldUpdateOperationsInput | string | null
    parent_admin_id?: NullableIntFieldUpdateOperationsInput | number | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    behavior_profiles?: behavior_profilesUpdateManyWithoutAdminsNestedInput
    behavior_samples?: behavior_samplesUpdateManyWithoutAdminsNestedInput
    devices?: devicesUpdateManyWithoutAdminsNestedInput
    risk_events?: risk_eventsUpdateManyWithoutAdminsNestedInput
    preferences?: admin_preferencesUpdateOneWithoutAdminNestedInput
    edit_requests_requested?: edit_requestsUpdateManyWithoutRequesterNestedInput
    temporary_permissions?: temporary_permissionsUpdateManyWithoutAdminNestedInput
  }

  export type adminsUncheckedUpdateWithoutEdit_requests_approvedInput = {
    id?: IntFieldUpdateOperationsInput | number
    full_name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    role?: StringFieldUpdateOperationsInput | string
    phone_number?: NullableStringFieldUpdateOperationsInput | string | null
    parent_admin_id?: NullableIntFieldUpdateOperationsInput | number | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    behavior_profiles?: behavior_profilesUncheckedUpdateManyWithoutAdminsNestedInput
    behavior_samples?: behavior_samplesUncheckedUpdateManyWithoutAdminsNestedInput
    devices?: devicesUncheckedUpdateManyWithoutAdminsNestedInput
    risk_events?: risk_eventsUncheckedUpdateManyWithoutAdminsNestedInput
    preferences?: admin_preferencesUncheckedUpdateOneWithoutAdminNestedInput
    edit_requests_requested?: edit_requestsUncheckedUpdateManyWithoutRequesterNestedInput
    temporary_permissions?: temporary_permissionsUncheckedUpdateManyWithoutAdminNestedInput
  }

  export type adminsCreateWithoutTemporary_permissionsInput = {
    full_name: string
    email: string
    password_hash: string
    created_at?: Date | string | null
    role?: string
    phone_number?: string | null
    parent_admin_id?: number | null
    status?: string | null
    behavior_profiles?: behavior_profilesCreateNestedManyWithoutAdminsInput
    behavior_samples?: behavior_samplesCreateNestedManyWithoutAdminsInput
    devices?: devicesCreateNestedManyWithoutAdminsInput
    risk_events?: risk_eventsCreateNestedManyWithoutAdminsInput
    preferences?: admin_preferencesCreateNestedOneWithoutAdminInput
    edit_requests_requested?: edit_requestsCreateNestedManyWithoutRequesterInput
    edit_requests_approved?: edit_requestsCreateNestedManyWithoutApproverInput
  }

  export type adminsUncheckedCreateWithoutTemporary_permissionsInput = {
    id?: number
    full_name: string
    email: string
    password_hash: string
    created_at?: Date | string | null
    role?: string
    phone_number?: string | null
    parent_admin_id?: number | null
    status?: string | null
    behavior_profiles?: behavior_profilesUncheckedCreateNestedManyWithoutAdminsInput
    behavior_samples?: behavior_samplesUncheckedCreateNestedManyWithoutAdminsInput
    devices?: devicesUncheckedCreateNestedManyWithoutAdminsInput
    risk_events?: risk_eventsUncheckedCreateNestedManyWithoutAdminsInput
    preferences?: admin_preferencesUncheckedCreateNestedOneWithoutAdminInput
    edit_requests_requested?: edit_requestsUncheckedCreateNestedManyWithoutRequesterInput
    edit_requests_approved?: edit_requestsUncheckedCreateNestedManyWithoutApproverInput
  }

  export type adminsCreateOrConnectWithoutTemporary_permissionsInput = {
    where: adminsWhereUniqueInput
    create: XOR<adminsCreateWithoutTemporary_permissionsInput, adminsUncheckedCreateWithoutTemporary_permissionsInput>
  }

  export type adminsUpsertWithoutTemporary_permissionsInput = {
    update: XOR<adminsUpdateWithoutTemporary_permissionsInput, adminsUncheckedUpdateWithoutTemporary_permissionsInput>
    create: XOR<adminsCreateWithoutTemporary_permissionsInput, adminsUncheckedCreateWithoutTemporary_permissionsInput>
    where?: adminsWhereInput
  }

  export type adminsUpdateToOneWithWhereWithoutTemporary_permissionsInput = {
    where?: adminsWhereInput
    data: XOR<adminsUpdateWithoutTemporary_permissionsInput, adminsUncheckedUpdateWithoutTemporary_permissionsInput>
  }

  export type adminsUpdateWithoutTemporary_permissionsInput = {
    full_name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    role?: StringFieldUpdateOperationsInput | string
    phone_number?: NullableStringFieldUpdateOperationsInput | string | null
    parent_admin_id?: NullableIntFieldUpdateOperationsInput | number | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    behavior_profiles?: behavior_profilesUpdateManyWithoutAdminsNestedInput
    behavior_samples?: behavior_samplesUpdateManyWithoutAdminsNestedInput
    devices?: devicesUpdateManyWithoutAdminsNestedInput
    risk_events?: risk_eventsUpdateManyWithoutAdminsNestedInput
    preferences?: admin_preferencesUpdateOneWithoutAdminNestedInput
    edit_requests_requested?: edit_requestsUpdateManyWithoutRequesterNestedInput
    edit_requests_approved?: edit_requestsUpdateManyWithoutApproverNestedInput
  }

  export type adminsUncheckedUpdateWithoutTemporary_permissionsInput = {
    id?: IntFieldUpdateOperationsInput | number
    full_name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    role?: StringFieldUpdateOperationsInput | string
    phone_number?: NullableStringFieldUpdateOperationsInput | string | null
    parent_admin_id?: NullableIntFieldUpdateOperationsInput | number | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    behavior_profiles?: behavior_profilesUncheckedUpdateManyWithoutAdminsNestedInput
    behavior_samples?: behavior_samplesUncheckedUpdateManyWithoutAdminsNestedInput
    devices?: devicesUncheckedUpdateManyWithoutAdminsNestedInput
    risk_events?: risk_eventsUncheckedUpdateManyWithoutAdminsNestedInput
    preferences?: admin_preferencesUncheckedUpdateOneWithoutAdminNestedInput
    edit_requests_requested?: edit_requestsUncheckedUpdateManyWithoutRequesterNestedInput
    edit_requests_approved?: edit_requestsUncheckedUpdateManyWithoutApproverNestedInput
  }

  export type behavior_profilesCreateManyAdminsInput = {
    id?: number
    enrollment_phrase: string
    avg_dwell_time?: Decimal | DecimalJsLike | number | string | null
    avg_flight_time?: Decimal | DecimalJsLike | number | string | null
    avg_typing_speed?: Decimal | DecimalJsLike | number | string | null
    avg_backspace_usage?: Decimal | DecimalJsLike | number | string | null
    avg_error_rate?: Decimal | DecimalJsLike | number | string | null
    created_at?: Date | string | null
  }

  export type behavior_samplesCreateManyAdminsInput = {
    id?: number
    dwell_time?: Decimal | DecimalJsLike | number | string | null
    flight_time?: Decimal | DecimalJsLike | number | string | null
    typing_speed?: Decimal | DecimalJsLike | number | string | null
    backspace_usage?: Decimal | DecimalJsLike | number | string | null
    error_rate?: Decimal | DecimalJsLike | number | string | null
    similarity_score?: Decimal | DecimalJsLike | number | string | null
    verification_result?: string | null
    created_at?: Date | string | null
    sample_type?: string | null
  }

  export type devicesCreateManyAdminsInput = {
    id?: number
    device_fingerprint: string
    device_name?: string | null
    trust_score?: number | null
    status?: string | null
    registration_token_hash?: string | null
    token_expires_at?: Date | string | null
    first_seen?: Date | string | null
    last_seen?: Date | string | null
    created_at?: Date | string | null
  }

  export type risk_eventsCreateManyAdminsInput = {
    id?: number
    identity_score?: Decimal | DecimalJsLike | number | string | null
    device_score?: Decimal | DecimalJsLike | number | string | null
    behavior_score?: Decimal | DecimalJsLike | number | string | null
    overall_risk_score?: Decimal | DecimalJsLike | number | string | null
    decision?: string | null
    created_at?: Date | string | null
  }

  export type edit_requestsCreateManyRequesterInput = {
    id?: number
    approved_by_admin_id?: number | null
    module: string
    action: string
    target_identifier: string
    reason: string
    status?: string
    approval_token?: string | null
    requested_at?: Date | string
    approved_at?: Date | string | null
    expires_at?: Date | string | null
  }

  export type edit_requestsCreateManyApproverInput = {
    id?: number
    requested_by_admin_id: number
    module: string
    action: string
    target_identifier: string
    reason: string
    status?: string
    approval_token?: string | null
    requested_at?: Date | string
    approved_at?: Date | string | null
    expires_at?: Date | string | null
  }

  export type temporary_permissionsCreateManyAdminInput = {
    id?: number
    module: string
    target_identifier: string
    approved_by: number
    expires_at: Date | string
    created_at?: Date | string
  }

  export type behavior_profilesUpdateWithoutAdminsInput = {
    enrollment_phrase?: StringFieldUpdateOperationsInput | string
    avg_dwell_time?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    avg_flight_time?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    avg_typing_speed?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    avg_backspace_usage?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    avg_error_rate?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type behavior_profilesUncheckedUpdateWithoutAdminsInput = {
    id?: IntFieldUpdateOperationsInput | number
    enrollment_phrase?: StringFieldUpdateOperationsInput | string
    avg_dwell_time?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    avg_flight_time?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    avg_typing_speed?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    avg_backspace_usage?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    avg_error_rate?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type behavior_profilesUncheckedUpdateManyWithoutAdminsInput = {
    id?: IntFieldUpdateOperationsInput | number
    enrollment_phrase?: StringFieldUpdateOperationsInput | string
    avg_dwell_time?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    avg_flight_time?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    avg_typing_speed?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    avg_backspace_usage?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    avg_error_rate?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type behavior_samplesUpdateWithoutAdminsInput = {
    dwell_time?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    flight_time?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    typing_speed?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    backspace_usage?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    error_rate?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    similarity_score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    verification_result?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sample_type?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type behavior_samplesUncheckedUpdateWithoutAdminsInput = {
    id?: IntFieldUpdateOperationsInput | number
    dwell_time?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    flight_time?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    typing_speed?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    backspace_usage?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    error_rate?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    similarity_score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    verification_result?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sample_type?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type behavior_samplesUncheckedUpdateManyWithoutAdminsInput = {
    id?: IntFieldUpdateOperationsInput | number
    dwell_time?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    flight_time?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    typing_speed?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    backspace_usage?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    error_rate?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    similarity_score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    verification_result?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sample_type?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type devicesUpdateWithoutAdminsInput = {
    device_fingerprint?: StringFieldUpdateOperationsInput | string
    device_name?: NullableStringFieldUpdateOperationsInput | string | null
    trust_score?: NullableIntFieldUpdateOperationsInput | number | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    registration_token_hash?: NullableStringFieldUpdateOperationsInput | string | null
    token_expires_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    first_seen?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    last_seen?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type devicesUncheckedUpdateWithoutAdminsInput = {
    id?: IntFieldUpdateOperationsInput | number
    device_fingerprint?: StringFieldUpdateOperationsInput | string
    device_name?: NullableStringFieldUpdateOperationsInput | string | null
    trust_score?: NullableIntFieldUpdateOperationsInput | number | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    registration_token_hash?: NullableStringFieldUpdateOperationsInput | string | null
    token_expires_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    first_seen?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    last_seen?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type devicesUncheckedUpdateManyWithoutAdminsInput = {
    id?: IntFieldUpdateOperationsInput | number
    device_fingerprint?: StringFieldUpdateOperationsInput | string
    device_name?: NullableStringFieldUpdateOperationsInput | string | null
    trust_score?: NullableIntFieldUpdateOperationsInput | number | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    registration_token_hash?: NullableStringFieldUpdateOperationsInput | string | null
    token_expires_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    first_seen?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    last_seen?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type risk_eventsUpdateWithoutAdminsInput = {
    identity_score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    device_score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    behavior_score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    overall_risk_score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    decision?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type risk_eventsUncheckedUpdateWithoutAdminsInput = {
    id?: IntFieldUpdateOperationsInput | number
    identity_score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    device_score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    behavior_score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    overall_risk_score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    decision?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type risk_eventsUncheckedUpdateManyWithoutAdminsInput = {
    id?: IntFieldUpdateOperationsInput | number
    identity_score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    device_score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    behavior_score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    overall_risk_score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    decision?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type edit_requestsUpdateWithoutRequesterInput = {
    module?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    target_identifier?: StringFieldUpdateOperationsInput | string
    reason?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    approval_token?: NullableStringFieldUpdateOperationsInput | string | null
    requested_at?: DateTimeFieldUpdateOperationsInput | Date | string
    approved_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expires_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    approver?: adminsUpdateOneWithoutEdit_requests_approvedNestedInput
  }

  export type edit_requestsUncheckedUpdateWithoutRequesterInput = {
    id?: IntFieldUpdateOperationsInput | number
    approved_by_admin_id?: NullableIntFieldUpdateOperationsInput | number | null
    module?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    target_identifier?: StringFieldUpdateOperationsInput | string
    reason?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    approval_token?: NullableStringFieldUpdateOperationsInput | string | null
    requested_at?: DateTimeFieldUpdateOperationsInput | Date | string
    approved_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expires_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type edit_requestsUncheckedUpdateManyWithoutRequesterInput = {
    id?: IntFieldUpdateOperationsInput | number
    approved_by_admin_id?: NullableIntFieldUpdateOperationsInput | number | null
    module?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    target_identifier?: StringFieldUpdateOperationsInput | string
    reason?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    approval_token?: NullableStringFieldUpdateOperationsInput | string | null
    requested_at?: DateTimeFieldUpdateOperationsInput | Date | string
    approved_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expires_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type edit_requestsUpdateWithoutApproverInput = {
    module?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    target_identifier?: StringFieldUpdateOperationsInput | string
    reason?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    approval_token?: NullableStringFieldUpdateOperationsInput | string | null
    requested_at?: DateTimeFieldUpdateOperationsInput | Date | string
    approved_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expires_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    requester?: adminsUpdateOneRequiredWithoutEdit_requests_requestedNestedInput
  }

  export type edit_requestsUncheckedUpdateWithoutApproverInput = {
    id?: IntFieldUpdateOperationsInput | number
    requested_by_admin_id?: IntFieldUpdateOperationsInput | number
    module?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    target_identifier?: StringFieldUpdateOperationsInput | string
    reason?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    approval_token?: NullableStringFieldUpdateOperationsInput | string | null
    requested_at?: DateTimeFieldUpdateOperationsInput | Date | string
    approved_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expires_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type edit_requestsUncheckedUpdateManyWithoutApproverInput = {
    id?: IntFieldUpdateOperationsInput | number
    requested_by_admin_id?: IntFieldUpdateOperationsInput | number
    module?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    target_identifier?: StringFieldUpdateOperationsInput | string
    reason?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    approval_token?: NullableStringFieldUpdateOperationsInput | string | null
    requested_at?: DateTimeFieldUpdateOperationsInput | Date | string
    approved_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expires_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type temporary_permissionsUpdateWithoutAdminInput = {
    module?: StringFieldUpdateOperationsInput | string
    target_identifier?: StringFieldUpdateOperationsInput | string
    approved_by?: IntFieldUpdateOperationsInput | number
    expires_at?: DateTimeFieldUpdateOperationsInput | Date | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type temporary_permissionsUncheckedUpdateWithoutAdminInput = {
    id?: IntFieldUpdateOperationsInput | number
    module?: StringFieldUpdateOperationsInput | string
    target_identifier?: StringFieldUpdateOperationsInput | string
    approved_by?: IntFieldUpdateOperationsInput | number
    expires_at?: DateTimeFieldUpdateOperationsInput | Date | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type temporary_permissionsUncheckedUpdateManyWithoutAdminInput = {
    id?: IntFieldUpdateOperationsInput | number
    module?: StringFieldUpdateOperationsInput | string
    target_identifier?: StringFieldUpdateOperationsInput | string
    approved_by?: IntFieldUpdateOperationsInput | number
    expires_at?: DateTimeFieldUpdateOperationsInput | Date | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
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