const template = document.createElement('template');
import { languages } from "./languages.js";
const translationBaseUrl = "http://localhost:5000/";

template.innerHTML = `
<style>
    /* General container styles */
    #container {
        display: flex;
        flex-direction: column;
        max-width: 400px;
        padding: 20px;
        margin: 40px auto;
        background: linear-gradient(135deg, #f06, #ff9e00);
        border-radius: 15px;
        box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
        font-family: 'Arial', sans-serif;
        color: #fff;
        text-align: center;
    }

    /* Input box styles */
    #input-text {
        padding: 20px 25px;
        border-radius: 10px;
        border: none;
        margin-bottom: 15px;
        font-size: 16px;
        outline: none;
        transition: all 0.3s ease;
    }
    #input-text:focus {
        box-shadow: 0px 0px 10px #ff9e00;
    }

    /* Dropdown styles */
    #dropdown {
        padding: 10px 15px;
        border-radius: 15px;
        border: none;
        margin-bottom: 20px;
        font-size: 16px;
        background-color: #fff;
        color: #333;
        outline: none;
        transition: all 0.3s ease;
    }
    #dropdown:focus {
        box-shadow: 0px 0px 10px #f06;
    }

    /* Button styles */
    #fetch-button {
        margin-top: 20px;
        padding: 12px 20px;
        border-radius: 25px;
        border: none;
        background: #333;
        color: #fff;
        font-size: 16px;
        cursor: pointer;
        transition: all 0.3s ease;
        outline: none;
    }
    #fetch-button:hover {
        background: #f06;
        box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.3);
    }
    #result {
        margin: auto;
        width: 50%;
        padding: 50px;
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.15);
        font-size: 18px;
        color: #ffffff;
        text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.4);
        border: 1px solid #444; 
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
    }
</style>
<div id="container">
    <textarea id="input-text" placeholder="Enter text that needs translation"></textarea>
    <select id="dropdown">
        <option value="" disabled selected>Select a language</option>
    </select>
    <button id="fetch-button">Fetch Data</button>
</div>
    <div id="result">Your translation will appear here...</div>

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
        const inputText = this.shadowRoot.querySelector('#input-text').value;

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
            this.shadowRoot.querySelector('#result').textContent = ` ${translationResponse.translated_text}`;
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