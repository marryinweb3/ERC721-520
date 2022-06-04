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
/**
    0    0.01,  +100*0.01 = 1
    100  0.02,  +200*0.02 = 4
    400  0.03,  +300*0.03 = 9
    800  0.04,  +400*0.04 = 16
    1300 0.05,  +500*0.05 = 25   0.05*2000*6.5 = 650 元
    1900+ 0.05, 
    10000+ 

    白名单 1000 个



    1500 0.06,  +600*0.06 = 36
    2100 0.07,  +700*0.07 = 49
    2800 0.08,  +800*0.08 = 64
    3600 0.09,  +900*0.09 = 81
    4500+ 0.10,  +5500*0.10 = 550


    0    0.01 
    100  0.02
    300  0.03
    600  0.04
    1000 0.05
    1500 0.06
    2100 0.07
    2800 0.08
    3600 0.09
    4500+ 0.10
    */
