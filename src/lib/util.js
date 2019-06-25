var sigma = function(x) {
    return 1/(1 + Math.pow(Math.E, -x));
}

var sigmaDeriv = function(x) {
    let a = sigma(x) * (1 - sigma(x));

    return a;
}

var vecSub = function(a, b) {
    let c = [];

    for (let i = 0; i < a.length; i++) {
        c[i] = a[i] - b[i];
    }
    
    return c;
}

var hadamard = function(a, b) {
    let c = [];

    for (let i = 0; i < a.length; i++) {
        c[i] = a[i] * b[i];
    }

    return c;
}

var matTranspose = function(mat) {
    return mat[0].map((col, i) => mat.map(row => row[i]));
}

var argMax = function(arr) {
    if (arr.length === 0) {
        return -1;
    }

    var max = arr[0];
    var maxIndex = 0;

    for (var i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            maxIndex = i;
            max = arr[i];
        }
    }

    return maxIndex;
}

var genMatrix = function(row, col) {
    return [...Array(row)].map(x=>Array(col).fill(0));
}

module.exports = {
    sigma: sigma,
    sigmaDeriv: sigmaDeriv,
    vecSub: vecSub,
    hadamard: hadamard,
    matTranspose: matTranspose,
    argMax: argMax,
    genMatrix: genMatrix
}