import {
    $ as rt,
    _ as Oe,
    A as ee,
    a0 as lt,
    a1 as dt,
    a2 as ct,
    a3 as pt,
    a4 as ht,
    a5 as ut,
    a6 as gt,
    a7 as Te,
    a8 as ft,
    a9 as mt,
    aa as vt,
    ab as bt,
    ac as He,
    ad as wt,
    ae as ve,
    af as yt,
    ag as xt,
    b as u,
    B as _,
    C as Y,
    D as $,
    E as g,
    F as l,
    G as fe,
    H as Ke,
    I as Ze,
    j as r,
    J as ie,
    K as we,
    k as me,
    L as Qe,
    l as et,
    M as T,
    N as it,
    O as ge,
    P as tt,
    Q as _e,
    R as S,
    S as p,
    T as ot,
    u as y,
    U as O,
    v as A,
    V as nt,
    w as q,
    W as st,
    x as h,
    X as W,
    y as Me,
    Y as at,
    z as C,
    Z as ye
} from "./copilot-_lIGjjDp.js";
import {n as L, r as v} from "./state-Ca0NTNkv.js";
import {e as H, m as te} from "./overlay-monkeypatch-Cs-RBt8n.js";
import {i as d} from "./icons-CJwGJ_MG.js";
import {c as Pt, e as E} from "./early-project-state-CXnqwb94.js";

