import qs from 'qs';
const a = [1,2,3]
console.log(qs.stringify({a, b: 'a', c: {e: 1}}, {arrayFormat: 'repeat'}));
