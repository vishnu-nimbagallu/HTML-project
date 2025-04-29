// Global variables for media streams
let localStream = null;
let isCameraEnabled = false;
let isMicEnabled = false;

// Hide permissionDialog before login
document.getElementById('permissionDialog').style.display = 'none';

// Simple login functionality
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Simple validation
    if (email && password) {
        // Add loading effect to button
        const btn = e.target.querySelector('button');
        btn.innerHTML = '<span class="spinner"></span> Logging in...';
        btn.disabled = true;
        
        // Simulate network request
        setTimeout(() => {
            // Hide login page, show platform
            document.getElementById('loginPage').style.display = 'none';
            document.getElementById('platform').style.display = 'block';

            // Show camera permission dialog AFTER login
            document.getElementById('permissionDialog').style.display = 'flex';

            document.getElementById('loginPage').style.display = 'none';
            document.getElementById('platform').style.display = 'block';
            
            // Show camera permission dialog
            document.getElementById('permissionDialog').style.display = 'flex';
            
            // In a real app, you would verify credentials with a server
            console.log('Login attempt with:', email, password);
        }, 1500);
    } else {
        // Shake animation for empty fields
        if (!email) {
            document.getElementById('email').style.animation = 'shake 0.5s';
            setTimeout(() => {
                document.getElementById('email').style.animation = '';
            }, 500);
        }
        if (!password) {
            document.getElementById('password').style.animation = 'shake 0.5s';
            setTimeout(() => {
                document.getElementById('password').style.animation = '';
            }, 500);
        }
        alert('Please enter both email and password');
    }
});

// Request camera and microphone access
document.getElementById('allowAccessBtn').addEventListener('click', async function() {
    try {
        // Request camera and microphone access
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        });
        
        // Store the local stream
        localStream = stream;
        isCameraEnabled = true;
        isMicEnabled = true;
        
        // Hide permission dialog
        document.getElementById('permissionDialog').style.display = 'none';
        
        // Update button states
        document.getElementById('muteBtn').textContent = '🎤';
        document.getElementById('videoBtn').textContent = '📹';
        
        // Add local video to the video container
        addLocalVideoStream(stream);
        
        // Load default room
        loadRoomParticipants('cs-group');
        
        // Show notification
        showNotification('Camera and microphone enabled');
    } catch (error) {
        console.error('Error accessing media devices:', error);
        showNotification('Could not access camera/microphone');
        document.getElementById('permissionDialog').style.display = 'none';
        loadRoomParticipants('cs-group');
    }
});

// Continue without video option
document.getElementById('continueWithoutBtn').addEventListener('click', function() {
    document.getElementById('permissionDialog').style.display = 'none';
    isCameraEnabled = false;
    isMicEnabled = false;
    
    // Update button states
    document.getElementById('muteBtn').textContent = '🔇';
    document.getElementById('muteBtn').style.backgroundColor = '#ffc107';
    document.getElementById('muteBtn').style.color = 'white';
    
    document.getElementById('videoBtn').textContent = '📷';
    document.getElementById('videoBtn').style.backgroundColor = '#ffc107';
    document.getElementById('videoBtn').style.color = 'white';
    
    // Load default room without video
    loadRoomParticipants('cs-group');
    showNotification('Continuing without video');
});

// Function to add local video stream
function addLocalVideoStream(stream) {
    const videoContainer = document.getElementById('videoContainer');
    
    // Create video element
    const videoElement = document.createElement('video');
    videoElement.srcObject = stream;
    videoElement.autoplay = true;
    videoElement.muted = true; // Mute local video to avoid echo
    
    // Create video participant container
    const participantDiv = document.createElement('div');
    participantDiv.className = 'video-participant';
    participantDiv.style.border = '2px solid var(--accent-color)';
    
    // Add status indicator
    const statusDiv = document.createElement('div');
    statusDiv.className = 'status';
    
    // Add name label
    const nameDiv = document.createElement('div');
    nameDiv.className = 'name';
    nameDiv.textContent = 'You (John)';
    
    // Append elements
    participantDiv.appendChild(videoElement);
    participantDiv.appendChild(statusDiv);
    participantDiv.appendChild(nameDiv);
    
    // Add to container
    videoContainer.appendChild(participantDiv);
}

