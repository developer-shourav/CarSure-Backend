

export const uniqueCarImageNameGenerator = (productName: string, brand: string, model: string, year: number) => {

  // --------Final image name
  const imageName = `${productName}-${brand}-${model}-${year}-car-image`;
  return { imageName };
};
export const uniqueUserImageNameGenerator = (name: string) => {

  // --------Final image name
  const imageName = `${name}-profile-image`;
  return { imageName };
};
