import {isEmail} from 'validator';
import {CreateUser} from '../types/user';

const MIN_PASSWORD_LENGTH = 6;

export const validateCreateUser = (user: CreateUser) => {
  const {username, email, password} = user;
  const errors: string[] = [];

  if (typeof email !== 'string') {
    errors.push('Email is required.');
  } else if (!isEmail(email)) {
    errors.push('Wrong email.');
  }

  if (typeof username !== 'string' || username.trim().length === 0){
    errors.push('Username is required.');
  }

  if (typeof password !== 'string' || password.length < MIN_PASSWORD_LENGTH) {
    errors.push(`Password should be at least ${MIN_PASSWORD_LENGTH} characters long.`);
  }

  return errors;
};
