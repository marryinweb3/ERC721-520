//将 N 个token，分给所有 users，越靠前的 user 获得的 token 越多，第一个 user 是最后一个 user 的10倍，分布遵循线性
function distribute(total, users) {
  let percents = users.map((u, i) => {
    return 1 + ((10 * 1 - 1) * i) / (users.length - 1);
  });
  const totalPercents = percents.reduce((a, b) => a + b, 0);
  const result = percents.map((p, i) => {
    return (total * p) / totalPercents;
  });
  return result;
}

console.log(distribute(10000, ["a", "b", "c"]));

/**
usercount    token    countStep
0            1,       +100 
100          2,       +200 
300          3,       +300 
600          4,       +400 
1000         5,       +500 
1500         6,       +600 


...
    */
