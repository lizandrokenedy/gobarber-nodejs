import { getRepository } from 'typeorm';
import User from '../models/User';

interface Request {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  public async execute({ name, email, password }: Request): Promise<User> {
    const usersResposity = getRepository(User);

    const checkUserExistis = await usersResposity.findOne({
      where: { email },
    });

    if (checkUserExistis) {
      throw new Error('Email address already used.');
    }

    const user = usersResposity.create({
      name,
      email,
      password,
    });

    await usersResposity.save(user);

    return user;
  }
}

export default CreateUserService;