// Tab switching functionality
const tabs = document.querySelectorAll('.tab');
const collabContent = document.getElementById('collabContent');

tabs.forEach(tab => {
    tab.addEventListener('click', function() {
        tabs.forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        
        // Change content based on tab
        const tabName = this.getAttribute('data-tab');
        switch(tabName) {
            case 'documents':
                collabContent.innerHTML = `
                    <div class="document">
                        <h4>Algorithms Study Notes</h4>
                        <div class="document-meta">
                            <span>Uploaded by Disha</span>
                            <span>•</span>
                            <span>2 hours ago</span>
                        </div>
                        <p>Notes from our last session covering sorting algorithms and complexity analysis.</p>
                        <div class="document-actions">
                            <button>View</button>
                            <button>Edit</button>
                            <button>Download</button>
                        </div>
                    </div>
                    <div class="document">
                        <h4>Problem Set Solutions</h4>
                        <div class="document-meta">
                            <span>Uploaded by Swamy</span>
                            <span>•</span>
                            <span>Yesterday</span>
                        </div>
                        <p>Solved problems from chapters 3-5 with detailed explanations.</p>
                        <div class="document-actions">
                            <button>View</button>
                            <button>Edit</button>
                            <button>Download</button>
                        </div>
                    </div>
                    <div class="resource-upload" id="uploadArea">
                        <p>Drag and drop files here to share with the group</p>
                        <button class="btn" style="width: auto; margin-top: 0.5rem;">Browse Files</button>
                    </div>
                `;
                break;
            case 'whiteboard':
                collabContent.innerHTML = `
                    <div style="text-align: center; padding: 2rem;">
                        <h3 style="color: var(--primary-color); margin-bottom: 1rem;">Collaborative Whiteboard</h3>
                        <p style="margin-bottom: 1.5rem;">Draw, write, and brainstorm together in real-time</p>
                        <div style="background-color: #f8f9fa; border-radius: var(--border-radius); height: 300px; display: flex; justify-content: center; align-items: center; margin-bottom: 1rem;">
                            <p style="color: #666;">Whiteboard canvas will appear here</p>
                        </div>
                        <button class="btn" style="width: auto;">Start Whiteboard Session</button>
                    </div>
                `;
                break;
            case 'chat':
                collabContent.innerHTML = `
                    <div style="display: flex; flex-direction: column; height: 100%;">
                        <div style="flex: 1; overflow-y: auto; padding: 1rem; border-bottom: 1px solid #eee;">
                            <div style="margin-bottom: 1rem;">
                                <div style="font-weight: bold; color: var(--primary-color);">Sarah (2:15 PM)</div>
                                <div style="background-color: #f0f2f5; padding: 0.5rem; border-radius: 0 var(--border-radius) var(--border-radius) var(--border-radius); display: inline-block; max-width: 70%;">
                                    Has everyone finished reviewing the sorting algorithms?
                                </div>
                            </div>
                            <div style="margin-bottom: 1rem; text-align: right;">
                                <div style="font-weight: bold; color: var(--accent-color);">You (2:16 PM)</div>
                                <div style="background-color: var(--primary-color); color: white; padding: 0.5rem; border-radius: var(--border-radius) 0 var(--border-radius) var(--border-radius); display: inline-block; max-width: 70%;">
                                    Yes, I have. The merge sort explanation was particularly helpful.
                                </div>
                            </div>
                            <div style="margin-bottom: 1rem;">
                                <div style="font-weight: bold; color: var(--primary-color);">Michael (2:18 PM)</div>
                                <div style="background-color: #f0f2f5; padding: 0.5rem; border-radius: 0 var(--border-radius) var(--border-radius) var(--border-radius); display: inline-block; max-width: 70%;">
                                    I'm still working on the quick sort implementation. Anyone available to help?
                                </div>
                            </div>
                        </div>
                        <div style="padding: 1rem;">
                            <div style="display: flex;">
                                <input type="text" placeholder="Type your message..." style="flex: 1; padding: 0.8rem; border: 1px solid #ddd; border-radius: var(--border-radius) 0 0 var(--border-radius); border-right: none;">
                                <button class="btn" style="width: auto; border-radius: 0 var(--border-radius) var(--border-radius) 0;">Send</button>
                            </div>
                        </div>
                    </div>
                `;
                break;
            case 'resources':
                collabContent.innerHTML = `
                    <div style="margin-bottom: 1rem;">
                        <h3 style="color: var(--primary-color); margin-bottom: 0.5rem;">Study Resources</h3>
                        <p style="color: #666; margin-bottom: 1rem;">Helpful materials shared by your group</p>
                    </div>
                    <div class="document">
                        <h4>Algorithms Textbook (PDF)</h4>
                        <div class="document-meta">
                            <span>Uploaded by Sarah</span>
                            <span>•</span>
                            <span>3 days ago</span>
                            <span>•</span>
                            <span>15.4 MB</span>
                        </div>
                        <p>Complete textbook covering fundamental algorithms and data structures.</p>
                        <div class="document-actions">
                            <button>View</button>
                            <button>Download</button>
                        </div>
                    </div>
                    <div class="document">
                        <h4>Practice Problems Collection</h4>
                        <div class="document-meta">
                            <span>Uploaded by Michael</span>
                            <span>•</span>
                            <span>1 week ago</span>
                            <span>•</span>
                            <span>8.2 MB</span>
                        </div>
                        <p>Collection of practice problems with solutions for exam preparation.</p>
                        <div class="document-actions">
                            <button>View</button>
                            <button>Download</button>
                        </div>
                    </div>
                    <div class="resource-upload" id="uploadArea">
                        <p>Drag and drop files here to share with the group</p>
                        <button class="btn" style="width: auto; margin-top: 0.5rem;">Browse Files</button>
                    </div>
                `;
                break;
        }
        
        // Re-attach event listeners for any new elements
        setupEventListeners();
    });
});

