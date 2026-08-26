const averageWeightService =
  require("./averageWeightService");


const getAverageWeightGraph =
  async (req, res) => {

    try {

      const data =
        await averageWeightService.getAverageWeightGraph({
          date: req.query.date,
        });


      return res.status(200).json({
        success: true,
        ...data,
      });

    } catch (error) {

      console.error(
        "Average weight graph error:",
        error
      );


      return res.status(500).json({
        success: false,

        message:
          error.message ||
          "Failed to fetch average weight graph",

        data: [],
      });
    }
  };


module.exports = {
  getAverageWeightGraph,
};