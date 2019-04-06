let open_g, close_g, pos_x, pos_y;

function ready(fn){
    if (document.attachEvent ? document.readyState === 'complete' : document.readyState !== 'loading'){
        fn();
    }else{
        document.addEventListener('DOMContentLoaded', fn);
    }
}

function pesterlogButton(){
    let log = document.getElementById('pesterlog');
    if (log.style.display == ''){
        this.innerText = open_g;
        log.style.display = 'none';
    }else{
        this.innerText = close_g;
        log.style.display = "";
    }
}

function navbarControl(){
    let nav = document.getElementById('nav-bar-container');
    if (nav.dataset.navState == 'closed'){
        nav.dataset.navState = 'open';
        pos_x = window.pageXOffset || document.documentElement.scrollLeft;
        pos_y = window.pageYOffset || document.documentElement.scrollTop;
        document.getElementById('dim-container').classList.add('dim');
        document.body.style.top = `-${pos_y}px`;
        document.body.classList.add('no-scroll');
    }else{
        nav.dataset.navState = 'closed';
        document.getElementById('dim-container').classList.remove('dim');
        document.body.style.top = '';
        document.body.classList.remove('no-scroll');
        window.scrollTo(pos_x, pos_y);
    }
}

function gameNavbarControl(){
    let nav = document.getElementById('game-nav-container');
    if (nav.dataset.navState == 'closed'){
        pos_x = window.pageXOffset || document.documentElement.scrollLeft;
        pos_y = window.pageYOffset || document.documentElement.scrollTop;
        nav.dataset.navState = 'open';
        document.getElementById('dim-game-container').classList.add('dim');
        document.body.style.top = `-${pos_y}px`;
        document.body.classList.add('no-scroll');
    }else{
        nav.dataset.navState = 'closed';
        document.getElementById('dim-game-container').classList.remove('dim');
        document.body.style.top = '';
        document.body.classList.remove('no-scroll');
        window.scrollTo(pos_x, pos_y);
    }
}

ready(function(){
    document.getElementById('nav-btn').addEventListener('click', navbarControl, false);
    document.getElementById('in-nav-btn').addEventListener('click', navbarControl, false);
    document.getElementById('dim-container').addEventListener('click', navbarControl, false);

    document.getElementById('game-nav-btn').addEventListener('click', gameNavbarControl, false);
    document.getElementById('in-game-nav-btn').addEventListener('click', gameNavbarControl, false);
    document.getElementById('dim-game-container').addEventListener('click', gameNavbarControl, false);
});

ready(function(){
    let btn = document.getElementById('log-btn')
    if (btn){
        open_g = typeof open_btn !== 'undefined' ? open_btn : "Otwórz Pesterlog";
        close_g = typeof close_btn !== 'undefined' ? close_btn : "Zamknij Pesterlog";
        btn.addEventListener('click', pesterlogButton, false);
        btn.addEventListener('mouseover', function(){
            btn.classList.add('btn-hover');
        });
        btn.addEventListener('mouseleave', function(){
            btn.classList.remove('btn-hover');
        });
    }
});

ready(function(){
    if (!document.getElementById('adv-ctrl')){
        let t = document.getElementById('game-nav');
        t.classList.remove('flex-container')
        t.classList.add('flex-container-center')
    }
});