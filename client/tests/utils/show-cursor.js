(() => {
    let el;
    let animId = 0;
    let last = { x: 0, y: 0 };

    function rect(elm) {
        try {
            return elm.getBoundingClientRect();
        } catch {
            return { width: 0, height: 0, left: 0, top: 0 };
        }
    }
    function hasBox(elm) {
        const r = rect(elm);
        return r.width >= 4 && r.height >= 4;
    }
    function boxedTarget(node) {
        let t = node;
        while (t && t !== document.body && !(t instanceof HTMLElement))
            t = t.parentNode;
        while (t && t !== document.body && !hasBox(t)) t = t.parentElement;
        return t && t instanceof HTMLElement ? t : document.body;
    }
    function centerOf(target) {
        const r = rect(target);
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    }

    function tweenTo(x, y, ms = 120) {
        const start = performance.now();
        const from = { ...last };
        const id = ++animId;
        function step(t) {
            if (id !== animId) return;
            const k = Math.min(1, (t - start) / ms);
            const nx = from.x + (x - from.x) * k;
            const ny = from.y + (y - from.y) * k;
            last = { x: nx, y: ny };
            el.style.transform = `translate(${nx}px, ${ny}px)`;
            if (k < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }

    function moveToEvent(e, ms = 90) {
        if (typeof e.clientX === "number" && typeof e.clientY === "number") {
            tweenTo(e.clientX, e.clientY, ms);
            return;
        }
        const t = boxedTarget(e.target);
        const { x, y } = centerOf(t);
        tweenTo(x, y, ms);
    }

    function moveToTargetCenter(target, ms = 120) {
        const t = boxedTarget(target);
        const { x, y } = centerOf(t);
        tweenTo(x, y, ms);
    }

    function highlight() {
        el.classList.remove("click");
        void el.offsetWidth;
        el.classList.add("click");
    }

    function install() {
        if (!document.body) return false;
        if (document.getElementById("__playwright_cursor__")) return true;

        const style = document.createElement("style");
        style.textContent = `
      #__playwright_cursor__ {
        position: fixed; top:0; left:0;
        width: 38px; height: 38px;
        border: 3px solid #ff4081;
        border-radius: 50%;
        background: rgba(255,64,129,0.22);
        box-shadow: 0 0 8px rgba(255,64,129,0.6);
        pointer-events: none; z-index: 2147483647;
        transform: translate(-50%, -50%);
        transition: box-shadow .15s ease;
      }
      #__playwright_cursor__.click {
        animation: pw-click 350ms ease-out;
      }
      @keyframes pw-click {
        0%   { box-shadow: 0 0 0 0 rgba(255,64,129,0.8); }
        100% { box-shadow: 0 0 0 16px rgba(255,64,129,0); }
      }
    `;
        document.head.appendChild(style);

        el = document.createElement("div");
        el.id = "__playwright_cursor__";
        document.body.appendChild(el);

        document.addEventListener("pointermove", (e) => moveToEvent(e, 80), {
            passive: true,
        });

        ["pointerover", "mouseenter"].forEach((evt) =>
            document.addEventListener(evt, (e) => moveToEvent(e, 100), true),
        );

        ["pointerdown", "click"].forEach((evt) =>
            document.addEventListener(
                evt,
                (e) => {
                    moveToEvent(e, 90);
                    highlight();
                },
                true,
            ),
        );

        document.addEventListener(
            "focusin",
            (e) => moveToTargetCenter(e.target, 120),
            true,
        );

        document.addEventListener(
            "keydown",
            (e) => {
                if (e.key === "Enter" || e.key === " ") {
                    const a = document.activeElement;
                    if (a && a !== document.body) {
                        moveToTargetCenter(a, 100);
                        highlight();
                    }
                }
            },
            true,
        );

        new MutationObserver(() => {
            const a = document.activeElement;
            if (a && a !== document.body) moveToTargetCenter(a, 70);
        }).observe(document, {
            subtree: true,
            childList: true,
            attributes: true,
        });

        return true;
    }

    if (!install()) {
        document.addEventListener("DOMContentLoaded", install, { once: true });
    }
})();
