function dateToCode(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const isLeapYear =
        (year % 4 === 0 && year % 100 !== 0) ||
        (year % 400 === 0);

    // 2月29日
    if (month === 2 && day === 29) {
        return "i3'";
    }

    // 12月31日
    if (month === 12 && day === 31) {
        return "Z7'";
    }

    // 各月の日数
    const daysInMonth = [
        31,
        isLeapYear ? 29 : 28,
        31,
        30,
        31,
        30,
        31,
        31,
        30,
        31,
        30,
        31
    ];

    // 1月1日を1日目として計算
    let dayOfYear = day;

    for (let i = 0; i < month - 1; i++) {
        dayOfYear += daysInMonth[i];
    }

    // 閏年の2月29日を364日体系から除外
    if (isLeapYear && dayOfYear > 60) {
        dayOfYear--;
    }

    // 1～364 → 0～363
    const index = dayOfYear - 1;

    // 7日ごとに文字を進める
    const letterIndex = Math.floor(index / 7);
    const dayIndex = (index % 7) + 1;

    let letter;

    if (letterIndex < 26) {
        letter = String.fromCharCode(
            "a".charCodeAt(0) + letterIndex
        );
    } else {
        letter = String.fromCharCode(
            "A".charCodeAt(0) + (letterIndex - 26)
        );
    }

    return letter + dayIndex;
}



function codeToDate(code) {
    // 2月29日
    if (code === "i3'") {
        return "2/29";
    }

    // 12月31日
    if (code === "Z7'") {
        return "12/31";
    }

    const letter = code.charAt(0);
    const dayIndex = Number(code.slice(1));

    // 1～7以外は無効
    if (!Number.isInteger(dayIndex) || dayIndex < 1 || dayIndex > 7) {
    return null;
    }

    let letterIndex;

    if (letter >= "a" && letter <= "z") {
        letterIndex =
            letter.charCodeAt(0) - "a".charCodeAt(0);
    } else if (letter >= "A" && letter <= "Z") {
        letterIndex =
            letter.charCodeAt(0) - "A".charCodeAt(0) + 26;
    } else {
        return null;
    }

    // 364日体系での通算日
    const dayOfYear =
        letterIndex * 7 + dayIndex;

    const daysInMonth = [
        31, 28, 31, 30, 31, 30,
        31, 31, 30, 31, 30, 30
    ];

    let remaining = dayOfYear;

    for (let month = 1; month <= 12; month++) {
        if (remaining <= daysInMonth[month - 1]) {
            return month + "/" + remaining;
        }

        remaining -= daysInMonth[month - 1];
    }

    return null;
}

const dateInput = document.getElementById("dateInput");

    dateInput.addEventListener("change", function () {
    const date = new Date(this.value + "T00:00:00");
    const result = dateToCode(date);

    document.getElementById("result").textContent = result;
    });

const codeInput = document.getElementById("codeInput");

codeInput.addEventListener("input", function () {
    console.log("入力された値:", this.value);

    const result = codeToDate(this.value);
    console.log("変換結果:", result);

    document.getElementById("dateResult").textContent =
    this.value ? (result || "入力が正しくありません") : "";

});