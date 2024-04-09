#!/bin/bash


echo "Starting Kafka and Zookeeper..."
cd kafka-admin/
docker-compose down
docker-compose up -d
cd ../


echo "Waiting for Kafka to be ready..."
sleep 5


echo "Starting the Node.js monitoring service..."
cd monitor-service
npm run dev

