window.MathJax = {
  tex: {
    inlineMath: [["\\(", "\\)"], ["$", "$"]], // Aceita os dois tipos
    displayMath: [["\\[", "\\]"], ["$$", "$$"]],
    processEscapes: true,
    processEnvironments: true
  },
  options: {
    // Removemos o ignoreHtmlClass e processHtmlClass para ele ler o site todo
    renderActions: {
      addMenu: []
    }
  }
};

document.addEventListener("DOMContentLoaded", function() {
  var script = document.createElement('script');
  script.src = "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js";
  script.async = true;
  document.head.appendChild(script);
});