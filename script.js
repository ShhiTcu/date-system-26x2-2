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

console.log(dateToCode(new Date(2026, 0, 1)));
console.log(dateToCode(new Date(2026, 0, 7)));
console.log(dateToCode(new Date(2026, 0, 8)));
console.log(dateToCode(new Date(2026, 1, 28)));
console.log(dateToCode(new Date(2026, 2, 1)));
console.log(dateToCode(new Date(2026, 11, 30)));
console.log(dateToCode(new Date(2026, 11, 31)));

console.log(dateToCode(new Date(2028, 1, 28)));
console.log(dateToCode(new Date(2028, 1, 29)));
console.log(dateToCode(new Date(2028, 2, 1)));