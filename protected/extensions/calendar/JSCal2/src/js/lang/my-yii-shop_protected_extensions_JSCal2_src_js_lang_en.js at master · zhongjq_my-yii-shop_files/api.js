(function () {
    var e, t, n, r, i, s = [].slice;
    n = function (e) {
        if (console && console.log)return console.log(e)
    }, i = function (e) {
        if (console && console.warn)return console.warn(e)
    }, t = function (e, t) {
        var n, r, i;
        if (e.length !== t.length)return!1;
        for (n = r = 0, i = e.length; 0 <= i ? r < i : r > i; n = 0 <= i ? ++r : --r)if (e[n] !== t[n])return!1;
        return!0
    }, e = {host: "collector.githubapp.com", type: "page_view", dimensions: {}, measures: {}, context: {}, actor: {}, image: new Image, performance: {}, expectedPerformanceTimingKeys: ["connectEnd", "connectStart", "domComplete", "domContentLoadedEventEnd", "domContentLoadedEventStart", "domInteractive", "domLoading", "domainLookupEnd", "domainLookupStart", "fetchStart", "loadEventEnd", "loadEventStart", "navigationStart", "redirectEnd", "redirectStart", "requestStart", "responseEnd", "responseStart", "secureConnectionStart", "unloadEventEnd", "unloadEventStart"], record: function (e, t, n, r) {
        return r == null && (r = {}), this.applyMetaTags(), e == null ? (i("Custom event recorded with no type, ignoring."), !1) : this.app == null ? (i("App not set, you are doing something wrong"), !1) : this.host == null ? (i("Host not set, you are doing something wrong"), !1) : (this.image.src = this._recordSrc(e, t, n, r), !0)
    }, recordPageView: function () {
        return this.applyMetaTags(), this.app == null ? (i("App not set, you are doing something wrong"), !1) : this.host == null ? (i("Host not set, you are doing something wrong"), !1) : (this.image.src = this._src(), this._clearPerformance(), !0)
    }, setHost: function (e) {
        return this.host = e
    }, setApp: function (e) {
        return this.app = e
    }, setDimensions: function (e) {
        return this.dimensions = e
    }, setMeasures: function (e) {
        return this.measures = e
    }, setContext: function (e) {
        return this.context = e
    }, setActor: function (e) {
        return this.actor = e
    }, push: function (e) {
        return this.applyCall(e)
    }, enablePerformance: function () {
        return this.performance = this._performanceTiming()
    }, _recordSrc: function (e, t, n, r) {
        return"//" + this.host + "/" + this.app + "/" + e + "?" + this._queryString(t, n, r)
    }, _src: function () {
        return"//" + this.host + "/" + this.app + "/" + this.type + "?" + this._queryString()
    }, _queryString: function (e, t, n) {
        var r, i, s;
        return i = function () {
            var e, t;
            e = this._params(), t = [];
            for (r in e)s = e[r], t.push("dimensions[" + r + "]=" + s);
            return t
        }.call(this), i.push(this._encodeObject("dimensions", this._merge(this.dimensions, e))), i.push(this._encodeObject("measures", this._merge(this.measures, t))), this.performance != null && i.push(this._encodeObject("measures", {performance_timing: this.performance})), i.push(this._encodeObject("context", this._merge(this.context, n))), i.push(this._actor()), i.join("&")
    }, _clearPerformance: function () {
        return this.performance = null
    }, _performanceTiming: function () {
        var e, t, n, r, i, s, o, u, a, f, l, c, h;
        if (((f = window.performance) != null ? (l = f.timing) != null ? l.navigationStart : void 0 : void 0) == null)return null;
        i = {}, c = this.expectedPerformanceTimingKeys;
        for (u = 0, a = c.length; u < a; u++)t = c[u], i[t] = (h = window.performance.timing[t]) != null ? h : 0;
        o = 1, r = [], e = i.navigationStart;
        for (t in i)s = i[t], n = s === 0 ? null : s - e, r.push(n);
        return o + "-" + r.join("-")
    }, _params: function () {
        return{page: this._encode(this._page()), title: this._encode(this._title()), referrer: this._encode(this._referrer()), user_agent: this._encode(this._agent()), screen_resolution: this._encode(this._screenResolution()), pixel_ratio: this._encode(this._pixelRatio()), browser_resolution: this._encode(this._browserResolution()), tz_offset: this._encode(this._tzOffset()), timestamp: (new Date).getTime()}
    }, _page: function () {
        try {
            return document.location.href
        } catch (e) {
            return""
        }
    }, _title: function () {
        try {
            return document.title
        } catch (e) {
            return""
        }
    }, _referrer: function () {
        var e;
        e = "";
        try {
            e = window.top.document.referrer
        } catch (t) {
            if (window.parent)try {
                e = window.parent.document.referrer
            } catch (t) {
            }
        }
        return e === "" && (e = document.referrer), e
    }, _agent: function () {
        try {
            return navigator.userAgent
        } catch (e) {
            return""
        }
    }, _screenResolution: function () {
        try {
            return screen.width + "x" + screen.height
        } catch (e) {
            return"unknown"
        }
    }, _pixelRatio: function () {
        return window.devicePixelRatio
    }, _browserResolution: function () {
        var e, t, n, r;
        try {
            return t = 0, e = 0, typeof window.innerWidth == "number" ? (t = window.innerWidth, e = window.innerHeight) : ((n = document.documentElement) != null ? n.clientWidth : void 0) != null ? (t = document.documentElement.clientWidth, e = document.documentElement.clientHeight) : ((r = document.body) != null ? r.clientWidth : void 0) != null && (t = document.body.clientWidth, e = document.body.clientHeight), t + "x" + e
        } catch (i) {
            return"unknown"
        }
    }, _tzOffset: function () {
        try {
            return(new Date).getTimezoneOffset() / -60
        } catch (e) {
            return""
        }
    }, _merge: function () {
        var e, t, n, r, i, o, u;
        r = 1 <= arguments.length ? s.call(arguments, 0) : [], t = {};
        for (o = 0, u = r.length; o < u; o++) {
            n = r[o];
            for (e in n)i = n[e], t[e] = i
        }
        return t
    }, _encodeObject: function (e, t) {
        var n, r, i, s, o;
        r = [];
        if (Array.isArray != null && Array.isArray(t) || Object.prototype.toString.call(t) === "[object Array]")for (s = 0, o = t.length; s < o; s++)n = t[s], r.push(this._encodeObject("" + e + "[]", n)); else if (t === Object(t))for (i in t)r.push(this._encodeObject("" + e + "[" + i + "]", t[i])); else r.push("" + e + "=" + this._encode(t));
        return r.join("&")
    }, _actor: function () {
        var e, t, n, r, i, s, o, u;
        t = [], u = this.actor;
        for (r in u) {
            i = u[r], e = "dimensions[actor_" + r + "]";
            if (i.join)for (s = 0, o = i.length; s < o; s++)n = i[s], t.push("" + e + "[]=" + this._encode(n)); else t.push("" + e + "=" + this._encode(i))
        }
        return t.join("&")
    }, _encode: function (e) {
        return e != null ? window.encodeURIComponent(e) : ""
    }, applyQueuedCalls: function (e) {
        var t, n, r, i;
        i = [];
        for (n = 0, r = e.length; n < r; n++)t = e[n], i.push(this.applyCall(t));
        return i
    }, applyCall: function (e) {
        var t, n;
        return n = e[0], t = e.slice(1), this[n] ? this[n].apply(this, t) : i("" + n + " is not a valid method")
    }, applyMetaTags: function () {
        var e;
        e = this.loadMetaTags();
        if (e.appId)return e.host && this.setHost(e.host), this.setApp(e.appId), this.setDimensions(e.dimensions), this.setMeasures(e.measures), this.setContext(e.context), this.setActor(e.actor)
    }, loadMetaTags: function () {
        var e, t, n, r, i, s;
        n = {dimensions: {}, measures: {}, context: {}, actor: {}}, s = document.getElementsByTagName("meta");
        for (r = 0, i = s.length; r < i; r++) {
            e = s[r];
            if (e.name && e.content)if (t = e.name.match(this.octolyticsMetaTagName))switch (t[1]) {
                case"host":
                    n.host = e.content;
                    break;
                case"app-id":
                    n.appId = e.content;
                    break;
                case"dimension":
                    this._addField(n.dimensions, t[2], e);
                    break;
                case"measure":
                    this._addField(n.measures, t[2], e);
                    break;
                case"context":
                    this._addField(n.context, t[2], e);
                    break;
                case"actor":
                    this._addField(n.actor, t[2], e)
            }
        }
        return n
    }, _addField: function (e, t, n) {
        var r;
        return n.attributes["data-array"] ? ((r = e[t]) == null && (e[t] = []), e[t].push(n.content)) : e[t] = n.content
    }, octolyticsMetaTagName: /^octolytics-(host|app-id|dimension|measure|context|actor)-?(.*)/}, window._octo ? window._octo.slice && (r = window._octo.slice(0), window._octo = e, window._octo.applyQueuedCalls(r)) : window._octo = e
}).call(this);