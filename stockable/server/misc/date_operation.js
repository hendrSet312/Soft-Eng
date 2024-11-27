export function getDateSevenDaysAgo() {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // Subtract 7 days in milliseconds
    return sevenDaysAgo.toISOString().split('T')[0];
}

  
export function getCurrentDate() {
    const now = new Date();
    return new Date().toISOString().split('T')[0];
}

export const parse_date = (date) => {
    const parsedDate = new Date(date);
    return parsedDate.toLocaleString('default', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

export function unix_to_date(timestamp){
    const date = new Date(timestamp * 1000);
    return date.toISOString().split('T')[0];
}