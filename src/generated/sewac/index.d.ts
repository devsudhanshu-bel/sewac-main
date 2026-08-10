
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
 * Model telemetry_logs
 * 
 */
export type telemetry_logs = $Result.DefaultSelection<Prisma.$telemetry_logsPayload>
/**
 * Model vehicle_incidents
 * 
 */
export type vehicle_incidents = $Result.DefaultSelection<Prisma.$vehicle_incidentsPayload>
/**
 * Model vehicle_master
 * 
 */
export type vehicle_master = $Result.DefaultSelection<Prisma.$vehicle_masterPayload>
/**
 * Model vehicle_telemetry
 * 
 */
export type vehicle_telemetry = $Result.DefaultSelection<Prisma.$vehicle_telemetryPayload>
/**
 * Model plant_master
 * 
 */
export type plant_master = $Result.DefaultSelection<Prisma.$plant_masterPayload>
/**
 * Model edit_logs
 * 
 */
export type edit_logs = $Result.DefaultSelection<Prisma.$edit_logsPayload>
/**
 * Model citizen_complaints
 * 
 */
export type citizen_complaints = $Result.DefaultSelection<Prisma.$citizen_complaintsPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const CitizenComplaintCategory: {
  MISSED_COLLECTION: 'MISSED_COLLECTION',
  OVERFLOWING_BIN: 'OVERFLOWING_BIN',
  ILLEGAL_DUMPING: 'ILLEGAL_DUMPING',
  STREET_LITTER: 'STREET_LITTER',
  DAMAGED_BIN: 'DAMAGED_BIN',
  OTHER: 'OTHER'
};

export type CitizenComplaintCategory = (typeof CitizenComplaintCategory)[keyof typeof CitizenComplaintCategory]


export const CitizenComplaintStatus: {
  PENDING: 'PENDING',
  ASSIGNED: 'ASSIGNED',
  IN_PROGRESS: 'IN_PROGRESS',
  READY_FOR_VERIFICATION: 'READY_FOR_VERIFICATION',
  OTP_SENT: 'OTP_SENT',
  CLOSED: 'CLOSED'
};

export type CitizenComplaintStatus = (typeof CitizenComplaintStatus)[keyof typeof CitizenComplaintStatus]

}

export type CitizenComplaintCategory = $Enums.CitizenComplaintCategory

export const CitizenComplaintCategory: typeof $Enums.CitizenComplaintCategory

export type CitizenComplaintStatus = $Enums.CitizenComplaintStatus

