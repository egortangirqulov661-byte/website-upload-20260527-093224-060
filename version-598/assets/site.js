(function () {
    function ready(fn) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", fn);
        } else {
            fn();
        }
    }

    ready(function () {
        var menuButton = document.querySelector("[data-menu-toggle]");
        var mobileNav = document.querySelector("[data-mobile-nav]");
        if (menuButton && mobileNav) {
            menuButton.addEventListener("click", function () {
                mobileNav.classList.toggle("is-open");
            });
        }

        var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
        var tabs = Array.prototype.slice.call(document.querySelectorAll("[data-hero-tab]"));
        if (slides.length > 1) {
            var current = 0;
            var activate = function (index) {
                current = index % slides.length;
                slides.forEach(function (slide, i) {
                    slide.classList.toggle("is-active", i === current);
                });
                tabs.forEach(function (tab, i) {
                    tab.classList.toggle("is-active", i === current);
                });
            };
            tabs.forEach(function (tab, i) {
                tab.addEventListener("click", function () {
                    activate(i);
                });
            });
            setInterval(function () {
                activate(current + 1);
            }, 5200);
        }

        var heroSearch = document.querySelector("[data-hero-search]");
        if (heroSearch) {
            heroSearch.addEventListener("submit", function (event) {
                event.preventDefault();
                var input = heroSearch.querySelector("input");
                var value = input ? input.value.trim() : "";
                if (value) {
                    var url = heroSearch.getAttribute("action") || "search.html";
                    window.location.href = url + "?q=" + encodeURIComponent(value);
                }
            });
        }

        var filterInput = document.querySelector("[data-search-input]");
        var cards = Array.prototype.slice.call(document.querySelectorAll("[data-card]"));
        var emptyTip = document.querySelector("[data-empty-tip]");
        if (filterInput && cards.length) {
            var params = new URLSearchParams(window.location.search);
            var initial = params.get("q") || "";
            if (initial) {
                filterInput.value = initial;
            }
            var runFilter = function () {
                var q = filterInput.value.trim().toLowerCase();
                var shown = 0;
                cards.forEach(function (card) {
                    var key = (card.getAttribute("data-key") || card.textContent || "").toLowerCase();
                    var match = !q || key.indexOf(q) !== -1;
                    card.style.display = match ? "" : "none";
                    if (match) {
                        shown += 1;
                    }
                });
                if (emptyTip) {
                    emptyTip.classList.toggle("is-visible", shown === 0);
                }
            };
            filterInput.addEventListener("input", runFilter);
            runFilter();
        }

        var video = document.querySelector("video[data-play-url]");
        var cover = document.querySelector("[data-player-cover]");
        var playButton = document.querySelector("[data-player-button]");
        if (video && playButton) {
            var started = false;
            var start = function () {
                if (started) {
                    video.play();
                    return;
                }
                started = true;
                var url = video.getAttribute("data-play-url");
                if (window.Hls && window.Hls.isSupported()) {
                    var hls = new window.Hls({ enableWorker: true });
                    hls.loadSource(url);
                    hls.attachMedia(video);
                    hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
                        video.play();
                    });
                } else {
                    video.src = url;
                    video.play();
                }
                if (cover) {
                    cover.classList.add("is-hidden");
                }
                video.setAttribute("controls", "controls");
            };
            playButton.addEventListener("click", start);
            if (cover) {
                cover.addEventListener("click", start);
            }
        }
    });
})();
