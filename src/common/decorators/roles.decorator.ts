import { Reflector } from '@nestjs/core';

import { ERoles } from '../models/enums/roles.enum';

export const Roles = Reflector.createDecorator<ERoles[]>();
