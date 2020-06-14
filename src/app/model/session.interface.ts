import { User } from './user.interface';

export interface SessionState{
    cameraX: number;
    cameraY: number;
    cameraZ: number;
    selectedId: string;
}

export interface Session {
    token: string;
    user: User;
}