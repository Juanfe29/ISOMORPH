/* graph-demos.js — <graph-demo kind="..."> reactive 3D node/graph canvases (Isomorph, dark) */
(function () {
  var REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var INK = '#ECEAE5', MUTED = 'rgba(236,234,229,.34)', ACCENT = '#7BA9FF', BG = '#141517';
  var MONO = '10px ui-monospace, "IBM Plex Mono", Menlo, monospace';

  function mulberry(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

  function node(x, y, z, label) { return { hx: x, hy: y, hz: z, x: x, y: y, z: z, vx: 0, vy: 0, vz: 0, sx: 0, sy: 0, sc: 1, label: label || '' }; }

  function completeGraph(n) { var e = [], i, j; for (i = 0; i < n; i++) for (j = i + 1; j < n; j++) e.push([i, j]); return e; }

  function ring3d(n, r, zAmp, seed) {
    var rand = mulberry(seed || 7), out = [], i;
    for (i = 0; i < n; i++) {
      var a = (i / n) * Math.PI * 2;
      out.push(node(Math.cos(a) * r, Math.sin(a) * r * 0.62, (rand() - 0.5) * zAmp));
    }
    return out;
  }

  var LABELS = ['LLAMADAS', 'CRM', 'ERP', 'WHATSAPP', 'AGENTES', 'REPORTES', 'TELEFONÍA', 'QA'];

  class GraphDemo extends HTMLElement {
    connectedCallback() {
      if (this._built) return;
      this._built = true;
      this.kind = this.getAttribute('kind') || 'follow';
      this.style.display = 'block';
      this.style.position = 'relative';
      this.style.background = BG;

      this.canvas = document.createElement('canvas');
      this.canvas.style.cssText = 'display:block;width:100%;height:100%;touch-action:none;cursor:crosshair';
      this.appendChild(this.canvas);
      this.ctx = this.canvas.getContext('2d');

      this.p = { x: 0, y: 0, inside: false, down: false };
      this.rot = { y: 0, x: 0, ty: 0, tx: 0 };
      this.t = 0;
      this.hover = -1;
      this.typed = 0;

      if (this.kind === 'type') this._buildInput();

      this._setup();
      this._bind();
      this._resize();
      this._ro = new ResizeObserver(this._resize.bind(this));
      this._ro.observe(this);
      this._loop = this._frame.bind(this);
      this._raf = requestAnimationFrame(this._loop);
    }

    setProgress(p) { this.progress = Math.max(0, Math.min(1, p)); }

    disconnectedCallback() {
      cancelAnimationFrame(this._raf);
      if (this._ro) this._ro.disconnect();
    }

    _buildInput() {
      var wrap = document.createElement('div');
      wrap.style.cssText = 'position:absolute;left:16px;right:16px;bottom:16px;z-index:2';
      var inp = document.createElement('input');
      inp.placeholder = 'Escribí qué está fallando…';
      inp.style.cssText = 'width:100%;height:44px;background:rgba(236,234,229,.06);border:1px solid rgba(236,234,229,.22);color:' + INK +
        ';padding:0 14px;font:14px ui-sans-serif,system-ui,sans-serif;outline:none;border-radius:0';
      inp.addEventListener('focus', function () { inp.style.borderColor = ACCENT; });
      inp.addEventListener('blur', function () { inp.style.borderColor = 'rgba(236,234,229,.22)'; });
      var self = this;
      inp.addEventListener('input', function () { self.typed = inp.value.length; });
      wrap.appendChild(inp);
      this.appendChild(wrap);
    }

    _setup() {
      var k = this.kind, rand = mulberry(11), i;
      if (k === 'follow') {
        this.nodes = ring3d(5, 96, 90, 3);
        for (i = 0; i < 5; i++) this.nodes[i].label = LABELS[i];
        this.edges = completeGraph(5);
      } else if (k === 'snap') {
        this.nodes = ring3d(5, 96, 70, 5);
        this.scatter = [];
        for (i = 0; i < 5; i++) this.scatter.push({ x: (rand() - 0.5) * 420, y: (rand() - 0.5) * 240, z: (rand() - 0.5) * 200 });
        this.edges = completeGraph(5);
      } else if (k === 'force') {
        this.nodes = [];
        var COLS = 7, ROWS = 5;
        for (i = 0; i < COLS * ROWS; i++) {
          var cxi = i % COLS, ryi = Math.floor(i / COLS);
          var nn = node(0, 0, 0);
          nn.nx = ((cxi + 0.5) / COLS - 0.5) * 2 + (rand() - 0.5) * 0.22;
          nn.ny = ((ryi + 0.5) / ROWS - 0.5) * 2 + (rand() - 0.5) * 0.3;
          nn.nz = (rand() - 0.5) * 2;
          this.nodes.push(nn);
        }
        this.edges = [];
        for (i = 0; i < this.nodes.length; i++) {
          var right = (i % COLS === COLS - 1) ? -1 : i + 1;
          var down = i + COLS, diag = i + COLS + 1;
          if (right > -1) this.edges.push([i, right]);
          if (down < this.nodes.length) this.edges.push([i, down]);
          if (i % 3 === 0 && diag < this.nodes.length && i % COLS !== COLS - 1) this.edges.push([i, diag]);
          if (i % 8 === 0) this.edges.push([i, (i + 17) % this.nodes.length]);
        }
        this.fill = true;
        var labelAttr = this.getAttribute('areas');
        var names = labelAttr ? labelAttr.split('|') :
          ['TELECOMUNICACIONES', 'INTEGRACIÓN DE SISTEMAS', 'AGENTES DE IA', 'PRODUCTO A LA MEDIDA', 'QA Y BRECHAS'];
        var slots = [8, 12, 17, 23, 30];
        this.areas = names.map(function (nm, ix) { return { i: slots[ix % slots.length], label: nm }; });
        this.areaTitle = this.getAttribute('areas-title') || 'NUESTRAS ÁREAS DE TRABAJO';
      } else if (k === 'subgraph') {
        this.nodes = ring3d(5, 110, 60, 9);
        for (i = 0; i < 5; i++) this.nodes[i].label = ['TELECOM', 'INTEGRACIÓN', 'AGENTES', 'PRODUCTO', 'QA'][i];
        this.edges = completeGraph(5);
        for (i = 0; i < 10; i++) {
          var host = i % 5, ang = rand() * Math.PI * 2, rr = 46 + rand() * 26;
          var hn = this.nodes[host];
          this.nodes.push(node(hn.hx + Math.cos(ang) * rr, hn.hy + Math.sin(ang) * rr * .7, hn.hz + (rand() - .5) * 50));
          this.edges.push([host, this.nodes.length - 1]);
        }
      } else if (k === 'packets') {
        this.nodes = ring3d(6, 108, 80, 13);
        for (i = 0; i < 6; i++) this.nodes[i].label = LABELS[i];
        this.edges = completeGraph(6);
        this.particles = this.edges.map(function (e, idx) {
          return { t: (idx * 0.13) % 1, sp: 0.0022 + (idx % 4) * 0.0009, ms: 40 + ((idx * 37) % 260) };
        });
      } else if (k === 'morph') {
        this.nodes = ring3d(9, 112, 60, 17);
        this.tangle = [];
        for (i = 0; i < 9; i++) this.tangle.push({ x: (rand() - .5) * 400, y: (rand() - .5) * 230, z: (rand() - .5) * 220 });
        this.edges = [];
        for (i = 0; i < 9; i++) { this.edges.push([i, (i + 1) % 9]); this.edges.push([i, (i + 4) % 9]); }
        this.mix = 0;
      } else if (k === 'type') {
        this.nodes = []; this.edges = [];
        this.pool = ring3d(14, 118, 90, 23);
      } else if (k === 'visitor') {
        this.nodes = ring3d(7, 104, 80, 29);
        this.edges = completeGraph(7).filter(function (e, idx) { return idx % 2 === 0; });
        this.me = { sx: 0, sy: 0 };
      }
    }

    _bind() {
      var self = this, c = this.canvas;
      c.addEventListener('pointermove', function (e) {
        var r = c.getBoundingClientRect();
        self.p.x = e.clientX - r.left; self.p.y = e.clientY - r.top; self.p.inside = true;
        if (self.p.down && self.kind === 'follow') {
          self.rot.ty += (e.movementX || 0) * 0.006;
          self.rot.tx += (e.movementY || 0) * 0.004;
        }
      });
      c.addEventListener('pointerleave', function () { self.p.inside = false; self.hover = -1; });
      c.addEventListener('pointerdown', function (e) { self.p.down = true; c.setPointerCapture(e.pointerId); });
      c.addEventListener('pointerup', function () { self.p.down = false; });
    }

    _resize() {
      var r = this.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.w = Math.max(1, r.width); this.h = Math.max(1, r.height);
      this.canvas.width = this.w * dpr; this.canvas.height = this.h * dpr;
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (this.fill && this.nodes) {
        var sc0 = 700 / (700 + 380);
        var spanX = (this.w * 0.5) / sc0, spanY = (this.h * 0.5) / sc0, spanZ = Math.min(this.w, this.h) * 0.42;
        for (var q = 0; q < this.nodes.length; q++) {
          var nq = this.nodes[q];
          nq.hx = nq.nx * spanX; nq.hy = nq.ny * spanY; nq.hz = nq.nz * spanZ;
          if (!nq.seeded) { nq.x = nq.hx; nq.y = nq.hy; nq.z = nq.hz; nq.seeded = 1; }
        }
      }
    }

    _project(n) {
      var cy = Math.cos(this.rot.y), sy = Math.sin(this.rot.y),
          cx = Math.cos(this.rot.x), sx = Math.sin(this.rot.x);
      var x1 = n.x * cy - n.z * sy, z1 = n.x * sy + n.z * cy;
      var y1 = n.y * cx - z1 * sx, z2 = n.y * sx + z1 * cx;
      // Plano cercano: sin el clamp, un nodo que rota detrás de la cámara vuelve
      // negativo el denominador, y con él la escala y el radio -> arc() lanza
      // IndexSizeError en cada frame. 120 acota el radio sin achatar el efecto
      // de acercamiento (toca ~2,7% de las proyecciones).
      var f = 700, sc = f / Math.max(120, f + z2 + (this.fill ? 380 : 240));
      n.sx = this.w / 2 + x1 * sc; n.sy = this.h / 2 + y1 * sc; n.sc = sc; n.zz = z2;
    }

    _frame() {
      this._raf = requestAnimationFrame(this._loop);
      this.t += REDUCED ? 0 : 1;
      this._update();
      this._draw();
    }

    _update() {
      var k = this.kind, i, n, self = this;
      var px = this.p.inside ? (this.p.x / this.w - 0.5) : 0;
      var py = this.p.inside ? (this.p.y / this.h - 0.5) : 0;

      if (k === 'follow') {
        if (!this.p.down) { this.rot.ty += REDUCED ? 0 : 0.0032; this.rot.tx = py * 0.5; }
        this.rot.y += (this.rot.ty - this.rot.y) * 0.08;
        this.rot.x += (this.rot.tx - this.rot.x) * 0.08;
      } else if (k === 'force') {
        var prog = typeof this.progress === 'number' ? this.progress : 0;
        this.autoY = (this.autoY || 0) + (REDUCED ? 0 : 0.0026);
        this.rot.ty = this.autoY + px * 0.55 + prog * Math.PI * 1.4;
        this.rot.tx = py * 0.35 + Math.sin(this.autoY * 0.55) * 0.14 + prog * 0.35;
        this.rot.y += (this.rot.ty - this.rot.y) * 0.07;
        this.rot.x += (this.rot.tx - this.rot.x) * 0.07;
      } else {
        this.rot.ty = px * 0.85; this.rot.tx = py * 0.45;
        if (!REDUCED && k !== 'morph') this.rot.ty += Math.sin(this.t * 0.004) * 0.18;
        this.rot.y += (this.rot.ty - this.rot.y) * 0.06;
        this.rot.x += (this.rot.tx - this.rot.x) * 0.06;
      }

      if (k === 'snap') {
        var d = this.p.inside ? Math.hypot(this.p.x - this.w / 2, this.p.y - this.h / 2) : 9999;
        var order = Math.max(0, Math.min(1, 1 - d / (Math.min(this.w, this.h) * 0.62)));
        this.order = order;
        for (i = 0; i < this.nodes.length; i++) {
          n = this.nodes[i];
          n.x += (n.hx * order + this.scatter[i].x * (1 - order) - n.x) * 0.12;
          n.y += (n.hy * order + this.scatter[i].y * (1 - order) - n.y) * 0.12;
          n.z += (n.hz * order + this.scatter[i].z * (1 - order) - n.z) * 0.12;
        }
      }

      if (k === 'force') {
        var pr = typeof this.progress === 'number' ? this.progress : 1;
        var spread = 1.24 - pr * 0.24;
        var mx = this.p.x - this.w / 2, my = this.p.y - this.h / 2;

        for (i = 0; i < this.nodes.length; i++) this.nodes[i].focus = 0;
        if (this.areas && this.areas.length) {
          var seg = this.areas.length, af = pr * seg, jj;
          this.activeArea = -1;
          for (jj = 0; jj < seg; jj++) {
            var fo = 1 - Math.abs(af - (jj + 0.5)) * 1.7;
            fo = Math.max(0, Math.min(1, fo));
            fo = fo * fo * (3 - 2 * fo);
            var an = this.nodes[this.areas[jj].i];
            if (an) { an.focus = fo; an.areaLabel = this.areas[jj].label; }
            if (fo > 0.5) this.activeArea = jj;
          }
        }
        for (i = 0; i < this.nodes.length; i++) {
          n = this.nodes[i];
          var fo2 = n.focus || 0;
          var tx = n.hx * spread * (1 - fo2 * 0.72);
          var ty2 = n.hy * spread * (1 - fo2 * 0.72);
          var tz = n.hz * spread - fo2 * 560;
          n.vx += (tx - n.x) * (0.012 + fo2 * 0.03);
          n.vy += (ty2 - n.y) * (0.012 + fo2 * 0.03);
          n.vz += (tz - n.z) * (0.012 + fo2 * 0.03);
          if (this.p.inside) {
            var dx = n.x - mx, dy = n.y - my, dd = Math.max(28, Math.hypot(dx, dy));
            var f = 9000 / (dd * dd);
            n.vx += (dx / dd) * f; n.vy += (dy / dd) * f;
          }
          n.vx *= 0.9; n.vy *= 0.9; n.vz *= 0.9;
          n.x += n.vx; n.y += n.vy; n.z += n.vz;
        }
      }

      if (k === 'morph') {
        var target = this.p.inside ? Math.max(0, Math.min(1, this.p.x / this.w)) : 0.5;
        this.mix += (target - this.mix) * 0.08;
        for (i = 0; i < this.nodes.length; i++) {
          n = this.nodes[i];
          n.x = this.tangle[i].x * (1 - this.mix) + n.hx * this.mix;
          n.y = this.tangle[i].y * (1 - this.mix) + n.hy * this.mix;
          n.z = this.tangle[i].z * (1 - this.mix) + n.hz * this.mix;
        }
      }

      if (k === 'type') {
        var want = Math.min(this.pool.length, Math.ceil(this.typed / 3));
        if (this.nodes.length < want) {
          while (this.nodes.length < want) {
            var src = this.pool[this.nodes.length];
            var nn = node(src.hx, src.hy, src.hz);
            nn.x = 0; nn.y = 0; nn.z = 0; nn.born = 0;
            this.nodes.push(nn);
            var li = this.nodes.length - 1;
            if (li > 0) this.edges.push([li, li - 1]);
            if (li > 2) this.edges.push([li, li - 3]);
          }
        } else if (this.nodes.length > want) {
          this.nodes.length = want;
          this.edges = this.edges.filter(function (e) { return e[0] < want && e[1] < want; });
        }
        for (i = 0; i < this.nodes.length; i++) {
          n = this.nodes[i];
          n.x += (n.hx - n.x) * 0.1; n.y += (n.hy - n.y) * 0.1; n.z += (n.hz - n.z) * 0.1;
        }
      }

      if (k === 'packets' && !REDUCED) {
        for (i = 0; i < this.particles.length; i++) {
          this.particles[i].t += this.particles[i].sp;
          if (this.particles[i].t > 1) this.particles[i].t = 0;
        }
      }

      for (i = 0; i < this.nodes.length; i++) this._project(this.nodes[i]);

      if (k === 'subgraph' || k === 'packets') {
        this.hover = -1;
        if (this.p.inside) {
          var best = 26;
          for (i = 0; i < this.nodes.length; i++) {
            var dd2 = Math.hypot(this.nodes[i].sx - this.p.x, this.nodes[i].sy - this.p.y);
            if (dd2 < best) { best = dd2; this.hover = i; }
          }
        }
      }
    }

    _draw() {
      var g = this.ctx, k = this.kind, i, e, a, b;
      g.clearRect(0, 0, this.w, this.h);
      g.fillStyle = BG; g.fillRect(0, 0, this.w, this.h);

      var connected = {};
      if (this.hover > -1) {
        connected[this.hover] = 1;
        for (i = 0; i < this.edges.length; i++) {
          e = this.edges[i];
          if (e[0] === this.hover) connected[e[1]] = 1;
          if (e[1] === this.hover) connected[e[0]] = 1;
        }
      }

      for (i = 0; i < this.edges.length; i++) {
        e = this.edges[i]; a = this.nodes[e[0]]; b = this.nodes[e[1]];
        if (!a || !b) continue;
        var fEdge = Math.max(a.focus || 0, b.focus || 0);
        var lit = (this.hover > -1 && (connected[e[0]] && connected[e[1]])) || fEdge > 0.35;
        var dim = this.hover > -1 && !lit;
        g.beginPath(); g.moveTo(a.sx, a.sy); g.lineTo(b.sx, b.sy);
        g.strokeStyle = lit ? ACCENT : (dim ? 'rgba(236,234,229,.08)' : MUTED);
        g.lineWidth = lit ? 1.4 : (k === 'force' ? 1.05 : 0.9);
        g.globalAlpha = lit ? 1 : (dim ? 1 : Math.min(1, 0.55 + Math.min(a.sc, b.sc) * 0.4));
        g.stroke(); g.globalAlpha = 1;

        if (k === 'packets') {
          var pt = this.particles[i], tt = pt.t;
          var qx = a.sx + (b.sx - a.sx) * tt, qy = a.sy + (b.sy - a.sy) * tt;
          g.beginPath(); g.arc(qx, qy, lit ? 3 : 2, 0, 6.284);
          g.fillStyle = lit ? ACCENT : 'rgba(123,169,255,.6)'; g.fill();
        }
      }

      for (i = 0; i < this.nodes.length; i++) {
        var n = this.nodes[i];
        var isHover = i === this.hover;
        var dimN = this.hover > -1 && !connected[i];
        var r = (k === 'force' ? 5.4 : (i < 5 || k === 'type' ? 4.2 : 3)) * (0.55 + n.sc * 0.85);
        g.beginPath(); g.arc(n.sx, n.sy, isHover ? r * 1.8 : r, 0, 6.284);
        g.fillStyle = isHover ? ACCENT : (dimN ? 'rgba(236,234,229,.2)' : INK);
        g.fill();
        if (isHover) {
          g.beginPath(); g.arc(n.sx, n.sy, r * 3.4, 0, 6.284);
          g.strokeStyle = 'rgba(123,169,255,.4)'; g.lineWidth = 1; g.stroke();
        }
        if (n.focus > 0.02 && n.areaLabel) {
          var fo3 = n.focus;
          g.globalAlpha = Math.min(1, fo3 * 1.3);
          g.beginPath(); g.arc(n.sx, n.sy, r * 1.5, 0, 6.284); g.fillStyle = ACCENT; g.fill();
          g.beginPath(); g.arc(n.sx, n.sy, r * 3 + fo3 * 16, 0, 6.284);
          g.strokeStyle = 'rgba(123,169,255,.5)'; g.lineWidth = 1.2; g.stroke();
          var lx = n.sx + r * 3 + fo3 * 22, ly = n.sy;
          g.beginPath(); g.moveTo(n.sx + r * 2.2, ly); g.lineTo(lx - 8, ly);
          g.strokeStyle = 'rgba(123,169,255,.6)'; g.lineWidth = 1; g.stroke();
          g.font = '500 11px ui-monospace, "IBM Plex Mono", Menlo, monospace';
          g.fillStyle = 'rgba(236,234,229,.55)';
          g.fillText(this.areaTitle || '', lx, ly - 12);
          g.font = '500 17px ui-monospace, "IBM Plex Mono", Menlo, monospace';
          g.fillStyle = ACCENT;
          g.fillText(n.areaLabel, lx, ly + 8);
          g.globalAlpha = 1;
        }
        if (n.label && (k === 'follow' || k === 'packets' || (k === 'subgraph' && i < 5))) {
          g.font = MONO;
          g.fillStyle = isHover ? ACCENT : (dimN ? 'rgba(236,234,229,.18)' : 'rgba(236,234,229,.5)');
          g.fillText(n.label, n.sx + 9, n.sy + 3);
        }
      }

      if (k === 'visitor' && this.p.inside) {
        var mx = this.p.x, my = this.p.y, near = [];
        for (i = 0; i < this.nodes.length; i++) near.push({ i: i, d: Math.hypot(this.nodes[i].sx - mx, this.nodes[i].sy - my) });
        near.sort(function (u, v) { return u.d - v.d; });
        for (i = 0; i < 3 && i < near.length; i++) {
          var nd = this.nodes[near[i].i];
          g.beginPath(); g.moveTo(nd.sx, nd.sy); g.lineTo(mx, my);
          g.strokeStyle = ACCENT; g.globalAlpha = Math.max(0.12, 1 - near[i].d / 320);
          g.lineWidth = 1.2; g.stroke(); g.globalAlpha = 1;
        }
        g.beginPath(); g.arc(mx, my, 6, 0, 6.284); g.fillStyle = ACCENT; g.fill();
        g.beginPath(); g.arc(mx, my, 13, 0, 6.284); g.strokeStyle = 'rgba(123,169,255,.45)'; g.lineWidth = 1; g.stroke();
        g.font = MONO; g.fillStyle = ACCENT; g.fillText('VOS', mx + 18, my + 3);
      }

      g.font = MONO; g.fillStyle = 'rgba(236,234,229,.34)';
      if (k === 'force') g.textAlign = 'left';
      var hud = '';
      if (k === 'snap') hud = 'ORDEN ' + Math.round((this.order || 0) * 100) + '%';
      else if (k === 'morph') hud = 'DESCONECTADO ' + Math.round((1 - this.mix) * 100) + '%  ·  SISTEMA ' + Math.round(this.mix * 100) + '%';
      else if (k === 'packets') hud = this.hover > -1 ? this.nodes[this.hover].label + ' · ' + (40 + this.hover * 31) + ' ms' : 'HOVER UN NODO';
      else if (k === 'subgraph') hud = this.hover > -1 ? (this.nodes[this.hover].label || 'SUBNODO') : 'HOVER PARA AISLAR';
      else if (k === 'type') hud = this.nodes.length + ' NODOS · ' + this.edges.length + ' ENLACES';
      else if (k === 'follow') hud = 'ARRASTRÁ PARA ORBITAR';
      else if (k === 'force') {
        var pct = Math.round((typeof this.progress === 'number' ? this.progress : 0) * 100);
        var an2 = (this.areas && this.activeArea > -1) ? ' · ' + this.areas[this.activeArea].label : '';
        hud = 'EL CURSOR EMPUJA · SCROLL ' + pct + '%' + an2;
      }
      else if (k === 'visitor') hud = this.p.inside ? 'CONECTADO' : 'ENTRÁ AL CUADRO';
      if (hud) g.fillText(hud, 14, this.h - 14);
    }
  }

  if (!customElements.get('graph-demo')) customElements.define('graph-demo', GraphDemo);
})();
