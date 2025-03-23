export interface User {
  uid: string;
  isAdmin: boolean;
  email: string | null;
  displayName: string | null;
  photoUrl: string | null;
}
