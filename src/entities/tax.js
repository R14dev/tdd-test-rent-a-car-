class Tax {
  static get taxesBasedOnAge() {
    return [
      { form: 18, to: 25, then: 1.1 },
      { form: 26, to: 30, then: 1.5 },
      { form: 31, to: 100, then: 1.3 },
    ];
  }
}
module.exports = Tax;
