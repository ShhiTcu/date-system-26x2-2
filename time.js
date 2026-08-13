const timeSymbols = [
    "a", "i", "z", "m",
    "h", "s", "b", "j",
    "g", "q", "f", "c"
];

console.log("時間記号:", timeSymbols);


function createDial(elementId) {
    const dial = document.getElementById(elementId);

    console.log("ダイヤル:", elementId, dial);

    timeSymbols.forEach((symbol, index) => {
        const button = document.createElement("button");

        button.textContent = symbol;
        button.dataset.index = index;

        dial.appendChild(button);
    });
}


createDial("upperDial");
createDial("lowerDial");