export class UpdateUser {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(id, data) {
    // opcional: validar campos permitidos aquí
    return this.userRepository.update(id, data);
  }
}