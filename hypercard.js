class HyperCard extends HTMLElement {
	static tagName = "hyper-card";

	static register(tagName, registry) {
		if(!registry && ("customElements" in globalThis)) {
			registry = globalThis.customElements;
		}

		registry?.define(tagName || this.tagName, this);
	}

	static classes = {
		active: "active"
	};

	static css = `
@media (prefers-reduced-motion: no-preference) {
	:host {
		--_hypercard-scale: var(--hypercard-scale, 1.07);
		/* Useful if you want a different parent to create the stacking context */
		position: var(--hypercard-position, relative);
		transition-duration: 300ms;
		transition-property: transform, box-shadow;
		transition-timing-function: ease-out;
		transform: rotate3d(0);
		overflow: clip;
	}

	:host(.${HyperCard.classes.active}) {
		transition-duration: 150ms;
		box-shadow: 0 5px 20px 5px #00000044;
	}

	:host .glow {
		position: absolute;
		z-index: var(--hypercard-glow-zindex, 0);
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		background-image: radial-gradient(circle at 50% -20%, #ffffff22, #0000000f);
		pointer-events: none;
	}

	:host(:not(.${HyperCard.classes.active})) .glow {
		display: none;
	}
}
`;

	useAnimation() {
		return "matchMedia" in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	}

	connectedCallback() {
		// https://caniuse.com/mdn-api_cssstylesheet_replacesync
		if(this.shadowRoot || !("replaceSync" in CSSStyleSheet.prototype)) {
			return;
		}

		let shadowroot = this.attachShadow({ mode: "open" });
		let sheet = new CSSStyleSheet();
		sheet.replaceSync(HyperCard.css);
		shadowroot.adoptedStyleSheets = [sheet];

		let slot = document.createElement("slot");
		shadowroot.appendChild(slot);

		this.glow = document.createElement("div");
		this.glow.classList.add("glow");
		shadowroot.appendChild(this.glow);

		this.bindEvents();
	}

	// Full credit to this: https://codepen.io/markmiro/pen/wbqMPa
	rotateToMouse(e, bounds) {
		const mouseX = e.clientX;
		const mouseY = e.clientY;
		const leftX = mouseX - bounds.x;
		const topY = mouseY - bounds.y;
		const center = {
			x: leftX - bounds.width / 2,
			y: topY - bounds.height / 2
		}

		const distance = Math.sqrt(center.x**2 + center.y**2);

		this.style.transform = `
			scale3d(var(--_hypercard-scale), var(--_hypercard-scale), var(--_hypercard-scale))
			rotate3d(
				${center.y / 100},
				${-center.x / 100},
				0,
				${Math.log(distance)* 2}deg
			)
		`;

		this.glow.style.backgroundImage = `
			radial-gradient(
				circle at
				${center.x * 2 + bounds.width/2}px
				${center.y * 2 + bounds.height/2}px,
				#ffffff55,
				#0000000f
			)
		`;
	}

	bindEvents() {
		let bounds;
		let handler = (e) => {
			this.rotateToMouse(e, bounds);
		};

		this.addEventListener("mouseenter", () => {
			if(!this.useAnimation()) {
				return;
			}

			bounds = this.getBoundingClientRect();
			this.classList.add(HyperCard.classes.active);
			document.addEventListener("mousemove", handler);
		});

		this.addEventListener("mouseleave", () => {
			if(!this.useAnimation()) {
				return;
			}

			this.classList.remove(HyperCard.classes.active);
			document.removeEventListener("mousemove", handler);
			this.style.transform = "";
			this.style.background = "";
		});
	}
}


HyperCard.register();

export { HyperCard }
