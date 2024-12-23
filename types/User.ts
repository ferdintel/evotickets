export interface User {
  uid: string;
  isAdmin: boolean;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  displayName: string | null;
  photoUrl: string | null;
}
