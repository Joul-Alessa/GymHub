export class GetUnit {
  constructor(unitRepository) {
    this.unitRepository = unitRepository;
  }

  async execute(id) {
    return await this.unitRepository.getById(id);
  }
}