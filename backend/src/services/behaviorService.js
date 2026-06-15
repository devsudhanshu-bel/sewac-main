const calculateEuclideanDistance = (
  profile,
  sample
) => {

  return Math.sqrt(

    Math.pow(
      profile.avg_dwell_time -
      sample.dwell_time,
      2
    ) +

    Math.pow(
      profile.avg_flight_time -
      sample.flight_time,
      2
    ) +

    Math.pow(
      profile.avg_typing_speed -
      sample.typing_speed,
      2
    ) +

    Math.pow(
      profile.avg_backspace_usage -
      sample.backspace_usage,
      2
    ) +

    Math.pow(
      profile.avg_error_rate -
      sample.error_rate,
      2
    )

  );
};

const calculateManhattanDistance = (
  profile,
  sample
) => {

  return (

    Math.abs(
      profile.avg_dwell_time -
      sample.dwell_time
    ) +

    Math.abs(
      profile.avg_flight_time -
      sample.flight_time
    ) +

    Math.abs(
      profile.avg_typing_speed -
      sample.typing_speed
    ) +

    Math.abs(
      profile.avg_backspace_usage -
      sample.backspace_usage
    ) +

    Math.abs(
      profile.avg_error_rate -
      sample.error_rate
    )

  );
};

const calculateCosineSimilarity = (
  profile,
  sample
) => {

  const p = [
    Number(profile.avg_dwell_time),
    Number(profile.avg_flight_time),
    Number(profile.avg_typing_speed),
    Number(profile.avg_backspace_usage),
    Number(profile.avg_error_rate)
  ];

  const s = [
    Number(sample.dwell_time),
    Number(sample.flight_time),
    Number(sample.typing_speed),
    Number(sample.backspace_usage),
    Number(sample.error_rate)
  ];

  let dot = 0;
  let magP = 0;
  let magS = 0;

  for (let i = 0; i < p.length; i++) {

    dot += p[i] * s[i];

    magP += p[i] * p[i];

    magS += s[i] * s[i];
  }

  return (
    dot /
    (
      Math.sqrt(magP) *
      Math.sqrt(magS)
    )
  );
};

module.exports = {
  calculateEuclideanDistance,
  calculateManhattanDistance,
  calculateCosineSimilarity
};