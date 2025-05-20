exports.getFlightRecords = async (req, res) => {
  res.json({ message: `Flight data for ${req.params.wallet}` });
};
