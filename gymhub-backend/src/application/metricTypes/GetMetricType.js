export class GetMetricType {
  constructor(metricTypeRepository) {
    this.metricTypeRepository = metricTypeRepository;
  }

  async execute(id) {
    return await this.metricTypeRepository.getById(id);
  }
}