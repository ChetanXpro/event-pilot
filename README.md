# EventPilot

EventPilot is a dynamic platform designed for real-time monitoring and analysis of service events. Utilizing Kafka for event handling and MongoDB for data storage, the architecture allows seamless integration of new monitoring services through a base abstract class.

## Key Components

- **Monitor Service**: Efficiently captures and processes events using a scalable Kafka setup.
- **Kafka Admin**: Manages Kafka configurations, including server startups and topic creation.
- **Login Failure Monitoring**: Analyzes login attempts, calculates failure rates, and triggers alerts if thresholds are exceeded.

## Architecture Overview

The system's modular architecture enables easy expansion. Services extending the `BaseMonitoringService` abstract class inherit methods for connecting to Kafka, subscribing to topics, and processing messages.

### BaseMonitoringService

Serves as the backbone for all monitoring services, providing essential functionalities such as:
- Kafka connection and subscription management.
- MongoDB integration for data persistence.
- Abstract `processMessage` method to be implemented by each service for specific logic.

### LoginFailureMonitoringService

This service monitors login attempts, evaluating and responding to login failures. It exemplifies how to implement specific logic on top of the `BaseMonitoringService`.

## Getting Started

### Prerequisites

- Node.js
- Docker
- Kafka (set up via Docker-compose)

### Setup and Running

You can start the services either manually or by using the provided shell script.

#### Using the Shell Script

In the root directory, execute the `start-dev.sh` script:

```bash
./start-dev.sh
```
This script automates the following tasks:
- Starts Kafka and Zookeeper using Docker.
- Waits for Kafka to be ready.
- Starts the Node.js monitoring service.

#### Manual Setup

Kafka Setup

Navigate to the kafka-admin directory and run:

```bash
docker-compose up -d
```

Start Monitor Service

From the monitor-service directory:

```bash
npm install
npm run dev
```

### Usage
Once the services are operational, the system will actively monitor specified events. Results are logged and stored, with alerts based on predefined conditions.

### Alerts

- Alerts can be configured to be sent through different channels such as Slack or Discord, depending on the severity and type of event detected. Ensure your alert channels are properly configured in the `BaseMonitoringService` for effective notifications.



### Extending the System
To add a new monitoring service:

1. Extend the BaseMonitoringService class.
2. Implement the processMessage method with your custom logic.
3. Configure Kafka topics as needed.

Example template for a new service:

```javascript
import BaseMonitoringService from './BaseMonitoringService';

class CustomMonitoringService extends BaseMonitoringService {
    protected processMessage(payload) {
        // Insert custom processing logic here.
    }
}


```

### Contributing

Contributions are welcome! Please fork the repository and submit pull requests with your enhancements or fixes.


