// Repositories
import { PostgreSQLUserRepository } from "./infrastructure/database/PostgreSQLUserRepository.js";
import { PostgreSQLMetricTypeRepository } from "./infrastructure/database/PostgreSQLMetricTypeRepository.js";
import { PostgreSQLUnitRepository } from "./infrastructure/database/PostgreSQLUnitRepository.js";

// Services
//import { hashService } from "./infrastructure/services/hashService.js";
//import { tokenService } from "./infrastructure/services/tokenService.js";

// Use Cases
import { GetUsers } from "./application/users/GetUsers.js";
import { GetUser } from "./application/users/GetUser.js";
import { UpdateUser } from "./application/users/UpdateUser.js";
import { DeleteUser } from "./application/users/DeleteUser.js";
//import { CreateUser } from "./application/users/CreateUser.js";
//import { LoginUser } from "./application/auth/LoginUser.js";
import { GetMetricTypes } from "./application/metricTypes/GetMetricTypes.js";
import { GetMetricType } from "./application/metricTypes/GetMetricType.js";
import { GetUnits } from "./application/units/GetUnits.js";
import { GetUnit } from "./application/units/GetUnit.js";

// Controllers
import { MetricTypeController } from "./interfaces/http/controllers/metricTypeController.js";
import { UnitController } from "./interfaces/http/controllers/unitController.js";

// Instancias
const userRepository = new PostgreSQLUserRepository();
const metricTypeRepository = new PostgreSQLMetricTypeRepository();
const unitRepository = new PostgreSQLUnitRepository();

const getUsersUseCase = new GetUsers(userRepository);
const getUserUseCase  = new GetUser(userRepository);
const updateUserUseCase = new UpdateUser(userRepository);
const deleteUserUseCase = new DeleteUser(userRepository);

const getMetricTypesUseCase = new GetMetricTypes(metricTypeRepository);
const getMetricTypeUseCase = new GetMetricType(metricTypeRepository);
const getUnitsUseCase = new GetUnits(unitRepository);
const getUnitUseCase = new GetUnit(unitRepository);

const metricTypeController = new MetricTypeController(getMetricTypesUseCase, getMetricTypeUseCase);
const unitController = new UnitController(getUnitsUseCase, getUnitUseCase);

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
  updateUserUseCase,
  deleteUserUseCase,
  getMetricTypesUseCase,
  getMetricTypeUseCase,
  getUnitsUseCase,
  getUnitUseCase,
  metricTypeController,
  unitController
  //createUserUseCase,
  //loginUserUseCase
};