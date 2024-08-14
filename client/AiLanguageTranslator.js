const template = document.createElement('template');
import { languages } from "./languages.js";
const translationBaseUrl = "http://localhost:5000/";

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

    fetchData = async() => {
        const outputLanguage = this.shadowRoot.querySelector('#dropdown').value;
        const inputText = this.shadowRoot.querySelector('#text-box').value;

        if (!outputLanguage || !inputText) {
            alert('Please select a language and enter some text.');
            return;
        }


        
        try {
            const {detected_language: detectedLanguage } = await languageDetector( { text: inputText } );
            const inputLanguage = languages.filter( lang => lang.id.includes( detectedLanguage ) )[0];
            console.log( 'Detected Language:', inputLanguage.displayName );
            const translationResponse = await queryTranslation( inputText, inputLanguage.id, outputLanguage );
            console.log( 'translationResponse: ', translationResponse.translated_text );
            this.shadowRoot.querySelector('#result').textContent = `Translated text: ${translationResponse.translated_text}`;
        } catch (error) {
            this.shadowRoot.querySelector('#result').textContent = `Error: ${error.message}`;
        }
    }
}

const queryTranslation = async( input, inputLanguageId, outputLanguageId ) =>{
    const data = {
        src_lang: inputLanguageId,
        tgt_lang: outputLanguageId,
        text: input
    };
    try {
        const response = await fetch(
            `${translationBaseUrl}/translate`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify( data )
            }
        );
        if ( !response.ok ) {
            throw new Error( `HTTP error! status: ${response.status}` );
        }
        return await response.json();
    } catch ( error ) {
        console.error( 'Error during API call:', error );
        return null;
    }
};

const languageDetector = async( data ) =>{
    console.log( data );
    try {
        const response = await fetch(
            `${translationBaseUrl}/detect_language`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify( data )
            }
        );
        if ( !response.ok ) {
            throw new Error( `HTTP error! status: ${response.status}` );
        }
        return await response.json();
    } catch ( error ) {
        console.error( 'Error during API call:', error );
        return null;
    }
};

customElements.define('ai-language-translator', LanguageTranslator);