// Study room selection
const studyRooms = document.querySelectorAll('.study-room');
studyRooms.forEach(room => {
    room.addEventListener('click', function() {
        studyRooms.forEach(r => r.classList.remove('active'));
        this.classList.add('active');
        
        // Show loading effect
        const videoContainer = document.getElementById('videoContainer');
        videoContainer.innerHTML = `
            <div style="display: flex; justify-content: center; align-items: center; height: 100%; grid-column: 1 / -1;">
                <div style="text-align: center;">
                    <div style="font-size: 2rem; margin-bottom: 1rem;">👨‍🎓</div>
                    <h3 style="color: var(--primary-color); margin-bottom: 0.5rem;">Joining ${this.querySelector('.topic').textContent}</h3>
                    <p style="color: #666;">Connecting to study session...</p>
                </div>
            </div>
        `;
        
        // Simulate connection delay
        setTimeout(() => {
            const roomId = this.getAttribute('data-room');
            loadRoomParticipants(roomId);
        }, 1500);
    });
});

// Function to load participants for a room
function loadRoomParticipants(roomId) {
    const videoContainer = document.getElementById('videoContainer');
    videoContainer.innerHTML = '';
    
    // Add local video if camera is enabled
    if (isCameraEnabled && localStream) {
        addLocalVideoStream(localStream);
    } else {
        // Add placeholder for local participant
        const localParticipant = document.createElement('div');
        localParticipant.className = 'video-participant';
        localParticipant.style.border = '2px solid var(--accent-color)';
        localParticipant.style.backgroundColor = isCameraEnabled ? 'var(--dark-color)' : '#666';
        localParticipant.innerHTML = `
            <div class="status"></div>
            <div class="name">You (John)</div>
            ${!isCameraEnabled ? '<div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: white; font-weight: bold;">Camera Off</div>' : ''}
        `;
        videoContainer.appendChild(localParticipant);
    }
    
    // These would normally come from server based on roomId
    const participants = [
        { name: 'Sarah', isCameraOn: true },
        { name: 'Michael', isCameraOn: true },
        { name: 'Emily', isCameraOn: false }
    ];
    
    if (roomId === 'math-group') {
        participants.push({ name: 'David', isCameraOn: true });
    } else if (roomId === 'lit-group') {
        participants.push(
            { name: 'Jessica', isCameraOn: false },
            { name: 'Robert', isCameraOn: true },
            { name: 'Lisa', isCameraOn: true }
        );
    }
    
    participants.forEach(participant => {
        const videoParticipant = document.createElement('div');
        videoParticipant.className = 'video-participant';
        if (participant.isCameraOn) {
            // Simulate remote video stream
            videoParticipant.innerHTML = `
                <video autoplay playsinline style="width: 100%; height: 100%; object-fit: cover;"></video>
                <div class="status"></div>
                <div class="name">${participant.name}</div>
            `;
            
            // In a real app, you would use the actual remote stream here
            // For demo, we'll just show a colored background
            videoParticipant.style.backgroundColor = `hsl(${Math.random() * 360}, 70%, 50%)`;
        } else {
            videoParticipant.style.backgroundColor = '#666';
            videoParticipant.innerHTML = `
                <div class="status"></div>
                <div class="name">${participant.name}</div>
                <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: white; font-weight: bold;">Camera Off</div>
            `;
        }
        videoContainer.appendChild(videoParticipant);
    });
}

