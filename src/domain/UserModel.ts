export interface UserModel {
  id: number;
  fullname: string,
  firstName: string;
  lastName: string;
  imgUrl: string;
  username: string;
  email: {
    name: string;
    verified: boolean;
  };
  phone: {
    number: string;
    verified: boolean;
  };
  sex: 'male' | 'female';
  birthday: string;
  lang: 'en' | 'de' | 'vi';
  country: string;
  city: string;
  address: string;
  address1: string;
  address2?: string;
  zipcode: number;
  website?: string;
  socials?: {
    twitter?: string;
    facebook?: string;
    linkedin?: string;
  };
  token: string;
}
