import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service'; // Serviço para validar o usuário

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'your-secret-key', // A chave secreta usada para validar o JWT
    });
  }

  async validate(payload: any) {
    // Aqui, você valida o payload do JWT e pode retornar o usuário
    return this.authService.validateUser(payload); // Retorna o usuário com base no payload
  }
}
