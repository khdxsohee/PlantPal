document.addEventListener('DOMContentLoaded', () => {
    const addPlantForm = document.getElementById('add-plant-form');
    const plantList = document.getElementById('plant-list');
    const plantDetailsSection = document.getElementById('plant-details-section');
    const plantDetails = document.getElementById('plant-details');
    const LOCAL_STORAGE_KEY = 'plantCareTrackerPlants';
    let plants = loadPlants();
    let selectedPlantIndex = -1; // To keep track of the currently selected plant

    // Function to load plants from local storage
    function loadPlants() {
        const storedPlants = localStorage.getItem(LOCAL_STORAGE_KEY);
        return storedPlants ? JSON.parse(storedPlants) : [];
    }

    // Function to save plants to local storage
    function savePlants() {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(plants));
    }

    // Function to render the plant list
    function renderPlantList() {
        plantList.innerHTML = ''; // Clear the current list
        plants.forEach((plant, index) => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <span>${plant.name} (${plant.type || 'Unknown'})</span>
                <div class="plant-actions">
                    <button class="view-btn" data-index="${index}">View Details</button>
                    <button class="delete-btn" data-index="${index}">Delete</button>
                </div>
            `;
            listItem.addEventListener('click', () => showPlantDetails(index)); // Add click listener to the list item
            plantList.appendChild(listItem);
        });

        // Add event listeners to the delete buttons
        const deleteButtons = document.querySelectorAll('.delete-btn');
        deleteButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                event.stopPropagation(); // Prevent the list item click event
                const indexToDelete = parseInt(button.dataset.index);
                deletePlant(indexToDelete);
            });
        });

        // Add event listeners to the view details buttons
        const viewButtons = document.querySelectorAll('.view-btn');
        viewButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                event.stopPropagation(); // Prevent the list item click event
                const indexToView = parseInt(button.dataset.index);
                showPlantDetails(indexToView);
            });
        });

        // Hide the details section if no plant is selected
        if (selectedPlantIndex === -1) {
            plantDetailsSection.style.display = 'none';
        }
    }

    // Function to show plant details
    function showPlantDetails(index) {
        selectedPlantIndex = index;
        const plant = plants[index];
        plantDetails.innerHTML = `
            <p><strong>Name:</strong> ${plant.name}</p>
            <p><strong>Type:</strong> ${plant.type || 'Not specified'}</p>
            <p><strong>Watering Schedule:</strong> Every ${plant.wateringSchedule} day(s)</p>
            <p><strong>Fertilizing Schedule:</strong> Every ${plant.fertilizingSchedule > 0 ? plant.fertilizingSchedule + ' week(s)' : 'Not specified'}</p>
            <p><strong>Notes:</strong> ${plant.notes || 'No notes'}</p>
        `;
        plantDetailsSection.style.display = 'block';
    }

    // Function to add a new plant
    function addPlant(event) {
        event.preventDefault();

        const nameInput = document.getElementById('plant-name');
        const typeInput = document.getElementById('plant-type');
        const wateringScheduleInput = document.getElementById('watering-schedule');
        const fertilizingScheduleInput = document.getElementById('fertilizing-schedule');
        const notesInput = document.getElementById('notes');

        const newPlant = {
            name: nameInput.value,
            type: typeInput.value,
            wateringSchedule: parseInt(wateringScheduleInput.value),
            fertilizingSchedule: parseInt(fertilizingScheduleInput.value),
            notes: notesInput.value
        };

        plants.push(newPlant);
        savePlants();
        renderPlantList();
        addPlantForm.reset();
    }

    // Function to delete a plant
    function deletePlant(index) {
        plants.splice(index, 1);
        savePlants();
        renderPlantList();
        // Hide details section after deleting if the deleted plant was selected
        if (selectedPlantIndex === index) {
            plantDetailsSection.style.display = 'none';
            selectedPlantIndex = -1;
        } else if (selectedPlantIndex > index) {
            selectedPlantIndex--; // Adjust index if a plant before the selected one is deleted
        }
    }

    // Event listener for the add plant form submission
    addPlantForm.addEventListener('submit', addPlant);

    // Initial rendering of the plant list
    renderPlantList();
});