// Control buttons functionality
document.getElementById('muteBtn').addEventListener('click', function() {
    if (!localStream) return;
    
    isMicEnabled = !isMicEnabled;
    const audioTracks = localStream.getAudioTracks();
    audioTracks.forEach(track => {
        track.enabled = isMicEnabled;
    });
    
    this.textContent = isMicEnabled ? '🎤' : '🔇';
    this.style.backgroundColor = isMicEnabled ? '#f0f2f5' : '#ffc107';
    this.style.color = isMicEnabled ? 'inherit' : 'white';
    
    // Show notification
    showNotification(isMicEnabled ? 'Microphone unmuted' : 'Microphone muted');
});

document.getElementById('videoBtn').addEventListener('click', function() {
    if (!localStream) return;
    
    isCameraEnabled = !isCameraEnabled;
    const videoTracks = localStream.getVideoTracks();
    videoTracks.forEach(track => {
        track.enabled = isCameraEnabled;
    });
    
    this.textContent = isCameraEnabled ? '📹' : '📷';
    this.style.backgroundColor = isCameraEnabled ? '#f0f2f5' : '#ffc107';
    this.style.color = isCameraEnabled ? 'inherit' : 'white';
    
    // Show notification
    showNotification(isCameraEnabled ? 'Camera turned on' : 'Camera turned off');
    
    // Actually stop or start video tracks to control the camera light
    if (isCameraEnabled) {
        // Restart the camera stream
        navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
            const videoTracks = stream.getVideoTracks();
            if (videoTracks.length > 0) {
                localStream.addTrack(videoTracks[0]);
            }
        }).catch(err => {
            console.error('Failed to re-enable camera:', err);
        });
    } else {
        // Properly stop the video tracks to turn off the camera
        const videoTracks = localStream.getVideoTracks();
        videoTracks.forEach(track => {
            if (track.kind === 'video') {
                track.stop();
                localStream.removeTrack(track);
            }
        });
    }

    // Update local video display
    const videoContainer = document.getElementById('videoContainer');
    const localVideo = videoContainer.querySelector('.video-participant .name:contains("You")')?.parentElement;
    if (localVideo) {
        if (isCameraEnabled) {
            localVideo.style.backgroundColor = '';
            const cameraOffText = localVideo.querySelector('div:not(.name):not(.status)');
            if (cameraOffText) cameraOffText.remove();
        } else {
            localVideo.style.backgroundColor = '#666';
            const existingOffText = localVideo.querySelector('div:not(.name):not(.status)');
            if (!existingOffText) {
                const offText = document.createElement('div');
                offText.style.position = 'absolute';
                offText.style.top = '50%';
                offText.style.left = '50%';
                offText.style.transform = 'translate(-50%, -50%)';
                offText.style.color = 'white';
                offText.style.fontWeight = 'bold';
                offText.textContent = 'Camera Off';
                localVideo.appendChild(offText);
            }
        }
    }
});

