const timeSymbols = [
    "a", "i", "z", "m",
    "h", "s", "b", "j",
    "g", "q", "f", "c"
];

const dialLayout = {
    center: 135,

    outerRadius: 135,
    innerRadius: 90,

    upperSymbolRadius: 110,
    lowerSymbolRadius: 70
};

let upperIndex = 0;
let lowerIndex = 0;


function createDial(elementId) {
    const dial = document.getElementById(elementId);

    const centerX = dial.offsetWidth / 2;
    const centerY = dial.offsetHeight / 2;

    const radius =
        elementId === "upperDial"
            ? dialLayout.upperSymbolRadius
            : dialLayout.lowerSymbolRadius;

    const buttonSize =
        elementId === "upperDial"
            ? 40
            : 36;

    timeSymbols.forEach(function (symbol, index) {
        const button = document.createElement("button");

        button.textContent = symbol;
        button.dataset.index = index;

        // 12個を円周上に配置
        const angle = index * 30 - 90;

        const x =
            centerX +
            radius *
            Math.cos(angle * Math.PI / 180) -
            buttonSize / 2 - 
            2;

        const y =
            centerY +
            radius *
            Math.sin(angle * Math.PI / 180) -
            buttonSize / 2 - 
            2;

        button.style.left = x + "px";
        button.style.top = y + "px";

        // 中心から外向き
        button.style.transform =
            "rotate(" + (angle + 90) + "deg)";

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

    dial.rotation = rotation;

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
        dial.rotation = rotation;

        lastAngle = currentAngle;

        // ドラッグ中はそのまま滑らかに回転
        dial.style.transform =
            "rotate(" + rotation + "deg)";

        // 現在の位置に対応する記号
        updateDialIndex(rotation, type);

        event.preventDefault();
    });

    dial.addEventListener("pointerup", function (event) {
        if (!dragging) {
            return;
        }

        dragging = false;

        // 最も近い30°に吸着
        const snappedRotation =
            Math.round(rotation / 30) * 30;

        rotation = snappedRotation;
        dial.rotation = rotation;

        dial.style.transition =
            "transform 0.12s ease-out";

        dial.style.transform =
            "rotate(" + rotation + "deg)";

        updateDialIndex(rotation, type);

        setTimeout(function () {
            dial.style.transition = "";
        }, 120);

        if (dial.hasPointerCapture(event.pointerId)) {
            dial.releasePointerCapture(event.pointerId);
        }
    });

    dial.addEventListener("pointercancel", function () {
        dragging = false;

        const snappedRotation =
            Math.round(rotation / 30) * 30;

        rotation = snappedRotation;
        dial.rotation = rotation;

        dial.style.transition =
            "transform 0.12s ease-out";

        dial.style.transform =
            "rotate(" + rotation + "deg)";

        updateDialIndex(rotation, type);

        setTimeout(function () {
            dial.style.transition = "";
        }, 120);
    });
}


function setDialFromTime(hours, minutes) {
    const totalUnits =
        hours * 6 +
        Math.floor(minutes / 10);

    const upperStep =
        Math.floor(totalUnits / 12);

    const lowerStep =
        totalUnits % 12;

    const upperRotation =
        upperStep * -30;

    const lowerRotation =
        lowerStep * -30;

    const upperDial =
        document.getElementById("upperDial");

    const lowerDial =
        document.getElementById("lowerDial");

    upperDial.style.transform =
        "rotate(" + upperRotation + "deg)";

    lowerDial.style.transform =
        "rotate(" + lowerRotation + "deg)";

    updateDialIndex(upperRotation, "upper");
    updateDialIndex(lowerRotation, "lower");
}


function setupTimeInput() {
    const timeInput =
        document.getElementById("timeInput");

    timeInput.addEventListener("change", function () {
        const [hours, minutes] =
            this.value.split(":").map(Number);

        setDialFromTime(hours, minutes);
    });
}


function updateDialIndex(rotation, type) {
    const step =
        Math.round(rotation / 30);

    const index =
        ((-step % 12) + 12) % 12;

    if (type === "upper") {
        upperIndex = index;
    } else {
        lowerIndex = index;
    }

    updateTimeResult();
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

    // 1日144単位
    const totalUnits =
        upperIndex * 12 + lowerIndex;

    // 1単位 = 10分
    const totalMinutes =
        totalUnits * 10;

    const hours =
        Math.floor(totalMinutes / 60);

    const minutes =
        totalMinutes % 60;

    const hourText =
        String(hours).padStart(2, "0");

    const minuteText =
        String(minutes).padStart(2, "0");

    document.getElementById("clockResult").textContent =
        hourText + ":" + minuteText;
}


setupRotation("upperDial", "upper");
setupRotation("lowerDial", "lower");

updateTimeResult();

setupTimeInput();

document.getElementById("timeInput").addEventListener("change", function () {
    const [hours, minutes] = this.value.split(":").map(Number);

    const totalUnits =
        hours * 6 +
        Math.floor(minutes / 10);

    const upperStep =
        Math.floor(totalUnits / 12);

    const lowerStep =
        totalUnits % 12;

    // ここでダイヤルを動かす
});