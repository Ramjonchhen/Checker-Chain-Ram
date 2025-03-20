
export const quizPageTexts = [
    "Giving honest reviews increases your chance of earning by 83% [based on last 100 reviews].",
    "Don't forget to research the project thoroughly before reviewing.",
    "Top reviewers spent on average of 41 minutes to complete a review.",
    "93 % of dishonest or random answers fell into minority of tRCM protocol earning $0[based on last 100 reviews].",
    "Take your time to review all assigned project.This increases your chance to earn more in tRCM protocol.",
    "Influencers can upvote, downvote and flag your review. This can impact your profile score.",
    "Last month reviewers earned 2.25 million $CHECKR tokens.",
    "Project owners frequently add extra rewards for reviewers.Find out at the end of this review task.",
    "Make sure your profile is 100 % completed to qualify for earnings."
]

export const generateQuizPageTexts = (numberOfQuestions: number): string[] => {
    // first generate 7 random poistions between 0 and number of questions
    if (numberOfQuestions < 1) return [""]
    const minRangeValue = 1;
    const maxRangeValue = numberOfQuestions;

    const difference = maxRangeValue - minRangeValue;

    let randomPositionsArray: number[] = [];

    while (randomPositionsArray.length !== quizPageTexts.length) {
        const randomPosition = (Math.floor(Math.random() * difference)) + minRangeValue;
        if (!randomPositionsArray.includes(randomPosition)) {
            randomPositionsArray = [...randomPositionsArray, randomPosition]
        }
    }

    const myFinalArray: string[] = Array(numberOfQuestions).fill("");
    // then insert quizPageTexts one by one in those position
    //randompositonsarray and quizPageTexts will be equal from the above while loop
    randomPositionsArray.forEach((position, index) => {
        myFinalArray[position] = quizPageTexts[index]
    })

    return myFinalArray




}