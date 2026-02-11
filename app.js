let currentIndex = 0;
let startX = 0;
let currentX = 0;
let isDragging = false;

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

const shuffledPrompts = shuffleArray(prompts);

function createCard(prompt, index) {
    const card = document.createElement('div');
    card.className = 'card';
    card.style.zIndex = prompts.length - index;
    
    card.innerHTML = `
        <div class="emoji">${prompt.emoji}</div>
        <div class="prompt">${prompt.text}</div>
    `;
    
    // Touch events
    card.addEventListener('touchstart', handleTouchStart, { passive: false });
    card.addEventListener('touchmove', handleTouchMove, { passive: false });
    card.addEventListener('touchend', handleTouchEnd);
    
    // Mouse events
    card.addEventListener('mousedown', handleMouseDown);
    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseup', handleMouseEnd);
    card.addEventListener('mouseleave', handleMouseEnd);
    
    // Click for simple advance
    card.addEventListener('click', (e) => {
        if (!isDragging) {
            nextCard();
        }
    });
    
    return card;
}

function handleTouchStart(e) {
    e.preventDefault();
    isDragging = true;
    startX = e.touches[0].clientX;
    e.target.closest('.card').classList.add('swiping');
}

function handleTouchMove(e) {
    if (!isDragging) return;
    e.preventDefault();
    currentX = e.touches[0].clientX;
    const diff = currentX - startX;
    const rotation = diff / 20;
    e.target.closest('.card').style.transform = `translateX(${diff}px) rotate(${rotation}deg)`;
}

function handleTouchEnd(e) {
    if (!isDragging) return;
    isDragging = false;
    const card = e.target.closest('.card');
    card.classList.remove('swiping');
    
    const diff = currentX - startX;
    
    if (Math.abs(diff) > 100) {
        if (diff > 0) {
            card.classList.add('swiped-right');
        } else {
            card.classList.add('swiped-left');
        }
        setTimeout(() => {
            card.remove();
            nextCard();
        }, 300);
    } else {
        card.style.transform = '';
    }
}

function handleMouseDown(e) {
    isDragging = true;
    startX = e.clientX;
    e.target.closest('.card').classList.add('swiping');
}

function handleMouseMove(e) {
    if (!isDragging) return;
    currentX = e.clientX;
    const diff = currentX - startX;
    const rotation = diff / 20;
    e.target.closest('.card').style.transform = `translateX(${diff}px) rotate(${rotation}deg)`;
}

function handleMouseEnd(e) {
    if (!isDragging) return;
    isDragging = false;
    const card = e.target.closest('.card');
    card.classList.remove('swiping');
    
    const diff = currentX - startX;
    
    if (Math.abs(diff) > 100) {
        if (diff > 0) {
            card.classList.add('swiped-right');
        } else {
            card.classList.add('swiped-left');
        }
        setTimeout(() => {
            card.remove();
            nextCard();
        }, 300);
    } else {
        card.style.transform = '';
    }
}

function nextCard() {
    currentIndex++;
    if (currentIndex >= shuffledPrompts.length) {
        currentIndex = 0;
        location.reload();
    }
    updateCounter();
}

function updateCounter() {
    document.getElementById('counter').textContent = `${currentIndex + 1} / ${shuffledPrompts.length}`;
}

function init() {
    const cardStack = document.getElementById('cardStack');
    
    for (let i = Math.min(3, shuffledPrompts.length) - 1; i >= 0; i--) {
        const card = createCard(shuffledPrompts[i], i);
        cardStack.appendChild(card);
    }
    
    updateCounter();
}

init();
