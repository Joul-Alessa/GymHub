export class GetUser {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(id) {
    return this.userRepository.getById(id);
  }
}