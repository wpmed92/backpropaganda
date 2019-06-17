var sigma = function(x) {
    return 1/(1 + Math.pow(Math.E, -x));
}

var sigmaDeriv = function(x) {
    return sigma(x) * (1 - sigma(x));
}

module.exports = {
    sigma: sigma,
    sigmaDeriv: sigmaDeriv
}