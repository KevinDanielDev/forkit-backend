import * as bcrypt from 'bcrypt';

export async function hashPassword(password: string, saltOrRounds: number) {
  return await bcrypt.hash(password, saltOrRounds);
}
