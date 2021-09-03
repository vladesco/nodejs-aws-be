import { AuthentificationServiceConfig } from '../types';

export class AuthentificationService {
    constructor(private authentificationServiceConfig: AuthentificationServiceConfig) {}

    public authentificate(userName: string, passwrod: string): boolean {
        if (!userName || !passwrod) {
            return false;
        }

        const { users } = this.authentificationServiceConfig;

        return users[userName] === passwrod;
    }
}
