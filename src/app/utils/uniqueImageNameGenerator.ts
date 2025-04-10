export type TUserName = {
  firstName: string;
  middleName: string;
  lastName: string;
};

export const uniqueImageNameGenerator = (userName: TUserName, id: string) => {
  // -------- Generate a unique username
  let fullName = '';
  const firstName = userName?.firstName;
  const middleName = userName?.middleName;
  const lastName = userName?.lastName;

  if (firstName && middleName && lastName) {
    fullName = `${firstName}_${middleName}_${lastName}`;
  } else if (firstName && lastName) {
    fullName = `${firstName}_${lastName}`;
  } else {
    fullName = firstName;
  }

  // --------Final image name
  const imageName = `${fullName}-${id}-profile-image`;
  return { imageName };
};
