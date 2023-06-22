//generateInput(n: number): number[][]
function generateInput(n) {
  let arr = [];
  let rand = 0;
  for (let i = 0; i < n; ++i) {
    let row = [];
    for (let j = 0; j < n; ++j) {
      rand = randomInt(0, n);
      while(row.includes(rand)) {
        rand = randomInt(0,n);
      }
        row.push(rand);
      }
      arr.push(row);
    }
  return arr;
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

//runOracle(f: (companies: number[][], candidates: number[][]) => Run): void
function runOracle(f) {
  let numTests = 15; // Change this to some reasonably large value
  for (let i = 0; i < numTests; ++i) {
    let n = 10; // Change this to some reasonable size
    let companies = generateInput(n);
    let candidates = generateInput(n);
    let run = f(companies, candidates);
  test('test trace', function() {
    let offers = run.trace;
    let candidateOffers = Array.create(n, 0);
    let companyOffers = Array.create(n, 0);
    
    offers.forEach(offer => {
      let from = offer.from;
      let to = offer.to;
      let fromCo = offer.fromCo;
      let variable = fromCo ? companies : candidates;
      let variableOffers = fromCo ? companyOffers : candidateOffers;
      let fromPreference = variable[from];
      let nextIndex = variableOffers[from];
      if (fromPreference[nextIndex] !== to) {
        assert(false);
      } else {
        ++variableOffers[from];
      }
    });
  });
  test('out length', function() {
    assert(companies.length >= run.out.length);
  });
  test('test out', function () {
    let currMatches = run.out;
    let offers = run.trace;
    let counter = 0;
    
    for (let i = 0; i < currMatches.length; ++i) {
        let co = currMatches[i].company;
        let ca = currMatches[i].candidate;

      for (let j = 0; j < offers.length; ++j) {
         let from = offers[j].from;
         let to = offers[j].to;

         if (from === co && to === ca) {
          ++counter;
          break;
        } else {
          if (to === co && from === ca) {
            ++counter;
            break;
          }
        }
      }
  }
  assert(counter === currMatches.length);
  });
  test('cannot be unmatced', function() {
    let offers = run.trace;
    let hire = run.out;
    

    for (let i = 0; i < offers.length; ++i) {
    let fromPreference = offers[i].from;
    let toPreference = offers[i].to;
    let fromCo = offers[i].fromCo;
    let bo = false;
    if (fromCo) {
    if (companies[fromPreference] === candidates[toPreference]) {
      bo = hire.some(x => (x.from === fromPreference) && (x.to === toPreference));
      assert(bo === true);
    }
  } else {
    if (candidates[fromPreference] === companies[toPreference]) {
      bo = hire.some(x => (x.from === fromPreference) && (x.to === toPreference));
      assert(bo === true);
  }
  }   
  }
  });
}
}

//tests
test('test runOracle with trace with wheat1 and chaff1', function() {
  const oracleLib = require('oracle');
  runOracle(oracleLib.traceWheat1);
  runOracle(oracleLib.traceChaff1);
});