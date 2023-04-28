const suits = ['♥', '♠', '♦', '♣'];
const cardsWrapper = document.querySelector('.cards-wrapper');
const selectedCardsWrapper = document.querySelector('.selected-cards');
const btnWrapper = document.querySelector('.btn-wrapper');

function sortCards(cards) {
  return cards.sort((a, b) => a.getAttribute('data-value') - b.getAttribute('data-value'));
}

function reRenderCards(cards) {
  cards.forEach((card, i) => {
    card.style.left = `${i * 35}px`;
    cardsWrapper.appendChild(card);
  });
}

// create the `Shuffle` button
const shuffleBtn = document.createElement('button');
shuffleBtn.classList.add('btn', 'btn-lg', 'btn-secondary', 'mr-3');
shuffleBtn.innerText = 'Shuffle';
shuffleBtn.addEventListener('click', () => {
  cardsWrapper.classList.add('shuffling');
  const shuffledCards = [...document.querySelector('.cards-wrapper').children].sort(() => 0.5 - Math.random());
  setTimeout(() => {
    reRenderCards(shuffledCards);
  }, 1000);

  setTimeout(() => {
    cardsWrapper.classList.remove('shuffling');
  }, 1500);
});

// create the `Show/Hide` button
const showHideBtn = document.createElement('button');
showHideBtn.classList.add('btn', 'btn-lg', 'btn-secondary', 'mr-3');
showHideBtn.innerText = 'Show/Hide';
showHideBtn.addEventListener('click', () => {
  const wrapperClassList = document.querySelector('.cards-wrapper').classList;
  if (wrapperClassList.contains('hidden')) {
    wrapperClassList.remove('hidden');
  } else {
    wrapperClassList.add('hidden');
  }
});

// create the `Magic` button
const magicBtn = document.createElement('button');
magicBtn.classList.add('btn', 'btn-lg', 'btn-secondary', 'mr-3');
magicBtn.innerText = 'Magic';
magicBtn.addEventListener('click', () => {
  cardsWrapper.classList.add('shuffling');
  const selectedCard = document.querySelector('.selected-cards .card');
  if (selectedCard) {
    const val = selectedCard.getAttribute('data-value');
    document.querySelectorAll(`.cards-wrapper [data-value="${val}"]`).forEach((card, i) => {
      const positionFromLeft = (i + 1) * 40;
      card.style.left = `${positionFromLeft}px`;
      selectedCardsWrapper.appendChild(card);
    });
  }
  const hearts = sortCards([...document.querySelectorAll('.cards-wrapper .♥')]);
  const spades = sortCards([...document.querySelectorAll('.cards-wrapper .♠')]);
  const clubs = sortCards([...document.querySelectorAll('.cards-wrapper .♣')]);
  const diamonds = sortCards([...document.querySelectorAll('.cards-wrapper .♦')]);
  setTimeout(() => {
    reRenderCards([...hearts, ...spades, ...diamonds, ...clubs]);
  }, 1000);

  setTimeout(() => {
    cardsWrapper.classList.remove('shuffling');
  }, 1500);
});

// Create reset button
const resetBtn = document.createElement('button');
resetBtn.classList.add('btn', 'btn-lg', 'btn-secondary');
resetBtn.innerText = 'Reset';
resetBtn.addEventListener('click', () => {
  cardsWrapper.classList.add('shuffling');
  selectedCardsWrapper.innerHTML = '';
  // eslint-disable-next-line no-use-before-define
  createButtons();
  const hearts = sortCards([...document.querySelectorAll('.♥')]);
  const spades = sortCards([...document.querySelectorAll('.♠')]);
  const clubs = sortCards([...document.querySelectorAll('.♣')]);
  const diamonds = sortCards([...document.querySelectorAll('.♦')]);
  setTimeout(() => {
    reRenderCards([...hearts, ...spades, ...diamonds, ...clubs]);
  }, 1000);

  setTimeout(() => {
    cardsWrapper.classList.remove('shuffling');
  }, 1500);
});

function suitsHtml(card) {
  const suitsRowArray = [];
  let suitsRows = 1;
  const cardValue = card.value;
  const isEven = (nr) => nr === 0 || !!(nr && !(nr % 2));
  const hasOddRows = !isEven(cardValue);
  const isFaceCard = ['A', 'J', 'Q', 'K'].includes(cardValue);
  if (cardValue > 3) {
    suitsRows = 2;
    if (hasOddRows) {
      suitsRows = 3;
    }
  }
  for (let i = 0; i < suitsRows; i += 1) {
    let divider = 2;
    if (!isEven(i) && hasOddRows) {
      divider = 4;
    }
    let suitsPerCol = Math.floor(cardValue / divider);
    if (isFaceCard) {
      suitsPerCol = 1;
    } else if (cardValue <= 3) {
      suitsPerCol = cardValue;
    }
    const suits1 = [];
    for (let colIndex = 0; colIndex < suitsPerCol; colIndex += 1) {
      suits1.push(colIndex);
    }
    suitsRowArray.push(suits1);
  }
  return suitsRowArray
    .map((row) => {
      const symbols = row.map(() => `<span class="symbol ${isFaceCard ? 'big' : ''}">${card.suit}</span>`).join('');
      return `
      <div class="suits">
        ${symbols}
      </div>
    `;
    })
    .join('');
}

function createCards() {
  const cards = [];
  // Create an array with objects containing the value and the suit of each card
  suits.forEach((suit) => {
    for (let i = 1; i <= 13; i += 1) {
      const valueMapping = {
        1: 'A',
        11: 'J',
        12: 'Q',
        13: 'K',
      };

      const cardObject = {
        value: valueMapping[i] || i,
        suit,
        rank: i,
      };
      cards.push(cardObject);
    }
  });

  // For each dataObject, create a new card and append it to the DOM
  cards.forEach((card, i) => {
    const positionFromLeft = i * 40;
    const cardElement = document.createElement('div');
    cardElement.setAttribute('data-value', card.rank);
    cardElement.classList.add('card', card.suit);
    cardElement.style.left = `${positionFromLeft}px`;

    cardElement.innerHTML = `
      <div class="corner">
        <span class="value">${card.value}</span> ${card.suit}
      </div>
      ${suitsHtml(card)}
      <div class="corner flipped">
        <span class="value">${card.value}</span> ${card.suit}
      </div>
    `;
    cardElement.onclick = (e) => {
      if (!selectedCardsWrapper.children.length) {
        selectedCardsWrapper.appendChild(e.currentTarget);
        e.currentTarget.style = '';
        btnWrapper.appendChild(magicBtn);
        btnWrapper.appendChild(resetBtn);
      }
    };
    cardsWrapper.append(cardElement);
  });
}

// Function to clear out the initial button and create new buttons to play the game.
function createButtons() {
  // Clear out the initial button
  btnWrapper.innerHTML = '';
  // Append all buttons to the DOM
  btnWrapper.appendChild(shuffleBtn);
  btnWrapper.appendChild(showHideBtn);
}

// Function to start the game by clearing the wrapper, creating
// and appending the buttons and all the cards to the DOM
function startGame() {
  createButtons();
  createCards();
}

document.getElementById('start-game').addEventListener('click', startGame);
