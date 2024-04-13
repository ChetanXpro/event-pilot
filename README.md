# Realtime Monitoring Service

The Realtime Monitoring Service is an adaptable platform designed for real-time monitoring and analysis of various service events. Utilizing Kafka for event handling and MongoDB for data storage, the architecture supports seamless addition of new monitoring services through a base abstract class.

## Key Components

- **Monitor Service**: Captures and processes events, utilizing a scalable Kafka setup.
- **Kafka Admin**: Manages Kafka configuration including server startup and topic creation.
- **Login Failure Monitoring**: Monitors and analyzes login attempts, calculates failure rates, and triggers alerts if thresholds are exceeded.

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

## Usage

Once the services are operational, the system will actively monitor specified events. Results are logged and stored, with alerts based on predefined conditions.

To access and interact with the system:

1. **Admin Dashboard**:
   - Visit `http://localhost:3000` to access the ReactJS-based admin dashboard.
   - The dashboard displays real-time visualizations of the data, including login attempts and failure rates.

2. **Monitoring Service Logs**:
   - Monitor the console logs from the `monitor-service` to see real-time processing details and debug information.

3. **Kafka Administration**:
   - Use Kafka tooling to manage topics and view message streams to ensure that events are being properly captured and streamed.

### Example Usage Scenario

- **Monitoring Login Attempts**:
  - As the system processes login events, you will see updates on the dashboard reflecting the number of attempts and failure rates.
  - If the failure rate exceeds the threshold set in `LoginFailureMonitoringService`, an alert will be sent out and displayed or logged according to the configured response in the service.

### Alerts

- Alerts can be configured to be sent through different channels such as Slack or Discord, depending on the severity and type of event detected. Ensure your alert channels are properly configured in the `BaseMonitoringService` for effective notifications.
