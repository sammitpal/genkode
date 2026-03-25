const ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const NUMERIC = "0123456789";
const ALPHANUM = ALPHA + NUMERIC;
function generate(length, charset) {
    let result = "";
    const max = charset.length;
    while (length > 0) {
        const index = Math.floor(Math.random() * max);
        result += charset[index];
        length--;
    }
    return result;
}
export function generateCode({ length, type = "alphanumeric" }) {
    if (type === "alpha")
        return generate(length, ALPHA);
    if (type === "numeric")
        return generate(length, NUMERIC);
    return generate(length, ALPHANUM);
}
export function randomString(length) {
    return generate(length, ALPHANUM);
}
export function randomAlpha(length) {
    return generate(length, ALPHA);
}
export function randomNumeric(length) {
    return generate(length, NUMERIC);
}
//# sourceMappingURL=index.js.map