export const CitizenComplaintStatus: typeof $Enums.CitizenComplaintStatus

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Telemetry_logs
 * const telemetry_logs = await prisma.telemetry_logs.findMany()
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
   * // Fetch zero or more Telemetry_logs
   * const telemetry_logs = await prisma.telemetry_logs.findMany()
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
   * `prisma.telemetry_logs`: Exposes CRUD operations for the **telemetry_logs** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Telemetry_logs
    * const telemetry_logs = await prisma.telemetry_logs.findMany()
    * ```
    */
  get telemetry_logs(): Prisma.telemetry_logsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.vehicle_incidents`: Exposes CRUD operations for the **vehicle_incidents** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Vehicle_incidents
    * const vehicle_incidents = await prisma.vehicle_incidents.findMany()
    * ```
    */
  get vehicle_incidents(): Prisma.vehicle_incidentsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.vehicle_master`: Exposes CRUD operations for the **vehicle_master** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Vehicle_masters
    * const vehicle_masters = await prisma.vehicle_master.findMany()
    * ```
    */
  get vehicle_master(): Prisma.vehicle_masterDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.vehicle_telemetry`: Exposes CRUD operations for the **vehicle_telemetry** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Vehicle_telemetries
    * const vehicle_telemetries = await prisma.vehicle_telemetry.findMany()
    * ```
    */
  get vehicle_telemetry(): Prisma.vehicle_telemetryDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.plant_master`: Exposes CRUD operations for the **plant_master** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Plant_masters
    * const plant_masters = await prisma.plant_master.findMany()
    * ```
    */
  get plant_master(): Prisma.plant_masterDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.edit_logs`: Exposes CRUD operations for the **edit_logs** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Edit_logs
    * const edit_logs = await prisma.edit_logs.findMany()
    * ```
    */
  get edit_logs(): Prisma.edit_logsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.citizen_complaints`: Exposes CRUD operations for the **citizen_complaints** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Citizen_complaints
    * const citizen_complaints = await prisma.citizen_complaints.findMany()
    * ```
    */
  get citizen_complaints(): Prisma.citizen_complaintsDelegate<ExtArgs, ClientOptions>;
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
    telemetry_logs: 'telemetry_logs',
    vehicle_incidents: 'vehicle_incidents',
    vehicle_master: 'vehicle_master',
    vehicle_telemetry: 'vehicle_telemetry',
    plant_master: 'plant_master',
    edit_logs: 'edit_logs',
    citizen_complaints: 'citizen_complaints'
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
      modelProps: "telemetry_logs" | "vehicle_incidents" | "vehicle_master" | "vehicle_telemetry" | "plant_master" | "edit_logs" | "citizen_complaints"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      telemetry_logs: {
        payload: Prisma.$telemetry_logsPayload<ExtArgs>
        fields: Prisma.telemetry_logsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.telemetry_logsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$telemetry_logsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.telemetry_logsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$telemetry_logsPayload>
          }
          findFirst: {
            args: Prisma.telemetry_logsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$telemetry_logsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.telemetry_logsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$telemetry_logsPayload>
          }
          findMany: {
            args: Prisma.telemetry_logsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$telemetry_logsPayload>[]
          }
          create: {
            args: Prisma.telemetry_logsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$telemetry_logsPayload>
          }
          createMany: {
            args: Prisma.telemetry_logsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.telemetry_logsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$telemetry_logsPayload>[]
          }
          delete: {
            args: Prisma.telemetry_logsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$telemetry_logsPayload>
          }
          update: {
            args: Prisma.telemetry_logsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$telemetry_logsPayload>
          }
          deleteMany: {
            args: Prisma.telemetry_logsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.telemetry_logsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.telemetry_logsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$telemetry_logsPayload>[]
          }
          upsert: {
            args: Prisma.telemetry_logsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$telemetry_logsPayload>
          }
          aggregate: {
            args: Prisma.Telemetry_logsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTelemetry_logs>
          }
          groupBy: {
            args: Prisma.telemetry_logsGroupByArgs<ExtArgs>
            result: $Utils.Optional<Telemetry_logsGroupByOutputType>[]
          }
          count: {
            args: Prisma.telemetry_logsCountArgs<ExtArgs>
            result: $Utils.Optional<Telemetry_logsCountAggregateOutputType> | number
          }
        }
      }
      vehicle_incidents: {
        payload: Prisma.$vehicle_incidentsPayload<ExtArgs>
        fields: Prisma.vehicle_incidentsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.vehicle_incidentsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$vehicle_incidentsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.vehicle_incidentsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$vehicle_incidentsPayload>
          }
          findFirst: {
            args: Prisma.vehicle_incidentsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$vehicle_incidentsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.vehicle_incidentsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$vehicle_incidentsPayload>
          }
          findMany: {
            args: Prisma.vehicle_incidentsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$vehicle_incidentsPayload>[]
          }
          create: {
            args: Prisma.vehicle_incidentsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$vehicle_incidentsPayload>
          }
          createMany: {
            args: Prisma.vehicle_incidentsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.vehicle_incidentsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$vehicle_incidentsPayload>[]
          }
          delete: {
            args: Prisma.vehicle_incidentsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$vehicle_incidentsPayload>
          }
          update: {
            args: Prisma.vehicle_incidentsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$vehicle_incidentsPayload>
          }
          deleteMany: {
            args: Prisma.vehicle_incidentsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.vehicle_incidentsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.vehicle_incidentsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$vehicle_incidentsPayload>[]
          }
          upsert: {
            args: Prisma.vehicle_incidentsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$vehicle_incidentsPayload>
          }
          aggregate: {
            args: Prisma.Vehicle_incidentsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateVehicle_incidents>
          }
          groupBy: {
            args: Prisma.vehicle_incidentsGroupByArgs<ExtArgs>
            result: $Utils.Optional<Vehicle_incidentsGroupByOutputType>[]
          }
          count: {
            args: Prisma.vehicle_incidentsCountArgs<ExtArgs>
            result: $Utils.Optional<Vehicle_incidentsCountAggregateOutputType> | number
          }
        }
      }
      vehicle_master: {
        payload: Prisma.$vehicle_masterPayload<ExtArgs>
        fields: Prisma.vehicle_masterFieldRefs
        operations: {
          findUnique: {
            args: Prisma.vehicle_masterFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$vehicle_masterPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.vehicle_masterFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$vehicle_masterPayload>
          }
          findFirst: {
            args: Prisma.vehicle_masterFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$vehicle_masterPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.vehicle_masterFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$vehicle_masterPayload>
          }
          findMany: {
            args: Prisma.vehicle_masterFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$vehicle_masterPayload>[]
          }
          create: {
            args: Prisma.vehicle_masterCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$vehicle_masterPayload>
          }
          createMany: {
            args: Prisma.vehicle_masterCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.vehicle_masterCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$vehicle_masterPayload>[]
          }
          delete: {
            args: Prisma.vehicle_masterDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$vehicle_masterPayload>
          }
          update: {
            args: Prisma.vehicle_masterUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$vehicle_masterPayload>
          }
          deleteMany: {
            args: Prisma.vehicle_masterDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.vehicle_masterUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.vehicle_masterUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$vehicle_masterPayload>[]
          }
          upsert: {
            args: Prisma.vehicle_masterUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$vehicle_masterPayload>
          }
          aggregate: {
            args: Prisma.Vehicle_masterAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateVehicle_master>
          }
          groupBy: {
            args: Prisma.vehicle_masterGroupByArgs<ExtArgs>
            result: $Utils.Optional<Vehicle_masterGroupByOutputType>[]
          }
          count: {
            args: Prisma.vehicle_masterCountArgs<ExtArgs>
            result: $Utils.Optional<Vehicle_masterCountAggregateOutputType> | number
          }
        }
      }
      vehicle_telemetry: {
        payload: Prisma.$vehicle_telemetryPayload<ExtArgs>
        fields: Prisma.vehicle_telemetryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.vehicle_telemetryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$vehicle_telemetryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.vehicle_telemetryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$vehicle_telemetryPayload>
          }
          findFirst: {
            args: Prisma.vehicle_telemetryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$vehicle_telemetryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.vehicle_telemetryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$vehicle_telemetryPayload>
          }
          findMany: {
            args: Prisma.vehicle_telemetryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$vehicle_telemetryPayload>[]
          }
          create: {
            args: Prisma.vehicle_telemetryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$vehicle_telemetryPayload>
          }
          createMany: {
            args: Prisma.vehicle_telemetryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.vehicle_telemetryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$vehicle_telemetryPayload>[]
          }
          delete: {
            args: Prisma.vehicle_telemetryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$vehicle_telemetryPayload>
          }
          update: {
            args: Prisma.vehicle_telemetryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$vehicle_telemetryPayload>
          }
          deleteMany: {
            args: Prisma.vehicle_telemetryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.vehicle_telemetryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.vehicle_telemetryUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$vehicle_telemetryPayload>[]
          }
          upsert: {
            args: Prisma.vehicle_telemetryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$vehicle_telemetryPayload>
          }
          aggregate: {
            args: Prisma.Vehicle_telemetryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateVehicle_telemetry>
          }
          groupBy: {
            args: Prisma.vehicle_telemetryGroupByArgs<ExtArgs>
            result: $Utils.Optional<Vehicle_telemetryGroupByOutputType>[]
          }
          count: {
            args: Prisma.vehicle_telemetryCountArgs<ExtArgs>
            result: $Utils.Optional<Vehicle_telemetryCountAggregateOutputType> | number
          }
        }
      }
      plant_master: {
        payload: Prisma.$plant_masterPayload<ExtArgs>
        fields: Prisma.plant_masterFieldRefs
        operations: {
          findUnique: {
            args: Prisma.plant_masterFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$plant_masterPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.plant_masterFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$plant_masterPayload>
          }
          findFirst: {
            args: Prisma.plant_masterFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$plant_masterPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.plant_masterFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$plant_masterPayload>
          }
          findMany: {
            args: Prisma.plant_masterFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$plant_masterPayload>[]
          }
          create: {
            args: Prisma.plant_masterCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$plant_masterPayload>
          }
          createMany: {
            args: Prisma.plant_masterCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.plant_masterCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$plant_masterPayload>[]
          }
          delete: {
            args: Prisma.plant_masterDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$plant_masterPayload>
          }
          update: {
            args: Prisma.plant_masterUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$plant_masterPayload>
          }
          deleteMany: {
            args: Prisma.plant_masterDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.plant_masterUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.plant_masterUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$plant_masterPayload>[]
          }
          upsert: {
            args: Prisma.plant_masterUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$plant_masterPayload>
          }
          aggregate: {
            args: Prisma.Plant_masterAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePlant_master>
          }
          groupBy: {
            args: Prisma.plant_masterGroupByArgs<ExtArgs>
            result: $Utils.Optional<Plant_masterGroupByOutputType>[]
          }
          count: {
            args: Prisma.plant_masterCountArgs<ExtArgs>
            result: $Utils.Optional<Plant_masterCountAggregateOutputType> | number
          }
        }
      }
      edit_logs: {
        payload: Prisma.$edit_logsPayload<ExtArgs>
        fields: Prisma.edit_logsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.edit_logsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$edit_logsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.edit_logsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$edit_logsPayload>
          }
          findFirst: {
            args: Prisma.edit_logsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$edit_logsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.edit_logsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$edit_logsPayload>
          }
          findMany: {
            args: Prisma.edit_logsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$edit_logsPayload>[]
          }
          create: {
            args: Prisma.edit_logsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$edit_logsPayload>
          }
          createMany: {
            args: Prisma.edit_logsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.edit_logsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$edit_logsPayload>[]
          }
          delete: {
            args: Prisma.edit_logsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$edit_logsPayload>
          }
          update: {
            args: Prisma.edit_logsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$edit_logsPayload>
          }
          deleteMany: {
            args: Prisma.edit_logsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.edit_logsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.edit_logsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$edit_logsPayload>[]
          }
          upsert: {
            args: Prisma.edit_logsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$edit_logsPayload>
          }
          aggregate: {
            args: Prisma.Edit_logsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEdit_logs>
          }
          groupBy: {
            args: Prisma.edit_logsGroupByArgs<ExtArgs>
            result: $Utils.Optional<Edit_logsGroupByOutputType>[]
          }
          count: {
            args: Prisma.edit_logsCountArgs<ExtArgs>
            result: $Utils.Optional<Edit_logsCountAggregateOutputType> | number
          }
        }
      }
      citizen_complaints: {
        payload: Prisma.$citizen_complaintsPayload<ExtArgs>
        fields: Prisma.citizen_complaintsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.citizen_complaintsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$citizen_complaintsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.citizen_complaintsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$citizen_complaintsPayload>
          }
          findFirst: {
            args: Prisma.citizen_complaintsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$citizen_complaintsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.citizen_complaintsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$citizen_complaintsPayload>
          }
          findMany: {
            args: Prisma.citizen_complaintsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$citizen_complaintsPayload>[]
          }
          create: {
            args: Prisma.citizen_complaintsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$citizen_complaintsPayload>
          }
          createMany: {
            args: Prisma.citizen_complaintsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.citizen_complaintsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$citizen_complaintsPayload>[]
          }
          delete: {
            args: Prisma.citizen_complaintsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$citizen_complaintsPayload>
          }
          update: {
            args: Prisma.citizen_complaintsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$citizen_complaintsPayload>
          }
          deleteMany: {
            args: Prisma.citizen_complaintsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.citizen_complaintsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.citizen_complaintsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$citizen_complaintsPayload>[]
          }
          upsert: {
            args: Prisma.citizen_complaintsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$citizen_complaintsPayload>
          }
          aggregate: {
            args: Prisma.Citizen_complaintsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCitizen_complaints>
          }
          groupBy: {
            args: Prisma.citizen_complaintsGroupByArgs<ExtArgs>
            result: $Utils.Optional<Citizen_complaintsGroupByOutputType>[]
          }
          count: {
            args: Prisma.citizen_complaintsCountArgs<ExtArgs>
            result: $Utils.Optional<Citizen_complaintsCountAggregateOutputType> | number
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
    telemetry_logs?: telemetry_logsOmit
    vehicle_incidents?: vehicle_incidentsOmit
    vehicle_master?: vehicle_masterOmit
    vehicle_telemetry?: vehicle_telemetryOmit
    plant_master?: plant_masterOmit
    edit_logs?: edit_logsOmit
    citizen_complaints?: citizen_complaintsOmit
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
   * Count Type Vehicle_masterCountOutputType
   */

  export type Vehicle_masterCountOutputType = {
    vehicle_incidents: number
    vehicle_telemetry: number
  }

  export type Vehicle_masterCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    vehicle_incidents?: boolean | Vehicle_masterCountOutputTypeCountVehicle_incidentsArgs
    vehicle_telemetry?: boolean | Vehicle_masterCountOutputTypeCountVehicle_telemetryArgs
  }

  // Custom InputTypes
  /**
   * Vehicle_masterCountOutputType without action
   */
  export type Vehicle_masterCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vehicle_masterCountOutputType
     */
    select?: Vehicle_masterCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * Vehicle_masterCountOutputType without action
   */
  export type Vehicle_masterCountOutputTypeCountVehicle_incidentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: vehicle_incidentsWhereInput
  }

  /**
   * Vehicle_masterCountOutputType without action
   */
  export type Vehicle_masterCountOutputTypeCountVehicle_telemetryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: vehicle_telemetryWhereInput
  }


  /**
   * Models
   */

  /**
   * Model telemetry_logs
   */

  export type AggregateTelemetry_logs = {
    _count: Telemetry_logsCountAggregateOutputType | null
    _avg: Telemetry_logsAvgAggregateOutputType | null
    _sum: Telemetry_logsSumAggregateOutputType | null
    _min: Telemetry_logsMinAggregateOutputType | null
    _max: Telemetry_logsMaxAggregateOutputType | null
  }

  export type Telemetry_logsAvgAggregateOutputType = {
    id: number | null
    citizen_id: number | null
    latitude: Decimal | null
    longitude: Decimal | null
    wet_weight_kg: Decimal | null
    dry_weight_kg: Decimal | null
    other_weight_kg: Decimal | null
    cumulative_weight_kg: Decimal | null
    driver_action: number | null
  }

  export type Telemetry_logsSumAggregateOutputType = {
    id: number | null
    citizen_id: number | null
    latitude: Decimal | null
    longitude: Decimal | null
    wet_weight_kg: Decimal | null
    dry_weight_kg: Decimal | null
    other_weight_kg: Decimal | null
    cumulative_weight_kg: Decimal | null
    driver_action: number | null
  }

  export type Telemetry_logsMinAggregateOutputType = {
    id: number | null
    iot_timestamp: Date | null
    received_at: Date | null
    rfid_epc: string | null
    citizen_id: number | null
    waste_type: string | null
    latitude: Decimal | null
    longitude: Decimal | null
    wet_weight_kg: Decimal | null
    dry_weight_kg: Decimal | null
    other_weight_kg: Decimal | null
    cumulative_weight_kg: Decimal | null
    driver_name: string | null
    vehicle_id: string | null
    firmware_version: string | null
    unit_number: string | null
    collection_type: string | null
    remarks: string | null
    err_code: string | null
    citizen_contact: string | null
    driver_action: number | null
  }

  export type Telemetry_logsMaxAggregateOutputType = {
    id: number | null
    iot_timestamp: Date | null
    received_at: Date | null
    rfid_epc: string | null
    citizen_id: number | null
    waste_type: string | null
    latitude: Decimal | null
    longitude: Decimal | null
    wet_weight_kg: Decimal | null
    dry_weight_kg: Decimal | null
    other_weight_kg: Decimal | null
    cumulative_weight_kg: Decimal | null
    driver_name: string | null
    vehicle_id: string | null
    firmware_version: string | null
    unit_number: string | null
    collection_type: string | null
    remarks: string | null
    err_code: string | null
    citizen_contact: string | null
    driver_action: number | null
  }

  export type Telemetry_logsCountAggregateOutputType = {
    id: number
    iot_timestamp: number
    received_at: number
    rfid_epc: number
    citizen_id: number
    waste_type: number
    latitude: number
    longitude: number
    wet_weight_kg: number
    dry_weight_kg: number
    other_weight_kg: number
    cumulative_weight_kg: number
    driver_name: number
    vehicle_id: number
    firmware_version: number
    unit_number: number
    collection_type: number
    remarks: number
    err_code: number
    citizen_contact: number
    driver_action: number
    _all: number
  }


  export type Telemetry_logsAvgAggregateInputType = {
    id?: true
    citizen_id?: true
    latitude?: true
    longitude?: true
    wet_weight_kg?: true
    dry_weight_kg?: true
    other_weight_kg?: true
    cumulative_weight_kg?: true
    driver_action?: true
  }

  export type Telemetry_logsSumAggregateInputType = {
    id?: true
    citizen_id?: true
    latitude?: true
    longitude?: true
    wet_weight_kg?: true
    dry_weight_kg?: true
    other_weight_kg?: true
    cumulative_weight_kg?: true
    driver_action?: true
  }

  export type Telemetry_logsMinAggregateInputType = {
    id?: true
    iot_timestamp?: true
    received_at?: true
    rfid_epc?: true
    citizen_id?: true
    waste_type?: true
    latitude?: true
    longitude?: true
    wet_weight_kg?: true
    dry_weight_kg?: true
    other_weight_kg?: true
    cumulative_weight_kg?: true
    driver_name?: true
    vehicle_id?: true
    firmware_version?: true
    unit_number?: true
    collection_type?: true
    remarks?: true
    err_code?: true
    citizen_contact?: true
    driver_action?: true
  }

  export type Telemetry_logsMaxAggregateInputType = {
    id?: true
    iot_timestamp?: true
    received_at?: true
    rfid_epc?: true
    citizen_id?: true
    waste_type?: true
    latitude?: true
    longitude?: true
    wet_weight_kg?: true
    dry_weight_kg?: true
    other_weight_kg?: true
    cumulative_weight_kg?: true
    driver_name?: true
    vehicle_id?: true
    firmware_version?: true
    unit_number?: true
    collection_type?: true
    remarks?: true
    err_code?: true
    citizen_contact?: true
    driver_action?: true
  }

  export type Telemetry_logsCountAggregateInputType = {
    id?: true
    iot_timestamp?: true
    received_at?: true
    rfid_epc?: true
    citizen_id?: true
    waste_type?: true
    latitude?: true
    longitude?: true
    wet_weight_kg?: true
    dry_weight_kg?: true
    other_weight_kg?: true
    cumulative_weight_kg?: true
    driver_name?: true
    vehicle_id?: true
    firmware_version?: true
    unit_number?: true
    collection_type?: true
    remarks?: true
    err_code?: true
    citizen_contact?: true
    driver_action?: true
    _all?: true
  }

  export type Telemetry_logsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which telemetry_logs to aggregate.
     */
    where?: telemetry_logsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of telemetry_logs to fetch.
     */
    orderBy?: telemetry_logsOrderByWithRelationInput | telemetry_logsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: telemetry_logsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` telemetry_logs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` telemetry_logs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned telemetry_logs
    **/
    _count?: true | Telemetry_logsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Telemetry_logsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Telemetry_logsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Telemetry_logsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Telemetry_logsMaxAggregateInputType
  }

  export type GetTelemetry_logsAggregateType<T extends Telemetry_logsAggregateArgs> = {
        [P in keyof T & keyof AggregateTelemetry_logs]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTelemetry_logs[P]>
      : GetScalarType<T[P], AggregateTelemetry_logs[P]>
  }




  export type telemetry_logsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: telemetry_logsWhereInput
    orderBy?: telemetry_logsOrderByWithAggregationInput | telemetry_logsOrderByWithAggregationInput[]
    by: Telemetry_logsScalarFieldEnum[] | Telemetry_logsScalarFieldEnum
    having?: telemetry_logsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Telemetry_logsCountAggregateInputType | true
    _avg?: Telemetry_logsAvgAggregateInputType
    _sum?: Telemetry_logsSumAggregateInputType
    _min?: Telemetry_logsMinAggregateInputType
    _max?: Telemetry_logsMaxAggregateInputType
  }

  export type Telemetry_logsGroupByOutputType = {
    id: number
    iot_timestamp: Date
    received_at: Date
    rfid_epc: string
    citizen_id: number | null
    waste_type: string | null
    latitude: Decimal | null
    longitude: Decimal | null
    wet_weight_kg: Decimal | null
    dry_weight_kg: Decimal | null
    other_weight_kg: Decimal | null
    cumulative_weight_kg: Decimal | null
    driver_name: string | null
    vehicle_id: string | null
    firmware_version: string | null
    unit_number: string | null
    collection_type: string | null
    remarks: string | null
    err_code: string | null
    citizen_contact: string | null
    driver_action: number
    _count: Telemetry_logsCountAggregateOutputType | null
    _avg: Telemetry_logsAvgAggregateOutputType | null
    _sum: Telemetry_logsSumAggregateOutputType | null
    _min: Telemetry_logsMinAggregateOutputType | null
    _max: Telemetry_logsMaxAggregateOutputType | null
  }

  type GetTelemetry_logsGroupByPayload<T extends telemetry_logsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Telemetry_logsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Telemetry_logsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Telemetry_logsGroupByOutputType[P]>
            : GetScalarType<T[P], Telemetry_logsGroupByOutputType[P]>
        }
      >
    >


  export type telemetry_logsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    iot_timestamp?: boolean
    received_at?: boolean
    rfid_epc?: boolean
    citizen_id?: boolean
    waste_type?: boolean
    latitude?: boolean
    longitude?: boolean
    wet_weight_kg?: boolean
    dry_weight_kg?: boolean
    other_weight_kg?: boolean
    cumulative_weight_kg?: boolean
    driver_name?: boolean
    vehicle_id?: boolean
    firmware_version?: boolean
    unit_number?: boolean
    collection_type?: boolean
    remarks?: boolean
    err_code?: boolean
    citizen_contact?: boolean
    driver_action?: boolean
  }, ExtArgs["result"]["telemetry_logs"]>

  export type telemetry_logsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    iot_timestamp?: boolean
    received_at?: boolean
    rfid_epc?: boolean
    citizen_id?: boolean
    waste_type?: boolean
    latitude?: boolean
    longitude?: boolean
    wet_weight_kg?: boolean
    dry_weight_kg?: boolean
    other_weight_kg?: boolean
    cumulative_weight_kg?: boolean
    driver_name?: boolean
    vehicle_id?: boolean
    firmware_version?: boolean
    unit_number?: boolean
    collection_type?: boolean
    remarks?: boolean
    err_code?: boolean
    citizen_contact?: boolean
    driver_action?: boolean
  }, ExtArgs["result"]["telemetry_logs"]>

  export type telemetry_logsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    iot_timestamp?: boolean
    received_at?: boolean
    rfid_epc?: boolean
    citizen_id?: boolean
    waste_type?: boolean
    latitude?: boolean
    longitude?: boolean
    wet_weight_kg?: boolean
    dry_weight_kg?: boolean
    other_weight_kg?: boolean
    cumulative_weight_kg?: boolean
    driver_name?: boolean
    vehicle_id?: boolean
    firmware_version?: boolean
    unit_number?: boolean
    collection_type?: boolean
    remarks?: boolean
    err_code?: boolean
    citizen_contact?: boolean
    driver_action?: boolean
  }, ExtArgs["result"]["telemetry_logs"]>

  export type telemetry_logsSelectScalar = {
    id?: boolean
    iot_timestamp?: boolean
    received_at?: boolean
    rfid_epc?: boolean
    citizen_id?: boolean
    waste_type?: boolean
    latitude?: boolean
    longitude?: boolean
    wet_weight_kg?: boolean
    dry_weight_kg?: boolean
    other_weight_kg?: boolean
    cumulative_weight_kg?: boolean
    driver_name?: boolean
    vehicle_id?: boolean
    firmware_version?: boolean
    unit_number?: boolean
    collection_type?: boolean
    remarks?: boolean
    err_code?: boolean
    citizen_contact?: boolean
    driver_action?: boolean
  }

  export type telemetry_logsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "iot_timestamp" | "received_at" | "rfid_epc" | "citizen_id" | "waste_type" | "latitude" | "longitude" | "wet_weight_kg" | "dry_weight_kg" | "other_weight_kg" | "cumulative_weight_kg" | "driver_name" | "vehicle_id" | "firmware_version" | "unit_number" | "collection_type" | "remarks" | "err_code" | "citizen_contact" | "driver_action", ExtArgs["result"]["telemetry_logs"]>

  export type $telemetry_logsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "telemetry_logs"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      iot_timestamp: Date
      received_at: Date
      rfid_epc: string
      citizen_id: number | null
      waste_type: string | null
      latitude: Prisma.Decimal | null
      longitude: Prisma.Decimal | null
      wet_weight_kg: Prisma.Decimal | null
      dry_weight_kg: Prisma.Decimal | null
      other_weight_kg: Prisma.Decimal | null
      cumulative_weight_kg: Prisma.Decimal | null
      driver_name: string | null
      vehicle_id: string | null
      firmware_version: string | null
      unit_number: string | null
      collection_type: string | null
      remarks: string | null
      err_code: string | null
      citizen_contact: string | null
      driver_action: number
    }, ExtArgs["result"]["telemetry_logs"]>
    composites: {}
  }

  type telemetry_logsGetPayload<S extends boolean | null | undefined | telemetry_logsDefaultArgs> = $Result.GetResult<Prisma.$telemetry_logsPayload, S>

  type telemetry_logsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<telemetry_logsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Telemetry_logsCountAggregateInputType | true
    }

  export interface telemetry_logsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['telemetry_logs'], meta: { name: 'telemetry_logs' } }
    /**
     * Find zero or one Telemetry_logs that matches the filter.
     * @param {telemetry_logsFindUniqueArgs} args - Arguments to find a Telemetry_logs
     * @example
     * // Get one Telemetry_logs
     * const telemetry_logs = await prisma.telemetry_logs.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends telemetry_logsFindUniqueArgs>(args: SelectSubset<T, telemetry_logsFindUniqueArgs<ExtArgs>>): Prisma__telemetry_logsClient<$Result.GetResult<Prisma.$telemetry_logsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Telemetry_logs that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {telemetry_logsFindUniqueOrThrowArgs} args - Arguments to find a Telemetry_logs
     * @example
     * // Get one Telemetry_logs
     * const telemetry_logs = await prisma.telemetry_logs.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends telemetry_logsFindUniqueOrThrowArgs>(args: SelectSubset<T, telemetry_logsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__telemetry_logsClient<$Result.GetResult<Prisma.$telemetry_logsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Telemetry_logs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {telemetry_logsFindFirstArgs} args - Arguments to find a Telemetry_logs
     * @example
     * // Get one Telemetry_logs
     * const telemetry_logs = await prisma.telemetry_logs.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends telemetry_logsFindFirstArgs>(args?: SelectSubset<T, telemetry_logsFindFirstArgs<ExtArgs>>): Prisma__telemetry_logsClient<$Result.GetResult<Prisma.$telemetry_logsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Telemetry_logs that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {telemetry_logsFindFirstOrThrowArgs} args - Arguments to find a Telemetry_logs
     * @example
     * // Get one Telemetry_logs
     * const telemetry_logs = await prisma.telemetry_logs.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends telemetry_logsFindFirstOrThrowArgs>(args?: SelectSubset<T, telemetry_logsFindFirstOrThrowArgs<ExtArgs>>): Prisma__telemetry_logsClient<$Result.GetResult<Prisma.$telemetry_logsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Telemetry_logs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {telemetry_logsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Telemetry_logs
     * const telemetry_logs = await prisma.telemetry_logs.findMany()
     * 
     * // Get first 10 Telemetry_logs
     * const telemetry_logs = await prisma.telemetry_logs.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const telemetry_logsWithIdOnly = await prisma.telemetry_logs.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends telemetry_logsFindManyArgs>(args?: SelectSubset<T, telemetry_logsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$telemetry_logsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Telemetry_logs.
     * @param {telemetry_logsCreateArgs} args - Arguments to create a Telemetry_logs.
     * @example
     * // Create one Telemetry_logs
     * const Telemetry_logs = await prisma.telemetry_logs.create({
     *   data: {
     *     // ... data to create a Telemetry_logs
     *   }
     * })
     * 
     */
    create<T extends telemetry_logsCreateArgs>(args: SelectSubset<T, telemetry_logsCreateArgs<ExtArgs>>): Prisma__telemetry_logsClient<$Result.GetResult<Prisma.$telemetry_logsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Telemetry_logs.
     * @param {telemetry_logsCreateManyArgs} args - Arguments to create many Telemetry_logs.
     * @example
     * // Create many Telemetry_logs
     * const telemetry_logs = await prisma.telemetry_logs.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends telemetry_logsCreateManyArgs>(args?: SelectSubset<T, telemetry_logsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Telemetry_logs and returns the data saved in the database.
     * @param {telemetry_logsCreateManyAndReturnArgs} args - Arguments to create many Telemetry_logs.
     * @example
     * // Create many Telemetry_logs
     * const telemetry_logs = await prisma.telemetry_logs.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Telemetry_logs and only return the `id`
     * const telemetry_logsWithIdOnly = await prisma.telemetry_logs.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends telemetry_logsCreateManyAndReturnArgs>(args?: SelectSubset<T, telemetry_logsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$telemetry_logsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Telemetry_logs.
     * @param {telemetry_logsDeleteArgs} args - Arguments to delete one Telemetry_logs.
     * @example
     * // Delete one Telemetry_logs
     * const Telemetry_logs = await prisma.telemetry_logs.delete({
     *   where: {
     *     // ... filter to delete one Telemetry_logs
     *   }
     * })
     * 
     */
    delete<T extends telemetry_logsDeleteArgs>(args: SelectSubset<T, telemetry_logsDeleteArgs<ExtArgs>>): Prisma__telemetry_logsClient<$Result.GetResult<Prisma.$telemetry_logsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Telemetry_logs.
     * @param {telemetry_logsUpdateArgs} args - Arguments to update one Telemetry_logs.
     * @example
     * // Update one Telemetry_logs
     * const telemetry_logs = await prisma.telemetry_logs.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends telemetry_logsUpdateArgs>(args: SelectSubset<T, telemetry_logsUpdateArgs<ExtArgs>>): Prisma__telemetry_logsClient<$Result.GetResult<Prisma.$telemetry_logsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Telemetry_logs.
     * @param {telemetry_logsDeleteManyArgs} args - Arguments to filter Telemetry_logs to delete.
     * @example
     * // Delete a few Telemetry_logs
     * const { count } = await prisma.telemetry_logs.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends telemetry_logsDeleteManyArgs>(args?: SelectSubset<T, telemetry_logsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Telemetry_logs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {telemetry_logsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Telemetry_logs
     * const telemetry_logs = await prisma.telemetry_logs.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends telemetry_logsUpdateManyArgs>(args: SelectSubset<T, telemetry_logsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Telemetry_logs and returns the data updated in the database.
     * @param {telemetry_logsUpdateManyAndReturnArgs} args - Arguments to update many Telemetry_logs.
     * @example
     * // Update many Telemetry_logs
     * const telemetry_logs = await prisma.telemetry_logs.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Telemetry_logs and only return the `id`
     * const telemetry_logsWithIdOnly = await prisma.telemetry_logs.updateManyAndReturn({
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
    updateManyAndReturn<T extends telemetry_logsUpdateManyAndReturnArgs>(args: SelectSubset<T, telemetry_logsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$telemetry_logsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Telemetry_logs.
     * @param {telemetry_logsUpsertArgs} args - Arguments to update or create a Telemetry_logs.
     * @example
     * // Update or create a Telemetry_logs
     * const telemetry_logs = await prisma.telemetry_logs.upsert({
     *   create: {
     *     // ... data to create a Telemetry_logs
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Telemetry_logs we want to update
     *   }
     * })
     */
    upsert<T extends telemetry_logsUpsertArgs>(args: SelectSubset<T, telemetry_logsUpsertArgs<ExtArgs>>): Prisma__telemetry_logsClient<$Result.GetResult<Prisma.$telemetry_logsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Telemetry_logs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {telemetry_logsCountArgs} args - Arguments to filter Telemetry_logs to count.
     * @example
     * // Count the number of Telemetry_logs
     * const count = await prisma.telemetry_logs.count({
     *   where: {
     *     // ... the filter for the Telemetry_logs we want to count
     *   }
     * })
    **/
    count<T extends telemetry_logsCountArgs>(
      args?: Subset<T, telemetry_logsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Telemetry_logsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Telemetry_logs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Telemetry_logsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends Telemetry_logsAggregateArgs>(args: Subset<T, Telemetry_logsAggregateArgs>): Prisma.PrismaPromise<GetTelemetry_logsAggregateType<T>>

    /**
     * Group by Telemetry_logs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {telemetry_logsGroupByArgs} args - Group by arguments.
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
      T extends telemetry_logsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: telemetry_logsGroupByArgs['orderBy'] }
        : { orderBy?: telemetry_logsGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, telemetry_logsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTelemetry_logsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the telemetry_logs model
   */
  readonly fields: telemetry_logsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for telemetry_logs.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__telemetry_logsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the telemetry_logs model
   */
  interface telemetry_logsFieldRefs {
    readonly id: FieldRef<"telemetry_logs", 'Int'>
    readonly iot_timestamp: FieldRef<"telemetry_logs", 'DateTime'>
    readonly received_at: FieldRef<"telemetry_logs", 'DateTime'>
    readonly rfid_epc: FieldRef<"telemetry_logs", 'String'>
    readonly citizen_id: FieldRef<"telemetry_logs", 'Int'>
    readonly waste_type: FieldRef<"telemetry_logs", 'String'>
    readonly latitude: FieldRef<"telemetry_logs", 'Decimal'>
    readonly longitude: FieldRef<"telemetry_logs", 'Decimal'>
    readonly wet_weight_kg: FieldRef<"telemetry_logs", 'Decimal'>
    readonly dry_weight_kg: FieldRef<"telemetry_logs", 'Decimal'>
    readonly other_weight_kg: FieldRef<"telemetry_logs", 'Decimal'>
    readonly cumulative_weight_kg: FieldRef<"telemetry_logs", 'Decimal'>
    readonly driver_name: FieldRef<"telemetry_logs", 'String'>
    readonly vehicle_id: FieldRef<"telemetry_logs", 'String'>
    readonly firmware_version: FieldRef<"telemetry_logs", 'String'>
    readonly unit_number: FieldRef<"telemetry_logs", 'String'>
    readonly collection_type: FieldRef<"telemetry_logs", 'String'>
    readonly remarks: FieldRef<"telemetry_logs", 'String'>
    readonly err_code: FieldRef<"telemetry_logs", 'String'>
    readonly citizen_contact: FieldRef<"telemetry_logs", 'String'>
    readonly driver_action: FieldRef<"telemetry_logs", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * telemetry_logs findUnique
   */
  export type telemetry_logsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the telemetry_logs
     */
    select?: telemetry_logsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the telemetry_logs
     */
    omit?: telemetry_logsOmit<ExtArgs> | null
    /**
     * Filter, which telemetry_logs to fetch.
     */
    where: telemetry_logsWhereUniqueInput
  }

  /**
   * telemetry_logs findUniqueOrThrow
   */
  export type telemetry_logsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the telemetry_logs
     */
    select?: telemetry_logsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the telemetry_logs
     */
    omit?: telemetry_logsOmit<ExtArgs> | null
    /**
     * Filter, which telemetry_logs to fetch.
     */
    where: telemetry_logsWhereUniqueInput
  }

  /**
   * telemetry_logs findFirst
   */
  export type telemetry_logsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the telemetry_logs
     */
    select?: telemetry_logsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the telemetry_logs
     */
    omit?: telemetry_logsOmit<ExtArgs> | null
    /**
     * Filter, which telemetry_logs to fetch.
     */
    where?: telemetry_logsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of telemetry_logs to fetch.
     */
    orderBy?: telemetry_logsOrderByWithRelationInput | telemetry_logsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for telemetry_logs.
     */
    cursor?: telemetry_logsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` telemetry_logs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` telemetry_logs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of telemetry_logs.
     */
    distinct?: Telemetry_logsScalarFieldEnum | Telemetry_logsScalarFieldEnum[]
  }

  /**
   * telemetry_logs findFirstOrThrow
   */
  export type telemetry_logsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the telemetry_logs
     */
    select?: telemetry_logsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the telemetry_logs
     */
    omit?: telemetry_logsOmit<ExtArgs> | null
    /**
     * Filter, which telemetry_logs to fetch.
     */
    where?: telemetry_logsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of telemetry_logs to fetch.
     */
    orderBy?: telemetry_logsOrderByWithRelationInput | telemetry_logsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for telemetry_logs.
     */
    cursor?: telemetry_logsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` telemetry_logs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` telemetry_logs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of telemetry_logs.
     */
    distinct?: Telemetry_logsScalarFieldEnum | Telemetry_logsScalarFieldEnum[]
  }

  /**
   * telemetry_logs findMany
   */
  export type telemetry_logsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the telemetry_logs
     */
    select?: telemetry_logsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the telemetry_logs
     */
    omit?: telemetry_logsOmit<ExtArgs> | null
    /**
     * Filter, which telemetry_logs to fetch.
     */
    where?: telemetry_logsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of telemetry_logs to fetch.
     */
    orderBy?: telemetry_logsOrderByWithRelationInput | telemetry_logsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing telemetry_logs.
     */
    cursor?: telemetry_logsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` telemetry_logs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` telemetry_logs.
     */
    skip?: number
    distinct?: Telemetry_logsScalarFieldEnum | Telemetry_logsScalarFieldEnum[]
  }

  /**
   * telemetry_logs create
   */
  export type telemetry_logsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the telemetry_logs
     */
    select?: telemetry_logsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the telemetry_logs
     */
    omit?: telemetry_logsOmit<ExtArgs> | null
    /**
     * The data needed to create a telemetry_logs.
     */
    data: XOR<telemetry_logsCreateInput, telemetry_logsUncheckedCreateInput>
  }

  /**
   * telemetry_logs createMany
   */
  export type telemetry_logsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many telemetry_logs.
     */
    data: telemetry_logsCreateManyInput | telemetry_logsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * telemetry_logs createManyAndReturn
   */
  export type telemetry_logsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the telemetry_logs
     */
    select?: telemetry_logsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the telemetry_logs
     */
    omit?: telemetry_logsOmit<ExtArgs> | null
    /**
     * The data used to create many telemetry_logs.
     */
    data: telemetry_logsCreateManyInput | telemetry_logsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * telemetry_logs update
   */
  export type telemetry_logsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the telemetry_logs
     */
    select?: telemetry_logsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the telemetry_logs
     */
    omit?: telemetry_logsOmit<ExtArgs> | null
    /**
     * The data needed to update a telemetry_logs.
     */
    data: XOR<telemetry_logsUpdateInput, telemetry_logsUncheckedUpdateInput>
    /**
     * Choose, which telemetry_logs to update.
     */
    where: telemetry_logsWhereUniqueInput
  }

  /**
   * telemetry_logs updateMany
   */
  export type telemetry_logsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update telemetry_logs.
     */
    data: XOR<telemetry_logsUpdateManyMutationInput, telemetry_logsUncheckedUpdateManyInput>
    /**
     * Filter which telemetry_logs to update
     */
    where?: telemetry_logsWhereInput
    /**
     * Limit how many telemetry_logs to update.
     */
    limit?: number
  }

  /**
   * telemetry_logs updateManyAndReturn
   */
  export type telemetry_logsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the telemetry_logs
     */
    select?: telemetry_logsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the telemetry_logs
     */
    omit?: telemetry_logsOmit<ExtArgs> | null
    /**
     * The data used to update telemetry_logs.
     */
    data: XOR<telemetry_logsUpdateManyMutationInput, telemetry_logsUncheckedUpdateManyInput>
    /**
     * Filter which telemetry_logs to update
     */
    where?: telemetry_logsWhereInput
    /**
     * Limit how many telemetry_logs to update.
     */
    limit?: number
  }

  /**
   * telemetry_logs upsert
   */
  export type telemetry_logsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the telemetry_logs
     */
    select?: telemetry_logsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the telemetry_logs
     */
    omit?: telemetry_logsOmit<ExtArgs> | null
    /**
     * The filter to search for the telemetry_logs to update in case it exists.
     */
    where: telemetry_logsWhereUniqueInput
    /**
     * In case the telemetry_logs found by the `where` argument doesn't exist, create a new telemetry_logs with this data.
     */
    create: XOR<telemetry_logsCreateInput, telemetry_logsUncheckedCreateInput>
    /**
     * In case the telemetry_logs was found with the provided `where` argument, update it with this data.
     */
    update: XOR<telemetry_logsUpdateInput, telemetry_logsUncheckedUpdateInput>
  }

  /**
   * telemetry_logs delete
   */
  export type telemetry_logsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the telemetry_logs
     */
    select?: telemetry_logsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the telemetry_logs
     */
    omit?: telemetry_logsOmit<ExtArgs> | null
    /**
     * Filter which telemetry_logs to delete.
     */
    where: telemetry_logsWhereUniqueInput
  }

  /**
   * telemetry_logs deleteMany
   */
  export type telemetry_logsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which telemetry_logs to delete
     */
    where?: telemetry_logsWhereInput
    /**
     * Limit how many telemetry_logs to delete.
     */
    limit?: number
  }

  /**
   * telemetry_logs without action
   */
  export type telemetry_logsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the telemetry_logs
     */
    select?: telemetry_logsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the telemetry_logs
     */
    omit?: telemetry_logsOmit<ExtArgs> | null
  }


  /**
   * Model vehicle_incidents
   */

  export type AggregateVehicle_incidents = {
    _count: Vehicle_incidentsCountAggregateOutputType | null
    _avg: Vehicle_incidentsAvgAggregateOutputType | null
    _sum: Vehicle_incidentsSumAggregateOutputType | null
    _min: Vehicle_incidentsMinAggregateOutputType | null
    _max: Vehicle_incidentsMaxAggregateOutputType | null
  }

  export type Vehicle_incidentsAvgAggregateOutputType = {
    id: number | null
    speed_flagged_kmh: Decimal | null
    speed_limit_kmh: Decimal | null
    excess_speed_kmh: Decimal | null
  }

  export type Vehicle_incidentsSumAggregateOutputType = {
    id: number | null
    speed_flagged_kmh: Decimal | null
    speed_limit_kmh: Decimal | null
    excess_speed_kmh: Decimal | null
  }

  export type Vehicle_incidentsMinAggregateOutputType = {
    id: number | null
    vehicle_id: string | null
    date_time: Date | null
    main_road: string | null
    cross_road: string | null
    speed_flagged_kmh: Decimal | null
    speed_limit_kmh: Decimal | null
    excess_speed_kmh: Decimal | null
    status: string | null
  }

  export type Vehicle_incidentsMaxAggregateOutputType = {
    id: number | null
    vehicle_id: string | null
    date_time: Date | null
    main_road: string | null
    cross_road: string | null
    speed_flagged_kmh: Decimal | null
    speed_limit_kmh: Decimal | null
    excess_speed_kmh: Decimal | null
    status: string | null
  }

  export type Vehicle_incidentsCountAggregateOutputType = {
    id: number
    vehicle_id: number
    date_time: number
    main_road: number
    cross_road: number
    speed_flagged_kmh: number
    speed_limit_kmh: number
    excess_speed_kmh: number
    status: number
    _all: number
  }


  export type Vehicle_incidentsAvgAggregateInputType = {
    id?: true
    speed_flagged_kmh?: true
    speed_limit_kmh?: true
    excess_speed_kmh?: true
  }

  export type Vehicle_incidentsSumAggregateInputType = {
    id?: true
    speed_flagged_kmh?: true
    speed_limit_kmh?: true
    excess_speed_kmh?: true
  }

  export type Vehicle_incidentsMinAggregateInputType = {
    id?: true
    vehicle_id?: true
    date_time?: true
    main_road?: true
    cross_road?: true
    speed_flagged_kmh?: true
    speed_limit_kmh?: true
    excess_speed_kmh?: true
    status?: true
  }

  export type Vehicle_incidentsMaxAggregateInputType = {
    id?: true
    vehicle_id?: true
    date_time?: true
    main_road?: true
    cross_road?: true
    speed_flagged_kmh?: true
    speed_limit_kmh?: true
    excess_speed_kmh?: true
    status?: true
  }

  export type Vehicle_incidentsCountAggregateInputType = {
    id?: true
    vehicle_id?: true
    date_time?: true
    main_road?: true
    cross_road?: true
    speed_flagged_kmh?: true
    speed_limit_kmh?: true
    excess_speed_kmh?: true
    status?: true
    _all?: true
  }

  export type Vehicle_incidentsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which vehicle_incidents to aggregate.
     */
    where?: vehicle_incidentsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of vehicle_incidents to fetch.
     */
    orderBy?: vehicle_incidentsOrderByWithRelationInput | vehicle_incidentsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: vehicle_incidentsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` vehicle_incidents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` vehicle_incidents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned vehicle_incidents
    **/
    _count?: true | Vehicle_incidentsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Vehicle_incidentsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Vehicle_incidentsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Vehicle_incidentsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Vehicle_incidentsMaxAggregateInputType
  }

  export type GetVehicle_incidentsAggregateType<T extends Vehicle_incidentsAggregateArgs> = {
        [P in keyof T & keyof AggregateVehicle_incidents]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateVehicle_incidents[P]>
      : GetScalarType<T[P], AggregateVehicle_incidents[P]>
  }




  export type vehicle_incidentsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: vehicle_incidentsWhereInput
    orderBy?: vehicle_incidentsOrderByWithAggregationInput | vehicle_incidentsOrderByWithAggregationInput[]
    by: Vehicle_incidentsScalarFieldEnum[] | Vehicle_incidentsScalarFieldEnum
    having?: vehicle_incidentsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Vehicle_incidentsCountAggregateInputType | true
    _avg?: Vehicle_incidentsAvgAggregateInputType
    _sum?: Vehicle_incidentsSumAggregateInputType
    _min?: Vehicle_incidentsMinAggregateInputType
    _max?: Vehicle_incidentsMaxAggregateInputType
  }

  export type Vehicle_incidentsGroupByOutputType = {
    id: number
    vehicle_id: string | null
    date_time: Date | null
    main_road: string | null
    cross_road: string | null
    speed_flagged_kmh: Decimal | null
    speed_limit_kmh: Decimal | null
    excess_speed_kmh: Decimal | null
    status: string | null
    _count: Vehicle_incidentsCountAggregateOutputType | null
    _avg: Vehicle_incidentsAvgAggregateOutputType | null
    _sum: Vehicle_incidentsSumAggregateOutputType | null
    _min: Vehicle_incidentsMinAggregateOutputType | null
    _max: Vehicle_incidentsMaxAggregateOutputType | null
  }

  type GetVehicle_incidentsGroupByPayload<T extends vehicle_incidentsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Vehicle_incidentsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Vehicle_incidentsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Vehicle_incidentsGroupByOutputType[P]>
            : GetScalarType<T[P], Vehicle_incidentsGroupByOutputType[P]>
        }
      >
    >


  export type vehicle_incidentsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    vehicle_id?: boolean
    date_time?: boolean
    main_road?: boolean
    cross_road?: boolean
    speed_flagged_kmh?: boolean
    speed_limit_kmh?: boolean
    excess_speed_kmh?: boolean
    status?: boolean
    vehicle_master?: boolean | vehicle_incidents$vehicle_masterArgs<ExtArgs>
  }, ExtArgs["result"]["vehicle_incidents"]>

  export type vehicle_incidentsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    vehicle_id?: boolean
    date_time?: boolean
    main_road?: boolean
    cross_road?: boolean
    speed_flagged_kmh?: boolean
    speed_limit_kmh?: boolean
    excess_speed_kmh?: boolean
    status?: boolean
    vehicle_master?: boolean | vehicle_incidents$vehicle_masterArgs<ExtArgs>
  }, ExtArgs["result"]["vehicle_incidents"]>

  export type vehicle_incidentsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    vehicle_id?: boolean
    date_time?: boolean
    main_road?: boolean
    cross_road?: boolean
    speed_flagged_kmh?: boolean
    speed_limit_kmh?: boolean
    excess_speed_kmh?: boolean
    status?: boolean
    vehicle_master?: boolean | vehicle_incidents$vehicle_masterArgs<ExtArgs>
  }, ExtArgs["result"]["vehicle_incidents"]>

  export type vehicle_incidentsSelectScalar = {
    id?: boolean
    vehicle_id?: boolean
    date_time?: boolean
    main_road?: boolean
    cross_road?: boolean
    speed_flagged_kmh?: boolean
    speed_limit_kmh?: boolean
    excess_speed_kmh?: boolean
    status?: boolean
  }

  export type vehicle_incidentsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "vehicle_id" | "date_time" | "main_road" | "cross_road" | "speed_flagged_kmh" | "speed_limit_kmh" | "excess_speed_kmh" | "status", ExtArgs["result"]["vehicle_incidents"]>
  export type vehicle_incidentsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    vehicle_master?: boolean | vehicle_incidents$vehicle_masterArgs<ExtArgs>
  }
  export type vehicle_incidentsIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    vehicle_master?: boolean | vehicle_incidents$vehicle_masterArgs<ExtArgs>
  }
  export type vehicle_incidentsIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    vehicle_master?: boolean | vehicle_incidents$vehicle_masterArgs<ExtArgs>
  }

  export type $vehicle_incidentsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "vehicle_incidents"
    objects: {
      vehicle_master: Prisma.$vehicle_masterPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      vehicle_id: string | null
      date_time: Date | null
      main_road: string | null
      cross_road: string | null
      speed_flagged_kmh: Prisma.Decimal | null
      speed_limit_kmh: Prisma.Decimal | null
      excess_speed_kmh: Prisma.Decimal | null
      status: string | null
    }, ExtArgs["result"]["vehicle_incidents"]>
    composites: {}
  }

  type vehicle_incidentsGetPayload<S extends boolean | null | undefined | vehicle_incidentsDefaultArgs> = $Result.GetResult<Prisma.$vehicle_incidentsPayload, S>

  type vehicle_incidentsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<vehicle_incidentsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Vehicle_incidentsCountAggregateInputType | true
    }

  export interface vehicle_incidentsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['vehicle_incidents'], meta: { name: 'vehicle_incidents' } }
    /**
     * Find zero or one Vehicle_incidents that matches the filter.
     * @param {vehicle_incidentsFindUniqueArgs} args - Arguments to find a Vehicle_incidents
     * @example
     * // Get one Vehicle_incidents
     * const vehicle_incidents = await prisma.vehicle_incidents.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends vehicle_incidentsFindUniqueArgs>(args: SelectSubset<T, vehicle_incidentsFindUniqueArgs<ExtArgs>>): Prisma__vehicle_incidentsClient<$Result.GetResult<Prisma.$vehicle_incidentsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Vehicle_incidents that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {vehicle_incidentsFindUniqueOrThrowArgs} args - Arguments to find a Vehicle_incidents
     * @example
     * // Get one Vehicle_incidents
     * const vehicle_incidents = await prisma.vehicle_incidents.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends vehicle_incidentsFindUniqueOrThrowArgs>(args: SelectSubset<T, vehicle_incidentsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__vehicle_incidentsClient<$Result.GetResult<Prisma.$vehicle_incidentsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Vehicle_incidents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {vehicle_incidentsFindFirstArgs} args - Arguments to find a Vehicle_incidents
     * @example
     * // Get one Vehicle_incidents
     * const vehicle_incidents = await prisma.vehicle_incidents.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends vehicle_incidentsFindFirstArgs>(args?: SelectSubset<T, vehicle_incidentsFindFirstArgs<ExtArgs>>): Prisma__vehicle_incidentsClient<$Result.GetResult<Prisma.$vehicle_incidentsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Vehicle_incidents that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {vehicle_incidentsFindFirstOrThrowArgs} args - Arguments to find a Vehicle_incidents
     * @example
     * // Get one Vehicle_incidents
     * const vehicle_incidents = await prisma.vehicle_incidents.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends vehicle_incidentsFindFirstOrThrowArgs>(args?: SelectSubset<T, vehicle_incidentsFindFirstOrThrowArgs<ExtArgs>>): Prisma__vehicle_incidentsClient<$Result.GetResult<Prisma.$vehicle_incidentsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Vehicle_incidents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {vehicle_incidentsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Vehicle_incidents
     * const vehicle_incidents = await prisma.vehicle_incidents.findMany()
     * 
     * // Get first 10 Vehicle_incidents
     * const vehicle_incidents = await prisma.vehicle_incidents.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const vehicle_incidentsWithIdOnly = await prisma.vehicle_incidents.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends vehicle_incidentsFindManyArgs>(args?: SelectSubset<T, vehicle_incidentsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$vehicle_incidentsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Vehicle_incidents.
     * @param {vehicle_incidentsCreateArgs} args - Arguments to create a Vehicle_incidents.
     * @example
     * // Create one Vehicle_incidents
     * const Vehicle_incidents = await prisma.vehicle_incidents.create({
     *   data: {
     *     // ... data to create a Vehicle_incidents
     *   }
     * })
     * 
     */
    create<T extends vehicle_incidentsCreateArgs>(args: SelectSubset<T, vehicle_incidentsCreateArgs<ExtArgs>>): Prisma__vehicle_incidentsClient<$Result.GetResult<Prisma.$vehicle_incidentsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Vehicle_incidents.
     * @param {vehicle_incidentsCreateManyArgs} args - Arguments to create many Vehicle_incidents.
     * @example
     * // Create many Vehicle_incidents
     * const vehicle_incidents = await prisma.vehicle_incidents.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends vehicle_incidentsCreateManyArgs>(args?: SelectSubset<T, vehicle_incidentsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Vehicle_incidents and returns the data saved in the database.
     * @param {vehicle_incidentsCreateManyAndReturnArgs} args - Arguments to create many Vehicle_incidents.
     * @example
     * // Create many Vehicle_incidents
     * const vehicle_incidents = await prisma.vehicle_incidents.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Vehicle_incidents and only return the `id`
     * const vehicle_incidentsWithIdOnly = await prisma.vehicle_incidents.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends vehicle_incidentsCreateManyAndReturnArgs>(args?: SelectSubset<T, vehicle_incidentsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$vehicle_incidentsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Vehicle_incidents.
     * @param {vehicle_incidentsDeleteArgs} args - Arguments to delete one Vehicle_incidents.
     * @example
     * // Delete one Vehicle_incidents
     * const Vehicle_incidents = await prisma.vehicle_incidents.delete({
     *   where: {
     *     // ... filter to delete one Vehicle_incidents
     *   }
     * })
     * 
     */
    delete<T extends vehicle_incidentsDeleteArgs>(args: SelectSubset<T, vehicle_incidentsDeleteArgs<ExtArgs>>): Prisma__vehicle_incidentsClient<$Result.GetResult<Prisma.$vehicle_incidentsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Vehicle_incidents.
     * @param {vehicle_incidentsUpdateArgs} args - Arguments to update one Vehicle_incidents.
     * @example
     * // Update one Vehicle_incidents
     * const vehicle_incidents = await prisma.vehicle_incidents.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends vehicle_incidentsUpdateArgs>(args: SelectSubset<T, vehicle_incidentsUpdateArgs<ExtArgs>>): Prisma__vehicle_incidentsClient<$Result.GetResult<Prisma.$vehicle_incidentsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Vehicle_incidents.
     * @param {vehicle_incidentsDeleteManyArgs} args - Arguments to filter Vehicle_incidents to delete.
     * @example
     * // Delete a few Vehicle_incidents
     * const { count } = await prisma.vehicle_incidents.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends vehicle_incidentsDeleteManyArgs>(args?: SelectSubset<T, vehicle_incidentsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Vehicle_incidents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {vehicle_incidentsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Vehicle_incidents
     * const vehicle_incidents = await prisma.vehicle_incidents.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends vehicle_incidentsUpdateManyArgs>(args: SelectSubset<T, vehicle_incidentsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Vehicle_incidents and returns the data updated in the database.
     * @param {vehicle_incidentsUpdateManyAndReturnArgs} args - Arguments to update many Vehicle_incidents.
     * @example
     * // Update many Vehicle_incidents
     * const vehicle_incidents = await prisma.vehicle_incidents.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Vehicle_incidents and only return the `id`
     * const vehicle_incidentsWithIdOnly = await prisma.vehicle_incidents.updateManyAndReturn({
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
    updateManyAndReturn<T extends vehicle_incidentsUpdateManyAndReturnArgs>(args: SelectSubset<T, vehicle_incidentsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$vehicle_incidentsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Vehicle_incidents.
     * @param {vehicle_incidentsUpsertArgs} args - Arguments to update or create a Vehicle_incidents.
     * @example
     * // Update or create a Vehicle_incidents
     * const vehicle_incidents = await prisma.vehicle_incidents.upsert({
     *   create: {
     *     // ... data to create a Vehicle_incidents
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Vehicle_incidents we want to update
     *   }
     * })
     */
    upsert<T extends vehicle_incidentsUpsertArgs>(args: SelectSubset<T, vehicle_incidentsUpsertArgs<ExtArgs>>): Prisma__vehicle_incidentsClient<$Result.GetResult<Prisma.$vehicle_incidentsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Vehicle_incidents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {vehicle_incidentsCountArgs} args - Arguments to filter Vehicle_incidents to count.
     * @example
     * // Count the number of Vehicle_incidents
     * const count = await prisma.vehicle_incidents.count({
     *   where: {
     *     // ... the filter for the Vehicle_incidents we want to count
     *   }
     * })
    **/
    count<T extends vehicle_incidentsCountArgs>(
      args?: Subset<T, vehicle_incidentsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Vehicle_incidentsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Vehicle_incidents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Vehicle_incidentsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends Vehicle_incidentsAggregateArgs>(args: Subset<T, Vehicle_incidentsAggregateArgs>): Prisma.PrismaPromise<GetVehicle_incidentsAggregateType<T>>

    /**
     * Group by Vehicle_incidents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {vehicle_incidentsGroupByArgs} args - Group by arguments.
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
      T extends vehicle_incidentsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: vehicle_incidentsGroupByArgs['orderBy'] }
        : { orderBy?: vehicle_incidentsGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, vehicle_incidentsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVehicle_incidentsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the vehicle_incidents model
   */
  readonly fields: vehicle_incidentsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for vehicle_incidents.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__vehicle_incidentsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    vehicle_master<T extends vehicle_incidents$vehicle_masterArgs<ExtArgs> = {}>(args?: Subset<T, vehicle_incidents$vehicle_masterArgs<ExtArgs>>): Prisma__vehicle_masterClient<$Result.GetResult<Prisma.$vehicle_masterPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the vehicle_incidents model
   */
  interface vehicle_incidentsFieldRefs {
    readonly id: FieldRef<"vehicle_incidents", 'Int'>
    readonly vehicle_id: FieldRef<"vehicle_incidents", 'String'>
    readonly date_time: FieldRef<"vehicle_incidents", 'DateTime'>
    readonly main_road: FieldRef<"vehicle_incidents", 'String'>
    readonly cross_road: FieldRef<"vehicle_incidents", 'String'>
    readonly speed_flagged_kmh: FieldRef<"vehicle_incidents", 'Decimal'>
    readonly speed_limit_kmh: FieldRef<"vehicle_incidents", 'Decimal'>
    readonly excess_speed_kmh: FieldRef<"vehicle_incidents", 'Decimal'>
    readonly status: FieldRef<"vehicle_incidents", 'String'>
  }
    

  // Custom InputTypes
  /**
   * vehicle_incidents findUnique
   */
  export type vehicle_incidentsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the vehicle_incidents
     */
    select?: vehicle_incidentsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the vehicle_incidents
     */
    omit?: vehicle_incidentsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: vehicle_incidentsInclude<ExtArgs> | null
    /**
     * Filter, which vehicle_incidents to fetch.
     */
    where: vehicle_incidentsWhereUniqueInput
  }

  /**
   * vehicle_incidents findUniqueOrThrow
   */
  export type vehicle_incidentsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the vehicle_incidents
     */
    select?: vehicle_incidentsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the vehicle_incidents
     */
    omit?: vehicle_incidentsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: vehicle_incidentsInclude<ExtArgs> | null
    /**
     * Filter, which vehicle_incidents to fetch.
     */
    where: vehicle_incidentsWhereUniqueInput
  }

  /**
   * vehicle_incidents findFirst
   */
  export type vehicle_incidentsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the vehicle_incidents
     */
    select?: vehicle_incidentsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the vehicle_incidents
     */
    omit?: vehicle_incidentsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: vehicle_incidentsInclude<ExtArgs> | null
    /**
     * Filter, which vehicle_incidents to fetch.
     */
    where?: vehicle_incidentsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of vehicle_incidents to fetch.
     */
    orderBy?: vehicle_incidentsOrderByWithRelationInput | vehicle_incidentsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for vehicle_incidents.
     */
    cursor?: vehicle_incidentsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` vehicle_incidents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` vehicle_incidents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of vehicle_incidents.
     */
    distinct?: Vehicle_incidentsScalarFieldEnum | Vehicle_incidentsScalarFieldEnum[]
  }

  /**
   * vehicle_incidents findFirstOrThrow
   */
  export type vehicle_incidentsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the vehicle_incidents
     */
    select?: vehicle_incidentsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the vehicle_incidents
     */
    omit?: vehicle_incidentsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: vehicle_incidentsInclude<ExtArgs> | null
    /**
     * Filter, which vehicle_incidents to fetch.
     */
    where?: vehicle_incidentsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of vehicle_incidents to fetch.
     */
    orderBy?: vehicle_incidentsOrderByWithRelationInput | vehicle_incidentsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for vehicle_incidents.
     */
    cursor?: vehicle_incidentsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` vehicle_incidents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` vehicle_incidents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of vehicle_incidents.
     */
    distinct?: Vehicle_incidentsScalarFieldEnum | Vehicle_incidentsScalarFieldEnum[]
  }

  /**
   * vehicle_incidents findMany
   */
  export type vehicle_incidentsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the vehicle_incidents
     */
    select?: vehicle_incidentsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the vehicle_incidents
     */
    omit?: vehicle_incidentsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: vehicle_incidentsInclude<ExtArgs> | null
    /**
     * Filter, which vehicle_incidents to fetch.
     */
    where?: vehicle_incidentsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of vehicle_incidents to fetch.
     */
    orderBy?: vehicle_incidentsOrderByWithRelationInput | vehicle_incidentsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing vehicle_incidents.
     */
    cursor?: vehicle_incidentsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` vehicle_incidents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` vehicle_incidents.
     */
    skip?: number
    distinct?: Vehicle_incidentsScalarFieldEnum | Vehicle_incidentsScalarFieldEnum[]
  }

  /**
   * vehicle_incidents create
   */
  export type vehicle_incidentsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the vehicle_incidents
     */
    select?: vehicle_incidentsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the vehicle_incidents
     */
    omit?: vehicle_incidentsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: vehicle_incidentsInclude<ExtArgs> | null
    /**
     * The data needed to create a vehicle_incidents.
     */
    data?: XOR<vehicle_incidentsCreateInput, vehicle_incidentsUncheckedCreateInput>
  }

  /**
   * vehicle_incidents createMany
   */
  export type vehicle_incidentsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many vehicle_incidents.
     */
    data: vehicle_incidentsCreateManyInput | vehicle_incidentsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * vehicle_incidents createManyAndReturn
   */
  export type vehicle_incidentsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the vehicle_incidents
     */
    select?: vehicle_incidentsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the vehicle_incidents
     */
    omit?: vehicle_incidentsOmit<ExtArgs> | null
    /**
     * The data used to create many vehicle_incidents.
     */
    data: vehicle_incidentsCreateManyInput | vehicle_incidentsCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: vehicle_incidentsIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * vehicle_incidents update
   */
  export type vehicle_incidentsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the vehicle_incidents
     */
    select?: vehicle_incidentsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the vehicle_incidents
     */
    omit?: vehicle_incidentsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: vehicle_incidentsInclude<ExtArgs> | null
    /**
     * The data needed to update a vehicle_incidents.
     */
    data: XOR<vehicle_incidentsUpdateInput, vehicle_incidentsUncheckedUpdateInput>
    /**
     * Choose, which vehicle_incidents to update.
     */
    where: vehicle_incidentsWhereUniqueInput
  }

  /**
   * vehicle_incidents updateMany
   */
  export type vehicle_incidentsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update vehicle_incidents.
     */
    data: XOR<vehicle_incidentsUpdateManyMutationInput, vehicle_incidentsUncheckedUpdateManyInput>
    /**
     * Filter which vehicle_incidents to update
     */
    where?: vehicle_incidentsWhereInput
    /**
     * Limit how many vehicle_incidents to update.
     */
    limit?: number
  }

  /**
   * vehicle_incidents updateManyAndReturn
   */
  export type vehicle_incidentsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the vehicle_incidents
     */
    select?: vehicle_incidentsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the vehicle_incidents
     */
    omit?: vehicle_incidentsOmit<ExtArgs> | null
    /**
     * The data used to update vehicle_incidents.
     */
    data: XOR<vehicle_incidentsUpdateManyMutationInput, vehicle_incidentsUncheckedUpdateManyInput>
    /**
     * Filter which vehicle_incidents to update
     */
    where?: vehicle_incidentsWhereInput
    /**
     * Limit how many vehicle_incidents to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: vehicle_incidentsIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * vehicle_incidents upsert
   */
  export type vehicle_incidentsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the vehicle_incidents
     */
    select?: vehicle_incidentsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the vehicle_incidents
     */
    omit?: vehicle_incidentsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: vehicle_incidentsInclude<ExtArgs> | null
    /**
     * The filter to search for the vehicle_incidents to update in case it exists.
     */
    where: vehicle_incidentsWhereUniqueInput
    /**
     * In case the vehicle_incidents found by the `where` argument doesn't exist, create a new vehicle_incidents with this data.
     */
    create: XOR<vehicle_incidentsCreateInput, vehicle_incidentsUncheckedCreateInput>
    /**
     * In case the vehicle_incidents was found with the provided `where` argument, update it with this data.
     */
    update: XOR<vehicle_incidentsUpdateInput, vehicle_incidentsUncheckedUpdateInput>
  }

  /**
   * vehicle_incidents delete
   */
  export type vehicle_incidentsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the vehicle_incidents
     */
    select?: vehicle_incidentsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the vehicle_incidents
     */
    omit?: vehicle_incidentsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: vehicle_incidentsInclude<ExtArgs> | null
    /**
     * Filter which vehicle_incidents to delete.
     */
    where: vehicle_incidentsWhereUniqueInput
  }

  /**
   * vehicle_incidents deleteMany
   */
  export type vehicle_incidentsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which vehicle_incidents to delete
     */
    where?: vehicle_incidentsWhereInput
    /**
     * Limit how many vehicle_incidents to delete.
     */
    limit?: number
  }

  /**
   * vehicle_incidents.vehicle_master
   */
  export type vehicle_incidents$vehicle_masterArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the vehicle_master
     */
    select?: vehicle_masterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the vehicle_master
     */
    omit?: vehicle_masterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: vehicle_masterInclude<ExtArgs> | null
    where?: vehicle_masterWhereInput
  }

  /**
   * vehicle_incidents without action
   */
  export type vehicle_incidentsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the vehicle_incidents
     */
    select?: vehicle_incidentsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the vehicle_incidents
     */
    omit?: vehicle_incidentsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: vehicle_incidentsInclude<ExtArgs> | null
  }


  /**
   * Model vehicle_master
   */

  export type AggregateVehicle_master = {
    _count: Vehicle_masterCountAggregateOutputType | null
    _avg: Vehicle_masterAvgAggregateOutputType | null
    _sum: Vehicle_masterSumAggregateOutputType | null
    _min: Vehicle_masterMinAggregateOutputType | null
    _max: Vehicle_masterMaxAggregateOutputType | null
  }

  export type Vehicle_masterAvgAggregateOutputType = {
    id: number | null
  }

  export type Vehicle_masterSumAggregateOutputType = {
    id: number | null
  }

  export type Vehicle_masterMinAggregateOutputType = {
    id: number | null
    vehicle_id: string | null
    vehicle_type: string | null
    city: string | null
    zone: string | null
    division: string | null
    ward: string | null
    status: string | null
    created_at: Date | null
  }

  export type Vehicle_masterMaxAggregateOutputType = {
    id: number | null
    vehicle_id: string | null
    vehicle_type: string | null
    city: string | null
    zone: string | null
    division: string | null
    ward: string | null
    status: string | null
    created_at: Date | null
  }

  export type Vehicle_masterCountAggregateOutputType = {
    id: number
    vehicle_id: number
    vehicle_type: number
    city: number
    zone: number
    division: number
    ward: number
    status: number
    created_at: number
    _all: number
  }


  export type Vehicle_masterAvgAggregateInputType = {
    id?: true
  }

  export type Vehicle_masterSumAggregateInputType = {
    id?: true
  }

  export type Vehicle_masterMinAggregateInputType = {
    id?: true
    vehicle_id?: true
    vehicle_type?: true
    city?: true
    zone?: true
    division?: true
    ward?: true
    status?: true
    created_at?: true
  }

  export type Vehicle_masterMaxAggregateInputType = {
    id?: true
    vehicle_id?: true
    vehicle_type?: true
    city?: true
    zone?: true
    division?: true
    ward?: true
    status?: true
    created_at?: true
  }

  export type Vehicle_masterCountAggregateInputType = {
    id?: true
    vehicle_id?: true
    vehicle_type?: true
    city?: true
    zone?: true
    division?: true
    ward?: true
    status?: true
    created_at?: true
    _all?: true
  }

  export type Vehicle_masterAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which vehicle_master to aggregate.
     */
    where?: vehicle_masterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of vehicle_masters to fetch.
     */
    orderBy?: vehicle_masterOrderByWithRelationInput | vehicle_masterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: vehicle_masterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` vehicle_masters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` vehicle_masters.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned vehicle_masters
    **/
    _count?: true | Vehicle_masterCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Vehicle_masterAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Vehicle_masterSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Vehicle_masterMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Vehicle_masterMaxAggregateInputType
  }

  export type GetVehicle_masterAggregateType<T extends Vehicle_masterAggregateArgs> = {
        [P in keyof T & keyof AggregateVehicle_master]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateVehicle_master[P]>
      : GetScalarType<T[P], AggregateVehicle_master[P]>
  }




  export type vehicle_masterGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: vehicle_masterWhereInput
    orderBy?: vehicle_masterOrderByWithAggregationInput | vehicle_masterOrderByWithAggregationInput[]
    by: Vehicle_masterScalarFieldEnum[] | Vehicle_masterScalarFieldEnum
    having?: vehicle_masterScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Vehicle_masterCountAggregateInputType | true
    _avg?: Vehicle_masterAvgAggregateInputType
    _sum?: Vehicle_masterSumAggregateInputType
    _min?: Vehicle_masterMinAggregateInputType
    _max?: Vehicle_masterMaxAggregateInputType
  }

  export type Vehicle_masterGroupByOutputType = {
    id: number
    vehicle_id: string
    vehicle_type: string | null
    city: string | null
    zone: string | null
    division: string | null
    ward: string | null
    status: string | null
    created_at: Date | null
    _count: Vehicle_masterCountAggregateOutputType | null
    _avg: Vehicle_masterAvgAggregateOutputType | null
    _sum: Vehicle_masterSumAggregateOutputType | null
    _min: Vehicle_masterMinAggregateOutputType | null
    _max: Vehicle_masterMaxAggregateOutputType | null
  }

  type GetVehicle_masterGroupByPayload<T extends vehicle_masterGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Vehicle_masterGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Vehicle_masterGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Vehicle_masterGroupByOutputType[P]>
            : GetScalarType<T[P], Vehicle_masterGroupByOutputType[P]>
        }
      >
    >


  export type vehicle_masterSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    vehicle_id?: boolean
    vehicle_type?: boolean
    city?: boolean
    zone?: boolean
    division?: boolean
    ward?: boolean
    status?: boolean
    created_at?: boolean
    vehicle_incidents?: boolean | vehicle_master$vehicle_incidentsArgs<ExtArgs>
    vehicle_telemetry?: boolean | vehicle_master$vehicle_telemetryArgs<ExtArgs>
    _count?: boolean | Vehicle_masterCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["vehicle_master"]>

  export type vehicle_masterSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    vehicle_id?: boolean
    vehicle_type?: boolean
    city?: boolean
    zone?: boolean
    division?: boolean
    ward?: boolean
    status?: boolean
    created_at?: boolean
  }, ExtArgs["result"]["vehicle_master"]>

  export type vehicle_masterSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    vehicle_id?: boolean
    vehicle_type?: boolean
    city?: boolean
    zone?: boolean
    division?: boolean
    ward?: boolean
    status?: boolean
    created_at?: boolean
  }, ExtArgs["result"]["vehicle_master"]>

  export type vehicle_masterSelectScalar = {
    id?: boolean
    vehicle_id?: boolean
    vehicle_type?: boolean
    city?: boolean
    zone?: boolean
    division?: boolean
    ward?: boolean
    status?: boolean
    created_at?: boolean
  }

  export type vehicle_masterOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "vehicle_id" | "vehicle_type" | "city" | "zone" | "division" | "ward" | "status" | "created_at", ExtArgs["result"]["vehicle_master"]>
  export type vehicle_masterInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    vehicle_incidents?: boolean | vehicle_master$vehicle_incidentsArgs<ExtArgs>
    vehicle_telemetry?: boolean | vehicle_master$vehicle_telemetryArgs<ExtArgs>
    _count?: boolean | Vehicle_masterCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type vehicle_masterIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type vehicle_masterIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $vehicle_masterPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "vehicle_master"
    objects: {
      vehicle_incidents: Prisma.$vehicle_incidentsPayload<ExtArgs>[]
      vehicle_telemetry: Prisma.$vehicle_telemetryPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      vehicle_id: string
      vehicle_type: string | null
      city: string | null
      zone: string | null
      division: string | null
      ward: string | null
      status: string | null
      created_at: Date | null
    }, ExtArgs["result"]["vehicle_master"]>
    composites: {}
  }

  type vehicle_masterGetPayload<S extends boolean | null | undefined | vehicle_masterDefaultArgs> = $Result.GetResult<Prisma.$vehicle_masterPayload, S>

  type vehicle_masterCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<vehicle_masterFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Vehicle_masterCountAggregateInputType | true
    }

  export interface vehicle_masterDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['vehicle_master'], meta: { name: 'vehicle_master' } }
    /**
     * Find zero or one Vehicle_master that matches the filter.
     * @param {vehicle_masterFindUniqueArgs} args - Arguments to find a Vehicle_master
     * @example
     * // Get one Vehicle_master
     * const vehicle_master = await prisma.vehicle_master.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends vehicle_masterFindUniqueArgs>(args: SelectSubset<T, vehicle_masterFindUniqueArgs<ExtArgs>>): Prisma__vehicle_masterClient<$Result.GetResult<Prisma.$vehicle_masterPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Vehicle_master that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {vehicle_masterFindUniqueOrThrowArgs} args - Arguments to find a Vehicle_master
     * @example
     * // Get one Vehicle_master
     * const vehicle_master = await prisma.vehicle_master.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends vehicle_masterFindUniqueOrThrowArgs>(args: SelectSubset<T, vehicle_masterFindUniqueOrThrowArgs<ExtArgs>>): Prisma__vehicle_masterClient<$Result.GetResult<Prisma.$vehicle_masterPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Vehicle_master that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {vehicle_masterFindFirstArgs} args - Arguments to find a Vehicle_master
     * @example
     * // Get one Vehicle_master
     * const vehicle_master = await prisma.vehicle_master.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends vehicle_masterFindFirstArgs>(args?: SelectSubset<T, vehicle_masterFindFirstArgs<ExtArgs>>): Prisma__vehicle_masterClient<$Result.GetResult<Prisma.$vehicle_masterPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Vehicle_master that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {vehicle_masterFindFirstOrThrowArgs} args - Arguments to find a Vehicle_master
     * @example
     * // Get one Vehicle_master
     * const vehicle_master = await prisma.vehicle_master.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends vehicle_masterFindFirstOrThrowArgs>(args?: SelectSubset<T, vehicle_masterFindFirstOrThrowArgs<ExtArgs>>): Prisma__vehicle_masterClient<$Result.GetResult<Prisma.$vehicle_masterPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Vehicle_masters that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {vehicle_masterFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Vehicle_masters
     * const vehicle_masters = await prisma.vehicle_master.findMany()
     * 
     * // Get first 10 Vehicle_masters
     * const vehicle_masters = await prisma.vehicle_master.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const vehicle_masterWithIdOnly = await prisma.vehicle_master.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends vehicle_masterFindManyArgs>(args?: SelectSubset<T, vehicle_masterFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$vehicle_masterPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Vehicle_master.
     * @param {vehicle_masterCreateArgs} args - Arguments to create a Vehicle_master.
     * @example
     * // Create one Vehicle_master
     * const Vehicle_master = await prisma.vehicle_master.create({
     *   data: {
     *     // ... data to create a Vehicle_master
     *   }
     * })
     * 
     */
    create<T extends vehicle_masterCreateArgs>(args: SelectSubset<T, vehicle_masterCreateArgs<ExtArgs>>): Prisma__vehicle_masterClient<$Result.GetResult<Prisma.$vehicle_masterPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Vehicle_masters.
     * @param {vehicle_masterCreateManyArgs} args - Arguments to create many Vehicle_masters.
     * @example
     * // Create many Vehicle_masters
     * const vehicle_master = await prisma.vehicle_master.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends vehicle_masterCreateManyArgs>(args?: SelectSubset<T, vehicle_masterCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Vehicle_masters and returns the data saved in the database.
     * @param {vehicle_masterCreateManyAndReturnArgs} args - Arguments to create many Vehicle_masters.
     * @example
     * // Create many Vehicle_masters
     * const vehicle_master = await prisma.vehicle_master.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Vehicle_masters and only return the `id`
     * const vehicle_masterWithIdOnly = await prisma.vehicle_master.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends vehicle_masterCreateManyAndReturnArgs>(args?: SelectSubset<T, vehicle_masterCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$vehicle_masterPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Vehicle_master.
     * @param {vehicle_masterDeleteArgs} args - Arguments to delete one Vehicle_master.
     * @example
     * // Delete one Vehicle_master
     * const Vehicle_master = await prisma.vehicle_master.delete({
     *   where: {
     *     // ... filter to delete one Vehicle_master
     *   }
     * })
     * 
     */
    delete<T extends vehicle_masterDeleteArgs>(args: SelectSubset<T, vehicle_masterDeleteArgs<ExtArgs>>): Prisma__vehicle_masterClient<$Result.GetResult<Prisma.$vehicle_masterPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Vehicle_master.
     * @param {vehicle_masterUpdateArgs} args - Arguments to update one Vehicle_master.
     * @example
     * // Update one Vehicle_master
     * const vehicle_master = await prisma.vehicle_master.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends vehicle_masterUpdateArgs>(args: SelectSubset<T, vehicle_masterUpdateArgs<ExtArgs>>): Prisma__vehicle_masterClient<$Result.GetResult<Prisma.$vehicle_masterPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Vehicle_masters.
     * @param {vehicle_masterDeleteManyArgs} args - Arguments to filter Vehicle_masters to delete.
     * @example
     * // Delete a few Vehicle_masters
     * const { count } = await prisma.vehicle_master.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends vehicle_masterDeleteManyArgs>(args?: SelectSubset<T, vehicle_masterDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Vehicle_masters.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {vehicle_masterUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Vehicle_masters
     * const vehicle_master = await prisma.vehicle_master.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends vehicle_masterUpdateManyArgs>(args: SelectSubset<T, vehicle_masterUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Vehicle_masters and returns the data updated in the database.
     * @param {vehicle_masterUpdateManyAndReturnArgs} args - Arguments to update many Vehicle_masters.
     * @example
     * // Update many Vehicle_masters
     * const vehicle_master = await prisma.vehicle_master.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Vehicle_masters and only return the `id`
     * const vehicle_masterWithIdOnly = await prisma.vehicle_master.updateManyAndReturn({
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
    updateManyAndReturn<T extends vehicle_masterUpdateManyAndReturnArgs>(args: SelectSubset<T, vehicle_masterUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$vehicle_masterPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Vehicle_master.
     * @param {vehicle_masterUpsertArgs} args - Arguments to update or create a Vehicle_master.
     * @example
     * // Update or create a Vehicle_master
     * const vehicle_master = await prisma.vehicle_master.upsert({
     *   create: {
     *     // ... data to create a Vehicle_master
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Vehicle_master we want to update
     *   }
     * })
     */
    upsert<T extends vehicle_masterUpsertArgs>(args: SelectSubset<T, vehicle_masterUpsertArgs<ExtArgs>>): Prisma__vehicle_masterClient<$Result.GetResult<Prisma.$vehicle_masterPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Vehicle_masters.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {vehicle_masterCountArgs} args - Arguments to filter Vehicle_masters to count.
     * @example
     * // Count the number of Vehicle_masters
     * const count = await prisma.vehicle_master.count({
     *   where: {
     *     // ... the filter for the Vehicle_masters we want to count
     *   }
     * })
    **/
    count<T extends vehicle_masterCountArgs>(
      args?: Subset<T, vehicle_masterCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Vehicle_masterCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Vehicle_master.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Vehicle_masterAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends Vehicle_masterAggregateArgs>(args: Subset<T, Vehicle_masterAggregateArgs>): Prisma.PrismaPromise<GetVehicle_masterAggregateType<T>>

    /**
     * Group by Vehicle_master.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {vehicle_masterGroupByArgs} args - Group by arguments.
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
      T extends vehicle_masterGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: vehicle_masterGroupByArgs['orderBy'] }
        : { orderBy?: vehicle_masterGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, vehicle_masterGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVehicle_masterGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the vehicle_master model
   */
  readonly fields: vehicle_masterFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for vehicle_master.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__vehicle_masterClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    vehicle_incidents<T extends vehicle_master$vehicle_incidentsArgs<ExtArgs> = {}>(args?: Subset<T, vehicle_master$vehicle_incidentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$vehicle_incidentsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    vehicle_telemetry<T extends vehicle_master$vehicle_telemetryArgs<ExtArgs> = {}>(args?: Subset<T, vehicle_master$vehicle_telemetryArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$vehicle_telemetryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the vehicle_master model
   */
  interface vehicle_masterFieldRefs {
    readonly id: FieldRef<"vehicle_master", 'Int'>
    readonly vehicle_id: FieldRef<"vehicle_master", 'String'>
    readonly vehicle_type: FieldRef<"vehicle_master", 'String'>
    readonly city: FieldRef<"vehicle_master", 'String'>
    readonly zone: FieldRef<"vehicle_master", 'String'>
    readonly division: FieldRef<"vehicle_master", 'String'>
    readonly ward: FieldRef<"vehicle_master", 'String'>
    readonly status: FieldRef<"vehicle_master", 'String'>
    readonly created_at: FieldRef<"vehicle_master", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * vehicle_master findUnique
   */
  export type vehicle_masterFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the vehicle_master
     */
    select?: vehicle_masterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the vehicle_master
     */
    omit?: vehicle_masterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: vehicle_masterInclude<ExtArgs> | null
    /**
     * Filter, which vehicle_master to fetch.
     */
    where: vehicle_masterWhereUniqueInput
  }

  /**
   * vehicle_master findUniqueOrThrow
   */
  export type vehicle_masterFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the vehicle_master
     */
    select?: vehicle_masterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the vehicle_master
     */
    omit?: vehicle_masterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: vehicle_masterInclude<ExtArgs> | null
    /**
     * Filter, which vehicle_master to fetch.
     */
    where: vehicle_masterWhereUniqueInput
  }

  /**
   * vehicle_master findFirst
   */
  export type vehicle_masterFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the vehicle_master
     */
    select?: vehicle_masterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the vehicle_master
     */
    omit?: vehicle_masterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: vehicle_masterInclude<ExtArgs> | null
    /**
     * Filter, which vehicle_master to fetch.
     */
    where?: vehicle_masterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of vehicle_masters to fetch.
     */
    orderBy?: vehicle_masterOrderByWithRelationInput | vehicle_masterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for vehicle_masters.
     */
    cursor?: vehicle_masterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` vehicle_masters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` vehicle_masters.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of vehicle_masters.
     */
    distinct?: Vehicle_masterScalarFieldEnum | Vehicle_masterScalarFieldEnum[]
  }

  /**
   * vehicle_master findFirstOrThrow
   */
  export type vehicle_masterFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the vehicle_master
     */
    select?: vehicle_masterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the vehicle_master
     */
    omit?: vehicle_masterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: vehicle_masterInclude<ExtArgs> | null
    /**
     * Filter, which vehicle_master to fetch.
     */
    where?: vehicle_masterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of vehicle_masters to fetch.
     */
    orderBy?: vehicle_masterOrderByWithRelationInput | vehicle_masterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for vehicle_masters.
     */
    cursor?: vehicle_masterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` vehicle_masters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` vehicle_masters.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of vehicle_masters.
     */
    distinct?: Vehicle_masterScalarFieldEnum | Vehicle_masterScalarFieldEnum[]
  }

  /**
   * vehicle_master findMany
   */
  export type vehicle_masterFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the vehicle_master
     */
    select?: vehicle_masterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the vehicle_master
     */
    omit?: vehicle_masterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: vehicle_masterInclude<ExtArgs> | null
    /**
     * Filter, which vehicle_masters to fetch.
     */
    where?: vehicle_masterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of vehicle_masters to fetch.
     */
    orderBy?: vehicle_masterOrderByWithRelationInput | vehicle_masterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing vehicle_masters.
     */
    cursor?: vehicle_masterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` vehicle_masters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` vehicle_masters.
     */
    skip?: number
    distinct?: Vehicle_masterScalarFieldEnum | Vehicle_masterScalarFieldEnum[]
  }

  /**
   * vehicle_master create
   */
  export type vehicle_masterCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the vehicle_master
     */
    select?: vehicle_masterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the vehicle_master
     */
    omit?: vehicle_masterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: vehicle_masterInclude<ExtArgs> | null
    /**
     * The data needed to create a vehicle_master.
     */
    data: XOR<vehicle_masterCreateInput, vehicle_masterUncheckedCreateInput>
  }

  /**
   * vehicle_master createMany
   */
  export type vehicle_masterCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many vehicle_masters.
     */
    data: vehicle_masterCreateManyInput | vehicle_masterCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * vehicle_master createManyAndReturn
   */
  export type vehicle_masterCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the vehicle_master
     */
    select?: vehicle_masterSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the vehicle_master
     */
    omit?: vehicle_masterOmit<ExtArgs> | null
    /**
     * The data used to create many vehicle_masters.
     */
    data: vehicle_masterCreateManyInput | vehicle_masterCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * vehicle_master update
   */
  export type vehicle_masterUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the vehicle_master
     */
    select?: vehicle_masterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the vehicle_master
     */
    omit?: vehicle_masterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: vehicle_masterInclude<ExtArgs> | null
    /**
     * The data needed to update a vehicle_master.
     */
    data: XOR<vehicle_masterUpdateInput, vehicle_masterUncheckedUpdateInput>
    /**
     * Choose, which vehicle_master to update.
     */
    where: vehicle_masterWhereUniqueInput
  }

  /**
   * vehicle_master updateMany
   */
  export type vehicle_masterUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update vehicle_masters.
     */
    data: XOR<vehicle_masterUpdateManyMutationInput, vehicle_masterUncheckedUpdateManyInput>
    /**
     * Filter which vehicle_masters to update
     */
    where?: vehicle_masterWhereInput
    /**
     * Limit how many vehicle_masters to update.
     */
    limit?: number
  }

  /**
   * vehicle_master updateManyAndReturn
   */
  export type vehicle_masterUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the vehicle_master
     */
    select?: vehicle_masterSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the vehicle_master
     */
    omit?: vehicle_masterOmit<ExtArgs> | null
    /**
     * The data used to update vehicle_masters.
     */
    data: XOR<vehicle_masterUpdateManyMutationInput, vehicle_masterUncheckedUpdateManyInput>
    /**
     * Filter which vehicle_masters to update
     */
    where?: vehicle_masterWhereInput
    /**
     * Limit how many vehicle_masters to update.
     */
    limit?: number
  }

  /**
   * vehicle_master upsert
   */
  export type vehicle_masterUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the vehicle_master
     */
    select?: vehicle_masterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the vehicle_master
     */
    omit?: vehicle_masterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: vehicle_masterInclude<ExtArgs> | null
    /**
     * The filter to search for the vehicle_master to update in case it exists.
     */
    where: vehicle_masterWhereUniqueInput
    /**
     * In case the vehicle_master found by the `where` argument doesn't exist, create a new vehicle_master with this data.
     */
    create: XOR<vehicle_masterCreateInput, vehicle_masterUncheckedCreateInput>
    /**
     * In case the vehicle_master was found with the provided `where` argument, update it with this data.
     */
    update: XOR<vehicle_masterUpdateInput, vehicle_masterUncheckedUpdateInput>
  }

  /**
   * vehicle_master delete
   */
  export type vehicle_masterDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the vehicle_master
     */
    select?: vehicle_masterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the vehicle_master
     */
    omit?: vehicle_masterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: vehicle_masterInclude<ExtArgs> | null
    /**
     * Filter which vehicle_master to delete.
     */
    where: vehicle_masterWhereUniqueInput
  }

  /**
   * vehicle_master deleteMany
   */
  export type vehicle_masterDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which vehicle_masters to delete
     */
    where?: vehicle_masterWhereInput
    /**
     * Limit how many vehicle_masters to delete.
     */
    limit?: number
  }

  /**
   * vehicle_master.vehicle_incidents
   */
  export type vehicle_master$vehicle_incidentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the vehicle_incidents
     */
    select?: vehicle_incidentsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the vehicle_incidents
     */
    omit?: vehicle_incidentsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: vehicle_incidentsInclude<ExtArgs> | null
    where?: vehicle_incidentsWhereInput
    orderBy?: vehicle_incidentsOrderByWithRelationInput | vehicle_incidentsOrderByWithRelationInput[]
    cursor?: vehicle_incidentsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Vehicle_incidentsScalarFieldEnum | Vehicle_incidentsScalarFieldEnum[]
  }

  /**
   * vehicle_master.vehicle_telemetry
   */
  export type vehicle_master$vehicle_telemetryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the vehicle_telemetry
     */
    select?: vehicle_telemetrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the vehicle_telemetry
     */
    omit?: vehicle_telemetryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: vehicle_telemetryInclude<ExtArgs> | null
    where?: vehicle_telemetryWhereInput
    orderBy?: vehicle_telemetryOrderByWithRelationInput | vehicle_telemetryOrderByWithRelationInput[]
    cursor?: vehicle_telemetryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Vehicle_telemetryScalarFieldEnum | Vehicle_telemetryScalarFieldEnum[]
  }

  /**
   * vehicle_master without action
   */
  export type vehicle_masterDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the vehicle_master
     */
    select?: vehicle_masterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the vehicle_master
     */
    omit?: vehicle_masterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: vehicle_masterInclude<ExtArgs> | null
  }


  /**
   * Model vehicle_telemetry
   */

  export type AggregateVehicle_telemetry = {
    _count: Vehicle_telemetryCountAggregateOutputType | null
    _avg: Vehicle_telemetryAvgAggregateOutputType | null
    _sum: Vehicle_telemetrySumAggregateOutputType | null
    _min: Vehicle_telemetryMinAggregateOutputType | null
    _max: Vehicle_telemetryMaxAggregateOutputType | null
  }

  export type Vehicle_telemetryAvgAggregateOutputType = {
    id: number | null
    latitude: Decimal | null
    longitude: Decimal | null
    speed_kmh: Decimal | null
    fuel_level: Decimal | null
    battery_health: Decimal | null
  }

  export type Vehicle_telemetrySumAggregateOutputType = {
    id: number | null
    latitude: Decimal | null
    longitude: Decimal | null
    speed_kmh: Decimal | null
    fuel_level: Decimal | null
    battery_health: Decimal | null
  }

  export type Vehicle_telemetryMinAggregateOutputType = {
    id: number | null
    vehicle_id: string | null
    latitude: Decimal | null
    longitude: Decimal | null
    speed_kmh: Decimal | null
    fuel_level: Decimal | null
    battery_health: Decimal | null
    engine_status: string | null
    recorded_at: Date | null
  }

  export type Vehicle_telemetryMaxAggregateOutputType = {
    id: number | null
    vehicle_id: string | null
    latitude: Decimal | null
    longitude: Decimal | null
    speed_kmh: Decimal | null
    fuel_level: Decimal | null
    battery_health: Decimal | null
    engine_status: string | null
    recorded_at: Date | null
  }

  export type Vehicle_telemetryCountAggregateOutputType = {
    id: number
    vehicle_id: number
    latitude: number
    longitude: number
    speed_kmh: number
    fuel_level: number
    battery_health: number
    engine_status: number
    recorded_at: number
    _all: number
  }


  export type Vehicle_telemetryAvgAggregateInputType = {
    id?: true
    latitude?: true
    longitude?: true
    speed_kmh?: true
    fuel_level?: true
    battery_health?: true
  }

  export type Vehicle_telemetrySumAggregateInputType = {
    id?: true
    latitude?: true
    longitude?: true
    speed_kmh?: true
    fuel_level?: true
    battery_health?: true
  }

  export type Vehicle_telemetryMinAggregateInputType = {
    id?: true
    vehicle_id?: true
    latitude?: true
    longitude?: true
    speed_kmh?: true
    fuel_level?: true
    battery_health?: true
    engine_status?: true
    recorded_at?: true
  }

  export type Vehicle_telemetryMaxAggregateInputType = {
    id?: true
    vehicle_id?: true
    latitude?: true
    longitude?: true
    speed_kmh?: true
    fuel_level?: true
    battery_health?: true
    engine_status?: true
    recorded_at?: true
  }

  export type Vehicle_telemetryCountAggregateInputType = {
    id?: true
    vehicle_id?: true
    latitude?: true
    longitude?: true
    speed_kmh?: true
    fuel_level?: true
    battery_health?: true
    engine_status?: true
    recorded_at?: true
    _all?: true
  }

  export type Vehicle_telemetryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which vehicle_telemetry to aggregate.
     */
    where?: vehicle_telemetryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of vehicle_telemetries to fetch.
     */
    orderBy?: vehicle_telemetryOrderByWithRelationInput | vehicle_telemetryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: vehicle_telemetryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` vehicle_telemetries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` vehicle_telemetries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned vehicle_telemetries
    **/
    _count?: true | Vehicle_telemetryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Vehicle_telemetryAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Vehicle_telemetrySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Vehicle_telemetryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Vehicle_telemetryMaxAggregateInputType
  }

  export type GetVehicle_telemetryAggregateType<T extends Vehicle_telemetryAggregateArgs> = {
        [P in keyof T & keyof AggregateVehicle_telemetry]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateVehicle_telemetry[P]>
      : GetScalarType<T[P], AggregateVehicle_telemetry[P]>
  }




  export type vehicle_telemetryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: vehicle_telemetryWhereInput
    orderBy?: vehicle_telemetryOrderByWithAggregationInput | vehicle_telemetryOrderByWithAggregationInput[]
    by: Vehicle_telemetryScalarFieldEnum[] | Vehicle_telemetryScalarFieldEnum
    having?: vehicle_telemetryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Vehicle_telemetryCountAggregateInputType | true
    _avg?: Vehicle_telemetryAvgAggregateInputType
    _sum?: Vehicle_telemetrySumAggregateInputType
    _min?: Vehicle_telemetryMinAggregateInputType
    _max?: Vehicle_telemetryMaxAggregateInputType
  }

  export type Vehicle_telemetryGroupByOutputType = {
    id: number
    vehicle_id: string | null
    latitude: Decimal | null
    longitude: Decimal | null
    speed_kmh: Decimal | null
    fuel_level: Decimal | null
    battery_health: Decimal | null
    engine_status: string | null
    recorded_at: Date | null
    _count: Vehicle_telemetryCountAggregateOutputType | null
    _avg: Vehicle_telemetryAvgAggregateOutputType | null
    _sum: Vehicle_telemetrySumAggregateOutputType | null
    _min: Vehicle_telemetryMinAggregateOutputType | null
    _max: Vehicle_telemetryMaxAggregateOutputType | null
  }

  type GetVehicle_telemetryGroupByPayload<T extends vehicle_telemetryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Vehicle_telemetryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Vehicle_telemetryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Vehicle_telemetryGroupByOutputType[P]>
            : GetScalarType<T[P], Vehicle_telemetryGroupByOutputType[P]>
        }
      >
    >


  export type vehicle_telemetrySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    vehicle_id?: boolean
    latitude?: boolean
    longitude?: boolean
    speed_kmh?: boolean
    fuel_level?: boolean
    battery_health?: boolean
    engine_status?: boolean
    recorded_at?: boolean
    vehicle_master?: boolean | vehicle_telemetry$vehicle_masterArgs<ExtArgs>
  }, ExtArgs["result"]["vehicle_telemetry"]>

  export type vehicle_telemetrySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    vehicle_id?: boolean
    latitude?: boolean
    longitude?: boolean
    speed_kmh?: boolean
    fuel_level?: boolean
    battery_health?: boolean
    engine_status?: boolean
    recorded_at?: boolean
    vehicle_master?: boolean | vehicle_telemetry$vehicle_masterArgs<ExtArgs>
  }, ExtArgs["result"]["vehicle_telemetry"]>

  export type vehicle_telemetrySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    vehicle_id?: boolean
    latitude?: boolean
    longitude?: boolean
    speed_kmh?: boolean
    fuel_level?: boolean
    battery_health?: boolean
    engine_status?: boolean
    recorded_at?: boolean
    vehicle_master?: boolean | vehicle_telemetry$vehicle_masterArgs<ExtArgs>
  }, ExtArgs["result"]["vehicle_telemetry"]>

  export type vehicle_telemetrySelectScalar = {
    id?: boolean
    vehicle_id?: boolean
    latitude?: boolean
    longitude?: boolean
    speed_kmh?: boolean
    fuel_level?: boolean
    battery_health?: boolean
    engine_status?: boolean
    recorded_at?: boolean
  }

  export type vehicle_telemetryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "vehicle_id" | "latitude" | "longitude" | "speed_kmh" | "fuel_level" | "battery_health" | "engine_status" | "recorded_at", ExtArgs["result"]["vehicle_telemetry"]>
  export type vehicle_telemetryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    vehicle_master?: boolean | vehicle_telemetry$vehicle_masterArgs<ExtArgs>
  }
  export type vehicle_telemetryIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    vehicle_master?: boolean | vehicle_telemetry$vehicle_masterArgs<ExtArgs>
  }
  export type vehicle_telemetryIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    vehicle_master?: boolean | vehicle_telemetry$vehicle_masterArgs<ExtArgs>
  }

  export type $vehicle_telemetryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "vehicle_telemetry"
    objects: {
      vehicle_master: Prisma.$vehicle_masterPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      vehicle_id: string | null
      latitude: Prisma.Decimal | null
      longitude: Prisma.Decimal | null
      speed_kmh: Prisma.Decimal | null
      fuel_level: Prisma.Decimal | null
      battery_health: Prisma.Decimal | null
      engine_status: string | null
      recorded_at: Date | null
    }, ExtArgs["result"]["vehicle_telemetry"]>
    composites: {}
  }

  type vehicle_telemetryGetPayload<S extends boolean | null | undefined | vehicle_telemetryDefaultArgs> = $Result.GetResult<Prisma.$vehicle_telemetryPayload, S>

  type vehicle_telemetryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<vehicle_telemetryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Vehicle_telemetryCountAggregateInputType | true
    }

  export interface vehicle_telemetryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['vehicle_telemetry'], meta: { name: 'vehicle_telemetry' } }
    /**
     * Find zero or one Vehicle_telemetry that matches the filter.
     * @param {vehicle_telemetryFindUniqueArgs} args - Arguments to find a Vehicle_telemetry
     * @example
     * // Get one Vehicle_telemetry
     * const vehicle_telemetry = await prisma.vehicle_telemetry.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends vehicle_telemetryFindUniqueArgs>(args: SelectSubset<T, vehicle_telemetryFindUniqueArgs<ExtArgs>>): Prisma__vehicle_telemetryClient<$Result.GetResult<Prisma.$vehicle_telemetryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Vehicle_telemetry that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {vehicle_telemetryFindUniqueOrThrowArgs} args - Arguments to find a Vehicle_telemetry
     * @example
     * // Get one Vehicle_telemetry
     * const vehicle_telemetry = await prisma.vehicle_telemetry.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends vehicle_telemetryFindUniqueOrThrowArgs>(args: SelectSubset<T, vehicle_telemetryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__vehicle_telemetryClient<$Result.GetResult<Prisma.$vehicle_telemetryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Vehicle_telemetry that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {vehicle_telemetryFindFirstArgs} args - Arguments to find a Vehicle_telemetry
     * @example
     * // Get one Vehicle_telemetry
     * const vehicle_telemetry = await prisma.vehicle_telemetry.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends vehicle_telemetryFindFirstArgs>(args?: SelectSubset<T, vehicle_telemetryFindFirstArgs<ExtArgs>>): Prisma__vehicle_telemetryClient<$Result.GetResult<Prisma.$vehicle_telemetryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Vehicle_telemetry that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {vehicle_telemetryFindFirstOrThrowArgs} args - Arguments to find a Vehicle_telemetry
     * @example
     * // Get one Vehicle_telemetry
     * const vehicle_telemetry = await prisma.vehicle_telemetry.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends vehicle_telemetryFindFirstOrThrowArgs>(args?: SelectSubset<T, vehicle_telemetryFindFirstOrThrowArgs<ExtArgs>>): Prisma__vehicle_telemetryClient<$Result.GetResult<Prisma.$vehicle_telemetryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Vehicle_telemetries that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {vehicle_telemetryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Vehicle_telemetries
     * const vehicle_telemetries = await prisma.vehicle_telemetry.findMany()
     * 
     * // Get first 10 Vehicle_telemetries
     * const vehicle_telemetries = await prisma.vehicle_telemetry.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const vehicle_telemetryWithIdOnly = await prisma.vehicle_telemetry.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends vehicle_telemetryFindManyArgs>(args?: SelectSubset<T, vehicle_telemetryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$vehicle_telemetryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Vehicle_telemetry.
     * @param {vehicle_telemetryCreateArgs} args - Arguments to create a Vehicle_telemetry.
     * @example
     * // Create one Vehicle_telemetry
     * const Vehicle_telemetry = await prisma.vehicle_telemetry.create({
     *   data: {
     *     // ... data to create a Vehicle_telemetry
     *   }
     * })
     * 
     */
    create<T extends vehicle_telemetryCreateArgs>(args: SelectSubset<T, vehicle_telemetryCreateArgs<ExtArgs>>): Prisma__vehicle_telemetryClient<$Result.GetResult<Prisma.$vehicle_telemetryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Vehicle_telemetries.
     * @param {vehicle_telemetryCreateManyArgs} args - Arguments to create many Vehicle_telemetries.
     * @example
     * // Create many Vehicle_telemetries
     * const vehicle_telemetry = await prisma.vehicle_telemetry.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends vehicle_telemetryCreateManyArgs>(args?: SelectSubset<T, vehicle_telemetryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Vehicle_telemetries and returns the data saved in the database.
     * @param {vehicle_telemetryCreateManyAndReturnArgs} args - Arguments to create many Vehicle_telemetries.
     * @example
     * // Create many Vehicle_telemetries
     * const vehicle_telemetry = await prisma.vehicle_telemetry.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Vehicle_telemetries and only return the `id`
     * const vehicle_telemetryWithIdOnly = await prisma.vehicle_telemetry.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends vehicle_telemetryCreateManyAndReturnArgs>(args?: SelectSubset<T, vehicle_telemetryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$vehicle_telemetryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Vehicle_telemetry.
     * @param {vehicle_telemetryDeleteArgs} args - Arguments to delete one Vehicle_telemetry.
     * @example
     * // Delete one Vehicle_telemetry
     * const Vehicle_telemetry = await prisma.vehicle_telemetry.delete({
     *   where: {
     *     // ... filter to delete one Vehicle_telemetry
     *   }
     * })
     * 
     */
    delete<T extends vehicle_telemetryDeleteArgs>(args: SelectSubset<T, vehicle_telemetryDeleteArgs<ExtArgs>>): Prisma__vehicle_telemetryClient<$Result.GetResult<Prisma.$vehicle_telemetryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Vehicle_telemetry.
     * @param {vehicle_telemetryUpdateArgs} args - Arguments to update one Vehicle_telemetry.
     * @example
     * // Update one Vehicle_telemetry
     * const vehicle_telemetry = await prisma.vehicle_telemetry.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends vehicle_telemetryUpdateArgs>(args: SelectSubset<T, vehicle_telemetryUpdateArgs<ExtArgs>>): Prisma__vehicle_telemetryClient<$Result.GetResult<Prisma.$vehicle_telemetryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Vehicle_telemetries.
     * @param {vehicle_telemetryDeleteManyArgs} args - Arguments to filter Vehicle_telemetries to delete.
     * @example
     * // Delete a few Vehicle_telemetries
     * const { count } = await prisma.vehicle_telemetry.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends vehicle_telemetryDeleteManyArgs>(args?: SelectSubset<T, vehicle_telemetryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Vehicle_telemetries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {vehicle_telemetryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Vehicle_telemetries
     * const vehicle_telemetry = await prisma.vehicle_telemetry.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends vehicle_telemetryUpdateManyArgs>(args: SelectSubset<T, vehicle_telemetryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Vehicle_telemetries and returns the data updated in the database.
     * @param {vehicle_telemetryUpdateManyAndReturnArgs} args - Arguments to update many Vehicle_telemetries.
     * @example
     * // Update many Vehicle_telemetries
     * const vehicle_telemetry = await prisma.vehicle_telemetry.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Vehicle_telemetries and only return the `id`
     * const vehicle_telemetryWithIdOnly = await prisma.vehicle_telemetry.updateManyAndReturn({
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
    updateManyAndReturn<T extends vehicle_telemetryUpdateManyAndReturnArgs>(args: SelectSubset<T, vehicle_telemetryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$vehicle_telemetryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Vehicle_telemetry.
     * @param {vehicle_telemetryUpsertArgs} args - Arguments to update or create a Vehicle_telemetry.
     * @example
     * // Update or create a Vehicle_telemetry
     * const vehicle_telemetry = await prisma.vehicle_telemetry.upsert({
     *   create: {
     *     // ... data to create a Vehicle_telemetry
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Vehicle_telemetry we want to update
     *   }
     * })
     */
    upsert<T extends vehicle_telemetryUpsertArgs>(args: SelectSubset<T, vehicle_telemetryUpsertArgs<ExtArgs>>): Prisma__vehicle_telemetryClient<$Result.GetResult<Prisma.$vehicle_telemetryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Vehicle_telemetries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {vehicle_telemetryCountArgs} args - Arguments to filter Vehicle_telemetries to count.
     * @example
     * // Count the number of Vehicle_telemetries
     * const count = await prisma.vehicle_telemetry.count({
     *   where: {
     *     // ... the filter for the Vehicle_telemetries we want to count
     *   }
     * })
    **/
    count<T extends vehicle_telemetryCountArgs>(
      args?: Subset<T, vehicle_telemetryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Vehicle_telemetryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Vehicle_telemetry.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Vehicle_telemetryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends Vehicle_telemetryAggregateArgs>(args: Subset<T, Vehicle_telemetryAggregateArgs>): Prisma.PrismaPromise<GetVehicle_telemetryAggregateType<T>>

    /**
     * Group by Vehicle_telemetry.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {vehicle_telemetryGroupByArgs} args - Group by arguments.
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
      T extends vehicle_telemetryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: vehicle_telemetryGroupByArgs['orderBy'] }
        : { orderBy?: vehicle_telemetryGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, vehicle_telemetryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVehicle_telemetryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the vehicle_telemetry model
   */
  readonly fields: vehicle_telemetryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for vehicle_telemetry.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__vehicle_telemetryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    vehicle_master<T extends vehicle_telemetry$vehicle_masterArgs<ExtArgs> = {}>(args?: Subset<T, vehicle_telemetry$vehicle_masterArgs<ExtArgs>>): Prisma__vehicle_masterClient<$Result.GetResult<Prisma.$vehicle_masterPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the vehicle_telemetry model
   */
  interface vehicle_telemetryFieldRefs {
    readonly id: FieldRef<"vehicle_telemetry", 'Int'>
    readonly vehicle_id: FieldRef<"vehicle_telemetry", 'String'>
    readonly latitude: FieldRef<"vehicle_telemetry", 'Decimal'>
    readonly longitude: FieldRef<"vehicle_telemetry", 'Decimal'>
    readonly speed_kmh: FieldRef<"vehicle_telemetry", 'Decimal'>
    readonly fuel_level: FieldRef<"vehicle_telemetry", 'Decimal'>
    readonly battery_health: FieldRef<"vehicle_telemetry", 'Decimal'>
    readonly engine_status: FieldRef<"vehicle_telemetry", 'String'>
    readonly recorded_at: FieldRef<"vehicle_telemetry", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * vehicle_telemetry findUnique
   */
  export type vehicle_telemetryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the vehicle_telemetry
     */
    select?: vehicle_telemetrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the vehicle_telemetry
     */
    omit?: vehicle_telemetryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: vehicle_telemetryInclude<ExtArgs> | null
    /**
     * Filter, which vehicle_telemetry to fetch.
     */
    where: vehicle_telemetryWhereUniqueInput
  }

  /**
   * vehicle_telemetry findUniqueOrThrow
   */
  export type vehicle_telemetryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the vehicle_telemetry
     */
    select?: vehicle_telemetrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the vehicle_telemetry
     */
    omit?: vehicle_telemetryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: vehicle_telemetryInclude<ExtArgs> | null
    /**
     * Filter, which vehicle_telemetry to fetch.
     */
    where: vehicle_telemetryWhereUniqueInput
  }

  /**
   * vehicle_telemetry findFirst
   */
  export type vehicle_telemetryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the vehicle_telemetry
     */
    select?: vehicle_telemetrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the vehicle_telemetry
     */
    omit?: vehicle_telemetryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: vehicle_telemetryInclude<ExtArgs> | null
    /**
     * Filter, which vehicle_telemetry to fetch.
     */
    where?: vehicle_telemetryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of vehicle_telemetries to fetch.
     */
    orderBy?: vehicle_telemetryOrderByWithRelationInput | vehicle_telemetryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for vehicle_telemetries.
     */
    cursor?: vehicle_telemetryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` vehicle_telemetries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` vehicle_telemetries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of vehicle_telemetries.
     */
    distinct?: Vehicle_telemetryScalarFieldEnum | Vehicle_telemetryScalarFieldEnum[]
  }

  /**
   * vehicle_telemetry findFirstOrThrow
   */
  export type vehicle_telemetryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the vehicle_telemetry
     */
    select?: vehicle_telemetrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the vehicle_telemetry
     */
    omit?: vehicle_telemetryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: vehicle_telemetryInclude<ExtArgs> | null
    /**
     * Filter, which vehicle_telemetry to fetch.
     */
    where?: vehicle_telemetryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of vehicle_telemetries to fetch.
     */
    orderBy?: vehicle_telemetryOrderByWithRelationInput | vehicle_telemetryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for vehicle_telemetries.
     */
    cursor?: vehicle_telemetryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` vehicle_telemetries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` vehicle_telemetries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of vehicle_telemetries.
     */
    distinct?: Vehicle_telemetryScalarFieldEnum | Vehicle_telemetryScalarFieldEnum[]
  }

  /**
   * vehicle_telemetry findMany
   */
  export type vehicle_telemetryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the vehicle_telemetry
     */
    select?: vehicle_telemetrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the vehicle_telemetry
     */
    omit?: vehicle_telemetryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: vehicle_telemetryInclude<ExtArgs> | null
    /**
     * Filter, which vehicle_telemetries to fetch.
     */
    where?: vehicle_telemetryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of vehicle_telemetries to fetch.
     */
    orderBy?: vehicle_telemetryOrderByWithRelationInput | vehicle_telemetryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing vehicle_telemetries.
     */
    cursor?: vehicle_telemetryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` vehicle_telemetries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` vehicle_telemetries.
     */
    skip?: number
    distinct?: Vehicle_telemetryScalarFieldEnum | Vehicle_telemetryScalarFieldEnum[]
  }

  /**
   * vehicle_telemetry create
   */
  export type vehicle_telemetryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the vehicle_telemetry
     */
    select?: vehicle_telemetrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the vehicle_telemetry
     */
    omit?: vehicle_telemetryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: vehicle_telemetryInclude<ExtArgs> | null
    /**
     * The data needed to create a vehicle_telemetry.
     */
    data?: XOR<vehicle_telemetryCreateInput, vehicle_telemetryUncheckedCreateInput>
  }

  /**
   * vehicle_telemetry createMany
   */
  export type vehicle_telemetryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many vehicle_telemetries.
     */
    data: vehicle_telemetryCreateManyInput | vehicle_telemetryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * vehicle_telemetry createManyAndReturn
   */
  export type vehicle_telemetryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the vehicle_telemetry
     */
    select?: vehicle_telemetrySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the vehicle_telemetry
     */
    omit?: vehicle_telemetryOmit<ExtArgs> | null
    /**
     * The data used to create many vehicle_telemetries.
     */
    data: vehicle_telemetryCreateManyInput | vehicle_telemetryCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: vehicle_telemetryIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * vehicle_telemetry update
   */
  export type vehicle_telemetryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the vehicle_telemetry
     */
    select?: vehicle_telemetrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the vehicle_telemetry
     */
    omit?: vehicle_telemetryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: vehicle_telemetryInclude<ExtArgs> | null
    /**
     * The data needed to update a vehicle_telemetry.
     */
    data: XOR<vehicle_telemetryUpdateInput, vehicle_telemetryUncheckedUpdateInput>
    /**
     * Choose, which vehicle_telemetry to update.
     */
    where: vehicle_telemetryWhereUniqueInput
  }

  /**
   * vehicle_telemetry updateMany
   */
  export type vehicle_telemetryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update vehicle_telemetries.
     */
    data: XOR<vehicle_telemetryUpdateManyMutationInput, vehicle_telemetryUncheckedUpdateManyInput>
    /**
     * Filter which vehicle_telemetries to update
     */
    where?: vehicle_telemetryWhereInput
    /**
     * Limit how many vehicle_telemetries to update.
     */
    limit?: number
  }

  /**
   * vehicle_telemetry updateManyAndReturn
   */
  export type vehicle_telemetryUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the vehicle_telemetry
     */
    select?: vehicle_telemetrySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the vehicle_telemetry
     */
    omit?: vehicle_telemetryOmit<ExtArgs> | null
    /**
     * The data used to update vehicle_telemetries.
     */
    data: XOR<vehicle_telemetryUpdateManyMutationInput, vehicle_telemetryUncheckedUpdateManyInput>
    /**
     * Filter which vehicle_telemetries to update
     */
    where?: vehicle_telemetryWhereInput
    /**
     * Limit how many vehicle_telemetries to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: vehicle_telemetryIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * vehicle_telemetry upsert
   */
  export type vehicle_telemetryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the vehicle_telemetry
     */
    select?: vehicle_telemetrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the vehicle_telemetry
     */
    omit?: vehicle_telemetryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: vehicle_telemetryInclude<ExtArgs> | null
    /**
     * The filter to search for the vehicle_telemetry to update in case it exists.
     */
    where: vehicle_telemetryWhereUniqueInput
    /**
     * In case the vehicle_telemetry found by the `where` argument doesn't exist, create a new vehicle_telemetry with this data.
     */
    create: XOR<vehicle_telemetryCreateInput, vehicle_telemetryUncheckedCreateInput>
    /**
     * In case the vehicle_telemetry was found with the provided `where` argument, update it with this data.
     */
    update: XOR<vehicle_telemetryUpdateInput, vehicle_telemetryUncheckedUpdateInput>
  }

  /**
   * vehicle_telemetry delete
   */
  export type vehicle_telemetryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the vehicle_telemetry
     */
    select?: vehicle_telemetrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the vehicle_telemetry
     */
    omit?: vehicle_telemetryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: vehicle_telemetryInclude<ExtArgs> | null
    /**
     * Filter which vehicle_telemetry to delete.
     */
    where: vehicle_telemetryWhereUniqueInput
  }

  /**
   * vehicle_telemetry deleteMany
   */
  export type vehicle_telemetryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which vehicle_telemetries to delete
     */
    where?: vehicle_telemetryWhereInput
    /**
     * Limit how many vehicle_telemetries to delete.
     */
    limit?: number
  }

  /**
   * vehicle_telemetry.vehicle_master
   */
  export type vehicle_telemetry$vehicle_masterArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the vehicle_master
     */
    select?: vehicle_masterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the vehicle_master
     */
    omit?: vehicle_masterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: vehicle_masterInclude<ExtArgs> | null
    where?: vehicle_masterWhereInput
  }

  /**
   * vehicle_telemetry without action
   */
  export type vehicle_telemetryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the vehicle_telemetry
     */
    select?: vehicle_telemetrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the vehicle_telemetry
     */
    omit?: vehicle_telemetryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: vehicle_telemetryInclude<ExtArgs> | null
  }


  /**
   * Model plant_master
   */

  export type AggregatePlant_master = {
    _count: Plant_masterCountAggregateOutputType | null
    _avg: Plant_masterAvgAggregateOutputType | null
    _sum: Plant_masterSumAggregateOutputType | null
    _min: Plant_masterMinAggregateOutputType | null
    _max: Plant_masterMaxAggregateOutputType | null
  }

  export type Plant_masterAvgAggregateOutputType = {
    id: number | null
    capacity_ton_per_day: Decimal | null
    vehicles_enrolled: number | null
    total_waste_collected: Decimal | null
    latitude: Decimal | null
    longitude: Decimal | null
  }

  export type Plant_masterSumAggregateOutputType = {
    id: number | null
    capacity_ton_per_day: Decimal | null
    vehicles_enrolled: number | null
    total_waste_collected: Decimal | null
    latitude: Decimal | null
    longitude: Decimal | null
  }

  export type Plant_masterMinAggregateOutputType = {
    id: number | null
    plant_name: string | null
    plant_type: string | null
    city: string | null
    zone: string | null
    division: string | null
    ward: string | null
    plant_manager: string | null
    capacity_ton_per_day: Decimal | null
    vehicles_enrolled: number | null
    total_waste_collected: Decimal | null
    latitude: Decimal | null
    longitude: Decimal | null
    status: string | null
    created_at: Date | null
  }

  export type Plant_masterMaxAggregateOutputType = {
    id: number | null
    plant_name: string | null
    plant_type: string | null
    city: string | null
    zone: string | null
    division: string | null
    ward: string | null
    plant_manager: string | null
    capacity_ton_per_day: Decimal | null
    vehicles_enrolled: number | null
    total_waste_collected: Decimal | null
    latitude: Decimal | null
    longitude: Decimal | null
    status: string | null
    created_at: Date | null
  }

  export type Plant_masterCountAggregateOutputType = {
    id: number
    plant_name: number
    plant_type: number
    city: number
    zone: number
    division: number
    ward: number
    plant_manager: number
    capacity_ton_per_day: number
    vehicles_enrolled: number
    total_waste_collected: number
    latitude: number
    longitude: number
    status: number
    created_at: number
    _all: number
  }


  export type Plant_masterAvgAggregateInputType = {
    id?: true
    capacity_ton_per_day?: true
    vehicles_enrolled?: true
    total_waste_collected?: true
    latitude?: true
    longitude?: true
  }

  export type Plant_masterSumAggregateInputType = {
    id?: true
    capacity_ton_per_day?: true
    vehicles_enrolled?: true
    total_waste_collected?: true
    latitude?: true
    longitude?: true
  }

  export type Plant_masterMinAggregateInputType = {
    id?: true
    plant_name?: true
    plant_type?: true
    city?: true
    zone?: true
    division?: true
    ward?: true
    plant_manager?: true
    capacity_ton_per_day?: true
    vehicles_enrolled?: true
    total_waste_collected?: true
    latitude?: true
    longitude?: true
    status?: true
    created_at?: true
  }

  export type Plant_masterMaxAggregateInputType = {
    id?: true
    plant_name?: true
    plant_type?: true
    city?: true
    zone?: true
    division?: true
    ward?: true
    plant_manager?: true
    capacity_ton_per_day?: true
    vehicles_enrolled?: true
    total_waste_collected?: true
    latitude?: true
    longitude?: true
    status?: true
    created_at?: true
  }

  export type Plant_masterCountAggregateInputType = {
    id?: true
    plant_name?: true
    plant_type?: true
    city?: true
    zone?: true
    division?: true
    ward?: true
    plant_manager?: true
    capacity_ton_per_day?: true
    vehicles_enrolled?: true
    total_waste_collected?: true
    latitude?: true
    longitude?: true
    status?: true
    created_at?: true
    _all?: true
  }

  export type Plant_masterAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which plant_master to aggregate.
     */
    where?: plant_masterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of plant_masters to fetch.
     */
    orderBy?: plant_masterOrderByWithRelationInput | plant_masterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: plant_masterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` plant_masters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` plant_masters.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned plant_masters
    **/
    _count?: true | Plant_masterCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Plant_masterAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Plant_masterSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Plant_masterMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Plant_masterMaxAggregateInputType
  }

  export type GetPlant_masterAggregateType<T extends Plant_masterAggregateArgs> = {
        [P in keyof T & keyof AggregatePlant_master]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePlant_master[P]>
      : GetScalarType<T[P], AggregatePlant_master[P]>
  }




  export type plant_masterGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: plant_masterWhereInput
    orderBy?: plant_masterOrderByWithAggregationInput | plant_masterOrderByWithAggregationInput[]
    by: Plant_masterScalarFieldEnum[] | Plant_masterScalarFieldEnum
    having?: plant_masterScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Plant_masterCountAggregateInputType | true
    _avg?: Plant_masterAvgAggregateInputType
    _sum?: Plant_masterSumAggregateInputType
    _min?: Plant_masterMinAggregateInputType
    _max?: Plant_masterMaxAggregateInputType
  }

  export type Plant_masterGroupByOutputType = {
    id: number
    plant_name: string
    plant_type: string | null
    city: string | null
    zone: string | null
    division: string | null
    ward: string | null
    plant_manager: string | null
    capacity_ton_per_day: Decimal | null
    vehicles_enrolled: number | null
    total_waste_collected: Decimal | null
    latitude: Decimal | null
    longitude: Decimal | null
    status: string | null
    created_at: Date | null
    _count: Plant_masterCountAggregateOutputType | null
    _avg: Plant_masterAvgAggregateOutputType | null
    _sum: Plant_masterSumAggregateOutputType | null
    _min: Plant_masterMinAggregateOutputType | null
    _max: Plant_masterMaxAggregateOutputType | null
  }

  type GetPlant_masterGroupByPayload<T extends plant_masterGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Plant_masterGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Plant_masterGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Plant_masterGroupByOutputType[P]>
            : GetScalarType<T[P], Plant_masterGroupByOutputType[P]>
        }
      >
    >


  export type plant_masterSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    plant_name?: boolean
    plant_type?: boolean
    city?: boolean
    zone?: boolean
    division?: boolean
    ward?: boolean
    plant_manager?: boolean
    capacity_ton_per_day?: boolean
    vehicles_enrolled?: boolean
    total_waste_collected?: boolean
    latitude?: boolean
    longitude?: boolean
    status?: boolean
    created_at?: boolean
  }, ExtArgs["result"]["plant_master"]>

  export type plant_masterSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    plant_name?: boolean
    plant_type?: boolean
    city?: boolean
    zone?: boolean
    division?: boolean
    ward?: boolean
    plant_manager?: boolean
    capacity_ton_per_day?: boolean
    vehicles_enrolled?: boolean
    total_waste_collected?: boolean
    latitude?: boolean
    longitude?: boolean
    status?: boolean
    created_at?: boolean
  }, ExtArgs["result"]["plant_master"]>

  export type plant_masterSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    plant_name?: boolean
    plant_type?: boolean
    city?: boolean
    zone?: boolean
    division?: boolean
    ward?: boolean
    plant_manager?: boolean
    capacity_ton_per_day?: boolean
    vehicles_enrolled?: boolean
    total_waste_collected?: boolean
    latitude?: boolean
    longitude?: boolean
    status?: boolean
    created_at?: boolean
  }, ExtArgs["result"]["plant_master"]>

  export type plant_masterSelectScalar = {
    id?: boolean
    plant_name?: boolean
    plant_type?: boolean
    city?: boolean
    zone?: boolean
    division?: boolean
    ward?: boolean
    plant_manager?: boolean
    capacity_ton_per_day?: boolean
    vehicles_enrolled?: boolean
    total_waste_collected?: boolean
    latitude?: boolean
    longitude?: boolean
    status?: boolean
    created_at?: boolean
  }

  export type plant_masterOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "plant_name" | "plant_type" | "city" | "zone" | "division" | "ward" | "plant_manager" | "capacity_ton_per_day" | "vehicles_enrolled" | "total_waste_collected" | "latitude" | "longitude" | "status" | "created_at", ExtArgs["result"]["plant_master"]>

  export type $plant_masterPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "plant_master"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      plant_name: string
      plant_type: string | null
      city: string | null
      zone: string | null
      division: string | null
      ward: string | null
      plant_manager: string | null
      capacity_ton_per_day: Prisma.Decimal | null
      vehicles_enrolled: number | null
      total_waste_collected: Prisma.Decimal | null
      latitude: Prisma.Decimal | null
      longitude: Prisma.Decimal | null
      status: string | null
      created_at: Date | null
    }, ExtArgs["result"]["plant_master"]>
    composites: {}
  }

  type plant_masterGetPayload<S extends boolean | null | undefined | plant_masterDefaultArgs> = $Result.GetResult<Prisma.$plant_masterPayload, S>

  type plant_masterCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<plant_masterFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Plant_masterCountAggregateInputType | true
    }

  export interface plant_masterDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['plant_master'], meta: { name: 'plant_master' } }
    /**
     * Find zero or one Plant_master that matches the filter.
     * @param {plant_masterFindUniqueArgs} args - Arguments to find a Plant_master
     * @example
     * // Get one Plant_master
     * const plant_master = await prisma.plant_master.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends plant_masterFindUniqueArgs>(args: SelectSubset<T, plant_masterFindUniqueArgs<ExtArgs>>): Prisma__plant_masterClient<$Result.GetResult<Prisma.$plant_masterPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Plant_master that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {plant_masterFindUniqueOrThrowArgs} args - Arguments to find a Plant_master
     * @example
     * // Get one Plant_master
     * const plant_master = await prisma.plant_master.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends plant_masterFindUniqueOrThrowArgs>(args: SelectSubset<T, plant_masterFindUniqueOrThrowArgs<ExtArgs>>): Prisma__plant_masterClient<$Result.GetResult<Prisma.$plant_masterPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Plant_master that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {plant_masterFindFirstArgs} args - Arguments to find a Plant_master
     * @example
     * // Get one Plant_master
     * const plant_master = await prisma.plant_master.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends plant_masterFindFirstArgs>(args?: SelectSubset<T, plant_masterFindFirstArgs<ExtArgs>>): Prisma__plant_masterClient<$Result.GetResult<Prisma.$plant_masterPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Plant_master that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {plant_masterFindFirstOrThrowArgs} args - Arguments to find a Plant_master
     * @example
     * // Get one Plant_master
     * const plant_master = await prisma.plant_master.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends plant_masterFindFirstOrThrowArgs>(args?: SelectSubset<T, plant_masterFindFirstOrThrowArgs<ExtArgs>>): Prisma__plant_masterClient<$Result.GetResult<Prisma.$plant_masterPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Plant_masters that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {plant_masterFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Plant_masters
     * const plant_masters = await prisma.plant_master.findMany()
     * 
     * // Get first 10 Plant_masters
     * const plant_masters = await prisma.plant_master.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const plant_masterWithIdOnly = await prisma.plant_master.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends plant_masterFindManyArgs>(args?: SelectSubset<T, plant_masterFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$plant_masterPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Plant_master.
     * @param {plant_masterCreateArgs} args - Arguments to create a Plant_master.
     * @example
     * // Create one Plant_master
     * const Plant_master = await prisma.plant_master.create({
     *   data: {
     *     // ... data to create a Plant_master
     *   }
     * })
     * 
     */
    create<T extends plant_masterCreateArgs>(args: SelectSubset<T, plant_masterCreateArgs<ExtArgs>>): Prisma__plant_masterClient<$Result.GetResult<Prisma.$plant_masterPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Plant_masters.
     * @param {plant_masterCreateManyArgs} args - Arguments to create many Plant_masters.
     * @example
     * // Create many Plant_masters
     * const plant_master = await prisma.plant_master.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends plant_masterCreateManyArgs>(args?: SelectSubset<T, plant_masterCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Plant_masters and returns the data saved in the database.
     * @param {plant_masterCreateManyAndReturnArgs} args - Arguments to create many Plant_masters.
     * @example
     * // Create many Plant_masters
     * const plant_master = await prisma.plant_master.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Plant_masters and only return the `id`
     * const plant_masterWithIdOnly = await prisma.plant_master.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends plant_masterCreateManyAndReturnArgs>(args?: SelectSubset<T, plant_masterCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$plant_masterPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Plant_master.
     * @param {plant_masterDeleteArgs} args - Arguments to delete one Plant_master.
     * @example
     * // Delete one Plant_master
     * const Plant_master = await prisma.plant_master.delete({
     *   where: {
     *     // ... filter to delete one Plant_master
     *   }
     * })
     * 
     */
    delete<T extends plant_masterDeleteArgs>(args: SelectSubset<T, plant_masterDeleteArgs<ExtArgs>>): Prisma__plant_masterClient<$Result.GetResult<Prisma.$plant_masterPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Plant_master.
     * @param {plant_masterUpdateArgs} args - Arguments to update one Plant_master.
     * @example
     * // Update one Plant_master
     * const plant_master = await prisma.plant_master.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends plant_masterUpdateArgs>(args: SelectSubset<T, plant_masterUpdateArgs<ExtArgs>>): Prisma__plant_masterClient<$Result.GetResult<Prisma.$plant_masterPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Plant_masters.
     * @param {plant_masterDeleteManyArgs} args - Arguments to filter Plant_masters to delete.
     * @example
     * // Delete a few Plant_masters
     * const { count } = await prisma.plant_master.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends plant_masterDeleteManyArgs>(args?: SelectSubset<T, plant_masterDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Plant_masters.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {plant_masterUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Plant_masters
     * const plant_master = await prisma.plant_master.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends plant_masterUpdateManyArgs>(args: SelectSubset<T, plant_masterUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Plant_masters and returns the data updated in the database.
     * @param {plant_masterUpdateManyAndReturnArgs} args - Arguments to update many Plant_masters.
     * @example
     * // Update many Plant_masters
     * const plant_master = await prisma.plant_master.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Plant_masters and only return the `id`
     * const plant_masterWithIdOnly = await prisma.plant_master.updateManyAndReturn({
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
    updateManyAndReturn<T extends plant_masterUpdateManyAndReturnArgs>(args: SelectSubset<T, plant_masterUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$plant_masterPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Plant_master.
     * @param {plant_masterUpsertArgs} args - Arguments to update or create a Plant_master.
     * @example
     * // Update or create a Plant_master
     * const plant_master = await prisma.plant_master.upsert({
     *   create: {
     *     // ... data to create a Plant_master
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Plant_master we want to update
     *   }
     * })
     */
    upsert<T extends plant_masterUpsertArgs>(args: SelectSubset<T, plant_masterUpsertArgs<ExtArgs>>): Prisma__plant_masterClient<$Result.GetResult<Prisma.$plant_masterPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Plant_masters.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {plant_masterCountArgs} args - Arguments to filter Plant_masters to count.
     * @example
     * // Count the number of Plant_masters
     * const count = await prisma.plant_master.count({
     *   where: {
     *     // ... the filter for the Plant_masters we want to count
     *   }
     * })
    **/
    count<T extends plant_masterCountArgs>(
      args?: Subset<T, plant_masterCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Plant_masterCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Plant_master.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Plant_masterAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends Plant_masterAggregateArgs>(args: Subset<T, Plant_masterAggregateArgs>): Prisma.PrismaPromise<GetPlant_masterAggregateType<T>>

    /**
     * Group by Plant_master.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {plant_masterGroupByArgs} args - Group by arguments.
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
      T extends plant_masterGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: plant_masterGroupByArgs['orderBy'] }
        : { orderBy?: plant_masterGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, plant_masterGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPlant_masterGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the plant_master model
   */
  readonly fields: plant_masterFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for plant_master.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__plant_masterClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the plant_master model
   */
  interface plant_masterFieldRefs {
    readonly id: FieldRef<"plant_master", 'Int'>
    readonly plant_name: FieldRef<"plant_master", 'String'>
    readonly plant_type: FieldRef<"plant_master", 'String'>
    readonly city: FieldRef<"plant_master", 'String'>
    readonly zone: FieldRef<"plant_master", 'String'>
    readonly division: FieldRef<"plant_master", 'String'>
    readonly ward: FieldRef<"plant_master", 'String'>
    readonly plant_manager: FieldRef<"plant_master", 'String'>
    readonly capacity_ton_per_day: FieldRef<"plant_master", 'Decimal'>
    readonly vehicles_enrolled: FieldRef<"plant_master", 'Int'>
    readonly total_waste_collected: FieldRef<"plant_master", 'Decimal'>
    readonly latitude: FieldRef<"plant_master", 'Decimal'>
    readonly longitude: FieldRef<"plant_master", 'Decimal'>
    readonly status: FieldRef<"plant_master", 'String'>
    readonly created_at: FieldRef<"plant_master", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * plant_master findUnique
   */
  export type plant_masterFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the plant_master
     */
    select?: plant_masterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the plant_master
     */
    omit?: plant_masterOmit<ExtArgs> | null
    /**
     * Filter, which plant_master to fetch.
     */
    where: plant_masterWhereUniqueInput
  }

  /**
   * plant_master findUniqueOrThrow
   */
  export type plant_masterFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the plant_master
     */
    select?: plant_masterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the plant_master
     */
    omit?: plant_masterOmit<ExtArgs> | null
    /**
     * Filter, which plant_master to fetch.
     */
    where: plant_masterWhereUniqueInput
  }

  /**
   * plant_master findFirst
   */
  export type plant_masterFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the plant_master
     */
    select?: plant_masterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the plant_master
     */
    omit?: plant_masterOmit<ExtArgs> | null
    /**
     * Filter, which plant_master to fetch.
     */
    where?: plant_masterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of plant_masters to fetch.
     */
    orderBy?: plant_masterOrderByWithRelationInput | plant_masterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for plant_masters.
     */
    cursor?: plant_masterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` plant_masters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` plant_masters.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of plant_masters.
     */
    distinct?: Plant_masterScalarFieldEnum | Plant_masterScalarFieldEnum[]
  }

  /**
   * plant_master findFirstOrThrow
   */
  export type plant_masterFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the plant_master
     */
    select?: plant_masterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the plant_master
     */
    omit?: plant_masterOmit<ExtArgs> | null
    /**
     * Filter, which plant_master to fetch.
     */
    where?: plant_masterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of plant_masters to fetch.
     */
    orderBy?: plant_masterOrderByWithRelationInput | plant_masterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for plant_masters.
     */
    cursor?: plant_masterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` plant_masters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` plant_masters.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of plant_masters.
     */
    distinct?: Plant_masterScalarFieldEnum | Plant_masterScalarFieldEnum[]
  }

  /**
   * plant_master findMany
   */
  export type plant_masterFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the plant_master
     */
    select?: plant_masterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the plant_master
     */
    omit?: plant_masterOmit<ExtArgs> | null
    /**
     * Filter, which plant_masters to fetch.
     */
    where?: plant_masterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of plant_masters to fetch.
     */
    orderBy?: plant_masterOrderByWithRelationInput | plant_masterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing plant_masters.
     */
    cursor?: plant_masterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` plant_masters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` plant_masters.
     */
    skip?: number
    distinct?: Plant_masterScalarFieldEnum | Plant_masterScalarFieldEnum[]
  }

  /**
   * plant_master create
   */
  export type plant_masterCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the plant_master
     */
    select?: plant_masterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the plant_master
     */
    omit?: plant_masterOmit<ExtArgs> | null
    /**
     * The data needed to create a plant_master.
     */
    data: XOR<plant_masterCreateInput, plant_masterUncheckedCreateInput>
  }

  /**
   * plant_master createMany
   */
  export type plant_masterCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many plant_masters.
     */
    data: plant_masterCreateManyInput | plant_masterCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * plant_master createManyAndReturn
   */
  export type plant_masterCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the plant_master
     */
    select?: plant_masterSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the plant_master
     */
    omit?: plant_masterOmit<ExtArgs> | null
    /**
     * The data used to create many plant_masters.
     */
    data: plant_masterCreateManyInput | plant_masterCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * plant_master update
   */
  export type plant_masterUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the plant_master
     */
    select?: plant_masterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the plant_master
     */
    omit?: plant_masterOmit<ExtArgs> | null
    /**
     * The data needed to update a plant_master.
     */
    data: XOR<plant_masterUpdateInput, plant_masterUncheckedUpdateInput>
    /**
     * Choose, which plant_master to update.
     */
    where: plant_masterWhereUniqueInput
  }

  /**
   * plant_master updateMany
   */
  export type plant_masterUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update plant_masters.
     */
    data: XOR<plant_masterUpdateManyMutationInput, plant_masterUncheckedUpdateManyInput>
    /**
     * Filter which plant_masters to update
     */
    where?: plant_masterWhereInput
    /**
     * Limit how many plant_masters to update.
     */
    limit?: number
  }

  /**
   * plant_master updateManyAndReturn
   */
  export type plant_masterUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the plant_master
     */
    select?: plant_masterSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the plant_master
     */
    omit?: plant_masterOmit<ExtArgs> | null
    /**
     * The data used to update plant_masters.
     */
    data: XOR<plant_masterUpdateManyMutationInput, plant_masterUncheckedUpdateManyInput>
    /**
     * Filter which plant_masters to update
     */
    where?: plant_masterWhereInput
    /**
     * Limit how many plant_masters to update.
     */
    limit?: number
  }

  /**
   * plant_master upsert
   */
  export type plant_masterUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the plant_master
     */
    select?: plant_masterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the plant_master
     */
    omit?: plant_masterOmit<ExtArgs> | null
    /**
     * The filter to search for the plant_master to update in case it exists.
     */
    where: plant_masterWhereUniqueInput
    /**
     * In case the plant_master found by the `where` argument doesn't exist, create a new plant_master with this data.
     */
    create: XOR<plant_masterCreateInput, plant_masterUncheckedCreateInput>
    /**
     * In case the plant_master was found with the provided `where` argument, update it with this data.
     */
    update: XOR<plant_masterUpdateInput, plant_masterUncheckedUpdateInput>
  }

  /**
   * plant_master delete
   */
  export type plant_masterDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the plant_master
     */
    select?: plant_masterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the plant_master
     */
    omit?: plant_masterOmit<ExtArgs> | null
    /**
     * Filter which plant_master to delete.
     */
    where: plant_masterWhereUniqueInput
  }

  /**
   * plant_master deleteMany
   */
  export type plant_masterDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which plant_masters to delete
     */
    where?: plant_masterWhereInput
    /**
     * Limit how many plant_masters to delete.
     */
    limit?: number
  }

  /**
   * plant_master without action
   */
  export type plant_masterDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the plant_master
     */
    select?: plant_masterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the plant_master
     */
    omit?: plant_masterOmit<ExtArgs> | null
  }


  /**
   * Model edit_logs
   */

  export type AggregateEdit_logs = {
    _count: Edit_logsCountAggregateOutputType | null
    _avg: Edit_logsAvgAggregateOutputType | null
    _sum: Edit_logsSumAggregateOutputType | null
    _min: Edit_logsMinAggregateOutputType | null
    _max: Edit_logsMaxAggregateOutputType | null
  }

  export type Edit_logsAvgAggregateOutputType = {
    id: number | null
    performed_by_id: number | null
  }

  export type Edit_logsSumAggregateOutputType = {
    id: number | null
    performed_by_id: number | null
  }

  export type Edit_logsMinAggregateOutputType = {
    id: number | null
    performed_by: string | null
    role: string | null
    module: string | null
    action: string | null
    record_id: string | null
    description: string | null
    ip_address: string | null
    created_at: Date | null
    performed_by_id: number | null
    success: boolean | null
  }

  export type Edit_logsMaxAggregateOutputType = {
    id: number | null
    performed_by: string | null
    role: string | null
    module: string | null
    action: string | null
    record_id: string | null
    description: string | null
    ip_address: string | null
    created_at: Date | null
    performed_by_id: number | null
    success: boolean | null
  }

  export type Edit_logsCountAggregateOutputType = {
    id: number
    performed_by: number
    role: number
    module: number
    action: number
    record_id: number
    description: number
    ip_address: number
    created_at: number
    performed_by_id: number
    success: number
    _all: number
  }


  export type Edit_logsAvgAggregateInputType = {
    id?: true
    performed_by_id?: true
  }

  export type Edit_logsSumAggregateInputType = {
    id?: true
    performed_by_id?: true
  }

  export type Edit_logsMinAggregateInputType = {
    id?: true
    performed_by?: true
    role?: true
    module?: true
    action?: true
    record_id?: true
    description?: true
    ip_address?: true
    created_at?: true
    performed_by_id?: true
    success?: true
  }

  export type Edit_logsMaxAggregateInputType = {
    id?: true
    performed_by?: true
    role?: true
    module?: true
    action?: true
    record_id?: true
    description?: true
    ip_address?: true
    created_at?: true
    performed_by_id?: true
    success?: true
  }

  export type Edit_logsCountAggregateInputType = {
    id?: true
    performed_by?: true
    role?: true
    module?: true
    action?: true
    record_id?: true
    description?: true
    ip_address?: true
    created_at?: true
    performed_by_id?: true
    success?: true
    _all?: true
  }

  export type Edit_logsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which edit_logs to aggregate.
     */
    where?: edit_logsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of edit_logs to fetch.
     */
    orderBy?: edit_logsOrderByWithRelationInput | edit_logsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: edit_logsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` edit_logs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` edit_logs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned edit_logs
    **/
    _count?: true | Edit_logsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Edit_logsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Edit_logsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Edit_logsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Edit_logsMaxAggregateInputType
  }

  export type GetEdit_logsAggregateType<T extends Edit_logsAggregateArgs> = {
        [P in keyof T & keyof AggregateEdit_logs]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEdit_logs[P]>
      : GetScalarType<T[P], AggregateEdit_logs[P]>
  }




  export type edit_logsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: edit_logsWhereInput
    orderBy?: edit_logsOrderByWithAggregationInput | edit_logsOrderByWithAggregationInput[]
    by: Edit_logsScalarFieldEnum[] | Edit_logsScalarFieldEnum
    having?: edit_logsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Edit_logsCountAggregateInputType | true
    _avg?: Edit_logsAvgAggregateInputType
    _sum?: Edit_logsSumAggregateInputType
    _min?: Edit_logsMinAggregateInputType
    _max?: Edit_logsMaxAggregateInputType
  }

  export type Edit_logsGroupByOutputType = {
    id: number
    performed_by: string
    role: string
    module: string
    action: string
    record_id: string | null
    description: string | null
    ip_address: string | null
    created_at: Date | null
    performed_by_id: number | null
    success: boolean | null
    _count: Edit_logsCountAggregateOutputType | null
    _avg: Edit_logsAvgAggregateOutputType | null
    _sum: Edit_logsSumAggregateOutputType | null
    _min: Edit_logsMinAggregateOutputType | null
    _max: Edit_logsMaxAggregateOutputType | null
  }

  type GetEdit_logsGroupByPayload<T extends edit_logsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Edit_logsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Edit_logsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Edit_logsGroupByOutputType[P]>
            : GetScalarType<T[P], Edit_logsGroupByOutputType[P]>
        }
      >
    >


  export type edit_logsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    performed_by?: boolean
    role?: boolean
    module?: boolean
    action?: boolean
    record_id?: boolean
    description?: boolean
    ip_address?: boolean
    created_at?: boolean
    performed_by_id?: boolean
    success?: boolean
  }, ExtArgs["result"]["edit_logs"]>

  export type edit_logsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    performed_by?: boolean
    role?: boolean
    module?: boolean
    action?: boolean
    record_id?: boolean
    description?: boolean
    ip_address?: boolean
    created_at?: boolean
    performed_by_id?: boolean
    success?: boolean
  }, ExtArgs["result"]["edit_logs"]>

  export type edit_logsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    performed_by?: boolean
    role?: boolean
    module?: boolean
    action?: boolean
    record_id?: boolean
    description?: boolean
    ip_address?: boolean
    created_at?: boolean
    performed_by_id?: boolean
    success?: boolean
  }, ExtArgs["result"]["edit_logs"]>

  export type edit_logsSelectScalar = {
    id?: boolean
    performed_by?: boolean
    role?: boolean
    module?: boolean
    action?: boolean
    record_id?: boolean
    description?: boolean
    ip_address?: boolean
    created_at?: boolean
    performed_by_id?: boolean
    success?: boolean
  }

  export type edit_logsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "performed_by" | "role" | "module" | "action" | "record_id" | "description" | "ip_address" | "created_at" | "performed_by_id" | "success", ExtArgs["result"]["edit_logs"]>

  export type $edit_logsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "edit_logs"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      performed_by: string
      role: string
      module: string
      action: string
      record_id: string | null
      description: string | null
      ip_address: string | null
      created_at: Date | null
      performed_by_id: number | null
      success: boolean | null
    }, ExtArgs["result"]["edit_logs"]>
    composites: {}
  }

  type edit_logsGetPayload<S extends boolean | null | undefined | edit_logsDefaultArgs> = $Result.GetResult<Prisma.$edit_logsPayload, S>

  type edit_logsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<edit_logsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Edit_logsCountAggregateInputType | true
    }

  export interface edit_logsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['edit_logs'], meta: { name: 'edit_logs' } }
    /**
     * Find zero or one Edit_logs that matches the filter.
     * @param {edit_logsFindUniqueArgs} args - Arguments to find a Edit_logs
     * @example
     * // Get one Edit_logs
     * const edit_logs = await prisma.edit_logs.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends edit_logsFindUniqueArgs>(args: SelectSubset<T, edit_logsFindUniqueArgs<ExtArgs>>): Prisma__edit_logsClient<$Result.GetResult<Prisma.$edit_logsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Edit_logs that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {edit_logsFindUniqueOrThrowArgs} args - Arguments to find a Edit_logs
     * @example
     * // Get one Edit_logs
     * const edit_logs = await prisma.edit_logs.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends edit_logsFindUniqueOrThrowArgs>(args: SelectSubset<T, edit_logsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__edit_logsClient<$Result.GetResult<Prisma.$edit_logsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Edit_logs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {edit_logsFindFirstArgs} args - Arguments to find a Edit_logs
     * @example
     * // Get one Edit_logs
     * const edit_logs = await prisma.edit_logs.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends edit_logsFindFirstArgs>(args?: SelectSubset<T, edit_logsFindFirstArgs<ExtArgs>>): Prisma__edit_logsClient<$Result.GetResult<Prisma.$edit_logsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Edit_logs that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {edit_logsFindFirstOrThrowArgs} args - Arguments to find a Edit_logs
     * @example
     * // Get one Edit_logs
     * const edit_logs = await prisma.edit_logs.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends edit_logsFindFirstOrThrowArgs>(args?: SelectSubset<T, edit_logsFindFirstOrThrowArgs<ExtArgs>>): Prisma__edit_logsClient<$Result.GetResult<Prisma.$edit_logsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Edit_logs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {edit_logsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Edit_logs
     * const edit_logs = await prisma.edit_logs.findMany()
     * 
     * // Get first 10 Edit_logs
     * const edit_logs = await prisma.edit_logs.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const edit_logsWithIdOnly = await prisma.edit_logs.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends edit_logsFindManyArgs>(args?: SelectSubset<T, edit_logsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$edit_logsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Edit_logs.
     * @param {edit_logsCreateArgs} args - Arguments to create a Edit_logs.
     * @example
     * // Create one Edit_logs
     * const Edit_logs = await prisma.edit_logs.create({
     *   data: {
     *     // ... data to create a Edit_logs
     *   }
     * })
     * 
     */
    create<T extends edit_logsCreateArgs>(args: SelectSubset<T, edit_logsCreateArgs<ExtArgs>>): Prisma__edit_logsClient<$Result.GetResult<Prisma.$edit_logsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Edit_logs.
     * @param {edit_logsCreateManyArgs} args - Arguments to create many Edit_logs.
     * @example
     * // Create many Edit_logs
     * const edit_logs = await prisma.edit_logs.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends edit_logsCreateManyArgs>(args?: SelectSubset<T, edit_logsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Edit_logs and returns the data saved in the database.
     * @param {edit_logsCreateManyAndReturnArgs} args - Arguments to create many Edit_logs.
     * @example
     * // Create many Edit_logs
     * const edit_logs = await prisma.edit_logs.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Edit_logs and only return the `id`
     * const edit_logsWithIdOnly = await prisma.edit_logs.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends edit_logsCreateManyAndReturnArgs>(args?: SelectSubset<T, edit_logsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$edit_logsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Edit_logs.
     * @param {edit_logsDeleteArgs} args - Arguments to delete one Edit_logs.
     * @example
     * // Delete one Edit_logs
     * const Edit_logs = await prisma.edit_logs.delete({
     *   where: {
     *     // ... filter to delete one Edit_logs
     *   }
     * })
     * 
     */
    delete<T extends edit_logsDeleteArgs>(args: SelectSubset<T, edit_logsDeleteArgs<ExtArgs>>): Prisma__edit_logsClient<$Result.GetResult<Prisma.$edit_logsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Edit_logs.
     * @param {edit_logsUpdateArgs} args - Arguments to update one Edit_logs.
     * @example
     * // Update one Edit_logs
     * const edit_logs = await prisma.edit_logs.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends edit_logsUpdateArgs>(args: SelectSubset<T, edit_logsUpdateArgs<ExtArgs>>): Prisma__edit_logsClient<$Result.GetResult<Prisma.$edit_logsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Edit_logs.
     * @param {edit_logsDeleteManyArgs} args - Arguments to filter Edit_logs to delete.
     * @example
     * // Delete a few Edit_logs
     * const { count } = await prisma.edit_logs.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends edit_logsDeleteManyArgs>(args?: SelectSubset<T, edit_logsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Edit_logs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {edit_logsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Edit_logs
     * const edit_logs = await prisma.edit_logs.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends edit_logsUpdateManyArgs>(args: SelectSubset<T, edit_logsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Edit_logs and returns the data updated in the database.
     * @param {edit_logsUpdateManyAndReturnArgs} args - Arguments to update many Edit_logs.
     * @example
     * // Update many Edit_logs
     * const edit_logs = await prisma.edit_logs.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Edit_logs and only return the `id`
     * const edit_logsWithIdOnly = await prisma.edit_logs.updateManyAndReturn({
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
    updateManyAndReturn<T extends edit_logsUpdateManyAndReturnArgs>(args: SelectSubset<T, edit_logsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$edit_logsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Edit_logs.
     * @param {edit_logsUpsertArgs} args - Arguments to update or create a Edit_logs.
     * @example
     * // Update or create a Edit_logs
     * const edit_logs = await prisma.edit_logs.upsert({
     *   create: {
     *     // ... data to create a Edit_logs
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Edit_logs we want to update
     *   }
     * })
     */
    upsert<T extends edit_logsUpsertArgs>(args: SelectSubset<T, edit_logsUpsertArgs<ExtArgs>>): Prisma__edit_logsClient<$Result.GetResult<Prisma.$edit_logsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Edit_logs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {edit_logsCountArgs} args - Arguments to filter Edit_logs to count.
     * @example
     * // Count the number of Edit_logs
     * const count = await prisma.edit_logs.count({
     *   where: {
     *     // ... the filter for the Edit_logs we want to count
     *   }
     * })
    **/
    count<T extends edit_logsCountArgs>(
      args?: Subset<T, edit_logsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Edit_logsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Edit_logs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Edit_logsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends Edit_logsAggregateArgs>(args: Subset<T, Edit_logsAggregateArgs>): Prisma.PrismaPromise<GetEdit_logsAggregateType<T>>

    /**
     * Group by Edit_logs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {edit_logsGroupByArgs} args - Group by arguments.
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
      T extends edit_logsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: edit_logsGroupByArgs['orderBy'] }
        : { orderBy?: edit_logsGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, edit_logsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEdit_logsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the edit_logs model
   */
  readonly fields: edit_logsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for edit_logs.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__edit_logsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the edit_logs model
   */
  interface edit_logsFieldRefs {
    readonly id: FieldRef<"edit_logs", 'Int'>
    readonly performed_by: FieldRef<"edit_logs", 'String'>
    readonly role: FieldRef<"edit_logs", 'String'>
    readonly module: FieldRef<"edit_logs", 'String'>
    readonly action: FieldRef<"edit_logs", 'String'>
    readonly record_id: FieldRef<"edit_logs", 'String'>
    readonly description: FieldRef<"edit_logs", 'String'>
    readonly ip_address: FieldRef<"edit_logs", 'String'>
    readonly created_at: FieldRef<"edit_logs", 'DateTime'>
    readonly performed_by_id: FieldRef<"edit_logs", 'Int'>
    readonly success: FieldRef<"edit_logs", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * edit_logs findUnique
   */
  export type edit_logsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the edit_logs
     */
    select?: edit_logsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the edit_logs
     */
    omit?: edit_logsOmit<ExtArgs> | null
    /**
     * Filter, which edit_logs to fetch.
     */
    where: edit_logsWhereUniqueInput
  }

  /**
   * edit_logs findUniqueOrThrow
   */
  export type edit_logsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the edit_logs
     */
    select?: edit_logsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the edit_logs
     */
    omit?: edit_logsOmit<ExtArgs> | null
    /**
     * Filter, which edit_logs to fetch.
     */
    where: edit_logsWhereUniqueInput
  }

  /**
   * edit_logs findFirst
   */
  export type edit_logsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the edit_logs
     */
    select?: edit_logsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the edit_logs
     */
    omit?: edit_logsOmit<ExtArgs> | null
    /**
     * Filter, which edit_logs to fetch.
     */
    where?: edit_logsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of edit_logs to fetch.
     */
    orderBy?: edit_logsOrderByWithRelationInput | edit_logsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for edit_logs.
     */
    cursor?: edit_logsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` edit_logs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` edit_logs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of edit_logs.
     */
    distinct?: Edit_logsScalarFieldEnum | Edit_logsScalarFieldEnum[]
  }

  /**
   * edit_logs findFirstOrThrow
   */
  export type edit_logsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the edit_logs
     */
    select?: edit_logsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the edit_logs
     */
    omit?: edit_logsOmit<ExtArgs> | null
    /**
     * Filter, which edit_logs to fetch.
     */
    where?: edit_logsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of edit_logs to fetch.
     */
    orderBy?: edit_logsOrderByWithRelationInput | edit_logsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for edit_logs.
     */
    cursor?: edit_logsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` edit_logs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` edit_logs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of edit_logs.
     */
    distinct?: Edit_logsScalarFieldEnum | Edit_logsScalarFieldEnum[]
  }

  /**
   * edit_logs findMany
   */
  export type edit_logsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the edit_logs
     */
    select?: edit_logsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the edit_logs
     */
    omit?: edit_logsOmit<ExtArgs> | null
    /**
     * Filter, which edit_logs to fetch.
     */
    where?: edit_logsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of edit_logs to fetch.
     */
    orderBy?: edit_logsOrderByWithRelationInput | edit_logsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing edit_logs.
     */
    cursor?: edit_logsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` edit_logs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` edit_logs.
     */
    skip?: number
    distinct?: Edit_logsScalarFieldEnum | Edit_logsScalarFieldEnum[]
  }

  /**
   * edit_logs create
   */
  export type edit_logsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the edit_logs
     */
    select?: edit_logsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the edit_logs
     */
    omit?: edit_logsOmit<ExtArgs> | null
    /**
     * The data needed to create a edit_logs.
     */
    data: XOR<edit_logsCreateInput, edit_logsUncheckedCreateInput>
  }

  /**
   * edit_logs createMany
   */
  export type edit_logsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many edit_logs.
     */
    data: edit_logsCreateManyInput | edit_logsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * edit_logs createManyAndReturn
   */
  export type edit_logsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the edit_logs
     */
    select?: edit_logsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the edit_logs
     */
    omit?: edit_logsOmit<ExtArgs> | null
    /**
     * The data used to create many edit_logs.
     */
    data: edit_logsCreateManyInput | edit_logsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * edit_logs update
   */
  export type edit_logsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the edit_logs
     */
    select?: edit_logsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the edit_logs
     */
    omit?: edit_logsOmit<ExtArgs> | null
    /**
     * The data needed to update a edit_logs.
     */
    data: XOR<edit_logsUpdateInput, edit_logsUncheckedUpdateInput>
    /**
     * Choose, which edit_logs to update.
     */
    where: edit_logsWhereUniqueInput
  }

  /**
   * edit_logs updateMany
   */
  export type edit_logsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update edit_logs.
     */
    data: XOR<edit_logsUpdateManyMutationInput, edit_logsUncheckedUpdateManyInput>
    /**
     * Filter which edit_logs to update
     */
    where?: edit_logsWhereInput
    /**
     * Limit how many edit_logs to update.
     */
    limit?: number
  }

  /**
   * edit_logs updateManyAndReturn
   */
  export type edit_logsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the edit_logs
     */
    select?: edit_logsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the edit_logs
     */
    omit?: edit_logsOmit<ExtArgs> | null
    /**
     * The data used to update edit_logs.
     */
    data: XOR<edit_logsUpdateManyMutationInput, edit_logsUncheckedUpdateManyInput>
    /**
     * Filter which edit_logs to update
     */
    where?: edit_logsWhereInput
    /**
     * Limit how many edit_logs to update.
     */
    limit?: number
  }

  /**
   * edit_logs upsert
   */
  export type edit_logsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the edit_logs
     */
    select?: edit_logsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the edit_logs
     */
    omit?: edit_logsOmit<ExtArgs> | null
    /**
     * The filter to search for the edit_logs to update in case it exists.
     */
    where: edit_logsWhereUniqueInput
    /**
     * In case the edit_logs found by the `where` argument doesn't exist, create a new edit_logs with this data.
     */
    create: XOR<edit_logsCreateInput, edit_logsUncheckedCreateInput>
    /**
     * In case the edit_logs was found with the provided `where` argument, update it with this data.
     */
    update: XOR<edit_logsUpdateInput, edit_logsUncheckedUpdateInput>
  }

  /**
   * edit_logs delete
   */
  export type edit_logsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the edit_logs
     */
    select?: edit_logsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the edit_logs
     */
    omit?: edit_logsOmit<ExtArgs> | null
    /**
     * Filter which edit_logs to delete.
     */
    where: edit_logsWhereUniqueInput
  }

  /**
   * edit_logs deleteMany
   */
  export type edit_logsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which edit_logs to delete
     */
    where?: edit_logsWhereInput
    /**
     * Limit how many edit_logs to delete.
     */
    limit?: number
  }

  /**
   * edit_logs without action
   */
  export type edit_logsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the edit_logs
     */
    select?: edit_logsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the edit_logs
     */
    omit?: edit_logsOmit<ExtArgs> | null
  }


  /**
   * Model citizen_complaints
   */

  export type AggregateCitizen_complaints = {
    _count: Citizen_complaintsCountAggregateOutputType | null
    _avg: Citizen_complaintsAvgAggregateOutputType | null
    _sum: Citizen_complaintsSumAggregateOutputType | null
    _min: Citizen_complaintsMinAggregateOutputType | null
    _max: Citizen_complaintsMaxAggregateOutputType | null
  }

  export type Citizen_complaintsAvgAggregateOutputType = {
    id: number | null
    latitude: number | null
    longitude: number | null
  }

  export type Citizen_complaintsSumAggregateOutputType = {
    id: number | null
    latitude: number | null
    longitude: number | null
  }

  export type Citizen_complaintsMinAggregateOutputType = {
    id: number | null
    ticket_number: string | null
    phone_number: string | null
    title: string | null
    description: string | null
    category: $Enums.CitizenComplaintCategory | null
    image_url: string | null
    latitude: number | null
    longitude: number | null
    address: string | null
    status: $Enums.CitizenComplaintStatus | null
    otp_hash: string | null
    otp_expiry: Date | null
    otp_verified: boolean | null
    assigned_to: string | null
    remarks: string | null
    created_at: Date | null
    updated_at: Date | null
    closed_at: Date | null
    verification_code: string | null
    verification_expires_at: Date | null
  }

  export type Citizen_complaintsMaxAggregateOutputType = {
    id: number | null
    ticket_number: string | null
    phone_number: string | null
    title: string | null
    description: string | null
    category: $Enums.CitizenComplaintCategory | null
    image_url: string | null
    latitude: number | null
    longitude: number | null
    address: string | null
    status: $Enums.CitizenComplaintStatus | null
    otp_hash: string | null
    otp_expiry: Date | null
    otp_verified: boolean | null
    assigned_to: string | null
    remarks: string | null
    created_at: Date | null
    updated_at: Date | null
    closed_at: Date | null
    verification_code: string | null
    verification_expires_at: Date | null
  }

  export type Citizen_complaintsCountAggregateOutputType = {
    id: number
    ticket_number: number
    phone_number: number
    title: number
    description: number
    category: number
    image_url: number
    latitude: number
    longitude: number
    address: number
    status: number
    otp_hash: number
    otp_expiry: number
    otp_verified: number
    assigned_to: number
    remarks: number
    created_at: number
    updated_at: number
    closed_at: number
    verification_code: number
    verification_expires_at: number
    _all: number
  }


  export type Citizen_complaintsAvgAggregateInputType = {
    id?: true
    latitude?: true
    longitude?: true
  }

  export type Citizen_complaintsSumAggregateInputType = {
    id?: true
    latitude?: true
    longitude?: true
  }

  export type Citizen_complaintsMinAggregateInputType = {
    id?: true
    ticket_number?: true
    phone_number?: true
    title?: true
    description?: true
    category?: true
    image_url?: true
    latitude?: true
    longitude?: true
    address?: true
    status?: true
    otp_hash?: true
    otp_expiry?: true
    otp_verified?: true
    assigned_to?: true
    remarks?: true
    created_at?: true
    updated_at?: true
    closed_at?: true
    verification_code?: true
    verification_expires_at?: true
  }

  export type Citizen_complaintsMaxAggregateInputType = {
    id?: true
    ticket_number?: true
    phone_number?: true
    title?: true
    description?: true
    category?: true
    image_url?: true
    latitude?: true
    longitude?: true
    address?: true
    status?: true
    otp_hash?: true
    otp_expiry?: true
    otp_verified?: true
    assigned_to?: true
    remarks?: true
    created_at?: true
    updated_at?: true
    closed_at?: true
    verification_code?: true
    verification_expires_at?: true
  }

  export type Citizen_complaintsCountAggregateInputType = {
    id?: true
    ticket_number?: true
    phone_number?: true
    title?: true
    description?: true
    category?: true
    image_url?: true
    latitude?: true
    longitude?: true
    address?: true
    status?: true
    otp_hash?: true
    otp_expiry?: true
    otp_verified?: true
    assigned_to?: true
    remarks?: true
    created_at?: true
    updated_at?: true
    closed_at?: true
    verification_code?: true
    verification_expires_at?: true
    _all?: true
  }

  export type Citizen_complaintsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which citizen_complaints to aggregate.
     */
    where?: citizen_complaintsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of citizen_complaints to fetch.
     */
    orderBy?: citizen_complaintsOrderByWithRelationInput | citizen_complaintsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: citizen_complaintsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` citizen_complaints from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` citizen_complaints.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned citizen_complaints
    **/
    _count?: true | Citizen_complaintsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Citizen_complaintsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Citizen_complaintsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Citizen_complaintsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Citizen_complaintsMaxAggregateInputType
  }

  export type GetCitizen_complaintsAggregateType<T extends Citizen_complaintsAggregateArgs> = {
        [P in keyof T & keyof AggregateCitizen_complaints]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCitizen_complaints[P]>
      : GetScalarType<T[P], AggregateCitizen_complaints[P]>
  }




  export type citizen_complaintsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: citizen_complaintsWhereInput
    orderBy?: citizen_complaintsOrderByWithAggregationInput | citizen_complaintsOrderByWithAggregationInput[]
    by: Citizen_complaintsScalarFieldEnum[] | Citizen_complaintsScalarFieldEnum
    having?: citizen_complaintsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Citizen_complaintsCountAggregateInputType | true
    _avg?: Citizen_complaintsAvgAggregateInputType
    _sum?: Citizen_complaintsSumAggregateInputType
    _min?: Citizen_complaintsMinAggregateInputType
    _max?: Citizen_complaintsMaxAggregateInputType
  }

  export type Citizen_complaintsGroupByOutputType = {
    id: number
    ticket_number: string
    phone_number: string
    title: string
    description: string
    category: $Enums.CitizenComplaintCategory
    image_url: string | null
    latitude: number
    longitude: number
    address: string
    status: $Enums.CitizenComplaintStatus
    otp_hash: string | null
    otp_expiry: Date | null
    otp_verified: boolean
    assigned_to: string | null
    remarks: string | null
    created_at: Date
    updated_at: Date
    closed_at: Date | null
    verification_code: string | null
    verification_expires_at: Date | null
    _count: Citizen_complaintsCountAggregateOutputType | null
    _avg: Citizen_complaintsAvgAggregateOutputType | null
    _sum: Citizen_complaintsSumAggregateOutputType | null
    _min: Citizen_complaintsMinAggregateOutputType | null
    _max: Citizen_complaintsMaxAggregateOutputType | null
  }

  type GetCitizen_complaintsGroupByPayload<T extends citizen_complaintsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Citizen_complaintsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Citizen_complaintsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Citizen_complaintsGroupByOutputType[P]>
            : GetScalarType<T[P], Citizen_complaintsGroupByOutputType[P]>
        }
      >
    >


  export type citizen_complaintsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ticket_number?: boolean
    phone_number?: boolean
    title?: boolean
    description?: boolean
    category?: boolean
    image_url?: boolean
    latitude?: boolean
    longitude?: boolean
    address?: boolean
    status?: boolean
    otp_hash?: boolean
    otp_expiry?: boolean
    otp_verified?: boolean
    assigned_to?: boolean
    remarks?: boolean
    created_at?: boolean
    updated_at?: boolean
    closed_at?: boolean
    verification_code?: boolean
    verification_expires_at?: boolean
  }, ExtArgs["result"]["citizen_complaints"]>

  export type citizen_complaintsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ticket_number?: boolean
    phone_number?: boolean
    title?: boolean
    description?: boolean
    category?: boolean
    image_url?: boolean
    latitude?: boolean
    longitude?: boolean
    address?: boolean
    status?: boolean
    otp_hash?: boolean
    otp_expiry?: boolean
    otp_verified?: boolean
    assigned_to?: boolean
    remarks?: boolean
    created_at?: boolean
    updated_at?: boolean
    closed_at?: boolean
    verification_code?: boolean
    verification_expires_at?: boolean
  }, ExtArgs["result"]["citizen_complaints"]>

  export type citizen_complaintsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ticket_number?: boolean
    phone_number?: boolean
    title?: boolean
    description?: boolean
    category?: boolean
    image_url?: boolean
    latitude?: boolean
    longitude?: boolean
    address?: boolean
    status?: boolean
    otp_hash?: boolean
    otp_expiry?: boolean
    otp_verified?: boolean
    assigned_to?: boolean
    remarks?: boolean
    created_at?: boolean
    updated_at?: boolean
    closed_at?: boolean
    verification_code?: boolean
    verification_expires_at?: boolean
  }, ExtArgs["result"]["citizen_complaints"]>

  export type citizen_complaintsSelectScalar = {
    id?: boolean
    ticket_number?: boolean
    phone_number?: boolean
    title?: boolean
    description?: boolean
    category?: boolean
    image_url?: boolean
    latitude?: boolean
    longitude?: boolean
    address?: boolean
    status?: boolean
    otp_hash?: boolean
    otp_expiry?: boolean
    otp_verified?: boolean
    assigned_to?: boolean
    remarks?: boolean
    created_at?: boolean
    updated_at?: boolean
    closed_at?: boolean
    verification_code?: boolean
    verification_expires_at?: boolean
  }

  export type citizen_complaintsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "ticket_number" | "phone_number" | "title" | "description" | "category" | "image_url" | "latitude" | "longitude" | "address" | "status" | "otp_hash" | "otp_expiry" | "otp_verified" | "assigned_to" | "remarks" | "created_at" | "updated_at" | "closed_at" | "verification_code" | "verification_expires_at", ExtArgs["result"]["citizen_complaints"]>

  export type $citizen_complaintsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "citizen_complaints"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      ticket_number: string
      phone_number: string
      title: string
      description: string
      category: $Enums.CitizenComplaintCategory
      image_url: string | null
      latitude: number
      longitude: number
      address: string
      status: $Enums.CitizenComplaintStatus
      otp_hash: string | null
      otp_expiry: Date | null
      otp_verified: boolean
      assigned_to: string | null
      remarks: string | null
      created_at: Date
      updated_at: Date
      closed_at: Date | null
      verification_code: string | null
      verification_expires_at: Date | null
    }, ExtArgs["result"]["citizen_complaints"]>
    composites: {}
  }

  type citizen_complaintsGetPayload<S extends boolean | null | undefined | citizen_complaintsDefaultArgs> = $Result.GetResult<Prisma.$citizen_complaintsPayload, S>

  type citizen_complaintsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<citizen_complaintsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Citizen_complaintsCountAggregateInputType | true
    }

  export interface citizen_complaintsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['citizen_complaints'], meta: { name: 'citizen_complaints' } }
    /**
     * Find zero or one Citizen_complaints that matches the filter.
     * @param {citizen_complaintsFindUniqueArgs} args - Arguments to find a Citizen_complaints
     * @example
     * // Get one Citizen_complaints
     * const citizen_complaints = await prisma.citizen_complaints.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends citizen_complaintsFindUniqueArgs>(args: SelectSubset<T, citizen_complaintsFindUniqueArgs<ExtArgs>>): Prisma__citizen_complaintsClient<$Result.GetResult<Prisma.$citizen_complaintsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Citizen_complaints that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {citizen_complaintsFindUniqueOrThrowArgs} args - Arguments to find a Citizen_complaints
     * @example
     * // Get one Citizen_complaints
     * const citizen_complaints = await prisma.citizen_complaints.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends citizen_complaintsFindUniqueOrThrowArgs>(args: SelectSubset<T, citizen_complaintsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__citizen_complaintsClient<$Result.GetResult<Prisma.$citizen_complaintsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Citizen_complaints that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {citizen_complaintsFindFirstArgs} args - Arguments to find a Citizen_complaints
     * @example
     * // Get one Citizen_complaints
     * const citizen_complaints = await prisma.citizen_complaints.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends citizen_complaintsFindFirstArgs>(args?: SelectSubset<T, citizen_complaintsFindFirstArgs<ExtArgs>>): Prisma__citizen_complaintsClient<$Result.GetResult<Prisma.$citizen_complaintsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Citizen_complaints that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {citizen_complaintsFindFirstOrThrowArgs} args - Arguments to find a Citizen_complaints
     * @example
     * // Get one Citizen_complaints
     * const citizen_complaints = await prisma.citizen_complaints.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends citizen_complaintsFindFirstOrThrowArgs>(args?: SelectSubset<T, citizen_complaintsFindFirstOrThrowArgs<ExtArgs>>): Prisma__citizen_complaintsClient<$Result.GetResult<Prisma.$citizen_complaintsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Citizen_complaints that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {citizen_complaintsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Citizen_complaints
     * const citizen_complaints = await prisma.citizen_complaints.findMany()
     * 
     * // Get first 10 Citizen_complaints
     * const citizen_complaints = await prisma.citizen_complaints.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const citizen_complaintsWithIdOnly = await prisma.citizen_complaints.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends citizen_complaintsFindManyArgs>(args?: SelectSubset<T, citizen_complaintsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$citizen_complaintsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Citizen_complaints.
     * @param {citizen_complaintsCreateArgs} args - Arguments to create a Citizen_complaints.
     * @example
     * // Create one Citizen_complaints
     * const Citizen_complaints = await prisma.citizen_complaints.create({
     *   data: {
     *     // ... data to create a Citizen_complaints
     *   }
     * })
     * 
     */
    create<T extends citizen_complaintsCreateArgs>(args: SelectSubset<T, citizen_complaintsCreateArgs<ExtArgs>>): Prisma__citizen_complaintsClient<$Result.GetResult<Prisma.$citizen_complaintsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Citizen_complaints.
     * @param {citizen_complaintsCreateManyArgs} args - Arguments to create many Citizen_complaints.
     * @example
     * // Create many Citizen_complaints
     * const citizen_complaints = await prisma.citizen_complaints.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends citizen_complaintsCreateManyArgs>(args?: SelectSubset<T, citizen_complaintsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Citizen_complaints and returns the data saved in the database.
     * @param {citizen_complaintsCreateManyAndReturnArgs} args - Arguments to create many Citizen_complaints.
     * @example
     * // Create many Citizen_complaints
     * const citizen_complaints = await prisma.citizen_complaints.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Citizen_complaints and only return the `id`
     * const citizen_complaintsWithIdOnly = await prisma.citizen_complaints.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends citizen_complaintsCreateManyAndReturnArgs>(args?: SelectSubset<T, citizen_complaintsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$citizen_complaintsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Citizen_complaints.
     * @param {citizen_complaintsDeleteArgs} args - Arguments to delete one Citizen_complaints.
     * @example
     * // Delete one Citizen_complaints
     * const Citizen_complaints = await prisma.citizen_complaints.delete({
     *   where: {
     *     // ... filter to delete one Citizen_complaints
     *   }
     * })
     * 
     */
    delete<T extends citizen_complaintsDeleteArgs>(args: SelectSubset<T, citizen_complaintsDeleteArgs<ExtArgs>>): Prisma__citizen_complaintsClient<$Result.GetResult<Prisma.$citizen_complaintsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Citizen_complaints.
     * @param {citizen_complaintsUpdateArgs} args - Arguments to update one Citizen_complaints.
     * @example
     * // Update one Citizen_complaints
     * const citizen_complaints = await prisma.citizen_complaints.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends citizen_complaintsUpdateArgs>(args: SelectSubset<T, citizen_complaintsUpdateArgs<ExtArgs>>): Prisma__citizen_complaintsClient<$Result.GetResult<Prisma.$citizen_complaintsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Citizen_complaints.
     * @param {citizen_complaintsDeleteManyArgs} args - Arguments to filter Citizen_complaints to delete.
     * @example
     * // Delete a few Citizen_complaints
     * const { count } = await prisma.citizen_complaints.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends citizen_complaintsDeleteManyArgs>(args?: SelectSubset<T, citizen_complaintsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Citizen_complaints.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {citizen_complaintsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Citizen_complaints
     * const citizen_complaints = await prisma.citizen_complaints.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends citizen_complaintsUpdateManyArgs>(args: SelectSubset<T, citizen_complaintsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Citizen_complaints and returns the data updated in the database.
     * @param {citizen_complaintsUpdateManyAndReturnArgs} args - Arguments to update many Citizen_complaints.
     * @example
     * // Update many Citizen_complaints
     * const citizen_complaints = await prisma.citizen_complaints.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Citizen_complaints and only return the `id`
     * const citizen_complaintsWithIdOnly = await prisma.citizen_complaints.updateManyAndReturn({
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
    updateManyAndReturn<T extends citizen_complaintsUpdateManyAndReturnArgs>(args: SelectSubset<T, citizen_complaintsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$citizen_complaintsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Citizen_complaints.
     * @param {citizen_complaintsUpsertArgs} args - Arguments to update or create a Citizen_complaints.
     * @example
     * // Update or create a Citizen_complaints
     * const citizen_complaints = await prisma.citizen_complaints.upsert({
     *   create: {
     *     // ... data to create a Citizen_complaints
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Citizen_complaints we want to update
     *   }
     * })
     */
    upsert<T extends citizen_complaintsUpsertArgs>(args: SelectSubset<T, citizen_complaintsUpsertArgs<ExtArgs>>): Prisma__citizen_complaintsClient<$Result.GetResult<Prisma.$citizen_complaintsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Citizen_complaints.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {citizen_complaintsCountArgs} args - Arguments to filter Citizen_complaints to count.
     * @example
     * // Count the number of Citizen_complaints
     * const count = await prisma.citizen_complaints.count({
     *   where: {
     *     // ... the filter for the Citizen_complaints we want to count
     *   }
     * })
    **/
    count<T extends citizen_complaintsCountArgs>(
      args?: Subset<T, citizen_complaintsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Citizen_complaintsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Citizen_complaints.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Citizen_complaintsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends Citizen_complaintsAggregateArgs>(args: Subset<T, Citizen_complaintsAggregateArgs>): Prisma.PrismaPromise<GetCitizen_complaintsAggregateType<T>>

    /**
     * Group by Citizen_complaints.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {citizen_complaintsGroupByArgs} args - Group by arguments.
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
      T extends citizen_complaintsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: citizen_complaintsGroupByArgs['orderBy'] }
        : { orderBy?: citizen_complaintsGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, citizen_complaintsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCitizen_complaintsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the citizen_complaints model
   */
  readonly fields: citizen_complaintsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for citizen_complaints.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__citizen_complaintsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the citizen_complaints model
   */
  interface citizen_complaintsFieldRefs {
    readonly id: FieldRef<"citizen_complaints", 'Int'>
    readonly ticket_number: FieldRef<"citizen_complaints", 'String'>
    readonly phone_number: FieldRef<"citizen_complaints", 'String'>
    readonly title: FieldRef<"citizen_complaints", 'String'>
    readonly description: FieldRef<"citizen_complaints", 'String'>
    readonly category: FieldRef<"citizen_complaints", 'CitizenComplaintCategory'>
    readonly image_url: FieldRef<"citizen_complaints", 'String'>
    readonly latitude: FieldRef<"citizen_complaints", 'Float'>
    readonly longitude: FieldRef<"citizen_complaints", 'Float'>
    readonly address: FieldRef<"citizen_complaints", 'String'>
    readonly status: FieldRef<"citizen_complaints", 'CitizenComplaintStatus'>
    readonly otp_hash: FieldRef<"citizen_complaints", 'String'>
    readonly otp_expiry: FieldRef<"citizen_complaints", 'DateTime'>
    readonly otp_verified: FieldRef<"citizen_complaints", 'Boolean'>
    readonly assigned_to: FieldRef<"citizen_complaints", 'String'>
    readonly remarks: FieldRef<"citizen_complaints", 'String'>
    readonly created_at: FieldRef<"citizen_complaints", 'DateTime'>
    readonly updated_at: FieldRef<"citizen_complaints", 'DateTime'>
    readonly closed_at: FieldRef<"citizen_complaints", 'DateTime'>
    readonly verification_code: FieldRef<"citizen_complaints", 'String'>
    readonly verification_expires_at: FieldRef<"citizen_complaints", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * citizen_complaints findUnique
   */
  export type citizen_complaintsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the citizen_complaints
     */
    select?: citizen_complaintsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the citizen_complaints
     */
    omit?: citizen_complaintsOmit<ExtArgs> | null
    /**
     * Filter, which citizen_complaints to fetch.
     */
    where: citizen_complaintsWhereUniqueInput
  }

  /**
   * citizen_complaints findUniqueOrThrow
   */
  export type citizen_complaintsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the citizen_complaints
     */
    select?: citizen_complaintsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the citizen_complaints
     */
    omit?: citizen_complaintsOmit<ExtArgs> | null
    /**
     * Filter, which citizen_complaints to fetch.
     */
    where: citizen_complaintsWhereUniqueInput
  }

  /**
   * citizen_complaints findFirst
   */
  export type citizen_complaintsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the citizen_complaints
     */
    select?: citizen_complaintsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the citizen_complaints
     */
    omit?: citizen_complaintsOmit<ExtArgs> | null
    /**
     * Filter, which citizen_complaints to fetch.
     */
    where?: citizen_complaintsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of citizen_complaints to fetch.
     */
    orderBy?: citizen_complaintsOrderByWithRelationInput | citizen_complaintsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for citizen_complaints.
     */
    cursor?: citizen_complaintsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` citizen_complaints from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` citizen_complaints.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of citizen_complaints.
     */
    distinct?: Citizen_complaintsScalarFieldEnum | Citizen_complaintsScalarFieldEnum[]
  }

  /**
   * citizen_complaints findFirstOrThrow
   */
  export type citizen_complaintsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the citizen_complaints
     */
    select?: citizen_complaintsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the citizen_complaints
     */
    omit?: citizen_complaintsOmit<ExtArgs> | null
    /**
     * Filter, which citizen_complaints to fetch.
     */
    where?: citizen_complaintsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of citizen_complaints to fetch.
     */
    orderBy?: citizen_complaintsOrderByWithRelationInput | citizen_complaintsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for citizen_complaints.
     */
    cursor?: citizen_complaintsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` citizen_complaints from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` citizen_complaints.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of citizen_complaints.
     */
    distinct?: Citizen_complaintsScalarFieldEnum | Citizen_complaintsScalarFieldEnum[]
  }

  /**
   * citizen_complaints findMany
   */
  export type citizen_complaintsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the citizen_complaints
     */
    select?: citizen_complaintsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the citizen_complaints
     */
    omit?: citizen_complaintsOmit<ExtArgs> | null
    /**
     * Filter, which citizen_complaints to fetch.
     */
    where?: citizen_complaintsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of citizen_complaints to fetch.
     */
    orderBy?: citizen_complaintsOrderByWithRelationInput | citizen_complaintsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing citizen_complaints.
     */
    cursor?: citizen_complaintsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` citizen_complaints from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` citizen_complaints.
     */
    skip?: number
    distinct?: Citizen_complaintsScalarFieldEnum | Citizen_complaintsScalarFieldEnum[]
  }

  /**
   * citizen_complaints create
   */
  export type citizen_complaintsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the citizen_complaints
     */
    select?: citizen_complaintsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the citizen_complaints
     */
    omit?: citizen_complaintsOmit<ExtArgs> | null
    /**
     * The data needed to create a citizen_complaints.
     */
    data: XOR<citizen_complaintsCreateInput, citizen_complaintsUncheckedCreateInput>
  }

  /**
   * citizen_complaints createMany
   */
  export type citizen_complaintsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many citizen_complaints.
     */
    data: citizen_complaintsCreateManyInput | citizen_complaintsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * citizen_complaints createManyAndReturn
   */
  export type citizen_complaintsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the citizen_complaints
     */
    select?: citizen_complaintsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the citizen_complaints
     */
    omit?: citizen_complaintsOmit<ExtArgs> | null
    /**
     * The data used to create many citizen_complaints.
     */
    data: citizen_complaintsCreateManyInput | citizen_complaintsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * citizen_complaints update
   */
  export type citizen_complaintsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the citizen_complaints
     */
    select?: citizen_complaintsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the citizen_complaints
     */
    omit?: citizen_complaintsOmit<ExtArgs> | null
    /**
     * The data needed to update a citizen_complaints.
     */
    data: XOR<citizen_complaintsUpdateInput, citizen_complaintsUncheckedUpdateInput>
    /**
     * Choose, which citizen_complaints to update.
     */
    where: citizen_complaintsWhereUniqueInput
  }

  /**
   * citizen_complaints updateMany
   */
  export type citizen_complaintsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update citizen_complaints.
     */
    data: XOR<citizen_complaintsUpdateManyMutationInput, citizen_complaintsUncheckedUpdateManyInput>
    /**
     * Filter which citizen_complaints to update
     */
    where?: citizen_complaintsWhereInput
    /**
     * Limit how many citizen_complaints to update.
     */
    limit?: number
  }

  /**
   * citizen_complaints updateManyAndReturn
   */
  export type citizen_complaintsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the citizen_complaints
     */
    select?: citizen_complaintsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the citizen_complaints
     */
    omit?: citizen_complaintsOmit<ExtArgs> | null
    /**
     * The data used to update citizen_complaints.
     */
    data: XOR<citizen_complaintsUpdateManyMutationInput, citizen_complaintsUncheckedUpdateManyInput>
    /**
     * Filter which citizen_complaints to update
     */
    where?: citizen_complaintsWhereInput
    /**
     * Limit how many citizen_complaints to update.
     */
    limit?: number
  }

  /**
   * citizen_complaints upsert
   */
  export type citizen_complaintsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the citizen_complaints
     */
    select?: citizen_complaintsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the citizen_complaints
     */
    omit?: citizen_complaintsOmit<ExtArgs> | null
    /**
     * The filter to search for the citizen_complaints to update in case it exists.
     */
    where: citizen_complaintsWhereUniqueInput
    /**
     * In case the citizen_complaints found by the `where` argument doesn't exist, create a new citizen_complaints with this data.
     */
    create: XOR<citizen_complaintsCreateInput, citizen_complaintsUncheckedCreateInput>
    /**
     * In case the citizen_complaints was found with the provided `where` argument, update it with this data.
     */
    update: XOR<citizen_complaintsUpdateInput, citizen_complaintsUncheckedUpdateInput>
  }

  /**
   * citizen_complaints delete
   */
  export type citizen_complaintsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the citizen_complaints
     */
    select?: citizen_complaintsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the citizen_complaints
     */
    omit?: citizen_complaintsOmit<ExtArgs> | null
    /**
     * Filter which citizen_complaints to delete.
     */
    where: citizen_complaintsWhereUniqueInput
  }

  /**
   * citizen_complaints deleteMany
   */
  export type citizen_complaintsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which citizen_complaints to delete
     */
    where?: citizen_complaintsWhereInput
    /**
     * Limit how many citizen_complaints to delete.
     */
    limit?: number
  }

  /**
   * citizen_complaints without action
   */
  export type citizen_complaintsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the citizen_complaints
     */
    select?: citizen_complaintsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the citizen_complaints
     */
    omit?: citizen_complaintsOmit<ExtArgs> | null
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


  export const Telemetry_logsScalarFieldEnum: {
    id: 'id',
    iot_timestamp: 'iot_timestamp',
    received_at: 'received_at',
    rfid_epc: 'rfid_epc',
    citizen_id: 'citizen_id',
    waste_type: 'waste_type',
    latitude: 'latitude',
    longitude: 'longitude',
    wet_weight_kg: 'wet_weight_kg',
    dry_weight_kg: 'dry_weight_kg',
    other_weight_kg: 'other_weight_kg',
    cumulative_weight_kg: 'cumulative_weight_kg',
    driver_name: 'driver_name',
    vehicle_id: 'vehicle_id',
    firmware_version: 'firmware_version',
    unit_number: 'unit_number',
    collection_type: 'collection_type',
    remarks: 'remarks',
    err_code: 'err_code',
    citizen_contact: 'citizen_contact',
    driver_action: 'driver_action'
  };

  export type Telemetry_logsScalarFieldEnum = (typeof Telemetry_logsScalarFieldEnum)[keyof typeof Telemetry_logsScalarFieldEnum]


  export const Vehicle_incidentsScalarFieldEnum: {
    id: 'id',
    vehicle_id: 'vehicle_id',
    date_time: 'date_time',
    main_road: 'main_road',
    cross_road: 'cross_road',
    speed_flagged_kmh: 'speed_flagged_kmh',
    speed_limit_kmh: 'speed_limit_kmh',
    excess_speed_kmh: 'excess_speed_kmh',
    status: 'status'
  };

  export type Vehicle_incidentsScalarFieldEnum = (typeof Vehicle_incidentsScalarFieldEnum)[keyof typeof Vehicle_incidentsScalarFieldEnum]


  export const Vehicle_masterScalarFieldEnum: {
    id: 'id',
    vehicle_id: 'vehicle_id',
    vehicle_type: 'vehicle_type',
    city: 'city',
    zone: 'zone',
    division: 'division',
    ward: 'ward',
    status: 'status',
    created_at: 'created_at'
  };

  export type Vehicle_masterScalarFieldEnum = (typeof Vehicle_masterScalarFieldEnum)[keyof typeof Vehicle_masterScalarFieldEnum]


  export const Vehicle_telemetryScalarFieldEnum: {
    id: 'id',
    vehicle_id: 'vehicle_id',
    latitude: 'latitude',
    longitude: 'longitude',
    speed_kmh: 'speed_kmh',
    fuel_level: 'fuel_level',
    battery_health: 'battery_health',
    engine_status: 'engine_status',
    recorded_at: 'recorded_at'
  };

  export type Vehicle_telemetryScalarFieldEnum = (typeof Vehicle_telemetryScalarFieldEnum)[keyof typeof Vehicle_telemetryScalarFieldEnum]


  export const Plant_masterScalarFieldEnum: {
    id: 'id',
    plant_name: 'plant_name',
    plant_type: 'plant_type',
    city: 'city',
    zone: 'zone',
    division: 'division',
    ward: 'ward',
    plant_manager: 'plant_manager',
    capacity_ton_per_day: 'capacity_ton_per_day',
    vehicles_enrolled: 'vehicles_enrolled',
    total_waste_collected: 'total_waste_collected',
    latitude: 'latitude',
    longitude: 'longitude',
    status: 'status',
    created_at: 'created_at'
  };

  export type Plant_masterScalarFieldEnum = (typeof Plant_masterScalarFieldEnum)[keyof typeof Plant_masterScalarFieldEnum]


  export const Edit_logsScalarFieldEnum: {
    id: 'id',
    performed_by: 'performed_by',
    role: 'role',
    module: 'module',
    action: 'action',
    record_id: 'record_id',
    description: 'description',
    ip_address: 'ip_address',
    created_at: 'created_at',
    performed_by_id: 'performed_by_id',
    success: 'success'
  };

  export type Edit_logsScalarFieldEnum = (typeof Edit_logsScalarFieldEnum)[keyof typeof Edit_logsScalarFieldEnum]


  export const Citizen_complaintsScalarFieldEnum: {
    id: 'id',
    ticket_number: 'ticket_number',
    phone_number: 'phone_number',
    title: 'title',
    description: 'description',
    category: 'category',
    image_url: 'image_url',
    latitude: 'latitude',
    longitude: 'longitude',
    address: 'address',
    status: 'status',
    otp_hash: 'otp_hash',
    otp_expiry: 'otp_expiry',
    otp_verified: 'otp_verified',
    assigned_to: 'assigned_to',
    remarks: 'remarks',
    created_at: 'created_at',
    updated_at: 'updated_at',
    closed_at: 'closed_at',
    verification_code: 'verification_code',
    verification_expires_at: 'verification_expires_at'
  };

  export type Citizen_complaintsScalarFieldEnum = (typeof Citizen_complaintsScalarFieldEnum)[keyof typeof Citizen_complaintsScalarFieldEnum]


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
   * Reference to a field of type 'Decimal'
   */
  export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>
    


  /**
   * Reference to a field of type 'Decimal[]'
   */
  export type ListDecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'CitizenComplaintCategory'
   */
  export type EnumCitizenComplaintCategoryFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'CitizenComplaintCategory'>
    


  /**
   * Reference to a field of type 'CitizenComplaintCategory[]'
   */
  export type ListEnumCitizenComplaintCategoryFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'CitizenComplaintCategory[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'CitizenComplaintStatus'
   */
  export type EnumCitizenComplaintStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'CitizenComplaintStatus'>
    


  /**
   * Reference to a field of type 'CitizenComplaintStatus[]'
   */
  export type ListEnumCitizenComplaintStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'CitizenComplaintStatus[]'>
    
  /**
   * Deep Input Types
   */


  export type telemetry_logsWhereInput = {
    AND?: telemetry_logsWhereInput | telemetry_logsWhereInput[]
    OR?: telemetry_logsWhereInput[]
    NOT?: telemetry_logsWhereInput | telemetry_logsWhereInput[]
    id?: IntFilter<"telemetry_logs"> | number
    iot_timestamp?: DateTimeFilter<"telemetry_logs"> | Date | string
    received_at?: DateTimeFilter<"telemetry_logs"> | Date | string
    rfid_epc?: StringFilter<"telemetry_logs"> | string
    citizen_id?: IntNullableFilter<"telemetry_logs"> | number | null
    waste_type?: StringNullableFilter<"telemetry_logs"> | string | null
    latitude?: DecimalNullableFilter<"telemetry_logs"> | Decimal | DecimalJsLike | number | string | null
    longitude?: DecimalNullableFilter<"telemetry_logs"> | Decimal | DecimalJsLike | number | string | null
    wet_weight_kg?: DecimalNullableFilter<"telemetry_logs"> | Decimal | DecimalJsLike | number | string | null
    dry_weight_kg?: DecimalNullableFilter<"telemetry_logs"> | Decimal | DecimalJsLike | number | string | null
    other_weight_kg?: DecimalNullableFilter<"telemetry_logs"> | Decimal | DecimalJsLike | number | string | null
    cumulative_weight_kg?: DecimalNullableFilter<"telemetry_logs"> | Decimal | DecimalJsLike | number | string | null
    driver_name?: StringNullableFilter<"telemetry_logs"> | string | null
    vehicle_id?: StringNullableFilter<"telemetry_logs"> | string | null
    firmware_version?: StringNullableFilter<"telemetry_logs"> | string | null
    unit_number?: StringNullableFilter<"telemetry_logs"> | string | null
    collection_type?: StringNullableFilter<"telemetry_logs"> | string | null
    remarks?: StringNullableFilter<"telemetry_logs"> | string | null
    err_code?: StringNullableFilter<"telemetry_logs"> | string | null
    citizen_contact?: StringNullableFilter<"telemetry_logs"> | string | null
    driver_action?: IntFilter<"telemetry_logs"> | number
  }

  export type telemetry_logsOrderByWithRelationInput = {
    id?: SortOrder
    iot_timestamp?: SortOrder
    received_at?: SortOrder
    rfid_epc?: SortOrder
    citizen_id?: SortOrderInput | SortOrder
    waste_type?: SortOrderInput | SortOrder
    latitude?: SortOrderInput | SortOrder
    longitude?: SortOrderInput | SortOrder
    wet_weight_kg?: SortOrderInput | SortOrder
    dry_weight_kg?: SortOrderInput | SortOrder
    other_weight_kg?: SortOrderInput | SortOrder
    cumulative_weight_kg?: SortOrderInput | SortOrder
    driver_name?: SortOrderInput | SortOrder
    vehicle_id?: SortOrderInput | SortOrder
    firmware_version?: SortOrderInput | SortOrder
    unit_number?: SortOrderInput | SortOrder
    collection_type?: SortOrderInput | SortOrder
    remarks?: SortOrderInput | SortOrder
    err_code?: SortOrderInput | SortOrder
    citizen_contact?: SortOrderInput | SortOrder
    driver_action?: SortOrder
  }

  export type telemetry_logsWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: telemetry_logsWhereInput | telemetry_logsWhereInput[]
    OR?: telemetry_logsWhereInput[]
    NOT?: telemetry_logsWhereInput | telemetry_logsWhereInput[]
    iot_timestamp?: DateTimeFilter<"telemetry_logs"> | Date | string
    received_at?: DateTimeFilter<"telemetry_logs"> | Date | string
    rfid_epc?: StringFilter<"telemetry_logs"> | string
    citizen_id?: IntNullableFilter<"telemetry_logs"> | number | null
    waste_type?: StringNullableFilter<"telemetry_logs"> | string | null
    latitude?: DecimalNullableFilter<"telemetry_logs"> | Decimal | DecimalJsLike | number | string | null
    longitude?: DecimalNullableFilter<"telemetry_logs"> | Decimal | DecimalJsLike | number | string | null
    wet_weight_kg?: DecimalNullableFilter<"telemetry_logs"> | Decimal | DecimalJsLike | number | string | null
    dry_weight_kg?: DecimalNullableFilter<"telemetry_logs"> | Decimal | DecimalJsLike | number | string | null
    other_weight_kg?: DecimalNullableFilter<"telemetry_logs"> | Decimal | DecimalJsLike | number | string | null
    cumulative_weight_kg?: DecimalNullableFilter<"telemetry_logs"> | Decimal | DecimalJsLike | number | string | null
    driver_name?: StringNullableFilter<"telemetry_logs"> | string | null
    vehicle_id?: StringNullableFilter<"telemetry_logs"> | string | null
    firmware_version?: StringNullableFilter<"telemetry_logs"> | string | null
    unit_number?: StringNullableFilter<"telemetry_logs"> | string | null
    collection_type?: StringNullableFilter<"telemetry_logs"> | string | null
    remarks?: StringNullableFilter<"telemetry_logs"> | string | null
    err_code?: StringNullableFilter<"telemetry_logs"> | string | null
    citizen_contact?: StringNullableFilter<"telemetry_logs"> | string | null
    driver_action?: IntFilter<"telemetry_logs"> | number
  }, "id">

  export type telemetry_logsOrderByWithAggregationInput = {
    id?: SortOrder
    iot_timestamp?: SortOrder
    received_at?: SortOrder
    rfid_epc?: SortOrder
    citizen_id?: SortOrderInput | SortOrder
    waste_type?: SortOrderInput | SortOrder
    latitude?: SortOrderInput | SortOrder
    longitude?: SortOrderInput | SortOrder
    wet_weight_kg?: SortOrderInput | SortOrder
    dry_weight_kg?: SortOrderInput | SortOrder
    other_weight_kg?: SortOrderInput | SortOrder
    cumulative_weight_kg?: SortOrderInput | SortOrder
    driver_name?: SortOrderInput | SortOrder
    vehicle_id?: SortOrderInput | SortOrder
    firmware_version?: SortOrderInput | SortOrder
    unit_number?: SortOrderInput | SortOrder
    collection_type?: SortOrderInput | SortOrder
    remarks?: SortOrderInput | SortOrder
    err_code?: SortOrderInput | SortOrder
    citizen_contact?: SortOrderInput | SortOrder
    driver_action?: SortOrder
    _count?: telemetry_logsCountOrderByAggregateInput
    _avg?: telemetry_logsAvgOrderByAggregateInput
    _max?: telemetry_logsMaxOrderByAggregateInput
    _min?: telemetry_logsMinOrderByAggregateInput
    _sum?: telemetry_logsSumOrderByAggregateInput
  }

  export type telemetry_logsScalarWhereWithAggregatesInput = {
    AND?: telemetry_logsScalarWhereWithAggregatesInput | telemetry_logsScalarWhereWithAggregatesInput[]
    OR?: telemetry_logsScalarWhereWithAggregatesInput[]
    NOT?: telemetry_logsScalarWhereWithAggregatesInput | telemetry_logsScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"telemetry_logs"> | number
    iot_timestamp?: DateTimeWithAggregatesFilter<"telemetry_logs"> | Date | string
    received_at?: DateTimeWithAggregatesFilter<"telemetry_logs"> | Date | string
    rfid_epc?: StringWithAggregatesFilter<"telemetry_logs"> | string
    citizen_id?: IntNullableWithAggregatesFilter<"telemetry_logs"> | number | null
    waste_type?: StringNullableWithAggregatesFilter<"telemetry_logs"> | string | null
    latitude?: DecimalNullableWithAggregatesFilter<"telemetry_logs"> | Decimal | DecimalJsLike | number | string | null
    longitude?: DecimalNullableWithAggregatesFilter<"telemetry_logs"> | Decimal | DecimalJsLike | number | string | null
    wet_weight_kg?: DecimalNullableWithAggregatesFilter<"telemetry_logs"> | Decimal | DecimalJsLike | number | string | null
    dry_weight_kg?: DecimalNullableWithAggregatesFilter<"telemetry_logs"> | Decimal | DecimalJsLike | number | string | null
    other_weight_kg?: DecimalNullableWithAggregatesFilter<"telemetry_logs"> | Decimal | DecimalJsLike | number | string | null
    cumulative_weight_kg?: DecimalNullableWithAggregatesFilter<"telemetry_logs"> | Decimal | DecimalJsLike | number | string | null
    driver_name?: StringNullableWithAggregatesFilter<"telemetry_logs"> | string | null
    vehicle_id?: StringNullableWithAggregatesFilter<"telemetry_logs"> | string | null
    firmware_version?: StringNullableWithAggregatesFilter<"telemetry_logs"> | string | null
    unit_number?: StringNullableWithAggregatesFilter<"telemetry_logs"> | string | null
    collection_type?: StringNullableWithAggregatesFilter<"telemetry_logs"> | string | null
    remarks?: StringNullableWithAggregatesFilter<"telemetry_logs"> | string | null
    err_code?: StringNullableWithAggregatesFilter<"telemetry_logs"> | string | null
    citizen_contact?: StringNullableWithAggregatesFilter<"telemetry_logs"> | string | null
    driver_action?: IntWithAggregatesFilter<"telemetry_logs"> | number
  }

  export type vehicle_incidentsWhereInput = {
    AND?: vehicle_incidentsWhereInput | vehicle_incidentsWhereInput[]
    OR?: vehicle_incidentsWhereInput[]
    NOT?: vehicle_incidentsWhereInput | vehicle_incidentsWhereInput[]
    id?: IntFilter<"vehicle_incidents"> | number
    vehicle_id?: StringNullableFilter<"vehicle_incidents"> | string | null
    date_time?: DateTimeNullableFilter<"vehicle_incidents"> | Date | string | null
    main_road?: StringNullableFilter<"vehicle_incidents"> | string | null
    cross_road?: StringNullableFilter<"vehicle_incidents"> | string | null
    speed_flagged_kmh?: DecimalNullableFilter<"vehicle_incidents"> | Decimal | DecimalJsLike | number | string | null
    speed_limit_kmh?: DecimalNullableFilter<"vehicle_incidents"> | Decimal | DecimalJsLike | number | string | null
    excess_speed_kmh?: DecimalNullableFilter<"vehicle_incidents"> | Decimal | DecimalJsLike | number | string | null
    status?: StringNullableFilter<"vehicle_incidents"> | string | null
    vehicle_master?: XOR<Vehicle_masterNullableScalarRelationFilter, vehicle_masterWhereInput> | null
  }

  export type vehicle_incidentsOrderByWithRelationInput = {
    id?: SortOrder
    vehicle_id?: SortOrderInput | SortOrder
    date_time?: SortOrderInput | SortOrder
    main_road?: SortOrderInput | SortOrder
    cross_road?: SortOrderInput | SortOrder
    speed_flagged_kmh?: SortOrderInput | SortOrder
    speed_limit_kmh?: SortOrderInput | SortOrder
    excess_speed_kmh?: SortOrderInput | SortOrder
    status?: SortOrderInput | SortOrder
    vehicle_master?: vehicle_masterOrderByWithRelationInput
  }

  export type vehicle_incidentsWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: vehicle_incidentsWhereInput | vehicle_incidentsWhereInput[]
    OR?: vehicle_incidentsWhereInput[]
    NOT?: vehicle_incidentsWhereInput | vehicle_incidentsWhereInput[]
    vehicle_id?: StringNullableFilter<"vehicle_incidents"> | string | null
    date_time?: DateTimeNullableFilter<"vehicle_incidents"> | Date | string | null
    main_road?: StringNullableFilter<"vehicle_incidents"> | string | null
    cross_road?: StringNullableFilter<"vehicle_incidents"> | string | null
    speed_flagged_kmh?: DecimalNullableFilter<"vehicle_incidents"> | Decimal | DecimalJsLike | number | string | null
    speed_limit_kmh?: DecimalNullableFilter<"vehicle_incidents"> | Decimal | DecimalJsLike | number | string | null
    excess_speed_kmh?: DecimalNullableFilter<"vehicle_incidents"> | Decimal | DecimalJsLike | number | string | null
    status?: StringNullableFilter<"vehicle_incidents"> | string | null
    vehicle_master?: XOR<Vehicle_masterNullableScalarRelationFilter, vehicle_masterWhereInput> | null
  }, "id">

  export type vehicle_incidentsOrderByWithAggregationInput = {
    id?: SortOrder
    vehicle_id?: SortOrderInput | SortOrder
    date_time?: SortOrderInput | SortOrder
    main_road?: SortOrderInput | SortOrder
    cross_road?: SortOrderInput | SortOrder
    speed_flagged_kmh?: SortOrderInput | SortOrder
    speed_limit_kmh?: SortOrderInput | SortOrder
    excess_speed_kmh?: SortOrderInput | SortOrder
    status?: SortOrderInput | SortOrder
    _count?: vehicle_incidentsCountOrderByAggregateInput
    _avg?: vehicle_incidentsAvgOrderByAggregateInput
    _max?: vehicle_incidentsMaxOrderByAggregateInput
    _min?: vehicle_incidentsMinOrderByAggregateInput
    _sum?: vehicle_incidentsSumOrderByAggregateInput
  }

  export type vehicle_incidentsScalarWhereWithAggregatesInput = {
    AND?: vehicle_incidentsScalarWhereWithAggregatesInput | vehicle_incidentsScalarWhereWithAggregatesInput[]
    OR?: vehicle_incidentsScalarWhereWithAggregatesInput[]
    NOT?: vehicle_incidentsScalarWhereWithAggregatesInput | vehicle_incidentsScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"vehicle_incidents"> | number
    vehicle_id?: StringNullableWithAggregatesFilter<"vehicle_incidents"> | string | null
    date_time?: DateTimeNullableWithAggregatesFilter<"vehicle_incidents"> | Date | string | null
    main_road?: StringNullableWithAggregatesFilter<"vehicle_incidents"> | string | null
    cross_road?: StringNullableWithAggregatesFilter<"vehicle_incidents"> | string | null
    speed_flagged_kmh?: DecimalNullableWithAggregatesFilter<"vehicle_incidents"> | Decimal | DecimalJsLike | number | string | null
    speed_limit_kmh?: DecimalNullableWithAggregatesFilter<"vehicle_incidents"> | Decimal | DecimalJsLike | number | string | null
    excess_speed_kmh?: DecimalNullableWithAggregatesFilter<"vehicle_incidents"> | Decimal | DecimalJsLike | number | string | null
    status?: StringNullableWithAggregatesFilter<"vehicle_incidents"> | string | null
  }

  export type vehicle_masterWhereInput = {
    AND?: vehicle_masterWhereInput | vehicle_masterWhereInput[]
    OR?: vehicle_masterWhereInput[]
    NOT?: vehicle_masterWhereInput | vehicle_masterWhereInput[]
    id?: IntFilter<"vehicle_master"> | number
    vehicle_id?: StringFilter<"vehicle_master"> | string
    vehicle_type?: StringNullableFilter<"vehicle_master"> | string | null
    city?: StringNullableFilter<"vehicle_master"> | string | null
    zone?: StringNullableFilter<"vehicle_master"> | string | null
    division?: StringNullableFilter<"vehicle_master"> | string | null
    ward?: StringNullableFilter<"vehicle_master"> | string | null
    status?: StringNullableFilter<"vehicle_master"> | string | null
    created_at?: DateTimeNullableFilter<"vehicle_master"> | Date | string | null
    vehicle_incidents?: Vehicle_incidentsListRelationFilter
    vehicle_telemetry?: Vehicle_telemetryListRelationFilter
  }

  export type vehicle_masterOrderByWithRelationInput = {
    id?: SortOrder
    vehicle_id?: SortOrder
    vehicle_type?: SortOrderInput | SortOrder
    city?: SortOrderInput | SortOrder
    zone?: SortOrderInput | SortOrder
    division?: SortOrderInput | SortOrder
    ward?: SortOrderInput | SortOrder
    status?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    vehicle_incidents?: vehicle_incidentsOrderByRelationAggregateInput
    vehicle_telemetry?: vehicle_telemetryOrderByRelationAggregateInput
  }

  export type vehicle_masterWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    vehicle_id?: string
    AND?: vehicle_masterWhereInput | vehicle_masterWhereInput[]
    OR?: vehicle_masterWhereInput[]
    NOT?: vehicle_masterWhereInput | vehicle_masterWhereInput[]
    vehicle_type?: StringNullableFilter<"vehicle_master"> | string | null
    city?: StringNullableFilter<"vehicle_master"> | string | null
    zone?: StringNullableFilter<"vehicle_master"> | string | null
    division?: StringNullableFilter<"vehicle_master"> | string | null
    ward?: StringNullableFilter<"vehicle_master"> | string | null
    status?: StringNullableFilter<"vehicle_master"> | string | null
    created_at?: DateTimeNullableFilter<"vehicle_master"> | Date | string | null
    vehicle_incidents?: Vehicle_incidentsListRelationFilter
    vehicle_telemetry?: Vehicle_telemetryListRelationFilter
  }, "id" | "vehicle_id">

  export type vehicle_masterOrderByWithAggregationInput = {
    id?: SortOrder
    vehicle_id?: SortOrder
    vehicle_type?: SortOrderInput | SortOrder
    city?: SortOrderInput | SortOrder
    zone?: SortOrderInput | SortOrder
    division?: SortOrderInput | SortOrder
    ward?: SortOrderInput | SortOrder
    status?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    _count?: vehicle_masterCountOrderByAggregateInput
    _avg?: vehicle_masterAvgOrderByAggregateInput
    _max?: vehicle_masterMaxOrderByAggregateInput
    _min?: vehicle_masterMinOrderByAggregateInput
    _sum?: vehicle_masterSumOrderByAggregateInput
  }

  export type vehicle_masterScalarWhereWithAggregatesInput = {
    AND?: vehicle_masterScalarWhereWithAggregatesInput | vehicle_masterScalarWhereWithAggregatesInput[]
    OR?: vehicle_masterScalarWhereWithAggregatesInput[]
    NOT?: vehicle_masterScalarWhereWithAggregatesInput | vehicle_masterScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"vehicle_master"> | number
    vehicle_id?: StringWithAggregatesFilter<"vehicle_master"> | string
    vehicle_type?: StringNullableWithAggregatesFilter<"vehicle_master"> | string | null
    city?: StringNullableWithAggregatesFilter<"vehicle_master"> | string | null
    zone?: StringNullableWithAggregatesFilter<"vehicle_master"> | string | null
    division?: StringNullableWithAggregatesFilter<"vehicle_master"> | string | null
    ward?: StringNullableWithAggregatesFilter<"vehicle_master"> | string | null
    status?: StringNullableWithAggregatesFilter<"vehicle_master"> | string | null
    created_at?: DateTimeNullableWithAggregatesFilter<"vehicle_master"> | Date | string | null
  }

  export type vehicle_telemetryWhereInput = {
    AND?: vehicle_telemetryWhereInput | vehicle_telemetryWhereInput[]
    OR?: vehicle_telemetryWhereInput[]
    NOT?: vehicle_telemetryWhereInput | vehicle_telemetryWhereInput[]
    id?: IntFilter<"vehicle_telemetry"> | number
    vehicle_id?: StringNullableFilter<"vehicle_telemetry"> | string | null
    latitude?: DecimalNullableFilter<"vehicle_telemetry"> | Decimal | DecimalJsLike | number | string | null
    longitude?: DecimalNullableFilter<"vehicle_telemetry"> | Decimal | DecimalJsLike | number | string | null
    speed_kmh?: DecimalNullableFilter<"vehicle_telemetry"> | Decimal | DecimalJsLike | number | string | null
    fuel_level?: DecimalNullableFilter<"vehicle_telemetry"> | Decimal | DecimalJsLike | number | string | null
    battery_health?: DecimalNullableFilter<"vehicle_telemetry"> | Decimal | DecimalJsLike | number | string | null
    engine_status?: StringNullableFilter<"vehicle_telemetry"> | string | null
    recorded_at?: DateTimeNullableFilter<"vehicle_telemetry"> | Date | string | null
    vehicle_master?: XOR<Vehicle_masterNullableScalarRelationFilter, vehicle_masterWhereInput> | null
  }

  export type vehicle_telemetryOrderByWithRelationInput = {
    id?: SortOrder
    vehicle_id?: SortOrderInput | SortOrder
    latitude?: SortOrderInput | SortOrder
    longitude?: SortOrderInput | SortOrder
    speed_kmh?: SortOrderInput | SortOrder
    fuel_level?: SortOrderInput | SortOrder
    battery_health?: SortOrderInput | SortOrder
    engine_status?: SortOrderInput | SortOrder
    recorded_at?: SortOrderInput | SortOrder
    vehicle_master?: vehicle_masterOrderByWithRelationInput
  }

  export type vehicle_telemetryWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: vehicle_telemetryWhereInput | vehicle_telemetryWhereInput[]
    OR?: vehicle_telemetryWhereInput[]
    NOT?: vehicle_telemetryWhereInput | vehicle_telemetryWhereInput[]
    vehicle_id?: StringNullableFilter<"vehicle_telemetry"> | string | null
    latitude?: DecimalNullableFilter<"vehicle_telemetry"> | Decimal | DecimalJsLike | number | string | null
    longitude?: DecimalNullableFilter<"vehicle_telemetry"> | Decimal | DecimalJsLike | number | string | null
    speed_kmh?: DecimalNullableFilter<"vehicle_telemetry"> | Decimal | DecimalJsLike | number | string | null
    fuel_level?: DecimalNullableFilter<"vehicle_telemetry"> | Decimal | DecimalJsLike | number | string | null
    battery_health?: DecimalNullableFilter<"vehicle_telemetry"> | Decimal | DecimalJsLike | number | string | null
    engine_status?: StringNullableFilter<"vehicle_telemetry"> | string | null
    recorded_at?: DateTimeNullableFilter<"vehicle_telemetry"> | Date | string | null
    vehicle_master?: XOR<Vehicle_masterNullableScalarRelationFilter, vehicle_masterWhereInput> | null
  }, "id">

  export type vehicle_telemetryOrderByWithAggregationInput = {
    id?: SortOrder
    vehicle_id?: SortOrderInput | SortOrder
    latitude?: SortOrderInput | SortOrder
    longitude?: SortOrderInput | SortOrder
    speed_kmh?: SortOrderInput | SortOrder
    fuel_level?: SortOrderInput | SortOrder
    battery_health?: SortOrderInput | SortOrder
    engine_status?: SortOrderInput | SortOrder
    recorded_at?: SortOrderInput | SortOrder
    _count?: vehicle_telemetryCountOrderByAggregateInput
    _avg?: vehicle_telemetryAvgOrderByAggregateInput
    _max?: vehicle_telemetryMaxOrderByAggregateInput
    _min?: vehicle_telemetryMinOrderByAggregateInput
    _sum?: vehicle_telemetrySumOrderByAggregateInput
  }

  export type vehicle_telemetryScalarWhereWithAggregatesInput = {
    AND?: vehicle_telemetryScalarWhereWithAggregatesInput | vehicle_telemetryScalarWhereWithAggregatesInput[]
    OR?: vehicle_telemetryScalarWhereWithAggregatesInput[]
    NOT?: vehicle_telemetryScalarWhereWithAggregatesInput | vehicle_telemetryScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"vehicle_telemetry"> | number
    vehicle_id?: StringNullableWithAggregatesFilter<"vehicle_telemetry"> | string | null
    latitude?: DecimalNullableWithAggregatesFilter<"vehicle_telemetry"> | Decimal | DecimalJsLike | number | string | null
    longitude?: DecimalNullableWithAggregatesFilter<"vehicle_telemetry"> | Decimal | DecimalJsLike | number | string | null
    speed_kmh?: DecimalNullableWithAggregatesFilter<"vehicle_telemetry"> | Decimal | DecimalJsLike | number | string | null
    fuel_level?: DecimalNullableWithAggregatesFilter<"vehicle_telemetry"> | Decimal | DecimalJsLike | number | string | null
    battery_health?: DecimalNullableWithAggregatesFilter<"vehicle_telemetry"> | Decimal | DecimalJsLike | number | string | null
    engine_status?: StringNullableWithAggregatesFilter<"vehicle_telemetry"> | string | null
    recorded_at?: DateTimeNullableWithAggregatesFilter<"vehicle_telemetry"> | Date | string | null
  }

  export type plant_masterWhereInput = {
    AND?: plant_masterWhereInput | plant_masterWhereInput[]
    OR?: plant_masterWhereInput[]
    NOT?: plant_masterWhereInput | plant_masterWhereInput[]
    id?: IntFilter<"plant_master"> | number
    plant_name?: StringFilter<"plant_master"> | string
    plant_type?: StringNullableFilter<"plant_master"> | string | null
    city?: StringNullableFilter<"plant_master"> | string | null
    zone?: StringNullableFilter<"plant_master"> | string | null
    division?: StringNullableFilter<"plant_master"> | string | null
    ward?: StringNullableFilter<"plant_master"> | string | null
    plant_manager?: StringNullableFilter<"plant_master"> | string | null
    capacity_ton_per_day?: DecimalNullableFilter<"plant_master"> | Decimal | DecimalJsLike | number | string | null
    vehicles_enrolled?: IntNullableFilter<"plant_master"> | number | null
    total_waste_collected?: DecimalNullableFilter<"plant_master"> | Decimal | DecimalJsLike | number | string | null
    latitude?: DecimalNullableFilter<"plant_master"> | Decimal | DecimalJsLike | number | string | null
    longitude?: DecimalNullableFilter<"plant_master"> | Decimal | DecimalJsLike | number | string | null
    status?: StringNullableFilter<"plant_master"> | string | null
    created_at?: DateTimeNullableFilter<"plant_master"> | Date | string | null
  }

  export type plant_masterOrderByWithRelationInput = {
    id?: SortOrder
    plant_name?: SortOrder
    plant_type?: SortOrderInput | SortOrder
    city?: SortOrderInput | SortOrder
    zone?: SortOrderInput | SortOrder
    division?: SortOrderInput | SortOrder
    ward?: SortOrderInput | SortOrder
    plant_manager?: SortOrderInput | SortOrder
    capacity_ton_per_day?: SortOrderInput | SortOrder
    vehicles_enrolled?: SortOrderInput | SortOrder
    total_waste_collected?: SortOrderInput | SortOrder
    latitude?: SortOrderInput | SortOrder
    longitude?: SortOrderInput | SortOrder
    status?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
  }

  export type plant_masterWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: plant_masterWhereInput | plant_masterWhereInput[]
    OR?: plant_masterWhereInput[]
    NOT?: plant_masterWhereInput | plant_masterWhereInput[]
    plant_name?: StringFilter<"plant_master"> | string
    plant_type?: StringNullableFilter<"plant_master"> | string | null
    city?: StringNullableFilter<"plant_master"> | string | null
    zone?: StringNullableFilter<"plant_master"> | string | null
    division?: StringNullableFilter<"plant_master"> | string | null
    ward?: StringNullableFilter<"plant_master"> | string | null
    plant_manager?: StringNullableFilter<"plant_master"> | string | null
    capacity_ton_per_day?: DecimalNullableFilter<"plant_master"> | Decimal | DecimalJsLike | number | string | null
    vehicles_enrolled?: IntNullableFilter<"plant_master"> | number | null
    total_waste_collected?: DecimalNullableFilter<"plant_master"> | Decimal | DecimalJsLike | number | string | null
    latitude?: DecimalNullableFilter<"plant_master"> | Decimal | DecimalJsLike | number | string | null
    longitude?: DecimalNullableFilter<"plant_master"> | Decimal | DecimalJsLike | number | string | null
    status?: StringNullableFilter<"plant_master"> | string | null
    created_at?: DateTimeNullableFilter<"plant_master"> | Date | string | null
  }, "id">

  export type plant_masterOrderByWithAggregationInput = {
    id?: SortOrder
    plant_name?: SortOrder
    plant_type?: SortOrderInput | SortOrder
    city?: SortOrderInput | SortOrder
    zone?: SortOrderInput | SortOrder
    division?: SortOrderInput | SortOrder
    ward?: SortOrderInput | SortOrder
    plant_manager?: SortOrderInput | SortOrder
    capacity_ton_per_day?: SortOrderInput | SortOrder
    vehicles_enrolled?: SortOrderInput | SortOrder
    total_waste_collected?: SortOrderInput | SortOrder
    latitude?: SortOrderInput | SortOrder
    longitude?: SortOrderInput | SortOrder
    status?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    _count?: plant_masterCountOrderByAggregateInput
    _avg?: plant_masterAvgOrderByAggregateInput
    _max?: plant_masterMaxOrderByAggregateInput
    _min?: plant_masterMinOrderByAggregateInput
    _sum?: plant_masterSumOrderByAggregateInput
  }

  export type plant_masterScalarWhereWithAggregatesInput = {
    AND?: plant_masterScalarWhereWithAggregatesInput | plant_masterScalarWhereWithAggregatesInput[]
    OR?: plant_masterScalarWhereWithAggregatesInput[]
    NOT?: plant_masterScalarWhereWithAggregatesInput | plant_masterScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"plant_master"> | number
    plant_name?: StringWithAggregatesFilter<"plant_master"> | string
    plant_type?: StringNullableWithAggregatesFilter<"plant_master"> | string | null
    city?: StringNullableWithAggregatesFilter<"plant_master"> | string | null
    zone?: StringNullableWithAggregatesFilter<"plant_master"> | string | null
    division?: StringNullableWithAggregatesFilter<"plant_master"> | string | null
    ward?: StringNullableWithAggregatesFilter<"plant_master"> | string | null
    plant_manager?: StringNullableWithAggregatesFilter<"plant_master"> | string | null
    capacity_ton_per_day?: DecimalNullableWithAggregatesFilter<"plant_master"> | Decimal | DecimalJsLike | number | string | null
    vehicles_enrolled?: IntNullableWithAggregatesFilter<"plant_master"> | number | null
    total_waste_collected?: DecimalNullableWithAggregatesFilter<"plant_master"> | Decimal | DecimalJsLike | number | string | null
    latitude?: DecimalNullableWithAggregatesFilter<"plant_master"> | Decimal | DecimalJsLike | number | string | null
    longitude?: DecimalNullableWithAggregatesFilter<"plant_master"> | Decimal | DecimalJsLike | number | string | null
    status?: StringNullableWithAggregatesFilter<"plant_master"> | string | null
    created_at?: DateTimeNullableWithAggregatesFilter<"plant_master"> | Date | string | null
  }

  export type edit_logsWhereInput = {
    AND?: edit_logsWhereInput | edit_logsWhereInput[]
    OR?: edit_logsWhereInput[]
    NOT?: edit_logsWhereInput | edit_logsWhereInput[]
    id?: IntFilter<"edit_logs"> | number
    performed_by?: StringFilter<"edit_logs"> | string
    role?: StringFilter<"edit_logs"> | string
    module?: StringFilter<"edit_logs"> | string
    action?: StringFilter<"edit_logs"> | string
    record_id?: StringNullableFilter<"edit_logs"> | string | null
    description?: StringNullableFilter<"edit_logs"> | string | null
    ip_address?: StringNullableFilter<"edit_logs"> | string | null
    created_at?: DateTimeNullableFilter<"edit_logs"> | Date | string | null
    performed_by_id?: IntNullableFilter<"edit_logs"> | number | null
    success?: BoolNullableFilter<"edit_logs"> | boolean | null
  }

  export type edit_logsOrderByWithRelationInput = {
    id?: SortOrder
    performed_by?: SortOrder
    role?: SortOrder
    module?: SortOrder
    action?: SortOrder
    record_id?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    ip_address?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    performed_by_id?: SortOrderInput | SortOrder
    success?: SortOrderInput | SortOrder
  }

  export type edit_logsWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: edit_logsWhereInput | edit_logsWhereInput[]
    OR?: edit_logsWhereInput[]
    NOT?: edit_logsWhereInput | edit_logsWhereInput[]
    performed_by?: StringFilter<"edit_logs"> | string
    role?: StringFilter<"edit_logs"> | string
    module?: StringFilter<"edit_logs"> | string
    action?: StringFilter<"edit_logs"> | string
    record_id?: StringNullableFilter<"edit_logs"> | string | null
    description?: StringNullableFilter<"edit_logs"> | string | null
    ip_address?: StringNullableFilter<"edit_logs"> | string | null
    created_at?: DateTimeNullableFilter<"edit_logs"> | Date | string | null
    performed_by_id?: IntNullableFilter<"edit_logs"> | number | null
    success?: BoolNullableFilter<"edit_logs"> | boolean | null
  }, "id">

  export type edit_logsOrderByWithAggregationInput = {
    id?: SortOrder
    performed_by?: SortOrder
    role?: SortOrder
    module?: SortOrder
    action?: SortOrder
    record_id?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    ip_address?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    performed_by_id?: SortOrderInput | SortOrder
    success?: SortOrderInput | SortOrder
    _count?: edit_logsCountOrderByAggregateInput
    _avg?: edit_logsAvgOrderByAggregateInput
    _max?: edit_logsMaxOrderByAggregateInput
    _min?: edit_logsMinOrderByAggregateInput
    _sum?: edit_logsSumOrderByAggregateInput
  }

  export type edit_logsScalarWhereWithAggregatesInput = {
    AND?: edit_logsScalarWhereWithAggregatesInput | edit_logsScalarWhereWithAggregatesInput[]
    OR?: edit_logsScalarWhereWithAggregatesInput[]
    NOT?: edit_logsScalarWhereWithAggregatesInput | edit_logsScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"edit_logs"> | number
    performed_by?: StringWithAggregatesFilter<"edit_logs"> | string
    role?: StringWithAggregatesFilter<"edit_logs"> | string
    module?: StringWithAggregatesFilter<"edit_logs"> | string
    action?: StringWithAggregatesFilter<"edit_logs"> | string
    record_id?: StringNullableWithAggregatesFilter<"edit_logs"> | string | null
    description?: StringNullableWithAggregatesFilter<"edit_logs"> | string | null
    ip_address?: StringNullableWithAggregatesFilter<"edit_logs"> | string | null
    created_at?: DateTimeNullableWithAggregatesFilter<"edit_logs"> | Date | string | null
    performed_by_id?: IntNullableWithAggregatesFilter<"edit_logs"> | number | null
    success?: BoolNullableWithAggregatesFilter<"edit_logs"> | boolean | null
  }

  export type citizen_complaintsWhereInput = {
    AND?: citizen_complaintsWhereInput | citizen_complaintsWhereInput[]
    OR?: citizen_complaintsWhereInput[]
    NOT?: citizen_complaintsWhereInput | citizen_complaintsWhereInput[]
    id?: IntFilter<"citizen_complaints"> | number
    ticket_number?: StringFilter<"citizen_complaints"> | string
    phone_number?: StringFilter<"citizen_complaints"> | string
    title?: StringFilter<"citizen_complaints"> | string
    description?: StringFilter<"citizen_complaints"> | string
    category?: EnumCitizenComplaintCategoryFilter<"citizen_complaints"> | $Enums.CitizenComplaintCategory
    image_url?: StringNullableFilter<"citizen_complaints"> | string | null
    latitude?: FloatFilter<"citizen_complaints"> | number
    longitude?: FloatFilter<"citizen_complaints"> | number
    address?: StringFilter<"citizen_complaints"> | string
    status?: EnumCitizenComplaintStatusFilter<"citizen_complaints"> | $Enums.CitizenComplaintStatus
    otp_hash?: StringNullableFilter<"citizen_complaints"> | string | null
    otp_expiry?: DateTimeNullableFilter<"citizen_complaints"> | Date | string | null
    otp_verified?: BoolFilter<"citizen_complaints"> | boolean
    assigned_to?: StringNullableFilter<"citizen_complaints"> | string | null
    remarks?: StringNullableFilter<"citizen_complaints"> | string | null
    created_at?: DateTimeFilter<"citizen_complaints"> | Date | string
    updated_at?: DateTimeFilter<"citizen_complaints"> | Date | string
    closed_at?: DateTimeNullableFilter<"citizen_complaints"> | Date | string | null
    verification_code?: StringNullableFilter<"citizen_complaints"> | string | null
    verification_expires_at?: DateTimeNullableFilter<"citizen_complaints"> | Date | string | null
  }

  export type citizen_complaintsOrderByWithRelationInput = {
    id?: SortOrder
    ticket_number?: SortOrder
    phone_number?: SortOrder
    title?: SortOrder
    description?: SortOrder
    category?: SortOrder
    image_url?: SortOrderInput | SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    address?: SortOrder
    status?: SortOrder
    otp_hash?: SortOrderInput | SortOrder
    otp_expiry?: SortOrderInput | SortOrder
    otp_verified?: SortOrder
    assigned_to?: SortOrderInput | SortOrder
    remarks?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    closed_at?: SortOrderInput | SortOrder
    verification_code?: SortOrderInput | SortOrder
    verification_expires_at?: SortOrderInput | SortOrder
  }

  export type citizen_complaintsWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    ticket_number?: string
    AND?: citizen_complaintsWhereInput | citizen_complaintsWhereInput[]
    OR?: citizen_complaintsWhereInput[]
    NOT?: citizen_complaintsWhereInput | citizen_complaintsWhereInput[]
    phone_number?: StringFilter<"citizen_complaints"> | string
    title?: StringFilter<"citizen_complaints"> | string
    description?: StringFilter<"citizen_complaints"> | string
    category?: EnumCitizenComplaintCategoryFilter<"citizen_complaints"> | $Enums.CitizenComplaintCategory
    image_url?: StringNullableFilter<"citizen_complaints"> | string | null
    latitude?: FloatFilter<"citizen_complaints"> | number
    longitude?: FloatFilter<"citizen_complaints"> | number
    address?: StringFilter<"citizen_complaints"> | string
    status?: EnumCitizenComplaintStatusFilter<"citizen_complaints"> | $Enums.CitizenComplaintStatus
    otp_hash?: StringNullableFilter<"citizen_complaints"> | string | null
    otp_expiry?: DateTimeNullableFilter<"citizen_complaints"> | Date | string | null
    otp_verified?: BoolFilter<"citizen_complaints"> | boolean
    assigned_to?: StringNullableFilter<"citizen_complaints"> | string | null
    remarks?: StringNullableFilter<"citizen_complaints"> | string | null
    created_at?: DateTimeFilter<"citizen_complaints"> | Date | string
    updated_at?: DateTimeFilter<"citizen_complaints"> | Date | string
    closed_at?: DateTimeNullableFilter<"citizen_complaints"> | Date | string | null
    verification_code?: StringNullableFilter<"citizen_complaints"> | string | null
    verification_expires_at?: DateTimeNullableFilter<"citizen_complaints"> | Date | string | null
  }, "id" | "ticket_number">

  export type citizen_complaintsOrderByWithAggregationInput = {
    id?: SortOrder
    ticket_number?: SortOrder
    phone_number?: SortOrder
    title?: SortOrder
    description?: SortOrder
    category?: SortOrder
    image_url?: SortOrderInput | SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    address?: SortOrder
    status?: SortOrder
    otp_hash?: SortOrderInput | SortOrder
    otp_expiry?: SortOrderInput | SortOrder
    otp_verified?: SortOrder
    assigned_to?: SortOrderInput | SortOrder
    remarks?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    closed_at?: SortOrderInput | SortOrder
    verification_code?: SortOrderInput | SortOrder
    verification_expires_at?: SortOrderInput | SortOrder
    _count?: citizen_complaintsCountOrderByAggregateInput
    _avg?: citizen_complaintsAvgOrderByAggregateInput
    _max?: citizen_complaintsMaxOrderByAggregateInput
    _min?: citizen_complaintsMinOrderByAggregateInput
    _sum?: citizen_complaintsSumOrderByAggregateInput
  }

  export type citizen_complaintsScalarWhereWithAggregatesInput = {
    AND?: citizen_complaintsScalarWhereWithAggregatesInput | citizen_complaintsScalarWhereWithAggregatesInput[]
    OR?: citizen_complaintsScalarWhereWithAggregatesInput[]
    NOT?: citizen_complaintsScalarWhereWithAggregatesInput | citizen_complaintsScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"citizen_complaints"> | number
    ticket_number?: StringWithAggregatesFilter<"citizen_complaints"> | string
    phone_number?: StringWithAggregatesFilter<"citizen_complaints"> | string
    title?: StringWithAggregatesFilter<"citizen_complaints"> | string
    description?: StringWithAggregatesFilter<"citizen_complaints"> | string
    category?: EnumCitizenComplaintCategoryWithAggregatesFilter<"citizen_complaints"> | $Enums.CitizenComplaintCategory
    image_url?: StringNullableWithAggregatesFilter<"citizen_complaints"> | string | null
    latitude?: FloatWithAggregatesFilter<"citizen_complaints"> | number
    longitude?: FloatWithAggregatesFilter<"citizen_complaints"> | number
    address?: StringWithAggregatesFilter<"citizen_complaints"> | string
    status?: EnumCitizenComplaintStatusWithAggregatesFilter<"citizen_complaints"> | $Enums.CitizenComplaintStatus
    otp_hash?: StringNullableWithAggregatesFilter<"citizen_complaints"> | string | null
    otp_expiry?: DateTimeNullableWithAggregatesFilter<"citizen_complaints"> | Date | string | null
    otp_verified?: BoolWithAggregatesFilter<"citizen_complaints"> | boolean
    assigned_to?: StringNullableWithAggregatesFilter<"citizen_complaints"> | string | null
    remarks?: StringNullableWithAggregatesFilter<"citizen_complaints"> | string | null
    created_at?: DateTimeWithAggregatesFilter<"citizen_complaints"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"citizen_complaints"> | Date | string
    closed_at?: DateTimeNullableWithAggregatesFilter<"citizen_complaints"> | Date | string | null
    verification_code?: StringNullableWithAggregatesFilter<"citizen_complaints"> | string | null
    verification_expires_at?: DateTimeNullableWithAggregatesFilter<"citizen_complaints"> | Date | string | null
  }

  export type telemetry_logsCreateInput = {
    iot_timestamp: Date | string
    received_at?: Date | string
    rfid_epc: string
    citizen_id?: number | null
    waste_type?: string | null
    latitude?: Decimal | DecimalJsLike | number | string | null
    longitude?: Decimal | DecimalJsLike | number | string | null
    wet_weight_kg?: Decimal | DecimalJsLike | number | string | null
    dry_weight_kg?: Decimal | DecimalJsLike | number | string | null
    other_weight_kg?: Decimal | DecimalJsLike | number | string | null
    cumulative_weight_kg?: Decimal | DecimalJsLike | number | string | null
    driver_name?: string | null
    vehicle_id?: string | null
    firmware_version?: string | null
    unit_number?: string | null
    collection_type?: string | null
    remarks?: string | null
    err_code?: string | null
    citizen_contact?: string | null
    driver_action?: number
  }

  export type telemetry_logsUncheckedCreateInput = {
    id?: number
    iot_timestamp: Date | string
    received_at?: Date | string
    rfid_epc: string
    citizen_id?: number | null
    waste_type?: string | null
    latitude?: Decimal | DecimalJsLike | number | string | null
    longitude?: Decimal | DecimalJsLike | number | string | null
    wet_weight_kg?: Decimal | DecimalJsLike | number | string | null
    dry_weight_kg?: Decimal | DecimalJsLike | number | string | null
    other_weight_kg?: Decimal | DecimalJsLike | number | string | null
    cumulative_weight_kg?: Decimal | DecimalJsLike | number | string | null
    driver_name?: string | null
    vehicle_id?: string | null
    firmware_version?: string | null
    unit_number?: string | null
    collection_type?: string | null
    remarks?: string | null
    err_code?: string | null
    citizen_contact?: string | null
    driver_action?: number
  }

  export type telemetry_logsUpdateInput = {
    iot_timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    received_at?: DateTimeFieldUpdateOperationsInput | Date | string
    rfid_epc?: StringFieldUpdateOperationsInput | string
    citizen_id?: NullableIntFieldUpdateOperationsInput | number | null
    waste_type?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    longitude?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    wet_weight_kg?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    dry_weight_kg?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    other_weight_kg?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    cumulative_weight_kg?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    driver_name?: NullableStringFieldUpdateOperationsInput | string | null
    vehicle_id?: NullableStringFieldUpdateOperationsInput | string | null
    firmware_version?: NullableStringFieldUpdateOperationsInput | string | null
    unit_number?: NullableStringFieldUpdateOperationsInput | string | null
    collection_type?: NullableStringFieldUpdateOperationsInput | string | null
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    err_code?: NullableStringFieldUpdateOperationsInput | string | null
    citizen_contact?: NullableStringFieldUpdateOperationsInput | string | null
    driver_action?: IntFieldUpdateOperationsInput | number
  }

  export type telemetry_logsUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    iot_timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    received_at?: DateTimeFieldUpdateOperationsInput | Date | string
    rfid_epc?: StringFieldUpdateOperationsInput | string
    citizen_id?: NullableIntFieldUpdateOperationsInput | number | null
    waste_type?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    longitude?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    wet_weight_kg?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    dry_weight_kg?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    other_weight_kg?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    cumulative_weight_kg?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    driver_name?: NullableStringFieldUpdateOperationsInput | string | null
    vehicle_id?: NullableStringFieldUpdateOperationsInput | string | null
    firmware_version?: NullableStringFieldUpdateOperationsInput | string | null
    unit_number?: NullableStringFieldUpdateOperationsInput | string | null
    collection_type?: NullableStringFieldUpdateOperationsInput | string | null
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    err_code?: NullableStringFieldUpdateOperationsInput | string | null
    citizen_contact?: NullableStringFieldUpdateOperationsInput | string | null
    driver_action?: IntFieldUpdateOperationsInput | number
  }

  export type telemetry_logsCreateManyInput = {
    id?: number
    iot_timestamp: Date | string
    received_at?: Date | string
    rfid_epc: string
    citizen_id?: number | null
    waste_type?: string | null
    latitude?: Decimal | DecimalJsLike | number | string | null
    longitude?: Decimal | DecimalJsLike | number | string | null
    wet_weight_kg?: Decimal | DecimalJsLike | number | string | null
    dry_weight_kg?: Decimal | DecimalJsLike | number | string | null
    other_weight_kg?: Decimal | DecimalJsLike | number | string | null
    cumulative_weight_kg?: Decimal | DecimalJsLike | number | string | null
    driver_name?: string | null
    vehicle_id?: string | null
    firmware_version?: string | null
    unit_number?: string | null
    collection_type?: string | null
    remarks?: string | null
    err_code?: string | null
    citizen_contact?: string | null
    driver_action?: number
  }

  export type telemetry_logsUpdateManyMutationInput = {
    iot_timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    received_at?: DateTimeFieldUpdateOperationsInput | Date | string
    rfid_epc?: StringFieldUpdateOperationsInput | string
    citizen_id?: NullableIntFieldUpdateOperationsInput | number | null
    waste_type?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    longitude?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    wet_weight_kg?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    dry_weight_kg?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    other_weight_kg?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    cumulative_weight_kg?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    driver_name?: NullableStringFieldUpdateOperationsInput | string | null
    vehicle_id?: NullableStringFieldUpdateOperationsInput | string | null
    firmware_version?: NullableStringFieldUpdateOperationsInput | string | null
    unit_number?: NullableStringFieldUpdateOperationsInput | string | null
    collection_type?: NullableStringFieldUpdateOperationsInput | string | null
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    err_code?: NullableStringFieldUpdateOperationsInput | string | null
    citizen_contact?: NullableStringFieldUpdateOperationsInput | string | null
    driver_action?: IntFieldUpdateOperationsInput | number
  }

  export type telemetry_logsUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    iot_timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    received_at?: DateTimeFieldUpdateOperationsInput | Date | string
    rfid_epc?: StringFieldUpdateOperationsInput | string
    citizen_id?: NullableIntFieldUpdateOperationsInput | number | null
    waste_type?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    longitude?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    wet_weight_kg?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    dry_weight_kg?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    other_weight_kg?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    cumulative_weight_kg?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    driver_name?: NullableStringFieldUpdateOperationsInput | string | null
    vehicle_id?: NullableStringFieldUpdateOperationsInput | string | null
    firmware_version?: NullableStringFieldUpdateOperationsInput | string | null
    unit_number?: NullableStringFieldUpdateOperationsInput | string | null
    collection_type?: NullableStringFieldUpdateOperationsInput | string | null
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    err_code?: NullableStringFieldUpdateOperationsInput | string | null
    citizen_contact?: NullableStringFieldUpdateOperationsInput | string | null
    driver_action?: IntFieldUpdateOperationsInput | number
  }

  export type vehicle_incidentsCreateInput = {
    date_time?: Date | string | null
    main_road?: string | null
    cross_road?: string | null
    speed_flagged_kmh?: Decimal | DecimalJsLike | number | string | null
    speed_limit_kmh?: Decimal | DecimalJsLike | number | string | null
    excess_speed_kmh?: Decimal | DecimalJsLike | number | string | null
    status?: string | null
    vehicle_master?: vehicle_masterCreateNestedOneWithoutVehicle_incidentsInput
  }

  export type vehicle_incidentsUncheckedCreateInput = {
    id?: number
    vehicle_id?: string | null
    date_time?: Date | string | null
    main_road?: string | null
    cross_road?: string | null
    speed_flagged_kmh?: Decimal | DecimalJsLike | number | string | null
    speed_limit_kmh?: Decimal | DecimalJsLike | number | string | null
    excess_speed_kmh?: Decimal | DecimalJsLike | number | string | null
    status?: string | null
  }

  export type vehicle_incidentsUpdateInput = {
    date_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    main_road?: NullableStringFieldUpdateOperationsInput | string | null
    cross_road?: NullableStringFieldUpdateOperationsInput | string | null
    speed_flagged_kmh?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    speed_limit_kmh?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    excess_speed_kmh?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    vehicle_master?: vehicle_masterUpdateOneWithoutVehicle_incidentsNestedInput
  }

  export type vehicle_incidentsUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    vehicle_id?: NullableStringFieldUpdateOperationsInput | string | null
    date_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    main_road?: NullableStringFieldUpdateOperationsInput | string | null
    cross_road?: NullableStringFieldUpdateOperationsInput | string | null
    speed_flagged_kmh?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    speed_limit_kmh?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    excess_speed_kmh?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type vehicle_incidentsCreateManyInput = {
    id?: number
    vehicle_id?: string | null
    date_time?: Date | string | null
    main_road?: string | null
    cross_road?: string | null
    speed_flagged_kmh?: Decimal | DecimalJsLike | number | string | null
    speed_limit_kmh?: Decimal | DecimalJsLike | number | string | null
    excess_speed_kmh?: Decimal | DecimalJsLike | number | string | null
    status?: string | null
  }

  export type vehicle_incidentsUpdateManyMutationInput = {
    date_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    main_road?: NullableStringFieldUpdateOperationsInput | string | null
    cross_road?: NullableStringFieldUpdateOperationsInput | string | null
    speed_flagged_kmh?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    speed_limit_kmh?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    excess_speed_kmh?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type vehicle_incidentsUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    vehicle_id?: NullableStringFieldUpdateOperationsInput | string | null
    date_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    main_road?: NullableStringFieldUpdateOperationsInput | string | null
    cross_road?: NullableStringFieldUpdateOperationsInput | string | null
    speed_flagged_kmh?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    speed_limit_kmh?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    excess_speed_kmh?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type vehicle_masterCreateInput = {
    vehicle_id: string
    vehicle_type?: string | null
    city?: string | null
    zone?: string | null
    division?: string | null
    ward?: string | null
    status?: string | null
    created_at?: Date | string | null
    vehicle_incidents?: vehicle_incidentsCreateNestedManyWithoutVehicle_masterInput
    vehicle_telemetry?: vehicle_telemetryCreateNestedManyWithoutVehicle_masterInput
  }

  export type vehicle_masterUncheckedCreateInput = {
    id?: number
    vehicle_id: string
    vehicle_type?: string | null
    city?: string | null
    zone?: string | null
    division?: string | null
    ward?: string | null
    status?: string | null
    created_at?: Date | string | null
    vehicle_incidents?: vehicle_incidentsUncheckedCreateNestedManyWithoutVehicle_masterInput
    vehicle_telemetry?: vehicle_telemetryUncheckedCreateNestedManyWithoutVehicle_masterInput
  }

  export type vehicle_masterUpdateInput = {
    vehicle_id?: StringFieldUpdateOperationsInput | string
    vehicle_type?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    zone?: NullableStringFieldUpdateOperationsInput | string | null
    division?: NullableStringFieldUpdateOperationsInput | string | null
    ward?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    vehicle_incidents?: vehicle_incidentsUpdateManyWithoutVehicle_masterNestedInput
    vehicle_telemetry?: vehicle_telemetryUpdateManyWithoutVehicle_masterNestedInput
  }

  export type vehicle_masterUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    vehicle_id?: StringFieldUpdateOperationsInput | string
    vehicle_type?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    zone?: NullableStringFieldUpdateOperationsInput | string | null
    division?: NullableStringFieldUpdateOperationsInput | string | null
    ward?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    vehicle_incidents?: vehicle_incidentsUncheckedUpdateManyWithoutVehicle_masterNestedInput
    vehicle_telemetry?: vehicle_telemetryUncheckedUpdateManyWithoutVehicle_masterNestedInput
  }

  export type vehicle_masterCreateManyInput = {
    id?: number
    vehicle_id: string
    vehicle_type?: string | null
    city?: string | null
    zone?: string | null
    division?: string | null
    ward?: string | null
    status?: string | null
    created_at?: Date | string | null
  }

  export type vehicle_masterUpdateManyMutationInput = {
    vehicle_id?: StringFieldUpdateOperationsInput | string
    vehicle_type?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    zone?: NullableStringFieldUpdateOperationsInput | string | null
    division?: NullableStringFieldUpdateOperationsInput | string | null
    ward?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type vehicle_masterUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    vehicle_id?: StringFieldUpdateOperationsInput | string
    vehicle_type?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    zone?: NullableStringFieldUpdateOperationsInput | string | null
    division?: NullableStringFieldUpdateOperationsInput | string | null
    ward?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type vehicle_telemetryCreateInput = {
    latitude?: Decimal | DecimalJsLike | number | string | null
    longitude?: Decimal | DecimalJsLike | number | string | null
    speed_kmh?: Decimal | DecimalJsLike | number | string | null
    fuel_level?: Decimal | DecimalJsLike | number | string | null
    battery_health?: Decimal | DecimalJsLike | number | string | null
    engine_status?: string | null
    recorded_at?: Date | string | null
    vehicle_master?: vehicle_masterCreateNestedOneWithoutVehicle_telemetryInput
  }

  export type vehicle_telemetryUncheckedCreateInput = {
    id?: number
    vehicle_id?: string | null
    latitude?: Decimal | DecimalJsLike | number | string | null
    longitude?: Decimal | DecimalJsLike | number | string | null
    speed_kmh?: Decimal | DecimalJsLike | number | string | null
    fuel_level?: Decimal | DecimalJsLike | number | string | null
    battery_health?: Decimal | DecimalJsLike | number | string | null
    engine_status?: string | null
    recorded_at?: Date | string | null
  }

  export type vehicle_telemetryUpdateInput = {
    latitude?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    longitude?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    speed_kmh?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    fuel_level?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    battery_health?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    engine_status?: NullableStringFieldUpdateOperationsInput | string | null
    recorded_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    vehicle_master?: vehicle_masterUpdateOneWithoutVehicle_telemetryNestedInput
  }

  export type vehicle_telemetryUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    vehicle_id?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    longitude?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    speed_kmh?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    fuel_level?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    battery_health?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    engine_status?: NullableStringFieldUpdateOperationsInput | string | null
    recorded_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type vehicle_telemetryCreateManyInput = {
    id?: number
    vehicle_id?: string | null
    latitude?: Decimal | DecimalJsLike | number | string | null
    longitude?: Decimal | DecimalJsLike | number | string | null
    speed_kmh?: Decimal | DecimalJsLike | number | string | null
    fuel_level?: Decimal | DecimalJsLike | number | string | null
    battery_health?: Decimal | DecimalJsLike | number | string | null
    engine_status?: string | null
    recorded_at?: Date | string | null
  }

  export type vehicle_telemetryUpdateManyMutationInput = {
    latitude?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    longitude?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    speed_kmh?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    fuel_level?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    battery_health?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    engine_status?: NullableStringFieldUpdateOperationsInput | string | null
    recorded_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type vehicle_telemetryUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    vehicle_id?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    longitude?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    speed_kmh?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    fuel_level?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    battery_health?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    engine_status?: NullableStringFieldUpdateOperationsInput | string | null
    recorded_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type plant_masterCreateInput = {
    plant_name: string
    plant_type?: string | null
    city?: string | null
    zone?: string | null
    division?: string | null
    ward?: string | null
    plant_manager?: string | null
    capacity_ton_per_day?: Decimal | DecimalJsLike | number | string | null
    vehicles_enrolled?: number | null
    total_waste_collected?: Decimal | DecimalJsLike | number | string | null
    latitude?: Decimal | DecimalJsLike | number | string | null
    longitude?: Decimal | DecimalJsLike | number | string | null
    status?: string | null
    created_at?: Date | string | null
  }

  export type plant_masterUncheckedCreateInput = {
    id?: number
    plant_name: string
    plant_type?: string | null
    city?: string | null
    zone?: string | null
    division?: string | null
    ward?: string | null
    plant_manager?: string | null
    capacity_ton_per_day?: Decimal | DecimalJsLike | number | string | null
    vehicles_enrolled?: number | null
    total_waste_collected?: Decimal | DecimalJsLike | number | string | null
    latitude?: Decimal | DecimalJsLike | number | string | null
    longitude?: Decimal | DecimalJsLike | number | string | null
    status?: string | null
    created_at?: Date | string | null
  }

  export type plant_masterUpdateInput = {
    plant_name?: StringFieldUpdateOperationsInput | string
    plant_type?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    zone?: NullableStringFieldUpdateOperationsInput | string | null
    division?: NullableStringFieldUpdateOperationsInput | string | null
    ward?: NullableStringFieldUpdateOperationsInput | string | null
    plant_manager?: NullableStringFieldUpdateOperationsInput | string | null
    capacity_ton_per_day?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    vehicles_enrolled?: NullableIntFieldUpdateOperationsInput | number | null
    total_waste_collected?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    latitude?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    longitude?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type plant_masterUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    plant_name?: StringFieldUpdateOperationsInput | string
    plant_type?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    zone?: NullableStringFieldUpdateOperationsInput | string | null
    division?: NullableStringFieldUpdateOperationsInput | string | null
    ward?: NullableStringFieldUpdateOperationsInput | string | null
    plant_manager?: NullableStringFieldUpdateOperationsInput | string | null
    capacity_ton_per_day?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    vehicles_enrolled?: NullableIntFieldUpdateOperationsInput | number | null
    total_waste_collected?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    latitude?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    longitude?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type plant_masterCreateManyInput = {
    id?: number
    plant_name: string
    plant_type?: string | null
    city?: string | null
    zone?: string | null
    division?: string | null
    ward?: string | null
    plant_manager?: string | null
    capacity_ton_per_day?: Decimal | DecimalJsLike | number | string | null
    vehicles_enrolled?: number | null
    total_waste_collected?: Decimal | DecimalJsLike | number | string | null
    latitude?: Decimal | DecimalJsLike | number | string | null
    longitude?: Decimal | DecimalJsLike | number | string | null
    status?: string | null
    created_at?: Date | string | null
  }

  export type plant_masterUpdateManyMutationInput = {
    plant_name?: StringFieldUpdateOperationsInput | string
    plant_type?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    zone?: NullableStringFieldUpdateOperationsInput | string | null
    division?: NullableStringFieldUpdateOperationsInput | string | null
    ward?: NullableStringFieldUpdateOperationsInput | string | null
    plant_manager?: NullableStringFieldUpdateOperationsInput | string | null
    capacity_ton_per_day?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    vehicles_enrolled?: NullableIntFieldUpdateOperationsInput | number | null
    total_waste_collected?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    latitude?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    longitude?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type plant_masterUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    plant_name?: StringFieldUpdateOperationsInput | string
    plant_type?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    zone?: NullableStringFieldUpdateOperationsInput | string | null
    division?: NullableStringFieldUpdateOperationsInput | string | null
    ward?: NullableStringFieldUpdateOperationsInput | string | null
    plant_manager?: NullableStringFieldUpdateOperationsInput | string | null
    capacity_ton_per_day?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    vehicles_enrolled?: NullableIntFieldUpdateOperationsInput | number | null
    total_waste_collected?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    latitude?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    longitude?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type edit_logsCreateInput = {
    performed_by: string
    role: string
    module: string
    action: string
    record_id?: string | null
    description?: string | null
    ip_address?: string | null
    created_at?: Date | string | null
    performed_by_id?: number | null
    success?: boolean | null
  }

  export type edit_logsUncheckedCreateInput = {
    id?: number
    performed_by: string
    role: string
    module: string
    action: string
    record_id?: string | null
    description?: string | null
    ip_address?: string | null
    created_at?: Date | string | null
    performed_by_id?: number | null
    success?: boolean | null
  }

  export type edit_logsUpdateInput = {
    performed_by?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    module?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    record_id?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    ip_address?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    performed_by_id?: NullableIntFieldUpdateOperationsInput | number | null
    success?: NullableBoolFieldUpdateOperationsInput | boolean | null
  }

  export type edit_logsUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    performed_by?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    module?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    record_id?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    ip_address?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    performed_by_id?: NullableIntFieldUpdateOperationsInput | number | null
    success?: NullableBoolFieldUpdateOperationsInput | boolean | null
  }

  export type edit_logsCreateManyInput = {
    id?: number
    performed_by: string
    role: string
    module: string
    action: string
    record_id?: string | null
    description?: string | null
    ip_address?: string | null
    created_at?: Date | string | null
    performed_by_id?: number | null
    success?: boolean | null
  }

  export type edit_logsUpdateManyMutationInput = {
    performed_by?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    module?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    record_id?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    ip_address?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    performed_by_id?: NullableIntFieldUpdateOperationsInput | number | null
    success?: NullableBoolFieldUpdateOperationsInput | boolean | null
  }

  export type edit_logsUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    performed_by?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    module?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    record_id?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    ip_address?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    performed_by_id?: NullableIntFieldUpdateOperationsInput | number | null
    success?: NullableBoolFieldUpdateOperationsInput | boolean | null
  }

  export type citizen_complaintsCreateInput = {
    ticket_number: string
    phone_number: string
    title: string
    description: string
    category: $Enums.CitizenComplaintCategory
    image_url?: string | null
    latitude: number
    longitude: number
    address: string
    status?: $Enums.CitizenComplaintStatus
    otp_hash?: string | null
    otp_expiry?: Date | string | null
    otp_verified?: boolean
    assigned_to?: string | null
    remarks?: string | null
    created_at?: Date | string
    updated_at: Date | string
    closed_at?: Date | string | null
    verification_code?: string | null
    verification_expires_at?: Date | string | null
  }

  export type citizen_complaintsUncheckedCreateInput = {
    id?: number
    ticket_number: string
    phone_number: string
    title: string
    description: string
    category: $Enums.CitizenComplaintCategory
    image_url?: string | null
    latitude: number
    longitude: number
    address: string
    status?: $Enums.CitizenComplaintStatus
    otp_hash?: string | null
    otp_expiry?: Date | string | null
    otp_verified?: boolean
    assigned_to?: string | null
    remarks?: string | null
    created_at?: Date | string
    updated_at: Date | string
    closed_at?: Date | string | null
    verification_code?: string | null
    verification_expires_at?: Date | string | null
  }

  export type citizen_complaintsUpdateInput = {
    ticket_number?: StringFieldUpdateOperationsInput | string
    phone_number?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    category?: EnumCitizenComplaintCategoryFieldUpdateOperationsInput | $Enums.CitizenComplaintCategory
    image_url?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    address?: StringFieldUpdateOperationsInput | string
    status?: EnumCitizenComplaintStatusFieldUpdateOperationsInput | $Enums.CitizenComplaintStatus
    otp_hash?: NullableStringFieldUpdateOperationsInput | string | null
    otp_expiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    otp_verified?: BoolFieldUpdateOperationsInput | boolean
    assigned_to?: NullableStringFieldUpdateOperationsInput | string | null
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    closed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    verification_code?: NullableStringFieldUpdateOperationsInput | string | null
    verification_expires_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type citizen_complaintsUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    ticket_number?: StringFieldUpdateOperationsInput | string
    phone_number?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    category?: EnumCitizenComplaintCategoryFieldUpdateOperationsInput | $Enums.CitizenComplaintCategory
    image_url?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    address?: StringFieldUpdateOperationsInput | string
    status?: EnumCitizenComplaintStatusFieldUpdateOperationsInput | $Enums.CitizenComplaintStatus
    otp_hash?: NullableStringFieldUpdateOperationsInput | string | null
    otp_expiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    otp_verified?: BoolFieldUpdateOperationsInput | boolean
    assigned_to?: NullableStringFieldUpdateOperationsInput | string | null
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    closed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    verification_code?: NullableStringFieldUpdateOperationsInput | string | null
    verification_expires_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type citizen_complaintsCreateManyInput = {
    id?: number
    ticket_number: string
    phone_number: string
    title: string
    description: string
    category: $Enums.CitizenComplaintCategory
    image_url?: string | null
    latitude: number
    longitude: number
    address: string
    status?: $Enums.CitizenComplaintStatus
    otp_hash?: string | null
    otp_expiry?: Date | string | null
    otp_verified?: boolean
    assigned_to?: string | null
    remarks?: string | null
    created_at?: Date | string
    updated_at: Date | string
    closed_at?: Date | string | null
    verification_code?: string | null
    verification_expires_at?: Date | string | null
  }

  export type citizen_complaintsUpdateManyMutationInput = {
    ticket_number?: StringFieldUpdateOperationsInput | string
    phone_number?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    category?: EnumCitizenComplaintCategoryFieldUpdateOperationsInput | $Enums.CitizenComplaintCategory
    image_url?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    address?: StringFieldUpdateOperationsInput | string
    status?: EnumCitizenComplaintStatusFieldUpdateOperationsInput | $Enums.CitizenComplaintStatus
    otp_hash?: NullableStringFieldUpdateOperationsInput | string | null
    otp_expiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    otp_verified?: BoolFieldUpdateOperationsInput | boolean
    assigned_to?: NullableStringFieldUpdateOperationsInput | string | null
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    closed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    verification_code?: NullableStringFieldUpdateOperationsInput | string | null
    verification_expires_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type citizen_complaintsUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    ticket_number?: StringFieldUpdateOperationsInput | string
    phone_number?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    category?: EnumCitizenComplaintCategoryFieldUpdateOperationsInput | $Enums.CitizenComplaintCategory
    image_url?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    address?: StringFieldUpdateOperationsInput | string
    status?: EnumCitizenComplaintStatusFieldUpdateOperationsInput | $Enums.CitizenComplaintStatus
    otp_hash?: NullableStringFieldUpdateOperationsInput | string | null
    otp_expiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    otp_verified?: BoolFieldUpdateOperationsInput | boolean
    assigned_to?: NullableStringFieldUpdateOperationsInput | string | null
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    closed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    verification_code?: NullableStringFieldUpdateOperationsInput | string | null
    verification_expires_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
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

  export type telemetry_logsCountOrderByAggregateInput = {
    id?: SortOrder
    iot_timestamp?: SortOrder
    received_at?: SortOrder
    rfid_epc?: SortOrder
    citizen_id?: SortOrder
    waste_type?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    wet_weight_kg?: SortOrder
    dry_weight_kg?: SortOrder
    other_weight_kg?: SortOrder
    cumulative_weight_kg?: SortOrder
    driver_name?: SortOrder
    vehicle_id?: SortOrder
    firmware_version?: SortOrder
    unit_number?: SortOrder
    collection_type?: SortOrder
    remarks?: SortOrder
    err_code?: SortOrder
    citizen_contact?: SortOrder
    driver_action?: SortOrder
  }

  export type telemetry_logsAvgOrderByAggregateInput = {
    id?: SortOrder
    citizen_id?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    wet_weight_kg?: SortOrder
    dry_weight_kg?: SortOrder
    other_weight_kg?: SortOrder
    cumulative_weight_kg?: SortOrder
    driver_action?: SortOrder
  }

  export type telemetry_logsMaxOrderByAggregateInput = {
    id?: SortOrder
    iot_timestamp?: SortOrder
    received_at?: SortOrder
    rfid_epc?: SortOrder
    citizen_id?: SortOrder
    waste_type?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    wet_weight_kg?: SortOrder
    dry_weight_kg?: SortOrder
    other_weight_kg?: SortOrder
    cumulative_weight_kg?: SortOrder
    driver_name?: SortOrder
    vehicle_id?: SortOrder
    firmware_version?: SortOrder
    unit_number?: SortOrder
    collection_type?: SortOrder
    remarks?: SortOrder
    err_code?: SortOrder
    citizen_contact?: SortOrder
    driver_action?: SortOrder
  }

  export type telemetry_logsMinOrderByAggregateInput = {
    id?: SortOrder
    iot_timestamp?: SortOrder
    received_at?: SortOrder
    rfid_epc?: SortOrder
    citizen_id?: SortOrder
    waste_type?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    wet_weight_kg?: SortOrder
    dry_weight_kg?: SortOrder
    other_weight_kg?: SortOrder
    cumulative_weight_kg?: SortOrder
    driver_name?: SortOrder
    vehicle_id?: SortOrder
    firmware_version?: SortOrder
    unit_number?: SortOrder
    collection_type?: SortOrder
    remarks?: SortOrder
    err_code?: SortOrder
    citizen_contact?: SortOrder
    driver_action?: SortOrder
  }

  export type telemetry_logsSumOrderByAggregateInput = {
    id?: SortOrder
    citizen_id?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    wet_weight_kg?: SortOrder
    dry_weight_kg?: SortOrder
    other_weight_kg?: SortOrder
    cumulative_weight_kg?: SortOrder
    driver_action?: SortOrder
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

  export type Vehicle_masterNullableScalarRelationFilter = {
    is?: vehicle_masterWhereInput | null
    isNot?: vehicle_masterWhereInput | null
  }

  export type vehicle_incidentsCountOrderByAggregateInput = {
    id?: SortOrder
    vehicle_id?: SortOrder
    date_time?: SortOrder
    main_road?: SortOrder
    cross_road?: SortOrder
    speed_flagged_kmh?: SortOrder
    speed_limit_kmh?: SortOrder
    excess_speed_kmh?: SortOrder
    status?: SortOrder
  }

  export type vehicle_incidentsAvgOrderByAggregateInput = {
    id?: SortOrder
    speed_flagged_kmh?: SortOrder
    speed_limit_kmh?: SortOrder
    excess_speed_kmh?: SortOrder
  }

  export type vehicle_incidentsMaxOrderByAggregateInput = {
    id?: SortOrder
    vehicle_id?: SortOrder
    date_time?: SortOrder
    main_road?: SortOrder
    cross_road?: SortOrder
    speed_flagged_kmh?: SortOrder
    speed_limit_kmh?: SortOrder
    excess_speed_kmh?: SortOrder
    status?: SortOrder
  }

  export type vehicle_incidentsMinOrderByAggregateInput = {
    id?: SortOrder
    vehicle_id?: SortOrder
    date_time?: SortOrder
    main_road?: SortOrder
    cross_road?: SortOrder
    speed_flagged_kmh?: SortOrder
    speed_limit_kmh?: SortOrder
    excess_speed_kmh?: SortOrder
    status?: SortOrder
  }

  export type vehicle_incidentsSumOrderByAggregateInput = {
    id?: SortOrder
    speed_flagged_kmh?: SortOrder
    speed_limit_kmh?: SortOrder
    excess_speed_kmh?: SortOrder
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

  export type Vehicle_incidentsListRelationFilter = {
    every?: vehicle_incidentsWhereInput
    some?: vehicle_incidentsWhereInput
    none?: vehicle_incidentsWhereInput
  }

  export type Vehicle_telemetryListRelationFilter = {
    every?: vehicle_telemetryWhereInput
    some?: vehicle_telemetryWhereInput
    none?: vehicle_telemetryWhereInput
  }

  export type vehicle_incidentsOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type vehicle_telemetryOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type vehicle_masterCountOrderByAggregateInput = {
    id?: SortOrder
    vehicle_id?: SortOrder
    vehicle_type?: SortOrder
    city?: SortOrder
    zone?: SortOrder
    division?: SortOrder
    ward?: SortOrder
    status?: SortOrder
    created_at?: SortOrder
  }

  export type vehicle_masterAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type vehicle_masterMaxOrderByAggregateInput = {
    id?: SortOrder
    vehicle_id?: SortOrder
    vehicle_type?: SortOrder
    city?: SortOrder
    zone?: SortOrder
    division?: SortOrder
    ward?: SortOrder
    status?: SortOrder
    created_at?: SortOrder
  }

  export type vehicle_masterMinOrderByAggregateInput = {
    id?: SortOrder
    vehicle_id?: SortOrder
    vehicle_type?: SortOrder
    city?: SortOrder
    zone?: SortOrder
    division?: SortOrder
    ward?: SortOrder
    status?: SortOrder
    created_at?: SortOrder
  }

  export type vehicle_masterSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type vehicle_telemetryCountOrderByAggregateInput = {
    id?: SortOrder
    vehicle_id?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    speed_kmh?: SortOrder
    fuel_level?: SortOrder
    battery_health?: SortOrder
    engine_status?: SortOrder
    recorded_at?: SortOrder
  }

  export type vehicle_telemetryAvgOrderByAggregateInput = {
    id?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    speed_kmh?: SortOrder
    fuel_level?: SortOrder
    battery_health?: SortOrder
  }

  export type vehicle_telemetryMaxOrderByAggregateInput = {
    id?: SortOrder
    vehicle_id?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    speed_kmh?: SortOrder
    fuel_level?: SortOrder
    battery_health?: SortOrder
    engine_status?: SortOrder
    recorded_at?: SortOrder
  }

  export type vehicle_telemetryMinOrderByAggregateInput = {
    id?: SortOrder
    vehicle_id?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    speed_kmh?: SortOrder
    fuel_level?: SortOrder
    battery_health?: SortOrder
    engine_status?: SortOrder
    recorded_at?: SortOrder
  }

  export type vehicle_telemetrySumOrderByAggregateInput = {
    id?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    speed_kmh?: SortOrder
    fuel_level?: SortOrder
    battery_health?: SortOrder
  }

  export type plant_masterCountOrderByAggregateInput = {
    id?: SortOrder
    plant_name?: SortOrder
    plant_type?: SortOrder
    city?: SortOrder
    zone?: SortOrder
    division?: SortOrder
    ward?: SortOrder
    plant_manager?: SortOrder
    capacity_ton_per_day?: SortOrder
    vehicles_enrolled?: SortOrder
    total_waste_collected?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    status?: SortOrder
    created_at?: SortOrder
  }

  export type plant_masterAvgOrderByAggregateInput = {
    id?: SortOrder
    capacity_ton_per_day?: SortOrder
    vehicles_enrolled?: SortOrder
    total_waste_collected?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
  }

  export type plant_masterMaxOrderByAggregateInput = {
    id?: SortOrder
    plant_name?: SortOrder
    plant_type?: SortOrder
    city?: SortOrder
    zone?: SortOrder
    division?: SortOrder
    ward?: SortOrder
    plant_manager?: SortOrder
    capacity_ton_per_day?: SortOrder
    vehicles_enrolled?: SortOrder
    total_waste_collected?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    status?: SortOrder
    created_at?: SortOrder
  }

  export type plant_masterMinOrderByAggregateInput = {
    id?: SortOrder
    plant_name?: SortOrder
    plant_type?: SortOrder
    city?: SortOrder
    zone?: SortOrder
    division?: SortOrder
    ward?: SortOrder
    plant_manager?: SortOrder
    capacity_ton_per_day?: SortOrder
    vehicles_enrolled?: SortOrder
    total_waste_collected?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    status?: SortOrder
    created_at?: SortOrder
  }

  export type plant_masterSumOrderByAggregateInput = {
    id?: SortOrder
    capacity_ton_per_day?: SortOrder
    vehicles_enrolled?: SortOrder
    total_waste_collected?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
  }

  export type BoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type edit_logsCountOrderByAggregateInput = {
    id?: SortOrder
    performed_by?: SortOrder
    role?: SortOrder
    module?: SortOrder
    action?: SortOrder
    record_id?: SortOrder
    description?: SortOrder
    ip_address?: SortOrder
    created_at?: SortOrder
    performed_by_id?: SortOrder
    success?: SortOrder
  }

  export type edit_logsAvgOrderByAggregateInput = {
    id?: SortOrder
    performed_by_id?: SortOrder
  }

  export type edit_logsMaxOrderByAggregateInput = {
    id?: SortOrder
    performed_by?: SortOrder
    role?: SortOrder
    module?: SortOrder
    action?: SortOrder
    record_id?: SortOrder
    description?: SortOrder
    ip_address?: SortOrder
    created_at?: SortOrder
    performed_by_id?: SortOrder
    success?: SortOrder
  }

  export type edit_logsMinOrderByAggregateInput = {
    id?: SortOrder
    performed_by?: SortOrder
    role?: SortOrder
    module?: SortOrder
    action?: SortOrder
    record_id?: SortOrder
    description?: SortOrder
    ip_address?: SortOrder
    created_at?: SortOrder
    performed_by_id?: SortOrder
    success?: SortOrder
  }

  export type edit_logsSumOrderByAggregateInput = {
    id?: SortOrder
    performed_by_id?: SortOrder
  }

  export type BoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type EnumCitizenComplaintCategoryFilter<$PrismaModel = never> = {
    equals?: $Enums.CitizenComplaintCategory | EnumCitizenComplaintCategoryFieldRefInput<$PrismaModel>
    in?: $Enums.CitizenComplaintCategory[] | ListEnumCitizenComplaintCategoryFieldRefInput<$PrismaModel>
    notIn?: $Enums.CitizenComplaintCategory[] | ListEnumCitizenComplaintCategoryFieldRefInput<$PrismaModel>
    not?: NestedEnumCitizenComplaintCategoryFilter<$PrismaModel> | $Enums.CitizenComplaintCategory
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type EnumCitizenComplaintStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.CitizenComplaintStatus | EnumCitizenComplaintStatusFieldRefInput<$PrismaModel>
    in?: $Enums.CitizenComplaintStatus[] | ListEnumCitizenComplaintStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.CitizenComplaintStatus[] | ListEnumCitizenComplaintStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumCitizenComplaintStatusFilter<$PrismaModel> | $Enums.CitizenComplaintStatus
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type citizen_complaintsCountOrderByAggregateInput = {
    id?: SortOrder
    ticket_number?: SortOrder
    phone_number?: SortOrder
    title?: SortOrder
    description?: SortOrder
    category?: SortOrder
    image_url?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    address?: SortOrder
    status?: SortOrder
    otp_hash?: SortOrder
    otp_expiry?: SortOrder
    otp_verified?: SortOrder
    assigned_to?: SortOrder
    remarks?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    closed_at?: SortOrder
    verification_code?: SortOrder
    verification_expires_at?: SortOrder
  }

  export type citizen_complaintsAvgOrderByAggregateInput = {
    id?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
  }

  export type citizen_complaintsMaxOrderByAggregateInput = {
    id?: SortOrder
    ticket_number?: SortOrder
    phone_number?: SortOrder
    title?: SortOrder
    description?: SortOrder
    category?: SortOrder
    image_url?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    address?: SortOrder
    status?: SortOrder
    otp_hash?: SortOrder
    otp_expiry?: SortOrder
    otp_verified?: SortOrder
    assigned_to?: SortOrder
    remarks?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    closed_at?: SortOrder
    verification_code?: SortOrder
    verification_expires_at?: SortOrder
  }

  export type citizen_complaintsMinOrderByAggregateInput = {
    id?: SortOrder
    ticket_number?: SortOrder
    phone_number?: SortOrder
    title?: SortOrder
    description?: SortOrder
    category?: SortOrder
    image_url?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    address?: SortOrder
    status?: SortOrder
    otp_hash?: SortOrder
    otp_expiry?: SortOrder
    otp_verified?: SortOrder
    assigned_to?: SortOrder
    remarks?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    closed_at?: SortOrder
    verification_code?: SortOrder
    verification_expires_at?: SortOrder
  }

  export type citizen_complaintsSumOrderByAggregateInput = {
    id?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
  }

  export type EnumCitizenComplaintCategoryWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.CitizenComplaintCategory | EnumCitizenComplaintCategoryFieldRefInput<$PrismaModel>
    in?: $Enums.CitizenComplaintCategory[] | ListEnumCitizenComplaintCategoryFieldRefInput<$PrismaModel>
    notIn?: $Enums.CitizenComplaintCategory[] | ListEnumCitizenComplaintCategoryFieldRefInput<$PrismaModel>
    not?: NestedEnumCitizenComplaintCategoryWithAggregatesFilter<$PrismaModel> | $Enums.CitizenComplaintCategory
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumCitizenComplaintCategoryFilter<$PrismaModel>
    _max?: NestedEnumCitizenComplaintCategoryFilter<$PrismaModel>
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type EnumCitizenComplaintStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.CitizenComplaintStatus | EnumCitizenComplaintStatusFieldRefInput<$PrismaModel>
    in?: $Enums.CitizenComplaintStatus[] | ListEnumCitizenComplaintStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.CitizenComplaintStatus[] | ListEnumCitizenComplaintStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumCitizenComplaintStatusWithAggregatesFilter<$PrismaModel> | $Enums.CitizenComplaintStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumCitizenComplaintStatusFilter<$PrismaModel>
    _max?: NestedEnumCitizenComplaintStatusFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NullableDecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string | null
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type vehicle_masterCreateNestedOneWithoutVehicle_incidentsInput = {
    create?: XOR<vehicle_masterCreateWithoutVehicle_incidentsInput, vehicle_masterUncheckedCreateWithoutVehicle_incidentsInput>
    connectOrCreate?: vehicle_masterCreateOrConnectWithoutVehicle_incidentsInput
    connect?: vehicle_masterWhereUniqueInput
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type vehicle_masterUpdateOneWithoutVehicle_incidentsNestedInput = {
    create?: XOR<vehicle_masterCreateWithoutVehicle_incidentsInput, vehicle_masterUncheckedCreateWithoutVehicle_incidentsInput>
    connectOrCreate?: vehicle_masterCreateOrConnectWithoutVehicle_incidentsInput
    upsert?: vehicle_masterUpsertWithoutVehicle_incidentsInput
    disconnect?: vehicle_masterWhereInput | boolean
    delete?: vehicle_masterWhereInput | boolean
    connect?: vehicle_masterWhereUniqueInput
    update?: XOR<XOR<vehicle_masterUpdateToOneWithWhereWithoutVehicle_incidentsInput, vehicle_masterUpdateWithoutVehicle_incidentsInput>, vehicle_masterUncheckedUpdateWithoutVehicle_incidentsInput>
  }

  export type vehicle_incidentsCreateNestedManyWithoutVehicle_masterInput = {
    create?: XOR<vehicle_incidentsCreateWithoutVehicle_masterInput, vehicle_incidentsUncheckedCreateWithoutVehicle_masterInput> | vehicle_incidentsCreateWithoutVehicle_masterInput[] | vehicle_incidentsUncheckedCreateWithoutVehicle_masterInput[]
    connectOrCreate?: vehicle_incidentsCreateOrConnectWithoutVehicle_masterInput | vehicle_incidentsCreateOrConnectWithoutVehicle_masterInput[]
    createMany?: vehicle_incidentsCreateManyVehicle_masterInputEnvelope
    connect?: vehicle_incidentsWhereUniqueInput | vehicle_incidentsWhereUniqueInput[]
  }

  export type vehicle_telemetryCreateNestedManyWithoutVehicle_masterInput = {
    create?: XOR<vehicle_telemetryCreateWithoutVehicle_masterInput, vehicle_telemetryUncheckedCreateWithoutVehicle_masterInput> | vehicle_telemetryCreateWithoutVehicle_masterInput[] | vehicle_telemetryUncheckedCreateWithoutVehicle_masterInput[]
    connectOrCreate?: vehicle_telemetryCreateOrConnectWithoutVehicle_masterInput | vehicle_telemetryCreateOrConnectWithoutVehicle_masterInput[]
    createMany?: vehicle_telemetryCreateManyVehicle_masterInputEnvelope
    connect?: vehicle_telemetryWhereUniqueInput | vehicle_telemetryWhereUniqueInput[]
  }

  export type vehicle_incidentsUncheckedCreateNestedManyWithoutVehicle_masterInput = {
    create?: XOR<vehicle_incidentsCreateWithoutVehicle_masterInput, vehicle_incidentsUncheckedCreateWithoutVehicle_masterInput> | vehicle_incidentsCreateWithoutVehicle_masterInput[] | vehicle_incidentsUncheckedCreateWithoutVehicle_masterInput[]
    connectOrCreate?: vehicle_incidentsCreateOrConnectWithoutVehicle_masterInput | vehicle_incidentsCreateOrConnectWithoutVehicle_masterInput[]
    createMany?: vehicle_incidentsCreateManyVehicle_masterInputEnvelope
    connect?: vehicle_incidentsWhereUniqueInput | vehicle_incidentsWhereUniqueInput[]
  }

  export type vehicle_telemetryUncheckedCreateNestedManyWithoutVehicle_masterInput = {
    create?: XOR<vehicle_telemetryCreateWithoutVehicle_masterInput, vehicle_telemetryUncheckedCreateWithoutVehicle_masterInput> | vehicle_telemetryCreateWithoutVehicle_masterInput[] | vehicle_telemetryUncheckedCreateWithoutVehicle_masterInput[]
    connectOrCreate?: vehicle_telemetryCreateOrConnectWithoutVehicle_masterInput | vehicle_telemetryCreateOrConnectWithoutVehicle_masterInput[]
    createMany?: vehicle_telemetryCreateManyVehicle_masterInputEnvelope
    connect?: vehicle_telemetryWhereUniqueInput | vehicle_telemetryWhereUniqueInput[]
  }

  export type vehicle_incidentsUpdateManyWithoutVehicle_masterNestedInput = {
    create?: XOR<vehicle_incidentsCreateWithoutVehicle_masterInput, vehicle_incidentsUncheckedCreateWithoutVehicle_masterInput> | vehicle_incidentsCreateWithoutVehicle_masterInput[] | vehicle_incidentsUncheckedCreateWithoutVehicle_masterInput[]
    connectOrCreate?: vehicle_incidentsCreateOrConnectWithoutVehicle_masterInput | vehicle_incidentsCreateOrConnectWithoutVehicle_masterInput[]
    upsert?: vehicle_incidentsUpsertWithWhereUniqueWithoutVehicle_masterInput | vehicle_incidentsUpsertWithWhereUniqueWithoutVehicle_masterInput[]
    createMany?: vehicle_incidentsCreateManyVehicle_masterInputEnvelope
    set?: vehicle_incidentsWhereUniqueInput | vehicle_incidentsWhereUniqueInput[]
    disconnect?: vehicle_incidentsWhereUniqueInput | vehicle_incidentsWhereUniqueInput[]
    delete?: vehicle_incidentsWhereUniqueInput | vehicle_incidentsWhereUniqueInput[]
    connect?: vehicle_incidentsWhereUniqueInput | vehicle_incidentsWhereUniqueInput[]
    update?: vehicle_incidentsUpdateWithWhereUniqueWithoutVehicle_masterInput | vehicle_incidentsUpdateWithWhereUniqueWithoutVehicle_masterInput[]
    updateMany?: vehicle_incidentsUpdateManyWithWhereWithoutVehicle_masterInput | vehicle_incidentsUpdateManyWithWhereWithoutVehicle_masterInput[]
    deleteMany?: vehicle_incidentsScalarWhereInput | vehicle_incidentsScalarWhereInput[]
  }

  export type vehicle_telemetryUpdateManyWithoutVehicle_masterNestedInput = {
    create?: XOR<vehicle_telemetryCreateWithoutVehicle_masterInput, vehicle_telemetryUncheckedCreateWithoutVehicle_masterInput> | vehicle_telemetryCreateWithoutVehicle_masterInput[] | vehicle_telemetryUncheckedCreateWithoutVehicle_masterInput[]
    connectOrCreate?: vehicle_telemetryCreateOrConnectWithoutVehicle_masterInput | vehicle_telemetryCreateOrConnectWithoutVehicle_masterInput[]
    upsert?: vehicle_telemetryUpsertWithWhereUniqueWithoutVehicle_masterInput | vehicle_telemetryUpsertWithWhereUniqueWithoutVehicle_masterInput[]
    createMany?: vehicle_telemetryCreateManyVehicle_masterInputEnvelope
    set?: vehicle_telemetryWhereUniqueInput | vehicle_telemetryWhereUniqueInput[]
    disconnect?: vehicle_telemetryWhereUniqueInput | vehicle_telemetryWhereUniqueInput[]
    delete?: vehicle_telemetryWhereUniqueInput | vehicle_telemetryWhereUniqueInput[]
    connect?: vehicle_telemetryWhereUniqueInput | vehicle_telemetryWhereUniqueInput[]
    update?: vehicle_telemetryUpdateWithWhereUniqueWithoutVehicle_masterInput | vehicle_telemetryUpdateWithWhereUniqueWithoutVehicle_masterInput[]
    updateMany?: vehicle_telemetryUpdateManyWithWhereWithoutVehicle_masterInput | vehicle_telemetryUpdateManyWithWhereWithoutVehicle_masterInput[]
    deleteMany?: vehicle_telemetryScalarWhereInput | vehicle_telemetryScalarWhereInput[]
  }

  export type vehicle_incidentsUncheckedUpdateManyWithoutVehicle_masterNestedInput = {
    create?: XOR<vehicle_incidentsCreateWithoutVehicle_masterInput, vehicle_incidentsUncheckedCreateWithoutVehicle_masterInput> | vehicle_incidentsCreateWithoutVehicle_masterInput[] | vehicle_incidentsUncheckedCreateWithoutVehicle_masterInput[]
    connectOrCreate?: vehicle_incidentsCreateOrConnectWithoutVehicle_masterInput | vehicle_incidentsCreateOrConnectWithoutVehicle_masterInput[]
    upsert?: vehicle_incidentsUpsertWithWhereUniqueWithoutVehicle_masterInput | vehicle_incidentsUpsertWithWhereUniqueWithoutVehicle_masterInput[]
    createMany?: vehicle_incidentsCreateManyVehicle_masterInputEnvelope
    set?: vehicle_incidentsWhereUniqueInput | vehicle_incidentsWhereUniqueInput[]
    disconnect?: vehicle_incidentsWhereUniqueInput | vehicle_incidentsWhereUniqueInput[]
    delete?: vehicle_incidentsWhereUniqueInput | vehicle_incidentsWhereUniqueInput[]
    connect?: vehicle_incidentsWhereUniqueInput | vehicle_incidentsWhereUniqueInput[]
    update?: vehicle_incidentsUpdateWithWhereUniqueWithoutVehicle_masterInput | vehicle_incidentsUpdateWithWhereUniqueWithoutVehicle_masterInput[]
    updateMany?: vehicle_incidentsUpdateManyWithWhereWithoutVehicle_masterInput | vehicle_incidentsUpdateManyWithWhereWithoutVehicle_masterInput[]
    deleteMany?: vehicle_incidentsScalarWhereInput | vehicle_incidentsScalarWhereInput[]
  }

  export type vehicle_telemetryUncheckedUpdateManyWithoutVehicle_masterNestedInput = {
    create?: XOR<vehicle_telemetryCreateWithoutVehicle_masterInput, vehicle_telemetryUncheckedCreateWithoutVehicle_masterInput> | vehicle_telemetryCreateWithoutVehicle_masterInput[] | vehicle_telemetryUncheckedCreateWithoutVehicle_masterInput[]
    connectOrCreate?: vehicle_telemetryCreateOrConnectWithoutVehicle_masterInput | vehicle_telemetryCreateOrConnectWithoutVehicle_masterInput[]
    upsert?: vehicle_telemetryUpsertWithWhereUniqueWithoutVehicle_masterInput | vehicle_telemetryUpsertWithWhereUniqueWithoutVehicle_masterInput[]
    createMany?: vehicle_telemetryCreateManyVehicle_masterInputEnvelope
    set?: vehicle_telemetryWhereUniqueInput | vehicle_telemetryWhereUniqueInput[]
    disconnect?: vehicle_telemetryWhereUniqueInput | vehicle_telemetryWhereUniqueInput[]
    delete?: vehicle_telemetryWhereUniqueInput | vehicle_telemetryWhereUniqueInput[]
    connect?: vehicle_telemetryWhereUniqueInput | vehicle_telemetryWhereUniqueInput[]
    update?: vehicle_telemetryUpdateWithWhereUniqueWithoutVehicle_masterInput | vehicle_telemetryUpdateWithWhereUniqueWithoutVehicle_masterInput[]
    updateMany?: vehicle_telemetryUpdateManyWithWhereWithoutVehicle_masterInput | vehicle_telemetryUpdateManyWithWhereWithoutVehicle_masterInput[]
    deleteMany?: vehicle_telemetryScalarWhereInput | vehicle_telemetryScalarWhereInput[]
  }

  export type vehicle_masterCreateNestedOneWithoutVehicle_telemetryInput = {
    create?: XOR<vehicle_masterCreateWithoutVehicle_telemetryInput, vehicle_masterUncheckedCreateWithoutVehicle_telemetryInput>
    connectOrCreate?: vehicle_masterCreateOrConnectWithoutVehicle_telemetryInput
    connect?: vehicle_masterWhereUniqueInput
  }

  export type vehicle_masterUpdateOneWithoutVehicle_telemetryNestedInput = {
    create?: XOR<vehicle_masterCreateWithoutVehicle_telemetryInput, vehicle_masterUncheckedCreateWithoutVehicle_telemetryInput>
    connectOrCreate?: vehicle_masterCreateOrConnectWithoutVehicle_telemetryInput
    upsert?: vehicle_masterUpsertWithoutVehicle_telemetryInput
    disconnect?: vehicle_masterWhereInput | boolean
    delete?: vehicle_masterWhereInput | boolean
    connect?: vehicle_masterWhereUniqueInput
    update?: XOR<XOR<vehicle_masterUpdateToOneWithWhereWithoutVehicle_telemetryInput, vehicle_masterUpdateWithoutVehicle_telemetryInput>, vehicle_masterUncheckedUpdateWithoutVehicle_telemetryInput>
  }

  export type NullableBoolFieldUpdateOperationsInput = {
    set?: boolean | null
  }

  export type EnumCitizenComplaintCategoryFieldUpdateOperationsInput = {
    set?: $Enums.CitizenComplaintCategory
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type EnumCitizenComplaintStatusFieldUpdateOperationsInput = {
    set?: $Enums.CitizenComplaintStatus
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
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

  export type NestedBoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type NestedBoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type NestedEnumCitizenComplaintCategoryFilter<$PrismaModel = never> = {
    equals?: $Enums.CitizenComplaintCategory | EnumCitizenComplaintCategoryFieldRefInput<$PrismaModel>
    in?: $Enums.CitizenComplaintCategory[] | ListEnumCitizenComplaintCategoryFieldRefInput<$PrismaModel>
    notIn?: $Enums.CitizenComplaintCategory[] | ListEnumCitizenComplaintCategoryFieldRefInput<$PrismaModel>
    not?: NestedEnumCitizenComplaintCategoryFilter<$PrismaModel> | $Enums.CitizenComplaintCategory
  }

  export type NestedEnumCitizenComplaintStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.CitizenComplaintStatus | EnumCitizenComplaintStatusFieldRefInput<$PrismaModel>
    in?: $Enums.CitizenComplaintStatus[] | ListEnumCitizenComplaintStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.CitizenComplaintStatus[] | ListEnumCitizenComplaintStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumCitizenComplaintStatusFilter<$PrismaModel> | $Enums.CitizenComplaintStatus
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedEnumCitizenComplaintCategoryWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.CitizenComplaintCategory | EnumCitizenComplaintCategoryFieldRefInput<$PrismaModel>
    in?: $Enums.CitizenComplaintCategory[] | ListEnumCitizenComplaintCategoryFieldRefInput<$PrismaModel>
    notIn?: $Enums.CitizenComplaintCategory[] | ListEnumCitizenComplaintCategoryFieldRefInput<$PrismaModel>
    not?: NestedEnumCitizenComplaintCategoryWithAggregatesFilter<$PrismaModel> | $Enums.CitizenComplaintCategory
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumCitizenComplaintCategoryFilter<$PrismaModel>
    _max?: NestedEnumCitizenComplaintCategoryFilter<$PrismaModel>
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedEnumCitizenComplaintStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.CitizenComplaintStatus | EnumCitizenComplaintStatusFieldRefInput<$PrismaModel>
    in?: $Enums.CitizenComplaintStatus[] | ListEnumCitizenComplaintStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.CitizenComplaintStatus[] | ListEnumCitizenComplaintStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumCitizenComplaintStatusWithAggregatesFilter<$PrismaModel> | $Enums.CitizenComplaintStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumCitizenComplaintStatusFilter<$PrismaModel>
    _max?: NestedEnumCitizenComplaintStatusFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type vehicle_masterCreateWithoutVehicle_incidentsInput = {
    vehicle_id: string
    vehicle_type?: string | null
    city?: string | null
    zone?: string | null
    division?: string | null
    ward?: string | null
    status?: string | null
    created_at?: Date | string | null
    vehicle_telemetry?: vehicle_telemetryCreateNestedManyWithoutVehicle_masterInput
  }

  export type vehicle_masterUncheckedCreateWithoutVehicle_incidentsInput = {
    id?: number
    vehicle_id: string
    vehicle_type?: string | null
    city?: string | null
    zone?: string | null
    division?: string | null
    ward?: string | null
    status?: string | null
    created_at?: Date | string | null
    vehicle_telemetry?: vehicle_telemetryUncheckedCreateNestedManyWithoutVehicle_masterInput
  }

  export type vehicle_masterCreateOrConnectWithoutVehicle_incidentsInput = {
    where: vehicle_masterWhereUniqueInput
    create: XOR<vehicle_masterCreateWithoutVehicle_incidentsInput, vehicle_masterUncheckedCreateWithoutVehicle_incidentsInput>
  }

  export type vehicle_masterUpsertWithoutVehicle_incidentsInput = {
    update: XOR<vehicle_masterUpdateWithoutVehicle_incidentsInput, vehicle_masterUncheckedUpdateWithoutVehicle_incidentsInput>
    create: XOR<vehicle_masterCreateWithoutVehicle_incidentsInput, vehicle_masterUncheckedCreateWithoutVehicle_incidentsInput>
    where?: vehicle_masterWhereInput
  }

  export type vehicle_masterUpdateToOneWithWhereWithoutVehicle_incidentsInput = {
    where?: vehicle_masterWhereInput
    data: XOR<vehicle_masterUpdateWithoutVehicle_incidentsInput, vehicle_masterUncheckedUpdateWithoutVehicle_incidentsInput>
  }

  export type vehicle_masterUpdateWithoutVehicle_incidentsInput = {
    vehicle_id?: StringFieldUpdateOperationsInput | string
    vehicle_type?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    zone?: NullableStringFieldUpdateOperationsInput | string | null
    division?: NullableStringFieldUpdateOperationsInput | string | null
    ward?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    vehicle_telemetry?: vehicle_telemetryUpdateManyWithoutVehicle_masterNestedInput
  }

  export type vehicle_masterUncheckedUpdateWithoutVehicle_incidentsInput = {
    id?: IntFieldUpdateOperationsInput | number
    vehicle_id?: StringFieldUpdateOperationsInput | string
    vehicle_type?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    zone?: NullableStringFieldUpdateOperationsInput | string | null
    division?: NullableStringFieldUpdateOperationsInput | string | null
    ward?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    vehicle_telemetry?: vehicle_telemetryUncheckedUpdateManyWithoutVehicle_masterNestedInput
  }

  export type vehicle_incidentsCreateWithoutVehicle_masterInput = {
    date_time?: Date | string | null
    main_road?: string | null
    cross_road?: string | null
    speed_flagged_kmh?: Decimal | DecimalJsLike | number | string | null
    speed_limit_kmh?: Decimal | DecimalJsLike | number | string | null
    excess_speed_kmh?: Decimal | DecimalJsLike | number | string | null
    status?: string | null
  }

  export type vehicle_incidentsUncheckedCreateWithoutVehicle_masterInput = {
    id?: number
    date_time?: Date | string | null
    main_road?: string | null
    cross_road?: string | null
    speed_flagged_kmh?: Decimal | DecimalJsLike | number | string | null
    speed_limit_kmh?: Decimal | DecimalJsLike | number | string | null
    excess_speed_kmh?: Decimal | DecimalJsLike | number | string | null
    status?: string | null
  }

  export type vehicle_incidentsCreateOrConnectWithoutVehicle_masterInput = {
    where: vehicle_incidentsWhereUniqueInput
    create: XOR<vehicle_incidentsCreateWithoutVehicle_masterInput, vehicle_incidentsUncheckedCreateWithoutVehicle_masterInput>
  }

  export type vehicle_incidentsCreateManyVehicle_masterInputEnvelope = {
    data: vehicle_incidentsCreateManyVehicle_masterInput | vehicle_incidentsCreateManyVehicle_masterInput[]
    skipDuplicates?: boolean
  }

  export type vehicle_telemetryCreateWithoutVehicle_masterInput = {
    latitude?: Decimal | DecimalJsLike | number | string | null
    longitude?: Decimal | DecimalJsLike | number | string | null
    speed_kmh?: Decimal | DecimalJsLike | number | string | null
    fuel_level?: Decimal | DecimalJsLike | number | string | null
    battery_health?: Decimal | DecimalJsLike | number | string | null
    engine_status?: string | null
    recorded_at?: Date | string | null
  }

  export type vehicle_telemetryUncheckedCreateWithoutVehicle_masterInput = {
    id?: number
    latitude?: Decimal | DecimalJsLike | number | string | null
    longitude?: Decimal | DecimalJsLike | number | string | null
    speed_kmh?: Decimal | DecimalJsLike | number | string | null
    fuel_level?: Decimal | DecimalJsLike | number | string | null
    battery_health?: Decimal | DecimalJsLike | number | string | null
    engine_status?: string | null
    recorded_at?: Date | string | null
  }

  export type vehicle_telemetryCreateOrConnectWithoutVehicle_masterInput = {
    where: vehicle_telemetryWhereUniqueInput
    create: XOR<vehicle_telemetryCreateWithoutVehicle_masterInput, vehicle_telemetryUncheckedCreateWithoutVehicle_masterInput>
  }

  export type vehicle_telemetryCreateManyVehicle_masterInputEnvelope = {
    data: vehicle_telemetryCreateManyVehicle_masterInput | vehicle_telemetryCreateManyVehicle_masterInput[]
    skipDuplicates?: boolean
  }

  export type vehicle_incidentsUpsertWithWhereUniqueWithoutVehicle_masterInput = {
    where: vehicle_incidentsWhereUniqueInput
    update: XOR<vehicle_incidentsUpdateWithoutVehicle_masterInput, vehicle_incidentsUncheckedUpdateWithoutVehicle_masterInput>
    create: XOR<vehicle_incidentsCreateWithoutVehicle_masterInput, vehicle_incidentsUncheckedCreateWithoutVehicle_masterInput>
  }

  export type vehicle_incidentsUpdateWithWhereUniqueWithoutVehicle_masterInput = {
    where: vehicle_incidentsWhereUniqueInput
    data: XOR<vehicle_incidentsUpdateWithoutVehicle_masterInput, vehicle_incidentsUncheckedUpdateWithoutVehicle_masterInput>
  }

  export type vehicle_incidentsUpdateManyWithWhereWithoutVehicle_masterInput = {
    where: vehicle_incidentsScalarWhereInput
    data: XOR<vehicle_incidentsUpdateManyMutationInput, vehicle_incidentsUncheckedUpdateManyWithoutVehicle_masterInput>
  }

  export type vehicle_incidentsScalarWhereInput = {
    AND?: vehicle_incidentsScalarWhereInput | vehicle_incidentsScalarWhereInput[]
    OR?: vehicle_incidentsScalarWhereInput[]
    NOT?: vehicle_incidentsScalarWhereInput | vehicle_incidentsScalarWhereInput[]
    id?: IntFilter<"vehicle_incidents"> | number
    vehicle_id?: StringNullableFilter<"vehicle_incidents"> | string | null
    date_time?: DateTimeNullableFilter<"vehicle_incidents"> | Date | string | null
    main_road?: StringNullableFilter<"vehicle_incidents"> | string | null
    cross_road?: StringNullableFilter<"vehicle_incidents"> | string | null
    speed_flagged_kmh?: DecimalNullableFilter<"vehicle_incidents"> | Decimal | DecimalJsLike | number | string | null
    speed_limit_kmh?: DecimalNullableFilter<"vehicle_incidents"> | Decimal | DecimalJsLike | number | string | null
    excess_speed_kmh?: DecimalNullableFilter<"vehicle_incidents"> | Decimal | DecimalJsLike | number | string | null
    status?: StringNullableFilter<"vehicle_incidents"> | string | null
  }

  export type vehicle_telemetryUpsertWithWhereUniqueWithoutVehicle_masterInput = {
    where: vehicle_telemetryWhereUniqueInput
    update: XOR<vehicle_telemetryUpdateWithoutVehicle_masterInput, vehicle_telemetryUncheckedUpdateWithoutVehicle_masterInput>
    create: XOR<vehicle_telemetryCreateWithoutVehicle_masterInput, vehicle_telemetryUncheckedCreateWithoutVehicle_masterInput>
  }

  export type vehicle_telemetryUpdateWithWhereUniqueWithoutVehicle_masterInput = {
    where: vehicle_telemetryWhereUniqueInput
    data: XOR<vehicle_telemetryUpdateWithoutVehicle_masterInput, vehicle_telemetryUncheckedUpdateWithoutVehicle_masterInput>
  }

  export type vehicle_telemetryUpdateManyWithWhereWithoutVehicle_masterInput = {
    where: vehicle_telemetryScalarWhereInput
    data: XOR<vehicle_telemetryUpdateManyMutationInput, vehicle_telemetryUncheckedUpdateManyWithoutVehicle_masterInput>
  }

  export type vehicle_telemetryScalarWhereInput = {
    AND?: vehicle_telemetryScalarWhereInput | vehicle_telemetryScalarWhereInput[]
    OR?: vehicle_telemetryScalarWhereInput[]
    NOT?: vehicle_telemetryScalarWhereInput | vehicle_telemetryScalarWhereInput[]
    id?: IntFilter<"vehicle_telemetry"> | number
    vehicle_id?: StringNullableFilter<"vehicle_telemetry"> | string | null
    latitude?: DecimalNullableFilter<"vehicle_telemetry"> | Decimal | DecimalJsLike | number | string | null
    longitude?: DecimalNullableFilter<"vehicle_telemetry"> | Decimal | DecimalJsLike | number | string | null
    speed_kmh?: DecimalNullableFilter<"vehicle_telemetry"> | Decimal | DecimalJsLike | number | string | null
    fuel_level?: DecimalNullableFilter<"vehicle_telemetry"> | Decimal | DecimalJsLike | number | string | null
    battery_health?: DecimalNullableFilter<"vehicle_telemetry"> | Decimal | DecimalJsLike | number | string | null
    engine_status?: StringNullableFilter<"vehicle_telemetry"> | string | null
    recorded_at?: DateTimeNullableFilter<"vehicle_telemetry"> | Date | string | null
  }

  export type vehicle_masterCreateWithoutVehicle_telemetryInput = {
    vehicle_id: string
    vehicle_type?: string | null
    city?: string | null
    zone?: string | null
    division?: string | null
    ward?: string | null
    status?: string | null
    created_at?: Date | string | null
    vehicle_incidents?: vehicle_incidentsCreateNestedManyWithoutVehicle_masterInput
  }

  export type vehicle_masterUncheckedCreateWithoutVehicle_telemetryInput = {
    id?: number
    vehicle_id: string
    vehicle_type?: string | null
    city?: string | null
    zone?: string | null
    division?: string | null
    ward?: string | null
    status?: string | null
    created_at?: Date | string | null
    vehicle_incidents?: vehicle_incidentsUncheckedCreateNestedManyWithoutVehicle_masterInput
  }

  export type vehicle_masterCreateOrConnectWithoutVehicle_telemetryInput = {
    where: vehicle_masterWhereUniqueInput
    create: XOR<vehicle_masterCreateWithoutVehicle_telemetryInput, vehicle_masterUncheckedCreateWithoutVehicle_telemetryInput>
  }

  export type vehicle_masterUpsertWithoutVehicle_telemetryInput = {
    update: XOR<vehicle_masterUpdateWithoutVehicle_telemetryInput, vehicle_masterUncheckedUpdateWithoutVehicle_telemetryInput>
    create: XOR<vehicle_masterCreateWithoutVehicle_telemetryInput, vehicle_masterUncheckedCreateWithoutVehicle_telemetryInput>
    where?: vehicle_masterWhereInput
  }

  export type vehicle_masterUpdateToOneWithWhereWithoutVehicle_telemetryInput = {
    where?: vehicle_masterWhereInput
    data: XOR<vehicle_masterUpdateWithoutVehicle_telemetryInput, vehicle_masterUncheckedUpdateWithoutVehicle_telemetryInput>
  }

  export type vehicle_masterUpdateWithoutVehicle_telemetryInput = {
    vehicle_id?: StringFieldUpdateOperationsInput | string
    vehicle_type?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    zone?: NullableStringFieldUpdateOperationsInput | string | null
    division?: NullableStringFieldUpdateOperationsInput | string | null
    ward?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    vehicle_incidents?: vehicle_incidentsUpdateManyWithoutVehicle_masterNestedInput
  }

  export type vehicle_masterUncheckedUpdateWithoutVehicle_telemetryInput = {
    id?: IntFieldUpdateOperationsInput | number
    vehicle_id?: StringFieldUpdateOperationsInput | string
    vehicle_type?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    zone?: NullableStringFieldUpdateOperationsInput | string | null
    division?: NullableStringFieldUpdateOperationsInput | string | null
    ward?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    vehicle_incidents?: vehicle_incidentsUncheckedUpdateManyWithoutVehicle_masterNestedInput
  }

  export type vehicle_incidentsCreateManyVehicle_masterInput = {
    id?: number
    date_time?: Date | string | null
    main_road?: string | null
    cross_road?: string | null
    speed_flagged_kmh?: Decimal | DecimalJsLike | number | string | null
    speed_limit_kmh?: Decimal | DecimalJsLike | number | string | null
    excess_speed_kmh?: Decimal | DecimalJsLike | number | string | null
    status?: string | null
  }

  export type vehicle_telemetryCreateManyVehicle_masterInput = {
    id?: number
    latitude?: Decimal | DecimalJsLike | number | string | null
    longitude?: Decimal | DecimalJsLike | number | string | null
    speed_kmh?: Decimal | DecimalJsLike | number | string | null
    fuel_level?: Decimal | DecimalJsLike | number | string | null
    battery_health?: Decimal | DecimalJsLike | number | string | null
    engine_status?: string | null
    recorded_at?: Date | string | null
  }

  export type vehicle_incidentsUpdateWithoutVehicle_masterInput = {
    date_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    main_road?: NullableStringFieldUpdateOperationsInput | string | null
    cross_road?: NullableStringFieldUpdateOperationsInput | string | null
    speed_flagged_kmh?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    speed_limit_kmh?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    excess_speed_kmh?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type vehicle_incidentsUncheckedUpdateWithoutVehicle_masterInput = {
    id?: IntFieldUpdateOperationsInput | number
    date_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    main_road?: NullableStringFieldUpdateOperationsInput | string | null
    cross_road?: NullableStringFieldUpdateOperationsInput | string | null
    speed_flagged_kmh?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    speed_limit_kmh?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    excess_speed_kmh?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type vehicle_incidentsUncheckedUpdateManyWithoutVehicle_masterInput = {
    id?: IntFieldUpdateOperationsInput | number
    date_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    main_road?: NullableStringFieldUpdateOperationsInput | string | null
    cross_road?: NullableStringFieldUpdateOperationsInput | string | null
    speed_flagged_kmh?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    speed_limit_kmh?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    excess_speed_kmh?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type vehicle_telemetryUpdateWithoutVehicle_masterInput = {
    latitude?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    longitude?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    speed_kmh?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    fuel_level?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    battery_health?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    engine_status?: NullableStringFieldUpdateOperationsInput | string | null
    recorded_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type vehicle_telemetryUncheckedUpdateWithoutVehicle_masterInput = {
    id?: IntFieldUpdateOperationsInput | number
    latitude?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    longitude?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    speed_kmh?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    fuel_level?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    battery_health?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    engine_status?: NullableStringFieldUpdateOperationsInput | string | null
    recorded_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type vehicle_telemetryUncheckedUpdateManyWithoutVehicle_masterInput = {
    id?: IntFieldUpdateOperationsInput | number
    latitude?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    longitude?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    speed_kmh?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    fuel_level?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    battery_health?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    engine_status?: NullableStringFieldUpdateOperationsInput | string | null
    recorded_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
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