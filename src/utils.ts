export function removeInscritsDuplicates(data: { day: number, numberRegistered: number }[]): { day: number, numberRegistered: number }[] {
    const uniqueSet = new Set<string>();
    return data.filter(item => {
        const key = `${item.day}_${item.numberRegistered}`;
        if (!uniqueSet.has(key)) {
            uniqueSet.add(key);
            return true;
        }
        return false;
    });
}

export function removeVotesDuplicates(data: {listName: string, numberVotes: number, colorcode: string}[]): {listName: string, numberVotes: number, colorcode: string}[] {
    const uniqueSet = new Set<string>();
    return data.filter(item => {
        const key = `${item.listName}_${item.numberVotes}`;
        if (!uniqueSet.has(key)) {
            uniqueSet.add(key);
            return true;
        }
        return false;
    });
}