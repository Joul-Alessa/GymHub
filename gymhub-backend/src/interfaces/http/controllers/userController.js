import { container } from "../../../container.js";

export const getUsers = async (req, res) => {
  try {
    const users = await container.getUsersUseCase.execute();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};