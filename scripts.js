let startTime;
let reactionTimes = [];
const maxAttempts = 3;
const reactionBox = $('#reactionBox');
const averageTimeDisplay = $('#averageTime');
const averageValue = $('#averageValue');
let attemptCount = 0;
let chart;

function resetUI() {
  reactionBox.removeClass('ready restart');
  reactionBox.html('<i class="fas fa-hand-pointer"></i> شروع بازی');
  averageTimeDisplay.addClass('hidden');
  reactionTimes = [];
  attemptCount = 0;
  if (chart) {
    chart.destroy();
    chart = null;
  }
  $('#reactionChart').remove();
  $('<canvas id="reactionChart"></canvas>').appendTo('.text-center');
}

function startReactionTest() {
  reactionBox.removeClass('restart');
  reactionBox.html('<i class="fas fa-hand-pointer"></i> صبر کنید...');
  const randomDelay = Math.floor(Math.random() * 3000) + 1000;

  setTimeout(() => {
    reactionBox.addClass('ready');
    reactionBox.html('<i class="fas fa-hand-pointer"></i> حالا کلیک کنید!');
    startTime = new Date().getTime();
  }, randomDelay);
}

function endReactionTest() {
  const endTime = new Date().getTime();
  const reactionTime = endTime - startTime;
  reactionTimes.push(reactionTime);
  attemptCount++;
  if (attemptCount >= maxAttempts) {
    showAverageTime();
    updateChart();
    reactionBox.html('<i class="fas fa-redo"></i> تلاش مجدد');
    reactionBox.addClass('restart');
  } else {
    reactionBox.removeClass('ready');
    reactionBox.html('<i class="fas fa-hand-pointer"></i> دوباره امتحان کنید!');
  }
}

function showAverageTime() {
  const averageTime = Math.round(
    reactionTimes.reduce((a, b) => a + b) / reactionTimes.length
  );
  averageValue.text(averageTime);
  averageTimeDisplay.removeClass('hidden');
}

function updateChart() {
  const ctx = document.getElementById('reactionChart').getContext('2d');
  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: reactionTimes.map((_, index) => `تلاش ${index + 1}`),
      datasets: [{
        label: 'زمان واکنش (میلی‌ثانیه)',
        data: reactionTimes,
        fill: true,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        pointBackgroundColor: reactionTimes.map(
          (_, i, arr) => i === arr.length - 1 ? 'red' : 'rgba(75, 192, 192, 1)'
        ),
        pointBorderColor: reactionTimes.map(
          (_, i, arr) => i === arr.length - 1 ? 'red' : 'rgba(75, 192, 192, 1)'
        ),
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 7,
      }],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          max: Math.max(...reactionTimes) + 100,
        },
      },
    },
  });
}

reactionBox.on('click', function () {
  if (reactionBox.hasClass('restart')) {
    resetUI();
  } else if (reactionBox.hasClass('ready')) {
    endReactionTest();
  } else if (attemptCount < maxAttempts) {
    startReactionTest();
  }
});