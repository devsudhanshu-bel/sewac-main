const calculateRiskScore = (
  identityScore,
  deviceScore,
  behaviorScore
) => {

  const score =
    (
      identityScore * 0.30 +
      deviceScore * 0.30 +
      behaviorScore * 0.40
    );

  return Number(
    score.toFixed(2)
  );
};

const determineDecision = (
  riskScore
) => {

  if (riskScore >= 80) {
    return "ALLOW";
  }

  if (riskScore >= 60) {
    return "RESTRICT";
  }

  return "DENY";
};

module.exports = {
  calculateRiskScore,
  determineDecision
};