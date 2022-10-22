//gomakethings.com/two-ways-to-set-an-elements-css-with-vanilla-javascript/
https: {
  /* <div id="some-element" style="color: purple; background-color: #e5e5e5; height: 150px;">
    Hello, world!
</div> */
}

// these are like my "States" here:

LENGTH = 100; //length of array.  Default is 100 (100 items).  BUT whenever generateNewArray (NOT createRandomArray) gets called, this length value gets reset to whatever is the current length slider input value (level).
const MAX_VALUE = 200; //Max value in array.  hardcoded
const UNIT = 500 / MAX_VALUE;
SPEED = 50; //initial sorting speed.
sorted = false;
ARR = createRandomArray(LENGTH, MAX_VALUE);
algorithm = ''; //current typee of sort;
let interval;
let animationIdx; // refers to index in the animations array
let animations; // will eventually look like this: ===> NESTED ARRAY ==> [   [1, 2], [1, 2], [1, 2],[3, 4],[3, 4],[3, 4], ...]   ]
let elementBars;
displayArray(ARR);

const speedRangeEl = document.getElementById('speedRange');
const lengthRangeEl = document.getElementById('lengthRange');
const speedValueEl = document.getElementById('speedRangeValue');
const lengthValueEl = document.getElementById('lengthRangeValue');

// FUNCTION TO CREATE A RANDOM ARRAY, THEN displayArray(new random array) USING THE value of the length range input (the length slider) as the # of 'bars', and max-value which is hardcoded above)
// this function is only triggered when click "generate new array"
function generateNewArray() {
  LENGTH = parseInt(lengthRangeEl.value);
  // aka the value of this --> <input type="range" min="5" max="200" value="100" class="slider" id="lenRange">
  ARR = createRandomArray(LENGTH, MAX_VALUE);
  clearArr();
  displayArray(ARR);
  sorted = false;
}

// callback function registered to the clicking event of each button in the sort-button corresponding to a sort.  ex. clicking the 'Bubble Sort' button triggers sort(this, 'bubble')
//	<button onclick="sort(this,'bubble')" class="sort-button" id="defaultOpen">Bubble Sort</button>
// 'this' as first arg ==> refers to the button element ==> we want to know "this" just so we can "disable" all the buttons other than 'this'
function sort(elm, type) {
  if (sorted === false) {
    disableButtons(); // disable all sort-button buttons
    elm.style.color = 'var(--theme-turquoise)'; // the clicked button gets a diff colored font (green) (differentiates it from the other buttons by saying "i'm the active sort")
    // route each 'type' arg to its matching sorting function and the value of the global constant 'algorithm' (to 'merge', or 'bubble' etc)
    switch (type) {
      case 'merge':
        mergeSort(ARR);
        algorithm = 'merge';
        break;
      case 'bubble':
        bubbleSort(ARR);
        algorithm = 'bubble';
        break;
      case 'selection':
        selectionSort(ARR);
        algorithm = 'selection';
        break;
      case 'insertion':
        insertionSort(ARR);
        algorithm = 'insertion';
        break;
      case 'quick':
        quickSort(ARR);
        algorithm = 'quick';
        break;
    }
  }
  /////////////////////////// testing out these:
  // enableButtons();
  // sorted = true;
  ////////////////
}

function mergeInterval(speed) {
  interval = setInterval(function () {
    if (animationIdx < animations.length) {
      const colorChange = animationIdx % 3 != 2;
      if (colorChange) {
        const [idx1, idx2] = animations[animationIdx];
        const color = animationIdx % 3 === 0 ? 'green' : 'black';
        if (elementBars[idx1] && elementBars[idx2]) {
          elementBars[idx1].style.backgroundColor = color;
          elementBars[idx2].style.backgroundColor = color;
        }
      } else {
        const [barOneIdx, newHeight] = animations[animationIdx];
        elementBars[barOneIdx].style.height = `${newHeight}px`;
      }

      animationIdx++;
    } else {
      enableButtons();
      sorted = true;
      clearInterval(interval);
    }
  }, SPEED);
}

