export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}
