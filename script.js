document.addEventListener('DOMContentLoaded', function() {
    // Sample JSON data
    const jsonData = {
        "plays": [
            {
                "name": "Sample Playbook for Multiple Hosts",
                "hosts": [
                    "host1",
                    "host2",
                    "host3",
                    "host4",
                    "host5"
                ],
                "tasks": [
                    {
                        "name": "Print a message",
                        "hosts": {
                            "host1": {
                                "ok": true,
                                "msg": "Hello from host1!"
                            },
                            "host2": {
                                "ok": true,
                                "msg": "Hello from host2!"
                            },
                            "host3": {
                                "ok": true,
                                "msg": "Hello from host3!"
                            },
                            "host4": {
                                "ok": true,
                                "msg": "Hello from host4!"
                            },
                            "host5": {
                                "ok": true,
                                "msg": "Hello from host5!"
                            }
                        }
                    },
                    {
                        "name": "Create a file",
                        "hosts": {
                            "host1": {
                                "changed": true,
                                "path": "/tmp/sample_file_host1.txt"
                            },
                            "host2": {
                                "changed": true,
                                "path": "/tmp/sample_file_host2.txt"
                            },
                            "host3": {
                                "changed": true,
                                "path": "/tmp/sample_file_host3.txt"
                            },
                            "host4": {
                                "changed": true,
                                "path": "/tmp/sample_file_host4.txt"
                            },
                            "host5": {
                                "changed": true,
                                "path": "/tmp/sample_file_host5.txt"
                            }
                        }
                    }
                ]
            }
        ],
        "stats": {
            "host1": {
                "ok": 1,
                "changed": 1,
                "failed": 0,
                "skipped": 0
            },
            "host2": {
                "ok": 1,
                "changed": 1,
                "failed": 0,
                "skipped": 0
            },
            "host3": {
                "ok": 1,
                "changed": 1,
                "failed": 0,
                "skipped": 0
            },
            "host4": {
                "ok": 1,
                "changed": 1,
                "failed": 0,
                "skipped": 0
            },
            "host5": {
                "ok": 1,
                "changed": 1,
                "failed": 0,
                "skipped": 0
            }
        }
    };

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
            hostName.textContent = host;
            hostSection.appendChild(hostName);

            const detailsContainer = document.createElement('div');
            detailsContainer.className = 'details';

            hostsData[host].forEach(detail => {
                const detailItem = document.createElement('div');
                detailItem.innerHTML = `<strong>${detail.taskName}</strong>: ${detail.ok ? 'OK' : 'Failed'}, ${detail.msg || 'Path: ' + detail.path}`;
                detailsContainer.appendChild(detailItem);
            });

            hostSection.appendChild(detailsContainer);
            hostsContainer.appendChild(hostSection);

            // Add click event to toggle details
            hostName.addEventListener('click', () => {
                detailsContainer.style.display = detailsContainer.style.display === 'none' ? 'block' : 'none';
            });
        });
    }

    // Function to create a list from stats
    function displayStats(stats) {
        const statsContainer = document.getElementById('stats');
        Object.keys(stats).forEach(host => {
            const statsItem = document.createElement('div');
            statsItem.className = 'stats-item';
            statsItem.innerHTML = `<span class="host-name">${host}</span>: OK=${stats[host].ok}, Changed=${stats[host].changed}, Failed=${stats[host].failed}, Skipped=${stats[host].skipped}`;
            statsContainer.appendChild(statsItem);
        });
    }

    // Display the summary, hosts, and stats
    displaySummary(jsonData.stats);
    jsonData.plays.forEach(play => {
        displayHosts(play.tasks);
    });
    displayStats(jsonData.stats);
});