const It = 1, xe = 36, At = 18;
function Ct(e, t) {
  if (e.length === 0)
    return;
  const i = $t(e, t);
  for (const n in e)
    e[n].style.setProperty("--content-height", `${i[n]}px`);
}
function $t(e, t) {
  const i = e.length, n = e.filter((s) => s.panelInfo && s.panelInfo.expanded).length, o = i - n;
  return e.map((s) => {
    const a = s.panelInfo;
    return a && !a.expanded ? xe : (t.offsetHeight - (t.position === "bottom" ? At : 0) - o * xe - i * It) / n;
  });
}
var kt = Object.defineProperty, St = Object.getOwnPropertyDescriptor, U = (e, t, i, n) => {
  for (var o = n > 1 ? void 0 : n ? St(t, i) : t, s = e.length - 1, a; s >= 0; s--)
    (a = e[s]) && (o = (n ? a(t, i, o) : a(o)) || o);
  return n && o && kt(t, i, o), o;
};
const ne = "data-drag-initial-index", J = "data-drag-final-index";
let R = class extends A {
  constructor() {
    super(...arguments), this.position = "right", this.opened = !1, this.keepOpen = !1, this.resizing = !1, this.closingForcefully = !1, this.draggingSectionPanel = null, this.panelCountChanged = q(() => {
      this.refreshSplit();
    }, 100), this.documentMouseUpListener = () => {
      this.resizing && u.emit("user-select", { allowSelection: !0 }), this.resizing = !1, r.setDrawerResizing(!1), this.removeAttribute("resizing");
    }, this.resizingMouseMoveListener = (e) => {
      if (!this.resizing)
        return;
      const { x: t, y: i } = e;
      e.stopPropagation(), e.preventDefault(), requestAnimationFrame(() => {
        let n;
        if (this.position === "right") {
          const o = document.body.clientWidth - t;
          this.style.setProperty("--size", `${o}px`), Y.saveDrawerSize(this.position, o), n = { width: o };
        } else if (this.position === "left") {
          const o = t;
          this.style.setProperty("--size", `${o}px`), Y.saveDrawerSize(this.position, o), n = { width: o };
        } else if (this.position === "bottom") {
          const o = document.body.clientHeight - i;
          this.style.setProperty("--size", `${o}px`), Y.saveDrawerSize(this.position, o), n = { height: o };
        }
        this.setActualSize(), h.panels.filter((o) => !o.floating && o.panel === this.position).forEach((o) => {
          h.updatePanel(o.tag, n);
        });
      });
    }, this.sectionPanelDraggingStarted = (e, t) => {
      this.draggingSectionPanel = e, u.emit("user-select", { allowSelection: !1 }), this.draggingSectionPointerStartY = t.clientY, e.toggleAttribute("dragging", !0), e.style.zIndex = "1000", Array.from(this.querySelectorAll("copilot-section-panel-wrapper")).forEach((i, n) => {
        i.setAttribute(ne, `${n}`);
      }), document.addEventListener("mousemove", this.sectionPanelDragging), document.addEventListener("mouseup", this.sectionPanelDraggingFinished);
    }, this.sectionPanelDragging = (e) => {
      if (!this.draggingSectionPanel)
        return;
      const { clientX: t, clientY: i } = e;
      if (!Me(this.getBoundingClientRect(), t, i)) {
        this.cleanUpDragging();
        return;
      }
      const n = i - this.draggingSectionPointerStartY;
      this.draggingSectionPanel.style.transform = `translateY(${n}px)`, this.updateSectionPanelPositionsWhileDragging();
    }, this.sectionPanelDraggingFinished = () => {
      if (!this.draggingSectionPanel)
        return;
      u.emit("user-select", { allowSelection: !0 });
      const e = this.getAllPanels().filter(
        (t) => t.hasAttribute(J) && t.panelInfo?.panelOrder !== Number.parseInt(t.getAttribute(J), 10)
      ).map((t) => ({
        tag: t.panelTag,
        order: Number.parseInt(t.getAttribute(J), 10)
      }));
      this.cleanUpDragging(), h.updateOrders(e), document.removeEventListener("mouseup", this.sectionPanelDraggingFinished), document.removeEventListener("mousemove", this.sectionPanelDragging), this.refreshSplit();
    }, this.updateSectionPanelPositionsWhileDragging = () => {
      const e = this.draggingSectionPanel.getBoundingClientRect().height;
      this.getAllPanels().sort((t, i) => {
        const n = t.getBoundingClientRect(), o = i.getBoundingClientRect(), s = (n.top + n.bottom) / 2, a = (o.top + o.bottom) / 2;
        return s - a;
      }).forEach((t, i) => {
        if (t.setAttribute(J, `${i}`), t.panelTag !== this.draggingSectionPanel?.panelTag) {
          const n = Number.parseInt(t.getAttribute(ne), 10);
          n > i ? t.style.transform = `translateY(${-e}px)` : n < i ? t.style.transform = `translateY(${e}px)` : t.style.removeProperty("transform");
        }
      });
    }, this.panelExpandedListener = (e) => {
      this.querySelector(`copilot-section-panel-wrapper[paneltag="${e.detail.panelTag}"]`) && this.refreshSplit();
    }, this.setActualSize = () => {
      let e = this.offsetWidth;
      this.position === "bottom" && (e = this.offsetHeight), this.style.setProperty("--actual-size", `calc(${e}px - var(--hover-size))`);
    };
  }
  static get styles() {
    return [
      C(ee),
      _`
        :host {
          --size: 350px;
          --actual-size: 350px;
          --min-size: 20%;
          --max-size: 80%;
          --default-content-height: 300px;
          --transition-duration: var(--duration-2);
          --opening-delay: var(--duration-2);
          --closing-delay: var(--duration-3);
          --hover-size: 18px;
          position: absolute;
          z-index: var(--z-index-drawer);
          transition: translate var(--transition-duration) var(--closing-delay);
        }

        :host(:is([bounce][position='left'])) .drawer-indicator {
          animation: bounceLeft 0.5s ease-out;
        }

        :host(:is([bounce][position='right'])) .drawer-indicator {
          animation: bounceRight 0.5s ease-out;
        }

        :host(:is([bounce][position='bottom'])) .drawer-indicator {
          animation: bounceBottom 0.5s ease-out;
        }

        :host(:is([position='left'], [position='right'])) {
          width: var(--size);
          min-width: var(--min-size);
          max-width: var(--max-size);
          top: 0;
          bottom: 0;
        }

        :host([position='left']) {
          left: calc(0px - var(--actual-size));
          translate: 0% 0%;
          padding-right: var(--hover-size);
        }

        :host([position='right']) {
          right: calc(0px - var(--actual-size));
          translate: 0% 0%;
          padding-left: var(--hover-size);
        }

        :host([position='bottom']) {
          height: var(--size);
          min-height: var(--min-size);
          max-height: var(--max-size);
          bottom: calc(0px - var(--actual-size));
          left: 0;
          right: 0;
          translate: 0% 0%;
          padding-top: var(--hover-size);
        }

        /* The visible container. Needed to have extra space for hover and resize handle outside it. */

        .container {
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          height: 100%;
          background: var(--background-color);
          -webkit-backdrop-filter: var(--surface-backdrop-filter);
          backdrop-filter: var(--surface-backdrop-filter);
          overflow-y: auto;
          overflow-x: hidden;
          box-shadow: var(--surface-box-shadow-2);
          transition:
            opacity var(--transition-duration) var(--closing-delay),
            visibility calc(var(--transition-duration) * 2) var(--closing-delay);
          opacity: 0;
          /* For accessibility (restored when open) */
          visibility: hidden;
        }

        :host([position='left']) .container {
          border-right: 1px solid var(--surface-border-color);
        }

        :host([position='right']) .container {
          border-left: 1px solid var(--surface-border-color);
        }

        :host([position='bottom']) .container {
          border-top: 1px solid var(--surface-border-color);
        }

        /* Opened state */

        :host([position='left']:is([opened], [keepopen])) {
          translate: calc(100% - var(--hover-size)) 0%;
        }
        :host([position='right']:is([opened], [keepopen])) {
          translate: calc(-100% + var(--hover-size)) 0%;
        }
        :host([position='bottom']:is([opened], [keepopen])) {
          translate: 0 calc(-100% + var(--hover-size));
        }

        :host(:is([opened], [keepopen])) {
          transition-delay: var(--opening-delay);
          z-index: var(--z-index-opened-drawer);
        }

        :host(:is([opened], [keepopen])) .container {
          transition-delay: var(--opening-delay);
          visibility: visible;
          opacity: 1;
        }

        .drawer-indicator {
          align-items: center;
          border-radius: 9999px;
          box-shadow: inset 0 0 0 1px hsl(0 0% 0% / 0.2);
          color: white;
          display: flex;
          height: 1.75rem;
          justify-content: center;
          overflow: hidden;
          opacity: 1;
          position: absolute;
          transition-delay: 0.5s;
          transition-duration: 0.2s;
          transition-property: opacity;
          width: 1.75rem;
        }

        .drawer-indicator::before {
          animation: 5s swirl linear infinite;
          animation-play-state: running;
          background-image:
            radial-gradient(circle at 50% -10%, hsl(221 100% 55% / 0.6) 0%, transparent 60%),
            radial-gradient(circle at 25% 40%, hsl(303 71% 64%) 0%, transparent 70%),
            radial-gradient(circle at 80% 10%, hsla(262, 38%, 9%, 0.5) 0%, transparent 80%),
            radial-gradient(circle at 110% 50%, hsla(147, 100%, 77%, 1) 20%, transparent 100%);
          content: '';
          inset: 0;
          opacity: 1;
          position: absolute;
          transition: opacity 0.5s;
        }

        :host([attention-required]) .drawer-indicator::before {
          background-image:
            radial-gradient(circle at 50% -10%, hsl(0deg 100% 55% / 60%) 0%, transparent 60%),
            radial-gradient(circle at 25% 40%, hsl(0deg 71% 64%) 0%, transparent 70%),
            radial-gradient(circle at 80% 10%, hsl(0deg 38% 9% / 50%) 0%, transparent 80%),
            radial-gradient(circle at 110% 50%, hsl(0deg 100% 77%) 20%, transparent 100%);
        }

        :host([opened]) .drawer-indicator {
          opacity: 0;
          transition-delay: 0s;
        }

        .drawer-indicator svg {
          height: 0.75rem;
          width: 0.75rem;
          z-index: 1;
        }

        :host([position='right']) .drawer-indicator {
          left: 0.25rem;
          top: calc(50% - 0.875rem);
        }

        :host([position='right']) .drawer-indicator svg {
          margin-inline-start: -0.625rem;
          transform: rotate(-90deg);
        }

        :host([position='left']) .drawer-indicator {
          right: 0.25rem;
          top: calc(50% - 0.875rem);
        }

        :host([position='left']) .drawer-indicator svg {
          margin-inline-end: -0.625rem;
          transform: rotate(90deg);
        }

        :host([position='bottom']) .drawer-indicator {
          left: calc(50% - 0.875rem);
          top: 0.25rem;
        }

        :host([position='bottom']) .drawer-indicator svg {
          margin-top: -0.625rem;
        }

        .resize {
          position: absolute;
          z-index: 10;
          inset: 0;
        }

        :host(:is([position='left'], [position='right'])) .resize {
          width: var(--hover-size);
          cursor: col-resize;
        }

        :host([position='left']) .resize {
          left: auto;
          right: calc(var(--hover-size) * 0.5);
        }

        :host([position='right']) .resize {
          right: auto;
          left: calc(var(--hover-size) * 0.5);
        }

        :host([position='bottom']) .resize {
          height: var(--hover-size);
          bottom: auto;
          top: calc(var(--hover-size) * 0.5);
          cursor: row-resize;
        }

        :host([resizing]) .container {
          /* vaadin-grid (used in the outline) blocks the mouse events */
          pointer-events: none;
        }

        /* Visual indication of the drawer */

        :host::before {
          content: '';
          position: absolute;
          pointer-events: none;
          z-index: -1;
          inset: var(--hover-size);
        }

        :host([document-hidden])::before {
          animation: none;
        }

        :host([document-hidden]) .drawer-indicator {
          -webkit-filter: grayscale(100%); /* Chrome, Safari, Opera */
          filter: grayscale(100%);
        }

        :host(:is([opened], [keepopen]))::before {
          transition-delay: var(--opening-delay);
          opacity: 0;
        }
      `
    ];
  }
  connectedCallback() {
    super.connectedCallback(), this.reaction(
      () => h.panels,
      () => this.requestUpdate()
    ), this.reaction(
      () => r.operationInProgress,
      (t) => {
        t === ge.DragAndDrop && !this.opened && !this.keepOpen ? this.style.setProperty("pointer-events", "none") : this.style.setProperty("pointer-events", "auto");
      }
    ), this.reaction(
      () => h.getAttentionRequiredPanelConfiguration(),
      () => {
        const t = h.getAttentionRequiredPanelConfiguration();
        t && !t.floating && this.toggleAttribute($, t.panel === this.position);
      }
    ), this.reaction(
      () => r.active,
      () => {
        r.active || (this.opened = !1);
      }
    ), document.addEventListener("mouseup", this.documentMouseUpListener);
    const e = Y.getDrawerSize(this.position);
    e && (this.style.setProperty("--size", `${e}px`), this.setActualSize()), document.addEventListener("mousemove", this.resizingMouseMoveListener), this.addEventListener("mouseenter", this.mouseEnterListener), u.on("document-activation-change", (t) => {
      this.toggleAttribute("document-hidden", !t.detail.active);
    }), u.on("panel-expanded", this.panelExpandedListener), u.on("copilot-main-resized", this.setActualSize), this.reaction(
      () => h.panels.filter(
        (t) => !t.floating && t.panel === this.position
      ).length,
      () => {
        this.panelCountChanged();
      }
    );
  }
  firstUpdated(e) {
    super.firstUpdated(e), this.resizeElement.addEventListener("mousedown", (t) => {
      t.button === 0 && (this.resizing = !0, r.setDrawerResizing(!0), this.setAttribute("resizing", ""), u.emit("user-select", { allowSelection: !1 }));
    });
  }
  updated(e) {
    super.updated(e), e.has("opened") && this.opened && this.hasAttribute($) && (this.removeAttribute($), h.clearAttention());
  }
  disconnectedCallback() {
    super.disconnectedCallback(), document.removeEventListener("mousemove", this.resizingMouseMoveListener), document.removeEventListener("mouseup", this.documentMouseUpListener), this.removeEventListener("mouseenter", this.mouseEnterListener), u.off("panel-expanded", this.panelExpandedListener), u.off("copilot-main-resized", this.setActualSize);
  }
  /**
   * Cleans up attributes/styles etc... for dragging operations
   * @private
   */
  cleanUpDragging() {
    this.draggingSectionPanel && (r.setSectionPanelDragging(!1), this.draggingSectionPanel.style.zIndex = "", Array.from(this.querySelectorAll("copilot-section-panel-wrapper")).forEach((e) => {
      e.style.removeProperty("transform"), e.removeAttribute(J), e.removeAttribute(ne);
    }), this.draggingSectionPanel.removeAttribute("dragging"), this.draggingSectionPanel = null);
  }
  getAllPanels() {
    return Array.from(this.querySelectorAll("copilot-section-panel-wrapper"));
  }
  getAllPanelsOrdered() {
    return this.getAllPanels().sort((e, t) => e.panelInfo && t.panelInfo ? e.panelInfo.panelOrder - t.panelInfo.panelOrder : 0);
  }
  /**
   * Closes the drawer and disables mouse enter event for a while.
   */
  forceClose() {
    this.closingForcefully = !0, this.opened = !1, setTimeout(() => {
      this.closingForcefully = !1;
    }, 0.5);
  }
  mouseEnterListener(e) {
    if (this.closingForcefully || r.sectionPanelResizing)
      return;
    document.querySelector("copilot-main").shadowRoot.querySelector("copilot-drawer-panel[opened]") || (this.refreshSplit(), this.opened = !0);
  }
  render() {
    return l`
      <div class="container">
        <slot></slot>
      </div>
      <div class="resize"></div>
      <div class="drawer-indicator">${d.chevronUp}</div>
    `;
  }
  refreshSplit() {
    Ct(this.getAllPanelsOrdered(), this);
  }
};
U([
  L({ reflect: !0, attribute: !0 })
], R.prototype, "position", 2);
U([
  L({ reflect: !0, type: Boolean })
], R.prototype, "opened", 2);
U([
  L({ reflect: !0, type: Boolean })
], R.prototype, "keepOpen", 2);
U([
  H(".container")
], R.prototype, "container", 2);
U([
  H(".resize")
], R.prototype, "resizeElement", 2);
R = U([
  y("copilot-drawer-panel")
], R);
var Et = Object.defineProperty, Rt = Object.getOwnPropertyDescriptor, Ue = (e, t, i, n) => {
  for (var o = n > 1 ? void 0 : n ? Rt(t, i) : t, s = e.length - 1, a; s >= 0; s--)
    (a = e[s]) && (o = (n ? a(t, i, o) : a(o)) || o);
  return n && o && Et(t, i, o), o;
};
let le = class extends fe {
  constructor() {
    super(...arguments), this.checked = !1;
  }
  static get styles() {
    return _`
      .switch {
        align-items: center;
        border-radius: var(--radius-2);
        display: inline-flex;
        gap: var(--space-100);
        padding-block: calc((var(--size-m) - var(--line-height-1)) / 2);
      }

      .switch input {
        opacity: 0;
        position: absolute;
      }

      .slider {
        align-items: center;
        background-color: var(--switch-inactive-color);
        border-radius: 9999px;
        box-sizing: border-box;
        display: flex;
        flex-shrink: 0;
        height: 1rem;
        padding: var(--space-25);
        width: 1.75rem;
      }

      .slider::before {
        background: white;
        border-radius: 9999px;
        box-shadow: var(--shadow-m);
        content: '';
        display: flex;
        height: 0.75rem;
        margin-inline-start: 0;
        transition: margin var(--duration-1) cubic-bezier(0.2, 0, 0, 1);
        width: 0.75rem;
      }

      input:checked + .slider {
        background: var(--switch-active-color);

        &::before {
          margin-inline-start: 0.75rem;
        }
      }

      input:focus + .slider {
        outline: 2px solid var(--focus-color);
        outline-offset: 1px;
      }
    `;
  }
  render() {
    return l`
      <label class="switch">
        <input
          class="feature-toggle"
          id="feature-toggle-${this.id}"
          type="checkbox"
          ?checked="${this.checked}"
          @change=${(e) => {
      e.preventDefault(), this.checked = e.target.checked, this.dispatchEvent(new CustomEvent("on-change"));
    }} />
        <span aria-hidden="true" class="slider"></span>
        ${this.title}
      </label>
    `;
  }
  //  @change=${(e: InputEvent) => this.toggleFeatureFlag(e, feature)}
};
Ue([
  L({ reflect: !0, type: Boolean })
], le.prototype, "checked", 2);
le = Ue([
  y("copilot-toggle-button")
], le);
class Dt {
  constructor() {
    this.offsetX = 0, this.offsetY = 0;
  }
  draggingStarts(t, i) {
    this.offsetX = i.clientX - t.getBoundingClientRect().left, this.offsetY = i.clientY - t.getBoundingClientRect().top;
  }
  dragging(t, i) {
    const n = i.clientX, o = i.clientY, s = n - this.offsetX, a = n - this.offsetX + t.getBoundingClientRect().width, c = o - this.offsetY, m = o - this.offsetY + t.getBoundingClientRect().height;
    return this.adjust(t, s, c, a, m);
  }
  adjust(t, i, n, o, s) {
    let a, c, m, b;
    const P = document.documentElement.getBoundingClientRect().width, V = document.documentElement.getBoundingClientRect().height;
    return (o + i) / 2 < P / 2 ? (t.style.setProperty("--left", `${i}px`), t.style.setProperty("--right", ""), b = void 0, a = Math.max(0, i)) : (t.style.removeProperty("--left"), t.style.setProperty("--right", `${P - o}px`), a = void 0, b = Math.max(0, P - o)), (n + s) / 2 < V / 2 ? (c = Math.max(0, n), t.style.setProperty("--top", `${c}px`), t.style.setProperty("--bottom", ""), m = void 0) : (t.style.setProperty("--top", ""), t.style.setProperty("--bottom", `${V - s}px`), c = void 0, m = Math.max(0, V - s)), {
      left: a,
      right: b,
      top: c,
      bottom: m
    };
  }
  anchor(t) {
    const { left: i, top: n, bottom: o, right: s } = t.getBoundingClientRect();
    return this.adjust(t, i, n, s, o);
  }
  anchorLeftTop(t) {
    const { left: i, top: n } = t.getBoundingClientRect();
    return t.style.setProperty("--left", `${i}px`), t.style.setProperty("--right", ""), t.style.setProperty("--top", `${n}px`), t.style.setProperty("--bottom", ""), {
      left: i,
      top: n
    };
  }
}
const I = new Dt();
var Lt = Object.defineProperty, zt = Object.getOwnPropertyDescriptor, j = (e, t, i, n) => {
  for (var o = n > 1 ? void 0 : n ? zt(t, i) : t, s = e.length - 1, a; s >= 0; s--)
    (a = e[s]) && (o = (n ? a(t, i, o) : a(o)) || o);
  return n && o && Lt(t, i, o), o;
};
const Pe = "https://github.com/JetBrains/JetBrainsRuntime/releases";
function Mt(e, t) {
  if (!t)
    return !0;
  const [i, n, o] = t.split(".").map((m) => parseInt(m)), [s, a, c] = e.split(".").map((m) => parseInt(m));
  if (i < s)
    return !0;
  if (i === s) {
    if (n < a)
      return !0;
    if (n === a)
      return o < c;
  }
  return !1;
}
const Ie = "Download complete";
let x = class extends A {
  constructor() {
    super(), this.javaPluginSectionOpened = !1, this.hotswapSectionOpened = !1, this.hotswapTab = "hotswapagent", this.downloadStatusMessages = [], this.downloadProgress = 0, this.onDownloadStatusUpdate = this.downloadStatusUpdate.bind(this), this.handleESC = (e) => {
      r.active && e.key === "Escape" && h.updatePanel(K.tag, { floating: !1 });
    }, this.reaction(
      () => [r.jdkInfo, r.idePluginState],
      () => {
        r.idePluginState && (!r.idePluginState.ide || !r.idePluginState.active ? this.javaPluginSectionOpened = !0 : (!(/* @__PURE__ */ new Set(["vscode", "intellij"])).has(r.idePluginState.ide) || !r.idePluginState.active) && (this.javaPluginSectionOpened = !1)), r.jdkInfo && ie() !== "success" && (this.hotswapSectionOpened = !0);
      },
      { fireImmediately: !0 }
    );
  }
  connectedCallback() {
    super.connectedCallback(), u.on("set-up-vs-code-hotswap-status", this.onDownloadStatusUpdate), this.addESCListener();
  }
  disconnectedCallback() {
    super.disconnectedCallback(), u.off("set-up-vs-code-hotswap-status", this.onDownloadStatusUpdate), this.removeESCListener();
  }
  render() {
    const e = {
      intellij: r.idePluginState?.ide === "intellij",
      vscode: r.idePluginState?.ide === "vscode",
      eclipse: r.idePluginState?.ide === "eclipse",
      idePluginInstalled: !!r.idePluginState?.active
    };
    return l`
      <div part="container">${this.renderPluginSection(e)} ${this.renderHotswapSection(e)}</div>
      <div part="footer">
        <vaadin-button
          id="close"
          @click="${() => h.updatePanel(K.tag, { floating: !1 })}"
          >Close
        </vaadin-button>
      </div>
    `;
  }
  renderPluginSection(e) {
    let t = "";
    e.intellij ? t = "IntelliJ" : e.vscode ? t = "VS Code" : e.eclipse && (t = "Eclipse");
    let i, n;
    e.vscode || e.intellij ? e.idePluginInstalled ? (i = `Plugin for ${t} installed`, n = this.renderPluginInstalledContent()) : (i = `Plugin for ${t} not installed`, n = this.renderPluginIsNotInstalledContent(e)) : e.eclipse ? (i = "Eclipse development workflow is not supported yet", n = this.renderEclipsePluginContent()) : (i = "No IDE found", n = this.renderNoIdePluginContent());
    const o = e.idePluginInstalled ? d.checkCircle : d.alertTriangle;
    return l`
      <details
        part="panel"
        .open=${this.javaPluginSectionOpened}
        @toggle=${(s) => {
      we(() => {
        this.javaPluginSectionOpened = s.target.open;
      });
    }}>
        <summary part="header">
          <span class="icon ${e.idePluginInstalled ? "success" : "warning"}">${o}</span>
          <div>${i}</div>
        </summary>
        <div part="content">${n}</div>
      </details>
    `;
  }
  renderNoIdePluginContent() {
    return l`
      <div>
        <div>We could not detect an IDE</div>
        ${this.recommendSupportedPlugin()}
      </div>
    `;
  }
  renderEclipsePluginContent() {
    return l`
      <div>
        <div>Eclipse workflow environment is not supported yet.</div>
        ${this.recommendSupportedPlugin()}
      </div>
    `;
  }
  recommendSupportedPlugin() {
    return l`<p>
      Please use <a href="https://code.visualstudio.com">Visual Studio Code</a> or
      <a href="https://www.jetbrains.com/idea">IntelliJ IDEA</a> for better development experience
    </p>`;
  }
  renderPluginInstalledContent() {
    return l` <p>You have a running plugin. Enjoy your awesome development workflow!</p> `;
  }
  renderPluginIsNotInstalledContent(e) {
    let t = null, i = "Install from Marketplace";
    return e.intellij ? (t = it, i = "Install from JetBrains Marketplace") : e.vscode && (t = nt, i = "Install from VSCode Marketplace"), l`
      <div>
        <div>Install the Vaadin IDE Plugin to ensure a smooth development workflow</div>
        <p>
          Installing the plugin is not required, but strongly recommended.<br />Some Vaadin Copilot functionality, such
          as undo, will not function optimally without the plugin.
        </p>
        ${t ? l` <div>
              <vaadin-button
                @click="${() => {
      window.open(t, "_blank");
    }}"
                >${i}
                <vaadin-icon icon="vaadin:external-link"></vaadin-icon>
              </vaadin-button>
            </div>` : g}
      </div>
    `;
  }
  renderHotswapSection(e) {
    const { jdkInfo: t } = r;
    if (!t)
      return g;
    const i = ie(), n = Qe();
    let o, s, a;
    return i === "success" ? (o = d.checkCircle, a = "Java Hotswap is enabled") : i === "warning" ? (o = d.alertTriangle, a = "Java Hotswap is not enabled") : i === "error" && (o = d.alertTriangle, a = "Java Hotswap is partially enabled"), this.hotswapTab === "jrebel" ? t.jrebel ? s = this.renderJRebelInstalledContent() : s = this.renderJRebelNotInstalledContent() : e.intellij ? s = this.renderHotswapAgentPluginContent(this.renderIntelliJHotswapHint) : e.vscode ? s = this.renderHotswapAgentPluginContent(this.renderVSCodeHotswapHint) : s = this.renderHotswapAgentNotInstalledContent(e), l` <details
      part="panel"
      .open=${this.hotswapSectionOpened}
      @toggle=${(c) => {
      we(() => {
        this.hotswapSectionOpened = c.target.open;
      });
    }}>
      <summary part="header">
        <span class="icon ${i}">${o}</span>
        <div>${a}</div>
      </summary>
      <div part="content">
        ${n !== "none" ? l`${n === "jrebel" ? this.renderJRebelInstalledContent() : this.renderHotswapAgentInstalledContent()}` : l`
            <div class="tabs" role="tablist">
              <button
                aria-selected="${this.hotswapTab === "hotswapagent" ? "true" : "false"}"
                class="tab"
                role="tab"
                @click=${() => {
      this.hotswapTab = "hotswapagent";
    }}>
                Hotswap Agent
              </button>
              <button
                aria-selected="${this.hotswapTab === "jrebel" ? "true" : "false"}"
                class="tab"
                role="tab"
                @click=${() => {
      this.hotswapTab = "jrebel";
    }}>
                JRebel
              </button>
            </div>
            <div part="content">${s}</div>
            </div>
            </details>
          `}
      </div>
    </details>`;
  }
  renderJRebelNotInstalledContent() {
    return l`
      <div>
        <a href="https://www.jrebel.com">JRebel ${d.share}</a> is a commercial hotswap solution. Vaadin detects the
        JRebel Agent and automatically reloads the application in the browser after the Java changes have been
        hotpatched.
        <p>
          Go to
          <a href="https://www.jrebel.com/products/jrebel/learn" target="_blank" rel="noopener noreferrer">
            https://www.jrebel.com/products/jrebel/learn ${d.share}</a
          >
          to get started
        </p>
      </div>
    `;
  }
  renderHotswapAgentNotInstalledContent(e) {
    const t = [
      this.renderJavaRunningInDebugModeSection(),
      this.renderHotswapAgentJdkSection(e),
      this.renderInstallHotswapAgentJdkSection(e),
      this.renderHotswapAgentVersionSection(),
      this.renderHotswapAgentMissingArgParam(e)
    ];
    return l` <div part="hotswap-agent-section-container">${t}</div> `;
  }
  renderHotswapAgentPluginContent(e) {
    const i = ie() === "success";
    return l`
      <div part="hotswap-agent-section-container">
        <div class="inner-section">
          <span class="hotswap icon ${i ? "success" : "warning"}"
            >${i ? d.checkCircle : d.alertTriangle}</span
          >
          ${e()}
        </div>
      </div>
    `;
  }
  renderIntelliJHotswapHint() {
    return l` <div class="hint">
      <h3>Use 'Debug using Hotswap Agent' launch configuration</h3>
      Vaadin IntelliJ plugin offers launch mode that does not require any manual configuration!
      <p>
        In order to run recommended launch configuration, you should click three dots right next to Debug button and
        select <code>Debug using Hotswap Agent</code> option.
      </p>
    </div>`;
  }
  renderVSCodeHotswapHint() {
    return l` <div class="hint">
      <h3>Use 'Debug (hotswap)'</h3>
      With Vaadin Visual Studio Code extension you can run Hotswap Agent without any manual configuration required!
      <p>Click <code>Debug (hotswap)</code> within your main class to debug application using Hotswap Agent.</p>
    </div>`;
  }
  renderJavaRunningInDebugModeSection() {
    const e = r.jdkInfo?.runningInJavaDebugMode;
    return l`
      <div class="inner-section">
        <details class="inner" .open="${!e}">
          <summary>
            <span class="icon ${e ? "success" : "warning"}"
              >${e ? d.checkCircle : d.alertTriangle}</span
            >
            <div>Run Java in debug mode</div>
          </summary>
          <div class="hint">Start the application in debug mode in the IDE</div>
        </details>
      </div>
    `;
  }
  renderHotswapAgentMissingArgParam(e) {
    const t = r.jdkInfo?.runningWitHotswap && r.jdkInfo?.runningWithExtendClassDef;
    return l`
      <div class="inner-section">
        <details class="inner" .open="${!t}">
          <summary>
            <span class="icon ${t ? "success" : "warning"}"
              >${t ? d.checkCircle : d.alertTriangle}</span
            >
            <div>Enable HotswapAgent</div>
          </summary>
          <div class="hint">
            <ul>
              ${e.intellij ? l`<li>Launch as mentioned in the previous step</li>` : g}
              ${e.intellij ? l`<li>
                    To manually configure IntelliJ, add the
                    <code>-XX:HotswapAgent=fatjar -XX:+AllowEnhancedClassRedefinition -XX:+UpdateClasses</code> JVM
                    arguments when launching the application
                  </li>` : l`<li>
                    Add the
                    <code>-XX:HotswapAgent=fatjar -XX:+AllowEnhancedClassRedefinition -XX:+UpdateClasses</code> JVM
                    arguments when launching the application
                  </li>`}
            </ul>
          </div>
        </details>
      </div>
    `;
  }
  renderHotswapAgentJdkSection(e) {
    const t = r.jdkInfo?.extendedClassDefCapable, i = this.downloadStatusMessages?.[this.downloadStatusMessages.length - 1] === Ie;
    return l`
      <div class="inner-section">
        <details class="inner" .open="${!t}">
          <summary>
            <span class="icon ${t ? "success" : "warning"}"
              >${t ? d.checkCircle : d.alertTriangle}</span
            >
            <div>Run using JetBrains Runtime JDK</div>
          </summary>
          <div class="hint">
            JetBrains Runtime provides much better hotswapping compared to other JDKs.
            <ul>
              ${e.intellij && Mt("1.3.0", r.idePluginState?.version) ? l` <li>Upgrade to the latest IntelliJ plugin</li>` : g}
              ${e.intellij ? l` <li>Launch the application in IntelliJ using "Debug using Hotswap Agent"</li>` : g}
              ${e.vscode ? l` <li>
                    <a href @click="${(n) => this.downloadJetbrainsRuntime(n)}"
                      >Let Copilot download and set up JetBrains Runtime for VS Code</a
                    >
                    ${this.downloadProgress > 0 ? l`<vaadin-progress-bar
                          .value="${this.downloadProgress}"
                          min="0"
                          max="1"></vaadin-progress-bar>` : g}
                    <ul>
                      ${this.downloadStatusMessages.map((n) => l`<li>${n}</li>`)}
                      ${i ? l`<h3>Go to VS Code and launch the 'Debug using Hotswap Agent' configuration</h3>` : g}
                    </ul>
                  </li>` : g}
              <li>
                ${e.intellij || e.vscode ? l`If there is a problem, you can manually
                      <a target="_blank" href="${Pe}">download JetBrains Runtime JDK</a> and set up
                      your debug configuration to use it.` : l`<a target="_blank" href="${Pe}">Download JetBrains Runtime JDK</a> and set up
                      your debug configuration to use it.`}
              </li>
            </ul>
          </div>
        </details>
      </div>
    `;
  }
  renderInstallHotswapAgentJdkSection(e) {
    const t = r.jdkInfo?.hotswapAgentFound, i = r.jdkInfo?.extendedClassDefCapable;
    return l`
      <div class="inner-section">
        <details class="inner" .open="${!t}">
          <summary>
            <span class="icon ${t ? "success" : "warning"}"
              >${t ? d.checkCircle : d.alertTriangle}</span
            >
            <div>Install HotswapAgent</div>
          </summary>
          <div class="hint">
            Hotswap Agent provides application level support for hot reloading, such as reinitalizing Vaadin @Route or
            @BrowserCallable classes when they are updated
            <ul>
              ${e.intellij ? l`<li>Launch as mentioned in the previous step</li>` : g}
              ${!e.intellij && !i ? l`<li>First install JetBrains Runtime as mentioned in the step above.</li>` : g}
              ${e.intellij ? l`<li>
                    To manually configure IntelliJ, download HotswapAgent and install the jar file as
                    <code>[JAVA_HOME]/lib/hotswap/hotswap-agent.jar</code> in the JetBrains Runtime JDK. Note that the
                    file must be renamed to exactly match this path.
                  </li>` : l`<li>
                    Download HotswapAgent and install the jar file as
                    <code>[JAVA_HOME]/lib/hotswap/hotswap-agent.jar</code> in the JetBrains Runtime JDK. Note that the
                    file must be renamed to exactly match this path.
                  </li>`}
            </ul>
          </div>
        </details>
      </div>
    `;
  }
  renderHotswapAgentVersionSection() {
    if (!r.jdkInfo?.hotswapAgentFound)
      return g;
    const e = r.jdkInfo?.hotswapVersionOk, t = r.jdkInfo?.hotswapVersion, i = r.jdkInfo?.hotswapAgentLocation;
    return l`
      <div class="inner-section">
        <details class="inner" .open="${!e}">
          <summary>
            <span class="icon ${e ? "success" : "warning"}"
              >${e ? d.checkCircle : d.alertTriangle}</span
            >
            <div>Hotswap version requires update</div>
          </summary>
          <div class="hint">
            HotswapAgent version ${t} is in use
            <a target="_blank" href="https://github.com/HotswapProjects/HotswapAgent/releases"
              >Download the latest HotswapAgent</a
            >
            and place it in <code>${i}</code>
          </div>
        </details>
      </div>
    `;
  }
  renderJRebelInstalledContent() {
    return l` <div>JRebel is in use. Enjoy your awesome development workflow!</div> `;
  }
  renderHotswapAgentInstalledContent() {
    return l` <div>Hotswap agent is in use. Enjoy your awesome development workflow!</div> `;
  }
  async downloadJetbrainsRuntime(e) {
    return e.target.disabled = !0, e.preventDefault(), this.downloadStatusMessages = [], me(`${tt}set-up-vs-code-hotswap`, {}, (t) => {
      t.data.error ? (et("Error downloading JetBrains runtime", t.data.error), this.downloadStatusMessages = [...this.downloadStatusMessages, "Download failed"]) : this.downloadStatusMessages = [...this.downloadStatusMessages, Ie];
    });
  }
  downloadStatusUpdate(e) {
    const t = e.detail.progress;
    t ? this.downloadProgress = t : this.downloadStatusMessages = [...this.downloadStatusMessages, e.detail.message];
  }
  addESCListener() {
    document.addEventListener("keydown", this.handleESC);
  }
  removeESCListener() {
    document.removeEventListener("keydown", this.handleESC);
  }
};
x.NAME = "copilot-development-setup-user-guide";
x.styles = _`
    :host {
      --icon-size: 24px;
      --summary-header-gap: 10px;
      --footer-height: calc(50px + var(--space-150));
      color: var(--color);
    }
    :host code {
      background-color: var(--gray-50);
      font-size: var(--font-size-0);
      display: inline-block;
      margin-top: var(--space-100);
      margin-bottom: var(--space-100);
      user-select: all;
    }

    [part='container'] {
      display: flex;
      flex-direction: column;
      gap: var(--space-150);
      padding: var(--space-150);
      box-sizing: border-box;
      height: calc(100% - var(--footer-height));
      overflow: auto;
    }

    [part='footer'] {
      display: flex;
      justify-content: flex-end;
      height: var(--footer-height);
      padding-left: var(--space-150);
      padding-right: var(--space-150);
    }
    [part='hotswap-agent-section-container'] {
      display: flex;
      flex-direction: column;
      gap: var(--space-100);
      position: relative;
    }
    [part='content'] {
      display: flex;
      padding: var(--space-150);
      flex-direction: column;
    }
    div.inner-section div.hint {
      margin-left: calc(var(--summary-header-gap) + var(--icon-size));
      margin-top: var(--space-75);
    }
    details {
      display: flex;
      flex-direction: column;
      box-sizing: border-box;

      & span.icon {
        width: var(--icon-size);
        height: var(--icon-size);
      }
      & span.icon.warning {
        color: var(--lumo-warning-color);
      }
      & span.icon.success {
        color: var(--lumo-success-color);
      }
      & span.hotswap.icon {
        position: absolute;
        top: var(--space-75);
        left: var(--space-75);
      }
      & > summary,
      summary::part(header) {
        display: flex;
        flex-direction: row;
        align-items: center;
        cursor: pointer;
        position: relative;
        gap: var(--summary-header-gap);
        font: var(--font);
      }
      summary::after,
      summary::part(header)::after {
        content: '';
        display: block;
        width: 4px;
        height: 4px;
        border-color: var(--color);
        opacity: var(--panel-toggle-opacity, 0.2);
        border-width: 2px;
        border-style: solid solid none none;
        transform: rotate(var(--panel-toggle-angle, -45deg));
        position: absolute;
        right: 15px;
        top: calc(50% - var(--panel-toggle-offset, 2px));
      }
      &:not([open]) {
        --panel-toggle-angle: 135deg;
        --panel-toggle-offset: 4px;
      }
    }
    details[part='panel'] {
      background: var(--card-bg);
      border: var(--card-border);
      border-radius: 4px;
      user-select: none;

      &:has(summary:hover) {
        border-color: var(--accent-color);
      }

      & > summary,
      summary::part(header) {
        padding: 10px 10px;
        padding-right: 25px;
      }

      summary:hover,
      summary::part(header):hover {
        --panel-toggle-opacity: 0.5;
      }

      input[type='checkbox'],
      summary::part(checkbox) {
        margin: 0;
      }

      &:not([open]):hover {
        background: var(--card-hover-bg);
      }

      &[open] {
        background: var(--card-open-bg);
        box-shadow: var(--card-open-shadow);

        & > summary {
          font-weight: bold;
        }
      }
      .tabs {
        border-bottom: 1px solid var(--border-color);
        box-sizing: border-box;
        display: flex;
        height: 2.25rem;
      }

      .tab {
        background: none;
        border: none;
        border-bottom: 1px solid transparent;
        color: var(--color);
        font: var(--font-button);
        height: 2.25rem;
        padding: 0 0.75rem;
      }

      .tab[aria-selected='true'] {
        color: var(--color-high-contrast);
        border-bottom-color: var(--color-high-contrast);
      }

      .tab-content {
        flex: 1 1 auto;
        gap: var(--space-150);
        overflow: auto;
        padding: var(--space-150);
      }

      h3 {
        margin-top: 0;
      }
    }
  `;
