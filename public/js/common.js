// Common UI interactions shared across multiple pages
//
// This script provides a handful of behaviours: it toggles a
// ``scrolled`` class on the header when the page is scrolled more
// than 50px; it implements smooth scrolling for in‑page anchor
// links; it shows a simple alert and resets the contact form upon
// submission; and it lazily fades in elements tagged with
// ``animated-item`` when they enter the viewport.  By isolating
// these behaviours here we avoid duplicating the same code across
// multiple HTML files.

document.addEventListener('DOMContentLoaded', () => {
  // Header scroll effect
  const header = document.getElementById('header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  // Smooth scrolling for in‑page anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      // Only handle if this is not just '#'
      const targetId = this.getAttribute('href');
      if (targetId && targetId.length > 1) {
        e.preventDefault();
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  // Contact form submission handler
  const contactForm = document.querySelector('.contact-form form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      alert('お問い合わせありがとうございます。後日担当者よりご連絡いたします。');
      this.reset();
    });
  }

  // IntersectionObserver to animate items on scroll
  const animatedItems = document.querySelectorAll('.animated-item');
  if (animatedItems.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
    animatedItems.forEach((item, index) => {
      item.style.transitionDelay = `${index * 30}ms`;
      observer.observe(item);
    });
  }
});