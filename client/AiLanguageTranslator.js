class LanguageTranslator extends HTMLElement {
  constructor() {
    super();
    this._language = 'en';
    this._text = '';
    this._translation = '';
    this._api = "";
    this.innerHTML = `I am a language translator`;
  }

}

customElements.define('ai-language-translator', LanguageTranslator);