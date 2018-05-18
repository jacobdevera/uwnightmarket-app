export const sortByBoothNumber = (a, b) => a.boothNumber - b.boothNumber;

export const sortByName = (a, b) => a.name.localeCompare(b.name);

export const sortByParticipating = (a, b) => {
    if (a.canOrder && !b.canOrder) {
        return -1;
    } else if (!a.canOrder && b.canOrder) {
        return 1;
    } else {
        return sortByName(a, b);
    }
}