interface TArray {
  id: string;
  limitNumber: number;
  used: number;
  code:string
}

const getRandomItems = (array: TArray[], numItems: number) => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numItems);
};

export default getRandomItems;
