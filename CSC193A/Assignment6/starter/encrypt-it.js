/*
 * Starter file 
 */


(function () {
    "use strict";

    /**
     * The starting point in our program, setting up a listener
     * for the "load" event on the window, signalling the HTML DOM has been constructed
     * on the page. When this event occurs, the attached function (init) will be called.
     */
    // console.log("Window loaded!");
    window.addEventListener("load", init);

    /**
     * TODO: Write a function comment using JSDoc.
     */
    function handleClick() {
        console.log("Window loaded!");
        const text = document.getElementById('input-text').value;
        const encryptedText = shiftCipher(text);
        document.getElementById('result').textContent = encryptedText;
    }

    function handleReset() {
        document.getElementById('input-text').value = '';
        document.getElementById('result').textContent = '';
    }

    function shiftCipher(text) {
        let result = '';
        for (let i = 0; i < text.length; i++) {
            let char = text[i];
            if (char >= 'a' && char <= 'z') {
                result += String.fromCharCode((char.charCodeAt(0) - 'a'.charCodeAt(0) + 1) % 26 + 'a'.charCodeAt(0));
            } else if (char >= 'A' && char <= 'Z') {
                result += String.fromCharCode((char.charCodeAt(0) - 'A'.charCodeAt(0) + 1) % 26 + 'A'.charCodeAt(0));
            } else {
                result += char;
            }
        }
        return result;
    }

    function init() {
        // Note: In this function, we usually want to set up our event handlers
        // for UI elements on the page.
        document.getElementById('encrypt-it').addEventListener('click', handleClick);
        document.getElementById('reset').addEventListener('click', handleReset);
    }

    window.addEventListener('DOMContentLoaded', init);
    // Add any other functions in this area (you should not implement your
    // entire program in the init function, for similar reasons that
    // you shouldn't write an entire Java program in the main method).

})();
