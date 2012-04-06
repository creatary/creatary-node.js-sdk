var libpath = process.env['CREATARY_COV'] ? './lib-cov/' : './lib/';

exports.load = function(file) {
	return require(libpath + file);
}
