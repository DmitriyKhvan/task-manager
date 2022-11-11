const arrayToObject = (data: Array<any>) => {
  const obj = data.reduce((acc: any, cur: any) => {
    acc[cur.id] = cur;
    return acc;
  }, {});

  return obj;
};

export default arrayToObject;
