const timeSymbols = [
    "a", "i", "z", "m",
    "h", "s", "b", "j",
    "g", "q", "f", "c"
];

let upperIndex = 0;
let lowerIndex = 0;


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
createDial("lowerDial");


function setupRotation(dialId, type) {
    const dial = document.getElementById(dialId);

    let dragging = false;
    let startAngle = 0;
    let currentRotation = 0;

    dial.addEventListener("pointerdown", function (event) {
        dragging = true;

        dial.setPointerCapture(event.pointerId);

        startAngle = getPointerAngle(event, dial);
    });

    dial.addEventListener("pointermove", function (event) {
        if (!dragging) {
            return;
        }

        const angle = getPointerAngle(event, dial);
        let difference = angle - startAngle;

        if (difference > 180) {
            difference -= 360;
        }

        if (difference < -180) {
            difference += 360;
        }

        currentRotation += difference;
        startAngle = angle;

        const step = Math.round(currentRotation / 30);

        currentRotation = step * 30;

        dial.style.transform =
            "rotate(" + currentRotation + "deg)";

        const index =
            ((step % 12) + 12) % 12;

        if (type === "upper") {
            upperIndex = index;
        } else {
            lowerIndex = index;
        }

        updateTimeResult();
    });

    dial.addEventListener("pointerup", function (event) {
        dragging = false;

        if (dial.hasPointerCapture(event.pointerId)) {
            dial.releasePointerCapture(event.pointerId);
        }
    });

    dial.addEventListener("pointercancel", function () {
        dragging = false;
    });
}


function getPointerAngle(event, dial) {
    const rect = dial.getBoundingClientRect();

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


function updateTimeResult() {
    const result =
        timeSymbols[upperIndex] +
        timeSymbols[lowerIndex];

    document.getElementById("timeResult").textContent =
        result;
}


setupRotation("upperDial", "upper");
setupRotation("lowerDial", "lower");

updateTimeResult();