// Catching commonly used elements to minimumize dom queries
const livePreview = document.getElementById("live-preview");
const htmlEditor = document.getElementById("html");
const cssEditor = document.getElementById("css");
const jsEditor = document.getElementById('js');

// function to setup the life preview iframe and include necessary scrips
function initializeLivePreview(){
    livePreview.contentWindow.document.body.innerHTML = "";
    const styleElement = document.createElement('style');
    styleElement.setAttribute('id', 'live-preview-style');
    livePreview.contentWindow.document.head.appendChild(styleElement);

    const pagedJsScript = document.createElement('script');
    pagedJsScript.src = 'https://unpkg.com/pagedjs/dist/paged.polyfill.legacy.js';
    livePreview.contentWindow.document.head.appendChild(pagedJsScript);
}

// function to update the live preview iframe with the html code from editor
function updateLiveHTMLPreview(codeEditors){
    livePreview.contentWindow.document.body.innerHTML = codeEditors.html.getValue();
}

// Function to update the live preview iframe with css code from editor
function updateLiveCSSPreview(codeEditors){
    const styleElement = livePreview.contentWindow.document.getElementById('live-preview-style');
    styleElement.innerHTML = codeEditors.css.getValue();
}

// Function to update the live preview iframe with js code from editor
function updateLiveJSPreview(codeEditors){
    const scriptElement = document.createElement('script');
    scriptElement.innerHTML = codeEditors.js.getValue();
    livePreview.contentWindow.document.body.appendChild(scriptElement);
}

// function to intialize codeMirror editors for html, css, and js
function initializeCodeEditors() {
    function getDefaultOptions(object){
        const defaultOptions = {
            lineNumbers: true,
            autoCloseTags: true,
            autoCloseBrackets: true,
            theme: 'panda-syntax'
        };
        if(object){
            const keys = Object.keys(object);
            for(const key of keys){
                defaultOptions[key] = object[key];
            }
        }
        return defaultOptions;
    }

    const codeEditors = {
        html: CodeMirror(htmlEditor, getDefaultOptions({
            mode: 'text/html',
            value: `<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Code Editor</title>
    </head>

    <body>

    </body>
</html>`,
        })),
        css: CodeMirror(cssEditor, getDefaultOptions({
            mode: 'css',
            value: `*{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}`,
            extraKeys: { 'Ctrl-Space': 'autocomplete'},
            hintOptions: {
                completeSingle: false,
                closeOnUnfocus: false
            }
        })),
        js: CodeMirror(jsEditor, getDefaultOptions({
            mode: 'javascript',
            value: `console.log('Loaded!');`
        })),
    };
    return codeEditors;
}

// function to set up the live preview studio with CodeMirror editors and event listeners
function setupLivePreviewStudio() {
    const codeEditors = initializeCodeEditors();

    // event listener for changes in HTML editor
    CodeMirror.on(codeEditors.html, 'change', ()=>{
        updateLiveHTMLPreview(codeEditors);
    });

    // event listener for changes in CSS editor
    CodeMirror.on(codeEditors.css, 'change', ()=>{
        updateLiveCSSPreview(codeEditors);
    });

    // event listener for changes in JS editor
    CodeMirror.on(codeEditors.js, 'change', ()=>{
        updateLiveJSPreview(codeEditors);
    });
}

// event listener to set up the live preview studio after the dom is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeLivePreview();
    setupLivePreviewStudio();
})