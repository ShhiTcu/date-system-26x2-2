const timeSymbols = [
    "a", "i", "z", "m",
    "h", "s", "b", "j",
    "g", "q", "f", "c"
];

let upperIndex = 0;

function createDial(elementId) {
    const dial = document.getElementById(elementId);

    timeSymbols.forEach(function (symbol, index) {
        const button = document.createElement("button");

        button.textContent = symbol;
        button.dataset.index = index;

        // 12個を円周上に配置
        const angle = index * 30 - 90;
        const radius = 90;

        const x =
            120 +
            radius * Math.cos(angle * Math.PI / 180) -
            20;

        const y =
            120 +
            radius * Math.sin(angle * Math.PI / 180) -
            20;

        button.style.left = x + "px";
        button.style.top = y + "px";

        dial.appendChild(button);
    });
}

createDial("upperDial");


// ==========================
// 上位ダイヤルの回転処理
// ==========================

const upperDial = document.getElementById("upperDial");

let dragging = false;
let startAngle = 0;
let currentRotation = 0;

upperDial.addEventListener("pointerdown", function (event) {
    dragging = true;

    upperDial.setPointerCapture(event.pointerId);

    startAngle = getPointerAngle(event);
});

upperDial.addEventListener("pointermove", function (event) {
    if (!dragging) {
        return;
    }

    const angle = getPointerAngle(event);
    const difference = angle - startAngle;

    currentRotation += difference;
    startAngle = angle;

    updateUpperDial();
});

upperDial.addEventListener("pointerup", function () {
    dragging = false;
});

upperDial.addEventListener("pointercancel", function () {
    dragging = false;
});


function getPointerAngle(event) {
    const rect = upperDial.getBoundingClientRect();

    const centerX =
        rect.left + rect.width / 2;

    const centerY =
        rect.top + rect.height / 2;

    const x =
        event.clientX - centerX;

    const y =
        event.clientY - centerY;

    return Math.atan2(y, x) * 180 / Math.PI;
}


function updateUpperDial() {
    upperDial.style.transform =
        "rotate(" + currentRotation + "deg)";

    const step =
        Math.round(currentRotation / 30);

    upperIndex =
        ((step % 12) + 12) % 12;

    updateTimeResult();
}


function updateTimeResult() {
    const lowerIndex = 0;

    const result =
        timeSymbols[upperIndex] +
        timeSymbols[lowerIndex];

    document.getElementById("timeResult").textContent =
        result;
}