// Repositories
import { SQLiteUserRepository } from "./infrastructure/database/SQLiteUserRepository.js";

// Services
//import { hashService } from "./infrastructure/services/hashService.js";
//import { tokenService } from "./infrastructure/services/tokenService.js";

// Use Cases
import { GetUsers } from "./application/users/GetUsers.js";
import { GetUser } from "./application/users/GetUser.js";
import { UpdateUser } from "./application/users/UpdateUser.js";
//import { CreateUser } from "./application/users/CreateUser.js";
//import { LoginUser } from "./application/auth/LoginUser.js";

// Instancias
const userRepository = new SQLiteUserRepository();

const getUsersUseCase = new GetUsers(userRepository);
const getUserUseCase  = new GetUser(userRepository);
const updateUserUseCase = new UpdateUser(userRepository);

/*
const createUserUseCase = new CreateUser(
  userRepository,
  hashService
);

const loginUserUseCase = new LoginUser(
  userRepository,
  hashService,
  tokenService
);
*/

export const container = {
  getUsersUseCase,
  getUserUseCase,
  updateUserUseCase
  //createUserUseCase,
  //loginUserUseCase
};