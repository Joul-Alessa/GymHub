export class GetUnits {
  constructor(unitRepository) {
    this.unitRepository = unitRepository;
  }

  async execute() {
    return await this.unitRepository.getAll();
  }
}