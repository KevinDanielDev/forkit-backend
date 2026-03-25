import { User } from 'src/users/entities/user.entity';

export function removeKeys(user: User | Partial<User>) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, password, ...restUser } = user;
  return restUser;
}
