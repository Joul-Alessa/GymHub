export class RegisterUser {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }
  /* Cuando tenga un servicio de hashing implementado, quito el comentario de aquí
  constructor(userRepository, hashService) {
    this.userRepository = userRepository;
    this.hashService = hashService;
  }
  */

  async execute(data) {
    // Validar que no exista usuario con ese username/email
    const existing = await this.userRepository.findByUsername(data.username);
    if (existing) {
      throw new Error("Username already exists");
    }

    // Hashear la contraseña
    const hashedPassword = data.password // await this.hashService.hash(data.password);

    // Crear el usuario
    const user = {
      username: data.username,
      name: data.name,
      password: hashedPassword,
      email: data.email,
      phone: data.phone,
      date_when_joined: new Date().toISOString(),
      date_of_birth: data.date_of_birth
    };

    return this.userRepository.create(user);
  }
}