function insertionInterval() {
  interval = setInterval(function () {
    if (animationIdx < animations.length) {
      //inserts the element at keyPos before the element at insertPos.
      const [keyPos, insertPos] = animations[animationIdx];
      var parent = elementBars[keyPos].parentNode;
      var elm = elementBars[keyPos];
      var insert = elementBars[insertPos];
      const colorChange = animationIdx % 3 != 2;
      if (colorChange) {
        const color = animationIdx % 3 === 0 ? 'green' : 'black';
        if (elm && insert) {
          elm.style.backgroundColor = color;
          insert.style.backgroundColor = color;
        }
      } else {
        parent.insertBefore(elm, insert);
      }
      animationIdx++;
    } else {
      enableButtons();
      sorted = true;
      clearInterval(interval);
    }
  }, SPEED);
}

//loops through the animations and shows the swapping.
function swappingAnimationsInterval() {
  interval = setInterval(function () {
    if (animationIdx < animations.length) {
      const [pos1, pos2] = animations[animationIdx]; // because these are always pairs remember
      var node1 = elementBars[pos1];
      var node2 = elementBars[pos2];
      const colorChange = animationIdx % 3 != 2; // see below

      if (colorChange) {
        // i.e. animationIdx is 1, 3,   4, 6,   7, 9
        const color = animationIdx % 3 === 0 ? 'green' : 'black'; // so color='green' when animationIdx is 0, 3, 6, 9...
        if (node1 && node2) {
          node1.style.backgroundColor = color;
          node2.style.backgroundColor = color;
        }
      } else {
        // i.e. when animationIdx 2, 5, 8, ... etc  ==> the "MIDDLE"
        swapNodes(node1, node2);
      }
      animationIdx++;
    } else {
      enableButtons();
      sorted = true;
      clearInterval(interval);
    }
  }, SPEED);
}

///////// THE VARIOUS SORTS //////

// PATTERN IS GENERALLY:
// function fooSort(arr)
//          THESE 3 PARTS HAPPEN FOR EVERY SORT, SO I WOULD REFACTOR OUT 1 & 3 to like a getBars or "reset" or some shit
//   1) set animationIdx = 0 // always
//   2) set animations = doFooSort(arr) // always
//   3) elementBars = document.body
//       .getElementsByClassName('box')[0]
//       .getElementsByClassName('array')[0]
//       .getElementsByClassName('elm')  // returns a live HTML collection -  array-like object of all child elements which have the classname elm
//  4) one of the following
// * swappingAnimationsInterval()  --> bubble, selection, quick
// * mergeInterval() --> merge
// * insertionInterval() --> insertion

// "sets" the elementBars state, which is initially [] to all the elements with className elm
const setElementBars = () => {
  elementBars = document.body.getElementsByClassName('elm');
};

function mergeSort(arr) {
  animationIdx = 0;
  animations = doMergeSort(arr); // 'animations' is the nested array with the all the triple pairs of indices that will come FROM the actual "doMergeSort fuction"
  setElementBars();

  mergeInterval();
}

function insertionSort(arr) {
  animationIdx = 0;
  setElementBars();
  animations = doInsertionSort(arr);
  insertionInterval();
}

function quickSort(arr) {
  clearArr();
  displayArray(ARR);
  setElementBars();
  animationIdx = 0;
  animations = [];
  quick(arr, 0, arr.length - 1);

  swappingAnimationsInterval();
}

function bubbleSort(arr) {
  setElementBars();
  animationIdx = 0;
  animations = doBubbleSort(arr);

  swappingAnimationsInterval();
}

function selectionSort(arr) {
  setElementBars();
  animations = doSelectionSort(arr);
  animationIdx = 0;

  swappingAnimationsInterval();
}

/////////////////////////////////////////////////////////////////
// ENABLING / DISABLING BUTTONS /////////////////////////////////
/////////////////////////////////////////////////////////////////

function disableButtons() {
  var buttons = document.getElementsByClassName('sort-button'); // these are ALL the buttons that say each sort (+ generate New Array button)
  // add various styling to each button element to make them look disabled
  console.log(buttons);
  // ALL THESE SEEM TO WORK:
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].disabled = true;
    buttons[i].style.opacity = '0.5';
    buttons[i].classList.add('noHover');
    buttons[i].style.color = '#6f6c72';
    // buttons[i].onmouseover = function () {
    //   buttons[i].style.color = 'white';
    // };
    // buttons[i].onmouseout = function () {
    //   buttons[i].style.color = 'var(--text-color)';
    // };
  }
}

function enableButtons() {
  var buttons = document.getElementsByClassName('sort-button');
  // restore all changes done by disableButtons
  console.log('inside enableButtons');

  // ALL THIS SEEMS TO WORK AS WELL
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].style.color = 'white';
    buttons[i].classList.remove('noHover');
    buttons[i].disabled = false;
    buttons[i].style.opacity = '1';
  }
}

