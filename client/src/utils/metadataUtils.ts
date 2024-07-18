//temp solution
export function filterOutLetters(activityDetail: string | undefined): string {
    if(activityDetail == undefined){
        return "-";
    }

    const trimmedInput = activityDetail.trim();

    const letterPressedRegex = /^'[A-Za-z]' has been pressed\..*$/;
    if (letterPressedRegex.test(trimmedInput)) {
        return "-";
    }

    return activityDetail;
}