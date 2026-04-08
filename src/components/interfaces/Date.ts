

export const formatDateWithTime = (date:Date) => {
    // Day, month, year
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
  
    // Hours, minutes, AM/PM
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
  
    hours = hours % 12;
    hours = hours ? hours : 12; // The hour '0' should be '12'
  
    // Replace the string in the desired format
    return `${day}-${month}-${year} ${hours}:${minutes} ${ampm}`;
  };


export const formatDate = (date:Date)=>{
        // Day, month, year
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const year = date.getFullYear();
        return `${day}-${month}-${year}`
}

export const formatTime = (date:Date)=>{
     // Hours, minutes, AM/PM
     let hours = date.getHours();
     const minutes = String(date.getMinutes()).padStart(2, '0');
     const ampm = hours >= 12 ? 'PM' : 'AM';
     hours = hours % 12;
     hours = hours ? hours : 12; // The hour '0' should be '12'

    return `${hours}:${minutes} ${ampm}`;

}


export const parseDate = (dateString: string): Date => {
  // Split the date string into [day, month, year]
  const [day, month, year] = dateString.split('-').map(Number);

  // Create and return the Date object
  return new Date(year, month - 1, day); // month is zero-based
};


export function getDateBeforeDays(date:Date, daysBefore:number) {

  date.setDate(date.getDate() - daysBefore);

  return date
}

export function getDateAfterDays(date:Date, daysAfter:number) {

  date.setDate(date.getDate() + daysAfter);

  return date
}


export const mergeDateTime = (datePart: Date, timePart: Date): Date => {
  const newDate = new Date(
      datePart.getFullYear(), 
      datePart.getMonth(), 
      datePart.getDate(),
      timePart.getHours(), 
      timePart.getMinutes(), 
      timePart.getSeconds()
  );
  return newDate;
};





export {}