/////////////////////////////////////////////////////////////////
// CLEAR / DISPLAY ARRAY/////// /////////////////////////////////
/////////////////////////////////////////////////////////////////

// gets rid of all the bars added by displayArray
function clearArr() {
  const myNode = document
    .getElementsByClassName('box')[0] // outer div
    .getElementsByClassName('array')[0]; // inner div
  while (myNode.firstChild) {
    myNode.removeChild(myNode.firstChild);
  }
}

// THIS IS THE FUNCTION THAT ADDS A div clss='elm' for every element in our array with a corresponding height attribute
// creates the bars corresponding visually to the array
function displayArray(arr) {
  // receives the array to visualize

  const arrayEl = document.getElementById('array');
  const arrayElComputedStyle = getComputedStyle(arrayEl);
  const arrayElWidth = arrayElComputedStyle.getPropertyValue('width'); // ex '1000 px'
  const arrayElHeight = arrayElComputedStyle.getPropertyValue('height'); // ex '600px'
  console.log(arrayElWidth);
  console.log(arrayElHeight);

  //https://zellwk.com/blog/css-values-in-js/#:~:text=First%2C%20you%20need%20to%20select,to%20get%20the%20element's%20styles.&text=If%20you%20log%20style%20%2C%20you,property%20and%20their%20respective%20values.&text=You%20can%20also%20see%20this%20object%20in%20Chrome's%20and%20Firefox's%20dev%20tools.
  //The style property only retrieves inlined CSS values while getComputedStyle style retrieves computed CSS values.
  // https://developer.mozilla.org/en-US/docs/Web/API/Window/getComputedStyle

  barWidth = parseInt(arrayElWidth) / LENGTH; //width of each bar
  barHeight = parseInt(arrayElHeight); //width of each bar
  for (i = 0; i < LENGTH; i++) {
    var elm = document.createElement('div');
    elm.className = 'elm';
    // percentage = (((500 / MAX_VALUE) * arr[i]) / 500) * 100; // she doesn't seem to use this value anywhere tho.
    elm.style.background =
      'linear-gradient(to bottom, var(--theme-turquoise), var(--bar-bottom-gradient))';
    elm.style.width = '' + barWidth + 'px'; // ex. '50px'; width is same for any bar
    elm.style.height = '' + (barHeight / MAX_VALUE) * arr[i] + 'px'; // height depends on the #
    document.body.getElementsByClassName('array')[0].appendChild(elm);
  }
} // so ex for displayArray([2, 4, 6]) ===> length is 3 ==> so you would get 3 if these things appended as child elements to the <div class='array'>

function updateSpeed() {
  // REsets (updates) the interval (speed) of the sort.
  if (interval) {
    clearInterval(interval);

    switch (algorithm) {
      case 'merge':
        mergeInterval();
        break;
      case 'bubble':
        swappingAnimationsInterval();
        break;
      case 'selection':
        swappingAnimationsInterval();
        break;
      case 'insertion':
        insertionInterval();
        break;
      case 'quick':
        swappingAnimationsInterval();
        break;
    }
  }
}

const showSpeedRangeValue = (val) => {
  console.log(val);
};

const showLengthRangeValue = (val) => {
  console.log(val);
};

/////////////////////////////////////////////////////////////////
// EVENT LISTENERS /////////////////////////////////
/////////////////////////////////////////////////////////////////

speedRangeEl.addEventListener('input', function (event) {
  showSpeedRangeValue(event.target.value);
  SPEED = 120 - parseInt(speedRangeEl.value);
  updateSpeed();
});

lengthRangeEl.addEventListener('input', function (event) {
  showLengthRangeValue(event.target.value);
  LENGTH = parseInt(lengthRangeEl.value);
});

addEventListener('resize', (event) => {
  clearArr();
  displayArray(ARR);
});
/* Added a event listener for a "resize" event ==> whenever a change in view size changes, clearArr and displayArray(ARR that we already have, NOT generate a new array) ==> SO THAT WE CAN HAVE ALL BARS RESIZE IN HEIGHT TO MATCH THE ARRAY CONTAINER HEIGHT!! The flex-grow only works along the main axis to resize the WIDTH of each bar, so I had to add this to execute bar HEIGHT resizing (basically my bars are fully responsive now) */
