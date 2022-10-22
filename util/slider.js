class Slider {
  constructor(rangeElement, options) {
    console.log(
      'constructor',
      'rangeElement is: ',
      rangeElement,
      'options is: ',
      options
    );
    this.rangeElement = rangeElement;
    this.options = options;

    // Attach a listener to "change" event
    this.rangeElement.addEventListener('input', this.updateSlider.bind(this));
  }

  // Initializes the slider with min, max, and current values
  init() {
    console.log('INIT');
    console.log(this.options);
    this.rangeElement.setAttribute('min', this.options.min);
    this.rangeElement.setAttribute('max', this.options.max);
    this.rangeElement.value = this.options.cur;

    this.updateSlider();
  }

  // creates a background style string
  generateBackground(rangeElement) {
    if (this.rangeElement.value === this.options.min) {
      return;
    }
    // this dynamic percentage is what adds the (purple) color to the colored part of the slider to match the actual value of the range input.
    let percentage =
      ((this.rangeElement.value - this.options.min) /
        (this.options.max - this.options.min)) *
      100;
    return (
      'background: linear-gradient(to right, #50299c, #7a00ff ' +
      percentage +
      '%, #B7B9F4 ' +
      percentage +
      '%, #D7D8EE 100%)'
    );
  }

  updateSlider() {
    console.log('UPDATESLIDER');
    this.rangeElement.style = this.generateBackground(this.rangeElement.value);
  }
}

const lengthRange = document.getElementById('lengthRange');

const speedRange = document.getElementById('speedRange');

const speedRangeOptions = {
  min: 1,
  max: 100,
  cur: 50,
};

const lengthRangeOptions = { min: 2, max: 200, cur: 100 };

if (speedRange) {
  let speedSlider = new Slider(speedRange, speedRangeOptions); // SLIDER FOR LENGTH
  console.log(speedSlider);
  speedSlider.init();
}

if (lengthRange) {
  let lengthSlider = new Slider(lengthRange, lengthRangeOptions); // SLIDER FOR SPEED
  console.log(lengthSlider);
  lengthSlider.init();
}
