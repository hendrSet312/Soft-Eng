function getDateSevenDaysAgo() {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); 
    return sevenDaysAgo.toISOString().split('T')[0];
}
  
function getCurrentDate(time = false) {
    const now = new Date().toISOString();
    if(time){
        return now;
    }
    return now.split('T')[0];
}

const parse_date = (date) => {
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

function unix_to_date(timestamp){
    const date = new Date(timestamp * 1000);
    return date.toISOString().split('T')[0];
}


export { getDateSevenDaysAgo, getCurrentDate , unix_to_date, parse_date};