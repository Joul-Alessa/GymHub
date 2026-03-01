import { container } from "../../../container.js";

export const getUsers = async (req, res) => {
  try {
    const users = await container.getUsersUseCase.execute();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await container.getUserUseCase.execute(req.params.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};