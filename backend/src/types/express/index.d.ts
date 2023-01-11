import { User } from 'src/users/entities/user.entity';

export {};
declare global {
    namespace Express {
        export interface Request {
            user?: User;
        }
    }
}
