export const arrayToObject = (data: Array<any>) => {
  const obj = data.reduce((acc: any, cur: any) => {
    acc[cur.id] = cur;
    return acc;
  }, {});

  return obj;
};

export const transformData = (data: any) => {
  let { tasks, columns, columnOrder } = data;

  tasks = tasks.map((task: any) => {
    return {
      ...task,
      links: JSON.parse(task.links),
      marks: JSON.parse(task.marks),
      nodes: JSON.parse(task.nodes),
    };
  });

  const tasksObj = arrayToObject(tasks);

  const columnsObj = arrayToObject(columns);

  return { tasks: tasksObj, columns: columnsObj, columnOrder };
};
