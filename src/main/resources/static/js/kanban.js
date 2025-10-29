// Drag and Drop functionality with enhanced animations
function allowDrop(ev) {
    ev.preventDefault();
    const column = ev.currentTarget.closest('.kanban-column');
    column.classList.add('drag-over');
    column.style.transform = 'scale(1.02)';
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.dataset.taskId);
    ev.target.classList.add('dragging');
    ev.target.style.transform = 'rotate(5deg) scale(0.95)';
    ev.target.style.opacity = '0.7';
}

function drop(ev) {
    ev.preventDefault();
    const taskId = ev.dataTransfer.getData("text");
    const columnId = ev.currentTarget.closest('.kanban-column').dataset.columnId;
    
    // Remove drag styling with animation
    document.querySelectorAll('.kanban-column').forEach(col => {
        col.classList.remove('drag-over');
        col.style.transform = '';
    });
    document.querySelectorAll('.task-card').forEach(task => {
        task.classList.remove('dragging');
        task.style.transform = '';
        task.style.opacity = '';
    });
    
    // Show loading state
    showLoadingState();
    
    // Move task via API
    moveTask(taskId, columnId);
}

// Enhanced API Functions with better user feedback
async function moveTask(taskId, columnId) {
    try {
        const response = await fetch(`/api/tasks/move?taskId=${taskId}&columnId=${columnId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            showSuccessMessage('Task moved successfully!');
            setTimeout(() => location.reload(), 800);
        } else {
            showErrorMessage('Failed to move task');
            hideLoadingState();
        }
    } catch (error) {
        console.error('Error moving task:', error);
        showErrorMessage('Error moving task');
        hideLoadingState();
    }
}

async function saveTask() {
    const title = document.getElementById('taskTitle').value.trim();
    const description = document.getElementById('taskDescription').value.trim();
    const userId = document.getElementById('taskUser').value;
    const columnId = document.getElementById('taskColumn').value;
    const priority = document.getElementById('taskPriority').value;
    
    if (!title || !userId || !columnId || !priority) {
        showErrorMessage('Please fill in all required fields');
        return;
    }
    
    const saveButton = document.querySelector('#taskModal .btn-primary');
    const originalText = saveButton.textContent;
    saveButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
    saveButton.disabled = true;
    
    const task = {
        title: title,
        description: description,
        user: { userId: parseInt(userId) },
        column: { columnId: parseInt(columnId) },
        priority: priority
    };
    
    try {
        const response = await fetch('/api/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(task)
        });
        
        if (response.ok) {
            showSuccessMessage('Task created successfully!');
            const modal = bootstrap.Modal.getInstance(document.getElementById('taskModal'));
            modal.hide();
            document.getElementById('taskForm').reset();
            location.reload();
        } else {
            showErrorMessage('Failed to create task');
        }
    } catch (error) {
        console.error('Error creating task:', error);
        showErrorMessage('Error creating task');
    } finally {
        saveButton.innerHTML = originalText;
        saveButton.disabled = false;
    }
}

async function deleteTask(button) {
    const taskId = button.dataset.taskId;
    const taskCard = button.closest('.task-card');
    const taskTitle = taskCard.querySelector('h6').textContent;
    
    if (confirm(`Are you sure you want to delete "${taskTitle}"?`)) {
        // Add loading state to button
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        button.disabled = true;
        
        // Add fade out animation to task card
        taskCard.style.transition = 'all 0.3s ease';
        taskCard.style.opacity = '0.5';
        taskCard.style.transform = 'scale(0.95)';
        
        try {
            const response = await fetch(`/api/tasks/${taskId}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                showSuccessMessage('Task deleted successfully!');
                taskCard.style.transform = 'scale(0) translateX(100px)';
                setTimeout(() => location.reload(), 800);
            } else {
                showErrorMessage('Failed to delete task');
                // Restore task card appearance
                taskCard.style.opacity = '';
                taskCard.style.transform = '';
            }
        } catch (error) {
            console.error('Error deleting task:', error);
            showErrorMessage('Error deleting task');
            taskCard.style.opacity = '';
            taskCard.style.transform = '';
        } finally {
            button.innerHTML = '<i class="fas fa-trash"></i>';
            button.disabled = false;
        }
    }
}

