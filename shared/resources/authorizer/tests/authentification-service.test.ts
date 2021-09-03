import { AuthentificationService } from '../services';

describe('authentification service', () => {
    const registeredUsers = {
        user: 'password',
    };

    const authentificationService = new AuthentificationService({
        users: registeredUsers,
    });

    describe('authentificate method', () => {
        it('should return true if user credentials are valid', () => {
            const isAuthentificated = authentificationService.authentificate(
                'user',
                'password'
            );

            expect(isAuthentificated).toBe(true);
        });

        it('should return false if user credentials are invalid', () => {
            const isAuthentificated = authentificationService.authentificate(
                'user',
                'not valid password'
            );

            expect(isAuthentificated).toBe(false);
        });

        it('should return false  if credentials are not provided', () => {
            const isAuthentificated = authentificationService.authentificate(null, null);

            expect(isAuthentificated).toBe(false);
        });
    });
});
