import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module'; // Importe o UserModule
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy'; // Estratégia para validar o JWT

@Module({
  imports: [
    JwtModule.register({
      secret: 'your-secret-key', // Substitua por uma chave mais segura
      signOptions: { expiresIn: '3600s' }, // Tempo de expiração do token
    }),
    UserModule, // Necessário se precisar buscar usuários para validar login
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
