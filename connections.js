class ConnectionsGame {
  constructor() {
    this.selectedWords = [];
    this.groupsFound = 0;
    this.mistakesRemaining = 4;
    this.message = '';

    this.words = [
      'Medicare',
      'Medicaid',
      'Individual and Family Plans',
      'Plan Members',
      'Regulation',
      'Public Sentiment',
      'Population Trends',
      'Workforce Trends',
      'Individual Members',
      'Payors',
      'Health Systems',
      'Primary Care',
      'ComplexCare',
      'Carelon',
      'Optum House Calls',
      'Matrix Medical Network',
    ];

    this.validGroups = [
      ['Medicare', 'Medicaid', 'Individual and Family Plans', 'Plan Members'], // Customers Signify Health® Serves
      [
        'Regulation',
        'Public Sentiment',
        'Population Trends',
        'Workforce Trends',
      ], // Market Factors That Influence Signify Health®
      ['Individual Members', 'Payors', 'Health Systems', 'Primary Care'], // Benefactors of Signify Health® Services
      ['ComplexCare', 'Carelon', 'Optum House Calls', 'Matrix Medical Network'], // Competitors
    ];

    this.groupLinks = [
      {
        title: 'Customers Signify Health® Serves',
        description: [
          'Medicare',
          'Medicaid',
          'Individual and Family Plans',
          'Plan Members',
        ],
        link: '#',
        bgColor: '#f9dd6e', // Canary 20
      },
      {
        title: 'Market Factors That Influence Signify Health®',
        description: [
          'Regulation',
          'Public Sentiment',
          'Population Trends',
          'Workforce Trends',
        ],
        link: '#',
        bgColor: '#89E55C', // Forest 20
      },
      {
        title: 'Benefactors of Signify Health® Services',
        description: [
          'Individual Members',
          'Payors',
          'Health Systems',
          'Primary Care',
        ],
        link: '#',
        bgColor: '#91C8FF', // Indigo 20
      },
      {
        title: 'Competitors',
        description: [
          'ComplexCare',
          'Carelon',
          'Optum House Calls',
          'Matrix Medical Network',
        ],
        link: '#',
        bgColor: '#CCA7DB', // Violet 20
      },
    ];

    this.completedGroups = [];

    this.init();
  }

  init() {
    this.shuffleWords();
    this.renderGame();
    this.bindEvents();
    this.animateEntry();
  }

  shuffleWords() {
    this.shuffle(this.words);
  }

  shuffle(array) {
    let currentIndex = array.length;
    while (currentIndex != 0) {
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }
  }

  renderGame() {
    this.updateTitle();
    this.renderCompletedGroups();
    this.renderWordGrid();
    this.renderMistakes();
    this.renderButtons();
    this.updateMessage();
  }

  updateTitle() {
    const title = document.getElementById('game-title');
    if (this.words.length > 0) {
      title.textContent = 'Match four groups of four!';
    } else {
      title.textContent = '';
    }
  }

  renderCompletedGroups() {
    const container = document.getElementById('completed-groups');
    container.innerHTML = '';

    this.completedGroups.forEach((group) => {
      const groupDiv = document.createElement('div');
      groupDiv.className = 'grid-container-links fader';

      const groupLink = document.createElement('div');
      groupLink.className = `group-link ${
        this.words.length <= 0 ? 'hover' : ''
      }`;
      groupLink.style.backgroundColor = group.bgColor;

      if (this.words.length <= 0) {
        groupLink.addEventListener('click', (e) => {
          e.preventDefault();
          this.navigateToURL(group.link);
        });
      }

      const title = document.createElement('div');
      title.className = 'title';
      title.textContent = group.title;

      const desc = document.createElement('div');
      desc.className = 'desc';
      desc.textContent = group.description.join(', ');

      groupLink.appendChild(title);
      groupLink.appendChild(desc);
      groupDiv.appendChild(groupLink);
      container.appendChild(groupDiv);

      // No auto-resizing needed - completed groups use CSS sizing
    });
  }

  renderWordGrid() {
    const grid = document.getElementById('word-grid');
    grid.innerHTML = '';

    this.words.forEach((word) => {
      const wordBox = document.createElement('div');
      wordBox.className = 'word-box';

      const wordElement = document.createElement('div');

      // Add CSS class based on text length for styling
      // More generous thresholds for better readability
      let sizeClass = '';
      if (word.length <= 25)
        sizeClass = 'text-normal'; // Most words use normal size
      else if (word.length <= 35) sizeClass = 'text-medium'; // Longer words
      else sizeClass = 'text-small'; // Only extremely long words get smaller

      wordElement.className = `word ${sizeClass} ${
        this.selectedWords.includes(word) ? 'selected' : ''
      }`;
      wordElement.textContent = word;

      wordElement.addEventListener('click', (e) => {
        e.preventDefault();
        this.selectWord(word);
      });

      wordBox.appendChild(wordElement);
      grid.appendChild(wordBox);

      // No JavaScript resizing - use CSS only to prevent pulsating
    });
  }

  autoResizeTextForWordGrid(element, textLength) {
    // More conservative sizing to ensure text always fits
    let fontSize;
    if (textLength < 8) {
      fontSize = 15; // Short words - normal size
    } else if (textLength < 12) {
      fontSize = 14;
    } else if (textLength < 16) {
      fontSize = 13;
    } else if (textLength < 20) {
      fontSize = 12;
    } else if (textLength < 25) {
      fontSize = 11;
    } else if (textLength < 30) {
      fontSize = 10;
    } else {
      fontSize = 9; // Very long text - smallest readable size
    }

    // Set styles permanently to avoid hover conflicts
    element.style.setProperty('font-size', fontSize + 'px', 'important');
    element.style.setProperty('line-height', '1.0', 'important');
    element.style.setProperty('overflow', 'hidden', 'important');

    // Mark element as sized to prevent re-sizing
    element.dataset.sized = 'true';
  }

  smartResizeText(element) {
    // Skip if already resized to prevent pulsating
    if (element.dataset.resized === 'true') return;

    // Get container dimensions (subtract padding)
    const containerWidth = element.offsetWidth - 30; // 15px padding on each side
    const containerHeight = element.offsetHeight - 30; // 15px padding top/bottom

    if (containerWidth <= 0 || containerHeight <= 0) {
      // Retry if container not ready
      setTimeout(() => this.smartResizeText(element), 50);
      return;
    }

    // Start with a good base font size
    let fontSize = 15;
    element.style.setProperty('font-size', fontSize + 'px', 'important');
    element.style.setProperty('line-height', '1.1', 'important');
    element.style.setProperty('white-space', 'normal', 'important');
    element.style.setProperty('word-wrap', 'break-word', 'important');

    let iterations = 0;
    const maxIterations = 20;

    // Reduce font size until text fits
    while (
      (element.scrollWidth > containerWidth ||
        element.scrollHeight > containerHeight) &&
      fontSize > 8 &&
      iterations < maxIterations
    ) {
      fontSize--;
      element.style.setProperty('font-size', fontSize + 'px', 'important');
      iterations++;
    }

    // Ensure minimum readability
    if (fontSize < 10) {
      fontSize = 10;
      element.style.setProperty('font-size', fontSize + 'px', 'important');
    }

    // Lock the sizing to prevent future changes
    element.style.setProperty('overflow', 'hidden', 'important');
    element.dataset.resized = 'true';
  }

  renderMistakes() {
    const mistakesContainer = document.getElementById('mistakes');
    const mistakeHolder = document.getElementById('mistake-holder');

    // Hide mistakes container if no words left OR no guesses remaining
    if (this.words.length <= 0 || this.mistakesRemaining <= 0) {
      mistakesContainer.style.setProperty('display', 'none', 'important');
      mistakesContainer.style.setProperty('visibility', 'hidden', 'important');
      mistakesContainer.style.setProperty('opacity', '0', 'important');
      return; // Exit early
    }

    // Show mistakes container and render dots
    mistakesContainer.style.display = 'flex';
    mistakesContainer.style.visibility = 'visible';
    mistakesContainer.style.opacity = '1';
    mistakeHolder.innerHTML = '';

    // Create 4 dots, fill them based on mistakes remaining
    for (let i = 0; i < 4; i++) {
      const circle = document.createElement('div');
      circle.className = 'mistake-circle';

      // Show filled dot if this mistake hasn't been used yet
      if (i < this.mistakesRemaining) {
        circle.style.backgroundColor = 'black';
        circle.style.visibility = 'visible';
      } else {
        // Hide the dot completely when used
        circle.style.visibility = 'hidden';
      }

      mistakeHolder.appendChild(circle);
    }
  }

  highlightMistake() {
    const mistakesContainer = document.getElementById('mistakes');

    // Add error class for red highlighting and shake animation
    mistakesContainer.classList.add('error');

    // Remove error class after animation completes
    setTimeout(() => {
      mistakesContainer.classList.remove('error');
    }, 500);
  }

  renderButtons() {
    const gameButtons = document.getElementById('game-buttons');

    // Always hide game buttons since we have auto-submit
    if (gameButtons) {
      gameButtons.style.display = 'none';
    }
  }

  updateMessage() {
    const messageElement = document.getElementById('message');
    if (messageElement) {
      messageElement.textContent = this.message;
      // Show message when it has content, hide when empty
      if (this.message && this.message.trim() && this.message.trim() !== '') {
        messageElement.style.cssText =
          'display: block !important; visibility: visible !important; opacity: 1 !important; color: black !important; font-size: 18px !important; font-weight: 500 !important; margin: 1rem auto !important; text-align: center !important;';
      } else {
        // Hide the element completely when there's no message
        messageElement.style.cssText = 'display: none !important;';
      }
    }
  }

  bindEvents() {
    // No button events needed - using auto-submit behavior
  }

  selectWord(word) {
    if (this.selectedWords.includes(word)) {
      this.selectedWords = this.selectedWords.filter((w) => w !== word);
    } else {
      if (this.selectedWords.length < 4) {
        this.selectedWords.push(word);

        // Auto-submit when 4th word is selected
        if (this.selectedWords.length === 4) {
          this.renderWordGrid(); // Update UI first
          setTimeout(() => {
            this.submitGroup();
          }, 300); // Small delay to show selection before submitting
          return;
        }
      }
    }
    this.renderWordGrid();
  }

  deselectAll() {
    this.selectedWords = [];
    this.renderWordGrid();
  }

  submitGroup() {
    if (this.selectedWords.length === 4) {
      const isValidGroup = this.checkGroup(this.selectedWords);
      if (isValidGroup) {
        this.groupsFound += 1;
        this.message = `Match ${this.groupsFound} found!`;

        // Find the matching group
        const group = this.groupLinks.find((group) =>
          group.description.every((word) => this.selectedWords.includes(word))
        );
        this.completedGroups.push(group);

        // Remove selected words from the list
        this.words = this.words.filter(
          (word) => !this.selectedWords.includes(word)
        );
        this.selectedWords = [];
        this.testForWin();
      } else {
        this.message = 'Not a valid match. Try again!';
        this.mistakesRemaining -= 1;
        this.selectedWords = [];
        this.highlightMistake(); // Add red highlight and shake animation
        this.testForFail();
      }
      this.renderGame();
    }
  }

  checkGroup(selectedWords) {
    for (let group of this.validGroups) {
      if (group.every((word) => selectedWords.includes(word))) {
        // Remove group from valid groups to prevent duplicates
        this.validGroups = this.validGroups.filter((g) => g !== group);
        return true;
      }
    }
    return false;
  }

  testForFail() {
    if (this.mistakesRemaining <= 0) {
      this.message =
        'You have run out of mistakes. Here are the correct matches.';
      console.log('Fail state triggered, message set to:', this.message);
      this.words = [];
      this.completedGroups = this.groupLinks;
      this.renderGame();
    }
  }

  testForWin() {
    if (this.groupsFound === 4) {
      this.message = 'Congratulations! You found all the matches!';
      this.words = [];
      this.renderGame();
    }
  }

  navigateToURL(url) {
    if (this.words.length > 0) return; // don't allow links unless done (or failed)
    if (url === '#') return; // don't do anything if hashtag
    // In a real application, you would implement navigation here
  }

  autoResizeText(element, maxFontSize = 20, minFontSize = 4) {
    // Check if container has dimensions
    const containerWidth = element.parentElement.offsetWidth - 10; // 5px padding on each side
    const containerHeight = element.parentElement.offsetHeight - 10;

    if (containerWidth <= 0 || containerHeight <= 0) {
      setTimeout(
        () => this.autoResizeText(element, maxFontSize, minFontSize),
        50
      );
      return;
    }

    // Set initial styles with !important to override CSS
    element.style.setProperty('line-height', '1.0', 'important');
    element.style.setProperty('white-space', 'normal', 'important');
    element.style.setProperty('word-break', 'break-word', 'important');
    element.style.setProperty('overflow', 'hidden', 'important');

    // Start with max font size
    let fontSize = maxFontSize;
    element.style.setProperty('font-size', fontSize + 'px', 'important');

    let attempts = 0;
    const maxAttempts = 30;

    // Keep reducing font size while text overflows
    while (
      (element.scrollWidth > containerWidth ||
        element.scrollHeight > containerHeight) &&
      fontSize > minFontSize &&
      attempts < maxAttempts
    ) {
      fontSize = Math.max(fontSize - 1, minFontSize);
      element.style.setProperty('font-size', fontSize + 'px', 'important');
      attempts++;
    }
  }

  animateEntry() {
    // GSAP animation for entry
    if (typeof gsap !== 'undefined') {
      gsap.from('.fader', {
        stagger: { amount: 0.5, each: 0.1 },
        delay: 0.25,
        autoAlpha: 0,
        ease: 'power3.in',
        onComplete: () => {
          // Animation complete
          setTimeout(() => {
            document.querySelectorAll('.title, .desc').forEach((el) => {
              if (el.textContent.length > 50) {
                el.style.setProperty('font-size', '8px', 'important');
              }
            });
          }, 500);
        },
      });
    }
  }
}

// Initialize the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new ConnectionsGame();
});