document.getElementById('screenBtn').addEventListener('click', async function() {
    try {
        if (this.textContent === '🖥') {
            // Start screen sharing
            const screenStream = await navigator.mediaDevices.getDisplayMedia({
                video: true,
                audio: true
            });
            
            // Show notification
            showNotification('Screen sharing started');
            
            // Add screen share to video container
            const videoContainer = document.getElementById('videoContainer');
            const screenShare = document.createElement('div');
            screenShare.className = 'video-participant';
            screenShare.style.gridColumn = '1 / -1';
            screenShare.style.aspectRatio = '16/9';
            screenShare.innerHTML = `
                <video autoplay playsinline style="width: 100%; height: 100%;"></video>
                <div class="name">Your Screen</div>
            `;
            const screenVideo = screenShare.querySelector('video');
            screenVideo.srcObject = screenStream;
            videoContainer.prepend(screenShare);
            
            // Change button state
            this.textContent = '🛑';
            this.style.backgroundColor = '#ffc107';
            this.style.color = 'white';
            
            // Store reference to remove later
            screenShare.dataset.screenShare = 'true';
            
            // Handle when screen sharing is stopped
            screenStream.getVideoTracks()[0].onended = () => {
                screenShare.remove();
                this.textContent = '🖥';
                this.style.backgroundColor = '#f0f2f5';
                this.style.color = 'inherit';
                showNotification('Screen sharing stopped');
            };
        } else {
            // Stop screen sharing
            const screenShare = document.querySelector('.video-participant[data-screen-share="true"]');
            if (screenShare) {
                const screenStream = screenShare.querySelector('video').srcObject;
                screenStream.getTracks().forEach(track => track.stop());
                screenShare.remove();
            }
            
            this.textContent = '🖥';
            this.style.backgroundColor = '#f0f2f5';
            this.style.color = 'inherit';
            showNotification('Screen sharing stopped');
        }
    } catch (error) {
        console.error('Error sharing screen:', error);
        showNotification('Screen sharing cancelled');
    }
});

document.getElementById('participantsBtn').addEventListener('click', function() {
    document.getElementById('participantsModal').style.display = 'flex';
});

document.getElementById('leaveBtn').addEventListener('click', function() {
    if (confirm('Are you sure you want to leave the study session?')) {
        // Stop all media tracks
        if (localStream) {
            localStream.getTracks().forEach(track => track.stop());
        }
        
        // Stop screen sharing if active
        const screenShare = document.querySelector('.video-participant[data-screen-share="true"]');
        if (screenShare) {
            const screenStream = screenShare.querySelector('video').srcObject;
            screenStream.getTracks().forEach(track => track.stop());
        }
        
        // Show leaving animation
        const videoContainer = document.getElementById('videoContainer');
        videoContainer.innerHTML = `
            <div style="display: flex; justify-content: center; align-items: center; height: 100%; grid-column: 1 / -1;">
                <div style="text-align: center;">
                    <div style="font-size: 2rem; margin-bottom: 1rem;">👋</div>
                    <h3 style="color: var(--primary-color); margin-bottom: 0.5rem;">Leaving Study Session</h3>
                    <p style="color: #666;">Disconnecting...</p>
                </div>
            </div>
        `;
        
        setTimeout(() => {
            // Reset to default state
            loadRoomParticipants('cs-group');
            showNotification('You left the study session');
        }, 1000);
    }
});

// Modal functionality
document.getElementById('createRoomBtn').addEventListener('click', function() {
    document.getElementById('createRoomModal').style.display = 'flex';
});

document.getElementById('closeModal').addEventListener('click', function() {
    document.getElementById('createRoomModal').style.display = 'none';
});

document.getElementById('closeParticipantsModal').addEventListener('click', function() {
    document.getElementById('participantsModal').style.display = 'none';
});

// Close modals when clicking outside
window.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
    }
});

