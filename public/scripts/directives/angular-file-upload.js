/**!
 * AngularJS file upload/drop directive with http post and progress
 * @author  Danial  <danial.farid@gmail.com>
 * @version <%= pkg.version %>
 */
(function() {

//var angularFileUpload = angular.module('angularFileUpload', []);

// angularFileUpload.service('$upload', ['$http', '$q', '$timeout', function($http, $q, $timeout) {
// 	function sendHttp(config) {
// 		config.method = config.method || 'POST';
// 		config.headers = config.headers || {};
// 		config.transformRequest = config.transformRequest || function(data, headersGetter) {
// 			if (window.ArrayBuffer && data instanceof window.ArrayBuffer) {
// 				return data;
// 			}
// 			return $http.defaults.transformRequest[0](data, headersGetter);
// 		};
// 		var deferred = $q.defer();

// 		if (window.XMLHttpRequest.__isShim) {
// 			config.headers['__setXHR_'] = function() {
// 				return function(xhr) {
// 					if (!xhr) return;
// 					config.__XHR = xhr;
// 					config.xhrFn && config.xhrFn(xhr);
// 					xhr.upload.addEventListener('progress', function(e) {
// 						deferred.notify(e);
// 					}, false);
// 					//fix for firefox not firing upload progress end, also IE8-9
// 					xhr.upload.addEventListener('load', function(e) {
// 						if (e.lengthComputable) {
// 							deferred.notify(e);
// 						}
// 					}, false);
// 				};
// 			};
// 		}

// 		$http(config).then(function(r){deferred.resolve(r)}, function(e){deferred.reject(e)}, function(n){deferred.notify(n)});
		
// 		var promise = deferred.promise;
// 		promise.success = function(fn) {
// 			promise.then(function(response) {
// 				fn(response.data, response.status, response.headers, config);
// 			});
// 			return promise;
// 		};

// 		promise.error = function(fn) {
// 			promise.then(null, function(response) {
// 				fn(response.data, response.status, response.headers, config);
// 			});
// 			return promise;
// 		};

// 		promise.progress = function(fn) {
// 			promise.then(null, null, function(update) {
// 				fn(update);
// 			});
// 			return promise;
// 		};
// 		promise.abort = function() {
// 			if (config.__XHR) {
// 				$timeout(function() {
// 					config.__XHR.abort();
// 				});
// 			}
// 			return promise;
// 		};
// 		promise.xhr = function(fn) {
// 			config.xhrFn = (function(origXhrFn) {
// 				return function() {
// 					origXhrFn && origXhrFn.apply(promise, arguments);
// 					fn.apply(promise, arguments);
// 				}
// 			})(config.xhrFn);
// 			return promise;
// 		};
		
// 		return promise;
// 	}

// 	this.upload = function(config) {
// 		config.headers = config.headers || {};
// 		config.headers['Content-Type'] = undefined;
// 		config.transformRequest = config.transformRequest || $http.defaults.transformRequest;
// 		var formData = new FormData();
// 		var origTransformRequest = config.transformRequest;
// 		var origData = config.data;
// 		config.transformRequest = function(formData, headerGetter) {
// 			if (origData) {
// 				if (config.formDataAppender) {
// 					for (var key in origData) {
// 						var val = origData[key];
// 						config.formDataAppender(formData, key, val);
// 					}
// 				} else {
// 					for (var key in origData) {
// 						var val = origData[key];
// 						if (typeof origTransformRequest == 'function') {
// 							val = origTransformRequest(val, headerGetter);
// 						} else {
// 							for (var i = 0; i < origTransformRequest.length; i++) {
// 								var transformFn = origTransformRequest[i];
// 								if (typeof transformFn == 'function') {
// 									val = transformFn(val, headerGetter);
// 								}
// 							}
// 						}
// 						formData.append(key, val);
// 					}
// 				}
// 			}

// 			if (config.file != null) {
// 				var fileFormName = config.fileFormDataName || 'file';

// 				if (Object.prototype.toString.call(config.file) === '[object Array]') {
// 					var isFileFormNameString = Object.prototype.toString.call(fileFormName) === '[object String]';
// 					for (var i = 0; i < config.file.length; i++) {
// 						formData.append(isFileFormNameString ? fileFormName : fileFormName[i], config.file[i], 
// 								(config.fileName && config.fileName[i]) || config.file[i].name);
// 					}
// 				} else {
// 					formData.append(fileFormName, config.file, config.fileName || config.file.name);
// 				}
// 			}
// 			return formData;
// 		};

// 		config.data = formData;

// 		return sendHttp(config);
// 	};

// 	this.http = function(config) {
// 		return sendHttp(config);
// 	}
// }]);

// angularFileUpload.directive('ngFileSelect', [ '$parse', '$timeout', function($parse, $timeout) {
// 	return function(scope, elem, attr) {
// 		var fn = $parse(attr['ngFileSelect']);
// 		if (elem[0].tagName.toLowerCase() !== 'input' || (elem.attr('type') && elem.attr('type').toLowerCase()) !== 'file') {
// 			var fileElem = angular.element('<input type="file">')
// 			for (var i = 0; i < elem[0].attributes.length; i++) {
// 				fileElem.attr(elem[0].attributes[i].name, elem[0].attributes[i].value);
// 			}
// 			if (elem.attr("data-multiple")) fileElem.attr("multiple", "true");
// 			fileElem.css("top", 0).css("bottom", 0).css("left", 0).css("right", 0).css("width", "100%").
// 					css("opacity", 0).css("position", "absolute").css('filter', 'alpha(opacity=0)');
// 			elem.append(fileElem);
// 			if (elem.css("position") === '' || elem.css("position") === 'static') {
// 				elem.css("position", "relative");
// 			}
// 			elem = fileElem;
// 		}
// 		elem.bind('change', function(evt) {
// 			var files = [], fileList, i;
// 			fileList = evt.__files_ || evt.target.files;
// 			if (fileList != null) {
// 				for (i = 0; i < fileList.length; i++) {
// 					files.push(fileList.item(i));
// 				}
// 			}
// 			$timeout(function() {
// 				fn(scope, {
// 					$files : files,
// 					$event : evt
// 				});
// 			});
// 		});
// 	};
// } ]);

})();
