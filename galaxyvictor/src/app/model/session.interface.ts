import { User } from './user.interface';

export interface Session {
    token: string;
    user: User;
}