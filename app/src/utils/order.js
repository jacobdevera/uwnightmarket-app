// returns a shortened form of the order's ID for the purposes of displaying to the user
export const hash = (input) => {
    let count = 3;
    let res = "";
    let index = 6;
    let alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    while (count > 0 && index < input.length) {
        let c = input[index];
        if (alphabet.indexOf(c) != -1) {
            res += c;
            count--;
        }
        index++;
    }
    return res;
}