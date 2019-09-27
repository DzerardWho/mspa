let open_g, close_g, pos_x, pos_y, adv, page, n_page, p_page, log_btn;

function ready(fn) {
    if (document.attachEvent ? document.readyState === 'complete' : document.readyState !== 'loading') {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

function pesterlogButton() {
    let log = document.getElementById('pesterlog');
    if (log.style.display == '') {
        this.innerText = open_g;
        log.style.display = 'none';
    } else {
        this.innerText = close_g;
        log.style.display = "";
    }
}

function navbarControl() {
    let nav = document.getElementById('nav-bar-container');
    if (nav.dataset.navState == 'closed') {
        nav.dataset.navState = 'open';
        pos_x = window.pageXOffset || document.documentElement.scrollLeft;
        pos_y = window.pageYOffset || document.documentElement.scrollTop;
        document.getElementById('dim-container').classList.add('dim');
        document.body.style.top = `-${pos_y}px`;
        document.body.classList.add('no-scroll');
    } else {
        nav.dataset.navState = 'closed';
        document.getElementById('dim-container').classList.remove('dim');
        document.body.style.top = '';
        document.body.classList.remove('no-scroll');
        window.scrollTo(pos_x, pos_y);
    }
}

function gameNavbarControl() {
    let nav = document.getElementById('game-nav-container');
    if (nav.dataset.navState == 'closed') {
        pos_x = window.pageXOffset || document.documentElement.scrollLeft;
        pos_y = window.pageYOffset || document.documentElement.scrollTop;
        nav.dataset.navState = 'open';
        document.getElementById('dim-game-container').classList.add('dim');
        document.body.style.top = `-${pos_y}px`;
        document.body.classList.add('no-scroll');
    } else {
        nav.dataset.navState = 'closed';
        document.getElementById('dim-game-container').classList.remove('dim');
        document.body.style.top = '';
        document.body.classList.remove('no-scroll');
        window.scrollTo(pos_x, pos_y);
    }
}

function catchKey(e) {
    switch (e.key) {
        case "ArrowLeft":
            if (p_page > 0)
                if (adv == 'hs')
                    window.location.href = `/story/${p_page}`;
                else
                    window.location.href = `/${adv}/${p_page}`;
            break;
        case "ArrowRight":
            if (n_page != -1)
                if (adv == 'hs')
                    window.location.href = `/story/${n_page}`;
                else
                    window.location.href = `/${adv}/${n_page}`
            break;
        case "Enter":
            if (log_btn)
                log_btn.click()
            break;
    }
}

ready(function () {
    document.getElementById('nav-btn').addEventListener('click', navbarControl, false);
    document.getElementById('in-nav-btn').addEventListener('click', navbarControl, false);
    document.getElementById('dim-container').addEventListener('click', navbarControl, false);

    if (document.getElementById('game-nav-btn')) {
        document.getElementById('game-nav-btn').addEventListener('click', gameNavbarControl, false);
        document.getElementById('in-game-nav-btn').addEventListener('click', gameNavbarControl, false);
        document.getElementById('dim-game-container').addEventListener('click', gameNavbarControl, false);

        page_data = document.getElementById('page-data');
        adv = page_data.dataset.adventure;
        if (adv) {
            page = page_data.dataset.page;
            n_page = page_data.dataset.nextPage;
            p_page = page_data.dataset.prevPage;
            document.body.addEventListener('keydown', catchKey);
        }

        if (typeof (Storage) !== "undefined") {


            document.getElementById('save-game').addEventListener('click', function () {
                localStorage.setItem(`${adv}_page`, page);
            }, false);

            document.getElementById('load-game').addEventListener('click', function () {
                p = localStorage.getItem(`${adv}_page`)
                if (p)
                    if (adv == 'hs')
                        window.location.href = `/story/${p}`;
                    else
                        window.location.href = `/story/${adv}/${p}`;
                else
                    alert("Brak zapisu gry!");
            }, false);

            document.getElementById('delete-game').addEventListener('click', function () {
                localStorage.clear();
                alert("Wszystkie dane zostały usunięte.");
            }, false);

            document.getElementById('auto-save').addEventListener('click', function () {
                localStorage.setItem(`${adv}_auto_save`, 1);
                localStorage.setItem(`${adv}_page`, page);
            }, false);

            if (localStorage.getItem(`${adv}_auto_save`) == '1' && window.location.pathname != '/')
                if (page < localStorage.getItem(`${adv}_page`))
                    document.getElementById('load-game').click();
                else
                    localStorage.setItem(`${adv}_page`, page);
        }
    }
});

ready(function () {
    log_btn = document.getElementById('log-btn')
    if (log_btn) {
        open_g = typeof open_btn !== 'undefined' ? open_btn : "Otwórz Pesterlog";
        close_g = typeof close_btn !== 'undefined' ? close_btn : "Zamknij Pesterlog";
        log_btn.addEventListener('click', pesterlogButton, false);
        log_btn.addEventListener('mouseover', function () {
            log_btn.classList.add('btn-hover');
        });
        log_btn.addEventListener('mouseleave', function () {
            log_btn.classList.remove('btn-hover');
        });
    }
});