const template = document.createElement('template');
import { languages } from "./languages";
template.innerHTML = `
<style>
    /* Add your styles here */
    #container {
        display: flex;
        flex-direction: column;
        max-width: 300px;
        margin: 20px auto;
    }
    #dropdown {
        margin-bottom: 10px;
    }
</style>
<div id="container">
    <input type="text" id="text-box" placeholder="Enter something">
    <select id="dropdown">
        <option value="" disabled selected>Select a language</option>
        <option value="en">English</option>
        <option value="es">Spanish</option>
        <option value="fr">French</option>
        <option value="de">German</option>
    </select>
    <button id="fetch-button">Fetch Data</button>
    <div id="result"></div>
</div>
`;

class LanguageTranslator extends HTMLElement {
    constructor() {
        super();
        // Attach Shadow DOM
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        // Render the component
        this.render();
        // Add event listener for the button                
        this.shadowRoot.querySelector('#fetch-button').addEventListener('click', () => this.fetchData());
    }

    render() {
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        const selectElement = this.shadowRoot.getElementById('dropdown');

        languages.forEach(language => {
            const optionElement = document.createElement('option');
            optionElement.value = language.id;
            optionElement.textContent = language.displayName;
            selectElement.appendChild(optionElement);
        });
    }

    async fetchData() {
        const URL = url = "http://localhost:5000/";
        const selectedLanguage = this.shadowRoot.querySelector('#dropdown').value;
        const inputText = this.shadowRoot.querySelector('#text-box').value;

        if (!selectedLanguage || !inputText) {
            alert('Please select a language and enter some text.');
            return;
        }

        const url = `https://api.example.com/translate?lang=${selectedLanguage}&text=${encodeURIComponent(inputText)}`;
        
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            this.shadowRoot.querySelector('#result').textContent = `Translated text: ${data.translatedText}`;
        } catch (error) {
            this.shadowRoot.querySelector('#result').textContent = `Error: ${error.message}`;
        }
    }
}



customElements.define('ai-language-translator', LanguageTranslator);