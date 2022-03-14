(function() {
  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim();
    if (all) {
      return [...document.querySelectorAll(el)];
    } else {
      return document.querySelector(el);
    }
  };

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all);
    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener));
      } else {
        selectEl.addEventListener(type, listener);
      }
    }
  };

  /**
   * Mobile nav toggle
   */
   on('click', '.mobile-nav-toggle', function(e) {
    select('#navbar').classList.toggle('navbar-mobile');
    this.classList.toggle('bi-list');
    this.classList.toggle('bi-x');
  });

  /**
   * Guide d'utilisation
   */
  on('click', '.guide', function(e) {
    const info = select('.infoGuide');
		info.style.display = 'block';
  });

  on('click', '.infoGuide .bi-x', function(e) {
    const info = select('.infoGuide');
		info.style.display = 'none';
  });

  on('click', '.rule', function(e) {
    const inf = select('.rules');
		inf.style.display = 'block';
  });

  on('click', '.rules .bi-x', function(e) {
    const inf = select('.rules');
		inf.style.display = 'none';
  });

})()