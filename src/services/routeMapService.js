const routeMapRepository =
  require("../repositories/routeMapRepository");

/*
|--------------------------------------------------------------------------
| DATE VALIDATION
|--------------------------------------------------------------------------
*/

const validateDate = (value) => {
  if (
    !value ||
    typeof value !== "string"
  ) {
    throw new Error(
      "date is required in YYYY-MM-DD format"
    );
  }

  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(value)
  ) {
    throw new Error(
      "date must be in YYYY-MM-DD format"
    );
  }

  const [year, month, day] =
    value.split("-").map(Number);

  const date =
    new Date(
      year,
      month - 1,
      day
    );

  /*
  |--------------------------------------------------------------------------
  | Prevent JavaScript from silently
  | normalizing invalid dates.
  |--------------------------------------------------------------------------
  */

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    throw new Error(
      "Invalid date"
    );
  }

  return value;
};

/*
|--------------------------------------------------------------------------
| WARD VALIDATION
|--------------------------------------------------------------------------
*/

const validateWardNo = (value) => {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    throw new Error(
      "wardNo is required"
    );
  }

  const wardNo =
    Number(value);

  if (
    !Number.isInteger(wardNo) ||
    wardNo <= 0
  ) {
    throw new Error(
      "wardNo must be a positive integer"
    );
  }

  return wardNo;
};

/*
|--------------------------------------------------------------------------
| CONVERT DATABASE VALUES TO JSON SAFE VALUES
|--------------------------------------------------------------------------
|
| PostgreSQL/Prisma can return:
|
| BigInt
| Decimal
| Date
|
| JSON.stringify() cannot directly serialize
| BigInt.
|
| This function makes the complete telemetry
| row safe for the frontend.
|
|--------------------------------------------------------------------------
*/

const serializeValue = (value) => {
  if (
    value === null ||
    value === undefined
  ) {
    return value;
  }

  if (
    typeof value === "bigint"
  ) {
    return value.toString();
  }

  if (
    value instanceof Date
  ) {
    return value.toISOString();
  }

  /*
  |--------------------------------------------------------------------------
  | Prisma Decimal
  |--------------------------------------------------------------------------
  */

  if (
    typeof value === "object" &&
    typeof value.toNumber === "function"
  ) {
    return value.toNumber();
  }

  if (
    Array.isArray(value)
  ) {
    return value.map(
      serializeValue
    );
  }

  if (
    typeof value === "object"
  ) {
    const result = {};

    for (
      const [key, item] of
      Object.entries(value)
    ) {
      result[key] =
        serializeValue(item);
    }

    return result;
  }

  return value;
};

/*
|--------------------------------------------------------------------------
| SERVICE
|--------------------------------------------------------------------------
*/

const getRouteMap = async ({
  date,
  wardNo,
}) => {
  const validatedDate =
    validateDate(date);

  const validatedWardNo =
    validateWardNo(wardNo);

  const result =
    await routeMapRepository.getRouteData({
      date:
        validatedDate,

      wardNo:
        validatedWardNo,
    });

  /*
  |--------------------------------------------------------------------------
  | Make complete response JSON-safe.
  |--------------------------------------------------------------------------
  */

  return serializeValue(
    result
  );
};

module.exports = {
  getRouteMap,
};