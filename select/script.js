document.addEventListener('DOMContentLoaded', () => {
    // --- DOM 요소 가져오기 ---
    const calendarGrid = document.getElementById('calendarGrid');
    const currentYearMonthDisplay = document.getElementById('currentYearMonth');
    const prevMonthBtn = document.getElementById('prevMonthBtn');
    const nextMonthBtn = document.getElementById('nextMonthBtn');
    const ticketQuantitySelects = document.querySelectorAll('.ticket-quantity-select');
    const totalPriceEl = document.getElementById('totalPrice');

    const rightPanel = document.getElementById('rightPanel');
    const submitBtn = document.getElementById('submitBtn');

    // --- 상태 관리 ---
    let currentDate = new Date();
    let currentYear = currentDate.getFullYear();
    let currentMonth = currentDate.getMonth();
    let selectedDateCell = null;

    // --- 달력 렌더링 함수 ---
    const renderCalendar = (year, month) => {
        calendarGrid.innerHTML = '';
        currentYearMonthDisplay.textContent = `${year}년 ${month + 1}월`;
        const firstDay = new Date(year, month, 1).getDay();
        const lastDate = new Date(year, month + 1, 0).getDate();
        const days = ['일', '월', '화', '수', '목', '금', '토'];
        days.forEach(day => {
            const dayEl = document.createElement('div');
            dayEl.classList.add('calendar-header');
            dayEl.textContent = day;
            calendarGrid.appendChild(dayEl);
        });
        for (let i = 0; i < firstDay; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.classList.add('empty-cell');
            calendarGrid.appendChild(emptyCell);
        }
        for (let date = 1; date <= lastDate; date++) {
            const dateCell = document.createElement('div');
            dateCell.classList.add('date-cell');
            dateCell.textContent = date;
            const cellDate = new Date(year, month, date);
            if (cellDate < new Date().setHours(0, 0, 0, 0)) {
                dateCell.classList.add('disabled-cell');
            } else {
                dateCell.addEventListener('click', () => {
                    if (selectedDateCell) {
                        selectedDateCell.classList.remove('selected');
                    }
                    dateCell.classList.add('selected');
                    selectedDateCell = dateCell;
                    rightPanel.classList.remove('panel-disabled');
                });
            }
            calendarGrid.appendChild(dateCell);
        }
    };

    // --- 가격 계산 함수 ---
    const updateTotalPrice = () => {
        let totalPrice = 0;
        ticketQuantitySelects.forEach(select => {
            const quantity = parseInt(select.value);
            const price = parseInt(select.closest('.ticket-type-item').querySelector('.ticket-price').dataset.price);
            totalPrice += quantity * price;
        });
        totalPriceEl.textContent = `${totalPrice.toLocaleString()}원`;
        if (totalPrice > 0) {
            submitBtn.disabled = false;
        } else {
            submitBtn.disabled = true;
        }
    };

    // --- 이벤트 리스너 설정 ---
    prevMonthBtn.addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) { currentMonth = 11; currentYear--; }
        renderCalendar(currentYear, currentMonth);
    });
    nextMonthBtn.addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) { currentMonth = 0; currentYear++; }
        renderCalendar(currentYear, currentMonth);
    });
    ticketQuantitySelects.forEach(select => {
        select.addEventListener('change', updateTotalPrice);
    });

    // '좌석선택' 버튼 클릭 시 데이터 저장 및 페이지 이동
    submitBtn.addEventListener('click', () => {
        const orderItems = [];
        let finalTotalPrice = 0;
        let totalTickets = 0; // [추가] 총 티켓 매수 카운트

        ticketQuantitySelects.forEach(select => {
            const quantity = parseInt(select.value);
            totalTickets += quantity; // [추가]
            if (quantity > 0) {
                const itemElement = select.closest('.ticket-type-item');
                const name = itemElement.querySelector('.ticket-name').textContent;
                const price = parseInt(itemElement.querySelector('.ticket-price').dataset.price);
                orderItems.push({ name: name, quantity: quantity, price: price });
                finalTotalPrice += quantity * price;
            }
        });

        const orderData = {
            items: orderItems,
            totalPrice: finalTotalPrice,
            totalTickets: totalTickets // [추가] 총 티켓 매수 정보 저장
        };

        sessionStorage.setItem('orderData', JSON.stringify(orderData));

        // [변경] seat-select.html로 이동
        window.location.href = 'seat_select.html';
    });

    // --- 초기화 함수 ---
    const init = () => {
        renderCalendar(currentYear, currentMonth);
        updateTotalPrice();
        rightPanel.classList.add('panel-disabled');
    };
    init();
});