async function editTask(button) {
    const taskId = button.dataset.taskId;
    
    try {
        const response = await fetch(`/api/tasks/${taskId}`);
        if (response.ok) {
            const task = await response.json();
            
            // Populate form with task data
            document.getElementById('taskTitle').value = task.title;
            document.getElementById('taskDescription').value = task.description || '';
            document.getElementById('taskUser').value = task.user.userId;
            document.getElementById('taskColumn').value = task.column.columnId;
            document.getElementById('taskPriority').value = task.priority;
            
            // Change modal title and save button
            document.querySelector('#taskModal .modal-title').textContent = 'Edit Task';
            const saveButton = document.querySelector('#taskModal .btn-primary');
            saveButton.textContent = 'Update Task';
            saveButton.onclick = () => updateTask(taskId);
            
            // Show modal
            const modal = new bootstrap.Modal(document.getElementById('taskModal'));
            modal.show();
        }
    } catch (error) {
        console.error('Error fetching task:', error);
        alert('Error loading task details');
    }
}

async function updateTask(taskId) {
    const title = document.getElementById('taskTitle').value;
    const description = document.getElementById('taskDescription').value;
    const userId = document.getElementById('taskUser').value;
    const columnId = document.getElementById('taskColumn').value;
    const priority = document.getElementById('taskPriority').value;
    
    if (!title || !userId || !columnId || !priority) {
        alert('Please fill in all required fields');
        return;
    }
    
    const task = {
        title: title,
        description: description,
        user: { userId: parseInt(userId) },
        column: { columnId: parseInt(columnId) },
        priority: priority
    };
    
    try {
        const response = await fetch(`/api/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(task)
        });
        
        if (response.ok) {
            // Close modal and refresh page
            const modal = bootstrap.Modal.getInstance(document.getElementById('taskModal'));
            modal.hide();
            resetModal();
            location.reload();
        } else {
            alert('Failed to update task');
        }
    } catch (error) {
        console.error('Error updating task:', error);
        alert('Error updating task');
    }
}

function resetModal() {
    document.getElementById('taskForm').reset();
    document.querySelector('#taskModal .modal-title').textContent = 'Add New Task';
    const saveButton = document.querySelector('#taskModal .btn-primary');
    saveButton.textContent = 'Save Task';
    saveButton.onclick = saveTask;
}

// Reset modal when it's closed
document.getElementById('taskModal').addEventListener('hidden.bs.modal', resetModal);

// Remove drag styling when drag leaves
document.addEventListener('dragleave', function(e) {
    if (!e.relatedTarget || !e.currentTarget.contains(e.relatedTarget)) {
        document.querySelectorAll('.kanban-column').forEach(col => col.classList.remove('drag-over'));
    }
});

// Utility functions for better UX
function showLoadingState() {
    document.body.style.cursor = 'wait';
    document.querySelectorAll('.task-card').forEach(card => {
        card.style.pointerEvents = 'none';
        card.classList.add('loading');
    });
}

function hideLoadingState() {
    document.body.style.cursor = '';
    document.querySelectorAll('.task-card').forEach(card => {
        card.style.pointerEvents = '';
        card.classList.remove('loading');
    });
}

function showSuccessMessage(message) {
    showMessage(message, 'success');
}

function showErrorMessage(message) {
    showMessage(message, 'danger');
}

function showWarningMessage(message) {
    showMessage(message, 'warning');
}

function showInfoMessage(message) {
    showMessage(message, 'info');
}

// Enhanced form validation
function validateForm() {
    const requiredFields = ['taskTitle', 'taskUser', 'taskColumn', 'taskPriority'];
    let isValid = true;
    
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        const value = field.value.trim();
        
        if (!value) {
            field.classList.add('is-invalid');
            isValid = false;
        } else {
            field.classList.remove('is-invalid');
            field.classList.add('is-valid');
        }
    });
    
    return isValid;
}

// Add real-time validation
document.addEventListener('DOMContentLoaded', function() {
    const columnSelect = document.getElementById('taskColumn');
    if (columnSelect && columnSelect.options.length > 0) {
        columnSelect.selectedIndex = 0;
    }
    
    // Add input event listeners for real-time validation
    ['taskTitle', 'taskUser', 'taskColumn', 'taskPriority'].forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('input', function() {
                if (this.value.trim()) {
                    this.classList.remove('is-invalid');
                    this.classList.add('is-valid');
                } else {
                    this.classList.remove('is-valid');
                }
            });
        }
    });
    
    // Ensure task cards are visible
    document.querySelectorAll('.task-card').forEach((card) => {
        card.style.opacity = '1';
        card.style.visibility = 'visible';
        card.style.display = 'block';
    });
});

// Refresh board function
function refreshBoard() {
    const refreshBtn = document.querySelector('.btn-outline-secondary');
    const icon = refreshBtn.querySelector('i');
    
    // Add spinning animation
    icon.style.animation = 'spin 1s linear infinite';
    refreshBtn.disabled = true;
    
    // Show loading message
    showMessage('Refreshing board...', 'info');
    
    // Simulate refresh (in a real app, you might fetch updated data)
    setTimeout(() => {
        location.reload();
    }, 1000);
}

// Enhanced message function with info type
function showMessage(message, type) {
    // Remove existing alerts
    document.querySelectorAll('.alert').forEach(alert => alert.remove());
    
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alert.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    
    let icon = 'fas fa-info-circle';
    if (type === 'success') icon = 'fas fa-check-circle';
    if (type === 'danger') icon = 'fas fa-exclamation-circle';
    if (type === 'warning') icon = 'fas fa-exclamation-triangle';
    
    alert.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="${icon} me-2"></i>
            <span>${message}</span>
        </div>
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alert);
    
    // Auto-dismiss after 3 seconds (except for info messages)
    if (type !== 'info') {
        setTimeout(() => {
            if (alert.parentNode) {
                alert.classList.remove('show');
                setTimeout(() => alert.remove(), 150);
            }
        }, 3000);
    }
}

// Add dramatic floating elements
function createFloatingElements() {
    // Create large floating circles
    for (let i = 0; i < 12; i++) {
        const element = document.createElement('div');
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7', '#fd79a8'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        element.style.cssText = `
            position: fixed;
            width: ${Math.random() * 40 + 20}px;
            height: ${Math.random() * 40 + 20}px;
            background: ${color};
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            opacity: 0.3;
            animation: dramaticFloat ${Math.random() * 10 + 15}s ease-in-out infinite;
            animation-delay: ${Math.random() * 5}s;
            pointer-events: none;
            z-index: -1;
            filter: blur(2px);
        `;
        document.body.appendChild(element);
    }
    
    // Create moving geometric shapes
    for (let i = 0; i < 6; i++) {
        const shape = document.createElement('div');
        const shapes = ['◆', '▲', '●', '■', '★', '♦'];
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7', '#fd79a8'];
        
        shape.innerHTML = shapes[Math.floor(Math.random() * shapes.length)];
        shape.style.cssText = `
            position: fixed;
            font-size: ${Math.random() * 30 + 20}px;
            color: ${colors[Math.floor(Math.random() * colors.length)]};
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            opacity: 0.4;
            animation: rotateMove ${Math.random() * 20 + 25}s linear infinite;
            animation-delay: ${Math.random() * 8}s;
            pointer-events: none;
            z-index: -1;
        `;
        document.body.appendChild(shape);
    }
}

// Add CSS animation class
const style = document.createElement('style');
style.textContent = `
    .task-card {
        opacity: 1 !important;
        visibility: visible !important;
        display: block !important;
    }
    
    @keyframes dramaticFloat {
        0%, 100% { transform: translateY(0px) translateX(0px) scale(1) rotate(0deg); }
        25% { transform: translateY(-50px) translateX(30px) scale(1.2) rotate(90deg); }
        50% { transform: translateY(0px) translateX(-30px) scale(0.8) rotate(180deg); }
        75% { transform: translateY(50px) translateX(20px) scale(1.1) rotate(270deg); }
    }
    
    @keyframes rotateMove {
        0% { transform: translateX(-100px) translateY(0px) rotate(0deg); }
        25% { transform: translateX(calc(100vw + 100px)) translateY(-100px) rotate(90deg); }
        50% { transform: translateX(calc(100vw + 100px)) translateY(calc(100vh + 100px)) rotate(180deg); }
        75% { transform: translateX(-100px) translateY(calc(100vh + 100px)) rotate(270deg); }
        100% { transform: translateX(-100px) translateY(0px) rotate(360deg); }
    }
    
    .alert-info {
        background: linear-gradient(135deg, rgba(219, 234, 254, 0.9), rgba(191, 219, 254, 0.9));
        color: #1e40af;
        border-left: 4px solid #3b82f6;
    }
`;
document.head.appendChild(style);

// Initialize floating elements and add pulsing effect to body
document.addEventListener('DOMContentLoaded', function() {
    createFloatingElements();
    
    // Add pulsing glow effect to body
    setInterval(() => {
        document.body.style.filter = `hue-rotate(${Math.random() * 360}deg)`;
    }, 3000);
});