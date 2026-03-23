export class MetricTypeController {
  constructor(getMetricTypesUseCase, getMetricTypeUseCase) {
    this.getMetricTypesUseCase = getMetricTypesUseCase;
    this.getMetricTypeUseCase = getMetricTypeUseCase;
  }

  async getAll(req, res) {
    try {
      const metricTypes = await this.getMetricTypesUseCase.execute();
      res.json(metricTypes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const metricType = await this.getMetricTypeUseCase.execute(id);
      if (!metricType) {
        return res.status(404).json({ error: 'Metric type not found' });
      }
      res.json(metricType);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}