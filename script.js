(() => {
	const homeCanvas = document.querySelector(".nebula-layer");
	let destroyNebula = null;

	const translations = {
		en: {
			brand: "Naomi Peng",
			navWorks: "works",
			navAbout: "about",
			heroEyebrow: "Designer\nCreative computing",
			heroTitle: "Naomi Peng",
			worksHeading: "Recent Works",
			catDesign: "Design",
			catCreative: "Creative Computing",
			catExperiments: "Experiments",
			comingSoon: "Coming soon",
			projectTwo: "Wetland",
			projectTwoMeta: "#System Design · #Urban Design · #Sustainable Design · 2024",
			projectThree: "Family",
			projectThreeMeta: "#Product Design · #Service Design · #Artificial Intelligence · 2025",
			projectFour: "Bias & Bug",
			projectFourMeta: "#Artificial Intelligence · #Experimental Website · 2025",
			projectFive: "Digital Materiality",
			projectFiveMeta: "#TouchDesigner · #Generative Visuals · #Motion Graphics",
			aboutLead: "Naomi Peng is a digital designer and creative technologist working across visual systems, generative design, and new media. Her practice explores how algorithms can carry emotion and narrative.",
			aboutBody1: "She is currently studying from the Master in Media Design Practice program at Art Center College of Design.",
			aboutBody2: "",
			contact: "contact",
			portfolioTitle: "Portfolio Gallery",
			portfolioTech: "Curated Collection",
			portfolioDesc: "A comprehensive showcase of design and creative computing projects.",
			carouselNote: "Scroll to explore the full project series.",
			backHome: "Back to Home"
		},
		zh: {
			brand: "彭怡雯",
			navWorks: "作品",
			navAbout: "关于",
			heroEyebrow: "设计师\n创意计算",
			heroTitle: "彭怡雯",
			worksHeading: "近期作品",
			catDesign: "设计",
			catCreative: "创意计算",
			catExperiments: "实验",
			comingSoon: "即将推出",
			projectTwo: "城市湿地循环",
			projectTwoMeta: "#系统设计 · #城市设计 · #可持续设计 · 2024",
			projectThree: "孕期家庭陪伴系统",
			projectThreeMeta: "#产品设计 · #服务设计 · #AI智能 · 2025",
			projectFour: "偏见与虫",
			projectFourMeta: "#人工智能 · #实验性网页 · 2025",
			projectFive: "数字质地",
			projectFiveMeta: "#TouchDesigner · #生成视觉 · #动态图形",
			aboutLead: "Naomi Peng 是一名数字设计师与创意技术实践者，主要关注视觉系统、生成设计与新媒体。她的实践探索算法如何承载情绪与叙事。",
			aboutBody1: "她目前就读于 ArtCenter College of Design 的 Master in Media Design Practice 项目。",
			aboutBody2: "",
			contact: "联系",
			portfolioTitle: "作品库",
			portfolioTech: "精选收藏",
			portfolioDesc: "展示设计与创意计算项目的全面作品集。",
			carouselNote: "滑动查看完整的项目系列。",
			backHome: "返回首页"
		}
	};

	const storageKey = "pyw-language";
	const root = document.documentElement;
	const toggleButtons = document.querySelectorAll("[data-lang-toggle]");

	const normalizeLanguage = (value) => (value === "en" ? "en" : "zh");

	const applyLanguage = (language, force = false) => {
		const nextLanguage = normalizeLanguage(language);
		const strings = translations[nextLanguage];

		root.setAttribute("data-lang", nextLanguage);
		root.lang = nextLanguage === "zh" ? "zh-Hans" : "en";

		document.querySelectorAll("[data-i18n]").forEach((node) => {
			const key = node.getAttribute("data-i18n");
			if (!strings[key]) return;

			const hasForce = node.hasAttribute('data-i18n-force');
			const current = (node.textContent || '').trim();
			const defaultEn = (translations.en && translations.en[key]) || '';
			const defaultZh = (translations.zh && translations.zh[key]) || '';

			// Consider it "default" when empty or matches either language's default string.
			const isDefault = current === '' || current === defaultEn || current === defaultZh;

			// Overwrite when forced, when content is default (safe), or when explicitly forced by attribute.
			if (force || isDefault || hasForce) {
				node.textContent = strings[key];
			}
		});

		toggleButtons.forEach((button) => {
			button.textContent = nextLanguage === "en" ? "中文 / EN" : "EN / 中文";
			button.setAttribute("aria-label", nextLanguage === "en" ? "Switch to Chinese" : "Switch to English");
		});

		localStorage.setItem(storageKey, nextLanguage);
	};

	const initWorkCardLinks = () => {
		if (document.body?.dataset.page !== "works") {
			return;
		}

		const workCards = document.querySelectorAll(".work-card");
		workCards.forEach((card, index) => {
			const workGroup = Number(card.dataset.workGroup || ((index % 4) + 1));
			card.setAttribute("tabindex", "0");
			card.setAttribute("role", "link");

			const goToWork = () => {
				const customHref = card.dataset.href;
				window.location.href = customHref || `workslib.html?work=${workGroup}`;
			};

			card.addEventListener("click", goToWork);
			card.addEventListener("keydown", (event) => {
				if (event.key === "Enter" || event.key === " ") {
					event.preventDefault();
					goToWork();
				}
			});
		});
	};

	const initialLanguage = normalizeLanguage(localStorage.getItem(storageKey));
	applyLanguage(initialLanguage);
	initWorkCardLinks();

	if (homeCanvas) {
		destroyNebula = initNebula(homeCanvas);
	}

	toggleButtons.forEach((button) => {
		button.addEventListener("click", () => {
			const current = root.getAttribute("data-lang") || "en";
			applyLanguage(current === "en" ? "zh" : "en");
		});
	});

	function initNebula(canvas) {
		const context = canvas.getContext("2d");
		if (!context) {
			return null;
		}

		const state = {
			width: 0,
			height: 0,
			dpr: Math.min(window.devicePixelRatio || 1, 2),
			particles: [],
			cursor: { x: 0, y: 0, active: false },
		};

		const randomBetween = (min, max) => min + Math.random() * (max - min);

		const makeParticle = (x, y, spread = 1) => ({
			x,
			y,
			vx: randomBetween(-0.06, 0.06),
			vy: randomBetween(-0.06, 0.06),
			size: randomBetween(1.2, 3.6) * spread,
			alpha: randomBetween(0.32, 0.85),
			hue: 59,
			sat: 100,
			light: 90
		});

		const seedParticles = () => {
			state.particles.length = 0;
			const total = Math.round(Math.min(6000, Math.max(2400, (state.width * state.height) / 6000)));
			for (let index = 0; index < total; index += 1) {
				state.particles.push(
					makeParticle(
						Math.random() * state.width,
						Math.random() * state.height,
						randomBetween(0.2, 1.6)
					)
				);
			}
		};

		const resize = () => {
			const nextWidth = window.innerWidth;
			const nextHeight = window.innerHeight;

			state.width = nextWidth;
			state.height = nextHeight;
			canvas.width = Math.round(nextWidth * state.dpr);
			canvas.height = Math.round(nextHeight * state.dpr);
			canvas.style.width = `${nextWidth}px`;
			canvas.style.height = `${nextHeight}px`;
			context.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
			seedParticles();
		};

		const pointerMove = (event) => {
			const rect = canvas.getBoundingClientRect();
			state.cursor.x = event.clientX - rect.left;
			state.cursor.y = event.clientY - rect.top;
			state.cursor.active = true;
		};

		const pointerLeave = () => {
			state.cursor.active = false;
		};

		const drawBackgroundGlow = () => {
			context.fillStyle = "rgba(190, 217, 244, 0.4)";
			context.fillRect(0, 0, state.width, state.height);
		};

		const drawCursor = () => {
			if (!state.cursor.active) return;
			const cursorSize = 12;
			context.strokeStyle = "hsla(59, 100%, 90%, 0.8)";
			context.lineWidth = 2;
			context.beginPath();
			context.arc(state.cursor.x, state.cursor.y, cursorSize, 0, Math.PI * 2);
			context.stroke();
			context.fillStyle = "hsla(59, 100%, 92%, 0.3)";
			context.beginPath();
			context.arc(state.cursor.x, state.cursor.y, cursorSize + 4, 0, Math.PI * 2);
			context.fill();
		};

		const step = () => {
			context.clearRect(0, 0, state.width, state.height);
			drawBackgroundGlow();
			context.globalCompositeOperation = "lighter";

			for (let index = state.particles.length - 1; index >= 0; index -= 1) {
				const particle = state.particles[index];
				const dx = state.cursor.x - particle.x;
				const dy = state.cursor.y - particle.y;
				const distance = Math.hypot(dx, dy) || 1;
				const influenceRadius = state.cursor.active ? 380 : 120;
				const pull = Math.max(0, 1 - distance / influenceRadius);

				// 添加持续的缓慢游动
				particle.vx += randomBetween(-0.005, 0.005);
				particle.vy += randomBetween(-0.005, 0.005);

				if (state.cursor.active && pull > 0) {
					particle.vx += (dx / distance) * pull * 0.032;
					particle.vy += (dy / distance) * pull * 0.032;
					particle.alpha = Math.min(1, particle.alpha + pull * 0.01);
				}

				particle.x += particle.vx;
				particle.y += particle.vy;
				particle.vx *= 0.994;
				particle.vy *= 0.994;

				if (particle.x < 0) particle.x += state.width;
				if (particle.x > state.width) particle.x -= state.width;
				if (particle.y < 0) particle.y += state.height;
				if (particle.y > state.height) particle.y -= state.height;

				const extraSize = pull > 0 ? pull * 2.2 : 0;
				const extraAlpha = pull > 0 ? pull * 0.35 : 0;
				const size = particle.size + extraSize;
				const alpha = Math.min(1, particle.alpha + extraAlpha);

				context.fillStyle = `hsla(${particle.hue}, ${particle.sat}%, ${particle.light}%, ${alpha})`;
				context.beginPath();
				context.arc(particle.x, particle.y, size, 0, Math.PI * 2);
				context.fill();

				if (pull > 0.15) {
					context.fillStyle = `hsla(${particle.hue}, ${particle.sat}%, 95%, ${alpha * 0.15})`;
					context.beginPath();
					context.arc(particle.x, particle.y, size * 2, 0, Math.PI * 2);
					context.fill();
				}
			}

			context.globalCompositeOperation = "source-over";
			drawCursor();
			requestAnimationFrame(step);
		};

		resize();
		window.addEventListener("resize", resize, { passive: true });
		window.addEventListener("pointermove", pointerMove, { passive: true });
		window.addEventListener("pointerleave", pointerLeave, { passive: true });
		requestAnimationFrame(step);

		return () => {
			window.removeEventListener("resize", resize);
			window.removeEventListener("pointermove", pointerMove);
			window.removeEventListener("pointerleave", pointerLeave);
			state.particles.length = 0;
		};
	}
})();
