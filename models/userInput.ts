export class User {
    first_name: string;
    last_name: string;
    email: string;
    major: string;
    w_num: string;
    password: string;
}

export class UserService {
    selectedUser: User = {
      first_name: '',
      last_name: '',
      email: '',
      major: '',
      w_num: '',
      password: '',
    };
}