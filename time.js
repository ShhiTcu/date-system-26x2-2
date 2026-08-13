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
    let lastAngle = 0;
    let rotation = 0;


    dial.addEventListener("pointerdown", function (event) {
        dragging = true;

        dial.setPointerCapture(event.pointerId);

        lastAngle = getPointerAngle(event, dial);

        event.preventDefault();
    });


    dial.addEventListener("pointermove", function (event) {
        if (!dragging) {
            return;
        }

        const currentAngle =
            getPointerAngle(event, dial);

        let difference =
            currentAngle - lastAngle;

        // 180°をまたいだときの補正
        if (difference > 180) {
            difference -= 360;
        }

        if (difference < -180) {
            difference += 360;
        }

        rotation += difference;

        lastAngle = currentAngle;

        // 30°単位に吸着
        const step =
            Math.round(rotation / 30);

        const snappedRotation =
            step * 30;

        dial.style.transform =
            "rotate(" + snappedRotation + "deg)";


        const index =
            ((step % 12) + 12) % 12;


        if (type === "upper") {
            upperIndex = index;
        } else {
            lowerIndex = index;
        }

        updateTimeResult();

        event.preventDefault();
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
    const rect =
        dial.getBoundingClientRect();

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