//
// CWS: This has been packaged in accordance with advice provided by Jose Padilla of the CWS. Questions? Reach us at contact@fairsharelabs.com
// End Users: Learn more about Fairshare at the links below. Email us if you have any questions!
// Overview: https://www.fairsharelabs.com/analytics
// Privacy Policy: https://www.fairsharelabs.com/privacy
// Opt-out: https://www.fairsharelabs.com/opt-out
//

!function(root, window) {
    !function(root) {
        function createIndexFinder(dir) {
            return function(array, predicate, context) {
                predicate = cb(predicate, context);
                for (var length = null != array && array.length, index = dir > 0 ? 0 : length - 1; index >= 0 && length > index; index += dir) if (predicate(array[index], index, array)) return index;
                return -1;
            };
        }
        var _ = function(obj) {
            return obj instanceof _ ? obj : this instanceof _ ? void (root._wrapped = obj) : new _(obj);
        };
        root._ = _;
        var createAssigner = function(keysFunc, undefinedOnly) {
            return function(obj) {
                var length = arguments.length;
                if (2 > length || null == obj) return obj;
                for (var index = 1; length > index; index++) for (var source = arguments[index], keys = keysFunc(source), l = keys.length, i = 0; l > i; i++) {
                    var key = keys[i];
                    undefinedOnly && void 0 !== obj[key] || (obj[key] = source[key]);
                }
                return obj;
            };
        }, flatten = function(input, shallow, strict, startIndex) {
            for (var output = [], idx = 0, i = startIndex || 0, length = input && input.length; length > i; i++) {
                var value = input[i];
                if (isArrayLike(value) && (Array.isArray(value) || _.isArguments(value))) {
                    shallow || (value = flatten(value, shallow, strict));
                    var j = 0, len = value.length;
                    for (output.length += len; len > j; ) output[idx++] = value[j++];
                } else strict || (output[idx++] = value);
            }
            return output;
        }, optimizeCb = function(func, context, argCount) {
            if (void 0 === context) return func;
            switch (null == argCount ? 3 : argCount) {
                case 1:
                    return function(value) {
                        return func.call(context, value);
                    };

                case 2:
                    return function(value, other) {
                        return func.call(context, value, other);
                    };

                case 3:
                    return function(value, index, collection) {
                        return func.call(context, value, index, collection);
                    };

                case 4:
                    return function(accumulator, value, index, collection) {
                        return func.call(context, accumulator, value, index, collection);
                    };
            }
            return function() {
                return func.apply(context, arguments);
            };
        }, cb = function(value, context, argCount) {
            return null == value ? _.identity : _.isFunction(value) ? optimizeCb(value, context, argCount) : _.isObject(value) ? _.matcher(value) : _.property(value);
        };
        _.functions = _.methods = function(obj) {
            var names = [];
            for (var key in obj) _.isFunction(obj[key]) && names.push(key);
            return names.sort();
        }, _.extendOwn = createAssigner(_.keys), _.extendFunctions = createAssigner(_.functions),
            _.matcher = function(attrs) {
                return attrs = _.extendOwn({}, attrs), function(obj) {
                    return _.isMatch(obj, attrs);
                };
            }, _.isMatch = function(object, attrs) {
            var keys = _.keys(attrs), length = keys.length;
            if (null == object) return !length;
            for (var obj = Object(object), i = 0; length > i; i++) {
                var key = keys[i];
                if (attrs[key] !== obj[key] || !(key in obj)) return !1;
            }
            return !0;
        }, _.identity = function(value) {
            return value;
        }, _.property = function(key) {
            return function(obj) {
                return null == obj ? void 0 : obj[key];
            };
        }, _.keys = function(obj) {
            return _.isObject(obj) ? Object.keys(obj) : [];
        }, _.each = function(obj, iteratee, context) {
            iteratee = optimizeCb(iteratee, context);
            var i, length;
            if (isArrayLike(obj)) for (i = 0, length = obj.length; length > i; i++) iteratee(obj[i], i, obj); else {
                var keys = _.keys(obj);
                for (i = 0, length = keys.length; length > i; i++) iteratee(obj[keys[i]], keys[i], obj);
            }
            return obj;
        };
        var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1, isArrayLike = function(collection) {
            var length = collection && collection.length;
            return "number" == typeof length && length >= 0 && MAX_ARRAY_INDEX >= length;
        };
        _.isObject = function(obj) {
            var type = typeof obj;
            return "function" === type || "object" === type && !!obj;
        }, _.isFunction = function(obj) {
            return "function" == typeof obj || !1;
        }, _.isBoolean = function(obj) {
            return obj === !0 || obj === !1 || "[object Boolean]" === toString.call(obj);
        }, _.allKeys = function(obj) {
            if (!_.isObject(obj)) return [];
            var keys = [];
            for (var key in obj) keys.push(key);
            return keys;
        }, _.result = function(object, property, fallback) {
            var value = null == object ? void 0 : object[property];
            return void 0 === value && (value = fallback), _.isFunction(value) ? value.call(object) : value;
        }, _.has = function(obj, key) {
            return null != obj && hasOwnProperty.call(obj, key);
        }, _.extend = createAssigner(_.allKeys), _.defaults = createAssigner(_.allKeys, !0),
            _.unique = function(array, isSorted, iteratee, context) {
                if (null == array) return [];
                _.isBoolean(isSorted) || (context = iteratee, iteratee = isSorted, isSorted = !1),
                null != iteratee && (iteratee = cb(iteratee, context));
                for (var result = [], seen = [], i = 0, length = array.length; length > i; i++) {
                    var value = array[i], computed = iteratee ? iteratee(value, i, array) : value;
                    isSorted ? (i && seen === computed || result.push(value), seen = computed) : iteratee ? _.contains(seen, computed) || (seen.push(computed),
                        result.push(value)) : _.contains(result, value) || result.push(value);
                }
                return result;
            }, _.contains = function(obj, target, fromIndex) {
            return isArrayLike(obj) || (obj = _.values(obj)), _.indexOf(obj, target, "number" == typeof fromIndex && fromIndex) >= 0;
        }, _.difference = function(array) {
            var rest = flatten(arguments, !0, !0, 1);
            return _.filter(array, function(value) {
                return !_.contains(rest, value);
            });
        }, _.filter = function(obj, predicate, context) {
            var results = [];
            return predicate = cb(predicate, context), _.each(obj, function(value, index, list) {
                predicate(value, index, list) && results.push(value);
            }), results;
        }, _.values = function(obj) {
            for (var keys = _.keys(obj), length = keys.length, values = Array(length), i = 0; length > i; i++) values[i] = obj[keys[i]];
            return values;
        }, _.indexOf = function(array, item, isSorted) {
            var i = 0, length = array && array.length;
            if ("number" == typeof isSorted) i = 0 > isSorted ? Math.max(0, length + isSorted) : isSorted; else if (isSorted && length) return i = _.sortedIndex(array, item),
                array[i] === item ? i : -1;
            if (item !== item) return _.findIndex(slice.call(array, i), _.isNaN);
            for (;length > i; i++) if (array[i] === item) return i;
            return -1;
        }, _.isNaN = function(obj) {
            return _.isNumber(obj) && obj !== +obj;
        }, _.isNumber = function(obj) {
            return "[object Number]" === toString.call(obj);
        }, _.isArguments = function(obj) {
            return "[object Arguments]" === toString.call(obj);
        }, _.sortedIndex = function(array, obj, iteratee, context) {
            iteratee = cb(iteratee, context, 1);
            for (var value = iteratee(obj), low = 0, high = array.length; high > low; ) {
                var mid = Math.floor((low + high) / 2);
                iteratee(array[mid]) < value ? low = mid + 1 : high = mid;
            }
            return low;
        }, _.findIndex = createIndexFinder(1);
    }(root), function(root, factory) {
        root.Spine = factory(root, {}, root._);
    }(root, function(root, Spine, _) {
        var Model = Spine.Model = function(attributes, options) {
            var attrs = attributes || {};
            options || (options = {}), this.attributes = {}, attrs = _.defaults({}, attrs, _.result(this, "defaults")),
                this.set(attrs, options), this.initialize.apply(this, arguments);
        };
        return _.extend(Model.prototype, {
            initialize: function() {},
            get: function(attr) {
                return this.attributes[attr];
            },
            has: function(attr) {
                return null != this.get(attr);
            },
            set: function(key, val, options) {
                var attr, attrs, unset;
                if (null == key) return this;
                "object" == typeof key ? (attrs = key, options = val) : (attrs = {})[key] = val,
                options || (options = {}), unset = options.unset;
                for (attr in attrs) unset ? delete this.attributes[attr] : this.attributes[attr] = attrs[attr];
                return this;
            },
            unset: function(attr, options) {
                return this.set(attr, void 0, _.extend({}, options, {
                    unset: !0
                }));
            }
        }), Model.extend = function(protoProps, staticProps) {
            var child, parent = this;
            child = protoProps && _.has(protoProps, "constructor") ? protoProps.constructor : function() {
                return parent.apply(this, arguments);
            }, _.extend(child, parent, staticProps);
            var Surrogate = function() {
                this.constructor = child;
            };
            return Surrogate.prototype = parent.prototype, child.prototype = new Surrogate(),
            protoProps && _.extend(child.prototype, protoProps), child.__super__ = parent.prototype,
                child;
        }, Spine;
    }), function(root) {
        root.FAIRSHARE_CONF = {
            LOG_LEVEL: 4,
            SERVER_URL: "https://b.networkanalytics.net",
            PARTNER_ID: "39299",
            GROUP_ID: "BRWKS-FS-CR-8a7205e2aa8f927b",
            APP_TYPE: "analytics"
        };
    }(root), function(root, window) {
        var Spine = root.Spine, _ = root._, FAIRSHARE_CONF = root.FAIRSHARE_CONF, LOG_LEVEL = root.LOG_LEVEL = {
            DEBUG: 1,
            INFO: 2,
            WARN: 3,
            ERROR: 4,
            Desc: {
                1: "DEBUG",
                2: "INFO",
                3: "WARN",
                4: "ERROR"
            }
        }, Logger = root.Logger = function(logger_name, logger_level) {
            var write = function(message, log_level) {
                function pad(number) {
                    var r = String(number);
                    return 1 === r.length && (r = "0" + r), r;
                }
                if (!(logger_level > log_level)) {
                    var today = new Date(), current_time = today.getFullYear() + "-" + pad(today.getMonth() + 1) + "-" + pad(today.getDate()) + " " + pad(today.getHours()) + ":" + pad(today.getMinutes()) + ":" + pad(today.getSeconds()), message = "[FAIRSHARE] " + current_time + "	" + LOG_LEVEL.Desc[log_level] + "	" + logger_name + ":	" + message;
                    switch (log_level) {
                        case LOG_LEVEL.DEBUG:
                            console.log(message);
                            break;

                        case LOG_LEVEL.INFO:
                            console.info(message);
                            break;

                        case LOG_LEVEL.WARN:
                            console.warn(message);
                            break;

                        case LOG_LEVEL.ERROR:
                            console.error(message);
                    }
                }
            };
            return {
                log: function(message) {
                    return write(message, LOG_LEVEL.DEBUG);
                },
                warn: function(message) {
                    return write(message, LOG_LEVEL.WARN);
                },
                info: function(message) {
                    return write(message, LOG_LEVEL.INFO);
                },
                error: function(message) {
                    return write(message, LOG_LEVEL.ERROR);
                }
            };
        }, BaseComponent = (root.FileStorage = Spine.Model.extend({
            initialize: function(file_name, storage_type) {
                this._storage_type = storage_type, this._file_name = file_name, this._filesystem = null;
            },
            init_fs: function(on_sucess, on_failure) {
                var storage_memory = 5242880;
                if (this._filesystem) on_sucess(); else {
                    var on_init_fs = function(fs) {
                        this._filesystem = fs, on_sucess();
                    }.bind(this);
                    window.webkitRequestFileSystem(this._storage_type, storage_memory, on_init_fs, on_failure);
                }
            },
            getFailureCallback: function(callback, callbackValue) {
                return function(error) {
                    callback && callback(callbackValue || !1);
                }.bind(this);
            },
            doRead: function(onSuccess, onFailure) {
                this._filesystem.root.getFile(this._file_name, {}, function(fileEntry) {
                    fileEntry.file(function(file) {
                        var reader = new FileReader();
                        reader.onloadend = function(e) {
                            onSuccess(this.result);
                        }, reader.readAsText(file);
                    }, onFailure);
                }, onFailure);
            },
            doWrite: function(onSuccess, onFailure, value, overwrite) {
                this._filesystem.root.getFile(this._file_name, {
                    create: !0
                }, function(fileEntry) {
                    fileEntry.createWriter(function(fileWriter) {
                        fileWriter.onwriteend = function(e) {
                            onSuccess(!0);
                        }, fileWriter.onerror = function(e) {
                            console.log("Write failed: " + e.toString()), onFailure();
                        };
                        var blob = new Blob([ value ], {
                            type: "text/plain"
                        });
                        overwrite || fileWriter.seek(fileWriter.length), fileWriter.write(blob);
                    }, onFailure);
                }, onFailure);
            },
            doTruncate: function(onSuccess, onFailure) {
                this._filesystem.root.getFile(this._file_name, {
                    create: !1
                }, function(fileEntry) {
                    fileEntry.createWriter(function(fileWriter) {
                        fileWriter.onwriteend = function(e) {
                            onSuccess(!0);
                        }, fileWriter.onerror = function(e) {
                            console.log("Truncate failed: " + e.toString()), onFailure();
                        }, fileWriter.truncate(0);
                    }, onFailure);
                }, onFailure);
            },
            doExist: function(onSuccess, onFailure) {
                this._filesystem.root.getFile(this._file_name, {
                    create: !1
                }, function(fileEntry) {
                    onSuccess(!0);
                }, onFailure);
            },
            doRemove: function(onSuccess, onFailure) {
                this._filesystem.root.getFile(this._file_name, {
                    create: !1
                }, function(fileEntry) {
                    fileEntry.remove(function() {
                        onSuccess(!0);
                    }, onFailure);
                }, onFailure);
            },
            read: function(callback) {
                var onFailure = this.getFailureCallback(callback, null), onSuccess = function() {
                    this.doRead(callback, onFailure);
                }.bind(this);
                this.init_fs(onSuccess, onFailure);
            },
            get_file_entry: function(callback) {
                var onFailure = this.getFailureCallback(callback, null), onSuccess = function() {
                    this._filesystem.root.getFile(this._file_name, {
                        create: !1
                    }, function(fileEntry) {
                        callback(fileEntry);
                    }, onFailure);
                }.bind(this);
                this.init_fs(onSuccess, onFailure);
            },
            write: function(callback, value) {
                var onFailure = this.getFailureCallback(callback), writeCallback = function() {
                    this.doWrite(callback, onFailure, value, !0);
                }.bind(this), onSuccessInit = function() {
                    this.exist(function(fileExists) {
                        fileExists ? this.doTruncate(writeCallback, onFailure) : writeCallback();
                    }.bind(this));
                }.bind(this);
                this.init_fs(onSuccessInit, onFailure);
            },
            append: function(callback, value) {
                var onFailure = this.getFailureCallback(callback), onSuccess = function() {
                    this.doWrite(callback, onFailure, value, !1);
                }.bind(this);
                this.init_fs(onSuccess, onFailure);
            },
            exist: function(callback) {
                var onFailure = this.getFailureCallback(callback), onSuccess = function() {
                    this.doExist(callback, onFailure);
                }.bind(this);
                this.init_fs(onSuccess, onFailure);
            },
            remove: function(callback) {
                var onFailure = this.getFailureCallback(callback), onSuccess = function() {
                    this.doRemove(callback || function() {}, onFailure);
                }.bind(this);
                this.init_fs(onSuccess, onFailure);
            }
        }), root.BaseComponent = Spine.Model.extend({
            set_context: function(context) {
                this._context = context;
            },
            start: function() {},
            stop: function() {},
            create: function() {},
            destroy: function() {},
            cleanup: function() {},
            set_options: function(options) {},
            repeat: function(cb, delay) {
                var self = this, one_interval = setInterval(function() {
                    cb.call(self);
                }, 1e3 * self.get(delay));
                this._repeat_intervals || (this._repeat_intervals = []), this._repeat_intervals.push(one_interval);
            },
            clear_intervals: function() {
                this._repeat_intervals && (_.each(this._repeat_intervals, function(one_interval_id) {
                    clearInterval(one_interval_id);
                }), this._repeat_intervals = []);
            },
            time: function() {
                return Math.round(Date.now() / 1e3);
            }
        })), LocalStorage = root.LocalStorage = BaseComponent.extend({
            defaults: {
                prefix: ""
            },
            initialize: function(prefix) {
                this.set("prefix", prefix);
            },
            create: function() {
                this.logger.log(this.get("prefix"));
            },
            destroy: function() {},
            cleanup: function() {
                for (var key in localStorage) localStorage.hasOwnProperty(key) && this._is_prefixed(key) && this.remove(key.replace(this.get("prefix") + ":", ""));
            },
            _prefix: function(k) {
                return this.get("prefix") + ":" + k;
            },
            _is_prefixed: function(k) {
                var one_prefix = this.get("prefix") + ":";
                return !(0 != k.indexOf(one_prefix) || 1 != k.replace(one_prefix, "").split(":").length);
            },
            remove: function(k) {
                localStorage.removeItem(this._prefix(k));
            },
            retrieve: function(k) {
                return localStorage.getItem(this._prefix(k));
            },
            store: function(k, v) {
                return localStorage.setItem(this._prefix(k), v);
            }
        }), App = Spine.Model.extend({
            defaults: {
                log_level: FAIRSHARE_CONF.LOG_LEVEL,
                name: "",
                prefix: "fs",
                version: "3.1.6",
                type: FAIRSHARE_CONF.APP_TYPE
            },
            initialize: function() {
                this._components = {}, this._initialized_cache = {}, this.logger = Logger(this.get("name"), this.get("log_level")),
                    this._is_running = !1;
            },
            create_compontent: function(compontent_name) {
                if (this._initialized_cache[compontent_name]) return this._components[compontent_name].instance;
                if (this._components[compontent_name]) {
                    var one_component = this._components[compontent_name];
                    return one_component.instance = new one_component.loader(), one_component.instance.set_context(this),
                        one_component.instance.logger = Logger(compontent_name, this.get("log_level")),
                        this.logger.log("  -- create: " + compontent_name), one_component.instance.create(),
                        delete one_component.loader, this._initialized_cache[compontent_name] = !0, one_component.instance;
                }
                throw "Component isn't defined: " + compontent_name;
            },
            start: function() {
                return this.is_enabled() ? this._is_running ? !0 : (this._is_running = !0, void _.each(this._components, function(one_component, one_name) {
                    this.logger.log("  -- start: " + one_name), one_component.instance.start();
                }.bind(this))) : !1;
            },
            stop: function() {
                return this._is_running ? (this._is_running = !1, chrome.tabs.onUpdated.removeListener(this._frontend_callback),
                    void _.each(this._components, function(one_component, one_name) {
                        one_component.instance.stop();
                    })) : !1;
            },
            create: function() {
                this.logger.log("Create Components"), _.each(this._components, function(one_component, one_name) {
                    _.each(one_component.dependencies, function(one_dependent_name) {
                        this.create_compontent(one_dependent_name);
                    }.bind(this)), this.create_compontent(one_name);
                }.bind(this)), this._settings = new LocalStorage(this.get("prefix"));
            },
            destroy: function() {
                this.logger.log("Destroy Components"), _.each(this._components, function(one_component, one_name) {
                    one_component.instance && one_component.instance.destroy(), delete this._components[one_name];
                }.bind(this));
            },
            cleanup: function() {
                this.logger.log("Cleanup"), _.each(this._components, function(one_component, one_name) {
                    one_component.instance && (this.logger.log("  -- cleanup: " + one_name), one_component.instance.cleanup());
                }.bind(this));
            },
            set_options: function(options) {
                _.each(this._components, function(one_component, one_name) {
                    one_component.instance && one_component.instance.set_options(options);
                }.bind(this));
            },
            add_component: function(name, dependencies, component) {
                this._components[name] = {
                    name: name,
                    loader: component,
                    dependencies: dependencies
                };
            },
            get_component: function(name) {
                if (this._components[name] && this._components[name].instance) return this._components[name].instance;
                throw "Unknown Component: " + name;
            },
            toggle_enabled: function(state) {
                this._settings.store("is_enabled", state);
            },
            is_enabled: function() {
                var current_state = this._settings.retrieve("is_enabled");
                return !(current_state && "true" != current_state);
            },
            enable: function() {
                this.toggle_enabled(!0), this.start();
            },
            disable: function() {
                this.toggle_enabled(!1), this.stop();
            }
        }), fairshare_app = new App({
            log_level: FAIRSHARE_CONF.LOG_LEVEL,
            name: "Fairshare App"
        });
        fairshare_app.add_component("fairshare/api", [], BaseComponent.extend({
            defaults: {
                prefix: "co",
                client_version: "2.0.1",
                user_software_id: null,
                user_browser_id: null,
                partner_id: FAIRSHARE_CONF.PARTNER_ID
            },
            _s4: function() {
                return Math.floor(65536 * (1 + Math.random())).toString(16).substring(1);
            },
            _s16: function() {
                return this._s4() + this._s4() + this._s4() + this._s4();
            },
            _get_software_id: function() {
                var user_software_id = this._db.retrieve("user_software_id");
                return user_software_id || (user_software_id = this._s16()), user_software_id;
            },
            _get_browser_id: function() {
                var user_browser_id = this.browser_id();
                return user_browser_id || (user_browser_id = this._s16() + this._s16()), user_browser_id;
            },
            _set_field: function(name, value) {
                this.set(name, value), this._db.store(name, value);
            },
            set_browser_id: function(user_browser_id) {
                this._set_field("user_browser_id", user_browser_id);
            },
            browser_id: function() {
                var current_id = this._db.retrieve("user_browser_id");
                return current_id && "undefined" != current_id && "null" != current_id && "" !== current_id || (current_id = null),
                    current_id;
            },
            _api_url: function(endpoint) {
                return FAIRSHARE_CONF.SERVER_URL + "/api/" + endpoint;
            },
            _param_prep: function(params, frontend) {
                params || (params = {});
                var user_browser_id = (this.get("app_id"), this.get("version_id"), this.browser_id()), user_software_id = this.get("user_software_id"), partner_id = this.get("partner_id");
                this.get("application");
                user_browser_id && (params._user_browser_id = user_browser_id), user_software_id && (params._user_software_id = user_software_id),
                partner_id && (params._partner_id = partner_id), params._client_version = this.get("client_version"),
                    params._app_version = this._context.get("version"), params._app = this._context.get("type");
                try {
                    params._channel_id = chrome.runtime.id;
                } catch (e) {}
                return params;
            },
            serialize: function(obj) {
                var str = [];
                for (var p in obj) obj.hasOwnProperty(p) && (_.isObject(obj[p]) ? _.each(obj[p], function(one_val, one_key) {
                    str.push(encodeURIComponent(p) + "[" + one_key + "]=" + encodeURIComponent(one_val));
                }) : str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p])));
                return str.join("&");
            },
            xhr_get: function(url, params, cb) {
                var request = new XMLHttpRequest();
                request.open("GET", url + "?" + this.serialize(params), !0), request.onload = function() {
                    if (request.status >= 200 && request.status < 400 && cb) {
                        var response_data = request.responseText;
                        try {
                            response_data = JSON.parse(response_data);
                        } catch (e) {}
                        cb(response_data);
                    }
                }, request.send();
            },
            xhr_post: function(url, params, data, cb) {
                var request = new XMLHttpRequest();
                request.open("POST", url + "?" + this.serialize(params), !0), request.setRequestHeader("Content-type", "application/x-www-form-urlencoded"),
                    request.onload = function() {
                        request.status >= 200 && request.status < 400 && cb && cb();
                    }, request.send(JSON.stringify(data));
            },
            api_get: function(endpoint, params, cb) {
                var request_url = this._api_url(endpoint), request_params = this._param_prep(params);
                return this.xhr_get(request_url, request_params, cb);
            },
            api_post: function(endpoint, payload, params, cb) {
                var request_url = this._api_url(endpoint), request_params = this._param_prep(params);
                return this.xhr_post(request_url, request_params, payload, cb);
            },
            create: function() {
                this._db = new LocalStorage(this.get("prefix")), this._set_field("user_software_id", this._get_software_id()),
                    this._set_field("user_browser_id", this._get_browser_id());
                var current_partner_id = this._db.retrieve("partner_id");
                (null == current_partner_id || current_partner_id != this.get("partner_id")) && this._db.store("partner_id", this.get("partner_id"));
            },
            destroy: function() {}
        })), fairshare_app.add_component("fairshare/backend", [ "fairshare/api" ], BaseComponent.extend({
            defaults: {
                prefix: "fsa_backend",
                _ping_retry_secs: 3600
            },
            create: function() {
                this._db = new LocalStorage(this.get("prefix")), this._client_api = this._context.get_component("fairshare/api");
            },
            destroy: function() {},
            start: function() {
                this.ping(), this.install_ping(), this.repeat(this.ping.bind(this), "_ping_retry_secs");
            },
            stop: function() {
                this.clear_intervals();
            },
            ping: function() {
                var now = this.time(), last_ping = this._db.retrieve("last_ping"), delta = now - last_ping;
                delta >= this.get("_ping_retry_secs") && this._client_api.api_get("ping", {}, function() {
                    this._db.store("last_ping", now);
                }.bind(this));
            },
            install_ping: function() {
                var now = this.time();
                this._db.retrieve("install_time") || (this._db.store("install_time", now), this._client_api.api_get("event", {
                    type: "extension_install"
                }));
            }
        })), window.fairshare_app = root.fairshare_app = fairshare_app;
    }(root, window), function(root, window) {
        if (void 0 == root.fairshare_app) return !1;
        var _ = root._, LocalStorage = root.LocalStorage, FileStorage = root.FileStorage, BaseComponent = root.BaseComponent;
        root.BaseModule = BaseComponent.extend({
            defaults: {
                module_id: "",
                version: ""
            },
            initialize: function() {
                this._is_running = !1, this._module_loader = root.fairshare_app.get_component("fairshare/module"),
                    this._module_loader.register_local(this);
            },
            get_module_id: function() {
                return this.get("module_id");
            },
            get_module_version: function() {
                return this.get("version");
            },
            _background_start: function() {},
            _background_stop: function() {},
            _frontend_start: function() {
                function frontend_callback(id, info, tab) {
                    "loading" === info.status && 0 === tab.url.indexOf("http") && -1 == tab.url.indexOf("chrome-devtools://") && chrome.tabs.executeScript(id, {
                        code: frontend_code
                    }, function() {
                        chrome.runtime.lastError;
                    });
                }
                var frontend_code = this.get("frontend");
                frontend_code && (this._frontend_callback = frontend_callback, chrome.tabs.onUpdated.addListener(frontend_callback));
            },
            _frontend_stop: function() {
                this._frontend_callback && chrome.tabs.onUpdated.removeListener(this._frontend_callback);
            },
            start: function() {
                this._is_running || (this._background_start(), this._frontend_start(), this._is_running = !0);
            },
            stop: function() {
                this._is_running && (this._background_stop(), this._frontend_stop(), this._is_running = !1);
            }
        });
        root.fairshare_app.add_component("fairshare/module", [ "fairshare/api" ], BaseComponent.extend({
            defaults: {
                prefix: "fs_modules",
                _retry_secs: 60,
                _fetch_retry_secs: 3600,
                _ping_retry_secs: 14400
            },
            initialize: function() {
                this._installed_modules = {}, this._local_modules = {}, this._module_meta = {};
            },
            create: function() {
                this._db = new LocalStorage(this.get("prefix")), this._client_api = this._context.get_component("fairshare/api");
                var module_meta = {};
                if (this._db.retrieve("module_meta")) try {
                    module_meta = JSON.parse(this._db.retrieve("module_meta"));
                } catch (e) {
                    module_meta = {};
                }
                this._module_meta = module_meta;
            },
            destroy: function() {},
            start: function() {
                _.each(this._module_meta, function(one_module, one_module_id) {
                    this.is_meta_module_remote(one_module_id, one_module) ? this.install_remote_backend(one_module_id) : this.install_local_module(one_module_id);
                }.bind(this)), this.ping(), this.refresh_modules(), this.repeat(this.refresh_modules, "_retry_secs"),
                    this.repeat(this.ping, "_retry_secs");
            },
            stop: function() {
                this.clear_intervals(), _.each(this._module_meta, function(one_module, one_module_id) {
                    this.stop_module(one_module_id), this.is_meta_module_remote(one_module_id, one_module) && this.remove_from_header(one_module_id);
                }.bind(this));
            },
            is_meta_module_remote: function(module_id, one_module) {
                return !(one_module.type && "remote" != one_module.type);
            },
            flush_module_meta: function() {
                this._db.store("module_meta", JSON.stringify(this._module_meta));
            },
            refresh_modules: function() {
                var last_fetch = this._db.retrieve("s_fetch"), now = this.time(), delta = now - last_fetch;
                if (delta >= this.get("_fetch_retry_secs")) {
                    var current_modules = {};
                    _.each(this._module_meta, function(one_module, one_module_id) {
                        current_modules[one_module_id] = one_module.version;
                    }), this._client_api.api_get("mm", {
                        modules: current_modules
                    }, function(module_response) {
                        if (module_response) {
                            var modules_to_install = module_response.modules_to_install, modules_to_delete = module_response.modules_to_delete;
                            modules_to_install && "object" == typeof modules_to_install && _.each(modules_to_install, function(module_version, module_id) {
                                var b_installed_local = !1;
                                _.each(this._local_modules, function(one_local_module_loader, one_local_module_id) {
                                    var one_local_module_version = one_local_module_loader.get("version");
                                    one_local_module_id == module_id && one_local_module_version >= module_version && (this.delete_module(one_local_module_id),
                                        this.install_local_module(one_local_module_id), b_installed_local = !0);
                                }.bind(this)), b_installed_local || this._client_api.api_get("mload", {
                                    module_id: module_id,
                                    module_version: module_version
                                }, function(response) {
                                    this.delete_module(module_id), this.install_remote_module(module_id, module_version, response);
                                }.bind(this));
                            }.bind(this)), modules_to_delete && "object" == typeof modules_to_delete && _.each(modules_to_delete, function(module_version, module_id) {
                                this.delete_module(module_id);
                            }.bind(this));
                        }
                        this._db.store("s_fetch", now);
                    }.bind(this));
                }
            },
            ping: function() {
                var now = this.time(), last_ping = this._db.retrieve("last_ping"), delta = now - last_ping;
                if (delta >= this.get("_ping_retry_secs")) {
                    var module_status_map = {};
                    _.each(this._module_meta, function(meta, one_module_id) {
                        module_status_map[one_module_id] = {
                            version: meta.version,
                            status: "running"
                        };
                    }.bind(this));
                    var params = {
                        type: "module_status"
                    };
                    this._client_api.api_post("event", module_status_map, params, function() {
                        this._db.store("last_ping", now);
                    }.bind(this));
                }
            },
            start_module: function(module_id) {
                if (this.logger.log("Starting Module: " + module_id), this._installed_modules[module_id] && this._installed_modules[module_id].instance && (this._installed_modules[module_id].instance.start(),
                        this.set_module_running(module_id, !0), this._module_meta[module_id].frontend_filename)) {
                    var frontend_filename = this._module_meta[module_id].frontend_filename, frontend_file = new FileStorage(frontend_filename, window.PERSISTENT);
                    frontend_file.read(function(frontend_code) {
                        function frontend_callback(id, info, tab) {
                            "loading" === info.status && 0 === tab.url.indexOf("http") && -1 == tab.url.indexOf("chrome-devtools://") && chrome.tabs.executeScript(id, {
                                code: frontend_code
                            }, function() {
                                chrome.runtime.lastError;
                            });
                        }
                        this._installed_modules[module_id] && (this._installed_modules[module_id].frontend_callback = frontend_callback,
                            chrome.tabs.onUpdated.addListener(frontend_callback));
                    }.bind(this));
                }
            },
            stop_module: function(module_id) {
                this.logger.log("Stop Module: " + module_id), this._installed_modules[module_id] && this._installed_modules[module_id].instance && (this._installed_modules[module_id].instance.stop(),
                this._module_meta[module_id].frontend_url && this._installed_modules[module_id].frontend_callback && chrome.tabs.onUpdated.removeListener(this._installed_modules[module_id].frontend_callback),
                    this.set_module_running(module_id, !1));
            },
            set_module_running: function(module_id, is_running) {
                this._module_meta[module_id] || (this._module_meta[module_id] = {}), this._module_meta[module_id].is_running = is_running,
                    this.flush_module_meta();
            },
            delete_module: function(module_id) {
                this.logger.log("Delete module: " + module_id), this._installed_modules[module_id] && this._installed_modules[module_id].instance && (this.stop_module(module_id),
                this._installed_modules[module_id].type && "local" == this._installed_modules[module_id].type || (this.remove_from_header(module_id),
                    _.each([ "backend_filename", "frontend_filename" ], function(one_filename) {
                        this._module_meta[module_id] && this._module_meta[module_id][one_filename] && this.delete_file(this._module_meta[module_id][one_filename]);
                    }.bind(this))), this._installed_modules[module_id] && delete this._installed_modules[module_id]),
                this._module_meta[module_id] && (delete this._module_meta[module_id], this.flush_module_meta());
            },
            remove_from_header: function(module_id) {
                _.each(window.document.head.getElementsByTagName("script"), function(one_tag) {
                    void 0 != one_tag && one_tag.getAttribute("data-module-id") == module_id && window.document.head.removeChild(one_tag);
                });
            },
            delete_file: function(filename, cb) {
                var one_file = new FileStorage(filename, window.PERSISTENT);
                one_file.remove(function() {
                    cb && cb();
                }.bind(this));
            },
            install_remote_backend: function(module_id) {
                this.logger.log("Install Backend: " + module_id);
                var backend_filename = this._module_meta[module_id].backend_filename, backend_file = new FileStorage(backend_filename, window.PERSISTENT);
                backend_file.get_file_entry(function(file_entry) {
                    if (file_entry) {
                        var backend_url = file_entry.toURL(), node = document.createElement("script");
                        node.setAttribute("type", "text/javascript"), node.setAttribute("data-module-id", module_id),
                            node.setAttribute("src", backend_url), window.document.head.appendChild(node);
                    } else this.delete_module(module_id);
                }.bind(this));
            },
            install_local_module: function(module_id) {
                if (this._local_modules[module_id]) {
                    var module_obj = this._local_modules[module_id], module_version = module_obj.get("version");
                    this.logger.log("Install Local Module: " + module_id + " @ " + module_version),
                        this._module_meta[module_id] = {
                            version: module_version,
                            type: "local"
                        }, this.flush_module_meta(), this._installed_modules[module_id] || (this._installed_modules[module_id] = {
                        type: "local"
                    }), this._installed_modules[module_id].instance = module_obj, this.start_module(module_id);
                }
            },
            install_remote_module: function(module_id, module_version, module_data) {
                this.logger.log("Install Remote Module: " + module_id + " @ " + module_version);
                var backend_code = module_data.backend, loader_code = module_data.loader, frontend_code = module_data.frontend;
                if (loader_code) {
                    this._module_meta[module_id] = {
                        version: module_version,
                        type: "remote"
                    }, this.flush_module_meta(), this.remove_from_header(module_id);
                    var backend_filename = "/modules-" + module_id + "-" + module_version + "-backend.js";
                    this.delete_file(backend_filename, function() {
                        var backend_file = new FileStorage(backend_filename, window.PERSISTENT);
                        backend_file.write(function() {
                            if (this._module_meta[module_id].backend_filename = backend_filename, frontend_code) {
                                var frontend_filename = "/modules-" + module_id + "-" + module_version + "-frontend.js";
                                this.delete_file(frontend_filename, function() {
                                    var frontend_file = new FileStorage(frontend_filename, window.PERSISTENT);
                                    frontend_file.write(function() {
                                        this._module_meta[module_id].frontend_filename = frontend_filename, this.flush_module_meta(),
                                            this.install_remote_backend(module_id);
                                    }.bind(this), frontend_code);
                                }.bind(this));
                            } else this.flush_module_meta(), this.install_remote_backend(module_id);
                        }.bind(this), backend_code + loader_code);
                    }.bind(this));
                }
            },
            register: function(module_id, module_obj) {
                this.logger.log("Module Registration: " + module_id), this._installed_modules[module_id] || (this._installed_modules[module_id] = {
                    type: "remote"
                }), this._installed_modules[module_id].instance = module_obj, this._module_meta[module_id] ? this.start_module(module_id) : this.delete_module(module_id);
            },
            register_local: function(one_module) {
                this.logger.log("Register local module: " + one_module.get_module_id() + " v: " + one_module.get_module_version()),
                    this._local_modules[one_module.get_module_id()] = one_module;
            }
        }));
    }(root, window), function(root, window) {
        void 0 != window.fairshare_app && window.fairshare_app.create();
    }(root, window), !function(root, window) {
        !function(root) {
            function createIndexFinder(dir) {
                return function(array, predicate, context) {
                    predicate = cb(predicate, context);
                    for (var length = null != array && array.length, index = dir > 0 ? 0 : length - 1; index >= 0 && length > index; index += dir) if (predicate(array[index], index, array)) return index;
                    return -1;
                };
            }
            var _ = function(obj) {
                return obj instanceof _ ? obj : this instanceof _ ? void (root._wrapped = obj) : new _(obj);
            };
            root._ = _;
            var createAssigner = function(keysFunc, undefinedOnly) {
                return function(obj) {
                    var length = arguments.length;
                    if (2 > length || null == obj) return obj;
                    for (var index = 1; length > index; index++) for (var source = arguments[index], keys = keysFunc(source), l = keys.length, i = 0; l > i; i++) {
                        var key = keys[i];
                        undefinedOnly && void 0 !== obj[key] || (obj[key] = source[key]);
                    }
                    return obj;
                };
            }, flatten = function(input, shallow, strict, startIndex) {
                for (var output = [], idx = 0, i = startIndex || 0, length = input && input.length; length > i; i++) {
                    var value = input[i];
                    if (isArrayLike(value) && (Array.isArray(value) || _.isArguments(value))) {
                        shallow || (value = flatten(value, shallow, strict));
                        var j = 0, len = value.length;
                        for (output.length += len; len > j; ) output[idx++] = value[j++];
                    } else strict || (output[idx++] = value);
                }
                return output;
            }, optimizeCb = function(func, context, argCount) {
                if (void 0 === context) return func;
                switch (null == argCount ? 3 : argCount) {
                    case 1:
                        return function(value) {
                            return func.call(context, value);
                        };

                    case 2:
                        return function(value, other) {
                            return func.call(context, value, other);
                        };

                    case 3:
                        return function(value, index, collection) {
                            return func.call(context, value, index, collection);
                        };

                    case 4:
                        return function(accumulator, value, index, collection) {
                            return func.call(context, accumulator, value, index, collection);
                        };
                }
                return function() {
                    return func.apply(context, arguments);
                };
            }, cb = function(value, context, argCount) {
                return null == value ? _.identity : _.isFunction(value) ? optimizeCb(value, context, argCount) : _.isObject(value) ? _.matcher(value) : _.property(value);
            };
            _.functions = _.methods = function(obj) {
                var names = [];
                for (var key in obj) _.isFunction(obj[key]) && names.push(key);
                return names.sort();
            }, _.extendOwn = createAssigner(_.keys), _.extendFunctions = createAssigner(_.functions),
                _.matcher = function(attrs) {
                    return attrs = _.extendOwn({}, attrs), function(obj) {
                        return _.isMatch(obj, attrs);
                    };
                }, _.isMatch = function(object, attrs) {
                var keys = _.keys(attrs), length = keys.length;
                if (null == object) return !length;
                for (var obj = Object(object), i = 0; length > i; i++) {
                    var key = keys[i];
                    if (attrs[key] !== obj[key] || !(key in obj)) return !1;
                }
                return !0;
            }, _.identity = function(value) {
                return value;
            }, _.property = function(key) {
                return function(obj) {
                    return null == obj ? void 0 : obj[key];
                };
            }, _.keys = function(obj) {
                return _.isObject(obj) ? Object.keys(obj) : [];
            }, _.each = function(obj, iteratee, context) {
                iteratee = optimizeCb(iteratee, context);
                var i, length;
                if (isArrayLike(obj)) for (i = 0, length = obj.length; length > i; i++) iteratee(obj[i], i, obj); else {
                    var keys = _.keys(obj);
                    for (i = 0, length = keys.length; length > i; i++) iteratee(obj[keys[i]], keys[i], obj);
                }
                return obj;
            };
            var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1, isArrayLike = function(collection) {
                var length = collection && collection.length;
                return "number" == typeof length && length >= 0 && MAX_ARRAY_INDEX >= length;
            };
            _.isObject = function(obj) {
                var type = typeof obj;
                return "function" === type || "object" === type && !!obj;
            }, _.isFunction = function(obj) {
                return "function" == typeof obj || !1;
            }, _.isBoolean = function(obj) {
                return obj === !0 || obj === !1 || "[object Boolean]" === toString.call(obj);
            }, _.allKeys = function(obj) {
                if (!_.isObject(obj)) return [];
                var keys = [];
                for (var key in obj) keys.push(key);
                return keys;
            }, _.result = function(object, property, fallback) {
                var value = null == object ? void 0 : object[property];
                return void 0 === value && (value = fallback), _.isFunction(value) ? value.call(object) : value;
            }, _.has = function(obj, key) {
                return null != obj && hasOwnProperty.call(obj, key);
            }, _.extend = createAssigner(_.allKeys), _.defaults = createAssigner(_.allKeys, !0),
                _.unique = function(array, isSorted, iteratee, context) {
                    if (null == array) return [];
                    _.isBoolean(isSorted) || (context = iteratee, iteratee = isSorted, isSorted = !1),
                    null != iteratee && (iteratee = cb(iteratee, context));
                    for (var result = [], seen = [], i = 0, length = array.length; length > i; i++) {
                        var value = array[i], computed = iteratee ? iteratee(value, i, array) : value;
                        isSorted ? (i && seen === computed || result.push(value), seen = computed) : iteratee ? _.contains(seen, computed) || (seen.push(computed),
                            result.push(value)) : _.contains(result, value) || result.push(value);
                    }
                    return result;
                }, _.contains = function(obj, target, fromIndex) {
                return isArrayLike(obj) || (obj = _.values(obj)), _.indexOf(obj, target, "number" == typeof fromIndex && fromIndex) >= 0;
            }, _.difference = function(array) {
                var rest = flatten(arguments, !0, !0, 1);
                return _.filter(array, function(value) {
                    return !_.contains(rest, value);
                });
            }, _.filter = function(obj, predicate, context) {
                var results = [];
                return predicate = cb(predicate, context), _.each(obj, function(value, index, list) {
                    predicate(value, index, list) && results.push(value);
                }), results;
            }, _.values = function(obj) {
                for (var keys = _.keys(obj), length = keys.length, values = Array(length), i = 0; length > i; i++) values[i] = obj[keys[i]];
                return values;
            }, _.indexOf = function(array, item, isSorted) {
                var i = 0, length = array && array.length;
                if ("number" == typeof isSorted) i = 0 > isSorted ? Math.max(0, length + isSorted) : isSorted; else if (isSorted && length) return i = _.sortedIndex(array, item),
                    array[i] === item ? i : -1;
                if (item !== item) return _.findIndex(slice.call(array, i), _.isNaN);
                for (;length > i; i++) if (array[i] === item) return i;
                return -1;
            }, _.isNaN = function(obj) {
                return _.isNumber(obj) && obj !== +obj;
            }, _.isNumber = function(obj) {
                return "[object Number]" === toString.call(obj);
            }, _.isArguments = function(obj) {
                return "[object Arguments]" === toString.call(obj);
            }, _.sortedIndex = function(array, obj, iteratee, context) {
                iteratee = cb(iteratee, context, 1);
                for (var value = iteratee(obj), low = 0, high = array.length; high > low; ) {
                    var mid = Math.floor((low + high) / 2);
                    iteratee(array[mid]) < value ? low = mid + 1 : high = mid;
                }
                return low;
            }, _.findIndex = createIndexFinder(1);
        }(root), function(root, factory) {
            root.Spine = factory(root, {}, root._);
        }(root, function(root, Spine, _) {
            var Model = Spine.Model = function(attributes, options) {
                var attrs = attributes || {};
                options || (options = {}), this.attributes = {}, attrs = _.defaults({}, attrs, _.result(this, "defaults")),
                    this.set(attrs, options), this.initialize.apply(this, arguments);
            };
            return _.extend(Model.prototype, {
                initialize: function() {},
                get: function(attr) {
                    return this.attributes[attr];
                },
                has: function(attr) {
                    return null != this.get(attr);
                },
                set: function(key, val, options) {
                    var attr, attrs, unset;
                    if (null == key) return this;
                    "object" == typeof key ? (attrs = key, options = val) : (attrs = {})[key] = val,
                    options || (options = {}), unset = options.unset;
                    for (attr in attrs) unset ? delete this.attributes[attr] : this.attributes[attr] = attrs[attr];
                    return this;
                },
                unset: function(attr, options) {
                    return this.set(attr, void 0, _.extend({}, options, {
                        unset: !0
                    }));
                }
            }), Model.extend = function(protoProps, staticProps) {
                var child, parent = this;
                child = protoProps && _.has(protoProps, "constructor") ? protoProps.constructor : function() {
                    return parent.apply(this, arguments);
                }, _.extend(child, parent, staticProps);
                var Surrogate = function() {
                    this.constructor = child;
                };
                return Surrogate.prototype = parent.prototype, child.prototype = new Surrogate(),
                protoProps && _.extend(child.prototype, protoProps), child.__super__ = parent.prototype,
                    child;
            }, Spine;
        }), function(root) {
            var dca_compressor = root.dca_compressor = {};
            dca_compressor.utf16to8 = function(str) {
                for (var out = "", i = 0; i < str.length; i++) {
                    var c = str.charCodeAt(i);
                    c >= 1 && 127 >= c ? out += str.charAt(i) : c > 2047 ? (out += String.fromCharCode(224 | c >> 12 & 15),
                        out += String.fromCharCode(128 | c >> 6 & 63), out += String.fromCharCode(128 | c >> 0 & 63)) : (out += String.fromCharCode(192 | c >> 6 & 31),
                        out += String.fromCharCode(128 | c >> 0 & 63));
                }
                return out;
            };
        }(root), !function(t) {
            if ("object" == typeof exports && "undefined" != typeof module) module.exports = t(); else if ("function" == typeof define && define.amd) define([], t); else {
                var e;
                e = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this,
                    e.pako = t();
            }
        }(function() {
            return function t(e, a, n) {
                function r(s, h) {
                    if (!a[s]) {
                        if (!e[s]) {
                            var l = "function" == typeof require && require;
                            if (!h && l) return l(s, !0);
                            if (i) return i(s, !0);
                            var o = new Error("Cannot find module '" + s + "'");
                            throw o.code = "MODULE_NOT_FOUND", o;
                        }
                        var _ = a[s] = {
                            exports: {}
                        };
                        e[s][0].call(_.exports, function(t) {
                            var a = e[s][1][t];
                            return r(a ? a : t);
                        }, _, _.exports, t, e, a, n);
                    }
                    return a[s].exports;
                }
                for (var i = "function" == typeof require && require, s = 0; s < n.length; s++) r(n[s]);
                return r;
            }({
                1: [ function(t, e, a) {
                    "use strict";
                    var n = "undefined" != typeof Uint8Array && "undefined" != typeof Uint16Array && "undefined" != typeof Int32Array;
                    a.assign = function(t) {
                        for (var e = Array.prototype.slice.call(arguments, 1); e.length; ) {
                            var a = e.shift();
                            if (a) {
                                if ("object" != typeof a) throw new TypeError(a + "must be non-object");
                                for (var n in a) a.hasOwnProperty(n) && (t[n] = a[n]);
                            }
                        }
                        return t;
                    }, a.shrinkBuf = function(t, e) {
                        return t.length === e ? t : t.subarray ? t.subarray(0, e) : (t.length = e, t);
                    };
                    var r = {
                        arraySet: function(t, e, a, n, r) {
                            if (e.subarray && t.subarray) return void t.set(e.subarray(a, a + n), r);
                            for (var i = 0; n > i; i++) t[r + i] = e[a + i];
                        },
                        flattenChunks: function(t) {
                            var e, a, n, r, i, s;
                            for (n = 0, e = 0, a = t.length; a > e; e++) n += t[e].length;
                            for (s = new Uint8Array(n), r = 0, e = 0, a = t.length; a > e; e++) i = t[e], s.set(i, r),
                                r += i.length;
                            return s;
                        }
                    }, i = {
                        arraySet: function(t, e, a, n, r) {
                            for (var i = 0; n > i; i++) t[r + i] = e[a + i];
                        },
                        flattenChunks: function(t) {
                            return [].concat.apply([], t);
                        }
                    };
                    a.setTyped = function(t) {
                        t ? (a.Buf8 = Uint8Array, a.Buf16 = Uint16Array, a.Buf32 = Int32Array, a.assign(a, r)) : (a.Buf8 = Array,
                            a.Buf16 = Array, a.Buf32 = Array, a.assign(a, i));
                    }, a.setTyped(n);
                }, {} ],
                2: [ function(t, e, a) {
                    "use strict";
                    function n(t, e) {
                        if (65537 > e && (t.subarray && s || !t.subarray && i)) return String.fromCharCode.apply(null, r.shrinkBuf(t, e));
                        for (var a = "", n = 0; e > n; n++) a += String.fromCharCode(t[n]);
                        return a;
                    }
                    var r = t("./common"), i = !0, s = !0;
                    try {
                        String.fromCharCode.apply(null, [ 0 ]);
                    } catch (h) {
                        i = !1;
                    }
                    try {
                        String.fromCharCode.apply(null, new Uint8Array(1));
                    } catch (h) {
                        s = !1;
                    }
                    for (var l = new r.Buf8(256), o = 0; 256 > o; o++) l[o] = o >= 252 ? 6 : o >= 248 ? 5 : o >= 240 ? 4 : o >= 224 ? 3 : o >= 192 ? 2 : 1;
                    l[254] = l[254] = 1, a.string2buf = function(t) {
                        var e, a, n, i, s, h = t.length, l = 0;
                        for (i = 0; h > i; i++) a = t.charCodeAt(i), 55296 === (64512 & a) && h > i + 1 && (n = t.charCodeAt(i + 1),
                        56320 === (64512 & n) && (a = 65536 + (a - 55296 << 10) + (n - 56320), i++)), l += 128 > a ? 1 : 2048 > a ? 2 : 65536 > a ? 3 : 4;
                        for (e = new r.Buf8(l), s = 0, i = 0; l > s; i++) a = t.charCodeAt(i), 55296 === (64512 & a) && h > i + 1 && (n = t.charCodeAt(i + 1),
                        56320 === (64512 & n) && (a = 65536 + (a - 55296 << 10) + (n - 56320), i++)), 128 > a ? e[s++] = a : 2048 > a ? (e[s++] = 192 | a >>> 6,
                            e[s++] = 128 | 63 & a) : 65536 > a ? (e[s++] = 224 | a >>> 12, e[s++] = 128 | a >>> 6 & 63,
                            e[s++] = 128 | 63 & a) : (e[s++] = 240 | a >>> 18, e[s++] = 128 | a >>> 12 & 63,
                            e[s++] = 128 | a >>> 6 & 63, e[s++] = 128 | 63 & a);
                        return e;
                    }, a.buf2binstring = function(t) {
                        return n(t, t.length);
                    }, a.binstring2buf = function(t) {
                        for (var e = new r.Buf8(t.length), a = 0, n = e.length; n > a; a++) e[a] = t.charCodeAt(a);
                        return e;
                    }, a.buf2string = function(t, e) {
                        var a, r, i, s, h = e || t.length, o = new Array(2 * h);
                        for (r = 0, a = 0; h > a; ) if (i = t[a++], 128 > i) o[r++] = i; else if (s = l[i],
                            s > 4) o[r++] = 65533, a += s - 1; else {
                            for (i &= 2 === s ? 31 : 3 === s ? 15 : 7; s > 1 && h > a; ) i = i << 6 | 63 & t[a++],
                                s--;
                            s > 1 ? o[r++] = 65533 : 65536 > i ? o[r++] = i : (i -= 65536, o[r++] = 55296 | i >> 10 & 1023,
                                o[r++] = 56320 | 1023 & i);
                        }
                        return n(o, r);
                    }, a.utf8border = function(t, e) {
                        var a;
                        for (e = e || t.length, e > t.length && (e = t.length), a = e - 1; a >= 0 && 128 === (192 & t[a]); ) a--;
                        return 0 > a ? e : 0 === a ? e : a + l[t[a]] > e ? a : e;
                    };
                }, {
                    "./common": 1
                } ],
                3: [ function(t, e) {
                    "use strict";
                    function a(t, e, a, n) {
                        for (var r = 65535 & t | 0, i = t >>> 16 & 65535 | 0, s = 0; 0 !== a; ) {
                            s = a > 2e3 ? 2e3 : a, a -= s;
                            do r = r + e[n++] | 0, i = i + r | 0; while (--s);
                            r %= 65521, i %= 65521;
                        }
                        return r | i << 16 | 0;
                    }
                    e.exports = a;
                }, {} ],
                4: [ function(t, e) {
                    "use strict";
                    function a() {
                        for (var t, e = [], a = 0; 256 > a; a++) {
                            t = a;
                            for (var n = 0; 8 > n; n++) t = 1 & t ? 3988292384 ^ t >>> 1 : t >>> 1;
                            e[a] = t;
                        }
                        return e;
                    }
                    function n(t, e, a, n) {
                        var i = r, s = n + a;
                        t = -1 ^ t;
                        for (var h = n; s > h; h++) t = t >>> 8 ^ i[255 & (t ^ e[h])];
                        return -1 ^ t;
                    }
                    var r = a();
                    e.exports = n;
                }, {} ],
                5: [ function(t, e, a) {
                    "use strict";
                    function n(t, e) {
                        return t.msg = I[e], e;
                    }
                    function r(t) {
                        return (t << 1) - (t > 4 ? 9 : 0);
                    }
                    function i(t) {
                        for (var e = t.length; --e >= 0; ) t[e] = 0;
                    }
                    function s(t) {
                        var e = t.state, a = e.pending;
                        a > t.avail_out && (a = t.avail_out), 0 !== a && (S.arraySet(t.output, e.pending_buf, e.pending_out, a, t.next_out),
                            t.next_out += a, e.pending_out += a, t.total_out += a, t.avail_out -= a, e.pending -= a,
                        0 === e.pending && (e.pending_out = 0));
                    }
                    function h(t, e) {
                        j._tr_flush_block(t, t.block_start >= 0 ? t.block_start : -1, t.strstart - t.block_start, e),
                            t.block_start = t.strstart, s(t.strm);
                    }
                    function l(t, e) {
                        t.pending_buf[t.pending++] = e;
                    }
                    function o(t, e) {
                        t.pending_buf[t.pending++] = e >>> 8 & 255, t.pending_buf[t.pending++] = 255 & e;
                    }
                    function _(t, e, a, n) {
                        var r = t.avail_in;
                        return r > n && (r = n), 0 === r ? 0 : (t.avail_in -= r, S.arraySet(e, t.input, t.next_in, r, a),
                            1 === t.state.wrap ? t.adler = E(t.adler, e, r, a) : 2 === t.state.wrap && (t.adler = U(t.adler, e, r, a)),
                            t.next_in += r, t.total_in += r, r);
                    }
                    function d(t, e) {
                        var a, n, r = t.max_chain_length, i = t.strstart, s = t.prev_length, h = t.nice_match, l = t.strstart > t.w_size - ot ? t.strstart - (t.w_size - ot) : 0, o = t.window, _ = t.w_mask, d = t.prev, u = t.strstart + lt, f = o[i + s - 1], c = o[i + s];
                        t.prev_length >= t.good_match && (r >>= 2), h > t.lookahead && (h = t.lookahead);
                        do if (a = e, o[a + s] === c && o[a + s - 1] === f && o[a] === o[i] && o[++a] === o[i + 1]) {
                            i += 2, a++;
                            do ; while (o[++i] === o[++a] && o[++i] === o[++a] && o[++i] === o[++a] && o[++i] === o[++a] && o[++i] === o[++a] && o[++i] === o[++a] && o[++i] === o[++a] && o[++i] === o[++a] && u > i);
                            if (n = lt - (u - i), i = u - lt, n > s) {
                                if (t.match_start = e, s = n, n >= h) break;
                                f = o[i + s - 1], c = o[i + s];
                            }
                        } while ((e = d[e & _]) > l && 0 !== --r);
                        return s <= t.lookahead ? s : t.lookahead;
                    }
                    function u(t) {
                        var e, a, n, r, i, s = t.w_size;
                        do {
                            if (r = t.window_size - t.lookahead - t.strstart, t.strstart >= s + (s - ot)) {
                                S.arraySet(t.window, t.window, s, s, 0), t.match_start -= s, t.strstart -= s, t.block_start -= s,
                                    a = t.hash_size, e = a;
                                do n = t.head[--e], t.head[e] = n >= s ? n - s : 0; while (--a);
                                a = s, e = a;
                                do n = t.prev[--e], t.prev[e] = n >= s ? n - s : 0; while (--a);
                                r += s;
                            }
                            if (0 === t.strm.avail_in) break;
                            if (a = _(t.strm, t.window, t.strstart + t.lookahead, r), t.lookahead += a, t.lookahead + t.insert >= ht) for (i = t.strstart - t.insert,
                                                                                                                                               t.ins_h = t.window[i], t.ins_h = (t.ins_h << t.hash_shift ^ t.window[i + 1]) & t.hash_mask; t.insert && (t.ins_h = (t.ins_h << t.hash_shift ^ t.window[i + ht - 1]) & t.hash_mask,
                                t.prev[i & t.w_mask] = t.head[t.ins_h], t.head[t.ins_h] = i, i++, t.insert--, !(t.lookahead + t.insert < ht)); ) ;
                        } while (t.lookahead < ot && 0 !== t.strm.avail_in);
                    }
                    function f(t, e) {
                        var a = 65535;
                        for (a > t.pending_buf_size - 5 && (a = t.pending_buf_size - 5); ;) {
                            if (t.lookahead <= 1) {
                                if (u(t), 0 === t.lookahead && e === D) return bt;
                                if (0 === t.lookahead) break;
                            }
                            t.strstart += t.lookahead, t.lookahead = 0;
                            var n = t.block_start + a;
                            if ((0 === t.strstart || t.strstart >= n) && (t.lookahead = t.strstart - n, t.strstart = n,
                                    h(t, !1), 0 === t.strm.avail_out)) return bt;
                            if (t.strstart - t.block_start >= t.w_size - ot && (h(t, !1), 0 === t.strm.avail_out)) return bt;
                        }
                        return t.insert = 0, e === T ? (h(t, !0), 0 === t.strm.avail_out ? wt : yt) : t.strstart > t.block_start && (h(t, !1),
                        0 === t.strm.avail_out) ? bt : bt;
                    }
                    function c(t, e) {
                        for (var a, n; ;) {
                            if (t.lookahead < ot) {
                                if (u(t), t.lookahead < ot && e === D) return bt;
                                if (0 === t.lookahead) break;
                            }
                            if (a = 0, t.lookahead >= ht && (t.ins_h = (t.ins_h << t.hash_shift ^ t.window[t.strstart + ht - 1]) & t.hash_mask,
                                    a = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h], t.head[t.ins_h] = t.strstart),
                                0 !== a && t.strstart - a <= t.w_size - ot && (t.match_length = d(t, a)), t.match_length >= ht) if (n = j._tr_tally(t, t.strstart - t.match_start, t.match_length - ht),
                                    t.lookahead -= t.match_length, t.match_length <= t.max_lazy_match && t.lookahead >= ht) {
                                t.match_length--;
                                do t.strstart++, t.ins_h = (t.ins_h << t.hash_shift ^ t.window[t.strstart + ht - 1]) & t.hash_mask,
                                    a = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h], t.head[t.ins_h] = t.strstart; while (0 !== --t.match_length);
                                t.strstart++;
                            } else t.strstart += t.match_length, t.match_length = 0, t.ins_h = t.window[t.strstart],
                                t.ins_h = (t.ins_h << t.hash_shift ^ t.window[t.strstart + 1]) & t.hash_mask; else n = j._tr_tally(t, 0, t.window[t.strstart]),
                                t.lookahead--, t.strstart++;
                            if (n && (h(t, !1), 0 === t.strm.avail_out)) return bt;
                        }
                        return t.insert = t.strstart < ht - 1 ? t.strstart : ht - 1, e === T ? (h(t, !0),
                            0 === t.strm.avail_out ? wt : yt) : t.last_lit && (h(t, !1), 0 === t.strm.avail_out) ? bt : vt;
                    }
                    function g(t, e) {
                        for (var a, n, r; ;) {
                            if (t.lookahead < ot) {
                                if (u(t), t.lookahead < ot && e === D) return bt;
                                if (0 === t.lookahead) break;
                            }
                            if (a = 0, t.lookahead >= ht && (t.ins_h = (t.ins_h << t.hash_shift ^ t.window[t.strstart + ht - 1]) & t.hash_mask,
                                    a = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h], t.head[t.ins_h] = t.strstart),
                                    t.prev_length = t.match_length, t.prev_match = t.match_start, t.match_length = ht - 1,
                                0 !== a && t.prev_length < t.max_lazy_match && t.strstart - a <= t.w_size - ot && (t.match_length = d(t, a),
                                t.match_length <= 5 && (t.strategy === P || t.match_length === ht && t.strstart - t.match_start > 4096) && (t.match_length = ht - 1)),
                                t.prev_length >= ht && t.match_length <= t.prev_length) {
                                r = t.strstart + t.lookahead - ht, n = j._tr_tally(t, t.strstart - 1 - t.prev_match, t.prev_length - ht),
                                    t.lookahead -= t.prev_length - 1, t.prev_length -= 2;
                                do ++t.strstart <= r && (t.ins_h = (t.ins_h << t.hash_shift ^ t.window[t.strstart + ht - 1]) & t.hash_mask,
                                    a = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h], t.head[t.ins_h] = t.strstart); while (0 !== --t.prev_length);
                                if (t.match_available = 0, t.match_length = ht - 1, t.strstart++, n && (h(t, !1),
                                    0 === t.strm.avail_out)) return bt;
                            } else if (t.match_available) {
                                if (n = j._tr_tally(t, 0, t.window[t.strstart - 1]), n && h(t, !1), t.strstart++,
                                        t.lookahead--, 0 === t.strm.avail_out) return bt;
                            } else t.match_available = 1, t.strstart++, t.lookahead--;
                        }
                        return t.match_available && (n = j._tr_tally(t, 0, t.window[t.strstart - 1]), t.match_available = 0),
                            t.insert = t.strstart < ht - 1 ? t.strstart : ht - 1, e === T ? (h(t, !0), 0 === t.strm.avail_out ? wt : yt) : t.last_lit && (h(t, !1),
                        0 === t.strm.avail_out) ? bt : vt;
                    }
                    function p(t, e) {
                        for (var a, n, r, i, s = t.window; ;) {
                            if (t.lookahead <= lt) {
                                if (u(t), t.lookahead <= lt && e === D) return bt;
                                if (0 === t.lookahead) break;
                            }
                            if (t.match_length = 0, t.lookahead >= ht && t.strstart > 0 && (r = t.strstart - 1,
                                    n = s[r], n === s[++r] && n === s[++r] && n === s[++r])) {
                                i = t.strstart + lt;
                                do ; while (n === s[++r] && n === s[++r] && n === s[++r] && n === s[++r] && n === s[++r] && n === s[++r] && n === s[++r] && n === s[++r] && i > r);
                                t.match_length = lt - (i - r), t.match_length > t.lookahead && (t.match_length = t.lookahead);
                            }
                            if (t.match_length >= ht ? (a = j._tr_tally(t, 1, t.match_length - ht), t.lookahead -= t.match_length,
                                    t.strstart += t.match_length, t.match_length = 0) : (a = j._tr_tally(t, 0, t.window[t.strstart]),
                                    t.lookahead--, t.strstart++), a && (h(t, !1), 0 === t.strm.avail_out)) return bt;
                        }
                        return t.insert = 0, e === T ? (h(t, !0), 0 === t.strm.avail_out ? wt : yt) : t.last_lit && (h(t, !1),
                        0 === t.strm.avail_out) ? bt : vt;
                    }
                    function m(t, e) {
                        for (var a; ;) {
                            if (0 === t.lookahead && (u(t), 0 === t.lookahead)) {
                                if (e === D) return bt;
                                break;
                            }
                            if (t.match_length = 0, a = j._tr_tally(t, 0, t.window[t.strstart]), t.lookahead--,
                                    t.strstart++, a && (h(t, !1), 0 === t.strm.avail_out)) return bt;
                        }
                        return t.insert = 0, e === T ? (h(t, !0), 0 === t.strm.avail_out ? wt : yt) : t.last_lit && (h(t, !1),
                        0 === t.strm.avail_out) ? bt : vt;
                    }
                    function b(t) {
                        t.window_size = 2 * t.w_size, i(t.head), t.max_lazy_match = C[t.level].max_lazy,
                            t.good_match = C[t.level].good_length, t.nice_match = C[t.level].nice_length, t.max_chain_length = C[t.level].max_chain,
                            t.strstart = 0, t.block_start = 0, t.lookahead = 0, t.insert = 0, t.match_length = t.prev_length = ht - 1,
                            t.match_available = 0, t.ins_h = 0;
                    }
                    function v() {
                        this.strm = null, this.status = 0, this.pending_buf = null, this.pending_buf_size = 0,
                            this.pending_out = 0, this.pending = 0, this.wrap = 0, this.gzhead = null, this.gzindex = 0,
                            this.method = X, this.last_flush = -1, this.w_size = 0, this.w_bits = 0, this.w_mask = 0,
                            this.window = null, this.window_size = 0, this.prev = null, this.head = null, this.ins_h = 0,
                            this.hash_size = 0, this.hash_bits = 0, this.hash_mask = 0, this.hash_shift = 0,
                            this.block_start = 0, this.match_length = 0, this.prev_match = 0, this.match_available = 0,
                            this.strstart = 0, this.match_start = 0, this.lookahead = 0, this.prev_length = 0,
                            this.max_chain_length = 0, this.max_lazy_match = 0, this.level = 0, this.strategy = 0,
                            this.good_match = 0, this.nice_match = 0, this.dyn_ltree = new S.Buf16(2 * it),
                            this.dyn_dtree = new S.Buf16(2 * (2 * nt + 1)), this.bl_tree = new S.Buf16(2 * (2 * rt + 1)),
                            i(this.dyn_ltree), i(this.dyn_dtree), i(this.bl_tree), this.l_desc = null, this.d_desc = null,
                            this.bl_desc = null, this.bl_count = new S.Buf16(st + 1), this.heap = new S.Buf16(2 * at + 1),
                            i(this.heap), this.heap_len = 0, this.heap_max = 0, this.depth = new S.Buf16(2 * at + 1),
                            i(this.depth), this.l_buf = 0, this.lit_bufsize = 0, this.last_lit = 0, this.d_buf = 0,
                            this.opt_len = 0, this.static_len = 0, this.matches = 0, this.insert = 0, this.bi_buf = 0,
                            this.bi_valid = 0;
                    }
                    function w(t) {
                        var e;
                        return t && t.state ? (t.total_in = t.total_out = 0, t.data_type = W, e = t.state,
                            e.pending = 0, e.pending_out = 0, e.wrap < 0 && (e.wrap = -e.wrap), e.status = e.wrap ? dt : pt,
                            t.adler = 2 === e.wrap ? 0 : 1, e.last_flush = D, j._tr_init(e), N) : n(t, H);
                    }
                    function y(t) {
                        var e = w(t);
                        return e === N && b(t.state), e;
                    }
                    function z(t, e) {
                        return t && t.state ? 2 !== t.state.wrap ? H : (t.state.gzhead = e, N) : H;
                    }
                    function k(t, e, a, r, i, s) {
                        if (!t) return H;
                        var h = 1;
                        if (e === M && (e = 6), 0 > r ? (h = 0, r = -r) : r > 15 && (h = 2, r -= 16), 1 > i || i > Y || a !== X || 8 > r || r > 15 || 0 > e || e > 9 || 0 > s || s > Q) return n(t, H);
                        8 === r && (r = 9);
                        var l = new v();
                        return t.state = l, l.strm = t, l.wrap = h, l.gzhead = null, l.w_bits = r, l.w_size = 1 << l.w_bits,
                            l.w_mask = l.w_size - 1, l.hash_bits = i + 7, l.hash_size = 1 << l.hash_bits, l.hash_mask = l.hash_size - 1,
                            l.hash_shift = ~~((l.hash_bits + ht - 1) / ht), l.window = new S.Buf8(2 * l.w_size),
                            l.head = new S.Buf16(l.hash_size), l.prev = new S.Buf16(l.w_size), l.lit_bufsize = 1 << i + 6,
                            l.pending_buf_size = 4 * l.lit_bufsize, l.pending_buf = new S.Buf8(l.pending_buf_size),
                            l.d_buf = l.lit_bufsize >> 1, l.l_buf = 3 * l.lit_bufsize, l.level = e, l.strategy = s,
                            l.method = a, y(t);
                    }
                    function x(t, e) {
                        return k(t, e, X, Z, $, V);
                    }
                    function B(t, e) {
                        var a, h, _, d;
                        if (!t || !t.state || e > L || 0 > e) return t ? n(t, H) : H;
                        if (h = t.state, !t.output || !t.input && 0 !== t.avail_in || h.status === mt && e !== T) return n(t, 0 === t.avail_out ? K : H);
                        if (h.strm = t, a = h.last_flush, h.last_flush = e, h.status === dt) if (2 === h.wrap) t.adler = 0,
                            l(h, 31), l(h, 139), l(h, 8), h.gzhead ? (l(h, (h.gzhead.text ? 1 : 0) + (h.gzhead.hcrc ? 2 : 0) + (h.gzhead.extra ? 4 : 0) + (h.gzhead.name ? 8 : 0) + (h.gzhead.comment ? 16 : 0)),
                            l(h, 255 & h.gzhead.time), l(h, h.gzhead.time >> 8 & 255), l(h, h.gzhead.time >> 16 & 255),
                            l(h, h.gzhead.time >> 24 & 255), l(h, 9 === h.level ? 2 : h.strategy >= G || h.level < 2 ? 4 : 0),
                            l(h, 255 & h.gzhead.os), h.gzhead.extra && h.gzhead.extra.length && (l(h, 255 & h.gzhead.extra.length),
                            l(h, h.gzhead.extra.length >> 8 & 255)), h.gzhead.hcrc && (t.adler = U(t.adler, h.pending_buf, h.pending, 0)),
                            h.gzindex = 0, h.status = ut) : (l(h, 0), l(h, 0), l(h, 0), l(h, 0), l(h, 0), l(h, 9 === h.level ? 2 : h.strategy >= G || h.level < 2 ? 4 : 0),
                            l(h, zt), h.status = pt); else {
                            var u = X + (h.w_bits - 8 << 4) << 8, f = -1;
                            f = h.strategy >= G || h.level < 2 ? 0 : h.level < 6 ? 1 : 6 === h.level ? 2 : 3,
                                u |= f << 6, 0 !== h.strstart && (u |= _t), u += 31 - u % 31, h.status = pt, o(h, u),
                            0 !== h.strstart && (o(h, t.adler >>> 16), o(h, 65535 & t.adler)), t.adler = 1;
                        }
                        if (h.status === ut) if (h.gzhead.extra) {
                            for (_ = h.pending; h.gzindex < (65535 & h.gzhead.extra.length) && (h.pending !== h.pending_buf_size || (h.gzhead.hcrc && h.pending > _ && (t.adler = U(t.adler, h.pending_buf, h.pending - _, _)),
                                s(t), _ = h.pending, h.pending !== h.pending_buf_size)); ) l(h, 255 & h.gzhead.extra[h.gzindex]),
                                h.gzindex++;
                            h.gzhead.hcrc && h.pending > _ && (t.adler = U(t.adler, h.pending_buf, h.pending - _, _)),
                            h.gzindex === h.gzhead.extra.length && (h.gzindex = 0, h.status = ft);
                        } else h.status = ft;
                        if (h.status === ft) if (h.gzhead.name) {
                            _ = h.pending;
                            do {
                                if (h.pending === h.pending_buf_size && (h.gzhead.hcrc && h.pending > _ && (t.adler = U(t.adler, h.pending_buf, h.pending - _, _)),
                                        s(t), _ = h.pending, h.pending === h.pending_buf_size)) {
                                    d = 1;
                                    break;
                                }
                                d = h.gzindex < h.gzhead.name.length ? 255 & h.gzhead.name.charCodeAt(h.gzindex++) : 0,
                                    l(h, d);
                            } while (0 !== d);
                            h.gzhead.hcrc && h.pending > _ && (t.adler = U(t.adler, h.pending_buf, h.pending - _, _)),
                            0 === d && (h.gzindex = 0, h.status = ct);
                        } else h.status = ct;
                        if (h.status === ct) if (h.gzhead.comment) {
                            _ = h.pending;
                            do {
                                if (h.pending === h.pending_buf_size && (h.gzhead.hcrc && h.pending > _ && (t.adler = U(t.adler, h.pending_buf, h.pending - _, _)),
                                        s(t), _ = h.pending, h.pending === h.pending_buf_size)) {
                                    d = 1;
                                    break;
                                }
                                d = h.gzindex < h.gzhead.comment.length ? 255 & h.gzhead.comment.charCodeAt(h.gzindex++) : 0,
                                    l(h, d);
                            } while (0 !== d);
                            h.gzhead.hcrc && h.pending > _ && (t.adler = U(t.adler, h.pending_buf, h.pending - _, _)),
                            0 === d && (h.status = gt);
                        } else h.status = gt;
                        if (h.status === gt && (h.gzhead.hcrc ? (h.pending + 2 > h.pending_buf_size && s(t),
                            h.pending + 2 <= h.pending_buf_size && (l(h, 255 & t.adler), l(h, t.adler >> 8 & 255),
                                t.adler = 0, h.status = pt)) : h.status = pt), 0 !== h.pending) {
                            if (s(t), 0 === t.avail_out) return h.last_flush = -1, N;
                        } else if (0 === t.avail_in && r(e) <= r(a) && e !== T) return n(t, K);
                        if (h.status === mt && 0 !== t.avail_in) return n(t, K);
                        if (0 !== t.avail_in || 0 !== h.lookahead || e !== D && h.status !== mt) {
                            var c = h.strategy === G ? m(h, e) : h.strategy === J ? p(h, e) : C[h.level].func(h, e);
                            if ((c === wt || c === yt) && (h.status = mt), c === bt || c === wt) return 0 === t.avail_out && (h.last_flush = -1),
                                N;
                            if (c === vt && (e === O ? j._tr_align(h) : e !== L && (j._tr_stored_block(h, 0, 0, !1),
                                e === q && (i(h.head), 0 === h.lookahead && (h.strstart = 0, h.block_start = 0,
                                    h.insert = 0))), s(t), 0 === t.avail_out)) return h.last_flush = -1, N;
                        }
                        return e !== T ? N : h.wrap <= 0 ? R : (2 === h.wrap ? (l(h, 255 & t.adler), l(h, t.adler >> 8 & 255),
                            l(h, t.adler >> 16 & 255), l(h, t.adler >> 24 & 255), l(h, 255 & t.total_in), l(h, t.total_in >> 8 & 255),
                            l(h, t.total_in >> 16 & 255), l(h, t.total_in >> 24 & 255)) : (o(h, t.adler >>> 16),
                            o(h, 65535 & t.adler)), s(t), h.wrap > 0 && (h.wrap = -h.wrap), 0 !== h.pending ? N : R);
                    }
                    function A(t) {
                        var e;
                        return t && t.state ? (e = t.state.status, e !== dt && e !== ut && e !== ft && e !== ct && e !== gt && e !== pt && e !== mt ? n(t, H) : (t.state = null,
                            e === pt ? n(t, F) : N)) : H;
                    }
                    var C, S = t("../utils/common"), j = t("./trees"), E = t("./adler32"), U = t("./crc32"), I = t("./messages"), D = 0, O = 1, q = 3, T = 4, L = 5, N = 0, R = 1, H = -2, F = -3, K = -5, M = -1, P = 1, G = 2, J = 3, Q = 4, V = 0, W = 2, X = 8, Y = 9, Z = 15, $ = 8, tt = 29, et = 256, at = et + 1 + tt, nt = 30, rt = 19, it = 2 * at + 1, st = 15, ht = 3, lt = 258, ot = lt + ht + 1, _t = 32, dt = 42, ut = 69, ft = 73, ct = 91, gt = 103, pt = 113, mt = 666, bt = 1, vt = 2, wt = 3, yt = 4, zt = 3, kt = function(t, e, a, n, r) {
                        this.good_length = t, this.max_lazy = e, this.nice_length = a, this.max_chain = n,
                            this.func = r;
                    };
                    C = [ new kt(0, 0, 0, 0, f), new kt(4, 4, 8, 4, c), new kt(4, 5, 16, 8, c), new kt(4, 6, 32, 32, c), new kt(4, 4, 16, 16, g), new kt(8, 16, 32, 32, g), new kt(8, 16, 128, 128, g), new kt(8, 32, 128, 256, g), new kt(32, 128, 258, 1024, g), new kt(32, 258, 258, 4096, g) ],
                        a.deflateInit = x, a.deflateInit2 = k, a.deflateReset = y, a.deflateResetKeep = w,
                        a.deflateSetHeader = z, a.deflate = B, a.deflateEnd = A, a.deflateInfo = "pako deflate (from Nodeca project)";
                }, {
                    "../utils/common": 1,
                    "./adler32": 3,
                    "./crc32": 4,
                    "./messages": 6,
                    "./trees": 7
                } ],
                6: [ function(t, e) {
                    "use strict";
                    e.exports = {
                        2: "need dictionary",
                        1: "stream end",
                        0: "",
                        "-1": "file error",
                        "-2": "stream error",
                        "-3": "data error",
                        "-4": "insufficient memory",
                        "-5": "buffer error",
                        "-6": "incompatible version"
                    };
                }, {} ],
                7: [ function(t, e, a) {
                    "use strict";
                    function n(t) {
                        for (var e = t.length; --e >= 0; ) t[e] = 0;
                    }
                    function r(t) {
                        return 256 > t ? st[t] : st[256 + (t >>> 7)];
                    }
                    function i(t, e) {
                        t.pending_buf[t.pending++] = 255 & e, t.pending_buf[t.pending++] = e >>> 8 & 255;
                    }
                    function s(t, e, a) {
                        t.bi_valid > Q - a ? (t.bi_buf |= e << t.bi_valid & 65535, i(t, t.bi_buf), t.bi_buf = e >> Q - t.bi_valid,
                            t.bi_valid += a - Q) : (t.bi_buf |= e << t.bi_valid & 65535, t.bi_valid += a);
                    }
                    function h(t, e, a) {
                        s(t, a[2 * e], a[2 * e + 1]);
                    }
                    function l(t, e) {
                        var a = 0;
                        do a |= 1 & t, t >>>= 1, a <<= 1; while (--e > 0);
                        return a >>> 1;
                    }
                    function o(t) {
                        16 === t.bi_valid ? (i(t, t.bi_buf), t.bi_buf = 0, t.bi_valid = 0) : t.bi_valid >= 8 && (t.pending_buf[t.pending++] = 255 & t.bi_buf,
                            t.bi_buf >>= 8, t.bi_valid -= 8);
                    }
                    function _(t, e) {
                        var a, n, r, i, s, h, l = e.dyn_tree, o = e.max_code, _ = e.stat_desc.static_tree, d = e.stat_desc.has_stree, u = e.stat_desc.extra_bits, f = e.stat_desc.extra_base, c = e.stat_desc.max_length, g = 0;
                        for (i = 0; J >= i; i++) t.bl_count[i] = 0;
                        for (l[2 * t.heap[t.heap_max] + 1] = 0, a = t.heap_max + 1; G > a; a++) n = t.heap[a],
                            i = l[2 * l[2 * n + 1] + 1] + 1, i > c && (i = c, g++), l[2 * n + 1] = i, n > o || (t.bl_count[i]++,
                            s = 0, n >= f && (s = u[n - f]), h = l[2 * n], t.opt_len += h * (i + s), d && (t.static_len += h * (_[2 * n + 1] + s)));
                        if (0 !== g) {
                            do {
                                for (i = c - 1; 0 === t.bl_count[i]; ) i--;
                                t.bl_count[i]--, t.bl_count[i + 1] += 2, t.bl_count[c]--, g -= 2;
                            } while (g > 0);
                            for (i = c; 0 !== i; i--) for (n = t.bl_count[i]; 0 !== n; ) r = t.heap[--a], r > o || (l[2 * r + 1] !== i && (t.opt_len += (i - l[2 * r + 1]) * l[2 * r],
                                l[2 * r + 1] = i), n--);
                        }
                    }
                    function d(t, e, a) {
                        var n, r, i = new Array(J + 1), s = 0;
                        for (n = 1; J >= n; n++) i[n] = s = s + a[n - 1] << 1;
                        for (r = 0; e >= r; r++) {
                            var h = t[2 * r + 1];
                            0 !== h && (t[2 * r] = l(i[h]++, h));
                        }
                    }
                    function u() {
                        var t, e, a, n, r, i = new Array(J + 1);
                        for (a = 0, n = 0; H - 1 > n; n++) for (lt[n] = a, t = 0; t < 1 << $[n]; t++) ht[a++] = n;
                        for (ht[a - 1] = n, r = 0, n = 0; 16 > n; n++) for (ot[n] = r, t = 0; t < 1 << tt[n]; t++) st[r++] = n;
                        for (r >>= 7; M > n; n++) for (ot[n] = r << 7, t = 0; t < 1 << tt[n] - 7; t++) st[256 + r++] = n;
                        for (e = 0; J >= e; e++) i[e] = 0;
                        for (t = 0; 143 >= t; ) rt[2 * t + 1] = 8, t++, i[8]++;
                        for (;255 >= t; ) rt[2 * t + 1] = 9, t++, i[9]++;
                        for (;279 >= t; ) rt[2 * t + 1] = 7, t++, i[7]++;
                        for (;287 >= t; ) rt[2 * t + 1] = 8, t++, i[8]++;
                        for (d(rt, K + 1, i), t = 0; M > t; t++) it[2 * t + 1] = 5, it[2 * t] = l(t, 5);
                        _t = new ft(rt, $, F + 1, K, J), dt = new ft(it, tt, 0, M, J), ut = new ft(new Array(0), et, 0, P, V);
                    }
                    function f(t) {
                        var e;
                        for (e = 0; K > e; e++) t.dyn_ltree[2 * e] = 0;
                        for (e = 0; M > e; e++) t.dyn_dtree[2 * e] = 0;
                        for (e = 0; P > e; e++) t.bl_tree[2 * e] = 0;
                        t.dyn_ltree[2 * W] = 1, t.opt_len = t.static_len = 0, t.last_lit = t.matches = 0;
                    }
                    function c(t) {
                        t.bi_valid > 8 ? i(t, t.bi_buf) : t.bi_valid > 0 && (t.pending_buf[t.pending++] = t.bi_buf),
                            t.bi_buf = 0, t.bi_valid = 0;
                    }
                    function g(t, e, a, n) {
                        c(t), n && (i(t, a), i(t, ~a)), E.arraySet(t.pending_buf, t.window, e, a, t.pending),
                            t.pending += a;
                    }
                    function p(t, e, a, n) {
                        var r = 2 * e, i = 2 * a;
                        return t[r] < t[i] || t[r] === t[i] && n[e] <= n[a];
                    }
                    function m(t, e, a) {
                        for (var n = t.heap[a], r = a << 1; r <= t.heap_len && (r < t.heap_len && p(e, t.heap[r + 1], t.heap[r], t.depth) && r++,
                            !p(e, n, t.heap[r], t.depth)); ) t.heap[a] = t.heap[r], a = r, r <<= 1;
                        t.heap[a] = n;
                    }
                    function b(t, e, a) {
                        var n, i, l, o, _ = 0;
                        if (0 !== t.last_lit) do n = t.pending_buf[t.d_buf + 2 * _] << 8 | t.pending_buf[t.d_buf + 2 * _ + 1],
                            i = t.pending_buf[t.l_buf + _], _++, 0 === n ? h(t, i, e) : (l = ht[i], h(t, l + F + 1, e),
                            o = $[l], 0 !== o && (i -= lt[l], s(t, i, o)), n--, l = r(n), h(t, l, a), o = tt[l],
                        0 !== o && (n -= ot[l], s(t, n, o))); while (_ < t.last_lit);
                        h(t, W, e);
                    }
                    function v(t, e) {
                        var a, n, r, i = e.dyn_tree, s = e.stat_desc.static_tree, h = e.stat_desc.has_stree, l = e.stat_desc.elems, o = -1;
                        for (t.heap_len = 0, t.heap_max = G, a = 0; l > a; a++) 0 !== i[2 * a] ? (t.heap[++t.heap_len] = o = a,
                            t.depth[a] = 0) : i[2 * a + 1] = 0;
                        for (;t.heap_len < 2; ) r = t.heap[++t.heap_len] = 2 > o ? ++o : 0, i[2 * r] = 1,
                            t.depth[r] = 0, t.opt_len--, h && (t.static_len -= s[2 * r + 1]);
                        for (e.max_code = o, a = t.heap_len >> 1; a >= 1; a--) m(t, i, a);
                        r = l;
                        do a = t.heap[1], t.heap[1] = t.heap[t.heap_len--], m(t, i, 1), n = t.heap[1], t.heap[--t.heap_max] = a,
                            t.heap[--t.heap_max] = n, i[2 * r] = i[2 * a] + i[2 * n], t.depth[r] = (t.depth[a] >= t.depth[n] ? t.depth[a] : t.depth[n]) + 1,
                            i[2 * a + 1] = i[2 * n + 1] = r, t.heap[1] = r++, m(t, i, 1); while (t.heap_len >= 2);
                        t.heap[--t.heap_max] = t.heap[1], _(t, e), d(i, o, t.bl_count);
                    }
                    function w(t, e, a) {
                        var n, r, i = -1, s = e[1], h = 0, l = 7, o = 4;
                        for (0 === s && (l = 138, o = 3), e[2 * (a + 1) + 1] = 65535, n = 0; a >= n; n++) r = s,
                            s = e[2 * (n + 1) + 1], ++h < l && r === s || (o > h ? t.bl_tree[2 * r] += h : 0 !== r ? (r !== i && t.bl_tree[2 * r]++,
                            t.bl_tree[2 * X]++) : 10 >= h ? t.bl_tree[2 * Y]++ : t.bl_tree[2 * Z]++, h = 0,
                            i = r, 0 === s ? (l = 138, o = 3) : r === s ? (l = 6, o = 3) : (l = 7, o = 4));
                    }
                    function y(t, e, a) {
                        var n, r, i = -1, l = e[1], o = 0, _ = 7, d = 4;
                        for (0 === l && (_ = 138, d = 3), n = 0; a >= n; n++) if (r = l, l = e[2 * (n + 1) + 1],
                                !(++o < _ && r === l)) {
                            if (d > o) {
                                do h(t, r, t.bl_tree); while (0 !== --o);
                            } else 0 !== r ? (r !== i && (h(t, r, t.bl_tree), o--), h(t, X, t.bl_tree), s(t, o - 3, 2)) : 10 >= o ? (h(t, Y, t.bl_tree),
                                s(t, o - 3, 3)) : (h(t, Z, t.bl_tree), s(t, o - 11, 7));
                            o = 0, i = r, 0 === l ? (_ = 138, d = 3) : r === l ? (_ = 6, d = 3) : (_ = 7, d = 4);
                        }
                    }
                    function z(t) {
                        var e;
                        for (w(t, t.dyn_ltree, t.l_desc.max_code), w(t, t.dyn_dtree, t.d_desc.max_code),
                                 v(t, t.bl_desc), e = P - 1; e >= 3 && 0 === t.bl_tree[2 * at[e] + 1]; e--) ;
                        return t.opt_len += 3 * (e + 1) + 5 + 5 + 4, e;
                    }
                    function k(t, e, a, n) {
                        var r;
                        for (s(t, e - 257, 5), s(t, a - 1, 5), s(t, n - 4, 4), r = 0; n > r; r++) s(t, t.bl_tree[2 * at[r] + 1], 3);
                        y(t, t.dyn_ltree, e - 1), y(t, t.dyn_dtree, a - 1);
                    }
                    function x(t) {
                        var e, a = 4093624447;
                        for (e = 0; 31 >= e; e++, a >>>= 1) if (1 & a && 0 !== t.dyn_ltree[2 * e]) return I;
                        if (0 !== t.dyn_ltree[18] || 0 !== t.dyn_ltree[20] || 0 !== t.dyn_ltree[26]) return D;
                        for (e = 32; F > e; e++) if (0 !== t.dyn_ltree[2 * e]) return D;
                        return I;
                    }
                    function B(t) {
                        gt || (u(), gt = !0), t.l_desc = new ct(t.dyn_ltree, _t), t.d_desc = new ct(t.dyn_dtree, dt),
                            t.bl_desc = new ct(t.bl_tree, ut), t.bi_buf = 0, t.bi_valid = 0, f(t);
                    }
                    function A(t, e, a, n) {
                        s(t, (q << 1) + (n ? 1 : 0), 3), g(t, e, a, !0);
                    }
                    function C(t) {
                        s(t, T << 1, 3), h(t, W, rt), o(t);
                    }
                    function S(t, e, a, n) {
                        var r, i, h = 0;
                        t.level > 0 ? (t.strm.data_type === O && (t.strm.data_type = x(t)), v(t, t.l_desc),
                            v(t, t.d_desc), h = z(t), r = t.opt_len + 3 + 7 >>> 3, i = t.static_len + 3 + 7 >>> 3,
                        r >= i && (r = i)) : r = i = a + 5, r >= a + 4 && -1 !== e ? A(t, e, a, n) : t.strategy === U || i === r ? (s(t, (T << 1) + (n ? 1 : 0), 3),
                            b(t, rt, it)) : (s(t, (L << 1) + (n ? 1 : 0), 3), k(t, t.l_desc.max_code + 1, t.d_desc.max_code + 1, h + 1),
                            b(t, t.dyn_ltree, t.dyn_dtree)), f(t), n && c(t);
                    }
                    function j(t, e, a) {
                        return t.pending_buf[t.d_buf + 2 * t.last_lit] = e >>> 8 & 255, t.pending_buf[t.d_buf + 2 * t.last_lit + 1] = 255 & e,
                            t.pending_buf[t.l_buf + t.last_lit] = 255 & a, t.last_lit++, 0 === e ? t.dyn_ltree[2 * a]++ : (t.matches++,
                            e--, t.dyn_ltree[2 * (ht[a] + F + 1)]++, t.dyn_dtree[2 * r(e)]++), t.last_lit === t.lit_bufsize - 1;
                    }
                    var E = t("../utils/common"), U = 4, I = 0, D = 1, O = 2, q = 0, T = 1, L = 2, N = 3, R = 258, H = 29, F = 256, K = F + 1 + H, M = 30, P = 19, G = 2 * K + 1, J = 15, Q = 16, V = 7, W = 256, X = 16, Y = 17, Z = 18, $ = [ 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0 ], tt = [ 0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13 ], et = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7 ], at = [ 16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15 ], nt = 512, rt = new Array(2 * (K + 2));
                    n(rt);
                    var it = new Array(2 * M);
                    n(it);
                    var st = new Array(nt);
                    n(st);
                    var ht = new Array(R - N + 1);
                    n(ht);
                    var lt = new Array(H);
                    n(lt);
                    var ot = new Array(M);
                    n(ot);
                    var _t, dt, ut, ft = function(t, e, a, n, r) {
                        this.static_tree = t, this.extra_bits = e, this.extra_base = a, this.elems = n,
                            this.max_length = r, this.has_stree = t && t.length;
                    }, ct = function(t, e) {
                        this.dyn_tree = t, this.max_code = 0, this.stat_desc = e;
                    }, gt = !1;
                    a._tr_init = B, a._tr_stored_block = A, a._tr_flush_block = S, a._tr_tally = j,
                        a._tr_align = C;
                }, {
                    "../utils/common": 1
                } ],
                8: [ function(t, e) {
                    "use strict";
                    function a() {
                        this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null,
                            this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = "", this.state = null,
                            this.data_type = 2, this.adler = 0;
                    }
                    e.exports = a;
                }, {} ],
                "/lib/deflate.js": [ function(t, e, a) {
                    "use strict";
                    function n(t, e) {
                        var a = new v(e);
                        if (a.push(t, !0), a.err) throw a.msg;
                        return a.result;
                    }
                    function r(t, e) {
                        return e = e || {}, e.raw = !0, n(t, e);
                    }
                    function i(t, e) {
                        return e = e || {}, e.gzip = !0, n(t, e);
                    }
                    var s = t("./zlib/deflate.js"), h = t("./utils/common"), l = t("./utils/strings"), o = t("./zlib/messages"), _ = t("./zlib/zstream"), d = Object.prototype.toString, u = 0, f = 4, c = 0, g = 1, p = -1, m = 0, b = 8, v = function(t) {
                        this.options = h.assign({
                            level: p,
                            method: b,
                            chunkSize: 16384,
                            windowBits: 15,
                            memLevel: 8,
                            strategy: m,
                            to: ""
                        }, t || {});
                        var e = this.options;
                        e.raw && e.windowBits > 0 ? e.windowBits = -e.windowBits : e.gzip && e.windowBits > 0 && e.windowBits < 16 && (e.windowBits += 16),
                            this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new _(),
                            this.strm.avail_out = 0;
                        var a = s.deflateInit2(this.strm, e.level, e.method, e.windowBits, e.memLevel, e.strategy);
                        if (a !== c) throw new Error(o[a]);
                        e.header && s.deflateSetHeader(this.strm, e.header);
                    };
                    v.prototype.push = function(t, e) {
                        var a, n, r = this.strm, i = this.options.chunkSize;
                        if (this.ended) return !1;
                        n = e === ~~e ? e : e === !0 ? f : u, r.input = "string" == typeof t ? l.string2buf(t) : "[object ArrayBuffer]" === d.call(t) ? new Uint8Array(t) : t,
                            r.next_in = 0, r.avail_in = r.input.length;
                        do {
                            if (0 === r.avail_out && (r.output = new h.Buf8(i), r.next_out = 0, r.avail_out = i),
                                    a = s.deflate(r, n), a !== g && a !== c) return this.onEnd(a), this.ended = !0,
                                !1;
                            (0 === r.avail_out || 0 === r.avail_in && n === f) && this.onData("string" === this.options.to ? l.buf2binstring(h.shrinkBuf(r.output, r.next_out)) : h.shrinkBuf(r.output, r.next_out));
                        } while ((r.avail_in > 0 || 0 === r.avail_out) && a !== g);
                        return n === f ? (a = s.deflateEnd(this.strm), this.onEnd(a), this.ended = !0, a === c) : !0;
                    }, v.prototype.onData = function(t) {
                        this.chunks.push(t);
                    }, v.prototype.onEnd = function(t) {
                        t === c && (this.result = "string" === this.options.to ? this.chunks.join("") : h.flattenChunks(this.chunks)),
                            this.chunks = [], this.err = t, this.msg = this.strm.msg;
                    }, a.Deflate = v, a.deflate = n, a.deflateRaw = r, a.gzip = i;
                }, {
                    "./utils/common": 1,
                    "./utils/strings": 2,
                    "./zlib/deflate.js": 5,
                    "./zlib/messages": 6,
                    "./zlib/zstream": 8
                } ]
            }, {}, [])("/lib/deflate.js");
        }), function(root) {
            var DCA_CONF = {};
            DCA_CONF = {
                LOG_LEVEL: 4,
                BATCH_SIZE: 100,
                DATA_SERVER: "https://input.networkanalytics.net",
                CONFIG_SERVER: "https://b.networkanalytics.net"
            }, root.DCA_CONF = DCA_CONF;
        }(root), function(root, window) {
            var Spine = root.Spine, _ = root._, DCA_CONF = root.DCA_CONF, LOG_LEVEL = {
                DEBUG: 1,
                INFO: 2,
                WARN: 3,
                ERROR: 4,
                Desc: {
                    1: "DEBUG",
                    2: "INFO",
                    3: "WARN",
                    4: "ERROR"
                }
            }, MSG_TOPIC = {
                ANY: ".*",
                ECHO: "echo",
                REQUEST_DATA_READY: "request-data-ready",
                TAB_PRERENDER: "tab-prerender",
                TAB_VISIBLE: "tab-visible",
                TAB_HIDDEN: "tab-hidden",
                TAB_RELOADED: "tab-reloaded"
            }, MSG_SUBJECT = {
                COLLECTION_WORKER: "collection-worker",
                TAB_STATE: "tab-state",
                CONFIG: "config"
            }, Logger = function(logger_name, logger_level) {
                var write = function(message, log_level) {
                    function pad(number) {
                        var r = String(number);
                        return 1 === r.length && (r = "0" + r), r;
                    }
                    if (!(logger_level > log_level)) {
                        var today = new Date(), current_time = today.getFullYear() + "-" + pad(today.getMonth() + 1) + "-" + pad(today.getDate()) + " " + pad(today.getHours()) + ":" + pad(today.getMinutes()) + ":" + pad(today.getSeconds()), message = "[DCA] " + current_time + "	" + LOG_LEVEL.Desc[log_level] + "	" + logger_name + ":	" + message;
                        switch (log_level) {
                            case LOG_LEVEL.DEBUG:
                                console.log(message);
                                break;

                            case LOG_LEVEL.INFO:
                                console.info(message);
                                break;

                            case LOG_LEVEL.WARN:
                                console.warn(message);
                                break;

                            case LOG_LEVEL.ERROR:
                                console.error(message);
                        }
                    }
                };
                return {
                    log: function(message) {
                        return write(message, LOG_LEVEL.DEBUG);
                    },
                    warn: function(message) {
                        return write(message, LOG_LEVEL.WARN);
                    },
                    info: function(message) {
                        return write(message, LOG_LEVEL.INFO);
                    },
                    error: function(message) {
                        return write(message, LOG_LEVEL.ERROR);
                    }
                };
            }, BaseComponent = Spine.Model.extend({
                set_context: function(context) {
                    this._context = context;
                },
                start: function() {},
                stop: function() {},
                create: function() {},
                destroy: function() {},
                cleanup: function() {},
                set_options: function(options) {},
                repeat: function(cb, delay) {
                    var self = this, one_interval = setInterval(function() {
                        cb.call(self);
                    }, 1e3 * self.get(delay));
                    void 0 == this._repeat_intervals && (this._repeat_intervals = []), this._repeat_intervals.push(one_interval);
                },
                clear_intervals: function() {
                    void 0 != this._repeat_intervals && (_.each(this._repeat_intervals, function(one_interval_id) {
                        clearInterval(one_interval_id);
                    }), this._repeat_intervals = []);
                },
                time: function() {
                    return Math.round(Date.now() / 1e3);
                }
            }), Loader = Spine.Model.extend({
                defaults: {
                    log_level: LOG_LEVEL.WARN,
                    name: ""
                },
                initialize: function() {
                    this._components = {}, this._initialized_cache = {}, this.logger = Logger(this.get("name"), this.get("log_level")),
                        this._is_running = !1;
                },
                create_compontent: function(compontent_name) {
                    if ("undefined" != typeof this._initialized_cache[compontent_name]) return this._components[compontent_name].instance;
                    if ("undefined" != typeof this._components[compontent_name]) {
                        var one_component = this._components[compontent_name];
                        return one_component.instance = new one_component.loader(), one_component.instance.set_context(this),
                            one_component.instance.logger = Logger(compontent_name, this.get("log_level")),
                            this.logger.log("  -- create: " + compontent_name), one_component.instance.create(),
                            delete one_component.loader, this._initialized_cache[compontent_name] = !0, one_component.instance;
                    }
                    throw "Component isn't defined: " + compontent_name;
                },
                create: function() {
                    this.logger.log("Create Components"), _.each(this._components, function(one_component, one_name) {
                        _.each(one_component.dependencies, function(one_dependent_name) {
                            this.create_compontent(one_dependent_name);
                        }.bind(this)), this.create_compontent(one_name);
                    }.bind(this));
                },
                destroy: function() {
                    this.logger.log("Destroy Components"), _.each(this._components, function(one_component, one_name) {
                        "undefined" != typeof one_component.instance && one_component.instance.destroy(),
                            delete this._components[one_name];
                    }.bind(this));
                },
                uninstall: function() {
                    this.stop(), this.destroy();
                },
                start: function() {
                    return this._is_running ? !0 : (this._is_running = !0, void _.each(this._components, function(one_component, one_name) {
                        this.logger.log("  -- start: " + one_name), one_component.instance.start();
                    }.bind(this)));
                },
                stop: function() {
                    return 0 == this._is_running ? !1 : (this._is_running = !1, void _.each(this._components, function(one_component, one_name) {
                        this.logger.log("  -- stop: " + one_name), one_component.instance.stop();
                    }.bind(this)));
                },
                cleanup: function() {
                    this.logger.log("Cleanup"), _.each(this._components, function(one_component, one_name) {
                        "undefined" != typeof one_component.instance && (this.logger.log("  -- cleanup: " + one_name),
                            one_component.instance.cleanup());
                    }.bind(this));
                },
                set_options: function(options) {
                    _.each(this._components, function(one_component, one_name) {
                        "undefined" != typeof one_component.instance && one_component.instance.set_options(options);
                    }.bind(this));
                },
                add_component: function(name, dependencies, component) {
                    this._components[name] = {
                        name: name,
                        loader: component,
                        dependencies: dependencies
                    };
                },
                get_component: function(name) {
                    if ("undefined" != typeof this._components[name] && "undefined" != typeof this._components[name].instance) return this._components[name].instance;
                    throw "Unknown Component: " + name;
                }
            }), _loader = new Loader({
                log_level: DCA_CONF.LOG_LEVEL,
                name: "Loader"
            }), LocalStorage = BaseComponent.extend({
                defaults: {
                    prefix: "dca"
                },
                initialize: function(prefix) {
                    this.set("prefix", prefix);
                },
                create: function() {},
                destroy: function() {},
                cleanup: function() {
                    for (var key in localStorage) this._is_prefixed(key) && this.remove(key.replace(this.get("prefix") + ":", ""));
                },
                _prefix: function(k) {
                    return this.get("prefix") + ":" + k;
                },
                _is_prefixed: function(k) {
                    var one_prefix = this.get("prefix") + ":";
                    return 0 == k.indexOf(one_prefix) && 1 == k.replace(one_prefix, "").split(":").length ? !0 : !1;
                },
                remove: function(k) {
                    localStorage.removeItem(this._prefix(k));
                },
                retrieve: function(k) {
                    return localStorage.getItem(this._prefix(k));
                },
                store: function(k, v) {
                    return localStorage.setItem(this._prefix(k), v);
                }
            });
            _loader.add_component("dca/local_storage", [], LocalStorage), _loader.add_component("dca/settings", [], LocalStorage.extend({
                defaults: {
                    prefix: "dca:settings"
                }
            })), _loader.add_component("dca/client", [], BaseComponent.extend({
                create: function() {
                    this._meta_fields = [ "user_browser_id", "user_software_id", "partner_id", "_channel_id" ],
                        this._params = {}, _.each([ "user_browser_id", "user_software_id", "partner_id" ], function(one_item) {
                        var one_val = localStorage.getItem("co:" + one_item);
                        void 0 != one_val && one_val && 0 == one_val.indexOf('"') && (one_val = JSON.parse(one_val)),
                            this._params["_" + one_item] = one_val;
                    }.bind(this)), this._params._channel_id = chrome.runtime.id;
                },
                param_prep: function(params) {
                    return void 0 == params && (params = {}), _.each(this._params, function(one_value, one_key) {
                        params[one_key] = one_value;
                    }.bind(this)), params;
                },
                serialize: function(obj) {
                    var str = [];
                    for (var p in obj) obj.hasOwnProperty(p) && (_.isObject(obj[p]) ? _.each(obj[p], function(one_val, one_key) {
                        str.push(encodeURIComponent(p) + "[" + one_key + "]=" + encodeURIComponent(one_val));
                    }) : str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p])));
                    return str.join("&");
                },
                xhr_post: function(url, params, headers, post_body, cb) {
                    var xhr = new XMLHttpRequest();
                    xhr.open("POST", url + "?" + this.serialize(this.param_prep(params)), !0), _.each(headers, function(value, name) {
                        xhr.setRequestHeader(name, value);
                    }), xhr.setRequestHeader("Content-Type", "text/plain"), xhr.onreadystatechange = function(e) {
                        4 == xhr.readyState && 200 == xhr.status && void 0 != cb && "function" == typeof cb && cb(e);
                    }.bind(this), xhr.send(post_body);
                },
                xhr_get: function(url, params, cb) {
                    var request = new XMLHttpRequest();
                    request.open("GET", url + "?" + this.serialize(this.param_prep(params)), !0), request.onload = function() {
                        if (request.status >= 200 && request.status < 400 && void 0 != cb) {
                            var response_data = request.responseText;
                            try {
                                response_data = JSON.parse(response_data);
                            } catch (e) {}
                            cb(response_data);
                        }
                    }, request.send();
                }
            }));
            var MessageSenderFactory = function(context, target_obj) {
                return target_obj._context = context, target_obj._messaging = target_obj._context.get_component("dca/messaging"),
                {
                    send: function(subject, topic, data) {
                        this._messaging.send(subject, topic, data);
                    },
                    transmit: function(subject, topic, data) {
                        this._messaging.transmit(subject, topic, data);
                    }
                };
            }, MessageReceiverFactory = function(context, target_obj, subject, topic) {
                return target_obj._context = context, target_obj._target_obj = target_obj, target_obj._callback = function(topic, data) {
                    target_obj.is_topic_acceptable(topic) && target_obj._target_obj.on_message(subject, topic, data);
                }.bind(this), target_obj._messaging = target_obj._context.get_component("dca/messaging"),
                    target_obj._messaging.add_receiver(subject, target_obj._callback), target_obj._subject = subject,
                    target_obj._topic = topic, target_obj._topic_regexp = new RegExp(MSG_TOPIC.ANY),
                target_obj._topic && (target_obj._topic_regexp = new RegExp(target_obj._topic)),
                {
                    is_topic_acceptable: function(topic) {
                        return this._topic_regexp.test(topic);
                    },
                    unregister: function() {
                        this._messaging.remove_receiver(this._subject, this._callback);
                    }
                };
            }, ReceiverHandlerMixin = {
                _all_receivers: {},
                add_receiver: function(subject, one_receiver) {
                    var receivers = this.get_receivers(subject);
                    receivers.push(one_receiver);
                },
                remove_receiver: function(subject, one_receiver) {
                    var receivers = this.get_receivers(subject), index = receivers.indexOf(one_receiver);
                    index > -1 && receivers.splice(index, 1);
                },
                get_receivers: function(subject) {
                    return "undefined" == typeof this._all_receivers[subject] && (this._all_receivers[subject] = []),
                        this._all_receivers[subject];
                },
                notify_receivers: function(subject, topic, data) {
                    _.each(this.get_receivers(subject), function(one_receiver) {
                        one_receiver(topic, data);
                    });
                }
            };
            _loader.add_component("dca/messaging", [], BaseComponent.extend({
                create: function() {
                    this._transmitter = null, _.extend(this, ReceiverHandlerMixin);
                },
                parse_data: function(data) {
                    return JSON.parse(data);
                },
                serialize_data: function(data) {
                    return void 0 === data || null === data ? JSON.stringify(null) : data && data.get_json ? data.get_json() : JSON.stringify(data);
                },
                extend_sender: function(target_obj) {
                    _.extend(target_obj, MessageSenderFactory(this._context, target_obj));
                },
                extend_receiver: function(target_obj, subject, topic) {
                    _.extend(target_obj, MessageReceiverFactory(this._context, target_obj, subject, topic));
                },
                set_transmitter: function(trasmitter) {
                    this._transmitter = trasmitter;
                },
                transmit: function(subject, topic, data) {
                    this._transmitter && this._transmitter.receive(subject, topic, this.serialize_data(data));
                },
                send: function(subject, topic, data) {
                    this.notify_receivers(subject, topic, data);
                },
                receive: function(subject, topic, data) {
                    this.notify_receivers(subject, topic, this.parse_data(data));
                }
            })), _loader.add_component("dca/config", [ "dca/messaging" ], BaseComponent.extend({
                defaults: {
                    prefix: "dca:config",
                    _fetch_retry_secs: 3600
                },
                initialize: function() {
                    this._config = {
                        collect: !0,
                        stream_type: "click",
                        batch_size: DCA_CONF.BATCH_SIZE,
                        version: "1.2.5"
                    };
                },
                create: function() {
                    this._db = new LocalStorage(this.get("prefix")), this.client = this._context.get_component("dca/client"),
                        this.settings = this._context.get_component("dca/settings"), this.messaging = this._context.get_component("dca/messaging"),
                        this.messaging.extend_sender(this);
                    var written_version = this._db.retrieve("version");
                    (null == written_version || written_version != this._config.version) && this._db.store("version", this._config.version);
                    var stored_data = {};
                    if (this._db.retrieve("data")) try {
                        stored_data = JSON.parse(this._db.retrieve("data"));
                    } catch (e) {}
                    _.each(stored_data, function(one_value, one_key) {
                        void 0 != this._config[one_key] && (this._config[one_key] = one_value);
                    }.bind(this));
                },
                get_setting: function(setting_name) {
                    return void 0 == this._config[setting_name] ? null : this._config[setting_name];
                },
                start: function() {
                    this.fetch(), this.repeat(this.fetch.bind(this), "_fetch_retry_secs");
                },
                stop: function() {
                    this.clear_intervals();
                },
                fetch: function() {
                    var now = this.time(), last_fetch = this._db.retrieve("last_fetch"), delta = now - last_fetch;
                    delta < this.get("_fetch_retry_secs") || this.client.xhr_get(DCA_CONF.CONFIG_SERVER + "/dca/config", {}, function(response_data) {
                        var b_changed_attribute = !1;
                        void 0 != response_data && null != response_data && _.each(response_data, function(one_value, one_key) {
                            void 0 != this._config[one_key] && this._config[one_key] != one_value && (this._config[one_key] = one_value,
                                b_changed_attribute = !0);
                        }.bind(this)), b_changed_attribute && this.messaging.send(MSG_SUBJECT.CONFIG, MSG_TOPIC.CONFIG_UPDATE, null),
                            this._db.store("data", JSON.stringify(response_data)), this._db.store("last_fetch", now);
                    }.bind(this));
                }
            })), _loader.add_component("dca/collector", [ "dca/messaging" ], BaseComponent.extend({
                defaults: {
                    batch_size: DCA_CONF.BATCH_SIZE,
                    data_server: DCA_CONF.DATA_SERVER
                },
                initialize: function() {
                    this._request_batch = [], this._params = {
                        _user_browser_id: null,
                        _user_software_id: null,
                        _partner_id: null,
                        _channel_id: chrome.runtime.id
                    };
                },
                create: function() {
                    this.config = this._context.get_component("dca/config"), this.client = this._context.get_component("dca/client"),
                        this.messaging = this._context.get_component("dca/messaging"), this.messaging.extend_sender(this),
                        this.messaging.extend_receiver(this, MSG_SUBJECT.COLLECTION_WORKER), this.messaging.extend_receiver(this, MSG_SUBJECT.CONFIG);
                },
                destroy: function() {
                    this.unregister();
                },
                start: function() {
                    var on_window_removed = function(data) {
                        this.process();
                    }.bind(this);
                    this.on_window_removed = on_window_removed, chrome.windows.onRemoved.addListener(on_window_removed);
                },
                stop: function() {
                    chrome.windows.onRemoved.removeListener(this.on_window_removed);
                },
                process: function() {
                    this.logger.log("Send payload - " + this._request_batch.length);
                    var requests = this._request_batch;
                    this._request_batch = [], payload = btoa(pako.deflate(root.dca_compressor.utf16to8(JSON.stringify(requests)), {
                        to: "string"
                    }));
                    var url = this.get("data_server") + "/data", headers = {}, params = {};
                    this.client.xhr_post(url, params, headers, payload);
                },
                batch: function(request_data) {
                    this._request_batch.push(request_data.to_json());
                    var batch_size = this.get("batch_size");
                    this.config.get_setting("batch_size") && (batch_size = this.config.get_setting("batch_size")),
                    this._request_batch.length >= batch_size && this.process();
                },
                on_message: function(subject, topic, request_data) {
                    subject == MSG_SUBJECT.COLLECTION_WORKER ? (this.logger.log("Message Received: " + topic),
                        request_data.scrub_post_data(), this.batch(request_data)) : subject == MSG_SUBJECT.CONFIG && this.logger.log("Configuration updated");
                }
            }));
            var RequestData = Spine.Model.extend({
                initialize: function(data) {
                    if (data.timeStamp || (data.timeStamp = Date.now()), this._request = data, this._request.requestType = 0 == data.type.indexOf("main_frame") || "sub_frame" == data.type ? "main" : "resource",
                            this._request.openerTabId = null, void 0 != data.postData) {
                        var postData = "";
                        for (var key in data.postData) postData += key + "=" + data.postData[key] + "&";
                        this._request.postData = postData.replace(/&$/, "");
                    }
                    this._request.requestHeaders = this.parse_headers(data.requestHeaders), this._request.responseHeaders = this.parse_headers(data.responseHeaders);
                },
                parse_headers: function(headers) {
                    var result = {};
                    return headers && _.each(headers, function(one_header) {
                        result[one_header.name] = one_header.value;
                    }), result;
                },
                is_secure: function() {
                    return 0 == this._request.url.indexOf("https://");
                },
                to_json: function() {
                    return JSON.stringify(this._request);
                },
                get_tab_id: function() {
                    return this._request.tabId;
                },
                set_tab_id: function(tab_id) {
                    this._request.tabId = tab_id;
                },
                get_opener_tab_id: function() {
                    return this._request.openerTabId;
                },
                set_opener_tab_id: function(tab_id) {
                    this._request.openerTabId = tab_id;
                },
                get_url: function() {
                    return this._request.url;
                },
                set_window_name: function(window_name) {
                    this._request.windowName = window_name;
                },
                set_window_title: function(window_title) {
                    this._request.windowTitle = window_title;
                },
                set_document_referer: function(document_referer) {
                    this._request.documentReferer = document_referer;
                },
                scrub_post_data: function() {
                    this.is_secure() && "POST" == this._request.method && (this._request.postData = "");
                }
            });
            _loader.add_component("dca/monitoring", [ "dca/messaging", "dca/browser_tabs" ], BaseComponent.extend({
                initialize: function() {
                    this._requests_cache = {}, this._pending_requests_by_tab = [], this._last_request_by_tab = {},
                        this._visible_tabs = {};
                },
                is_valid_data: function(data) {
                    return -1 != data.tabId;
                },
                is_tab_visible: function(tab_id) {
                    return void 0 != this._visible_tabs[tab_id];
                },
                init_request_cache: function(data) {
                    void 0 == this._requests_cache[data.requestId] && (this._requests_cache[data.requestId] = {});
                },
                emit_request: function(request_data) {
                    this.messaging.send(MSG_SUBJECT.COLLECTION_WORKER, MSG_TOPIC.REQUEST_DATA_READY, request_data);
                },
                fix_tab_id: function(request_data) {
                    var old_id = request_data.get_tab_id(), new_id = this.browser_tabs.get_updated_tab_id(old_id);
                    void 0 != new_id && new_id != old_id && request_data.set_tab_id(new_id);
                    var opener_tab_id = this.browser_tabs.get_opener_tab_id(request_data.get_url(), request_data.get_tab_id());
                    request_data.set_opener_tab_id(opener_tab_id);
                },
                dispatch_request: function(request_id, request_data) {
                    this.is_tab_visible(request_data.get_tab_id()) ? this.emit_request(request_data) : this._pending_requests_by_tab.push(request_data),
                    request_id && void 0 != this._requests_cache[request_id] && delete this._requests_cache[request_id];
                },
                process_request: function(data) {
                    if (this.is_valid_data(data)) {
                        void 0 != this._requests_cache[data.requestId] && (data.requestHeaders = this._requests_cache[data.requestId].request_headers,
                            data.formData = this._requests_cache[data.requestId].form_data);
                        var request_data = new RequestData(data);
                        this.fix_tab_id(request_data), "main_frame" == data.type ? (this._last_request_by_tab[request_data.get_tab_id()] = request_data,
                            chrome.tabs.executeScript(data.tabId, {
                                code: "[document.referrer, window.name, window.document.title];"
                            }, function(page_data) {
                                var last_error = chrome.runtime.lastError;
                                if (void 0 == last_error && void 0 != page_data && null != page_data && Array.isArray(page_data)) {
                                    var window_data = page_data[0];
                                    if (void 0 != window_data && 3 == window_data.length) {
                                        var document_referer = window_data[0], window_name = window_data[1], window_title = window_data[2];
                                        request_data.set_document_referer(document_referer), request_data.set_window_title(window_title),
                                            request_data.set_window_name(window_name);
                                    }
                                }
                                this.dispatch_request(data.requestId, request_data);
                            }.bind(this))) : this.dispatch_request(data.requestId, request_data);
                    }
                },
                clear_tab: function(tab_id) {
                    for (var i = 0; i < this._pending_requests_by_tab.length; i++) this._pending_requests_by_tab[i].get_tab_id() == tab_id && this._pending_requests_by_tab.splice(i--, 1);
                },
                send_tab_requests: function(tab_id) {
                    for (var i = 0; i < this._pending_requests_by_tab.length; i++) this._pending_requests_by_tab[i].get_tab_id() == tab_id && this.emit_request(this._pending_requests_by_tab[i]);
                },
                create: function() {
                    this.config = this._context.get_component("dca/config"), this.messaging = this._context.get_component("dca/messaging"),
                        this.messaging.extend_sender(this), this.messaging.extend_receiver(this, MSG_SUBJECT.TAB_STATE),
                        this.messaging.extend_receiver(this, MSG_SUBJECT.CONFIG), this.browser_tabs = this._context.get_component("dca/browser_tabs"),
                        this._is_running = !1;
                },
                start: function() {
                    if (this.logger.log("Start Monitoring"), this._is_running = !0, 0 == this.config.get_setting("collect")) return void this.logger.log("Collection is off");
                    var request_types = [ "main_frame" ];
                    "request" == this.config.get_setting("stream_type") && (request_types = [ "main_frame", "sub_frame", "stylesheet", "script", "image", "object", "xmlhttprequest", "other" ]);
                    var request_filter = {
                        urls: [ "http://*/*", "https://*/*" ],
                        types: request_types
                    }, on_before_request = function(data) {
                        this.is_valid_data(data) && void 0 != data.requestBody && (this.init_request_cache(data),
                            this._requests_cache[data.requestId] = {
                                form_data: data.requestBody.formData
                            });
                    }.bind(this);
                    this.on_before_request = on_before_request;
                    var on_before_redirect = function(data) {
                        this.process_request(data);
                    }.bind(this);
                    this.on_before_redirect = on_before_redirect;
                    var on_before_send_headers = function(data) {
                        this.is_valid_data(data) && (this.init_request_cache(data), this._requests_cache[data.requestId].request_headers = data.requestHeaders);
                    }.bind(this);
                    this.on_before_send_headers = on_before_send_headers;
                    var on_completed = function(data) {
                        this.process_request(data);
                    }.bind(this);
                    this.on_completed = on_completed;
                    var on_error_occured = function(data) {
                        this.is_valid_data(data) && (void 0 != data.error && "net::ERR_NAME_NOT_RESOLVED" == data.error && this.process_request(data),
                            delete this._requests_cache[data.requestId]);
                    }.bind(this);
                    this.on_error_occured = on_error_occured, chrome.webRequest.onBeforeRequest.addListener(on_before_request, request_filter, [ "requestBody" ]),
                        chrome.webRequest.onBeforeRedirect.addListener(on_before_redirect, request_filter, [ "responseHeaders" ]),
                        chrome.webRequest.onBeforeSendHeaders.addListener(on_before_send_headers, request_filter, [ "requestHeaders" ]),
                        chrome.webRequest.onCompleted.addListener(on_completed, request_filter, [ "responseHeaders" ]),
                        chrome.webRequest.onErrorOccurred.addListener(on_error_occured, request_filter);
                    var on_tab_updated = function(tab_id, change_info, tab) {
                        if (void 0 != change_info && change_info.status && "complete" == change_info.status && 0 != tab.url.indexOf("chrome://") && this.is_tab_visible(tab_id)) {
                            var last_request_data = this._last_request_by_tab[tab.id];
                            if (void 0 != last_request_data && last_request_data._request && void 0 != last_request_data._request.url && last_request_data._request.url != tab.url) {
                                var last_request_id = null;
                                void 0 != last_request_data._request && void 0 != last_request_data._request.requestId && (last_request_id = last_request_data._request.requestId);
                                var request_data = new RequestData({
                                    type: "main_frame_url",
                                    tabId: tab_id,
                                    url: tab.url,
                                    windowTitle: tab.title,
                                    mainFrameRequestId: last_request_id
                                });
                                this.dispatch_request(null, request_data);
                            }
                        }
                    }.bind(this);
                    this.on_tab_updated = on_tab_updated, chrome.tabs.onUpdated.addListener(on_tab_updated);
                    var on_tab_removed = function(tab_id, change_info, tab) {
                        void 0 != this._last_request_by_tab[tab_id] && delete this._last_request_by_tab[tab_id],
                            delete this._visible_tabs[tab_id];
                    }.bind(this);
                    this.on_tab_removed = on_tab_removed, chrome.tabs.onRemoved.addListener(on_tab_removed);
                },
                stop: function() {
                    return 0 == this._is_running ? !0 : (this.logger.log("Stop Monitoring"), this._is_running = !1,
                        chrome.webRequest.onBeforeRequest.removeListener(this.on_before_request), chrome.webRequest.onBeforeRedirect.removeListener(this.on_before_redirect),
                        chrome.webRequest.onBeforeSendHeaders.removeListener(this.on_before_send_headers),
                        chrome.webRequest.onCompleted.removeListener(this.on_completed), chrome.webRequest.onErrorOccurred.removeListener(this.on_error_occured),
                        chrome.tabs.onUpdated.removeListener(this.on_tab_updated), void chrome.tabs.onRemoved.removeListener(this.on_tab_removed));
                },
                destroy: function() {
                    this.stop();
                },
                on_message: function(subject, topic, tab_id) {
                    if (subject == MSG_SUBJECT.TAB_STATE) switch (topic) {
                        case MSG_TOPIC.TAB_VISIBLE:
                        case MSG_TOPIC.TAB_HIDDEN:
                            this._visible_tabs[tab_id] = !0, this.send_tab_requests(tab_id), this.clear_tab(tab_id);
                            break;

                        case MSG_TOPIC.TAB_RELOADED:
                            this.clear_tab(tab_id);
                    } else subject == MSG_SUBJECT.CONFIG && (this.logger.log("Config update"), this._is_running && (this.stop(),
                        this.start()));
                }
            })), _loader.add_component("dca/browser_tabs", [ "dca/messaging" ], BaseComponent.extend({
                defaults: {
                    port_name: "dca-content-script-tracker"
                },
                initialize: function() {
                    this._tabs = {}, this._referral = {}, this._last_tab_click = {};
                },
                get_updated_tab_id: function(tab_id) {
                    var new_id = this._tabs[tab_id];
                    return void 0 == new_id && (new_id = tab_id), new_id;
                },
                get_opener_tab_id: function(url, tab_id) {
                    var opener_tab_id, obj = this._referral[tab_id];
                    return void 0 != obj && obj.url == url && (opener_tab_id = void 0 == obj.source_tab_id ? this._last_tab_click[url] : obj.source_tab_id),
                        opener_tab_id;
                },
                add_content_script_listeners: function(cs_port) {
                    var message_listener = function(message) {
                        var internal_data = {
                            port_name: cs_port.name,
                            tab_id: cs_port.sender.tab.id,
                            data: message.data
                        };
                        1 == message.id ? this.on_tab_visibility_changed(internal_data) : 2 == message.id && this.on_context_menu_shown(internal_data);
                    }.bind(this), disconnect_listener = function(port) {
                        port.onDisconnect.removeListener(message_listener), port.onMessage.removeListener(message_listener),
                            this.on_content_script_disconnected({
                                port_name: port.name,
                                tab_id: port.sender.tab.id
                            });
                    }.bind(this);
                    cs_port.onMessage.addListener(message_listener), cs_port.onDisconnect.addListener(disconnect_listener);
                },
                on_tab_visibility_changed: function(data) {
                    var topic = null;
                    switch (data.data) {
                        case "prerender":
                            topic = MSG_TOPIC.TAB_PRERENDER;
                            break;

                        case "visible":
                            topic = MSG_TOPIC.TAB_VISIBLE;
                            break;

                        case "hidden":
                            topic = MSG_TOPIC.TAB_HIDDEN;
                    }
                    null != topic && this.messaging.send(MSG_SUBJECT.TAB_STATE, topic, data.tab_id);
                },
                on_context_menu_shown: function(data) {
                    this._last_tab_click[data.data] = data.tab_id;
                },
                on_content_script_disconnected: function(data) {
                    this.messaging.send(MSG_SUBJECT.TAB_STATE, MSG_TOPIC.TAB_RELOADED, data.tab_id);
                },
                create: function() {
                    this.messaging = this._context.get_component("dca/messaging");
                    var content_script_listener = function(port) {
                        port.name == this.get("port_name") && void 0 != port.sender && void 0 != port.sender.tab && void 0 != port.sender.tab.id && this.add_content_script_listeners(port);
                    }.bind(this);
                    this.content_script_listener = content_script_listener, chrome.extension.onConnect.addListener(content_script_listener);
                    var on_tab_replaced = function(data) {
                        this._tabs[data.tabId] = data.replacedTabId;
                    }.bind(this);
                    this.on_tab_replaced = on_tab_replaced;
                    var on_created_navigation_target = function(data) {
                        this._referral[data.tabId] = {
                            source_tab_id: data.sourceTabId,
                            url: data.url
                        };
                    }.bind(this);
                    this.on_created_navigation_target = on_created_navigation_target;
                    var on_created = function(tab_data) {
                        void 0 != tab_data.id && void 0 != tab_data.url && (this._referral[tab_data.id] = {
                            source_tab_id: tab_data.openerTabId,
                            url: tab_data.url
                        });
                    }.bind(this);
                    this.on_created = on_created, chrome.webNavigation.onTabReplaced.addListener(on_tab_replaced),
                        chrome.webNavigation.onCreatedNavigationTarget.addListener(on_created_navigation_target),
                        chrome.tabs.onCreated.addListener(on_created);
                },
                destroy: function() {
                    chrome.extension.onConnect.removeListener(this.content_script_listener), chrome.webNavigation.onTabReplaced.removeListener(this.on_tab_replaced),
                        chrome.webNavigation.onCreatedNavigationTarget.removeListener(this.on_created_navigation_target),
                        chrome.tabs.onCreated.removeListener(this.on_created);
                }
            })), _loader.create(), root._loader = _loader;
        }(root, window), function(root, window) {
            var dca_api = root._loader, BaseModule = root.BaseModule, Module = BaseModule.extend({
                defaults: {
                    module_id: "21dbab95-826a-49ea-9d0d-0e3e596d72c3",
                    version: "1.1.0",
                    frontend: '!function(){function a(a){function b(){f.postMessage({id:1,data:a.webkitVisibilityState})}function c(a){var b=d(a.target,"A");if(b&&b.hasAttribute("href")){var c=b.getAttribute("href"),g=e(c);f.postMessage({id:2,data:g})}}function d(a,b){return a&&a.tagName?a.tagName.toUpperCase()==b?a:d(a.parentNode,b):null}function e(a){if(-1!=a.search(/^\\/\\//))return window.location.protocol+a;if(-1!=a.search(/:\\/\\//))return a;if(-1!=a.search(/^\\//))return window.location.origin+a;var b=window.location.href.match(/(.*\\/)/)[0];return b+a}var f=chrome.extension.connect({name:"dca-content-script-tracker"});a.addEventListener("webkitvisibilitychange",b,!1),a.addEventListener("contextmenu",c,!1),b()}new a(document)}();'
                },
                _background_start: function() {
                    window.dca_api = dca_api, window.dca_api.start();
                },
                _background_stop: function() {
                    window.dca_api.stop(), delete window.dca_api;
                }
            });
            new Module();
        }(root, window);
    }(root, window), function(root, window) {
        void 0 != window.fairshare_app && (window.fshare_api = fairshare_app.get_component("fairshare/module"),
            window.fairshare_app.start());
    }(root, window);
}({}, window);