// Room form submission
document.getElementById('roomForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const roomName = document.getElementById('roomName').value;
    const roomTopic = document.getElementById('roomTopic').value;
    const roomPrivacy = document.getElementById('roomPrivacy').value;
    
    if (roomName && roomTopic) {
        // Add new room to sidebar
        const activeRoomsSection = document.querySelector('.sidebar-section:first-child');
        const newRoom = document.createElement('div');
        newRoom.className = 'study-room';
        newRoom.setAttribute('data-room', roomName.toLowerCase().replace(/\s+/g, '-'));
        newRoom.innerHTML = `
            <div class="topic">${roomName}</div>
            <div class="members">${roomPrivacy === 'public' ? 'Public room' : 'Private room'}</div>
        `;
        
        // Add click handler
        newRoom.addEventListener('click', function() {
            document.querySelectorAll('.study-room').forEach(r => r.classList.remove('active'));
            this.classList.add('active');
            loadRoomParticipants(this.getAttribute('data-room'));
        });
        
        activeRoomsSection.appendChild(newRoom);
        
        // Close modal
        document.getElementById('createRoomModal').style.display = 'none';
        
        // Reset form
        this.reset();
        
        // Show notification
        showNotification(`"${roomName}" room created successfully!`);
    }
});

// Upload area hover effect
function setupEventListeners() {
    const uploadArea = document.getElementById('uploadArea');
    if (uploadArea) {
        uploadArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.style.borderColor = 'var(--primary-color)';
            this.style.backgroundColor = 'rgba(74, 111, 165, 0.1)';
        });
        
        uploadArea.addEventListener('dragleave', function() {
            this.style.borderColor = '#ddd';
            this.style.backgroundColor = '';
        });
        
        uploadArea.addEventListener('drop', function(e) {
            e.preventDefault();
            this.style.borderColor = '#ddd';
            this.style.backgroundColor = '';
            
            // Simulate file upload
            if (e.dataTransfer.files.length > 0) {
                const fileName = e.dataTransfer.files[0].name;
                showNotification(`"${fileName}" uploaded successfully!`);
            }
        });
        
        uploadArea.querySelector('button')?.addEventListener('click', function() {
            // Simulate file selection
            showNotification('File browser opened');
        });
    }
}

// Notification function
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.backgroundColor = 'var(--dark-color)';
    notification.style.color = 'white';
    notification.style.padding = '0.8rem 1.5rem';
    notification.style.borderRadius = 'var(--border-radius)';
    notification.style.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.2)';
    notification.style.zIndex = '1000';
    notification.style.animation = 'fadeIn 0.3s ease-out';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'fadeIn 0.3s ease-out reverse forwards';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Network status simulation
function simulateNetworkChanges() {
    const networkStatus = document.querySelector('.network-status');
    const signal = document.querySelector('.signal');
    const statusText = networkStatus.querySelector('span');
    
    const statuses = [
        { class: 'green', text: 'Good connection' },
        { class: 'yellow', text: 'Unstable connection' },
        { class: 'red', text: 'Poor connection' }
    ];
    
    let current = 0;
    
    setInterval(() => {
        current = (current + 1) % statuses.length;
        signal.className = 'signal ' + statuses[current].class;
        statusText.textContent = statuses[current].text;
        
        if (statuses[current].class === 'red') {
            showNotification('Your connection quality has degraded');
        }
    }, 10000);
}

