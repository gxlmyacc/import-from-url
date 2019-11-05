var axios = require('axios');

function importFromUrl(url, options) {
	if (typeof url !== 'string') throw new TypeError('Expected a string');

  return new Promise(function(resolve, reject){
    var cache = importFromUrl.cached[url];
    if (cache) return cache.error ? reject(cache.error) : resolve(cache.module);

    url = importFromUrl.modules[url] || url;
    axios(Object.assign({ method: 'GET', url }, importFromUrl.options, options))
      .then(function(res){
      var string = res.data.toString();
      try {
        var _module = new module.constructor();
        _module.filename = url;
        _module._compile(string, url);

        importFromUrl.cached[url] = { module: _module.exports };
        resolve(_module.export);
      } catch (ex) {
        importFromUrl.cached[url] = { error: ex };
        reject(ex);
      }
    }).catch(reject);
  });
}
importFromUrl.modules = {};
importFromUrl.cached = {};
importFromUrl.options = {};

module.exports = importFromUrl;