j([
  v()
], x.prototype, "javaPluginSectionOpened", 2);
j([
  v()
], x.prototype, "hotswapSectionOpened", 2);
j([
  v()
], x.prototype, "hotswapTab", 2);
j([
  v()
], x.prototype, "downloadStatusMessages", 2);
j([
  v()
], x.prototype, "downloadProgress", 2);
x = j([
  y(x.NAME)
], x);
const K = Ke({
  header: "Development Workflow",
  tag: Ze,
  width: 800,
  height: 800,
  floatingPosition: {
    top: 50,
    left: 50
  },
  individual: !0
}), _t = {
  init(e) {
    e.addPanel(K);
  }
};
window.Vaadin.copilot.plugins.push(_t);
h.addPanel(K);
var Ot = Object.getOwnPropertyDescriptor, Tt = (e, t, i, n) => {
  for (var o = n > 1 ? void 0 : n ? Ot(t, i) : t, s = e.length - 1, a; s >= 0; s--)
    (a = e[s]) && (o = a(o) || o);
  return o;
};
let Ae = class extends A {
  createRenderRoot() {
    return this;
  }
  connectedCallback() {
    super.connectedCallback(), this.classList.add("custom-menu-item");
  }
  render() {
    const t = _e(), i = t.status === "warning" || t.status === "error";
    return l`
      <div aria-hidden="true" class="prefix ${i ? t.status : ""}">${d.lightning}</div>
      <div class="content">
        <span class="label">Development Workflow</span>
        <span class="status ${i ? t.status : ""}">${t.message}</span>
      </div>
      <div aria-hidden="true" class="suffix">
        ${i ? l`<div class="dot ${t.status}"></div>` : g}
      </div>
    `;
  }
};
Ae = Tt([
  y("copilot-activation-button-development-workflow")
], Ae);
var Ht = Object.getOwnPropertyDescriptor, Ut = (e, t, i, n) => {
  for (var o = n > 1 ? void 0 : n ? Ht(t, i) : t, s = e.length - 1, a; s >= 0; s--)
    (a = e[s]) && (o = a(o) || o);
  return o;
};
let Ce = class extends A {
  constructor() {
    super(), this.clickListener = this.getClickListener(), this.reaction(
      () => r.userInfo,
      () => {
        this.requestUpdate();
      }
    );
  }
  createRenderRoot() {
    return this;
  }
  connectedCallback() {
    super.connectedCallback(), this.classList.add("custom-menu-item"), this.addEventListener("click", this.clickListener);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this.removeEventListener("click", this.clickListener);
  }
  render() {
    const e = this.getStatus();
    return l`
      <div class="prefix">${this.renderPortrait()}</div>
      <div class="content">
        <span class="label"> ${this.getUsername()} </span>
        ${e ? l` <span class="warning"> ${e} </span> ` : g}
      </div>
      <div aria-hidden="true" class="suffix">${this.renderDot()}</div>
    `;
  }
  getClickListener() {
    return r.userInfo?.validLicense ? () => window.open("https://vaadin.com/myaccount", "_blank", "noopener") : () => r.setLoginCheckActive(!0);
  }
  getUsername() {
    return r.userInfo?.firstName ? `${r.userInfo.firstName} ${r.userInfo.lastName}` : "Log in";
  }
  getStatus() {
    if (r.userInfo?.validLicense)
      return r.userInfo?.copilotProjectCannotLeaveLocalhost ? "AI Disabled" : void 0;
    if (S.active) {
      const e = Math.round(S.remainingTimeInMillis / 864e5);
      return `Preview expires in ${e}${e === 1 ? " day" : " days"}`;
    }
    if (S.expired && !r.userInfo?.validLicense)
      return "Preview expired";
    if (!S.active && !S.expired && !r.userInfo?.validLicense)
      return "No valid license available";
  }
  renderPortrait() {
    return r.userInfo?.portraitUrl ? l`<div
        class="portrait"
        style="background-image: url('https://vaadin.com${r.userInfo.portraitUrl}')"></div>` : g;
  }
  renderDot() {
    return r.userInfo?.validLicense ? g : S.active || S.expired ? l`<div class="dot warning"></div>` : g;
  }
};
Ce = Ut([
  y("copilot-activation-button-user-info")
], Ce);
var jt = Object.getOwnPropertyDescriptor, Nt = (e, t, i, n) => {
  for (var o = n > 1 ? void 0 : n ? jt(t, i) : t, s = e.length - 1, a; s >= 0; s--)
    (a = e[s]) && (o = a(o) || o);
  return o;
};
function Bt() {
  h.updatePanel("copilot-feedback-panel", {
    floating: !0
  }), p.setFeedbackDisplayedAtLeastOnce(!0);
}
let $e = class extends A {
  constructor() {
    super(), this.reaction(
      () => p.isFeedbackDisplayedAtLeastOnce(),
      () => {
        this.requestUpdate();
      }
    );
  }
  createRenderRoot() {
    return this;
  }
  connectedCallback() {
    super.connectedCallback(), this.classList.add("custom-menu-item");
  }
  render() {
    return l`
      <div aria-hidden="true" class="prefix">${d.annotation}</div>
      <div class="content" style="display: flex; flex-direction: column;">
        <span class="label">Tell Us What You Think</span>
        <span class="hint">Give feedback or report an issue</span>
      </div>
      <div aria-hidden="true" class="suffix">
        ${p.isFeedbackDisplayedAtLeastOnce() ? g : l`<div class="dot info"></div>`}
      </div>
    `;
  }
};
$e = Nt([
  y("copilot-activation-button-feedback")
], $e);
function f(e) {
  return je("vaadin-menu-bar-item", e);
}
function oe(e) {
  return je("vaadin-context-menu-item", e);
}
function je(e, t) {
  const i = document.createElement(e);
  if (t.style && (i.className = t.style), t.icon)
    if (typeof t.icon == "string") {
      const n = document.createElement("vaadin-icon");
      n.setAttribute("icon", t.icon), i.append(n);
    } else
      i.append(ke(t.icon.strings[0]));
  if (t.label) {
    const n = document.createElement("span");
    n.className = "label", n.innerHTML = t.label, i.append(n);
  } else if (t.component) {
    const n = ot(t.component) ? t.component : document.createElement(t.component);
    i.append(n);
  }
  if (t.description) {
    const n = document.createElement("span");
    n.className = "desc", n.innerHTML = t.description, i.append(n);
  }
  if (t.hint) {
    const n = document.createElement("span");
    n.className = "hint", n.innerHTML = t.hint, i.append(n);
  }
  if (t.suffix)
    if (typeof t.suffix == "string") {
      const n = document.createElement("span");
      n.innerHTML = t.suffix, i.append(n);
    } else
      i.append(ke(t.suffix.strings[0]));
  return i;
}
function ke(e) {
  if (!e) return null;
  const t = document.createElement("template");
  t.innerHTML = e;
  const i = t.content.children;
  return i.length === 1 ? i[0] : i;
}
function Ne(e) {
  return me("copilot-switch-user", { username: e }, (t) => t.data.error ? (O({ type: T.ERROR, message: "Unable to switch user", details: t.data.error.message }), !1) : !0);
}
var Vt = Object.defineProperty, Jt = Object.getOwnPropertyDescriptor, N = (e, t, i, n) => {
  for (var o = n > 1 ? void 0 : n ? Jt(t, i) : t, s = e.length - 1, a; s >= 0; s--)
    (a = e[s]) && (o = (n ? a(t, i, o) : a(o)) || o);
  return n && o && Vt(t, i, o), o;
};
const Ft = 8;
function qt() {
  const e = document.createElement("vaadin-text-field");
  return e.label = "Username to Switch To", e.style.width = "100%", e.autocomplete = "off", e.addEventListener("click", async (t) => {
    t.stopPropagation();
  }), e.addEventListener("keydown", async (t) => {
    if (t.stopPropagation(), t.key === "Enter") {
      const i = e.value;
      await Ne(i) && (p.addRecentSwitchedUsername(i), window.location.reload());
    }
  }), e;
}
let de = class extends A {
  constructor() {
    super(...arguments), this.username = "";
  }
  connectedCallback() {
    super.connectedCallback(), this.style.display = "contents";
  }
  render() {
    return l`<span style="flex: 1;  display: flex; justify-content: space-between;"
      ><span>${this.username}</span
      ><span
        @click=${(e) => {
      p.removeRecentSwitchedUsername(this.username), e.stopPropagation();
      const t = this.parentElement;
      if (t.style.display = "none", p.getRecentSwitchedUsernames().length === 0) {
        const i = t.parentElement?.firstElementChild;
        i && (i.style.display = "none");
      }
    }}
        >${d.trash}</span
      ></span
    >`;
  }
};
N([
  L({ type: String })
], de.prototype, "username", 2);
de = N([
  y("copilot-switch-user")
], de);
function Xt(e) {
  const t = document.createElement("copilot-switch-user");
  return t.username = e, t;
}
let X = class extends A {
  constructor() {
    super(...arguments), this.initialMouseDownPosition = null, this.dragging = !1, this.items = [], this.mouseDownListener = (e) => {
      this.initialMouseDownPosition = { x: e.clientX, y: e.clientY }, I.draggingStarts(this, e), document.addEventListener("mousemove", this.documentDraggingMouseMoveEventListener);
    }, this.documentDraggingMouseMoveEventListener = (e) => {
      if (this.initialMouseDownPosition && !this.dragging) {
        const { clientX: t, clientY: i } = e;
        this.dragging = Math.abs(t - this.initialMouseDownPosition.x) + Math.abs(i - this.initialMouseDownPosition.y) > Ft;
      }
      this.dragging && (this.setOverlayVisibility(!1), I.dragging(this, e));
    }, this.documentMouseUpListener = (e) => {
      if (this.initialMouseDownPosition = null, document.removeEventListener("mousemove", this.documentDraggingMouseMoveEventListener), this.dragging) {
        const t = I.dragging(this, e);
        p.setActivationButtonPosition(t), this.setOverlayVisibility(!0);
      } else
        this.setMenuBarOnClick();
      this.postDragReset(e);
    }, this.postDragReset = q((e) => {
      this.dragging = !1, this.closeMenuMouseMoveListener(e);
    }, 100), this.closeMenuMouseMoveListener = (e) => {
      if (!e.composed || this.dragging)
        return;
      e.composedPath().some((n) => {
        if (n instanceof HTMLElement) {
          const o = n;
          if (o.localName === this.localName || o.localName === "vaadin-menu-bar-overlay" && o.classList.contains("activation-button-menu"))
            return !0;
        }
        return this.checkPointerIsInRangeInSurroundingRectangle(e);
      }) ? this.closeMenuWithDebounce.clear() : this.closeMenuWithDebounce();
    }, this.closeMenuWithDebounce = q(() => {
      this.closeMenu();
    }, 250), this.checkPointerIsInRangeInSurroundingRectangle = (e) => {
      const i = document.querySelector("copilot-main")?.shadowRoot?.querySelectorAll("vaadin-menu-bar-overlay.activation-button-menu"), n = this.menubar;
      return i ? Array.from(i).some((o) => {
        const s = o.querySelector("vaadin-menu-bar-list-box");
        if (!s)
          return !1;
        const a = s.getBoundingClientRect(), c = n.getBoundingClientRect(), m = Math.min(a.x, c.x), b = Math.min(a.y, c.y), P = Math.max(a.width, c.width), V = a.height + c.height;
        return Me(new DOMRect(m, b, P, V), e.clientX, e.clientY);
      }) : !1;
    }, this.dispatchSpotlightActivationEvent = (e) => {
      this.dispatchEvent(
        new CustomEvent("spotlight-activation-changed", {
          detail: e
        })
      );
    }, this.activationBtnClicked = (e) => {
      if (this.dragging) {
        e?.preventDefault();
        return;
      }
      if (r.active && this.handleAttentionRequiredOnClick()) {
        e?.stopPropagation(), e?.preventDefault();
        return;
      }
      e?.stopPropagation(), this.dispatchEvent(new CustomEvent("activation-btn-clicked")), requestAnimationFrame(() => {
        this.closeMenu(), this.openMenu();
      });
    }, this.handleAttentionRequiredOnClick = () => {
      const e = h.getAttentionRequiredPanelConfiguration();
      return e ? e.panel && !e.floating ? (u.emit("open-attention-required-drawer", null), !0) : (h.clearAttention(), !0) : !1;
    }, this.closeMenu = () => {
      this.menubar._close();
    }, this.openMenu = () => {
      this.menubar._buttons[0].dispatchEvent(new CustomEvent("mouseover", { bubbles: !0 }));
    }, this.setMenuBarOnClick = () => {
      const e = this.shadowRoot.querySelector("vaadin-menu-bar-button");
      e && (e.onclick = this.activationBtnClicked);
    };
  }
  static get styles() {
    return [
      C(ee),
      _`
        :host {
          --space: 8px;
          --height: 28px;
          --width: 28px;
          position: absolute;
          top: clamp(var(--space), var(--top), calc(100vh - var(--height) - var(--space)));
          left: clamp(var(--space), var(--left), calc(100vw - var(--width) - var(--space)));
          bottom: clamp(var(--space), var(--bottom), calc(100vh - var(--height) - var(--space)));
          right: clamp(var(--space), var(--right), calc(100vw - var(--width) - var(--space)));
          user-select: none;
          -ms-user-select: none;
          -moz-user-select: none;
          -webkit-user-select: none;
          --indicator-color: var(--red);
          /* Don't add a z-index or anything else that creates a stacking context */
        }

        :host .menu-button {
          min-width: unset;
        }

        :host([document-hidden]) {
          -webkit-filter: grayscale(100%); /* Chrome, Safari, Opera */
          filter: grayscale(100%);
        }

        .menu-button::part(container) {
          overflow: visible;
        }

        .menu-button vaadin-menu-bar-button {
          all: initial;
          display: block;
          position: relative;
          z-index: var(--z-index-activation-button);
          width: var(--width);
          height: var(--height);
          overflow: hidden;
          color: transparent;
          background: hsl(0 0% 0% / 0.25);
          border-radius: 8px;
          box-shadow: 0 0 0 1px hsl(0 0% 100% / 0.1);
          cursor: default;
          -webkit-backdrop-filter: blur(8px);
          backdrop-filter: blur(8px);
          transition:
            box-shadow 0.2s,
            background-color 0.2s;
        }

        /* visual effect when active */

        .menu-button vaadin-menu-bar-button::before {
          all: initial;
          content: '';
          background-image:
            radial-gradient(circle at 50% -10%, hsl(221 100% 55% / 0.6) 0%, transparent 60%),
            radial-gradient(circle at 25% 40%, hsl(303 71% 64%) 0%, transparent 70%),
            radial-gradient(circle at 80% 10%, hsla(262, 38%, 9%, 0.5) 0%, transparent 80%),
            radial-gradient(circle at 110% 50%, hsla(147, 100%, 77%, 1) 20%, transparent 100%);
          animation: 5s swirl linear infinite;
          animation-play-state: paused;
          inset: -6px;
          opacity: 0;
          position: absolute;
          transition: opacity 0.5s;
        }

        /* vaadin symbol */

        .menu-button vaadin-menu-bar-button::after {
          all: initial;
          content: '';
          position: absolute;
          inset: 1px;
          background: url('data:image/svg+xml;utf8,<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.7407 9.70401C12.7407 9.74417 12.7378 9.77811 12.7335 9.81479C12.7111 10.207 12.3897 10.5195 11.9955 10.5195C11.6014 10.5195 11.2801 10.209 11.2577 9.8169C11.2534 9.7801 11.2504 9.74417 11.2504 9.70401C11.2504 9.31225 11.1572 8.90867 10.2102 8.90867H7.04307C5.61481 8.90867 5 8.22698 5 6.86345V5.70358C5 5.31505 5.29521 5 5.68008 5C6.06495 5 6.35683 5.31505 6.35683 5.70358V6.09547C6.35683 6.53423 6.655 6.85413 7.307 6.85413H10.4119C11.8248 6.85413 11.9334 7.91255 11.98 8.4729H12.0111C12.0577 7.91255 12.1663 6.85413 13.5791 6.85413H16.6841C17.3361 6.85413 17.614 6.54529 17.614 6.10641L17.6158 5.70358C17.6158 5.31505 17.9246 5 18.3095 5C18.6943 5 19 5.31505 19 5.70358V6.86345C19 8.22698 18.3763 8.90867 16.9481 8.90867H13.7809C12.8338 8.90867 12.7407 9.31225 12.7407 9.70401Z" fill="white"/><path d="M12.7536 17.7785C12.6267 18.0629 12.3469 18.2608 12.0211 18.2608C11.6907 18.2608 11.4072 18.0575 11.2831 17.7668C11.2817 17.7643 11.2803 17.7619 11.279 17.7595C11.2761 17.7544 11.2732 17.7495 11.2704 17.744L8.45986 12.4362C8.3821 12.2973 8.34106 12.1399 8.34106 11.9807C8.34106 11.4732 8.74546 11.0603 9.24238 11.0603C9.64162 11.0603 9.91294 11.2597 10.0985 11.6922L12.0216 15.3527L13.9468 11.6878C14.1301 11.2597 14.4014 11.0603 14.8008 11.0603C15.2978 11.0603 15.7021 11.4732 15.7021 11.9807C15.7021 12.1399 15.6611 12.2973 15.5826 12.4374L12.7724 17.7446C12.7683 17.7524 12.7642 17.7597 12.7601 17.767C12.7579 17.7708 12.7557 17.7746 12.7536 17.7785Z" fill="white"/></svg>');
          background-size: 100%;
        }

        .menu-button vaadin-menu-bar-button[focus-ring] {
          outline: 2px solid var(--selection-color);
          outline-offset: 2px;
        }

        .menu-button vaadin-menu-bar-button:hover {
          background: hsl(0 0% 0% / 0.8);
          box-shadow:
            0 0 0 1px hsl(0 0% 100% / 0.1),
            0 2px 8px -1px hsl(0 0% 0% / 0.3);
        }

        :host([active]) .menu-button vaadin-menu-bar-button {
          background-color: transparent;
          box-shadow:
            inset 0 0 0 1px hsl(0 0% 0% / 0.2),
            0 2px 8px -1px hsl(0 0% 0% / 0.3);
        }

        :host([active]) .menu-button vaadin-menu-bar-button::before {
          opacity: 1;
          animation-play-state: running;
        }

        :host([attention-required]) {
          animation: bounce 0.5s;
          animation-iteration-count: 2;
        }

        [part='indicator'] {
          top: -6px;
          right: -6px;
          width: 12px;
          height: 12px;
          box-sizing: border-box;
          border-radius: 100%;
          position: absolute;
          display: var(--indicator-display, none);
          background: var(--indicator-color);
          z-index: calc(var(--z-index-activation-button) + 1);
          border: 2px solid var(--indicator-border);
        }

        :host([indicator='info']) {
          --indicator-display: block;
          --indicator-color: var(--info-color);
        }

        :host([indicator='warning']) {
          --indicator-display: block;
          --indicator-color: var(--warning-color);
        }

        :host([indicator='error']) {
          --indicator-display: block;
          --indicator-color: var(--error-color);
        }
      `
    ];
  }
  connectedCallback() {
    super.connectedCallback(), this.reaction(
      () => h.attentionRequiredPanelTag,
      () => {
        this.toggleAttribute($, h.attentionRequiredPanelTag !== null), this.updateIndicator();
      }
    ), this.reaction(
      () => r.active,
      () => {
        this.toggleAttribute("active", r.active);
      },
      { fireImmediately: !0 }
    ), this.addEventListener("mousedown", this.mouseDownListener), document.addEventListener("mouseup", this.documentMouseUpListener);
    const e = p.getActivationButtonPosition();
    e ? (this.style.setProperty("--left", `${e.left}px`), this.style.setProperty("--bottom", `${e.bottom}px`), this.style.setProperty("--right", `${e.right}px`), this.style.setProperty("--top", `${e.top}px`)) : (this.style.setProperty("--bottom", "var(--space)"), this.style.setProperty("--right", "var(--space)")), u.on("document-activation-change", (t) => {
      this.toggleAttribute("document-hidden", !t.detail.active);
    }), this.reaction(
      () => [
        r.jdkInfo,
        r.idePluginState,
        p.isFeedbackDisplayedAtLeastOnce()
      ],
      () => {
        this.updateIndicator();
      }
    ), this.reaction(
      () => [
        r.active,
        r.idePluginState,
        p.isActivationAnimation(),
        p.isActivationShortcut(),
        p.isSendErrorReportsAllowed(),
        p.isAIUsageAllowed(),
        p.getDismissedNotifications()
      ],
      () => {
        this.generateItems();
      }
    ), document.addEventListener("mousemove", this.closeMenuMouseMoveListener);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this.removeEventListener("mousedown", this.mouseDownListener), document.removeEventListener("mouseup", this.documentMouseUpListener), document.removeEventListener("mousemove", this.closeMenuMouseMoveListener);
  }
  updateIndicator() {
    if (this.hasAttribute($)) {
      this.setAttribute("indicator", "error");
      return;
    }
    const e = _e();
    if (e.status !== "success") {
      this.setAttribute("indicator", e.status);
      return;
    }
    if (!p.isFeedbackDisplayedAtLeastOnce()) {
      this.setAttribute("indicator", "info");
      return;
    }
    this.removeAttribute("indicator");
  }
  /**
   * To hide overlay while dragging
   * @param visible
   */
  setOverlayVisibility(e) {
    const t = this.shadowRoot.querySelector("vaadin-menu-bar-button").__overlay;
    e ? (t?.style.setProperty("display", "flex"), t?.style.setProperty("visibility", "visible")) : (t?.style.setProperty("display", "none"), t?.style.setProperty("visibility", "invisible"));
  }
  generateItems() {
    const e = r.active, t = e && !!r.idePluginState?.supportedActions?.find((o) => o === "undo"), i = [];
    if (E.springSecurityEnabled) {
      const o = p.getRecentSwitchedUsernames();
      i.push(
        ...o.map((s) => ({
          component: f({ component: Xt(s) }),
          action: async () => {
            await Ne(s) && window.location.reload();
          }
        }))
      ), i.length > 0 && i.unshift({
        component: f({ label: "Recently Used Usernames" }),
        disabled: !0
      });
    }
    const n = [
      {
        text: "Vaadin Copilot",
        children: [
          { visible: e, component: f({ component: "copilot-activation-button-user-info" }) },
          { visible: e, component: "hr" },
          {
            component: f({ component: "copilot-activation-button-development-workflow" }),
            action: st
          },
          { visible: e, component: "hr" },
          {
            visible: E.springSecurityEnabled,
            component: f({
              icon: d.user,
              label: "Application's User"
            }),
            children: [
              ...i,
              {
                component: f({ component: qt() })
              }
            ]
          },
          {
            component: "hr",
            visible: e
          },
          {
            visible: t,
            component: f({
              icon: d.flipBack,
              label: "Undo",
              hint: W.undo
            }),
            action: () => {
              u.emit("undoRedo", { undo: !0 });
            }
          },
          {
            visible: t,
            component: f({
              icon: d.flipForward,
              label: "Redo",
              hint: W.redo
            }),
            action: () => {
              u.emit("undoRedo", { undo: !1 });
            }
          },
          {
            component: f({
              icon: d.starsAlt,
              label: "Toggle Command Window",
              hint: W.toggleCommandWindow,
              style: "toggle-spotlight"
            }),
            action: () => {
              r.setSpotlightActive(!r.spotlightActive);
            }
          },
          {
            component: "hr",
            visible: e
          },
          {
            visible: e,
            component: f({
              icon: d.settings,
              label: "Settings"
            }),
            children: [
              {
                component: f({
                  icon: d.keyboard,
                  label: "Activation Shortcut",
                  suffix: p.isActivationShortcut() ? '<div aria-hidden="true" class="switch on"></div>' : '<div aria-hidden="true" class="switch off"></div>'
                }),
                keepOpen: !0,
                action: (o) => {
                  p.setActivationShortcut(!p.isActivationShortcut()), se(o, p.isActivationShortcut());
                }
              },
              {
                component: f({
                  icon: d.play,
                  label: "Activation Animation",
                  suffix: p.isActivationAnimation() ? '<div aria-hidden="true" class="switch on"></div>' : '<div aria-hidden="true" class="switch off"></div>'
                }),
                keepOpen: !0,
                action: (o) => {
                  p.setActivationAnimation(!p.isActivationAnimation()), se(o, p.isActivationAnimation());
                }
              },
              {
                component: f({
                  icon: d.starsAlt,
                  label: "AI Usage",
                  hint: Be()
                }),
                keepOpen: !0,
                action: (o) => {
                  let s;
                  const a = p.isAIUsageAllowed();
                  a === "ask" ? s = "yes" : a === "no" ? s = "ask" : s = "no", p.setAIUsageAllowed(s), Yt(o);
                }
              },
              {
                visible: r.userInfo?.vaadiner,
                component: f({
                  icon: d.starsAlt,
                  label: "AI Provider (Experimental, Vaadin employees only)",
                  hint: Ve()
                }),
                keepOpen: !0,
                action: (o) => {
                  const s = p.getAIProvider() === "ANY" ? "EU_ONLY" : "ANY";
                  p.setAIProvider(s), Wt(o);
                }
              },
              {
                component: f({
                  icon: d.alertCircle,
                  label: "Report Errors to Vaadin",
                  suffix: p.isSendErrorReportsAllowed() ? '<div aria-hidden="true" class="switch on"></div>' : '<div aria-hidden="true" class="switch off"></div>'
                }),
                keepOpen: !0,
                action: (o) => {
                  p.setSendErrorReportsAllowed(!p.isSendErrorReportsAllowed()), se(o, p.isSendErrorReportsAllowed());
                }
              },
              { component: "hr" },
              {
                visible: e,
                component: f({
                  icon: d.annotation,
                  label: "Show Welcome Message"
                }),
                keepOpen: !0,
                action: () => {
                  r.setWelcomeActive(!0), r.setSpotlightActive(!0);
                }
              },
              {
                visible: e,
                component: f({
                  icon: d.keyboard,
                  label: "Show Keyboard Shortcuts"
                }),
                action: () => {
                  h.updatePanel("copilot-shortcuts-panel", {
                    floating: !0
                  });
                }
              },
              {
                visible: p.getDismissedNotifications().length > 0,
                component: f({
                  icon: d.annotationX,
                  label: "Clear Dismissed Notifications"
                }),
                action: () => {
                  p.clearDismissedNotifications();
                }
              }
            ]
          },
          { component: "hr" },
          {
            component: f({
              component: "copilot-activation-button-feedback"
            }),
            action: Bt
          },
          {
            component: f({
              icon: d.vaadinLogo,
              label: "Copilot",
              hint: p.isActivationShortcut() ? W.toggleCopilot : void 0,
              suffix: r.active ? '<div aria-hidden="true" class="switch on"></div>' : '<div aria-hidden="true" class="switch off"></div>'
            }),
            action: () => {
              this.activationBtnClicked();
            }
          }
        ]
      }
    ];
    this.items = n.filter(at);
  }
  render() {
    return l`
      <vaadin-menu-bar
        class="menu-button"
        .items="${this.items}"
        @item-selected="${(e) => {
      this.handleMenuItemClick(e.detail.value);
    }}"
        ?open-on-hover=${!this.dragging}
        overlay-class="activation-button-menu">
      </vaadin-menu-bar>
      <div part="indicator"></div>
    `;
  }
  handleMenuItemClick(e) {
    e.action && e.action(e);
  }
  firstUpdated() {
    te(this.shadowRoot);
  }
};
N([
  H("vaadin-menu-bar")
], X.prototype, "menubar", 2);
N([
  v()
], X.prototype, "dragging", 2);
N([
  v()
], X.prototype, "items", 2);
X = N([
  y("copilot-activation-button")
], X);
function se(e, t) {
  const i = e.component;
  if (!i || typeof i == "string") {
    console.error("Unable to set switch value for a non-component item");
    return;
  }
  const n = i.querySelector(".switch");
  if (!n) {
    console.error("No element found when setting switch value");
    return;
  }
  t ? (n.classList.remove("off"), n.classList.add("on")) : (n.classList.add("off"), n.classList.remove("on"));
}
function Yt(e) {
  const t = e.component;
  if (!t || typeof t == "string") {
    console.error("Unable to set switch value for a non-component item");
    return;
  }
  const i = t.querySelector(".hint");
  if (!i) {
    console.error("No element found when setting switch value");
    return;
  }
  i.innerText = Be();
}
function Wt(e) {
  const t = e.component;
  if (!t || typeof t == "string") {
    console.error("Unable to set switch value for a non-component item");
    return;
  }
  const i = t.querySelector(".hint");
  if (!i) {
    console.error("No element found when setting switch value");
    return;
  }
  i.innerText = Ve();
}
function Be() {
  return p.isAIUsageAllowed() === "ask" ? "Always Ask" : p.isAIUsageAllowed() === "no" ? "Disabled" : "Enabled";
}
function Ve() {
  return p.getAIProvider() === "ANY" ? "Any" : p.getAIProvider() === "EU_ONLY" ? "Inside EU" : "???";
}
var Gt = Object.defineProperty, Kt = Object.getOwnPropertyDescriptor, B = (e, t, i, n) => {
  for (var o = n > 1 ? void 0 : n ? Kt(t, i) : t, s = e.length - 1, a; s >= 0; s--)
    (a = e[s]) && (o = (n ? a(t, i, o) : a(o)) || o);
  return n && o && Gt(t, i, o), o;
};
const w = "resize-dir", ae = "floating-resizing-active";
let D = class extends A {
  constructor() {
    super(...arguments), this.panelTag = "", this.dockingItems = [
      {
        component: oe({
          icon: d.layoutRight,
          label: "Dock right"
        }),
        panel: "right"
      },
      {
        component: oe({
          icon: d.layoutLeft,
          label: "Dock left"
        }),
        panel: "left"
      },
      {
        component: oe({
          icon: d.layoutBottom,
          label: "Dock bottom"
        }),
        panel: "bottom"
      }
    ], this.floatingResizingStarted = !1, this.resizingInDrawerStarted = !1, this.toggling = !1, this.rectangleBeforeResizing = null, this.floatingResizeHandlerMouseMoveListener = (e) => {
      if (!this.panelInfo?.floating || this.floatingResizingStarted || !this.panelInfo?.expanded)
        return;
      const t = this.getBoundingClientRect(), i = Math.abs(e.clientX - t.x), n = Math.abs(t.x + t.width - e.clientX), o = Math.abs(e.clientY - t.y), s = Math.abs(t.y + t.height - e.clientY), a = Number.parseInt(
        window.getComputedStyle(this).getPropertyValue("--floating-offset-resize-threshold"),
        10
      );
      let c = "";
      i < a ? o < a ? (c = "nw-resize", this.setAttribute(w, "top left")) : s < a ? (c = "sw-resize", this.setAttribute(w, "bottom left")) : (c = "col-resize", this.setAttribute(w, "left")) : n < a ? o < a ? (c = "ne-resize", this.setAttribute(w, "top right")) : s < a ? (c = "se-resize", this.setAttribute(w, "bottom right")) : (c = "col-resize", this.setAttribute(w, "right")) : s < a ? (c = "row-resize", this.setAttribute(w, "bottom")) : o < a && (c = "row-resize", this.setAttribute(w, "top")), c !== "" ? (this.rectangleBeforeResizing = this.getBoundingClientRect(), this.style.setProperty("--resize-cursor", c)) : (this.style.removeProperty("--resize-cursor"), this.removeAttribute(w)), this.toggleAttribute(ae, c !== "");
    }, this.floatingResizingMouseDownListener = (e) => {
      if (!this.hasAttribute(ae) || e.button !== 0)
        return;
      e.stopPropagation(), e.preventDefault(), I.anchorLeftTop(this), this.floatingResizingStarted = !0, this.toggleAttribute("resizing", !0);
      const t = this.getResizeDirections(), { clientX: i, clientY: n } = e;
      (t.includes("top") || t.includes("bottom")) && this.style.setProperty("--section-height", null), t.forEach((o) => this.setResizePosition(o, i, n)), r.setSectionPanelResizing(!0);
    }, this.floatingResizingMouseLeaveListener = () => {
      this.panelInfo?.floating && (this.floatingResizingStarted || (this.removeAttribute("resizing"), this.removeAttribute(ae), this.removeAttribute("dragging"), this.style.removeProperty("--resize-cursor"), this.removeAttribute(w), this.panelInfo != null && this.panelInfo.height != null && this.panelInfo?.height > window.innerHeight && (h.updatePanel(this.panelInfo.tag, {
        height: window.innerHeight - 10
      }), this.setCssSizePositionProperties())));
    }, this.floatingResizingMouseMoveListener = (e) => {
      if (!this.panelInfo?.floating || !this.floatingResizingStarted)
        return;
      e.stopPropagation(), e.preventDefault();
      const t = this.getResizeDirections(), { clientX: i, clientY: n } = e;
      t.forEach((o) => this.setResizePosition(o, i, n));
    }, this.setFloatingResizeDirectionProps = (e, t, i, n) => {
      i && i > Number.parseFloat(window.getComputedStyle(this).getPropertyValue("--min-width")) && (this.style.setProperty(`--${e}`, `${t}px`), this.style.setProperty("width", `${i}px`));
      const o = window.getComputedStyle(this), s = Number.parseFloat(o.getPropertyValue("--header-height")), a = Number.parseFloat(o.getPropertyValue("--floating-offset-resize-threshold")) / 2;
      n && n > s + a && (this.style.setProperty(`--${e}`, `${t}px`), this.style.setProperty("height", `${n}px`), this.container.style.setProperty("margin-top", "calc(var(--floating-offset-resize-threshold) / 4)"), this.container.style.height = `calc(${n}px - var(--floating-offset-resize-threshold) / 2)`);
    }, this.floatingResizingMouseUpListener = (e) => {
      if (!this.floatingResizingStarted || !this.panelInfo?.floating)
        return;
      e.stopPropagation(), e.preventDefault(), this.floatingResizingStarted = !1, r.setSectionPanelResizing(!1);
      const { width: t, height: i } = this.getBoundingClientRect(), { left: n, top: o, bottom: s, right: a } = I.anchor(this), c = window.getComputedStyle(this.container), m = Number.parseInt(c.borderTopWidth, 10), b = Number.parseInt(c.borderBottomWidth, 10);
      h.updatePanel(this.panelInfo.tag, {
        width: t,
        height: i - (m + b),
        floatingPosition: {
          ...this.panelInfo.floatingPosition,
          left: n,
          top: o,
          bottom: s,
          right: a
        }
      }), this.style.removeProperty("width"), this.style.removeProperty("height"), this.container.style.removeProperty("height"), this.container.style.removeProperty("margin-top"), this.setCssSizePositionProperties(), this.toggleAttribute("dragging", !1);
    }, this.transitionEndEventListener = () => {
      this.toggling && (this.toggling = !1, I.anchor(this));
    }, this.sectionPanelMouseEnterListener = () => {
      this.hasAttribute($) && (this.removeAttribute($), h.clearAttention());
    }, this.contentAreaMouseDownListener = () => {
      h.bringToFront(this.panelInfo.tag);
    }, this.documentMouseUpEventListener = () => {
      document.removeEventListener("mousemove", this.draggingEventListener), this.panelInfo?.floating && (this.toggleAttribute("dragging", !1), r.setSectionPanelDragging(!1));
    }, this.panelHeaderMouseDownEventListener = (e) => {
      e.button === 0 && (h.bringToFront(this.panelInfo.tag), !this.hasAttribute(w) && (e.target instanceof HTMLButtonElement && e.target.getAttribute("part") === "title-button" ? this.startDraggingDebounce(e) : this.startDragging(e)));
    }, this.panelHeaderMouseUpEventListener = (e) => {
      e.button === 0 && this.startDraggingDebounce.clear();
    }, this.startDragging = (e) => {
      I.draggingStarts(this, e), document.addEventListener("mousemove", this.draggingEventListener), r.setSectionPanelDragging(!0), this.panelInfo?.floating ? this.toggleAttribute("dragging", !0) : this.parentElement.sectionPanelDraggingStarted(this, e), e.preventDefault(), e.stopPropagation();
    }, this.startDraggingDebounce = q(this.startDragging, 200), this.draggingEventListener = (e) => {
      const t = I.dragging(this, e);
      if (this.panelInfo?.floating && this.panelInfo?.floatingPosition) {
        e.preventDefault();
        const { left: i, top: n, bottom: o, right: s } = t;
        h.updatePanel(this.panelInfo.tag, {
          floatingPosition: {
            ...this.panelInfo.floatingPosition,
            left: i,
            top: n,
            bottom: o,
            right: s
          }
        });
      }
    }, this.setCssSizePositionProperties = () => {
      const e = h.getPanelByTag(this.panelTag);
      if (e && (e.height !== void 0 && (this.panelInfo?.floating || e.panel === "left" || e.panel === "right" ? this.style.setProperty("--section-height", `${e.height}px`) : this.style.removeProperty("--section-height")), e.width !== void 0 && (e.floating || e.panel === "bottom" ? this.style.setProperty("--section-width", `${e.width}px`) : this.style.removeProperty("--section-width")), e.floating && e.floatingPosition && !this.toggling)) {
        const { left: t, top: i, bottom: n, right: o } = e.floatingPosition;
        this.style.setProperty("--left", t !== void 0 ? `${t}px` : "auto"), this.style.setProperty("--top", i !== void 0 ? `${i}px` : "auto"), this.style.setProperty("--bottom", n !== void 0 ? `${n}px` : ""), this.style.setProperty("--right", o !== void 0 ? `${o}px` : "");
        const s = window.getComputedStyle(this);
        parseInt(s.top, 10) < 0 && this.style.setProperty("--top", "0px"), parseInt(s.bottom, 10) < 0 && this.style.setProperty("--bottom", "0px");
      }
    }, this.renderPopupButton = () => {
      if (!this.panelInfo)
        return g;
      let e;
      return this.panelInfo.panel === void 0 ? e = "Close the popup" : e = this.panelInfo.floating ? `Dock ${this.panelInfo.header} to ${this.panelInfo.panel}` : `Open ${this.panelInfo.header} as a popup`, l`
      <vaadin-context-menu .items=${this.dockingItems} @item-selected="${this.changeDockingPanel}">
        <button
          @click="${(t) => this.changePanelFloating(t)}"
          @mousedown="${(t) => t.stopPropagation()}"
          aria-label=${e}
          class="icon"
          part="popup-button"
          title="${e}">
          ${this.getPopupButtonIcon()}
        </button>
      </vaadin-context-menu>
    `;
    }, this.changePanelFloating = (e) => {
      if (this.panelInfo)
        if (e.stopPropagation(), ye(this), this.panelInfo?.floating)
          h.updatePanel(this.panelInfo.tag, { floating: !1 });
        else {
          let t;
          if (this.panelInfo.floatingPosition)
            t = this.panelInfo.floatingPosition;
          else {
            const { left: o, top: s } = this.getBoundingClientRect();
            t = {
              left: o,
              top: s
            };
          }
          let i = this.panelInfo?.height;
          i === void 0 && this.panelInfo.expanded && (i = Number.parseInt(window.getComputedStyle(this).height, 10)), this.parentElement.forceClose(), h.updatePanel(this.panelInfo.tag, {
            floating: !0,
            expanded: !0,
            width: this.panelInfo?.width || Number.parseInt(window.getComputedStyle(this).width, 10),
            height: i,
            floatingPosition: t
          }), h.bringToFront(this.panelInfo.tag);
        }
    }, this.toggleExpand = (e) => {
      this.panelInfo && (e.stopPropagation(), I.anchorLeftTop(this), h.updatePanel(this.panelInfo.tag, {
        expanded: !this.panelInfo.expanded
      }), this.toggling = !0, this.toggleAttribute("expanded", this.panelInfo.expanded), u.emit("panel-expanded", { panelTag: this.panelInfo.tag, expanded: this.panelInfo.expanded }));
    };
  }
  static get styles() {
    return [
      C(ee),
      C(Oe),
      _`
        * {
          box-sizing: border-box;
        }

        :host {
          flex: none;
          --min-width: 160px;
          --header-height: 36px;
          --content-width: var(--content-width, 100%);
          --floating-border-width: 1px;
          --floating-offset-resize-threshold: 8px;
          cursor: var(--cursor, var(--resize-cursor, default));
          overflow: hidden;
        }

        :host(:not([expanded])) {
          grid-template-rows: auto 0fr;
        }

        [part='header'] {
          align-items: center;
          color: var(--color-high-contrast);
          display: flex;
          flex: none;
          font: var(--font-small-medium);
          gap: var(--space-50);
          justify-content: space-between;
          min-width: 100%;
          padding: var(--space-50);
          user-select: none;
          -webkit-user-select: none;
          width: var(--min-width);
        }

        :host([floating]) {
          --content-height: calc(var(--section-height));
        }

        :host([floating]:not([expanded])) [part='header'] {
          --min-width: unset;
        }

        :host([floating]) [part='header'] {
          transition: border-color var(--duration-2);
        }

        :host([floating]:not([expanded])) [part='header'] {
          border-color: transparent;
        }

        [part='title'] {
          flex: auto;
          margin: 0;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        [part='title']:first-child {
          margin-inline-start: var(--space-100);
        }

        [part='content'] {
          height: calc(var(--content-height) - var(--header-height));
          overflow: auto;
          transition:
            height var(--duration-2),
            width var(--duration-2),
            opacity var(--duration-2),
            visibility calc(var(--duration-2) * 2);
        }

        :host([floating]) [part='drawer-resize'] {
          display: none;
        }

        :host(:not([expanded])) [part='drawer-resize'] {
          display: none;
        }

        :host(:not([floating]):not(:last-child)) {
          border-bottom: 1px solid var(--divider-primary-color);
        }

        :host(:not([expanded])) [part='content'] {
          opacity: 0;
          visibility: hidden;
        }

        :host([floating]:not([expanded])) [part='content'] {
          width: 0;
          height: 0;
        }

        :host(:not([expanded])) [part='content'][style*='width'] {
          width: 0 !important;
        }

        :host([floating]) {
          position: fixed;
          min-width: 0;
          min-height: 0;
          z-index: calc(var(--z-index-floating-panel) + var(--z-index-focus, 0));
          top: clamp(0px, var(--top), calc(100vh - var(--section-height, var(--header-height)) * 0.5));
          left: clamp(calc(var(--section-width) * -0.5), var(--left), calc(100vw - var(--section-width) * 0.5));
          bottom: clamp(
            calc(var(--section-height, var(--header-height)) * -0.5),
            var(--bottom),
            calc(100vh - var(--section-height, var(--header-height)) * 0.5)
          );
          right: clamp(calc(var(--section-width) * -0.5), var(--right), calc(100vw - var(--section-width) * 0.5));
          width: var(--section-width);
          overflow: visible;
        }
        :host([floating]) [part='container'] {
          background: var(--background-color);
          border: var(--floating-border-width) solid var(--surface-border-color);
          -webkit-backdrop-filter: var(--surface-backdrop-filter);
          backdrop-filter: var(--surface-backdrop-filter);
          border-radius: var(--radius-2);
          margin: auto;
          box-shadow: var(--surface-box-shadow-2);
        }
        [part='container'] {
          overflow: hidden;
        }
        :host([floating][expanded]) [part='container'] {
          height: calc(100% - var(--floating-offset-resize-threshold) / 2);
          width: calc(100% - var(--floating-offset-resize-threshold) / 2);
        }

        :host([floating]:not([expanded])) {
          width: unset;
        }

        :host([floating]) .drag-handle {
          cursor: var(--resize-cursor, move);
        }

        :host([floating][expanded]) [part='content'] {
          min-width: var(--min-width);
          min-height: 0;
          width: var(--content-width);
        }

        /* :hover for Firefox, :active for others */

        :host([floating][expanded]) [part='content']:is(:hover, :active) {
          transition: none;
        }

        [part='title-button'] {
          font: var(--font-xxsmall-bold);
          padding: 0;
          text-align: start;
          text-transform: uppercase;
        }

        @media not (prefers-reduced-motion) {
          [part='toggle-button'] svg {
            transition: transform 0.15s cubic-bezier(0.2, 0, 0, 1);
          }
        }

        [part='toggle-button'][aria-expanded='true'] svg {
          transform: rotate(90deg);
        }

        .actions {
          display: none;
        }

        :host([expanded]) .actions {
          display: contents;
        }

        ::slotted(*) {
          box-sizing: border-box;
          display: block;
          /* padding: var(--space-150); */
          width: 100%;
        }

        /*workaround for outline to have a explicit height while floating by default. 
          may be removed after https://github.com/vaadin/web-components/issues/7620 is solved
        */
        :host([floating][expanded][paneltag='copilot-outline-panel']) {
          --grid-default-height: 400px;
        }

        :host([dragging]) {
          opacity: 0.4;
        }

        :host([dragging]) [part='content'] {
          pointer-events: none;
        }

        :host([hiding-while-drag-and-drop]) {
          display: none;
        }

        // dragging in drawer

        :host(:not([floating])) .drag-handle {
          cursor: grab;
        }

        :host(:not([floating])[dragging]) .drag-handle {
          cursor: grabbing;
        }
      `
    ];
  }
  connectedCallback() {
    super.connectedCallback(), this.setAttribute("role", "region"), this.reaction(
      () => h.getAttentionRequiredPanelConfiguration(),
      () => {
        const e = h.getAttentionRequiredPanelConfiguration();
        this.toggleAttribute($, e?.tag === this.panelTag && e?.floating);
      }
    ), this.addEventListener("mouseenter", this.sectionPanelMouseEnterListener), this.reaction(
      () => r.operationInProgress,
      () => {
        requestAnimationFrame(() => {
          this.toggleAttribute(
            "hiding-while-drag-and-drop",
            r.operationInProgress === ge.DragAndDrop && this.panelInfo?.floating && !this.panelInfo.showWhileDragging
          );
        });
      }
    ), this.reaction(
      () => h.floatingPanelsZIndexOrder,
      () => {
        this.style.setProperty("--z-index-focus", `${h.getFloatingPanelZIndex(this.panelTag)}`);
      },
      { fireImmediately: !0 }
    ), this.reaction(
      () => h.getPanelByTag(this.panelTag)?.floatingPosition,
      () => {
        !this.floatingResizingStarted && !r.sectionPanelDragging && this.setCssSizePositionProperties();
      }
    ), this.addEventListener("transitionend", this.transitionEndEventListener), this.addEventListener("mousemove", this.floatingResizeHandlerMouseMoveListener), this.addEventListener("mousedown", this.floatingResizingMouseDownListener), this.addEventListener("mouseleave", this.floatingResizingMouseLeaveListener), document.addEventListener("mousemove", this.floatingResizingMouseMoveListener), document.addEventListener("mouseup", this.floatingResizingMouseUpListener);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this.removeEventListener("mouseenter", this.sectionPanelMouseEnterListener), this.removeEventListener("mousemove", this.floatingResizeHandlerMouseMoveListener), this.removeEventListener("mousedown", this.floatingResizingMouseDownListener), document.removeEventListener("mousemove", this.floatingResizingMouseMoveListener), document.removeEventListener("mouseup", this.floatingResizingMouseUpListener);
  }
  setResizePosition(e, t, i) {
    const n = this.rectangleBeforeResizing, o = 0, s = window.innerWidth, a = 0, c = window.innerHeight, m = Math.max(o, Math.min(s, t)), b = Math.max(a, Math.min(c, i));
    if (e === "left")
      this.setFloatingResizeDirectionProps(
        "left",
        m,
        n.left - m + n.width
      );
    else if (e === "right")
      this.setFloatingResizeDirectionProps(
        "right",
        m,
        m - n.right + n.width
      );
    else if (e === "top") {
      const P = n.top - b + n.height;
      this.setFloatingResizeDirectionProps("top", b, void 0, P);
    } else if (e === "bottom") {
      const P = b - n.bottom + n.height;
      this.setFloatingResizeDirectionProps("bottom", b, void 0, P);
    }
  }
  willUpdate(e) {
    super.willUpdate(e), e.has("panelTag") && (this.panelInfo = h.getPanelByTag(this.panelTag), this.setAttribute("aria-labelledby", this.panelInfo.tag.concat("-title"))), this.toggleAttribute("floating", this.panelInfo?.floating);
  }
  updated(e) {
    super.updated(e), this.setCssSizePositionProperties(), requestAnimationFrame(() => {
      if (this.panelInfo !== void 0 && this.panelInfo.floating && this.panelInfo.floatingPosition?.top != null && (this.panelInfo?.height === void 0 || this.panelInfo?.width === void 0)) {
        let t = this.panelInfo?.height, i = this.panelInfo?.width, n = !1;
        const o = this.panelInfo.floatingPosition;
        if (this.offsetWidth !== void 0 && this.offsetWidth !== 0 && this.panelInfo.width === void 0 && (n = !0, i = this.offsetWidth), this.offsetHeight !== void 0 && this.offsetHeight !== 0 && this.panelInfo.height === void 0) {
          n = !0, t = this.offsetHeight;
          const s = window.innerHeight;
          let a = this.panelInfo.floatingPosition.top;
          t > s && (t = s);
          const c = Math.floor(s / 3);
          t < c ? (t = c, a = c) : t > 2 * c ? a -= t - (s - this.panelInfo.floatingPosition.top) : a = c, o.top = a;
        }
        n && (h.updatePanel(this.panelInfo?.tag, {
          height: t,
          width: i,
          floatingPosition: o
        }), this.setCssSizePositionProperties());
      }
    });
  }
  firstUpdated(e) {
    super.firstUpdated(e), document.addEventListener("mouseup", this.documentMouseUpEventListener), this.headerDraggableArea.addEventListener("mousedown", this.panelHeaderMouseDownEventListener), this.headerDraggableArea.addEventListener("mouseup", this.panelHeaderMouseUpEventListener), this.toggleAttribute("expanded", this.panelInfo?.expanded), this.toggleAttribute("individual", this.panelInfo?.individual ?? !1), rt(this), this.setCssSizePositionProperties(), this.contentArea.addEventListener("mousedown", this.contentAreaMouseDownListener), te(this.shadowRoot);
  }
  render() {
    return this.panelInfo ? l`
      <div part="container">
        <div part="header" class="drag-handle">
          ${this.panelInfo.expandable !== !1 ? l` <button
                @mousedown="${(e) => e.stopPropagation()}"
                @click="${(e) => this.toggleExpand(e)}"
                aria-controls="content"
                aria-expanded="${this.panelInfo.expanded}"
                aria-label="Expand ${this.panelInfo.header}"
                class="icon"
                part="toggle-button">
                <span>${d.chevronRight}</span>
              </button>` : g}
          <h2 id="${this.panelInfo.tag}-title" part="title">
            <button
              part="title-button"
              @dblclick="${(e) => {
      this.toggleExpand(e), this.startDraggingDebounce.clear();
    }}">
              ${h.getPanelHeader(this.panelInfo)}
            </button>
          </h2>
          <div class="actions" @mousedown="${(e) => e.stopPropagation()}">${this.renderActions()}</div>
          ${this.renderHelpButton()} ${this.renderPopupButton()}
        </div>
        <div part="content" id="content">
          <slot name="content"></slot>
        </div>
      </div>
    ` : g;
  }
  getPopupButtonIcon() {
    return this.panelInfo ? this.panelInfo.panel === void 0 ? d.x : this.panelInfo.floating ? this.panelInfo.panel === "bottom" ? d.layoutBottom : this.panelInfo.panel === "left" ? d.layoutLeft : this.panelInfo.panel === "right" ? d.layoutRight : g : d.share : g;
  }
  renderHelpButton() {
    return this.panelInfo?.helpUrl ? l` <button
      @click="${() => window.open(this.panelInfo.helpUrl, "_blank")}"
      @mousedown="${(e) => e.stopPropagation()}"
      aria-label="More information about ${this.panelInfo.header}"
      class="icon"
      title="More information about ${this.panelInfo.header}">
      <span>${d.help}</span>
    </button>` : g;
  }
  renderActions() {
    if (!this.panelInfo?.actionsTag)
      return g;
    const e = this.panelInfo.actionsTag;
    return lt(`<${e}></${e}>`);
  }
  changeDockingPanel(e) {
    const t = e.detail.value.panel;
    if (this.panelInfo?.panel !== t) {
      const i = h.panels.filter((n) => n.panel === t).map((n) => n.panelOrder).sort((n, o) => o - n)[0];
      ye(this), h.updatePanel(this.panelInfo.tag, { panel: t, panelOrder: i + 1 });
    }
    this.panelInfo.floating && this.changePanelFloating(e);
  }
  getResizeDirections() {
    const e = this.getAttribute(w);
    return e ? e.split(" ") : [];
  }
};
B([
  L()
], D.prototype, "panelTag", 2);
B([
  H(".drag-handle")
], D.prototype, "headerDraggableArea", 2);
B([
  H("#content")
], D.prototype, "contentArea", 2);
B([
  H('[part="container"]')
], D.prototype, "container", 2);
B([
  v()
], D.prototype, "dockingItems", 2);
D = B([
  y("copilot-section-panel-wrapper")
], D);
const ce = window.Vaadin.copilot.customComponentHandler;
if (!ce)
  throw new Error("Tried to access custom component handler before it was initialized.");
