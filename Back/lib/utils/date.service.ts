export const getCurrentDateTime = (): string => {
    const currentDate: Date = new Date();

    // ISO format (YYYY-MM-DDTHH:mm:ss.sssZ)
    return currentDate.toISOString();
}
