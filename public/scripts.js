const availableColors = [
  '#92400e', '#dbeafe', '#1e40af', '#50b40a', '#d32f2f',
  '#065f46', '#d1fae5', '#5b21b6', '#ede9fe', '#9d174d',
  '#fce7f3', '#991b1b', '#fee2e2', '#243876', '#a5cafd',
  '#771d1d', '#f8b4b3', '#014737', '#77d1ae', '#623112',
  '#faca16', '#4a1d96', '#bfb1f4', '#751a3d', '#f8b4d9'
];

const cursorParticles = document.getElementById('cursor-particles');

// Mousemove: Enhanced trailing particles
document.addEventListener('mousemove', (e) => {
  const particle = document.createElement('div');
  particle.classList.add('particle');

  // Random color and glow
  const color = availableColors[Math.floor(Math.random() * availableColors.length)];
  particle.style.backgroundColor = color;
  particle.style.boxShadow = `0 0 5px ${color}`;

  // Random size between 10px and 30px
  const size = Math.random() * 20 + 10;
  particle.style.width = size + 'px';
  particle.style.height = size + 'px';

  // Position at cursor
  particle.style.left = e.clientX + 'px';
  particle.style.top = e.clientY + 'px';

  // Random movement
  const dx = (Math.random() - 0.5) * 20; // -10 to 10px
  const dy = (Math.random() - 0.5) * 20;
  particle.style.setProperty('--dx', dx + 'px');
  particle.style.setProperty('--dy', dy + 'px');

  cursorParticles.appendChild(particle);

  particle.addEventListener('animationend', () => {
    cursorParticles.removeChild(particle);
  });
});

// Click: Enhanced fountain effect
// document.addEventListener('click', (e) => {
//   const numParticles = 30;

//   for (let i = 0; i < numParticles; i++) {
//     const particle = document.createElement('div');
//     particle.classList.add('particle');

//     // Color transition and glow
//     const startColor = availableColors[Math.floor(Math.random() * availableColors.length)];
//     const endColor = availableColors[Math.floor(Math.random() * availableColors.length)];
//     particle.style.setProperty('--start-color', startColor);
//     particle.style.setProperty('--end-color', endColor);
//     particle.style.boxShadow = `0 0 5px ${startColor}`;

//     // Position at click
//     particle.style.left = e.clientX + 'px';
//     particle.style.top = e.clientY + 'px';

//     // Fountain motion
//     const angle = (Math.PI / 2) + (Math.random() - 0.5) * (Math.PI / 6);
//     const speed = Math.random() * 50 + 50;
//     const vx = Math.cos(angle) * speed;
//     const vy = -Math.abs(Math.sin(angle) * speed);

//     // Random scale and rotation
//     const scale = Math.random() * 0.5 + 0.75;
//     const rotate = Math.random() * 360;
//     particle.style.transform = `scale(${scale}) rotate(${rotate}deg)`;

//     particle.style.setProperty('--vx', vx + 'px');
//     particle.style.setProperty('--vy', vy + 'px');
//     particle.style.setProperty('--rotate', rotate + 'deg');

//     // Animation with random duration and delay
//     const duration = Math.random() * 0.5 + 0.75;
//     const delay = Math.random() * 0.1; // Up to 100ms
//     particle.style.animation = `fountain ${duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}s forwards`;

//     cursorParticles.appendChild(particle);

//     particle.addEventListener('animationend', () => {
//       cursorParticles.removeChild(particle);
//     });
//   }
// });