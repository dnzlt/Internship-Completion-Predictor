function addCustomHoliday() {
    const container = document.getElementById('custom-holidays-container');
    const newItem = document.createElement('div');
    newItem.className = 'custom-holiday-item';
    newItem.innerHTML = `
        <input type="date" class="custom-holiday-input" placeholder="Select date">
        <input type="text" class="custom-holiday-name" placeholder="Holiday name (e.g., College Week)">
        <button type="button" class="btn btn-sm btn-danger" onclick="removeCustomHoliday(this)">Remove</button>
    `;
    container.appendChild(newItem);
}

function removeCustomHoliday(button) {
    button.parentElement.remove();
}

function calculateFinishDate() {
    // Get input values
    const startDateInput = document.getElementById('start_date').value;
    const duration = parseInt(document.getElementById('duration').value);
    const hoursPerWeek = parseInt(document.getElementById('hours_per_week').value);

    // Validate inputs
    if (!startDateInput || !duration || !hoursPerWeek) {
        alert('Please fill in all fields');
        return;
    }

    // Get selected days
    const selectedDays = [];
    const dayCheckboxes = document.querySelectorAll('input[name="day"]:checked');
    
    if (dayCheckboxes.length === 0) {
        alert('Please select at least one day');
        return;
    }

    dayCheckboxes.forEach(checkbox => {
        selectedDays.push(checkbox.value);
    });

    // Get selected holidays
    const selectedHolidays = [];
    const holidayCheckboxes = document.querySelectorAll('input[name="holiday"]:checked');
    
    holidayCheckboxes.forEach(checkbox => {
        selectedHolidays.push(checkbox.value);
    });

    // Get custom holidays
    const customHolidays = [];
    const customHolidayItems = document.querySelectorAll('.custom-holiday-item');
    
    customHolidayItems.forEach(item => {
        const dateInput = item.querySelector('.custom-holiday-input');
        const nameInput = item.querySelector('.custom-holiday-name');
        
        if (dateInput.value) {
            customHolidays.push(dateInput.value);
        }
    });

    // Combine all holidays
    const allHolidays = [...selectedHolidays, ...customHolidays];

    // Calculate hours per day
    const hoursPerDay = hoursPerWeek / selectedDays.length;

    // Convert day names to numbers (0 = Sunday, 1 = Monday, etc.)
    const dayToNumber = {
        'Sunday': 0,
        'Monday': 1,
        'Tuesday': 2,
        'Wednesday': 3,
        'Thursday': 4,
        'Friday': 5,
        'Saturday': 6
    };

    const selectedDayNumbers = selectedDays.map(day => dayToNumber[day]);

    // Start date
    let currentDate = new Date(startDateInput);
    let hoursRemaining = duration;

    // Calculate finish date
    while (hoursRemaining > 0) {
        const dayOfWeek = currentDate.getDay();
        const currentDateString = currentDate.toISOString().split('T')[0];
        
        // Check if current date is a selected working day and not a holiday
        if (selectedDayNumbers.includes(dayOfWeek) && !allHolidays.includes(currentDateString)) {
            hoursRemaining -= hoursPerDay;
        }
        
        if (hoursRemaining > 0) {
            currentDate.setDate(currentDate.getDate() + 1);
        }
    }

    // Format and display result
    const finishDate = currentDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const resultDiv = document.getElementById('result');
    const totalExcludedDays = selectedHolidays.length + customHolidays.length;
    
    let customHolidaysDisplay = '';
    if (customHolidays.length > 0) {
        const customHolidayNames = [];
        document.querySelectorAll('.custom-holiday-item').forEach(item => {
            const nameInput = item.querySelector('.custom-holiday-name');
            if (nameInput.value) {
                customHolidayNames.push(nameInput.value);
            }
        });
        customHolidaysDisplay = `<p><strong>Custom Holidays:</strong> ${customHolidayNames.join(', ')}</p>`;
    }
    
    resultDiv.innerHTML = `
        <p><strong>Starting Date:</strong> ${new Date(startDateInput).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        <p><strong>Working Days:</strong> ${selectedDays.join(', ')}</p>
        <p><strong>Total Duration:</strong> ${duration} hours</p>
        <p><strong>Hours per Day:</strong> ${hoursPerDay.toFixed(2)} hours</p>
        <p><strong>Total Excluded Days:</strong> ${totalExcludedDays}</p>
        ${customHolidaysDisplay}
        <p><strong>Estimated Finish Date:</strong> <span style="color: green; font-weight: bold;">${finishDate}</span></p>
    `;

    // Show the modal
    const resultModal = new bootstrap.Modal(document.getElementById('resultModal'));
    resultModal.show();
}

// Allow Enter key to calculate
document.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        calculateFinishDate();
    }
});
