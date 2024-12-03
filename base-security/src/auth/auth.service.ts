import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service'; 
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  // Função para comparar a senha fornecida com a senha encriptada
  async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    const secretKey = process.env.SECRET_KEY;
    if (!secretKey) {
      throw new Error('SECRET_KEY não definida no .env');
    }
    
    return bcrypt.compare(password + secretKey, hashedPassword);
  }

  // Valida o usuário e gera o JWT
  async login(email: string, password: string) {
    const user = await this.userService.findByEmail(email); // Método que você criaria no UserService
    if (user && this.comparePassword(password, user.password)) { // Validação simples de senha (melhor usar hash)
      const payload = { email: user.email, sub: user.id }; // Dados que vão no JWT
      return {
        access_token: this.jwtService.sign(payload), // Gera o JWT
      };
    }
    throw new Error('Invalid credentials');
  }

  // Método opcional para validar o usuário usando JWT (será usado pelo JwtStrategy)
  async validateUser(payload: { email: string; sub: number }) {
    return this.userService.findById(payload.sub); // Retorna o usuário pelo ID
  }
}
