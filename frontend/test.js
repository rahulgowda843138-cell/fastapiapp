console.log("Hello World");
/* let x=10;
console.log(x);
const y =20;
console.log(y);
console.log(x+y);*/

/*function add(x,y){
    return x+y;
}*/
/*console.log(add(10,20));
const arr = [10,20,30,40,50];
console.log(arr[0]);
console.log(arr[1]);
console.log(arr[2]);
console.log(arr[3]);
console.log(arr[4]);*/

//dictionary

// const dict ={"name": "rahul","age":21,"city":"Banglore"};
// console.log(dict.name);

// //dest 
// let{name,age,city}=dict;
// console.log(name);
// console.log(age);
// console.log(city);

// //dest array
// const arr = [10,20,30,40,50];
// let [a,b,c,d,e]=arr;
// console.log(a);
// console.log(b);
// console.log(c);
// console.log(d);
// console.log(e);

// //rest and spread

// let a=[10,20];
// let b=[30,40];
// console.log(...a,...b);
// console.log([...a,...b]);

//rest opertor

function add(a,...b){
    return a+b;
}
console.log(add(10,20));
console.log(add(10,20,30));
console.log(add(10,20,30,40));

//template literals
const a= 10;
const b =20;
console.log(`The sum add ${a} and ${b} is ${a+b}`);