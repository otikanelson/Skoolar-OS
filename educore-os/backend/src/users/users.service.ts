import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

export interface User {
  id: string;
  email: string;
  password: string;
  role: 'admin' | 'teacher' | 'parent' | 'student';
  schoolId: string;
  name: string;
}

@Injectable()
export class UsersService {
  // In-memory user storage (replace with database later)
  private users: User[] = [];

  constructor() {
    // Seed with demo users
    this.seedUsers();
  }

  private async seedUsers() {
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    this.users = [
      {
        id: '1',
        email: 'admin@greenfield.edu',
        password: hashedPassword,
        role: 'admin',
        schoolId: 'greenfield',
        name: 'Admin User',
      },
      {
        id: '2',
        email: 'teacher@greenfield.edu',
        password: hashedPassword,
        role: 'teacher',
        schoolId: 'greenfield',
        name: 'Mrs. Adeyemi Folake',
      },
      {
        id: '3',
        email: 'parent@greenfield.edu',
        password: hashedPassword,
        role: 'parent',
        schoolId: 'greenfield',
        name: 'Mr. Okafor',
      },
      {
        id: '4',
        email: 'student@greenfield.edu',
        password: hashedPassword,
        role: 'student',
        schoolId: 'greenfield',
        name: 'Chukwudi Okafor',
      },
    ];
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find(user => user.email === email);
  }

  async findById(id: string): Promise<User | undefined> {
    return this.users.find(user => user.id === id);
  }

  async create(userData: Omit<User, 'id'>): Promise<User> {
    const newUser: User = {
      id: (this.users.length + 1).toString(),
      ...userData,
    };
    this.users.push(newUser);
    return newUser;
  }

  async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}
