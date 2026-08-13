const timeSymbols = [
    "a", "i", "z", "m",
    "h", "s", "b", "j",
    "g", "q", "f", "c"
];

function createDial(elementId) {
    const dial = document.getElementById(elementId);

    timeSymbols.forEach((symbol, index) => {
        const button = document.createElement("button");

        button.textContent = symbol;
        button.dataset.index = index;

        // 12個を円周上に配置
        const angle = index * 30 - 90;
        const radius = 90;

        const x =
            120 + radius * Math.cos(angle * Math.PI / 180) - 20;

        const y =
            120 + radius * Math.sin(angle * Math.PI / 180) - 20;

        button.style.left = x + "px";
        button.style.top = y + "px";

        dial.appendChild(button);
    });
}

createDial("upperDial");
createDial("lowerDial");