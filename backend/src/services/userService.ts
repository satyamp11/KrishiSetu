import fs from 'fs';
import path from 'path';
import { User, UserResponse, RegisterDTO } from '../models/User.js';

const DATA_DIR = path.resolve(process.cwd(), 'src/data');
const USERS_FILE = path.join(DATA_DIR, 'usersStore.json');

// Helper to ensure data directory and file exist
function ensureUsersStoreFile(): User[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(USERS_FILE)) {
      fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2), 'utf-8');
      return [];
    }
    const content = fs.readFileSync(USERS_FILE, 'utf-8');
    return JSON.parse(content || '[]');
  } catch (err) {
    console.error('Error reading users store file:', err);
    return [];
  }
}

function saveUsersStore(users: User[]): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving users store file:', err);
  }
}

let usersStore: User[] = ensureUsersStoreFile();

export const userService = {
  findUserByEmailOrPhone(emailOrPhone: string): User | undefined {
    const query = emailOrPhone.trim().toLowerCase();
    return usersStore.find((u) => u.emailOrPhone.toLowerCase() === query);
  },

  findUserById(id: string): User | undefined {
    return usersStore.find((u) => u.id === id);
  },

  createUser(dto: RegisterDTO, passwordHash: string): User {
    const now = new Date().toISOString();
    const newUser: User = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: dto.name.trim(),
      emailOrPhone: dto.emailOrPhone.trim().toLowerCase(),
      passwordHash: passwordHash,
      state: dto.state.trim(),
      district: dto.district.trim(),
      village: dto.village?.trim() || '',
      primaryCrop: dto.primaryCrop?.trim() || '',
      createdAt: now,
      updatedAt: now
    };

    usersStore.push(newUser);
    saveUsersStore(usersStore);
    return newUser;
  },

  toUserResponse(user: User): UserResponse {
    return {
      id: user.id,
      name: user.name,
      emailOrPhone: user.emailOrPhone,
      state: user.state,
      district: user.district,
      village: user.village,
      primaryCrop: user.primaryCrop,
      createdAt: user.createdAt
    };
  }
};
