document.addEventListener('DOMContentLoaded', function() {
    let calendar = document.querySelector('.calendar');
    
    if (!calendar) {
        console.error("Calendar element not found");
      return;
    }
  
    const month_names = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
    // Create month list dropdown
    let month_list = calendar.querySelector('.month-list');
    
    // Clear any existing content
    month_list.innerHTML = '';

    function isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
      }
      
      function getFebDays(year) {
        return isLeapYear(year) ? 29 : 28;
      }


    function generateCalendar(month, year) {
        // Make sure we can find the calendar-days element
        let calendar_days = calendar.querySelector('.calendar-days');
        
        if (!calendar_days) {
            console.error('Calendar days element not found');
            return;
        }
        
        let calendar_header_year = calendar.querySelector('#year');
        
        let days_of_month = [31, getFebDays(year), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        
        // Clear the calendar days
        calendar_days.innerHTML = '';
        
        let currDate = new Date();
        if (month === undefined) month = currDate.getMonth();
        if (year === undefined) year = currDate.getFullYear();
        
        let curr_month = {value: currDate.getMonth()};
        month_picker.innerHTML = curr_month;
        calendar_header_year.innerHTML = year;
        

        // Get first day of month
        let first_day = new Date(year, month, 1);
        
        // Create empty cells for days before the first day of the month
        for (let i = 0; i < first_day.getDay(); i++) {
            let day = document.createElement('div');
            calendar_days.appendChild(day);
        }
        
        // Create cells for each day of the month
        for (let i = 1; i <= days_of_month[month]; i++) {
            let day = document.createElement('div');
            day.innerHTML = i;
            day.classList.add('calendar-day-hover');
            
            // Add spans for styling/hover effects
            day.innerHTML += `<span></span>
                             <span></span>
                             <span></span>
                             <span></span>`;
                             
            // Highlight current day
            if (i === currDate.getDate() && year === currDate.getFullYear() && month === currDate.getMonth()) {
                day.classList.add('curr-date');
            }
            
            calendar_days.appendChild(day);
        }
    }

    
    
    // Populate month dropdown
    month_names.forEach((e, index) => {
      let month = document.createElement('div');
      month.innerHTML = e;
      month.dataset.month = index; // Store month index as data attribute
      month.onclick = () => {
        month_list.style.display = 'none';
        curr_month.value = index;
        generateCalendar(index, curr_year.value);
      };
      month_list.appendChild(month);
    });
  
    // Toggle month dropdown
    let month_picker = calendar.querySelector('#month-picker');
    month_picker.onclick = () => {
      month_list.style.display = month_list.style.display === 'none' ? 'block' : 'none';
    };
  
    // Hide dropdown when clicking outside
    document.addEventListener('click', (event) => {
      if (!month_picker.contains(event.target) && !month_list.contains(event.target)) {
        month_list.style.display = 'none';
      }
    });
  
    // Rest of your calendar code...
    // (Keep your existing isLeapYear, getFebDays, and generateCalendar functions)
    
    // Initialize calendar
    let currDate = new Date();
    let curr_month = {value: currDate.getMonth()};
    let curr_year = {value: currDate.getFullYear()};
    
    generateCalendar(curr_month.value, curr_year.value);
    
    // Year navigation
    let prev_year = calendar.querySelector('#prev-year');
    let next_year = calendar.querySelector('#next-year');
    
    if (prev_year) {
      prev_year.onclick = () => {
        --curr_year.value;
        generateCalendar(curr_month.value, curr_year.value);
      };
    }
    
    if (next_year) {
      next_year.onclick = () => {
        ++curr_year.value;
        generateCalendar(curr_month.value, curr_year.value);
      };
    }
  });