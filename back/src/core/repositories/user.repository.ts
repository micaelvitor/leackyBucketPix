import { getModelForClass } from '@typegoose/typegoose';
import { User } from '@/core/entities/user.entity';

const UserModel = getModelForClass(User);

export const userRepository = {
  async findById(id: string) {
    return UserModel.findOne({ id });
  },
  async findByEmail(email: string) {
    return await UserModel.findOne({ email });
  },
  async findAll() {
    return await UserModel.find();
  },
  async create(user: User) {
    return await UserModel.create(user);
  },
  async update(id: string, data: Partial<User>) {
    return await UserModel.findOneAndUpdate({ id }, data, { new: true });
  },
  async delete(id: string) {
    return await UserModel.findOneAndDelete({ id });
  },
};
