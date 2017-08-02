
const arr = []
for (let i = 65; i < 91; i++) {
    arr.push(String.fromCharCode(i))
}
let index = 0
function fill(num) {
    let newArr = []
    while (num >= 0) {
        newArr.unshift(arr[num % 26])
        num = Math.floor(num / 26) - 1
    }
    console.log(newArr.join(''))
}

new Array(100).fill(1).map((item, index) => {
    return index
}).forEach(item => {
    //fill(item)
})




function resolveAfter2Seconds(x) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(x);
        }, 1000);
    });
}

async function f1() {
    var x = await resolveAfter2Seconds(10);
    // console.log('====================================');
    // console.log('async   await');
    // console.log('====================================');
    // console.log(x); // 10
}
f1();

module.exports = {}