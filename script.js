class Service extends HTMLElement {
        connectedCallback() {
          this.innerHTML = `<div class="premium-panel flex items-center gap-4 rounded-2xl p-5" data-aos="fade-up">
          <span class="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-master-blue text-white"><i data-lucide="${this.getAttribute("icon")}" class="h-6 w-6"></i></span>
          <span class="text-lg font-black text-master-ink">${this.getAttribute("text")}</span>
        </div>`;
        }
      }
      class Pay extends HTMLElement {
        connectedCallback() {
          const siblings = Array.from(this.parentElement?.querySelectorAll("pay-option") || []);
          const shineIndex = Math.max(0, siblings.indexOf(this));
          const icon = this.getAttribute("icon") || "credit-card";
          this.innerHTML = `<div class="payment-shine glass-card-light glass-hover hover-lift group flex min-h-[4.75rem] items-center justify-between gap-4 rounded-2xl px-4 py-4 text-sm font-black text-white" style="--shine-index: ${shineIndex}">
          <span class="flex min-w-0 items-center gap-3">
            <span class="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-master-yellow text-master-ink">
              <i data-lucide="${icon}" class="h-5 w-5"></i>
            </span>
            <span class="leading-tight">${this.getAttribute("text")}</span>
          </span>
          <i data-lucide="arrow-up-right" class="h-4 w-4 shrink-0 text-master-yellow transition group-hover:text-white"></i>
        </div>`;
        }
      }
      class Branch extends HTMLElement {
        connectedCallback() {
          const city = this.getAttribute("city");
          const address = this.getAttribute("address");
          const rawMap = this.getAttribute("map") || address;
          const mapQuery = encodeURIComponent(rawMap);
          const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${mapQuery}`;
          this.innerHTML = `<article class="glass-card-light grid gap-5 overflow-hidden rounded-2xl p-5 text-white lg:grid-cols-[0.82fr_1.18fr] lg:p-5" data-aos="fade-up">
          <div class="p-0">
            <span class="grid h-12 w-12 place-items-center rounded-xl bg-master-yellow text-master-ink"><i data-lucide="map-pin" class="h-6 w-6"></i></span>
            <h3 class="mt-6 text-2xl font-black">${city}</h3>
            <p class="mt-3 text-sm font-semibold leading-7 text-white/78">${address}</p>
            <a href="${directionsUrl}" target="_blank" rel="noopener" class="cta-button mt-6 inline-flex items-center gap-2 rounded-xl bg-master-yellow px-5 py-3 text-sm font-black text-master-ink">
              Get Directions <i data-lucide="navigation" class="h-4 w-4"></i>
            </a>
          </div>
          <div class="overflow-hidden rounded-xl border border-white/28">
            <iframe
              title="${city} map"
              src="https://www.google.com/maps?q=${mapQuery}&output=embed"
              class="h-[22rem] w-full lg:h-[26rem]"
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </article>`;
        }
      }
      class ScheduleRow extends HTMLElement {
        connectedCallback() {
          this.innerHTML = `<div class="flex items-center justify-between rounded-xl bg-white px-4 py-3 shadow-sm">
          <span class="text-master-ink">${this.getAttribute("day")}</span>
          <span class="text-slate-500">${this.getAttribute("time")}</span>
        </div>`;
        }
      }
      class Review extends HTMLElement {
        connectedCallback() {
          const name = this.getAttribute("name");
          const initial = (name || "M").trim().charAt(0);
          this.innerHTML = `<article class="premium-panel flex h-full flex-col rounded-2xl p-5" data-aos="fade-up">
          <div class="flex items-start gap-3">
            <span class="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-master-blue text-lg font-black text-white">${initial}</span>
            <div>
              <h3 class="font-black leading-tight text-master-ink">${name}</h3>
              <p class="mt-1 text-xs font-bold text-slate-500">${this.getAttribute("date")}</p>
            </div>
          </div>
          <p class="mt-5 grow text-lg font-bold leading-7 text-master-ink">"${this.getAttribute("quote")}"</p>
          <div class="mt-5 flex items-center justify-between border-t border-blue-100 pt-4 text-sm font-black text-slate-500">
            <span class="inline-flex items-center gap-2"><i data-lucide="thumbs-up" class="h-4 w-4 text-master-blue"></i>Recommended</span>
            <span class="inline-flex items-center gap-1 text-master-yellow">
              <i data-lucide="star" class="h-4 w-4 fill-master-yellow"></i>
              <i data-lucide="star" class="h-4 w-4 fill-master-yellow"></i>
              <i data-lucide="star" class="h-4 w-4 fill-master-yellow"></i>
              <i data-lucide="star" class="h-4 w-4 fill-master-yellow"></i>
              <i data-lucide="star" class="h-4 w-4 fill-master-yellow"></i>
            </span>
          </div>
        </article>`;
        }
      }
      customElements.define("service-item", Service);
      customElements.define("pay-option", Pay);
      customElements.define("branch-card", Branch);
      customElements.define("schedule-row", ScheduleRow);
      customElements.define("review-card", Review);

      const sliders = new Map();

      function getItemsPerView() {
        if (window.innerWidth >= 1024) return 3;
        if (window.innerWidth >= 768) return 2;
        return 1;
      }

      function getVisibleItems(slider) {
        return Array.from(slider.track.querySelectorAll(".slider-item")).filter(
          (item) => item.style.display !== "none",
        );
      }

      function renderSliderDots(name, totalPages, currentPage) {
        const slider = sliders.get(name);
        if (!slider?.dots) return;
        slider.dots.innerHTML = "";

        for (let index = 0; index < totalPages; index += 1) {
          const dot = document.createElement("button");
          dot.type = "button";
          dot.className = `slider-dot${index === currentPage - 1 ? " is-active" : ""}`;
          dot.setAttribute("aria-label", `Go to slide ${index + 1}`);
          dot.addEventListener("click", () => {
            slider.index = index * getItemsPerView();
            showSliderLoading(name);
            updateSlider(name);
            restartSliderAutoplay(name);
          });
          slider.dots.appendChild(dot);
        }
      }

      function updateSlider(name) {
        const slider = sliders.get(name);
        if (!slider) return;

        const visibleItems = getVisibleItems(slider);
        const perView = getItemsPerView();
        const maxIndex = Math.max(0, visibleItems.length - perView);
        const totalPages = Math.max(
          1,
          Math.ceil(visibleItems.length / perView),
        );
        slider.index = Math.min(slider.index, maxIndex);
        slider.index = Math.max(0, slider.index);
        const currentPage =
          slider.index >= maxIndex
            ? totalPages
            : Math.min(totalPages, Math.floor(slider.index / perView) + 1);

        if (!visibleItems.length) {
          slider.track.style.transform = "translateX(0)";
          if (slider.prevButton) slider.prevButton.disabled = true;
          if (slider.nextButton) slider.nextButton.disabled = true;
          if (slider.dots) slider.dots.innerHTML = "";
          return;
        }

        const firstItem = visibleItems[0];
        const gap = parseFloat(getComputedStyle(slider.track).gap || 0);
        const itemWidth = firstItem.getBoundingClientRect().width;
        slider.track.style.transform = `translateX(-${slider.index * (itemWidth + gap)}px)`;
        if (slider.prevButton) {
          slider.prevButton.disabled = false;
          slider.prevButton.setAttribute("aria-label", `Previous ${name}`);
        }
        if (slider.nextButton) {
          slider.nextButton.disabled = false;
          slider.nextButton.setAttribute("aria-label", `Next ${name}`);
        }
        renderSliderDots(name, totalPages, currentPage);
      }

      function showSliderLoading(name) {
        const slider = sliders.get(name);
        if (!slider?.loading) return;
        slider.loading.classList.add("is-active");
        window.clearTimeout(slider.loadingTimer);
        slider.loadingTimer = window.setTimeout(() => {
          slider.loading.classList.remove("is-active");
        }, 520);
      }

      function nextSliderPage(name) {
        const slider = sliders.get(name);
        if (!slider) return;
        const maxIndex = Math.max(
          0,
          getVisibleItems(slider).length - getItemsPerView(),
        );
        slider.index =
          slider.index >= maxIndex
            ? 0
            : Math.min(maxIndex, slider.index + getItemsPerView());
        showSliderLoading(name);
        updateSlider(name);
      }

      function startSliderAutoplay(name) {
        const slider = sliders.get(name);
        if (!slider) return;
        window.clearInterval(slider.timer);
        slider.timer = window.setInterval(() => nextSliderPage(name), 4200);
      }

      function restartSliderAutoplay(name) {
        startSliderAutoplay(name);
      }

      function initSliders() {
        document.querySelectorAll("[data-slider]").forEach((root) => {
          const name = root.dataset.slider;
          sliders.set(name, {
            root,
            track: root.querySelector(".slider-track"),
            prevButton: document.querySelector(`[data-slider-prev="${name}"]`),
            nextButton: document.querySelector(`[data-slider-next="${name}"]`),
            dots: document.querySelector(`[data-slider-dots="${name}"]`),
            loading: document.querySelector(`[data-slider-loading="${name}"]`),
            index: 0,
            timer: null,
            loadingTimer: null,
          });
          updateSlider(name);
          startSliderAutoplay(name);
        });

        document.querySelectorAll("[data-slider-prev]").forEach((button) => {
          button.addEventListener("click", () => {
            const name = button.dataset.sliderPrev;
            const slider = sliders.get(name);
            if (!slider) return;
            const maxIndex = Math.max(
              0,
              getVisibleItems(slider).length - getItemsPerView(),
            );
            slider.index =
              slider.index <= 0
                ? maxIndex
                : Math.max(0, slider.index - getItemsPerView());
            showSliderLoading(name);
            updateSlider(name);
            restartSliderAutoplay(name);
          });
        });

        document.querySelectorAll("[data-slider-next]").forEach((button) => {
          button.addEventListener("click", () => {
            const name = button.dataset.sliderNext;
            const slider = sliders.get(name);
            if (!slider) return;
            const maxIndex = Math.max(
              0,
              getVisibleItems(slider).length - getItemsPerView(),
            );
            slider.index =
              slider.index >= maxIndex
                ? 0
                : Math.min(maxIndex, slider.index + getItemsPerView());
            showSliderLoading(name);
            updateSlider(name);
            restartSliderAutoplay(name);
          });
        });

        document.querySelectorAll("[data-slider-filter]").forEach((button) => {
          button.addEventListener("click", () => {
            const name = button.dataset.sliderFilter;
            const category = button.dataset.category;
            const slider = sliders.get(name);
            if (!slider) return;

            document
              .querySelectorAll(`[data-slider-filter="${name}"]`)
              .forEach((filterButton) =>
                filterButton.classList.remove("is-active"),
              );
            button.classList.add("is-active");

            slider.track.querySelectorAll(".slider-item").forEach((item) => {
              item.style.display =
                category === "all" || item.dataset.category === category
                  ? ""
                  : "none";
            });
            slider.index = 0;
            showSliderLoading(name);
            updateSlider(name);
            restartSliderAutoplay(name);
          });
        });

        document.querySelectorAll("[data-slider]").forEach((root) => {
          const name = root.dataset.slider;
          root.addEventListener("mouseenter", () => {
            const slider = sliders.get(name);
            if (slider) window.clearInterval(slider.timer);
          });
          root.addEventListener("mouseleave", () => startSliderAutoplay(name));
        });
      }

      function initImagePreview() {
        const modal = document.getElementById("imagePreview");
        const modalImage = modal?.querySelector("[data-preview-image]");
        const closeButton = modal?.querySelector("[data-preview-close]");

        function closePreview() {
          if (!modal || !modalImage) return;
          modal.classList.remove("is-open");
          modal.setAttribute("aria-hidden", "true");
          modalImage.src = "";
          modalImage.alt = "";
          document.body.style.overflow = "";
        }

        document.querySelectorAll(".promo-image").forEach((image) => {
          image.addEventListener("click", () => {
            const imageName = (image.getAttribute("src") || image.src)
              .split("/")
              .pop();
            const product = productCatalog.find((item) =>
              item.image.endsWith(imageName),
            );
            if (product && openProductDetails(product)) return;
            if (!modal || !modalImage || !closeButton) return;
            modalImage.src = image.currentSrc || image.src;
            modalImage.alt = image.alt;
            modal.classList.add("is-open");
            modal.setAttribute("aria-hidden", "false");
            document.body.style.overflow = "hidden";
          });
        });

        if (!modal || !modalImage || !closeButton) return;
        closeButton.addEventListener("click", closePreview);
        modal.addEventListener("click", (event) => {
          if (event.target === modal) closePreview();
        });
        document.addEventListener("keydown", (event) => {
          if (event.key === "Escape" && modal.classList.contains("is-open")) {
            closePreview();
          }
        });
      }

      function initNavHighlight() {
        const navLinks = Array.from(document.querySelectorAll(".nav-link"));
        const sections = navLinks
          .map((link) => {
            const href = link.getAttribute("href") || "";
            if (!href.startsWith("#")) return null;
            return document.querySelector(href);
          })
          .filter(Boolean);
        const isProductsPage =
          window.location.pathname.endsWith("products.html") ||
          window.location.pathname.endsWith("/products");

        function setActive(id) {
          navLinks.forEach((link) => {
            link.classList.toggle(
              "is-active",
              link.getAttribute("href") === `#${id}`,
            );
          });
        }

        navLinks.forEach((link) => {
          link.addEventListener("click", (event) => {
            const href = link.getAttribute("href") || "";
            if (!href.startsWith("#")) return;
            event.preventDefault();
            const targetId = href.replace("#", "");
            const target = document.getElementById(targetId);
            if (target) {
              target.scrollIntoView({ behavior: "smooth", block: "start" });
            }
            setActive(targetId);
          });
        });

        if (isProductsPage) {
          navLinks.forEach((link) => {
            const href = link.getAttribute("href") || "";
            link.classList.toggle(
              "is-active",
              href.endsWith("products.html") || href.endsWith("/products"),
            );
          });
        }

        if (!sections.length) return;

        const observer = new IntersectionObserver(
          (entries) => {
            const visible = entries
              .filter((entry) => entry.isIntersecting)
              .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
            if (visible) setActive(visible.target.id);
          },
          {
            rootMargin: "-35% 0px -55% 0px",
            threshold: [0.1, 0.25, 0.5],
          },
        );

        sections.forEach((section) => observer.observe(section));
      }

      function initMobileNav() {
        const toggle = document.querySelector("[data-nav-toggle]");
        const menu = document.querySelector("[data-mobile-nav]");
        if (!toggle || !menu) return;

        function setMenuOpen(isOpen) {
          toggle.classList.toggle("is-open", isOpen);
          menu.classList.toggle("is-open", isOpen);
          document.body.classList.toggle("nav-open", isOpen);
          toggle.setAttribute("aria-expanded", String(isOpen));
          toggle.setAttribute(
            "aria-label",
            isOpen ? "Close navigation menu" : "Open navigation menu",
          );
        }

        toggle.addEventListener("click", () => {
          setMenuOpen(!menu.classList.contains("is-open"));
        });

        menu.querySelectorAll("a").forEach((link) => {
          link.addEventListener("click", () => setMenuOpen(false));
        });

        document.addEventListener("keydown", (event) => {
          if (event.key === "Escape") setMenuOpen(false);
        });

        window.addEventListener("resize", () => {
          if (window.innerWidth >= 1024) setMenuOpen(false);
        });
      }

      function initHoursStatus() {
        const status = document.querySelector("[data-hours-status]");
        if (!status) return;
        const now = new Date();
        const minutes = now.getHours() * 60 + now.getMinutes();
        const open = 9 * 60;
        const close = 19 * 60;
        const isOpen = minutes >= open && minutes < close;
        status.textContent = isOpen ? "Open now" : "Closed now";
        status.classList.toggle("text-green-500", isOpen);
        status.classList.toggle("text-red-500", !isOpen);
      }

      const productCatalog = [
        { title: "Desktop Package Promo 1", category: "pc", tag: "PC Deal", image: "assets/package1.jpg" },
        { title: "Desktop Package Promo 2", category: "pc", tag: "PC Deal", image: "assets/package2.jpg" },
        { title: "Desktop Package Promo 3", category: "pc", tag: "PC Deal", image: "assets/package3.jpg" },
        { title: "Desktop Package Promo 4", category: "pc", tag: "PC Deal", image: "assets/package4.jpg" },
        { title: "Desktop Package Promo 5", category: "pc", tag: "PC Deal", image: "assets/package5.jpg" },
        { title: "Ningmei NL150 Laptop", category: "laptop", tag: "Laptop Deal", image: "assets/laptop1.jpg" },
        { title: "Ningmei Laptop Promo 2", category: "laptop", tag: "Laptop Deal", image: "assets/laptop2.jpg" },
        { title: "Chuwi Laptop Promo", category: "laptop", tag: "Laptop Deal", image: "assets/laptop3.jpg" },
        { title: "Ningmei Laptop Promo 4", category: "laptop", tag: "Laptop Deal", image: "assets/laptop4.jpg" },
        { title: "Ningmei Laptop Promo 5", category: "laptop", tag: "Laptop Deal", image: "assets/laptop5.jpg" },
        { title: "Gaming Chair Promo 1", category: "gaming-chair", tag: "Gaming Chair", image: "assets/gamingchair1.jpg" },
        { title: "Gaming Chair Promo 2", category: "gaming-chair", tag: "Gaming Chair", image: "assets/gamingchair2.jpg" },
        { title: "Gaming Chair Promo 3", category: "gaming-chair", tag: "Gaming Chair", image: "assets/gamingchair3.jpg" },
        { title: "Gaming Chair Promo 4", category: "gaming-chair", tag: "Gaming Chair", image: "assets/gamingchair4.jpg" },
        { title: "Gaming Chair Promo 5", category: "gaming-chair", tag: "Gaming Chair", image: "assets/gamingchair5.jpg" },
        { title: "Gaming Chair Promo 6", category: "gaming-chair", tag: "Gaming Chair", image: "assets/gamingchair6.jpg" },
      ];

      function openProductDetails(product) {
        const modal = document.querySelector("[data-product-modal]");
        const modalImage = modal?.querySelector("[data-product-modal-image]");
        const modalTag = modal?.querySelector("[data-product-modal-tag]");
        const modalTitle = modal?.querySelector("[data-product-modal-title]");
        if (!modal || !modalImage || !modalTag || !modalTitle) return false;

        modalImage.src = product.image;
        modalImage.alt = product.title;
        modalTag.textContent = product.tag;
        modalTitle.textContent = product.title;
        modal.classList.add("is-open");
        modal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
        return true;
      }

      function initProductDetailsModal() {
        const modal = document.querySelector("[data-product-modal]");
        if (!modal) return;

        function closeProduct() {
          modal.classList.remove("is-open");
          modal.setAttribute("aria-hidden", "true");
          document.body.style.overflow = "";
        }

        modal.querySelectorAll("[data-product-modal-close]").forEach((close) => {
          close.addEventListener("click", closeProduct);
        });
        modal.addEventListener("click", (event) => {
          if (event.target === modal) closeProduct();
        });
        document.addEventListener("keydown", (event) => {
          if (event.key === "Escape" && modal.classList.contains("is-open")) {
            closeProduct();
          }
        });
      }

      function initProductsPage() {
        const grid = document.querySelector("[data-products-grid]");
        const count = document.querySelector("[data-products-count]");
        const search = document.querySelector("[data-products-search]");
        const filters = Array.from(document.querySelectorAll("[data-product-filter]"));
        const pagination = document.querySelector("[data-products-pagination]");
        const productsSection = document.querySelector("[data-products-section]");
        const modal = document.querySelector("[data-product-modal]");
        const modalImage = modal?.querySelector("[data-product-modal-image]");
        const modalTag = modal?.querySelector("[data-product-modal-tag]");
        const modalTitle = modal?.querySelector("[data-product-modal-title]");
        if (!grid || !count || !search || !pagination || !modal || !modalImage || !modalTag || !modalTitle) return;

        const params = new URLSearchParams(window.location.search);
        const initialCategory = params.get("category") || "all";
        let activeCategory = productCatalog.some((item) => item.category === initialCategory)
          ? initialCategory
          : "all";
        let currentPage = 1;
        const perPage = 6;

        function getFilteredProducts() {
          const query = search.value.trim().toLowerCase();
          return productCatalog.filter((product) => {
            const matchesCategory =
              activeCategory === "all" ||
              product.category === activeCategory ||
              (activeCategory === "deals" && product.tag.toLowerCase().includes("deal"));
            const matchesSearch =
              !query ||
              product.title.toLowerCase().includes(query) ||
              product.tag.toLowerCase().includes(query);
            return matchesCategory && matchesSearch;
          });
        }

        function openProduct(product) {
          openProductDetails(product);
        }

        function closeProduct() {
          modal.classList.remove("is-open");
          modal.setAttribute("aria-hidden", "true");
          document.body.style.overflow = "";
        }

        function renderPagination(totalPages) {
          pagination.innerHTML = "";
          const controls = [
            { label: "First", page: 1, disabled: currentPage === 1 },
            { label: "Prev", page: Math.max(1, currentPage - 1), disabled: currentPage === 1 },
            ...Array.from({ length: totalPages }, (_, index) => ({
              label: String(index + 1),
              page: index + 1,
              active: currentPage === index + 1,
            })),
            { label: "Next", page: Math.min(totalPages, currentPage + 1), disabled: currentPage === totalPages },
            { label: "Last", page: totalPages, disabled: currentPage === totalPages },
          ];

          controls.forEach((control) => {
            const button = document.createElement("button");
            button.type = "button";
            button.textContent = control.label;
            button.className = `product-page-btn${control.active ? " is-active" : ""}`;
            button.disabled = control.disabled;
            button.addEventListener("click", () => {
              currentPage = control.page;
              renderProducts();
              requestAnimationFrame(() => {
                (productsSection || grid).scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              });
            });
            pagination.appendChild(button);
          });
        }

        function renderProducts() {
          const filtered = getFilteredProducts();
          const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
          currentPage = Math.min(currentPage, totalPages);
          const start = (currentPage - 1) * perPage;
          const visible = filtered.slice(start, start + perPage);
          count.textContent = `${filtered.length} products found`;

          grid.innerHTML = "";
          visible.forEach((product) => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "product-card";
            button.innerHTML = `<img src="${product.image}" alt="${product.title}" /><span>${product.tag}</span>`;
            button.addEventListener("click", () => openProduct(product));
            grid.appendChild(button);
          });

          renderPagination(totalPages);
        }

        filters.forEach((button) => {
          const category = button.dataset.productFilter;
          button.classList.toggle("is-active", category === activeCategory);
          button.addEventListener("click", () => {
            activeCategory = category;
            currentPage = 1;
            filters.forEach((filter) =>
              filter.classList.toggle("is-active", filter === button),
            );
            renderProducts();
          });
        });

        search.addEventListener("input", () => {
          currentPage = 1;
          renderProducts();
        });

        modal.querySelectorAll("[data-product-modal-close]").forEach((close) => {
          close.addEventListener("click", closeProduct);
        });
        modal.addEventListener("click", (event) => {
          if (event.target === modal) closeProduct();
        });
        document.addEventListener("keydown", (event) => {
          if (event.key === "Escape" && modal.classList.contains("is-open")) closeProduct();
        });

        renderProducts();
      }

      window.addEventListener("resize", () => {
        sliders.forEach((_, name) => updateSlider(name));
      });

      initSliders();
      initImagePreview();
      initProductDetailsModal();
      initNavHighlight();
      initMobileNav();
      initHoursStatus();
      initProductsPage();
      if (window.AOS) {
        document.documentElement.classList.add("aos-ready");
        AOS.init({ duration: 650, once: true, offset: 80 });
      }
      window.addEventListener("load", () => {
        if (window.lucide) lucide.createIcons();
      });