function Zt(e) {
  r.setOperationWaitsHmrUpdate(e, 3e4);
}
u.on("undoRedo", (e) => {
  const i = { files: Qt(e), uiId: dt() }, n = e.detail.undo ? "copilot-plugin-undo" : "copilot-plugin-redo", o = e.detail.undo ? "undo" : "redo";
  ct(o), Zt(ge.RedoUndo), me(n, i, (s) => {
    s.data.performed || (O({
      type: T.INFORMATION,
      message: `Nothing to ${o}`
    }), u.emit("vite-after-update", {}));
  });
});
function Qt(e) {
  if (e.detail.files)
    return e.detail.files;
  const t = ce.getActiveDrillDownContext();
  if (t) {
    const i = ce.getCustomComponentInfo(t);
    if (i)
      return new Array(i.customComponentFilePath);
  }
  return pt();
}
var ei = Object.getOwnPropertyDescriptor, ti = (e, t, i, n) => {
  for (var o = n > 1 ? void 0 : n ? ei(t, i) : t, s = e.length - 1, a; s >= 0; s--)
    (a = e[s]) && (o = a(o) || o);
  return o;
};
let Se = class extends A {
  static get styles() {
    return [
      C(ee),
      C(Oe),
      C(ht),
      C(ut),
      _`
        :host {
          --lumo-secondary-text-color: var(--dev-tools-text-color);
          --lumo-contrast-80pct: var(--dev-tools-text-color-emphasis);
          --lumo-contrast-60pct: var(--dev-tools-text-color-secondary);
          --lumo-font-size-m: 14px;

          position: fixed;
          bottom: 2.5rem;
          right: 0rem;
          visibility: visible; /* Always show, even if copilot is off */
          user-select: none;
          z-index: var(--copilot-notifications-container-z-index);

          --dev-tools-text-color: rgba(255, 255, 255, 0.8);

          --dev-tools-text-color-secondary: rgba(255, 255, 255, 0.65);
          --dev-tools-text-color-emphasis: rgba(255, 255, 255, 0.95);
          --dev-tools-text-color-active: rgba(255, 255, 255, 1);

          --dev-tools-background-color-inactive: rgba(45, 45, 45, 0.25);
          --dev-tools-background-color-active: rgba(45, 45, 45, 0.98);
          --dev-tools-background-color-active-blurred: rgba(45, 45, 45, 0.85);

          --dev-tools-border-radius: 0.5rem;
          --dev-tools-box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.05), 0 4px 12px -2px rgba(0, 0, 0, 0.4);

          --dev-tools-blue-hsl: 206, 100%, 70%;
          --dev-tools-blue-color: hsl(var(--dev-tools-blue-hsl));
          --dev-tools-green-hsl: 145, 80%, 42%;
          --dev-tools-green-color: hsl(var(--dev-tools-green-hsl));
          --dev-tools-grey-hsl: 0, 0%, 50%;
          --dev-tools-grey-color: hsl(var(--dev-tools-grey-hsl));
          --dev-tools-yellow-hsl: 38, 98%, 64%;
          --dev-tools-yellow-color: hsl(var(--dev-tools-yellow-hsl));
          --dev-tools-red-hsl: 355, 100%, 68%;
          --dev-tools-red-color: hsl(var(--dev-tools-red-hsl));

          /* Needs to be in ms, used in JavaScript as well */
          --dev-tools-transition-duration: 180ms;
        }

        .notification-tray {
          display: flex;
          flex-direction: column-reverse;
          align-items: flex-end;
          margin: 0.5rem;
          flex: none;
        }

        @supports (backdrop-filter: blur(1px)) {
          .notification-tray div.message {
            backdrop-filter: blur(8px);
          }

          .notification-tray div.message {
            background-color: var(--dev-tools-background-color-active-blurred);
          }
        }

        .notification-tray .message {
          animation: slideIn var(--dev-tools-transition-duration);
          background-color: var(--dev-tools-background-color-active);
          border-radius: var(--dev-tools-border-radius);
          box-shadow: var(--dev-tools-box-shadow);
          box-sizing: border-box;
          color: var(--dev-tools-text-color);
          flex-direction: row;
          gap: var(--space-100);
          justify-content: space-between;
          margin-top: var(--space-100);
          max-width: 40rem;
          padding-block: var(--space-100);
          pointer-events: auto;
          transform-origin: bottom right;
          transition: var(--dev-tools-transition-duration);
        }

        .notification-tray .message.animate-out {
          animation: slideOut forwards var(--dev-tools-transition-duration);
        }

        .notification-tray .message .message-details {
          word-break: break-all;
        }

        .message.information {
          --dev-tools-notification-color: var(--dev-tools-blue-color);
        }

        .message.warning {
          --dev-tools-notification-color: var(--dev-tools-yellow-color);
        }

        .message.error {
          --dev-tools-notification-color: var(--dev-tools-red-color);
        }

        .message {
          background-clip: padding-box;
          display: flex;
          padding-block: var(--space-75);
          padding-inline: var(--space-450) var(--space-100);
        }

        .message.log {
          padding-left: 0.75rem;
        }

        .message-content {
          align-self: center;
          flex: 1 1 auto;
          max-width: 100%;
          min-width: 0;
          user-select: text;
          -moz-user-select: text;
          -webkit-user-select: text;
        }

        .message .message-details {
          align-items: start;
          color: rgba(255, 255, 255, 0.7);
          display: flex;
          flex-direction: column;
        }

        .message .message-details[hidden] {
          display: none;
        }

        .message .message-details p {
          display: inline;
          margin: 0;
          margin-right: 0.375em;
          word-break: break-word;
        }

        .message .message-details vaadin-details {
          margin: 0;
        }

        .message .message-details vaadin-details-summary {
          font-size: var(--font-size-1);
          font-weight: var(--font-weight-medium);
          line-height: var(--line-height-1);
        }

        .message .persist::before {
        }

        .message .persist:hover::before {
        }

        .message .persist.on::before {
        }

        .message.log {
          color: var(--dev-tools-text-color-secondary);
        }

        .message-heading {
          color: white;
        }

        .message-heading::before {
          height: var(--icon-size-m);
          margin-inline-start: calc((var(--space-400) / -1) + ((var(--space-400) - var(--icon-size-m)) / 2));
          position: absolute;
          width: var(--icon-size-m);
        }

        .message.information .message-heading::before {
          content: url("data:image/svg+xml,%3Csvg width='18' height='18' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 16V12M12 8H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z' stroke='%2395C6FF' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
        }

        .message.warning .message-heading::before,
        .message.error .message-heading::before {
          content: url("data:image/svg+xml,%3Csvg width='18' height='18' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z' stroke='%23ff707a' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
        }

        .ahreflike {
          font-weight: 500;
          color: var(--dev-tools-text-color-secondary);
          text-decoration: underline;
          cursor: pointer;
        }

        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0%);
            opacity: 1;
          }
        }

        @keyframes slideOut {
          from {
            transform: translateX(0%);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }

        @keyframes fade-in {
          0% {
            opacity: 0;
          }
        }

        @keyframes bounce {
          0% {
            transform: scale(0.8);
          }
          50% {
            transform: scale(1.5);
            background-color: hsla(var(--dev-tools-red-hsl), 1);
          }
          100% {
            transform: scale(1);
          }
        }
      `
    ];
  }
  render() {
    return l`<div class="notification-tray">
      ${r.notifications.map((e) => this.renderNotification(e))}
    </div>`;
  }
  renderNotification(e) {
    return l`
      <div
        class="message ${e.type} ${e.animatingOut ? "animate-out" : ""} ${e.details || e.link ? "has-details" : ""}"
        data-testid="message">
        <div class="message-content">
          <h2 class="message-heading font-bold m-0 relative text-1">${e.message}</h2>
          <div class="message-details" ?hidden="${!e.details && !e.link}">
            ${gt(e.details)}
            ${e.link ? l`<a class="ahreflike" href="${e.link}" target="_blank">Learn more</a>` : ""}
          </div>
          <!-- TODO: This needs to be an actual checkbox -->
          ${e.dismissId ? l` <hr class="border-b border-white/10 border-e-0 border-s-0 border-t-0 mb-25 mt-100" />
                <div
                  class="flex gap-75 items-center py-75 relative hover:text-white"
                  @click=${() => {
      this.toggleDontShowAgain(e);
    }}>
                  ${l`${e.dontShowAgain ? d.checkSquare : d.square}`}
                  ${ii(e)}
                </div>` : ""}
        </div>
        <button
          aria-label="Close"
          class="icon -me-50 -my-50 text-inherit"
          id="dismiss"
          title="Close"
          @click=${(t) => {
      Te(e), t.stopPropagation();
    }}>
          ${d.x}
        </button>
      </div>
    `;
  }
  toggleDontShowAgain(e) {
    e.dontShowAgain = !e.dontShowAgain, this.requestUpdate();
  }
};
Se = ti([
  y("copilot-notifications-container")
], Se);
function ii(e) {
  return e.dontShowAgainMessage ? e.dontShowAgainMessage : "Do not show this again";
}
O({
  type: T.WARNING,
  message: "Development Mode",
  details: "This application is running in development mode.",
  dismissId: "devmode"
});
const pe = q(async () => {
  await ft();
}, 100);
u.on("vite-after-update", () => {
  r.active && pe();
});
function Je() {
  r.active && (pe.clear(), pe(), mt());
}
if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
  const e = window.__REACT_DEVTOOLS_GLOBAL_HOOK__, t = e.onCommitFiberRoot;
  e.onCommitFiberRoot = (i, n, o, s) => (Je(), t(i, n, o, s));
}
const Ee = window?.Vaadin?.connectionState?.stateChangeListeners;
Ee ? Ee.add((e, t) => {
  e === "loading" && t === "connected" && r.active && Je();
}) : console.warn("Unable to add listener for connection state changes");
u.on("copilot-plugin-state", (e) => {
  r.setIdePluginState(e.detail), e.preventDefault();
});
u.on("copilot-early-project-state", (e) => {
  E.setSpringSecurityEnabled(e.detail.springSecurityEnabled), E.setSpringJpaDataEnabled(e.detail.springJpaDataEnabled), E.setSupportsHilla(e.detail.supportsHilla), E.setSpringApplication(e.detail.springApplication), E.setUrlPrefix(e.detail.urlPrefix), e.preventDefault();
});
u.on("copilot-ide-notification", (e) => {
  O({
    type: T[e.detail.type],
    message: e.detail.message,
    dismissId: e.detail.dismissId
  }), e.preventDefault();
});
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
let Re = 0, Fe = 0;
const M = [];
let he = !1;
function ni() {
  he = !1;
  const e = M.length;
  for (let t = 0; t < e; t++) {
    const i = M[t];
    if (i)
      try {
        i();
      } catch (n) {
        setTimeout(() => {
          throw n;
        });
      }
  }
  M.splice(0, e), Fe += e;
}
const oi = {
  /**
   * Enqueues a function called at microtask timing.
   *
   * @memberof microTask
   * @param {!Function=} callback Callback to run
   * @return {number} Handle used for canceling task
   */
  run(e) {
    he || (he = !0, queueMicrotask(() => ni())), M.push(e);
    const t = Re;
    return Re += 1, t;
  },
  /**
   * Cancels a previously enqueued `microTask` callback.
   *
   * @memberof microTask
   * @param {number} handle Handle returned from `run` of callback to cancel
   * @return {void}
   */
  cancel(e) {
    const t = e - Fe;
    if (t >= 0) {
      if (!M[t])
        throw new Error(`invalid async handle: ${e}`);
      M[t] = null;
    }
  }
};
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
const De = /* @__PURE__ */ new Set();
class Z {
  /**
   * Creates a debouncer if no debouncer is passed as a parameter
   * or it cancels an active debouncer otherwise. The following
   * example shows how a debouncer can be called multiple times within a
   * microtask and "debounced" such that the provided callback function is
   * called once. Add this method to a custom element:
   *
   * ```js
   * import {microTask} from '@vaadin/component-base/src/async.js';
   * import {Debouncer} from '@vaadin/component-base/src/debounce.js';
   * // ...
   *
   * _debounceWork() {
   *   this._debounceJob = Debouncer.debounce(this._debounceJob,
   *       microTask, () => this._doWork());
   * }
   * ```
   *
   * If the `_debounceWork` method is called multiple times within the same
   * microtask, the `_doWork` function will be called only once at the next
   * microtask checkpoint.
   *
   * Note: In testing it is often convenient to avoid asynchrony. To accomplish
   * this with a debouncer, you can use `enqueueDebouncer` and
   * `flush`. For example, extend the above example by adding
   * `enqueueDebouncer(this._debounceJob)` at the end of the
   * `_debounceWork` method. Then in a test, call `flush` to ensure
   * the debouncer has completed.
   *
   * @param {Debouncer?} debouncer Debouncer object.
   * @param {!AsyncInterface} asyncModule Object with Async interface
   * @param {function()} callback Callback to run.
   * @return {!Debouncer} Returns a debouncer object.
   */
  static debounce(t, i, n) {
    return t instanceof Z ? t._cancelAsync() : t = new Z(), t.setConfig(i, n), t;
  }
  constructor() {
    this._asyncModule = null, this._callback = null, this._timer = null;
  }
  /**
   * Sets the scheduler; that is, a module with the Async interface,
   * a callback and optional arguments to be passed to the run function
   * from the async module.
   *
   * @param {!AsyncInterface} asyncModule Object with Async interface.
   * @param {function()} callback Callback to run.
   * @return {void}
   */
  setConfig(t, i) {
    this._asyncModule = t, this._callback = i, this._timer = this._asyncModule.run(() => {
      this._timer = null, De.delete(this), this._callback();
    });
  }
  /**
   * Cancels an active debouncer and returns a reference to itself.
   *
   * @return {void}
   */
  cancel() {
    this.isActive() && (this._cancelAsync(), De.delete(this));
  }
  /**
   * Cancels a debouncer's async callback.
   *
   * @return {void}
   */
  _cancelAsync() {
    this.isActive() && (this._asyncModule.cancel(
      /** @type {number} */
      this._timer
    ), this._timer = null);
  }
  /**
   * Flushes an active debouncer and returns a reference to itself.
   *
   * @return {void}
   */
  flush() {
    this.isActive() && (this.cancel(), this._callback());
  }
  /**
   * Returns true if the debouncer is active.
   *
   * @return {boolean} True if active.
   */
  isActive() {
    return this._timer != null;
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const F = (e, t) => {
  const i = e._$AN;
  if (i === void 0) return !1;
  for (const n of i) n._$AO?.(t, !1), F(n, t);
  return !0;
}, Q = (e) => {
  let t, i;
  do {
    if ((t = e._$AM) === void 0) break;
    i = t._$AN, i.delete(e), e = t;
  } while (i?.size === 0);
}, qe = (e) => {
  for (let t; t = e._$AM; e = t) {
    let i = t._$AN;
    if (i === void 0) t._$AN = i = /* @__PURE__ */ new Set();
    else if (i.has(e)) break;
    i.add(e), ri(t);
  }
};
function si(e) {
  this._$AN !== void 0 ? (Q(this), this._$AM = e, qe(this)) : this._$AM = e;
}
function ai(e, t = !1, i = 0) {
  const n = this._$AH, o = this._$AN;
  if (o !== void 0 && o.size !== 0) if (t) if (Array.isArray(n)) for (let s = i; s < n.length; s++) F(n[s], !1), Q(n[s]);
  else n != null && (F(n, !1), Q(n));
  else F(this, e);
}
const ri = (e) => {
  e.type == He.CHILD && (e._$AP ??= ai, e._$AQ ??= si);
};
class li extends vt {
  constructor() {
    super(...arguments), this._$AN = void 0;
  }
  _$AT(t, i, n) {
    super._$AT(t, i, n), qe(this), this.isConnected = t._$AU;
  }
  _$AO(t, i = !0) {
    t !== this.isConnected && (this.isConnected = t, t ? this.reconnected?.() : this.disconnected?.()), i && (F(this, t), Q(this));
  }
  setValue(t) {
    if (bt(this._$Ct)) this._$Ct._$AI(t, this);
    else {
      const i = [...this._$Ct._$AH];
      i[this._$Ci] = t, this._$Ct._$AI(i, this, 0);
    }
  }
  disconnected() {
  }
  reconnected() {
  }
}
/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const Le = Symbol("valueNotInitialized");
class di extends li {
  constructor(t) {
    if (super(t), t.type !== He.ELEMENT)
      throw new Error(`\`${this.constructor.name}\` must be bound to an element.`);
    this.previousValue = Le;
  }
  /** @override */
  render(t, i) {
    return g;
  }
  /** @override */
  update(t, [i, n]) {
    return this.hasChanged(n) ? (this.host = t.options && t.options.host, this.element = t.element, this.renderer = i, this.previousValue === Le ? this.addRenderer() : this.runRenderer(), this.previousValue = Array.isArray(n) ? [...n] : n, g) : g;
  }
  /** @override */
  reconnected() {
    this.addRenderer();
  }
  /** @override */
  disconnected() {
    this.removeRenderer();
  }
  /** @abstract */
  addRenderer() {
    throw new Error("The `addRenderer` method must be implemented.");
  }
  /** @abstract */
  runRenderer() {
    throw new Error("The `runRenderer` method must be implemented.");
  }
  /** @abstract */
  removeRenderer() {
    throw new Error("The `removeRenderer` method must be implemented.");
  }
  /** @protected */
  renderRenderer(t, ...i) {
    const n = this.renderer.call(this.host, ...i);
    wt(n, t, { host: this.host });
  }
  /** @protected */
  hasChanged(t) {
    return Array.isArray(t) ? !Array.isArray(this.previousValue) || this.previousValue.length !== t.length ? !0 : t.some((i, n) => i !== this.previousValue[n]) : this.previousValue !== t;
  }
}
/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const re = Symbol("contentUpdateDebouncer");
class be extends di {
  /**
   * A property to that the renderer callback will be assigned.
   *
   * @abstract
   */
  get rendererProperty() {
    throw new Error("The `rendererProperty` getter must be implemented.");
  }
  /**
   * Adds the renderer callback to the dialog.
   */
  addRenderer() {
    this.element[this.rendererProperty] = (t, i) => {
      this.renderRenderer(t, i);
    };
  }
  /**
   * Runs the renderer callback on the dialog.
   */
  runRenderer() {
    this.element[re] = Z.debounce(
      this.element[re],
      oi,
      () => {
        this.element.requestContentUpdate();
      }
    );
  }
  /**
   * Removes the renderer callback from the dialog.
   */
  removeRenderer() {
    this.element[this.rendererProperty] = null, delete this.element[re];
  }
}
class ci extends be {
  get rendererProperty() {
    return "renderer";
  }
}
class pi extends be {
  get rendererProperty() {
    return "headerRenderer";
  }
}
class hi extends be {
  get rendererProperty() {
    return "footerRenderer";
  }
}
const Xe = ve(ci), Ye = ve(pi), We = ve(hi);
var ui = Object.defineProperty, gi = Object.getOwnPropertyDescriptor, Ge = (e, t, i, n) => {
  for (var o = n > 1 ? void 0 : n ? gi(t, i) : t, s = e.length - 1, a; s >= 0; s--)
    (a = e[s]) && (o = (n ? a(t, i, o) : a(o)) || o);
  return n && o && ui(t, i, o), o;
};
let ue = class extends fe {
  constructor() {
    super(...arguments), this.rememberChoice = !1, this.opened = !1, this.handleESC = (e) => {
      !r.active || !this.opened || (e.key === "Escape" && this.sendEvent("cancel"), e.preventDefault(), e.stopPropagation());
    };
  }
  firstUpdated(e) {
    super.firstUpdated(e), te(this.renderRoot);
  }
  connectedCallback() {
    super.connectedCallback(), this.addESCListener();
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this.removeESCListener();
  }
  render() {
    return l` <vaadin-dialog
      id="ai-dialog"
      no-close-on-outside-click
      overlay-class="ai-dialog"
      ?opened=${this.opened}
      ${Ye(
      () => l`
          <h2>This Operation Uses AI</h2>
          ${d.starsAlt}
        `
    )}
      ${Xe(
      () => l`
          <p>AI is a third-party service that will receive some of your project code as context for the operation.</p>
          <label>
            <input
              type="checkbox"
              @change=${(e) => {
        this.rememberChoice = e.target.checked;
      }} />Don’t ask again
          </label>
        `
    )}
      ${We(
      () => l`
          <button @click=${() => this.sendEvent("cancel")}>Cancel</button>
          <button class="primary" @click=${() => this.sendEvent("ok")}>OK</button>
        `
    )}></vaadin-dialog>`;
  }
  sendEvent(e) {
    this.dispatchEvent(
      new CustomEvent("ai-usage-response", {
        detail: { response: e, rememberChoice: this.rememberChoice }
      })
    );
  }
  addESCListener() {
    document.addEventListener("keydown", this.handleESC, { capture: !0 });
  }
  removeESCListener() {
    document.removeEventListener("keydown", this.handleESC, { capture: !0 });
  }
};
Ge([
  L()
], ue.prototype, "opened", 2);
ue = Ge([
  y("copilot-ai-usage-confirmation-dialog")
], ue);
var fi = Object.defineProperty, mi = Object.getOwnPropertyDescriptor, z = (e, t, i, n) => {
  for (var o = n > 1 ? void 0 : n ? mi(t, i) : t, s = e.length - 1, a; s >= 0; s--)
    (a = e[s]) && (o = (n ? a(t, i, o) : a(o)) || o);
  return n && o && fi(t, i, o), o;
};
const ze = {
  info: "UI state info",
  stacktrace: "Exception details",
  versions: "Vaadin, Java, OS, etc.."
};
let k = class extends fe {
  constructor() {
    super(...arguments), this.exceptionReport = void 0, this.dialogOpened = !1, this.visibleItemIndex = 0, this.versions = void 0, this.selectedItems = [], this.eventListener = (e) => {
      this.exceptionReport = e.detail, this.selectedItems = this.exceptionReport.items.map((t, i) => i), this.visibleItemIndex = 0, this.searchInputValue = void 0, this.dialogOpened = this.exceptionReport !== void 0;
    };
  }
  connectedCallback() {
    super.connectedCallback(), u.on("submit-exception-report-clicked", this.eventListener);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), u.off("submit-exception-report-clicked", this.eventListener);
  }
  firstUpdated(e) {
    super.firstUpdated(e), te(this.renderRoot);
  }
  close() {
    this.dialogOpened = !1;
  }
  clear() {
    this.exceptionReport = void 0;
  }
  render() {
    let e = "";
    return this.exceptionReport && this.exceptionReport.items.length > 0 && (e = this.exceptionReport.items[this.visibleItemIndex].content), l` <vaadin-dialog
      id="report-exception-dialog"
      overlay-class="report-exception-dialog"
      no-close-on-outside-click
      draggable
      ?opened=${this.dialogOpened}
      @closed="${() => {
      this.clear();
    }}"
      @opened-changed="${(t) => {
      t.detail.value || this.close();
    }}"
      ${Ye(
      () => l`
          <div
            class="draggable"
            style="display: flex; justify-content: space-between; align-items: center; width: 100%">
            <h2>Send report</h2>
            <vaadin-button theme="tertiary" @click="${this.close}">
              <vaadin-icon icon="lumo:cross"></vaadin-icon>
            </vaadin-button>
          </div>
        `
    )}
      ${Xe(
      () => l`
          <div class="description-container">
            <vaadin-text-area
              @input=${(t) => {
        this.searchInputValue = t.target.value;
      }}
              label="Description of the Bug"
              placeholder="A short, concise description of the bug and why you consider it a bug."></vaadin-text-area>
          </div>
          <div class="list-preview-container">
            <div class="left-menu">
              <div class="section-title">Include in Report</div>
              <vaadin-list-box
                single
                selected="${this.visibleItemIndex}"
                @selected-changed="${(t) => {
        this.visibleItemIndex = t.detail.value;
      }}">
                ${this.exceptionReport?.items.map(
        (t, i) => l` <vaadin-item>
                      <input
                        type="checkbox"
                        .checked="${this.selectedItems.indexOf(i) !== -1}"
                        @change="${(n) => {
          const o = n.target, s = [...this.selectedItems];
          if (o.checked)
            s.push(i), this.selectedItems = [...this.selectedItems];
          else {
            const a = this.selectedItems.indexOf(i);
            s.splice(a, 1);
          }
          this.selectedItems = s;
        }}" />
                      <div class="item-content">
                        <span class="item-name"> ${t.name} </span>
                        <span class="item-description">${this.renderItemDescription(t)}</span>
                      </div>
                    </vaadin-item>`
      )}
              </vaadin-list-box>
            </div>
            <div class="right-menu">
              <div class="section-title">Preview: ${this.exceptionReport?.items[this.visibleItemIndex].name}</div>
              <code class="codeblock">${e}</code>
            </div>
          </div>
        `,
      [this.exceptionReport, this.visibleItemIndex, this.selectedItems]
    )}
      ${We(
      () => l`
          <button
            id="cancel"
            @click=${() => {
        this.close();
      }}>
            Cancel
          </button>

