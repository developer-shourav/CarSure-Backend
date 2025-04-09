import config from '../config';
import { USER_ROLE } from '../modules/user/user.constant';
import { TUser } from '../modules/user/user.interface';
import { User } from '../modules/user/user.model';

const defaultAdmin: TUser = {
  name: config.default_admin_name as string,
  email: config.default_admin_email as string,
  password: config.default_admin_password as string,
  role: USER_ROLE.admin,
  isBlocked: false,
};

const seedDefaultAdmin = async () => {
  //when database is connected, we will check is there any user who is admin
  const isDefaultAdminExits = await User.findOne({ role: USER_ROLE.admin });

  if (!isDefaultAdminExits) {
    await User.create(defaultAdmin);
  }
};

export default seedDefaultAdmin;
