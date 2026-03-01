import { container } from "../../../container.js";

export const login = async (req, res) => {
  try {
    const token = await container.loginUserUseCase.execute(req.body);
    res.json({ token });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};