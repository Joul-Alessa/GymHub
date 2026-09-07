export class GetMetricTypes {
  constructor(metricTypeRepository) {
    this.metricTypeRepository = metricTypeRepository;
  }

  async execute() {
    return await this.metricTypeRepository.getAll();
  }
}