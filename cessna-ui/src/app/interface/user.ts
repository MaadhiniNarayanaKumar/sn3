export interface User {
  first_name: string;
  last_name: string;
  email: string;
  phoneno: string;
  principle: Priciple;
  address: string;
  city: string;
  state: string;
  branch: string;
  created_date: string;
  updated_date: string;
}

export interface Priciple {
  functional_role: string;
  access_role: {};
}
