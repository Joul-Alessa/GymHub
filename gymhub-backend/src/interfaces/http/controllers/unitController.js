export class UnitController {
  constructor(getUnitsUseCase, getUnitUseCase) {
    this.getUnitsUseCase = getUnitsUseCase;
    this.getUnitUseCase = getUnitUseCase;
  }

  async getAll(req, res) {
    try {
      const units = await this.getUnitsUseCase.execute();
      res.json(units);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const unit = await this.getUnitUseCase.execute(id);
      if (!unit) {
        return res.status(404).json({ error: 'Unit not found' });
      }
      res.json(unit);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}