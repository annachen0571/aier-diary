/* 艾尔日记 — 交互脚本 */

/* 移动端菜单 */
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => links.classList.toggle('show'));
    // 点击链接后关闭
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('show')));
  }

  // 回到顶部按钮
  const backTop = document.createElement('button');
  backTop.className = 'back-top';
  backTop.innerHTML = '&#9650;';
  backTop.title = '回到顶部';
  backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  document.body.appendChild(backTop);

  window.addEventListener('scroll', () => {
    backTop.classList.toggle('visible', window.scrollY > 400);
  });

  // 滚动渐入动画
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-up');
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.entry-card, .case-card, .team-card, .wiki-card, .process-step, .contact-info, .contact-qr')
    .forEach(el => observer.observe(el));

  // 一键复制
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(btn.dataset.copy);
        btn.classList.add('copied');
        btn.textContent = '✅ 已复制';
        setTimeout(() => {
          btn.classList.remove('copied');
          btn.textContent = '📋 复制';
        }, 2000);
      } catch {
        // 兜底方案
        const ta = document.createElement('textarea');
        ta.value = btn.dataset.copy;
        ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        btn.classList.add('copied');
        btn.textContent = '✅ 已复制';
        setTimeout(() => {
          btn.classList.remove('copied');
          btn.textContent = '📋 复制';
        }, 2000);
      }
    });
  });

  // 图片放大灯箱
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    const lbImg = lightbox.querySelector('.lightbox-img');
    const imgs = Array.from(document.querySelectorAll('.case-compare img, .case-gallery img'));
    let current = 0;
    const show = (i) => {
      current = (i + imgs.length) % imgs.length;
      lbImg.src = imgs[current].src;
      lbImg.alt = imgs[current].alt || '';
    };
    imgs.forEach((img, i) => {
      img.addEventListener('click', () => {
        show(i);
        lightbox.classList.add('open');
        lightbox.setAttribute('aria-hidden', 'false');
      });
    });
    lightbox.querySelector('.lightbox-close').addEventListener('click', () => {
      lightbox.classList.remove('open');
      lightbox.setAttribute('aria-hidden', 'true');
    });
    const prev = lightbox.querySelector('.lightbox-prev');
    const next = lightbox.querySelector('.lightbox-next');
    if (prev) prev.addEventListener('click', (e) => { e.stopPropagation(); show(current - 1); });
    if (next) next.addEventListener('click', (e) => { e.stopPropagation(); show(current + 1); });
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        lightbox.classList.remove('open');
        lightbox.setAttribute('aria-hidden', 'true');
      }
    });
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') { lightbox.classList.remove('open'); lightbox.setAttribute('aria-hidden', 'true'); }
      if (e.key === 'ArrowLeft' && prev) show(current - 1);
      if (e.key === 'ArrowRight' && next) show(current + 1);
    });
  }

  // 案例筛选（如果在案例页）
  const filterBtns = document.querySelectorAll('.filter-btn');
  if (filterBtns.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const tag = btn.dataset.tag;
        document.querySelectorAll('.case-card').forEach(card => {
          if (tag === 'all') {
            card.style.display = '';
          } else {
            const tags = [...card.querySelectorAll('.case-tag')].map(t => t.textContent);
            card.style.display = tags.some(t => t.includes(tag)) ? '' : 'none';
          }
        });
      });
    });
  }
});
