const timeSymbols = [
    "a", "i", "z", "m",
    "h", "s", "b", "j",
    "g", "q", "f", "c"
];

const dialLayout = {
    outerSize: 270,
    innerSize: 180,

    upperSymbolRadius: 110,
    lowerSymbolRadius: 70,

    outerCenterX: 270 / 2,
    outerCenterY: 270 / 2
};
//中心を同一に変化させる
dialLayout.outerCenterX =
    dialLayout.outerSize / 2;

dialLayout.outerCenterY =
    dialLayout.outerSize / 2;

const lowerLeft =
    dialLayout.outerCenterX -
    dialLayout.innerSize / 2;

const lowerTop =
    dialLayout.outerCenterY -
    dialLayout.innerSize / 2;

document
    .getElementById("timeDial")
    .style
    .setProperty(
        "--lower-left",
        lowerLeft + "px"
    );

document
    .getElementById("timeDial")
    .style
    .setProperty(
        "--lower-top",
        lowerTop + "px"
    );

document
    .getElementById("timeDial")
    .style
    .setProperty(
        "--inner-size",
        dialLayout.innerSize + "px"
    );

const upperLeft =
    dialLayout.outerCenterX -
    dialLayout.outerSize / 2;

const upperTop =
    dialLayout.outerCenterY -
    dialLayout.outerSize / 2;

document
    .getElementById("timeDial")
    .style
    .setProperty(
        "--upper-left",
        upperLeft + "px"
    );

document
    .getElementById("timeDial")
    .style
    .setProperty(
        "--upper-top",
        upperTop + "px"
    );

document
    .getElementById("timeDial")
    .style
    .setProperty(
        "--upper-size",
        dialLayout.outerSize + "px"
    );

let upperIndex = 0;
let lowerIndex = 0;


function createDial(elementId) {
    const dial = document.getElementById(elementId);

    const dialSize =
    elementId === "upperDial"
        ? dialLayout.outerSize
        : dialLayout.innerSize;

    const centerX =
        dialSize / 2;

    const centerY =
        dialSize / 2;

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

    dial.rotation = 0;

    dial.addEventListener("pointerdown", function (event) {
        dragging = true;

        dial.setPointerCapture(event.pointerId);

        // 現在ダイヤルに設定されている角度を使う
        lastAngle =
            getPointerAngle(event, dial);

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

        dial.rotation += difference;

        lastAngle =
            currentAngle;

        // ドラッグ中はそのまま滑らかに回転
        dial.style.transform =
            "rotate(" + dial.rotation + "deg)";

        updateDialIndex(
            dial.rotation,
            type
        );

        updateTimeResult();

        event.preventDefault();
    });

    dial.addEventListener("pointerup", function (event) {
        if (!dragging) {
            return;
        }

        dragging = false;

        // 最も近い30°に吸着
        const snappedRotation =
            Math.round(dial.rotation / 30) * 30;

        dial.rotation =
            snappedRotation;

        dial.style.transition =
            "transform 0.12s ease-out";

        dial.style.transform =
            "rotate(" + dial.rotation + "deg)";

        updateDialIndex(
            dial.rotation,
            type
        );

        updateTimeResult();

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
            Math.round(dial.rotation / 30) * 30;

        dial.rotation =
            snappedRotation;

        dial.style.transition =
            "transform 0.12s ease-out";

        dial.style.transform =
            "rotate(" + dial.rotation + "deg)";

        updateDialIndex(
            dial.rotation,
            type
        );

        updateTimeResult();

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

    // 現在の回転角を更新
    upperDial.rotation = upperRotation;
    lowerDial.rotation = lowerRotation;

    // ダイヤルを実際に回す
    upperDial.style.transition =
        "transform 0.12s ease-out";

    lowerDial.style.transition =
        "transform 0.12s ease-out";

    upperDial.style.transform =
        "rotate(" + upperRotation + "deg)";

    lowerDial.style.transform =
        "rotate(" + lowerRotation + "deg)";

    // 時間記号の状態も更新
    updateDialIndex(
        upperRotation,
        "upper"
    )

    updateDialIndex(
        lowerRotation,
        "lower"
    );

    updateTimeResult();

    setTimeout(function () {
        upperDial.style.transition = "";
        lowerDial.style.transition = "";
    }, 120);
}


function createTimeOptions() {
    const hourInput =
        document.getElementById("hourInput");

    const minuteInput =
        document.getElementById("minuteInput");

    // 時：00～23
    for (let hour = 0; hour < 24; hour++) {
        const option =
            document.createElement("option");

        const hourText =
            String(hour).padStart(2, "0");

        option.value = hourText;
        option.textContent = hourText;

        hourInput.appendChild(option);
    }

    // 分：00～50（10分刻み）
    for (let minute = 0; minute < 60; minute += 10) {
        const option =
            document.createElement("option");

        const minuteText =
            String(minute).padStart(2, "0");

        option.value = minuteText;
        option.textContent = minuteText;

        minuteInput.appendChild(option);
    }
}


function setupTimeInput() {
    const hourInput =
        document.getElementById("hourInput");

    const minuteInput =
        document.getElementById("minuteInput");

    function updateFromTimeInput() {
        const hours =
            Number(hourInput.value);

        const minutes =
            Number(minuteInput.value);

        setDialFromTime(hours, minutes);
    }

    hourInput.addEventListener(
        "change",
        updateFromTimeInput
    );

    minuteInput.addEventListener(
        "change",
        updateFromTimeInput
    );
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

    // 時刻入力欄にも反映
    const hourInput =
        document.getElementById("hourInput");

    const minuteInput =
        document.getElementById("minuteInput");

    if (hourInput) {
        hourInput.value = hourText;
    }

    if (minuteInput) {
        minuteInput.value = minuteText;
    }
}


setupRotation("upperDial", "upper");
setupRotation("lowerDial", "lower");

updateTimeResult();

createTimeOptions();
setupTimeInput();