// Feature: Navigation Tab Content Swap
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const section = this.textContent.trim().toLowerCase().replace(/ /g, '-');
        const collabContent = document.getElementById('collabContent');
        if (!collabContent) return;

        switch(section) {
            case 'dashboard':
                collabContent.innerHTML = `
                    <div style="padding: 2rem;">
                        <h2 style="color: var(--primary-color); margin-bottom: 1rem;">📊 Dashboard</h2>
                        <p>Overview of your recent study activity, upcoming sessions, and resource stats.</p>
                    </div>
                `;
                break;
            case 'study-rooms':
                collabContent.innerHTML = `
                    <div style="padding: 2rem;">
                        <h2 style="color: var(--primary-color); margin-bottom: 1rem;">📚 Study Rooms</h2>
                        <p>List and join various active and upcoming study rooms.</p>
                    </div>
                `;
                break;
            case 'resources':
                collabContent.innerHTML = `
                    <div style="padding: 2rem;">
                        <h2 style="color: var(--primary-color); margin-bottom: 1rem;">📁 Resources</h2>
                        <p>Upload, share, and access study materials with your group.</p>
                    </div>
                `;
                break;
            case 'schedule':
                collabContent.innerHTML = `
                    <div style="padding: 2rem;">
                        <h2 style="color: var(--primary-color); margin-bottom: 1rem;">🗓 Weekly Schedule</h2>
                        <p style="margin-bottom: 1rem;">Your upcoming study sessions:</p>
                        <table id="scheduleTable" style="width: 100%; border-collapse: collapse; font-size: 0.95rem;">
                            <thead>
                                <tr style="background-color: var(--primary-color); color: white;">
                                    <th style="padding: 0.5rem; border: 1px solid #ddd;">Day</th>
                                    <th style="padding: 0.5rem; border: 1px solid #ddd;">Time</th>
                                    <th style="padding: 0.5rem; border: 1px solid #ddd;">Session</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td style="padding: 0.5rem; border: 1px solid #ddd;">Monday</td>
                                    <td style="padding: 0.5rem; border: 1px solid #ddd;">10:00 AM</td>
                                    <td style="padding: 0.5rem; border: 1px solid #ddd;">Computer Science Study Group</td>
                                </tr>
                                <tr>
                                    <td style="padding: 0.5rem; border: 1px solid #ddd;">Tuesday</td>
                                    <td style="padding: 0.5rem; border: 1px solid #ddd;">4:00 PM</td>
                                    <td style="padding: 0.5rem; border: 1px solid #ddd;">Mathematics Problem Solving</td>
                                </tr>
                                <tr>
                                    <td style="padding: 0.5rem; border: 1px solid #ddd;">Wednesday</td>
                                    <td style="padding: 0.5rem; border: 1px solid #ddd;">2:00 PM</td>
                                    <td style="padding: 0.5rem; border: 1px solid #ddd;">Physics Study Group</td>
                                </tr>
                                <tr>
                                    <td style="padding: 0.5rem; border: 1px solid #ddd;">Friday</td>
                                    <td style="padding: 0.5rem; border: 1px solid #ddd;">4:30 PM</td>
                                    <td style="padding: 0.5rem; border: 1px solid #ddd;">History Discussion</td>
                                </tr>
                            </tbody>
                        </table>
                        <div style="margin-top: 2rem;">
                            <h3 style="margin-bottom: 0.5rem;">Add New Schedule</h3>
                            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                                <input type="date" id="newDay" style="padding: 0.5rem; border: 1px solid #ccc; border-radius: var(--border-radius); flex: 1;">
                                <input type="time" id="newTime" style="padding: 0.5rem; border: 1px solid #ccc; border-radius: var(--border-radius); flex: 1;">
                                <input type="text" id="newSession" placeholder="Session Name" style="padding: 0.5rem; border: 1px solid #ccc; border-radius: var(--border-radius); flex: 2;">
                                <button class="btn btn-accent" onclick="addScheduleEntry()" style="flex: none;">Add</button>
                            </div>
                        </div>
                    </div>
                `;
                break;
            default:
                collabContent.innerHTML = `
                    <div style="padding: 2rem;">
                        <h2 style="color: var(--primary-color); margin-bottom: 1rem;">👤 Profile</h2>
                        <p>Manage your account, preferences, and activity history.</p>
                    </div>
                `;
        }
    });
});

function addScheduleEntry() {
    const day = document.getElementById('newDay').value.trim();
    const time = document.getElementById('newTime').value.trim();
    const session = document.getElementById('newSession').value.trim();
    if (day && time && session) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td style="padding: 0.5rem; border: 1px solid #ddd;">${day}</td>
            <td style="padding: 0.5rem; border: 1px solid #ddd;">${time}</td>
            <td style="padding: 0.5rem; border: 1px solid #ddd;">${session}</td>
        `;
        document.querySelector('#scheduleTable tbody').appendChild(row);
        document.getElementById('newDay').value = '';
        document.getElementById('newTime').value = '';
        document.getElementById('newSession').value = '';
    } else {
        alert('Please fill in all fields');
    }
}

// Initialize
setupEventListeners();
simulateNetworkChanges();