          <button
            id="submit"
            class="primary"
            @click=${() => {
        this.submitErrorToGithub(), this.close();
      }}>
            Submit in GitHub
            <vaadin-tooltip
              for="submit"
              text="${this.bodyLengthExceeds() ? "The error report will be copied to clipboard and blank new issue page will be opened" : "New issue page will be opened with data loaded"}"
              position="top-start"></vaadin-tooltip>
          </button>
        `,
      [this.exceptionReport, this.selectedItems, this.searchInputValue]
    )}></vaadin-dialog>`;
  }
  renderItemDescription(e) {
    return Object.keys(ze).indexOf(e.name.toLowerCase()) !== -1 ? ze[e.name.toLowerCase()] : null;
  }
  bodyLengthExceeds() {
    const e = this.getIssueBodyNotEncoded();
    return e !== void 0 && encodeURIComponent(e).length > 7500;
  }
  getIssueBodyNotEncoded() {
    if (!this.exceptionReport)
      return;
    const e = this.exceptionReport.items.filter((t, i) => this.selectedItems.indexOf(i) !== -1).map((t) => {
      let i = "```";
      return t.name.includes(".java") && (i = `${i}java`), `## ${t.name} 
 
 ${i}
${t.content}
\`\`\``;
    });
    return this.searchInputValue ? `## Description of the bug 
 ${this.searchInputValue} 
 ${e.join(`
`)}` : `## Description of the bug 
 Please enter bug description here 
 ${e.join(`
`)}`;
  }
  submitErrorToGithub() {
    const e = this.exceptionReport;
    if (!e)
      return;
    const t = encodeURIComponent(e.title ?? "Bug report "), i = this.getIssueBodyNotEncoded();
    if (!i)
      return;
    let n = encodeURIComponent(i);
    n.length >= 7500 && (Pt(i), n = encodeURIComponent("Please paste report here. It was automatically added to your clipboard."));
    const o = `https://github.com/vaadin/copilot/issues/new?title=${t}&body=${n}`;
    window.open(o, "_blank");
  }
};
z([
  v()
], k.prototype, "exceptionReport", 2);
z([
  v()
], k.prototype, "dialogOpened", 2);
z([
  v()
], k.prototype, "visibleItemIndex", 2);
z([
  v()
], k.prototype, "versions", 2);
z([
  v()
], k.prototype, "selectedItems", 2);
z([
  v()
], k.prototype, "searchInputValue", 2);
k = z([
  y("copilot-report-exception-dialog")
], k);
let G;
u.on("copilot-project-compilation-error", (e) => {
  if (e.detail.error) {
    let t;
    if (e.detail.files && e.detail.files.length > 0) {
      const i = r.idePluginState?.supportedActions?.includes("undo") ? l`
            <button
              class="text-white"
              @click="${(n) => {
        n.preventDefault(), u.emit("undoRedo", { undo: !0, files: e.detail.files?.map((o) => o.path) });
      }}">
              <span aria-hidden="true" class="prefix">${d.flipBack}</span>
              Undo Last Change
            </button>
          ` : g;
      t = yt(
        l`<div>
          <span> Following files have compilation errors: </span>
          <ul class="mb-0 mt-25 ps-200">
            ${e.detail.files.map(
          (n) => l` <li>
                  <button
                    class="-ms-75 text-white"
                    @click="${() => {
            u.emit("show-in-ide", { javaSource: { absoluteFilePath: n.path } });
          }}">
                    ${n.name}
                  </button>
                </li>`
        )}
          </ul>
          <hr class="border-b border-white/10 border-e-0 border-s-0 border-t-0 my-50" />
          ${i}
        </div>`
      );
    } else
      t = "Project contains one or more compilation errors.";
    G = O({
      message: "Compilation error",
      details: t,
      type: T.WARNING,
      delay: 3e4
    });
  } else
    G && Te(G), G = void 0;
});
u.on("copilot-java-after-update", (e) => {
  const t = e.detail.classes.filter((n) => n.redefined).map((n) => n.class).join(", ");
  if (t.length === 0)
    return;
  const i = "java-hot-deploy";
  e.detail.classes.find((n) => n.routePath !== void 0) && u.emit("update-routes", {}), O({
    type: T.INFORMATION,
    message: `Java changes were hot deployed for ${xt(t)}`,
    dismissId: i,
    delay: 5e3
  });
});
