document.addEventListener('DOMContentLoaded', () => {
  // Main script for the generator
  const numbersContainer = document.querySelector('.numbers');
  const generateBtn = document.querySelector('#generate');
  const visitorCount = document.querySelector('#visitor-count');
  const visitorNote = document.querySelector('#visitor-note');

  function updateVisitorCount() {
    let count = localStorage.getItem('visitCount');

    if (count === null) {
      count = 1;
    } else {
      count = parseInt(count, 10) + 1;
    }

    localStorage.setItem('visitCount', count);
    visitorCount.textContent = new Intl.NumberFormat('ko-KR').format(count);
    visitorNote.textContent = '현재 브라우저 기준 누적 횟수입니다.';
  }

  updateVisitorCount();

  generateBtn.addEventListener('click', () => {
    numbersContainer.innerHTML = '';
    const numbers = new Set();
    while (numbers.size < 6) {
      const randomNumber = Math.floor(Math.random() * 45) + 1;
      numbers.add(randomNumber);
    }

    for (const number of numbers) {
      const numberDiv = document.createElement('div');
      numberDiv.classList.add('number');
      
      if (number <= 10) numberDiv.classList.add('range-yellow');
      else if (number <= 20) numberDiv.classList.add('range-blue');
      else if (number <= 30) numberDiv.classList.add('range-red');
      else if (number <= 40) numberDiv.classList.add('range-gray');
      else numberDiv.classList.add('range-green');

      numberDiv.textContent = number;
      numbersContainer.appendChild(numberDiv);
    }
  });

  // ===== Test Script =====

  // Assertion function - moved to a higher scope
  function assert(condition, message) {
    if (!condition) {
      throw new Error(message || "Assertion failed");
    }
  }

  // Test cases
  const tests = {
    "should generate 6 unique numbers when the button is clicked": () => {
      const generateBtn = document.querySelector("#generate");
      generateBtn.click();
      const numberDivs = document.querySelectorAll(".number");
      const numbers = new Set(Array.from(numberDivs).map(div => parseInt(div.textContent, 10)));
      assert(numberDivs.length === 6, `Expected 6 numbers, but got ${numberDivs.length}`);
      assert(numbers.size === 6, `Expected 6 unique numbers, but got ${numbers.size}`);
    },
    "should generate numbers between 1 and 45": () => {
      const generateBtn = document.querySelector("#generate");
      generateBtn.click();
      const numberDivs = document.querySelectorAll(".number");
      const numbers = Array.from(numberDivs).map(div => parseInt(div.textContent, 10));
      const areNumbersInRange = numbers.every(num => num >= 1 && num <= 45);
      assert(areNumbersInRange, `Expected numbers to be between 1 and 45, but got: ${numbers.join(", ")}`);
    },
    "should clear previous numbers when generating new ones": () => {
      const generateBtn = document.querySelector("#generate");
      generateBtn.click(); // first generation
      generateBtn.click(); // second generation
      const numberDivs = document.querySelectorAll(".number");
      assert(numberDivs.length === 6, `Expected 6 numbers after second generation, but got ${numberDivs.length}`);
    },
    "should display the winning probabilities section": () => {
      const probabilitiesSection = document.querySelector(".probabilities");
      assert(probabilitiesSection !== null, "Probabilities section should exist");
      const listItems = probabilitiesSection.querySelectorAll("li");
      assert(listItems.length === 5, `Expected 5 probability items, but got ${listItems.length}`);
      assert(listItems[0].textContent.includes("1/8,145,060") || listItems[0].textContent.includes("1 / 8,145,060"), "1st prize probability should be correct");
    }
  };

  // Test runner function
  function runTests() {
      let failures = 0;
      const resultsContainer = document.querySelector("#test-results");
      resultsContainer.innerHTML = ''; // Clear previous results

      for (const testName in tests) {
        const testFunction = tests[testName];
        const resultDiv = document.createElement("div");
        resultDiv.classList.add("test-result");
        try {
          testFunction();
          resultDiv.textContent = `✅ ${testName}`;
          resultDiv.classList.add("success");
        } catch (error) {
          failures++;
          resultDiv.textContent = `❌ ${testName}: ${error.message}`;
          resultDiv.classList.add("failure");
        }
        resultsContainer.appendChild(resultDiv);
      }

      if(failures > 0) {
          console.error(`${failures} test(s) failed`);
      } else {
          console.log("All tests passed!");
      }
  }
  
  // Attach event listener
  document.getElementById('run-tests').addEventListener('click', runTests);
});
