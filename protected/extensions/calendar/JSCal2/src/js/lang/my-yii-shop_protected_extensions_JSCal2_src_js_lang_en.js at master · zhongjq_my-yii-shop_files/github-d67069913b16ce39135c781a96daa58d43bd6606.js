function defineNetwork(t) {
    var e = function (t, e, n) {
        this.container = t, this.width = e, this.height = n, this.loaderInterval = null, this.loaderOffset = 0, this.ctx = this.initCanvas(t, e, n), this.startLoader("Loading graph data"), this.loadMeta()
    };
    return e.prototype = {initCanvas: function (e) {
        var n = t(e).find("canvas")[0];
        n.style.zIndex = "0";
        var a = n.width, i = n.height, s = n.getContext("2d"), r = window.devicePixelRatio || 1, o = s.webkitBackingStorePixelRatio || s.mozBackingStorePixelRatio || s.msBackingStorePixelRatio || s.oBackingStorePixelRatio || s.backingStorePixelRatio || 1, c = r / o;
        return 1 === c ? s : (n.width = a * c, n.height = i * c, n.style.width = a + "px", n.style.height = i + "px", s.scale(c, c), s)
    }, startLoader: function (t) {
        this.ctx.save(), this.ctx.font = "14px Monaco, monospace", this.ctx.fillStyle = "#cacaca", this.ctx.textAlign = "center", this.ctx.fillText(t, this.width / 2, 155), this.ctx.restore(), this.displayLoader()
    }, stopLoader: function () {
        t(".large-loading-area").hide()
    }, displayLoader: function () {
        t(".large-loading-area").show()
    }, loadMeta: function () {
        var e = this;
        e.loaded = !1, t.smartPoller(function (n) {
            t.ajax({url: "network_meta", success: function (a) {
                a && a.nethash ? (e.loaded = !0, t(".js-network-poll").hide(), t(".js-network-current").show(), e.init(a)) : n()
            }})
        })
    }, init: function (t) {
        this.focus = t.focus, this.nethash = t.nethash, this.spaceMap = t.spacemap, this.userBlocks = t.blocks, this.commits = [];
        for (var n = 0; n < t.dates.length; n++)this.commits.push(new e.Commit(n, t.dates[n]));
        this.users = {};
        for (var n = 0; n < t.users.length; n++) {
            var a = t.users[n];
            this.users[a.name] = a
        }
        this.chrome = new e.Chrome(this, this.ctx, this.width, this.height, this.focus, this.commits, this.userBlocks, this.users), this.graph = new e.Graph(this, this.ctx, this.width, this.height, this.focus, this.commits, this.users, this.spaceMap, this.userBlocks, this.nethash), this.mouseDriver = new e.MouseDriver(this.container, this.chrome, this.graph), this.keyDriver = new e.KeyDriver(this.container, this.chrome, this.graph), this.stopLoader(), this.graph.drawBackground(), this.chrome.draw(), this.graph.requestInitialChunk()
    }, initError: function () {
        this.stopLoader(), this.ctx.clearRect(0, 0, this.width, this.height), this.startLoader("Graph could not be drawn due to a network IO problem.")
    }}, e.Commit = function (t, e) {
        this.time = t, this.date = moment(e, "YYYY-MM-DD HH:mm:ss"), this.requested = null, this.populated = null
    }, e.Commit.prototype = {populate: function (t, e, n) {
        this.user = e, this.author = t.author, this.date = moment(t.date, "YYYY-MM-DD HH:mm:ss"), this.gravatar = t.gravatar, this.id = t.id, this.login = t.login, this.message = t.message, this.space = t.space, this.time = t.time, this.parents = this.populateParents(t.parents, n), this.requested = !0, this.populated = new Date
    }, populateParents: function (t, e) {
        for (var n = [], a = 0; a < t.length; a++) {
            var i = t[a], s = e[i[1]];
            s.id = i[0], s.space = i[2], n.push(s)
        }
        return n
    }}, e.Chrome = function (t, e, n, a, i, s, r, o) {
        this.namesWidth = 100, this.months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], this.userBgColors = ["#EBEBFF", "#E0E0FF"], this.network = t, this.ctx = e, this.width = n, this.height = a, this.commits = s, this.userBlocks = r, this.users = o, this.offsetX = this.namesWidth + (n - this.namesWidth) / 2 - 20 * i, this.offsetY = 0, this.contentHeight = this.calcContentHeight(), this.graphMidpoint = this.namesWidth + (n - this.namesWidth) / 2, this.activeUser = null
    }, e.Chrome.prototype = {moveX: function (t) {
        this.offsetX += t, this.offsetX > this.graphMidpoint ? this.offsetX = this.graphMidpoint : this.offsetX < this.graphMidpoint - 20 * this.commits.length && (this.offsetX = this.graphMidpoint - 20 * this.commits.length)
    }, moveY: function (t) {
        this.offsetY += t, this.offsetY > 0 || this.contentHeight < this.height - 40 ? this.offsetY = 0 : this.offsetY < -this.contentHeight + this.height / 2 && (this.offsetY = -this.contentHeight + this.height / 2)
    }, calcContentHeight: function () {
        for (var t = 0, e = 0; e < this.userBlocks.length; e++) {
            var n = this.userBlocks[e];
            t += n.count
        }
        return 20 * t
    }, hover: function (t, e) {
        for (var n = 0; n < this.userBlocks.length; n++) {
            var a = this.userBlocks[n];
            if (t > 0 && t < this.namesWidth && e > 40 + this.offsetY + 20 * a.start && e < 40 + this.offsetY + 20 * (a.start + a.count))return this.users[a.name]
        }
        return null
    }, draw: function () {
        this.drawTimeline(this.ctx), this.drawUsers(this.ctx), this.drawFooter(this.ctx)
    }, drawTimeline: function (t) {
        t.fillStyle = "#111111", t.fillRect(0, 0, this.width, 20), t.fillStyle = "#333333", t.fillRect(0, 20, this.width, 20);
        var e = parseInt((0 - this.offsetX) / 20);
        0 > e && (e = 0);
        var n = e + parseInt(this.width / 20);
        n > this.commits.length && (n = this.commits.length), t.save(), t.translate(this.offsetX, 0), t.font = "10px Helvetica, sans-serif";
        for (var a = null, i = null, s = e; n > s; s++) {
            var r = this.commits[s], o = this.months[r.date.month()];
            o != a && (t.fillStyle = "#ffffff", t.fillText(o, 20 * s - 3, 14), a = o);
            var c = parseInt(r.date.date());
            c != i && (t.fillStyle = "#ffffff", t.fillText(c, 20 * s - 3, 33), i = c)
        }
        t.restore()
    }, drawUsers: function (t) {
        t.fillStyle = "#FFFFFF", t.fillRect(0, 0, this.namesWidth, this.height), t.save(), t.translate(0, 40 + this.offsetY);
        for (var e = 0; e < this.userBlocks.length; e++) {
            var n = this.userBlocks[e];
            t.fillStyle = this.userBgColors[e % 2], t.fillRect(0, 20 * n.start, this.namesWidth, 20 * n.count), this.activeUser && this.activeUser.name == n.name && (t.fillStyle = "rgba(0, 0, 0, 0.05)", t.fillRect(0, 20 * n.start, this.namesWidth, 20 * n.count)), t.fillStyle = "#DDDDDD", t.fillRect(0, 20 * n.start, 1, 20 * n.count), t.fillRect(this.namesWidth - 1, 20 * n.start, 1, 20 * n.count), t.fillRect(this.width - 1, 20 * n.start, 1, 20 * n.count), t.fillRect(0, 20 * (n.start + n.count) - 1, this.namesWidth, 1), t.measureText(n.name).width;
            var a = 20 * (n.start + n.count / 2) + 3;
            t.fillStyle = "#000000", t.font = "12px Monaco, monospace", t.textAlign = "center", t.fillText(n.name, this.namesWidth / 2, a, 96)
        }
        t.restore(), t.fillStyle = "#111111", t.fillRect(0, 0, this.namesWidth, 20), t.fillStyle = "#333333", t.fillRect(0, 20, this.namesWidth, 20)
    }, drawFooter: function (t) {
        t.fillStyle = "#F4F4F4", t.fillRect(0, this.height - 20, this.width, 20), t.fillStyle = "#CCCCCC", t.fillRect(0, this.height - 20, this.width, 1), t.fillStyle = "#000000", t.font = "11px Monaco, monospace", t.fillText("GitHub Network Graph Viewer v4.0.0", 5, this.height - 5)
    }}, e.Graph = function (t, e, n, a, i, s, r, o, c, l) {
        this.namesWidth = 100, this.spaceColors = [], this.bgColors = ["#F5F5FF", "#F0F0FF"], this.spaceColors.push("#FF0000"), this.spaceColors.push("#0000FF"), this.spaceColors.push("#00FF00"), this.spaceColors.push("#FF00FF"), this.spaceColors.push("#E2EB00"), this.spaceColors.push("#FFA600"), this.spaceColors.push("#00FFFC"), this.spaceColors.push("#DD458E"), this.spaceColors.push("#AD7331"), this.spaceColors.push("#97AD31"), this.spaceColors.push("#51829D"), this.spaceColors.push("#70387F"), this.spaceColors.push("#740000"), this.spaceColors.push("#745C00"), this.spaceColors.push("#419411"), this.spaceColors.push("#37BE8C"), this.spaceColors.push("#6C5BBD"), this.spaceColors.push("#F300AA"), this.spaceColors.push("#586D41"), this.spaceColors.push("#3B4E31"), this.network = t, this.ctx = e, this.width = n, this.height = a, this.focus = i, this.commits = s, this.users = r, this.spaceMap = o, this.userBlocks = c, this.nethash = l, this.offsetX = this.namesWidth + (n - this.namesWidth) / 2 - 20 * i, this.offsetY = 0, this.bgCycle = 0, this.marginMap = {}, this.gravatars = {}, this.activeCommit = null, this.contentHeight = this.calcContentHeight(), this.graphMidpoint = this.namesWidth + (n - this.namesWidth) / 2, this.showRefs = !0, this.lastHotLoadCenterIndex = null, this.connectionMap = {}, this.spaceUserMap = {};
        for (var u = 0; u < c.length; u++)for (var d = c[u], h = d.start; h < d.start + d.count; h++)this.spaceUserMap[h] = r[d.name];
        this.headsMap = {};
        for (var u = 0; u < c.length; u++)for (var d = c[u], f = r[d.name], h = 0; h < f.heads.length; h++) {
            var m = f.heads[h];
            this.headsMap[m.id] || (this.headsMap[m.id] = []);
            var p = {name: f.name, head: m};
            this.headsMap[m.id].push(p)
        }
    }, e.Graph.prototype = {moveX: function (t) {
        this.offsetX += t, this.offsetX > this.graphMidpoint ? this.offsetX = this.graphMidpoint : this.offsetX < this.graphMidpoint - 20 * this.commits.length && (this.offsetX = this.graphMidpoint - 20 * this.commits.length), this.hotLoadCommits()
    }, moveY: function (t) {
        this.offsetY += t, this.offsetY > 0 || this.contentHeight < this.height - 40 ? this.offsetY = 0 : this.offsetY < -this.contentHeight + this.height / 2 && (this.offsetY = -this.contentHeight + this.height / 2)
    }, toggleRefs: function () {
        this.showRefs = !this.showRefs
    }, calcContentHeight: function () {
        for (var t = 0, e = 0; e < this.userBlocks.length; e++) {
            var n = this.userBlocks[e];
            t += n.count
        }
        return 20 * t
    }, hover: function (t, e) {
        for (var n = this.timeWindow(), a = n.min; a <= n.max; a++) {
            var i = this.commits[a], s = this.offsetX + 20 * i.time, r = this.offsetY + 50 + 20 * i.space;
            if (t > s - 5 && s + 5 > t && e > r - 5 && r + 5 > e)return i
        }
        return null
    }, hotLoadCommits: function () {
        var t = 200, e = parseInt((-this.offsetX + this.graphMidpoint) / 20);
        if (0 > e && (e = 0), e > this.commits.length - 1 && (e = this.commits.length - 1), !(this.lastHotLoadCenterIndex && Math.abs(this.lastHotLoadCenterIndex - e) < 10)) {
            this.lastHotLoadCenterIndex = e;
            var n = this.backSpan(e, t), a = this.frontSpan(e, t);
            if (n || a) {
                var i = n ? n[0] : a[0], s = a ? a[1] : n[1];
                this.requestChunk(i, s)
            }
        }
    }, backSpan: function (t, e) {
        for (var n = null, a = t; a >= 0 && a > t - e; a--)if (!this.commits[a].requested) {
            n = a;
            break
        }
        if (null != n) {
            for (var i = null, s = null, a = n; a >= 0 && a > n - e; a--)if (this.commits[a].requested) {
                i = a;
                break
            }
            return i ? s = i + 1 : (s = n - e, 0 > s && (s = 0)), [s, n]
        }
        return null
    }, frontSpan: function (t, e) {
        for (var n = null, a = t; a < this.commits.length && t + e > a; a++)if (!this.commits[a].requested) {
            n = a;
            break
        }
        if (null != n) {
            for (var i = null, s = null, a = n; a < this.commits.length && n + e > a; a++)if (this.commits[a].requested) {
                i = a;
                break
            }
            return s = i ? i - 1 : n + e >= this.commits.length ? this.commits.length - 1 : n + e, [n, s]
        }
        return null
    }, requestInitialChunk: function () {
        var e = this;
        t.getJSON("network_data_chunk?nethash=" + this.nethash, function (t) {
            e.importChunk(t), e.draw(), e.network.chrome.draw()
        })
    }, requestChunk: function (e, n) {
        for (var a = e; n >= a; a++)this.commits[a].requested = new Date;
        var i = this, s = "network_data_chunk?nethash=" + this.nethash + "&start=" + e + "&end=" + n;
        t.getJSON(s, function (t) {
            i.importChunk(t), i.draw(), i.network.chrome.draw(), i.lastHotLoadCenterIndex = this.focus
        })
    }, importChunk: function (t) {
        for (var e = 0; e < t.commits.length; e++) {
            var n = t.commits[e], a = this.spaceUserMap[n.space], i = this.commits[n.time];
            i.populate(n, a, this.commits);
            for (var s = 0; s < i.parents.length; s++)for (var r = i.parents[s], o = r.time + 1; o < i.time; o++)this.connectionMap[o] = this.connectionMap[o] || [], this.connectionMap[o].push(i)
        }
    }, timeWindow: function () {
        var t = parseInt((this.namesWidth - this.offsetX + 20) / 20);
        0 > t && (t = 0);
        var e = t + parseInt((this.width - this.namesWidth) / 20);
        return e > this.commits.length - 1 && (e = this.commits.length - 1), {min: t, max: e}
    }, draw: function () {
        this.drawBackground();
        var t = this.timeWindow(), e = t.min, n = t.max;
        this.ctx.save(), this.ctx.translate(this.offsetX, this.offsetY + 50);
        for (var a = {}, i = 0; i < this.spaceMap.length; i++)for (var s = this.spaceMap.length - i - 1, r = e; n >= r; r++) {
            var o = this.commits[r];
            o.populated && o.space == s && (this.drawConnection(o), a[o.id] = !0)
        }
        for (var i = e; n >= i; i++) {
            var c = this.connectionMap[i];
            if (c)for (var r = 0; r < c.length; r++) {
                var o = c[r];
                a[o.id] || (this.drawConnection(o), a[o.id] = !0)
            }
        }
        for (var i = 0; i < this.spaceMap.length; i++)for (var s = this.spaceMap.length - i - 1, r = e; n >= r; r++) {
            var o = this.commits[r];
            o.populated && o.space == s && (o == this.activeCommit ? this.drawActiveCommit(o) : this.drawCommit(o))
        }
        if (this.showRefs)for (var r = e; n >= r; r++) {
            var o = this.commits[r];
            if (o.populated) {
                var l = this.headsMap[o.id];
                if (l)for (var u = 0, d = 0; d < l.length; d++) {
                    var h = l[d];
                    if (this.spaceUserMap[o.space].name == h.name) {
                        var f = this.drawHead(o, h.head, u);
                        u += f
                    }
                }
            }
        }
        this.ctx.restore(), this.activeCommit && this.drawCommitInfo(this.activeCommit)
    }, drawBackground: function () {
        this.ctx.clearRect(0, 0, this.width, this.height), this.ctx.save(), this.ctx.translate(0, this.offsetY + 50), this.ctx.clearRect(0, -10, this.width, this.height);
        for (var t = 0; t < this.userBlocks.length; t++) {
            var e = this.userBlocks[t];
            this.ctx.fillStyle = this.bgColors[t % 2], this.ctx.fillRect(0, 20 * e.start - 10, this.width, 20 * e.count), this.ctx.fillStyle = "#DDDDDD", this.ctx.fillRect(0, 20 * (e.start + e.count) - 11, this.width, 1)
        }
        this.ctx.restore()
    }, drawCommit: function (t) {
        var e = 20 * t.time;
        y = 20 * t.space, this.ctx.beginPath(), this.ctx.arc(e, y, 3, 0, 2 * Math.PI, !1), this.ctx.fillStyle = this.spaceColor(t.space), this.ctx.fill()
    }, drawActiveCommit: function (t) {
        var e = 20 * t.time, n = 20 * t.space;
        this.ctx.beginPath(), this.ctx.arc(e, n, 6, 0, 2 * Math.PI, !1), this.ctx.fillStyle = this.spaceColor(t.space), this.ctx.fill()
    }, drawCommitInfo: function (t) {
        var e = this.splitLines(t.message, 54), n = 80 + 15 * e.length, a = this.offsetX + 20 * t.time, i = 50 + this.offsetY + 20 * t.space, s = 0, r = 0;
        s = a < this.graphMidpoint ? a + 10 : a - 410, r = i < 40 + (this.height - 40) / 2 ? i + 10 : i - n - 10, this.ctx.save(), this.ctx.translate(s, r), this.ctx.fillStyle = "#FFFFFF", this.ctx.strokeStyle = "#000000", this.ctx.lineWidth = "2", this.ctx.beginPath(), this.ctx.moveTo(0, 5), this.ctx.quadraticCurveTo(0, 0, 5, 0), this.ctx.lineTo(395, 0), this.ctx.quadraticCurveTo(400, 0, 400, 5), this.ctx.lineTo(400, n - 5), this.ctx.quadraticCurveTo(400, n, 395, n), this.ctx.lineTo(5, n), this.ctx.quadraticCurveTo(0, n, 0, n - 5), this.ctx.lineTo(0, 5), this.ctx.fill(), this.ctx.stroke();
        var o = this.gravatars[t.gravatar];
        if (o)this.drawGravatar(o, 10, 10); else {
            var c = this;
            window.location.protocol, o = new Image, o.src = "https://secure.gravatar.com/avatar/" + t.gravatar + "?s=32&d=https%3A%2F%2Fgithub.com%2Fimages%2Fgravatars%2Fgravatar-32.png", o.onload = function () {
                c.activeCommit == t && (c.drawGravatar(o, s + 10, r + 10), c.gravatars[t.gravatar] = o)
            }
        }
        this.ctx.fillStyle = "#000000", this.ctx.font = "bold 14px Helvetica, sans-serif", this.ctx.fillText(t.author, 55, 32), this.ctx.fillStyle = "#888888", this.ctx.font = "12px Monaco, monospace", this.ctx.fillText(t.id, 12, 65), this.drawMessage(e, 12, 85), this.ctx.restore()
    }, drawGravatar: function (t, e, n) {
        this.ctx.strokeStyle = "#AAAAAA", this.ctx.lineWidth = 1, this.ctx.beginPath(), this.ctx.strokeRect(e + .5, n + .5, 35, 35), this.ctx.drawImage(t, e + 2, n + 2)
    }, drawMessage: function (t, e, n) {
        this.ctx.font = "12px Monaco, monospace", this.ctx.fillStyle = "#000000";
        for (var a = 0; a < t.length; a++) {
            var i = t[a];
            this.ctx.fillText(i, e, n + 15 * a)
        }
    }, splitLines: function (t, e) {
        for (var n = t.split(" "), a = [], i = "", s = 0; s < n.length; s++) {
            var r = n[s];
            i.length + 1 + r.length < e ? i = "" == i ? r : i + " " + r : (a.push(i), i = r)
        }
        return a.push(i), a
    }, drawHead: function (t, e, n) {
        this.ctx.font = "10.25px Monaco, monospace", this.ctx.save();
        var a = this.ctx.measureText(e.name).width;
        this.ctx.restore();
        var i = 20 * t.time, s = 20 * t.space + 5 + n;
        return this.ctx.save(), this.ctx.translate(i, s), this.ctx.fillStyle = "rgba(0, 0, 0, 0.8)", this.ctx.beginPath(), this.ctx.moveTo(0, 0), this.ctx.lineTo(-4, 10), this.ctx.quadraticCurveTo(-9, 10, -9, 15), this.ctx.lineTo(-9, 15 + a), this.ctx.quadraticCurveTo(-9, 15 + a + 5, -4, 15 + a + 5), this.ctx.lineTo(4, 15 + a + 5), this.ctx.quadraticCurveTo(9, 15 + a + 5, 9, 15 + a), this.ctx.lineTo(9, 15), this.ctx.quadraticCurveTo(9, 10, 4, 10), this.ctx.lineTo(0, 0), this.ctx.fill(), this.ctx.fillStyle = "#FFFFFF", this.ctx.font = "12px Monaco, monospace", this.ctx.textBaseline = "middle", this.ctx.scale(.85, .85), this.ctx.rotate(Math.PI / 2), this.ctx.fillText(e.name, 17, -1), this.ctx.restore(), a + 20
    }, drawConnection: function (t) {
        for (var e = 0; e < t.parents.length; e++) {
            var n = t.parents[e];
            0 == e ? n.space == t.space ? this.drawBasicConnection(n, t) : this.drawBranchConnection(n, t) : this.drawMergeConnection(n, t)
        }
    }, drawBasicConnection: function (t, e) {
        var n = this.spaceColor(e.space);
        this.ctx.strokeStyle = n, this.ctx.lineWidth = 2, this.ctx.beginPath(), this.ctx.moveTo(20 * t.time, 20 * e.space), this.ctx.lineTo(20 * e.time, 20 * e.space), this.ctx.stroke()
    }, drawBranchConnection: function (t, e) {
        var n = this.spaceColor(e.space);
        this.ctx.strokeStyle = n, this.ctx.lineWidth = 2, this.ctx.beginPath(), this.ctx.moveTo(20 * t.time, 20 * t.space), this.ctx.lineTo(20 * t.time, 20 * e.space), this.ctx.lineTo(20 * e.time - 14, 20 * e.space), this.ctx.stroke(), this.threeClockArrow(n, 20 * e.time, 20 * e.space)
    }, drawMergeConnection: function (t, e) {
        var n = this.spaceColor(t.space);
        if (this.ctx.strokeStyle = n, this.ctx.lineWidth = 2, this.ctx.beginPath(), t.space > e.space) {
            this.ctx.moveTo(20 * t.time, 20 * t.space);
            var a = this.safePath(t.time, e.time, t.space);
            if (a)this.ctx.lineTo(20 * e.time - 10, 20 * t.space), this.ctx.lineTo(20 * e.time - 10, 20 * e.space + 15), this.ctx.lineTo(20 * e.time - 7.7, 20 * e.space + 9.5), this.ctx.stroke(), this.oneClockArrow(n, 20 * e.time, 20 * e.space); else {
                var i = this.closestMargin(t.time, e.time, t.space, -1);
                t.space == e.space + 1 && t.space == i + 1 ? (this.ctx.lineTo(20 * t.time, 20 * i + 10), this.ctx.lineTo(20 * e.time - 15, 20 * i + 10), this.ctx.lineTo(20 * e.time - 9.5, 20 * i + 7.7), this.ctx.stroke(), this.twoClockArrow(n, 20 * e.time, 20 * i), this.addMargin(t.time, e.time, i)) : t.time + 1 == e.time ? (i = this.closestMargin(t.time, e.time, e.space, 0), this.ctx.lineTo(20 * t.time, 20 * i + 10), this.ctx.lineTo(20 * e.time - 15, 20 * i + 10), this.ctx.lineTo(20 * e.time - 15, 20 * e.space + 10), this.ctx.lineTo(20 * e.time - 9.5, 20 * e.space + 7.7), this.ctx.stroke(), this.twoClockArrow(n, 20 * e.time, 20 * e.space), this.addMargin(t.time, e.time, i)) : (this.ctx.lineTo(20 * t.time + 10, 20 * t.space - 10), this.ctx.lineTo(20 * t.time + 10, 20 * i + 10), this.ctx.lineTo(20 * e.time - 10, 20 * i + 10), this.ctx.lineTo(20 * e.time - 10, 20 * e.space + 15), this.ctx.lineTo(20 * e.time - 7.7, 20 * e.space + 9.5), this.ctx.stroke(), this.oneClockArrow(n, 20 * e.time, 20 * e.space), this.addMargin(t.time, e.time, i))
            }
        } else {
            var i = this.closestMargin(t.time, e.time, e.space, -1);
            i < e.space ? (this.ctx.moveTo(20 * t.time, 20 * t.space), this.ctx.lineTo(20 * t.time, 20 * i + 10), this.ctx.lineTo(20 * e.time - 12.7, 20 * i + 10), this.ctx.lineTo(20 * e.time - 12.7, 20 * e.space - 10), this.ctx.lineTo(20 * e.time - 9.4, 20 * e.space - 7.7), this.ctx.stroke(), this.fourClockArrow(n, 20 * e.time, 20 * e.space), this.addMargin(t.time, e.time, i)) : (this.ctx.moveTo(20 * t.time, 20 * t.space), this.ctx.lineTo(20 * t.time, 20 * i + 10), this.ctx.lineTo(20 * e.time - 12.7, 20 * i + 10), this.ctx.lineTo(20 * e.time - 12.7, 20 * e.space + 10), this.ctx.lineTo(20 * e.time - 9.4, 20 * e.space + 7.7), this.ctx.stroke(), this.twoClockArrow(n, 20 * e.time, 20 * e.space), this.addMargin(t.time, e.time, i))
        }
    }, addMargin: function (t, e, n) {
        var a = n;
        this.marginMap[a] || (this.marginMap[a] = []), this.marginMap[a].push([t, e])
    }, oneClockArrow: function (t, e, n) {
        this.ctx.fillStyle = t, this.ctx.beginPath(), this.ctx.moveTo(e - 6.3, n + 13.1), this.ctx.lineTo(e - 10.8, n + 9.7), this.ctx.lineTo(e - 2.6, n + 3.5), this.ctx.fill()
    }, twoClockArrow: function (t, e, n) {
        this.ctx.fillStyle = t, this.ctx.beginPath(), this.ctx.moveTo(e - 12.4, n + 6.6), this.ctx.lineTo(e - 9.3, n + 10.6), this.ctx.lineTo(e - 3.2, n + 2.4), this.ctx.fill()
    }, threeClockArrow: function (t, e, n) {
        this.ctx.fillStyle = t, this.ctx.beginPath(), this.ctx.moveTo(e - 14, n - 2.5), this.ctx.lineTo(e - 14, n + 2.5), this.ctx.lineTo(e - 4, n), this.ctx.fill()
    }, fourClockArrow: function (t, e, n) {
        this.ctx.fillStyle = t, this.ctx.beginPath(), this.ctx.moveTo(e - 12.4, n - 6.6), this.ctx.lineTo(e - 9.3, n - 10.6), this.ctx.lineTo(e - 3.2, n - 2.4), this.ctx.fill()
    }, safePath: function (t, e, n) {
        for (var a = 0; a < this.spaceMap[n].length; a++) {
            var i = this.spaceMap[n][a];
            if (this.timeInPath(t, i))return i[1] == e
        }
        return!1
    }, closestMargin: function (t, e, n, a) {
        for (var i = this.spaceMap.length, s = a, r = !1, o = !1, c = !1; !o || !r;) {
            if (n + s >= 0 && this.safeMargin(t, e, n + s))return n + s;
            0 > n + s && (r = !0), n + s > i && (o = !0), 0 == c && 0 == s ? (s = -1, c = !0) : s = 0 > s ? -s - 1 : -s - 2
        }
        return n > 0 ? n - 1 : 0
    }, safeMargin: function (t, e, n) {
        var a = n;
        if (!this.marginMap[a])return!0;
        for (var i = this.marginMap[a], s = 0; s < i.length; s++) {
            var r = i[s];
            if (this.pathsCollide([t, e], r))return!1
        }
        return!0
    }, pathsCollide: function (t, e) {
        return this.timeWithinPath(t[0], e) || this.timeWithinPath(t[1], e) || this.timeWithinPath(e[0], t) || this.timeWithinPath(e[1], t)
    }, timeInPath: function (t, e) {
        return t >= e[0] && t <= e[1]
    }, timeWithinPath: function (t, e) {
        return t > e[0] && t < e[1]
    }, spaceColor: function (t) {
        return 0 == t ? "#000000" : this.spaceColors[t % this.spaceColors.length]
    }}, e.MouseDriver = function (e, n, a) {
        this.container = e, this.chrome = n, this.graph = a, this.dragging = !1, this.lastPoint = {x: 0, y: 0}, this.lastHoverCommit = null, this.lastHoverUser = null, this.pressedCommit = null, this.pressedUser = null;
        var i = t(e).eq(0), s = t("canvas", i)[0], r = t(s).offset();
        s.style.cursor = "move";
        var o = this;
        this.up = function () {
            o.dragging = !1, o.pressedCommit && o.graph.activeCommit == o.pressedCommit ? window.open("/" + o.graph.activeCommit.user.name + "/" + o.graph.activeCommit.user.repo + "/commit/" + o.graph.activeCommit.id) : o.pressedUser && o.chrome.activeUser == o.pressedUser && (window.location = "/" + o.chrome.activeUser.name + "/" + o.chrome.activeUser.repo + "/network"), o.pressedCommit = null, o.pressedUser = null
        }, this.down = function () {
            o.graph.activeCommit ? o.pressedCommit = o.graph.activeCommit : o.chrome.activeUser ? o.pressedUser = o.chrome.activeUser : o.dragging = !0
        }, this.docmove = function (t) {
            var e = t.pageX, n = t.pageY;
            o.dragging && (o.graph.moveX(e - o.lastPoint.x), o.graph.moveY(n - o.lastPoint.y), o.graph.draw(), o.chrome.moveX(e - o.lastPoint.x), o.chrome.moveY(n - o.lastPoint.y), o.chrome.draw()), o.lastPoint.x = e, o.lastPoint.y = n
        }, this.move = function (t) {
            var e = t.pageX, n = t.pageY;
            if (o.dragging)o.graph.moveX(e - o.lastPoint.x), o.graph.moveY(n - o.lastPoint.y), o.graph.draw(), o.chrome.moveX(e - o.lastPoint.x), o.chrome.moveY(n - o.lastPoint.y), o.chrome.draw(); else {
                var a = o.chrome.hover(e - r.left, n - r.top);
                if (a != o.lastHoverUser)s.style.cursor = a ? "pointer" : "move", o.chrome.activeUser = a, o.chrome.draw(), o.lastHoverUser = a; else {
                    var i = o.graph.hover(e - r.left, n - r.top);
                    i != o.lastHoverCommit && (s.style.cursor = i ? "pointer" : "move", o.graph.activeCommit = i, o.graph.draw(), o.chrome.draw(), o.lastHoverCommit = i)
                }
            }
            o.lastPoint.x = e, o.lastPoint.y = n
        }, this.out = function () {
            o.graph.activeCommit = null, o.chrome.activeUser = null, o.graph.draw(), o.chrome.draw(), o.lastHoverCommit = null, o.lastHoverUser = null
        }, t("body")[0].onmouseup = this.up, t("body")[0].onmousemove = this.docmove, s.onmousedown = this.down, s.onmousemove = this.move, s.onmouseout = this.out
    }, e.KeyDriver = function (e, n, a) {
        this.container = e, this.chrome = n, this.graph = a, this.dirty = !1, this.moveBothX = function (t) {
            this.graph.moveX(t), this.chrome.moveX(t), this.graph.activeCommit = null, this.dirty = !0
        }, this.moveBothY = function (t) {
            this.graph.moveY(t), this.chrome.moveY(t), this.graph.activeCommit = null, this.dirty = !0
        }, this.toggleRefs = function () {
            this.graph.toggleRefs(), this.dirty = !0
        }, this.redraw = function () {
            this.dirty && (this.graph.draw(), this.chrome.draw()), this.dirty = !1
        };
        var i = this;
        this.down = function (t) {
            var e = !1;
            if (t.target != document.body)return!0;
            if (t.shiftKey)switch (t.which) {
                case 37:
                case 72:
                    i.moveBothX(999999), e = !0;
                    break;
                case 38:
                case 75:
                    i.moveBothY(999999), e = !0;
                    break;
                case 39:
                case 76:
                    i.moveBothX(-999999), e = !0;
                    break;
                case 40:
                case 74:
                    i.moveBothY(-999999), e = !0
            } else switch (t.which) {
                case 37:
                case 72:
                    i.moveBothX(100), e = !0;
                    break;
                case 38:
                case 75:
                    i.moveBothY(20), e = !0;
                    break;
                case 39:
                case 76:
                    i.moveBothX(-100), e = !0;
                    break;
                case 40:
                case 74:
                    i.moveBothY(-20), e = !0;
                    break;
                case 84:
                    i.toggleRefs(), e = !0
            }
            e && i.redraw()
        }, t(document).keydown(this.down)
    }, e
}
!function () {
    navigator.userAgent.match("Propane") || top != window && (alert("For security reasons, framing is not allowed."), top.location.replace(document.location))
}.call(this), function () {
    "github.com" === location.host && "https:" !== location.protocol && (alert("SSL is required to view this page."), location.protocol = "https:")
}.call(this), function () {
    var t, e;
    null == (e = window.GitHub) && (window.GitHub = {}), t = null, GitHub.withSudo = function (e) {
        return $.getJSON("/sessions/in_sudo.json", function (n) {
            return n ? e() : (t = e, $.facebox({div: "#js-sudo-prompt"}, "sudo"))
        })
    }, $(document).on("ajaxSuccess", ".js-sudo-form", function () {
        return $(document).trigger("close.facebox"), "function" == typeof t && t(), t = null
    }), $(document).on("ajaxError", ".js-sudo-form", function () {
        return $(this).find(".js-sudo-error").text("Incorrect Password.").show(), $(this).find(".js-sudo-password").val(""), !1
    }), $(document).on("click", ".js-sudo-required", function () {
        var t = this;
        return GitHub.withSudo(function () {
            return location.href = t.href
        }), !1
    })
}.call(this), function () {
    var t;
    null == (t = window.GitHub) && (window.GitHub = {})
}.call(this), function (t) {
    t.fn.autocompleteField = function (e) {
        var n = t.extend({searchVar: "q", url: null, delay: 250, useCache: !1, extraParams: {}, autoClearResults: !0, dataType: "html", minLength: 1}, e);
        return t(this).each(function () {
            function e(e) {
                if (i && i.readyState < 4 && i.abort(), n.useCache && c.hasOwnProperty(e))o.trigger("autocomplete:finish", c[e]); else {
                    var a = {};
                    a[n.searchVar] = e, a = t.extend(!0, n.extraParams, a), o.trigger("autocomplete:beforesend"), i = t.get(n.url, a, function (t) {
                        n.useCache && (c[e] = t), o.val() === e && o.trigger("autocomplete:finish", t)
                    }, n.dataType)
                }
            }

            function a(t) {
                t.length >= n.minLength ? r != t && (e(t), r = t) : o.trigger("autocomplete:clear")
            }

            var i, s, r, o = t(this), c = {};
            null != n.url && (o.attr("autocomplete", "off"), o.keyup(function (t) {
                t.preventDefault(), clearTimeout(s), s = setTimeout(function () {
                    clearTimeout(s), a(o.val())
                }, n.delay)
            }), o.blur(function () {
                r = null
            }))
        })
    }
}(jQuery), function (t) {
    t.fn.autosaveField = function (e) {
        var n = t.extend({}, t.fn.autosaveField.defaults, e);
        return this.each(function () {
            var e = t(this);
            if (!e.data("autosaved-init")) {
                var a = e.attr("data-field-type") || ":text", i = e.find(a), s = e.attr("data-action"), r = e.attr("data-name"), o = i.val(), c = function () {
                    e.removeClass("errored"), e.removeClass("successful"), e.addClass("loading"), t.ajax({url: s, type: "POST", data: {_method: n.method, field: r, value: i.val()}, success: function () {
                        e.addClass("successful"), o = i.val()
                    }, error: function (t) {
                        e.attr("data-reset-on-error") && i.val(o), 422 == t.status && e.find(".error").text(t.responseText), e.addClass("errored")
                    }, complete: function () {
                        e.removeClass("loading")
                    }})
                };
                ":text" == a ? (i.blur(function () {
                    t(this).val() != o && c()
                }), i.keyup(function () {
                    e.removeClass("successful"), e.removeClass("errored")
                })) : "input[type=checkbox]" == a && i.change(function () {
                    e.removeClass("successful"), e.removeClass("errored"), c()
                }), e.data("autosaved-init", !0)
            }
        })
    }, t.fn.autosaveField.defaults = {method: "put"}
}(jQuery), function (t) {
    t.fn.caret = function (t) {
        return"undefined" == typeof t ? this[0].selectionStart : (this[0].focus(), this[0].setSelectionRange(t, t))
    }, t.fn.caretSelection = function (t, e) {
        return"undefined" == typeof t && "undefined" == typeof e ? [this[0].selectionStart, this[0].selectionEnd] : (this[0].focus(), this[0].setSelectionRange(t, e))
    }
}(jQuery), DateInput = function (t) {
    function e(n, a) {
        "object" != typeof a && (a = {}), t.extend(this, e.DEFAULT_OPTS, a), this.input = t(n), this.bindMethodsToObj("show", "hide", "hideIfClickOutside", "keydownHandler", "selectDate"), this.build(), this.selectDate(), this.show(), this.input.hide(), this.input.data("datePicker", this)
    }

    return e.DEFAULT_OPTS = {month_names: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], short_month_names: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], short_day_names: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], start_of_week: 1}, e.prototype = {build: function () {
        var e = t('<p class="month_nav"><span class="button prev" title="[Page-Up]">&#171;</span> <span class="month_name"></span> <span class="button next" title="[Page-Down]">&#187;</span></p>');
        this.monthNameSpan = t(".month_name", e), t(".prev", e).click(this.bindToObj(function () {
            this.moveMonthBy(-1)
        })), t(".next", e).click(this.bindToObj(function () {
            this.moveMonthBy(1)
        }));
        var n = t('<p class="year_nav"><span class="button prev" title="[Ctrl+Page-Up]">&#171;</span> <span class="year_name"></span> <span class="button next" title="[Ctrl+Page-Down]">&#187;</span></p>');
        this.yearNameSpan = t(".year_name", n), t(".prev", n).click(this.bindToObj(function () {
            this.moveMonthBy(-12)
        })), t(".next", n).click(this.bindToObj(function () {
            this.moveMonthBy(12)
        }));
        var a = t('<div class="nav"></div>').append(e, n), i = "<table><thead><tr>";
        t(this.adjustDays(this.short_day_names)).each(function () {
            i += "<th>" + this + "</th>"
        }), i += "</tr></thead><tbody></tbody></table>", this.dateSelector = this.rootLayers = t('<div class="date_selector no_shadow"></div>').append(a, i).insertAfter(this.input), this.tbody = t("tbody", this.dateSelector), this.input.change(this.bindToObj(function () {
            this.selectDate()
        })), this.selectDate()
    }, selectMonth: function (e) {
        var n = new Date(e.getFullYear(), e.getMonth(), 1);
        if (!this.currentMonth || this.currentMonth.getFullYear() != n.getFullYear() || this.currentMonth.getMonth() != n.getMonth()) {
            this.currentMonth = n;
            for (var a = this.rangeStart(e), i = this.rangeEnd(e), s = this.daysBetween(a, i), r = "", o = 0; s >= o; o++) {
                var c = new Date(a.getFullYear(), a.getMonth(), a.getDate() + o, 12, 0);
                this.isFirstDayOfWeek(c) && (r += "<tr>"), r += c.getMonth() == e.getMonth() ? '<td class="selectable_day" date="' + this.dateToString(c) + '">' + c.getDate() + "</td>" : '<td class="unselected_month" date="' + this.dateToString(c) + '">' + c.getDate() + "</td>", this.isLastDayOfWeek(c) && (r += "</tr>")
            }
            this.tbody.empty().append(r), this.monthNameSpan.empty().append(this.monthName(e)), this.yearNameSpan.empty().append(this.currentMonth.getFullYear()), t(".selectable_day", this.tbody).click(this.bindToObj(function (e) {
                this.changeInput(t(e.target).attr("date"))
            })), t("td[date='" + this.dateToString(new Date) + "']", this.tbody).addClass("today"), t("td.selectable_day", this.tbody).mouseover(function () {
                t(this).addClass("hover")
            }), t("td.selectable_day", this.tbody).mouseout(function () {
                t(this).removeClass("hover")
            })
        }
        t(".selected", this.tbody).removeClass("selected"), t('td[date="' + this.selectedDateString + '"]', this.tbody).addClass("selected")
    }, selectDate: function (t) {
        "undefined" == typeof t && (t = this.stringToDate(this.input.val())), t || (t = new Date), this.selectedDate = t, this.selectedDateString = this.dateToString(this.selectedDate), this.selectMonth(this.selectedDate)
    }, resetDate: function () {
        t(".selected", this.tbody).removeClass("selected"), this.changeInput("")
    }, changeInput: function (t) {
        this.input.val(t).change(), this.hide()
    }, show: function () {
        this.rootLayers.css("display", "block"), t([window, document.body]).click(this.hideIfClickOutside), this.input.unbind("focus", this.show), this.rootLayers.keydown(this.keydownHandler), this.setPosition()
    }, hide: function () {
    }, hideIfClickOutside: function (t) {
        t.target == this.input[0] || this.insideSelector(t) || this.hide()
    }, insideSelector: function (e) {
        return $target = t(e.target), $target.parents(".date_selector").length || $target.is(".date_selector")
    }, keydownHandler: function (t) {
        switch (t.keyCode) {
            case 9:
            case 27:
                return this.hide(), void 0;
            case 13:
                this.changeInput(this.selectedDateString);
                break;
            case 33:
                this.moveDateMonthBy(t.ctrlKey ? -12 : -1);
                break;
            case 34:
                this.moveDateMonthBy(t.ctrlKey ? 12 : 1);
                break;
            case 38:
                this.moveDateBy(-7);
                break;
            case 40:
                this.moveDateBy(7);
                break;
            case 37:
                this.moveDateBy(-1);
                break;
            case 39:
                this.moveDateBy(1);
                break;
            default:
                return
        }
        t.preventDefault()
    }, stringToDate: function (t) {
        var e;
        return(e = t.match(/^(\d{1,2}) ([^\s]+) (\d{4,4})$/)) ? new Date(e[3], this.shortMonthNum(e[2]), e[1], 12, 0) : null
    }, dateToString: function (t) {
        return t.getDate() + " " + this.short_month_names[t.getMonth()] + " " + t.getFullYear()
    }, setPosition: function () {
        var t = this.input.offset();
        this.rootLayers.css({top: t.top + this.input.outerHeight(), left: t.left}), this.ieframe && this.ieframe.css({width: this.dateSelector.outerWidth(), height: this.dateSelector.outerHeight()})
    }, moveDateBy: function (t) {
        var e = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth(), this.selectedDate.getDate() + t);
        this.selectDate(e)
    }, moveDateMonthBy: function (t) {
        var e = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth() + t, this.selectedDate.getDate());
        e.getMonth() == this.selectedDate.getMonth() + t + 1 && e.setDate(0), this.selectDate(e)
    }, moveMonthBy: function (t) {
        var e = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + t, this.currentMonth.getDate());
        this.selectMonth(e)
    }, monthName: function (t) {
        return this.month_names[t.getMonth()]
    }, bindToObj: function (t) {
        var e = this;
        return function () {
            return t.apply(e, arguments)
        }
    }, bindMethodsToObj: function () {
        for (var t = 0; t < arguments.length; t++)this[arguments[t]] = this.bindToObj(this[arguments[t]])
    }, indexFor: function (t, e) {
        for (var n = 0; n < t.length; n++)if (e == t[n])return n
    }, monthNum: function (t) {
        return this.indexFor(this.month_names, t)
    }, shortMonthNum: function (t) {
        return this.indexFor(this.short_month_names, t)
    }, shortDayNum: function (t) {
        return this.indexFor(this.short_day_names, t)
    }, daysBetween: function (t, e) {
        return t = Date.UTC(t.getFullYear(), t.getMonth(), t.getDate()), e = Date.UTC(e.getFullYear(), e.getMonth(), e.getDate()), (e - t) / 864e5
    }, changeDayTo: function (t, e, n) {
        var a = n * (Math.abs(e.getDay() - t - 7 * n) % 7);
        return new Date(e.getFullYear(), e.getMonth(), e.getDate() + a)
    }, rangeStart: function (t) {
        return this.changeDayTo(this.start_of_week, new Date(t.getFullYear(), t.getMonth()), -1)
    }, rangeEnd: function (t) {
        return this.changeDayTo((this.start_of_week - 1) % 7, new Date(t.getFullYear(), t.getMonth() + 1, 0), 1)
    }, isFirstDayOfWeek: function (t) {
        return t.getDay() == this.start_of_week
    }, isLastDayOfWeek: function (t) {
        return t.getDay() == (this.start_of_week - 1) % 7
    }, adjustDays: function (t) {
        for (var e = [], n = 0; n < t.length; n++)e[n] = t[(n + this.start_of_week) % 7];
        return e
    }}, e
}(jQuery), function (t) {
    t.fn.enticeToAction = function (e) {
        var n = t.extend({}, t.fn.enticeToAction.defaults, e);
        return this.each(function () {
            var e = t(this);
            switch (e.addClass("entice"), e.attr("title", n.title), n.direction) {
                case"downwards":
                    var a = "n";
                case"upwards":
                    var a = "s";
                case"rightwards":
                    var a = "w";
                case"leftwards":
                    var a = "e"
            }
            e.tipsy({gravity: a}), this.onclick = function () {
                return!1
            }, this.href = "#"
        })
    }, t.fn.enticeToAction.defaults = {title: "You must be signed in to use this feature", direction: "downwards"}
}(jQuery), function (t) {
    t.fn.errorify = function (e, n) {
        return t.extend({}, t.fn.errorify.defaults, n), this.each(function () {
            var n = t(this);
            n.removeClass("warn"), n.addClass("errored"), n.find("p.note").hide(), n.find("dd.error").remove(), n.find("dd.warning").remove();
            var a = t("<dd>").addClass("error").text(e);
            n.append(a)
        })
    }, t.fn.errorify.defaults = {}, t.fn.unErrorify = function (e) {
        return t.extend({}, t.fn.unErrorify.defaults, e), this.each(function () {
            var e = t(this);
            e.removeClass("errored warn"), e.find("p.note").show(), e.find("dd.error").remove(), e.find("dd.warning").remove()
        })
    }, t.fn.unErrorify.defaults = {}
}(jQuery), $.fn.selectableList = function (t, e) {
    return $(this).each(function () {
        var n = $(this), a = $.extend({toggleClassName: "selected", wrapperSelector: "a", mutuallyExclusive: !1, itemParentSelector: "li", enableShiftSelect: !1, ignoreLinks: !1}, e);
        return n.delegate(t + " " + a.itemParentSelector + " " + a.wrapperSelector, "click", function (e) {
            if (e.which > 1 || e.metaKey || a.ignoreLinks && $(e.target).closest("a").length)return!0;
            var i = $(this), s = i.find(":checkbox, :radio"), r = n.find(t + " ." + a.toggleClassName), o = n.find(t + " *[data-last]");
            if (i.is(":checkbox, :radio") || e.target == s[0] || (s.prop("checked") && !s.is(":radio") ? s.prop("checked", !1) : s.prop("checked", !0)), a.mutuallyExclusive && r.removeClass(a.toggleClassName), i.toggleClass(a.toggleClassName), s.change(), a.enableShiftSelect && e.shiftKey && r.length > 0) {
                if (o.length > 0) {
                    var c = o.offset().top, l = i.offset().top, u = "#" + i.attr("id"), d = $, h = $, f = $;
                    c > l ? d = o.prevUntil(u) : l > c && (d = o.nextUntil(u)), h = d.find(":checkbox"), f = d.find(":checked"), f.length == h.length ? (d.removeClass(a.toggleClassName), h.prop("checked", !1)) : (d.addClass(a.toggleClassName), h.prop("checked", !0))
                }
                i.trigger("selectableList:shiftClicked")
            }
            o.removeAttr("data-last"), i.attr("data-last", !0)
        }), n.delegate(t + " li :checkbox," + t + " li :radio", "change", function () {
            var e = $(this), i = e.closest(a.wrapperSelector);
            a.mutuallyExclusive && n.find(t + " ." + a.toggleClassName).removeClass(a.toggleClassName), $(this).prop("checked") ? i.addClass(a.toggleClassName) : i.removeClass(a.toggleClassName)
        }), n.find(t)
    })
}, function (t, e, n) {
    function a(t) {
        var e = {}, a = /^jQuery\d+$/;
        return n.each(t.attributes, function (t, n) {
            n.specified && !a.test(n.name) && (e[n.name] = n.value)
        }), e
    }

    function i(t, a) {
        var i = this, s = n(i);
        if (i.value == s.attr("placeholder") && s.hasClass("placeholder"))if (s.data("placeholder-password")) {
            if (s = s.hide().next().show().attr("id", s.removeAttr("id").data("placeholder-id")), t === !0)return s[0].value = a;
            s.focus()
        } else i.value = "", s.removeClass("placeholder"), i == e.activeElement && i.select()
    }

    function s() {
        var t, e = this, s = n(e), r = this.id;
        if ("" == e.value) {
            if ("password" == e.type) {
                if (!s.data("placeholder-textinput")) {
                    try {
                        t = s.clone().attr({type: "text"})
                    } catch (o) {
                        t = n("<input>").attr(n.extend(a(this), {type: "text"}))
                    }
                    t.removeAttr("name").data({"placeholder-password": !0, "placeholder-id": r}).bind("focus.placeholder", i), s.data({"placeholder-textinput": t, "placeholder-id": r}).before(t)
                }
                s = s.removeAttr("id").hide().prev().attr("id", r).show()
            }
            s.addClass("placeholder"), s[0].value = s.attr("placeholder")
        } else s.removeClass("placeholder")
    }

    var r, o, c = "placeholder"in e.createElement("input"), l = "placeholder"in e.createElement("textarea"), u = n.fn, d = n.valHooks;
    c && l ? (o = u.placeholder = function () {
        return this
    }, o.input = o.textarea = !0) : (o = u.placeholder = function () {
        var t = this;
        return t.filter((c ? "textarea" : ":input") + "[placeholder]").not(".placeholder").bind({"focus.placeholder": i, "blur.placeholder": s}).data("placeholder-enabled", !0).trigger("blur.placeholder"), t
    }, o.input = c, o.textarea = l, r = {get: function (t) {
        var e = n(t);
        return e.data("placeholder-enabled") && e.hasClass("placeholder") ? "" : t.value
    }, set: function (t, a) {
        var r = n(t);
        return r.data("placeholder-enabled") ? ("" == a ? (t.value = a, t != e.activeElement && s.call(t)) : r.hasClass("placeholder") ? i.call(t, !0, a) || (t.value = a) : t.value = a, r) : t.value = a
    }}, c || (d.input = r), l || (d.textarea = r), n(function () {
        n(e).delegate("form", "submit.placeholder", function () {
            var t = n(".placeholder", this).each(i);
            setTimeout(function () {
                t.each(s)
            }, 10)
        })
    }), n(t).bind("beforeunload.placeholder", function () {
        n(".placeholder").each(function () {
            this.value = ""
        })
    }))
}(this, document, jQuery), function (t) {
    t.fn.popover = function (t) {
        if ("destroy" == t)this.tipsy("hide").data("tipsy", null); else if ("show" == t)this.tipsy("show"); else if ("hide" == t)this.tipsy("hide"); else {
            switch (tipsyOptions = {inline: !0, trigger: "manual", opacity: 1, className: "popover", content: t.content, html: t.html}, t.placement) {
                case"left":
                    tipsyOptions.gravity = "e";
                    break;
                case"right":
                    tipsyOptions.gravity = "w";
                    break;
                case"up":
                    tipsyOptions.gravity = "s";
                    break;
                case"down":
                    tipsyOptions.gravity = "n"
            }
            this.tipsy("hide").data("tipsy", null), this.tipsy(tipsyOptions)
        }
        return this
    }
}(jQuery), function (t) {
    function e(t, e) {
        var n = t.find("a");
        if (n.length > 1) {
            var a = n.filter(".selected"), i = n.get().indexOf(a.get(0));
            return i += e, i >= n.length ? i = 0 : 0 > i && (i = n.length - 1), a.removeClass("selected"), n.eq(i).addClass("selected"), !0
        }
    }

    t.fn.quicksearch = function (n) {
        var a = t.extend({url: null, delay: 150, spinner: null, insertSpinner: null, loading: t(".quicksearch-loading")}, n);
        a.insertSpinner && !a.spinner && (a.spinner = t('<img src="' + GitHub.Ajax.spinner + '" alt="" class="spinner" width="16" />'));
        var i = function (t) {
            return a.results.html(t).show()
        };
        return a.results.delegate("a", "mouseover", function () {
            var e = t(this);
            e.hasClass("selected") || (a.results.find("a.selected").removeClass("selected"), e.addClass("selected"))
        }), this.each(function () {
            function n() {
                a.insertSpinner && (a.spinner.parent().length || a.insertSpinner.call(r, a.spinner), a.spinner.show()), r.trigger("quicksearch.loading"), a.loading && i(a.loading.html())
            }

            function s() {
                a.insertSpinner && a.spinner.hide(), r.trigger("quicksearch.loaded")
            }

            var r = t(this);
            r.autocompleteField({url: a.url || r.attr("data-url"), dataType: a.dataType, delay: a.delay, useCache: !0, minLength: 2}).bind("keyup",function (t) {
                13 != t.which && r.val().length >= 2 && a.results.is(":empty") && n()
            }).bind("autocomplete:beforesend",function () {
                    n()
                }).bind("autocomplete:finish",function (t, e) {
                    i(e || {}), s()
                }).bind("autocomplete:clear",function () {
                    a.results.html("").hide(), s()
                }).bind("focus",function () {
                    r.val() && r.trigger("keyup")
                }).bind("blur",function () {
                    setTimeout(function () {
                        r.trigger("autocomplete:clear")
                    }, 250)
                }).bind("keydown", function (n) {
                    switch (n.hotkey) {
                        case"up":
                            if (e(a.results, -1))return!1;
                            break;
                        case"down":
                            if (e(a.results, 1))return!1;
                            break;
                        case"esc":
                            return t(this).blur(), !1;
                        case"enter":
                            var i = a.results.find("a.selected");
                            if (i.length)return t(this).blur(), i.hasClass("initial") ? i.closest("form").submit() : window.location = i.attr("href"), !1;
                            t(this).trigger("autocomplete:clear")
                    }
                })
        })
    }
}(jQuery), function (t) {
    t.smartPoller = function (e, n) {
        t.isFunction(e) && (n = e, e = 1e3), function a() {
            setTimeout(function () {
                n.call(this, a)
            }, e), e = 1.5 * e
        }()
    }
}(jQuery), function (t) {
    function e(t) {
        return"tagName"in t ? t : t.parentNode
    }

    try {
        window.document.createEvent("TouchEvent")
    } catch (n) {
        return!1
    }
    var a, i = {};
    t(document).ready(function () {
        t(document.body).bind("touchstart",function (t) {
            var n = Date.now(), s = n - (i.last || n);
            i.target = e(t.originalEvent.touches[0].target), a && clearTimeout(a), i.x1 = t.originalEvent.touches[0].pageX, s > 0 && 250 >= s && (i.isDoubleTap = !0), i.last = n
        }).bind("touchmove",function (t) {
                i.x2 = t.originalEvent.touches[0].pageX
            }).bind("touchend",function () {
                i.isDoubleTap ? (t(i.target).trigger("doubleTap"), i = {}) : i.x2 > 0 ? (Math.abs(i.x1 - i.x2) > 30 && t(i.target).trigger("swipe") && t(i.target).trigger("swipe" + (i.x1 - i.x2 > 0 ? "Left" : "Right")), i.x1 = i.x2 = i.last = 0) : "last"in i && (a = setTimeout(function () {
                    a = null, t(i.target).trigger("tap"), i = {}
                }, 250))
            }).bind("touchcancel", function () {
                i = {}
            })
    }), ["swipe", "swipeLeft", "swipeRight", "doubleTap", "tap"].forEach(function (e) {
        t.fn[e] = function (t) {
            return this.bind(e, t)
        }
    })
}(jQuery), function () {
    var t;
    t = function (t) {
        return debug("AJAX Error", t), $("#ajax-error-message").show(function () {
            return $(this).addClass("visible")
        })
    }, $(document).on("ajaxError", "[data-remote]", function (e, n, a, i) {
        return"canceled" !== i ? /<html/.test(n.responseText) ? (t(i), e.stopImmediatePropagation()) : setTimeout(function () {
            return e.isDefaultPrevented() ? void 0 : t(i)
        }, 0) : void 0
    }), $(document).on("ajaxBeforeSend", "[data-remote]", function () {
        return $("#ajax-error-message").hide().removeClass("visible")
    }), $(document).on("click", ".ajax-error-dismiss", function () {
        return $("#ajax-error-message").hide().removeClass("visible"), !1
    })
}.call(this), function () {
    $(document).on("ajaxSend", "[data-remote]", function (t) {
        return t.isDefaultPrevented() ? void 0 : ($(this).addClass("loading"), $(document.documentElement).addClass("ajax-loading"))
    }), $(document).on("ajaxComplete", "[data-remote]", function () {
        return $(document.documentElement).removeClass("ajax-loading"), $(this).removeClass("loading")
    })
}.call(this), function () {
    var t;
    t = function (t) {
        var e, n, a, i, s;
        t = $(t), a = t.val(), $.trim(a) && (n = {type: "POST", url: t.attr("data-autocheck-url"), data: {value: a}}, e = $.Event("autocheck:send"), t.trigger(e, n), e.isDefaultPrevented() || (t.addClass("is-autocheck-loading"), t.closest("dl.form").addClass("is-loading"), t.closest("dl.form").removeClass("errored successed"), t.removeClass("is-autocheck-successful is-autocheck-errored"), null != (s = t.data("autocheck-xhr")) && s.abort(), i = $.ajax(n).done(function () {
            return t.addClass("is-autocheck-successful"), t.closest("dl.form").unErrorify().addClass("successed"), t.trigger("autocheck:success", arguments)
        }).fail(function (e, n) {
                return"abort" !== n && t.is(":visible") ? (t.addClass("is-autocheck-errored"), /<html/.test(e.responseText) ? t.closest("dl.form").errorify("Something went wrong.") : t.closest("dl.form").errorify(e.responseText), t.trigger("autocheck:error", arguments)) : void 0
            }).always(function (e, n) {
                return"abort" !== n ? (t.removeClass("is-autocheck-loading"), t.closest("dl.form").removeClass("is-loading"), t.trigger("autocheck:complete", arguments)) : void 0
            }), t.data("autocheck-xhr", i)))
    }, $(document).on("change", "input[data-autocheck-url]", function () {
        return t(this)
    }), $(document).onFocusedInput("input[data-autocheck-url]", function (e) {
        return $(this).on("throttled:input." + e, function () {
            return t(this)
        }), !1
    })
}.call(this), function () {
    var t;
    t = function () {
        function t() {
            var e = this;
            this.onNavigationOpen = function () {
                return t.prototype.onNavigationOpen.apply(e, arguments)
            }, this.onNavigationKeyDown = function () {
                return t.prototype.onNavigationKeyDown.apply(e, arguments)
            }, this.onResultsChange = function () {
                return t.prototype.onResultsChange.apply(e, arguments)
            }, this.onInputChange = function () {
                return t.prototype.onInputChange.apply(e, arguments)
            }, this.onResultsMouseDown = function () {
                return t.prototype.onResultsMouseDown.apply(e, arguments)
            }, this.onInputBlur = function () {
                return t.prototype.onInputBlur.apply(e, arguments)
            }, this.onInputFocus = function () {
                return t.prototype.onInputFocus.apply(e, arguments)
            }, $(document).on("focusin", "input[data-autocomplete]", this.onInputFocus), this.focusedInput = this.focusedResults = null, this.mouseDown = !1
        }

        return t.prototype.bindEvents = function (t, e) {
            return $(t).on("blur", this.onInputBlur), $(t).on("throttled:input", this.onInputChange), $(e).on("mousedown", this.onResultsMouseDown), $(e).on("autocomplete:change", this.onResultsChange), $(e).on("navigation:open", "[data-autocomplete-value]", this.onNavigationOpen), $(e).on("navigation:keydown", "[data-autocomplete-value]", this.onNavigationKeyDown)
        }, t.prototype.unbindEvents = function (t, e) {
            return $(t).off("blur", this.onInputBlur), $(t).off("throttled:input", this.onInputChange), $(e).off("mousedown", this.onResultsMouseDown), $(e).off("autocomplete:change", this.onResultsChange), $(e).off("navigation:open", "[data-autocomplete-value]", this.onNavigationOpen), $(e).off("navigation:keydown", "[data-autocomplete-value]", this.onNavigationKeyDown)
        }, t.prototype.onInputFocus = function (t) {
            var e, n;
            e = t.currentTarget, n = document.getElementById($(e).attr("data-autocomplete")), this.focusedInput = e, this.focusedResults = n, this.bindEvents(e, n), $(e).trigger("autocomplete:focus"), $(e).trigger("autocomplete:search", [$(e).val()])
        }, t.prototype.onInputBlur = function (t) {
            var e, n;
            e = t.currentTarget, n = this.focusedResults, this.mouseDown || (this.hideResults(), this.inputValue = null, this.focusedInput = this.focusedResults = null, this.unbindEvents(e, n), $(e).trigger("autocomplete:blur"))
        }, t.prototype.onResultsMouseDown = function () {
            var t, e = this;
            this.mouseDown = !0, t = function () {
                return e.mouseDown = !1, $(document).off("mouseup", t)
            }, $(document).on("mouseup", t)
        }, t.prototype.onInputChange = function (t, e) {
            var n;
            n = t.currentTarget, this.inputValue !== e && ($(n).removeAttr("data-autocompleted"), $(n).trigger("autocomplete:autocompleted:changed")), $(n).trigger("autocomplete:change", [e]), $(n).trigger("autocomplete:search", [e])
        }, t.prototype.onResultsChange = function () {
            var t, e;
            e = $(this.focusedInput).val(), t = $(this.focusedResults).find("[data-autocomplete-value]"), 0 === t.length ? this.hideResults() : this.inputValue !== e && (this.inputValue = e, this.showResults(), $(this.focusedInput).is("[data-autocomplete-autofocus]") && $(this.focusedResults).find("ul").navigation("focus"))
        }, t.prototype.onNavigationKeyDown = function (t) {
            switch (t.hotkey) {
                case"tab":
                    return this.onNavigationOpen(t), !1;
                case"esc":
                    return this.hideResults(), !1
            }
        }, t.prototype.onNavigationOpen = function (t) {
            var e, n;
            e = t.currentTarget, n = $(e).attr("data-autocomplete-value"), this.inputValue = n, $(this.focusedInput).val(n), $(this.focusedInput).attr("data-autocompleted", n), $(this.focusedInput).trigger("autocomplete:autocompleted:changed", [n]), $(this.focusedInput).trigger("autocomplete:result", [n]), $(e).removeClass("active"), this.hideResults()
        }, t.prototype.showResults = function (t, e) {
            var n, a, i, s, r;
            return null == t && (t = this.focusedInput), null == e && (e = this.focusedResults), $(e).is(":visible") ? void 0 : (r = $(t).offset(), i = r.top, a = r.left, n = i + $(t).innerHeight(), s = $(t).innerWidth(), $(e).css({display: "block", position: "absolute", width: s + 2}), $(e).offset({top: n + 5, left: a + 1}), $(t).addClass("js-navigation-enable"), $(e).find("ul").navigation("push"), $(e).show())
        }, t.prototype.hideResults = function (t, e) {
            return null == t && (t = this.focusedInput), null == e && (e = this.focusedResults), $(e).is(":visible") ? ($(t).removeClass("js-navigation-enable"), $(e).find("ul").navigation("pop"), $(e).hide()) : void 0
        }, t
    }(), new t
}.call(this), function () {
    var t;
    t = function () {
        function t(e) {
            var n = this;
            this.container = e, this.hoverEnd = function () {
                return t.prototype.hoverEnd.apply(n, arguments)
            }, this.hoverStart = function () {
                return t.prototype.hoverStart.apply(n, arguments)
            }, this.items = this.container.find(".avatars li"), this.items.length > 1 && this.container.hover(this.hoverStart, this.hoverEnd)
        }

        return t.prototype.namespace = "avatarStack", t.prototype.hoverStart = function () {
            return this.container.addClass("avatar-stack-focus")
        }, t.prototype.hoverEnd = function () {
            return this.container.removeClass("avatar-stack-focus")
        }, t
    }(), $(function () {
        return $(".avatar-stack").each(function () {
            return new t($(this))
        })
    })
}.call(this), function () {
    $(document).on("submit", ".js-braintree-encrypt", function () {
        var t;
        t = Braintree.create($(this).attr("data-braintree-key")), t.encryptForm(this)
    })
}.call(this), function () {
    var t;
    t = function (t) {
        return t.match(/^5[1-5]/) ? "master" : t.match(/^4/) ? "visa" : t.match(/^3(4|7)/) ? "american_express" : t.match(/^6011/) ? "discover" : t.match(/^(30[0-5]|36|38)/) ? "diners_club" : t.match(/^(3|2131|1800)/) ? "jcb" : void 0
    }, $(document).onFocusedInput(".js-card-select-number-field", function () {
        var e, n, a;
        return n = $(this).closest("form"), e = n.find(".js-card"), a = n.find(".js-card-select-type-field"), function () {
            var n, i, s, r;
            if (i = t($(this).val()))for (s = 0, r = e.length; r > s; s++)n = e[s], $(n).toggleClass("enabled", $(n).attr("data-name") === i), $(n).toggleClass("disabled", $(n).attr("data-name") !== i); else e.removeClass("enabled disabled");
            a.val(i)
        }
    }), $(document).on("click", ".js-card", function () {
        var t, e;
        return t = $(this).closest("form"), e = t.find(".js-card-select-number-field"), e.focus()
    })
}.call(this), function () {
    $(document).on("change", ".js-select-country", function () {
        var t, e, n;
        return t = $(this).val(), e = ["Austria", "Belgium", "Bulgaria", "Croatia", "Cyprus", "Czech Republic", "Denmark", "Estonia", "Finland", "France", "Germany", "Greece", "Hungary", "Ireland", "Italy", "Latvia", "Lithuania", "Luxembourg", "Malta", "Netherlands", "Poland", "Portugal", "Romania", "Slovakia", "Slovenia", "Spain", "Sweden", "United Kingdom"], n = e.indexOf(t) >= 0, $(".js-setup-creditcard").toggleClass("is-eu-country", n), "United States of America" !== t ? ($(".js-setup-creditcard").addClass("is-international"), $(".js-select-state").val("")) : $(".js-setup-creditcard").removeClass("is-international")
    })
}.call(this), function () {
    $(document).on("click:prepare", ".minibutton.disabled", function (t) {
        t.preventDefault(), t.stopPropagation()
    })
}.call(this), function () {
    var t, e;
    null == (t = window.GitHub) && (window.GitHub = {}), window.GitHub.assetHostUrl = null != (e = $("link[rel=assets]").prop("href")) ? e : "/"
}.call(this), function () {
    var t, e;
    ZeroClipboard.setDefaults({moviePath: "" + GitHub.assetHostUrl + "flash/ZeroClipboard.swf", trustedDomains: location.hostname, allowScriptAccess: "always"}), e = function (t) {
        var e;
        return e = new ZeroClipboard(t), e.on("load", function (t) {
            return $(t.htmlBridge).tipsy()
        }), e.on("complete", function (e) {
            var n;
            return n = $(t).attr("data-copied-hint"), $(e.htmlBridge).prop("title", n).tipsy("show")
        }), e.on("noflash wrongflash", function () {
            return $(t).remove()
        })
    }, $.pageUpdate(t = function () {
        var t, n, a, i;
        for (i = $(this).find(".js-zeroclipboard"), n = 0, a = i.length; a > n; n++)t = i[n], e(t)
    })
}.call(this), function () {
    $(document).on("ajaxBeforeSend", ".js-new-comment-form", function (t) {
        return this === t.target ? $(this).data("remote-xhr") ? !1 : void 0 : void 0
    }), $(document).on("ajaxSend", ".js-new-comment-form", function (t) {
        return this === t.target ? $(this).find(".js-comment-form-error").hide() : void 0
    }), $(document).on("ajaxSuccess", ".js-new-comment-form", function (t, e, n, a) {
        var i, s, r;
        if (this === t.target) {
            this.reset(), $(this).find(".js-comment-field").trigger("validation:field:change"), $(this).find(".js-write-tab").click(), r = a.updateContent;
            for (s in r)i = r[s], $(s).updateContent(i)
        }
    }), $(document).on("ajaxError", ".js-new-comment-form", function (t, e) {
        var n, a;
        if (this === t.target)return a = "There was an error creating your comment", 422 === e.status && (n = JSON.parse(e.responseText), n.errors && (a += ": " + n.errors.join(", "))), $(this).find(".js-comment-form-error").show().text(a), !1
    })
}.call(this), function () {
    $(document).onFocusedInput(".js-new-comment-form .js-comment-field", function () {
        var t, e, n, a, i;
        return e = $(this).closest(".js-new-comment-form"), t = e.find(".js-comment-and-button").first(), t[0] ? (a = t.text(), i = t.attr("data-original-text"), n = t.attr("data-comment-text"), function () {
            var e, s;
            s = "" !== $(this).val().trim(), e = s ? n : i, e !== a && t.text(a = e)
        }) : void 0
    })
}.call(this), function () {
    var t, e, n, a, i, s, r, o, c, l, u, d;
    u = sessionStorage, r = localStorage, c = "draft:", i = /^draft:/, a = 5e3, n = void 0, d = void 0, l = function (t, e) {
        var n;
        return n = c + t.value, r.setItem(n, e.value), $(e).fire("drafts:saved", [n])
    }, t = function (t, e) {
        var n;
        return n = c + t.value, r.removeItem(n), $(e).fire("drafts:cleared", [n])
    }, o = function () {
        var t, e, n, a, s, o;
        for (t = {}, o = Object.keys(r), a = 0, s = o.length; s > a; a++)n = o[a], n.match(i) && ((e = r.getItem(n)) && (t[n.replace(i, "")] = e), r.removeItem(n));
        return t
    }, e = function (t) {
        var e, n;
        return null == t && (t = document), !d && (n = $(document).find("head link[rel=drafts]")[0]) && !$(t).closest("form").data("remote-xhr") && (e = o(), Object.keys(e).length) ? $(t).fire("drafts:flush", [e], function () {
            return d = $.ajax({type: "POST", url: n.href, data: {drafts: e}, complete: function () {
                return d = void 0, $(t).fire("drafts:complete", [e])
            }, success: function () {
                return $(t).fire("drafts:flushed", [e])
            }, error: function () {
                return $(t).fire("drafts:error", [e])
            }})
        }) : void 0
    }, $(document).focused(".js-draft-field")["in"](function () {
        var t, i = this;
        if (t = $(this).closest("form").find(".js-draft-key")[0])return n = setInterval(function () {
            return e(i)
        }, a), $(this).on("input.drafts", function () {
            var e = this;
            return setImmediate(function () {
                return l(t, e)
            })
        })
    }).out(function () {
            var t = this;
            return setImmediate(function () {
                return e(t)
            }), clearInterval(n), $(this).off(".drafts")
        }), $(document).on("reset", ".js-draft-container", function () {
        var e;
        if (e = $(this).find(".js-draft-key")[0])return t(e, $(this).find(".js-draft-field")[0])
    }), $.pageUpdate(s = function () {
        var t, e, n, a, i, s;
        for (i = $(this).find(".js-draft-field"), s = [], n = 0, a = i.length; a > n; n++)e = i[n], e.value || $(e).closest("form").hasDirtyFields() ? s.push(void 0) : (t = $(e).attr("data-draft")) ? s.push($(e).removeAttr("data-draft").val(t).fire("drafts:resumed")) : s.push(void 0);
        return s
    }), $(function () {
        return e()
    })
}.call(this), function () {
    var t;
    t = function (t) {
        return $(t).find(".js-draft-flushed-date").attr("datetime", (new Date).toISOString()).html("just now")
    }, $(document).on("drafts:resumed", ".js-draft-container", function (e, n) {
        return window.logDraftEvents && console.log("drafts:resumed", n), t(this), $(this).addClass("has-resumed-draft")
    }), $(document).on("drafts:flush", ".js-draft-container", function (t, e) {
        return window.logDraftEvents && console.log("draft:flush", e), $(this).removeClass("has-flushed-draft has-resumed-draft").addClass("is-flushing-draft")
    }), $(document).on("drafts:complete", ".js-draft-container", function () {
        return $(this).removeClass("is-flushing-draft")
    }), $(document).on("drafts:error", ".js-draft-container", function (t, e) {
        return console.log("draft:error", status, error, e)
    }), $(document).on("drafts:flushed", ".js-draft-container", function (e, n) {
        return window.logDraftEvents && console.log("draft:flushed", n), t(this), $(this).removeClass("has-draft-changes").addClass("has-flushed-draft")
    }), $(document).on("drafts:cleared", ".js-draft-container", function () {
        return $(this).removeClass("has-draft-changes has-flushed-draft has-resumed-draft")
    })
}.call(this), function () {
    $(document).on("click", ".js-comment-edit-button", function () {
        var t;
        return t = $(this).closest(".js-comment"), t.addClass("is-comment-editing"), t.find(".js-comment-field").focus().trigger("change"), !1
    }), $(document).on("click", ".js-comment-cancel-button", function () {
        var t;
        return t = $(this).closest("form"), t.hasDirtyFields() && !confirm($(this).attr("data-confirm-text")) ? !1 : (t[0].reset(), $(this).closest(".js-comment").removeClass("is-comment-editing"), !1)
    }), $(document).on("ajaxSend", ".js-comment-delete, .js-comment-update", function (t, e) {
        var n;
        return n = $(this).closest(".js-comment"), n.addClass("is-comment-loading"), n.find(".minibutton").addClass("disabled"), e.setRequestHeader("X-Body-Version", n.attr("data-body-version"))
    }), $(document).on("ajaxError", ".js-comment-update", function (t, e, n, a) {
        var i, s, r;
        if (debug("ajaxError for js-comment-update", a), 422 === e.status)try {
            if (s = JSON.parse(e.responseText), i = $(this).closest(".js-comment"), s.stale)return e.stale = !0, i.addClass("is-comment-stale"), i.find(".minibutton").addClass("disabled"), i.hasClass("is-updating-task-list") && window.location.reload(), t.preventDefault();
            if (s.errors)return r = "There was an error posting your comment: " + s.errors.join(", "), i.find(".js-comment-update-error").text(r).show(), t.preventDefault()
        } catch (o) {
            return debug("Error trying to handle ajaxError for js-comment-update: " + o)
        }
    }), $(document).on("ajaxComplete", ".js-comment-delete, .js-comment-update", function (t, e) {
        var n;
        return n = $(this).closest(".js-comment"), n.removeClass("is-comment-loading"), n.find(".minibutton").removeClass("disabled"), e.stale ? n.find(".form-actions button[type=submit].minibutton").addClass("disabled") : void 0
    }), $(document).on("ajaxSuccess", ".js-comment-delete", function () {
        var t, e;
        return t = $(this).closest(".js-comment"), e = $(this).closest(".js-comment-container"), e.length || (e = t), e.fadeOut(function () {
            return t.removeClass("is-comment-editing")
        })
    }), $(document).on("ajaxSuccess", ".js-comment-update", function (t, e, n, a) {
        var i, s, r, o, c, l;
        for (i = $(this).closest(".js-comment"), s = $(this).closest(".js-comment-container"), s.length || (s = i), null != a.title && i.find(".js-comment-body-title").html(a.title), i.find(".js-comment-body").html(a.body), i.attr("data-body-version", a.newBodyVersion), l = i.find("input, textarea"), o = 0, c = l.length; c > o; o++)r = l[o], r.defaultValue = r.value;
        return i.removeClass("is-comment-editing"), s.pageUpdate()
    })
}.call(this), function () {
    $(document).on("focusin", ".js-write-bucket", function () {
        return $(this).addClass("focused")
    }), $(document).on("focusout", ".js-write-bucket", function () {
        return $(this).removeClass("focused")
    })
}.call(this), function () {
    $(document).onFocusedKeydown(".js-comment-field", function () {
        return function (t) {
            var e;
            return"ctrl+L" !== t.hotkey && "meta+L" !== t.hotkey || !(e = $(this).prev(".js-enable-fullscreen")[0]) ? void 0 : (e.click(), !1)
        }
    })
}.call(this), function () {
    var t;
    $(document).on("click", ".add-line-comment[data-remote]", function () {
        var e, n;
        return $(this).hasClass("loading") ? !1 : ($(this).closest(".file").addClass("show-inline-notes"), n = $(this).closest("tr"), e = n.next("tr.inline-comments"), e.length ? t(e) : $.ajax({context: this, url: $(this).attr("data-remote"), success: function (e) {
            return n.after(e).pageUpdate(), t(n.next("tr.inline-comments"))
        }}))
    }), t = function (t) {
        return t.find(".js-write-tab").click(), t.addClass("show-inline-comment-form").find(".js-comment-field").focus()
    }, $(document).on("click", ".js-show-inline-comment-form", function () {
        return t($(this).closest(".inline-comments")), !1
    }), $(document).on("click", ".js-hide-inline-comment-form", function () {
        var t;
        return t = $(this).closest(".inline-comments"), t.removeClass("show-inline-comment-form"), t.find(".inline-comment-form .js-comment-field").val(""), t.find(".js-comments-holder").children(":visible").length || t.remove(), !1
    }), $(document).onFocusedKeydown(".inline-comment-form .js-comment-field", function () {
        return function (t) {
            var e;
            if (!$(this).hasClass("js-navigation-enable"))return"esc" === t.hotkey && 0 === this.value.length ? (e = $(this).closest(".inline-comments"), e.find(".js-hide-inline-comment-form").click(), !1) : void 0
        }
    }), $(document).on("ajaxSend", ".js-inline-comment-form", function () {
        return $(this).find(".ajaxindicator").show()
    }), $(document).on("ajaxComplete", ".js-inline-comment-form", function () {
        return $(this).find(".ajaxindicator").hide()
    }), $(document).on("ajaxSuccess", ".js-inline-comment-form", function (t, e, n, a) {
        var i, s;
        return s = $(this).closest(".js-line-comments"), s.find(".js-comments-holder").append(a), s.find(".js-hide-inline-comment-form").click(), i = s.closest(".inline-comments").find(".comment-count .counter"), i.text(parseInt(i.text().replace(",", "")) + 1), s.closest(".inline-comments").pageUpdate()
    }), $(document).on("ajaxSuccess", ".inline-comments .js-comment-delete", function () {
        var t;
        return t = $(this).closest(".inline-comments"), setTimeout(function () {
            return t.find(".js-comments-holder").children(":visible").length ? void 0 : t.remove()
        }, 500)
    })
}.call(this), function () {
    var t, e;
    $(document).on("click", ".js-write-tab", function () {
        var t;
        return t = $(this).closest(".js-previewable-comment-form"), t.addClass("write-selected").removeClass("preview-selected"), t.find(".tabnav-tab").removeClass("selected"), $(this).addClass("selected"), !1
    }), $(document).on("click", ".js-preview-tab", function () {
        var n;
        return n = $(this).closest(".js-previewable-comment-form"), n.addClass("preview-selected").removeClass("write-selected"), n.find(".tabnav-tab").removeClass("selected"), $(this).addClass("selected"), t(n), e(n), !1
    }), e = function (t) {
        var e;
        return e = t.find(".comment-body"), e.html("<p>Loading preview&hellip;</p>"), $.ajax({type: "POST", url: t.attr("data-preview-url"), data: {text: t.find(".js-comment-field").val()}, success: function (t) {
            return e.html(t || "<p>Nothing to preview</p>")
        }})
    }, $(document).onFocusedKeydown(".js-comment-field", function () {
        return function (t) {
            var e;
            return"ctrl+P" !== t.hotkey && "meta+P" !== t.hotkey || (e = $(this).closest(".js-previewable-comment-form"), !e.hasClass("write-selected")) ? void 0 : ($(this).blur(), e.find(".preview-tab").click(), t.stopImmediatePropagation(), !1)
        }
    }), t = function (t) {
        return $(document).off("keydown.unpreview"), $(document).on("keydown.unpreview", function (e) {
            return"ctrl+P" === e.hotkey || "meta+P" === e.hotkey ? (t.find(".js-write-tab").click(), t.find(".js-comment-field").focus(), $(document).off("keydown.unpreview"), !1) : void 0
        })
    }
}.call(this), function () {
    $(document).onFocusedKeydown(".js-comment-field", function () {
        return function (t) {
            return"ctrl+enter" === t.hotkey || "meta+enter" === t.hotkey ? ($(this).closest("form").submit(), !1) : void 0
        }
    })
}.call(this), function () {
    $(document).on("pjax:send", ".context-loader-container", function () {
        var t;
        return t = $(this).find(".context-loader:first"), t.length ? t.addClass("is-context-loading") : $(".page-context-loader").addClass("is-context-loading")
    }), $(document).on("pjax:complete", ".context-loader-container", function (t) {
        return $(t.target).find(".context-loader:first").removeClass("is-context-loading"), $(".page-context-loader").removeClass("is-context-loading"), $(document.body).removeClass("disables-context-loader")
    }), $(document).on("pjax:timeout", ".context-loader-container", function () {
        return!1
    })
}.call(this), function () {
    var t;
    t = function () {
        var t, e, n;
        return t = $(this), n = document.getElementById(t.attr("data-counter")), e = t.find(".js-countable").length, n.innerHTML = e, t.find(".js-no-results").toggleClass("hidden", 0 !== e)
    }, $(document).on("counters:change", ".js-has-counter", function () {
        return $(this).each(t)
    }), $.pageUpdate(function () {
        return $(".js-has-counter").trigger("counters:change")
    })
}.call(this), function () {
    var t;
    t = function (t) {
        var e, n, a, i;
        for (i = $(t).attr("data-confirm").toLowerCase().split(","), n = 0, a = i.length; a > n; n++)if (e = i[n], t.value.toLowerCase() === e)return!0;
        return!1
    }, $(document).onFocusedInput(".js-dangerous-confirmation .confirm-input", function () {
        var e, n;
        return e = $(this).closest(".js-dangerous-confirmation"), n = e.find(".confirm-button")[0], function () {
            n.disabled = !t(this)
        }
    })
}.call(this), function () {
    $(document).on("ajaxBeforeSend", function (t, e, n) {
        var a;
        n.crossDomain || (a = document.getElementById("js-discussion-marker")) && e.setRequestHeader("X-Discussion-Last-Modified", $(a).attr("data-last-modified"))
    })
}.call(this), function () {
}.call(this), function (t) {
    function e(e) {
        if (t.facebox.settings.inited)return!0;
        t.facebox.settings.inited = !0, t(document).trigger("init.facebox"), i();
        var n = t.facebox.settings.imageTypes.join("|");
        t.facebox.settings.imageTypesRegexp = new RegExp("\\.(" + n + ")(\\?.*)?$", "i"), e && t.extend(t.facebox.settings, e), t("body").append(t.facebox.settings.faceboxHtml), t(".facebox-close").click(t.facebox.close)
    }

    function n() {
        var t, e;
        return self.pageYOffset ? (e = self.pageYOffset, t = self.pageXOffset) : document.documentElement && document.documentElement.scrollTop ? (e = document.documentElement.scrollTop, t = document.documentElement.scrollLeft) : document.body && (e = document.body.scrollTop, t = document.body.scrollLeft), new Array(t, e)
    }

    function a() {
        var t;
        return self.innerHeight ? t = self.innerHeight : document.documentElement && document.documentElement.clientHeight ? t = document.documentElement.clientHeight : document.body && (t = document.body.clientHeight), t
    }

    function i() {
        var e = t.facebox.settings;
        e.imageTypes = e.image_types || e.imageTypes, e.faceboxHtml = e.facebox_html || e.faceboxHtml
    }

    function s(e, n) {
        if (e.match(/#/)) {
            var a = window.location.href.split("#")[0], i = e.replace(a, "");
            if ("#" == i)return;
            t.facebox.reveal(t(i).html(), n)
        } else e.match(t.facebox.settings.imageTypesRegexp) ? r(e, n) : o(e, n)
    }

    function r(e, n) {
        var a = new Image;
        a.onload = function () {
            t.facebox.reveal('<div class="image"><img src="' + a.src + '" /></div>', n)
        }, a.src = e
    }

    function o(e, n) {
        t.facebox.jqxhr = t.get(e, function (e) {
            t.facebox.reveal(e, n)
        })
    }

    function c() {
        return 0 == t.facebox.settings.overlay || null === t.facebox.settings.opacity
    }

    function l() {
        return c() ? void 0 : (0 == t(".facebox-overlay").length && t("body").append('<div class="facebox-overlay facebox-overlay-hide"></div>'), t(".facebox-overlay").hide().addClass("facebox-overlay-active").css("opacity", t.facebox.settings.opacity).click(function () {
            t(document).trigger("close.facebox")
        }).fadeIn(200), !1)
    }

    function u() {
        return c() ? void 0 : (t(".facebox-overlay").fadeOut(200, function () {
            t(".facebox-overlay").removeClass("facebox-overlay-active"), t(".facebox-overlay").addClass("facebox-overlay-hide"), t(".facebox-overlay").remove()
        }), !1)
    }

    t.facebox = function (e, n) {
        t.facebox.loading(), e.ajax ? o(e.ajax, n) : e.image ? r(e.image, n) : e.div ? s(e.div, n) : t.isFunction(e) ? e.call(t) : t.facebox.reveal(e, n)
    }, t.extend(t.facebox, {settings: {opacity: .5, overlay: !0, imageTypes: ["png", "jpg", "jpeg", "gif"], faceboxHtml: '    <div class="facebox" id="facebox" style="display:none;">       <div class="facebox-popup">         <div class="facebox-content">         </div>         <button type="button" class="facebox-close">           <span class="octicon octicon-remove-close"></span>         </button>       </div>     </div>'}, loading: function () {
        return e(), 1 == t(".facebox-loading").length ? !0 : (l(), t(".facebox-content").empty().append('<div class="facebox-loading"></div>'), t(".facebox").show().css({top: n()[1] + a() / 10, left: t(window).width() / 2 - t(".facebox-popup").outerWidth() / 2}), t(document).bind("keydown.facebox", function (e) {
            return 27 == e.keyCode && t.facebox.close(), !0
        }), t(document).trigger("loading.facebox"), void 0)
    }, reveal: function (e, n) {
        t(document).trigger("beforeReveal.facebox"), n && t(".facebox-content").addClass(n), t(".facebox-content").empty().append(e), t(".facebox-loading").remove(), t(".facebox-popup").children().fadeIn("normal"), t(".facebox").css("left", t(window).width() / 2 - t(".facebox-popup").outerWidth() / 2), t(document).trigger("reveal.facebox").trigger("afterReveal.facebox")
    }, close: function () {
        return t(document).trigger("close.facebox"), !1
    }}), t.fn.facebox = function (n) {
        function a() {
            t.facebox.loading(!0);
            var e = this.rel.match(/facebox\[?\.(\w+)\]?/);
            return e && (e = e[1]), s(this.href, e), !1
        }

        if (0 != t(this).length)return e(n), this.bind("click.facebox", a)
    }, t(document).bind("close.facebox", function () {
        t.facebox.jqxhr && (t.facebox.jqxhr.abort(), t.facebox.jqxhr = null), t(document).unbind("keydown.facebox"), t(".facebox").fadeOut(function () {
            t(".facebox-content").removeClass().addClass("facebox-content"), t(".facebox-loading").remove(), t(document).trigger("afterClose.facebox")
        }), u()
    })
}(jQuery), function () {
    var t, e;
    $(document).on("reveal.facebox", function () {
        var t, e;
        t = $("#facebox"), t.pageUpdate(), e = t.find("input[autofocus], textarea[autofocus]").last()[0], e && document.activeElement !== e && e.focus()
    }), $(document).on("afterClose.facebox", function () {
        return $("#facebox :focus").blur()
    }), e = function () {
        return $(this).facebox()
    }, $.pageUpdate(t = function () {
        $(this).find("a[rel*=facebox]").install(e)
    })
}.call(this), function () {
    var t, e, n, a;
    e = function (t) {
        var e, a, i, s, r, o;
        if (a = document.getElementById(t))return i = document.getElementById("fullscreen_overlay"), s = $(i).find(".js-fullscreen-contents"), r = "gh-fullscreen-theme", "dark" === localStorage.getItem(r) ? $(".js-fullscreen-overlay").addClass("dark-theme") : $(".js-fullscreen-overlay").removeClass("dark-theme"), o = $(a).val(), e = $(a).caret(), $(i).attr("data-return-scroll-position", window.pageYOffset), $("body").addClass("fullscreen-overlay-enabled"), $(document).on("keydown", n), $(s).attr("placeholder", $(a).attr("placeholder")), $(s).val(o), $(s).caret(e), s.focus()
    }, t = function (t) {
        var e, a, i, s, r, o;
        if (a = document.getElementById(t))return i = document.getElementById("fullscreen_overlay"), r = $(i).find(".js-fullscreen-contents"), o = $(r).val(), e = $(r).caret(), $("body").removeClass("fullscreen-overlay-enabled"), $(document).off("keydown", n), (s = $(i).attr("data-return-scroll-position")) && window.scrollTo(0, s), null != window.editor ? window.editor.setCode(o) : ($(a).val(o), $(a).caret(e), $(a).trigger("validation:field:change")), r.val("")
    }, a = !1, n = function (t) {
        return 27 === t.keyCode || "ctrl+L" === t.hotkey || "meta+L" === t.hotkey ? (a ? history.back() : window.location.hash = "", t.preventDefault()) : void 0
    }, $(document).on("click", ".js-exit-fullscreen", function (t) {
        a && (t.preventDefault(), history.back())
    }), $(document).on("click", ".js-theme-switcher", function () {
        var t;
        return t = "gh-fullscreen-theme", "dark" === localStorage.getItem(t) ? (localStorage.removeItem(t), $("body, .js-fullscreen-overlay").removeClass("dark-theme")) : (localStorage.setItem(t, "dark"), $("body, .js-fullscreen-overlay").addClass("dark-theme")), !1
    }), $.hashChange(function (n) {
        var i, s, r;
        return r = n.oldURL, s = n.newURL, (i = s.match(/\#fullscreen_(.+)$/)) ? (a = !!r, e(i[1])) : (i = null != r ? r.match(/\#fullscreen_(.+)$/) : void 0) ? (a = !1, t(i[1])) : void 0
    }), "dark" === ("undefined" != typeof localStorage && null !== localStorage ? localStorage["gh-fullscreen-theme"] : void 0) && $(function () {
        return $("body, .js-fullscreen-overlay").addClass("dark-theme")
    })
}.call(this), function () {
    var t, e, n;
    e = {}, t = function (t) {
        var n;
        t.preventDefault(), (n = e[t.hotkey]) && $(n).click()
    }, $(document).on("keydown", function (e) {
        e.target === document.body && "g" === e.hotkey && (e.preventDefault(), $(document).on("keydown hotkey:activate", t), setTimeout(function () {
            return $(document).off("keydown hotkey:activate", t)
        }, 1500))
    }), $.pageUpdate(n = function () {
        var t, n, a, i, s;
        for (e = {}, s = $("[data-gotokey]"), a = 0, i = s.length; i > a; a++)t = s[a], n = $(t).attr("data-gotokey"), e[n] = t
    })
}.call(this), function () {
    $(document).on("keydown", "div.minibutton, span.minibutton", function (t) {
        return"enter" === t.hotkey ? ($(this).click(), t.preventDefault()) : void 0
    })
}.call(this), function () {
    $(document).on("ajaxSuccess", ".js-notice-dismiss", function () {
        return $(this).closest(".js-notice").fadeOut()
    }), $(document).on("ajaxError", ".js-notice-dismiss", function () {
        return alert("Failed to dismiss notice. Sorry!")
    })
}.call(this), function () {
    $.support.pjax && ($(document).on("pjax:start", function (t) {
        var e;
        (e = t.relatedTarget) && ($(e).addClass("pjax-active"), $(e).parents(".js-pjax-active").addClass("pjax-active"))
    }), $(document).on("pjax:end", function () {
        $(".pjax-active").removeClass("pjax-active")
    }))
}.call(this), function () {
    var t;
    t = function () {
        var t, e;
        return e = function () {
            var e, n, a;
            for (a = [], e = 0, n = arguments.length; n > e; e++)t = arguments[e], a.push(t.split("/", 3).join("/"));
            return a
        }.apply(this, arguments), e[0] === e[1]
    }, $(document).on("pjax:click", "#js-repo-pjax-container a[href]", function () {
        var e;
        return e = $(this).prop("pathname"), t(e, location.pathname) ? void 0 : !1
    })
}.call(this), function () {
    var t;
    $.support.pjax && ($.pjax.defaults.fragment = "#pjax-body", $.pjaxHeadCache = [], $(t = function () {
        return $.pjaxHeadCache[document.location.pathname] = $("head [data-pjax-transient]")
    }), $(document).on("pjax:success", function (t, e) {
        var n;
        return n = $.parseHTML(e)[0], "pjax-head" === n.id ? $.pjaxHeadCache[document.location.pathname] = $(n).children() : void 0
    }), $(document).on("pjax:end", function () {
        var t, e, n;
        return t = $.pjaxHeadCache[document.location.pathname], t ? ($("head [data-pjax-transient]").remove(), n = $(t).filter(":not(title, script, link[rel='stylesheet'])"), e = $(t).filter("link[rel='stylesheet']"), $(document.head).append(n.attr("data-pjax-transient", !0)), $(document.head).append(e)) : void 0
    }))
}.call(this), function () {
    var t;
    $.support.pjax && (t = function (t) {
        return $(t).is("[data-pjax-preserve-scroll]") ? !1 : 0
    }, $(document).on("click", "[data-pjax] a, a[data-pjax]", function (e) {
        var n, a, i;
        if (!$(this).is("[data-skip-pjax]") && !$(this).is("[data-remote]"))return a = $(this).is("[data-pjax]") ? this : $(this).closest("[data-pjax]")[0], i = t(this), (n = $(this).closest("[data-pjax-container]")[0]) ? $.pjax.click(e, {container: n, scrollTo: i}) : void 0
    }), $(document).on("submit", "form[data-pjax]", function (e) {
        var n, a;
        return a = t(this), (n = $(this).closest("[data-pjax-container]")[0]) ? $.pjax.submit(e, {container: n, scrollTo: a}) : void 0
    }))
}.call(this), function () {
    $.support.pjax && ($.pjax.defaults.timeout = 1e3)
}.call(this), function (t) {
    function e() {
        return 1 == m ? !1 : void 0 != window.DeviceOrientationEvent
    }

    function n(t) {
        if (x = t.gamma, y = t.beta, 90 === Math.abs(window.orientation)) {
            var e = x;
            x = y, y = e
        }
        return window.orientation < 0 && (x = -x, y = -y), h = null == h ? x : h, f = null == f ? y : f, {x: x - h, y: y - f}
    }

    function a(t) {
        if (!((new Date).getTime() < r + s)) {
            r = (new Date).getTime();
            var a = null != c.offset() ? c.offset().left : 0, i = null != c.offset() ? c.offset().top : 0, h = t.pageX - a, f = t.pageY - i;
            if (!(0 > h || h > c.width() || 0 > f || f > c.height())) {
                if (e()) {
                    if (void 0 == t.gamma)return m = !0, void 0;
                    values = n(t), h = values.x / l, f = values.y / l, h = d > h ? d : h > u ? u : h, f = d > f ? d : f > u ? u : f, h = (h + 1) / 2, f = (f + 1) / 2
                }
                var p, g, v = h / (1 == e() ? u : c.width()), $ = f / (1 == e() ? u : c.height());
                for (g = o.length; g--;)p = o[g], newX = p.startX + p.inversionFactor * p.xRange * v, newY = p.startY + p.inversionFactor * p.yRange * $, p.background ? p.obj.css("background-position", newX + "px " + newY + "px") : p.obj.css("left", newX).css("top", newY)
            }
        }
    }

    var i = 25, s = 1e3 * (1 / i), r = (new Date).getTime(), o = [], c = t(window), l = 30, u = 1, d = -1, h = null, f = null, m = !1;
    t.fn.plaxify = function (e) {
        return this.each(function () {
            for (var n = -1, a = {xRange: t(this).data("xrange") || 0, yRange: t(this).data("yrange") || 0, invert: t(this).data("invert") || !1, background: t(this).data("background") || !1}, i = 0; i < o.length; i++)this === o[i].obj.get(0) && (n = i);
            for (var s in e)0 == a[s] && (a[s] = e[s]);
            if (a.inversionFactor = a.invert ? -1 : 1, a.obj = t(this), a.background) {
                if (pos = (a.obj.css("background-position") || "0px 0px").split(/ /), 2 != pos.length)return;
                if (x = pos[0].match(/^((-?\d+)\s*px|0+\s*%|left)$/), y = pos[1].match(/^((-?\d+)\s*px|0+\s*%|top)$/), !x || !y)return;
                a.originX = a.startX = x[2] || 0, a.originY = a.startY = y[2] || 0
            } else {
                var r = a.obj.position();
                a.obj.css({top: r.top, left: r.left, right: "", bottom: ""}), a.originX = a.startX = r.left, a.originY = a.startY = r.top
            }
            a.startX -= a.inversionFactor * Math.floor(a.xRange / 2), a.startY -= a.inversionFactor * Math.floor(a.yRange / 2), n >= 0 ? o.splice(n, 1, a) : o.push(a)
        })
    }, t.plax = {enable: function (n) {
        n && (n.activityTarget && (c = n.activityTarget || t(window)), "number" == typeof n.gyroRange && n.gyroRange > 0 && (l = n.gyroRange)), t(document).bind("mousemove.plax", function (t) {
            a(t)
        }), e() && (window.ondeviceorientation = function (t) {
            a(t)
        })
    }, disable: function (e) {
        if (t(document).unbind("mousemove.plax"), window.ondeviceorientation = void 0, e && "boolean" == typeof e.restorePositions && e.restorePositions)for (var n = o.length; n--;)layer = o[n], o[n].background ? layer.obj.css("background-position", layer.originX + "px " + layer.originY + "px") : layer.obj.css("left", layer.originX).css("top", layer.originY);
        e && "boolean" == typeof e.clearLayers && e.clearLayers && (o = [])
    }}, "undefined" != typeof ender && t.ender(t.fn, !0)
}(function () {
        return"undefined" != typeof jQuery ? jQuery : ender
    }()), function () {
    $.pageUpdate(function () {
        var t, e, n, a;
        if (e = $(".js-plaxify"), e.length > 0) {
            for (n = 0, a = e.length; a > n; n++)t = e[n], $(t).plaxify({xRange: $(t).data("xrange") || 0, yRange: $(t).data("yrange") || 0, invert: $(t).data("invert") || !1});
            return $.plax.enable()
        }
    })
}.call(this), function () {
    var t;
    t = function (t) {
        var e;
        if (!$(t).data("poller"))return e = $.ajaxPoll({context: t, url: $(t).attr("data-url")}), e.always(function () {
            return $(t).removeData("poller")
        }), $(t).data("poller", e)
    }, $.pageUpdate(function () {
        var e, n, a, i;
        for (i = $(this).find(".js-poll"), n = 0, a = i.length; a > n; n++)e = i[n], t(e)
    })
}.call(this), function () {
    $(function () {
        return $(document.body).hasClass("js-print-popup") ? (window.print(), SetTimeout(window.close, 1e3)) : void 0
    })
}.call(this), function () {
    $(document).on("focusin", ".js-repo-filter .js-filterable-field", function () {
        return $(this).closest(".js-repo-filter").find(".js-more-repos-link").click()
    }), $(document).on("click", ".js-repo-filter .js-repo-filter-tab", function () {
        var t;
        return t = $(this).closest(".js-repo-filter"), t.find(".js-more-repos-link").click(), t.find(".js-repo-filter-tab").removeClass("filter-selected"), $(this).addClass("filter-selected"), t.find(".js-filterable-field").fire("filterable:change"), !1
    }), $(document).on("filterable:change", ".js-repo-filter .js-repo-list", function () {
        var t, e;
        t = $(this).closest(".js-repo-filter"), (e = t.find(".js-repo-filter-tab.filter-selected").attr("data-filter")) && $(this).children().not(e).hide()
    }), $(document).on("click:prepare", ".js-repo-filter .js-more-repos-link", function () {
        return $(this).hasClass("is-loading") ? !1 : void 0
    }), $(document).on("ajaxSend", ".js-repo-filter .js-more-repos-link", function () {
        return $(this).addClass("is-loading")
    }), $(document).on("ajaxComplete", ".js-repo-filter .js-more-repos-link", function () {
        return $(this).removeClass("is-loading")
    }), $(document).on("ajaxSuccess", ".js-repo-filter .js-more-repos-link", function (t, e, n, a) {
        var i;
        return i = $(this).closest(".js-repo-filter"), i.find(".js-repo-list").html(a).pageUpdate(), i.find(".js-filterable-field").fire("filterable:change"), $(this).remove()
    })
}.call(this), function () {
    var t;
    $(function () {
        return $(".js-target-repo-menu")[0] ? $(".js-owner-select").trigger("change") : void 0
    }), $(document).on("change", ".js-owner-select", function () {
        var t, e, n, a;
        return n = $(this).parents(".js-repo-selector"), a = $(this).find(".selected input").val(), t = $(n).find(".js-target-repo-menu"), e = $(n).find(".js-target-repo-menu[data-owner='" + a + "']"), t.removeClass("owner-is-active"), e.addClass("owner-is-active")
    }), $(document).on("click", ".js-repo-selector-add", function (e) {
        var n, a, i;
        return e.preventDefault(), i = $(this).parents(".js-repo-selector"), n = $(i).find(".js-owner-select").find(".selected .js-select-button-text").text().trim(), a = $(i).find(".js-target-repo-menu.owner-is-active").find(".selected .js-select-button-text").text().trim(), n.length && a.length ? t(i, n, a) : void 0
    }), $(document).on("click", ".js-repo-entry-remove", function (t) {
        var e;
        return e = $(this).parents(".js-repo-selector"), $(this).parents(".js-repo-entry").remove(), 0 === $(e).find(".js-repo-entry:visible").length && $(e).find(".js-repo-select-blank").removeClass("hidden"), t.preventDefault()
    }), t = function (t, e, n) {
        var a;
        return a = $(t).find(".js-repo-entry-template").clone().removeClass("hidden js-repo-entry-template"), a.find(".js-entry-owner").text(e), a.find(".js-entry-repo").text(n), $(t).find(".js-repo-entry-list").append(a), $(t).find(".js-repo-select-blank").addClass("hidden")
    }
}.call(this), function () {
    $(document).on("ajaxSuccess", ".js-select-menu:not([data-multiple])", function () {
        return $(this).menu("deactivate")
    }), $(document).on("ajaxSend", ".js-select-menu:not([data-multiple])", function () {
        return $(this).addClass("is-loading")
    }), $(document).on("ajaxComplete", ".js-select-menu", function () {
        return $(this).removeClass("is-loading")
    }), $(document).on("ajaxError", ".js-select-menu", function () {
        return $(this).addClass("has-error")
    }), $(document).on("menu:deactivate", ".js-select-menu", function () {
        return $(this).removeClass("is-loading has-error")
    })
}.call(this), function () {
    $(document).on("selectmenu:selected", ".js-select-menu .js-navigation-item", function () {
        var t, e, n;
        return t = $(this).closest(".js-select-menu"), n = $(this).find(".js-select-button-text"), n[0] && t.find(".js-select-button").html(n.html()), e = $(this).find(".js-select-menu-item-gravatar"), n[0] ? t.find(".js-select-button-gravatar").html(e.html()) : void 0
    })
}.call(this), function () {
    $(document).on("selectmenu:change", ".js-select-menu .select-menu-list", function (t) {
        var e, n;
        n = $(this).find(".js-navigation-item"), n.removeClass("last-visible"), n.filter(":visible:last").addClass("last-visible"), $(this).is("[data-filterable-for]") || (e = $(t.target).hasClass("filterable-empty"), $(this).toggleClass("filterable-empty", e))
    })
}.call(this), function () {
    $(document).on("menu:activated", ".js-select-menu", function () {
        return $(this).find(".js-filterable-field").focus()
    }), $(document).on("menu:deactivate", ".js-select-menu", function () {
        return $(this).find(".js-filterable-field").val("").trigger("filterable:change")
    })
}.call(this), function () {
    $(document).on("navigation:open", ".js-select-menu:not([data-multiple]) .js-navigation-item", function () {
        var t, e;
        return e = $(this), t = e.closest(".js-select-menu"), t.find(".js-navigation-item.selected").removeClass("selected"), e.addClass("selected"), e.find("input[type=radio], input[type=checkbox]").prop("checked", !0).change(), e.fire("selectmenu:selected"), t.hasClass("is-loading") ? void 0 : t.menu("deactivate")
    }), $(document).on("navigation:open", ".js-select-menu[data-multiple] .js-navigation-item", function () {
        var t, e;
        return t = $(this), e = t.hasClass("selected"), t.toggleClass("selected", !e), t.find("input[type=radio], input[type=checkbox]").prop("checked", !e).change(), t.fire("selectmenu:selected")
    })
}.call(this), function () {
    $(document).on("menu:activate", ".js-select-menu", function () {
        return $(this).find(":focus").blur(), $(this).find(".js-menu-target").addClass("selected"), $(this).find(".js-navigation-container").navigation("push")
    }), $(document).on("menu:deactivate", ".js-select-menu", function () {
        return $(this).find(".js-menu-target").removeClass("selected"), $(this).find(".js-navigation-container").navigation("pop")
    }), $(document).on("filterable:change", ".js-select-menu .select-menu-list", function () {
        return $(this).navigation("refocus")
    })
}.call(this), function () {
    var t;
    $(document).on("filterable:change", ".js-select-menu .select-menu-list", function (e) {
        var n, a;
        (a = $(this).find(".js-new-item-form")[0]) && (n = e.relatedTarget.value, "" === n || t(this, n) ? $(this).removeClass("is-showing-new-item-form") : ($(this).addClass("is-showing-new-item-form"), $(a).find(".js-new-item-name").text(n), $(a).find(".js-new-item-value").val(n))), $(e.target).trigger("selectmenu:change")
    }), t = function (t, e) {
        var n, a, i, s, r;
        for (r = $(t).find(".js-select-button-text"), i = 0, s = r.length; s > i; i++)if (n = r[i], a = $.trim($(n).text().toLowerCase()), a === e.toLowerCase())return!0;
        return!1
    }
}.call(this), function () {
    var t;
    $(document).on("menu:activate", ".js-select-menu", function () {
        var e;
        return e = $(this).find(".js-select-menu-tab-bucket .selected").closest(".js-select-menu-tab-bucket").attr("data-tab-filter"), t($(this), e)
    }), $(document).on("click", ".js-select-menu .js-select-menu-tab", function () {
        var e;
        return(e = $(this).attr("data-tab-filter")) && t($(this).closest(".js-select-menu"), e), !1
    }), t = function (t, e) {
        var n, a, i;
        return t.find("[data-tab-filter]").removeClass("selected"), e ? (n = function () {
            return $(this).attr("data-tab-filter") === e
        }, a = t.find(".js-select-menu-tab").filter(n), i = t.find(".js-select-menu-tab-bucket").filter(n)) : (a = t.find(".js-select-menu-tab:first"), i = t.find(".js-select-menu-tab-bucket:first")), a.addClass("selected"), i.addClass("selected"), t.find(".js-filterable-field").trigger("filterable:change")
    }
}.call(this), function () {
    $(document).on("ajaxSuccess", ".js-social-container", function (t, e, n, a) {
        return $(this).find(".js-social-count").text(a.count)
    })
}.call(this), function () {
}.call(this), function () {
    $.fn.socket && $(document).on("visibilitychange webkitvisibilitychange mozvisibilitychange msvisibilitychange", function () {
        var t;
        (t = $(document.head).find("link[rel=xhr-socket]").data("socket")) && (document.hidden || document.webkitHidden || document.mozHidden || document.msHidden ? t.send({visibility: "hidden"}) : t.send({visibility: "visible"}))
    })
}.call(this), function () {
    var t;
    t = function () {
        function t() {
            var e = this;
            this.onMouseMove = function () {
                return t.prototype.onMouseMove.apply(e, arguments)
            }, this.onMouseUp = function () {
                return t.prototype.onMouseUp.apply(e, arguments)
            }, this.onMouseDown = function () {
                return t.prototype.onMouseDown.apply(e, arguments)
            }, $(document).on("mousedown", ".js-sortable-container .js-sortable-target", this.onMouseDown)
        }

        var e;
        return e = $("<li />").addClass("js-sortable-placeholder sortable-placeholder"), t.prototype.onMouseDown = function (t) {
            return $(t.currentTarget).addClass("js-sorting").fadeTo(0, .5).css({"z-index": 10, position: "absolute", top: $(t.currentTarget).position().top, left: $(t.currentTarget).position().left}).after(e), $(document).on("mousemove.sortable", this.onMouseMove), $(document).on("mouseup", this.onMouseUp), !1
        }, t.prototype.onMouseUp = function () {
            return $(".js-sorting").removeClass("js-sorting").fadeTo(0, 1).css({"z-index": "", position: "", top: "", left: ""}), $(".js-sortable-placeholder").remove(), $(document).off("mousemove.sortable", this.onMouseMove), $(document).off("mouseup", this.onMouseUp), !1
        }, t.prototype.onMouseMove = function (t) {
            var e, n, a;
            return e = $(".js-sorting"), a = t.pageY - e.parent().offset().top, n = $(".js-sorting").height(), 0 + n / 2 > a ? $(".js-sorting").css({top: 0}) : a > e.parent().height() - n / 2 ? $(".js-sorting").css({top: e.parent().height() - e.height()}) : $(".js-sorting").css({top: a - n / 2}), $(".js-sorting").index() < e.parent().find(".js-sortable-target").length && $(".js-sorting").index() >= 0 && ($(".js-sorting").position().top > $(".js-sortable-placeholder").position().top + .8 * n ? ($(".js-sortable-placeholder").insertAfter($(".js-sortable-placeholder").next()), $(".js-sorting").insertBefore($(".js-sortable-placeholder"))) : $(".js-sorting").position().top < $(".js-sortable-placeholder").position().top - .8 * n && ($(".js-sortable-placeholder").insertBefore($(".js-sortable-placeholder").prev().prev()), $(".js-sorting").insertBefore($(".js-sortable-placeholder")))), !1
        }, t
    }(), new t
}.call(this), function () {
    var t;
    t = function () {
        function t(e) {
            var n = this;
            this.textarea = e, this.onNavigationOpen = function () {
                return t.prototype.onNavigationOpen.apply(n, arguments)
            }, this.onNavigationKeyDown = function () {
                return t.prototype.onNavigationKeyDown.apply(n, arguments)
            }, this.onKeyUp = function () {
                return t.prototype.onKeyUp.apply(n, arguments)
            }, this.teardown = function () {
                return t.prototype.teardown.apply(n, arguments)
            }, $(this.textarea).on("focusout:delayed.suggester", this.teardown), $(this.textarea).on("keyup.suggester", this.onKeyUp), this.suggester = document.getElementById($(this.textarea).attr("data-suggester")), $(this.suggester).on("navigation:keydown.suggester", "[data-value]", this.onNavigationKeyDown), $(this.suggester).on("navigation:open.suggester", "[data-value]", this.onNavigationOpen), this.loadSuggestions()
        }

        var e;
        return t.prototype.types = {mention: {search: "fuzzy", limit: 5, className: "mention-suggestions", match: /(^|\s)@([a-z0-9\-_\/]*)$/i, replace: "$1@$value "}, emoji: {search: "prefix", limit: 5, className: "emoji-suggestions", match: /(^|\s):([a-z0-9\-\+_]*)$/i, replace: "$1:$value: "}, hashed: {search: "fuzzy-hashed", limit: 5, className: "hashed-suggestions", match: /(^|\s)\#([a-z0-9\-_\/]*)$/i, replace: "$1#$value "}}, e = function (t) {
            var e, n;
            return(null != (e = t.match(/`{3,}/g)) ? e.length : void 0) % 2 ? !0 : (null != (n = t.match(/`/g)) ? n.length : void 0) % 2 ? !0 : void 0
        }, t.prototype.teardown = function () {
            this.deactivate(), $(this.textarea).off(".suggester"), $(this.suggester).off(".suggester")
        }, t.prototype.onKeyUp = function () {
            return this.checkQuery() ? !1 : void 0
        }, t.prototype.onNavigationKeyDown = function (t) {
            switch (t.hotkey) {
                case"tab":
                    return this.onNavigationOpen(t), !1;
                case"esc":
                    return this.deactivate(), !1
            }
        }, t.prototype.onNavigationOpen = function (t) {
            var e, n, a;
            return a = $(t.target).attr("data-value"), n = this.textarea.value.substring(0, this.textarea.selectionEnd), e = this.textarea.value.substring(this.textarea.selectionEnd), n = n.replace(this.type.match, this.type.replace.replace("$value", a)), this.textarea.value = n + e, this.deactivate(), this.textarea.focus(), this.textarea.selectionStart = n.length, this.textarea.selectionEnd = n.length, !1
        }, t.prototype.checkQuery = function () {
            var t, e, n;
            if (n = this.searchQuery(), e = n[0], t = n[1], null != e && null != t) {
                if (t === this.query)return;
                return this.type = e, this.query = t, this.search(e, t) ? this.activate() : this.deactivate(), this.query
            }
            this.type = this.query = null, this.deactivate()
        }, t.prototype.activate = function () {
            $(this.suggester).hasClass("active") || ($(this.suggester).addClass("active"), $(this.suggester).css($(this.textarea).textareaSelectionPosition()), $(this.textarea).addClass("js-navigation-enable"), $(this.suggester).navigation("push"), $(this.suggester).navigation("focus"))
        }, t.prototype.deactivate = function () {
            $(this.suggester).hasClass("active") && ($(this.suggester).removeClass("active"), $(this.suggester).find(".suggestions").hide(), $(this.textarea).removeClass("js-navigation-enable"), $(this.suggester).navigation("pop"))
        }, t.prototype.search = function (t, e) {
            var n, a;
            return n = $(this.suggester).find("ul." + t.className), n[0] ? (a = function () {
                switch (t.search) {
                    case"fuzzy-hashed":
                        return n.fuzzyFilterSortList("#" + e, {limit: t.limit});
                    case"fuzzy":
                        return n.fuzzyFilterSortList(e, {limit: t.limit});
                    default:
                        return n.prefixFilterList(e, {limit: t.limit})
                }
            }(), a > 0 ? (n.show(), $(this.suggester).navigation("focus"), !0) : !1) : void 0
        }, t.prototype.searchQuery = function () {
            var t, n, a, i, s;
            if (a = this.textarea.value.substring(0, this.textarea.selectionEnd), e(a))return[];
            s = this.types;
            for (n in s)if (i = s[n], t = a.match(i.match))return[i, t[2]];
            return[]
        }, t.prototype.loadSuggestions = function () {
            var t = this;
            if (!$(this.suggester).children().length)return $.ajax({url: $(this.suggester).attr("data-url"), success: function (e) {
                return $(t.suggester).html(e), t.type = t.query = null, t.checkQuery()
            }})
        }, t
    }(), $(document).on("focusin:delayed", "textarea[data-suggester]", function () {
        new t(this)
    })
}.call(this), function () {
    $(document).on("tasklist:change", ".js-task-list-container", function () {
        return $(this).addClass("is-updating-task-list").taskList("disable")
    }), $(document).on("tasklist:changed", ".js-task-list-container", function (t, e, n) {
        var a, i, s, r;
        return i = $(this).find("form.js-comment-update"), s = i.find("input[name=task_list_key]"), s.length > 0 || (r = i.find(".js-task-list-field").attr("name").split("[")[0], s = $("<input>", {type: "hidden", name: "task_list_key", value: r}), i.append(s)), a = $("<input>", {type: "hidden", name: "task_list_checked", value: null != n ? n : {1: "0"}}), i.append(a), i.one("ajaxComplete", function () {
            return a.remove()
        }), i.submit()
    }), $(document).on("ajaxSuccess", ".js-task-list-container", function (t) {
        return $(t.target).is("form.js-comment-update") ? ($(this).removeClass("is-updating-task-list"), $(this).taskList("enable")) : void 0
    }), $.pageUpdate(function () {
        return $(this).find(".js-task-list-container:not(.is-updating-task-list)").taskList("enable")
    })
}.call(this), function (t) {
    var e = function () {
        "use strict";
        var t = "s", n = function (t) {
            var e = -t.getTimezoneOffset();
            return null !== e ? e : 0
        }, a = function (t, e, n) {
            var a = new Date;
            return void 0 !== t && a.setFullYear(t), a.setMonth(e), a.setDate(n), a
        }, i = function (t) {
            return n(a(t, 0, 2))
        }, s = function (t) {
            return n(a(t, 5, 2))
        }, r = function (t) {
            var e = t.getMonth() > 7, a = e ? s(t.getFullYear()) : i(t.getFullYear()), r = n(t), o = 0 > a, c = a - r;
            return o || e ? 0 !== c : 0 > c
        }, o = function () {
            var e = i(), n = s(), a = e - n;
            return 0 > a ? e + ",1" : a > 0 ? n + ",1," + t : e + ",0"
        }, c = function () {
            var t = o();
            return new e.TimeZone(e.olson.timezones[t])
        }, l = function (t) {
            var e = new Date(2010, 6, 15, 1, 0, 0, 0), n = {"America/Denver": new Date(2011, 2, 13, 3, 0, 0, 0), "America/Mazatlan": new Date(2011, 3, 3, 3, 0, 0, 0), "America/Chicago": new Date(2011, 2, 13, 3, 0, 0, 0), "America/Mexico_City": new Date(2011, 3, 3, 3, 0, 0, 0), "America/Asuncion": new Date(2012, 9, 7, 3, 0, 0, 0), "America/Santiago": new Date(2012, 9, 3, 3, 0, 0, 0), "America/Campo_Grande": new Date(2012, 9, 21, 5, 0, 0, 0), "America/Montevideo": new Date(2011, 9, 2, 3, 0, 0, 0), "America/Sao_Paulo": new Date(2011, 9, 16, 5, 0, 0, 0), "America/Los_Angeles": new Date(2011, 2, 13, 8, 0, 0, 0), "America/Santa_Isabel": new Date(2011, 3, 5, 8, 0, 0, 0), "America/Havana": new Date(2012, 2, 10, 2, 0, 0, 0), "America/New_York": new Date(2012, 2, 10, 7, 0, 0, 0), "Europe/Helsinki": new Date(2013, 2, 31, 5, 0, 0, 0), "Pacific/Auckland": new Date(2011, 8, 26, 7, 0, 0, 0), "America/Halifax": new Date(2011, 2, 13, 6, 0, 0, 0), "America/Goose_Bay": new Date(2011, 2, 13, 2, 1, 0, 0), "America/Miquelon": new Date(2011, 2, 13, 5, 0, 0, 0), "America/Godthab": new Date(2011, 2, 27, 1, 0, 0, 0), "Europe/Moscow": e, "Asia/Amman": new Date(2013, 2, 29, 1, 0, 0, 0), "Asia/Beirut": new Date(2013, 2, 31, 2, 0, 0, 0), "Asia/Damascus": new Date(2013, 3, 6, 2, 0, 0, 0), "Asia/Jerusalem": new Date(2013, 2, 29, 5, 0, 0, 0), "Asia/Yekaterinburg": e, "Asia/Omsk": e, "Asia/Krasnoyarsk": e, "Asia/Irkutsk": e, "Asia/Yakutsk": e, "Asia/Vladivostok": e, "Asia/Baku": new Date(2013, 2, 31, 4, 0, 0), "Asia/Yerevan": new Date(2013, 2, 31, 3, 0, 0), "Asia/Kamchatka": e, "Asia/Gaza": new Date(2010, 2, 27, 4, 0, 0), "Africa/Cairo": new Date(2010, 4, 1, 3, 0, 0), "Europe/Minsk": e, "Pacific/Apia": new Date(2010, 10, 1, 1, 0, 0, 0), "Pacific/Fiji": new Date(2010, 11, 1, 0, 0, 0), "Australia/Perth": new Date(2008, 10, 1, 1, 0, 0, 0)};
            return n[t]
        };
        return{determine: c, date_is_dst: r, dst_start_for: l}
    }();
    e.TimeZone = function (t) {
        "use strict";
        var n = {"America/Denver": ["America/Denver", "America/Mazatlan"], "America/Chicago": ["America/Chicago", "America/Mexico_City"], "America/Santiago": ["America/Santiago", "America/Asuncion", "America/Campo_Grande"], "America/Montevideo": ["America/Montevideo", "America/Sao_Paulo"], "Asia/Beirut": ["Asia/Amman", "Asia/Jerusalem", "Asia/Beirut", "Europe/Helsinki", "Asia/Damascus"], "Pacific/Auckland": ["Pacific/Auckland", "Pacific/Fiji"], "America/Los_Angeles": ["America/Los_Angeles", "America/Santa_Isabel"], "America/New_York": ["America/Havana", "America/New_York"], "America/Halifax": ["America/Goose_Bay", "America/Halifax"], "America/Godthab": ["America/Miquelon", "America/Godthab"], "Asia/Dubai": ["Europe/Moscow"], "Asia/Dhaka": ["Asia/Yekaterinburg"], "Asia/Jakarta": ["Asia/Omsk"], "Asia/Shanghai": ["Asia/Krasnoyarsk", "Australia/Perth"], "Asia/Tokyo": ["Asia/Irkutsk"], "Australia/Brisbane": ["Asia/Yakutsk"], "Pacific/Noumea": ["Asia/Vladivostok"], "Pacific/Tarawa": ["Asia/Kamchatka", "Pacific/Fiji"], "Pacific/Tongatapu": ["Pacific/Apia"], "Asia/Baghdad": ["Europe/Minsk"], "Asia/Baku": ["Asia/Yerevan", "Asia/Baku"], "Africa/Johannesburg": ["Asia/Gaza", "Africa/Cairo"]}, a = t, i = function () {
            for (var t = n[a], i = t.length, s = 0, r = t[0]; i > s; s += 1)if (r = t[s], e.date_is_dst(e.dst_start_for(r)))return a = r, void 0
        }, s = function () {
            return"undefined" != typeof n[a]
        };
        return s() && i(), {name: function () {
            return a
        }}
    }, e.olson = {}, e.olson.timezones = {"-720,0": "Pacific/Majuro", "-660,0": "Pacific/Pago_Pago", "-600,1": "America/Adak", "-600,0": "Pacific/Honolulu", "-570,0": "Pacific/Marquesas", "-540,0": "Pacific/Gambier", "-540,1": "America/Anchorage", "-480,1": "America/Los_Angeles", "-480,0": "Pacific/Pitcairn", "-420,0": "America/Phoenix", "-420,1": "America/Denver", "-360,0": "America/Guatemala", "-360,1": "America/Chicago", "-360,1,s": "Pacific/Easter", "-300,0": "America/Bogota", "-300,1": "America/New_York", "-270,0": "America/Caracas", "-240,1": "America/Halifax", "-240,0": "America/Santo_Domingo", "-240,1,s": "America/Santiago", "-210,1": "America/St_Johns", "-180,1": "America/Godthab", "-180,0": "America/Argentina/Buenos_Aires", "-180,1,s": "America/Montevideo", "-120,0": "America/Noronha", "-120,1": "America/Noronha", "-60,1": "Atlantic/Azores", "-60,0": "Atlantic/Cape_Verde", "0,0": "UTC", "0,1": "Europe/London", "60,1": "Europe/Berlin", "60,0": "Africa/Lagos", "60,1,s": "Africa/Windhoek", "120,1": "Asia/Beirut", "120,0": "Africa/Johannesburg", "180,0": "Asia/Baghdad", "180,1": "Europe/Moscow", "210,1": "Asia/Tehran", "240,0": "Asia/Dubai", "240,1": "Asia/Baku", "270,0": "Asia/Kabul", "300,1": "Asia/Yekaterinburg", "300,0": "Asia/Karachi", "330,0": "Asia/Kolkata", "345,0": "Asia/Kathmandu", "360,0": "Asia/Dhaka", "360,1": "Asia/Omsk", "390,0": "Asia/Rangoon", "420,1": "Asia/Krasnoyarsk", "420,0": "Asia/Jakarta", "480,0": "Asia/Shanghai", "480,1": "Asia/Irkutsk", "525,0": "Australia/Eucla", "525,1,s": "Australia/Eucla", "540,1": "Asia/Yakutsk", "540,0": "Asia/Tokyo", "570,0": "Australia/Darwin", "570,1,s": "Australia/Adelaide", "600,0": "Australia/Brisbane", "600,1": "Asia/Vladivostok", "600,1,s": "Australia/Sydney", "630,1,s": "Australia/Lord_Howe", "660,1": "Asia/Kamchatka", "660,0": "Pacific/Noumea", "690,0": "Pacific/Norfolk", "720,1,s": "Pacific/Auckland", "720,0": "Pacific/Tarawa", "765,1,s": "Pacific/Chatham", "780,0": "Pacific/Tongatapu", "780,1,s": "Pacific/Apia", "840,0": "Pacific/Kiritimati"}, "undefined" != typeof exports ? exports.jstz = e : t.jstz = e
}(this), function () {
    var t, e;
    e = jstz.determine().name(), "https:" === location.protocol && (t = "secure"), document.cookie = "tz=" + encodeURIComponent(e) + "; path=/; " + t
}.call(this), function () {
    var t;
    null != (null != (t = window.performance) ? t.timing : void 0) && $(window).on("load", function () {
        return setTimeout(function () {
            var t, e, n, a;
            e = {}, a = window.performance.timing;
            for (t in a)n = a[t], "number" == typeof n && (e[t] = n);
            return $.ajax({url: "/_stats", type: "POST", data: {timing: e}})
        }, 0)
    })
}.call(this), function () {
    var t;
    $.pageUpdate(t = function () {
        var t, e, n, a, i, s;
        for (s = $(this).find(".tooltipped"), a = 0, i = s.length; i > a; a++)e = s[a], t = $(e), n = t.hasClass("downwards") ? "n" : "s", n = t.hasClass("rightwards") ? "w" : n, n = t.hasClass("leftwards") ? "e" : n, n = t.hasClass("downandright") ? "nw" : n, t.tipsy({gravity: n});
        return $(this).tipsy.revalidate()
    })
}.call(this), function () {
    var t;
    t = function () {
        function t() {
            var e = this;
            this.onToggle = function () {
                return t.prototype.onToggle.apply(e, arguments)
            }, this.onError = function () {
                return t.prototype.onError.apply(e, arguments)
            }, this.onSuccess = function () {
                return t.prototype.onSuccess.apply(e, arguments)
            }, this.onComplete = function () {
                return t.prototype.onComplete.apply(e, arguments)
            }, this.onBeforeSend = function () {
                return t.prototype.onBeforeSend.apply(e, arguments)
            }, this.onClick = function () {
                return t.prototype.onClick.apply(e, arguments)
            }, $(document).on("click", ".js-toggler-container .js-toggler-target", this.onClick), $(document).on("ajaxBeforeSend", ".js-toggler-container", this.onBeforeSend), $(document).on("ajaxComplete", ".js-toggler-container", this.onComplete), $(document).on("ajaxSuccess", ".js-toggler-container", this.onSuccess), $(document).on("ajaxError", ".js-toggler-container", this.onError), $(document).on("toggler:toggle", ".js-toggler-container", this.onToggle)
        }

        return t.prototype.onClick = function (t) {
            return $(t.target).trigger("toggler:toggle"), !1
        }, t.prototype.onBeforeSend = function (t) {
            var e;
            return e = t.currentTarget, $(e).removeClass("success error"), $(e).addClass("loading")
        }, t.prototype.onComplete = function (t) {
            return $(t.currentTarget).removeClass("loading")
        }, t.prototype.onSuccess = function (t) {
            return $(t.currentTarget).addClass("success")
        }, t.prototype.onError = function (t) {
            return $(t.currentTarget).addClass("error")
        }, t.prototype.onToggle = function (t) {
            var e;
            return e = t.currentTarget, $(e).toggleClass("on")
        }, t
    }(), new t
}.call(this), function () {
    var t;
    t = function (t, e, n) {
        var a, i;
        return null == n && (n = !0), i = $.Deferred(), a = $(t), $.preserveInteractivePosition(function () {
            n && a.hasInteractions() ? i.rejectWith(a) : i.resolveWith(a.replaceContent(e))
        }), i.promise()
    }, $.fn.updateContent = function (e, n) {
        var a, i;
        return null == n && (n = {}), (a = this.data("update-content")) ? a : (e ? (null != (i = this.data("xhr")) && i.abort(), a = t(this, e, !1)) : a = this.ajax({channel: n.channel}).then(function (e) {
            return t(this, e, !0)
        }), this.data("update-content", a), a.always(function () {
            return $(this).removeData("update-content")
        }), a)
    }, $(document).on("socket:message", ".js-updatable-content", function (t, e, n) {
        this === t.target && $(this).updateContent(null, {channel: n})
    })
}.call(this), function () {
    var t, e, n, a, i, s, r, o, c, l, u, d, h, f, m, p, g, v, y, b, j, x, w, C, k = [].indexOf || function (t) {
        for (var e = 0, n = this.length; n > e; e++)if (e in this && this[e] === t)return e;
        return-1
    }, _ = {}.hasOwnProperty, S = function (t, e) {
        function n() {
            this.constructor = t
        }

        for (var a in e)_.call(e, a) && (t[a] = e[a]);
        return n.prototype = e.prototype, t.prototype = new n, t.__super__ = e.prototype, t
    };
    s = function () {
        function t() {
            this.uploads = [], this.busy = !1
        }

        return t.prototype.upload = function (t, e) {
            var n, a, i, s;
            return s = e.start || function () {
            }, i = e.progress || function () {
            }, n = e.complete || function () {
            }, a = e.error || function () {
            }, this.uploads.push({file: t, to: e.to, form: e.form || {}, start: s, progress: i, complete: n, error: a}), this.process()
        }, t.prototype.process = function () {
            var t, e, n, a, i, s, r = this;
            if (!this.busy && 0 !== this.uploads.length) {
                n = this.uploads.shift(), this.busy = !0, i = new XMLHttpRequest, i.open("POST", n.to, !0), i.setRequestHeader("X-CSRF-Token", this.token()), i.onloadstart = function () {
                    return n.start()
                }, i.onreadystatechange = function () {
                    var t;
                    return 4 === i.readyState ? (204 === i.status ? (t = i.getResponseHeader("Location"), n.complete({href: t})) : 201 === i.status ? n.complete(JSON.parse(i.responseText)) : n.error(), r.busy = !1, r.process()) : void 0
                }, i.onerror = function () {
                    return n.error()
                }, i.upload.onprogress = function (t) {
                    var e;
                    return t.lengthComputable ? (e = Math.round(100 * (t.loaded / t.total)), n.progress(e)) : void 0
                }, t = new FormData, s = n.form;
                for (e in s)a = s[e], t.append(e, a);
                return t.append("file", n.file), i.send(t)
            }
        }, t.prototype.token = function () {
            return $('meta[name="csrf-token"]').attr("content")
        }, t
    }(), i = function () {
        function t(e) {
            var n = this;
            this.container = e, this.available = function () {
                return t.prototype.available.apply(n, arguments)
            }, this.model = $(e).data("model"), this.policyUrl = "/upload/policies/" + this.model
        }

        var e, n, a;
        return n = ["image/gif", "image/png", "image/jpeg"], e = ["gif", "png", "jpg", "jpeg"], t.prototype.available = function () {
            return this.field && null != this.field[0]
        }, t.prototype.okToUpload = function (t) {
            return this.acceptableSize(t) && a(t.type)
        }, t.prototype.acceptableSize = function (t) {
            return t.size < 5242880
        }, t.prototype.setup = function (t) {
            return t()
        }, t.prototype.start = function () {
        }, t.prototype.progress = function () {
        }, t.prototype.complete = function () {
        }, t.prototype.error = function () {
        }, t.prototype.acceptsExtension = function (t) {
            var n;
            return n = t.split(".").pop(), k.call(e, n) >= 0
        }, a = function (t) {
            return k.call(n, t) >= 0
        }, t
    }(), n = function (t) {
        function e(t) {
            var n = this;
            this.container = t, this.complete = function () {
                return e.prototype.complete.apply(n, arguments)
            }, e.__super__.constructor.call(this, t), this.field = $(t).siblings("ul.js-releases-field"), this.li = this.field.find("li.js-template"), this.meter = $(t).find(".js-upload-meter")
        }

        var n, a, i;
        return S(e, t), e.prototype.setup = function (t) {
            return $("#release_id").val() ? t() : $("button.js-save-draft").trigger("click", t)
        }, e.prototype.start = function () {
            return this.meter.show()
        }, e.prototype.progress = function (t) {
            return this.meter.css("width", t + "%")
        }, e.prototype.complete = function (t) {
            var e, n, a;
            return n = this.li.clone(), n.removeClass("template"), n.removeClass("js-template"), e = t.asset.name || t.asset.href.split("/").pop(), n.find(".filename").val(e), t.asset.size ? (a = (t.asset.size / 1048576).toFixed(2), n.find(".filesize").text("(" + a + "MB)")) : n.find(".filesize").text(""), n.find("input[type=hidden].url").val(t.asset.href), n.find("input[type=hidden].id").val(t.asset.id), this.field.append(n), this.field.addClass("is-populated"), this.meter.hide()
        }, e.prototype.okToUpload = function (t) {
            return this.acceptsExtension(t.name)
        }, i = ["app"], e.prototype.acceptsExtension = function (t) {
            var e;
            return e = t.split(".").pop(), k.call(i, e) >= 0 ? (g(this.container), this.container.addClass("is-bad-file"), !1) : !0
        }, n = function () {
            return!0
        }, a = function () {
            return!0
        }, e
    }(i), t = function (t) {
        function e(t) {
            var n = this;
            this.container = t, this.complete = function () {
                return e.prototype.complete.apply(n, arguments)
            }, e.__super__.constructor.call(this, t), this.field = $(t).find("img.js-image-field"), this.input = $(t).find("input.js-oauth-application-logo-id")
        }

        return S(e, t), e.prototype.complete = function (t) {
            return this.field.attr("src", t.asset.href), this.input.val(t.asset.id), this.container.addClass("has-uploaded-logo")
        }, e
    }(i), a = function (t) {
        function e(t) {
            var n = this;
            this.container = t, this.complete = function () {
                return e.prototype.complete.apply(n, arguments)
            }, e.__super__.constructor.call(this, t), this.field = $(t).find("img.js-showcase-image-field"), this.input = $(t).find("input.js-showcase-asset-id")
        }

        return S(e, t), e.prototype.complete = function (t) {
            return this.field.attr("src", t.asset.href), this.field.removeClass("hide"), this.container.find(".js-showcase-asset-placeholder").addClass("hide"), this.input.val(t.asset.id)
        }, e
    }(i), e = function (t) {
        function e(t) {
            var n = this;
            this.container = t, this.error = function () {
                return e.prototype.error.apply(n, arguments)
            }, this.complete = function () {
                return e.prototype.complete.apply(n, arguments)
            }, this.start = function () {
                return e.prototype.start.apply(n, arguments)
            }, e.__super__.constructor.call(this, t), this.field = $(t).find("textarea.js-comment-field")
        }

        var n, a, i, s, r;
        return S(e, t), i = function (t) {
            return t.toLowerCase().replace(/[^a-z0-9\-_]+/gi, ".").replace(/\.{2,}/g, ".").replace(/^\.|\.$/gi, "")
        }, s = function (t) {
            return"![Uploading " + t + " . . .]()"
        }, n = function (t) {
            return i(t).replace(/(.*)\.[^.]+$/, "$1").replace(/\./g, " ")
        }, a = function (t, e) {
            var n, a, i, s;
            return i = t.selectionEnd, n = t.value.substring(0, i), s = t.value.substring(i), a = "" === t.value || n.match(/\n$/) ? "" : "\n", t.value = n + a + e + s, t.selectionStart = i + e.length, t.selectionEnd = i + e.length
        }, r = function (t, e, n) {
            var a, i;
            return $(t).data("link-replace") ? t.value = n : (a = t.value.substring(0, t.selectionEnd), i = t.value.substring(t.selectionEnd), a = a.replace(e, n), i = i.replace(e, n), t.value = a + i, t.selectionStart = a.length, t.selectionEnd = a.length)
        }, e.prototype.start = function (t) {
            return a(this.field[0], s(t.name) + "\n")
        }, e.prototype.complete = function (t) {
            var e, a;
            return a = s(t.asset.original_name), e = "![" + n(t.asset.name) + "](" + t.asset.href + ")", r(this.field[0], a, e)
        }, e.prototype.error = function (t) {
            var e;
            return e = s(t.asset.original_name), r(this.field[0], e, "")
        }, e
    }(i), m = ["is-default", "is-uploading", "is-bad-file", "is-too-big", "is-failed"], g = function (t) {
        return t.removeClass(m.join(" "))
    }, v = function (t) {
        return g(t), t.addClass("is-default")
    }, C = new s, y = function (i) {
        var s;
        return s = new e(i), s.available() || (s = new t(i)), s.available() || (s = new n(i)), s.available() || (s = new a(i)), s && s.available() ? s : void 0
    }, p = function (t, e) {
        var n;
        return n = y(e), n && n.okToUpload(t) ? n.setup(function () {
            return l(t, n.policyUrl, {success: function (e) {
                var a;
                return n.start(t), a = u(e, n), C.upload(t, a)
            }, error: function (t) {
                return g(e), 422 === t.status ? e.addClass("is-bad-file") : e.addClass("is-failed-request")
            }})
        }) : void 0
    }, l = function (t, e, n) {
        return $.ajax({type: "POST", url: e, data: {name: t.name, size: t.size, content_type: t.type, repository_id: $("#release_repository_id").val(), release_id: $("#release_id").val(), team_id: $("[data-team-id]").data("team-id")}, success: n.success, error: n.error})
    }, u = function (t, e) {
        var n, a;
        return n = $(e.container), a = {to: t.upload_url, form: t.form, start: function () {
            return g(n), n.addClass("is-uploading")
        }, progress: function (t) {
            return e.progress(t)
        }, complete: function () {
            return $.ajax({type: "PUT", url: t.asset_upload_url}), e.complete(t), e.field.trigger("change"), v(n)
        }, error: function () {
            return e.error(t), e.field.trigger("change"), g(n), n.addClass("is-failed")
        }}
    }, j = function (t) {
        var e, n, a, i;
        if (!t.types)return!1;
        for (i = t.types, n = 0, a = i.length; a > n; n++)if (e = i[n], "Files" === e)return!0;
        return!1
    }, x = function (t) {
        var e, n, a, i;
        if (!t.types)return!1;
        for (i = t.types, n = 0, a = i.length; a > n; n++)if (e = i[n], "text/uri-list" === e)return!0;
        return!1
    }, w = function (t) {
        var e, n, a, i;
        if (!t.types)return!1;
        for (i = t.types, n = 0, a = i.length; a > n; n++)if (e = i[n], "text/plain" === e)return!0;
        return!1
    }, r = function (t, e) {
        var n, a, i, s, r;
        for (r = [], i = 0, s = t.length; s > i; i++)n = t[i], p(n, e) ? r.push(void 0) : (g(e), a = y(e), a.acceptableSize(n) ? r.push(e.addClass("is-bad-file")) : r.push(e.addClass("is-too-big")));
        return r
    }, o = function (t, e) {
        var n, a, i, s, r, o;
        if (t && (a = y(e), a.available())) {
            for (r = t.split("\r\n"), o = [], i = 0, s = r.length; s > i; i++)n = r[i], a.acceptsExtension(n) ? (a.start({name: ""}), o.push(a.complete({asset: {name: "", href: n}}))) : (g(e), o.push(e.addClass("is-bad-file")));
            return o
        }
    }, c = function (t, e) {
        var n;
        return n = textarea(e), insertTextAtCursor(n[0], t)
    }, d = function (t) {
        return j(t) ? "copy" : x(t) ? "link" : w(t) ? "copy" : "none"
    }, h = function (t) {
        switch (t) {
            case"image/gif":
                return"image.gif";
            case"image/png":
                return"image.png";
            case"image/jpeg":
                return"image.jpg"
        }
    }, b = function (t) {
        return null == t && (t = !0), $(document).off("drop.uploads dragover.uploads"), t ? ($(document).on("drop.uploads", function (t) {
            return t.preventDefault()
        }), $(document).on("dragover.uploads", function (t) {
            return t.originalEvent.dataTransfer.dropEffect = "none", t.preventDefault()
        })) : void 0
    }, f = function (t) {
        return $(t).data("uploadable-container-installed") ? void 0 : ($(t).on("dragenter dragover", function (t) {
            var e;
            return e = d(t.originalEvent.dataTransfer), t.originalEvent.dataTransfer.dropEffect = e, $(this).addClass("dragover"), !1
        }), $(t).on("dragleave", function (t) {
            return t.originalEvent.dataTransfer.dropEffect = "none", $(this).removeClass("dragover"), !1
        }), $(t).on("drop", function (e) {
            var n;
            return $(this).removeClass("dragover"), n = e.originalEvent.dataTransfer, n.types ? j(n) ? r(n.files, $(this)) : x(n) ? o(n.getData("text/uri-list"), $(this)) : w(n) && c(n.getData("text/plain"), $(this)) : (g($(t)), $(t).addClass("is-bad-browser")), !1
        }), $(t).data("uploadable-container-installed", !0))
    }, $.pageUpdate(function () {
        var t, e, n, a, i;
        for (t = $(".js-uploadable-container"), b(t.length > 0), i = [], n = 0, a = t.length; a > n; n++)e = t[n], i.push(f(e));
        return i
    }), ("undefined" == typeof FormData || null === FormData) && $(document.documentElement).addClass("no-dnd-uploads"), $(document).on("change", ".js-manual-file-chooser", function (t) {
        var e;
        return e = $(this).closest(".js-uploadable-container"), t.target.files ? r(t.target.files, e) : (g(e), e.addClass("is-bad-browser"))
    }), $(document).on("paste", ".js-uploadable-container", function (t) {
        var e, n, a, i, s;
        if ((a = null != (i = event.clipboardData) ? null != (s = i.items) ? s[0] : void 0 : void 0) && (n = h(a.type)))return e = a.getAsFile(), e.name = n, r([e], this), t.preventDefault()
    })
}.call(this), function () {
    var t;
    t = function (e) {
        var n, a, i, s, r;
        if (n = $(e), n.is("form")) {
            for (r = e.elements, i = 0, s = r.length; s > i; i++)if (a = r[i], !t(a))return!1;
            return!0
        }
        return n.is("input[required], textarea[required]") && "" === $.trim(n.val()) ? !1 : !0
    }, $(document).onFocusedInput("input[required], textarea[required]", function () {
        var e;
        return e = t(this), function () {
            var n;
            n = t(this), n !== e && $(this).trigger("validation:field:change", [n]), e = n
        }
    }), $(document).on("validation:field:change", "form", function () {
        var e;
        return e = t(this), $(this).trigger("validation:change", [e])
    }), $(document).on("validation:change", "form", function (t, e) {
        return $(this).find("button[data-disable-invalid]").prop("disabled", !e)
    }), $(function () {
        var e, n, a, i;
        for (i = $("input[required], textarea[required]"), n = 0, a = i.length; a > n; n++)e = i[n], $(e).trigger("validation:field:change", [t(e)])
    })
}.call(this), function () {
    $(document).on("ajaxSuccess", function (t, e) {
        var n;
        (n = e.getResponseHeader("X-XHR-Location")) && (document.location.href = n, t.stopImmediatePropagation())
    })
}.call(this), ("undefined" == typeof console || "undefined" == typeof console.log) && (window.console = {log: function () {
}}), window.debug = function () {
}, $.fn.spin = function () {
    return debug("$.fn.spin is DEPRECATED"), this.after('<img src="' + GitHub.Ajax.spinner + '" id="spinner" width="16" />')
}, $.fn.stopSpin = function () {
    return debug("$.fn.stopSpin is DEPRECATED"), $("#spinner").remove(), this
}, GitHub.Ajax = {spinner: GitHub.assetHostUrl + "images/spinners/octocat-spinner-32.gif", error: GitHub.assetHostUrl + "images/modules/ajax/error.png"}, $(function () {
    var t = new Image;
    t.src = GitHub.Ajax.spinner, $(".flash .close").click(function () {
        $(this).closest(".flash").fadeOut(300, function () {
            $(this).remove(), 0 == $(".flash-messages .close").length && $(".flash-messages").remove()
        })
    }), $(".js-form-signup-home input, .js-ie-placeholder").placeholder()
}), $.pageUpdate(function () {
    $(this).find(".js-entice").each(function () {
        $(this).enticeToAction({title: $(this).attr("data-entice")})
    })
}), function () {
    $.pageUpdate(function () {
        var t, e, n;
        if ($("#menu-about").length && (t = $(".js-github-jobs"), t.length))return $(".js-github-jobs").attr("data-loading") || ($(".js-github-jobs").attr("data-loading", !0), $.getJSON(t.data("url"),function (t) {
            var a, i, s, r;
            if (0 === t.length)return n();
            for (r = [], i = 0, s = t.length; s > i; i++)a = t[i], r.push(e(a));
            return r
        }).complete(function () {
                return $(".js-github-jobs").removeAttr("data-loading")
            }).error(function () {
                return $(".js-github-jobs .jobs-list").html("Had a problem pulling in our jobs. Sorry!")
            })), e = function (t) {
            var e;
            return e = t.description.split("\n")[0], $(".js-github-jobs .jobs-list").append('      <li>        <h3><a href="' + t.url + '">' + t.title + "</a></h3>      </li>    ")
        }, n = function () {
            return $(".js-github-jobs .jobs").html("<p>We haven't posted any jobs lately. Check back later, though!</p>")
        }
    }), $(document).on("keydown", function (t) {
        return $(".employees").length ? "i" === t.hotkey ? $(".employees").toggleClass("show-identicon") : void 0 : void 0
    })
}.call(this), function () {
    var t, e, n, a, i, s, r;
    null == (r = window._gaq) && (window._gaq = []), _gaq.push(["_setAccount", "UA-3769691-2"]), _gaq.push(["_setDomainName", "none"]), _gaq.push(["_trackPageview"]), _gaq.push(["_trackPageLoadTime"]), "404 - GitHub" === document.title && (i = document.location.pathname + document.location.search, e = document.referrer, _gaq.push(["_trackPageview", "/404.html?page=" + i + "&from=" + e])), n = document.createElement("script"), n.type = "text/javascript", n.async = !0, a = "https:" === document.location.protocol ? "https://ssl" : "http://www", n.src = "" + a + ".google-analytics.com/ga.js", document.getElementsByTagName("head")[0].appendChild(n), $(function () {
        var t, e, n;
        if (t = $("meta[name=octolytics-script-host]")[0])return null == (n = window._octo) && (window._octo = []), _octo.push(["enablePerformance"]), _octo.push(["recordPageView"]), e = document.createElement("script"), e.type = "text/javascript", e.async = !0, e.src = "//" + t.content + "/assets/api.js", document.getElementsByTagName("head")[0].appendChild(e)
    }), t = function (t, e, n, a) {
        return _gaq.push(["_trackEvent", t, e, n, a])
    }, s = function () {
        var e, n, a, i;
        return n = $("meta[name=analytics-event-category]"), n.length ? (e = $("meta[name=analytics-event-action]"), a = $("meta[name=analytics-event-label]"), i = $("meta[name=analytics-event-value]"), t(n.attr("content"), e.attr("content"), a.attr("content"), i.attr("content")), n.remove(), e.remove(), a.remove(), i.remove()) : void 0
    }, $(function () {
        return s()
    }), $(document).on("pjax:complete", function () {
        var t;
        return t = document.location.pathname, "undefined" != typeof _octo && null !== _octo && _octo.push(["recordPageView"]), "undefined" != typeof _gaq && null !== _gaq && _gaq.push(["_trackPageview", t]), setTimeout(function () {
            return s()
        }, 20)
    }), $(function () {
        var e;
        return e = !1, $(".js-form-signup-home").on("keyup", "input[type=text]", function () {
            return e ? void 0 : (t("Signup", "Attempt", "Homepage Form"), e = !0)
        }), $(".js-form-signup-detail").on("keyup", "input[type=text]", function () {
            return e ? void 0 : (t("Signup", "Attempt", "Detail Form"), e = !0)
        })
    })
}.call(this), function () {
    var t;
    t = function () {
        function t() {
        }

        return t.displayCreditCardFields = function (t) {
            var e, n;
            return e = $(".js-billing-section"), $("input[required]", e).each(function () {
                return $(this).addClass("js-required")
            }), n = $("input.js-required", e), t ? (e.removeClass("is-hidden"), n.attr("required", !0)) : (e.addClass("is-hidden"), n.attr("required", !1))
        }, t
    }(), window.Billing = t
}.call(this), $(function () {
    $.hotkeys({y: function () {
        var t = $("link[rel='permalink']").attr("href");
        $("title"), t && (t += location.hash, window.location.href = t)
    }})
}), function () {
    var t, e, n, a;
    e = function (e) {
        var n, i;
        return e.preventDefault(), n = t(e.target), i = n.find(".is-selected").index(), i + 1 === n.find(".js-carousel-slides .js-carousel-slide").length ? i = 0 : i++, a(n, i)
    }, n = function (e) {
        var n, i;
        return e.preventDefault(), n = t(e.target), i = n.find(".is-selected").index(), 0 === i ? i = $(n).find(".js-carousel-slides .js-carousel-slide").length - 1 : i--, a(n, i)
    }, t = function (t) {
        return $(t).closest(".js-carousel")
    }, a = function (t, e) {
        var n, a, i;
        return t ? (n = $(t).find(".is-selected"), i = n.outerWidth(), n.removeClass("is-selected").fire("carousel:unselected"), $(t).find(".js-carousel-slides").css("marginLeft", -1 * i * e), a = $(t).find(".js-carousel-slides li"), a.eq(e).addClass("is-selected").fire("carousel:selected")) : null
    }, $(document).on("click", ".js-carousel .js-previous-slide", n), $(document).on("click", ".js-carousel .js-next-slide", e)
}.call(this), function () {
    $(document).on("focusin", "#js-command-bar-field", function () {
        var t;
        return t = $(this), t.data("command-bar-installed") ? t.closest(".command-bar").addClass("command-bar-focus") : (t.commandBar().data("command-bar-installed", !0), setTimeout(function () {
            return t.focus()
        }, 20))
    }), $(document).on("hotkey:activate", "#js-command-bar-field", function (t) {
        switch (t.originalEvent.which) {
            case 191:
                return $(".js-this-repository-navigation-item").fire("navigation:open");
            case 83:
                return $(".js-all-repositories-navigation-item").fire("navigation:open")
        }
    }), $(document).on("focusout", "#js-command-bar-field", function () {
        return $(this).closest(".command-bar").removeClass("command-bar-focus")
    }), $(document).on("mousedown", ".commandbar .display", function () {
        return!1
    }), $(document).on("mousedown", ".command-bar-focus #advanced_search", function () {
        return!1
    }), $(document).on("click", ".js-command-bar .help", function () {
        var t;
        return t = $("#js-command-bar-field").focus(), $(".tipsy").hide(), setTimeout(function () {
            return t.val("help"), t.trigger("execute.commandbar")
        }, 250), !1
    })
}.call(this), function () {
    var t, e, n, a = [].slice;
    e = function (t) {
        return t.replace(/^\s+|\s+$/g, "")
    }, n = function (t) {
        return t.replace(/^\s+/g, "")
    }, t = function () {
        function t(t) {
            this.defaultContext = t, this.callbacks = {}
        }

        return t.prototype.bind = function (t, e) {
            var n, a, i, s, r;
            for (r = t.split(" "), i = 0, s = r.length; s > i; i++)n = r[i], (a = this.callbacks)[n] || (a[n] = []), this.callbacks[n].push(e);
            return this
        }, t.getPageInfo = function () {
            var t, e;
            return e = $("#js-command-bar-field"), t = {}, e.length ? (e.data("username") && (t.current_user = e.data("username")), t.search_choice = "global", $(".js-search-this-repository:checked").length && (t.search_choice = "this_repo"), e.data("repo") && (t.repo = {name_with_owner: e.data("repo"), branch: e.data("branch"), tree_sha: e.data("sha"), issues_page: !1}, $(".js-issues-results").length && (t.repo.issues_page = !0)), t) : {}
        }, t.prototype.trigger = function () {
            var t, e, n, i, s, r;
            if (i = arguments[0], t = 2 <= arguments.length ? a.call(arguments, 1) : [], n = this.callbacks[i], !n)return!0;
            for (s = 0, r = n.length; r > s; s++)if (e = n[s], e.apply(this.context, t) === !1)return!1;
            return!0
        }, t.prototype.unbind = function (t, e) {
            var n, a, i, s, r;
            if (t)if (e) {
                for (n = this.callbacks[t], i = s = 0, r = n.length; r > s; i = ++s)if (a = n[i], a === e) {
                    n.splice(i, 1);
                    break
                }
            } else delete this.callbacks[t]; else this.callbacks = {};
            return this
        }, t.prototype.execute = function (t) {
            return new this.defaultContext(this, t).fullMatch().execute()
        }, t.prototype.suggestions = function (t, e) {
            return new this.defaultContext(this, t).partialMatch().suggestions().slice(0, e)
        }, t.prototype.complete = function (e, n) {
            var a;
            return a = new this.defaultContext(this, e).partialMatch(), t.Store.set("" + a.constructor.name + ":" + e, n), a.complete(n)
        }, t
    }(), t.Store = function () {
        function t() {
        }

        var e;
        return e = function () {
            try {
                return"localStorage"in window && null !== window.localStorage
            } catch (t) {
                return!1
            }
        }, t.set = function (t, n) {
            if (e())try {
                return localStorage.setItem(t, JSON.stringify(n)), n
            } catch (a) {
                return!1
            }
        }, t.get = function (t) {
            return e() ? this.parse(localStorage[t]) : null
        }, t.parse = function (t) {
            try {
                return JSON.parse(t)
            } catch (e) {
                return t
            }
        }, t.expire = function (t) {
            var n;
            if (e())return n = localStorage[t], localStorage.removeItem(t), n
        }, t
    }(), t.RemoteProxy = function () {
        function t() {
        }

        return t.caches = {}, t.requests = {}, t.get = function (t, e, n) {
            var a, i, s = this;
            return this.commandBar = n, null == (i = e.cache_for) && (e.cache_for = 36e5), a = (new Date).getTime() - e.cache_for, this.shouldLoad = function (t) {
                return this.isCached(t) ? this.caches[t].requested < a ? !0 : !1 : !0
            }, this.shouldLoad(t) ? (this.isLoading(t) || (this.requests[t] = $.ajax({url: t, dataType: e.dataType || "json", success: function (n) {
                return s.caches[t] = {response: e.process(n), requested: (new Date).getTime()}
            }, error: function () {
                return s.caches[t] = {response: [], requested: (new Date).getTime()}
            }, complete: function () {
                var e;
                return delete s.requests[t], null != (e = s.commandBar) ? e.trigger("suggest.commandbar") : void 0
            }})), this.isCached(t) ? this.caches[t].response : [
                {command: "", description: e.loadingMessage, type: "loading"}
            ]) : this.caches[t].response
        }, t.isLoading = function (t) {
            return null != this.requests[t]
        }, t.isCached = function (t) {
            return null != this.caches[t]
        }, t
    }(), t.Timer = function () {
        function t() {
            this.time = (new Date).getTime()
        }

        return t.prototype.diff = function () {
            var t, e;
            return e = (new Date).getTime(), t = e - this.time, this.time = e, t
        }, t
    }(), t.History = function () {
        function n() {
        }

        var a, i, s;
        return s = [], i = function () {
            return t.Store.set("commandbar.history", s.slice(0, 50).join("\n"))
        }, a = function (t) {
            var n, a, i, r;
            for (a = [], i = 0, r = s.length; r > i; i++)n = s[i], e(n) !== e(t) && a.push(n);
            return s = a
        }, n.load = function () {
            var e;
            return e = t.Store.get("commandbar.history"), s = null != e ? e.split("\n") : []
        }, n.add = function (t) {
            return a(t), s.unshift(t), i()
        }, n.get = function (t) {
            return s[t]
        }, n.exists = function (t) {
            return null != s[t]
        }, n
    }.call(this), t.History.load(), t.Context = function () {
        function a(t, e, n) {
            var i = this;
            this.commandBar = t, this.text = e, this.parent = n, this.lazyLoad = function () {
                return a.prototype.lazyLoad.apply(i, arguments)
            }, this.suggestionCollection = function () {
                return a.prototype.suggestionCollection.apply(i, arguments)
            }, this.matches = this.text.match(this.constructor.regex), this.remainder = this.matches ? this.text.replace(this.matches[0], "") : this.text
        }

        return a.contexts = [], a.register = function (t) {
            return this.contexts.push(t)
        }, a.regex = /(?:)/i, a.matches = function (t) {
            return!!t.match(this.regex)
        }, a.help = function () {
            return{}
        }, a.prototype.override = function () {
            return!1
        }, a.prototype.search = function () {
            return!1
        }, a.prototype.suffix = function () {
            return" "
        }, a.prototype.suggestionOptions = function () {
            return[]
        }, a.prototype.filter = function (n) {
            var a, i, s, r, o;
            for (s = e(this.remainder), a = [], r = 0, o = n.length; o > r; r++)i = n[r], i = t.SuggestionCollection.prepare(i), i.score = i.defaultScore || t.SuggestionCollection.score(i, s, this), 0 !== i.score && a.push(i);
            return a.sort(function (t, e) {
                return e.score - t.score
            })
        }, a.prototype.suggestionCollection = function () {
            var e, n, a, i, s, r, o, c, l, u, d, h, f, m, p, g, v;
            for (l = [], i = [], o = !1, c = 0, s = t.getPageInfo(), v = this.constructor.contexts, d = 0, m = v.length; m > d; d++)n = v[d], (!n.logged_in || s.current_user) && (e = new n(this.commandBar, this.remainder, this), u = e.suggestionOptions(), u = this.filter(u), 0 !== u.length && (e.override() && (o = !0), e.search() && c++, i.push({suggestions: u, override: e.override(), search: e.search()})));
            if (o) {
                for (r = [], h = 0, p = i.length; p > h; h++)a = i[h], (a.override || a.search) && r.push(a);
                i = r
            }
            for (f = 0, g = i.length; g > f; f++)a = i[f], l = l.concat(a.suggestions.slice(0, Math.round(6 / (i.length - c))));
            return l
        }, a.prototype.suggestions = function () {
            var t;
            return t = this.suggestionCollection(), t.sort(function (t, e) {
                return e.score - t.score
            }), t
        }, a.prototype.fullMatch = function (n) {
            var a, i, s, r, o, c, l, u;
            if (null == n && (n = this.remainder), i = this, s = t.getPageInfo(), "" === e(n))o = this; else for (u = this.constructor.contexts, c = 0, l = u.length; l > c; c++)if (a = u[c], (!a.logged_in || s.current_user) && !a.skipMatch && a.matches(n) && (r = new a(this.commandBar, n, this).fullMatch()))return r;
            return o || i
        }, a.prototype.partialMatch = function () {
            var e, a, i, s, r, o, c, l;
            if (a = this, i = t.getPageInfo(), this.remainder.length) {
                for (l = this.constructor.contexts, o = 0, c = l.length; c > o; o++)if (e = l[o], (!e.logged_in || i.current_user) && e.matches(this.remainder) && (s = new e(this.commandBar, n(this.remainder), this).partialMatch()))return s
            } else r = this.parent;
            return r || a
        }, a.prototype.description = function () {
            return"Execute `" + this.command() + "`"
        }, a.prototype.command = function () {
            return this.parent ? e("" + this.parent.command() + " " + this.matches[0]) : ""
        }, a.prototype.complete = function (t) {
            var e;
            return e = this.fullMatch(t), (null != e ? e.command() : void 0) + e.suffix()
        }, a.prototype.lazyLoad = function (e, n) {
            return t.RemoteProxy.get(e, n, this.commandBar)
        }, a.prototype.loading = function (t) {
            return this.commandBar.trigger("loading.commandbar", t)
        }, a.prototype.success = function (t) {
            return this.commandBar.trigger("success.commandbar", t)
        }, a.prototype.error = function (t) {
            return this.commandBar.trigger("error.commandbar", t)
        }, a.prototype.message = function (t) {
            return this.commandBar.trigger("message.commandbar", t)
        }, a.prototype.goToUrl = function (e) {
            var n;
            return t.ctrlKey || t.metaKey ? (n = window.open(e, (new Date).getTime()), n !== window ? this.success("Opened in a new window") : void 0) : window.location = e
        }, a.prototype.post = function (t) {
            return t = $.extend(t, {type: "POST"}), $.ajax(t)
        }, a.prototype.execute = function () {
        }, a
    }(), t.SuggestionCollection = {constructor: function (t) {
        this.suggestions = t
    }, prepare: function (t) {
        return{prefix: t.prefix || "", url: t.url || null, search: t.search || null, command: t.command || "", display: t.display || t.command, description: t.description || "", type: t.type || "choice", multiplier: t.multiplier || 1, defaultScore: t.defaultScore || null, skip_fuzzy: t.skip_fuzzy || !1, filter: t.filter === !1 ? !1 : !0}
    }, score: function (e, n, a) {
        var i, s, r;
        return s = 0, e.filter === !1 ? s = 1 : "loading" !== e.type ? (i = t.Store.get("" + a.constructor.name + ":" + n), i === e.command ? s = 1.99 : (r = e.search ? e.search : e.command, s = n ? $.fuzzyScore(r, n) : 1, s *= e.multiplier)) : s = 20, s
    }}, window.CommandBar = t
}.call(this), function () {
    CommandBar.Context.prototype.execute = function () {
        return"" === $.trim(this.text) ? !1 : (this.loading("Searching for '" + this.text + "'"), this.commandBar.trigger("submit.commandbar"))
    }
}.call(this), function () {
    var t, e = {}.hasOwnProperty, n = function (t, n) {
        function a() {
            this.constructor = t
        }

        for (var i in n)e.call(n, i) && (t[i] = n[i]);
        return a.prototype = n.prototype, t.prototype = new a, t.__super__ = n.prototype, t
    };
    t = function (t) {
        function e() {
            var t = this;
            return this.suffix = function () {
                return e.prototype.suffix.apply(t, arguments)
            }, e.__super__.constructor.apply(this, arguments)
        }

        return n(e, t), e.contexts = [], e.regex = /^(help|\?)$/i, e.prototype.suggestionOptions = function () {
            return this.text.match(/^[h\?]/i) ? [
                {command: "help", description: "Show available commands", search: "help ?"}
            ] : []
        }, e.prototype.description = function () {
            return"Show available commands"
        }, e.prototype.helpMessagesFor = function (t) {
            var e, n, a, i, s, r, o;
            for (s = this, i = [], a = CommandBar.getPageInfo(), r = 0, o = t.length; o > r; r++)e = t[r], (!e.logged_in || a.current_user) && (n = e.help(), n.constructor === Array ? i = i.concat(n) : (e.contexts.length && (n.children = s.helpMessagesFor(e.contexts)), i.push(n)));
            return i
        }, e.prototype.formatCommands = function (t) {
            var e;
            return e = "<table>", e += this.messageRows(t), e += "</table>"
        }, e.prototype.messageRows = function (t, e) {
            var n, a, i, s;
            for (a = "", e || (e = ""), t = t.sort(function (t, e) {
                return t.command > e.command ? 1 : -1
            }), i = 0, s = t.length; s > i; i++)n = t[i], (n.child !== !0 || "" !== e) && (a += this.messageRow(n, e)), n.children && (a += this.messageRows(n.children, "" + e + n.command + " "));
            return a
        }, e.prototype.messageRow = function (t, e) {
            var n;
            return n = "", t.description ? (n += "<tr><td class=command>", n += "" + e + "<strong>" + t.command + "</strong>", n += "</td><td><span>" + t.description + "</span></td></tr>") : ""
        }, e.prototype.execute = function () {
            var t;
            return t = [], t = t.concat(this.helpMessagesFor(this.commandBar.defaultContext.contexts)), this.message(this.formatCommands(t))
        }, e.prototype.suffix = function () {
            return""
        }, e
    }(CommandBar.Context), CommandBar.Context.register(t)
}.call(this), function () {
    var t, e, n, a, i, s, r, o, c = {}.hasOwnProperty, l = function (t, e) {
        function n() {
            this.constructor = t
        }

        for (var a in e)c.call(e, a) && (t[a] = e[a]);
        return n.prototype = e.prototype, t.prototype = new n, t.__super__ = e.prototype, t
    };
    a = function (t) {
        function e() {
            var t = this;
            return this.repo = function () {
                return e.prototype.repo.apply(t, arguments)
            }, e.__super__.constructor.apply(this, arguments)
        }

        return l(e, t), e.contexts = [], e.regex = /^([\w\._-]+\/[\w\._-]+)/i, e.help = function () {
            return{command: "user/repo", description: "View a repository"}
        }, e.prototype.repo = function () {
            return this.matches ? this.matches[1] : void 0
        }, e.prototype.suggestionOptions = function () {
            var t, e, n, a;
            return this.text.match(/^[\w\._-]/i) ? (e = CommandBar.getPageInfo(), t = [], e.current_user && "global" === e.search_choice && (t = this.lazyLoad("/command_bar/repos", {loadingMessage: "Loading repositories", process: function (t) {
                return t.results
            }})), (a = this.text.match(/([\w\._-]+)\//i)) && (n = a[1], t = this.lazyLoad("/command_bar/repos_for/" + n, {loadingMessage: "Loading repositories for " + n, process: function (t) {
                return t.results
            }})), t) : []
        }, e.prototype.description = function () {
            return"Go to " + this.repo()
        }, e.prototype.helpText = function () {
            return{command: "user/repo", description: "View user/repo, manage issues, etc."}
        }, e.prototype.execute = function () {
            return this.loading("Loading " + this.repo()), this.goToUrl("/" + this.repo() + "?source=c")
        }, e
    }(CommandBar.Context), e = function (t) {
        function e() {
            var t = this;
            return this.suffix = function () {
                return e.prototype.suffix.apply(t, arguments)
            }, this.execute = function () {
                return e.prototype.execute.apply(t, arguments)
            }, this.branch = function () {
                return e.prototype.branch.apply(t, arguments)
            }, this.repo = function () {
                return e.prototype.repo.apply(t, arguments)
            }, e.__super__.constructor.apply(this, arguments)
        }

        return l(e, t), e.contexts = [], e.regex = /@(.+)?/i, e.help = function () {
            return{child: !0, command: "@branchname", description: "View a branch in a repository"}
        }, e.prototype.repo = function () {
            return this.parent.repo ? this.parent.repo() : void 0
        }, e.prototype.suggestionOptions = function () {
            return this.text.match(/^\s@/i) && this.repo() ? this.lazyLoad("/command_bar/" + this.repo() + "/branches", {loadingMessage: "Loading " + this.repo() + "'s  branches", process: function (t) {
                return t.results
            }}) : [
                {command: "@branchname", description: "View a branch in a repository"}
            ]
        }, e.prototype.branch = function () {
            return this.matches ? this.matches[1] : void 0
        }, e.prototype.description = function () {
            return"Show branch `" + this.branch() + "` for " + this.repo()
        }, e.prototype.execute = function () {
            return this.repo() && this.branch() ? (this.loading("Loading " + this.repo() + ":" + this.branch() + " branch"), this.goToUrl("/" + this.repo() + "/tree/" + this.branch() + "?source=cb")) : !0
        }, e.prototype.suffix = function () {
            return""
        }, e
    }(CommandBar.Context), n = function (t) {
        function e() {
            var t = this;
            return this.repo = function () {
                return e.prototype.repo.apply(t, arguments)
            }, e.__super__.constructor.apply(this, arguments)
        }

        return l(e, t), e.contexts = [], e.skipMatch = !0, e.regex = /(.+)?/i, e.prototype.repo = function () {
            var t;
            return t = CommandBar.getPageInfo(), t.repo ? t.repo.name_with_owner : void 0
        }, e.prototype.suggestionOptions = function () {
            var t;
            return t = CommandBar.getPageInfo(), "global" === t.search_choice ? [] : this.lazyLoad("/command_bar/" + this.repo() + "/branches", {loadingMessage: "Loading " + this.repo() + "'s  branches", process: function (t) {
                return t.results
            }})
        }, e
    }(CommandBar.Context), i = function (t) {
        function e() {
            var t = this;
            return this.execute = function () {
                return e.prototype.execute.apply(t, arguments)
            }, this.issue = function () {
                return e.prototype.issue.apply(t, arguments)
            }, this.query = function () {
                return e.prototype.query.apply(t, arguments)
            }, this.repo = function () {
                return e.prototype.repo.apply(t, arguments)
            }, e.__super__.constructor.apply(this, arguments)
        }

        return l(e, t), e.contexts = [], e.regex = /\#(.+)/i, e.timeout = null, e.previous_term = null, e.last_suggested = null, e.search_delay = 400, e.help = function () {
            return{child: !0, command: "#123", description: "View a specific issue"}
        }, e.prototype.searchDelayPassed = function () {
            return(new Date).getTime() - this.constructor.last_suggested >= this.constructor.search_delay
        }, e.prototype.repo = function () {
            return this.parent.repo ? this.parent.repo() : void 0
        }, e.prototype.query = function () {
            return this.matches ? this.matches[1] : void 0
        }, e.prototype.suggestionOptions = function () {
            return this.text.match(/^\s#/i) && this.repo() ? this.delayedSearch() : [
                {command: "#123", description: "View a specific issue"}
            ]
        }, e.prototype.delayedSearch = function () {
            var t, e, n;
            return n = this.text, e = this.constructor.previous_term, clearTimeout(this.constructor.timeout), this.constructor.previous_term = n, n === e && this.searchDelayPassed() ? this.lazyLoad("/command_bar/" + this.repo() + "/issues_for?q=" + encodeURIComponent(n), {loadingMessage: "Loading " + this.repo() + "'s issues", process: function (t) {
                return t.results
            }}) : (this.constructor.last_suggested = (new Date).getTime(), t = this.commandBar, this.constructor.timeout = setTimeout(function () {
                return t.trigger("suggest.commandbar")
            }, this.constructor.search_delay), [])
        }, e.prototype.suffix = function () {
            return""
        }, e.prototype.issue = function () {
            return this.matches ? this.matches[1] : ""
        }, e.prototype.description = function () {
            return"Show issue #" + this.issue() + " for " + this.repo()
        }, e.prototype.execute = function () {
            return this.loading("Loading issue #" + this.issue() + " for " + this.repo()), this.goToUrl("/" + this.repo() + "/issues/" + this.issue() + "?source=c")
        }, e
    }(CommandBar.Context), s = function (t) {
        function e() {
            var t = this;
            return this.repo = function () {
                return e.prototype.repo.apply(t, arguments)
            }, e.__super__.constructor.apply(this, arguments)
        }

        return l(e, t), e.contexts = [], e.skipMatch = !0, e.regex = /(?:)/i, e.timeout = null, e.previous_term = null, e.last_suggested = null, e.search_delay = 400, e.prototype.override = function () {
            var t;
            return t = CommandBar.getPageInfo(), t.repo && !this.text.match(/^([\w\._-]+\/[\w\._-]+)/i) ? t.repo.issues_page : !1
        }, e.prototype.repo = function () {
            var t;
            return t = CommandBar.getPageInfo(), t.repo ? t.repo.name_with_owner : void 0
        }, e.prototype.searchDelayPassed = function () {
            return(new Date).getTime() - this.constructor.last_suggested >= this.constructor.search_delay
        }, e.prototype.suggestionOptions = function () {
            var t, e;
            return e = this.text, t = CommandBar.getPageInfo(), this.repo() && "this_repo" === t.search_choice ? this.delayedSearch() : t.current_user ? this.lazyLoad("/command_bar/issues", {loadingMessage: "Loading issues", process: function (t) {
                return t.results
            }}) : []
        }, e.prototype.delayedSearch = function () {
            var t, e, n;
            return n = this.text, e = this.constructor.previous_term, clearTimeout(this.constructor.timeout), this.constructor.previous_term = n, n === e && this.searchDelayPassed() ? this.lazyLoad("/command_bar/" + this.repo() + "/issues_for?q=" + encodeURIComponent(n), {loadingMessage: "Loading " + this.repo() + "'s issues", process: function (t) {
                return t.results
            }}) : (this.constructor.last_suggested = (new Date).getTime(), t = this.commandBar, this.constructor.timeout = setTimeout(function () {
                return t.trigger("suggest.commandbar")
            }, this.constructor.search_delay), [])
        }, e
    }(CommandBar.Context), t = function (t) {
        function e() {
            var t = this;
            return this.suffix = function () {
                return e.prototype.suffix.apply(t, arguments)
            }, this.filename = function () {
                return e.prototype.filename.apply(t, arguments)
            }, this.fullpath = function () {
                return e.prototype.fullpath.apply(t, arguments)
            }, this.repo = function () {
                return e.prototype.repo.apply(t, arguments)
            }, e.__super__.constructor.apply(this, arguments)
        }

        return l(e, t), e.contexts = [], e.regex = /^\s*\/([\w\_\-\.\s]+\/?)+/i, e.timeout = null, e.previous_term = null, e.last_suggested = null, e.search_delay = 400, e.help = function () {
            return{child: !0, command: "/path/to/file.s", description: "View a blob page"}
        }, e.prototype.repo = function () {
            var t;
            return this.parent.repo ? this.parent.repo() : (t = CommandBar.getPageInfo(), t.repo ? t.repo.name_with_owner : void 0)
        }, e.prototype.searchDelayPassed = function () {
            return(new Date).getTime() - this.constructor.last_suggested >= this.constructor.search_delay
        }, e.prototype.fullpath = function () {
            return this.matches ? $.trim(this.matches[0]) : void 0
        }, e.prototype.filename = function () {
            return this.matches ? $.trim(this.matches[1]) : void 0
        }, e.prototype.suggestionOptions = function () {
            var t, e, n, a, i;
            return i = this.text, e = CommandBar.getPageInfo(), i.match(/^[\/\w\._-]/i) ? this.repo() ? (a = e.repo.tree_sha, "" === a || void 0 === a || "global" === e.search_choice ? [] : (n = this.constructor.previous_term, clearTimeout(this.constructor.timeout), this.constructor.previous_term = i, i === n && this.searchDelayPassed() ? this.lazyLoad("/command_bar/" + this.repo() + "/paths/" + e.repo.branch + "?q=" + i + "&sha=" + a, {loadingMessage: "Loading " + this.repo() + "'s  files", process: function (t) {
                return t.results
            }}) : (this.constructor.last_suggested = (new Date).getTime(), t = this.commandBar, this.constructor.timeout = setTimeout(function () {
                return t.trigger("suggest.commandbar")
            }, this.constructor.search_delay), []))) : [] : []
        }, e.prototype.suffix = function () {
            return""
        }, e.prototype.execute = function () {
            var t;
            return t = CommandBar.getPageInfo(), t.repo ? (this.loading("Loading " + this.filename()), this.goToUrl("/" + this.repo() + "/blob/" + t.repo.branch + this.fullpath() + "?source=c")) : null
        }, e
    }(CommandBar.Context), o = function (t) {
        function e() {
            var t = this;
            return this.suffix = function () {
                return e.prototype.suffix.apply(t, arguments)
            }, this.execute = function () {
                return e.prototype.execute.apply(t, arguments)
            }, this.section = function () {
                return e.prototype.section.apply(t, arguments)
            }, this.repo = function () {
                return e.prototype.repo.apply(t, arguments)
            }, e.__super__.constructor.apply(this, arguments)
        }

        return l(e, t), e.contexts = [], e.regex = /^\s*(wiki|graphs|network|pulse|issues|pulls)\b$/i, e.help = function () {
            return new this(this.commandBar, "").suggestionOptions()
        }, e.prototype.repo = function () {
            return this.parent.repo()
        }, e.prototype.section = function () {
            return this.matches ? this.matches[1] : void 0
        }, e.prototype.suggestionOptions = function () {
            return[
                {command: "wiki", description: "Pull up the wiki"},
                {command: "graphs", description: "All the Graphs!"},
                {command: "network", description: "See the network"},
                {command: "pulse", description: "See recent activity"},
                {command: "issues", description: "View open issues"},
                {command: "pulls", description: "Show open pull requests"}
            ]
        }, e.prototype.description = function () {
            return"View the " + this.section() + " for " + this.repo()
        }, e.prototype.execute = function () {
            return this.loading("Loading " + this.section() + " for " + this.repo()), this.goToUrl("/" + this.repo() + "/" + this.section() + "?source=c")
        }, e.prototype.suffix = function () {
            return""
        }, e
    }(CommandBar.Context), r = function (t) {
        function e() {
            var t = this;
            return this.suffix = function () {
                return e.prototype.suffix.apply(t, arguments)
            }, this.execute = function () {
                return e.prototype.execute.apply(t, arguments)
            }, this.type = function () {
                return e.prototype.type.apply(t, arguments)
            }, this.repo = function () {
                return e.prototype.repo.apply(t, arguments)
            }, e.__super__.constructor.apply(this, arguments)
        }

        return l(e, t), e.contexts = [], e.regex = /^\s*new\s(pull|issues)\b$/i, e.logged_in = !0, e.help = function () {
            return new this(this.commandBar, "").suggestionOptions()
        }, e.prototype.repo = function () {
            return this.parent.repo()
        }, e.prototype.type = function () {
            return this.matches ? this.matches[1] : void 0
        }, e.prototype.suggestionOptions = function () {
            return[
                {command: "new issues", description: "Create new issue"},
                {command: "new pull", description: "Create new pull request"}
            ]
        }, e.prototype.description = function () {
            return"Create a new issue for " + this.repo()
        }, e.prototype.execute = function () {
            return this.loading("Loading new " + this.type() + " form for " + this.repo()), this.goToUrl("/" + this.repo() + "/" + this.type() + "/new?source=c")
        }, e.prototype.suffix = function () {
            return""
        }, e
    }(CommandBar.Context), CommandBar.Context.register(a), CommandBar.Context.register(n), CommandBar.Context.register(t), CommandBar.Context.register(s), a.register(i), a.register(e), a.register(t), a.register(r), a.register(o)
}.call(this), function () {
    var t, e, n = {}.hasOwnProperty, a = function (t, e) {
        function a() {
            this.constructor = t
        }

        for (var i in e)n.call(e, i) && (t[i] = e[i]);
        return a.prototype = e.prototype, t.prototype = new a, t.__super__ = e.prototype, t
    };
    e = function (t) {
        function e() {
            var t = this;
            return this.suffix = function () {
                return e.prototype.suffix.apply(t, arguments)
            }, e.__super__.constructor.apply(this, arguments)
        }

        return a(e, t), e.contexts = [], e.regex = /^search\sgithub\sfor\s'(.+)'$/i, e.prototype.search = function () {
            return!0
        }, e.prototype.query = function () {
            return this.matches ? $.trim(this.matches[1]) : void 0
        }, e.prototype.suggestionOptions = function () {
            return[
                {command: "Search GitHub for '" + this.text + "'", description: "", multiplier: 0, defaultScore: -2, url: "/search?q=" + encodeURIComponent(this.text) + "&source=cc", skip_fuzzy: !0}
            ]
        }, e.prototype.description = function () {
            return"Search GitHub for " + this.query()
        }, e.prototype.execute = function () {
            return this.loading("Searching for '" + this.query() + "'"), this.goToUrl("/search?q=" + encodeURIComponent(this.query()) + "&source=c")
        }, e.prototype.suffix = function () {
            return""
        }, e
    }(CommandBar.Context), t = function (t) {
        function e() {
            var t = this;
            return this.suffix = function () {
                return e.prototype.suffix.apply(t, arguments)
            }, e.__super__.constructor.apply(this, arguments)
        }

        return a(e, t), e.contexts = [], e.regex = /^search\s([\w\._-]+\/[\w\._-]+)\sfor\s'(.+)'$/i, e.prototype.search = function () {
            return!0
        }, e.prototype.query = function () {
            return this.matches ? $.trim(this.matches[2]) : void 0
        }, e.prototype.repomatch = function () {
            return this.matches ? $.trim(this.matches[1]) : void 0
        }, e.prototype.suggestionOptions = function () {
            var t;
            return t = CommandBar.getPageInfo(), t.repo ? [
                {command: "Search " + t.repo.name_with_owner + " for '" + this.text + "'", description: "", multiplier: 0, defaultScore: -1, url: "/" + t.repo.name_with_owner + "/search?q=" + encodeURIComponent(this.text) + "&source=cc", skip_fuzzy: !0}
            ] : []
        }, e.prototype.description = function () {
            return"Search GitHub for " + this.query()
        }, e.prototype.execute = function () {
            return this.loading("Searching for '" + this.query() + "'"), this.goToUrl("/" + this.repomatch() + "/search?q=" + encodeURIComponent(this.query()) + "&source=c")
        }, e.prototype.suffix = function () {
            return""
        }, e
    }(CommandBar.Context), CommandBar.Context.register(e), CommandBar.Context.register(t)
}.call(this), function () {
    var t, e = {}.hasOwnProperty, n = function (t, n) {
        function a() {
            this.constructor = t
        }

        for (var i in n)e.call(n, i) && (t[i] = n[i]);
        return a.prototype = n.prototype, t.prototype = new a, t.__super__ = n.prototype, t
    };
    t = function (t) {
        function e() {
            var t = this;
            return this.suffix = function () {
                return e.prototype.suffix.apply(t, arguments)
            }, this.user = function () {
                return e.prototype.user.apply(t, arguments)
            }, e.__super__.constructor.apply(this, arguments)
        }

        return n(e, t), e.contexts = [], e.regex = /^@([A-Za-z0-9-_]+)\/?/i, e.timeout = null, e.previous_term = null, e.last_suggested = null, e.search_delay = 400, e.help = function () {
            return{command: "@user", description: "View a user&rsquo;s profile"}
        }, e.matches = function (t) {
            var e;
            return e = t.match(this.regex), !!e && !e[0].match(/\/$/)
        }, e.prototype.searchDelayPassed = function () {
            return(new Date).getTime() - this.constructor.last_suggested >= this.constructor.search_delay
        }, e.prototype.suggestionOptions = function () {
            var t, e, n, a;
            return a = this.text, a.match(/^[@\w\._-]/i) ? (e = CommandBar.getPageInfo(), this.text.match(/^@[\w\._-]/i) ? (n = this.constructor.previous_term, clearTimeout(this.constructor.timeout), this.constructor.previous_term = a, a === n && this.searchDelayPassed() ? this.lazyLoad("/command_bar/users?q=" + this.user(), {loadingMessage: "Loading users", process: function (t) {
                return t.results
            }}) : (this.constructor.last_suggested = (new Date).getTime(), t = this.commandBar, this.constructor.timeout = setTimeout(function () {
                return t.trigger("suggest.commandbar")
            }, this.constructor.search_delay), [])) : e.current_user && "global" === e.search_choice ? this.lazyLoad("/command_bar/users", {loadingMessage: "Loading users", process: function (t) {
                return t.results
            }}) : []) : []
        }, e.prototype.user = function () {
            return this.matches ? this.matches[1] : void 0
        }, e.prototype.suffix = function () {
            return""
        }, e.prototype.execute = function () {
            return this.loading("Loading " + this.user() + "'s profile"), this.goToUrl("/" + this.user() + "?source=c")
        }, e
    }(CommandBar.Context), CommandBar.Context.register(t)
}.call(this), function () {
    var t, e, n;
    t = jQuery, e = {ENTER: 13, TAB: 9, UP: 38, DOWN: 40, N: 78, P: 80, CTRL: 17, ESC: 27}, n = {init: function (n) {
        var a;
        return a = {classname: "commandbar", debug: !1, context: CommandBar.Context, limit: 12}, a = t.extend(a, n), this.each(function () {
            var n, i, s, r, o, c, l, u, d, h, f, m, p, g, v, $, y;
            return o = new CommandBar(a.context), s = t(this), a.limit || (a.limit = s.attr("data-results-limit")), s.attr("autocomplete", "off"), s.attr("spellcheck", "false"), s.wrap('<div class="' + a.classname + '" />'), i = s.closest("." + a.classname), r = t('<span class="message" />').prependTo(i), n = t('<div class="display hidden" />').appendTo(i), f = null, l = 0, s.bind("execute.commandbar", function () {
                return u()
            }), o.bind("suggest.commandbar", function () {
                return s.trigger("suggest.commandbar")
            }), o.bind("loading.commandbar", function (t) {
                return y(t, "loading")
            }), o.bind("message.commandbar", function (t) {
                return g(t)
            }), o.bind("success.commandbar", function (t) {
                return y("" + String.fromCharCode(10004) + " " + t, "success", !0)
            }), o.bind("error.commandbar", function (t) {
                return y("" + String.fromCharCode(10006) + " " + t, "error", !0)
            }), o.bind("submit.commandbar", function () {
                return s.closest("form").submit()
            }), y = function (t, e, n) {
                return r.text(t).show().addClass("visible"), r.removeClass("loading error success").addClass(e), n ? d() : void 0
            }, d = function () {
                return setTimeout(function () {
                    return r.removeClass("visible")
                }, 5e3)
            }, h = function () {
                return r.hide().removeClass("visible loading error success")
            }, v = function () {
                var t, e, a;
                return t = n.find(".selected"), a = function () {
                    return t.position().top < 0
                }, e = function () {
                    return t.position().top + t.outerHeight() > n.height()
                }, a() && n.scrollTop(n.scrollTop() + t.position().top), e() ? n.scrollTop(n.scrollTop() + t.position().top + t.outerHeight() - n.height()) : void 0
            }, m = function () {
                var t;
                return n.find(".selected").removeClass("selected"), -1 === l ? (s.val(s.data("val")), n.removeClass("hidden"), l++) : l >= 0 ? (t = n.find(".choice:nth-child(" + (l + 1) + ")").addClass("selected"), t.length ? (v(), s.val(o.complete(s.data("val"), t.data("command"))), l++) : n.find(".choice:nth-child(" + l + ")").addClass("selected")) : CommandBar.History.exists(-l - 2) ? (s.val(CommandBar.History.get(-l - 2)), l++) : void 0
            }, p = function () {
                var t;
                return n.find(".selected").removeClass("selected"), 1 === l ? (s.val(s.data("val")), l--) : l > 1 ? (t = n.find(".choice:nth-child(" + (l - 1) + ")"), t.addClass("selected"), v(), t.length && s.val(o.complete(s.data("val"), t.data("command"))), l--) : CommandBar.History.exists(-l) ? (n.addClass("hidden"), s.val(CommandBar.History.get(-l)), l--) : void 0
            }, c = function (e) {
                var a, i;
                return e.length || (e = n.find(".choice:first")), e.length ? (null != f && clearTimeout(f), i = s.data("val"), a = t(e).data("command"), s.val(o.complete(i, a)), s.focus().keyup()) : void 0
            }, g = function (t) {
                return n.html(t).show().removeClass("hidden")
            }, u = function () {
                return n.html(""), CommandBar.History.add(s.val()), o.execute(s.val()), s.val(""), $()
            }, r.click(function () {
                return h(), s.focus(), !1
            }), s.focus(function () {
                return clearTimeout(f), i.addClass("focused"), t(this).keyup()
            }), s.blur(function () {
                return f = setTimeout(function () {
                    return i.removeClass("focused"), n.addClass("hidden")
                }, 200)
            }), s.bind("suggest.commandbar", function () {
                var e, i, s, r, c, u, d, h;
                if (l = 0, u = t(this).val(), n.html(""), "" !== u)for (c = o.suggestions(u, a.limit), d = 0, h = c.length; h > d; d++)r = c[d], i = t("<span class=command />"), s = t("<span class=description />"), e = t("<a class=" + r.type + "></a>").attr("data-command", r.command), r.url && e.attr("href", r.url), r.prefix && t("<span class=prefix />").html(r.prefix).appendTo(e), r.display && i.text(r.display).appendTo(e), r.description && s.text(r.description).appendTo(e), e.appendTo(n), r.skip_fuzzy || t.fuzzyHighlight(i[0], u), r.skip_fuzzy || t.fuzzyHighlight(s[0], u);
                return $()
            }), $ = function () {
                return n.is(":empty") ? n.hide().addClass("hidden") : n.show().removeClass("hidden")
            }, s.bind("throttled:input", function () {
                return"" !== s.val() && h(), s.data("val", s.val()), s.trigger("suggest.commandbar")
            }), s.keyup(function (t) {
                switch (t.which) {
                    case e.N:
                    case e.P:
                        return t.ctrlKey ? !1 : s.trigger("suggest.commandbar");
                    case e.ENTER:
                    case e.TAB:
                    case e.CTRL:
                    case e.DOWN:
                    case e.UP:
                    case e:
                        return!1;
                    case e.ESC:
                        return"" === s.val() ? s.blur() : s.val("")
                }
            }), s.keydown(function (t) {
                switch (CommandBar.ctrlKey = t.ctrlKey, CommandBar.metaKey = t.metaKey, CommandBar.shiftKey = t.shiftKey, t.which) {
                    case e.DOWN:
                        return m();
                    case e.UP:
                        return p(), t.preventDefault(), !1;
                    case e.P:
                        if (t.ctrlKey)return p();
                        break;
                    case e.N:
                        if (t.ctrlKey)return m();
                        break;
                    case e.ENTER:
                        return u(), !1;
                    case e.TAB:
                        if ("" !== s.val())return c(n.find(".selected")), !1
                }
            }), n.on("click", ".choice", function () {
                var e;
                return e = t(this), e.attr("href") ? void 0 : (c(e), !1)
            })
        })
    }}, t.fn.commandBar = function (e) {
        return n[e] ? n[e].apply(this, Array.prototype.slice.call(arguments, 1)) : "object" != typeof e && e ? t.error("Method " + e + " does not exists on jQuery.commandBar") : n.init.apply(this, arguments)
    }
}.call(this), function () {
}.call(this), function () {
    var t, e;
    e = null, $.conduit = function (t) {
        var n;
        return n = $.Deferred(), (null != e ? e : e = $("link[rel=conduit-xhr]").prop("href")) ? $.ajax({url: "" + e + t, success: function (t) {
            return n.resolve(t)
        }, error: function () {
            return n.reject()
        }}) : n.reject(), n.promise()
    }, t = null, $.conduit.status = function () {
        return null != t ? t : t = $.conduit("status")
    }, $.conduit.capable = function (t) {
        return $.conduit.status().then(function (e) {
            var n;
            return n = $.Deferred(), -1 !== e.capabilities.indexOf(t) ? n.resolve() : n.reject()
        })
    }
}.call(this), function () {
    var t;
    t = function (t) {
        return $.conduit.capable("url-parameter-filepath").done(function () {
            return $(t).attr("href", $(t).attr("data-url"))
        }).fail(function () {
                return $(t).addClass("disabled").attr("title", $(t).attr("data-failed-title"))
            })
    }, $.pageUpdate(function () {
        return $(this).find(".js-conduit-openfile-check").install(t)
    })
}.call(this), function () {
    var t;
    t = function (t) {
        return $.conduit.status().done(function () {
            return t.href = $(t).attr("data-url")
        })
    }, $.pageUpdate(function () {
        return $(this).find(".js-conduit-rewrite-url").install(t)
    })
}.call(this), function () {
    var t, e, n, a, i, s, r, o;
    n = null, a = null, r = null, o = null, e = function (t) {
        var e;
        return e = $("<img>", {"class": "dots", src: "/images/spinners/octocat-spinner-128.gif"}), $("#contribution-activity-listing").html(e), $.pjax({url: t, container: "#contribution-activity", scrollTo: !1, replace: !0})
    }, i = function (t) {
        var a, i;
        return n = t, a = null, r = null, o = null, i = "" + document.location.pathname + "?tab=contributions&period=" + n, s(), e(i)
    }, s = function (t, e) {
        var n, a;
        return a = $(".calendar-graph"), n = d3.select(".js-calendar-graph").selectAll("rect.day").classed("active", !1), t || e ? (a.addClass("days-selected"), n.filter(function (n) {
            return t && e ? n[0] >= t && n[0] <= e : n[0] === t
        }).classed("active", !0)) : a.removeClass("days-selected")
    }, $(document).on("contributions:range", function (t, c, l) {
        var u, d, h, f, m, p, g, v, $, y;
        return null == l && (l = !1), g = "" + document.location.pathname + "?tab=contributions", c >= r && o >= c ? (i("weekly"), void 0) : ("object" == typeof l && (a = l, l = !0), a && l ? (m = moment(a).clone().subtract("days", 31).toDate(), f = moment(a).clone().add("days", 31).toDate(), v = c > a ? [a, c] : [c, a], h = v[0], p = v[1], m > h && (h = m), p > f && (p = f), $ = [h, p], r = $[0], o = $[1], u = moment(h).format("YYYY-MM-DD"), d = moment(p).format("YYYY-MM-DD"), g += "&from=" + u + "&to=" + d) : (h = c, y = [h, null], r = y[0], o = y[1], u = moment(h).format("YYYY-MM-DD"), g += "&from=" + u), a = c, n = "custom", s(h, p), e(g))
    }), $(document).on("change", ".js-period-container", function (t) {
        var e;
        return t.preventDefault(), t.stopPropagation(), e = $(t.target).val().toLowerCase(), n !== e ? i(e) : void 0
    }), $(t = function () {
        var t;
        return t = $(".popular-repos .col").height() - 20, $(".popular-repos .capped-box").css("height", "" + t + "px")
    })
}.call(this), function () {
    var t, e;
    $(document).on("submit", ".js-find-coupon-form", function (t) {
        var e, n;
        return e = t.target.action, n = $("#code").val(), window.location = e + "/" + n, t.stopPropagation(), t.preventDefault()
    }), $(document).on("click", ".js-choose-account", function (e) {
        return $(".js-plan-row, .js-choose-plan").removeClass("selected"), $(".js-plan").val(""), $(".js-billing-section").addClass("is-hidden"), Billing.displayCreditCardFields(!1), $(".js-redeem-button").attr("disabled", !0), t($(this).closest(".js-account-row")), e.stopPropagation(), e.preventDefault()
    }), $(document).on("click", ".js-choose-plan", function (t) {
        return e($(this).closest(".js-plan-row")), t.stopPropagation(), t.preventDefault()
    }), t = function (t) {
        var n, a;
        if (t.length)return a = t.data("login"), $(".js-account-row, .js-choose-account").removeClass("selected"), t.addClass("selected"), t.find(".js-choose-account").addClass("selected"), $(".js-account").val(a), $(".js-plan-section").removeClass("is-hidden"), $(".js-billing-plans").addClass("is-hidden"), $(".js-plans-for-" + a).removeClass("is-hidden"), n = $(".js-plans-for-" + a + " .js-plan-row"), 1 === n.length ? e(n) : void 0
    }, e = function (t) {
        var e, n, a;
        if (t.length)return a = t.data("name"), n = t.closest(".js-billing-plans").data("has-billing"), e = parseInt(t.data("cost"), 10), $(".js-plan-row, .js-choose-plan").removeClass("selected"), t.addClass("selected"), t.find(".js-choose-plan").addClass("selected"), $(".js-plan").val(a), 0 === e || n ? ($(".js-billing-section").addClass("is-hidden"), Billing.displayCreditCardFields(!1)) : ($(".js-billing-section").removeClass("is-hidden"), Billing.displayCreditCardFields(!0)), $(".js-redeem-button").attr("disabled", !1)
    }, $(function () {
        return t($(".coupons .js-account-row.selected")), e($(".coupons .js-plan-row.selected"))
    })
}.call(this), function () {
    $(document).on("click", ".js-git-protocol-selector", function () {
        var t, e, n;
        return t = $(this).closest(".url-box"), n = $(this).attr("href"), e = $(this).attr("data-permission"), t.find(".js-url-field").val(n), t.find(".js-zeroclipboard").attr("data-clipboard-text", n), t.find(".js-clone-url-permission").text(e), $(".js-live-clone-url").text(n), (n = $(this).attr("data-url")) && $.ajax({type: "POST", url: n}), t.find(".js-clone-urls > .selected").removeClass("selected"), $(this).parent(".js-clone-url-button").addClass("selected"), !1
    }), $(document).on("mouseup", ".js-url-field", function () {
        return $(this).select()
    }), $(document).on("click", ".js-clone-selector", function (t) {
        var e, n, a, i;
        return t.preventDefault(), e = $(this).attr("data-protocol"), i = $(".clone-url").hide(), n = i.filter('[data-protocol-type="' + e + '"]').show(), (a = n.attr("data-url")) ? $.ajax({type: "POST", url: a}) : void 0
    })
}.call(this), $.pageUpdate(function () {
    $("#edit_repo").length > 0 && ($(".site").is(".vis-public") ? $(".private-only").hide() : $(".public-only").hide())
}), function () {
    $(document).on("change", "#repo-settings #change_default_branch", function () {
        var t = $(this), e = t.find("select");
        currentDefaultBranch = e.val(), t.removeClass("success").removeClass("error").addClass("loading"), $.ajax({type: "PUT", url: t.closest("form").attr("action"), data: {field: "repository_master_branch", value: e.val()}, success: function () {
            t.removeClass("loading").addClass("success")
        }, error: function () {
            e.val(currentDefaultBranch), t.removeClass("loading").addClass("error")
        }})
    }), $(document).on("change", ".addon.feature :checkbox", function () {
        var t = this, e = $(this).closest(".addon");
        e.removeClass("success").removeClass("error").addClass("loading"), $.ajax({type: "PUT", url: e.closest("form").attr("action"), data: {field: t.name, value: t.checked ? 1 : 0}, success: function () {
            e.removeClass("loading").addClass("success")
        }, error: function () {
            t.checked = !t.checked, e.removeClass("loading").addClass("error")
        }})
    });
    var t = null;
    $(document).on("autocomplete:search", "#push_pull_collabs input[data-autocomplete]", function () {
        t && t.abort();
        var e = $(this).val();
        return"" === e ? ($("#add-user-autocomplete ul").empty(), $("#add-user-autocomplete").trigger("autocomplete:change"), void 0) : (t = $.ajax({type: "GET", data: {q: e}, url: "/autocomplete/users", dataType: "html", success: function (e) {
            t = null, $("#add-user-autocomplete ul").html(e), $("#add-user-autocomplete").trigger("autocomplete:change")
        }}), void 0)
    }), $(document).on("autocomplete:autocompleted:changed", "#push_pull_collabs input[data-autocomplete]", function () {
        var t = $(this).closest("form").find("button[type=submit]");
        $(this).attr("data-autocompleted") ? t.removeAttr("disabled") : t.attr("disabled", "disabled")
    }), $(document).on("submit", "#push_pull_collabs form", function () {
        var t = $(this).find(":text"), e = t.val();
        if (debug("Trying to add %s...", e), !e || !t.attr("data-autocompleted"))return!1;
        var n = function (t) {
            null != t ? $("#push_pull_collabs .error").text(t).show() : $("#push_pull_collabs .error").hide()
        };
        return n(), $.ajax({url: this.action, data: {member: e}, type: "POST", dataType: "json", success: function (e) {
            t.val(""), e.error ? n(e.error) : $("#push_pull_collabs ul.usernames").append(e.html)
        }, error: function () {
            n("An unidentified error occurred, try again?")
        }}), !1
    }), $(document).on("click", "#push_pull_collabs .remove-user", function () {
        return $.ajax({type: "DELETE", url: this.href}), $(this).closest("li").remove(), !1
    }), $(document).on("submit", "#repo-settings #teams form", function () {
        var t = $(this).find("select"), e = t.val(), n = function (t) {
            null != t ? $("#push_pull_collabs .error").text(t).show() : $("#push_pull_collabs .error").hide()
        };
        return"" == e ? (n("You must select a team"), !1) : (n(), $.ajax({url: this.action, data: {team: e}, type: "POST", dataType: "json", success: function (e) {
            t.val(""), e.error ? n(e.error) : $("#teams ul.teams").append(e.html)
        }, error: function () {
            n("An unidentified error occurred, try again?")
        }}), !1)
    }), $(document).on("click", "#repo-settings #custom_tabs .remove-tab", function () {
        return $.ajax({type: "DELETE", url: this.href}), $(this).closest("li").remove(), !1
    })
}(), function () {
    $(document).on("click", ".email-hidden-toggle > a", function () {
        return $(this).parent().siblings(".email-hidden-reply").toggle(), !1
    })
}.call(this), function () {
    var t, e, n, a, i, s, r, o, c, l;
    c = 721, e = 110, l = [20, 0, 0, 20], s = l[0], i = l[1], n = l[2], a = l[3], t = 13, r = 2, o = function (t) {
        var e, n, a, i, s;
        if (a = t.length, 1 > a)return 0 / 0;
        if (1 === a)return 0;
        for (n = d3.mean(t), e = -1, i = 0; ++e < a;)s = t[e] - n, i += s * s;
        return i / (a - 1)
    }, $(document).on("graph:load", ".js-calendar-graph", function (n, i) {
        var l, u, d, h, f, m, p, g, v, y, b, j, x, w, C, k, _, S, T, D, A, M, P, B, E, F, U, q, I, R;
        for (l = $(this), f = l.attr("data-from"), f && (f = C = moment(f).toDate()), M = l.attr("data-to"), M && (M = moment(M).toDate()), i || (i = []), i = i.map(function (t) {
            return[new Date(t[0]), t[1]]
        }).sort(function (t, e) {
                return d3.ascending(t[0], e[0])
            }), u = 3.77972616981, x = i.map(function (t) {
            return t[1]
        }), T = Math.sqrt(o(x)), y = d3.mean(x), S = 3, p = d3.max(x), P = v - y, (6 > P || 15 > p) && (S = 1), w = 0; S > w;)B = x.filter(function (t) {
            var e;
            return e = Math.abs((y - t) / T), e > u
        }), B.length > 0 ? (B = B[0], x = x.filter(function (t) {
            return t !== B
        }), 0 === w && (g = x)) : B = null, w += 1;
        return v = d3.max(x), k = ["#d6e685", "#8cc665", "#44a340", "#1e6823"], m = d3.scale.quantile().domain([0, v]).range(k), h = d3.time.format("%w"), R = d3.time.format("%Y%U"), I = d3.time.format("%m-%y"), b = d3.time.format("%b"), U = {}, j = {}, i.forEach(function (t) {
            var e;
            return e = R(t[0]), U[e] || (U[e] = []), U[e].push(t)
        }), U = d3.entries(U), U.forEach(function (t) {
            var e;
            return e = I(t.value[0][0]), j[e] || (j[e] = [t.value[0][0], 0]), j[e][1] += 1
        }), j = d3.entries(j).sort(function (t, e) {
            return d3.ascending(t.value[0], e.value[0])
        }), A = d3.tip().attr("class", "svg-tip").offset([-10, 0]).html(function (t) {
            var e;
            return e = 0 === t[1] ? "No" : t[1], "<strong>" + e + " " + $.pluralize(t[1], "contribution") + "</strong> on " + moment(t[0]).format("MMMM Do YYYY")
        }), E = d3.select(this).append("svg").attr("width", c).attr("height", e).attr("id", "calendar-graph").append("g").attr("transform", "translate(" + a + ", " + s + ")").call(A), F = 0, D = (new Date).getFullYear(), q = E.selectAll("g.week").data(U).enter().append("g").attr("transform", function (e, n) {
            var a;
            return a = e.value[0][0], a.getFullYear() === D && 0 !== a.getDay() && 0 === F && (F = -1), "translate(" + (n + F) * t + ", 0)"
        }), _ = q.selectAll("rect.day").data(function (t) {
            return t.value
        }).enter().append("rect").attr("class", "day").attr("width", t - r).attr("height", t - r).attr("y",function (e) {
                return h(e[0]) * t
            }).style("fill",function (t) {
                return 0 === t[1] ? "#eee" : m(t[1])
            }).on("click",function (t) {
                return $(document).trigger("contributions:range", [t[0], d3.event.shiftKey])
            }).on("mouseover", A.show).on("mouseout", A.hide), d = 0, E.selectAll("text.month").data(j).enter().append("text").attr("x",function (e) {
            var n;
            return n = t * d, d += e.value[1], n
        }).attr("y", -5).attr("class", "month").style("display",function (t) {
                return t.value[1] <= 2 ? "none" : void 0
            }).text(function (t) {
                return b(t.value[0])
            }), E.selectAll("text.day").data(["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]).enter().append("text").style("display",function (t, e) {
            return 0 === e % 2 ? "none" : void 0
        }).attr("text-anchor", "middle").attr("class", "wday").attr("dx", -10).attr("dy",function (e, n) {
                return s + ((n - 1) * t + r)
            }).text(function (t) {
                return t[0]
            }), f || M ? $(document).trigger("contributions:range", [f, M]) : void 0
    })
}.call(this), function () {
    $(document).on("graph:load", ".js-graph-code-frequency", function (t, e) {
        var n, a, i, s, r, o, c, l, u, d, h, f, m, p, g, v, y, b, j;
        return p = $(this).width(), s = 500, j = [10, 10, 20, 40], d = j[0], u = j[1], c = j[2], l = j[3], e = e.map(function (t) {
            return[new Date(1e3 * t[0]), t[1], t[2]]
        }).sort(function (t, e) {
                return d3.ascending(t[0], e[0])
            }), n = e.map(function (t) {
            return[t[0], t[1]]
        }), i = e.map(function (t) {
            return[t[0], t[2]]
        }), r = d3.max(n, function (t) {
            return t[1]
        }), o = d3.min(i, function (t) {
            return t[1]
        }), m = e[0][0], f = e[e.length - 1][0], g = d3.time.scale().domain([m, f]).range([0, p - l - u]), y = d3.scale.linear().domain([o, r]).range([s - c - d, 0]), v = d3.svg.axis().scale(g).tickFormat(function (t) {
            return m.getFullYear() !== f.getFullYear() ? d3.time.format("%m/%y")(t) : d3.time.format("%m/%d")(t)
        }), b = d3.svg.axis().scale(y).orient("left").tickPadding(5).tickSize(p).tickFormat(function (t) {
            return d3.formatSymbol(t, !0)
        }), a = d3.svg.area().x(function (t) {
            return g(t[0])
        }).y0(function (t) {
                return y(t[1])
            }).y1(function () {
                return y(0)
            }), h = d3.select(this).data(e).append("svg").attr("width", p).attr("height", s).attr("class", "viz code-frequency").append("g").attr("transform", "translate(" + l + "," + d + ")"), h.append("g").attr("class", "x axis").attr("transform", "translate(0, " + (s - d - c) + ")").call(v), h.append("g").attr("class", "y axis").attr("transform", "translate(" + p + ", 0)").call(b), h.selectAll("path.area").data([n, i]).enter().append("path").attr("class",function (t, e) {
            return 0 === e ? "addition" : "deletion"
        }).attr("d", a)
    })
}.call(this), function () {
    $(document).on("graph:load", ".js-commit-activity-graph", function (t, e) {
        var n, a, i, s, r, o, c, l, u, d, h, f, m, p, g, v, y, b, j, x, w;
        return c = $("#commit-activity-master"), a = $("#commit-activity-detail"), r = 260, g = a.width(), v = 0, function () {
            var t, n, s, o, c, l, u, d, h, f, m, p, y, b, j, x, w, C, k, _, S;
            for (l = 0, c = k = 0, _ = e.length; _ > k; c = ++k)t = e[c], 0 !== t.total && (l = c);
            return v = l, S = [20, 30, 30, 40], m = S[0], h = S[1], f = S[2], d = S[3], s = e[v].days, u = d3.max(e, function (t) {
                return d3.max(t.days)
            }), j = d3.scale.linear().domain([0, s.length - 1]).range([0, g - h - f]), w = d3.scale.linear().domain([0, u]).range([r, 0]), C = d3.svg.axis().scale(w).orient("left").ticks(5).tickSize(-g + f + h), $(document).on("gg.week.selected", function (t, e) {
                return y(e)
            }), $(document).on("keyup", function (t) {
                var n, a;
                return n = v, 37 === (a = t.keyCode) || 39 === a ? (v > 0 && 37 === t.keyCode && (n -= 1), v < e.length && 39 === t.keyCode && (n += 1), y({index: n})) : void 0
            }), b = d3.select(a[0]).data([s]).append("svg").attr("width", g).attr("height", r + m + d).attr("class", "viz").append("g").attr("transform", "translate(" + h + "," + m + ")"), b.append("g").attr("class", "y axis").call(C), x = b.append("g").attr("class", "axis"), n = x.selectAll(".day").data(d3.weekdays).enter().append("g").attr("class", "day").attr("transform", function (t, e) {
                return"translate(" + j(e) + ", " + r + ")"
            }), n.append("text").attr("text-anchor", "middle").attr("dy", "2em").text(function (t) {
                return t
            }), p = d3.svg.line().interpolate("cardinal").x(function (t, e) {
                return j(e)
            }).y(w), b.append("path").attr("class", "path").attr("d", p), o = b.selectAll("g.dot").data(s).enter().append("g").attr("class", "dot").attr("transform", function (t, e) {
                return"translate(" + j(e) + ", " + w(t) + ")"
            }), o.append("circle").attr("r", 4), o.append("text").attr("text-anchor", "middle").attr("class", "tip").attr("dy", -10).text(function (t) {
                return t
            }), y = function (t) {
                var n, a, r;
                if (!(t.index > 52 || t.index < 0))return v = t.index, s = e[t.index].days, u = d3.max(s), j.domain([0, s.length - 1]), r = d3.selectAll(".bar.mini").attr("class", "bar mini"), n = d3.select(r[0][v]).attr("class", "bar mini active"), a = d3.transform(n.attr("transform")), i.transition().ease("back-out").duration(300).attr("transform", "translate(" + (a.translate[0] + 8) + ", 105)"), b.selectAll(".path").data([s]).transition().duration(500).attr("d", p), b.selectAll("g.dot").data(s).transition().duration(300).attr("transform", function (t, e) {
                    return"translate(" + j(e) + ", " + w(t) + ")"
                }), b.selectAll("text.tip").data(s).text(function (t) {
                    return t
                })
            }
        }(), w = [10, 30, 20, 30], h = w[0], u = w[1], d = w[2], l = w[3], r = 100, m = e.map(function (t) {
            return t.total
        }), o = d3.max(m), s = d3.time.format("%m/%d"), y = d3.scale.ordinal().domain(d3.range(m.length)).rangeRoundBands([0, g - u - d], .1), j = d3.scale.linear().domain([0, o]).range([r, 0]), x = d3.svg.axis().scale(j).orient("left").ticks(3).tickSize(-g + u + d).tickFormat(d3.formatSymbol), b = d3.svg.axis().scale(y).ticks(d3.time.weeks).tickFormat(function (t, n) {
            var a;
            return a = new Date(1e3 * e[n].week), s(a)
        }), f = d3.tip().attr("class", "svg-tip").offset([-10, 0]).html(function (t, n) {
            var a;
            return a = moment(1e3 * e[n].week), "<strong>" + t + "</strong> " + $.pluralize(t, "commit") + " the week of " + a.format("MMMM Do")
        }), p = d3.select(c[0]).style("width", "" + g + "px").append("svg").attr("width", g + (u + d)).attr("height", r + h + l).attr("class", "viz").append("g").attr("transform", "translate(" + u + "," + h + ")").call(f), p.append("g").attr("class", "y axis").call(x), n = p.selectAll("g.mini").data(m).enter().append("g").attr("class",function (t, e) {
            return e === v ? "bar mini active" : "bar mini"
        }).attr("transform",function (t, e) {
                return"translate(" + y(e) + ", 0)"
            }).on("click", function (t, e) {
                return $(document).trigger("gg.week.selected", {node: this, index: e, data: t})
            }), n.append("rect").attr("width", y.rangeBand()).attr("height",function (t) {
            return r - j(t)
        }).attr("y",function (t) {
                return j(t)
            }).on("mouseover", f.show).on("mouseout", f.hide), p.append("g").attr("class", "x axis").attr("transform", "translate(0," + r + ")").call(b).selectAll(".tick").style("display", function (t, e) {
            return 0 !== e % 3 ? "none" : "block"
        }), i = p.append("circle").attr("class", "focus").attr("r", 8).attr("transform", "translate(" + (y(v) + y.rangeBand() / 2) + ", " + -r + ")"), i.transition().ease("elastic-in").duration(1e3).attr("r", 2).attr("transform", "translate(" + (y(v) + y.rangeBand() / 2) + ", " + (r + 5) + ")")
    })
}.call(this), function () {
    var t, e, n, a, i;
    t = d3.time.format("%Y-%m-%d"), n = function (t) {
        return new Date(1e3 * ~~t)
    }, a = function () {
        var t, e, n, a, i, s, r, o;
        for (n = {}, r = document.location.search.substr(1).split("&"), i = 0, s = r.length; s > i; i++)e = r[i], o = e.split("="), t = o[0], a = o[1], n[t] = a;
        return n
    }, i = function (t, e) {
        var n, a, i, s;
        return i = "MMMM Do YYYY", s = moment(t).format(i), a = moment(e).format(i), n = $("#js-date-range").attr("data-default-branch"), $("#js-date-range").html("" + s + " <span class='dash'>&dash;</span> " + a + "    <p class='info'>Commits to " + n + ", excluding merge commits</p>")
    }, e = function (t) {
        var e, n;
        return e = moment(t[0].weeks[0].date), n = e.subtract("weeks", 1), t.forEach(function (t) {
            return t.weeks.unshift({a: 0, c: 0, d: 0, date: n.toDate(), w: n / 1e3})
        })
    }, $(document).on("graph:load", "#contributors", function (s, r) {
        var o, c, l, u, d, h, f, m, p, g, v, y, b, j, x, w, C;
        return c = $(this), l = [], m = a(), C = null, w = null, null != m.from && (b = moment(m.from).toDate()), null != m.to && (d = moment(m.to).toDate()), u = (null != m ? m.type : void 0) || "c", c.on("range.selection.end", function (e, n) {
            var a;
            return a = n.range, b = a[0], d = a[1], t(b) === t(d) && (b = C, d = w), x(), i(b, d), v()
        }), g = function (t) {
            var a;
            return 1 === t[0].weeks.length && e(t), a = o(t), C = n(a[0].key), w = n(a[a.length - 1].key), null == b && (b = C), null == d && (d = w), i(b, d), y(a, C, w), v(t, C, w), $(".js-contribution-container").on("change", "input[type=radio]", f)
        }, p = function (t) {
            var e, n, a, i, s, r, o;
            for (a = 0, s = t.length; s > a; a++)for (e = t[a], o = e.weeks, i = 0, r = o.length; r > i; i++)n = o[i], n.date = new Date(1e3 * n.w);
            return t
        }, h = function (t, e) {
            return t.map(function (t) {
                var n;
                return n = $.extend(!0, {}, t), n.weeks = n.weeks.filter(function (t) {
                    return t.date >= e[0] && t.date <= e[1]
                }), n
            })
        }, o = function (t) {
            var e, n, a, i, s, r, o, c, l, u;
            for (n = {}, i = 0, r = t.length; r > i; i++)for (e = t[i], l = e.weeks, s = 0, o = l.length; o > s; s++)a = l[s], null == (u = n[c = a.w]) && (n[c] = {c: 0, a: 0, d: 0}), n[a.w].c += a.c, n[a.w].a += a.a, n[a.w].d += a.d;
            return d3.entries(n)
        }, j = function (t) {
            return t = h(t, [b, d]), t.forEach(function (t) {
                var e, n, a, i, s, r, o;
                for (n = 0, e = 0, a = 0, o = t.weeks, s = 0, r = o.length; r > s; s++)i = o[s], n += i.c, e += i.a, a += i.d;
                return t.c = n, t.a = e, t.d = a
            }), t.sort(function (t, e) {
                return d3.descending(t[u], e[u])
            })
        }, y = function (e, a, i) {
            var s, r, o, l, h, f, m, p, g, v, $, y, j, x, w, C, k, _;
            return _ = [20, 50, 20, 30], p = _[0], f = _[1], m = _[2], h = _[3], j = c.width(), o = 125, l = d3.max(e, function (t) {
                return t.value[u]
            }), x = d3.time.scale().domain([a, i]).range([0, j - f - m]), C = d3.scale.linear().domain([0, l]).range([o, 0]), k = d3.svg.axis().scale(C).orient("left").ticks(4).tickSize(-j + f + m).tickPadding(10).tickFormat(d3.formatSymbol), w = d3.svg.axis().scale(x), e.length < 5 && w.ticks(e.length), s = d3.svg.area().interpolate("basis").x(function (t) {
                return x(n(t.key))
            }).y0(function () {
                    return o
                }).y1(function (t) {
                    return C(t.value[u])
                }), d3.select("#contributors-master svg").remove(), y = d3.select("#contributors-master").data([e]).append("svg").attr("height", o + p + h).attr("width", j).attr("class", "viz").append("g").attr("transform", "translate(" + f + "," + p + ")"), y.append("g").attr("class", "x axis").attr("transform", "translate(0, " + o + ")").call(w), y.append("g").attr("class", "y axis").call(k), y.append("path").attr("class", "area").attr("d", s), $ = function () {
                var t;
                return y.classed("selecting", !0), t = d3.event.target.extent(), c.trigger("range.selection.start", {data: arguments[0], range: t})
            }, g = function () {
                var t, e;
                return t = d3.time.format("%m/%d/%Y"), e = d3.event.target.extent(), c.trigger("range.selection.selected", {data: arguments[0], range: e})
            }, v = function () {
                var t;
                return y.classed("selecting", !d3.event.target.empty()), t = d3.event.target.extent(), c.trigger("range.selection.end", {data: arguments[0], range: t})
            }, r = d3.svg.brush().x(x).on("brushstart", $).on("brush", g).on("brushend", v), (t(b) !== t(a) || t(d) !== t(i)) && r.extent([b, d]), y.append("g").attr("class", "selection").call(r).selectAll("rect").attr("height", o)
        }, v = function () {
            var t, e, n, a, i, s, o, c, h, f, m, p, g, v, y, x, w, C, k, _, S;
            return S = [10, 10, 10, 20], h = S[0], o = S[1], c = S[2], s = S[3], y = 428, n = 100, $("#contributors ol").remove(), r = j(l), v = d3.select("#contributors").append("ol").attr("class", "contrib-data clearfix"), i = d3.max(r, function (t) {
                return d3.max(t.weeks, function (t) {
                    return t[u]
                })
            }), x = d3.time.scale().domain([b, d]).range([0, y]), C = d3.scale.linear().domain([0, i]).range([n - s - h, 0]), e = d3.svg.area().interpolate("basis").x(function (t) {
                return x(t.date)
            }).y0(function () {
                    return n - s - h
                }).y1(function (t) {
                    return C(t[u])
                }), k = d3.svg.axis().scale(C).orient("left").ticks(2).tickSize(-y).tickPadding(10).tickFormat(d3.formatSymbol), p = d3.time.format("%m/%y"), w = d3.svg.axis().scale(x).tickFormat(p), r[0].weeks.length < 5 && w.ticks(r[0].weeks.length).tickFormat(d3.time.format("%x")), $("li.person").remove(), f = v.selectAll("li.person").data(r).enter().append("li").attr("class", "person").style("display", function (t) {
                return t[u] < 1 ? "none" : "block"
            }), a = f.append("h3"), a.append("img").attr("src",function (t) {
                return t.author.avatar
            }).attr("class", "avatar"), a.append("span").attr("class", "rank").text(function (t, e) {
                return"#" + (e + 1)
            }), a.append("a").attr("class", "aname").attr("href",function (t) {
                return"/" + t.author.login
            }).text(function (t) {
                    return t.author.login
                }), t = a.append("span").attr("class", "ameta"), m = $(".graphs").attr("data-repo-url"), t.append("span").attr("class", "cmeta").html(function (t) {
                return"<a class='cmt' href='" + m + "/commits?author=" + t.author.login + "'>" + $.commafy(t.c) + " " + $.pluralize(t.c, "commit") + "</a> / <span class='a'>" + $.commafy(t.a) + " ++</span> / <span class='d'>" + $.commafy(t.d) + " --</span>"
            }), g = f.append("svg").attr("width", y + (o + c)).attr("height", n + h + s).attr("class", "spark").append("g").attr("transform", "translate(" + o + "," + h + ")"), g.append("g").attr("class", "x axis").attr("transform", "translate(0, " + (n - h - s) + ")").call(w).selectAll(".tick text").style("display", function (t, e) {
                return 0 !== e % 2 ? "none" : "block"
            }), _ = g.append("g").attr("class", "y axis").call(k).selectAll(".y.axis g text").attr("dx", y / 2).style("display",function (t, e) {
                return 0 === e ? "none" : "block"
            }).classed("midlabel", !0), g.append("path").attr("d", function (t) {
                return e(t.weeks)
            })
        }, x = function () {
            var e, n;
            return $.support.pjax ? (e = document.location, u = $("input[name=ctype]:checked").prop("value").toLowerCase(), n = "" + e.pathname + "?from=" + t(b) + "&to=" + t(d) + "&type=" + u, window.history.pushState(null, null, n)) : void 0
        }, f = function () {
            return u !== $(this).val() ? (x(), g(l)) : void 0
        }, l = p(r), g(r)
    })
}.call(this), function () {
    d3.formatSymbol = function (t, e) {
        var n;
        return null == e && (e = !1), e && (t = Math.abs(t)), 1e3 > t ? t : (n = d3.formatPrefix(t), "" + n.scale(t) + n.symbol)
    }, d3.weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
}.call(this), function () {
    var t, e;
    t = {}, e = function (e) {
        var n, a, i;
        return n = $(e), (i = n.attr("data-url")) ? (n.find("svg").remove(), (a = t[i]) ? n.fire("graph:load", [a]) : (n.addClass("is-graph-loading"), n.removeClass("is-graph-crunching is-graph-load-error is-graph-empty"), $.smartPoller(function (e) {
            return $.ajax({url: i, success: function (a, s, r) {
                var o, c;
                return 202 === r.status ? (n.addClass("is-graph-crunching"), e()) : (n.removeClass("is-graph-loading is-graph-crunching"), 0 === (null != a ? a.length : void 0) || 0 === (null != (o = a[0]) ? null != (c = o.weeks) ? c.length : void 0 : void 0) ? n.addClass("is-graph-empty") : (t[i] = a, n.fire("graph:load", [a])))
            }, error: function () {
                return n.removeClass("is-graph-loading is-graph-crunching"), n.addClass("is-graph-load-error")
            }})
        }))) : void 0
    }, $.pageUpdate(function () {
        var t, n, a, i;
        for (i = $(this).find(".js-graph"), n = 0, a = i.length; a > n; n++)t = i[n], e(t)
    })
}.call(this), function () {
    $(document).on("graph:load", ".js-milestone-graph", function (t, e) {
        var n, a, i, s, r, o, c, l, u, d, h, f, m, p, g, v, y, b, j, x, w, C, k, _, S, T, D, A, M;
        for (j = $(this).width(), h = 50, A = [10, 20, 10, 30], g = A[0], p = A[1], f = A[2], m = A[3], i = 100, M = [60, 20, 10, 30], u = M[0], l = M[1], o = M[2], c = M[3], x = d3.scale.ordinal().rangeRoundBands([0, j - c - l], .1), C = d3.scale.linear().range([i, 0]), _ = d3.scale.linear().range([i, 0]), S = d3.scale.linear().range([h, 0]), w = d3.svg.axis().scale(x).orient("top").tickSize(5).tickPadding(10).tickFormat(function (t) {
            return moment(e[t].date).format("M/D")
        }), k = d3.svg.axis().scale(C).orient("left").tickSize(-j + c + l).tickFormat(Math.abs).ticks(4), d = d3.svg.line().x(function (t, e) {
            return x(e)
        }).y(function (t) {
                return S(t.events)
            }).interpolate("cardinal"), v = d3.select(this).append("svg").attr("width", j).attr("height", h + g + f).attr("id", "total-events").append("g").attr("transform", "translate(" + m + ", " + g + ")"), b = d3.select(this).append("svg").attr("id", "graph-open-close").attr("height", i + u + o).append("g").attr("transform", "translate(" + c + ", " + u + ")"), T = 0, D = e.length; D > T; T++)a = e[T], a.date = new Date(a.date), a.closed = -a.closed;
        return r = d3.min(e, function (t) {
            return t.closed
        }), s = d3.max(e, function (t) {
            return t.open + t.reopened
        }), C.domain([r - 1, s + 1]), x.domain(d3.range(e.length)), S.domain([0, d3.max(e, function (t) {
            return t.events
        })]), _.domain([0, d3.max(e, function (t) {
            return t.open_total
        })]), b.append("rect").attr("class", "axis-backing").attr("width", j).attr("height", 30).attr("x", -c).attr("y", -u), b.append("line").attr("class", "axis-backing-line").attr("x1", -c).attr("x2", j).attr("y1", -u + 30).attr("y2", -u + 30), b.append("g").attr("class", "x axis").attr("transform", "translate(0, -25)").call(w).selectAll("g").style("display", function (t, e) {
            return 0 === e % 4 ? "block" : "none"
        }), b.append("g").attr("class", "y axis").call(k), b.selectAll(".y g").filter(function (t) {
            return 0 === t
        }).classed("zero", !0), n = b.selectAll("g.bar").data(e).enter().append("g").attr("class", "bar").attr("transform", function (t, e) {
            return"translate(" + x(e) + ", 0)"
        }), n.selectAll("rect.day").data(function (t) {
            return[t.open + t.reopened, t.closed]
        }).enter().append("rect").attr("width", x.rangeBand()).attr("height",function (t) {
                return Math.abs(C(t) - C(0))
            }).attr("y",function (t) {
                return C(Math.max(0, t))
            }).attr("class", function (t, e) {
                return 0 === e ? "opened" : "closed"
            }), y = v.append("g").attr("class", "x axis").attr("transform", "translate(0, " + (h + 10) + ")").call(w).selectAll("g").style("display", function (t, e) {
            return 0 === e % 4 ? "block" : "none"
        }), y.selectAll("g text").style("display", "none"), v.selectAll("path.events").data([e]).enter().append("path").attr("class", "events").attr("d", d), v.append("text").text("ACTIVITY").attr("text-anchor", "middle").attr("x",function () {
            return j / 2 - this.getBBox().width / 2
        }).attr("y", h / 2).attr("class", "activity-label")
    })
}.call(this);
var Network = defineNetwork(window.jQuery);
$(function () {
    $("#ng")[0] && new Network("#ng", 920, 600)
}), function () {
    GitHub.ParticipationGraph = function () {
        function t(e) {
            var n, a, i, s, r, o, c, l = this;
            this.onSuccess = function () {
                return t.prototype.onSuccess.apply(l, arguments)
            }, this.el = $(e), this.canvas = e.getContext("2d"), i = window.devicePixelRatio || 1, a = this.canvas.webkitBackingStorePixelRatio || this.canvas.mozBackingStorePixelRatio || this.canvas.msBackingStorePixelRatio || this.canvas.oBackingStorePixelRatio || this.canvas.backingStorePixelRatio || 1, o = i / a, 1 !== o && (c = e.width, s = e.height, e.width = c * o, e.height = s * o, e.style.width = c + "px", e.style.height = s + "px", this.canvas.scale(o, o)), n = this.el.data("color-all"), r = this.el.data("color-owner"), null != n && (this.colors.all = n), null != r && (this.colors.owner = r), this.barMaxHeight = this.el.height(), this.barWidth = (this.el.width() - 52) / 52, this.refresh()
        }

        return t.prototype.colors = {all: "#cacaca", owner: "#336699"}, t.prototype.getUrl = function () {
            return this.el.data("source")
        }, t.prototype.setData = function (t) {
            var e, n;
            this.data = t, (null == (null != (e = this.data) ? e.all : void 0) || null == (null != (n = this.data) ? n.owner : void 0)) && (this.data = null), this.scale = this.getScale(this.data)
        }, t.prototype.getScale = function (t) {
            var e, n, a, i, s;
            if (null != t) {
                for (e = t.all[0], s = t.all, a = 0, i = s.length; i > a; a++)n = s[a], n > e && (e = n);
                return e >= this.barMaxHeight ? (this.barMaxHeight - .1) / e : 1
            }
        }, t.prototype.refresh = function () {
            $.ajax({url: this.getUrl(), dataType: "json", success: this.onSuccess})
        }, t.prototype.onSuccess = function (t) {
            this.setData(t), this.draw()
        }, t.prototype.draw = function () {
            null != this.data && (this.drawCommits(this.data.all, this.colors.all), this.drawCommits(this.data.owner, this.colors.owner))
        }, t.prototype.drawCommits = function (t, e) {
            var n, a, i, s, r, o, c, l;
            for (i = c = 0, l = t.length; l > c; i = ++c)n = t[i], s = this.barWidth, a = n * this.scale, r = i * (this.barWidth + 1), o = this.barMaxHeight - a, this.canvas.fillStyle = e, this.canvas.fillRect(r, o, s, a)
        }, t
    }(), $.pageUpdate(function () {
        return $(this).find(".participation-graph").each(function () {
            return $(this).is(":hidden") ? ($(this).removeClass("disabled"), new GitHub.ParticipationGraph($(this).find("canvas")[0])) : void 0
        })
    })
}.call(this), function () {
    $(document).on("graph:load", ".js-pulse-authors-graph", function (t, e) {
        var n, a, i, s, r, o, c, l, u, d, h, f, m, p, g;
        return n = 15, e = e.slice(0, +(n - 1) + 1 || 9e9), h = $(this).width(), i = $(this).height(), g = [20, 0, 10, 20], l = g[0], c = g[1], r = g[2], o = g[3], f = d3.scale.ordinal().rangeRoundBands([0, h - o - c], .2), m = d3.scale.linear().range([i, 0]), p = d3.svg.axis().scale(m).orient("left").ticks(3).tickSize(-h + o + c).tickFormat(d3.formatSymbol), s = d3.max(e, function (t) {
            return t.commits
        }), m.domain([0, s]), f.domain(d3.range(n)), r = f.rangeBand() + r, u = d3.tip().attr("class", "svg-tip").offset([-10, 0]).html(function (t) {
            var e;
            return"<strong>" + t.commits + "</strong> " + $.pluralize(t.commits, "commit") + " by <strong>" + (null != (e = t.login) ? e : t.name) + "</strong>"
        }), d = d3.select(this).append("svg").attr("id", "graph-pulse-authors").attr("height", i + l + r).append("g").attr("transform", "translate(" + o + ", " + l + ")").call(u), d.append("g").attr("class", "y axis").call(p), a = d.selectAll("g.bar").data(e).enter().append("g").attr("class", "bar").attr("transform", function (t, e) {
            return"translate(" + f(e) + ", 0)"
        }), a.append("rect").attr("width", f.rangeBand()).attr("height",function (t) {
            return i - m(t.commits)
        }).attr("y",function (t) {
                return m(t.commits)
            }).on("mouseover", u.show).on("mouseout", u.hide), a.append("image").attr("y", i + 5).attr("xlink:href",function (t) {
            return t.gravatar
        }).attr("width", f.rangeBand()).attr("height", f.rangeBand()).on("click", function (t) {
                return null != t.login ? document.location = "/" + t.login : void 0
            })
    })
}.call(this), function () {
    $(document).on("graph:load", ".js-graph-punchcard", function (t, e) {
        var n, a, i, s, r, o, c, l, u, d, h, f, m, p, g, v, y, b, j, x, w;
        return r = 500, b = $(this).width(), d = {}, e.forEach(function (t) {
            var e, n, a, i, s;
            return a = d3.weekdays[t[0]], e = null != (i = d[a]) ? i : d[a] = [], n = t[1], null == (s = e[n]) && (e[n] = 0), e[n] += t[2]
        }), e = d3.entries(d).reverse(), w = [0, 0, 0, 20], p = w[0], f = w[1], m = w[2], h = w[3], c = 100, a = d3.range(7), o = d3.range(24), u = d3.min(e, function (t) {
            return d3.min(t.value)
        }), l = d3.max(e, function (t) {
            return d3.max(t.value)
        }), j = d3.scale.ordinal().domain(o).rangeRoundBands([0, b - c - f - m], .1), x = d3.scale.ordinal().domain(a).rangeRoundBands([r - p - h, 0], .1), g = d3.scale.sqrt().domain([0, l]).range([0, j.rangeBand() / 2]), v = d3.tip().attr("class", "svg-tip").offset([-10, 0]).html(function (t) {
            return"<strong>" + t + "</strong> " + $.pluralize(t, "commit")
        }), y = d3.select(this).data(e).attr("width", "" + b + "px").append("svg").attr("width", b + (f + m)).attr("height", r + p + h).attr("class", "viz").append("g").attr("transform", "translate(" + f + "," + p + ")").call(v), i = y.selectAll("g.day").data(e).enter().append("g").attr("class", "day").attr("transform", function (t, e) {
            return"translate(0, " + x(e) + ")"
        }), i.append("line").attr("x1", 0).attr("y1", x.rangeBand()).attr("x2", b - f - m).attr("y2", x.rangeBand()).attr("class", "axis"), i.append("text").attr("class", "label").text(function (t) {
            return t.key
        }).attr("dy", x.rangeBand() / 2), y.append("g").selectAll("text.hour").data(o).enter().append("text").attr("text-anchor", "middle").attr("transform",function (t, e) {
            return"translate(" + (j(e) + c) + ", " + r + ")"
        }).attr("class", "label").text(function (t) {
                var e;
                return e = t % 12 || 12, 0 === t || 12 > t ? "" + e + "a" : "" + e + "p"
            }), s = i.selectAll(".hour").data(function (t) {
            return t.value
        }).enter().append("g").attr("class", "hour").attr("transform",function (t, e) {
                return"translate(" + (j(e) + c) + ", 0)"
            }).attr("width", j.rangeBand()), s.append("line").attr("x1", 0).attr("y1",function (t, e) {
            return x.rangeBand() - (0 === e % 2 ? 15 : 10)
        }).attr("x2", 0).attr("y2", x.rangeBand()).attr("class", function (t, e) {
                return 0 === e % 2 ? "axis even" : "axis odd"
            }), n = s.append("circle").attr("r", 0).attr("cy", x.rangeBand() / 2 - 5).attr("class",function () {
            return"day"
        }).on("mouseover", v.show).on("mouseout", v.hide), n.transition().attr("r", g)
    })
}.call(this), function () {
    var t, e, n, a, i, s, r, o, c, l, u, d, h, f, m, p;
    c = d3.time.format("%m/%d"), n = d3.format(","), u = 960, t = 100, p = [20, 60, 30, 40], r = p[0], s = p[1], a = p[2], i = p[3], d = d3.time.scale().range([0, u - i - s]), f = d3.scale.linear().range([t, 0]), h = d3.svg.axis().scale(d).ticks(d3.time.days).tickSize(t + 5).tickPadding(10).tickFormat(c).orient("bottom"), m = d3.svg.axis().scale(f).ticks(3).tickFormat(d3.formatSymbol).orient("left"), e = d3.svg.area().x(function (t) {
        return d(t.key)
    }).y(function (t) {
            return f(t.value)
        }), l = d3.tip().attr("class", "svg-tip").offset([-10, 0]).html(function (t, e, a) {
        var i, s;
        return i = new Date(t.key), s = 0 === a ? "visits" : "unique visits", "<strong>" + n(t.value) + " " + s + " <span class='date'>" + d3.time.format("%a, %b %d")(i) + "</strong></span>"
    }), o = function (s, o) {
        var c, p, g, v, y, b, j, x, w, C, k, _;
        if (o && null == o.error) {
            for (w = d3.select(this).append("svg").attr("width", u).attr("height", t + r + a).attr("class", "vis").append("g").attr("transform", "translate(" + i + "," + r + ")").call(l), o = o.counts, o.forEach(function (t) {
                return t.date = new Date(1e3 * t.bucket)
            }), c = d3.nest().key(function (t) {
                return d3.time.day(t.date)
            }).rollup(function (t) {
                    return{total: d3.sum(t, function (t) {
                        return t.total
                    }), unique: d3.sum(t, function (t) {
                        return t.unique
                    })}
                }).entries(o), j = [], x = [], C = 0, k = c.length; k > C; C++)v = c[C], v.key = new Date(v.key), j.push({key: v.key, value: v.values.total}), x.push({key: v.key, value: v.values.unique});
            return y = [j, x], $(".js-views").text(n(d3.sum(c, function (t) {
                return t.values.total
            }))), $(".js-uniques").text(n(d3.sum(c, function (t) {
                return t.values.unique
            }))), _ = d3.extent(c, function (t) {
                return t.key
            }), b = _[0], g = _[1], d.domain([b, g]), f.domain([0, d3.max(c, function (t) {
                return t.values.total
            })]), w.append("g").attr("class", "x axis").call(h).selectAll("text").attr("text-anchor", "middle"), w.append("g").attr("class", "y axis").call(m), w.selectAll("path.path").data(y).enter().append("path").attr("class",function (t, e) {
                return"path " + (0 === e ? "total" : "unique")
            }).attr("d", e), p = w.selectAll("g.dots").data(y).enter().append("g").attr("class", function (t, e) {
                return 0 === e ? "totals" : "uniques"
            }), p.selectAll("circle").data(function (t) {
                return t
            }).enter().append("circle").attr("cx",function (t) {
                    return d(t.key)
                }).attr("cy",function (t) {
                    return f(t.value)
                }).attr("r", 4).on("mouseover", l.show).on("mouseout", l.hide)
        }
    }, $(document).on("graph:load", ".js-traffic-graph", o), $(document).on("click", ".js-domain-list", function (t) {
        return t.preventDefault(), $(".js-top-paths").fadeOut("fast", function () {
            return $(".js-top-domains").fadeIn("fast")
        })
    }), $(document).on("click", ".js-domain", function (t) {
        return t.preventDefault(), $.ajax({url: $(this).attr("href"), beforeSend: function () {
            return $(".js-top-domains").hide(), $(".js-spinner").show()
        }}).done(function (t) {
                return $(".js-spinner").hide(), $(".js-top-paths").html(t).fadeIn("fast")
            })
    })
}.call(this), function () {
    $(document).on("click", ".dropdown-toggle .js-menu-target", function () {
        return $(".dropdown-toggle .js-menu-content").html($(".js-new-dropdown-contents").html())
    })
}.call(this), function () {
    var t, e = [].indexOf || function (t) {
        for (var e = 0, n = this.length; n > e; e++)if (e in this && this[e] === t)return e;
        return-1
    };
    t = function () {
        function t(e) {
            var n = this;
            this.input = e, this.loadSuggestions = function () {
                return t.prototype.loadSuggestions.apply(n, arguments)
            }, this.onNavigationOpen = function () {
                return t.prototype.onNavigationOpen.apply(n, arguments)
            }, this.onNavigationKeyDown = function () {
                return t.prototype.onNavigationKeyDown.apply(n, arguments)
            }, this.onKeyUp = function () {
                return t.prototype.onKeyUp.apply(n, arguments)
            }, this.deactivate = function () {
                return t.prototype.deactivate.apply(n, arguments)
            }, this.activate = function () {
                return t.prototype.activate.apply(n, arguments)
            }, this.container = function () {
                return t.prototype.container.apply(n, arguments)
            }, this.list = function () {
                return t.prototype.list.apply(n, arguments)
            }, $(this.input).attr("data-member-adder-activated") || ($(this.input).attr("data-member-adder-activated", !0), $(this.input).on("focusout:delayed.member-adder", this.deactivate), $(this.input).on("focusin:delayed.member-adder", this.activate), $(this.input).on("keyup.member-adder", this.onKeyUp), $(this.input).on("throttled:input.member-adder", this.loadSuggestions), this.spinner = document.getElementById($(this.input).attr("data-spinner")), this.container().on("navigation:keydown.member-adder", "[data-value]", this.onNavigationKeyDown), this.container().on("navigation:open.member-adder", "[data-value]", this.onNavigationOpen), this.added = {})
        }

        return t.prototype.list = function () {
            return this._list || (this._list = $(document.getElementById($(this.input).attr("data-member-list"))))
        }, t.prototype.container = function () {
            return this._container || (this._container = $(document.getElementById($(this.input).attr("data-member-adder"))))
        }, t.prototype.activate = function () {
            this.container().is(".active") || this.query && (this.container().addClass("active"), $(this.input).addClass("js-navigation-enable"), this.container().navigation("push"), this.container().navigation("focus"))
        }, t.prototype.deactivate = function () {
            this.container().removeClass("active"), this.container().find(".suggestions").hide(), $(this.input).removeClass("js-navigation-enable"), this.container().navigation("pop")
        }, t.prototype.onKeyUp = function () {
            var t;
            return t = $(this.input).val(), t !== this.query ? (this.query = t) ? (this.search(t) ? this.activate() : this.deactivate(), this.query) : (this.query = null, this.deactivate(), void 0) : void 0
        }, t.prototype.onNavigationKeyDown = function (t) {
            switch (t.hotkey) {
                case"tab":
                    return this.onNavigationOpen(t), !1;
                case"esc":
                    return this.deactivate(), !1
            }
        }, t.prototype.onNavigationOpen = function (t) {
            var e, n, a, i = this;
            return n = $(t.target).attr("data-value"), this.input.value = "", e = this.container().attr("data-add-url"), null != (a = this.ajax) && a.abort(), this.startSpinner(), e ? $.ajax({url: e, type: "post", data: {member: n}, complete: function (t) {
                return i.stopSpinner(), 200 === t.status ? (i.list().prepend(t.responseText), i.list().pageUpdate(), i.list().trigger("member-adder:added", n), i.added[n] = !0) : i.list().trigger("member-adder:error", [n, t])
            }}) : (this.stopSpinner(), 0 === this.list().find("li[data-value='" + n + "']").length && (this.list().prepend(this.container().find("li[data-value='" + n + "']").clone()), this.list().pageUpdate(), this.list().trigger("member-adder:added", n))), this.deactivate(), this.input.focus(), !1
        }, t.prototype.startSpinner = function () {
            return this.spinner && $(this.spinner).length ? $(this.spinner).removeClass("hidden") : $(".js-spinner").length ? void 0 : $(this.input).after("<img class='js-spinner' src='" + GitHub.Ajax.spinner + "' width='16' />")
        }, t.prototype.stopSpinner = function () {
            return this.spinner && $(this.spinner).length ? $(this.spinner).addClass("hidden") : $(".js-spinner").remove()
        }, t.prototype.search = function (t) {
            var n, a, i, s, r;
            return i = this.container().find("ul"), i[0] ? (n = this.container().find(".js-no-results").removeClass("active"), s = e.call(t.slice(1), "@") >= 0, !s && (a = i.data("fuzzy-sort-items")) && i.data("fuzzy-sort-items", a.filter(function () {
                return $(this).attr("data-value") && !(e.call($(this).attr("data-value"), "@") >= 0)
            })), r = i.fuzzyFilterSortList(t.replace(/^@/, ""), {limit: 5, text: function (t) {
                return t.getAttribute("data-value")
            }}), s && i.find("li:not(:first-child)").remove(), r > 0 ? (i.show(), this.container().navigation("focus"), !0) : (n.addClass("active"), !1)) : void 0
        }, t.prototype.loadSuggestions = function () {
            var t, e, n = this;
            if ((t = this.query) && (e = this.container().attr("data-search-url")) && !this.ajax)return this.startSpinner(), this.ajax = $.ajax({url: e, data: {query: t}, complete: function () {
                return n.ajax = null, n.stopSpinner()
            }, success: function (t) {
                var e, a, i, s, r, o, c, l, u, d;
                if (e = $($.parseHTML(t)), r = e.find("li"), r.length || n.container().find("li:visible").length || (n.activate(), $(".js-no-results").addClass("active")), r.length) {
                    for (c = n.container().find("ul"), a = c.data("fuzzy-sort-items"), o = {}, s = [], d = a.toArray().concat(r.toArray()), l = 0, u = d.length; u > l; l++)i = d[l], o[i.textContent] || n.added[$(i).attr("data-value")] || s.push(i), o[i.textContent] = !0;
                    return c.data("fuzzy-sort-items", $(s)), n.query = null, n.onKeyUp()
                }
            }})
        }, t
    }(), $.pageUpdate(function () {
        return $("input[data-member-adder]").each(function () {
            return new t(this)
        })
    })
}.call(this), function () {
    $.observe(".js-foo", {initialize: function () {
        return console.log(".js-foo initialized", this)
    }, add: function () {
        return console.log(".js-foo added to the DOM", this)
    }, remove: function () {
        return console.log(".js-foo removed from the DOM", this)
    }}), $.observe(".js-bar", function () {
        return console.log(".js-bar initialized", this)
    })
}.call(this), function () {
    var t, e;
    $(document).on("click", ".js-org-billing-plans .js-choose-plan", function () {
        return t($(this).closest(".js-plan-row")), !1
    }), t = function (t) {
        var n, a, i, s;
        return i = t.attr("data-name"), a = parseInt(t.attr("data-cost"), 10), n = parseInt(null != (s = t.attr("data-balance")) ? s : "0", 10), $(".js-org-billing-plans").find(".js-plan-row, .js-choose-plan").removeClass("selected"), t.find(".js-choose-plan").addClass("selected"), t.addClass("selected"), $(".js-plan").val(i), 0 === a && 0 === n ? Billing.displayCreditCardFields(!1) : (Billing.displayCreditCardFields(!0), null != t.attr("data-balance") ? e(i) : void 0)
    }, e = function (t) {
        return $(".js-plan-change-message").addClass("is-hidden"), $('.js-plan-change-message[data-name="' + t + '"]').removeClass("is-hidden")
    }, $(function () {
        return Billing.displayCreditCardFields(!1), $(".selected .js-choose-plan").click()
    })
}.call(this), function () {
    var t, e;
    t = function () {
        var t, n, a, i, s;
        return i = [], t = $(".js-advanced-search-input").val(), s = {Repositories: 0, Users: 0, Code: 0}, i = e($("input[type=text].js-advanced-search-prefix, select.js-advanced-search-prefix"), function (t, e, n) {
            return"" === t ? "" : ("" !== e && s[n]++, "" !== e ? "" + t + e : void 0)
        }), $.merge(i, e($("input[type=checkbox].js-advanced-search-prefix"), function (t, e, n) {
            var a;
            return a = $(this).prop("checked"), a !== !1 && s[n]++, a !== !1 ? "" + t + a : void 0
        })), n = function (t) {
            return t.Users > t.Code && t.Users > t.Repositories ? "Users" : t.Code > t.Users && t.Code > t.Repositories ? "Code" : "Repositories"
        }, a = $.trim(i.join(" ")), $(".js-type-value").val(n(s)), $(".js-search-query").val($.trim("" + t + " " + a)), $(".js-advanced-query").empty(), $(".js-advanced-query").text("" + a), $(".js-advanced-query").prepend($("<span>").text($.trim(t)), " ")
    }, e = function (t, e) {
        return $.map(t, function (t) {
            var n, a, i, s;
            return i = $.trim($(t).val()), n = $(t).attr("data-search-prefix"), a = $(t).attr("data-search-type"), s = function (t) {
                return-1 !== t.search(/\s/g) ? '"' + t + '"' : t
            }, "" === n ? e.call(t, n, i, a) : -1 !== i.search(/\,/g) && "location" !== n ? i.split(/\,/).map(function (i) {
                return e.call(t, n, s($.trim(i)), a)
            }) : e.call(t, n, s(i), a)
        })
    }, $(document).onFocusedInput(".js-advanced-search-prefix", function () {
        return function () {
            return t()
        }
    }), $(document).on("change", ".js-advanced-search-prefix", t), $(document).on("focusin", ".js-advanced-search-input", function () {
        return $(this).closest(".js-advanced-search-label").addClass("focus")
    }), $(document).on("focusout", ".js-advanced-search-input", function () {
        return $(this).closest(".js-advanced-search-label").removeClass("focus")
    }), $(document).on("click", ".js-see-all-search-cheatsheet", function () {
        return $(".js-more-cheatsheet-info").removeClass("hidden"), !1
    }), $(function () {
        return $(".js-advanced-search-input").length ? t() : void 0
    })
}.call(this), $(function () {
    $("#js-coupon-click-onload").click(), $(".selected .choose_plan").click(), $(".js-show-credit-card-form")[0] && ($.facebox({div: "#credit_card_form"}), $(document).unbind("close.facebox").bind("close.facebox", function () {
        window.location = "/account/billing"
    }))
}), $(document).on("click", ".js-add-cc", function () {
    return $(document).one("reveal.facebox", function () {
        $("#facebox .js-thanks").hide()
    }), $.facebox({div: this.href}), !1
}), $(document).on("click", ".js-add-billing-contact-info", function () {
    return $(document).one("reveal.facebox", function () {
        $(".js-billing-info-field").focus()
    }), $.facebox({div: "#js-add-billing-contact-info-modal"}), !1
}), $(document).on("click", ".js-close-facebox", function () {
    $(document).trigger("close.facebox")
}), $(document).on("click", ".js-plan-change", function () {
    var t = $(this).closest("tr").attr("data-name");
    $.facebox({div: this.hash});
    var e = $("#facebox");
    return e.find(".js-new-plan-name-val").val(t), e.find(".js-new-plan-name").text(t), e.find(".js-new-plan-card-on-file").toggle("free" !== t), e.find(".js-new-plan-free").toggle("free" == t), !1
}), $(document).on("ajaxSuccess", "#facebox .js-coupon-form",function (t, e) {
    $("#facebox .facebox-content").html(e.responseText), $(document).one("close.facebox", function () {
        window.location.reload()
    })
}).on("ajaxError", "#facebox .js-coupon-form", function (t, e) {
        return $("#facebox .facebox-content").html(e.responseText), !1
    }), function () {
    $(document).on("click", ".js-add-billing-manager-button", function (t) {
        return $(t.target).toggleClass("selected"), $(".js-add-billing-manager-form").toggle(), $(".js-add-billing-manager-form input").focus(), !1
    }), $(document).on("member-adder:error", ".js-billing-managers", function () {
        return $(".js-alert").removeClass("hidden"), $(".js-add-billing-manager-form").on("input.billing-manager", function () {
            return $(".js-alert").addClass("hidden"), $(this).off(".billing-manager")
        })
    }), $(document).on("member-adder:added", ".js-billing-managers", function () {
        return $(".js-add-billing-manager-button").click()
    })
}.call(this), function () {
    var t, e, n, a, i;
    t = function (t) {
        return Math.floor(+new Date - +t)
    }, i = function () {
        var t, e;
        for (e = [], a = t = 1; 10 >= t; a = ++t)e.push("heat" + a);
        return e
    }(), e = d3.scale.quantile().range(i), $.pageUpdate(n = function () {
        var n, a, i, s, r, o, c, l, u, d, h;
        for (d = $(this).find(".js-blame-heat"), o = 0, l = d.length; l > o; o++)for (r = d[o], s = moment($(r).attr("data-repo-created")), e.domain([0, t(s)]), h = $(r).find(".js-line-age"), c = 0, u = h.length; u > c; c++)i = h[c], i = $(i), n = moment(i.attr("data-date")), a = e(t(n)), i.addClass(a)
    })
}.call(this), function () {
    var t, e, n, a, i, s, r;
    n = function (t) {
        var e, n, a, i, s;
        if (n = t.match(/\#?(?:L|-)(\d+)/gi)) {
            for (s = [], a = 0, i = n.length; i > a; a++)e = n[a], s.push(parseInt(e.replace(/\D/g, "")));
            return s
        }
        return[]
    }, t = function (t) {
        switch (t.sort(r), t.length) {
            case 1:
                return"#L" + t[0];
            case 2:
                return"#L" + t[0] + "-L" + t[1];
            default:
                return"#"
        }
    }, r = function (t, e) {
        return t - e
    }, s = !1, e = function (t) {
        var e, n, a;
        if (n = $(".line, .line-data"), n.length) {
            if (n.css("background-color", ""), 1 === t.length)return $("#LC" + t[0]).css("background-color", "#ffc");
            if (t.length > 1) {
                for (e = t[0], a = []; e <= t[1];)$("#LC" + e).css("background-color", "#ffc"), a.push(e++);
                return a
            }
        }
    }, i = function (t) {
        var a;
        return null == t && (t = n(window.location.hash)), e(t), !s && (a = $("#LC" + t[0])).length && $(window).scrollTop(a.offset().top - .33 * $(window).height()), s = !1
    }, $.hashChange(function () {
        return $(".line, .line-data").length ? setTimeout(i, 0) : void 0
    }), a = function (t) {
        var e, n;
        return s = !0, e = null != (n = $(window).scrollTop()) ? n : 0, t(), $(window).scrollTop(e)
    }, $(document).on("mousedown", ".line-number, .blob-line-nums span[rel], .csv-row-num", function (e) {
        var i, s;
        return s = $(this).hasClass("csv-row-num") ? n($(this).find("span:first").attr("id")) : n($(this).attr("rel")), e.shiftKey && (i = n(window.location.hash), s.unshift(i[0])), a(function () {
            return window.location.hash = t(s)
        }), !1
    }), $(document).on("submit", ".js-jump-to-line-form", function () {
        var t, e;
        return t = $(this).find(".js-jump-to-line-field")[0], (e = parseInt(t.value.replace(/\D/g, ""))) && (window.location.hash = "L" + e), $(document).trigger("close.facebox"), !1
    }), $(document).on("click", ".highlight-ctags a.ctag-relative", function () {
        var e;
        return(e = n($(this).attr("href"))).length && (window.location.hash = t(e)), !1
    })
}.call(this), function () {
    var t, e, n, a;
    n = !1, t = null, $.pageUpdate(function () {
        return n ? setTimeout(function () {
            var t;
            return(t = $("#highlight-ctags-enabled")).length ? t.prop("checked", !0).change() : void 0
        }, 100) : void 0
    }), a = function (e, n) {
        var i, s;
        return null == n && (n = 1e3), t ? e(t) : (i = $("#highlight-ctags-enabled"), s = $(".highlight-ctags").addClass("ctags-loading"), $.ajax({url: i.data("list-url"), dataType: "json", success: function (i) {
            return i.tags ? (t = i.tags, e(t), s.removeClass("ctags-loading")) : i.generating ? 6e4 > n ? (n *= 1.5, setTimeout(function () {
                return a(e, n)
            }, n)) : s.removeClass("ctags-loading") : void 0
        }, error: function () {
            return s.removeClass("ctags-loading")
        }}))
    }, e = function () {
        return a(function (t) {
            var e, n, a, i, s;
            for (n = [], s = $(".highlight .line > span.n, .highlight .line > span.no"), a = 0, i = s.length; i > a; a++)e = s[a], t[e.textContent] && (e.children.length ? t[e.textContent] > 1 && (e.innerHTML = e.textContent, n.push(e)) : n.push(e));
            return $(n).addClass("valid-ctag")
        })
    }, $(document).on("click", ".highlight-ctags .popover", function () {
        return!1
    }), $(document).on("click", ".highlight-ctags", function () {
        var t;
        return(t = $(".highlight-ctags .visible-ctag")).length ? (t.removeClass("visible-ctag").popover("destroy"), $(".highlight-ctags .popover").remove(), !1) : void 0
    }), $(document).on("click", ".highlight-ctags span.valid-ctag", function (e) {
        var n, a, i, s;
        return(a = $(".highlight-ctags .visible-ctag")).length && (a.removeClass("visible-ctag").popover("destroy"), $(".highlight-ctags .popover").remove(), a[0] === e.target) ? !1 : (a = $(e.target), a.addClass("visible-ctag"), n = $("#highlight-ctags-enabled"), s = e.target.textContent, i = a.offset().left + a.width() > .5 * $(window).width() ? "left" : "right", a.popover({html: !0, content: "<div class='loading'><img align='absmiddle' src='" + GitHub.Ajax.spinner + "' height='16'/>      Loading " + (t && t[s] || "") + " definitions</div>", placement: i}).popover("show"), $.ajax({url: n.data("lookup-url") + escape(s), data: {path: n.data("path"), line: a.parents("div.line:first").attr("id").slice(2)}, dataType: "html", success: function (t) {
            return a.popover({html: !0, content: t, placement: i}).popover("show"), $(".popover .js-navigation-container").navigation("focus")
        }}), !1)
    }), $(document).on("change", "input#highlight-ctags-enabled", function (t) {
        var a;
        return a = $(".js-blob-data td > .highlight"), (n = $(t.target).is(":checked")) ? (a.addClass("highlight-ctags"), e()) : a.removeClass("highlight-ctags")
    }), $(document).on("keydown", function (t) {
        var e;
        return $(t.target).is("input, textarea") ? !0 : "f" === t.hotkey && (e = $("#highlight-ctags-enabled")).length ? (e.prop("checked", !e[0].checked).change(), !1) : void 0
    })
}.call(this), function () {
    var t, e, n, a, i, s, r, o, c;
    i = function () {
        var t, e, n, a, i, s, r, o, c;
        return e = $(".js-blob-form"), t = e.find(".js-blob-filename"), r = !t[0] || t.val() !== t.attr("data-default-value"), t[0] && (r = r && "." !== t.val() && ".." !== t.val() && ".git" !== t.val() && !t.val().match(/^\s+$/)), o = e.find(".js-check-for-fork").is(":visible"), s = $(".js-blob-contents")[0], a = s.value !== s.defaultValue, n = a || $(s).attr("data-allow-unchanged") || $(s).attr("data-new-filename"), i = "" === s.value, e.find(".js-blob-submit").prop("disabled", !r || o || !n || i), c = a || $(s).attr("data-allow-unchanged"), e.find(".js-blob-contents-changed").val(c)
    }, $.pageUpdate(function () {
        var t;
        if (t = $(this).find(".js-blob-contents")[0])return i()
    }), $(document).on("change", ".js-blob-contents", function () {
        return s($(".js-blob-filename")), i()
    }), $(document).on("click", ".js-new-blob-submit", function () {
        return $(this).closest("form.js-new-blob-form").submit()
    }), $(document).onFocusedInput(".js-blob-filename", function () {
        return function () {
            return $(".js-blob-contents").attr("data-filename", $(this).val()), a($(this).val()), s($(this))
        }
    }), $(document).onFocusedInput(".js-breadcrumb-nav", function () {
        return function () {
            return c($(this)), s($(this))
        }
    }), $(document).onFocusedKeydown(".js-breadcrumb-nav", function () {
        return function (t) {
            var e, a, i;
            return a = $(this).caretSelection(), i = [0, 0], e = 0 === $(a).not(i).length && 0 === $(i).not(a).length, e && 8 === t.keyCode && 1 !== $(this).parent().children(".separator").size() && (n($(this), !0), t.preventDefault()), s($(this))
        }
    }), s = function (t) {
        return null != t[0] && (o(t), r(t)), i()
    }, c = function (t) {
        var a, i, s, r, o, c;
        for (c = []; t.val().split("/").length > 1;)a = t.val(), s = a.split("/"), i = s[0], o = s.slice(1).join("/"), "" === i || "." === i || ".git" === i ? (t.val(o), r = function () {
            return t.caret(0)
        }, c.push(window.setTimeout(r, 1))) : ".." === i ? c.push(n(t)) : c.push(e(t, i, o));
        return c
    }, a = function (t) {
        var e, n;
        return e = $(".js-gitignore-template"), n = $(".js-license-template"), /^(.+\/)?\.gitignore$/.test(t) ? e.addClass("is-visible") : /^(.+\/)?(licen[sc]e|copying)($|\.)/i.test(t) ? n.addClass("is-visible") : (e.removeClass("is-visible"), n.removeClass("is-visible"))
    }, r = function (t) {
        var e, n, a, i, s, r, o, c, l, u, d, h;
        return a = t.closest("form"), n = $(".js-blob-contents"), e = a.find(".js-new-blob-commit-summary"), o = t.val() ? "Create " + t.val() : "Create new file", d = n.attr("data-old-filename"), c = $(".js-new-filename-field").val(), n.removeAttr("data-new-filename"), o = d.length && c !== d && null != t[0] ? (n.attr("data-new-filename", "true"), s = n[0].value !== n[0].defaultValue, i = s ? "Update and rename" : "Rename", t.val().length && c.length ? (h = d.split("/"), l = c.split("/"), u = !0, r = h.length - 1, h.forEach(function (t, e) {
            return e !== r && t !== l[e] ? u = !1 : void 0
        }), h.length === l.length && u ? "" + i + " " + h[r] + " to " + l[r] : "" + i + " " + d + " to " + c) : "" + i + " " + d) : d.length && c === d ? "Update " + t.val() : o, e.attr("placeholder", o), $(".js-commit-message-fallback").val(o)
    }, o = function (t) {
        var e, n;
        return e = $(".breadcrumb").children("[itemscope]"), n = "", e.each(function () {
            var t;
            return t = $(this), n = n + t.text() + "/"
        }), n += t.val(), $(".js-new-filename-field").val(n)
    }, n = function (t, e) {
        var n, i;
        return null == e && (e = !1), e || t.val(t.val().replace("../", "")), i = function () {
            return t.caret(0)
        }, 1 !== t.parent().children(".separator").size() && (t.prev().remove(), n = t.prev().children().children().html(), t.prev().remove(), e && (t.val("" + n + t.val()), i = function () {
            return e ? t.caret(n.length) : void 0
        })), a(t.val()), window.setTimeout(i, 1)
    }, e = function (t, e, n) {
        var i, s, r, o, c, l, u;
        return null == n && (n = ""), e = e.replace(/[^-.a-z_0-9]+/gi, "-"), e = e.replace(/^-+|-+$/g, ""), e.length > 0 && (u = t.parent().children(".js-repo-root, [itemtype]").children("a").last().attr("href"), u || (i = t.parent().children(".js-repo-root, [itemtype]").children("span").children("a").last(), s = i.attr("data-branch"), c = i.attr("href"), u = "" + c + "/tree/" + s), r = $(".js-crumb-template").clone().removeClass("js-crumb-template"), r.find("a[itemscope]").attr("href", "" + u + "/" + e), r.find("span").text(e), o = $(".js-crumb-separator").clone().removeClass("js-crumb-separator"), t.before(r, o)), t.val(n), a(t.val()), l = function () {
            return t.caret(0)
        }, window.setTimeout(l, 1)
    }, $(document).onFocusedInput(".js-new-blob-commit-summary", function () {
        var t;
        return t = $(this).closest(".js-file-commit-form"), function () {
            return t.toggleClass("is-too-long-error", $(this).val().length > 50)
        }
    }), t = function (t) {
        return t.data("checking-for-fork") ? void 0 : (i(), $.smartPoller(function (e) {
            return $.ajax({url: t.attr("data-check-url"), success: function () {
                return t.hide(), i()
            }, error: function (n) {
                return 404 === n.status ? e() : t.html("<img src='/images/modules/ajax/error.png'>\nSomething went wrong. Please fork the project, then try from your fork.")
            }})
        }), t.data("checking-for-fork", !0))
    }, $.pageUpdate(function () {
        var e, n, a, i;
        for (i = $(".js-check-for-fork"), n = 0, a = i.length; a > n; n++)e = i[n], t($(e))
    }), $(document).on("change", ".js-gitignore-template input[type=radio]", function () {
        return $.ajax({type: "GET", url: $(this).attr("data-template-url"), success: function (t) {
            return editor.setCode(t)
        }})
    }), $(document).on("change", ".js-license-template input[type=radio]", function () {
        var t;
        return t = $(this).attr("data-template-contents"), editor.setCode(t)
    }), $(document).onFocusedKeydown(".js-new-blob-commit-description", function () {
        return function (t) {
            return"ctrl+enter" === t.hotkey || "meta+enter" === t.hotkey ? ($(this).closest("form").submit(), !1) : void 0
        }
    })
}.call(this), function () {
    $(document).on("click", ".js-branch-toggle", function () {
        return $(".js-branches-content").toggleClass("showing-unmerged"), $(".js-branches-content").toggleClass("showing-merged"), !1
    }), $(document).on("ajaxSend", ".js-branch-delete", function () {
        return $(this).addClass("disabled"), $(this).closest(".actions").find(".spinner").show()
    }), $(document).on("ajaxSuccess", ".js-branch-delete", function () {
        return $(this).closest("tr").fadeOut(), !1
    }), $(document).on("ajaxError", ".js-branch-delete", function () {
        return $(this).closest(".actions").find(".spinner").hide(), $(this).html("Couldn't delete!"), !1
    }), $(function () {
        var t, e, n, a;
        return e = 2, t = 7, a = 30, n = 1e4, $(".diverge-widget").each(function () {
            var n, i, s;
            return n = $(this), i = new Date(n.attr("last-updated")), s = (new Date - i) / 1e3 / 3600 / 24, e >= s ? n.addClass("hot") : t >= s ? n.addClass("fresh") : a >= s ? n.addClass("stale") : n.addClass("old")
        })
    })
}.call(this), function () {
    $.pageUpdate(function () {
        var t, e;
        if ((t = document.getElementById("diff-comment-data")) && !$(t).data("commit-inline-comments-rendered"))return e = {}, $("#files.diff-view > .file > .meta").each(function () {
            return e[$(this).attr("data-path")] = this
        }), $("#diff-comment-data > table").each(function () {
            var t, n, a, i;
            return n = $(this).attr("data-path"), a = $(this).attr("data-position"), t = $(e[n]).closest(".file"), i = t.find(".data table tr[data-position='" + a + "']"), i.after($(this).children("tbody").children("tr").detach()), t.addClass("has-inline-notes show-inline-notes")
        }), $("#diff-comment-data > div").each(function () {
            var t;
            return t = $(this).attr("data-path"), $(e[t]).closest(".file").find(".file-comments-place-holder").replaceWith($(this).detach())
        }), $(t).data("commit-inline-comments-rendered", !0)
    }), $(document).on("change", ".js-show-inline-comments-toggle", function () {
        return $(this).closest(".file").toggleClass("show-inline-notes", this.checked)
    }), $(document).on("keyup", function (t) {
        var e;
        return"i" === t.hotkey && t.target === document.body ? (e = 0 === $(".js-show-inline-comments-toggle:not(:checked)").length, $(".js-show-inline-comments-toggle").prop("checked", !e).trigger("change")) : void 0
    }), $(document).on("change", "#js-inline-comments-toggle", function () {
        return $("#comments").toggleClass("only-commit-comments", !this.checked)
    }), $(document).on("click", ".linkable-line-number", function () {
        return document.location.hash = this.id, !1
    }), $(document).on("click", ".js-tag-list-toggle", function () {
        var t;
        return t = $(this), t.closest(".tag-list").find("li").show(), t.hide(), !1
    })
}.call(this), function () {
    $(document).on("navigation:keyopen", ".commit-group-item", function () {
        return $(this).find(".commit-title > a:first").click(), !1
    }), $(document).on("navigation:keydown", ".commit-group-item", function (t) {
        return"c" === t.hotkey ? ($(this).find(".commit-title > a:first").click(), !1) : void 0
    })
}.call(this), function () {
    var t;
    $(document).on("click", ".js-compare-tabs a", function () {
        return $(this).closest(".js-compare-tabs").find("a").removeClass("selected"), $(this).addClass("selected"), $("#commits_bucket, #files_bucket, #commit_comments_bucket").hide(), $(this.hash).show(), !1
    }), $.hashChange(function () {
        return $(this).closest("#files_bucket")[0] && !$(this).is(":visible") ? $('a.tabnav-tab[href="#files_bucket"]').click() : void 0
    }), $(document).on("click", ".js-cross-repo a", function (t) {
        return t.preventDefault(), $(this).closest(".js-range-editor").addClass("is-cross-repo")
    }), $(document).on("click", ".js-expand-range-editor", function () {
        var t;
        return t = $(this).closest(".js-range-editor"), t.removeClass("is-collapsed").addClass("is-expanded")
    }), $(document).on("click", ".js-collapse-range-editor", function () {
        var t;
        return t = $(this).closest(".js-range-editor"), t.addClass("is-collapsed").removeClass("is-expanded")
    }), t = function () {
        function t(e) {
            var n = this;
            this.onCommitishSelect = function () {
                return t.prototype.onCommitishSelect.apply(n, arguments)
            }, this.$container = $(e), "yes" !== this.$container.attr("data-range-editor-activated") && (this.$form = $("#js-compare-body-form"), this.$suggesters = this.$container.find(".js-select-menu"), this.urlTemplate = this.$container.attr("data-url-template"), this.currentRepo = this.$container.attr("data-current-repository"), this.base = this.$suggesters.filter('[data-type="base"]').attr("data-initial-value"), this.head = this.$suggesters.filter('[data-type="head"]').attr("data-initial-value"), this.baseFork = this.$suggesters.filter('[data-type="base-fork"]').attr("data-initial-value"), this.headFork = this.$suggesters.filter('[data-type="head-fork"]').attr("data-initial-value"), this.discussionDrafted = $(".js-compare-body-draft").length > 0, this.$suggesters.on("navigation:open.range-editor", ".js-navigation-item", this.onCommitishSelect), this.$form.on("change", "input, textarea", function () {
                return n.discussionDrafted = !0
            }), this.$container.attr("data-range-editor-activated", "yes"))
        }

        return t.prototype.teardown = function () {
            return this.$suggesters.off(".range-editor"), this.$container.attr("data-range-editor-activated", null)
        }, t.prototype.onCommitishSelect = function (t) {
            var e, n;
            switch (n = $.trim($(t.target).text()), e = $(t.target).closest(".js-select-menu").attr("data-type")) {
                case"base":
                    this.base = n;
                    break;
                case"head":
                    this.head = n;
                    break;
                case"base-fork":
                    this.baseFork = n;
                    break;
                case"head-fork":
                    this.headFork = n
            }
            return this.updateDiff()
        }, t.prototype.updateDiff = function () {
            var t, e, n, a, i;
            return t = encodeURIComponent(this.base), n = encodeURIComponent(this.head), this.currentRepo !== this.baseFork && (t = "" + this.baseFork.replace(/\/(.+)/, "") + ":" + t), this.currentRepo !== this.headFork && (n = "" + this.headFork.replace(/\/(.+)/, "") + ":" + n), i = this.urlTemplate.replace("{{head}}", n).replace("{{base}}", t), a = {url: i, container: this.$container.closest("[data-pjax-container]")[0]}, this.discussionDrafted && this.$form.hasDirtyFields() && (e = {type: "POST", data: this.$form.serializeArray()}, a = $.extend({}, a, e)), $.pjax(a)
        }, t
    }(), $.pageUpdate(function () {
        return $(".js-commitish-range-editor").each(function () {
            return new t(this)
        })
    })
}.call(this), function () {
    $(document).on("focusin", ".js-contact-documentation-suggestions", function () {
        return $(this).data("quicksearch-installed") ? void 0 : ($(this).quicksearch({url: $(this).attr("data-quicksearch-url"), results: $(this).closest("form").find(".documentation-results")}), $(this).data("quicksearch-installed", !0))
    }), $(function () {
        return $(".js-contact-javascript-flag").val("true")
    })
}.call(this), function () {
    var t;
    t = function (t) {
        var e, n, a, i, s, r;
        for (t = t.toLowerCase(), e = $(".js-csv-data tbody tr"), r = [], i = 0, s = e.length; s > i; i++)n = e[i], a = $(n).text().toLowerCase(), -1 === a.indexOf(t) ? r.push($(n).hide()) : r.push($(n).show());
        return r
    }, $(document).on("keyup", ".js-csv-filter-field", function (e) {
        var n;
        return n = e.target.value, null != n && t(n), !1
    })
}.call(this), function () {
    var t, e;
    e = function (t) {
        var e;
        return null == t && (t = document.location.search.substr(1)), e = {}, $.each(t.split("&"), function (t, n) {
            var a, i, s;
            return s = n.split("="), a = s[0], i = s[1], e[a] = decodeURIComponent(i.replace(/\+/g, " "))
        }), e
    }, $(document).on("navigation:open", ".ctags-search-result", function () {
        return $(".js-ctags-search-form input.query").attr("placeholder", $.trim($(this).find(".name > .full").text()))
    }), $(document).on("click", ".js-ctags-search-results a.filter-item", function () {
        var t, n;
        return n = e(this.href.split("?", 2)[1] || ""), t = $(".js-ctags-search-form"), t.find("input[name=l]").val(n.l), t.find("input[name=k]").val(n.k), t.submit(), !1
    }), $(document).on("submit", "form.js-ctags-search-form[data-ajax]", function () {
        var t, e;
        return e = $(this), (t = $(".js-ctags-search-results[data-ajax-container]")[0]) ? (e.addClass("pjax-active"), $.ajax({url: e.attr("action"), data: e.serialize()}).always(function () {
            return e.removeClass("pjax-active")
        }).done(function (e, n) {
                return"success" === n ? (t.innerHTML = e, $(t).pageUpdate()) : void 0
            }), !1) : void 0
    }), $(document).onFocusedKeydown(".js-ctags-search-form input.query", function (t) {
        var e, n;
        return e = $(this), n = null, e.on("throttled:input." + t, function () {
            return n && clearTimeout(n), n = setTimeout(function () {
                return e.closest("form").submit()
            }, 150)
        }), function (t) {
            return"esc" === t.hotkey && (history.back(), t.preventDefault()), !0
        }
    }), $.pageUpdate(t = function () {
        var t, e, n, a, i, s, r;
        for ($(".js-ctags-search-results .js-navigation-container").navigation("focus"), r = $(".js-ctags-search-results .ctags-search-result"), i = 0, s = r.length; s > i; i++)t = r[i], a = $(t), n = a.width() - a.find(".name").width() - 10, a.find(".link").css("max-width", "" + n + "px");
        return e = $(".js-ctags-search-form"), e.find("input.query").attr("placeholder", "Search definitions...").focus(), e.find("input.query:focus").length || e.find("input.query").focus(), $(".js-ctags-search-generating").length ? setTimeout(function () {
            return e.submit()
        }, 5e3) : void 0
    })
}.call(this), function () {
    $(document).on("mousedown", ".diff-line-code", function () {
        var t;
        return t = $(this).closest(".file-diff"), t.addClass("hide-line-numbers"), t.hasClass("line-number-attrs") || (t.addClass("line-number-attrs"), t.find(".diff-line-num").each(function () {
            var t;
            return t = $(this), t.attr("data-line-number", t.text())
        })), $(document).one("mouseup", function () {
            return window.getSelection().toString() ? void 0 : t.removeClass("hide-line-numbers")
        })
    })
}.call(this), function () {
    $(document).on("focusin", ".js-url-field", function () {
        var t;
        return t = this, setTimeout(function () {
            return $(t).select()
        }, 0)
    })
}.call(this), function () {
    var t;
    t = function (t) {
        var e, n;
        return e = $(t), n = e.is(".is-autocheck-successful"), e.closest("form").find("button.primary").prop("disabled", !n), n
    }, $(function () {
        return $(document.body).is(".page-new-discussion-list") ? t($("#discussion_list_name")) : void 0
    }), $(document).on("autocheck:send", "#discussion_list_name", function (t, e) {
        var n, a, i;
        return n = $(this), i = n.closest("form").find("input[name=owner]:checked").val(), a = "" + i + ":" + e.data.value, n.data("autocheck-last-value") !== a ? (e.data.owner = i, n.data("autocheck-last-value", a), !0) : !1
    }), $(document).on("change", ".new-discussion-list input[name=owner]", function () {
        $(this).closest("form").find("input[data-autocheck-url]").trigger("change")
    }), $(document).on("autocheck:success", "#discussion_list_name", function (t, e) {
        var n, a, i;
        return a = $(this).val(), a && a !== e.name ? (n = $(this).closest("dl.form"), n.addClass("warn"), i = $("<dd>").addClass("warning").text("Will be created as " + e.name), n.append(i)) : void 0
    }), $(document).on("autocheck:complete", "#discussion_list_name", function () {
        t(this)
    })
}.call(this), function () {
    $(document).on("click", ".js-zen-mode", function () {
        return $(document.body).hasClass("zen") ? ($(document.body).removeClass("zen"), $(document).off("keydown.zenMode")) : ($(document.body).addClass("zen"), $(document).on("keydown.zenMode", function (t) {
            return"esc" === t.hotkey ? ($(document.body).removeClass("zen"), !1) : void 0
        })), !1
    })
}.call(this), function () {
    $(document).on("click", ".js-events-pagination", function () {
        var t, e;
        return e = $(this).parent(".ajax_paginate"), t = e.parent(), e.hasClass("loading") ? !1 : (e.addClass("loading"), $.ajax({url: $(this).attr("href"), complete: function () {
            return e.removeClass("loading")
        }, success: function (n) {
            return e.replaceWith(n), t.pageUpdate()
        }}), !1)
    })
}.call(this), function () {
    var t, e, n;
    e = function (t, e) {
        return t.length ? parseInt(t.attr(e), 10) : -1
    }, n = function (t, e) {
        var n, a, i;
        return a = t.offset().top, i = $(document).scrollTop(), e(), n = Math.max(t.offset().top - a, 0), $(document).scrollTop(i + n)
    }, t = function (t, e, a, i, s, r, o) {
        var c;
        return null == o && (o = {}), c = $.extend({prev_line_num_left: a, prev_line_num_right: s, next_line_num_left: i, next_line_num_right: r}, o), $.ajax({context: e, url: t + "?" + $.param(c), cache: !1, success: function (t) {
            var a;
            return a = e.next(), a.length ? (n(a, function () {
                return e.replaceWith(t)
            }), a.parent().pageUpdate()) : e.replaceContent(t)
        }})
    }, $(document).on("click", ".js-expand-hunk[data-remote]", function () {
        var n, a, i, s, r, o, c, l, u, d, h, f, m, p, g;
        return n = $(this).parents("tr"), g = n.prevAll("tr.js-file-line").eq(0), u = n.nextAll("tr.js-file-line").eq(0), 0 !== g.length || 0 !== u.length ? (h = g.children("td").eq(0), r = u.children("td").eq(0), m = g.children("td").eq(1), c = u.children("td").eq(1), p = e(m, "data-line-number"), l = e(c, "data-line-number"), f = e(h, "data-line-number"), o = e(r, "data-line-number"), a = /@@&nbsp;-\d+,(\d+)&nbsp;\+\d+,(\d+)&nbsp;/, i = n.children("td.diff-line-code").html(), s = a.exec(i), d = {}, (null != s ? s.length : void 0) >= 3 && (d.left_hunk_size = s[1], d.right_hunk_size = s[2]), t($(this).attr("data-remote"), n, f, o, p, l, d)) : void 0
    }), $(document).on("click", ".js-expand-review-comment[data-remote]", function () {
        var n, a, i;
        return i = $(this).parents("tr"), a = i.next(), n = e(a, "data-position"), t($(this).attr("data-remote"), i, -1, n, -1, n)
    })
}.call(this), function () {
    $(document).on("graph:load", ".js-explore-commit-activity-graph", function (t, e) {
        var n, a, i, s, r, o, c, l, u, d;
        return $(t.target).empty().append($("h3").addClass("featured-graph-title").text("12 weeks commit activity")), e = e.reverse().slice(0, 12).reverse(), i = {top: 20, right: 20, bottom: 30, left: 40}, o = 390 - i.left - i.right, a = 200 - i.top - i.bottom, n = d3.time.format("%m/%d"), c = d3.scale.ordinal().rangeRoundBands([0, o], .1).domain(d3.range(e.length)), u = d3.scale.linear().range([a, 0]).domain([0, d3.max(e, function (t) {
            return t.total
        })]), l = d3.svg.axis().scale(c).ticks(6).tickFormat(function (t, a) {
            var i;
            return i = new Date(1e3 * e[a].week), n(i)
        }), d = d3.svg.axis().scale(u).ticks(3).orient("left").tickFormat(d3.formatSymbol), r = d3.tip().attr("class", "svg-tip").offset([-10, 0]).html(function (t, n) {
            var a;
            return a = moment(1e3 * e[n].week), "<strong>" + t.total + "</strong> " + $.pluralize(t.total, "commit") + " the week of " + a.format("MMMM Do")
        }), s = d3.select(t.target).append("svg").attr("width", o + i.left + i.right).attr("height", a + i.top + i.bottom).append("g").attr("transform", "translate(" + i.left + "," + i.top + ")").call(r), s.append("g").attr("class", "x axis").attr("transform", "translate(0," + a + ")").call(l).selectAll(".x.axis g").style("display", function (t, e) {
            return 0 !== e % 3 ? "none" : "block"
        }), s.append("g").attr("class", "y axis").call(d), s.selectAll(".g-mini").data(e).enter().append("rect").attr("class", "g-mini").attr("x",function (t) {
            return c(t.week)
        }).attr("width", c.rangeBand()).attr("y",function (t) {
                return u(t.total)
            }).attr("height",function (t) {
                return a - u(t.total)
            }).on("mouseover", r.show).on("mouseout", r.hide)
    }), $(document).on("carousel:unselected", ".js-carousel-slides .js-carousel-slide:not(.no-video)", function () {
        var t;
        return t = $(this).find("iframe"), t.length ? t[0].contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', "*") : void 0
    })
}.call(this), function () {
    $(function () {
        var t, e;
        return t = $(".community .bigcount"), e = function () {
            var e;
            return e = t.outerWidth(), t.css("margin-left", -(e / 2) + "px"), t.fadeIn()
        }, t.length ? setTimeout(e, 500) : void 0
    })
}.call(this), function () {
    $(document).on("click", "#fork-select .target", function () {
        var t;
        if (!$(this).hasClass("disabled"))return t = $(this).text().replace("@", ""), $("#organization").val(t), $("#fork").submit()
    })
}.call(this), function () {
    var t, e, n;
    e = function (e, n) {
        return e.closest(".js-label-editor").find(".js-color-editor-bg").css("background-color", n), e.css("color", t(n, -.5)), e.css("border-color", n)
    }, n = function (t) {
        var e, n;
        return e = "#eee", n = $(t).closest(".js-color-editor"), n.find(".js-color-editor-bg").css("background-color", e), t.css("color", "#c00"), t.css("border-color", e)
    }, t = function (t, e) {
        var n, a, i;
        for (t = String(t).toLowerCase().replace(/[^0-9a-f]/g, ""), t.length < 6 && (t = t[0] + t[0] + t[1] + t[1] + t[2] + t[2]), e = e || 0, i = "#", n = void 0, a = 0; 3 > a;)n = parseInt(t.substr(2 * a, 2), 16), n = Math.round(Math.min(Math.max(0, n + n * e), 255)).toString(16), i += ("00" + n).substr(n.length), a++;
        return i
    }, $(document).on("focusin", ".js-color-editor-input", function () {
        var t, a;
        return a = $(this), t = $(this).closest(".js-label-editor"), a.on("throttled:input.colorEditor", function () {
            var i;
            return"#" !== a.val().charAt(0) && a.val("#" + a.val()), t.removeClass("is-valid is-not-valid"), i = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(a.val()), t.find(".js-label-editor-submit").toggleClass("disabled", !i), i ? (t.addClass("is-valid"), e(a, a.val())) : (t.addClass("is-not-valid"), n(a))
        }), a.on("blur.colorEditor", function () {
            return a.off(".colorEditor")
        })
    }), $(document).on("menu:activate", ".js-editable-label", function () {
        var t;
        return t = $(this).find(".js-color-editor-input"), e(t, t.val()), $(this).find(".js-label-editor").addClass("is-valid"), $(this).find(".js-label-editor").addClass("open")
    }), $(document).on("menu:deactivate", ".js-editable-label", function () {
        var t, e, n;
        return n = $(this).find(".js-color-editor-input"), e = $(this).find(".js-label-editor"), n.attr("style", ""), e.removeClass("is-valid is-not-valid"), e.find(".js-color-editor-bg").attr("style", ""), e.find(".js-label-editor").removeClass("open"), n.val(n.attr("data-original-color")), t = $(".js-color-cooser-color")
    }), $(document).on("click", ".js-color-cooser-color", function () {
        var t, n, a;
        return t = $(this).closest(".js-label-editor"), n = "#" + $(this).data("hex-color"), a = t.find(".js-color-editor-input"), t.find(".js-label-editor-submit").removeClass("disabled"), t.removeClass("is-valid is-not-valid"), a.val(n), e(a, n)
    }), $(document).on("submit", ".js-label-editor form", function () {
        var t, e;
        return t = $(this).find(".js-color-editor-input"), e = t.val(), e.length < 6 && (e = e[1] + e[1] + e[2] + e[2] + e[3] + e[3]), t.val(e.replace("#", ""))
    }), $(document).on("focus", ".js-label-editor", function () {
        return $(this).closest(".js-label-editor").addClass("open")
    }), $(function () {
        var t;
        return t = $("#issues_list"), t.length ? t.selectableList(".js-color-chooser", {wrapperSelector: ".js-color-cooser-color", mutuallyExclusive: !0}) : void 0
    })
}.call(this), function () {
    $.hashChange(function (t) {
        var e, n, a, i;
        return a = t.newURL, (n = a.match(/\/issues#issue\/(\d+)$/)) ? (i = n[0], e = n[1], window.location = a.replace(/\/?#issue\/.+/, "/" + e)) : void 0
    }), $.hashChange(function (t) {
        var e, n, a, i, s;
        return i = t.newURL, (a = i.match(/\/issues#issue\/(\d+)\/comment\/(\d+)$/)) ? (s = a[0], n = a[1], e = a[2], window.location = i.replace(/\/?#issue\/.+/, "/" + n + "#issuecomment-" + e)) : void 0
    })
}.call(this), function () {
    $(document).on("click", ".js-issues-sort .js-navigation-item", function () {
        return $(this).menu("deactivate")
    }), $(function () {
        var t, e;
        return t = $("#issues_list"), t.length ? (e = function () {
            return $.pjax.reload(t)
        }, t.on("navigation:keydown", ".js-issues-list .js-list-browser-item", function (t) {
            return"x" === t.hotkey ? $(this).click().trigger("change") : void 0
        }), t.selectableList(".js-selectable-issues", {wrapperSelector: ".js-list-browser-item", itemParentSelector: "", enableShiftSelect: !0, ignoreLinks: !0}), t.on("click", ".js-milestone-issue-filter .js-navigation-item", function () {
            return $(this).menu("deactivate")
        }), t.selectableList(".js-issue-sidebar .js-color-label-list"), t.on("click", ".js-editable-labels-container .js-manage-labels", function () {
            var t, n, a, i;
            return t = $(this), n = t.closest(".js-editable-labels-container"), i = n.find(".js-editable-labels-show"), a = n.find(".js-editable-labels-edit"), i.is(":visible") ? (i.hide(), a.show(), t.addClass("selected"), $(document).on("keydown.manage-labels", function (e) {
                return 27 === e.keyCode ? t.click() : void 0
            })) : e(), !1
        }), t.on("ajaxSuccess", ".js-color-label-delete", function () {
            return $(this).closest(".color-label").hide()
        }), t.on("change", ".js-issues-list-select-all", function () {
            var e, n;
            return e = this.checked, n = e ? ":not(:checked)" : ":checked", t.find(".select-toggle-check" + n).prop("checked", e).trigger("change"), t.find(".js-mass-assign-button").toggleClass("disabled", !e), this.indeterminate = !1
        }), t.on("change", ".select-toggle-check", function () {
            var e, n;
            return n = t.find(".js-list-browser-item.selected").length, e = t.find(".select-toggle-check:not(:checked)").length, t.find(".js-mass-assign-button").toggleClass("disabled", !n), $(".js-issues-list-select-all").get(0).indeterminate = n && e
        }), t.find(":checked").removeProp("checked"), t.on("click", ".js-issues-list-close", function () {
            var n;
            return $.ajax({type: "PUT", url: $(this).attr("data-url"), data: {issues: function () {
                var e, a, i, s;
                for (i = t.find(".js-issues-list :checked"), s = [], e = 0, a = i.length; a > e; e++)n = i[e], s.push($(n).val());
                return s
            }()}, success: e}), !1
        }), t.on("ajaxSuccess", ".js-navigation-item", e), t.pageUpdate()) : void 0
    })
}.call(this), function () {
    $(document).on("menu:activate", ".js-issue-mass-assign", function () {
        var t, e, n;
        t = $(this).find("form"), t.find(".js-issue-number").remove(), n = function () {
            var t, n, a, i;
            for (a = $(".js-issues-list-checkbox").filter(":checked"), i = [], t = 0, n = a.length; n > t; t++)e = a[t], i.push($("<input>", {type: "hidden", "class": "js-issue-number", name: "issues[]", value: $(e).val()}));
            return i
        }(), t.append(n)
    }), $(document).on("ajaxSuccess", ".js-issue-mass-assign", function () {
        return $.pjax.reload($("#issues_list"))
    })
}.call(this), function () {
    $(document).on("click", ".js-new-issue-form .js-composer-labels", function (t) {
        return t.preventDefault()
    }), $.pageUpdate(function () {
        var t, e, n, a;
        for (a = $(this).find(".js-new-issue-form"), e = 0, n = a.length; n > e; e++)t = a[e], $(t).data("selectable-list-installed") || ($(t).selectableList(".js-composer-labels"), $(t).data("selectable-list-installed", !0))
    })
}.call(this), function () {
    var t;
    $(document).on("selectmenu:selected", ".js-composer-assignee-picker .js-navigation-item", function () {
        var t, e, n;
        return t = $(this).closest(".js-infobar"), e = $(this).find("input[type=radio]"), n = $(this).hasClass("js-clear-assignee"), t.find(".js-composer-assignee-picker").toggleClass("is-showing-clear-item", !n), t.find(".js-assignee-infobar-item-wrapper").html(function () {
            return n ? "No one will be assigned" : "<a href='/" + e.val() + "' class='css-truncate-target'>" + e.val() + "</a> will be assigned"
        })
    }), $(document).on("selectmenu:selected", ".js-assignee-picker .js-navigation-item", function () {
        var e, n = this;
        return e = $(this).closest("form"), t(e, {}, function () {
            var t, e;
            return t = $(n).closest(".js-assignee-picker"), e = $(n).hasClass("js-clear-assignee"), t.toggleClass("is-showing-clear-item", !e), $(".js-assignee-infobar-item-wrapper").html(function () {
                var t;
                return e ? "No one is assigned" : (t = $(n).find("input[type=radio]"), "<a href='/" + t.val() + "' class='css-truncate-target'>" + t.val() + "</a> is assigned")
            })
        })
    }), $(document).on("selectmenu:selected", ".js-composer-milestone-picker .js-navigation-item", function () {
        var t, e, n, a, i, s = this;
        return t = $(this).closest(".js-infobar"), a = $(this).find("input[type=radio]"), e = t.find('input[name="issue[milestone_id]"]'), n = t.find('input[name="new_milestone_title"]'), $(this).hasClass("js-new-item-form") ? (e.val("new"), n.val($(this).find(".js-new-item-name").html())) : e.val(a[0].value), i = $(this).hasClass("js-clear-milestone"), t.find(".js-composer-milestone-picker").toggleClass("is-showing-clear-item", !i), $(".js-composer-milestone-title").html(function () {
            return i ? "No milestone" : 'Milestone: <strong class="css-truncate-target">' + $(s).find(".js-milestone-title").html() + "</strong>"
        })
    }), $(document).on("selectmenu:selected", ".js-milestone-picker .js-navigation-item", function () {
        var e, n = this;
        return e = $(this).closest("form"), t(e, {}, function (t) {
            var e, a, i;
            return a = $(n).closest(".js-milestone-picker"), i = $(n).hasClass("js-clear-milestone"), a.toggleClass("is-showing-clear-item", !i), e = $(".js-milestone-infobar-item-wrapper"), e.length ? (e.html(t.infobar_body), a.menu("deactivate"), a.find(".js-milestone-picker-body").html(t.select_menu_body)) : void 0
        })
    }), $(document).on("ajaxSend", ".js-issue-list-label-select-menu", function () {
        return $(this).addClass("is-loading")
    }), $(document).on("click", ".js-apply-labels", function () {
        var e, n = this;
        return e = $(this).closest("form"), t(e, {type: "put"}, function () {
            return $(n).menu("deactivate")
        }), !1
    }), $(document).on("click", ".js-remove-labels", function () {
        var e, n = this;
        return e = $(this).closest("form"), t(e, {type: "delete"}, function () {
            return $(n).menu("deactivate")
        }), !1
    }), $(document).on("selectmenu:selected", ".js-issue-show-label-select-menu .js-navigation-item", function () {
        var e, n, a;
        return e = $(this).closest("form"), n = $(this).find("input[type=checkbox]"), a = {type: n.is(":checked") ? "put" : "delete", data: {"issues[]": e.find(".js-issue-number").val(), "labels[]": n.val()}}, t(e, a, function (t) {
            return $(".discussion-labels > .color-label-list, .js-timeline-label-list").html(t.labels)
        }), !1
    }), $(document).onFocusedKeydown(".js-issue-list-label-select-menu .js-filterable-field", function () {
        return function (t) {
            return"enter" === t.hotkey ? !1 : void 0
        }
    }), t = function (t, e, n) {
        var a;
        if (a = t[0])return $.ajax({context: a, type: e.type || t.attr("method"), url: t.attr("action"), data: e.data || t.serialize(), success: n})
    }
}.call(this), function () {
    window.jobsWidgetCallback = function (t) {
        var e, n, a;
        return n = Math.floor(Math.random() * t.jobs.length), e = t.jobs[n], a = $(".github-jobs-promotion"), a.find(".job-link").attr("href", e.url), a.find(".job-company").text(e.company), a.find(".job-position").text(e.position), a.find(".job-location").text(e.location), a.css({visibility: "visible"})
    }, $(function () {
        var t;
        return t = $(".github-jobs-promotion"), t.length ? (t.css("visibility", "hidden"), $.getScript(t.attr("url"))) : void 0
    })
}.call(this), function () {
    var t;
    t = function () {
        var t;
        return t = {div: "#keyboard_shortcuts_pane", ajax: "/site/keyboard_shortcuts?url=" + window.location.pathname}, $.facebox(t, "shortcuts")
    }, $(document).on("click", ".js-keyboard-shortcuts", function () {
        return t(), !1
    }), $(document).on("click", ".js-see-all-keyboard-shortcuts", function () {
        return $(this).remove(), $(".facebox .js-hidden-pane").css("display", "table-row-group"), !1
    }), $(document).on("keypress", function (e) {
        return e.target === document.body ? 63 === e.which ? ($(".facebox:visible").length ? $.facebox.close() : t(), !1) : void 0 : void 0
    })
}.call(this), function () {
    $(document).on("ajaxSuccess", ".js-milestones-assign, .js-milestones-unassign", function () {
        return window.location.reload()
    }), $(document).on("click", ".js-milestone-toggle-state", function () {
        var t, e;
        return e = $(this).val(), t = $(this).parents(".js-milestone-form"), t.find("#milestone_state").val(e)
    })
}.call(this), function () {
    var t;
    $.pageUpdate(t = function () {
        var t, e, n, a;
        for (a = $(this).find("input.js-date-input"), e = 0, n = a.length; n > e; e++)t = a[e], $(t).data("datePicker") || new DateInput(t)
    }), $(document).on("click", ".js-date-input-clear", function () {
        return $("input.js-date-input").data("datePicker").resetDate(), !1
    })
}.call(this), function () {
    var t;
    t = function (t) {
        return $(t).is(".read") ? void 0 : $(t).toggleClass("unread read")
    }, $(document).on("click", ".js-notification-target", function () {
        return t($(this).closest(".js-notification"))
    }), $(document).on("ajaxSuccess", ".js-delete-notification", function () {
        return t($(this).closest(".js-notification"))
    }), $(document).on("ajaxSuccess", ".js-mute-notification", function () {
        var e;
        return t($(this).closest(".js-notification")), e = $(this).closest(".js-notification"), this.action = e.is(".muted") ? this.action.replace("unmute", "mute") : this.action.replace("mute", "unmute"), e.toggleClass("muted")
    }), $(document).on("ajaxSuccess", ".js-mark-visible-as-read", function () {
        var t;
        return t = $(this).closest(".js-notifications-browser"), t.find(".unread").toggleClass("unread read"), t.find(".js-mark-as-read-confirmation").show()
    }), $(document).on("ajaxSuccess", ".js-mark-remaining-as-read", function () {
        var t;
        return t = $(this).closest(".js-notifications-browser"), t.find(".js-mark-remaining-as-read").hide(), t.find(".js-mark-remaining-as-read-confirmation").show()
    }), $(document).on("navigation:keydown", ".js-notification", function (t) {
        switch (t.hotkey) {
            case"I":
            case"e":
            case"y":
                return $(this).find(".js-delete-notification").submit(), !1;
            case"M":
            case"m":
                return $(this).find(".js-mute-notification").submit(), !1
        }
    }), $(document).on("navigation:keyopen", ".js-notification", function () {
        return t(this)
    }), $(document).on("ajaxBeforeSend", ".js-notifications-subscription", function () {
        return $(this).find(".js-spinner").show()
    }), $(document).on("ajaxComplete", ".js-notifications-subscription", function () {
        return $(this).find(".js-spinner").hide()
    })
}.call(this), function () {
    $(document).on("change", '.oauth-section-next input[type="radio"]', function () {
        var t, e;
        return e = $(this).val(), t = $(this).closest(".js-details-container"), t.find(".js-sub-container").toggleClass("open", "limited" === e), t.removeClass("none default public full limited limited-email limited-follow read write via-public via-full"), t.addClass(e), "limited" === e ? ($(".oauth-section-next .js-limited-user").prop("checked", !0), t.addClass("limited-email limited-follow")) : void 0
    }), $(document).on("change", ".oauth-section-next .js-limited-user", function () {
        var t, e;
        return e = $('.oauth-section-next input[name="granted_scope[user]"]:checked').val(), "limited" === e ? (t = $(this).closest(".js-details-container"), t.toggleClass($(this).data("option"), $(this).is(":checked"))) : void 0
    }), $(document).on("change", ".oauth-section-next .js-delete-repo-scope", function () {
        var t;
        return t = $(this).closest(".js-details-container"), t.toggleClass("delete", $(this).is(":checked"))
    }), $(document).on("change", ".oauth-section-next .js-repo-status-scope", function () {
        var t;
        return t = $(this).closest(".js-details-container"), t.removeClass("full none"), t.addClass($(this).is(":checked") ? "full" : "none")
    }), $(document).on("change", ".oauth-section-next .js-notifications-scope", function () {
        var t;
        return t = $(this).closest(".js-details-container"), t.removeClass("read none"), t.addClass($(this).is(":checked") ? "read" : "none")
    }), $(document).on("change", ".oauth-section-next .js-gist-scope", function () {
        var t;
        return t = $(this).closest(".js-details-container"), t.removeClass("full none"), t.addClass($(this).is(":checked") ? "full" : "none")
    })
}.call(this), function () {
    $(document).on("click", ".js-orgs-next-coming-soon", function () {
        return alert("Coming Soon™"), !1
    })
}.call(this), function () {
    $.pageUpdate(function () {
        var t;
        return t = {}, $(".js-activity-timestamp").each(function () {
            var e, n, a;
            return e = $(this), a = Date.parse(e.attr("data-timestamp")), a > moment().startOf("day")._d && (n = "Today"), a > moment().subtract("days", 1).startOf("day") && (n || (n = "Yesterday")), n || (n = "Previously"), t[n] ? void 0 : (t[n] = !0, e.text(n))
        })
    })
}.call(this), function () {
    $(document).on("ajaxSend", ".js-remove-member", function () {
        return $(this).closest(".js-removing").css({opacity: .5}), $(this)
    }), $(document).on("ajaxSuccess", ".js-remove-member", function () {
        return $(this).closest(".js-removing").remove()
    })
}.call(this), function () {
    $(document).on("throttled:input", "[data-member-search-path]", function () {
        var t, e, n, a;
        return t = $(this), t.closest("form").addClass("is-sending"), e = t.val(), a = t.attr("data-member-search-path") + ("?query=" + e), n = $.ajax({url: a}), n.done(function (e) {
            return t.closest("form").removeClass("is-sending"), $("#org-members").html(e)
        })
    }), $(document).on("change", ".js-org-person-toggle", function () {
        var t, e, n, a;
        return a = $(this).closest(".js-person-grid"), t = a.find(".js-org-person").has(".js-org-person-toggle:checked"), e = function () {
            var e, a, i;
            for (i = [], e = 0, a = t.length; a > e; e++)n = t[e], i.push($(n).attr("data-id"));
            return i
        }(), e.length ? $(".js-remove-members-button").removeAttr("disabled") : $(".js-remove-members-button").attr("disabled", "disabled"), $(".js-selected-person-ids").val(e.join(","))
    }), $(document).on("ajaxSuccess", ".js-remove-members-form", function (t, e, n, a) {
        return $(".js-org-section").prepend(a), $(".js-org-person").has(".js-org-person-toggle:checked").fadeOut(500, function () {
            return $(this).remove(), $(".js-org-person-toggle").fire("change")
        })
    }), $(document).on("click", ".js-confirm-removal .js-dismiss", function () {
        return $(this).closest(".js-confirm-removal").remove(), !1
    }), $(document).on("click", ".js-confirm-removal .js-undo", function () {
        return alert("Coming Soon™"), !1
    })
}.call(this), function () {
    var t;
    t = function () {
        var t, e;
        return e = function () {
            var e, n, a, i;
            for (a = $(".js-pending-member"), i = [], e = 0, n = a.length; n > e; e++)t = a[e], i.push($(t).attr("data-id"));
            return i
        }(), $(".js-pending-member-ids").val(e.join(","))
    }, $(document).on("member-adder:added", "#member-list", function () {
        return $(".js-blankslate").addClass("hidden"), t()
    }), $(document).on("click", ".js-remove-pending-member", function () {
        return $(this).closest(".js-pending-member").remove(), $(".js-blankslate").toggleClass("hidden", $(".js-pending-member").length), t(), !1
    })
}.call(this), function () {
    $(document).onFocusedInput("#organization_login", function () {
        var t;
        return t = $(this).closest("dd").find(".js-field-hint-name"), function () {
            return t.text($(this).val())
        }
    }), $(document).on("details:toggle", ".discussion-bubble-inner", function (t) {
        return $(t.relatedTarget).hasClass("is-jump-link") ? !1 : void 0
    })
}.call(this), function () {
    $.pageUpdate(function () {
        var t;
        return t = $(".js-orgs-people-filter-list a:first").is(".selected"), $(".js-orgs-people-filter-list [data-container-id]").each(function () {
            var e;
            return e = $(document.getElementById($(this).attr("data-container-id"))), t ? e.addClass("is-showing-all") : $(this).is(".selected") ? void 0 : e.addClass("hidden")
        })
    }), $(document).on("filterable:change", ".js-member-search-name", function () {
        var t, e, n, a, i;
        for ($(".js-has-counter").trigger("counters:change"), e = 0, i = $(".js-orgs-people-filter-list .js-count"), n = 0, a = i.length; a > n; n++)t = i[n], e += Number($(t).text());
        return $(".js-orgs-people-filter-list .count:first").text(e)
    }), $(document).on("ajaxBeforeSend", ".js-revoke-invitation", function (t) {
        return $(t.target).before("<img class='js-spinner' src='" + GitHub.Ajax.spinner + "' width='16' />")
    }), $(document).on("ajaxSuccess", ".js-revoke-invitation", function (t, e, n, a) {
        return $(".js-pending-invitations").html(a).pageUpdate()
    }), $(document).on("click", ".js-orgs-people-filter-list a", function () {
        var t, e, n, a, i;
        return a = $(this), n = a.closest(".js-orgs-people-filter-list"), t = n.find("[data-container-id]").map(function () {
            return document.getElementById($(this).attr("data-container-id"))
        }), n.find("a.selected").removeClass("selected"), $(t).addClass("hidden"), a.addClass("selected"), (e = document.getElementById(a.attr("data-container-id"))) ? ($(e).removeClass("hidden"), $(e).removeClass("is-showing-all")) : ($(t).removeClass("hidden"), $(t).addClass("is-showing-all")), "function" == typeof(i = window.history).replaceState && i.replaceState(null, document.title, a.attr("href")), n.pageUpdate(), !1
    })
}.call(this), function () {
    var t;
    $(document).on("member-adder:added", ".js-member", function (t) {
        return $(".js-member li").length > 1 && $(".js-member li:not(:last)").remove(), $(".js-add-member").val(""), $(t.target).find("input").removeAttr("disabled"), $(".js-new-member-form :submit").removeClass("disabled")
    }), $(document).on("click", ".js-remove-suggestion", function (t) {
        var e, n, a, i, s;
        return i = $($(this).attr("data-suggestions")), e = $($(this).attr("data-adder")), t.preventDefault(), a = $(this).closest("li").attr("data-value"), $(this).closest("li").find("input").attr("disabled", !0), i.append($(this).closest("li").detach()), s = e.find("ul"), (n = s.data("fuzzy-sort-items")) ? (n.push(i.find("li[data-value='" + a + "']")[0]), s.data("fuzzy-sort-items", n)) : void 0
    }), $(document).onFocusedKeydown(".js-add-member, .js-add-team, .js-add-repository", function () {
        return function (t) {
            return"ctrl+enter" === t.hotkey || "meta+enter" === t.hotkey ? ($(".js-new-member-form :submit").attr("disabled") || $(this).closest("form").submit(), !1) : void 0
        }
    }), t = null, $(document).on("change", ".js-member-permission", function (e) {
        return"admin" === $(e.target).val() ? (t = $(".js-billing-manager").prop("checked"), $(".js-billing-manager").prop("checked", !0), $(".js-billing-manager").prop("disabled", !0)) : ($(".js-billing-manager").prop("checked", t), $(".js-billing-manager").prop("disabled", !1))
    }), $.pageUpdate(function () {
        return $(".js-add-member").focus()
    })
}.call(this), function () {
    $(document).on("ajaxSuccess", ".js-update-member-form", function (t) {
        return $(t.target).find(".js-success").removeClass("hidden")
    }), $(document).on("ajaxSend", ".js-update-member-form", function (t) {
        return $(t.target).find(".js-success").addClass("hidden")
    }), $(document).on("member-adder:added", ".js-org-member-membership-list", function (t) {
        return $(t.target).find("input").removeAttr("disabled")
    })
}.call(this), function () {
    $(document).on("throttled:input", "[data-repository-search-path]", function () {
        var t, e, n, a, i;
        return t = $(this), t.closest("form").addClass("is-sending"), n = t.val(), i = t.attr("data-repository-search-path") + ("?query=" + n), e = $(".js-no-org-repositories"), a = $.ajax({url: i}), a.done(function (n) {
            return t.closest("form").removeClass("is-sending"), $("#org-repositories").html(n), n.trim() ? e.addClass("hidden") : e.removeClass("hidden")
        })
    })
}.call(this), function () {
    var t, e;
    t = function () {
        var t, e, n, a, i, s, r, o;
        for (n = {}, r = document.location.search.slice(1).split("&"), i = 0, s = r.length; s > i; i++)e = r[i], e.length && (o = e.split("=").map(unescape), t = o[0], a = o[1], n[t] = a);
        return n
    }, e = function (e) {
        var n, a, i, s, r;
        n = [location.protocol, "//", location.host, location.pathname].join(""), i = t(), i.q = e, s = [];
        for (a in i)r = i[a], s.push("" + a + "=" + r);
        return window.history.replaceState({}, "", n + "?" + s.join("&"))
    }, $(document).on("focusin", ".js-repo-search", function () {
        return $(this).on("throttled:input.repoSearch", function () {
            var t, n;
            return t = $(this), t.val().trim() ? (e(t.val().trim()), t.closest(".js-repo-search").addClass("is-loading"), n = $.ajax({url: t.data("search-url") + "?query=" + t.val(), method: "GET"}), n.complete(function (e) {
                return t.closest(".js-repo-search").removeClass("is-loading"), $(".js-repo-list").hide(), $(".js-repo-search-results").html(e.responseText), $(".pagination").hide()
            })) : e("")
        }), $(this).on("keyup.repoSearch", function () {
            return $(this).val().trim() ? void 0 : ($(".js-repo-list").show(), $(".js-repo-search-results").html(""), $(".pagination").show())
        }), $(this).on("blur.repoSearch", function () {
            return $(this).off(".repoSearch")
        })
    }), $(function () {
        return $(".js-repo-search").val() ? ($(".js-repo-search").focus(), $(".js-repo-search").trigger("throttled:input.repoSearch")) : void 0
    })
}.call(this), function () {
    $(document).on("ajaxBeforeSend", ".js-delete-team", function () {
        return $(this).addClass("disabled")
    }), $(document).on("ajaxSuccess", ".js-delete-team", function () {
        return $(this).closest(".js-team").remove()
    }), $(document).on("click", ".js-cancel-note", function () {
        var t, e;
        return e = $(this).closest(".js-uploadable-container"), e.removeClass("is-default"), $(".js-note-form", e).removeClass("active"), t = $(".js-note-body", e), t.css({height: "1em"}), !1
    }), $(document).on("focus", ".js-note-body", function () {
        return $(this).closest(".js-uploadable-container").addClass("is-default"), $(this).closest(".js-note-form").addClass("active")
    }), $(document).on("ajaxBeforeSend", ".js-note-form", function () {
        return $(".js-note-body").val().trim() && !$(this).hasClass("is-submitting") ? $(this).addClass("is-submitting") : ($(".js-note-body").focus(), !1)
    }), $(document).on("ajaxSuccess", ".js-note-form", function (t, e, n, a) {
        return $(this).closest(".js-uploadable-container").removeClass("is-default"), $(this).removeClass("active"), $(this).removeClass("is-submitting"), $(".js-activity-list").prepend(a), $(".js-note-body", this).val(""), $(".js-note-body", this).css({height: "1em"})
    }), $(document).on("ajaxSuccess", ".js-delete-note", function () {
        return $(this).closest(".js-note").remove()
    }), $(document).on("click", ".js-toggle-note-comments", function () {
        var t;
        return t = $(this).closest(".js-note"), $(".js-note-comments", t).toggleClass("active"), $(".js-comment-body", t).focus(), !1
    }), $(document).on("focus", ".js-comment-body", function () {
        return $(this).closest(".js-note-comment-form").addClass("active")
    }), $(document).on("ajaxBeforeSend", ".js-note-comment-form", function () {
        return $(".js-comment-body").val().trim() ? void 0 : ($(".js-comment-body").focus(), !1)
    }), $(document).on("ajaxSuccess", ".js-note-comment-form", function (t, e, n, a) {
        var i;
        return i = $(this).closest(".js-note"), $(".js-comment-list", i).append(a), $(".js-comment-body", i).val("")
    }), $(document).on("ajaxSuccess", ".js-delete-note-comment", function () {
        return $(this).closest(".js-note-comment").remove(), !1
    }), $(document).on("click", ".js-toggle-note-star", function () {
        var t, e;
        return t = $(this), t.toggleClass("active"), e = t.next(".js-note-starred-users"), t.hasClass("active") ? (e.prepend($("<img class='starred-user' src='https://github.com/" + e.data("login") + ".png' />")), $.ajax({url: t.data("star-path"), method: "POST"})) : (e.find("img[src*=" + e.data("login") + "]").remove(), $.ajax({url: t.data("unstar-path"), method: "POST"})), !1
    })
}.call(this), function () {
    $(document).on("ajaxSuccess", ".js-edit-team-description", function () {
        return $(".js-team-description").text($(".edit-team-description :text").val()), $(this).closest(".js-details-container").removeClass("open")
    }), $(document).onFocusedInput(".js-edit-team-name", function () {
        return function () {
            var t;
            return t = /[^0-9A-Za-z_\.]/g, $(this).val($(this).val().replace(t, "-"))
        }
    })
}.call(this), function () {
    $(document).on("throttled:input", "[data-team-search-path]", function () {
        var t, e, n, a, i;
        return t = $(this), t.closest("form").addClass("is-sending"), n = t.val(), i = t.attr("data-team-search-path") + ("?query=" + n), e = $(".js-no-org-teams"), a = $.ajax({url: i}), a.done(function (n) {
            return t.closest("form").removeClass("is-sending"), $("#org-teams").html(n), n.trim() ? e.addClass("hidden") : e.removeClass("hidden")
        })
    })
}.call(this), function () {
    $(document).on("throttled:input", ".js-orgs-next-new-team", function () {
        var t, e, n = this;
        return t = $(this).closest("form"), t.addClass("is-sending"), t.find(".octicon").attr("class", "octicon hidden"), e = $.get($(this).attr("data-check-url"), {name: this.value}), e.done(function (e) {
            return t.removeClass("is-sending"), e ? $(".js-orgs-next-team-name-errors").html(e) : $(".js-orgs-next-team-name-errors").html(""), t.find(".js-error").length || !n.value.trim() ? $(".js-create-team-button").attr("disabled", "disabled") : $(".js-create-team-button").removeAttr("disabled"), t.find(".js-error").length ? t.find(".octicon").attr("class", "octicon octicon-alert") : n.value.trim() ? t.find(".octicon").attr("class", "octicon octicon-check") : void 0
        })
    }), $(document).on("submit", ".js-orgs-next-new-team-form", function () {
        return $(this).find(".js-error").length ? !1 : $(".js-orgs-next-new-team").val().trim() ? void 0 : !1
    })
}.call(this), function () {
    $(document).on("change", ".js-team-enrollment input[type=radio]", function (t) {
        return $(t.target).closest("form").submit()
    }), $(document).on("click", ".js-toggle-edit-team-members", function () {
        var t, e;
        return $(this).toggleClass("selected"), t = $(this).hasClass("selected"), e = t ? $(this).attr("data-edit-path") : $(this).attr("data-index-path"), $(".js-find-or-add").toggleClass("smaller", t), $(".js-add-member").toggleClass("active", t), t ? $(".js-add-member").removeAttr("disabled") : $(".js-add-member").attr("disabled", "disabled"), $(".js-add-member").focus(), $("#team-member-container").load(e), !1
    }), $(".js-team-description").on("toggle.description", function (t, e) {
        var n, a, i;
        return n = $(this), a = n.find("p").first(), i = n.find(".js-team-description-form"), null != e ? (a.addClass("hidden"), i.removeClass("hidden"), i.find(".js-team-description-field").focus()) : (a.removeClass("hidden"), i.addClass("hidden"))
    }), $(".js-team-description").on("click", ".js-team-description-toggle", function (t) {
        return t.preventDefault(), $(this).closest(".js-team-description").trigger("toggle.description", {edit: !0})
    }), $(".js-team-description").on("blur", ".js-team-description-form", function () {
        var t, e;
        return t = $(this).closest(".js-team-description"), e = $(this).find(".js-team-description-field"), e.val() === e.data("original") ? t.trigger("toggle.description") : $(this).submit()
    }), $(".js-team-description").on("ajaxSuccess", ".js-team-description-form", function () {
        var t, e, n;
        return t = $(this).closest(".js-team-description"), e = $(this).find(".js-team-description-field"), n = t.find(".js-team-description-toggle"), e.data("original", e.val()), e.val().trim() ? (n.text(e.val()), n.attr("original-title", "Change your team’s description")) : (n.text("Add a description"), n.attr("original-title", "")), t.trigger("toggle.description")
    }), $(document).on("throttled:input", "[data-team-member-search-path]", function () {
        var t, e, n, a;
        return t = $(this), t.closest("form").addClass("is-sending"), e = t.val(), a = t.attr("data-team-member-search-path") + ("?query=" + e), $(".js-toggle-edit-team-members").hasClass("selected") && (a += "&editing=1"), n = $.ajax({url: a}), n.done(function (e) {
            return t.closest("form").removeClass("is-sending"), $("#team-member-container").html(e)
        })
    }), $(document).on("ajaxSuccess", ".js-remove-team-members-form", function (t, e, n, a) {
        var i = this;
        return $(".js-org-section").prepend(a), $(this).closest(".js-edit-team-member").fadeOut(500, function () {
            return $(i).remove()
        })
    }), $(document).on("click", ".js-confirm-removal .js-dismiss", function () {
        return $(this).closest(".js-confirm-removal").remove(), !1
    }), $(document).on("click", ".js-confirm-removal .js-undo", function () {
        return alert("Coming Soon™"), !1
    }), $(document).on("click", ".js-team-action", function () {
        var t;
        return t = $(this), t.hasClass("js-orgs-next-open-team") && $.ajax({url: t.attr("data-url"), method: "put"}), t.hasClass("js-orgs-next-close-team") && $.ajax({url: t.attr("data-url"), method: "put"}), t.hasClass("js-orgs-next-delete-team") && confirm("Are you sure you want to delete this team? (this will be an undo thing once abilities land)") ? $(this).find("form").submit() : void 0
    })
}.call(this), function () {
    $(document).on("filterable:change", ".js-team-search-name", function () {
        return $(".js-team-list:visible").hasClass("filterable-empty") ? $(".js-details-container").addClass("no-results") : $(".js-details-container").removeClass("no-results")
    }), $(document).onFocusedInput(".js-new-team-name", function () {
        return function () {
            var t, e, n;
            return t = $(this), e = /[^0-9A-Za-z_\.]/g, n = $(".js-warning", t.closest(".js-create-team")), $(".js-actual-team-name").val(t.val().replace(e, "-")), t.val() ? (n.html("Will be created as <code>" + t.val().replace(e, "-") + "</code>"), e.test(t.val()) ? n.is(":visible") ? void 0 : n.fadeIn(200) : n.fadeOut(200)) : void 0
        }
    }), $(document).on("click", ".js-toggle-all-teams", function () {
        return $(".js-all-teams").toggle(), $(".js-your-teams").toggle(), $(".js-team-search-name").toggle(), !1
    }), $(document).on("click", ".js-show-more-members", function () {
        return $(this).closest(".js-meta").toggleClass("show-all"), !1
    })
}.call(this), function () {
    $(function () {
        var t;
        return $("#load-readme").click(function () {
            var e, n, a, i, s, r;
            return n = $("#gollum-editor-body"), e = $("#editor-body-buffer"), i = $("#undo-load-readme"), r = e.text(), t(n, e), a = $(this), a.prop("disabled", !0), a.text(a.data("readme-name") + " loaded"), i.show(), s = function () {
                return $(this).val() !== r && i.hide(), n.off("change keyup", s)
            }, n.on("change keyup", s), !1
        }), $("#undo-load-readme").click(function () {
            var e;
            return t($("#gollum-editor-body"), $("#editor-body-buffer")), e = $("#load-readme"), e.prop("disabled", !1), e.text("Load " + e.data("readme-name")), $(this).hide(), !1
        }), t = function (t, e) {
            var n, a, i;
            return n = $(t), a = $(e), i = n.val(), n.val(a.text()), a.text(i)
        }
    })
}.call(this), function () {
    $.pageUpdate(function () {
        return $(".js-profile-to-repo-search")[0] ? $(document).on("submit", ".js-profile-to-repo-search", function () {
            var t, e, n;
            return t = $(".js-profile-to-repo-search").data("login"), n = $("#your-repos-filter").val(), e = "@" + t + " " + n, -1 === n.search("@" + t) ? $("#your-repos-filter").val(e) : void 0
        }) : void 0
    })
}.call(this), function () {
    var t, e, n;
    n = function (t) {
        return 500 === t.status ? "Oops, something went wrong." : t.responseText
    }, t = 0, $(document).on("ajaxSend", ".js-cleanup-pull-request", function () {
        return $(this).removeClass("error"), $(this).addClass("disabled"), $(this).find(".button").addClass("disabled")
    }), $(document).on("ajaxComplete", ".js-cleanup-pull-request", function () {
        return $(this).removeClass("disabled"), $(this).find(".button").removeClass("disabled")
    }), $(document).on("ajaxSuccess", ".js-cleanup-pull-request", function (e, n) {
        return $(this).find(".message").html(n.responseText), 1 === t ? t = 0 : ($(this).find(".merge-branch").removeClass("merging").addClass("deleted"), $(this).find(".button").hide())
    }), $(document).on("ajaxError", ".js-cleanup-pull-request", function (t, e) {
        return $(this).addClass("error"), $(this).closest(".merge-branch").removeClass("mergeable-merged").addClass("mergeable-error"), $(this).find(".js-cleanup-error-message").html(n(e)), !1
    }), $(document).on("click", ".js-delete-form-reload", function () {
        return window.location.reload()
    }), e = function (t, e) {
        var a;
        return a = $(document).find(".js-head-ref-pull-request").show().find(".message"), e ? a.html(n(e)) : void 0
    }, $(document).on("ajaxSend", ".js-restore-head-ref", function () {
        return $(this).hide(), $(this).next().show(), e(this)
    }), $(document).on("ajaxSuccess", ".js-restore-head-ref", function (n, a) {
        var i, s, r, o;
        return e(this, a), o = $(this), o.parent().hide(), r = o.closest(".mergeable"), r.removeClass("deleted"), s = o.closest(".merge-branch"), s.hasClass("mergeable-dirty") || r.addClass("merging"), i = r.find(".button"), i.show().removeClass("disabled"), t = 1, !0
    }), $(document).on("ajaxError", ".js-restore-head-ref", function (t, n) {
        return e(this, n), !1
    })
}.call(this), function () {
    $(document).on("details:toggled", "#js-pull-merging", function () {
        var t;
        return t = $(this).find(".js-merge-pull-request"), t.toggleClass("js-dirty", t.is(":visible"))
    }), $(document).on("ajaxSuccess", ".js-merge-pull-request", function (t, e, n, a) {
        var i, s, r;
        this.reset(), $(this).removeClass("js-dirty"), r = a.updateContent;
        for (s in r)i = r[s], $(s).updateContent(i)
    }), $(document).on("ajaxError", ".js-merge-pull-request", function (t, e) {
        return $(this).addClass("error"), $(this).closest(".merge-branch").removeClass("mergeable-clean").addClass("mergeable-error"), $(this).find(".js-merge-error-message").text(e.responseText), !1
    }), $(document).on("click", ".js-merge-form-reload", function () {
        return window.location.reload()
    })
}.call(this), function () {
    $(document).on("click", ".js-pull-request-tab", function (t) {
        var e, n, a, i, s, r;
        if (2 === t.which || t.metaKey)return!0;
        if (e = $("#" + $(this).attr("data-container-id")), e.length) {
            for (r = $(".js-pull-request-tab.selected"), i = 0, s = r.length; s > i; i++)n = r[i], $(n).removeClass("selected"), $("#" + $(n).attr("data-container-id")).removeClass("is-visible");
            return e.addClass("is-visible"), $(this).addClass("selected"), "function" == typeof(a = window.history).replaceState && a.replaceState(null, document.title, this.href), !1
        }
    }), $.hashChange(function (t) {
        return $(t.target).closest(".js-details-container").addClass("open")
    }), $(document).on("ajaxSuccess", ".js-inline-comment-form", function () {
        return $(this).closest("#discussion_bucket").length ? $("#files_bucket").remove() : $("#discussion_bucket").remove()
    }), $(document).on("socket:message", ".js-pull-request-tabs", function () {
        $(this).ajax()
    }), $(document).on("ajaxSuccess", ".js-pull-request-tabs", function (t, e, n, a) {
        var i;
        return i = $($.parseHTML(a)), $(this).find("#commits_tab_counter").replaceWith(i.find("#commits_tab_counter")), $(this).find("#files_tab_counter").replaceWith(i.find("#files_tab_counter")), $(this).pageUpdate()
    }), $(document).on("socket:message", ".js-pull-request-stale-files", function () {
        return $("#files_bucket").addClass("is-stale").pageUpdate()
    })
}.call(this), function () {
    $(document).on("change", ".js-pulse-period", function (t) {
        var e;
        return e = $(t.target).attr("data-url"), $.pjax({url: e, container: "#js-repo-pjax-container"})
    })
}.call(this), function () {
    $(document).on("navigation:open", ".js-create-branch", function () {
        return $(this).submit(), !1
    }), $(document).on("navigation:open", ".js-create-tag", function () {
        var t, e, n, a, i, s;
        return e = $(this), a = $(".js-select-button"), n = $(".js-spinner"), t = $(".js-error"), i = $(".js-new-item-value").val(), s = $(".js-create-tag").attr("data-url"), a.text("Creating tag..."), n.show(), t.hide(), $.ajax({url: s, type: "POST", data: {tag_name: i}, success: function () {
            var t, n;
            return a.text(i), n = e.closest(".select-menu-list").find(".select-menu-item-template"), n.length ? (t = n.clone().removeClass("select-menu-item-template").addClass("selected"), t.insertBefore(n), t.find(".js-select-button-text").text(i)) : void 0
        }, complete: function () {
            return n.hide()
        }, error: function () {
            return t.show(), a.text("No tag selected")
        }}), !1
    })
}.call(this), function () {
    var t, e, n, a, i, s, r;
    $(document).on("click", ".js-releases-field a.remove", function () {
        var t;
        return t = $(this).closest("li"), t.addClass("delete"), t.find("input.destroy").val("true"), !1
    }), $(document).on("click", ".js-releases-field a.undo", function () {
        var t;
        return t = $(this).closest("li"), t.removeClass("delete"), t.find("input.destroy").val(""), !1
    }), $(document).on("click", ".js-timeline-tags-expander", function () {
        return $(this).closest(".js-timeline-tags").removeClass("is-collapsed")
    }), a = ["is-default", "is-saving", "is-saved", "is-failed"], i = function (t, e) {
        return t.removeClass(a.join(" ")), t.addClass(e), "is-saving" === e ? t.attr("disabled", "disabled") : t.removeAttr("disabled")
    }, $(document).on("click", ".js-save-draft", function (t, e) {
        var a, s, r, o, c, l;
        return $("#release_draft").val("1"), a = $(this), o = a.closest("form"), r = $("#delete_release_confirm form"), c = o.data("repo-url"), l = o.attr("action"), s = o.serialize(), i(a, "is-saving"), $.ajax({url: l, type: "POST", data: s, dataType: "json", success: function (t) {
            var s, l;
            return l = n("tag", c, t.tag_name), o.attr("action", l), r.attr("action", l), window.history.replaceState(null, document.title, n("edit", c, t.tag_name)), s = $("#release_id"), s.val() || (s.val(t.id), o.append('<input type="hidden" id="release_method" name="_method" value="put" />')), i(a, "is-saved"), setTimeout(function () {
                return i(a, "is-default")
            }, 5e3), e ? e() : void 0
        }, complete: function () {
        }, error: function () {
            return i(a, "is-failed")
        }}), t.preventDefault()
    }), $(document).on("click", ".js-publish-release", function () {
        return $("#release_draft").val("0")
    }), r = ["is-loading", "is-empty", "is-valid", "is-invalid", "is-duplicate", "is-pending"], s = function (t) {
        var e;
        switch (t) {
            case"is-valid":
                $(".release-target-wrapper").addClass("hidden");
                break;
            case"is-loading":
                break;
            default:
                $(".release-target-wrapper").removeClass("hidden")
        }
        return e = $(".js-release-tag"), e.removeClass(r.join(" ")), e.addClass(t)
    }, t = function (t) {
        return t.val() && t.val() !== t.attr("data-last-checked") ? (s("is-loading"), $.ajax({url: t.attr("data-url"), type: "GET", data: {tag_name: t.val()}, dataType: "json", success: function (e) {
            return"duplicate" === e.status && parseInt(t.attr("data-existing-id")) === parseInt(e.release_id) ? (s("is-valid"), void 0) : ($(".js-release-tag .js-edit-release-link").attr("href", e.url), s("is-" + e.status))
        }, error: function () {
            return s("is-invalid")
        }, complete: function () {
            return t.attr("data-last-checked", t.val())
        }})) : void 0
    }, n = function (t, e, n) {
        return"" + e + "/releases/" + t + "/" + n
    }, $(document).on("blur", ".js-release-tag-field", function () {
        return t($(this))
    }), $(e = function () {
        return t($(".js-release-tag-field"))
    })
}.call(this), function () {
    var t;
    t = function () {
        function t() {
            var e = this;
            this.validate = function () {
                return t.prototype.validate.apply(e, arguments)
            }, this.updateUpsell = function () {
                return t.prototype.updateUpsell.apply(e, arguments)
            }, this.selectedPrivacyToggleElement = function () {
                return t.prototype.selectedPrivacyToggleElement.apply(e, arguments)
            }, this.handlePrivacyChange = function (n, a) {
                return null == n && (n = e.selectedPrivacyToggleElement()), null == a && (a = null), t.prototype.handlePrivacyChange.apply(e, arguments)
            }, this.handleOwnerChange = function () {
                return t.prototype.handleOwnerChange.apply(e, arguments)
            }, this.elements = {ownerContainer: $(".js-owner-container"), iconPreviewPublic: $(".js-icon-preview-public"), iconPreviewPrivate: $(".js-icon-preview-private"), upgradeUpsell: $("#js-upgrade-container").hide(), upgradeConfirmationCheckbox: $(".js-confirm-upgrade"), upsells: $(".js-upgrade"), privacyToggles: $(".js-privacy-toggle"), privateRadio: $(".js-privacy-toggle[value=false]"), publicRadio: $(".js-privacy-toggle[value=true]"), repoNameField: $("input[type=text].js-repo-name"), form: $("#new_repository"), licenseContainer: $(".js-license-container"), ignoreContainer: $(".js-ignore-container"), autoInitCheckbox: $(".js-auto-init-checkbox"), teamBoxes: $(".js-team-select"), suggestion: $(".js-reponame-suggestion")}, this.current_login = $("input[name=owner]:checked").prop("value"), this.privateRepo = !1, this.autocheckURL = this.elements.repoNameField.attr("data-autocheck-url"), this.changedPrivacyManually = !1, this.elements.teamBoxes.hide(), this.elements.ignoreContainer.on("change", "input[type=radio]", function () {
                return $(".js-auto-init-checkbox").prop("checked", !0)
            }), this.elements.licenseContainer.on("change", "input[type=radio]", function () {
                return $(".js-auto-init-checkbox").prop("checked", !0)
            }), this.elements.ownerContainer.on("change", "input[type=radio]", this.handleOwnerChange), this.elements.privacyToggles.on("change", function (t) {
                return e.handlePrivacyChange(t.targetElement, t)
            }), this.elements.repoNameField.on("change input", function (t) {
                return $(t.target).removeClass("is-autocheck-successful"), e.validate()
            }), this.elements.upgradeUpsell.on("change input", "input", this.validate), this.elements.form.on("repoform:validate", this.validate), this.elements.suggestion.on("click", function (t) {
                var n;
                return n = e.elements.repoNameField, n.val($(t.target).text()), n.trigger("change")
            }), this.handleOwnerChange(), this.updateUpsell(), this.validate()
        }

        return t.prototype.handleOwnerChange = function () {
            var t, e, n;
            return this.current_login = $("input[name=owner]:checked").prop("value"), e = "" + this.autocheckURL + "?owner=" + encodeURIComponent(this.current_login), this.elements.repoNameField.attr("data-autocheck-url", e), this.elements.repoNameField.trigger("change"), n = this.elements.ownerContainer.find(".select-menu-item.selected"), this.elements.teamBoxes.hide().find("input, select").prop("disabled", !0), t = this.elements.teamBoxes.filter("[data-login=" + this.current_login + "]"), t.show().find("input, select").prop("disabled", !1), this.changedPrivacyManually || ("private" === n.attr("data-default") ? this.elements.privateRadio.prop("checked", "checked").change() : this.elements.publicRadio.prop("checked", "checked").change()), this.handlePrivacyChange(), "yes" === n.attr("data-permission") ? ($(".with-permission-fields").show(), $(".without-permission-fields").hide(), $(".errored").show(), $("dl.warn").show()) : ($(".with-permission-fields").hide(), $(".without-permission-fields").show(), $(".errored").hide(), $("dl.warn").hide()), this.updateUpsell()
        }, t.prototype.handlePrivacyChange = function (t, e) {
            return null == t && (t = this.selectedPrivacyToggleElement()), null == e && (e = null), e && !e.isTrigger && (this.changedPrivacyManually = !0), "false" === t.val() ? (this.privateRepo = !0, this.elements.upgradeUpsell.show(), this.elements.upgradeUpsell.find("input[type=checkbox]").prop("checked", "checked"), this.elements.iconPreviewPublic.hide(), this.elements.iconPreviewPrivate.show()) : (this.privateRepo = !1, this.elements.upgradeUpsell.hide(), this.elements.upgradeUpsell.find("input[type=checkbox]").prop("checked", null), this.elements.form.attr("action", this.elements.form.attr("data-url")), this.elements.iconPreviewPrivate.hide(), this.elements.iconPreviewPublic.show()), this.validate()
        }, t.prototype.selectedPrivacyToggleElement = function () {
            return this.elements.privateRadio.is(":checked") ? this.elements.privateRadio : this.elements.publicRadio
        }, t.prototype.updateUpsell = function () {
            var t;
            return t = this.elements.upsells.filter("[data-login=" + this.current_login + "]"), this.elements.upgradeUpsell.html(t)
        }, t.prototype.validate = function () {
            var t, e, n;
            return t = this.elements.form, n = !0, this.elements.repoNameField.is(".is-autocheck-successful") || (n = !1), t.find("dl.form.errored").length && (n = !1), t.find(".is-autocheck-loading").length && (n = !1), e = this.elements.upgradeUpsell.find("input[type=checkbox]"), this.privateRepo && e.length && !e.is(":checked") && (n = !1), $("button.primary").prop("disabled", !n)
        }, t
    }(), $(function () {
        return $(".page-new-repo").length ? new t : void 0
    }), $(document).on("autocheck:send", "#repository_name", function () {
        $(this).trigger("repoform:validate")
    }), $(document).on("autocheck:complete", "#repository_name", function () {
        return $(this).trigger("repoform:validate")
    }), $(document).on("autocheck:success", "#repository_name", function (t, e) {
        var n, a, i;
        return a = $(this).val(), a && a !== e.name ? (n = $(this).closest("dl.form"), n.addClass("warn"), i = $("<dd>").addClass("warning").text("Will be created as " + e.name), n.append(i)) : void 0
    }), $(document).on("menu:activated", ".js-ignore-container", function () {
        var t, e;
        return t = $(this).find(".js-menu-content"), e = t.overflowOffset(), e.bottom <= -10 ? t.css({marginTop: e.bottom - 20}) : void 0
    })
}.call(this), function () {
    var t;
    $(document).on("pjax:end", function () {
        var t, e, n, a, i, s, r, o, c, l;
        if (a = $(document.head).find("meta[name='selected-link']").attr("value"), null != a)for (e = $(".js-repository-container-pjax .js-selected-navigation-item").removeClass("selected"), i = 0, r = e.length; r > i; i++)for (t = e[i], l = null != (c = $(t).attr("data-selected-links")) ? c.split(" ") : void 0, s = 0, o = l.length; o > s; s++)n = l[s], n === a && $(t).addClass("selected")
    }), $(document).on("click", ".js-repo-home-link, .js-repository-container-pjax a", function (t) {
        var e, n;
        if (!$(this).hasClass("js-disable-pjax"))return n = !1, e = $("#js-repo-pjax-container"), $.pjax.click(t, {container: e, scrollTo: n})
    }), t = function () {
        var t;
        return t = null != document.getElementById("js-show-full-navigation"), $(".repository-with-sidebar").toggleClass("with-full-navigation", t)
    }, $(function () {
        var e;
        return(e = document.getElementById("js-repo-pjax-container")) ? t(e) : void 0
    }), $(document).on("pjax:end", "#js-repo-pjax-container", function () {
        return t(this)
    }), $(document).on("tipsy:show", ".js-repo-nav", function () {
        return!$(this).closest(".repository-with-sidebar").hasClass("with-full-navigation")
    }), $(document).on("click", ".js-directory-link", function (t) {
        return 2 === t.which || t.metaKey || t.ctrlKey ? void 0 : ($(this).closest("tr").addClass("is-loading"), $(document.body).addClass("disables-context-loader"))
    }), $(document).on("pjax:click", ".js-octicon-loaders a", function () {
        var t = this;
        return $(this).addClass("is-loading"), $(document).one("pjax:end", function () {
            return $(t).removeClass("is-loading")
        })
    }), $(function () {
        var t;
        return t = $(".mini-nav, .repo-container .menu"), t.length ? $.each(t, function (t, e) {
            return new FastClick(e)
        }) : void 0
    })
}.call(this), function () {
    $(document).on("click", ".repository-tree", function (t) {
        var e, n;
        return n = $(t.target).closest(".repository-tree").is(this), e = $(t.target).is("a"), n && !e ? $(this).toggleClass("expanded") : void 0
    }), $.pageUpdate(function () {
        return $(".repository-files .selected").each(function () {
            return $(this).parents(".repository-tree").addClass("expanded")
        })
    })
}.call(this), function () {
    $(document).onFocusedInput(".js-repository-name", function () {
        var t, e, n;
        return e = /[^0-9A-Za-z_\.]/g, n = $(".js-form-note"), t = $(".js-rename-repository-button"), function () {
            n.html("Will be renamed as <code>" + this.value.replace(e, "-") + "</code>"), e.test(this.value) ? n.is(":hidden") && n.fadeIn() : this.value || n.fadeOut(), this.value && this.value !== $(this).attr("data-original-name") ? t.prop("disabled", !1) : t.prop("disabled", !0)
        }
    })
}.call(this), function () {
    $(document).on("click", ".js-hook-target", function (t) {
        return $(".js-hook-target").parents("li").removeClass("selected"), $(this).parents("li").addClass("selected"), $(".js-hook-group").hide(), $(this.hash).show().scrollTo(), t.preventDefault()
    }), $(document).on("click", ".js-test-hook", function (t) {
        var e, n, a;
        return e = $(this), a = e.prev(".js-test-hook-message"), a.text("Sending payload..."), n = e.attr("data-test-service-url"), $.ajax({type: "POST", url: n, data: {name: e.attr("rel") || ""}, success: function () {
            return a.text("Test payload deployed!")
        }, error: function () {
            return a.text("Error sending test payload.")
        }}), t.preventDefault()
    }), $(document).on("click", ".js-add-postreceive-url", function (t) {
        var e;
        return e = $(this).prev("dl.form").clone(), e.find("input").val(""), $(this).before(e), t.preventDefault()
    }), $(document).on("click", ".js-remove-postreceive-url", function (t) {
        return $(this).closest(".fields").find("dl.form").length < 2 ? (alert("You cannot remove the last post-receive URL"), !1) : ($(this).closest("dl.form").remove(), t.preventDefault())
    })
}.call(this), function () {
    $(function () {
        return $(".js-user-filter").length && $(".js-user-filter").click(function (t) {
            return t.preventDefault(), $(this).hasClass("selected") ? void 0 : ($(".js-user-filter").removeClass("selected"), $("img.avatar").removeClass("almost-hidden"), $(this).addClass("selected"), "owners" === $(this).attr("rel") ? $("img.avatar.member").addClass("almost-hidden") : "members" === $(this).attr("rel") ? $("img.avatar.owner").addClass("almost-hidden") : void 0)
        }), $(".js-app-tab").length && $(".js-app-tab").click(function (t) {
            return t.preventDefault(), $(this).hasClass("selected") ? void 0 : ($(".js-app-tab").removeClass("selected"), $(this).addClass("selected"), "all" === $(this).attr("rel") ? ($("#all-apps").show(), $("#private-repo-access-apps").hide(), $("#limited-access-apps").hide()) : "private-access" === $(this).attr("rel") ? ($("#private-repo-access-apps").show(), $("#all-apps").hide(), $("#limited-access-apps").hide()) : ($("#limited-access-apps").show(), $("#private-repo-access-apps").hide(), $("#all-apps").hide()))
        }), $(".js-org-security-tab").length ? $(".js-org-security-tab").click(function (t) {
            return t.preventDefault(), $(this).hasClass("selected") ? void 0 : ($(".js-org-security-tab").removeClass("selected"), $(this).addClass("selected"), "apps" === $(this).attr("rel") ? ($("#oauth-application-security").show(), $("#oauth-ssh-key-security").hide()) : ($("#oauth-ssh-key-security").show(), $("#oauth-application-security").hide()))
        }) : void 0
    })
}.call(this), function () {
    $(document).on("ajaxSend", ".js-action-ldap-create", function () {
        return $(this).find(".minibutton").addClass("disabled")
    }), $(document).on("ajaxComplete", ".js-action-ldap-create", function (t, e) {
        var n, a;
        return n = $(this), a = 500 === e.status ? "Oops, something went wrong." : e.responseText, n.find(".js-message").show().html(" &ndash; " + a), !1
    })
}.call(this), function () {
    $(document).on("ajaxSend", ".js-action-pull", function () {
        return $(this).find(".minibutton").not(".disabled").addClass("reenable disabled")
    }), $(document).on("ajaxComplete", ".js-action-pull", function (t, e) {
        var n, a, i;
        return n = $(this), i = $(t.target), 200 === e.status && (i.hasClass("close") || i.hasClass("open") ? $.pjax.reload($("#js-pjax-container")) : n.find(".reenable").removeClass("reenable disabled")), a = 500 === e.status ? "Oops, something went wrong." : e.responseText, n.find(".js-message").show().html(a), !1
    })
}.call(this), function () {
    $.support.pjax && $(document).on("submit", ".js-stars-search", function (t) {
        var e;
        return(e = $(this).closest("[data-pjax-container]")[0]) ? $.pjax.submit(t, {container: e}) : void 0
    })
}.call(this), function () {
    $(function () {
        var t;
        return $(".js-styleguide-ace")[0] ? (t = new GitHub.CodeEditor(".js-styleguide-ace"), $(".js-styleguide-themes").change(function () {
            return t.setTheme($(this).find(":selected").val())
        })) : void 0
    }), $(document).on("click", ".js-styleguide-octicon-facebox", function (t) {
        var e, n, a;
        return t.preventDefault(), a = $(this).data("octicon-glyph"), n = $(this).data("octicon-name"), e = $(".js-octicon-facebox-template").html(), e = e.replace(/classnamegoeshere/g, n), e = e.replace(/glyphgoeshere/g, a), jQuery.facebox(e), $(document).pageUpdate()
    }), $(function () {
        return $(".js-octicons-search-field")[0] ? $(".js-octicons-search-field").focus() : void 0
    })
}.call(this), function () {
    $(document).on("ajaxBeforeSend", ".js-auto-subscribe-toggle", function () {
        return $(this).find("label").append('<img src="' + GitHub.Ajax.spinner + '" width="16" />')
    }), $(document).on("ajaxError", ".js-auto-subscribe-toggle", function () {
        return $(this).find("label img").remove(), $(this).find("label").append('<img src="/images/modules/ajax/error.png">')
    }), $(document).on("ajaxSuccess", ".js-auto-subscribe-toggle", function () {
        return $(this).find("label img").remove()
    }), $(document).on("ajaxBeforeSend", ".js-unignore-form, .js-ignore-form", function () {
        return $(this).closest(".subscription-row").addClass("loading")
    }), $(document).on("ajaxError", ".js-unignore-form, .js-ignore-form", function () {
        return $(this).closest(".subscription-row").removeClass("loading"), $(this).find(".minibutton").addClass("danger").attr("title", "There was a problem unignoring this repo.")
    }), $(document).on("ajaxSuccess", ".js-unignore-form", function () {
        return $(this).closest(".subscription-row").removeClass("loading").addClass("unsubscribed")
    }), $(document).on("ajaxSuccess", ".js-ignore-form", function () {
        return $(this).closest(".subscription-row").removeClass("loading unsubscribed")
    }), $(document).on("ajaxBeforeSend", ".js-unsubscribe-form, .js-subscribe-form", function () {
        return $(this).closest(".subscription-row").addClass("loading")
    }), $(document).on("ajaxError", ".js-unsubscribe-form, .js-subscribe-form", function () {
        return $(this).closest(".subscription-row").removeClass("loading"), $(this).find(".minibutton").addClass("danger").attr("title", "There was a problem with unsubscribing :(")
    }), $(document).on("ajaxSuccess", ".js-unsubscribe-form", function () {
        return $(this).closest(".subscription-row").removeClass("loading").addClass("unsubscribed")
    }), $(document).on("ajaxSuccess", ".js-subscribe-form", function () {
        return $(this).closest(".subscription-row").removeClass("loading unsubscribed")
    }), $(document).on("ajaxSuccess", ".js-thread-subscription-status", function (t, e, n, a) {
        return $(this).replaceWith(a)
    })
}.call(this), GitHub.Team = function (t) {
    this.url = window.location.pathname, this.orgUrl = this.url.split(/\/(teams|invite)\//)[0], t && (this.url = this.orgUrl + "/teams/" + t)
}, GitHub.Team.prototype = {name: function () {
    return $("#team-name").val()
}, newRecord: function () {
    return!/\/invite/.test(location.pathname) && !/\d/.test(location.pathname)
}, repos: function () {
    return $.makeArray($(".repositories li:visible a span").map(function () {
        return $(this).text()
    }))
}, addRepo: function (t, e) {
    return debug("Adding repo %s", t), !t || $.inArray(t, this.repos()) > -1 ? !1 : (that = this, GitHub.withSudo(function () {
        that.addRepoAjax(t);
        var n = $(".repositories").find("li:first").clone(), a = n.find("input[type=hidden]");
        return n.find("a:first").attr("href", "/" + t).find("span").text(t), n.find(".remove-repository").attr("data-repo", t), "private" === e ? (n.addClass("private"), n.find("span.octicon").removeClass("octicon-repo").addClass("octicon-lock")) : (n.addClass("public"), n.find("span.octicon").addClass("octicon-repo")), a.length > 0 && a.val(t).attr("disabled", !1), $(".repositories").append(n.show()), !0
    }), void 0)
}, addRepoAjax: function (t) {
    this.newRecord() || (debug("Ajaxily adding %s", t), $.post(this.url + "/repo/" + t))
}, removeRepo: function (t) {
    if (debug("Removing %s", t), !t || -1 == $.inArray(t, this.repos()))return!1;
    var e = $(".repositories li:visible a").filter(function () {
        return $(this).find("span").text() == t
    }), n = function () {
        e.parents("li:first").remove()
    }, a = function () {
        e.parent().find(".remove-repository").show().removeClass("remove").html('<img class="dingus" src="/images/modules/ajax/error.png">').end().find(".spinner").hide()
    };
    return this.newRecord() ? n() : (e.parent().find(".remove-repository").after('<img class="dingus spinner" src="/images/spinners/octocat-spinner-64.gif" width="32" />').hide(), this.removeRepoAjax(t, n, a)), !0
}, removeRepoAjax: function (t, e, n) {
    this.newRecord() || (debug("Ajaxily removing %s", t), $.ajax({type: "DELETE", url: this.url + "/repo/" + t, success: e, error: n}))
}, users: function () {
    return $.makeArray($(".usernames li:visible").map(function () {
        return $(this).find("a:first").text()
    }))
}, addUser: function (t) {
    return debug("Adding %s", t), !t || $.inArray(t, this.users()) > -1 ? !1 : (that = this, GitHub.withSudo(function () {
        that.addUserAjax(t);
        var e = $(".usernames").find("li:first").clone(), n = e.find("input[type=hidden]");
        return e.find("img").attr("src", "/" + t + ".png"), e.find("a:first").attr("href", "/" + t).text(t), n.length > 0 && n.val(t).attr("disabled", !1), $(".usernames").append(e.show()), !0
    }), void 0)
}, removeUser: function (t) {
    if (debug("Removing %s", t), !t || -1 == $.inArray(t, this.users()))return!1;
    var e = $(".usernames li:visible a:contains(" + t + ")"), n = function () {
        e.parents("li:first").remove()
    };
    return this.newRecord() ? n() : (e.parent().find(".remove-user").spin().remove(), $("#spinner").addClass("remove"), this.removeUserAjax(t, n)), !0
}, addUserAjax: function (t) {
    this.newRecord() || (debug("Ajaxily adding %s", t), $.post(this.url + "/member/" + t))
}, removeUserAjax: function (t, e) {
    this.newRecord() || (debug("Ajaxily removing %s", t), $.ajax({type: "DELETE", url: this.url + "/member/" + t, success: e}))
}}, $(function () {
    if ($(".js-team")[0]) {
        var t = new GitHub.Team($(".js-team").data("team")), e = $(".add-username-form input"), n = $(".add-repository-form input"), a = $(".add-username-form button"), i = $(".add-repository-form button"), s = null;
        e.on("autocomplete:search", function () {
            s && s.abort();
            var t = $(this).val();
            return"" === t ? ($("#add-user-autocomplete ul").empty(), $("#add-user-autocomplete").trigger("autocomplete:change"), void 0) : (s = $.ajax({type: "GET", data: {q: t}, url: "/autocomplete/users", dataType: "html", success: function (t) {
                s = null, $("#add-user-autocomplete ul").html(t), $("#add-user-autocomplete").trigger("autocomplete:change")
            }}), void 0)
        }), e.on("autocomplete:autocompleted:changed", function () {
            e.attr("data-autocompleted") ? a.removeAttr("disabled") : a.attr("disabled", "disabled")
        }), n.on("autocomplete:search", function () {
            s && s.abort();
            var e = $(this).val();
            return"" === e ? ($("#add-repo-autocomplete ul").empty(), $("#add-repo-autocomplete").trigger("autocomplete:change"), void 0) : (s = $.ajax({type: "GET", data: {q: e, limit: 10}, url: t.orgUrl + "/autocomplete/repos", dataType: "html", success: function (t) {
                s = null, $("#add-repo-autocomplete ul").html(t), $("#add-repo-autocomplete").trigger("autocomplete:change")
            }}), void 0)
        }), n.on("autocomplete:autocompleted:changed", function () {
            n.attr("data-autocompleted") ? i.removeAttr("disabled") : i.attr("disabled", "disabled")
        }), $(document).on("click", ".remove-repository", function () {
            return t.removeRepo($(this).attr("data-repo")), !1
        }), $(document).on("click", ".remove-user", function () {
            return t.removeUser($(this).prev().text()), !1
        }), $(".add-username-form button").click(function () {
            var e = $(this).parent(), n = e.find(":text"), a = n.val();
            return debug("Trying to add %s...", a), a && n.attr("data-autocompleted") ? (n.val(""), t.addUser(a), !1) : !1
        }), $(".js-team").on("submit", function () {
            var t = $(document.activeElement);
            return t.is(".add-username-form input") ? (t.closest(".add-username-form").find("button").click(), !1) : void 0
        });
        var r, o = function () {
            r = $(this).attr("data-visibility")
        };
        $("#add-repo-autocomplete").on("navigation:open", "[data-autocomplete-value]", o), $(".add-repository-form button").click(function () {
            var e = $(this).parent(), n = e.find(":text"), a = n.val();
            return debug("Trying to add %s...", a), a && n.attr("data-autocompleted") ? (n.val(""), t.addRepo(a, r), !1) : !1
        }), $(".js-team").on("submit", function () {
            var t = $(document.activeElement);
            return t.is(".add-repository-form input") ? (t.closest(".add-repository-form").find("button").click(), !1) : void 0
        })
    }
}), function () {
    $(document).on("click", ".remove-team", function () {
        var t;
        return confirm("Are you POSITIVE you want to remove this team?") ? (t = $(this).parents("li.team"), $.ajax({type: "DELETE", url: this.href, success: function () {
            return t.remove()
        }}), $(this).spin().remove(), !1) : !1
    })
}.call(this), function () {
    var t, e, n, a, i;
    n = function (t) {
        return setTimeout(function () {
            var e, n, i, s, r;
            for (s = $(".js-tree-finder-field"), r = [], n = 0, i = s.length; i > n; n++)e = s[n], e.value = t, r.push(a(e));
            return r
        }, 0)
    }, i = null, a = function (t, e) {
        var n, s, r, o, c, l, u, d, h, f, m, p;
        if (d = document.getElementById($(t).attr("data-results"))) {
            if (!(r = $(d).data("tree-finder-list")))return null == i && (i = $.ajax({url: $(d).attr("data-url"), cache: !0, success: function (e) {
                return $(d).data("tree-finder-list", e.paths), a(t)
            }, complete: function () {
                return i = null
            }})), void 0;
            for (h = $(d).find(".js-tree-browser-result-template").html(), l = $(d).find(".js-tree-finder-results"), null == e && (e = $(t).val()), e ? (o = $.fuzzyRegexp(e), u = $.fuzzySort(r, e)) : u = r, u = u.slice(0, 50), n = function () {
                var t, e, n;
                for (n = [], t = 0, e = u.length; e > t; t++)s = u[t], n.push(h.replace(/\$presentationPath/g, s).replace(/\$path/g, encodeURI(s) + window.location.search));
                return n
            }(), l.html(n), p = l.find(".tree-browser-result a"), f = 0, m = p.length; m > f; f++)c = p[f], $.fuzzyHighlight(c, e, o);
            l.navigation("focus")
        }
    }, $(document).onFocusedKeydown(".js-tree-finder-field", function (t) {
        return a(this), $(this).on("throttled:input." + t, function () {
            return a(this)
        }), function (t) {
            return"esc" === t.hotkey ? (history.back(), t.preventDefault()) : void 0
        }
    }), t = function () {
        var t;
        return t = $("<textarea>").css({position: "fixed", top: 0, left: 0, opacity: 0}), $(document.body).append(t), t.focus(), function () {
            return t.blur().remove().val()
        }
    }, e = null, $(document).on("pjax:click", ".js-show-file-finder", function () {
        return e = t()
    }), $(document).on("pjax:end", "#js-repo-pjax-container", function () {
        var t;
        return e ? ((t = e()) && n(t), e = null) : void 0
    }), $.pageUpdate(function () {
        var t, e, n, i;
        for (i = $(this).find(".js-tree-finder-field"), e = 0, n = i.length; n > e; e++)t = i[e], a(t)
    })
}.call(this), function () {
    var t, e, n, a, i;
    a = function () {
        return $("body").addClass("is-sending"), $("body").removeClass("is-sent is-not-sent")
    }, i = function () {
        return $("body").addClass("is-sent"), $("body").removeClass("is-sending")
    }, n = function (t) {
        return t.responseText.length && $(".js-sms-error").text(t.responseText), $("body").addClass("is-not-sent"), $("body").removeClass("is-sending")
    }, t = function (t) {
        return a(), $.ajax({url: t, type: "POST", success: i, error: n}), !1
    }, $(document).on("click", ".js-resend-auth-code", function () {
        return t("/sessions/two_factor/resend")
    }), $(document).on("click", ".js-send-fallback-auth-code", function () {
        return t("/sessions/two_factor/send_fallback")
    }), $(document).on("click", ".js-send-two-factor-code", function () {
        var t, e, s;
        return t = $(this).closest("form"), e = t.find(".js-country-code-select").val(), e += t.find(".js-sms-number").val(), s = t.find(".js-two-factor-secret").val(), t.find("input,button,select").prop("disabled", !0), a(), $.ajax({url: "/settings/two_factor_authentication/send_sms", type: "POST", data: {number: e, two_factor_secret: s}, success: function () {
            return i(), t.find(".js-2fa-enable").prop("disabled", !1), t.find(".js-2fa-confirm").prop("disabled", !0), t.find(".js-2fa-otp").focus()
        }, error: function (e) {
            return n(e), t.find(".js-2fa-enable").prop("disabled", !0), t.find(".js-2fa-confirm").prop("disabled", !1)
        }}), !1
    }), $(document).on("click", "button.js-2fa-enable", function () {
        var t;
        return t = $(this).closest("form"), t.find("input,button,select").prop("disabled", !1)
    }), $(document).on("click", ".js-set-two-factor-fallback", function () {
        var t, n, a;
        return t = $(this).closest(".form"), n = t.find(".js-fallback-country-code-select").val(), a = t.find(".js-sms-fallback").val(), e(n, a)
    }), e = function (t, e) {
        return $("body").addClass("is-setting"), $("body").removeClass("is-set is-not-set"), "" !== e && (e = t + " " + e), $.ajax({url: "/settings/two_factor_authentication/backup_number", type: "POST", data: {number: e}, success: function () {
            return $("body").addClass("is-set"), $("body").removeClass("is-setting"), "" === e ? $(".set-message").html("Removed!") : $(".set-message").html("Set! You should receive a confirmation SMS shortly.")
        }, error: function (t) {
            return t.responseText.length && $(".js-fallback-error-message").text(t.responseText), $("body").addClass("is-not-set"), $("body").removeClass("is-setting")
        }}), !1
    }
}.call(this), function () {
    $(document).on("click", ".js-toggle-recovery", function () {
        return $(".recovery-codes").toggleClass("is-hidden"), $('form[action="/sessions/two_factor"]').toggleClass("is-hidden")
    })
}.call(this), function () {
    $(document).on("ajaxSend", ".js-restore-user", function () {
        return $(this).find(".minibutton").addClass("disabled")
    }), $(document).on("ajaxComplete", ".js-restore-user", function (t, e) {
        var n, a;
        return n = $(this), n.addClass("error"), a = 500 === e.status ? "Oops, something went wrong." : e.responseText, n.find(".js-message").show().html(a), !1
    })
}.call(this), function () {
    $(document).on("click", ".js-user-sessions-revoke", function () {
        var t = this;
        return GitHub.withSudo(function () {
            return $.ajax({type: "DELETE", url: t.href}).done(function () {
                return $(t).closest("li").remove()
            })
        }), !1
    })
}.call(this), function () {
    var t, e;
    $(document).on("change", ".js-webhook-target-repository", function () {
        var t;
        return t = $(this).find(".selected .js-select-button-text").text(), $(".js-webhook-install-button").attr("disabled", !t.length)
    }), $(document).on("keyup", ".js-new-webhook-field", function () {
        return $(this).find(".js-new-webhook-field-name").val().length ? $(this).find(".js-add-webhook-field").removeClass("disabled") : $(this).find(".js-add-webhook-field").addClass("disabled")
    }), $(document).on("click", ".js-add-webhook-field", function (n) {
        var a, i;
        return a = $(".js-new-webhook-field-name").val(), i = $(".js-new-webhook-field-type").val(), a.length && (t(a, i), e(), $(".js-no-webhook-fields").addClass("hidden")), n.preventDefault()
    }), $(document).on("click", ".js-remove-webhook-field", function (t) {
        return $(this).parents(".js-webhook-field").remove(), 0 === $(".js-webhook-field").length && $(".js-no-webhook-fields").removeClass("hidden"), t.preventDefault()
    }), $(document).on("click", ".js-webhook-event-selectable", function () {
        var t, e;
        return t = $(this).find(".js-webhook-event-checkbox"), e = t.attr("checked"), t.attr("checked", !e), $(this).toggleClass("is-selected")
    }), t = function (t, e) {
        var n, a, i;
        return n = $(".js-webhook-field-template").clone().removeClass("hidden js-webhook-field-template"), n.addClass("js-webhook-field"), a = n.find(".js-webhook-field-name"), a.val(t).attr("name", a.attr("data-name")), i = n.find(".js-webhook-field-type"), i.val(t).attr("name", i.attr("data-name")), i.val(e), $(".js-webhook-field-list").append(n)
    }, e = function () {
        return $(".js-new-webhook-field-name").val(""), $(".js-new-webhook-field-type").val("text"), $(".js-add-webhook-field").addClass("disabled")
    }
}.call(this), function () {
    var t, e, n, a, i, s, r, o, c;
    r = ["is-render-pending", "is-render-ready", "is-render-loading", "is-render-loaded"].reduce(function (t, e) {
        return"" + t + " " + e
    }), s = function (t) {
        var e;
        return e = t.data("timing"), null != e ? (e.load = e.hello = e.loading = e.loaded = e.ready = null, e.helloTimer && (clearTimeout(e.helloTimer), e.helloTimer = null), e.loadTimer ? (clearTimeout(e.loadTimer), e.loadTimer = null) : void 0) : void 0
    }, n = function (t) {
        var e, n, a;
        if (!t.data("timing"))return e = 10, n = 45, a = {load: null, hello: null, loading: null, loaded: null, ready: null, helloTimer: null, loadTimer: null}, a.load = Date.now(), a.helloTimer = setTimeout(c(t, function () {
            return!a.hello
        }), 1e3 * e), a.loadTimer = setTimeout(c(t), 1e3 * n), t.data("timing", a)
    }, o = function (t) {
        var e, n, a, i;
        if (t.length && (a = t.data("timing")) && (null == a.untimed || !a.untimed) && (e = t.find("iframe")).length && (i = e.get(0).contentWindow) && null != i.postMessage)return n = {type: "render:timing", body: {timing: a, format: t.data("type")}}, i.postMessage(JSON.stringify(n), "*")
    }, t = function (t) {
        var e, n, a, i;
        if (i = t.data("timing"))return o(t), e = i.hello - i.load, n = i.loading - i.hello, a = i.loaded - i.loading, debug("Render init delay: " + e + "ms Render ready: " + n + "ms Load Time: " + a + "ms")
    }, i = function (t) {
        return t.addClass("is-render-requested")
    }, a = function (t, e) {
        return t.removeClass(r), t.addClass("is-render-failed"), null != e && t.addClass("is-render-failed-" + e), s(t)
    }, c = function (t, e) {
        return null == e && (e = function () {
            return!0
        }), function () {
            var n;
            if (t.is(":visible") && !t.hasClass("is-render-ready") && !t.hasClass("is-render-failed") && !t.hasClass("is-render-failed-fatally") && e())return(n = t.data("timing")) ? (debug("Render timeout: " + JSON.stringify(n) + " Now: " + Date.now()), a(t)) : debug("No timing data on $:", t)
        }
    }, $.pageUpdate(function () {
        return $(this).find(".js-render-target").each(function () {
            var t, e;
            return t = $(this), (null != (e = t.data("timing")) ? e.load : 0) ? void 0 : (s(t), n(t), t.find(".render-viewer-trigger").length ? t.find(".render-viewer-trigger").on("click", function (e) {
                return e.preventDefault(), i(t)
            }) : (t.addClass("is-render-automatic"), i(t)))
        })
    }), e = function (t) {
        var e;
        return e = ".js-render-target", t ? $("" + e + "[data-identity='" + t + "']") : $(e)
    }, $(window).on("message", function (n) {
        var i, o, c, l, u, d, h, f, m, p, g, v;
        if (p = n.originalEvent, c = p.data, d = p.origin, c && d && (g = function () {
            try {
                return JSON.parse(c)
            } catch (t) {
                return c
            }
        }(), m = g.type, l = g.identity, o = g.body, m && o && 1 === (i = e(l)).length && (h = i.data("timing") || {untimed: !0}) && d === i.data("host") && "render" === m))switch (o) {
            case"hello":
                if (h.hello = Date.now(), h.loading = h.loaded = null, u = {type: "render:cmd", body: {cmd: "branding", branding: !1}}, f = null != (v = i.find("iframe").get(0)) ? v.contentWindow : void 0, "function" == typeof f.postMessage && f.postMessage(JSON.stringify(u), "*"), i.data("local"))return u = {type: "render:data", body: window.editor.code()}, "function" == typeof f.postMessage ? f.postMessage(JSON.stringify(u), "*") : void 0;
                break;
            case"error":
                return a(i);
            case"error:fatal":
                return a(i, "fatal");
            case"loading":
                return i.removeClass(r), i.addClass("is-render-loading"), h.loading = Date.now();
            case"loaded":
                return i.removeClass(r), i.addClass("is-render-loaded"), h.loaded = Date.now();
            case"ready":
                if (i.removeClass(r), i.addClass("is-render-ready"), h.ready = Date.now(), null == h.untimed || !h.untimed)return t(i), s(i);
                break;
            default:
                return debug("Unknown message [" + m + "]=>'" + o + "'")
        }
    })
}.call(this), function () {
    var t, e;
    e = null, t = function (t) {
        return e ? e.removeClass("hidden") : (e = $("<div></div>"), e.addClass("modal-overlay"), $(document.body).append(e)), e.one("click", function () {
            return t.trigger("modal:closed")
        }), t.data("overlay", e), e
    }, $(document).on("click", ".js-modal-trigger", function () {
        var t, e;
        return e = $(this).attr("href"), t = $(".js-modal[data-path='" + e + "']"), t.trigger("modal:opened"), !1
    }), $(document).on("click", '.js-modal a[href="#close"]', function () {
        var t;
        return t = $(this).closest(".js-modal"), t.trigger("modal:closed"), !1
    }), $(document).on("modal:opened", function (e) {
        var n;
        return n = $(e.target), t(n), n.removeClass("hidden"), $.support.pjax ? (document.title = n.attr("data-title"), window.history.replaceState({}, "", n.attr("data-path"))) : void 0
    }), $(document).on("modal:closed", function (t) {
        var e;
        return e = $(t.target), e.addClass("hidden"), e.data("overlay").addClass("hidden"), e.data("overlay", null), $.support.pjax ? (document.title = e.attr("data-back-title"), window.history.replaceState({}, e.attr("data-back-title"), e.attr("data-back-path"))) : void 0
    }), $(function () {
        var t;
        return(t = $(".js-modal[data-path='" + document.location.pathname + "']")).length ? t.trigger("modal:opened") : void 0
    })
}.call(this), function () {
    $(document).on("click", ".js-toggle-lang-stats", function (t) {
        var e, n;
        return $(".js-stats-switcher-viewport").toggleClass("is-revealing-lang-stats"), n = $(this).attr("original-title"), e = "", e = n.match("Show") ? n.replace("Show", "Hide") : n.replace("Hide", "Show"), $(".js-toggle-lang-stats").attr("title", e), $(this).trigger("mouseover"), t.preventDefault()
    })
}.call(this), function () {
    $(document).on("click", ".js-notification-global-toggle", function () {
        var t, e, n;
        return n = $(this).attr("data-url"), t = this.checked, e = {}, e[this.name] = t ? "1" : "0", $.ajax({url: $(this).attr("data-url"), type: "PUT", data: e, success: function () {
            return t ? $(this).parent("p").removeClass("ignored") : $(this).parent("p").addClass("ignored")
        }})
    }), $(document).on("change", ".js-notifications-settings input[type=checkbox]", function () {
        var t;
        return t = $(this), t.parents("li").append('<img class="spinner" src="' + GitHub.Ajax.spinner + '" width="16" />'), $.ajax({url: t.parents(".js-notifications-settings").attr("data-toggle-url"), type: "POST", data: t.parents(".js-notifications-settings").serialize(), complete: function () {
            return t.parents("li").find("img").remove()
        }})
    }), $(document).on("ajaxSend", ".js-remove-item", function () {
        return $(this).spin().hide()
    }), $(document).on("ajaxComplete", ".js-remove-item", function () {
        return $(this).parents("li").stopSpin()
    }), $(document).on("ajaxSuccess", ".js-remove-item", function () {
        return $(this).parents("li").remove()
    }), $(document).on("ajaxSuccess", ".js-toggle-visibility", function (t, e, n, a) {
        return $("#settings-emails").children(".settings-email.primary").toggleClass("private", "private" === a.visibility)
    }), $(document).on("ajaxSend", ".js-remove-key", function () {
        return $(this).addClass("disabled").find("span").text("Deleting…")
    }), $(document).on("ajaxError", ".js-remove-key", function () {
        return $(this).removeClass("disabled").find("span").text("Error. Try again.")
    }), $(document).on("ajaxSuccess", ".js-remove-key", function () {
        return $(this).parents("li").remove(), 0 === $(".js-ssh-keys-box li").length ? $(".js-no-ssh-keys").show() : void 0
    }), $(document).on("click", ".js-leave-collaborated-repo", function (t) {
        var e, n, a, i;
        return e = $(t.currentTarget), a = e.closest("[data-repo]").attr("data-repo"), i = $('ul.repositories li[data-repo="' + a + '"]'), n = e.parents("div.full-button"), n.html('<img src="' + GitHub.Ajax.spinner + '" width="16" />'), $.ajax({url: "/account/leave_repo/" + a, type: "POST", success: function () {
            return $.facebox.close(), i.fadeOut()
        }, error: function () {
            return n.html('<img src="/images/modules/ajax/error.png">')
        }}), !1
    }), $(document).on("ajaxError", ".js-name-change-in-progress", function () {
        return $(".js-name-change-in-progress").hide(), $(".js-name-change-error").show()
    }), $(document).on("ajaxSuccess", ".js-unsubscribe-from-newsletter form", function () {
        return $(".js-unsubscribe-from-newsletter .message").toggle()
    }), $(document).on("click", ".js-show-new-ssh-key-form", function () {
        return $(".js-new-ssh-key-box").toggle().find(":text").focus(), !1
    }), $(document).on("ajaxSuccess", ".js-update-note-form", function (t, e) {
        return $(this).closest("li").replaceWith(e.responseText)
    }), $(document).on("keydown", ".js-api-token-input", function (t) {
        return"esc" === t.hotkey ? $(this).siblings(".js-cancel-note").click() : void 0
    }), $(document).on("click", ".js-edit-token-note", function () {
        return $(this).closest("li").find('input[type="text"]').focus()
    }), $(document).on("ajaxSuccess", ".js-remove-user-api-token", function () {
        var t;
        return t = $(this).closest(".boxed-group"), 1 === t.find("li").length ? t.removeClass("has-access-tokens") : void 0
    }), $(document).on("click", ".js-delete-oauth-application-image", function () {
        var t, e, n;
        return t = $(this).closest(".js-uploadable-container"), t.removeClass("has-uploaded-logo"), e = t.find("img.js-image-field"), n = t.find("input.js-oauth-application-logo-id"), e.attr("src", ""), n.val(""), !1
    }), $.pageUpdate(function () {
        return $(this).find("dl.autosave").each(function () {
            return $(this).autosaveField()
        })
    }), $(document).on("click", ".section-head", function () {
        return $(".section-nav").slideUp(200).addClass("collapsed"), $(this).next(".section-nav").slideDown(200).removeClass("collapsed")
    }), $(document).on("click", ".js-user-rename-warning-continue", function () {
        return $(".js-user-rename-warning, .js-user-rename-form").toggle(), !1
    })
}.call(this), function () {
    var t, e, n;
    $(document).on("submit", "#signup_form", function () {
        return $("#signup_button").attr("disabled", !0).find("span").text("Creating your GitHub account...")
    }), t = !1, n = function () {
        var e, n;
        return n = $(".js-plan-choice-table"), n.length ? (n.find(".plan-row.selected").removeClass("selected"), n.find(".choose_plan.selected").removeClass("selected"), e = n.find(".js-plan-choice:checked"), e.closest(".plan-row").addClass("selected").find(".choose_plan").addClass("selected"), t || (t = $(".setup-billing").contents()), "free" === e.val() ? $(".setup-billing").empty().hide() : $(".setup-billing").append(t).show()) : void 0
    }, $.pageUpdate(function () {
        return n()
    }), $(document).on("change", ".js-plan-choice", function () {
        return n()
    }), e = function () {
        var t;
        return t = $(".js-choose-plan-submit"), t.length ? (t.attr("data-default-text") || t.attr("data-default-text", t.text()), $("input[name=setup_organization]").is(":checked") ? t.text(t.attr("data-org-text")) : t.text(t.attr("data-default-text"))) : void 0
    }, $.pageUpdate(function () {
        return e()
    }), $(document).on("change", ".js-setup-organization", function () {
        return e()
    })
}.call(this), function () {
    $(document).on("click", ".js-approve-ssh-key", function () {
        var t;
        return t = $(this), t.addClass("disabled").find("span").text("Approving…"), $.ajax({url: t.attr("href"), type: "POST", success: function () {
            return t.parents("li").addClass("approved")
        }, error: function () {
            return t.removeClass("disabled").find("span").text("Error. Try Again")
        }}), !1
    }), $(document).on("click", ".js-reject-ssh-key", function () {
        var t;
        return t = $(this), t.addClass("disabled").find("span").text("Rejecting…"), $.ajax({url: t.attr("href"), type: "DELETE", success: function () {
            return t.parents("li").addClass("rejected")
        }, error: function () {
            return t.removeClass("disabled").find("span").text("Error. Try Again")
        }}), !1
    })
}.call(this), function () {
    !$.support.pjax || location.search || location.hash || $(function () {
        var t, e, n;
        return t = null != (n = document.getElementById("issues-dashboard")) ? n : document.getElementById("issues_list"), (e = $(t).attr("data-url")) ? window.history.replaceState(null, document.title, e) : void 0
    })
}.call(this), $.pageUpdate(function () {
    function t(t, e) {
        var n, a, i, s, r, o, c, l, u, d, h, f = Math.min(t.canvas.width, e.canvas.width), m = Math.min(t.canvas.height, e.canvas.height), p = t.getImageData(0, 0, f, m), g = e.getImageData(0, 0, f, m), v = p.data, $ = g.data, y = $.length;
        for (i = 0; y > i; i += 4)n = v[i + 3] / 255, a = $[i + 3] / 255, d = n + a - n * a, $[i + 3] = 255 * d, s = v[i] / 255 * n, c = $[i] / 255 * a, r = v[i + 1] / 255 * n, l = $[i + 1] / 255 * a, o = v[i + 2] / 255 * n, u = $[i + 2] / 255 * a, h = 255 / d, $[i] = (s + c - 2 * Math.min(s * a, c * n)) * h, $[i + 1] = (r + l - 2 * Math.min(r * a, l * n)) * h, $[i + 2] = (o + u - 2 * Math.min(o * a, u * n)) * h;
        e.putImageData(g, 0, 0)
    }

    if ($("#files .image").length) {
        var e = $("#files .file:has(.onion-skin)"), n = [];
        $.each(e, function (a) {
            function i() {
                if (M++, o(), M >= A) {
                    var t = d.find(".progress");
                    t.is(":visible") ? t.fadeOut(250, function () {
                        r()
                    }) : (t.hide(), r())
                }
            }

            function s(t) {
                var e = S.find(".active"), n = S.find(".active").first().index(), a = T.eq(n), i = S.children().eq(t);
                if (0 == i.hasClass("active") && 0 == i.hasClass("disabled")) {
                    if (e.removeClass("active"), i.addClass("active"), i.is(":visible")) {
                        var s = i.position(), r = i.outerWidth(), o = String(s.left + r / 2) + "px 0px";
                        S.css("background-image", "url(/images/modules/commit/menu_arrow.gif)"), S.css("background-position", o)
                    }
                    M >= 2 && (animHeight = parseInt(T.eq(t).css("height")) + 127, d.css("height", animHeight), a.animate({opacity: "hide"}, 250, "swing", function () {
                        T.eq(t).fadeIn(250)
                    }))
                }
            }

            function r() {
                var e = 858, i = Math.max(P.width, B.width), r = Math.max(P.height, B.height), o = 0, g = 1;
                P.marginHoriz = Math.floor((i - P.width) / 2), P.marginVert = Math.floor((r - P.height) / 2), B.marginHoriz = Math.floor((i - B.width) / 2), B.marginVert = Math.floor((r - B.height) / 2), $.each($.getUrlVars(), function (t, e) {
                    e == d.attr("id") && (diffNum = parseInt(e.replace(/\D*/g, "")), D = $.getUrlVar(e)[0], o = $.getUrlVar(e)[1] / 100, n[diffNum].view = $.getUrlVar(e)[0], n[diffNum].pct = $.getUrlVar(e)[1], n[diffNum].changed = !0)
                });
                var v = 1;
                i > (e - 30) / 2 && (v = (e - 30) / 2 / i), y.attr({width: P.width * v, height: P.height * v}), b.attr({width: B.width * v, height: B.height * v}), h.find(".deleted-frame").css({margin: P.marginVert * v + "px " + P.marginHoriz * v + "px", width: P.width * v + 2, height: P.height * v + 2}), h.find(".added-frame").css({margin: B.marginVert * v + "px " + B.marginHoriz * v + "px", width: B.width * v + 2, height: B.height * v + 2}), h.find(".aWMeta").eq(0).text(B.width + "px"), h.find(".aHMeta").eq(0).text(B.height + "px"), h.find(".dWMeta").eq(0).text(P.width + "px"), h.find(".dHMeta").eq(0).text(P.height + "px"), B.width != P.width && (h.find(".aWMeta").eq(0).addClass("a-green"), h.find(".dWMeta").eq(0).addClass("d-red")), B.height != P.height && (h.find(".aHMeta").eq(0).addClass("a-green"), h.find(".dHMeta").eq(0).addClass("d-red"));
                var T, A = 1;
                i > e - 12 && (A = (e - 12) / i), T = 0, T = i * A + 3, j.attr({width: P.width * A, height: P.height * A}), x.attr({width: B.width * A, height: B.height * A}), f.find(".deleted-frame").css({margin: P.marginVert * A + "px " + P.marginHoriz * A + "px", width: P.width * A + 2, height: P.height * A + 2}), f.find(".added-frame").css({margin: B.marginVert * A + "px " + B.marginHoriz * A + "px", width: B.width * A + 2, height: B.height * A + 2}), f.find(".swipe-shell").css({width: i * A + 3 + "px", height: r * A + 4 + "px"}), f.find(".swipe-frame").css({width: i * A + 18 + "px", height: r * A + 30 + "px"}), f.find(".swipe-bar").css("left", o * T + "px"), d.find(".swipe .swipe-shell").css("width", T - T * o), f.find(".swipe-bar").on("mousedown", function (t) {
                    var e = $(this), i = $(this).parent(), s = i.width() - e.width();
                    t.preventDefault(), $("body").css({cursor: "pointer"}), $(document).on("mousemove.swipe", function (t) {
                        t.preventDefault();
                        var r = t.clientX - i.offset().left;
                        0 > r && (r = 0), r > s && (r = s), e.css({left: r});
                        var o = Math.round(1e4 * (r / (parseInt(d.find(".swipe-frame").css("width")) - 15))) / 1e4;
                        d.find(".swipe .swipe-shell").css("width", T - T * o), n[a].pct = 100 * o, n[a].changed = !0
                    }), $(document).on("mouseup.swipe", function () {
                        $(document).off(".swipe"), $("body").css({cursor: "auto"}), c()
                    })
                });
                var M = 1;
                i > e - 12 && (M = (e - 12) / i), w.attr({width: P.width * M, height: P.height * M}), C.attr({width: B.width * M, height: B.height * M}), m.find(".deleted-frame").css({margin: P.marginVert * M + "px " + P.marginHoriz * M + "px", width: P.width * M + 2, height: P.height * M + 2}), m.find(".added-frame").css({margin: B.marginVert * M + "px " + B.marginHoriz * M + "px", width: B.width * M + 2, height: B.height * M + 2}), m.find(".onion-skin-frame").css({width: i * M + 4 + "px", height: r * M + 30 + "px"}), d.find(".dragger").css("left", 262 * g + "px"), d.find(".onion-skin .added-frame").css("opacity", g), d.find(".onion-skin .added-frame img").css("opacity", g), d.find(".dragger").on("mousedown", function (t) {
                    var e = $(this), i = $(this).parent(), s = i.width() - e.width();
                    t.preventDefault(), $("body").css({cursor: "pointer"}), $(document).on("mousemove.dragger", function (t) {
                        t.preventDefault();
                        var r = t.clientX - i.offset().left;
                        0 > r && (r = 0), r > s && (r = s), e.css({left: r});
                        var o = Math.round(100 * (r / 262)) / 100;
                        d.find(".onion-skin .added-frame").css("opacity", o), d.find(".onion-skin .added-frame img").css("opacity", o), n[a].pct = 100 * o, n[a].changed = !0
                    }), $(document).on("mouseup.dragger", function () {
                        $(document).off(".dragger"), $("body").css({cursor: "auto"}), c()
                    })
                });
                var E = 1;
                i > e - 4 && (E = (e - 4) / i), k.attr({width: i * E, height: r * E}), _.attr({width: i * E, height: r * E}), p.find(".added-frame").css({width: i * E + 2, height: r * E + 2}), p.find(".deleted-frame").css({width: i * E + 2, height: r * E + 2}), l.drawImage(P, P.marginHoriz * E, P.marginVert * E, P.width * E, P.height * E), u.drawImage(B, B.marginHoriz * E, B.marginVert * E, B.width * E, B.height * E), t(u, l), h.css("height", r * v + 30), f.css("height", r * A + 30), m.css("height", r * A + 30), p.css("height", r * A + 30), S.children().removeClass("disabled"), s(D)
            }

            function o() {
                var t = 100 * (M / A) + "%";
                d.find(".progress-bar").animate({width: t}, 250, "swing")
            }

            function c() {
                var t = "?";
                $.each(n, function (e, n) {
                    1 == n.changed && (0 != e && (t += "&"), t += "diff-" + e + "=" + n.view + "-" + Math.round(n.pct))
                }), window.history && window.history.replaceState && window.history.replaceState({}, "", t)
            }

            if (!$(this).data("image-diff-installed")) {
                var l, u, d = e.eq(a), h = d.find(".two-up").eq(0), f = d.find(".swipe").eq(0), m = d.find(".onion-skin").eq(0), p = d.find(".difference").eq(0), g = d.find(".deleted"), v = d.find(".added"), y = g.eq(0), b = v.eq(0), j = g.eq(1), x = v.eq(1), w = g.eq(2), C = v.eq(2), k = d.find("canvas.deleted").eq(0), _ = d.find("canvas.added").eq(0), S = d.find("ul.view-modes-menu"), T = d.find(".view"), D = 0, A = d.find(".asset").length, M = 0, P = new Image, B = new Image;
                n.push({name: d.attr("id"), view: 0, pct: 0, changed: !1}), $(this).data("image-diff-installed", !0), l = k[0].getContext("2d"), u = _[0].getContext("2d"), d.find(".two-up").hide(), d.find(".two-up p").removeClass("hidden"), d.find(".progress").removeClass("hidden"), d.find(".view-modes").removeClass("hidden"), P.src = d.find(".deleted").first().attr("src"), B.src = d.find(".added").first().attr("src"), y.attr("src", P.src).load(function () {
                    i()
                }), b.attr("src", B.src).load(function () {
                    i()
                }), j.attr("src", P.src).load(function () {
                    i()
                }), x.attr("src", B.src).load(function () {
                    i()
                }), w.attr("src", P.src).load(function () {
                    i()
                }), C.attr("src", B.src).load(function () {
                    i()
                });
                var E = !0;
                S.children("li").click(function () {
                    var t = $(this).index();
                    1 != t && 2 != t || !E || (E = !1), s(t), n[a].view = t, n[a].changed = !0, c()
                }), $.extend({getUrlVars: function () {
                    for (var t, e = [], n = window.location.href.slice(window.location.href.indexOf("?") + 1).split("&"), a = 0; a < n.length; a++)t = n[a].split("="), t[1] && (t[1] = t[1].split("-")), e.push(t[0]), e[t[0]] = t[1];
                    return e
                }, getUrlVar: function (t) {
                    return $.getUrlVars()[t]
                }})
            }
        })
    }
}), $(function () {
    function t() {
        var n = $("#current-version").val();
        n && $.get("_current", function (a) {
            n == a ? setTimeout(t, 5e3) : e || ($("#gollum-error-message").text("Someone has edited the wiki since you started. Please reload this page and re-apply your changes."), $("#gollum-error-message").show(), $("#gollum-editor-submit").attr("disabled", "disabled"), $("#gollum-editor-submit").attr("value", "Cannot Save, Someone Else Has Edited"))
        })
    }

    $("#see-more-elsewhere").click(function () {
        return $(".seen-elsewhere").show(), $(this).remove(), !1
    });
    var e = !1;
    $("#gollum-editor-body").each(t), $("#gollum-editor-submit").click(function () {
        e = !0
    });
    var n = [];
    $("form#history input[type=submit]").attr("disabled", !0), $("form#history input[type=checkbox]").change(function () {
        var t = $(this).val(), e = $.inArray(t, n);
        if (e > -1)n.splice(e, 1); else if (n.push(t), n.length > 2) {
            var a = n.shift();
            $("input[value=" + a + "]").prop("checked", !1)
        }
        if ($("form#history tr.commit").removeClass("selected"), $("form#history input[type=submit]").attr("disabled", !0), 2 == n.length) {
            $("form#history input[type=submit]").attr("disabled", !1);
            var i = !1;
            $("form#history tr.commit").each(function () {
                i && $(this).addClass("selected"), $(this).find("input:checked").length > 0 && (i = !i), i && $(this).addClass("selected")
            })
        }
    })
});