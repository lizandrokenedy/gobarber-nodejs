import { getRepository } from 'typeorm';

import { hash } from 'bcryptjs';

import User from '../models/User';
import AppError from '../errors/AppError';

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
      throw new AppError('Email address already used.');
    }

    const hashedPassword = await hash(password, 8);

    const user = usersResposity.create({
      name,
      email,
      password: hashedPassword,
    });

    await usersResposity.save(user);

    return user;
  }
}

export default CreateUserService;
