class ColourSchemes {
  constructor() {
    // TODO: would be good to load them from a json file but this works for now
    this._schemes = [
      ['#e27d5f', '#85cdca', '#e8a87c', '#c38d9d', '#40b3a2'], // Pastel sandstorm
      ['#8e8741', '#659ebc', '#daad86', '#bd986b', '#fbeec1'], // Dirty Army
      ['#fc4444', '#3feee7', '#55bdca', '#96caef', '#cafafe'], // Blood on the Ice
      ['#1a1a1c', '#4e4e50', '#6f2232', '#950741', '#c3083f'], // Vampire Kiss
      ['#051e3e', '#251e3e', '#451e3e', '#651e3e', '#851e3e'], // Midnight Lover
      ['#0f4c81 ', '#082742', '#197ACF', '#11548F', '#0D3E69'] // Pantone Blues
    ]
  }
  getSchemeWithXColours(amountOfColours) {
    // TODO: return based on amount of colors
    return this._schemes[Math.floor(Math.random() * this._schemes.length)];
  }
}

const ColorSchemeController = new ColourSchemes();

class ColourScheme {
  constructor(...args) {
    this.colors = Array.from(args);
  }
}