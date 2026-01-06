from aiokafka import AIOKafkaConsumer
import asyncio
import json
from app.services.city_manager import city_manager
from app.schemas import LogEvent

KAFKA_BOOTSTRAP_SERVERS = "redpanda:9092" # Or whatever your internal docker address is, likely redpanda:9092 or localhost:9092 depending on context. docker-compose usually handles 'redpanda'
TOPIC = "observability.logs.raw.v1"
# For local dev running outside docker, it might be localhost:9092.
# Since this is running in backend service, we'll try to find the right config or assume env var. 
# But for now let's stick to what was likely intended or standard.
# If running locally (not in docker), it needs localhost. 
# If running in docker, it needs service name.
# Let's assume we might be running locally for now based on typical user flow unless "docker compose up" implies full stack content. 
# User asked for "backend" folder, implying we might run it from there. 
# Let's try "localhost:9092" as default for simplicity IF running locally, but "redpanda:9092" if inside.
# Given the user wants to run "docker compose up" for infra and then run agent, 
# and potentially run the backend? 
# The user didn't specify backend running mode (Docker vs Local). 
# But usually python dev implies local.
# Let's default to localhost:9092 for the consumer if running locally.

async def consume_logs():
    print("Starting Kafka Consumer...")
    # NOTE: If running inside Docker, this needs to be 'redpanda:9092'
    # If running locally on host, 'localhost:9092'
    consumer = AIOKafkaConsumer(
        TOPIC,
        bootstrap_servers='localhost:9092', 
        group_id="city-builder-v1"
    )
    # We might want a retry loop here or fallback
    try:
        await consumer.start()
        print("Kafka Consumer Connected")
        try:
            async for msg in consumer:
                try:
                    data = json.loads(msg.value)
                    # Mapping raw log to LogEvent if needed, or direct parse
                    # The agent sends LogEvent json structure.
                    # We need to adapt it to our new LogEvent with severity if it's missing or different.
                    # Agent sends: source_service, target_service, timestamp (datetime), metric_value, event_type
                    # Our new LogEvent expects: service_name... timestamp (float)
                    
                    # Adapter logic:
                    log_event = LogEvent(
                        service_name=data.get("source_service", "unknown"),
                        timestamp=time.time(), # Use current time for simplicity or parse data['timestamp']
                        severity=data.get("event_type", "INFO") if data.get("event_type") in ["INFO", "WARNING", "ERROR"] else "INFO",
                        # We might need to map EventType.ERROR to Severity.ERROR
                    )
                    
                    if data.get("event_type") == "ERROR":
                        log_event.severity = "ERROR"
                    
                    await city_manager.ingest(log_event)
                except Exception as e:
                    print(f"Error processing message: {e}")
        finally:
            await consumer.stop()
    except Exception as e:
        print(f"Failed to start consumer (Is Redpanda up?): {e}")

import time
