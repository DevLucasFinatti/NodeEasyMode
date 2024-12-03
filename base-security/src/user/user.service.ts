import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class UserService {
    private saltRounds = 10;

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    // Função para criptografar a senha com o SECRET_KEY
    private async encryptPassword(password: string): Promise<string> {
        const secretKey = process.env.SECRET_KEY; // Pega a chave secreta do .env
        if (!secretKey) {
          throw new Error('SECRET_KEY não definida no .env');
        }
    
        // Encriptando a senha com bcrypt
        const encryptedPassword = await bcrypt.hash(password + secretKey, this.saltRounds); 
        return encryptedPassword;
      }
    
    // Função para criar um novo usuário
    async createUser(name: string, email: string, password: string): Promise<User> {
        const user = new User();
        user.name = name;
        user.email = email;
        user.password = await this.encryptPassword(password);
        return this.userRepository.save(user);
    }

    // Função para encontrar um usuário por ID
    async findOne(id: number): Promise<User> {
        return this.userRepository.findOne({ where: { id } });
    }

    // Função para listar todos os usuários
    async findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    // Função para atualizar um usuário
    async update(id: number, name: string, email: string, password: string): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id } });
        if (user) {
          user.name = name;
          user.email = email;
          user.password = await this.encryptPassword(password); // Criptografa a nova senha antes de salvar
          return this.userRepository.save(user);
        }
        return null;
    }

    // Função para encontrar um usuário por email
    async findByEmail(email: string): Promise<User | undefined> {
        return this.userRepository.findOne({ where: { email } });
    }

    async findById(id: number): Promise<User | undefined> {
        return this.userRepository.findOne({ where: { id } });
    }
}
