export class DeleteUser {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(id) {
    return this.userRepository.softDelete(id);
  }
}