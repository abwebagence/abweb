let cards = document.querySelectorAll('.geo-cards-image .card');

cards.forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;   // x inside the card
    const y = e.clientY - rect.top;    // y inside the card

    card.style.setProperty('--x', `${x}px`);
    card.style.setProperty('--y', `${y}px`);
  });

  // optional but nicer: reset on leave
  card.addEventListener('mouseleave', () => {
    card.style.setProperty('--x', `50%`);
    card.style.setProperty('--y', `50%`);
  });
});

console.log("new code");
