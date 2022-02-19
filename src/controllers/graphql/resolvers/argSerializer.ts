const serializeWhereFilter = (where: any) => {
  let jsonStr = JSON.stringify(where);
  jsonStr = jsonStr.replace(/_/g, '$');

  // convert to readable json
  const serializedWhere = JSON.parse(jsonStr);

  return serializedWhere;
};

export default serializeWhereFilter;
