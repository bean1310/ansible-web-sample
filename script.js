document.addEventListener('DOMContentLoaded', function() {
    // Function to fetch JSON data
    function fetchData() {
        return fetch('data.json')
            .then(response => response.json())
            .catch(error => console.error('Error fetching data:', error));
    }

    // Function to create a summary
    function displaySummary(stats) {
        const summaryContainer = document.getElementById('summary');
        let totalOk = 0;
        let totalChanged = 0;
        let totalFailed = 0;
        let totalSkipped = 0;

        Object.keys(stats).forEach(host => {
            totalOk += stats[host].ok;
            totalChanged += stats[host].changed;
            totalFailed += stats[host].failed;
            totalSkipped += stats[host].skipped;
        });

        const summaryText = `Summary: OK=${totalOk}, Changed=${totalChanged}, Failed=${totalFailed}, Skipped=${totalSkipped}.`;

        summaryContainer.textContent = summaryText;

        if (totalFailed > 0) {
            summaryContainer.style.color = 'red';
        } else {
            summaryContainer.style.color = 'green';
        }
    }

    // Function to create a list of hosts
    function displayHosts(tasks) {
        const hostsContainer = document.getElementById('hosts');
        hostsContainer.innerHTML = ''; // Clear existing content

        const hostsData = {};

        // Aggregate tasks for each host
        tasks.forEach(task => {
            Object.keys(task.hosts).forEach(host => {
                if (!hostsData[host]) {
                    hostsData[host] = [];
                }
                hostsData[host].push({
                    taskName: task.name,
                    ...task.hosts[host]
                });
            });
        });

        // Create host sections
        Object.keys(hostsData).forEach(host => {
            const hostSection = document.createElement('div');
            hostSection.className = 'host-section';

            const hostName = document.createElement('p');
            hostName.className = 'host-name';

            const statusIcon = document.createElement('span');
            statusIcon.className = 'status-icon';
            const allTasksFailed = hostsData[host].some(detail => detail.failed);
            statusIcon.textContent = allTasksFailed ? '❌' : '✅';

            hostName.appendChild(statusIcon);
            hostName.appendChild(document.createTextNode(host));
            hostSection.appendChild(hostName);

            const detailsContainer = document.createElement('div');
            detailsContainer.className = 'details';

            hostsData[host].forEach(detail => {
                const detailItem = document.createElement('div');
                detailItem.innerHTML = `<strong>${detail.taskName}</strong>: ${detail.failed ? 'Failed' : (detail.ok ? 'OK' : 'Changed')}, ${detail.msg || 'Path: ' + detail.path}`;
                detailsContainer.appendChild(detailItem);
            });

            hostSection.appendChild(detailsContainer);
            hostsContainer.appendChild(hostSection);

            // Add click event to toggle details
            hostName.addEventListener('click', () => {
                detailsContainer.style.display = detailsContainer.style.display === 'none' ? 'block' : 'none';
            });
        });

        // Filter hosts based on the current view
        filterHosts();
    }

    // Function to filter hosts based on the current view
    function filterHosts() {
        const allHostSections = document.querySelectorAll('.host-section');
        allHostSections.forEach(section => {
            const statusIcon = section.querySelector('.status-icon').textContent;
            if (showFailuresOnly && statusIcon === '✅') {
                section.style.display = 'none';
            } else {
                section.style.display = 'block';
            }
        });
    }

    // Function to create a list from stats
    function displayStats(stats) {
        const statsContainer = document.getElementById('stats');
        Object.keys(stats).forEach(host => {
            const statsItem = document.createElement('div');
            statsItem.className = 'stats-item';
            statsItem.innerHTML = `<span class="material-icons">info</span><span class="host-name">${host}</span>: OK=${stats[host].ok}, Changed=${stats[host].changed}, Failed=${stats[host].failed}, Skipped=${stats[host].skipped}`;
            statsContainer.appendChild(statsItem);
        });
    }

    // Fetch JSON data and display
    fetchData().then(jsonData => {
        // Display the summary, hosts, and stats
        displaySummary(jsonData.stats);
        jsonData.plays.forEach(play => {
            displayHosts(play.tasks);
        });
        displayStats(jsonData.stats);

        // Button event listeners
        document.getElementById('showAll').addEventListener('click', () => {
            showFailuresOnly = false;
            document.getElementById('showAll').classList.add('active');
            document.getElementById('showFailures').classList.remove('active');
            filterHosts();
        });

        document.getElementById('showFailures').addEventListener('click', () => {
            showFailuresOnly = true;
            document.getElementById('showFailures').classList.add('active');
            document.getElementById('showAll').classList.remove('active');
            filterHosts();
        });
    });
});
