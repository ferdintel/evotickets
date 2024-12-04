export type LoginFormValues = {
  email: string;
  password: string;
};

export type RegisterFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type AuthFormValues = LoginFormValues | RegisterFormValues;
