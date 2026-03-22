import { container } from "../../../container.js";

export const login = async (req, res) => {
  try {
    const token = await container.loginUserUseCase.execute(req.body);
    res.json({ token });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};

export const register = async (req, res) => {
  try {
    const user = await container.registerUserUseCase.execute(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};